import { POST as paletteConsultationHandler } from '../src/app/api/creative-director/palette-consultation/route.js';

console.log('🧪 Diagnosing /api/creative-director/palette-consultation behavior...');

// Test case matching user screenshot:
// - primaryRejectionReason: '' (unselected)
// - desiredDirection: ''
// - comment: 'gostaria de uma opção com rosa mais fechado'
// - language: 'pt-BR' or 'en-US'

const testPayload1 = {
  journeyId: 'journey-test-123',
  consultationIndex: 1,
  language: 'pt-BR',
  feedback: {
    primaryRejectionReason: '',
    desiredDirection: '',
    comment: 'gostaria de uma opção com rosa mais fechado'
  },
  formData: { marca: 'PICA PAU' },
  resultadoFinal: { estiloId: 6, estiloNome: 'Estético Editorial' },
  existingPalettes: []
};

const req1 = new Request('http://localhost/api/creative-director/palette-consultation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload1)
});

const res1 = await paletteConsultationHandler(req1);
console.log('Test 1 (pt-BR, comment only, no primaryRejectionReason) status:', res1.status);
const body1 = await res1.json();
console.log('Test 1 body:', body1);

// Test 2 with language = 'en-US'
const testPayload2 = { ...testPayload1, language: 'en-US' };
const req2 = new Request('http://localhost/api/creative-director/palette-consultation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload2)
});

const res2 = await paletteConsultationHandler(req2);
console.log('Test 2 (en-US language) status:', res2.status);
const body2 = await res2.json();
console.log('Test 2 body:', body2);
