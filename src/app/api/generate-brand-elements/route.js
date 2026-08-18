import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Permite até 60 segundos para processamento de IA

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function sanitizeError(msg) {
  if (!msg) return 'unknown_error';
  return String(msg).replace(/api[-_]?key=[^&\s]+/gi, 'api_key=REDACTED');
}

/**
 * Fallback robusto e conceitualmente diverso com 3 papéis funcionais estritos:
 * 1. Motivo Visual Primário
 * 2. Construção Formal / Geometria
 * 3. Apoio Contextual da Marca
 */
function getDiverseFallbackMotifs(areaAtuacao, estiloNome) {
  const areaLower = (areaAtuacao || '').toLowerCase();

  if (areaLower.includes('pediat') || areaLower.includes('infant') || areaLower.includes('crian') || areaLower.includes('baby')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nas formas principais e no ritmo lúdico da sua estampa",
        visualDescription: "a bold clean black vector outline four-point sparkle star icon, solid medium stroke, centered on pure white background, minimal icon glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no equilíbrio geométrico e nas curvas acolhedoras da sua identidade",
        visualDescription: "a bold clean black vector lineart protective arch emblem, solid medium stroke, centered on pure white background, iconic symmetry"
      },
      {
        title: "Elemento 03",
        label: "Emblema Contextual",
        origin: "Inspirado no contexto de cuidado e afeto do seu universo visual",
        visualDescription: "a bold clean black vector outline heart seal emblem, solid medium stroke, centered on pure white background, timeless minimal logo mark"
      }
    ];
  }

  if (areaLower.includes('odonto') || areaLower.includes('dente') || areaLower.includes('sorriso')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nas linhas fluidas e curvas da sua estampa",
        visualDescription: "a bold clean black vector outline harmonious smile curve icon, solid medium stroke, centered on pure white background, modern minimalist glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no equilíbrio espacial e na precisão geométrica da sua estampa",
        visualDescription: "a bold clean black vector four-point radiant starburst emblem, solid medium stroke, centered on pure white background, balanced geometric mark"
      },
      {
        title: "Elemento 03",
        label: "Emblema Contextual",
        origin: "Inspirado no contexto profissional e na excelência da sua marca",
        visualDescription: "a bold clean black vector modern shield seal icon, solid medium stroke, centered on pure white background, elegant professional mark"
      }
    ];
  }

  if (areaLower.includes('nutri') || areaLower.includes('aliment')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nos contornos orgânicos e formas fluidas da sua estampa",
        visualDescription: "a bold clean black vector outline organic curved leaf pebble shape, solid medium stroke, centered on pure white background, minimal icon glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado na harmonia geométrica e no ritmo equilibrado da sua estampa",
        visualDescription: "a bold clean black vector interlocking circle balance emblem, solid medium stroke, centered on pure white background, geometric harmony mark"
      },
      {
        title: "Elemento 03",
        label: "Emblema Contextual",
        origin: "Inspirado no contexto de vitalidade e saúde integral da sua marca",
        visualDescription: "a bold clean black vector geometric sunburst emblem, solid medium stroke, centered on pure white background, vibrant minimal icon"
      }
    ];
  }

  if (areaLower.includes('psi') || areaLower.includes('terap') || areaLower.includes('mente')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado na cadência fluida e linhas serenas da sua estampa",
        visualDescription: "a bold clean black vector lineart gentle wave curve icon, solid medium stroke, centered on pure white background, serene minimal glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no diálogo visual e na conexão geométrica da sua estampa",
        visualDescription: "a bold clean black vector overlapping twin arcs icon, solid medium stroke, centered on pure white background, balanced union emblem"
      },
      {
        title: "Elemento 03",
        label: "Emblema Contextual",
        origin: "Inspirado no contexto de escuta, acolhimento e presença da sua marca",
        visualDescription: "a bold clean black vector circular sun seal emblem, solid medium stroke, centered on pure white background, calm iconic seal"
      }
    ];
  }

  // Padrão Geral / Saúde Adulto / Medicina / Essência Atemporal
  return [
    {
      title: "Elemento 01",
      label: "Motivo Principal",
      origin: "Inspirado nas formas curvas e no ritmo da sua estampa",
      visualDescription: "a bold clean black vector lineart fluid contour curve icon, solid medium stroke, centered on pure white background, modern elegant icon glyph"
    },
    {
      title: "Elemento 02",
      label: "Síntese Estrutural",
      origin: "Inspirado no equilíbrio estrutural e na geometria da sua estampa",
      visualDescription: "a bold clean black vector geometric interlocking arcs emblem, solid medium stroke, centered on pure white background, balanced timeless mark"
    },
    {
      title: "Elemento 03",
      label: "Emblema Contextual",
      origin: "Inspirado no contexto da sua marca e no seu universo visual",
      visualDescription: "a bold clean black vector modern circular seal emblem with subtle health care curve, solid medium stroke, centered on pure white background, clinical elegance mark"
    }
  ];
}

export async function POST(request) {
  const startTime = Date.now();
  let currentPhase = 'initialization';
  let motifsFound = 0;
  let imagesAttempted = 0;
  let imagesValid = 0;
  let debugTelemetry = {};

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
You are a World-Class Brand Identity Creative Director specialized in high-end vector icons, submarks, and brand identity systems.
Analyze this brand pattern image in the context of this brand:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}"
- Brand Style: "${estiloNome || 'Essência Atemporal'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

YOUR GOAL:
Define exactly 3 DISTINCT, HIGH-IMPACT, HIGHLY LEGIBLE BRAND GRAPHIC ELEMENTS / ICONS born from this pattern and brand context.

CRITICAL QUALITY & LEGIBILITY REQUIREMENTS:
1. SMALL-SIZE LEGIBILITY TEST:
   Every symbol must be immediately recognizable in under 1 second when scaled down to 24px–32px (submark seal size).
   - Avoid wireframe tangles, scribbles, pencil textures, micro-lines, or ambiguous complex drawings.
   - Use clean, confident medium-weight lines or bold solid silhouettes.
   - Single strong central symbol with high visual contrast.

2. MANDATORY 3 FUNCTIONAL ROLES (STRICT DIVERSITY):
   - OPTION 1 (Visual Motif):
     Directly derived from the strongest, clearest visible shape or contour in the approved pattern (e.g., specific curve, geometric unit, starburst, or botanical contour if explicitly in the pattern).
   - OPTION 2 (Formal Construction):
     Derived from the pattern's geometry, rhythm, symmetry, or structural balance. Abstract is allowed, but it MUST be a crisp, bold, identifiable geometric / structural mark.
   - OPTION 3 (Contextual Brand Support):
     Derived from the brand's business area ("${areaAtuacao}") and style ("${estiloNome}"). For adult medical/healthcare or corporate, prefer serene clinical elegance, arch of care, or architectural seal (NEVER default to leaf/sprout/seed unless the pattern clearly has leaves).

3. STRICT ANTI-CLUSTERING (NO MONOCULTURE):
   - NEVER generate 3 variations of the same semantic family (NO leaf + sprout + seed, NO 3 abstract squiggles).
   - The 3 options must have noticeably distinct silhouettes and concepts.

4. GROUNDED, SIMPLE EXPLANATIONS:
   - "title": Use "Elemento 01", "Elemento 02", "Elemento 03"
   - "label": Short role description in Portuguese: "Motivo Principal", "Síntese Estrutural", "Emblema Contextual"
   - "origin": Short, objective sentence in Portuguese:
     * Option 1: "Inspirado nas formas curvas e no ritmo da sua estampa"
     * Option 2: "Inspirado no equilíbrio estrutural e na geometria da sua estampa"
     * Option 3: "Inspirado no contexto da sua marca e no seu universo visual"
   - "visualDescription": Exact English prompt for a bold, clean black vector icon centered on pure white background.

OUTPUT FORMAT:
Provide strictly a valid JSON array of exactly 3 objects:
[
  {
    "title": "Elemento 01",
    "label": "Motivo Principal",
    "origin": "Inspirado nas formas curvas e no ritmo da sua estampa",
    "visualDescription": "a bold clean black vector lineart icon of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame"
  },
  {
    "title": "Elemento 02",
    "label": "Síntese Estrutural",
    "origin": "Inspirado no equilíbrio estrutural e na geometria da sua estampa",
    "visualDescription": "a bold clean black vector geometric emblem of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame"
  },
  {
    "title": "Elemento 03",
    "label": "Emblema Contextual",
    "origin": "Inspirado no contexto da sua marca e no seu universo visual",
    "visualDescription": "a bold clean black vector modern seal icon of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame"
  }
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
        motifs = parsed.slice(0, 3).map((item, idx) => ({
          title: item.title || `Elemento 0${idx + 1}`,
          label: item.label || (idx === 0 ? 'Motivo Principal' : idx === 1 ? 'Síntese Estrutural' : 'Emblema Contextual'),
          origin: item.origin || (idx === 0 ? 'Inspirado nas formas curvas e no ritmo da sua estampa' : idx === 1 ? 'Inspirado no equilíbrio estrutural e na geometria da sua estampa' : 'Inspirado no contexto da sua marca e no seu universo visual'),
          visualDescription: item.visualDescription || ''
        }));
      }
    } catch (analysisErr) {
      console.warn(`[Telemetry] Analysis JSON parse failed: ${sanitizeError(analysisErr.message)}`);
    }

    if (!Array.isArray(motifs) || motifs.length < 3) {
      motifs = getDiverseFallbackMotifs(areaAtuacao, estiloNome);
    }

    motifsFound = motifs.length;
    debugTelemetry.motifs = motifs;

    // Phase 2: Generation of 3 High-Clarity Vector Elements
    currentPhase = 'generation';
    const targetMotifs = motifs.slice(0, 3);
    imagesAttempted = targetMotifs.length;

    const elementsPromises = targetMotifs.map(async (motif, index) => {
      // Prompt com regras de arte rigorosas para legibilidade e presença
      const genPrompt = `
Generate ONE SINGLE ISOLATED PROFESSIONAL BRAND ICON GLYPH: ${motif.visualDescription}.

STRICT MANDATORY ART DIRECTION:
- SINGLE STANDALONE ICON ONLY: Exactly ONE central icon glyph positioned directly in the center of the frame.
- CANVAS PROPORTION: The symbol must be prominent and bold, occupying 70% of the canvas area.
- STYLE & CONTRAST: Clean vector lineart or solid vector silhouette in pure solid black (#000000) on pure solid white (#FFFFFF) background.
- LINE WEIGHT: Confident solid medium-weight vector stroke. Sharp, clean, antialiased edges.
- INSTANT LEGIBILITY: Must be instantly recognizable and clear at small icon size (24px).
- ABSOLUTE PROHIBITIONS:
  * NO background patterns, textures, or repeating tiles
  * NO frames, boxes, cards, circular borders, or bounding rectangles
  * NO pencil sketch lines, wireframe scribbles, or hairy edges
  * NO gradients, shading, or 3D effects
  * NO secondary floating dust/dots
  * NO text, letters, or mockups
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
              title: motif.title || `Elemento 0${index + 1}`,
              label: motif.label || '',
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
            title: motif.title || `Elemento 0${index + 1}`,
            label: motif.label || '',
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
        rejectionReason,
        durationMs: Date.now() - startTime
      });

      return Response.json({
        error: "Não foi possível gerar os 3 elementos gráficos com a qualidade exigida. Tente novamente sem custo.",
        telemetry: {
          phase: currentPhase,
          motifsFound,
          imagesAttempted,
          imagesValid,
          rejectionReason,
          durationMs: Date.now() - startTime,
          errorId: `err_validation_${Date.now()}`
        }
      }, { status: 502 });
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Telemetry] Brand Elements generation success: 3/3 valid elements created in ${durationMs}ms.`);

    return Response.json({
      elements: validElements,
      telemetry: {
        phase: 'complete',
        motifsFound,
        imagesAttempted,
        imagesValid: 3,
        durationMs,
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
