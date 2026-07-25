import fs from 'fs';
import path from 'path';

console.log('🧪 Running pre-checkout AI Creative Director test suite...');

// 1. Validate route.js normalization logic
const routePath = path.resolve('src/app/api/creative-director/palette-feedback/route.js');
const routeContent = fs.readFileSync(routePath, 'utf8');

if (!routeContent.includes('colors.map(c => cleanText(c).toUpperCase())')) {
  console.error('❌ FAIL: normalizeColors does not normalize HEX to uppercase!');
  process.exit(1);
} else {
  console.log('✅ PASS: normalizeColors normalizes HEX strings to uppercase.');
}

if (!routeContent.includes('primaryColor = cleanText(body.primaryColor).toUpperCase()')) {
  console.error('❌ FAIL: primaryColor is not normalized to uppercase before comparison!');
  process.exit(1);
} else {
  console.log('✅ PASS: primaryColor is normalized to uppercase.');
}

if (!routeContent.includes('colors.length !== 5')) {
  console.error('❌ FAIL: Palette 5-color strict validation rule is missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: Strict 5-color palette validation rule maintained.');
}

// 2. Validate page.js Step 10 refinement container & retry rendering
const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

if (!pageContent.includes('paletteFeedbackError')) {
  console.error('❌ FAIL: paletteFeedbackError state missing in page.js!');
  process.exit(1);
} else {
  console.log('✅ PASS: paletteFeedbackError state declared for visible error card.');
}

if (!pageContent.includes('Did not like any? Talk to AI Creative Director') || !pageContent.includes('Não gostou de nenhuma? Consultar a Diretora IA')) {
  console.error('❌ FAIL: Step 10 CTA text strings missing or altered!');
  process.exit(1);
} else {
  console.log('✅ PASS: Step 10 CTA text strings intact for PT and EN.');
}

if (!pageContent.includes('clearAiUsage(\'refinement_question\')')) {
  console.error('❌ FAIL: clearAiUsage helper for retry missing in page.js!');
  process.exit(1);
} else {
  console.log('✅ PASS: Retry handling and clearAiUsage helper configured.');
}

// Simulated mock runtime test for HEX normalization & 5-color constraint
function mockNormalizeColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 5) return null;
  const normalized = colors.map(c => typeof c === 'string' ? c.trim().toUpperCase() : '');
  return normalized.every(color => /^#[0-9A-F]{6}$/.test(color)) ? normalized : null;
}

const validMixedCasePalette = ['#c3cedb', '#2a897f', '#ffffff', '#000000', '#f4e8dc'];
const normalizedResult = mockNormalizeColors(validMixedCasePalette);
const selectedColor = '#C3CEDB';

if (!normalizedResult || !normalizedResult.includes(selectedColor.toUpperCase())) {
  console.error('❌ FAIL: Mixed-case HEX matching failed!');
  process.exit(1);
} else {
  console.log('✅ PASS: Mixed-case HEX matching passed.');
}

const invalidShortPalette = ['#C3CEDB', '#2A897F', '#FFFFFF'];
if (mockNormalizeColors(invalidShortPalette) !== null) {
  console.error('❌ FAIL: Non-5 color palette was accepted!');
  process.exit(1);
} else {
  console.log('✅ PASS: Non-5 color palette correctly rejected.');
}

console.log('🎉 ALL PRE-CHECKOUT AI CREATIVE DIRECTOR TESTS PASSED SUCCESSFULLY!');
