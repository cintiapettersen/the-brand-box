// Uso interno do subir-icones.sh
// node scripts/add-icon.mjs <filename> <estilo> <label>
import fs from 'fs';

const [,, filename, estilo, label] = process.argv;
const STYLE_ICONS = 'src/lib/styleIcons.js';

const content = fs.readFileSync(STYLE_ICONS, 'utf8');
const id = filename.replace(/^icon-/, '').replace(/\.(png|svg)$/, '');
const newEntry = `    { id: '${id}', label: '${label}', path: '/icons/${filename}' },`;
const marker = `'${estilo}': [`;

if (content.includes(marker)) {
  const updated = content.replace(marker, marker + '\n' + newEntry);
  fs.writeFileSync(STYLE_ICONS, updated);
  console.log(`✅ "${label}" adicionado ao ${estilo}`);
} else {
  console.log(`⚠️  Estilo '${estilo}' não encontrado no styleIcons.js`);
}
