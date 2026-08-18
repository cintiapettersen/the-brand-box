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
 * 1. Motivo Visual Principal (derivado da forma visível da estampa)
 * 2. Síntese Estrutural (geometria e ritmo da estampa)
 * 3. Apoio Contextual da Marca (atributos abstratos: serenidade, precisão, cuidado)
 * 
 * PROIBIDO: emblemas, brasões, escudos, cruzes, dentes, estetoscópios ou clipart de profissão.
 */
function getDiverseFallbackMotifs(areaAtuacao, estiloNome) {
  const areaLower = (areaAtuacao || '').toLowerCase();

  if (areaLower.includes('pediat') || areaLower.includes('infant') || areaLower.includes('crian') || areaLower.includes('baby')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nas formas principais e no ritmo lúdico da sua estampa",
        visualDescription: "a bold clean black vector outline four-point starburst graphic mark, solid medium stroke, centered on pure white background, minimal brand symbol"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no equilíbrio geométrico e nas curvas acolhedoras da sua identidade",
        visualDescription: "a bold clean black vector lineart upward protective arch curve mark, solid medium stroke, centered on pure white background, balanced minimal identity mark"
      },
      {
        title: "Elemento 03",
        label: "Apoio Contextual",
        origin: "Inspirado no tom de afeto, acolhimento e presença da sua marca",
        visualDescription: "a bold clean black vector minimalist continuous ribbon contour symbol, solid medium stroke, centered on pure white background, modern identity mark"
      }
    ];
  }

  if (areaLower.includes('odonto') || areaLower.includes('dente') || areaLower.includes('sorriso')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nas linhas fluidas e curvas da sua estampa",
        visualDescription: "a bold clean black vector outline dynamic upward curve mark, solid medium stroke, centered on pure white background, minimalist brand glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no equilíbrio espacial e na precisão geométrica da sua estampa",
        visualDescription: "a bold clean black vector four-point radiant starburst symbol, solid medium stroke, centered on pure white background, balanced geometric mark"
      },
      {
        title: "Elemento 03",
        label: "Apoio Contextual",
        origin: "Inspirado no tom de precisão, harmonia e luminosidade da sua marca",
        visualDescription: "a bold clean black vector geometric intersecting arcs brand symbol, solid medium stroke, centered on pure white background, refined modern mark"
      }
    ];
  }

  if (areaLower.includes('nutri') || areaLower.includes('aliment')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado nos contornos orgânicos e formas fluidas da sua estampa",
        visualDescription: "a bold clean black vector outline organic pebble curve contour, solid medium stroke, centered on pure white background, minimal brand glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado na harmonia geométrica e no ritmo equilibrado da sua estampa",
        visualDescription: "a bold clean black vector interlocking circle balance symbol, solid medium stroke, centered on pure white background, geometric harmony mark"
      },
      {
        title: "Elemento 03",
        label: "Apoio Contextual",
        origin: "Inspirado no tom de vitalidade, energia e equilíbrio integral da sua marca",
        visualDescription: "a bold clean black vector radiant burst symbol, solid medium stroke, centered on pure white background, vibrant minimal brand mark"
      }
    ];
  }

  if (areaLower.includes('psi') || areaLower.includes('terap') || areaLower.includes('mente')) {
    return [
      {
        title: "Elemento 01",
        label: "Motivo Principal",
        origin: "Inspirado na cadência fluida e linhas serenas da sua estampa",
        visualDescription: "a bold clean black vector lineart gentle wave curve mark, solid medium stroke, centered on pure white background, serene minimal glyph"
      },
      {
        title: "Elemento 02",
        label: "Síntese Estrutural",
        origin: "Inspirado no diálogo visual e na conexão geométrica da sua estampa",
        visualDescription: "a bold clean black vector overlapping twin arcs symbol, solid medium stroke, centered on pure white background, balanced union brand mark"
      },
      {
        title: "Elemento 03",
        label: "Apoio Contextual",
        origin: "Inspirado no tom de escuta, acolhimento e presença da sua marca",
        visualDescription: "a bold clean black vector harmonious concentric circular arc symbol, solid medium stroke, centered on pure white background, calm iconic brand mark"
      }
    ];
  }

  // Padrão Geral / Saúde Adulto / Medicina / Essência Atemporal
  return [
    {
      title: "Elemento 01",
      label: "Motivo Principal",
      origin: "Inspirado nas formas curvas e no ritmo da sua estampa",
      visualDescription: "a bold clean black vector lineart fluid contour curve mark, solid medium stroke, centered on pure white background, modern elegant icon glyph"
    },
    {
      title: "Elemento 02",
      label: "Síntese Estrutural",
      origin: "Inspirado no equilíbrio estrutural e na geometria da sua estampa",
      visualDescription: "a bold clean black vector geometric interlocking arcs symbol, solid medium stroke, centered on pure white background, balanced timeless mark"
    },
    {
      title: "Elemento 03",
      label: "Apoio Contextual",
      origin: "Inspirado no contexto da sua marca e no seu universo visual",
      visualDescription: "a bold clean black vector harmonious twin archway brand symbol conveying serenity and trust, solid medium stroke, centered on pure white background, custom luxury mark"
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
You are a World-Class Brand Identity Creative Director specialized in bespoke visual identity systems, submarks, and minimalist luxury brand symbols.
Analyze this brand pattern image in the context of this brand:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}"
- Brand Style: "${estiloNome || 'Essência Atemporal'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

YOUR GOAL:
Define exactly 3 DISTINCT, HIGH-IMPACT, CUSTOM BRAND GRAPHIC ELEMENTS / ICONS born from this pattern and brand context.

CRITICAL RULES & ABSOLUTE PROHIBITIONS (DO NOT VIOLATE):

1. NEVER GENERATE EMBLEMS, SHIELDS, CRESTS, OR BADGES:
   - Absolutely NO heraldic shields, crests, coat of arms, or badge-style container frames.
   - Absolutely NO institutional seals or generic organizational badges.
   - Every element must be an open, modern, standalone vector graphic mark.

2. NEVER GENERATE LITERAL PROFESSION PICTOGRAMS OR STOCK INDUSTRY ICONS:
   The client's business area must NOT directly dictate the object drawn.
   - For Healthcare/Medicine: NO caduceus, NO medical cross, NO stethoscope, NO pills, NO heart with ECG/pulse line, NO hands holding a heart.
   - For Dentistry: NO tooth silhouette.
   - For Psychology/Therapy: NO brain/head silhouette, NO speech bubbles.
   - For Nutrition: NO apple, NO leaf/sprout clipart.
   - For Law: NO balance scale, NO gavel.
   - For Photography: NO camera.
   - For Pediatrics: NO teddy bear, NO baby bottle.

3. HOW TO USE THE BUSINESS AREA (ABSTRACT BRAND ATTRIBUTES ONLY):
   Use the niche ("${areaAtuacao}") ONLY to infer abstract qualities, emotional tone, and symbolic meaning:
   - e.g. For healthcare/medicine: care, trust, balance, calm, precision, continuity, protection, serenity.
   - Translate these attributes into custom, subtle, abstract geometric or organic brand marks derived from the pattern's visual language.

4. MANDATORY 3 FUNCTIONAL ROLES (STRICT DIVERSITY):
   - OPTION 1 (Visual Motif):
     Derived from the most relevant visible motif or dominant form in the pattern (e.g., specific curved stroke, geometric starburst, or prominent contour from the pattern).
   - OPTION 2 (Formal Construction):
     Derived from the pattern's geometry, rhythm, symmetry, or structural composition. Abstract is encouraged, but it MUST be a crisp, bold, identifiable geometric/linear symbol.
   - OPTION 3 (Contextual Brand Support):
     Derived from abstract brand attributes (care, trust, serenity, precision) harmonized with the pattern's aesthetic. A supportive brand symbol, NOT a literal industry pictogram.

5. STRICT ANTI-CLUSTERING (NO MONOCULTURE):
   - The 3 options MUST have noticeably distinct silhouettes and concepts (e.g., Option 1 = fluid curved contour, Option 2 = balanced geometric quatrefoil/interlocking arcs, Option 3 = serene archway/continuous ribbon).
   - NEVER generate 3 variations of the same item.

6. SMALL-SIZE LEGIBILITY TEST:
   - Every symbol must be immediately recognizable in under 1 second when scaled down to 24px–32px (submark seal size).
   - Use clean, confident medium-weight lines or bold solid silhouettes.
   - Single strong central symbol with high visual contrast.

7. GROUNDED, SIMPLE EXPLANATIONS:
   - "title": Use "Elemento 01", "Elemento 02", "Elemento 03"
   - "label": "Motivo Principal", "Síntese Estrutural", "Apoio Contextual"
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
    "visualDescription": "a bold clean black vector lineart icon of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame, no shield"
  },
  {
    "title": "Elemento 02",
    "label": "Síntese Estrutural",
    "origin": "Inspirado no equilíbrio estrutural e na geometria da sua estampa",
    "visualDescription": "a bold clean black vector geometric mark of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame, no shield"
  },
  {
    "title": "Elemento 03",
    "label": "Apoio Contextual",
    "origin": "Inspirado no contexto da sua marca e no seu universo visual",
    "visualDescription": "a bold clean black vector supportive brand symbol of ..., solid medium stroke weight, single centered symbol filling 70% of frame, pure white background, no text, no frame, no shield"
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
          label: item.label || (idx === 0 ? 'Motivo Principal' : idx === 1 ? 'Síntese Estrutural' : 'Apoio Contextual'),
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
      const genPrompt = `
Generate ONE SINGLE ISOLATED BESPOKE BRAND GRAPHIC MARK: ${motif.visualDescription}.

STRICT MANDATORY ART DIRECTION:
- SINGLE STANDALONE ICON ONLY: Exactly ONE central icon glyph positioned directly in the center of the frame.
- CANVAS PROPORTION: The symbol must be prominent and bold, occupying 70% of the canvas area.
- STYLE & CONTRAST: Clean vector lineart or solid vector silhouette in pure solid black (#000000) on pure solid white (#FFFFFF) background.
- LINE WEIGHT: Confident solid medium-weight vector stroke. Sharp, clean, antialiased edges.
- INSTANT LEGIBILITY: Must be instantly recognizable and clear at small icon size (24px).
- ABSOLUTE PROHIBITIONS:
  * NO shields, crests, emblems, coat of arms, or badges
  * NO literal profession clipart (no medical crosses, no teeth, no stethoscopes, no brain icons)
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
