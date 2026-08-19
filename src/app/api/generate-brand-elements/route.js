import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { STYLE_ICONS } from '../../../lib/styleIcons';
import { validatePatternCoverage } from '../../../lib/patternCoverageValidator';

export const maxDuration = 60; // Permite até 60 segundos para processamento de IA

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function sanitizeError(msg) {
  if (!msg) return 'unknown_error';
  return String(msg).replace(/api[-_]?key=[^&\s]+/gi, 'api_key=REDACTED');
}

export async function POST(request) {
  const startTime = Date.now();
  let currentPhase = 'initialization';
  let elementsFound = 0;
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

    // Phase 1.1: Validação de Qualidade Técnica da Estampa de Entrada
    currentPhase = 'pattern_quality_gate';
    const patternCheck = await validatePatternCoverage(cleanBase64);
    if (!patternCheck.valid && patternCheck.backgroundRatio > 0.85) {
      console.warn(`⚠️ [Quality Gate] Estampa rejeitada na entrada de Brand Elements: ${patternCheck.reason}`);
      return Response.json({
        error: "A estampa selecionada possui área vazia excessiva para extração de elementos gráficos. Gere uma nova estampa com motivos distribuídos.",
        telemetry: {
          phase: currentPhase,
          rejectionReason: patternCheck.reason,
          backgroundRatio: patternCheck.backgroundRatio
        }
      }, { status: 400 });
    }

    // Phase 1.2: Análise Multimodal (Classificação: Figurativo, Abstrato ou Misto)
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
    } catch (fsErr) {
      console.warn('[Telemetry] Could not load visual style references from disk:', sanitizeError(fsErr.message));
    }

    const sensacoesText = Array.isArray(sensacoes) ? sensacoes.join(', ') : (sensacoes || '');
    const elementosText = Array.isArray(elementosVisuais) ? elementosVisuais.join(', ') : (elementosVisuais || '');

    const buildAnalysisPrompt = () => `
You are a World-Class Brand Identity Creative Director specialized in bespoke visual identity submarks, seals, and minimalist luxury brand symbols.

INPUT CONTEXT:
- Brand Name: "${marca || 'Brand'}"
- Business Area / Niche: "${areaAtuacao || 'Profissional / Empresa'}"
- Brand Style: "${estiloNome || 'Essência Atemporal'}"
- Feelings / Sensations: "${sensacoesText}"
- Visual Elements Reference: "${elementosText}"

IMAGE INPUTS IN THIS REQUEST:
- IMAGE 1: THE APPROVED PATTERN (The visual raw material and foundation of the brand's visual identity).
${styleRefParts.length > 0 ? `- IMAGES 2+: STYLE REFERENCE IMAGES (Visual conditioning ONLY: showing stroke weight, level of simplification, vector finish, line confidence, and visual weight. DO NOT COPY WHAT IS DRAWN IN THESE REFERENCES. ONLY USE HOW THEY ARE DRAWN).` : ''}

YOUR GOAL:
1. CLASSIFY THE PATTERN TYPE:
   - "figurative": The pattern contains clearly identifiable figurative objects or botanical elements (e.g. flowers, leaves, birds, stars, shells, fruits).
   - "abstract": The pattern is purely non-figurative (e.g. geometric arches, modular grids, rhythmic waves, linear intersections, abstract contours, or pure spatial forms). In this case, figurative motifs are legitimately absent, and you MUST derive concepts from formal visual properties (geometry, curves, rhythm, line weight, symmetry, negative space, modular repetition).
   - "mixed": The pattern combines recognizable motifs with abstract geometric or linear structures.

2. EXTRACT 3 DISTINCT BRAND GRAPHIC ELEMENTS / SUBMARKS:
   - For FIGURATIVE patterns:
     * Option 1: Derived from the dominant recognizable motif.
     * Option 2: Derived from the geometric framework or layout rhythm.
     * Option 3: Derived from an ornamental composition or secondary visual feature.
   - For ABSTRACT patterns (LACK OF FIGURATIVE MOTIFS IS EXPECTED AND FULLY SUPPORTED):
     * Option 1: Derived from the primary shape language, dominant curve, or primary contour.
     * Option 2: Derived from the geometric structure, modular symmetry, or spatial intersections.
     * Option 3: Derived from the rhythmic flow, negative space balance, or compositional harmony.
   - For MIXED patterns:
     * Combine the strongest motif with formal geometric and compositional features.

3. STRICT QUALITY & ANTI-CLUSTERING RULES:
   - The 3 options MUST come from 3 DIFFERENT visual observations (no monoculture).
   - ONE CLEAR CENTRAL SHAPE occupying 75% of canvas area.
   - Solid, confident medium-bold vector line weight or solid mass (NEVER thin hairline or random scribble).
   - Instant legibility in under 1 second at 24px (submark seal size).
   - NO shields, crests, emblems, coat of arms, or badges.
   - NO literal profession clipart (no medical crosses, no teeth, no stethoscopes).

4. GROUNDED, SIMPLE EXPLANATIONS:
   - "title": "Elemento 01", "Elemento 02", "Elemento 03"
   - "label": "Forma Principal" (or "Motivo Principal" if figurative), "Estrutura Geométrica", "Composição Ornamental"
   - "origin": Short objective sentence in Portuguese stating the actual visual origin.

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
      "origin": "Inspirado na forma contínua e no ritmo visual da sua estampa",
      "visualDescription": "a solid bold clean black vector mark of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    },
    {
      "title": "Elemento 02",
      "label": "Estrutura Geométrica",
      "sourceType": "geometric_structure",
      "origin": "Inspirado na estrutura geométrica e na simetria modular da sua estampa",
      "visualDescription": "a solid bold clean black vector geometric mark of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    },
    {
      "title": "Elemento 03",
      "label": "Composição Ornamental",
      "sourceType": "compositional_harmony",
      "origin": "Inspirado no equilíbrio de formas e na composição da sua estampa",
      "visualDescription": "a solid bold clean black vector decorative brand symbol of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
    }
  ]
}
`;

    let elements = [];
    let patternTypeDetected = 'unknown';
    let rawMultimodalResponse = '';

    const contents = [
      { inlineData: { mimeType, data: cleanBase64 } },
      ...styleRefParts,
      { text: buildAnalysisPrompt() }
    ];

    // Tentativa 1 de Análise Multimodal
    try {
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: { responseMimeType: 'application/json' }
      });

      rawMultimodalResponse = analysisResponse.response?.text ? analysisResponse.response.text().trim() : (analysisResponse.text ? analysisResponse.text().trim() : '');
      console.log(`[Telemetry] Raw Multimodal Response (Attempt 1):`, rawMultimodalResponse);

      let textRes = rawMultimodalResponse;
      if (textRes.startsWith("```json")) {
        textRes = textRes.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (textRes.startsWith("```")) {
        textRes = textRes.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(textRes);
      console.log(`[Telemetry] Parsed JSON Response:`, parsed);

      patternTypeDetected = parsed.patternType || (Array.isArray(parsed) ? 'mixed' : 'abstract');
      const rawElements = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.elements) ? parsed.elements : []);

      if (rawElements.length >= 3) {
        elements = rawElements.slice(0, 3).map((item, idx) => ({
          title: item.title || `Elemento 0${idx + 1}`,
          label: item.label || (idx === 0 ? (patternTypeDetected === 'abstract' ? 'Forma Principal' : 'Motivo Principal') : idx === 1 ? 'Estrutura Geométrica' : 'Composição Ornamental'),
          sourceType: item.sourceType || (idx === 0 ? 'primary_form_or_motif' : idx === 1 ? 'geometric_structure' : 'compositional_harmony'),
          origin: item.origin || (idx === 0 ? 'Inspirado na forma e no ritmo visual da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na composição visual da sua estampa'),
          visualDescription: item.visualDescription || ''
        }));
      }
    } catch (parseErr1) {
      console.warn(`[Telemetry] Analysis parsing attempt 1 failed: ${sanitizeError(parseErr1.message)}. Tentando retry controlado...`);
    }

    // Tentativa 2 de Análise (Retry Controlado se necessário)
    if (!Array.isArray(elements) || elements.length < 3) {
      try {
        const retryContents = [
          { inlineData: { mimeType, data: cleanBase64 } },
          { text: "Return strictly a JSON object with 3 distinct brand submark symbols derived from this pattern (whether abstract, geometric or figurative): {\"patternType\":\"abstract\",\"elements\":[{\"title\":\"Elemento 01\",\"label\":\"Forma Principal\",\"origin\":\"Inspirado na forma principal da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 02\",\"label\":\"Estrutura Geométrica\",\"origin\":\"Inspirado na estrutura geométrica da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 03\",\"label\":\"Composição Ornamental\",\"origin\":\"Inspirado na composição da sua estampa\",\"visualDescription\":\"...\"}]}" }
        ];

        const retryResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: retryContents,
          config: { responseMimeType: 'application/json' }
        });

        let retryText = retryResponse.response?.text ? retryResponse.response.text().trim() : (retryResponse.text ? retryResponse.text().trim() : '');
        console.log(`[Telemetry] Raw Multimodal Response (Attempt 2 Retry):`, retryText);

        if (retryText.startsWith("```json")) {
          retryText = retryText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (retryText.startsWith("```")) {
          retryText = retryText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsedRetry = JSON.parse(retryText);
        patternTypeDetected = parsedRetry.patternType || (Array.isArray(parsedRetry) ? 'mixed' : 'abstract');
        const rawRetryElements = Array.isArray(parsedRetry) ? parsedRetry : (Array.isArray(parsedRetry.elements) ? parsedRetry.elements : []);

        if (rawRetryElements.length >= 3) {
          elements = rawRetryElements.slice(0, 3).map((item, idx) => ({
            title: item.title || `Elemento 0${idx + 1}`,
            label: item.label || (idx === 0 ? (patternTypeDetected === 'abstract' ? 'Forma Principal' : 'Motivo Principal') : idx === 1 ? 'Estrutura Geométrica' : 'Composição Ornamental'),
            sourceType: item.sourceType || (idx === 0 ? 'primary_form_or_motif' : idx === 1 ? 'geometric_structure' : 'compositional_harmony'),
            origin: item.origin || (idx === 0 ? 'Inspirado na forma e no ritmo visual da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na composição visual da sua estampa'),
            visualDescription: item.visualDescription || ''
          }));
        }
      } catch (retryErr) {
        console.error(`[Telemetry] Analysis retry attempt 2 failed: ${sanitizeError(retryErr.message)}`);
      }
    }

    // Validação de prosseguimento mandatória:
    // Se a análise estruturada falhar completamente após retry, retorna erro técnico neutro.
    if (!Array.isArray(elements) || elements.length < 3) {
      console.error(`[Telemetry] Multimodal analysis aborted: Could not obtain 3 elements from pattern.`);
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
    debugTelemetry.elements = elements;
    debugTelemetry.patternType = patternTypeDetected;

    console.log(`[Telemetry] Proceeding to Image Generation for 3 elements (Pattern Type: ${patternTypeDetected}).`);

    // Phase 2: Generation of 3 High-Presence Vector Submarks
    currentPhase = 'generation';
    const targetElements = elements.slice(0, 3);
    imagesAttempted = targetElements.length;

    const elementsPromises = targetElements.map(async (elem, index) => {
      const genPrompt = `
Generate ONE SINGLE ISOLATED BESPOKE BRAND SUBMARK ICON: ${elem.visualDescription}.

STRICT MANDATORY ART DIRECTION:
- SINGLE STANDALONE ICON ONLY: Exactly ONE central icon glyph positioned directly in the center of the frame.
- CANVAS PROPORTION: The symbol must be prominent and bold, occupying 75% of the canvas area.
- STYLE & CONTRAST: Clean vector lineart or solid vector silhouette in pure solid black (#000000) on pure solid white (#FFFFFF) background.
- VISUAL MASS: Confident solid medium-bold vector strokes with clean, antialiased edges. Must NOT be thin, hairline, or faint.
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

        const candidates = genRes.candidates || genRes.response?.candidates;
        for (const part of candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
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
        console.warn(`[Telemetry] gemini-2.5-flash-image failed for element ${index + 1}: ${sanitizeError(err1.message)}`);
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

        const candidate = fallbackRes?.response?.candidates?.[0] || fallbackRes?.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData?.data) {
          return {
            id: `gen-elem-${index + 1}`,
            title: elem.title || `Elemento 0${index + 1}`,
            label: elem.label || '',
            sourceType: elem.sourceType || '',
            origin: elem.origin || 'Inspirado na sua estampa',
            visualDescription: elem.visualDescription || '',
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType || 'image/png'
          };
        }
      } catch (err2) {
        console.warn(`[Telemetry] imagen-3.0-generate-002 failed for element ${index + 1}: ${sanitizeError(err2.message)}`);
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
        elementsFound,
        imagesAttempted,
        imagesValid,
        rejectionReason,
        durationMs: Date.now() - startTime
      });

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
    console.log(`[Telemetry] Brand Elements generation success: 3/3 valid elements created in ${durationMs}ms (Pattern Type: ${patternTypeDetected}).`);

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
    console.error(`[Telemetry] Fatal error in /api/generate-brand-elements:`, { phase: currentPhase, errorId, sanitizedMsg });

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
