const REQUIRED_ARRAY_FIELDS = ['personalidade', 'objetivosEmocionais', 'expectativasPublico', 'riscosEvitar'];
const REQUIRED_STRING_FIELDS = ['diagnostico', 'porqueEsseEstilo', 'direcaoVisual'];

const creativeDirectorSchema = {
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

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeArray(value, size) {
  if (!Array.isArray(value)) return [];
  return value.map(cleanText).filter(Boolean).slice(0, size);
}

function validateCreativeDirector(payload) {
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

function buildBriefing(formData = {}) {
  return {
    nome: formData.nome || null,
    marca: formData.marca || null,
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

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '') : '';
    const model = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';

    if (!apiKey || !model) {
      return Response.json({ error: 'creative_director_unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const briefing = buildBriefing(body.formData);
    const estiloId = body.estiloId;
    const estiloNome = cleanText(body.estiloNome);
    const mensagemGemini = cleanText(body.mensagem);
    const idioma = cleanText(body.idioma || body.lang || 'pt');

    if (!estiloId || !estiloNome || !mensagemGemini) {
      return Response.json({ error: 'invalid_creative_director_payload' }, { status: 400 });
    }

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
              text: `Você é uma AI Creative Director da The Brand Box. Gere um diagnóstico criativo estratégico, humano e específico para o briefing recebido. Responda no idioma atual da aplicação: ${idioma}. Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing. Se um dado estiver ausente, simplesmente não o use. Seja objetiva e preserve o estilo selecionado pelo Gemini.`
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                briefing,
                estiloSelecionadoPeloGemini: { estiloId, estiloNome, mensagem: mensagemGemini },
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
      console.error('OpenAI Creative Director request failed:', {
        status: openAIResponse.status,
        error
      });

      return Response.json({ error: 'creative_director_openai_error' }, { status: 502 });
    }

    const response = await openAIResponse.json();
    const outputText = response.output_text || response.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '';

    if (!outputText) {
      console.error('OpenAI Creative Director response missing output_text:', {
        status: openAIResponse.status
      });

      return Response.json({ error: 'missing_creative_director_output' }, { status: 502 });
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch (error) {
      console.error('OpenAI Creative Director returned invalid JSON:', {
        status: openAIResponse.status,
        error: error.message
      });

      return Response.json({ error: 'invalid_creative_director_json' }, { status: 502 });
    }

    const diagnostico = validateCreativeDirector(parsed);

    if (!diagnostico) {
      console.error('OpenAI Creative Director schema validation failed:', {
        status: openAIResponse.status,
        receivedFields: Object.keys(parsed || {})
      });

      return Response.json({ error: 'invalid_creative_director_response' }, { status: 502 });
    }

    return Response.json(diagnostico);
  } catch (error) {
    console.error('Creative Director AI error:', error);
    return Response.json({ error: 'creative_director_failed' }, { status: 502 });
  }
}
