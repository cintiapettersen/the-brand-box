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
      `You are generating a SINGLE TILE of a seamless repeating surface pattern. This tile will be repeated infinitely in all directions. CRITICAL REQUIREMENT: Every element (shape, dot, leaf, flower, brushstroke) that touches or crosses the edge of the image MUST continue and reappear on the exact opposite edge — top-to-bottom and left-to-right — so the tile repeats with ZERO visible seams or borders. Use LARGE-SCALE motifs that fill most of the tile — only 2 to 4 main elements per tile so that when repeated the pattern feels airy and intentional, not busy or crowded. Replicate the artistic DNA of the reference: same drawing technique, same element types. Colors ONLY: ${coresStr}. Style: ${hint}. White or light background. NO white margins, NO vignettes, NO drop shadows near edges. The pattern must fill edge-to-edge.`,
      `Create ONE TILE of an infinitely repeating seamless surface pattern. The tile must be perfectly wrappable: any motif that exits from the right edge must re-enter from the left; any motif that exits from the bottom must re-enter from the top. This ensures zero-seam infinite repeat. Use BIG, BOLD motifs — maximum 3 to 5 elements per tile, each occupying significant space, so the repeat looks elegant and spacious rather than small and repetitive. Maintain the visual style and element types from the reference image. Colors ONLY: ${coresStr}. Style: ${hint}. Flat illustration, white background, full bleed to all four edges.`,
      `Design a seamless repeat tile for a premium brand textile pattern. SEAMLESS means: motifs that cross any edge are cut in half, with the other half appearing on the opposite edge. Test: if you fold this image into a torus, no seam should appear. SCALE: use large motifs — 2 to 4 elements that are generous in size, creating an open, editorial feel when tiled. Inspired by the reference style. Colors ONLY: ${coresStr}. Style: ${hint}. Edge-to-edge, no borders, no margins.`
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
          prompt: `A single tile of a perfectly seamless repeating surface pattern for a professional brand. Style: ${estiloNome}, ${hint}. SEAMLESS means elements that exit one edge reappear on the opposite edge — top wraps to bottom, left wraps to right — creating zero-seam infinite repeat. Colors ONLY: ${coresStr}. White background. Flat vector illustration. Edge-to-edge, full bleed, no margins, no vignettes.`,
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
