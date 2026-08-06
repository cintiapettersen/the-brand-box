import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { paleta, paletaNomes, estiloNome, marca, descricao, referenceUrls, count } = await req.json();
    const requestCount = typeof count === 'number' ? count : 3;

    const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined) });
    const coresStr = (paleta || []).join(', ');
    const refs = referenceUrls || [];

    // Carregar imagem de referência (uma URL por vez)
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

    // Descrição da marca para enriquecer contexto (primeiros 100 chars)
    const brandContext = descricao ? `Brand essence: "${descricao.substring(0, 100)}". ` : '';

    // Micro-direção visual por estilo — focando na estética, clima e estilo de ilustração sem prender os elementos
    const styleHints = {
      'Jardim Encantado':      'whimsical hand-drawn children\'s book aesthetic, playful organic forms, cute and friendly illustration style',
      'Escandinavo Acolhedor': 'cozy and warm nordic aesthetic, cute, playful, minimalist vibe, delicate and soft illustration style',
      'Essência Atemporal':    'timeless and refined organic aesthetic, elegant editorial abstract forms, sophisticated watercolor style',
      'Doce Encantamento':     'dreamy and romantic soft watercolor aesthetic, delicate and feminine styling, sweet and magical feel',
      'Raízes & Cuidado':      'naturalistic botanical aesthetic, organic handcrafted textures, warm earthy and hand-painted style',
      'Estético Editorial':    'clean aesthetic, structured and clinical beauty, modern abstract geometric precision, high-end editorial look',
    };
    const hint = styleHints[estiloNome] || 'elegant and delicate';
    const pn = paletaNomes || [];

    const colorRule = `
=========================================
CRITICAL COLOR RESTRICTION (MANDATORY & ABSOLUTE)
=========================================
You are an illustrator who has ONLY 5 tubes of paint. You MUST NOT use any other colors.
Treat the reference image ONLY as a structural/drawing technique guide. COMPLETELY DISCARD its original colors.

YOUR 5 MANDATORY PAINT TUBES (EXACT HEX CODES ONLY):
1. ${(paleta || [])[0] || '#000000'} (Dominant background/large shapes - MANDATORY PRIMARY)
2. ${(paleta || [])[1] || '#555555'} (Secondary motifs)
3. ${(paleta || [])[2] || '#888888'} (Accent details)
4. ${(paleta || [])[3] || '#BBBBBB'} (Minor accents)
5. ${(paleta || [])[4] || '#EEEEEE'} (Fine line details)

STRICT MANDATORY RULES:
1. Every single element, motif, line, and texture MUST be rendered using ONLY the 5 HEX codes specified above (or pure solid white/cream background if specified).
2. ABSOLUTELY DO NOT introduce green, red, yellow, blue or any external colors from the reference image unless they match the HEX codes above.
3. Ignore colors from the reference image completely. Replace 100% of reference colors with these exact HEX palette colors.
4. Solid, clean color application. No default gradients using unlisted colors.
=========================================
`;
    const seamless = `SEAMLESS TILING RULES (CRITICAL & MANDATORY):
- 70% DRAWING STYLE + 30% CREATIVE LAYOUT: Replicate the line weight, stroke style, and drawing technique from the reference image (70%), but place elements in a COMPLETELY NEW, UNIQUE composition layout (30%).
- ZERO BORDERS / SEAMS / LINES: Absolutely NO vertical, horizontal, or diagonal borders, margins, padding, seam lines, white/grey gaps, or division lines separating the tiles. The background must be 100% flat, solid, and uniform right up to the absolute edges. Full bleed edge-to-edge.
- PAC-MAN EDGE WRAPPING: Elements that exit one edge must wrap around and re-enter from the exact opposite edge (Pac-Man style).
- COMPOSITION INTEGRITY: Do NOT slice, cut, or crop main motifs/objects in half inside the tile, except for seamless wrap-around edge bleed at the absolute boundaries. Keep every motif in the middle fully formed, clear, and complete. Avoid chaotic overlaps or collision between different motifs.
- FLAT TWO-DIMENSIONAL SURFACES ONLY: Generate ONLY a single, flat, continuous two-dimensional seamless tile.
- NO FRAMES OR BORDERS: The generated image must be a full-bleed flat graphic going exactly to the absolute 4 corners.
- MANDATORY SIGNATURE TEXTURE: Apply a subtle, high-end organic canvas or fine paper grain texture across the ENTIRE surface.`;

    // 3 VARIAÇÕES VISUALMENTE DIVERSAS E DISTINTAS (LAYOUT & ESCALA)
    const variationPrompts = [
      // Variação 1 — Composição Orgânica Fluida (Densidade Média)
      `${brandContext}Look carefully at the reference image. Replicate its drawing technique, line quality, and illustration style as closely as possible.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image. Do NOT invent new subjects.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a BALANCED ORGANIC FLOW layout.
COMPOSITION VARIATION 1: Medium density, elegant spacing between motifs, balanced distribution across the tile.

${seamless}
Style context: ${hint}.`,

      // Variação 2 — Composição Minimalista e Espaçada ("Airy" Negative Space)
      `${brandContext}Study the reference image carefully. Replicate its exact illustration style, textures, and drawing technique.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a MINIMALIST AIRY LAYOUT.
COMPOSITION VARIATION 2: Extremely sparse and low-density arrangement with large open spaces of solid background color between motifs. Micro-sized elements scattered far apart. HIGH NEGATIVE SPACE.

${seamless}
Style context: ${hint}.`,

      // Variação 3 — Composição Dinâmica com Movimento Diagonal & Forte Contraste de Escala
      `${brandContext}Use the reference image as your main creative direction — match its illustration style and line weight.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a DYNAMIC DIAGONAL & HIGH-CONTRAST SCALE LAYOUT.
COMPOSITION VARIATION 3: Dynamic diagonal flow with dramatic scale contrast (very large focal motifs paired with tiny accent particles). Elements rotated and tilted along dynamic angles.

${seamless}
Style context: ${hint}.`,
    ];

    const results = [];

    // Cada variação recebe referências DIFERENTES, com offset aleatório para variar o input
    const randomRefOffset = Math.floor(Math.random() * (refs.length || 1));
    const pickRef = (i) => {
      if (refs.length === 0) return null;
      return refs[(i + randomRefOffset) % refs.length];
    };

    for (let i = 0; i < requestCount; i++) {
      try {
        const contents = [];

        const refUrl = pickRef(i);
        const seed = Math.floor(Math.random() * 1000000);

        if (refUrl) {
          const refImage = await loadImage(refUrl);
          if (refImage) {
            contents.push(refImage);
            if (refs.length > 1) {
              const refUrl2 = refs[(i + 1) % refs.length];
              if (refUrl2 !== refUrl) {
                const refImage2 = await loadImage(refUrl2);
                if (refImage2) contents.push(refImage2);
              }
            }
          }
        }

        const promptIdx = requestCount === 1 ? Math.floor(Math.random() * 3) : (i % 3);

        const creativeTweaks = [
          "Composition emphasis: Soft organic scattered alignment.",
          "Composition emphasis: Modern clean geometric balance.",
          "Composition emphasis: Delicate thin-line contrast.",
          "Composition emphasis: Playful asymmetric scattering.",
          "Composition emphasis: Dynamic diagonal movement.",
          "Composition emphasis: Ultra-minimal airy layout."
        ];
        const randomTweak = creativeTweaks[Math.floor(Math.random() * creativeTweaks.length)];
        const promptToUse = `${variationPrompts[promptIdx]}\nCreative touch for this variation: ${randomTweak}\n\n[System note: Creative Seed ${seed}. Ensure the composition and arrangement of motifs is 100% unique and distinct from other variations.]`;

        console.log(`🎨 Geração ${i + 1} (Prompt Index: ${promptIdx}, Tweak: "${randomTweak}") usando ref: ${refUrl ? refUrl.substring(0, 70) + '…' : 'nenhuma'}`);
        contents.push({ text: promptToUse });

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
            console.log(`✅ Variação ${i + 1} gerada (ref: ${refUrl ? refUrl.substring(0, 50) + '…' : 'nenhuma'})`);
            break;
          }
        }
      } catch (err) {
        console.error(`❌ Variação ${i + 1} falhou:`, err.message?.substring(0, 120));
      }
    }

    // Fallback Imagen 4 com prompts específicos por variação faltante
    if (results.length < requestCount) {
      console.log(`⚠️ Reforço Imagen 4 (${results.length}/${requestCount} gerados)…`);
      const fallbackCompositions = [
        'diagonal flow arrangement, 2 to 3 large motifs along a diagonal axis',
        'scattered organic drop arrangement, 4 to 6 elements of varied sizes and angles',
        'corner-anchored composition, main motif bleeding off one corner with small accents',
      ];
      try {
        const remaining = requestCount - results.length;
        const fallbackOffset = Math.floor(Math.random() * fallbackCompositions.length);
        for (let j = 0; j < remaining; j++) {
          const compIdx = results.length + j + fallbackOffset;
          const seed = Math.floor(Math.random() * 1000000);
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A single seamless repeating tile for a premium brand surface pattern. Style DNA: ${estiloNome} — ${hint}. SEAMLESS TILING: Must tile perfectly seamlessly. Elements exiting one edge wrap around and re-enter from the exact opposite edge. Absolutely NO vertical or horizontal seams, NO white borders, NO margins, NO vignettes, and NO grid lines. Background must be 100% solid, flat, and uniform right up to the absolute edges. COMPOSITION: Do not cut or crop main motifs in half inside the tile (except for seamless wrap-around edge bleed at the boundaries). Replicate the drawing technique and elements of style references (70% style influence) but create a completely new, unique and custom arrangement (30% creative composition). Composition layout style: ${fallbackCompositions[compIdx % 3]}. Colors ONLY from palette: ${coresStr}. STRICT COLOR HIERARCHY: Dominant color ${(paleta || [])[0] || ''}, secondary ${(paleta || [])[1] || ''}, accent ${(paleta || [])[2] || ''}, minor ${(paleta || [])[3] || ''}, detail ${(paleta || [])[4] || ''}. Absolutely NO GREEN unless in palette. ALL elements must use palette colors. ABSOLUTELY NO FLOWERS OR BOTANICAL ELEMENTS unless explicitly part of the style. White background. Flat illustration. [Creative Seed: ${seed}]`,
            config: { numberOfImages: 1 },
          });
          for (const img of response.generatedImages) {
            results.push({
              id: results.length,
              base64: img.image.imageBytes,
              mimeType: 'image/png'
            });
          }
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
