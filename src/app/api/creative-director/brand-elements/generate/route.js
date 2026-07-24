import { GoogleGenAI } from '@google/genai';
import { normalizePalette, validateMotifAnalysis } from '../../../../../lib/brandElements.js';
import { cachedBrandElementRequest, hasCompletedGeneration, markCompletedGeneration, pilotEnabled } from '../guards.js';
import { inspectTransparentPng, patternHash, safeLog, validateGeneratedElementPngs } from '../serverUtils.js';

const MODEL = 'gemini-2.5-flash-image';
const clean = value => typeof value === 'string' ? value.trim() : '';
const outputImage = response => response.candidates?.[0]?.content?.parts?.find(part => part.inlineData)?.inlineData || null;

export async function POST(request) {
  try {
    if (!pilotEnabled()) { safeLog('kill_switch', { model: MODEL, status: 503, errorId: 'pilot_disabled' }); return Response.json({ error: 'brand_elements_pilot_disabled' }, { status: 503 }); }
    const body = await request.json(), context = body.context || {}, pattern = body.approvedPattern || {};
    const journeyId = clean(context.journeyId), paletteHex = normalizePalette(context.paletteHex), motifs = validateMotifAnalysis({ motifs: body.motifs });
    const base64 = clean(pattern.base64), mimeType = clean(pattern.mimeType), hash = base64 ? patternHash(base64) : '';
    if (!journeyId || !context.styleId || !clean(String(context.paletteId || '')) || !clean(context.patternHash) || !motifs || paletteHex.length !== 5 || !base64 || !/^image\/(png|jpeg)$/.test(mimeType) || hash !== context.patternHash || base64.length > 15_000_000) return Response.json({ error: 'invalid_brand_element_generation_payload' }, { status: 400 });
    const key = `brand-elements:generation:${journeyId}:${hash}:${context.styleId}:${context.paletteId}`;
    const generated = await cachedBrandElementRequest(key, async () => {
      if (hasCompletedGeneration(journeyId)) throw Object.assign(new Error('generation_limit'), { phase: 'limit', publicCode: 'brand_element_generation_limit' });
      const apiKey = clean(process.env.GEMINI_API_KEY).replace(/['"]/g, '');
      if (!apiKey) throw Object.assign(new Error('missing_config'), { phase: 'configuration', publicCode: 'brand_elements_unavailable' });
      safeLog('generation_started', { model: MODEL, count: 3 });
      const ai = new GoogleGenAI({ apiKey });
      const elements = [];
      for (const motif of motifs) {
        const prompt = `Using the approved pattern image as the primary visual source, create ONE simplified brand graphic element derived specifically from the visible motif “${motif.name}” (${motif.visualEvidence}). Simplification: ${motif.simplificationRule}. Output exactly one centered principal shape, monochrome solid black, transparent background, 1024x1024 PNG, generous 20% safe margin, recognizable at 16px. No crop, text, lettering, mockup, frame, scene, shadow, texture, repetition, pattern tile, extra objects, or generic unrelated icon. Preserve the drawing DNA of the approved pattern while simplifying it cleanly.`;
        const response = await ai.models.generateContent({ model: MODEL, contents: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }], config: { responseModalities: ['image'] } });
        const image = outputImage(response), png = image?.mimeType === 'image/png' ? inspectTransparentPng(image.data) : null;
        if (!image || !png) throw Object.assign(new Error('invalid_transparent_png'), { phase: 'png_validation', errorId: 'invalid_transparent_png' });
        elements.push({ id: `brand-element-${elements.length + 1}-${hash.slice(0, 8)}`, motifId: motif.id, name: motif.name, category: motif.category, origin: motif.visualEvidence, mimeType: 'image/png', base64: image.data, width: png.width, height: png.height, transparent: true });
      }
      if (!validateGeneratedElementPngs(elements)) throw Object.assign(new Error('invalid_count'), { phase: 'generation_validation', errorId: 'invalid_count' });
      markCompletedGeneration(journeyId);
      safeLog('generation_ready', { model: MODEL, count: elements.length, status: 200 });
      return { elements, context: { ...context, paletteHex }, model: MODEL, completedAt: new Date().toISOString() };
    });
    return Response.json(generated.value, { headers: { 'X-Brand-Elements-Cache': generated.cache } });
  } catch (error) {
    safeLog(error.phase || 'generation_failed', { model: MODEL, status: error.status, errorId: error.errorId || error.name });
    const status = error.phase === 'limit' ? 429 : error.phase === 'configuration' ? 503 : 502;
    return Response.json({ error: error.publicCode || 'brand_element_generation_failed' }, { status });
  }
}
