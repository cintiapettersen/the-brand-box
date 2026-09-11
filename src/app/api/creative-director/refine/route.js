import { GoogleGenerativeAI } from '@google/generative-ai';
import { ESTILO_NOME_BY_ID } from '../../../../lib/styleIcons.js';
import { acquireCreativeDirectorRequest } from '../requestGuards.js';
import { logAiUsage, extractOpenAIUsage, extractGoogleUsage } from '../../../../lib/aiTelemetry.js';

export const DECISOES = ['confirmar', 'ajustar', 'sugerir_alternativa'];

export const QUESTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tensaoIdentificada', 'pergunta', 'porquePerguntar'],
  properties: {
    tensaoIdentificada: { type: ['string', 'null'] },
    pergunta: { type: 'string' },
    porquePerguntar: { type: 'string' }
  }
};

export const RESOLUTION_SCHEMA = {
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

export const ESTILOS_DISPONIVEIS = Object.entries(ESTILO_NOME_BY_ID).map(([id, nome]) => ({ id: Number(id), nome }));

export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeBriefing(formData = {}) {
  return {
    brandName: formData.marca || null,
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

export function normalizeResultado(resultadoFinal = {}) {
  return {
    estiloId: resultadoFinal.estiloId || null,
    styleName: resultadoFinal.estiloNome || null,
    mensagem: resultadoFinal.mensagem || null,
    paletaAtualSelecionadaPeloCliente: resultadoFinal.selectedPalette && Array.isArray(resultadoFinal.selectedPalette.hex) ? { id: resultadoFinal.selectedPalette.id || null, name: resultadoFinal.selectedPalette.name || null, hex: resultadoFinal.selectedPalette.hex } : null,
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

export function buildIdentityContext(formData = {}, resultadoFinal = {}) {
  return {
    brandName: formData.marca || null,
    styleName: resultadoFinal.estiloNome || null,
    contactName: null,
    contactNamePolicy: 'contactName é o nome pessoal/de contato da usuária, foi removido do briefing e deve ser ignorado em decisões criativas.',
    styleNamePolicy: 'styleName é o nome da direção criativa selecionada, nunca é nome de marca. Diferenças entre brandName e styleName não são contradições.'
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

export function validateQuestion(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const question = {
    tensaoIdentificada: payload.tensaoIdentificada === null || payload.tensaoIdentificada === undefined ? null : cleanText(payload.tensaoIdentificada),
    pergunta: cleanText(payload.pergunta),
    porquePerguntar: cleanText(payload.porquePerguntar)
  };
  return question.pergunta && question.porquePerguntar ? question : null;
}

export function validateResolution(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const estiloAlternativoId = payload.estiloAlternativoId === null || payload.estiloAlternativoId === undefined ? null : Number(payload.estiloAlternativoId);
  const estiloAlternativoNome = payload.estiloAlternativoNome === null || payload.estiloAlternativoNome === undefined ? null : cleanText(payload.estiloAlternativoNome);
  const estiloAlternativoValido = (estiloAlternativoId === null && estiloAlternativoNome === null)
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

export function buildQuestionPrompt({ formData, resultadoFinal, idioma }) {
  return JSON.stringify({
    tarefa: 'Identifique uma tensão real do briefing que ainda precise ser esclarecida antes de refinar a direção criativa.',
    idioma,
    identityContext: buildIdentityContext(formData, resultadoFinal),
    briefing: normalizeBriefing(formData),
    resultadoAtual: normalizeResultado(resultadoFinal),
    regras: [
      'Compare todas as respostas já fornecidas antes de perguntar.',
      'O nome pessoal/de contato da usuária foi removido do briefing e não deve ser usado para criar tensão ou direção visual.',
      'Use somente identityContext.brandName como nome público da marca; marca pessoal não autoriza assumir o nome de contato como marca.',
      'identityContext.styleName é nome da direção criativa, nunca é nome de marca; diferenças entre brandName e styleName não são contradições.',
      'Nunca crie tensão baseada apenas na existência de brandName e styleName.',
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

export function buildResolutionPrompt({ formData, resultadoFinal, pergunta, respostaUsuario, idioma }) {
  return JSON.stringify({
    tarefa: 'Analise a resposta da usuária e refine a direção criativa sem aplicar alterações automaticamente.',
    idioma,
    identityContext: buildIdentityContext(formData, resultadoFinal),
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
      'Quando paletaAtualSelecionadaPeloCliente existir, ela é a escolha canônica atual do cliente; use seus HEX completos e nunca a substitua por sugestão inicial.',
      'Não altere resultadoFinal.estiloId nem resultadoFinal.estiloNome.',
      'O nome pessoal/de contato da usuária foi removido do briefing; use somente identityContext.brandName como nome público da marca.',
      'identityContext.styleName é direção criativa, não marca; não trate diferença entre brandName e styleName como conflito.'
    ]
  });
}

async function callOpenAIRefine({ schema, schemaName, prompt, idioma, journeyId, startTime }) {
  const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.replace(/["']/g, '') : '';
  const model = process.env.OPENAI_MODEL ? process.env.OPENAI_MODEL.trim() : '';

  if (!apiKey || !model) {
    throw new Error('openai_not_configured');
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
          content: [{ type: 'input_text', text: `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma ${idioma}.` }]
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
    throw new Error(`OpenAI HTTP ${openAIResponse.status}: ${JSON.stringify(error)}`);
  }

  const response = await openAIResponse.json();
  const usage = extractOpenAIUsage(response);

  const outputText = extractOutputText(response);
  if (!outputText) {
    throw new Error('missing_creative_director_refine_output');
  }

  const payload = JSON.parse(outputText);

  const latencyMs = Date.now() - startTime;
  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: schemaName === 'creative_director_refinement_question' ? 'creative_direction_refinement_question' : 'creative_direction_refinement_resolution',
      provider: 'openai',
      exactModel: usage.resolvedModel || model,
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      providerRequestId: usage.providerRequestId,
      latencyMs,
      success: true,
      fallbackUsed: false,
      metadata: { language: idioma, phase: schemaName }
    });
  }

  return payload;
}

async function callGeminiRefine({ phase, prompt, schemaName, idioma, journeyId, startTime, fallbackReason }) {
  const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/["']/g, '').trim() : '';
  if (!geminiApiKey) {
    throw new Error('gemini_not_configured');
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  let formatInstruction = '';
  if (phase === 'question') {
    formatInstruction = `Você DEVE responder EXCLUSIVAMENTE em formato JSON com as 3 chaves abaixo:
{
  "tensaoIdentificada": "Descrição clara da tensão encontrada entre as respostas (ou null se tudo estiver harmonioso e sem contradição)",
  "pergunta": "Pergunta estratégica, humana e direta para a cliente resolver a direção",
  "porquePerguntar": "Justificativa curta do porquê essa resposta é essencial para calibrar o design"
}`;
  } else {
    formatInstruction = `Você DEVE responder EXCLUSIVAMENTE em formato JSON com as 9 chaves abaixo:
{
  "decisao": "confirmar" ou "ajustar" ou "sugerir_alternativa",
  "resumoDecisao": "Resumo executivo da decisão criativa em 1-2 frases",
  "direcaoRefinada": "Diretriz refinada clara para a identidade visual",
  "impactoPaleta": "Como isso impacta as cores",
  "impactoTipografia": "Como isso impacta a tipografia",
  "impactoComposicao": "Como isso impacta a composição",
  "impactoEstampa": "Como isso impacta as estampas",
  "estiloAlternativoId": null (ou número de 1 a 11 se decisao for sugerir_alternativa),
  "estiloAlternativoNome": null (ou string do nome do estilo se decisao for sugerir_alternativa)
}`;
  }

  const fullPrompt = `Você é a AI Creative Director da The Brand Box. Responda exclusivamente no idioma: ${idioma}.
Analise os dados abaixo com olhar estratégico e consultivo.

DADOS DA TAREFA:
${prompt}

${formatInstruction}`;

  const result = await model.generateContent(fullPrompt);
  const responseText = result.response.text();
  if (!responseText) {
    throw new Error('missing_gemini_refine_output');
  }

  const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const payload = JSON.parse(cleanJson);

  const latencyMs = Date.now() - startTime;
  const usage = extractGoogleUsage(result.response);

  if (journeyId) {
    logAiUsage({
      journeyId,
      operationType: schemaName === 'creative_director_refinement_question' ? 'creative_direction_refinement_question' : 'creative_direction_refinement_resolution',
      provider: 'google',
      exactModel: 'gemini-2.5-flash',
      inputTokens: usage.inputTokens,
      cachedInputTokens: usage.cachedInputTokens,
      outputTokens: usage.outputTokens,
      latencyMs,
      success: true,
      fallbackUsed: true,
      retryReason: fallbackReason || 'openai_fallback',
      metadata: { language: idioma, phase: schemaName }
    });
  }

  return payload;
}

export async function POST(req) {
  let requestGuard;
  const startTime = Date.now();
  let journeyId = null;
  let idioma = 'pt';
  let phase = '';

  try {
    const body = await req.json();
    phase = cleanText(body.phase);
    idioma = cleanText(body.idioma || body.lang || 'pt-BR');
    const requestKey = cleanText(body.requestKey);
    journeyId = cleanText(body.journeyId || body.creativeDirectorJourneyId || (requestKey ? requestKey.split(':')[1] : null));

    if (phase !== 'question' && phase !== 'resolution') {
      return Response.json({ error: 'invalid_refinement_phase' }, { status: 400 });
    }

    if (phase === 'resolution' && !cleanText(body.respostaUsuario)) {
      return Response.json({ error: 'empty_refinement_answer' }, { status: 400 });
    }

    requestGuard = acquireCreativeDirectorRequest(requestKey);
    if (!requestGuard.ok) {
      return Response.json({ error: requestGuard.reason }, { status: 429 });
    }

    const isQuestion = phase === 'question';
    const schema = isQuestion ? QUESTION_SCHEMA : RESOLUTION_SCHEMA;
    const schemaName = isQuestion ? 'creative_director_refinement_question' : 'creative_director_refinement_resolution';
    const prompt = isQuestion
      ? buildQuestionPrompt({ formData: body.formData, resultadoFinal: body.resultadoFinal, idioma })
      : buildResolutionPrompt({
        formData: body.formData,
        resultadoFinal: body.resultadoFinal,
        pergunta: cleanText(body.pergunta),
        respostaUsuario: cleanText(body.respostaUsuario),
        idioma
      });

    let payload = null;
    let openAiError = null;

    // 1. Primary provider: OpenAI
    try {
      payload = await callOpenAIRefine({ schema, schemaName, prompt, idioma, journeyId, startTime });
      const validated = isQuestion ? validateQuestion(payload) : validateResolution(payload);
      if (validated) {
        requestGuard.release({ completed: true });
        return Response.json(validated);
      }
      openAiError = new Error('invalid_openai_refine_schema');
    } catch (err) {
      openAiError = err;
      console.warn(`OpenAI Creative Director refine (${phase}) failed, falling over to Gemini:`, err.message);
    }

    // 2. Fallback provider: Google Gemini
    try {
      payload = await callGeminiRefine({
        phase,
        prompt,
        schemaName,
        idioma,
        journeyId,
        startTime,
        fallbackReason: openAiError?.message || 'openai_fallback'
      });
      const validated = isQuestion ? validateQuestion(payload) : validateResolution(payload);
      if (validated) {
        requestGuard.release({ completed: true });
        return Response.json(validated);
      }
      console.error(`Gemini Creative Director refine (${phase}) returned invalid schema`);
    } catch (geminiErr) {
      console.error(`Gemini Creative Director refine (${phase}) fallback failed:`, geminiErr.message);
    }

    if (journeyId) {
      logAiUsage({
        journeyId,
        operationType: isQuestion ? 'creative_direction_refinement_question' : 'creative_direction_refinement_resolution',
        provider: 'fallback',
        exactModel: 'none',
        latencyMs: Date.now() - startTime,
        success: false,
        errorCode: 'creative_director_refine_failed',
        metadata: { language: idioma, phase: schemaName }
      });
    }

    requestGuard.release({ completed: true });
    return Response.json({ error: 'creative_director_refine_failed' }, { status: 502 });
  } catch (error) {
    console.error('Creative Director refinement error:', { message: error.message });
    return Response.json({ error: 'creative_director_refine_failed' }, { status: 502 });
  } finally {
    requestGuard?.release?.();
  }
}
