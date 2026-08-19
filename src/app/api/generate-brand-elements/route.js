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

    // Phase 1.1: Validação de Qualidade da Estampa de Entrada
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

    // Phase 1.2: Multimodal Brand & Pattern Analysis with 3 Distinct Source Families
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
- IMAGE 1: THE APPROVED PATTERN (The visual raw material and source of motifs, geometry, curves, rhythm, and contours).
${styleRefParts.length > 0 ? `- IMAGES 2+: STYLE REFERENCE IMAGES (Visual conditioning ONLY: showing stroke weight, level of simplification, vector finish, line confidence, and visual weight. DO NOT COPY WHAT IS DRAWN IN THESE REFERENCES. ONLY USE HOW THEY ARE DRAWN).` : ''}

YOUR GOAL:
Define exactly 3 DISTINCT, HIGH-IMPACT, HIGH-CONFIDENCE BRAND GRAPHIC ELEMENTS / SUBMARKS derived from 3 DIFFERENT VISUAL SOURCE FAMILIES inside the approved pattern.

CRITICAL RULES:
1. STRICT VISUAL FACTUALITY:
   Analyze ONLY what is actually visible in the pattern image. NEVER invent or hallucinate objects (stars, leaves, crosses, etc.) that do not visibly exist in the pattern.

2. CHOOSE 3 DISTINCT SOURCE FAMILIES (NO MONOCULTURE):
   - Option 1 (Motivo Principal): Derived from the strongest visible motif or primary contour in the pattern.
   - Option 2 (Estrutura Geométrica): Derived from geometric organization, circular modules, interlocking symmetry, or layout logic in the pattern.
   - Option 3 (Composição Ornamental): Derived from a third distinct source family in the pattern (focal decorative shape, modular cluster, or shape dynamic).

3. NO EMBLEMS, SHIELDS, CRESTS, OR BADGES: Absolutely NO heraldic shields, crests, or container borders.
4. NO LITERAL PROFESSION PICTOGRAMS: NO medical crosses, NO teeth, NO stethoscopes, NO generic clipart.

5. OUTPUT FORMAT: Strictly valid JSON array of exactly 3 objects:
[
  {
    "title": "Elemento 01",
    "label": "Motivo Principal",
    "sourceFamily": "...",
    "origin": "Inspirado no motivo visual dominante da sua estampa",
    "visualDescription": "a solid bold clean black vector mark of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
  },
  {
    "title": "Elemento 02",
    "label": "Estrutura Geométrica",
    "sourceFamily": "...",
    "origin": "Inspirado na estrutura geométrica e na simetria modular da sua estampa",
    "visualDescription": "a solid bold clean black vector geometric mark of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
  },
  {
    "title": "Elemento 03",
    "label": "Composição Ornamental",
    "sourceFamily": "...",
    "origin": "Inspirado na composição ornamental e no equilíbrio visual da sua estampa",
    "visualDescription": "a solid bold clean black vector decorative brand symbol of ..., confident solid stroke weight, single centered symbol filling 75% of frame, pure white background, no text, no frame, no shield"
  }
]
`;

    let motifs = [];
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

      let textRes = analysisResponse.response?.text ? analysisResponse.response.text().trim() : (analysisResponse.text ? analysisResponse.text().trim() : '');
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
          label: item.label || (idx === 0 ? 'Motivo Principal' : idx === 1 ? 'Estrutura Geométrica' : 'Composição Ornamental'),
          sourceFamily: item.sourceFamily || '',
          origin: item.origin || (idx === 0 ? 'Inspirado no motivo visual dominante da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na composição ornamental da sua estampa'),
          visualDescription: item.visualDescription || ''
        }));
      }
    } catch (parseErr1) {
      console.warn(`[Telemetry] Analysis parsing attempt 1 failed: ${sanitizeError(parseErr1.message)}. Tentando retry controlado...`);
    }

    // Tentativa 2 de Análise (Retry Controlado sem fabricar dados)
    if (!Array.isArray(motifs) || motifs.length < 3) {
      try {
        const retryContents = [
          { inlineData: { mimeType, data: cleanBase64 } },
          { text: "Return strictly a valid JSON array with 3 objects defining 3 distinct brand submark symbols observed in this pattern: [{\"title\":\"Elemento 01\",\"label\":\"Motivo Principal\",\"origin\":\"Inspirado no motivo dominante da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 02\",\"label\":\"Estrutura Geométrica\",\"origin\":\"Inspirado na estrutura da sua estampa\",\"visualDescription\":\"...\"},{\"title\":\"Elemento 03\",\"label\":\"Composição Ornamental\",\"origin\":\"Inspirado no equilíbrio da sua estampa\",\"visualDescription\":\"...\"}]" }
        ];

        const retryResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: retryContents,
          config: { responseMimeType: 'application/json' }
        });

        let retryText = retryResponse.response?.text ? retryResponse.response.text().trim() : (retryResponse.text ? retryResponse.text().trim() : '');
        const firstB = retryText.indexOf('[');
        const lastB = retryText.lastIndexOf(']');
        if (firstB !== -1 && lastB > firstB) {
          retryText = retryText.substring(firstB, lastB + 1);
        }
        const parsedRetry = JSON.parse(retryText);
        if (Array.isArray(parsedRetry) && parsedRetry.length >= 3) {
          motifs = parsedRetry.slice(0, 3).map((item, idx) => ({
            title: item.title || `Elemento 0${idx + 1}`,
            label: item.label || (idx === 0 ? 'Motivo Principal' : idx === 1 ? 'Estrutura Geométrica' : 'Composição Ornamental'),
            sourceFamily: item.sourceFamily || '',
            origin: item.origin || (idx === 0 ? 'Inspirado no motivo visual dominante da sua estampa' : idx === 1 ? 'Inspirado na estrutura geométrica da sua estampa' : 'Inspirado na composição ornamental da sua estampa'),
            visualDescription: item.visualDescription || ''
          }));
        }
      } catch (retryErr) {
        console.error(`[Telemetry] Analysis retry attempt 2 failed: ${sanitizeError(retryErr.message)}`);
      }
    }

    // Se após o retry a análise estruturada falhar, retornamos erro técnico em vez de inventar motivos falsos
    if (!Array.isArray(motifs) || motifs.length < 3) {
      return Response.json({
        error: "Não foi possível analisar os motivos da sua estampa com precisão suficiente. Por favor, tente novamente.",
        telemetry: {
          phase: currentPhase,
          rejectionReason: 'multimodal_analysis_parsing_failed',
          durationMs: Date.now() - startTime
        }
      }, { status: 502 });
    }

    motifsFound = motifs.length;
    debugTelemetry.motifs = motifs;

    // Phase 2: Generation of 3 High-Presence Vector Submarks
    currentPhase = 'generation';
    const targetMotifs = motifs.slice(0, 3);
    imagesAttempted = targetMotifs.length;

    const elementsPromises = targetMotifs.map(async (motif, index) => {
      const genPrompt = `
Generate ONE SINGLE ISOLATED BESPOKE BRAND SUBMARK ICON: ${motif.visualDescription}.

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
              title: motif.title || `Elemento 0${index + 1}`,
              label: motif.label || '',
              sourceFamily: motif.sourceFamily || '',
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

        const candidate = fallbackRes?.response?.candidates?.[0] || fallbackRes?.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData?.data) {
          return {
            id: `gen-elem-${index + 1}`,
            title: motif.title || `Elemento 0${index + 1}`,
            label: motif.label || '',
            sourceFamily: motif.sourceFamily || '',
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
