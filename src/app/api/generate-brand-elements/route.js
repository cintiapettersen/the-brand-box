import { GoogleGenAI } from "@google/genai";

function sanitizeError(msg) {
  if (!msg || typeof msg !== 'string') return 'unknown_error';
  return msg.replace(/key=[^&]+/gi, 'key=***')
            .replace(/Bearer\s+[^\s"']+/gi, 'Bearer ***')
            .substring(0, 150);
}

export async function POST(req) {
  let currentPhase = 'initialization';
  let motifsFound = 0;
  let imagesAttempted = 0;
  let imagesValid = 0;

  try {
    const { patternBase64, patternMimeType, paleta, estiloNome } = await req.json();

    if (!patternBase64) {
      return Response.json({
        error: "patternBase64 é obrigatório",
        telemetry: { phase: 'initialization', motifsFound: 0, imagesAttempted: 0, imagesValid: 0, rejectionReason: 'missing_patternBase64' }
      }, { status: 400 });
    }

    const cleanBase64 = typeof patternBase64 === 'string' ? patternBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '') : patternBase64;
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined;

    if (!apiKey) {
      return Response.json({
        error: "GEMINI_API_KEY não configurada",
        telemetry: { phase: 'initialization', motifsFound: 0, imagesAttempted: 0, imagesValid: 0, rejectionReason: 'missing_api_key' }
      }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const mimeType = patternMimeType || 'image/png';
    const primaryColor = (paleta && paleta[0]) ? paleta[0] : '#2A897F';

    // Phase 1: Analysis
    currentPhase = 'analysis';
    const analysisPrompt = `
Analyze the attached pattern image.
Identify 3 DISTINCT individual visual elements/motifs that are physically present in this pattern image (e.g. a specific curved leaf, a distinct 5-petal flower, an abstract arch shape, a small berry branch, a star motif, etc.).

For each of the 3 motifs, provide:
1. "title": A short Portuguese title describing the motif (e.g. "Folha Curva", "Flor Solitária", "Ramo de Botões", "Forma Orgânica").
2. "origin": A short sentence in Portuguese explaining where it came from in the pattern (e.g. "Inspirado na folha curva presente na sua estampa", "Derivado das flores delicadas da estampa", "Extraído das hastes orgânicas do padrão").
3. "visualDescription": A precise English visual description of the isolated shape/motif (e.g. "a single curved leaf with thin stem", "a minimal five-petal flower icon", "a small cluster of three berries").

Return strictly valid JSON array of 3 objects with keys "title", "origin", and "visualDescription".
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
      // Fallback para garantir 3 descrições se a análise em formato livre tiver oscilado
      motifs = [
        { title: "Folha Orgânica", origin: "Inspirado nos ramos folhosos presentes na sua estampa", visualDescription: "a single organic curved leaf motif" },
        { title: "Flor Delicada", origin: "Derivado das pétalas sutis presentes na estampa", visualDescription: "a minimal single flower motif" },
        { title: "Elemento Botânico", origin: "Extraído das formas abstratas do padrão visual", visualDescription: "an abstract organic botanical shape" }
      ];
    }

    motifsFound = motifs.length;

    // Phase 2: Generation
    currentPhase = 'generation';
    const targetMotifs = motifs.slice(0, 3);
    imagesAttempted = targetMotifs.length;

    const elementsPromises = targetMotifs.map(async (motif, index) => {
      const genPrompt = `
Look at the attached pattern image as reference.
Extract and illustrate ONE SINGLE ISOLATED GRAPHIC MOTIF: ${motif.visualDescription}.

MANDATORY SPECIFICATIONS:
- ISOLATED ELEMENT ONLY: Render exactly one motif centered on a PURE WHITE BACKGROUND (#FFFFFF).
- FLAT MONOCHROMATIC GRAPHIC ICON / VECTOR ILLUSTRATION.
- COLOR: Use ONLY the exact color ${primaryColor} for the entire shape.
- NO GRADIENTS, NO SHADOWS, NO MULTIPLE COLORS.
- NO OTHER ELEMENTS, NO BACKGROUND PATTERNS, NO BORDERS, NO MARGINS.
- Clean vector lineart or solid flat silhouette.
`;

      // Tentativa 1 com gemini-2.5-flash-image (alinhado com /api/generate-pattern)
      try {
        const genRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [
            { inlineData: { mimeType, data: cleanBase64 } },
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
              title: motif.title || `Motivo ${index + 1}`,
              origin: motif.origin || 'Extraído da estampa',
              visualDescription: motif.visualDescription || '',
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            };
          }
        }
      } catch (err1) {
        console.warn(`[Telemetry] gemini-2.5-flash-image failed for motif ${index + 1}: ${sanitizeError(err1.message)}`);
      }

      // Fallback de modelo para a mesma tentativa com imagen-3.0-generate-002
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'imagen-3.0-generate-002',
          contents: [
            { inlineData: { mimeType, data: cleanBase64 } },
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
            title: motif.title || `Motivo ${index + 1}`,
            origin: motif.origin || 'Extraído da estampa',
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

    // Phase 3: Validation (Regra Estrita de Exatamente 3 Elementos)
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
        error: "Não foi possível extrair os 3 elementos gráficos completos da estampa.",
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

    // Sucesso garantido com exatamente 3 elementos válidos
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
      error: error.message || "Falha ao gerar elementos da estampa",
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
