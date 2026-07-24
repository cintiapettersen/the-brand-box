import test from 'node:test';
import assert from 'node:assert/strict';
import { validateConsultedPalettes, validateConsultedPalettesDetailed, PALETTE_CONSULTATION_LIMIT } from '../src/lib/paletteConsultant.js';

const response = { palettes: [
  { name: 'Soft Tide', hex: ['#123456','#234567','#345678','#456789','#56789A'], rationale: 'Coherent direction, softer color.' },
  { name: 'Warm Tide', hex: ['#654321','#765432','#876543','#987654','#A98765'], rationale: 'Coherent direction, warmer color.' },
  { name: 'Deep Tide', hex: ['#112233','#223344','#334455','#445566','#556677'], rationale: 'Coherent direction, deeper color.' }
] };

const originalKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_MODEL;
process.env.OPENAI_API_KEY = 'test-key';
process.env.OPENAI_MODEL = 'test-model';
const { POST } = await import('../src/app/api/creative-director/palette-consultation/route.js');

function request(journeyId) {
  return new Request('http://localhost/api/creative-director/palette-consultation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ journeyId, consultationIndex: 1, language: 'pt', feedback: { rejectionReasons: ['Estavam claras demais'], preferences: ['Algo mais delicado'], comment: '' }, existingPalettes: [] }) });
}
function openAIResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
function output(payload) { return { output_text: JSON.stringify(payload) }; }

for (const [label, mock, expectedCode] of [
  ['OpenAI', () => openAIResponse({ error: { code: 'invalid_request' } }, 400), 'palette_consultation_openai_error'],
  ['JSON', () => openAIResponse({ output_text: 'not-json' }), 'palette_consultation_invalid_json'],
  ['schema', () => openAIResponse(output({ palettes: response.palettes.slice(0, 2) })), 'palette_consultation_invalid_schema'],
  ['HEX', () => openAIResponse(output({ palettes: [{ ...response.palettes[0], hex: ['bad'] }, ...response.palettes.slice(1)] })), 'palette_consultation_invalid_hex']
]) {
  test(`${label} failures return a safe code and do not consume the consultation`, async () => {
    const journeyId = `failure-${label}`;
    global.fetch = async () => mock();
    const failed = await POST(request(journeyId));
    assert.equal(failed.status, 502);
    assert.equal((await failed.json()).error, expectedCode);
    global.fetch = async () => openAIResponse(output(response));
    const retried = await POST(request(journeyId));
    assert.equal(retried.status, 200);
    assert.equal((await retried.json()).palettes.length, 3);
  });
}

test('configuration failure returns its safe code and does not consume the consultation', async () => {
  const journeyId = 'failure-configuration';
  delete process.env.OPENAI_API_KEY;
  const failed = await POST(request(journeyId));
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).error, 'palette_consultation_unavailable');
  process.env.OPENAI_API_KEY = 'test-key';
  global.fetch = async () => openAIResponse(output(response));
  const retried = await POST(request(journeyId));
  assert.equal(retried.status, 200);
});

test('keeps rejection feedback separate from new-palette preferences in the OpenAI payload', async () => {
  let openAIPayload;
  global.fetch = async (_url, init) => {
    openAIPayload = JSON.parse(init.body);
    return openAIResponse(output(response));
  };
  const result = await POST(request('feedback-separation'));
  assert.equal(result.status, 200);
  const userInput = JSON.parse(openAIPayload.input[1].content[0].text);
  assert.deepEqual(userInput.feedback, { rejectionReasons: ['Estavam claras demais'], preferences: ['Algo mais delicado'], comment: '' });
});

test('valid palette consultation returns exactly three valid palettes', () => {
  const palettes = validateConsultedPalettes(response, []);
  assert.equal(palettes.length, 3);
  assert.equal(PALETTE_CONSULTATION_LIMIT, 2);
  assert.ok(palettes.every(palette => palette.paleta_hex.length === 5));
  assert.equal(validateConsultedPalettesDetailed({ palettes: response.palettes.slice(0, 2) }).reason, 'schema');
  assert.equal(validateConsultedPalettesDetailed({ palettes: [{ ...response.palettes[0], hex: ['#xyz'] }, ...response.palettes.slice(1)] }).reason, 'hex');
});

test.after(() => {
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  if (originalModel === undefined) delete process.env.OPENAI_MODEL; else process.env.OPENAI_MODEL = originalModel;
});
