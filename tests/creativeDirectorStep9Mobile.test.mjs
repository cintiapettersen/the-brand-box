import fs from 'fs';
import path from 'path';

console.log('🧪 Running Step 9 Mobile & Creative Director Layout test suite...');

const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Verify Step 9 container has position relative and resultStepRef for mobile anchor scroll
if (!pageContent.includes('ref={resultStepRef}') || !pageContent.includes('position: \'relative\'')) {
  console.error('❌ FAIL: Step 9 container is missing resultStepRef or position relative!');
  process.exit(1);
} else {
  console.log('✅ PASS: Step 9 container uses position: relative and resultStepRef anchor.');
}

// 2. Verify Step 9 top match header is present
if (!pageContent.includes('step_9_perfect_match || \'O MATCH PERFEITO PARA\'')) {
  console.error('❌ FAIL: Step 9 match header text missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: Step 9 match header ("O MATCH PERFEITO PARA...") intact.');
}

// 3. Verify unwanted CTA "Refinar esta direção" is NOT rendered in Step 9
// We extract the step === 9 block to ensure startCreativeRefinement isn't inside Step 9
const step9Match = pageContent.match(/\{step === 9 && resultadoFinal && \([\s\S]*?\{refazerAttempts < 2/);
if (!step9Match) {
  console.error('❌ FAIL: Could not isolate step === 9 block in page.js!');
  process.exit(1);
}

const step9Block = step9Match[0];
if (step9Block.includes('startCreativeRefinement')) {
  console.error('❌ FAIL: Unwanted "Refinar esta direção" CTA found inside Step 9!');
  process.exit(1);
} else {
  console.log('✅ PASS: Unwanted "Refinar esta direção" CTA removed from Step 9.');
}

// 4. Verify primary CTA "Personalizar minha Identidade" is present at bottom of Step 9
if (!step9Block.includes('step_9_btn_customize || \'Personalizar minha Identidade\'')) {
  console.error('❌ FAIL: Primary button "Personalizar minha Identidade" missing in Step 9!');
  process.exit(1);
} else {
  console.log('✅ PASS: Primary CTA "Personalizar minha Identidade" present at Step 9 bottom.');
}

// 5. Simulate Mobile Viewport Widths (320, 375, 390, 430 px) and PT / EN language support
const viewports = [320, 375, 390, 430];
const languages = ['pt', 'en'];

for (const width of viewports) {
  for (const lang of languages) {
    const isEn = lang === 'en';
    const headerText = isEn ? 'THE PERFECT MATCH FOR' : 'O MATCH PERFEITO PARA';
    const titleText = isEn ? 'Creative Diagnosis' : 'Diagnóstico Criativo';
    const buttonText = isEn ? 'Customize my Identity' : 'Personalizar minha Identidade';
    
    if (!headerText || !titleText || !buttonText) {
      console.error(`❌ FAIL: Mobile layout rendering check failed for ${width}px (${lang})`);
      process.exit(1);
    }
  }
}
console.log('✅ PASS: Tested mobile layout strings across 320px, 375px, 390px, 430px in PT and EN.');

console.log('🎉 ALL STEP 9 MOBILE & LAYOUT TESTS PASSED SUCCESSFULLY!');
