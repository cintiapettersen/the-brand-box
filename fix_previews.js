const fs = require('fs');
const content = fs.readFileSync('src/app/[lang]/sucesso/page.js', 'utf-8');

const regex = /function ([A-Za-z]+Preview)\s*\(\{\s*([^}]*)\s*\}\)\s*\{/g;
let newContent = content;

let match;
while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const functionName = match[1];
    
    // Check if the next line already contains dictionary
    const startIndex = match.index + fullMatch.length;
    const bodyStart = content.substring(startIndex, startIndex + 100);
    
    if (!bodyStart.includes('const { dictionary } = useTranslation()')) {
        const replacement = `${fullMatch}\n  const { dictionary } = useTranslation();`;
        newContent = newContent.replace(fullMatch, replacement);
        console.log(`Added dictionary to ${functionName}`);
    }
}

fs.writeFileSync('src/app/[lang]/sucesso/page.js', newContent);
console.log('Done patching preview components!');
