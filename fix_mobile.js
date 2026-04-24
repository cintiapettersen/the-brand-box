const fs = require('fs');
let code = fs.readFileSync('src/app/page.js', 'utf8');

// 1. Substituir os `justifyContent: 'center'` e `padding: '3rem'` espalhados pelos passos para usar a classe `wizard-step`.
code = code.replace(/style=\{\{\s*position: 'absolute',\s*width: '100%',\s*height: '100%',\s*display: 'flex',\s*flexDirection: 'column',\s*justifyContent: 'center',\s*alignItems: 'center',\s*textAlign: 'center',\s*background: '([^']+)',\s*borderRadius: '24px',\s*padding: '3rem'(.*?)\s*\}\}/g, 
"className=\"wizard-step\" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '$1', borderRadius: '24px'$2 }}");

// 2. Substituir a Placa da Marca usando a nova classe `brand-board-wrapper`
code = code.replace(/<div style=\{\{\s*flex: 1,\s*overflowY: 'auto',\s*display: 'flex',\s*justifyContent: 'center',\s*alignItems: 'flex-start',\s*padding: '20px'\s*\}\}>\s*<div ref=\{brandBoardRef\} style=\{\{\s*transform: 'scale\(clamp\(0\.40, calc\(100vw \/ 950\), 0\.82\)\)',\s*transformOrigin: 'top center',\s*marginBottom: '-50%'\s*\}\}>/g,
'<div className="brand-board-container" style={{ flex: 1, overflowY: \'auto\', display: \'flex\', justifyContent: \'center\', alignItems: \'flex-start\', padding: \'20px\' }}>\n                <div ref={brandBoardRef} className="brand-board-wrapper">');

fs.writeFileSync('src/app/page.js', code);
console.log('Mobile fixes aplicados com sucesso em page.js!');
