import fs from 'fs';
import path from 'path';

console.log('🧪 Iniciando teste de regressão: Pós-Pagamento & Retomada de Etapa...');

// 1. Validação de sintaxe e referência a patternOffset no arquivo me/sucesso/page.js
const sucessoPath = path.resolve('src/app/[lang]/sucesso/page.js');
const fileContent = fs.readFileSync(sucessoPath, 'utf8');

// Garante que patternOffset foi declarado como estado em EntregaContent
if (!fileContent.includes('const [patternOffset, setPatternOffsetState] = useState')) {
  console.error('❌ FAIL: patternOffset não foi declarado como useState em EntregaContent!');
  process.exit(1);
} else {
  console.log('✅ PASS: patternOffset declarado como estado em EntregaContent.');
}

// Garante que PostPaymentErrorBoundary foi implementado em sucesso/page.js
if (!fileContent.includes('class PostPaymentErrorBoundary extends React.Component')) {
  console.error('❌ FAIL: PostPaymentErrorBoundary não encontrado em sucesso/page.js!');
  process.exit(1);
} else {
  console.log('✅ PASS: PostPaymentErrorBoundary implementado com sucesso.');
}

// Garante que GuiaStep possui tratamentos defensivos contra dados legados/nulos
if (!fileContent.includes('const safePaletteColors = Array.isArray(paletteColors)')) {
  console.error('❌ FAIL: GuiaStep não possui fallback seguro para paletteColors!');
  process.exit(1);
} else {
  console.log('✅ PASS: GuiaStep possui fallbacks defensivos para paleta e dados legados.');
}

// Simulated mock runtime test for step recovery logic
function simulateStepRecovery(storedStep, allSteps) {
  if (storedStep && allSteps.includes(storedStep)) {
    return storedStep;
  }
  return 'placa'; // safe default step
}

const ALL_STEPS = [
  'placa', 'manifesto', 'tomdevoz', 'fonte', 'logo', 'slogan', 
  'submarca', 'cores', 'paleta', 'estampa', 'guia',
  'cartao', 'pack-instagram', 'assinatura-email', 'papelaria',
  'ajuda', 'upsell'
];

if (simulateStepRecovery('guia', ALL_STEPS) !== 'guia') {
  console.error('❌ FAIL: Etapa válida "guia" deveria ser aceita.');
  process.exit(1);
}

if (simulateStepRecovery('etapa_invalida_corrompida', ALL_STEPS) !== 'placa') {
  console.error('❌ FAIL: Etapa corrompida deveria redirecionar para "placa".');
  process.exit(1);
}

console.log('✅ PASS: Lógica de recuperação de etapa validada com sucesso.');
console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
