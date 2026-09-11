import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrCreateCreativeDirector } from './requestGuards.js';
import { logAiUsage, extractOpenAIUsage, extractGoogleUsage } from '../../../lib/aiTelemetry.js';

const REQUIRED_ARRAY_FIELDS = ['personalidade', 'objetivosEmocionais', 'expectativasPublico', 'riscosEvitar'];
const REQUIRED_STRING_FIELDS = ['diagnostico', 'porqueEsseEstilo', 'direcaoVisual'];

export const creativeDirectorSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'diagnostico',
    'personalidade',
    'objetivosEmocionais',
    'expectativasPublico',
    'riscosEvitar',
    'porqueEsseEstilo',
    'direcaoVisual'
  ],
  properties: {
    diagnostico: { type: 'string' },
    personalidade: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string' } },
    objetivosEmocionais: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
    expectativasPublico: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
    riscosEvitar: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
    porqueEsseEstilo: { type: 'string' },
    direcaoVisual: { type: 'string' }
  }
};

export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeArray(value, size) {
  if (Array.isArray(value)) {
    const items = value.map(cleanText).filter(Boolean);
    return items.length >= size ? items.slice(0, size) : [];
  }
  if (typeof value === 'string' && value.trim()) {
    const items = value.split(/[\n•,\-]+/).map(cleanText).filter(Boolean);
    return items.length >= size ? items.slice(0, size) : [];
  }
  return [];
}

export function validateCreativeDirector(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const normalized = {
    diagnostico: cleanText(payload.diagnostico),
    personalidade: normalizeArray(payload.personalidade, 3),
    objetivosEmocionais: normalizeArray(payload.objetivosEmocionais, 2),
    expectativasPublico: normalizeArray(payload.expectativasPublico, 2),
    riscosEvitar: normalizeArray(payload.riscosEvitar, 2),
    porqueEsseEstilo: cleanText(payload.porqueEsseEstilo),
    direcaoVisual: cleanText(payload.direcaoVisual)
  };

  const hasStrings = REQUIRED_STRING_FIELDS.every(field => normalized[field]);
  const hasArrays = REQUIRED_ARRAY_FIELDS.every(field => normalized[field].length === (field === 'personalidade' ? 3 : 2));

  return hasStrings && hasArrays ? normalized : null;
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
    return `Unable to read OpenAI error body: ${error.message}`;
  }
}

function errorId(error) {
  return String(error?.code || error?.type || error?.name || error?.message || 'unknown').replace(/[^a-z0-9_-]/gi, '_').slice(0, 80);
}

export function buildBriefing(formData = {}) {
  return {
    brandName: formData.marca || null,
    areaAtuacao: [formData.atuacao, formData.atuacaoOutra].filter(Boolean).join(' - ') || null,
    publico: formData.publico || null,
    personalidade: formData.personalidade || formData.identidade || null,
    primeiraImpressao: formData.primeiraImpressao || null,
    sentimentos: Array.isArray(formData.sentimentos) ? formData.sentimentos : [],
    locais: Array.isArray(formData.locais) ? formData.locais : [],
    inspiracoes: formData.inspiracoes || null,
    inspiracoesTags: Array.isArray(formData.inspiracoesTags) ? formData.inspiracoesTags : [],
    nuncaPensar: formData.nuncaPensar || null,
    nuncaPensarTags: Array.isArray(formData.nuncaPensarTags) ? formData.nuncaPensarTags : [],
    elementosVisuais: Array.isArray(formData.elementosVisuais) ? formData.elementosVisuais : [],
    contextoExtra: formData.contextoExtra || null
  };
}

export async function generateWithOpenAI({
  apiKey,
  model,
  briefing,
  identityContext,
  estiloId,
  estiloNome,
  mensagemGemini,
  idioma,
  journeyId,
  startTime
}) {
  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: `Você é uma AI Creative Director da The Brand Box. Gere um diagnóstico criativo estratégico, humano e específico para o briefing recebido. Responda no idioma atual da aplicação: ${idioma}. Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing. REGRA DE PRIORIDADE: O campo de público (briefing.publico) é a verdade absoluta sobre a faixa etária. Se a área de atuação for Moda/Roupa e o público for Adulto, não escreva absolutamente nada sobre crianças, moda infantil ou infância. O campo de nome pessoal/de contato da usuária foi removido do briefing e nunca deve ser tratado como nome público da marca. Use somente identityContext.brandName como nome público da marca. identityContext.styleName é nome da direção criativa e nunca deve ser interpretado como nome de marca; diferenças entre brandName e styleName não são contradições. Marcar marca pessoal não autoriza assumir que o nome de contato será usado publicamente. Se um dado estiver ausente, simplesmente não o use. Seja objetiva e preserve o estilo selecionado pelo Gemini.`
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                identityContext,
                briefing,
                estiloSelecionadoPeloGemini: { estiloId, styleName: estiloNome, mensagem: mensagemGemini },
                formatoEsperado: {
                  diagnostico: 'Resumo da essência da marca em no máximo duas frases.',
                  personalidade: ['palavra 1', 'palavra 2', 'palavra 3'],
                  objetivosEmocionais: ['objetivo 1', 'objetivo 2'],
                  expectativasPublico: ['expectativa 1', 'expectativa 2'],
                  riscosEvitar: ['risco 1', 'risco 2'],
                  porqueEsseEstilo: 'Explicação curta e específica sobre por que o estilo escolhido combina com a marca.',
                  direcaoVisual: 'Resumo da direção visual recomendada.'
                }
              })
            }
          ]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'creative_director_diagnostic',
          strict: true,
          schema: creativeDirectorSchema
        }
      }
    })
  });

  if (!openAIResponse.ok) {
    const error = await readOpenAIError(openAIResponse);
    throw new Error(`OpenAI HTTP ${openAIResponse.status}: ${errorId(error)}`);
  }

  const response = await openAIResponse.json();
  const usage = extractOpenAIUsage(response);

  const outputText = response.output_text || response.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '';
  if (!outputText) {
    throw new Error('missing_creative_director_output');
  }

  let parsed;
  try {
    parsed = JSON.parse(outputText);
  } catch (err) {
    throw new Error(`invalid_creative_director_json: ${err.message}`);
  }

  const diagnostico = validateCreativeDirector(parsed);
  if (!diagnostico) {
    throw new Error('invalid_creative_director_schema');
  }

  const latencyMs = Date.now() - startTime;
  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'creative_director',
      provider: 'openai',
      exactModel: usage.resolvedModel || model,
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      providerRequestId: usage.providerRequestId,
      latencyMs,
      success: true,
      fallbackUsed: false,
      metadata: { language: idioma, styleName: estiloNome }
    });
  }

  return diagnostico;
}

export async function generateWithGemini({
  apiKey,
  briefing,
  identityContext,
  estiloId,
  estiloNome,
  mensagemGemini,
  idioma,
  journeyId,
  startTime,
  fallbackReason
}) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `Você é a AI Creative Director da The Brand Box. Gere um diagnóstico criativo estratégico, humano e específico para o briefing recebido.
Responda exclusivamente no idioma atual da aplicação: ${idioma}.

REGRAS CRÍTICAS DE BRANDING:
1. Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing.
2. REGRA DE PRIORIDADE: O campo de público (briefing.publico) é a verdade absoluta sobre a faixa etária. Se a área de atuação for Moda/Roupa e o público for Adulto, não escreva absolutamente nada sobre crianças, moda infantil ou infância.
3. O nome pessoal/de contato da usuária foi removido do briefing e nunca deve ser tratado como nome público da marca. Use somente identityContext.brandName como nome público da marca.
4. identityContext.styleName é o nome da direção criativa e nunca deve ser interpretado como nome de marca; diferenças entre brandName e styleName não são contradições.
5. Seja objetiva, elegante, inspiradora e preserve o estilo selecionado pelo Gemini.

DADOS RECEBIDOS:
- identityContext: ${JSON.stringify(identityContext)}
- briefing: ${JSON.stringify(briefing)}
- estiloSelecionado: ${JSON.stringify({ estiloId, styleName: estiloNome, mensagem: mensagemGemini })}

Você DEVE responder EXCLUSIVAMENTE em formato JSON com as 7 chaves exatas abaixo (sem markdown, sem texto fora do JSON):
{
  "diagnostico": "Resumo da essência da marca em no máximo duas frases.",
  "personalidade": ["palavra 1", "palavra 2", "palavra 3"],
  "objetivosEmocionais": ["objetivo 1", "objetivo 2"],
  "expectativasPublico": ["expectativa 1", "expectativa 2"],
  "riscosEvitar": ["risco 1", "risco 2"],
  "porqueEsseEstilo": "Explicação curta e específica sobre por que o estilo escolhido combina com a marca.",
  "direcaoVisual": "Resumo da direção visual recomendada."
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  if (!responseText) {
    throw new Error('missing_gemini_creative_director_output');
  }

  let parsed;
  try {
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error(`invalid_gemini_creative_director_json: ${err.message}`);
  }

  const diagnostico = validateCreativeDirector(parsed);
  if (!diagnostico) {
    throw new Error('invalid_gemini_creative_director_schema');
  }

  const latencyMs = Date.now() - startTime;
  const usage = extractGoogleUsage(result.response);

  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: 'creative_director',
      provider: 'google',
      exactModel: 'gemini-2.5-flash',
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      latencyMs,
      success: true,
      fallbackUsed: true,
      retryReason: fallbackReason || 'openai_fallback',
      metadata: { language: idioma, styleName: estiloNome }
    });
  }

  return diagnostico;
}

export async function POST(req) {
  let journeyId = null;
  let idioma = 'pt';
  let estiloNome = '';
  const startTime = Date.now();

  try {
    const openAIApiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '').trim() : '';
    const openAIModel = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';
    const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/["']/g, '').trim() : '';

    if ((!openAIApiKey || !openAIModel) && !geminiApiKey) {
      return Response.json({ error: 'creative_director_unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const briefing = buildBriefing(body.formData);
    const estiloId = body.estiloId;
    estiloNome = cleanText(body.estiloNome);
    idioma = cleanText(body.idioma || body.lang || 'pt');
    const requestKey = cleanText(body.requestKey);
    journeyId = cleanText(body.journeyId || body.creativeDirectorJourneyId || (requestKey ? requestKey.split(':')[1] : null));

    const identityContext = {
      brandName: briefing.brandName,
      styleName: estiloNome,
      contactName: null,
      contactNamePolicy: 'contactName é o nome pessoal/de contato da usuária, foi removido do briefing e deve ser ignorado em decisões criativas.',
      styleNamePolicy: 'styleName é o nome da direção criativa selecionada, nunca é nome de marca. Diferenças entre brandName e styleName não são contradições.'
    };
    const mensagemGemini = cleanText(body.mensagem);

    if (!estiloId || !estiloNome || !mensagemGemini) {
      return Response.json({ error: 'invalid_creative_director_payload' }, { status: 400 });
    }

    const generated = await getOrCreateCreativeDirector(requestKey, async () => {
      let openAiError = null;

      // 1. Primary provider: OpenAI
      if (openAIApiKey && openAIModel) {
        try {
          return await generateWithOpenAI({
            apiKey: openAIApiKey,
            model: openAIModel,
            briefing,
            identityContext,
            estiloId,
            estiloNome,
            mensagemGemini,
            idioma,
            journeyId,
            startTime
          });
        } catch (err) {
          openAiError = err;
          console.warn('OpenAI Creative Director failed, falling over to Gemini:', err.message);
        }
      } else {
        openAiError = new Error('openai_not_configured');
      }

      // 2. Real fallback provider: Google Gemini
      if (geminiApiKey) {
        try {
          return await generateWithGemini({
            apiKey: geminiApiKey,
            briefing,
            identityContext,
            estiloId,
            estiloNome,
            mensagemGemini,
            idioma,
            journeyId,
            startTime,
            fallbackReason: openAiError ? openAiError.message : 'openai_unconfigured'
          });
        } catch (geminiErr) {
          console.error('Gemini Creative Director fallback failed:', geminiErr.message);
          throw Object.assign(new Error('creative_director_all_providers_failed'), { publicCode: 'creative_director_failed' });
        }
      }

      throw Object.assign(new Error('creative_director_unavailable'), { publicCode: 'creative_director_unavailable' });
    });

    return Response.json(generated.value, { headers: { 'X-Creative-Director-Cache': generated.cache } });
  } catch (error) {
    console.error('Creative Director AI error:', { errorId: errorId(error) });
    const latencyMs = Date.now() - startTime;
    if (journeyId) {
      logAiUsage({
        journeyId,
        operationType: 'creative_director',
        provider: 'fallback',
        exactModel: 'none',
        latencyMs,
        success: false,
        errorCode: errorId(error),
        metadata: { language: idioma, styleName: estiloNome }
      });
    }
    const status = error.publicCode === 'creative_director_unavailable' ? 503 : 502;
    return Response.json({ error: error.publicCode || 'creative_director_failed' }, { status });
  }
}

