import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile('src/app/[lang]/page.js', 'utf8');
assert.match(source, /!isPersistenceReady \|\| showResumePrompt/);
assert.match(source, /await restoreProgress\(savedProgress\)/);
assert.match(source, /selectedPaleta, selectedTipo, selectedIcon, customStep, paletteFeedback/);
console.log('persistence guard tests passed');
