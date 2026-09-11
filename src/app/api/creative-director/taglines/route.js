import { GoogleGenerativeAI } from '@google/generative-ai';
import { acquireCreativeDirectorRequest } from '../requestGuards.js';
import { logAiUsage, extractOpenAIUsage, extractGoogleUsage } from '../../../../lib/aiTelemetry.js';

export const TAGLINE_TYPES = ['emotional', 'strategic', 'direct'];

export const TAGLINE_SCHEMA = {
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

export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeForCompare(value) {
  return cleanText(value).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function countWords(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

export function countCharacters(value) {
  return Array.from(cleanText(value)).length;
}

export function calculateLimits(brandName) {
  const length = Array.from(cleanText(brandName)).length;

  if (length <= 8) return { maxWords: 6, maxCharacters: 45 };
  if (length <= 16) return { maxWords: 5, maxCharacters: 38 };
  return { maxWords: 4, maxCharacters: 30 };
}

export function normalizeBriefing(formData = {}) {
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

export function normalizeCreativeDirector(creativeDirector = {}) {
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

export function buildIdentityContext(formData = {}, resultadoFinal = {}) {
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

export function validateTaglines(payload, { idioma, brandName, contactName, maxWords, maxCharacters }) {
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

export function buildPrompt({ formData, resultadoFinal, idioma, maxWords, maxCharacters, invalidReasons = [] }) {
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
      maxWords,
      maxCharacters,
      brandNamePolicy: 'Se usar o nome da marca, use no máximo uma vez e apenas se soar natural junto à logo.',
      contactNamePolicy: 'Nunca use o nome pessoal/de contato da usuária na tagline.',
      styleNamePolicy: 'Nunca use o nome da direção criativa como nome de marca.',
      outputExpectation: 'Gere exatamente 3 sugestões: 1 emotional, 1 strategic e 1 direct.'
    }
  });
}

async function callOpenAITaglines({ apiKey, model, prompt, idioma, journeyId, startTime }) {
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
    throw new Error(`OpenAI HTTP ${openAIResponse.status}: ${JSON.stringify(error)}`);
  }

  const response = await openAIResponse.json();
  const usage = extractOpenAIUsage(response);

  const outputText = extractOutputText(response);
  if (!outputText) {
    throw new Error('missing_creative_director_taglines_output');
  }

  const payload = JSON.parse(outputText);

  const latencyMs = Date.now() - startTime;
  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'tagline_generation',
      provider: 'openai',
      exactModel: usage.resolvedModel || model,
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      providerRequestId: usage.providerRequestId,
      latencyMs,
      success: true,
      fallbackUsed: false,
      metadata: { language: idioma }
    });
  }

  return payload;
}

async function callGeminiTaglines({ apiKey, prompt, idioma, brandName, maxWords, maxCharacters, journeyId, startTime, fallbackReason }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const fullPrompt = `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma: ${idioma}.
Gere 3 sugestões de tagline curtas para a marca "${brandName}".

REGRAS:
1. Máximo de ${maxWords} palavras por tagline.
2. Máximo de ${maxCharacters} caracteres por tagline.
3. Não use ponto final no término das frases.
4. Gere exatamente 3 sugestões: 1 "emotional", 1 "strategic" e 1 "direct".
5. Nunca use nome de contato ou termos genéricos proibidos.

DADOS DA TAREFA:
${prompt}

Você DEVE responder EXCLUSIVAMENTE em formato JSON com o formato:
{
  "language": "${idioma}",
  "brandName": "${brandName}",
  "maxWords": ${maxWords},
  "maxCharacters": ${maxCharacters},
  "suggestions": [
    { "type": "emotional", "text": "Texto da tagline emocional" },
    { "type": "strategic", "text": "Texto da tagline estratégica" },
    { "type": "direct", "text": "Texto da tagline direta" }
  ]
}`;

  const result = await model.generateContent(fullPrompt);
  const responseText = result.response.text();
  if (!responseText) {
    throw new Error('missing_gemini_taglines_output');
  }

  const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const payload = JSON.parse(cleanJson);

  const latencyMs = Date.now() - startTime;
  const usage = extractGoogleUsage(result.response);

  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'tagline_generation',
      provider: 'google',
      exactModel: 'gemini-2.5-flash',
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      latencyMs,
      success: true,
      fallbackUsed: true,
      retryReason: fallbackReason || 'openai_fallback',
      metadata: { language: idioma }
    });
  }

  return payload;
}

export async function POST(req) {
  let requestGuard;
  const startTime = Date.now();
  let journeyId = null;
  let idioma = 'pt-BR';

  try {
    const body = await req.json();
    const formData = body.formData || {};
    const resultadoFinal = body.resultadoFinal || {};
    idioma = cleanText(body.idioma || body.lang || 'pt-BR');
    const requestKey = cleanText(body.requestKey);
    journeyId = cleanText(body.journeyId || body.creativeDirectorJourneyId || (requestKey ? requestKey.split(':')[1] : null));
    const brandName = cleanText(formData.marca);
    const contactName = cleanText(formData.nome);

    if (!brandName || !resultadoFinal.estiloNome) {
      return Response.json({ error: 'invalid_creative_director_taglines_payload' }, { status: 400 });
    }

    const openAIApiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '').trim() : '';
    const openAIModel = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';
    const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/["']/g, '').trim() : '';

    if ((!openAIApiKey || !openAIModel) && !geminiApiKey) {
      return Response.json({ error: 'creative_director_taglines_unavailable' }, { status: 503 });
    }

    requestGuard = acquireCreativeDirectorRequest(requestKey);
    if (!requestGuard.ok) {
      return Response.json({ error: requestGuard.reason }, { status: 429 });
    }

    const { maxWords, maxCharacters } = calculateLimits(brandName);
    const firstPrompt = buildPrompt({ formData, resultadoFinal, idioma, maxWords, maxCharacters });

    let payload = null;
    let openAiError = null;

    // 1. Primary provider: OpenAI
    if (openAIApiKey && openAIModel) {
      try {
        payload = await callOpenAITaglines({
          apiKey: openAIApiKey,
          model: openAIModel,
          prompt: firstPrompt,
          idioma,
          journeyId,
          startTime
        });
        const validated = validateTaglines(payload, { idioma, brandName, contactName, maxWords, maxCharacters });
        if (validated) {
          requestGuard.release({ completed: true });
          return Response.json(validated);
        }
        openAiError = new Error('invalid_openai_taglines_schema');
      } catch (err) {
        openAiError = err;
        console.warn('OpenAI Creative Director taglines failed, falling over to Gemini:', err.message);
      }
    } else {
      openAiError = new Error('openai_not_configured');
    }

    // 2. Fallback provider: Google Gemini
    if (geminiApiKey) {
      try {
        payload = await callGeminiTaglines({
          apiKey: geminiApiKey,
          prompt: firstPrompt,
          idioma,
          brandName,
          maxWords,
          maxCharacters,
          journeyId,
          startTime,
          fallbackReason: openAiError?.message || 'openai_fallback'
        });
        const validated = validateTaglines(payload, { idioma, brandName, contactName, maxWords, maxCharacters });
        if (validated) {
          requestGuard.release({ completed: true });
          return Response.json(validated);
        }
        console.error('Gemini Creative Director taglines returned invalid schema');
      } catch (geminiErr) {
        console.error('Gemini Creative Director taglines fallback failed:', geminiErr.message);
      }
    }

    if (journeyId) {
      logAiUsage({
        journeyId,
        operationType: 'tagline_generation',
        provider: 'fallback',
        exactModel: 'none',
        latencyMs: Date.now() - startTime,
        success: false,
        errorCode: 'creative_director_taglines_failed',
        metadata: { language: idioma }
      });
    }

    requestGuard.release({ completed: true });
    return Response.json({ error: 'creative_director_taglines_failed' }, { status: 502 });
  } catch (error) {
    console.error('Creative Director taglines error:', { message: error.message });
    return Response.json({ error: 'creative_director_taglines_failed' }, { status: 502 });
  } finally {
    requestGuard?.release?.();
  }
}
