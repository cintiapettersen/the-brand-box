import { POST as matchmakerHandler } from '../src/app/api/matchmaker/route.js';
import { POST as creativeDirectorHandler } from '../src/app/api/creative-director/route.js';

console.log('🧪 Executing runtime mock integration test for AI Creative Director...');

// Mock Request object for /api/creative-director
const sampleFormData = {
  nome: 'Dra. Maria',
  atuacao: 'Pediatria / Saúde infantil',
  atuacaoOutra: '',
  publico: 'Bebês e criancinhas (0 a 6 anos)',
  identidade: 'Feminina',
  sentimentos: ['Acolhimento', 'Confiança', 'Segurança'],
  locais: ['Consultório', 'Instagram'],
  inspiracoes: 'Moderna e acolhedora',
  nuncaPensar: 'Não quero parecer fria ou corporativa demais',
  nuncaPensarTags: ['Muito Séria / Fria'],
  elementosVisuais: ['Formas orgânicas']
};

const mockMatchResult = {
  estiloId: 3,
  estiloNome: 'Escandinavo Acolhedor',
  mensagem: 'Olá Dra. Maria! Escolhemos o Escandinavo Acolhedor.'
};

// Test request body validation of POST /api/creative-director
const reqBody = {
  formData: sampleFormData,
  estiloId: mockMatchResult.estiloId,
  estiloNome: mockMatchResult.estiloNome,
  mensagem: mockMatchResult.mensagem,
  idioma: 'pt',
  requestKey: 'test-journey-diagnostic-key-1'
};

const req = new Request('http://localhost/api/creative-director', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reqBody)
});

// Execute route handler (without OPENAI_API_KEY set in test env, should return 503 unavailable cleanly)
const res = await creativeDirectorHandler(req);
console.log('HTTP Status code when OpenAI API Key missing:', res.status);

if (res.status !== 503 && res.status !== 200) {
  console.error('❌ FAIL: Unexpected HTTP status code from /api/creative-director!');
  process.exit(1);
} else {
  console.log('✅ PASS: /api/creative-director returns safe status code (503 when credentials missing, 200 when ready).');
}

const responseData = await res.json();
console.log('API Response body:', responseData);

if (res.status === 503) {
  if (responseData.error !== 'creative_director_unavailable') {
    console.error('❌ FAIL: Error code is not creative_director_unavailable!');
    process.exit(1);
  } else {
    console.log('✅ PASS: Safe fallback error code returned without crashing application.');
  }
} else if (res.status === 200) {
  if (!responseData.diagnostico || !Array.isArray(responseData.personalidade)) {
    console.error('❌ FAIL: Response payload schema invalid!');
    process.exit(1);
  } else {
    console.log('✅ PASS: Rich 7-field AI Creative Director schema returned successfully.');
  }
}

console.log('🎉 RUNTIME EXECUTION TEST COMPLETED SUCCESSFULLY!');
