export const PALETTE_CONSULTATION_LIMIT = 2;

export function normalizeHexes(colors) {
  if (!Array.isArray(colors) || colors.length !== 5) return null;
  const normalized = colors.map(color => typeof color === 'string' ? color.trim().toUpperCase() : '');
  return normalized.every(color => /^#[0-9A-F]{6}$/.test(color)) ? normalized : null;
}

export function paletteSignature(colors) {
  const normalized = normalizeHexes(colors);
  return normalized ? normalized.sort().join(',') : '';
}

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return [0, 0, 0];
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return [0, 0, 0];
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function colorDistance(hexA, hexB) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export function arePalettesSimilar(colorsA, colorsB, maxDiffPerColor = 30) {
  const normA = normalizeHexes(colorsA);
  const normB = normalizeHexes(colorsB);
  if (!normA || !normB) return false;

  const sortedA = [...normA].sort();
  const sortedB = [...normB].sort();

  if (sortedA.join(',') === sortedB.join(',')) return true;

  let totalDist = 0;
  for (let i = 0; i < 5; i++) {
    totalDist += colorDistance(sortedA[i], sortedB[i]);
  }

  return totalDist < (maxDiffPerColor * 5);
}

export function validateConsultedPalettesDetailed(payload, existingPalettes = []) {
  if (!payload || !Array.isArray(payload.palettes) || payload.palettes.length !== 3) return { palettes: null, reason: 'schema' };

  const existingColorsList = existingPalettes.map(p => p.paleta_hex || p.cores_hex || p.hex).filter(Boolean);
  const existingSignatures = new Set(existingColorsList.map(paletteSignature).filter(Boolean));
  
  const seenSignatures = new Set();
  const seenColorsList = [];

  const palettes = payload.palettes.map((palette, index) => {
    const hex = normalizeHexes(palette?.hex);
    const name = typeof palette?.name === 'string' ? palette.name.trim().slice(0, 60) : '';
    const rationale = typeof palette?.rationale === 'string' ? palette.rationale.trim().slice(0, 280) : '';
    const signature = paletteSignature(hex);

    if (!name || !rationale) return { invalid: true, reason: 'schema' };
    if (!hex) return { invalid: true, reason: 'hex' };

    // Check exact signature match
    if (seenSignatures.has(signature) || existingSignatures.has(signature)) {
      return { invalid: true, reason: 'duplicate' };
    }

    // Check near-identical similarity with existing palettes
    for (const existingHexes of existingColorsList) {
      if (arePalettesSimilar(hex, existingHexes, 30)) {
        return { invalid: true, reason: 'duplicate' };
      }
    }

    // Check near-identical similarity with previously generated palettes in this batch
    for (const seenHexes of seenColorsList) {
      if (arePalettesSimilar(hex, seenHexes, 30)) {
        return { invalid: true, reason: 'duplicate' };
      }
    }

    seenSignatures.add(signature);
    seenColorsList.push(hex);

    return {
      id: `consulted-${index + 1}-${signature.replace(/[^A-F0-9]/g, '').slice(0, 12)}`,
      nome_variacao: name,
      paleta_hex: hex,
      source: 'openai',
      origem: 'OPENAI',
      isAiGenerated: true,
      rationale
    };
  });

  const invalid = palettes.find(palette => palette?.invalid);
  return invalid ? { palettes: null, reason: invalid.reason } : { palettes, reason: null };
}

export function validateConsultedPalettes(payload, existingPalettes = []) {
  return validateConsultedPalettesDetailed(payload, existingPalettes).palettes;
}
