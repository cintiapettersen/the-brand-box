import { acquireCreativeDirectorRequest } from '../requestGuards.js';

const TAGLINE_TYPES = ['emotional', 'strategic', 'direct'];

const TAGLINE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['language', 'brandName', 'maxWords', 'maxCharacters', 'suggestions'],
  properties: {
    language: { type: 'string' },
    brandName: { type: 'string' },
    maxWords: { type: 'number' },
    maxCharacters: { type: 'number' },
    suggestions: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'text'],
        properties: {
          type: { type: 'string', enum: TAGLINE_TYPES },
          text: { type: 'string' }
        }
      }
    }
  }
};

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeForCompare(value) {
  return cleanText(value).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function countWords(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

function countCharacters(value) {
  return Array.from(cleanText(value)).length;
}

function calculateLimits(brandName) {
  const length = Array.from(cleanText(brandName)).length;

  if (length <= 8) return { maxWords: 6, maxCharacters: 45 };
  if (length <= 16) return { maxWords: 5, maxCharacters: 38 };
  return { maxWords: 4, maxCharacters: 30 };
}

function normalizeBriefing(formData = {}) {
  return {
    brandName: cleanText(formData.marca) || null,
    areaAtuacao: [formData.atuacao, formData.atuacaoOutra].map(cleanText).filter(Boolean).join(' - ') || null,
    publico: cleanText(formData.publico) || null,
    personalidade: cleanText(formData.personalidade || formData.identidade) || null,
    primeiraImpressao: cleanText(formData.primeiraImpressao) || null,
    sentimentos: Array.isArray(formData.sentimentos) ? formData.sentimentos.map(cleanText).filter(Boolean) : [],
    elementosVisuais: Array.isArray(formData.elementosVisuais) ? formData.elementosVisuais.map(cleanText).filter(Boolean) : [],
    inspiracoes: cleanText(formData.inspiracoes) || null,
    inspiracoesTags: Array.isArray(formData.inspiracoesTags) ? formData.inspiracoesTags.map(cleanText).filter(Boolean) : [],
    nuncaPensar: cleanText(formData.nuncaPensar) || null,
    nuncaPensarTags: Array.isArray(formData.nuncaPensarTags) ? formData.nuncaPensarTags.map(cleanText).filter(Boolean) : [],
    contextoExtra: cleanText(formData.contextoExtra) || null
  };
}

function normalizeCreativeDirector(creativeDirector = {}) {
  return {
    diagnostico: cleanText(creativeDirector.diagnostico) || null,
    personalidade: Array.isArray(creativeDirector.personalidade) ? creativeDirector.personalidade.map(cleanText).filter(Boolean) : [],
    objetivosEmocionais: Array.isArray(creativeDirector.objetivosEmocionais) ? creativeDirector.objetivosEmocionais.map(cleanText).filter(Boolean) : [],
    expectativasPublico: Array.isArray(creativeDirector.expectativasPublico) ? creativeDirector.expectativasPublico.map(cleanText).filter(Boolean) : [],
    riscosEvitar: Array.isArray(creativeDirector.riscosEvitar) ? creativeDirector.riscosEvitar.map(cleanText).filter(Boolean) : [],
    porqueEsseEstilo: cleanText(creativeDirector.porqueEsseEstilo) || null,
    direcaoVisual: cleanText(creativeDirector.direcaoVisual) || null,
    refinement: creativeDirector.refinement ? {
      decisao: cleanText(creativeDirector.refinement.decisao) || null,
      resumoDecisao: cleanText(creativeDirector.refinement.resumoDecisao) || null,
      direcaoRefinada: cleanText(creativeDirector.refinement.direcaoRefinada) || null,
      impactoPaleta: cleanText(creativeDirector.refinement.impactoPaleta) || null,
      impactoTipografia: cleanText(creativeDirector.refinement.impactoTipografia) || null,
      impactoComposicao: cleanText(creativeDirector.refinement.impactoComposicao) || null,
      impactoEstampa: cleanText(creativeDirector.refinement.impactoEstampa) || null
    } : null
  };
}

function buildIdentityContext(formData = {}, resultadoFinal = {}) {
  return {
    brandName: cleanText(formData.marca) || null,
    styleName: cleanText(resultadoFinal.estiloNome) || null,
    contactName: null,
    contactNamePolicy: 'contactName é o nome pessoal/de contato da usuária, foi removido do briefing e nunca deve aparecer nas taglines ou em decisões criativas.',
    styleNamePolicy: 'styleName é o nome da direção criativa selecionada e nunca é nome de marca. Diferenças entre brandName e styleName não são contradições.'
  };
}

async function readOpenAIError(openAIResponse) {
  try {
    const contentType = openAIResponse.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await openAIResponse.json();
      return body?.error?.message || body?.error || body;
    }
    return await openAIResponse.text();
  } catch (error) {
    return `Unable to read OpenAI tagline error body: ${error.message}`;
  }
}

function extractOutputText(response) {
  return response.output_text || response.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '';
}

function validateTaglines(payload, { idioma, brandName, contactName, maxWords, maxCharacters }) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (cleanText(payload.language) !== idioma) return null;
  if (cleanText(payload.brandName) !== brandName) return null;
  if (Number(payload.maxWords) !== maxWords || Number(payload.maxCharacters) !== maxCharacters) return null;
  if (!Array.isArray(payload.suggestions) || payload.suggestions.length !== 3) return null;

  const normalizedBrand = normalizeForCompare(brandName);
  const normalizedContact = normalizeForCompare(contactName);
  const seenTexts = new Set();
  const seenTypes = new Set();
  const suggestions = [];

  for (const suggestion of payload.suggestions) {
    const type = cleanText(suggestion?.type);
    const text = cleanText(suggestion?.text).replace(/[.!?。]+$/g, '');
    const comparableText = normalizeForCompare(text);

    if (!TAGLINE_TYPES.includes(type) || seenTypes.has(type)) return null;
    if (!text || seenTexts.has(comparableText)) return null;
    if (countWords(text) > maxWords || countCharacters(text) > maxCharacters) return null;
    if (normalizedContact && comparableText.includes(normalizedContact)) return null;
    if (normalizedBrand && comparableText.includes(normalizedBrand)) return null;

    seenTypes.add(type);
    seenTexts.add(comparableText);
    suggestions.push({ type, text });
  }

  if (!TAGLINE_TYPES.every(type => seenTypes.has(type))) return null;

  return { language: idioma, brandName, maxWords, maxCharacters, suggestions };
}

function buildPrompt({ formData, resultadoFinal, idioma, maxWords, maxCharacters, invalidReasons = [] }) {
  const briefing = normalizeBriefing(formData);
  const creativeDirector = normalizeCreativeDirector(resultadoFinal.creativeDirector);

  return JSON.stringify({
    tarefa: invalidReasons.length ? 'Reescreva somente as 3 taglines corrigindo os problemas de validação.' : 'Gere 3 sugestões de tagline curtas para a etapa existente de tagline do The Brand Box.',
    idioma,
    identityContext: buildIdentityContext(formData, resultadoFinal),
    limites: { maxWords, maxCharacters },
    tiposObrigatorios: [
      { type: 'emotional', objetivo: 'mais sensível e emocional' },
      { type: 'strategic', objetivo: 'mais estratégica e posicionadora' },
      { type: 'direct', objetivo: 'direta, curta e memorável' }
    ],
    briefing,
    direcaoCriativa: {
      estiloId: resultadoFinal.estiloId || null,
      styleName: resultadoFinal.estiloNome || null,
      mensagemGemini: resultadoFinal.mensagem || null,
      creativeDirector
    },
    problemasParaCorrigir: invalidReasons,
    regras: [
      'Responda exclusivamente no idioma informado.',
      'Use somente identityContext.brandName como nome público da marca.',
      'Nunca use o nome pessoal/de contato; ele foi removido do briefing.'
    ],
    creativeDirection: {
      estiloNome: cleanText(resultadoFinal.estiloNome),
      diagnostico: resultadoFinal.creativeDirector?.diagnostico || null,
      refinement: resultadoFinal.creativeDirector?.refinement?.direcaoRefinada || null
    },
    constraints: {
      idioma,
      maxWords: limits.maxWords,
      maxCharacters: limits.maxCharacters,
      brandNamePolicy: 'Se usar o nome da marca, use no máximo uma vez e apenas se soar natural junto à logo.',
      contactNamePolicy: 'Nunca use o nome pessoal/de contato da usuária na tagline.',
      styleNamePolicy: 'Nunca use o nome da direção criativa como nome de marca.',
      outputExpectation: 'Gere exatamente 3 sugestões: 1 emotional, 1 strategic e 1 direct.'
    }
  });
}

async function callOpenAI({ apiKey, model, prompt, idioma, requestKey, journeyId }) {
  const requestGuard = acquireCreativeDirectorRequest(requestKey);
  if (!requestGuard.ok) {
    return { errorResponse: Response.json({ error: requestGuard.reason }, { status: 429 }) };
  }

  const startTime = Date.now();
  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }],
      text: {
        format: {
          type: 'json_schema',
          name: 'creative_director_taglines',
          strict: true,
          schema: TAGLINE_SCHEMA
        }
      }
    })
  });

  if (!openAIResponse.ok) {
    const error = await readOpenAIError(openAIResponse);
    const latencyMs = Date.now() - startTime;
    console.error('OpenAI Creative Director tagline request failed:', {
      status: openAIResponse.status,
      error
    });
    if (journeyId) {
      logAiUsage({
        journeyId,
        operationType: 'taglines',
        provider: 'openai',
        exactModel: model || 'openai-unspecified',
        latencyMs,
        success: false,
        errorCode: 'creative_director_taglines_openai_error',
        metadata: { language: idioma }
      });
    }
    requestGuard.release({ completed: true });
    return { errorResponse: Response.json({ error: 'creative_director_taglines_openai_error' }, { status: 502 }) };
  }

  const latencyMs = Date.now() - startTime;
  const response = await openAIResponse.json();
  const usage = extractOpenAIUsage(response);

  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'taglines',
      provider: 'openai',
      exactModel: usage.resolvedModel || model,
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      providerRequestId: usage.providerRequestId,
      latencyMs,
      success: true,
      metadata: { language: idioma }
    });
  }

  const outputText = extractOutputText(response);

  if (!outputText) {
    console.error('OpenAI Creative Director taglines missing output_text:', { status: openAIResponse.status });
    requestGuard.release({ completed: true });
    return { errorResponse: Response.json({ error: 'missing_creative_director_taglines_output' }, { status: 502 }) };
  }

  try {
    const payload = JSON.parse(outputText);
    requestGuard.release({ completed: true });
    return { payload };
  } catch (error) {
    console.error('OpenAI Creative Director taglines returned invalid JSON:', {
      status: openAIResponse.status,
      error: error.message
    });
    requestGuard.release({ completed: true });
    return { errorResponse: Response.json({ error: 'invalid_creative_director_taglines_json' }, { status: 502 }) };
  }
}

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '') : '';
    const model = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';

    if (!apiKey || !model) {
      return Response.json({ error: 'creative_director_taglines_unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const formData = body.formData || {};
    const resultadoFinal = body.resultadoFinal || {};
    const idioma = cleanText(body.idioma || body.lang || 'pt-BR');
    const requestKey = cleanText(body.requestKey);
    const journeyId = cleanText(body.journeyId || body.creativeDirectorJourneyId || (requestKey ? requestKey.split(':')[1] : null));
    const brandName = cleanText(formData.marca);
    const contactName = cleanText(formData.nome);

    if (!brandName || !resultadoFinal.estiloNome) {
      return Response.json({ error: 'invalid_creative_director_taglines_payload' }, { status: 400 });
    }

    const { maxWords, maxCharacters } = calculateLimits(brandName);
    const limits = { maxWords, maxCharacters };
    const firstPrompt = buildPrompt({ formData, resultadoFinal, limits, idioma, brandName, contactName });
    const firstAttempt = await callOpenAI({ apiKey, model, prompt: firstPrompt, idioma, requestKey, journeyId });

    if (firstAttempt.errorResponse) return firstAttempt.errorResponse;

    const validated = normalizeTaglines(firstAttempt.payload?.suggestions, limits, brandName, contactName);
    if (validated.length === 3) return Response.json({ suggestions: validated });

    console.error('OpenAI Creative Director taglines validation failed; retrying once:', {
      receivedFields: Object.keys(firstAttempt.payload || {})
    });

    const repairPrompt = buildPrompt({
      formData,
      resultadoFinal,
      limits,
      idioma,
      brandName,
      contactName
    });
    const repairAttempt = await callOpenAI({ apiKey, model, prompt: repairPrompt, idioma, requestKey: `${requestKey}:repair`, journeyId });

    if (repairAttempt.errorResponse) return repairAttempt.errorResponse;

    const repaired = normalizeTaglines(repairAttempt.payload?.suggestions, limits, brandName, contactName);
    if (repaired.length !== 3) {
      console.error('OpenAI Creative Director taglines schema validation failed:', {
        receivedFields: Object.keys(repairAttempt.payload || {})
      });
      return Response.json({ error: 'invalid_creative_director_taglines_response' }, { status: 502 });
    }

    return Response.json({ suggestions: repaired });
  } catch (error) {
    console.error('Creative Director taglines error:', { message: error.message });
    return Response.json({ error: 'creative_director_taglines_failed' }, { status: 502 });
  }
}
