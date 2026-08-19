import { GoogleGenAI } from "@google/genai";
import { validatePatternCoverage } from "../../../lib/patternCoverageValidator";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { paleta, paletaNomes, estiloNome, marca, descricao, referenceUrls, count } = await req.json();
    const requestCount = typeof count === 'number' ? count : 2;

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

    // Micro-direção visual por estilo
    const styleHints = {
      'Jardim Encantado':      'whimsical hand-drawn children\'s book aesthetic, playful organic forms, cute and friendly illustration style',
      'Escandinavo Acolhedor': 'cozy and warm nordic aesthetic, cute, playful, minimalist vibe, delicate and soft illustration style',
      'Essência Atemporal':    'timeless and refined organic aesthetic, elegant editorial abstract forms, sophisticated watercolor style',
      'Doce Encantamento':     'dreamy and romantic soft watercolor aesthetic, delicate and feminine styling, sweet and magical feel',
      'Raízes & Cuidado':      'naturalistic botanical aesthetic, organic handcrafted textures, warm earthy and hand-painted style',
      'Estético Editorial':    'clean aesthetic, structured and clinical beauty, modern abstract geometric precision, high-end editorial look',
    };
    const hint = styleHints[estiloNome] || 'elegant and delicate';

    const primaryHex = (paleta || [])[0] || '#000000';
    const secondaryHex = (paleta || [])[1] || '#555555';
    const thirdHex = (paleta || [])[2] || '#888888';
    const fourthHex = (paleta || [])[3] || '#BBBBBB';
    const fifthHex = (paleta || [])[4] || '#EEEEEE';

    const colorRule = `
=========================================
CRITICAL COLOR RESTRICTION (MANDATORY & ABSOLUTE)
=========================================
You are an illustrator using ONLY the 5 specific brand paint colors listed below.
STRICT COLOR PALETTE (EXACT HEX CODES):
- Primary Color (Dominant Motif Color): ${primaryHex}
- Secondary Color: ${secondaryHex}
- Accent 3: ${thirdHex}
- Accent 4: ${fourthHex}
- Accent 5: ${fifthHex}

ABSOLUTE MANDATORY COLOR REPLACEMENT INSTRUCTIONS:
1. THE REFERENCE IMAGE CONTAINS WRONG COLORS. YOU MUST COMPLETELY DISCARD AND STRIP OUT EVERY SINGLE COLOR FROM THE REFERENCE IMAGE.
2. REPLACE ALL MOTIF AND PATTERN COLORS 100% WITH THE 5 ALLOWED HEX CODES ABOVE (${primaryHex}, ${secondaryHex}, ${thirdHex}, ${fourthHex}, ${fifthHex}).
3. Background must be pure solid off-white/light cream (#FAFAFA or #F7F5F0) or the primary color ${primaryHex}.
4. Use solid flat fills of these 5 HEX colors only. No automatic multi-color rainbow gradients.
=========================================
`;
    const seamless = `SEAMLESS TILING RULES (CRITICAL & MANDATORY):
- 70% DRAWING STYLE + 30% CREATIVE LAYOUT: Replicate the line weight, stroke style, and drawing technique from the reference image (70%), but place elements in a COMPLETELY NEW, UNIQUE composition layout (30%).
- ZERO BORDERS / SEAMS / LINES: Absolutely NO vertical, horizontal, or diagonal borders, margins, padding, seam lines, white/grey gaps, or division lines separating the tiles. The background must be 100% flat, solid, and uniform right up to the absolute edges. Full bleed edge-to-edge.
- PAC-MAN EDGE WRAPPING: Elements that exit one edge must wrap around and re-enter from the exact opposite edge (Pac-Man style).
- COMPOSITION INTEGRITY: Do NOT slice, cut, or crop main motifs/objects in half inside the tile, except for seamless wrap-around edge bleed at the absolute boundaries. Keep every motif in the middle fully formed, clear, and complete. Avoid chaotic overlaps.
- ALL-OVER QUADRANT BALANCE: Motifs must be distributed harmoniously across all 4 quadrants (top-left, top-right, bottom-left, bottom-right). ABSOLUTELY NO LARGE EMPTY VOIDS, NO DESERTED QUADRANTS, AND NO CLUMPING ONLY IN CORNERS.
- FLAT TWO-DIMENSIONAL SURFACES ONLY: Generate ONLY a single, flat, continuous two-dimensional seamless tile.
- MANDATORY SIGNATURE TEXTURE: Apply a subtle, high-end organic canvas or fine paper grain texture across the ENTIRE surface.`;

    // 3 VARIAÇÕES VISUALMENTE DIVERSAS E DISTINTAS (LAYOUT & ESCALA) — SEM BURACOS VAZIOS
    const variationPrompts = [
      // Variação 1 — Composição Orgânica Fluida (Densidade Média Balanceada)
      `${brandContext}Look carefully at the reference image. Replicate its drawing technique, line quality, and illustration style as closely as possible.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image. Do NOT invent new subjects.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a BALANCED ORGANIC FLOW layout.
COMPOSITION VARIATION 1: Medium density, elegant spacing between motifs, balanced distribution across all 4 quadrants of the tile. Continuous visual rhythm with zero empty holes.

${seamless}
Style context: ${hint}.`,

      // Variação 2 — Composição Arejada com Escala Refinada (Leve, mas com Motivos Distribuídos)
      `${brandContext}Study the reference image carefully. Replicate its exact illustration style, textures, and drawing technique.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a REFINED SPACIOUS LAYOUT.
COMPOSITION VARIATION 2: Spacious and elegant rhythm with comfortable breathing room between motifs, yet with motifs consistently present and well-distributed across every single quadrant. NOT BLANK, NOT DESERTED. A complete, usable repeat pattern tile.

${seamless}
Style context: ${hint}.`,

      // Variação 3 — Composição Dinâmica com Movimento Diagonal & Forte Contraste de Escala
      `${brandContext}Use the reference image as your main creative direction — match its illustration style and line weight.
      
CRITICAL MOTIF RULE: Draw ONLY the types of elements, shapes, or subjects seen in the reference image.
CRITICAL NEGATIVE PROMPT: ABSOLUTELY DO NOT DRAW FLOWERS, LEAVES, OR BOTANICAL ELEMENTS unless explicitly present in the reference image.

${colorRule}
Keep the background white or light cream.

Create ONE TILE of a seamless repeating pattern with a DYNAMIC DIAGONAL & SCALE-CONTRAST LAYOUT.
COMPOSITION VARIATION 3: Dynamic diagonal flow with varied motif scale across the tile, balanced so every quadrant has visual activity and rhythm.

${seamless}
Style context: ${hint}.`,
    ];

    const results = [];

    const randomRefOffset = Math.floor(Math.random() * (refs.length || 1));
    const pickRef = (i) => {
      if (refs.length === 0) return null;
      return refs[(i + randomRefOffset) % refs.length];
    };

    const creativeTweaks = [
      "Composition emphasis: Soft organic scattered alignment.",
      "Composition emphasis: Modern clean geometric balance.",
      "Composition emphasis: Delicate thin-line contrast.",
      "Composition emphasis: Playful asymmetric scattering.",
      "Composition emphasis: Dynamic diagonal movement.",
      "Composition emphasis: Harmonious all-over repeat cadence."
    ];

    for (let i = 0; i < requestCount; i++) {
      let acceptedImage = null;
      let attempts = 0;
      const maxAttemptsPerVariation = 3; // Tentativas automáticas de qualidade sem onerar o usuário

      while (!acceptedImage && attempts < maxAttemptsPerVariation) {
        attempts++;
        try {
          const contents = [];
          const refUrl = pickRef(i + attempts - 1);
          const seed = Math.floor(Math.random() * 1000000);

          if (refUrl) {
            const refImage = await loadImage(refUrl);
            if (refImage) {
              contents.push(refImage);
              if (refs.length > 1) {
                const refUrl2 = refs[(i + attempts) % refs.length];
                if (refUrl2 !== refUrl) {
                  const refImage2 = await loadImage(refUrl2);
                  if (refImage2) contents.push(refImage2);
                }
              }
            }
          }

          const promptIdx = requestCount === 1 ? Math.floor(Math.random() * 3) : (i % 3);
          const randomTweak = creativeTweaks[Math.floor(Math.random() * creativeTweaks.length)];
          const promptToUse = `${variationPrompts[promptIdx]}\nCreative touch for this variation: ${randomTweak}\n\n[System note: Creative Seed ${seed}. Ensure the composition and arrangement of motifs is 100% unique, complete, and well-distributed across all quadrants.]`;

          console.log(`🎨 Gerando Variação ${i + 1} (Tentativa ${attempts}/${maxAttemptsPerVariation}, Prompt Idx: ${promptIdx})`);
          contents.push({ text: promptToUse });

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: contents,
            config: {
              responseModalities: ['image'],
            }
          });

          const candidate = response.candidates?.[0] || response.response?.candidates?.[0];
          const part = candidate?.content?.parts?.find(p => p.inlineData?.data);

          if (part?.inlineData?.data) {
            const rawBase64 = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';

            // QUALITY GATE: Valida cobertura espacial e ausência de buracos vazios
            const coverageCheck = await validatePatternCoverage(rawBase64);

            if (!coverageCheck.valid) {
              console.warn(`⚠️ [Quality Gate] Variação ${i + 1} rejeitada na tentativa ${attempts}: ${coverageCheck.reason}. Regenerando automaticamente...`);
            } else {
              console.log(`✅ [Quality Gate] Variação ${i + 1} aprovada com ${Math.round((1 - coverageCheck.backgroundRatio) * 100)}% de densidade de motivos.`);
              acceptedImage = {
                id: results.length,
                base64: rawBase64,
                mimeType
              };
            }
          }
        } catch (err) {
          console.error(`❌ Variação ${i + 1} (tentativa ${attempts}) falhou:`, err.message?.substring(0, 120));
        }
      }

      if (acceptedImage) {
        results.push(acceptedImage);
      }
    }

    // Fallback Imagen 4 caso o Gemini não atinja a meta de variações aprovadas
    if (results.length < requestCount) {
      console.log(`⚠️ Reforço Imagen 4 (${results.length}/${requestCount} gerados)…`);
      const fallbackCompositions = [
        'balanced all-over organic flow, motifs evenly distributed across all 4 quadrants',
        'scattered geometric cadence with uniform spacing and zero empty voids',
        'continuous repeating lattice layout with complete edge-to-edge rhythm',
      ];
      try {
        const remaining = requestCount - results.length;
        for (let j = 0; j < remaining; j++) {
          const compIdx = (results.length + j) % fallbackCompositions.length;
          const seed = Math.floor(Math.random() * 1000000);
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A single seamless repeating tile for a premium brand surface pattern. Style DNA: ${estiloNome} — ${hint}. SEAMLESS TILING: Must tile perfectly seamlessly. Elements exiting one edge wrap around and re-enter from the exact opposite edge. Absolutely NO vertical or horizontal seams, NO white borders, NO margins, NO vignettes, and NO grid lines. Background must be 100% solid, flat, and uniform right up to the absolute edges. COMPOSITION: Balanced all-over coverage across all four quadrants. Absolutely no large empty voids. Replicate the drawing technique and elements of style references (70% style influence) with a complete, usable arrangement. Composition layout style: ${fallbackCompositions[compIdx]}. Colors ONLY from palette: ${coresStr}. STRICT COLOR HIERARCHY: Dominant color ${(paleta || [])[0] || ''}, secondary ${(paleta || [])[1] || ''}, accent ${(paleta || [])[2] || ''}, minor ${(paleta || [])[3] || ''}, detail ${(paleta || [])[4] || ''}. White background. Flat illustration. [Creative Seed: ${seed}]`,
            config: { numberOfImages: 1 },
          });

          for (const img of response.generatedImages || []) {
            const rawBase64 = img.image.imageBytes;
            const coverageCheck = await validatePatternCoverage(rawBase64);
            if (coverageCheck.valid || results.length === 0) {
              results.push({
                id: results.length,
                base64: rawBase64,
                mimeType: 'image/png'
              });
            }
          }
        }
      } catch (e) {
        console.error('Imagen 4 fallback falhou:', e.message?.substring(0, 100));
      }
    }

    if (results.length > 0) {
      return Response.json({ success: true, images: results });
    }

    return Response.json({ success: false, error: 'Nenhuma imagem de estampa válida gerada' }, { status: 500 });

  } catch (error) {
    console.error("Erro geral na geração de estampa:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
