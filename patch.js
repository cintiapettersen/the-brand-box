const fs = require('fs');

let page = fs.readFileSync('src/app/page.js', 'utf8');
page = page.replace("lineHeight: 1.2, color: '#333', letterSpacing: extraSpacing }", "lineHeight: fontInfo?.lineHeight || 1.2, color: '#333', letterSpacing: extraSpacing, fontFeatureSettings: fontInfo?.featureSettings }");
page = page.replace("lineHeight: 1.2, fontFamily: editData.fontFamily", "lineHeight: editData.fontLineHeight || 1.2, fontFamily: editData.fontFamily");
page = page.replace("letterSpacing: editData.fontLetterSpacing || '1px', color: editData.corAtiva || '#333', lineHeight: editData.fontLineHeight || 1.2, fontFamily: editData.fontFamily ? `'${editData.fontFamily}', serif` : 'inherit' }", "letterSpacing: editData.fontLetterSpacing || '1px', color: editData.corAtiva || '#333', lineHeight: editData.fontLineHeight || 1.2, fontFamily: editData.fontFamily ? `'${editData.fontFamily}', serif` : 'inherit', fontFeatureSettings: editData.fontFeatureSettings }");
fs.writeFileSync('src/app/page.js', page);

let board = fs.readFileSync('src/components/BrandBoard.js', 'utf8');
board = board.replace("lineHeight: isScript ? 0.85 : 1.1,", "lineHeight: data.fontLineHeight || (isScript ? 0.85 : 1.1), fontFeatureSettings: data.fontFeatureSettings,");
board = board.replace("lineHeight: 1.15,", "lineHeight: data.fontLineHeight || 1.15, fontFeatureSettings: data.fontFeatureSettings,");
fs.writeFileSync('src/components/BrandBoard.js', board);
