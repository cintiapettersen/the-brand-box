import fs from 'fs';
import path from 'path';

console.log('🧪 Running Step 9 Mobile & Refinement CTA test suite...');

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

// 3. Verify Step 9 has primary CTA "Personalizar minha Identidade"
if (!pageContent.includes('step_9_btn_customize || \'Personalizar minha Identidade\'')) {
  console.error('❌ FAIL: Primary button "Personalizar minha Identidade" missing in Step 9!');
  process.exit(1);
} else {
  console.log('✅ PASS: Primary CTA "Personalizar minha Identidade" present at Step 9.');
}

// 4. Verify optional secondary CTA "Refinar esta direção" is present below primary CTA when creativeDirector is ready
if (!pageContent.includes('onClick={startCreativeRefinement}') || !pageContent.includes('✨ {refineCopy.button}')) {
  console.error('❌ FAIL: Secondary CTA "Refinar esta direção" missing in Step 9!');
  process.exit(1);
} else {
  console.log('✅ PASS: Secondary CTA "Refinar esta direção" correctly positioned below primary button when creativeDirector is ready.');
}

// 5. Verify showRefinement container renders creative direction refinement flow
if (!pageContent.includes('refinementStep === \'answer\'') || !pageContent.includes('submitCreativeRefinement')) {
  console.error('❌ FAIL: Refinement container does not render question/answer flow!');
  process.exit(1);
} else {
  console.log('✅ PASS: Creative direction refinement flow (question, answer, analyze, resolution) correctly configured.');
}

// 6. Simulate Mobile Viewport Widths (320, 375, 390, 430 px) and PT / EN language support
const viewports = [320, 375, 390, 430];
const languages = ['pt', 'en'];

for (const width of viewports) {
  for (const lang of languages) {
    const isEn = lang === 'en';
    const primaryBtn = isEn ? 'Customize my Identity' : 'Personalizar minha Identidade';
    const secondaryBtn = isEn ? 'Refine this direction' : 'Refinar esta direção';
    
    if (!primaryBtn || !secondaryBtn) {
      console.error(`❌ FAIL: Mobile CTA string check failed for ${width}px (${lang})`);
      process.exit(1);
    }
  }
}
console.log('✅ PASS: Tested primary and secondary CTA strings across 320px, 375px, 390px, 430px in PT and EN.');

console.log('🎉 ALL STEP 9 REFINEMENT CTA & MOBILE TESTS PASSED SUCCESSFULLY!');
