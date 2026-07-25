import { POST as paletteFeedbackHandler } from '../src/app/api/creative-director/palette-feedback/route.js';

console.log('🧪 Diagnosing /api/creative-director/palette-feedback behavior...');

const testPayload = {
  idioma: 'pt-BR',
  palette: ['#9BB6BE', '#EBD3CA', '#D6A374', '#C3B6AE', '#F8F7F4'],
  primaryColor: '#C3B6AE',
  requestKey: 'test-session-123:palette_feedback:paleta-1:#C3B6AE',
  formData: { marca: 'BABY KANGOO' },
  resultadoFinal: { estiloNome: 'Escandinavo Acolhedor' }
};

// 1st Call
const req1 = new Request('http://localhost/api/creative-director/palette-feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
});

const res1 = await paletteFeedbackHandler(req1);
console.log('1st call status:', res1.status);

// 2nd Call with SAME requestKey (e.g. user re-clicks #C3B6AE or clicks Retry button)
const req2 = new Request('http://localhost/api/creative-director/palette-feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
});

const res2 = await paletteFeedbackHandler(req2);
console.log('2nd call status (re-clicking color or retry button):', res2.status);
const body2 = await res2.json();
console.log('2nd call body:', body2);
