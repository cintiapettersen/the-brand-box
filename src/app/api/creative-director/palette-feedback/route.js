import { acquireCreativeDirectorRequest } from '../requestGuards.js';

const PALETTE_FEEDBACK_SCHEMA = {
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

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 5) return null;

  const normalized = colors.map(cleanText);
  return normalized.every(color => /^#[0-9a-f]{6}$/i.test(color)) ? normalized : null;
}

function normalizeBriefing(formData = {}) {
  return {
    brandName: cleanText(formData.marca) || null,
    segment: [formData.atuacao, formData.atuacaoOutra].map(cleanText).filter(Boolean).join(' - ') || null,
    audience: cleanText(formData.publico) || null
  };
}

function normalizeCreativeDirector(creativeDirector = {}) {
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

function validateFeedback(payload, idioma) {
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

export async function POST(req) {
  let requestGuard;
  try {
    const body = await req.json();
    const idioma = cleanText(body.idioma || body.lang || 'pt-BR');
    const colors = normalizeColors(body.palette);
    const primaryColor = cleanText(body.primaryColor);

    if (!idioma || !colors || !colors.includes(primaryColor)) {
      return Response.json({ error: 'invalid_palette_feedback_payload' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/['"]/g, '') : '';
    const model = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';
    if (!apiKey || !model) {
      return Response.json({ error: 'creative_director_palette_feedback_unavailable' }, { status: 503 });
    }

    requestGuard = acquireCreativeDirectorRequest(cleanText(body.requestKey));
    if (!requestGuard.ok) {
      return Response.json({ error: requestGuard.reason }, { status: 429 });
    }

    const briefing = normalizeBriefing(body.formData);
    const creativeDirector = normalizeCreativeDirector(body.resultadoFinal?.creativeDirector);
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
              text: `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma ${idioma}. Faça uma leitura breve, específica e consultiva da paleta já escolhida; não sugira mudanças, não bloqueie decisões e não exponha raciocínio interno. Use somente brandName como nome público da marca e não invente fatos.`
            }]
          },
          {
            role: 'user',
            content: [{
              type: 'input_text',
              text: JSON.stringify({
                tarefa: 'Crie um feedback curto para aparecer logo após a escolha da cor principal.',
                idioma,
                briefing,
                direcaoCriativa: {
                  styleName: cleanText(body.resultadoFinal?.estiloNome) || null,
                  mensagem: cleanText(body.resultadoFinal?.mensagem) || null,
                  creativeDirector
                },
                paletaEscolhida: colors,
                corPrincipal: primaryColor,
                formatoEsperado: {
                  language: idioma,
                  summary: 'Leitura geral da paleta em no máximo 2 frases curtas.',
                  strength: 'Principal ponto forte da combinação em 1 frase curta.',
                  caution: 'Ponto de atenção prático, sem recomendar trocar cores, em 1 frase curta.'
                }
              })
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
      console.error('OpenAI Creative Director palette feedback request failed:', { status: response.status, error: await readOpenAIError(response) });
      requestGuard.release({ completed: true });
      return Response.json({ error: 'creative_director_palette_feedback_openai_error' }, { status: 502 });
    }

    const outputText = extractOutputText(await response.json());
    if (!outputText) {
      requestGuard.release({ completed: true });
      return Response.json({ error: 'missing_palette_feedback_output' }, { status: 502 });
    }

    let payload;
    try {
      payload = JSON.parse(outputText);
    } catch (error) {
      console.error('OpenAI Creative Director palette feedback returned invalid JSON:', { error: error.message });
      requestGuard.release({ completed: true });
      return Response.json({ error: 'invalid_palette_feedback_json' }, { status: 502 });
    }

    const feedback = validateFeedback(payload, idioma);
    if (!feedback) {
      console.error('OpenAI Creative Director palette feedback validation failed:', { receivedFields: Object.keys(payload || {}) });
      requestGuard.release({ completed: true });
      return Response.json({ error: 'invalid_palette_feedback_response' }, { status: 502 });
    }

    requestGuard.release({ completed: true });
    return Response.json(feedback);
  } catch (error) {
    console.error('Creative Director palette feedback error:', { message: error.message });
    return Response.json({ error: 'creative_director_palette_feedback_failed' }, { status: 502 });
  } finally {
    requestGuard?.release?.();
  }
}
