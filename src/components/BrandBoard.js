import React from 'react';
import BrandTemplateSVG from './BrandTemplateSVG';

// Dicionário de cores afetivas: [R, G, B, NomeBonito]
const COLOR_PALETTE = [
  [255, 198, 37,  'Sol de Verão'],
  [255, 223, 186, 'Pêssego Suave'],
  [255, 182, 193, 'Rosa Algodão'],
  [255, 105, 120, 'Framboesa'],
  [220, 20,  60,  'Carmim Intenso'],
  [255, 0,   100, 'Dose de Amor'],
  [180, 0,   60,  'Amora Selvagem'],
  [255, 140, 0,   'Âmbar Quente'],
  [230, 100, 30,  'Terracota'],
  [210, 140, 100, 'Adobe Rosado'],
  [188, 143, 143, 'Rosewood Suave'],
  [205, 170, 125, 'Linho Dourado'],
  [245, 222, 179, 'Baunilha'],
  [250, 240, 227, 'Creme Delicado'],
  [144, 238, 144, 'Verde Menta'],
  [102, 204, 102, 'Musgo Vivo'],
  [60,  140, 60,  'Folha Densa'],
  [34,  100, 34,  'Floresta'],
  [143, 188, 143, 'Salvia'],
  [176, 224, 230, 'Névoa Matinal'],
  [135, 206, 250, 'Céu Aberto'],
  [100, 180, 230, 'Azul Serenidade'],
  [70,  130, 180, 'Azul Aço'],
  [25,  90,  180, 'Índigo Profundo'],
  [100, 149, 237, 'Azul Lavanda'],
  [60,  100, 200, 'Safira'],
  [0,   70,  140, 'Azul Marinho'],
  [200, 162, 200, 'Lavanda Rosa'],
  [186, 130, 200, 'Malva Seda'],
  [148, 103, 189, 'Ametista'],
  [102, 51,  153, 'Violeta Real'],
  [80,  0,   120, 'Roxo Profundo'],
  [255, 228, 225, 'Misty Rose'],
  [255, 192, 203, 'Blush Seda'],
  [240, 200, 220, 'Quartzo Rosa'],
  [220, 180, 200, 'Rosé Antigo'],
  [190, 150, 170, 'Borgonha Suave'],
  [245, 245, 245, 'Branco Algodão'],
  [220, 220, 220, 'Prata Suave'],
  [180, 180, 180, 'Cinza Névoa'],
  [120, 120, 120, 'Granito'],
  [60,  60,  60,  'Carvão'],
  [30,  30,  30,  'Noite Profunda'],
  [255, 250, 200, 'Limão Docinho'],
  [200, 230, 170, 'Pistache'],
  [170, 220, 200, 'Água Turquesa'],
  [64,  190, 172, 'Verde Jade'],
  [0,   150, 136, 'Esmeralda Serena'],
  [255, 87,  51,  'Coral Vivo'],
  [255, 160, 122, 'Salmão'],
  [210, 105, 30,  'Canela'],
];

const getColorName = (hex) => {
  if (!hex || hex.length < 7) return 'Cor Especial';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  let minDist = Infinity;
  let bestName = 'Tom Especial';
  for (const [cr, cg, cb, name] of COLOR_PALETTE) {
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (dist < minDist) {
      minDist = dist;
      bestName = name;
    }
  }
  return bestName;
};

const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '25px 0 15px 0' }}>
    <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
    <span style={{ margin: '0 15px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
      {title}
    </span>
    <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
  </div>
);

const BrandBoard = ({ data, palette, color, seloColor, seloTextColor, patternImage, iconPath, customLogoSrc }) => {
  const { marca, tagline } = data;
  const activeColor = color || '#d22f5a';

  return (
    <div id="brand-board-canvas" style={{ 
      width: '595px', // Proporção A4
      height: '842px',
      background: '#fff',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      position: 'relative',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Margem decorativa opcional */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px solid #efefef', pointerEvents: 'none' }}></div>

      {/* LOGO PRINCIPAL */}
      <SectionHeader title="Logomarca Principal" />
      {customLogoSrc ? (
        <div style={{ height: '180px', width: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={customLogoSrc} alt={marca} style={{ maxHeight: '140px', maxWidth: '300px', objectFit: 'contain' }} />
        </div>
      ) : (() => {
        const isScript = data.fontStyle === 'script';
        const rawWords = (marca || 'SUA MARCA').split(' ');
        // Script: Title Case manual. Outras: uppercase
        const formatWord = (w) => isScript 
          ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() 
          : w.toUpperCase();
        const words = rawWords.map(formatWord);
        // Tamanho adaptável
        let baseFontSize = 2.4;
        if (words.length === 2) baseFontSize = 2.2;
        if (words.length >= 3) baseFontSize = (marca || '').length > 20 ? 1.3 : 1.6;
        if (marca && marca.length > 15 && words.length <= 2) baseFontSize = 1.8;
        // Aplicar sizeBoost para fontes que renderizam menor (ex: Vellary)
        const sizeBoost = data.fontSizeBoost || 1;
        const fontSize = `${(baseFontSize * sizeBoost).toFixed(1)}rem`;
        // Slogan: 22% do nome, mínimo 0.55rem pois a Placa exibe em escala grande
        const logoSizeRem = baseFontSize * sizeBoost;
        const taglineSizeRem = Math.min(Math.max(logoSizeRem * 0.22, 0.55), 0.7);
        const taglineLetterSpacing = `${Math.min(3, taglineSizeRem * 16 * 0.3).toFixed(1)}px`;

        return (
          <div style={{ height: '180px', width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {words.length === 2 ? (
              <div style={{ textAlign: 'center' }}>
                {words.map((word, i) => (
                  <h1 key={i} style={{
                    fontFamily: `'${data.fontFamily || 'Playfair Display'}', serif`,
                    fontWeight: data.fontWeight || 700,
                    fontSize,
                    color: activeColor,
                    lineHeight: data.fontLineHeight || (isScript ? 0.85 : 1.1),
                    letterSpacing: data.fontLetterSpacing || (isScript ? '0px' : '1px'),
                  }}>
                    {data.fontFeatureSettings && i === 0 ? (
                      <><span style={{ fontFeatureSettings: data.fontFeatureSettings, fontFamily: 'inherit', fontWeight: 'inherit' }}>{word[0]}</span><span style={{ fontFeatureSettings: 'normal', fontFamily: 'inherit', fontWeight: 'inherit' }}>{word.slice(1)}</span></>
                    ) : word}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 style={{
                fontFamily: `'${data.fontFamily || 'Playfair Display'}', serif`,
                fontWeight: data.fontWeight || 700,
                fontSize,
                color: activeColor,
                textAlign: 'center',
                lineHeight: data.fontLineHeight || 1.15,
                letterSpacing: data.fontLetterSpacing || (isScript ? '0px' : '1px'),
              }}>
                {data.fontFeatureSettings ? (
                  <><span style={{ fontFeatureSettings: data.fontFeatureSettings, fontFamily: 'inherit', fontWeight: 'inherit' }}>{words.join(' ')[0]}</span><span style={{ fontFeatureSettings: 'normal', fontFamily: 'inherit', fontWeight: 'inherit' }}>{words.join(' ').slice(1)}</span></>
                ) : words.join(' ')}
              </h1>
            )}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: `${taglineSizeRem.toFixed(2)}rem`,
              letterSpacing: taglineLetterSpacing,
              textTransform: 'uppercase',
              color: '#666',
              marginTop: '8px',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              {tagline || 'Identidade Visual'}
            </p>
          </div>
        );
      })()}

      {/* PALETA DE CORES */}
      <SectionHeader title="Paleta de Cores" />
      <div style={{ display: 'flex', width: '100%', gap: '5px', height: '100px' }}>
         {(palette && palette.length > 0 ? palette : ['#eee','#ddd','#ccc','#bbb','#aaa']).map((hex, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <div style={{ backgroundColor: hex, flex: 1, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{hex}</span>
               </div>
               <p style={{ fontSize: '0.5rem', textAlign: 'center', marginTop: '5px', fontWeight: 600 }}>{getColorName(hex)}</p>
            </div>
         ))}
      </div>

      {/* TIPOGRAFIA */}
      <SectionHeader title="Tipografia" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', marginTop: '10px' }}>
         <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
            <h5 style={{ fontFamily: `'${data.fontFamily || 'Playfair Display'}', serif`, fontSize: `${(1.4 * (data.fontSizeBoost || 1)).toFixed(1)}rem`, marginBottom: '10px', fontWeight: data.fontWeight || 400 }}>{data.fontFamily || 'Playfair Display'}</h5>
            <p style={{ fontFamily: `'${data.fontFamily || 'Playfair Display'}', serif`, fontSize: `${(0.8 * (data.fontSizeBoost || 1)).toFixed(1)}rem`, lineHeight: '1.4', color: '#666', fontWeight: data.fontWeight || 400 }}>
               Aa Bb Cc Dd<br/>Ee Ff Gg Hh<br/>1234567890
            </p>
         </div>
         <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px', fontFamily: "'Montserrat', sans-serif" }}>Montserrat</h5>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: '#666', fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }}>
               Aa Bb Cc Dd<br/>Ee Ff Gg Hh<br/>1234567890
            </p>
         </div>
      </div>

      {/* SUBMARCA E ESTAMPA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', flex: 1, marginTop: '20px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionHeader title="Submarca" />
            <div style={{ width: '130px', height: '130px' }}>
               <BrandTemplateSVG
                 data={data.fontStyle === 'script' ? { ...data, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' } : data}
                 color={seloColor || color}
                 textColor={seloTextColor || '#ffffff'}
                 side="verso"
                 hideBackground={true}
                 iconPath={iconPath}
               />
            </div>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionHeader title="Estampa" />
            {patternImage ? (
              <div style={{ width: '130px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                <img src={patternImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '130px', height: '130px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.5rem', color: '#999', textAlign: 'center', padding: '10px' }}>ESTAMPA EXCLUSIVA</span>
              </div>
            )}
         </div>
      </div>

      {/* RODAPÉ */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
         <p style={{ fontSize: '0.45rem', letterSpacing: '4px', opacity: 0.4 }}>THE BRAND BOX • EXPLORE YOUR IDENTITY</p>
      </div>
    </div>
  );
};

export default BrandBoard;
