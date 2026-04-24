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

    // Gerar 3 variações com profundidades diferentes de criatividade
    const variationPrompts = [
      `REPLICATE THE ARTISTIC DNA: Follow the exact drawing technique and architecture of the reference image. FULL BLEED - NO WHITE MARGINS - NO BORDERS. Art must reach the absolute pixel edge. 80% DNA, 20% professional SEAMLESS TILE. Absolute pixel continuity. Colors ONLY: ${coresStr}.`,
      `STYLISTIC EVOLUTION: Maintain visual soul but explore NEW COMPOSITION. FULL BLEED - NO BORDERS. Technically perfect infinite repeat tile. No visible seams. High-fidelity textile print standard. Colors: ONLY ${coresStr}.`,
      `BRAND FAMILY VARIATION: Create an original repeatable pattern tile in the same "collection" as the reference. FULL BLEED - NO VIGNETTES. Strictly seamless, 100% fluid repeat to the absolute edge. Colors: ONLY ${coresStr}.`
    ];

    for (let i = 0; i < 3; i++) {
      try {
        const contents = [];
        
        // Todas as variantes agora usam a referência para manter o DNA da marca
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
              id: results.length,
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            });
            console.log(`✅ Padrão ${i + 1} gerado (${refUrl ? 'com ref' : 'estilo livre'})`);
            break;
          }
        }
      } catch (err) {
        console.error(`❌ Variação ${i + 1} falhou:`, err.message?.substring(0, 100));
      }
    }

    // Se ainda não temos 3 imagens, o Imagen 4 entra como reforço de "Tiles"
    if (results.length < 3) {
      console.log(`⚠️ Gerando reforço com Imagen 4 (Total atual: ${results.length}/3)...`);
      try {
        const remaining = 3 - results.length;
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `A technically perfect, strictly seamless tileable surface pattern for a professional brand. Style: ${estiloNome}. Elements MUST wrap around boundaries for 100% infinite and fluid repeat. NO SEAMS, NO BORDERS. Colors: ONLY ${coresStr}. White background. Flat vector illustration style. Edge-to-edge continuity is mandatory.`,
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
