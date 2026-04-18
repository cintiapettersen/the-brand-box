import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { paleta, estiloNome, marca, descricao, referenceUrls } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const coresStr = (paleta || []).join(', ');
    const refs = referenceUrls || [];

    // Carregar imagens de referência
    const loadImage = async (url) => {
      try {
        const imgRes = await fetch(url);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = imgRes.headers.get('content-type') || 'image/png';
        console.log('📸 Referência carregada:', url.substring(0, 80));
        return { inlineData: { mimeType, data: base64 } };
      } catch (e) {
        console.log('⚠️ Não conseguiu carregar referência:', e.message);
        return null;
      }
    };

    const results = [];

    // Micro-direção por estilo (20% do prompt — o resto vem da imagem de referência)
    const styleHints = {
      'Jardim Encantado':      'whimsical, playful, illustrated, lúdico',
      'Escandinavo Acolhedor': 'minimal, nordic softness, playful and lúdico',
      'Essência Atemporal':    'organic shapes, timeless, elegant abstraction',
      'Doce Encantamento':     'delicate, dreamy, lúdico, playful and soft',
      'Raízes & Cuidado':      'botanical, earthy, handcrafted naturalism',
      'Estético Editorial':    'clean, structured geometry, clinical precision',
    };
    const hint = styleHints[estiloNome] || 'elegant and delicate';

    // Gerar 2 variações, cada uma com uma referência diferente
    const variationPrompts = [
      `Follow the reference image as closely as possible — same technique, same elements, same artistic feel. Create a seamless tileable pattern in that exact style. Subtle direction: ${hint}. Use ONLY these colors: ${coresStr}. White or very light background. Absolutely NO text, NO letters, NO numbers, NO words, NO hex codes anywhere in the image.`,
      `Follow the reference image very closely — replicate the technique and visual elements, but create a new composition. Seamless tileable pattern. Subtle direction: ${hint}. Colors: ONLY ${coresStr}. Clean background. CRITICAL: Do NOT include ANY text, labels, numbers, or color codes in the image.`,
    ];

    for (let i = 0; i < 2; i++) {
      try {
        const contents = [];
        
        // Cada variação usa uma referência diferente (se disponível)
        const refUrl = refs[i] || refs[0] || null;
        if (refUrl) {
          const refImage = await loadImage(refUrl);
          if (refImage) contents.push(refImage);
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
            console.log(`✅ Padrão ${i + 1} gerado (ref: ${refUrl?.substring(0, 50)})`);
            break;
          }
        }
      } catch (err) {
        console.error(`❌ Variação ${i + 1} falhou:`, err.message?.substring(0, 100));
      }
    }

    // Se não gerou o suficiente, completa com Imagen 4 (sem referência)
    if (results.length < 2) {
      console.log(`⚠️ Flash gerou ${results.length}/2, completando com Imagen 4...`);
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
