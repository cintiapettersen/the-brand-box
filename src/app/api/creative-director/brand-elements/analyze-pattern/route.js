import { GoogleGenAI } from '@google/genai';
import { BRAND_ELEMENT_CATEGORIES, normalizePalette, validateMotifAnalysis } from '../../../../../lib/brandElements.js';
import { cachedBrandElementRequest, pilotEnabled } from '../guards.js';
import { patternHash, safeLog } from '../serverUtils.js';

const MODEL = 'gemini-2.5-flash';
const ANALYSIS_SCHEMA = { type: 'object', additionalProperties: false, required: ['motifs'], properties: { motifs: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', additionalProperties: false, required: ['name','category','visualEvidence','simplificationRule','smallSizeScore'], properties: { name: { type: 'string' }, category: { type: 'string', enum: BRAND_ELEMENT_CATEGORIES }, visualEvidence: { type: 'string' }, simplificationRule: { type: 'string' }, smallSizeScore: { type: 'integer', minimum: 4, maximum: 5 } } } } } };
const clean = value => typeof value === 'string' ? value.trim() : '';

export async function POST(request) {
  try {
    if (!pilotEnabled()) { safeLog('kill_switch', { model: MODEL, status: 503, errorId: 'pilot_disabled' }); return Response.json({ error: 'brand_elements_pilot_disabled' }, { status: 503 }); }
    const body = await request.json();
    const journeyId = clean(body.journeyId), styleName = clean(body.styleName), language = clean(body.language || 'pt-BR');
    const styleId = body.styleId, paletteId = clean(String(body.paletteId || '')), paletteHex = normalizePalette(body.paletteHex);
    const pattern = body.approvedPattern || {}, base64 = clean(pattern.base64), mimeType = clean(pattern.mimeType);
    if (!journeyId || !styleId || !styleName || !paletteId || paletteHex.length !== 5 || !base64 || !/^image\/(png|jpeg)$/.test(mimeType) || base64.length > 15_000_000) return Response.json({ error: 'invalid_brand_element_analysis_payload' }, { status: 400 });
    const apiKey = clean(process.env.GEMINI_API_KEY).replace(/['"]/g, '');
    if (!apiKey) { safeLog('configuration', { model: MODEL, status: 503, errorId: 'gemini_key_missing' }); return Response.json({ error: 'brand_elements_unavailable' }, { status: 503 }); }
    const accentColor = /^#[0-9A-F]{6}$/.test(clean(body.accentColor).toUpperCase()) ? clean(body.accentColor).toUpperCase() : paletteHex[2];
    const briefing = body.briefing || {};
    const brandGuardrails = { segment: clean(briefing.atuacao), audience: clean(briefing.publico), personality: clean(briefing.personalidade), feelings: Array.isArray(briefing.sentimentos) ? briefing.sentimentos.map(clean).filter(Boolean).slice(0, 6) : [] };
    const hash = patternHash(base64), key = `brand-elements:analysis:${journeyId}:${hash}:${styleId}:${paletteId}`;
    const generated = await cachedBrandElementRequest(key, async () => {
      safeLog('analysis_started', { model: MODEL });
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ model: MODEL, contents: [{ inlineData: { mimeType, data: base64 } }, { text: `Analyze only this approved brand pattern. Identify exactly three distinct, clearly visible motifs that can become simple one-color brand graphic elements. The image is the primary evidence; style (${styleName}), palette (${paletteHex.join(', ')}) and briefing context are guardrails only. Reject text, scenes, textures, complete compositions, cropped fragments, generic symbols not visibly present, or motifs with more than one principal form. Each motif must remain recognizable at 16px. Brand guardrails: ${JSON.stringify(brandGuardrails)}. Respond in ${language}.` }], config: { responseMimeType: 'application/json', responseSchema: ANALYSIS_SCHEMA } });
      let payload; try { payload = JSON.parse(response.text || ''); } catch { throw Object.assign(new Error('invalid_analysis_json'), { phase: 'analysis_json', errorId: 'invalid_json' }); }
      const motifs = validateMotifAnalysis(payload);
      if (!motifs) throw Object.assign(new Error('invalid_analysis_schema'), { phase: 'analysis_schema', errorId: 'invalid_schema' });
      safeLog('analysis_ready', { model: MODEL, count: motifs.length, status: 200 });
      return { motifs, context: { journeyId, styleId: String(styleId), styleName, paletteId, paletteHex, patternHash: hash, accentColor, language }, model: MODEL };
    });
    return Response.json(generated.value, { headers: { 'X-Brand-Elements-Cache': generated.cache } });
  } catch (error) {
    safeLog(error.phase || 'analysis_failed', { model: MODEL, status: error.status, errorId: error.errorId || error.name });
    return Response.json({ error: error.phase === 'analysis_schema' ? 'invalid_brand_element_analysis' : 'brand_element_analysis_failed' }, { status: 502 });
  }
}
