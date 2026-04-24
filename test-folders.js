const fs = require('fs');
const path = require('path');
const ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada";
const folders = fs.readdirSync(ORIGEM).filter(f => fs.statSync(path.join(ORIGEM, f)).isDirectory());
console.log(folders);
