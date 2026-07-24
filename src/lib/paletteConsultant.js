export const PALETTE_CONSULTATION_LIMIT = 2;

export function normalizeHexes(colors) {
  if (!Array.isArray(colors) || colors.length !== 5) return null;
  const normalized = colors.map(color => typeof color === 'string' ? color.trim().toUpperCase() : '');
  return normalized.every(color => /^#[0-9A-F]{6}$/.test(color)) ? normalized : null;
}

export function paletteSignature(colors) {
  const normalized = normalizeHexes(colors);
  return normalized ? normalized.join(',') : '';
}

export function validateConsultedPalettes(payload, existingPalettes = []) {
  if (!payload || !Array.isArray(payload.palettes) || payload.palettes.length !== 3) return null;
  const existing = new Set(existingPalettes.map(palette => paletteSignature(palette.paleta_hex || palette.cores_hex || palette.hex)).filter(Boolean));
  const seen = new Set();
  const palettes = payload.palettes.map((palette, index) => {
    const hex = normalizeHexes(palette?.hex);
    const name = typeof palette?.name === 'string' ? palette.name.trim().slice(0, 60) : '';
    const rationale = typeof palette?.rationale === 'string' ? palette.rationale.trim().slice(0, 280) : '';
    const signature = paletteSignature(hex);
    if (!hex || !name || !rationale || seen.has(signature) || existing.has(signature)) return null;
    seen.add(signature);
    return { id: `consulted-${index + 1}-${signature.replace(/[^A-F0-9]/g, '').slice(0, 12)}`, nome_variacao: name, paleta_hex: hex, source: 'openai', origem: 'OPENAI', isAiGenerated: true, rationale };
  });
  return palettes.every(Boolean) ? palettes : null;
}
