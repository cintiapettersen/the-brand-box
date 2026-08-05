export function shouldClearPaletteFeedback(previousPaletteId, nextPaletteId) {
  return String(previousPaletteId) !== String(nextPaletteId);
}

export function isCurrentPaletteFeedback(feedback, palette, primaryColor, journeyId, language) {
  const context = feedback?.context;
  if (!context || !palette || !primaryColor) return false;
  return context.journeyId === (journeyId || null)
    && String(context.styleId) === String(palette.styleId)
    && String(context.paletteId) === String(palette.id)
    && Array.isArray(context.hex) && context.hex.join(',') === (palette.hex || []).join(',')
    && context.primaryColor === primaryColor
    && context.language === language;
}
