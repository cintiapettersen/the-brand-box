import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { paleta, estiloNome, marca, descricao, referenceUrls, count } = await req.json();
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

    const colorRule = `
=========================================
CRITICAL COLOR OVERRIDE (MANDATORY)
=========================================
You MUST completely IGNORE the colors of the reference image. The reference image is ONLY for shapes, layout, and drawing style. 
You MUST strictly color ALL elements using ONLY the following exact hex colors:
[ ${coresStr} ]

Do NOT use any colors from the reference image (like greens, browns, etc.) unless they are in the hex list above. 
CRITICAL: Even natural elements like leaves and stems MUST be colored using ONLY the provided palette colors. Absolutely NO GREEN is allowed unless it is explicitly in the palette list above.
Keep the background pure white or very light cream.
=========================================
`;
    const seamless = `SEAMLESS TILING RULES (CRITICAL & MANDATORY):
- 70% STYLE DNA + 30% CREATIVE COMPOSITION: The reference image represents 70% of the style influence (use its exact drawing technique, textures, line quality, and element DNA). The remaining 30% MUST be creative freedom — distribute and arrange the elements in a completely NEW, UNIQUE, and highly distinct composition layout. Do NOT replicate the layout or placement coordinates of the reference image. Do NOT copy the exact same pattern layout.
- ZERO BORDERS / SEAMS / LINES: Absolutely NO vertical, horizontal, or diagonal borders, margins, padding, seam lines, white/grey gaps, or division lines separating the tiles. The background must be 100% flat, solid, and uniform right up to the absolute edges. Full bleed edge-to-edge. Do not create any vignette, gradient shadows, or framing around the edges of the image.
- PAC-MAN EDGE WRAPPING: Elements that exit one edge must wrap around and re-enter from the exact opposite edge (Pac-Man style).
- COMPOSITION INTEGRITY: Do NOT slice, cut, or crop main motifs/objects in half inside the tile, except for seamless wrap-around edge bleed at the absolute boundaries. Keep every motif in the middle fully formed, clear, and complete. Avoid chaotic overlaps or collision between different motifs.
- FLAT TWO-DIMENSIONAL SURFACES ONLY: Ignore any mockups, wallpaper rolls, strips, columns, or panel divisions in the reference image. Generate ONLY a single, flat, continuous two-dimensional seamless tile.
- NO FRAMES OR BORDERS: The generated image must be a full-bleed flat graphic going exactly to the absolute 4 corners. Absolutely no thin white margins, no grey border lines, no vignettes, and no visual framing of any kind.
- MANDATORY SIGNATURE TEXTURE: You MUST apply a beautiful, highly visible premium watercolor paper or fine organic canvas texture across the ENTIRE image. This texture should be noticeable and rich, giving the illustration a luxurious, tactile, handcrafted feel that prevents the image from looking flat or digital, especially when scaled up.`;

    // 3 VARIAÇÕES ALTAMENTE DISTINTAS — composição completamente redesenhada
    const variationPrompts = [
      // Variação 1 — Composição balanceada, espaçamento elegante e original
      `${brandContext}Look carefully at the reference image. This is your PRIMARY creative style brief — replicate its drawing technique, line quality, element types (flowers, leaves, shapes), illustration style, and level of detail as closely as possible (70% style DNA).
${colorRule}
Keep the background white or very light.

Create ONE TILE of a seamless repeating surface pattern using those same elements and drawing style, but in a COMPLETELY NEW, ORIGINAL, AND BALANCED composition (30% creative arrangement). Do NOT copy the reference layout.

${seamless}
Composition Style: Balanced and elegant, generous spacing between motifs. Density: moderate. Style context: ${hint}.`,

      // Variação 2 — Composição Minimalista e Extremamente Espaçada (Layout "Airy")
      `${brandContext}Study the reference image carefully. Replicate its exact illustration style, textures, and drawing technique faithfully (70% style DNA).
${colorRule}
Keep the background white or very light.

Create ONE TILE of a seamless repeating surface pattern. Compared to the reference and typical layouts, make this version a MINIMALIST, HIGHLY AIRY composition (30% creative arrangement). Use FEWER elements per tile, with large open spaces of solid color between them. The motifs should be slightly larger and arranged with plenty of breathing room.

${seamless}
Composition Style: High negative space, minimalist, scattered and airy. Highly distinct from previous compositions. Style context: ${hint}.`,

      // Variação 3 — Composição Dinâmica com Movimento Diagonal (Layout "Flow")
      `${brandContext}Use the reference image as your main creative direction — match its illustration style, element types, drawing technique, and proportions faithfully (70% style DNA).
${colorRule}
Keep the background white or very light.

Create ONE TILE of a seamless repeating surface pattern. Arrange the elements to create a DYNAMIC FLOWING MOVEMENT (like a soft diagonal breeze or organic waving paths) (30% creative arrangement). Rotate, tilt, and vary the orientations of the elements dynamically so they are NOT all standing upright.

${seamless}
Composition Style: Dynamic diagonal flow, varied rotations, fluid and active. Extremely different from standard upright layouts. Style context: ${hint}.`,
    ];

    const results = [];

    // Cada variação recebe referências DIFERENTES (cicla pelo array disponível)
    const pickRef = (i) => {
      if (refs.length === 0) return null;
      return refs[i % refs.length];
    };

    for (let i = 0; i < requestCount; i++) {
      try {
        const contents = [];

        const refUrl = pickRef(i);
        if (refUrl) {
          const refImage = await loadImage(refUrl);
          if (refImage) {
            // Referência PRIMEIRO no array — o modelo dá mais peso ao que vem antes
            contents.push(refImage);
            // Segunda referência para contexto adicional (se disponível e diferente)
            if (refs.length > 1) {
              const refUrl2 = refs[(i + 1) % refs.length];
              if (refUrl2 !== refUrl) {
                const refImage2 = await loadImage(refUrl2);
                if (refImage2) contents.push(refImage2);
              }
            }
          }
        }

        // Se for geração individual (substituindo estampa), escolhe um dos 3 estilos de composição aleatoriamente
        const promptIdx = requestCount === 1 ? Math.floor(Math.random() * 3) : i;

        // Adiciona um leve toque criativo aleatório para evitar repetições do modelo
        const creativeTweaks = [
          "Focus on delicate organic flows.",
          "Emphasize a clean modern watercolor look.",
          "Bring out a whimsical, poetic feel.",
          "Use delicate thin-line detailing.",
          "Arrange with a touch of elegant asymmetry.",
          "Create a soft, dreamy overlay of elements."
        ];
        const randomTweak = creativeTweaks[Math.floor(Math.random() * creativeTweaks.length)];
        const finalPrompt = `${variationPrompts[promptIdx]}\nCreative touch for this variation: ${randomTweak}`;

        console.log(`🎨 Geração ${i + 1} (Prompt Index: ${promptIdx}, Tweak: "${randomTweak}") usando ref: ${refUrl ? refUrl.substring(0, 70) + '…' : 'nenhuma'}`);
        contents.push({ text: finalPrompt });

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
        for (let j = 0; j < remaining; j++) {
          const compIdx = results.length + j;
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A single seamless repeating tile for a premium brand surface pattern. Style DNA: ${estiloNome} — ${hint}. SEAMLESS TILING: Must tile perfectly seamlessly. Elements exiting one edge wrap around and re-enter from the exact opposite edge. Absolutely NO vertical or horizontal seams, NO white borders, NO margins, NO vignettes, and NO grid lines. Background must be 100% solid, flat, and uniform right up to the absolute edges. COMPOSITION: Do not cut or crop main motifs in half inside the tile (except for seamless wrap-around edge bleed at the boundaries). Replicate the drawing technique and elements of style references (70% style influence) but create a completely new, unique and custom arrangement (30% creative composition). Composition layout style: ${fallbackCompositions[compIdx % 3]}. Colors ONLY: ${coresStr}. Absolutely NO GREEN unless in palette. Leaves/stems must use palette colors. White background. Flat illustration.`,
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
