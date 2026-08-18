import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Permite até 60 segundos para processamento de IA

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function sanitizeError(msg) {
  if (!msg) return 'unknown_error';
  return String(msg).replace(/api[-_]?key=[^&\s]+/gi, 'api_key=REDACTED');
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

    // Phase 1: Multimodal Brand & Pattern Analysis (4-Step Evaluation)
    currentPhase = 'analysis';

    const sensacoesText = Array.isArray(sensacoes) ? sensacoes.join(', ') : (sensacoes || '');
    const elementosText = Array.isArray(elementosVisuais) ? elementosVisuais.join(', ') : (elementosVisuais || '');

    const analysisPrompt = `
You are a Senior Brand Identity Director and Graphic Designer.
Analyze this brand pattern image in the context of this brand:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}"
- Brand Style: "${estiloNome || 'Elegante e Moderno'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

YOUR GOAL:
Generate exactly 3 distinct, cohesive BRAND GRAPHIC ELEMENTS / ICONS derived from this pattern and brand context.

FOLLOW THIS 4-STEP REASONING LOGIC:
1. STEP 1 (Pattern Classification):
   Detect whether the attached pattern contains:
   A) Clear figurative motifs (e.g. stars, leaves, clouds, flowers, hearts, toys, fruits, baby items, smiles, botanical branches, etc.).
   OR
   B) Abstract, geometric, minimalist, watercolor, terrazzo, or texture-based language without a single clear recognizable object.

2. STEP 2 (If Figurative Motifs Present):
   Derive 3 simplified, elegant vector elements directly inspired by those recognizable motifs.

3. STEP 3 (If Abstract / Geometric / No Clear Object):
   DO NOT crop pieces or patches of the pattern.
   Instead, interpret the rhythm, dominant shape curves/lines, mood, and repetition style into 3 original graphic symbols belonging to the same visual family.

4. STEP 4 (Semantic Fallback using Business Area):
   If the pattern alone does not yield 3 sufficiently strong, recognizable options, use the client's business area ("${areaAtuacao}") for subtle conceptual support while preserving the visual style:
   - Pediatric / baby / child: gentle stars, crescent moon, soft heart, baby items, tender caring symbol
   - Dentist: subtle smile arc, sparkle, tooth silhouette, dental care motif
   - Nutritionist: organic leaf, seed, clean fruit silhouette, botanical sprout
   - Psychologist / Therapy: soft cloud, embracing heart, dialogue/speech mark, gentle sun
   - Photographer: frame, lens sparkle, minimal camera contour, focus mark
   - Lawyer / Consultant: refined seal, minimal shield, monogram support element, balance form
   - General / Creative: harmonic geometric emblem, elegant starburst, signature flourish

OUTPUT DISTRIBUTION (EXACTLY 3 ROLES):
1. Option 1: Directly derived from the pattern's dominant visual motif or primary shape language.
2. Option 2: A more simplified, minimal symbolic mark (distilled icon).
3. Option 3: A contextual or decorative element harmonized with the business area and pattern atmosphere.

STYLE CONSTRAINTS:
- Preferred style: Clean vector outline / lineart style (or clean filled vector silhouette if the brand style is explicitly bold/playful).
- Isolated single element per option on pure white (#FFFFFF) background.
- Simple, elegant, legible at small icon sizes (like inside a circular sub-brand seal).

For each of the 3 elements, provide:
1. "title": A short Portuguese title (e.g. "Folha Orgânica", "Estrela Guia", "Símbolo de Acolhimento", "Arco Minimalista", "Brilho Sutil").
2. "origin": A short sentence in Portuguese explaining where it came from (e.g. "Inspirado nas estrelas presentes na sua estampa", "Derivado das curvas orgânicas da sua identidade", "Criado a partir da harmonia da sua estampa com seu nicho").
3. "visualDescription": A precise English prompt to generate ONE SINGLE ISOLATED vector icon (e.g. "a single clean black vector outline icon of a four-point sparkle star, centered on pure white background, minimal lineart").

Return strictly a valid JSON array of exactly 3 objects with keys "title", "origin", and "visualDescription".
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

      motifs = JSON.parse(textRes);
    } catch (analysisErr) {
      console.warn(`[Telemetry] Analysis JSON parse failed: ${sanitizeError(analysisErr.message)}`);
    }

    if (!Array.isArray(motifs) || motifs.length < 3) {
      // Fallback semântico inteligente baseado na área de atuação
      const areaLower = (areaAtuacao || '').toLowerCase();
      if (areaLower.includes('pediat') || areaLower.includes('infant') || areaLower.includes('crian') || areaLower.includes('baby')) {
        motifs = [
          { title: "Estrela Guia", origin: "Inspirado nos elementos lúdicos presentes na sua estampa", visualDescription: "a single clean vector outline icon of a gentle sparkle star, centered on pure white background" },
          { title: "Coração Acolhedor", origin: "Derivado das formas afetuosas da sua identidade visual", visualDescription: "a single minimal clean vector lineart heart icon, centered on pure white background" },
          { title: "Crescente Suave", origin: "Criado em harmonia com o cuidado e carinho do seu nicho", visualDescription: "a single minimal clean vector outline crescent moon icon, centered on pure white background" }
        ];
      } else if (areaLower.includes('odonto') || areaLower.includes('dente') || areaLower.includes('sorriso')) {
        motifs = [
          { title: "Sorriso Sutil", origin: "Inspirado nas curvas elegantes presentes na sua estampa", visualDescription: "a single minimal vector lineart smile curve icon, centered on pure white background" },
          { title: "Brilho Radiante", origin: "Derivado da luminosidade da sua identidade de marca", visualDescription: "a single clean vector outline sparkle star icon, centered on pure white background" },
          { title: "Selo Odontológico", origin: "Elemento moderno e profissional de apoio à sua marca", visualDescription: "a minimal abstract dental vector icon silhouette, centered on pure white background" }
        ];
      } else if (areaLower.includes('nutri') || areaLower.includes('saúde') || areaLower.includes('saude') || areaLower.includes('bio')) {
        motifs = [
          { title: "Folha Orgânica", origin: "Inspirado nos traços botânicos presentes na sua estampa", visualDescription: "a single clean vector outline organic leaf icon, centered on pure white background" },
          { title: "Broto Vital", origin: "Derivado do dinamismo natural da sua identidade visual", visualDescription: "a single minimal vector lineart botanical sprout icon, centered on pure white background" },
          { title: "Elemento Semente", origin: "Criado em harmonia com o bem-estar do seu nicho", visualDescription: "a single minimal vector seed icon, centered on pure white background" }
        ];
      } else {
        motifs = [
          { title: "Forma Orgânica", origin: "Inspirado no ritmo visual e nas curvas da sua estampa", visualDescription: "a single clean minimal vector outline organic curved shape, centered on pure white background" },
          { title: "Símbolo Essencial", origin: "Derivado da essência e equilíbrio da sua identidade", visualDescription: "a single elegant minimalist vector icon emblem, centered on pure white background" },
          { title: "Elemento Harmônico", origin: "Criado em harmonia com a atmosfera da sua marca", visualDescription: "a single refined geometric vector lineart emblem, centered on pure white background" }
        ];
      }
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
