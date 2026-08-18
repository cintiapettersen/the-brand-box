import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Permite até 60 segundos para processamento de IA

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function sanitizeError(msg) {
  if (!msg) return 'unknown_error';
  return String(msg).replace(/api[-_]?key=[^&\s]+/gi, 'api_key=REDACTED');
}

/**
 * Fallback inteligente e diverso quando o parsing de IA falha.
 * Garante que NUNCA haja 3 itens da mesma família semântica (ex: folha/broto/semente).
 */
function getDiverseFallbackMotifs(areaAtuacao, estiloNome) {
  const areaLower = (areaAtuacao || '').toLowerCase();
  const estiloLower = (estiloNome || '').toLowerCase();

  if (areaLower.includes('pediat') || areaLower.includes('infant') || areaLower.includes('crian') || areaLower.includes('baby')) {
    return [
      {
        title: "Estrela Suave",
        origin: "Inspirado no ritmo lúdico e pontilhado observado na sua estampa",
        visualDescription: "a single minimal clean vector outline sparkle star icon, centered on pure white background, fine lineart"
      },
      {
        title: "Arco Protetor",
        origin: "Síntese geométrica das curvas acolhedoras da sua identidade visual",
        visualDescription: "a single refined minimal vector lineart protective arc shape, centered on pure white background"
      },
      {
        title: "Coração Acolhedor",
        origin: "Emblema contextual desenhado para o cuidado afetivo do seu nicho",
        visualDescription: "a single clean modern vector outline heart emblem, centered on pure white background"
      }
    ];
  }

  if (areaLower.includes('odonto') || areaLower.includes('dente') || areaLower.includes('sorriso')) {
    return [
      {
        title: "Curva Harmoniosa",
        origin: "Inspirado nas linhas fluidas e espaçamento observado na sua estampa",
        visualDescription: "a single clean minimal vector lineart curved arc icon, centered on pure white background"
      },
      {
        title: "Ponto Radiante",
        origin: "Síntese geométrica minimalista da luminosidade da sua marca",
        visualDescription: "a single refined vector outline four-point starburst icon, centered on pure white background"
      },
      {
        title: "Selo de Precisão",
        origin: "Emblema atemporal de apoio profissional ao seu universo visual",
        visualDescription: "a single clean geometric shield seal vector icon, centered on pure white background"
      }
    ];
  }

  if (areaLower.includes('nutri') || areaLower.includes('aliment')) {
    return [
      {
        title: "Forma Orgânica",
        origin: "Inspirado no contorno fluido e natural observado na sua estampa",
        visualDescription: "a single clean minimal vector outline organic pebble leaf curve, centered on pure white background"
      },
      {
        title: "Círculo de Equilíbrio",
        origin: "Síntese geométrica do ritmo e harmonia da sua estampa",
        visualDescription: "a single refined minimal vector lineart balance circle emblem, centered on pure white background"
      },
      {
        title: "Emblema Vital",
        origin: "Elemento contextual desenhado em sintonia com a saúde integral",
        visualDescription: "a single modern clean vector geometric sunburst emblem, centered on pure white background"
      }
    ];
  }

  if (areaLower.includes('psi') || areaLower.includes('terap') || areaLower.includes('mente')) {
    return [
      {
        title: "Onda Serena",
        origin: "Inspirado na cadência fluida e suave observada na sua estampa",
        visualDescription: "a single clean minimal vector lineart gentle wave curve icon, centered on pure white background"
      },
      {
        title: "Arco de Encontro",
        origin: "Síntese geométrica do diálogo e conexão visual da sua marca",
        visualDescription: "a single refined vector lineart overlapping twin arcs icon, centered on pure white background"
      },
      {
        title: "Selo de Presença",
        origin: "Emblema atemporal desenhado para a escuta e acolhimento",
        visualDescription: "a single serene minimal vector circular sun emblem, centered on pure white background"
      }
    ];
  }

  // Fallback padrão para Medicina Geral / Adulto / Negócios / Essência Atemporal
  return [
    {
      title: "Linha Atemporal",
      origin: "Inspirado no ritmo equilibrado e na linguagem visual observada na sua estampa",
      visualDescription: "a single clean minimal vector lineart fluid contour curve, centered on pure white background, elegant hairline aesthetic"
    },
    {
      title: "Síntese Geométrica",
      origin: "Redução minimalista da estrutura e harmonia espacial da sua estampa",
      visualDescription: "a single refined geometric minimalist vector emblem with interlocking clean lines, centered on pure white background"
    },
    {
      title: "Emblema de Cuidado",
      origin: "Elemento contextual refinado e atemporal desenhado para a solidez da sua marca",
      visualDescription: "a single sophisticated modern vector seal icon with subtle clinical elegance, centered on pure white background"
    }
  ];
}

export async function POST(request) {
  let currentPhase = 'initialization';
  let motifsFound = 0;
  let imagesAttempted = 0;
  let imagesValid = 0;

  try {
    if (!ai) {
      return Response.json({
        error: "GEMINI_API_KEY não configurada no servidor.",
        telemetry: { phase: 'initialization', rejectionReason: 'missing_api_key' }
      }, { status: 500 });
    }

    const { 
      patternBase64, 
      patternMimeType = 'image/png', 
      primaryColor = '#1E293B',
      marca = '',
      areaAtuacao = '',
      estiloNome = '',
      sensacoes = [],
      elementosVisuais = []
    } = await request.json();

    if (!patternBase64) {
      return Response.json({
        error: "patternBase64 é obrigatório para extrair elementos da estampa.",
        telemetry: { phase: 'initialization', rejectionReason: 'missing_pattern_data' }
      }, { status: 400 });
    }

    const cleanBase64 = patternBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeType = patternMimeType || 'image/png';

    // Phase 1: Multimodal Brand & Pattern Analysis
    currentPhase = 'analysis';

    const sensacoesText = Array.isArray(sensacoes) ? sensacoes.join(', ') : (sensacoes || '');
    const elementosText = Array.isArray(elementosVisuais) ? elementosVisuais.join(', ') : (elementosVisuais || '');

    const analysisPrompt = `
You are a World-Class Brand Identity Creative Director specialized in luxury, healthcare, and contemporary visual identities.
Analyze this brand pattern image in the context of this brand:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}"
- Brand Style: "${estiloNome || 'Essência Atemporal'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

YOUR GOAL:
Generate exactly 3 DISTINCT, HIGHLY REFINED BRAND GRAPHIC ELEMENTS / ICONS born from this pattern and brand context.

STRICT MANDATORY RULES & GUARDRAILS:

1. PATTERN-FIRST INTERPRETATION (CRITICAL):
   - Inspect the pattern image deeply.
   - If the pattern has clear figurative motifs (e.g. stars, flowers, arches, hearts), translate them into clean vector elements.
   - If the pattern is abstract, geometric, terrazzo, linear, watercolor, or texture-based:
     PRIORITIZE: dominant shape language, contours, rhythm, line weight, spacing, and visual cadence.
     Create symbols that look like they were naturally extracted from the pattern's DNA.

2. DISTRIBUTION OF THE 3 OUTPUTS (MANDATORY DIVERSITY):
   You must produce EXACTLY 3 DIFFERENT CONCEPTUAL ROLES:
   - OPTION 1 (Pattern Direct Language): Directly derived from the pattern's dominant visual shape, rhythm, or primary graphic motif.
   - OPTION 2 (Pattern Symbolic Synthesis): A distilled, minimalist geometric or emblematic interpretation of the pattern's lines, curvature, or spatial structure.
   - OPTION 3 (Contextual Complement): A refined emblem or supporting mark harmonized with the brand style ("${estiloNome}") and niche ("${areaAtuacao}"), providing an elevated contextual accent.

3. STRICT ANTI-CLUSTERING RULE (NO MONOCULTURE):
   - NEVER generate 3 options from the same semantic family.
   - FORBIDDEN EXAMPLES:
     * leaf / sprout / seed (INVALID)
     * flower / leaf / petal (INVALID)
     * moon / star / sparkle (INVALID if all 3 are night sky items)
   - The 3 options MUST feel distinctly different in shape silhouette, concept, and functional role, while sharing the same elevated brand elegance.

4. NICHE & STYLE GUARDRAILS:
   - For "${estiloNome}" (e.g., "Essência Atemporal", "Elegante", "Minimalista"):
     Skew toward refined, minimal, calm, timeless, sophisticated vector marks with elegant line weights.
   - DO NOT default to generic "nature/botanical" tropes (leaves, herbs, seedlings) for broad niches like adult medical health, medicine, psychology, or corporate consulting, unless the pattern itself is visibly made of leaves.
   - Prefer timeless geometric harmony, serene monoline curves, balanced architectural seals, or subtle care arcs.

5. GROUNDED, TRUTHFUL EXPLANATIONS:
   - Explanations must cite real visual reasons observed in the pattern (e.g., "Inspirado no ritmo das curvas fluidas e no espaçamento observado na sua estampa", "Síntese geométrica minimalista da estrutura linear da estampa", "Emblema atemporal e equilibrado desenhado para o contexto da sua marca").
   - DO NOT claim figurative motifs are "present in the pattern" if the pattern is abstract.

OUTPUT FORMAT:
Provide a valid JSON array of exactly 3 objects. Each object must have:
- "title": Short, elegant title in Portuguese (e.g., "Curva Atemporal", "Selo Geométrico", "Arco de Harmonia", "Símbolo de Precisão").
- "origin": One concise sentence in Portuguese referencing true visual qualities of the pattern or brand context.
- "visualDescription": Precise English prompt for generating ONE isolated black vector lineart icon on pure solid white (#FFFFFF) background.

Example JSON structure:
[
  {
    "title": "...",
    "origin": "...",
    "visualDescription": "a single clean minimal black vector lineart icon of ..., centered on pure solid white background, elegant line weight, no text, no frame"
  },
  ...
]
`;

    let motifs = [];
    try {
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { inlineData: { mimeType, data: cleanBase64 } },
          { text: analysisPrompt }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      let textRes = analysisResponse.response?.text ? analysisResponse.response.text().trim() : '';
      if (textRes.startsWith("```json")) {
        textRes = textRes.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (textRes.startsWith("```")) {
        textRes = textRes.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const firstBracket = textRes.indexOf('[');
      const lastBracket = textRes.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        textRes = textRes.substring(firstBracket, lastBracket + 1);
      }

      const parsed = JSON.parse(textRes);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        motifs = parsed.slice(0, 3);
      }
    } catch (analysisErr) {
      console.warn(`[Telemetry] Analysis JSON parse failed: ${sanitizeError(analysisErr.message)}`);
    }

    // Se a IA não retornou 3 motivos válidos ou falhou, aciona o fallback diverso inteligente
    if (!Array.isArray(motifs) || motifs.length < 3) {
      motifs = getDiverseFallbackMotifs(areaAtuacao, estiloNome);
    }

    motifsFound = motifs.length;

    // Phase 2: Generation of 3 Isolated Elements
    currentPhase = 'generation';
    const targetMotifs = motifs.slice(0, 3);
    imagesAttempted = targetMotifs.length;

    const elementsPromises = targetMotifs.map(async (motif, index) => {
      const genPrompt = `
Generate ONE SINGLE ISOLATED BRAND GRAPHIC ICON: ${motif.visualDescription}.

STRICT MANDATORY RULES (DO NOT VIOLATE):
- SINGLE STANDALONE ICON ONLY: Render exactly ONE isolated vector graphic centered in the middle of a PURE SOLID WHITE (#FFFFFF) canvas with ample breathing margin.
- NO BACKGROUND PATTERNS / NO TILES: NEVER generate a pattern, wallpaper, repeating textures, or rectangle crop.
- NO BOUNDING FRAMES: DO NOT draw any box, square container, card border, or background shape.
- CLEAN VECTOR LINEART / MONOCHROME SILHOUETTE: Clean, sharp black or dark slate (#1E293B) contours.
- ZERO TEXT, ZERO LETTERS, ZERO MOCKUPS.
`;

      // Tentativa 1: gemini-2.5-flash-image
      try {
        const genRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [
            { text: genPrompt }
          ],
          config: {
            responseModalities: ['image']
          }
        });

        for (const part of genRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            return {
              id: `gen-elem-${index + 1}`,
              title: motif.title || `Elemento ${index + 1}`,
              origin: motif.origin || 'Inspirado na sua estampa',
              visualDescription: motif.visualDescription || '',
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            };
          }
        }
      } catch (err1) {
        console.warn(`[Telemetry] gemini-2.5-flash-image failed for motif ${index + 1}: ${sanitizeError(err1.message)}`);
      }

      // Tentativa 2: fallback com imagen-3.0-generate-002
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'imagen-3.0-generate-002',
          contents: [
            { text: genPrompt }
          ],
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
          }
        });

        const candidate = fallbackRes?.response?.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData?.data) {
          return {
            id: `gen-elem-${index + 1}`,
            title: motif.title || `Elemento ${index + 1}`,
            origin: motif.origin || 'Inspirado na sua estampa',
            visualDescription: motif.visualDescription || '',
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType || 'image/png'
          };
        }
      } catch (err2) {
        console.warn(`[Telemetry] imagen-3.0-generate-002 failed for motif ${index + 1}: ${sanitizeError(err2.message)}`);
      }

      return null;
    });

    const results = await Promise.all(elementsPromises);
    const validElements = results.filter(item => item !== null && item.base64 !== null);
    imagesValid = validElements.length;

    // Phase 3: Validation (Garantia de 3 elementos válidos)
    currentPhase = 'validation';

    if (imagesValid !== 3) {
      const rejectionReason = `insufficient_valid_elements_count_${imagesValid}_of_3`;
      console.error(`[Telemetry] Brand Elements generation rejected: ${rejectionReason}`, {
        phase: currentPhase,
        motifsFound,
        imagesAttempted,
        imagesValid,
        rejectionReason
      });

      return Response.json({
        error: "Não foi possível gerar os 3 elementos gráficos completos. Tente novamente sem custo.",
        telemetry: {
          phase: currentPhase,
          motifsFound,
          imagesAttempted,
          imagesValid,
          rejectionReason,
          errorId: `err_validation_${Date.now()}`
        }
      }, { status: 502 });
    }

    console.log(`[Telemetry] Brand Elements generation success: 3/3 valid elements created.`);
    return Response.json({
      elements: validElements,
      telemetry: {
        phase: 'complete',
        motifsFound,
        imagesAttempted,
        imagesValid: 3,
        rejectionReason: null
      }
    });

  } catch (error) {
    const errorId = `err_fatal_${Date.now()}`;
    const sanitizedMsg = sanitizeError(error.message);
    console.error(`[Telemetry] Fatal error in /api/generate-brand-elements:`, { phase: currentPhase, errorId, sanitizedMsg });

    return Response.json({
      error: error.message || "Falha ao gerar elementos gráficos da marca",
      telemetry: {
        phase: currentPhase,
        motifsFound,
        imagesAttempted,
        imagesValid,
        rejectionReason: 'unhandled_server_exception',
        errorId
      }
    }, { status: 502 });
  }
}
