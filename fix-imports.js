const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(search)) {
    const newContent = content.split(search).join(replacement);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir, depth) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, depth + 1);
    } else if (file.endsWith('.js')) {
      if (depth === 1) {
        // page.js in [lang]
        replaceInFile(fullPath, "from '../components", "from '../../components");
        replaceInFile(fullPath, "from '../lib", "from '../../lib");
      } else if (depth === 2) {
        // files in [lang]/sucesso and [lang]/atelier
        replaceInFile(fullPath, "from '../../components", "from '../../../components");
        replaceInFile(fullPath, "from '../../lib", "from '../../../lib");
        replaceInFile(fullPath, "from '../../utils", "from '../../../utils");
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src/app/[lang]'), 1);
