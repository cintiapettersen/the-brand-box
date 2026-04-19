import React from 'react';

const BrandTemplateSVG = ({ data, color, side = 'frente', hideBackground = false, iconPath = null }) => {
  const { marca, tagline, whatsapp, instagram } = data;
  const activeColor = color || '#d22f5a';
  const brandFont = data.fontFamily || 'Playfair Display';

  // O viewBox original é 0 0 1502.53 1082.02
  // Frente e Verso estão em posições diferentes no canvas do Illustrator
  
  const getTransform = () => {
    if (side === 'frente') {
      // Posição do Card Rosa (Originalmente em x=189, y=88)
      // Se for apenas o logo, podemos focar mais
      return hideBackground ? '180 300 540 320' : '180 80 540 820';
    } else {
      // Posição do Card com Borda (Originalmente em x=826, y=110)
      // Se for apenas a submarca, focamos no círculo (x=1076, y=318)
      return hideBackground ? '940 180 270 280' : '810 100 520 800';
    }
  };

  return (
    <svg 
      viewBox={getTransform()} 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ width: '100%', height: '100%', borderRadius: side === 'frente' ? '20px' : '15px' }}
    >
      <defs>
        <style>{`
          .st1 { fill: ${activeColor}; font-family: '${brandFont}', 'Playfair Display', serif; font-weight: bold; }
          .st2 { fill: #010101; font-family: 'Montserrat', sans-serif; letter-spacing: 0.1em; }
          .st3 { fill: ${activeColor}; opacity: 0.15; }
          .st4 { fill: #010101; font-family: '${brandFont}', 'Playfair Display', serif; font-weight: 800; text-transform: uppercase; }
          .st5 { fill: #f2f2f2; stroke: ${activeColor}; stroke-width: 25px; }
          .st6 { fill: none; stroke: ${activeColor}; stroke-width: 45px; }
          .st7 { fill: ${activeColor}; }
          .st-selo-bg { fill: ${activeColor}; }
          .st-selo-text { fill: #fff; font-family: '${brandFont}', 'Playfair Display', serif; font-size: 32px; font-weight: bold; }
          .st-contact { fill: #333; font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 600; }
        `}</style>
        <path id="circlePath" d="M1165.99,316.18c0,50.61-40.39,91.64-90.21,91.64s-90.21-41.03-90.21-91.64,40.39-91.64,90.21-91.64,90.21,41.03,90.21,91.64Z"/>
        <filter id="icon-white" x="0%" y="0%" width="100%" height="100%">
          <feColorMatrix type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                   -0.299 -0.587 -0.114 0 1"/>
        </filter>
      </defs>

      {/* LADO A: FRENTE (Fundo Colorido + Logo + Tagline) */}
      {side === 'frente' && (
        <g>
          {!hideBackground && <rect className="st7" x="189.88" y="88.76" width="514.77" height="749.5" rx="42.47" ry="42.47"/>}
          
          {/* LOGO INTELIGENTE (Split de palavras e escala dinâmica) */}
          {(() => {
            const words = (marca || 'SUA MARCA').toUpperCase().split(' ');
            const fontSize = words.length > 1 ? (marca.length > 15 ? '45px' : '55px') : '75px';
            const lineHeight = 1.1;
            const startY = 440 - ((words.length - 1) * 30); // Centraliza o bloco verticalmente

            return (
              <text 
                x="447" y={startY} 
                textAnchor="middle" 
                className="st4" 
                style={{ fontSize, fill: hideBackground ? activeColor : '#000', fontFamily: `'${brandFont}', 'Playfair Display', serif`, fontWeight: 800 }}
              >
                {words.map((word, idx) => (
                  <tspan key={idx} x="447" dy={idx === 0 ? 0 : `${lineHeight}em`}>
                    {word}
                  </tspan>
                ))}
              </text>
            );
          })()}

          {/* TAGLINE DINAMICA (colada logo abaixo do logo) */}
          {(() => {
            const words = (marca || 'SUA MARCA').toUpperCase().split(' ');
            const fontSize = words.length > 1 ? (marca.length > 15 ? 45 : 55) : 75;
            const lineHeightPx = fontSize * 1.1;
            const logoStartY = 440 - ((words.length - 1) * 30);
            const taglineY = logoStartY + ((words.length - 1) * lineHeightPx) + 35;
            return (
              <text
                x="447" y={taglineY}
                textAnchor="middle"
                className="st2"
                style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px', fill: hideBackground ? '#666' : '#010101' }}
              >
                {tagline || 'Identidade Visual'}
              </text>
            );
          })()}
        </g>
      )}

      {/* LADO B: VERSO (Moldura + Selo + Contatos) */}
      {side === 'verso' && (
        <g>
          {!hideBackground && (
            <>
              <rect className="st5" x="826.14" y="110.71" width="490.24" height="713.79" rx="21.89" ry="21.89"/>
              <rect className="st6" x="826.14" y="110.71" width="490.24" height="713.79" rx="21.89" ry="21.89"/>
            </>
          )}

          {/* SELO CIRCULAR DINAMICO — fundo orgânico */}
          <g transform="translate(1076.6, 318.42)">
            <path className="st-selo-bg" d="M 5,-129 C 74,-135 135,-72 130,5 C 126,72 72,133 -3,129 C -72,126 -132,68 -128,-3 C -124,-70 -68,-132 5,-129 Z" />
            {iconPath && (
              <image
                href={iconPath}
                x={-65} y={-65}
                width={130} height={130}
                filter="url(#icon-white)"
              />
            )}
          </g>
          {(() => {
            const circumference = 2 * Math.PI * 91.64;
            const toTitleCase = (str) => str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            const nameWithSep = toTitleCase(marca || 'Sua Marca') + '  •  ';
            const reps = Math.max(2, Math.ceil(circumference / (nameWithSep.length * 24)));
            const fullText = nameWithSep.repeat(reps);
            return (
              <text letterSpacing="4">
                <textPath xlinkHref="#circlePath" startOffset="0%" textLength={circumference} lengthAdjust="spacingAndGlyphs">
                  <tspan className="st-selo-text">{fullText}</tspan>
                </textPath>
              </text>
            );
          })()}

          {/* CONTATOS DINAMICOS */}
          {!hideBackground && (
            <g transform="translate(870, 720)">
               <text className="st-contact" y="0">{whatsapp || '(11) 99999-9999'}</text>
               <text className="st-contact" y="45">@{instagram || 'seustudio'}</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

export default BrandTemplateSVG;
