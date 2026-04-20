// Uso interno do subir-icones.sh
// Modos:
//   node add-icon.mjs add <filename> <estilo> <label>
//   node add-icon.mjs replace <filename> <estilo> <old-id> <label>
import fs from 'fs';

const [,, mode, filename, estilo, arg4, arg5] = process.argv;
const STYLE_ICONS = 'src/lib/styleIcons.js';
let content = fs.readFileSync(STYLE_ICONS, 'utf8');

if (mode === 'add') {
  const label = arg4;
  const id = filename.replace(/^icon-/, '').replace(/\.(png|svg)$/, '');
  const newEntry = `    { id: '${id}', label: '${label}', path: '/icons/${filename}' },`;
  const marker = `'${estilo}': [`;
  if (content.includes(marker)) {
    content = content.replace(marker, marker + '\n' + newEntry);
    fs.writeFileSync(STYLE_ICONS, content);
    console.log(`✅ "${label}" adicionado ao ${estilo}`);
  } else {
    console.log(`⚠️  Estilo '${estilo}' não encontrado`);
  }

} else if (mode === 'replace') {
  const oldId = arg4;
  const label = arg5;
  const newId = filename.replace(/^icon-/, '').replace(/\.(png|svg)$/, '');
  // Substitui a linha com o id antigo pela nova entrada
  const oldLineRegex = new RegExp(`    \\{ id: '${oldId}',[^}]+\\},`);
  const newEntry = `    { id: '${newId}', label: '${label}', path: '/icons/${filename}' },`;
  if (oldLineRegex.test(content)) {
    content = content.replace(oldLineRegex, newEntry);
    fs.writeFileSync(STYLE_ICONS, content);
    console.log(`✅ "${label}" substituiu "${oldId}" em ${estilo}`);
  } else {
    console.log(`⚠️  Ícone "${oldId}" não encontrado em ${estilo}`);
  }
}
