// node scripts/list-icons.mjs <estilo>
import fs from 'fs';

const estilo = process.argv[2];
const content = fs.readFileSync('src/lib/styleIcons.js', 'utf8');
const block = content.split(`\u2018${estilo}\u2019: [`)[1]?.split(']')[0]
           || content.split(`'${estilo}': [`)[1]?.split(']')[0]
           || '';
const matches = [...block.matchAll(/id:\s*'([^']+)',\s*label:\s*'([^']*)'/g)];
matches.forEach((m, i) => console.log(`${i + 1}|${m[1]}|${m[2]}`));
