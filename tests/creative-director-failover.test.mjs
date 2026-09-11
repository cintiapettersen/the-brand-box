import assert from "node:assert/strict";

import {
  validateCreativeDirector,
  buildBriefing as buildDiagnosticBriefing,
  POST as diagnosticPost
} from "../src/app/api/creative-director/route.js";

import {
  validateQuestion,
  validateResolution,
  POST as refinePost
} from "../src/app/api/creative-director/refine/route.js";

import {
  validateFeedback,
  POST as paletteFeedbackPost
} from "../src/app/api/creative-director/palette-feedback/route.js";

import {
  calculateLimits,
  validateTaglines,
  POST as taglinesPost
} from "../src/app/api/creative-director/taglines/route.js";

function makeMockRequest(body) {
  return { json: async () => body };
}

console.log("=== 1. DIAGNOSTIC TESTS ===");
{
  const validPayload = {
    diagnostico: "Uma marca de moda feminina contemporânea com foco em sofisticação.",
    personalidade: ["Elegante", "Minimalista", "Confiável"],
    objetivosEmocionais: ["Transmitir segurança", "Inspirar autoridade"],
    expectativasPublico: ["Qualidade impecável", "Design autoral"],
    riscosEvitar: ["Parecer genérica", "Excesso de elementos"],
    porqueEsseEstilo: "Combina perfeitamente com a sofisticação da marca.",
    direcaoVisual: "Uso de tipografia editorial e paleta sóbria."
  };

  const validated = validateCreativeDirector(validPayload);
  assert.ok(validated);
  assert.equal(validated.personalidade.length, 3);
  assert.equal(validateCreativeDirector(null), null);

  const prevOpenAIKey = process.env.OPENAI_API_KEY;
  const prevOpenAIModel = process.env.OPENAI_MODEL;
  const prevFetch = globalThis.fetch;

  process.env.OPENAI_API_KEY = "mock-openai-key";
  process.env.OPENAI_MODEL = "gpt-4o-mini";

  globalThis.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          output_text: JSON.stringify(validPayload),
          usage: { input_tokens: 100, output_tokens: 50 }
        })
      };
    }
    return prevFetch(url);
  };

  const reqBody = {
    formData: { marca: "Aura Studio", atuacao: "Design", publico: "Adultos" },
    estiloId: 5,
    estiloNome: "Essência Atemporal",
    mensagem: "Olá!",
    idioma: "pt",
    requestKey: "diag-" + Date.now() + "-" + Math.random()
  };

  const res = await diagnosticPost(makeMockRequest(reqBody));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.diagnostico, validPayload.diagnostico);

  process.env.OPENAI_API_KEY = prevOpenAIKey || "";
  process.env.OPENAI_MODEL = prevOpenAIModel || "";
  globalThis.fetch = prevFetch;
}
console.log("✓ Diagnostic tests passed");

console.log("=== 2. REFINE THIS DIRECTION TESTS ===");
{
  // 2.1 Question schema validation
  const validQ = {
    tensaoIdentificada: "Desejo de sofisticação versus abordagem acolhedora",
    pergunta: "Você prefere destacar a elegância ou o acolhimento?",
    porquePerguntar: "Para calibrar a direção visual."
  };
  assert.ok(validateQuestion(validQ));
  assert.equal(validateQuestion({ ...validQ, pergunta: "" }), null);

  // 2.2 Resolution schema validation
  const validRes = {
    decisao: "ajustar",
    resumoDecisao: "Refinamento focado em tipografia mais acolhedora.",
    direcaoRefinada: "Manter paleta neutra com formas mais suaves.",
    impactoPaleta: "Paleta preservada.",
    impactoTipografia: "Ajuste para serifas mais abertas.",
    impactoComposicao: "Espaçamentos generosos.",
    impactoEstampa: "Sem estampas adicionais.",
    estiloAlternativoId: null,
    estiloAlternativoNome: null
  };
  assert.ok(validateResolution(validRes));
  assert.equal(validateResolution({ ...validRes, decisao: "invalida" }), null);

  // 2.3 Post failover test for question
  const prevOpenAIKey = process.env.OPENAI_API_KEY;
  const prevOpenAIModel = process.env.OPENAI_MODEL;
  const prevFetch = globalThis.fetch;

  process.env.OPENAI_API_KEY = "mock-openai-key";
  process.env.OPENAI_MODEL = "gpt-4o-mini";

  globalThis.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          output_text: JSON.stringify(validQ),
          usage: { input_tokens: 100, output_tokens: 50 }
        })
      };
    }
    return prevFetch(url);
  };

  const reqQ = {
    phase: "question",
    formData: { marca: "Studio Aura" },
    resultadoFinal: { estiloId: 5, estiloNome: "Essência Atemporal" },
    idioma: "pt",
    requestKey: "refine-q-" + Date.now() + "-" + Math.random()
  };

  const qRes = await refinePost(makeMockRequest(reqQ));
  assert.equal(qRes.status, 200);
  const qData = await qRes.json();
  assert.equal(qData.pergunta, validQ.pergunta);

  // Post resolution
  globalThis.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          output_text: JSON.stringify(validRes),
          usage: { input_tokens: 100, output_tokens: 50 }
        })
      };
    }
    return prevFetch(url);
  };

  const reqR = {
    phase: "resolution",
    formData: { marca: "Studio Aura" },
    resultadoFinal: { estiloId: 5, estiloNome: "Essência Atemporal" },
    pergunta: validQ.pergunta,
    respostaUsuario: "Prefiro destacar mais o acolhimento.",
    idioma: "pt",
    requestKey: "refine-r-" + Date.now() + "-" + Math.random()
  };

  const rRes = await refinePost(makeMockRequest(reqR));
  assert.equal(rRes.status, 200);
  const rData = await rRes.json();
  assert.equal(rData.decisao, "ajustar");

  process.env.OPENAI_API_KEY = prevOpenAIKey || "";
  process.env.OPENAI_MODEL = prevOpenAIModel || "";
  globalThis.fetch = prevFetch;
}
console.log("✓ Refine tests passed");

console.log("=== 3. PALETTE FEEDBACK TESTS ===");
{
  const validFb = {
    language: "pt-BR",
    summary: "Uma combinação harmoniosa que une calma e elegância.",
    strength: "Alto contraste visual com sofisticação.",
    caution: "Garantir legibilidade em fundos claros."
  };
  assert.ok(validateFeedback(validFb, "pt-BR"));
  assert.equal(validateFeedback(validFb, "en"), null, "Language mismatch must reject");
  assert.equal(validateFeedback({ ...validFb, summary: "" }, "pt-BR"), null);

  const prevOpenAIKey = process.env.OPENAI_API_KEY;
  const prevOpenAIModel = process.env.OPENAI_MODEL;
  const prevFetch = globalThis.fetch;

  process.env.OPENAI_API_KEY = "mock-openai-key";
  process.env.OPENAI_MODEL = "gpt-4o-mini";

  globalThis.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          output_text: JSON.stringify(validFb),
          usage: { input_tokens: 80, output_tokens: 40 }
        })
      };
    }
    return prevFetch(url);
  };

  const reqFb = {
    palette: ["#111111", "#222222", "#333333", "#444444", "#555555"],
    primaryColor: "#111111",
    idioma: "pt-BR",
    formData: { marca: "Studio" },
    resultadoFinal: { estiloNome: "Minimalista" },
    requestKey: "pal-" + Date.now() + "-" + Math.random()
  };

  const fbRes = await paletteFeedbackPost(makeMockRequest(reqFb));
  assert.equal(fbRes.status, 200);
  const fbData = await fbRes.json();
  assert.equal(fbData.summary, validFb.summary);

  process.env.OPENAI_API_KEY = prevOpenAIKey || "";
  process.env.OPENAI_MODEL = prevOpenAIModel || "";
  globalThis.fetch = prevFetch;
}
console.log("✓ Palette feedback tests passed");

console.log("=== 4. TAGLINES TESTS ===");
{
  const limits = calculateLimits("Studio Aurora");
  assert.equal(limits.maxWords, 5);
  assert.equal(limits.maxCharacters, 38);

  const validTaglines = {
    language: "pt-BR",
    brandName: "Studio Aurora",
    maxWords: 5,
    maxCharacters: 38,
    suggestions: [
      { type: "emotional", text: "Elegância que inspira sua jornada" },
      { type: "strategic", text: "Design autoral e atemporal" },
      { type: "direct", text: "Simplicidade em cada detalhe" }
    ]
  };

  assert.ok(validateTaglines(validTaglines, {
    idioma: "pt-BR",
    brandName: "Studio Aurora",
    contactName: "Ana",
    maxWords: 5,
    maxCharacters: 38
  }));

  // Rejects contactName inside tagline text
  const withContact = {
    ...validTaglines,
    suggestions: [
      { type: "emotional", text: "Ana cria elegância autêntica" },
      { type: "strategic", text: "Design autoral e atemporal" },
      { type: "direct", text: "Simplicidade em cada detalhe" }
    ]
  };
  assert.equal(validateTaglines(withContact, {
    idioma: "pt-BR",
    brandName: "Studio Aurora",
    contactName: "Ana",
    maxWords: 5,
    maxCharacters: 38
  }), null, "Tagline containing contactName must be rejected");

  const prevOpenAIKey = process.env.OPENAI_API_KEY;
  const prevOpenAIModel = process.env.OPENAI_MODEL;
  const prevFetch = globalThis.fetch;

  process.env.OPENAI_API_KEY = "mock-openai-key";
  process.env.OPENAI_MODEL = "gpt-4o-mini";

  globalThis.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          output_text: JSON.stringify(validTaglines),
          usage: { input_tokens: 120, output_tokens: 60 }
        })
      };
    }
    return prevFetch(url);
  };

  const reqTag = {
    formData: { marca: "Studio Aurora", nome: "Ana" },
    resultadoFinal: { estiloNome: "Essência Atemporal" },
    idioma: "pt-BR",
    requestKey: "tag-" + Date.now() + "-" + Math.random()
  };

  const tagRes = await taglinesPost(makeMockRequest(reqTag));
  assert.equal(tagRes.status, 200);
  const tagData = await tagRes.json();
  assert.equal(tagData.suggestions.length, 3);

  process.env.OPENAI_API_KEY = prevOpenAIKey || "";
  process.env.OPENAI_MODEL = prevOpenAIModel || "";
  globalThis.fetch = prevFetch;
}
console.log("✓ Tagline tests passed");

console.log("=== ALL FAILOVER TESTS PASSED SUCCESSFULLY! ===");
