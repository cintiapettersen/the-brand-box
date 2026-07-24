import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { BRAND_ELEMENT_COUNT, BRAND_ELEMENT_GENERATION_LIMIT, BRAND_ELEMENTS_COPY, invalidateBrandElementsForNewPattern, isBrandElementContextCompatible, selectedBrandElement, validateMotifAnalysis } from '../src/lib/brandElements.js';
import { inspectTransparentPng, validateGeneratedElementPngs } from '../src/app/api/creative-director/brand-elements/serverUtils.js';
import { cachedBrandElementRequest, hasCompletedGeneration, markCompletedGeneration, pilotEnabled } from '../src/app/api/creative-director/brand-elements/guards.js';

const motifs = [
  { name: 'Folha curva', category: 'botanical', visualEvidence: 'Uma folha curva aparece repetidamente na estampa.', simplificationRule: 'Uma silhueta com nervura única.', smallSizeScore: 5 },
  { name: 'Arco orgânico', category: 'organic', visualEvidence: 'Arcos orgânicos contornam as folhas.', simplificationRule: 'Um arco espesso sem textura.', smallSizeScore: 4 },
  { name: 'Estrela suave', category: 'celestial', visualEvidence: 'Pequenas estrelas de cinco pontas aparecem no fundo.', simplificationRule: 'Uma estrela arredondada sólida.', smallSizeScore: 5 }
];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0); name.copy(out, 4); data.copy(out, 8); out.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8); return out;
}
function transparentPng1024() {
  const width = 1024, height = 1024, raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) { const row = y * (width * 4 + 1); raw[row] = 0; for (let x = 0; x < width; x++) { const pixel = row + 1 + x * 4; raw[pixel + 3] = x > 300 && x < 724 && y > 300 && y < 724 ? 255 : 0; } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]).toString('base64');
}

test('server kill switch is opt-in and uses no client credential', () => {
  const previous = process.env.BRAND_ELEMENTS_PILOT_ENABLED;
  delete process.env.BRAND_ELEMENTS_PILOT_ENABLED; assert.equal(pilotEnabled(), false);
  process.env.BRAND_ELEMENTS_PILOT_ENABLED = 'true'; assert.equal(pilotEnabled(), true);
  process.env.BRAND_ELEMENTS_PILOT_ENABLED = 'false'; assert.equal(pilotEnabled(), false);
  if (previous === undefined) delete process.env.BRAND_ELEMENTS_PILOT_ENABLED; else process.env.BRAND_ELEMENTS_PILOT_ENABLED = previous;
});

test('pilot copy is available in PT and EN', () => {
  assert.equal(BRAND_ELEMENTS_COPY.pt.cta, 'Criar elementos gráficos desta estampa');
  assert.equal(BRAND_ELEMENTS_COPY.en.cta, 'Create graphic elements from this pattern');
});

test('analysis accepts exactly three valid, small-size motifs', () => {
  const validated = validateMotifAnalysis({ motifs });
  assert.equal(BRAND_ELEMENT_COUNT, 3); assert.equal(validated.length, 3);
  assert.equal(validateMotifAnalysis({ motifs: motifs.slice(0, 2) }), null);
  assert.equal(validateMotifAnalysis({ motifs: motifs.map((m, i) => i ? m : { ...m, smallSizeScore: 3 }) }), null);
});

test('PNG validation requires a real transparent 1024x1024 PNG', () => {
  const png = transparentPng1024();
  assert.deepEqual(inspectTransparentPng(png)?.width, 1024);
  const generated = [1, 2, 3].map(id => ({ id, mimeType: 'image/png', base64: png }));
  assert.equal(validateGeneratedElementPngs(generated), true);
  assert.equal(validateGeneratedElementPngs(generated.slice(0, 2)), false);
  assert.equal(inspectTransparentPng(Buffer.from('not png').toString('base64')), null);
});

test('simultaneous requests are deduplicated and successful generation is limited once per journey', async () => {
  let calls = 0; const key = `test-${Date.now()}`;
  const [first, second] = await Promise.all([cachedBrandElementRequest(key, async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return { elements: [1,2,3] }; }), cachedBrandElementRequest(key, async () => { calls++; return {}; })]);
  assert.equal(calls, 1); assert.deepEqual(first.value, second.value);
  const journey = `journey-${Date.now()}`; assert.equal(BRAND_ELEMENT_GENERATION_LIMIT, 1); assert.equal(hasCompletedGeneration(journey), false); markCompletedGeneration(journey); assert.equal(hasCompletedGeneration(journey), true);
});

test('refresh restores a compatible selected element and a different pattern invalidates it', () => {
  const context = { journeyId: 'j1', styleId: '2', patternHash: 'hash-a', paletteId: 'p1', paletteHex: ['#111111','#222222','#333333','#444444','#555555'] };
  const state = { status: 'ready', generationUsed: true, sourcePatternIndex: 0, context, selectedId: 'e1', analysis: motifs, elements: [{ id: 'e1', mimeType: 'image/png', base64: 'abc' }] };
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(isBrandElementContextCompatible(restored.context, context), true);
  assert.equal(selectedBrandElement(restored, context)?.id, 'e1');
  assert.equal(selectedBrandElement(restored, { ...context, patternHash: 'hash-b' }), null);
  const invalidated = invalidateBrandElementsForNewPattern(restored, 'pt-BR');
  assert.equal(invalidated.generationUsed, true); assert.equal(invalidated.selectedId, null); assert.deepEqual(invalidated.elements, []);
});

test('static icon fallback remains available when no compatible element is selected', () => {
  assert.equal(selectedBrandElement({ selectedId: null, elements: [] }, null), null);
});
