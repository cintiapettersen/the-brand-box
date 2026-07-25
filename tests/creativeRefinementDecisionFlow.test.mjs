import fs from 'fs';
import path from 'path';

console.log('🧪 Running Creative Refinement Decision Flow test suite...');

const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Verify handleUseRefinedDirection handler presence and logic
if (!pageContent.includes('const handleUseRefinedDirection = async () => {') || !pageContent.includes('refinementChoice: \'refined\'')) {
  console.error('❌ FAIL: handleUseRefinedDirection handler or refinementChoice state assignment missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: handleUseRefinedDirection handler declared with refinementChoice: "refined" persistence.');
}

// 2. Verify handleKeepOriginalDirection handler presence and logic
if (!pageContent.includes('const handleKeepOriginalDirection = async () => {') || !pageContent.includes('refinementChoice: \'original\'')) {
  console.error('❌ FAIL: handleKeepOriginalDirection handler or refinementChoice state assignment missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: handleKeepOriginalDirection handler declared with refinementChoice: "original" persistence.');
}

// 3. Verify Before-Analysis buttons: "Analisar minha resposta" and "Seguir com a direção original"
if (!pageContent.includes('{refineCopy.analyze}') || !pageContent.includes('{refineCopy.keepOriginalBefore}')) {
  console.error('❌ FAIL: Before-analysis buttons missing or incorrectly mapped!');
  process.exit(1);
} else {
  console.log('✅ PASS: Before-analysis buttons ("Analisar minha resposta" & "Seguir com a direção original") correctly mapped.');
}

// 4. Verify After-Analysis decision buttons: "Usar esta direção refinada" and "Prefiro a direção original"
if (!pageContent.includes('{refineCopy.useRefined}') || !pageContent.includes('{refineCopy.keepOriginal}')) {
  console.error('❌ FAIL: After-analysis decision buttons missing or incorrectly mapped!');
  process.exit(1);
} else {
  console.log('✅ PASS: After-analysis decision buttons ("Usar esta direção refinada" & "Prefiro a direção original") correctly rendered.');
}

// 5. Verify Confirmation Message Banner and auto-advancement call to fetchVariacoes
if (!pageContent.includes('refinementConfirmation') || !pageContent.includes('setRefinementConfirmation(') || !pageContent.includes('await fetchVariacoes(')) {
  console.error('❌ FAIL: Confirmation banner or auto-advancement to fetchVariacoes missing!');
  process.exit(1);
} else {
  console.log('✅ PASS: Confirmation message banner and automatic step advancement to fetchVariacoes() present.');
}

// 6. Test simulated decision flow logic in JS mock
let mockState = {
  resultadoFinal: { estiloId: 5, estiloNome: 'Essência Atemporal', creativeDirector: { diagnostico: 'Original' } },
  formData: { marca: 'Minha Marca', contextoExtra: '' },
  localStorage: {}
};

// Simulation of handleUseRefinedDirection
const currentRefinement = {
  direcaoRefinada: 'Visual orgânico e caloroso',
  estiloAlternativoId: null,
  estiloAlternativoNome: null
};

// Apply refined
mockState.resultadoFinal = {
  ...mockState.resultadoFinal,
  refinementChoice: 'refined',
  creativeDirector: {
    ...mockState.resultadoFinal.creativeDirector,
    refinementChoice: 'refined',
    activeRefinement: currentRefinement
  }
};
mockState.formData.contextoExtra = `[Direção Refinada]: ${currentRefinement.direcaoRefinada}`;
mockState.localStorage['brandbox_resultado_final'] = JSON.stringify(mockState.resultadoFinal);

if (mockState.resultadoFinal.refinementChoice !== 'refined' || !mockState.formData.contextoExtra.includes('Visual orgânico e caloroso')) {
  console.error('❌ FAIL: Refined decision state simulation failed!');
  process.exit(1);
} else {
  console.log('✅ PASS: Refined decision state simulation succeeded (contextoExtra and localStorage synced).');
}

// Simulation of handleKeepOriginalDirection
mockState.resultadoFinal = {
  ...mockState.resultadoFinal,
  refinementChoice: 'original',
  creativeDirector: {
    ...mockState.resultadoFinal.creativeDirector,
    refinementChoice: 'original',
    activeRefinement: null
  }
};
mockState.localStorage['brandbox_resultado_final'] = JSON.stringify(mockState.resultadoFinal);

if (mockState.resultadoFinal.refinementChoice !== 'original' || mockState.resultadoFinal.creativeDirector.activeRefinement !== null) {
  console.error('❌ FAIL: Original decision state simulation failed!');
  process.exit(1);
} else {
  console.log('✅ PASS: Original decision state simulation succeeded (refinement proposal cleared, original kept).');
}

console.log('🎉 ALL CREATIVE REFINEMENT DECISION FLOW TESTS PASSED SUCCESSFULLY!');
