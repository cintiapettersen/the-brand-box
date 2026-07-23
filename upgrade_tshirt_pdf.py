with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_tshirt_block = '''    if (item === 'T-Shirt') {
      const solidColor = borderColor || accentColor;
      const _ffT = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfT = LOCAL_FONT_FACES[_ffT];
      const fiT = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfT ? `<style>${_lfT}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffT)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const hasCustomLogoT = !!itemEditData?.customLogoSrc;
      const seloSizeT = 65; // mm (tamanho exato do mockup para o peito)
      const seloDataT = itemEditData?.fontStyle === 'script'
        ? { ...itemEditData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' }
        : { ...itemEditData };
      
      const logoHtmlT = hasCustomLogoT
        ? ReactDOMServer.renderToString(
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.92)', padding: '2mm 3mm', borderRadius: '4px' }}>
              <img src={itemEditData.customLogoSrc} alt="logo" style={{ maxWidth: `${seloSizeT * 1.6}mm`, maxHeight: `${seloSizeT * 1.2}mm`, objectFit: 'contain' }} />
            </div>
          )
        : ReactDOMServer.renderToString(
            <div style={{ width: `${seloSizeT}mm`, height: `${seloSizeT}mm`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrandTemplateSVG data={seloDataT} color={submarcaColor || solidColor} textColor={submarcaTextColor || '#ffffff'} side="verso" hideBackground={true} iconPath={iconPath || null} />
            </div>
          );
          
      // Na caneca scale=150 significa 0.15mm (muito denso). Na camiseta scale=150 significa ~1.2mm
      const bgStyleT = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${getPatternTileMm(patternScale).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${solidColor};`;
      
      const TW = 300, TH = 300; // 30x30 cm azulejo
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Estampa Camiseta - ${marca}</title>${fiT}
<style>
* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
@page {  size:${TW }mm ${TH}mm; margin:0; }
.page { width:${TW}mm; height:${TH}mm; position:relative; overflow:hidden; page-break-after:always; }
</style></head><body>
<!-- Pagina 1: Módulo de Repetição / Cor Sólida -->
<div class="page" style="${bgStyleT}"></div>
<!-- Pagina 2: Selo do Peito -->
<div class="page" style="background:#fff;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
    ${logoHtmlT}
  </div>
  <div style="position:absolute;bottom:10mm;left:0;right:0;text-align:center;font-family:Montserrat,sans-serif;font-size:10pt;color:#888;font-weight:700;">
    SELO DO PEITO: ${seloSizeT} x ${seloSizeT} mm (Tamanho Real)
  </div>
</div>
</body></html>`;
      const exT = document.getElementById('_gabarito_camiseta'); if (exT) exT.remove();
      return exportHTMLAsPDF(html, item, mode);
    }'''

new_tshirt_block = '''    if (item === 'T-Shirt') {
      const solidColor = borderColor || accentColor;
      const _ffT = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfT = LOCAL_FONT_FACES[_ffT];
      const fiT = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfT ? `<style>${_lfT}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffT)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const hasCustomLogoT = !!itemEditData?.customLogoSrc;
      const seloSizeT = 65; // mm — tamanho do selo do peito
      const seloDataT = itemEditData?.fontStyle === 'script'
        ? { ...itemEditData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' }
        : { ...itemEditData };

      const logoHtmlT = hasCustomLogoT
        ? ReactDOMServer.renderToString(
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.92)', padding: '2mm 3mm', borderRadius: '4px' }}>
              <img src={itemEditData.customLogoSrc} alt="logo" style={{ maxWidth: `${seloSizeT * 1.6}mm`, maxHeight: `${seloSizeT * 1.2}mm`, objectFit: 'contain' }} />
            </div>
          )
        : ReactDOMServer.renderToString(
            <div style={{ width: `${seloSizeT}mm`, height: `${seloSizeT}mm`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrandTemplateSVG data={seloDataT} color={submarcaColor || solidColor} textColor={submarcaTextColor || '#ffffff'} side="verso" hideBackground={true} iconPath={iconPath || null} />
            </div>
          );

      // Tile size = exact pattern repeat unit (page size matches tile so gráfica sees a clean module)
      const tileMm = Math.round(getPatternTileMm(patternScale));
      // Full shirt layout: standard adult all-over print area ~70x80cm
      const SHIRT_W = 700, SHIRT_H = 800; // mm

      const bgStyleT = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${tileMm}mm;background-repeat:repeat;`
        : `background:${solidColor};`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Estampa Camiseta - ${marca}</title>${fiT}
<style>
* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
@page tile { size:${tileMm}mm ${tileMm}mm; margin:0; }
@page shirt { size:${SHIRT_W}mm ${SHIRT_H}mm; margin:0; }
@page selo { size:200mm 200mm; margin:0; }
.tile-page  { page: tile;  width:${tileMm}mm; height:${tileMm}mm; position:relative; overflow:hidden; page-break-after:always; }
.shirt-page { page: shirt; width:${SHIRT_W}mm; height:${SHIRT_H}mm; position:relative; overflow:hidden; page-break-after:always; }
.selo-page  { page: selo;  width:200mm; height:200mm; position:relative; overflow:hidden; }
</style></head><body>

<!-- PAG 1: MODULO DE REPETICAO — tile exato que a graffica deve repetir no tecido -->
<div class="tile-page" style="${bgStyleT}">
  <div style="position:absolute;bottom:3mm;right:4mm;font-family:Montserrat,sans-serif;font-size:6pt;color:rgba(0,0,0,0.3);font-weight:700;letter-spacing:0.5px;">
    MODULO ${tileMm}x${tileMm}mm — REPETIR EM GRADE
  </div>
</div>

<!-- PAG 2: LAYOUT COMPLETO DA CAMISETA (70x80cm) -->
<div class="shirt-page" style="${bgStyleT}">
  <!-- Selo do peito -->
  <div style="position:absolute;top:180mm;left:50%;transform:translateX(-50%);width:${seloSizeT}mm;height:${seloSizeT}mm;display:flex;align-items:center;justify-content:center;">
    ${logoHtmlT}
  </div>
  <div style="position:absolute;bottom:8mm;left:0;right:0;text-align:center;font-family:Montserrat,sans-serif;font-size:7pt;color:rgba(0,0,0,0.35);font-weight:700;">
    LAYOUT CAMISETA ADULTO — ${SHIRT_W/10}x${SHIRT_H/10}cm | ESTAMPA: ${marca}
  </div>
</div>

<!-- PAG 3: SELO DO PEITO ISOLADO (tamanho real) -->
<div class="selo-page" style="background:#fff;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
    ${logoHtmlT}
  </div>
  <div style="position:absolute;bottom:10mm;left:0;right:0;text-align:center;font-family:Montserrat,sans-serif;font-size:9pt;color:#888;font-weight:700;">
    SELO DO PEITO: ${seloSizeT}x${seloSizeT}mm (TAMANHO REAL)
  </div>
</div>

</body></html>`;
      const exT = document.getElementById('_gabarito_camiseta'); if (exT) exT.remove();
      return exportHTMLAsPDF(html, item, mode, SHIRT_W, SHIRT_H);
    }'''

if old_tshirt_block in content:
    content = content.replace(old_tshirt_block, new_tshirt_block, 1)
    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: T-Shirt PDF upgraded to 3-page professional layout')
else:
    print('ERROR: could not find T-Shirt block')
    idx = content.find("if (item === 'T-Shirt')")
    print(f'Found T-Shirt if at: {idx}')
    if idx >= 0:
        print(repr(content[idx:idx+200]))
