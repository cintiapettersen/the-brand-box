import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile('src/app/[lang]/page.js', 'utf8');
assert.match(source, /parsed\.paletteFeedback/);
assert.match(source, /localStorage\.setItem\('brandbox_progress'/);
assert.match(source, /customStep: 'cor'/);
console.log('resume offer persistence tests passed');
