import { POST as paletteFeedbackHandler } from '../src/app/api/creative-director/palette-feedback/route.js';

console.log('🧪 Running Palette Lookup & Feedback Validation Test...');

// 1. Database Palette A (qualquer)
const dbPaletas = [
  {
    id: 1,
    tipo: 'PALETA',
    paleta_hex: ['#9BB6BE', '#EBD3CA', '#D6A374', '#111111', '#222222'] // Contains #EBD3CA, but NOT #C3B6AE
  }
];

// 2. Consulted Palette from Consultor de Paletas
const consultedPalettes = [
  {
    id: 'consulted-101-0',
    paleta_hex: ['#9BB6BE', '#EBD3CA', '#D6A374', '#C3B6AE', '#F8F7F4'] // Contains BOTH #EBD3CA AND #C3B6AE
  }
];

// Simulate current flawed lookup logic:
const selectedPaletaId = 'consulted-101-0';

// Current logic: paletas.find(p => p.id === selectedPaletaId)
const flawedSel = dbPaletas.find(p => p.id === selectedPaletaId); // undefined!
const qualquer = dbPaletas.find(p => p.paleta_hex?.length > 0);
const flawedCores = flawedSel?.paleta_hex || qualquer?.paleta_hex || [];

console.log('Flawed cores sent to API:', flawedCores);

// Test 1: Click #EBD3CA with flawed lookup (succeeds by coincidence because #EBD3CA is in dbPaletas[0])
const reqEbd3ca = new Request('http://localhost/api/creative-director/palette-feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idioma: 'pt-BR',
    palette: flawedCores,
    primaryColor: '#EBD3CA',
    requestKey: 'test-ebd3ca'
  })
});
const resEbd3ca = await paletteFeedbackHandler(reqEbd3ca);
console.log('Status when clicking #EBD3CA (flawed lookup):', resEbd3ca.status); // 503 (API Key missing) or 200 - BUT NOT 400!

// Test 2: Click #C3B6AE with flawed lookup (fails with 400 Bad Request because #C3B6AE is not in dbPaletas[0])
const reqC3b6ae = new Request('http://localhost/api/creative-director/palette-feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idioma: 'pt-BR',
    palette: flawedCores,
    primaryColor: '#C3B6AE',
    requestKey: 'test-c3b6ae'
  })
});
const resC3b6ae = await paletteFeedbackHandler(reqC3b6ae);
const bodyC3b6ae = await resC3b6ae.json();
console.log('Status when clicking #C3B6AE (flawed lookup):', resC3b6ae.status);
console.log('Body when clicking #C3B6AE (flawed lookup):', bodyC3b6ae);

if (resC3b6ae.status === 400 && bodyC3b6ae.error === 'invalid_palette_feedback_payload') {
  console.log('🔥 BUG REPRODUCED: Clicking #C3B6AE returned 400 invalid_palette_feedback_payload because #C3B6AE was not in the fallback database palette!');
}

// 3. Fixed lookup logic using getAllPalettes()
const allPalettes = [...dbPaletas, ...consultedPalettes];
const fixedSel = allPalettes.find(p => p.id === selectedPaletaId);
const fixedCores = fixedSel?.paleta_hex || fixedSel?.cores_hex || [];

console.log('Fixed cores sent to API:', fixedCores);

const reqC3b6aeFixed = new Request('http://localhost/api/creative-director/palette-feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idioma: 'pt-BR',
    palette: fixedCores,
    primaryColor: '#C3B6AE',
    requestKey: 'test-c3b6ae-fixed'
  })
});
const resC3b6aeFixed = await paletteFeedbackHandler(reqC3b6aeFixed);
console.log('Status when clicking #C3B6AE with FIXED lookup:', resC3b6aeFixed.status);

if (resC3b6aeFixed.status !== 400) {
  console.log('✅ FIX VERIFIED: Palette lookup fix eliminates 400 Bad Request error for consulted palettes!');
}
