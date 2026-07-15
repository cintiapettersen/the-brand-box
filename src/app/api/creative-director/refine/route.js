import { ESTILO_NOME_BY_ID } from '../../../../lib/styleIcons.js';

const DECISOES = ['confirmar', 'ajustar', 'sugerir_alternativa'];

const QUESTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tensaoIdentificada', 'pergunta', 'porquePerguntar'],
  properties: {
    tensaoIdentificada: { type: ['string', 'null'] },
    pergunta: { type: 'string' },
    porquePerguntar: { type: 'string' }
  }
};

const RESOLUTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'decisao',
    'resumoDecisao',
    'direcaoRefinada',
    'impactoPaleta',
    'impactoTipografia',
    'impactoComposicao',
    'impactoEstampa',
    'estiloAlternativoId',
    'estiloAlternativoNome'
  ],
  properties: {
    decisao: { type: 'string', enum: DECISOES },
    resumoDecisao: { type: 'string' },
    direcaoRefinada: { type: 'string' },
    impactoPaleta: { type: 'string' },
    impactoTipografia: { type: 'string' },
    impactoComposicao: { type: 'string' },
    impactoEstampa: { type: 'string' },
    estiloAlternativoId: { type: ['number', 'null'] },
    estiloAlternativoNome: { type: ['string', 'null'] }
  }
};

const ESTILOS_DISPONIVEIS = Object.entries(ESTILO_NOME_BY_ID).map(([id, nome]) => ({ id: Number(id), nome }));

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeBriefing(formData = {}) {
  return {
    nome: formData.nome || null,
    marca: formData.marca || null,
    atuacao: [formData.atuacao, formData.atuacaoOutra].filter(Boolean).join(' - ') || null,
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

function normalizeResultado(resultadoFinal = {}) {
  return {
    estiloId: resultadoFinal.estiloId || null,
    estiloNome: resultadoFinal.estiloNome || null,
    mensagem: resultadoFinal.mensagem || null,
    creativeDirector: resultadoFinal.creativeDirector ? {
      diagnostico: resultadoFinal.creativeDirector.diagnostico || null,
      personalidade: resultadoFinal.creativeDirector.personalidade || [],
      objetivosEmocionais: resultadoFinal.creativeDirector.objetivosEmocionais || [],
      expectativasPublico: resultadoFinal.creativeDirector.expectativasPublico || [],
      riscosEvitar: resultadoFinal.creativeDirector.riscosEvitar || [],
      porqueEsseEstilo: resultadoFinal.creativeDirector.porqueEsseEstilo || null,
      direcaoVisual: resultadoFinal.creativeDirector.direcaoVisual || null
    } : null
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
    return `Unable to read OpenAI refinement error body: ${error.message}`;
  }
}

function extractOutputText(response) {
  return response.output_text || response.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '';
}

function validateQuestion(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const question = {
    tensaoIdentificada: payload.tensaoIdentificada === null ? null : cleanText(payload.tensaoIdentificada),
    pergunta: cleanText(payload.pergunta),
    porquePerguntar: cleanText(payload.porquePerguntar)
  };
  return question.pergunta && question.porquePerguntar ? question : null;
}

function validateResolution(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const estiloAlternativoId = payload.estiloAlternativoId === null ? null : Number(payload.estiloAlternativoId);
  const estiloAlternativoNome = payload.estiloAlternativoNome === null ? null : cleanText(payload.estiloAlternativoNome);
  const estiloAlternativoValido = estiloAlternativoId === null && estiloAlternativoNome === null
    || ESTILOS_DISPONIVEIS.some(estilo => estilo.id === estiloAlternativoId && estilo.nome === estiloAlternativoNome);

  const resolution = {
    decisao: cleanText(payload.decisao),
    resumoDecisao: cleanText(payload.resumoDecisao),
    direcaoRefinada: cleanText(payload.direcaoRefinada),
    impactoPaleta: cleanText(payload.impactoPaleta),
    impactoTipografia: cleanText(payload.impactoTipografia),
    impactoComposicao: cleanText(payload.impactoComposicao),
    impactoEstampa: cleanText(payload.impactoEstampa),
    estiloAlternativoId,
    estiloAlternativoNome
  };

  const hasRequiredText = ['resumoDecisao', 'direcaoRefinada', 'impactoPaleta', 'impactoTipografia', 'impactoComposicao', 'impactoEstampa'].every(field => resolution[field]);

  return DECISOES.includes(resolution.decisao) && hasRequiredText && estiloAlternativoValido ? resolution : null;
}

function buildQuestionPrompt({ formData, resultadoFinal, idioma }) {
  return JSON.stringify({
    tarefa: 'Identifique uma tensão real do briefing que ainda precise ser esclarecida antes de refinar a direção criativa.',
    idioma,
    briefing: normalizeBriefing(formData),
    resultadoAtual: normalizeResultado(resultadoFinal),
    regras: [
      'Compare todas as respostas já fornecidas antes de perguntar.',
      'Não repita nem reformule perguntas já respondidas no briefing.',
      'Só pergunte sobre contradições, ambiguidades ou prioridades ainda não resolvidas.',
      'Mencione naturalmente o contexto específico da tensão encontrada.',
      'Faça uma única pergunta personalizada.',
      'Se o briefing estiver coerente e sem tensão relevante, retorne tensaoIdentificada null e a pergunta padrão solicitada.'
    ],
    fallbackSemTensao: {
      tensaoIdentificada: null,
      pergunta: 'Qual aspecto desta direção você gostaria de tornar mais marcante: paleta, tipografia, composição ou estampa?',
      porquePerguntar: 'Essa escolha define onde concentrar a personalidade visual da marca sem alterar a direção principal.'
    }
  });
}

function buildResolutionPrompt({ formData, resultadoFinal, pergunta, respostaUsuario, idioma }) {
  return JSON.stringify({
    tarefa: 'Analise a resposta da usuária e refine a direção criativa sem aplicar alterações automaticamente.',
    idioma,
    briefing: normalizeBriefing(formData),
    resultadoAtual: normalizeResultado(resultadoFinal),
    perguntaFeita: pergunta,
    respostaUsuario,
    estilosDisponiveis: ESTILOS_DISPONIVEIS,
    regras: [
      'Decida entre confirmar, ajustar ou sugerir_alternativa.',
      'Só sugira estilo alternativo se a resposta realmente indicar desalinhamento com o estilo atual.',
      'Se sugerir alternativa, use exatamente um dos estilosDisponiveis e preencha id e nome correspondentes.',
      'Se não sugerir alternativa, retorne estiloAlternativoId null e estiloAlternativoNome null.',
      'Não invente estilo novo.',
      'Explique impacto em paleta, tipografia, composição e estampa.',
      'Não altere resultadoFinal.estiloId nem resultadoFinal.estiloNome.'
    ]
  });
}

async function callOpenAI({ schema, schemaName, prompt, idioma }) {
  const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '') : '';
  const model = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';

  if (!apiKey || !model) {
    return { errorResponse: Response.json({ error: 'creative_director_refine_unavailable' }, { status: 503 }) };
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
              text: `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma ${idioma}. Use somente os dados recebidos, não invente fatos, não exponha raciocínio interno e preserve o fluxo atual do produto.`
            }
          ]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: prompt }]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: schemaName,
          strict: true,
          schema
        }
      }
    })
  });

  if (!openAIResponse.ok) {
    const error = await readOpenAIError(openAIResponse);
    console.error('OpenAI Creative Director refinement request failed:', {
      phase: schemaName,
      status: openAIResponse.status,
      error
    });
    return { errorResponse: Response.json({ error: 'creative_director_refine_openai_error' }, { status: 502 }) };
  }

  const response = await openAIResponse.json();
  const outputText = extractOutputText(response);

  if (!outputText) {
    console.error('OpenAI Creative Director refinement missing output_text:', { phase: schemaName, status: openAIResponse.status });
    return { errorResponse: Response.json({ error: 'missing_creative_director_refine_output' }, { status: 502 }) };
  }

  try {
    return { payload: JSON.parse(outputText) };
  } catch (error) {
    console.error('OpenAI Creative Director refinement returned invalid JSON:', {
      phase: schemaName,
      status: openAIResponse.status,
      error: error.message
    });
    return { errorResponse: Response.json({ error: 'invalid_creative_director_refine_json' }, { status: 502 }) };
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const phase = cleanText(body.phase);
    const idioma = cleanText(body.idioma || body.lang || 'pt-BR');

    if (phase === 'resolution' && !cleanText(body.respostaUsuario)) {
      return Response.json({ error: 'empty_refinement_answer' }, { status: 400 });
    }

    if (phase === 'question') {
      const { payload, errorResponse } = await callOpenAI({
        schema: QUESTION_SCHEMA,
        schemaName: 'creative_director_refinement_question',
        prompt: buildQuestionPrompt({ formData: body.formData, resultadoFinal: body.resultadoFinal, idioma }),
        idioma
      });
      if (errorResponse) return errorResponse;

      const question = validateQuestion(payload);
      if (!question) {
        console.error('OpenAI Creative Director refinement question validation failed:', { receivedFields: Object.keys(payload || {}) });
        return Response.json({ error: 'invalid_refinement_question' }, { status: 502 });
      }
      return Response.json(question);
    }

    if (phase === 'resolution') {
      const { payload, errorResponse } = await callOpenAI({
        schema: RESOLUTION_SCHEMA,
        schemaName: 'creative_director_refinement_resolution',
        prompt: buildResolutionPrompt({
          formData: body.formData,
          resultadoFinal: body.resultadoFinal,
          pergunta: cleanText(body.pergunta),
          respostaUsuario: cleanText(body.respostaUsuario),
          idioma
        }),
        idioma
      });
      if (errorResponse) return errorResponse;

      const resolution = validateResolution(payload);
      if (!resolution) {
        console.error('OpenAI Creative Director refinement resolution validation failed:', { receivedFields: Object.keys(payload || {}) });
        return Response.json({ error: 'invalid_refinement_resolution' }, { status: 502 });
      }
      return Response.json(resolution);
    }

    return Response.json({ error: 'invalid_refinement_phase' }, { status: 400 });
  } catch (error) {
    console.error('Creative Director refinement error:', { message: error.message });
    return Response.json({ error: 'creative_director_refine_failed' }, { status: 502 });
  }
}
