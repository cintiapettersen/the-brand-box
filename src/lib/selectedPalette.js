export function normalizePaletteHexes(value) {
  const colors = Array.isArray(value) ? value : [];
  const normalized = colors.map(color => typeof color === 'string' ? color.trim().toUpperCase() : '').filter(Boolean);
  return normalized.length && normalized.every(color => /^#[0-9A-F]{6}$/.test(color)) ? normalized : [];
}

export function serializeSelectedPalette(palette, { styleId, styleName, journeyId } = {}) {
  if (!palette || palette.id === undefined || palette.id === null) return null;
  const hex = normalizePaletteHexes(palette.paleta_hex || palette.cores_hex);
  if (!hex.length) return null;
  if (styleId !== undefined && styleId !== null && String(palette.estilo_id) !== String(styleId)) return null;
  return { id: String(palette.id), styleId: String(styleId ?? palette.estilo_id), styleName: styleName || null, journeyId: journeyId || null, name: typeof palette.nome_variacao === 'string' ? palette.nome_variacao.trim() || null : null, hex };
}

export function findSelectedPalette(palettes, selectedId, context = {}) {
  return serializeSelectedPalette((Array.isArray(palettes) ? palettes : []).find(palette => String(palette.id) === String(selectedId)), context);
}

export function paletteSignature(palette) {
  const hex = normalizePaletteHexes(palette?.paleta_hex || palette?.cores_hex || palette?.hex);
  return hex.length === 5 ? hex.join(',') : '';
}
