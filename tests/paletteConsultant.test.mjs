import test from 'node:test';
import assert from 'node:assert/strict';
import { validateConsultedPalettes, PALETTE_CONSULTATION_LIMIT } from '../src/lib/paletteConsultant.js';

const response = { palettes: [
  { name: 'Soft Tide', hex: ['#123456','#234567','#345678','#456789','#56789A'], rationale: 'Coherent direction, softer color.' },
  { name: 'Warm Tide', hex: ['#654321','#765432','#876543','#987654','#A98765'], rationale: 'Coherent direction, warmer color.' },
  { name: 'Deep Tide', hex: ['#112233','#223344','#334455','#445566','#556677'], rationale: 'Coherent direction, deeper color.' }
] };

test('a valid palette consultation returns exactly three valid palettes', () => {
  const palettes = validateConsultedPalettes(response, []);
  assert.equal(palettes.length, 3);
  assert.equal(PALETTE_CONSULTATION_LIMIT, 2);
  assert.ok(palettes.every(palette => palette.paleta_hex.length === 5));
});

test('consultations reject duplicate and malformed palettes without consuming client state', () => {
  assert.equal(validateConsultedPalettes(response, [response.palettes[0]]), null);
  assert.equal(validateConsultedPalettes({ palettes: response.palettes.slice(0, 2) }, []), null);
});
