import assert from 'node:assert/strict';
const source = await import('node:fs/promises').then(fs => fs.readFile('src/app/[lang]/page.js', 'utf8'));
assert.match(source, /let variationsLoaded = false/);
assert.match(source, /!variationsLoaded/);
assert.match(source, /finally \{\n          setLoadingVariacoes\(false\);/);
assert.doesNotMatch(source, /!data\.variacoes/);
console.log('restore variations safety tests passed');
