import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { paleta, estiloNome, marca, descricao, referenceUrl } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const coresStr = (paleta || []).join(', ');

    // Buscar imagem de referência se tiver URL
    let refImagePart = null;
    if (referenceUrl) {
      try {
        const imgRes = await fetch(referenceUrl);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = imgRes.headers.get('content-type') || 'image/png';
        refImagePart = {
          inlineData: { mimeType, data: base64 }
        };
        console.log('📸 Referência carregada:', referenceUrl.substring(0, 80));
      } catch (e) {
        console.log('⚠️ Não conseguiu carregar referência:', e.message);
      }
    }

    const results = [];

    // Gerar 2 variações usando Nano Banana (aceita imagem como referência)
    for (let i = 0; i < 2; i++) {
      try {
        const variationPrompts = [
          `Create a seamless tileable pattern inspired by the reference image style. Use ONLY these colors: ${coresStr}. Keep the same artistic feel but create a NEW composition. White or very light background. Absolutely NO text, NO letters, NO numbers, NO words, NO hex codes anywhere in the image.`,
          `Based on the reference pattern style, design a different seamless pattern variation. Colors: ONLY ${coresStr}. Same delicate style but different arrangement of elements. Clean background. CRITICAL: Do NOT include ANY text, labels, numbers, or color codes in the image.`,
          `Reimagine the reference pattern with a fresh layout. Use exclusively: ${coresStr}. Maintain the same aesthetic but rearrange and vary the elements. Light background. IMPORTANT: The image must contain ZERO text of any kind - no labels, no codes, no descriptions.`,
          `Create an elegant variation of the reference pattern. Only use colors: ${coresStr}. Keep it cohesive with the original style but with unique element placement. Soft background. WARNING: Absolutely no text, typography, words, or alphanumeric characters should appear in the pattern.`
        ];

        const contents = [];
        if (refImagePart) {
          contents.push(refImagePart);
        }
        contents.push({ text: variationPrompts[i] });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: contents,
          config: {
            responseModalities: ['image'],
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            results.push({
              id: i,
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            });
            console.log(`✅ Padrão ${i + 1} gerado com Nano Banana`);
            break;
          }
        }
      } catch (err) {
        console.error(`❌ Variação ${i + 1} falhou:`, err.message?.substring(0, 100));
      }
    }

    // Se Nano Banana não gerou o suficiente, completa com Imagen 4 (sem referência)
    if (results.length < 2) {
      console.log(`⚠️ Nano Banana gerou ${results.length}/2, completando com Imagen 4...`);
      try {
        const remaining = 2 - results.length;
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `Beautiful seamless tileable pattern for a brand called "${marca}". Style: ${estiloNome}. Use ONLY these colors: ${coresStr}. White background. Flat vector illustration style. Absolutely NO text, NO letters, NO numbers, NO labels, NO hex codes in the image. Only decorative pattern elements like flowers, leaves, and botanical motifs.`,
          config: { numberOfImages: remaining },
        });

        for (const img of response.generatedImages) {
          results.push({
            id: results.length,
            base64: img.image.imageBytes,
            mimeType: 'image/png'
          });
        }
      } catch (e) {
        console.error('Imagen 4 fallback falhou:', e.message?.substring(0, 100));
      }
    }

    if (results.length > 0) {
      return Response.json({ success: true, images: results });
    }

    return Response.json({ success: false, error: 'Nenhuma imagem gerada' }, { status: 500 });

  } catch (error) {
    console.error("Erro geral:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
