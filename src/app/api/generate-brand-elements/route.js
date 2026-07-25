import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { patternBase64, patternMimeType, paleta, estiloNome } = await req.json();

    if (!patternBase64) {
      return Response.json({ error: "patternBase64 é obrigatório" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined;
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY não configurada" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const mimeType = patternMimeType || 'image/png';
    const primaryColor = (paleta && paleta[0]) ? paleta[0] : '#2A897F';

    // Step 1: Analisar a estampa para extrair 3 motivos visuais com descrições e títulos
    const analysisPrompt = `
Analyze the attached pattern image.
Identify 3 DISTINCT individual visual elements/motifs that are physically present in this pattern image (e.g. a specific curved leaf, a distinct 5-petal flower, an abstract arch shape, a small berry branch, a star motif, etc.).

For each of the 3 motifs, provide:
1. "title": A short Portuguese title describing the motif (e.g. "Folha Curva", "Flor Solitária", "Ramo de Botões", "Forma Orgânica").
2. "origin": A short sentence in Portuguese explaining where it came from in the pattern (e.g. "Inspirado na folha curva presente na sua estampa", "Derivado das flores delicadas da estampa", "Extraído das hastes orgânicas do padrão").
3. "visualDescription": A precise English visual description of the isolated shape/motif (e.g. "a single curved leaf with thin stem", "a minimal five-petal flower icon", "a small cluster of three berries").

Return strictly valid JSON array of 3 objects with keys "title", "origin", and "visualDescription". Do not wrap in markdown quotes if possible or return raw JSON array.
`;

    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType, data: patternBase64 } },
        { text: analysisPrompt }
      ]
    });

    let textRes = analysisResponse.response.text().trim();
    if (textRes.startsWith("```json")) {
      textRes = textRes.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (textRes.startsWith("```")) {
      textRes = textRes.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let motifs = [];
    try {
      motifs = JSON.parse(textRes);
    } catch (e) {
      console.error("Erro ao parsear resposta do Gemini na análise:", e, textRes);
      motifs = [
        {
          title: "Folha Orgânica",
          origin: "Inspirado nos ramos folhosos presentes na sua estampa",
          visualDescription: "a single organic curved leaf motif"
        },
        {
          title: "Flor Delicada",
          origin: "Derivado das pétalas sutis presentes na estampa",
          visualDescription: "a minimal single flower motif"
        },
        {
          title: "Elemento Botânico",
          origin: "Extraído das formas abstratas do padrão visual",
          visualDescription: "an abstract organic botanical shape"
        }
      ];
    }

    // Step 2: Gerar 3 imagens isoladas monocromáticas transparentes (1 para cada motivo)
    const elementsPromises = motifs.slice(0, 3).map(async (motif, index) => {
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

      const genRes = await ai.models.generateContent({
        model: 'imagen-3.0-generate-002',
        contents: [
          { inlineData: { mimeType, data: patternBase64 } },
          { text: genPrompt }
        ],
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        }
      });

      const candidate = genRes?.response?.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find(p => p.inlineData);
      
      let base64 = null;
      if (imagePart?.inlineData?.data) {
        base64 = imagePart.inlineData.data;
      }

      return {
        id: `gen-elem-${index + 1}`,
        title: motif.title,
        origin: motif.origin,
        visualDescription: motif.visualDescription,
        base64: base64,
        mimeType: 'image/png'
      };
    });

    const results = await Promise.all(elementsPromises);
    const validElements = results.filter(item => item.base64 !== null);

    return Response.json({ elements: validElements });
  } catch (error) {
    console.error("Erro na API /api/generate-brand-elements:", error);
    return Response.json({ error: error.message || "Falha ao gerar elementos da estampa" }, { status: 500 });
  }
}
