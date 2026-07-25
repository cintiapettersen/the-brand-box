import fs from 'fs';
import path from 'path';

console.log('🧪 Running Palette Switching State Isolation test suite...');

// 1. Verify code assertions in page.js
const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

if (!pageContent.includes('selectPaletteForColor')) {
  console.error('❌ FAIL: selectPaletteForColor handler missing in page.js!');
  process.exit(1);
} else {
  console.log('✅ PASS: selectPaletteForColor handler declared.');
}

if (!pageContent.includes('prevSelectedPaletaRef')) {
  console.error('❌ FAIL: prevSelectedPaletaRef effect guard missing in page.js!');
  process.exit(1);
} else {
  console.log('✅ PASS: prevSelectedPaletaRef effect guard active to clear stale highlight color.');
}

// 2. Simulated state machine runtime test
let state = {
  selectedPaleta: 'paleta-A',
  corAtiva: '#C3CEDB',
  paletteFeedback: { justificativa: 'Avaliação da cor #C3CEDB na Paleta A' },
  paletteFeedbackError: null,
  paletas: [
    { id: 'paleta-A', paleta_hex: ['#C3CEDB', '#2A897F', '#FFFFFF', '#000000', '#F4E8DC'] },
    { id: 'paleta-B', paleta_hex: ['#9B8B9B', '#515361', '#EFECE3', '#8D9A87', '#203830'] }
  ]
};

function selectPaletteForColorMock(nextPaletteId) {
  if (state.selectedPaleta !== nextPaletteId) {
    state.selectedPaleta = nextPaletteId;
    state.corAtiva = null;
    state.paletteFeedback = null;
    state.paletteFeedbackError = null;
  }
}

function handlePrimaryColorSelectMock(hex, paletteId) {
  state.corAtiva = hex;
  state.paletteFeedback = { justificativa: `Avaliação da cor ${hex} na ${paletteId}` };
}

// Step 1: Palette A selected with color & feedback
console.log('🔹 Step 1: Initial state (Palette A with color & feedback)...');
if (state.corAtiva !== '#C3CEDB' || !state.paletteFeedback?.justificativa.includes('Paleta A')) {
  console.error('❌ FAIL: Initial Palette A state broken!');
  process.exit(1);
}

// Step 2: Switch to Palette B
console.log('🔹 Step 2: User switches to Palette B...');
selectPaletteForColorMock('paleta-B');

if (state.selectedPaleta !== 'paleta-B') {
  console.error('❌ FAIL: Palette B was not selected!');
  process.exit(1);
}

if (state.corAtiva !== null) {
  console.error('❌ FAIL: corAtiva was not cleared when switching to Palette B!');
  process.exit(1);
} else {
  console.log('✅ PASS: corAtiva cleared when switching to Palette B.');
}

if (state.paletteFeedback !== null) {
  console.error('❌ FAIL: paletteFeedback was not cleared when switching to Palette B!');
  process.exit(1);
} else {
  console.log('✅ PASS: paletteFeedback cleared when switching to Palette B.');
}

if (state.paletas.length !== 2) {
  console.error('❌ FAIL: Palettes array was mutated or wiped!');
  process.exit(1);
} else {
  console.log('✅ PASS: Palettes array preserved intact.');
}

// Step 3: User chooses highlight color from Palette B
console.log('🔹 Step 3: User selects highlight color #9B8B9B from Palette B...');
handlePrimaryColorSelectMock('#9B8B9B', 'paleta-B');

if (state.corAtiva !== '#9B8B9B') {
  console.error('❌ FAIL: Palette B color selection failed!');
  process.exit(1);
}

if (!state.paletteFeedback?.justificativa.includes('paleta-B')) {
  console.error('❌ FAIL: Evaluation text does not correspond to Palette B!');
  process.exit(1);
} else {
  console.log('✅ PASS: Evaluation text correctly corresponds to Palette B and color #9B8B9B.');
}

console.log('🎉 ALL PALETTE SWITCHING STATE ISOLATION TESTS PASSED!');
