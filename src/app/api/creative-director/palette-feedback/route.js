import { GoogleGenerativeAI } from '@google/generative-ai';
import { acquireCreativeDirectorRequest } from '../requestGuards.js';
import { logAiUsage, extractOpenAIUsage, extractGoogleUsage } from '../../../../lib/aiTelemetry.js';

export const PALETTE_FEEDBACK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['language', 'summary', 'strength', 'caution'],
  properties: {
    language: { type: 'string' },
    summary: { type: 'string' },
    strength: { type: 'string' },
    caution: { type: 'string' }
  }
};

export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 5) return null;

  const normalized = colors.map(color => cleanText(color).toUpperCase());
  return normalized.every(color => /^#[0-9a-f]{6}$/i.test(color)) ? normalized : null;
}

export function normalizeSelectedPalette(palette) {
  if (!palette || typeof palette !== 'object') return null;
  const hex = normalizeColors(palette.hex);
  if (!hex) return null;
  return { id: cleanText(palette.id) || null, name: cleanText(palette.name) || null, hex };
}

export function normalizeBriefing(formData = {}) {
  return {
    brandName: cleanText(formData.marca) || null,
    segment: [formData.atuacao, formData.atuacaoOutra].map(cleanText).filter(Boolean).join(' - ') || null,
    audience: cleanText(formData.publico) || null
  };
}

export function normalizeCreativeDirector(creativeDirector = {}) {
  return {
    diagnostico: cleanText(creativeDirector.diagnostico) || null,
    direcaoVisual: cleanText(creativeDirector.direcaoVisual) || null,
    refinement: creativeDirector.refinement ? {
      decisao: cleanText(creativeDirector.refinement.decisao) || null,
      resumoDecisao: cleanText(creativeDirector.refinement.resumoDecisao) || null,
      direcaoRefinada: cleanText(creativeDirector.refinement.direcaoRefinada) || null,
      impactoPaleta: cleanText(creativeDirector.refinement.impactoPaleta) || null
    } : null
  };
}

export function validateFeedback(payload, idioma) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const feedback = {
    language: cleanText(payload.language),
    summary: cleanText(payload.summary),
    strength: cleanText(payload.strength),
    caution: cleanText(payload.caution)
  };

  return feedback.language === idioma && feedback.summary && feedback.strength && feedback.caution ? feedback : null;
}

async function readOpenAIError(response) {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      return body?.error?.message || body?.error || body;
    }
    return await response.text();
  } catch (error) {
    return `Unable to read OpenAI palette feedback error body: ${error.message}`;
  }
}

function extractOutputText(response) {
  return response.output_text || response.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '';
}

async function callOpenAIPaletteFeedback({ apiKey, model, idioma, payloadBody, journeyId, startTime }) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [{
            type: 'input_text',
            text: `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma ${idioma}. Faça uma leitura breve, específica e consultiva da paleta atual escolhida pelo cliente; trate paletaAtualSelecionadaPeloCliente como a referência canônica, não como sugestão inicial; não sugira mudanças, não bloqueie decisões e não exponha raciocínio interno. Use somente brandName como nome público da marca e não invente fatos.`
          }]
        },
        {
          role: 'user',
          content: [{
            type: 'input_text',
            text: JSON.stringify(payloadBody)
          }]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'creative_director_palette_feedback',
          strict: true,
          schema: PALETTE_FEEDBACK_SCHEMA
        }
      }
    })
  });

  if (!response.ok) {
    const err = await readOpenAIError(response);
    throw new Error(`OpenAI HTTP ${response.status}: ${JSON.stringify(err)}`);
  }

  const resJson = await response.json();
  const usage = extractOpenAIUsage(resJson);

  const outputText = extractOutputText(resJson);
  if (!outputText) {
    throw new Error('missing_palette_feedback_output');
  }

  const payload = JSON.parse(outputText);

  const latencyMs = Date.now() - startTime;
  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'palette_feedback',
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

async function callGeminiPaletteFeedback({ apiKey, idioma, payloadBody, journeyId, startTime, fallbackReason }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma: ${idioma}.
Faça uma leitura breve, específica e consultiva da paleta atual escolhida pela cliente.
Trate paletaAtualSelecionadaPeloCliente como a referência canônica, não como sugestão inicial.
Não sugira mudanças, não bloqueie decisões e não exponha raciocínio interno. Use somente brandName como nome público da marca e não invente fatos.

DADOS:
${JSON.stringify(payloadBody)}

Você DEVE responder EXCLUSIVAMENTE em formato JSON com as 4 chaves abaixo:
{
  "language": "${idioma}",
  "summary": "Leitura geral da paleta em no máximo 2 frases curtas.",
  "strength": "Principal ponto forte da combinação em 1 frase curta.",
  "caution": "Ponto de atenção prático, sem recomendar trocar cores, em 1 frase curta."
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  if (!responseText) {
    throw new Error('missing_gemini_palette_feedback_output');
  }

  const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const payload = JSON.parse(cleanJson);

  const latencyMs = Date.now() - startTime;
  const usage = extractGoogleUsage(result.response);

  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'palette_feedback',
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
    idioma = cleanText(body.idioma || body.lang || 'pt-BR');
    const colors = normalizeColors(body.palette);
    const primaryColor = cleanText(body.primaryColor);
    const selectedPalette = normalizeSelectedPalette(body.selectedPalette);

    if (!idioma || !colors || !colors.includes(primaryColor) || (selectedPalette && selectedPalette.hex.join(',') !== colors.join(','))) {
      return Response.json({ error: 'invalid_palette_feedback_payload' }, { status: 400 });
    }

    const openAIApiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/['"]/g, '').trim() : '';
    const openAIModel = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';
    const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '').trim() : '';

    if ((!openAIApiKey || !openAIModel) && !geminiApiKey) {
      return Response.json({ error: 'creative_director_palette_feedback_unavailable' }, { status: 503 });
    }

    requestGuard = acquireCreativeDirectorRequest(cleanText(body.requestKey));
    if (!requestGuard.ok) {
      return Response.json({ error: requestGuard.reason }, { status: 429 });
    }

    journeyId = cleanText(body.journeyId || body.creativeDirectorJourneyId || (body.requestKey ? body.requestKey.split(':')[1] : null));
    const briefing = normalizeBriefing(body.formData);
    const creativeDirector = normalizeCreativeDirector(body.resultadoFinal?.creativeDirector);

    const payloadBody = {
      tarefa: 'Crie um feedback curto para aparecer logo após a escolha da cor principal.',
      idioma,
      briefing,
      direcaoCriativa: {
        styleName: cleanText(body.resultadoFinal?.estiloNome) || null,
        mensagem: cleanText(body.resultadoFinal?.mensagem) || null,
        creativeDirector
      },
      paletaAtualSelecionadaPeloCliente: selectedPalette || { id: null, name: null, hex: colors },
      corPrincipal: primaryColor,
      formatoEsperado: {
        language: idioma,
        summary: 'Leitura geral da paleta em no máximo 2 frases curtas.',
        strength: 'Principal ponto forte da combinação em 1 frase curta.',
        caution: 'Ponto de atenção prático, sem recomendar trocar cores, em 1 frase curta.'
      }
    };

    let payload = null;
    let openAiError = null;

    // 1. Primary provider: OpenAI
    if (openAIApiKey && openAIModel) {
      try {
        payload = await callOpenAIPaletteFeedback({
          apiKey: openAIApiKey,
          model: openAIModel,
          idioma,
          payloadBody,
          journeyId,
          startTime
        });
        const feedback = validateFeedback(payload, idioma);
        if (feedback) {
          requestGuard.release({ completed: true });
          return Response.json(feedback);
        }
        openAiError = new Error('invalid_openai_palette_feedback_schema');
      } catch (err) {
        openAiError = err;
        console.warn('OpenAI Creative Director palette feedback failed, falling over to Gemini:', err.message);
      }
    } else {
      openAiError = new Error('openai_not_configured');
    }

    // 2. Fallback provider: Google Gemini
    if (geminiApiKey) {
      try {
        payload = await callGeminiPaletteFeedback({
          apiKey: geminiApiKey,
          idioma,
          payloadBody,
          journeyId,
          startTime,
          fallbackReason: openAiError?.message || 'openai_fallback'
        });
        const feedback = validateFeedback(payload, idioma);
        if (feedback) {
          requestGuard.release({ completed: true });
          return Response.json(feedback);
        }
        console.error('Gemini Creative Director palette feedback returned invalid schema');
      } catch (geminiErr) {
        console.error('Gemini Creative Director palette feedback fallback failed:', geminiErr.message);
      }
    }

    if (journeyId) {
      logAiUsage({
        journeyId,
        operationType: 'palette_feedback',
        provider: 'fallback',
        exactModel: 'none',
        latencyMs: Date.now() - startTime,
        success: false,
        errorCode: 'creative_director_palette_feedback_failed',
        metadata: { language: idioma }
      });
    }

    requestGuard.release({ completed: true });
    return Response.json({ error: 'creative_director_palette_feedback_failed' }, { status: 502 });
  } catch (error) {
    console.error('Creative Director palette feedback error:', { message: error.message });
    return Response.json({ error: 'creative_director_palette_feedback_failed' }, { status: 502 });
  } finally {
    requestGuard?.release?.();
  }
}

