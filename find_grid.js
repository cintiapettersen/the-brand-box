const fs = require('fs');
const content = fs.readFileSync('src/app/[lang]/sucesso/page.js', 'utf-8');
const regex = /\{item\}/g;
let idx = 0;
while ((match = regex.exec(content)) !== null) {
  console.log(content.substring(match.index - 50, match.index + 50));
}
