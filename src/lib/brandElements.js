export const BRAND_ELEMENT_COUNT = 3;
export const BRAND_ELEMENT_GENERATION_LIMIT = 1;
export const BRAND_ELEMENT_CATEGORIES = ['botanical', 'floral', 'organic', 'geometric', 'celestial', 'fruit', 'line', 'abstract'];
export const BRAND_ELEMENTS_COPY = {
  en: { title: 'Brand Graphic Elements', description: 'We’ll transform shapes found in your pattern into simple options for your brand’s visual signature.', cta: 'Create graphic elements from this pattern', analyzing: 'Finding recognizable motifs in your approved pattern…', generating: 'Creating three simple transparent elements…', keepIcon: 'Keep current icon for now' },
  pt: { title: 'Elementos Gráficos da Marca', description: 'Vamos transformar formas presentes na sua estampa em opções simples para a assinatura visual da sua marca.', cta: 'Criar elementos gráficos desta estampa', analyzing: 'Identificando motivos reconhecíveis na estampa aprovada…', generating: 'Criando três elementos simples e transparentes…', keepIcon: 'Manter ícone atual por enquanto' }
};

const text = value => typeof value === 'string' ? value.trim() : '';
export const normalizePalette = colors => Array.isArray(colors) && colors.length === 5
  ? colors.map(color => text(color).toUpperCase()).filter(color => /^#[0-9A-F]{6}$/.test(color))
  : [];

export function validateMotifAnalysis(payload) {
  if (!payload || !Array.isArray(payload.motifs) || payload.motifs.length !== BRAND_ELEMENT_COUNT) return null;
  const motifs = payload.motifs.map((motif, index) => {
    const name = text(motif?.name).slice(0, 60);
    const category = text(motif?.category).toLowerCase();
    const visualEvidence = text(motif?.visualEvidence).slice(0, 240);
    const simplificationRule = text(motif?.simplificationRule).slice(0, 240);
    const smallSizeScore = Number(motif?.smallSizeScore);
    if (!name || !BRAND_ELEMENT_CATEGORIES.includes(category) || !visualEvidence || !simplificationRule || !Number.isInteger(smallSizeScore) || smallSizeScore < 4 || smallSizeScore > 5) return null;
    return { id: `motif-${index + 1}`, name, category, visualEvidence, simplificationRule, smallSizeScore };
  });
  return motifs.every(Boolean) && new Set(motifs.map(motif => motif.name.toLowerCase())).size === BRAND_ELEMENT_COUNT ? motifs : null;
}

export function isBrandElementContextCompatible(context, current) {
  if (!context || !current) return false;
  return context.journeyId === current.journeyId
    && String(context.styleId) === String(current.styleId)
    && context.patternHash === current.patternHash
    && context.paletteId === current.paletteId
    && Array.isArray(context.paletteHex) && context.paletteHex.join(',') === (current.paletteHex || []).join(',');
}

export function selectedBrandElement(state, currentContext) {
  if (!state?.selectedId || !isBrandElementContextCompatible(state.context, currentContext)) return null;
  return state.elements?.find(element => element.id === state.selectedId && element.mimeType === 'image/png' && element.base64) || null;
}

export function invalidateBrandElementsForNewPattern(state, language = 'pt-BR') {
  if (!state?.generationUsed) return state;
  return { ...state, status: 'stale', analysis: null, elements: [], selectedId: null, context: null, error: language === 'en' ? 'These elements belonged to the previous pattern. The pre-purchase generation has already been used.' : 'Estes elementos pertenciam à estampa anterior. A geração pré-compra já foi utilizada.' };
}
