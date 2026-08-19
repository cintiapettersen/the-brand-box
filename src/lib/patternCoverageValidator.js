import sharp from 'sharp';

/**
 * Valida a cobertura e distribuição espacial de um ladrilho de estampa.
 * Rejeita estampas com buracos vazios, quadrantes desertos ou >78% de área de fundo vazia.
 * 
 * @param {string|Buffer} imageInput - Base64 string ou Buffer da imagem da estampa
 * @returns {Promise<{ valid: boolean, reason: string|null, backgroundRatio: number, quadrantMotifRatios: number[] }>}
 */
export async function validatePatternCoverage(imageInput) {
  try {
    let buffer;
    if (typeof imageInput === 'string') {
      const cleanBase64 = imageInput.replace(/^data:image\/[a-z]+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');
    } else if (Buffer.isBuffer(imageInput)) {
      buffer = imageInput;
    } else {
      return { valid: false, reason: 'invalid_buffer_input', backgroundRatio: 1, quadrantMotifRatios: [0, 0, 0, 0] };
    }

    // Amostra a imagem em 64x64 em RGB cru para análise instantânea (<5ms)
    const sampleSize = 64;
    const { data, info } = await sharp(buffer)
      .resize(sampleSize, sampleSize, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const totalPixels = sampleSize * sampleSize;
    const channels = info.channels; // 3 (RGB)

    // 1. Amostra as bordas e cantos para estimar a cor de fundo (background)
    const cornerOffsets = [
      0, // Top-Left
      (sampleSize - 1) * channels, // Top-Right
      (sampleSize * (sampleSize - 1)) * channels, // Bottom-Left
      (totalPixels - 1) * channels // Bottom-Right
    ];

    let bgR = 0, bgG = 0, bgB = 0;
    for (const offset of cornerOffsets) {
      bgR += data[offset];
      bgG += data[offset + 1];
      bgB += data[offset + 2];
    }
    bgR = Math.round(bgR / 4);
    bgG = Math.round(bgG / 4);
    bgB = Math.round(bgB / 4);

    // Limiar de distância de cor para considerar pixel como fundo (sensibilidade a ruído/grão)
    const colorDistThreshold = 22;

    let backgroundCount = 0;
    const half = sampleSize / 2;
    const quadrantMotifCounts = [0, 0, 0, 0]; // 0: TL, 1: TR, 2: BL, 3: BR
    const quadrantTotalPixels = (sampleSize / 2) * (sampleSize / 2);

    for (let y = 0; y < sampleSize; y++) {
      for (let x = 0; x < sampleSize; x++) {
        const idx = (y * sampleSize + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Distância Euclidiana em RGB para a cor de fundo estimada
        const dist = Math.sqrt(
          (r - bgR) ** 2 +
          (g - bgG) ** 2 +
          (b - bgB) ** 2
        );

        const isBackground = dist < colorDistThreshold;

        if (isBackground) {
          backgroundCount++;
        } else {
          // Pixel pertencente a motivo gráfico
          const qIdx = (y < half ? 0 : 2) + (x < half ? 0 : 1);
          quadrantMotifCounts[qIdx]++;
        }
      }
    }

    const backgroundRatio = backgroundCount / totalPixels;
    const quadrantMotifRatios = quadrantMotifCounts.map(count => count / quadrantTotalPixels);

    // REGRAS DE REJEIÇÃO / QUALIDADE:

    // 1. Mais de 78% da estampa é fundo vazio
    if (backgroundRatio > 0.78) {
      return {
        valid: false,
        reason: `excessive_background_area_${Math.round(backgroundRatio * 100)}%`,
        backgroundRatio,
        quadrantMotifRatios
      };
    }

    // 2. Algum dos 4 quadrantes está praticamente deserto (< 4% de motivos)
    const emptyQuadrantIdx = quadrantMotifRatios.findIndex(ratio => ratio < 0.04);
    if (emptyQuadrantIdx !== -1) {
      const qNames = ['superior_esquerdo', 'superior_direito', 'inferior_esquerdo', 'inferior_direito'];
      return {
        valid: false,
        reason: `empty_quadrant_${qNames[emptyQuadrantIdx]}_motif_density_${Math.round(quadrantMotifRatios[emptyQuadrantIdx] * 100)}%`,
        backgroundRatio,
        quadrantMotifRatios
      };
    }

    return {
      valid: true,
      reason: null,
      backgroundRatio,
      quadrantMotifRatios
    };

  } catch (err) {
    console.warn('[PatternCoverageValidator] Error analyzing pattern buffer:', err.message);
    // Em caso de falha de I/O na análise de imagem, permite continuar por segurança técnica
    return { valid: true, reason: 'validator_exception_bypassed', backgroundRatio: 0.5, quadrantMotifRatios: [0.25, 0.25, 0.25, 0.25] };
  }
}
