const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.sucesso = enData.sucesso || {};
enData.sucesso.no_variation_saved = "No variation saved yet.";
enData.sucesso.no_variation_saved_hint = "No variation saved yet. Try saving the current style!";

ptData.sucesso = ptData.sucesso || {};
ptData.sucesso.no_variation_saved = "Nenhuma variação salva ainda.";
ptData.sucesso.no_variation_saved_hint = "Nenhuma variação salva ainda. Experimente salvar o estilo atual!";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Variations dictionaries updated');
