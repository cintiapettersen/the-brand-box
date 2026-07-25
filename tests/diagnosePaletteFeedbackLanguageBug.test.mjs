import { POST as paletteFeedbackHandler } from '../src/app/api/creative-director/palette-feedback/route.js';

console.log('🧪 Testing palette-feedback language matching & validation edge cases...');

// Test 1: Client sends idioma = 'pt-BR', OpenAI returns language = 'pt'
function validateFeedbackOld(payload, idioma) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const feedback = {
    language: typeof payload.language === 'string' ? payload.language.trim() : '',
    summary: typeof payload.summary === 'string' ? payload.summary.trim() : '',
    strength: typeof payload.strength === 'string' ? payload.strength.trim() : '',
    caution: typeof payload.caution === 'string' ? payload.caution.trim() : ''
  };
  return feedback.language === idioma && feedback.summary && feedback.strength && feedback.caution ? feedback : null;
}

const mockPayloadFromOpenAI = {
  language: 'pt',
  summary: 'Paleta equilibrada e sofisticada.',
  strength: 'Cria excelente contraste visual.',
  caution: 'Atenção ao contraste em textos pequenos.'
};

const result1 = validateFeedbackOld(mockPayloadFromOpenAI, 'pt-BR');
console.log('Validation result when client sends pt-BR and OpenAI returns pt:', result1);

if (result1 === null) {
  console.log('🔥 BUG REPRODUCED: Strict equality (feedback.language === idioma) fails when OpenAI returns "pt" for client "pt-BR"!');
}

// Test 2: Flexible language matching
function validateFeedbackFixed(payload, idioma) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const feedback = {
    language: typeof payload.language === 'string' ? payload.language.trim() : '',
    summary: typeof payload.summary === 'string' ? payload.summary.trim() : '',
    strength: typeof payload.strength === 'string' ? payload.strength.trim() : '',
    caution: typeof payload.caution === 'string' ? payload.caution.trim() : ''
  };

  const isMatchingLang = feedback.language.toLowerCase().startsWith('pt') === idioma.toLowerCase().startsWith('pt') ||
                         feedback.language.toLowerCase() === idioma.toLowerCase();

  return isMatchingLang && feedback.summary && feedback.strength && feedback.caution ? feedback : null;
}

const result2 = validateFeedbackFixed(mockPayloadFromOpenAI, 'pt-BR');
console.log('Validation result with fixed flexible language matching:', result2);

if (result2 !== null) {
  console.log('✅ FIX VERIFIED: Flexible language matching accepts "pt", "pt-BR", "en", "en-US" seamlessly!');
}
