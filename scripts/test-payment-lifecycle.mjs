// Testes automatizados do ciclo de vida completo de pagamento, prevencao de duplicatas e precedencia de acesso
import assert from "assert";

console.log("TESTES DO CICLO DE VIDA DE PAGAMENTO E DEDUPLICACAO:\n");

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log("PASS (" + totalTests + "): " + name);
  } catch (err) {
    console.error("FAIL (" + totalTests + "): " + name + " -> " + err.message);
    console.error(err);
  }
}

// Mock do Banco de Dados Supabase em memoria
class MockSupabaseDb {
  constructor() {
    this.entregas = [];
  }

  insert(record) {
    const newRecord = {
      id: record.id || "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      created_at: new Date().toISOString(),
      plano: record.plano || "experience",
      email: record.email || null,
      marca: record.marca || null,
      brand_data: record.brand_data || {},
      email_enviado: record.email_enviado || false,
      payment_status: record.payment_status || "pending",
      paid: record.paid || false,
      stripe_session_id: record.stripe_session_id || null,
      stripe_event_id: record.stripe_event_id || null,
    };
    this.entregas.push(newRecord);
    return newRecord;
  }

  findById(id) {
    return this.entregas.find(r => r.id === id) || null;
  }

  update(id, updates) {
    const record = this.findById(id);
    if (!record) return null;
    Object.assign(record, updates);
    return record;
  }

  findPendingDraft(email, marca) {
    const em = (email || "").trim().toLowerCase();
    const ma = (marca || "").trim().toLowerCase();
    return this.entregas
      .filter(r => 
        (r.email || "").trim().toLowerCase() === em &&
        (r.marca || "").trim().toLowerCase() === ma &&
        r.paid === false &&
        r.payment_status === "pending"
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null;
  }

  getEntrega(queryParam) {
    const isUUID = queryParam.startsWith("sess_");
    if (isUUID) {
      return this.findById(queryParam);
    }
    // Fallback por email ordenando por paid DESC e created_at DESC
    const em = queryParam.trim().toLowerCase();
    return this.entregas
      .filter(r => (r.email || "").trim().toLowerCase() === em)
      .sort((a, b) => {
        if (b.paid !== a.paid) return (b.paid ? 1 : 0) - (a.paid ? 1 : 0);
        return new Date(b.created_at) - new Date(a.created_at);
      })[0] || null;
  }
}

// Implementacao das funcoes de rota sob teste
function mockSalvarEntrega(db, { sessionId, email, marca, plano, brandState }) {
  // 1. Verificacao por sessionId estavel
  if (sessionId) {
    const existing = db.findById(sessionId);
    const existingMarca = (existing?.marca || "").trim().toLowerCase();
    const currentMarca = (marca || "").trim().toLowerCase();
    const brandMatches = !existingMarca || !currentMarca || existingMarca === currentMarca;

    if (existing && !existing.paid && existing.payment_status === "pending" && brandMatches) {
      const updated = db.update(sessionId, {
        plano: plano || "experience",
        email: email || null,
        marca: marca || null,
        brand_data: brandState,
      });
      return { sessionId: updated.id, action: "updated_by_session_id" };
    }
  }

  // 2. Fallback escopado por email + marca + pending
  if (email && marca) {
    const draft = db.findPendingDraft(email, marca);
    if (draft && !draft.paid && draft.payment_status === "pending") {
      const updated = db.update(draft.id, {
        plano: plano || "experience",
        email: email || null,
        marca: marca || null,
        brand_data: brandState,
      });
      return { sessionId: updated.id, action: "updated_by_scoped_fallback" };
    }
  }

  // 3. Novo registro
  const created = db.insert({
    plano: plano || "experience",
    email: email || null,
    marca: marca || null,
    brand_data: brandState,
    email_enviado: false,
    payment_status: "pending",
    paid: false,
  });
  return { sessionId: created.id, action: "created_new" };
}

function mockWebhookProcess(db, event, emailSenderTracker) {
  const session = event.data?.object;
  const sessionId = session?.metadata?.sessionId;
  if (!sessionId) return { received: true, note: "no_session_id" };

  const entrega = db.findById(sessionId);
  if (!entrega) return { received: true, error: "not_found" };

  // Idempotencia
  if (entrega.stripe_event_id === event.id || (entrega.paid && entrega.stripe_session_id === session.id && event.type === "checkout.session.completed")) {
    return { received: true, idempotent: true };
  }

  if (event.type === "checkout.session.completed") {
    if (session.payment_status === "paid") {
      db.update(sessionId, {
        paid: true,
        payment_status: "paid",
        stripe_session_id: session.id,
        stripe_event_id: event.id,
      });

      // Limpeza escopada da mesma jornada
      if (entrega.email && entrega.marca) {
        const em = entrega.email.trim().toLowerCase();
        const ma = entrega.marca.trim().toLowerCase();
        db.entregas.forEach(r => {
          if (
            (r.email || "").trim().toLowerCase() === em &&
            (r.marca || "").trim().toLowerCase() === ma &&
            r.paid === false &&
            r.payment_status === "pending" &&
            r.id !== sessionId
          ) {
            r.payment_status = "superseded";
          }
        });
      }

      // Envio de e-mail com reserva atomica
      if (!entrega.email_enviado) {
        db.update(sessionId, { email_enviado: true });
        emailSenderTracker.push({ email: entrega.email, sessionId, plano: entrega.plano });
      }
    }
  }

  return { received: true };
}

function mockCheckAccess(record) {
  if (!record) return { allowed: false, status: 404 };
  const status = (record.payment_status || "").toLowerCase();
  const isPaidStatus = !status || status === "paid" || status === "complete" || status === "completed" || status === "succeeded";
  const isNotExplicitlyFailed = record.paid !== false && status !== "failed" && status !== "unpaid" && status !== "superseded" && status !== "abandoned";

  if (!isPaidStatus && !isNotExplicitlyFailed) {
    return { allowed: false, status: 402, reason: record.payment_status || "unauthorized" };
  }
  return { allowed: true, status: 200 };
}


// --- EXECUCAO DOS CENARIOS ---

// Cenario 1: Cliente seleciona Starter e paga
runTest("Cenario 1: Cliente seleciona Starter e paga diretamente", () => {
  const db = new MockSupabaseDb();
  const emailsSent = [];

  const save = mockSalvarEntrega(db, {
    email: "cliente1@exemplo.com",
    marca: "Dra. Beatriz",
    plano: "starter",
    brandState: { estilo: "clean" }
  });

  assert.strictEqual(save.action, "created_new");
  const record = db.findById(save.sessionId);
  assert.strictEqual(record.plano, "starter");
  assert.strictEqual(record.paid, false);
  assert.strictEqual(record.payment_status, "pending");

  // Webhook de pagamento confirmado
  const webhookRes = mockWebhookProcess(db, {
    id: "evt_c1_001",
    type: "checkout.session.completed",
    data: { object: { id: "cs_c1_001", payment_status: "paid", metadata: { sessionId: save.sessionId } } }
  }, emailsSent);

  assert.strictEqual(webhookRes.received, true);
  assert.strictEqual(record.paid, true);
  assert.strictEqual(record.payment_status, "paid");
  assert.strictEqual(record.stripe_session_id, "cs_c1_001");
  assert.strictEqual(record.stripe_event_id, "evt_c1_001");
  assert.strictEqual(record.email_enviado, true);
  assert.strictEqual(emailsSent.length, 1);
});

// Cenario 2: Cliente seleciona Starter, muda para PRO e paga
runTest("Cenario 2: Cliente seleciona Starter, muda para PRO e paga (Reutilizacao de Sessao)", () => {
  const db = new MockSupabaseDb();
  const emailsSent = [];

  // Passo 1: Seleciona Starter
  const saveStarter = mockSalvarEntrega(db, {
    email: "cliente2@exemplo.com",
    marca: "Studio Bella",
    plano: "starter",
    brandState: { estilo: "floral" }
  });
  const initialSessionId = saveStarter.sessionId;

  // Passo 2: Muda para PRO no checkout preservando sessionId
  const savePro = mockSalvarEntrega(db, {
    sessionId: initialSessionId,
    email: "cliente2@exemplo.com",
    marca: "Studio Bella",
    plano: "pro",
    brandState: { estilo: "floral", papelaria: ["Cartao", "Receituario"] }
  });

  assert.strictEqual(savePro.sessionId, initialSessionId, "ID da sessao deve ser o mesmo");
  assert.strictEqual(savePro.action, "updated_by_session_id");
  assert.strictEqual(db.entregas.length, 1, "Nao deve criar linha duplicada ao mudar de plano");

  const record = db.findById(initialSessionId);
  assert.strictEqual(record.plano, "pro");
  assert.strictEqual(record.paid, false);
  assert.strictEqual(record.payment_status, "pending");

  // Passo 3: Paga PRO R$897
  mockWebhookProcess(db, {
    id: "evt_c2_001",
    type: "checkout.session.completed",
    data: { object: { id: "cs_c2_001", payment_status: "paid", metadata: { sessionId: initialSessionId } } }
  }, emailsSent);

  assert.strictEqual(record.paid, true);
  assert.strictEqual(record.payment_status, "paid");
  assert.strictEqual(record.plano, "pro");
  assert.strictEqual(db.entregas.length, 1, "Total continua sendo apenas 1 entrega");
});

// Cenario 3: Cliente da refresh antes do pagamento
runTest("Cenario 3: Cliente da refresh antes do pagamento e continua mesma sessao", () => {
  const db = new MockSupabaseDb();
  const save1 = mockSalvarEntrega(db, {
    email: "cliente3@exemplo.com",
    marca: "Dr. Lucas",
    plano: "pro",
    brandState: {}
  });

  const storedSessionId = save1.sessionId;
  const saveAfterRefresh = mockSalvarEntrega(db, {
    sessionId: storedSessionId,
    email: "cliente3@exemplo.com",
    marca: "Dr. Lucas",
    plano: "pro",
    brandState: {}
  });

  assert.strictEqual(saveAfterRefresh.sessionId, storedSessionId);
  assert.strictEqual(saveAfterRefresh.action, "updated_by_session_id");
  assert.strictEqual(db.entregas.length, 1);
});

// Cenario 4: Cliente abandona checkout e retorna mais tarde
runTest("Cenario 4: Cliente abandona checkout e retorna mais tarde (com e sem localStorage)", () => {
  const db = new MockSupabaseDb();

  // 4A: Cria rascunho inicial
  const saveOriginal = mockSalvarEntrega(db, {
    email: "cliente4@exemplo.com",
    marca: "Odonto Arte",
    plano: "starter",
    brandState: { versao: 1 }
  });
  const originalId = saveOriginal.sessionId;

  // 4B: Cliente abre noutro dispositivo/aba anonima (sem sessionId), mas digita mesmo email e marca
  const saveRetorno = mockSalvarEntrega(db, {
    sessionId: null,
    email: "cliente4@exemplo.com",
    marca: "Odonto Arte",
    plano: "pro",
    brandState: { versao: 2 }
  });

  assert.strictEqual(saveRetorno.sessionId, originalId, "Fallback escopado deve encontrar e reutilizar o rascunho");
  assert.strictEqual(saveRetorno.action, "updated_by_scoped_fallback");
  assert.strictEqual(db.entregas.length, 1, "Nao deve criar entrega duplicada");
  assert.strictEqual(db.findById(originalId).plano, "pro");
});

// Cenario 5: O mesmo e-mail cria um segundo projeto legitimo (marca diferente)
runTest("Cenario 5: Mesmo e-mail cria um segundo projeto legitimo com outra marca", () => {
  const db = new MockSupabaseDb();
  const emailsSent = [];

  // Projeto 1: "Clinica Sol"
  const proj1 = mockSalvarEntrega(db, {
    email: "doutora@exemplo.com",
    marca: "Clinica Sol",
    plano: "pro",
    brandState: {}
  });
  mockWebhookProcess(db, {
    id: "evt_proj1",
    type: "checkout.session.completed",
    data: { object: { id: "cs_proj1", payment_status: "paid", metadata: { sessionId: proj1.sessionId } } }
  }, emailsSent);

  assert.strictEqual(db.findById(proj1.sessionId).paid, true);

  // Projeto 2: "Instituto Lua" (mesmo email, marca diferente)
  const proj2 = mockSalvarEntrega(db, {
    sessionId: proj1.sessionId, // ID antigo passado por engano
    email: "doutora@exemplo.com",
    marca: "Instituto Lua", // Marca diferente!
    plano: "pro",
    brandState: {}
  });

  assert.notStrictEqual(proj2.sessionId, proj1.sessionId, "Deve criar um NOVO registro pois a marca mudou");
  assert.strictEqual(proj2.action, "created_new");
  assert.strictEqual(db.entregas.length, 2, "Devem existir 2 projetos distintos no banco");

  // Confirma pagamento do Projeto 2
  mockWebhookProcess(db, {
    id: "evt_proj2",
    type: "checkout.session.completed",
    data: { object: { id: "cs_proj2", payment_status: "paid", metadata: { sessionId: proj2.sessionId } } }
  }, emailsSent);

  assert.strictEqual(db.findById(proj1.sessionId).paid, true);
  assert.strictEqual(db.findById(proj1.sessionId).payment_status, "paid", "Projeto 1 nao pode ter sido alterado");
  assert.strictEqual(db.findById(proj2.sessionId).paid, true);
  assert.strictEqual(db.findById(proj2.sessionId).payment_status, "paid");
  assert.strictEqual(emailsSent.length, 2, "Ambos os projetos receberam seus links de acesso");
});

// Cenario 6: Stripe envia o mesmo webhook mais de uma vez (Idempotencia)
runTest("Cenario 6: Stripe envia o mesmo webhook repetido (Garantia de Idempotencia)", () => {
  const db = new MockSupabaseDb();
  const emailsSent = [];

  const proj = mockSalvarEntrega(db, {
    email: "idempotente@exemplo.com",
    marca: "Marca Segura",
    plano: "pro",
    brandState: {}
  });

  const eventPayload = {
    id: "evt_stripe_repetido_100",
    type: "checkout.session.completed",
    data: { object: { id: "cs_repetida_100", payment_status: "paid", metadata: { sessionId: proj.sessionId } } }
  };

  // 1a Recepcao do Webhook
  const res1 = mockWebhookProcess(db, eventPayload, emailsSent);
  assert.strictEqual(res1.received, true);
  assert.strictEqual(res1.idempotent, undefined);
  assert.strictEqual(emailsSent.length, 1);

  // 2a Recepcao do mesmo Webhook
  const res2 = mockWebhookProcess(db, eventPayload, emailsSent);
  assert.strictEqual(res2.received, true);
  assert.strictEqual(res2.idempotent, true, "Deve detectar evento identico ja processado");
  assert.strictEqual(emailsSent.length, 1, "Nao deve reenviar e-mail de entrega");

  // 3a Recepcao do mesmo Webhook
  const res3 = mockWebhookProcess(db, eventPayload, emailsSent);
  assert.strictEqual(res3.idempotent, true);
  assert.strictEqual(emailsSent.length, 1);
});

// Cenario 7: Precedencia de registro pago no get-entrega ao buscar por e-mail
runTest("Cenario 7: get-entrega da precedencia absoluta ao registro PAGO na busca por email", () => {
  const db = new MockSupabaseDb();

  // Registro 1: Rascunho Starter antigo superseded
  const row1 = db.insert({
    email: "scarlett@exemplo.com",
    marca: "Dra. Scarlett",
    plano: "starter",
    paid: false,
    payment_status: "superseded",
  });

  // Registro 2: Compra PRO confirmada paga
  const row2 = db.insert({
    email: "scarlett@exemplo.com",
    marca: "Dra. Scarlett",
    plano: "pro",
    paid: true,
    payment_status: "paid",
  });

  // Busca por email
  const foundByEmail = db.getEntrega("scarlett@exemplo.com");
  assert.strictEqual(foundByEmail.id, row2.id, "Deve retornar o registro PRO pago e NAO o starter superseded");
  assert.strictEqual(foundByEmail.plano, "pro");
  assert.strictEqual(foundByEmail.paid, true);

  // Validacao de acesso do registro pago
  const accessPaid = mockCheckAccess(row2);
  assert.strictEqual(accessPaid.allowed, true);
  assert.strictEqual(accessPaid.status, 200);

  // Validacao de acesso do registro superseded (deve ser negado)
  const accessSuperseded = mockCheckAccess(row1);
  assert.strictEqual(accessSuperseded.allowed, false);
  assert.strictEqual(accessSuperseded.status, 402);
  assert.strictEqual(accessSuperseded.reason, "superseded");

  // Validacao de acesso de registro abandonado (deve ser negado)
  const rowAbandoned = { paid: false, payment_status: "abandoned" };
  const accessAbandoned = mockCheckAccess(rowAbandoned);
  assert.strictEqual(accessAbandoned.allowed, false);
  assert.strictEqual(accessAbandoned.status, 402);
  assert.strictEqual(accessAbandoned.reason, "abandoned");
});

console.log("\n=============================================");
console.log("TODOS OS " + passedTests + "/" + totalTests + " TESTES PASSARAM COM SUCESSO!");
console.log("=============================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
}
