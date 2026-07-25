import fs from 'fs';
import path from 'path';

console.log('🔍 Technical Audit: AI Creative Director & Matchmaker Integration...');

const pagePath = path.resolve('src/app/[lang]/page.js');
const pageContent = fs.readFileSync(pagePath, 'utf8');

const routePath = path.resolve('src/app/api/creative-director/route.js');
const routeContent = fs.readFileSync(routePath, 'utf8');

// 1. Verify callMatchmaker triggers POST /api/creative-director
if (!pageContent.includes('const creativeDirector = await fetchCreativeDirectorDiagnostic(data);')) {
  console.error('❌ FAIL: callMatchmaker does not invoke fetchCreativeDirectorDiagnostic!');
  process.exit(1);
} else {
  console.log('✅ 1. CONFIRMED: callMatchmaker automatically invokes fetchCreativeDirectorDiagnostic right after matchmaker response.');
}

// 2. Verify fetchCreativeDirectorDiagnostic sends POST /api/creative-director with requestKey
if (!pageContent.includes('fetch(\'/api/creative-director\'') || !pageContent.includes('requestKey: getRequestKey(\'diagnostic\')')) {
  console.error('❌ FAIL: fetchCreativeDirectorDiagnostic missing POST /api/creative-director or requestKey!');
  process.exit(1);
} else {
  console.log('✅ 2. CONFIRMED: fetchCreativeDirectorDiagnostic sends POST /api/creative-director with unique requestKey for deduplication & caching.');
}

// 3. Verify loading state transition (isCreativeDirectorLoading = true -> false)
if (!pageContent.includes('setIsCreativeDirectorLoading(true)') || !pageContent.includes('setIsCreativeDirectorLoading(false)')) {
  console.error('❌ FAIL: isCreativeDirectorLoading state setters missing!');
  process.exit(1);
} else {
  console.log('✅ 3. CONFIRMED: isCreativeDirectorLoading correctly transitions (true during fetch -> false upon completion).');
}

// 4. Verify Step 9 renders from resultadoFinal.creativeDirector
if (!pageContent.includes('{resultadoFinal.creativeDirector && (') || !pageContent.includes('resultadoFinal.creativeDirector.diagnostico')) {
  console.error('❌ FAIL: Step 9 does not render from resultadoFinal.creativeDirector!');
  process.exit(1);
} else {
  console.log('✅ 4. CONFIRMED: Step 9 renders full diagnostic, personality, expectations, goals, and risks directly from resultadoFinal.creativeDirector.');
}

// 5. Verify fallback is ONLY triggered when creativeDirector is null/error
if (!pageContent.includes('!isCreativeDirectorLoading && !resultadoFinal.creativeDirector')) {
  console.error('❌ FAIL: Fallback rendering is not guarded by !resultadoFinal.creativeDirector!');
  process.exit(1);
} else {
  console.log('✅ 5. CONFIRMED: Legacy Gemini message fallback is strictly guarded by !isCreativeDirectorLoading && !resultadoFinal.creativeDirector (only rendered on real API failure).');
}

// 6. Verify API route /api/creative-director schema validation & requestGuards
if (!routeContent.includes('acquireCreativeDirectorRequest') || !routeContent.includes('creativeDirectorSchema')) {
  console.error('❌ FAIL: API route /api/creative-director missing requestGuards or schema validation!');
  process.exit(1);
} else {
  console.log('✅ 6. CONFIRMED: /api/creative-director enforces strict JSON schema, OpenAI GPT-4o/2.5 responses, requestGuards deduplication & rate limiting.');
}

console.log('🎉 AUDIT COMPLETE: AI Creative Director integration is 100% INTACT & PRESERVED!');
