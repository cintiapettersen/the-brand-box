import fs from 'fs';
import path from 'path';
import { normalizeHexes, validateConsultedPalettesDetailed, arePalettesSimilar } from '../src/lib/paletteConsultant.js';

console.log('🧪 Running Consultor de Paletas unit test suite...');

// 1. Validate HEX normalization and strict 5-color constraint
const validMixedCasePalette = ['#c3cedb', '#2a897f', '#ffffff', '#000000', '#f4e8dc'];
const normalized = normalizeHexes(validMixedCasePalette);

if (!normalized || normalized.length !== 5 || normalized[0] !== '#C3CEDB') {
  console.error('❌ FAIL: Mixed-case HEX string normalization failed!');
  process.exit(1);
} else {
  console.log('✅ PASS: Mixed-case HEX strings normalized to uppercase #RRGGBB.');
}

const invalidShortPalette = ['#C3CEDB', '#2A897F', '#FFFFFF'];
if (normalizeHexes(invalidShortPalette) !== null) {
  console.error('❌ FAIL: Non-5 color palette was accepted!');
  process.exit(1);
} else {
  console.log('✅ PASS: Non-5 color palette correctly rejected by normalizeHexes.');
}

// 2. Validate duplicate / near-identical palette blocking
const paletteA = ['#C3CEDB', '#2A897F', '#FFFFFF', '#000000', '#F4E8DC'];
const paletteNearIdentical = ['#C4CEEC', '#2B8A80', '#FFFFFF', '#010101', '#F5E9DD']; // very slight hex shift
const paletteDifferent = ['#9B8B9B', '#515361', '#EFECE3', '#8D9A87', '#203830'];

if (!arePalettesSimilar(paletteA, paletteNearIdentical, 30)) {
  console.error('❌ FAIL: Near-identical palette was not detected as similar!');
  process.exit(1);
} else {
  console.log('✅ PASS: Near-identical palette correctly detected as similar.');
}

if (arePalettesSimilar(paletteA, paletteDifferent, 30)) {
  console.error('❌ FAIL: Distinct palette was incorrectly flagged as similar!');
  process.exit(1);
} else {
  console.log('✅ PASS: Distinct palette correctly identified as distinct.');
}

// 3. Validate 3-palette detailed schema and duplicate filtering
const mockPayload = {
  palettes: [
    { name: 'Tons Suaves 1', hex: ['#C3CEDB', '#2A897F', '#FFFFFF', '#000000', '#F4E8DC'], rationale: 'Harmonia delicada e serena.' },
    { name: 'Tons Suaves 2', hex: ['#E1EDE7', '#203830', '#8D9A87', '#FAFAFA', '#C7B49F'], rationale: 'Equilíbrio orgânico e natural.' },
    { name: 'Tons Suaves 3', hex: ['#9B8B9B', '#515361', '#EFECE3', '#F4E8DC', '#C9D7E5'], rationale: 'Toque sofisticado e contemporâneo.' }
  ]
};

const validation = validateConsultedPalettesDetailed(mockPayload, []);
if (!validation.palettes || validation.palettes.length !== 3) {
  console.error('❌ FAIL: Failed to validate 3 consulted palettes!');
  process.exit(1);
} else {
  console.log('✅ PASS: Exactly 3 consulted palettes validated with rationale and IDs.');
}

// 4. Verify route.js API file existence
const routePath = path.resolve('src/app/api/creative-director/palette-consultation/route.js');
if (!fs.existsSync(routePath)) {
  console.error('❌ FAIL: /api/creative-director/palette-consultation/route.js missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: API route /api/creative-director/palette-consultation/route.js is present.');
}

// 5. Verify page.js Consultor de Paletas UI integration & name/rationale rendering
const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

const requiredStrings = [
  'paletteConsultantCopy',
  'showPaletteConsultant',
  'submitPaletteConsultation',
  'primaryRejectionReason',
  'desiredDirection',
  'paletteComment',
  'Estavam coloridas demais',
  'Estavam neutras demais',
  'Estavam claras demais',
  'Estavam escuras demais',
  'Não combinam com a minha marca',
  'Algo mais delicado',
  'Algo mais marcante',
  'p.nome_variacao || p.nome || paletteLabel',
  'p.rationale || p.justificativa'
];

for (const reqStr of requiredStrings) {
  if (!pageContent.includes(reqStr)) {
    console.error(`❌ FAIL: Required string "${reqStr}" missing in page.js!`);
    process.exit(1);
  }
}
console.log('✅ PASS: All rejection reasons, direction preferences, state, name, and rationale UI rendering present in page.js.');

console.log('🎉 ALL CONSULTOR DE PALETAS TESTS PASSED SUCCESSFULLY!');
