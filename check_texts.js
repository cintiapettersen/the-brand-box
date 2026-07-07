const fs = require('fs');
const content = fs.readFileSync('src/app/[lang]/sucesso/page.js', 'utf-8');

const regex = />[^<]*[A-Z][A-Z\s]+[A-Z][^<]*</g;
let matches = content.match(regex);
if (matches) {
    matches = [...new Set(matches)]; // unique
    matches = matches.filter(m => !m.includes('{') && !m.includes('}') && m.length > 5);
    console.log(matches.slice(0, 50).join('\n'));
}
