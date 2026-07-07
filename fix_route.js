const fs = require('fs');
const file = 'src/app/api/send-email/route.js';
let content = fs.readFileSync(file, 'utf8');

// Replace \` with `
content = content.split('\\`').join('`');
// Replace \$ with $
content = content.split('\\$').join('$');

fs.writeFileSync(file, content);
console.log('Fixed escape characters in route.js');
