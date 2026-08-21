import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { STYLE_ICONS } from '../../../lib/styleIcons.js';
import { validatePatternCoverage } from '../../../lib/patternCoverageValidator.js';

export const maxDuration = 60; // Permite até 60 segundos para processamento de IA

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function sanitizeError(msg) {
  if (!msg) return 'unknown_error';
  return String(msg).replace(/api[-_]?key=[^&\s]+/gi, 'api_key=REDACTED');
}

/**
 * Extrai texto com segurança de qualquer formato de resposta do @google/genai
 */
function extractTextFromResponse(response) {
  if (!response) return '';
  if (typeof response.text === 'string') return response.text;
  if (typeof response.text === 'function') {
    try {
      const res = response.text();
      if (typeof res === 'string') return res;
    } catch (_) {}
  }
  if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
    return response.candidates[0].content.parts[0].text;
  }
  if (response.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return response.response.candidates[0].content.parts[0].text;
  }
  return '';
}

/**
 * Normaliza e faz parse seguro de JSON retornado pelo Gemini
 */
function parseJsonSafely(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  let clean = rawText.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  clean = clean.trim();

  // Tenta parse direto
  try {
    return JSON.parse(clean);
  } catch (_) {}

  // Tenta encontrar o bloco delimitador { ... } ou [ ... ]
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
    } catch (_) {}
  }

  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(clean.substring(firstBracket, lastBracket + 1));
    } catch (_) {}
  }

  return null;
}

export async function POST(request) {
  const startTime = Date.now();
  let currentPhase = 'initialization';
  let elementsFound = 0;
  let imagesAttempted = 0;
  let imagesValid = 0;

  console.log('--- [Brand Elements] Nova requisição recebida ---');

  try {
    if (!ai) {
      console.error('[Brand Elements] GEMINI_API_KEY não configurada');
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
      console.error('[Brand Elements] patternBase64 ausente');
      return Response.json({
        error: "patternBase64 é obrigatório para extrair elementos da estampa.",
        telemetry: { phase: 'initialization', rejectionReason: 'missing_pattern_data' }
      }, { status: 400 });
    }

    const cleanBase64 = patternBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeType = patternMimeType || 'image/png';

    // Phase 1.1: Validação de Qualidade Técnica da Estampa de Entrada
    currentPhase = 'pattern_quality_gate';
    try {
      const patternCheck = await validatePatternCoverage(cleanBase64);
      if (!patternCheck.valid && patternCheck.backgroundRatio > 0.85) {
        console.warn(`⚠️ [Brand Elements Quality Gate] Estampa rejeitada: ${patternCheck.reason} (Fundo: ${Math.round(patternCheck.backgroundRatio * 100)}%)`);
        return Response.json({
          error: "A estampa selecionada possui área vazia excessiva para extração de elementos gráficos. Gere uma nova estampa com motivos distribuídos.",
          telemetry: {
            phase: currentPhase,
            rejectionReason: patternCheck.reason,
            backgroundRatio: patternCheck.backgroundRatio
          }
        }, { status: 400 });
      }
      console.log(`✅ [Brand Elements Quality Gate] Estampa aprovada (Fundo: ${Math.round(patternCheck.backgroundRatio * 100)}%)`);
    } catch (valErr) {
      console.warn('[Brand Elements] Quality Gate bypass due to error:', valErr.message);
    }

    // Phase 1.2: Análise Multimodal de Alta Precisão (Diretor de Criação de Identidade Visual)
    currentPhase = 'analysis';

    // Carrega referências visuais do estilo para condicionamento de estilo
    const styleRefParts = [];
    try {
      const styleIconsList = STYLE_ICONS[estiloNome] || [];
      const sampleIcons = styleIconsList.slice(0, 2);
      for (const icon of sampleIcons) {
        if (icon.path) {
          const relPath = icon.path.replace(/^\//, '');
          const fullPath = path.join(process.cwd(), 'public', relPath);
          if (fs.existsSync(fullPath)) {
            const buf = fs.readFileSync(fullPath);
            styleRefParts.push({
              inlineData: {
                mimeType: 'image/png',
                data: buf.toString('base64')
              }
            });
          }
        }
      }
      console.log(`[Brand Elements] ${styleRefParts.length} referências de estilo carregadas para "${estiloNome}".`);
    } catch (fsErr) {
      console.warn('[Brand Elements] Could not load visual style references from disk:', sanitizeError(fsErr.message));
    }

    const sensacoesText = Array.isArray(sensacoes) ? sensacoes.join(', ') : (sensacoes || '');
    const elementosText = Array.isArray(elementosVisuais) ? elementosVisuais.join(', ') : (elementosVisuais || '');

    const analysisPrompt = `
You are a World-Class Brand Identity Creative Director specialized in bespoke visual identity submarks, seals, and minimalist luxury brand marks.

INPUT CONTEXT:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}" (Contextual tone ONLY — NEVER draw literal niche objects)
- Brand Style: "${estiloNome || 'Essência Atemporal'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

IMAGE INPUTS IN THIS REQUEST:
- IMAGE 1: THE APPROVED PATTERN (The visual raw material and soul of the brand's graphic vocabulary).
${styleRefParts.length > 0 ? `- IMAGES 2+: STYLE REFERENCE IMAGES (Visual conditioning ONLY: showing stroke weight, level of simplification, vector finish, line confidence, and visual weight. DO NOT COPY WHAT IS DRAWN IN THESE REFERENCES. ONLY USE HOW THEY ARE DRAWN).` : ''}

YOUR GOAL:
1. CLASSIFY THE PATTERN TYPE:
   - "figurative": Clearly identifiable figurative objects or botanical elements.
   - "abstract": Purely non-figurative (geometric arches, modular grids, rhythmic waves, linear intersections, abstract contours, or pure spatial forms). Figurative motifs are legitimately absent — derive concepts from formal properties (geometry, curves, rhythm, line weight, symmetry, negative space, modular repetition).
   - "mixed": Combines recognizable motifs with abstract geometric or linear structures.

2. DEFINE 3 DISTINCT, HIGH-IMPACT, HIGH-CONFIDENCE BRAND SUBMARKS BORN DIRECTLY FROM THIS SPECIFIC PATTERN:
   
   * OPTION 1 (BENCHMARK - FORMA PRINCIPAL):
     - Focus: The dominant organic/focal shape language, primary contour, or central emblem-glyph of the pattern.
     - Goal: Solid, balanced, highly memorable central brand mark with great presence and organic relation to the pattern.
   
   * OPTION 2 (ESTRUTURA GEOMÉTRICA & MODULAR DISTINTIVA):
     - Focus: The unique architectural geometry, interlocking nodes, radial intersection, or modular cadence of the pattern.
     - Goal: MUST BE DISTINCTIVE AND IDENTITY-SPECIFIC. Avoid generic single loops or basic wellness circles. Build a bespoke geometric mark with clear internal structural character born from this exact pattern grid.
   
   * OPTION 3 (SUBMARCA FOCAL DE ALTO IMPACTO / SÍNTESE ESPACIAL):
     - Focus: Bold figure-ground synthesis, high-contrast silhouette mass, or spatial harmony between positive and negative shapes.
     - Goal: MUST BE A REAL, POWERFUL SUBMARK CANDIDATE (NOT a fragile decorative ornament or flimsy accent). Confident, solid, bold silhouette that commands visual space and works perfectly as an iconic seal mark.

3. STRICT QUALITY, IDENTITY-SPECIFICITY & EXECUTION RULES:
   - The 3 options MUST come from 3 DIFFERENT visual observations inside the pattern (no monoculture).
   - Every symbol must feel born from THIS specific identity, not a generic clipart library.
   - ONE CLEAR CENTRAL SYMBOL occupying 75% of canvas area.
   - Confident solid medium-bold vector line weight or solid mass (NEVER thin hairline, never pencil scribble, never fragile ornamental flourish).
   - Instant legibility and high silhouette presence at small size (24px).
   - ABSOLUTELY NO shields, crests, heraldic badges, container frames, or circular border enclosures.
   - ABSOLUTELY NO literal profession pictograms (no medical crosses, no teeth, no stethoscopes).

4. GROUNDED, CLEAR ORIGIN DESCRIPTIONS (in Portuguese):
   - "title": "Elemento 01", "Elemento 02", "Elemento 03"
   - "label": "Forma Principal", "Estrutura Geométrica", "Submarca de Alto Impacto" (or "Motivo Principal" if figurative)
   - "origin": Short objective sentence explaining how the symbol derives from the specific pattern shapes.

OUTPUT FORMAT:
Provide strictly a JSON object with:
{
  "patternType": "abstract" | "figurative" | "mixed",
  "visualDecomposition": {
    "dominantShapes": "...",
    "geometryAndRhythm": "...",
    "compositionAndFlow": "..."
  },
  "elements": [
    {
      "title": "Elemento 01",
      "label": "Forma Principal",
      "sourceType": "primary_form_or_motif",
      "origin": "Inspirado na forma central fluida e no contorno dominante da sua estampa",
      "visualDescription": "a solid bold clean black vector mark of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    },
    {
      "title": "Elemento 02",
      "label": "Estrutura Geométrica",
      "sourceType": "geometric_structure",
      "origin": "Inspirado na geometria modular e na intersecção estrutural dos arcos da sua estampa",
      "visualDescription": "a distinctive bold bespoke black vector geometric mark of ..., confident solid stroke weight and intentional internal structure, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    },
    {
      "title": "Elemento 03",
      "label": "Submarca de Alto Impacto",
      "sourceType": "compositional_harmony",
      "origin": "Inspirado na síntese de formas e no equilíbrio de cheios e vazios da sua estampa",
      "visualDescription": "a high-impact solid bold black vector submark symbol of ..., powerful solid silhouette presence, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    }
  ]
}
`;

    let elements = [];
    let patternTypeDetected = 'unknown';

    const contents = [
      { inlineData: { mimeType, data: cleanBase64 } },
      ...styleRefParts,
      { text: analysisPrompt }
    ];

    // Tentativa 1 de Análise Multimodal
    try {
      console.log('[Brand Elements] Enviando prompt de análise multimodal para Gemini 2.5 Flash...');
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: { responseMimeType: 'application/json' }
      });

      const rawText = extractTextFromResponse(analysisResponse);
      console.log(`[Brand Elements] Resposta bruta da IA (Tentativa 1, ${rawText.length} chars):`, rawText.substring(0, 200) + '...');

      const parsed = parseJsonSafely(rawText);
      if (parsed) {
        patternTypeDetected = parsed.patternType || (Array.isArray(parsed) ? 'mixed' : 'abstract');
        const rawElements = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.elements) ? parsed.elements : []);

        if (rawElements.length >= 3) {
          elements = rawElements.slice(0, 3).map((item, idx) => ({
            title: item.title || `Elemento 0${idx + 1}`,
            label: item.label || (idx === 0 ? (patternTypeDetected === 'abstract' ? 'Forma Principal' : 'Motivo Principal') : idx === 1 ? 'Estrutura Geométrica' : 'Submarca de Alto Impacto'),
            sourceType: item.sourceType || (idx === 0 ? 'primary_form_or_motif' : idx === 1 ? 'geometric_structure' : 'compositional_harmony'),
            origin: item.origin || (idx === 0 ? 'Inspirado na forma e no ritmo visual da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na síntese visual da sua estampa'),
            visualDescription: item.visualDescription || ''
          }));
          console.log(`✅ [Brand Elements] 3 conceitos extraídos com sucesso na Tentativa 1 (Tipo: ${patternTypeDetected}).`);
        }
      }
    } catch (parseErr1) {
      console.warn(`[Brand Elements] Análise multimodal tentativa 1 falhou: ${sanitizeError(parseErr1.message)}. Tentando retry...`);
    }

    // Tentativa 2 de Análise (Retry Controlado se necessário)
    if (!Array.isArray(elements) || elements.length < 3) {
      try {
        console.log('[Brand Elements] Executando retry controlado da análise multimodal...');
        const retryContents = [
          { inlineData: { mimeType, data: cleanBase64 } },
          { text: "Return strictly a JSON object with 3 distinct brand submark symbols derived from this pattern: {\"patternType\":\"abstract\",\"elements\":[{\"title\":\"Elemento 01\",\"label\":\"Forma Principal\",\"origin\":\"Inspirado na forma principal da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 02\",\"label\":\"Estrutura Geométrica\",\"origin\":\"Inspirado na estrutura geométrica distintiva da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 03\",\"label\":\"Submarca de Alto Impacto\",\"origin\":\"Inspirado na síntese de alto impacto da sua estampa\",\"visualDescription\":\"...\"}]}" }
        ];

        const retryResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: retryContents,
          config: { responseMimeType: 'application/json' }
        });

        const retryRaw = extractTextFromResponse(retryResponse);
        const parsedRetry = parseJsonSafely(retryRaw);
        if (parsedRetry) {
          patternTypeDetected = parsedRetry.patternType || (Array.isArray(parsedRetry) ? 'mixed' : 'abstract');
          const rawRetryElements = Array.isArray(parsedRetry) ? parsedRetry : (Array.isArray(parsedRetry.elements) ? parsedRetry.elements : []);

          if (rawRetryElements.length >= 3) {
            elements = rawRetryElements.slice(0, 3).map((item, idx) => ({
              title: item.title || `Elemento 0${idx + 1}`,
              label: item.label || (idx === 0 ? (patternTypeDetected === 'abstract' ? 'Forma Principal' : 'Motivo Principal') : idx === 1 ? 'Estrutura Geométrica' : 'Submarca de Alto Impacto'),
              sourceType: item.sourceType || (idx === 0 ? 'primary_form_or_motif' : idx === 1 ? 'geometric_structure' : 'compositional_harmony'),
              origin: item.origin || (idx === 0 ? 'Inspirado na forma e no ritmo visual da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na síntese visual da sua estampa'),
              visualDescription: item.visualDescription || ''
            }));
            console.log(`✅ [Brand Elements] 3 conceitos extraídos com sucesso na Tentativa 2.`);
          }
        }
      } catch (retryErr) {
        console.error(`[Brand Elements] Retry da análise multimodal falhou: ${sanitizeError(retryErr.message)}`);
      }
    }

    if (!Array.isArray(elements) || elements.length < 3) {
      console.error(`❌ [Brand Elements] Análise multimodal abortada: Não foi possível obter 3 elementos estruturados.`);
      return Response.json({
        error: "Não foi possível processar a estrutura visual da sua estampa no momento. Por favor, tente novamente.",
        telemetry: {
          phase: currentPhase,
          rejectionReason: 'multimodal_analysis_failed',
          durationMs: Date.now() - startTime
        }
      }, { status: 502 });
    }

    elementsFound = elements.length;

    // Phase 2: Generation of 3 High-Presence Vector Submarks
    currentPhase = 'generation';
    const targetElements = elements.slice(0, 3);
    imagesAttempted = targetElements.length;

    console.log(`[Brand Elements] Iniciando geração de 3 imagens vetoriais de alto impacto com gemini-2.5-flash-image / imagen-4.0...`);

    const elementsPromises = targetElements.map(async (elem, index) => {
      const genPrompt = `
Generate ONE SINGLE ISOLATED BESPOKE BRAND SUBMARK ICON: ${elem.visualDescription}.

STRICT MANDATORY ART DIRECTION:
- SINGLE STANDALONE ICON ONLY: Exactly ONE central icon glyph positioned directly in the center of the frame.
- CANVAS PROPORTION: The symbol must be prominent, bold, and confident, occupying 75% of the canvas area.
- STYLE & CONTRAST: Clean vector lineart or solid vector silhouette in pure solid black (#000000) on pure solid white (#FFFFFF) background.
- VISUAL MASS: Confident solid medium-bold vector strokes with clean, antialiased edges and strong silhouette presence. Must NOT be thin, hairline, fragile, or faint.
- INSTANT LEGIBILITY: Must be instantly recognizable and clear at small icon size (24px).
- ABSOLUTE PROHIBITIONS:
  * NO shields, crests, emblems, coat of arms, or badges
  * NO container borders, outer circles, outer squares, boxes, or cards
  * NO fragile decorative flourishes, thin whiskers, or ornamental scribbles
  * NO literal profession clipart (no medical crosses, no teeth, no stethoscopes, no popcorn boxes)
  * NO background patterns, textures, or repeating tiles
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

        const candidates = genRes.candidates || genRes.response?.candidates;
        for (const part of candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            console.log(`✅ [Brand Elements] Imagem ${index + 1} gerada com sucesso via gemini-2.5-flash-image.`);
            return {
              id: `gen-elem-${index + 1}`,
              title: elem.title || `Elemento 0${index + 1}`,
              label: elem.label || '',
              sourceType: elem.sourceType || '',
              origin: elem.origin || 'Inspirado na sua estampa',
              visualDescription: elem.visualDescription || '',
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            };
          }
        }
      } catch (err1) {
        console.warn(`⚠️ [Brand Elements] gemini-2.5-flash-image falhou para elemento ${index + 1}: ${sanitizeError(err1.message)}. Acionando fallback Imagen 4...`);
      }

      // Tentativa 2: fallback com imagen-4.0-generate-001 usando ai.models.generateImages
      try {
        const fallbackRes = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `Single isolated bespoke minimalist brand submark glyph: ${elem.visualDescription}. Solid bold black vector silhouette on pure solid white background. High contrast, strong silhouette presence. No borders, no shields, no text. Clean 2D icon.`,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
          }
        });

        const imagePart = fallbackRes?.generatedImages?.[0];
        if (imagePart?.image?.imageBytes) {
          console.log(`✅ [Brand Elements] Imagem ${index + 1} gerada com sucesso via fallback Imagen 4.`);
          return {
            id: `gen-elem-${index + 1}`,
            title: elem.title || `Elemento 0${index + 1}`,
            label: elem.label || '',
            sourceType: elem.sourceType || '',
            origin: elem.origin || 'Inspirado na sua estampa',
            visualDescription: elem.visualDescription || '',
            base64: imagePart.image.imageBytes,
            mimeType: 'image/png'
          };
        }
      } catch (err2) {
        console.error(`❌ [Brand Elements] Fallback Imagen 4 falhou para elemento ${index + 1}: ${sanitizeError(err2.message)}`);
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
      console.error(`❌ [Brand Elements] Geração rejeitada: ${rejectionReason} (${imagesValid}/3 válidos)`);

      return Response.json({
        error: "Não foi possível gerar os 3 elementos gráficos com a qualidade exigida. Tente novamente sem custo.",
        telemetry: {
          phase: currentPhase,
          elementsFound,
          imagesAttempted,
          imagesValid,
          rejectionReason,
          durationMs: Date.now() - startTime,
          errorId: `err_validation_${Date.now()}`
        }
      }, { status: 502 });
    }

    const durationMs = Date.now() - startTime;
    console.log(`🎉 [Brand Elements] SUCESSO TOTAL: 3/3 elementos gerados e validados em ${durationMs}ms (Tipo: ${patternTypeDetected}).`);

    return Response.json({
      elements: validElements,
      telemetry: {
        phase: 'complete',
        patternType: patternTypeDetected,
        elementsFound,
        imagesAttempted,
        imagesValid: 3,
        durationMs,
        rejectionReason: null
      }
    });

  } catch (error) {
    const errorId = `err_fatal_${Date.now()}`;
    const sanitizedMsg = sanitizeError(error.message);
    console.error(`❌ [Brand Elements] Erro fatal em /api/generate-brand-elements:`, { phase: currentPhase, errorId, sanitizedMsg });

    return Response.json({
      error: error.message || "Falha ao gerar elementos gráficos da marca",
      telemetry: {
        phase: currentPhase,
        elementsFound,
        imagesAttempted,
        imagesValid,
        rejectionReason: 'unhandled_server_exception',
        errorId
      }
    }, { status: 502 });
  }
}
