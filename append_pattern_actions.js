const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.sucesso = enData.sucesso || {};
enData.sucesso.pattern_mirror_progress = "⏳ Mirroring...";
enData.sucesso.pattern_mirror_btn = "🪞 Mirror pattern";
enData.sucesso.pattern_liked_title = "Loved this pattern!";
enData.sucesso.pattern_liked = "♥️ Loved it";
enData.sucesso.pattern_like = "🤍 Love it";
enData.sucesso.pattern_discard = "👎 Discard";

ptData.sucesso = ptData.sucesso || {};
ptData.sucesso.pattern_mirror_progress = "⏳ Espelhando...";
ptData.sucesso.pattern_mirror_btn = "🪞 Espelhar padrão";
ptData.sucesso.pattern_liked_title = "Amei essa estampa!";
ptData.sucesso.pattern_liked = "♥️ Amei";
ptData.sucesso.pattern_like = "🤍 Amei";
ptData.sucesso.pattern_discard = "👎 Descartar";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Pattern action dictionaries updated');
