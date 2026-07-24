import assert from 'node:assert/strict';
import { getCreativeDiagnosisCopy, isEnglishLocale } from '../src/lib/creativeDiagnosisCopy.js';
assert.equal(isEnglishLocale('en-US'), true);
assert.equal(isEnglishLocale('pt-BR'), false);
assert.deepEqual(getCreativeDiagnosisCopy('en-US'), { title: 'CREATIVE DIAGNOSIS', personality: 'Brand personality', audience: 'What the audience needs to feel', goals: 'Emotional goals', why: 'Why this direction fits', risks: 'Creative risks to avoid', loading: 'Preparing your creative diagnosis…', fallback: 'The Creative Director is temporarily unavailable. Your Gemini match remains available.', retry: 'Try again' });
assert.equal(getCreativeDiagnosisCopy('pt-BR').title, 'DIAGNÓSTICO CRIATIVO');
console.log('creative diagnosis locale tests passed');
