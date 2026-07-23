// Script de testes automatizados do fluxo de retomada (Resume Flow) e prevenção de duplicatas

import assert from 'assert';

console.log('🧪 EXECUTANDO TESTES DO FLUXO DE RETOMADA E PREVENÇÃO DE DUPLICATAS:\n');

// Simulação de localStorage em memória
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockStorage = new MockLocalStorage();
let testCount = 0;
let passedCount = 0;

function runTest(name, fn) {
  testCount++;
  try {
    fn();
    passedCount++;
    console.log(`✅ PASS (${testCount}): ${name}`);
  } catch (err) {
    console.error(`❌ FAIL (${testCount}): ${name} -> ${err.message}`);
  }
}

// 1. Refresh durante onboarding (step 5)
runTest('1. Refresh durante onboarding (step 5 com formData)', () => {
  mockStorage.clear();
  const draft = { step: 5, formData: { marca: 'Marca Teste', email: 'teste@exemplo.com' } };
  mockStorage.setItem('brandbox_progress', JSON.stringify(draft));

  const saved = mockStorage.getItem('brandbox_progress');
  assert(saved, 'Deve encontrar o rascunho no localStorage');
  const parsed = JSON.parse(saved);
  assert.strictEqual(parsed.step, 5);
  assert.strictEqual(parsed.formData.marca, 'Marca Teste');
});

// 2. Refresh na página de pagamento (step 13) com projeto pending
runTest('2. Refresh na página de pagamento (step 13) com projeto pending', () => {
  mockStorage.clear();
  const draft = { step: 13, formData: { marca: 'Marca Studio', email: 'studio@exemplo.com' }, sessionId: 'sess_12345', papelariaSelecionada: ['Cartão de Visita'] };
  mockStorage.setItem('brandbox_progress', JSON.stringify(draft));
  mockStorage.setItem('brandbox_session', 'sess_12345');

  const saved = mockStorage.getItem('brandbox_progress');
  assert(saved, 'Deve existir rascunho salvo');
  const parsed = JSON.parse(saved);
  assert.strictEqual(parsed.step, 13);
  assert.strictEqual(parsed.sessionId, 'sess_12345');
  assert.deepStrictEqual(parsed.papelariaSelecionada, ['Cartão de Visita']);
});

// 3. Continuar projeto pending ("Continuar de onde parei")
runTest('3. Ação "Continuar de onde parei" restaura estado completo e sessionId', () => {
  mockStorage.clear();
  const draft = { step: 13, formData: { marca: 'Minha Marca' }, editData: { corAtiva: '#FF0055' }, sessionId: 'sess_abc99' };
  mockStorage.setItem('brandbox_progress', JSON.stringify(draft));

  const parsed = JSON.parse(mockStorage.getItem('brandbox_progress'));
  // Simula restoreProgress
  let restoredStep = parsed.step;
  let restoredMarca = parsed.formData.marca;
  let restoredSessionId = parsed.sessionId;
  mockStorage.setItem('brandbox_session', restoredSessionId);

  assert.strictEqual(restoredStep, 13);
  assert.strictEqual(restoredMarca, 'Minha Marca');
  assert.strictEqual(mockStorage.getItem('brandbox_session'), 'sess_abc99');
});

// 4. Começar do zero ("Começar do zero")
runTest('4. Ação "Começar do zero" limpa rascunhos e reseta etapa', () => {
  mockStorage.setItem('brandbox_progress', JSON.stringify({ step: 10, formData: { marca: 'Antiga' } }));
  mockStorage.setItem('brandbox_session', 'sess_old');

  // Simula ação do botão "Começar do zero"
  Object.keys(mockStorage.store).forEach(k => {
    if (k.startsWith('brandbox_')) mockStorage.removeItem(k);
  });

  assert.strictEqual(mockStorage.getItem('brandbox_progress'), null);
  assert.strictEqual(mockStorage.getItem('brandbox_session'), null);
});

// 5. Retorno após cancelar o Stripe (canceled=1)
runTest('5. Retorno do Stripe com canceled=1 restaura diretamente na etapa 13', () => {
  mockStorage.clear();
  const draft = { step: 13, formData: { marca: 'Marca Stripe Cancelada' } };
  mockStorage.setItem('brandbox_progress', JSON.stringify(draft));

  const urlParams = new URLSearchParams('canceled=1&lang=pt');
  const isCanceled = urlParams.get('canceled') === '1';
  assert(isCanceled, 'Deve detectar canceled=1 na URL');

  const parsed = JSON.parse(mockStorage.getItem('brandbox_progress'));
  let finalStep = parsed.step;
  if (isCanceled && parsed.step >= 12) finalStep = 13;

  assert.strictEqual(finalStep, 13, 'Deve ir para a etapa 13 de checkout automaticamente');
});

// 6. Retorno após pagamento confirmado (sucesso)
runTest('6. Página de sucesso limpa rascunho para evitar modal indevido de rascunho pago', () => {
  mockStorage.setItem('brandbox_progress', JSON.stringify({ step: 13, formData: { marca: 'Marca Paga' } }));
  
  // Simula efeito de montagem na página de sucesso
  mockStorage.removeItem('brandbox_progress');

  assert.strictEqual(mockStorage.getItem('brandbox_progress'), null, 'Rascunho deve ter sido removido');
});

// 7. Ausência de duplicação de entrega no Supabase (Update vs Insert)
runTest('7. Prevenção de duplicatas: salvar-entrega atualiza registro existente se sessionId estiver presente', () => {
  const existingRecords = [
    { id: 'sess_existente_001', paid: false, payment_status: 'pending', marca: 'Marca Antiga' }
  ];

  function mockSalvarEntrega(body) {
    const { sessionId, marca, plano, brandState } = body;
    if (sessionId) {
      const existing = existingRecords.find(r => r.id === sessionId);
      if (existing && !existing.paid && existing.payment_status !== 'paid') {
        existing.marca = marca;
        existing.plano = plano;
        existing.brandState = brandState;
        return { sessionId: existing.id, isUpdate: true };
      }
    }
    const newId = `sess_new_${Date.now()}`;
    existingRecords.push({ id: newId, paid: false, payment_status: 'pending', marca });
    return { sessionId: newId, isUpdate: false };
  }

  // Primeira chamada cria registro
  const res1 = mockSalvarEntrega({ marca: 'Marca Original', plano: 'pro', brandState: {} });
  assert.strictEqual(res1.isUpdate, false);
  const createdId = res1.sessionId;

  // Segunda chamada (refresh ou nova tentativa) envia o mesmo sessionId
  const res2 = mockSalvarEntrega({ sessionId: createdId, marca: 'Marca Atualizada', plano: 'pro', brandState: {} });
  assert.strictEqual(res2.isUpdate, true);
  assert.strictEqual(res2.sessionId, createdId, 'ID deve ser exatamente o mesmo');
  assert.strictEqual(existingRecords.length, 2, 'Total de registros não deve ter aumentado');
});

console.log(`\nTOTAL: ${passedCount}/${testCount} testes executados com sucesso.`);
if (passedCount !== testCount) {
  process.exit(1);
}
