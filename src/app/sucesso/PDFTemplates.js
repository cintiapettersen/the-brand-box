
/**
 * PDFTemplates.js
 * Central de componentes e artes reutilizáveis para o exportador de PDF (Gabarito Técnico).
 */

export const PDFStyles = {
  montserrat: "font-family:'Montserrat',sans-serif;",
  myriad: "font-family:'Myriad Pro Condensed',sans-serif;",
};

/**
 * Gera a estrutura HTML da Logo para o PDF
 */
export const genPDFLogoHtml = ({ brand, color, localSlogan, crmLine, fontPt, lineH, letterSp, hideSlogan = false, crmSize = '3.5pt' }) => {
  const brandFont = `'${brand.editData?.fontFamily || 'Playfair Display'}', serif`;
  const isScript = brand.editData?.fontStyle === 'script';
  const marca = brand.name || brand.editData?.marca || 'Marca';
  const words = marca.split(' ').map(w => isScript ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase());
  
  let lines = [words.join(' ')];
  if (words.length >= 3 && marca.length > 15) {
     const m = Math.ceil(words.length / 2);
     lines = [words.slice(0, m).join(' '), words.slice(m).join(' ')];
  } else if (words.length === 2 && marca.length > 12) {
     lines = words;
  }

  const logoBase = `
    <div style="text-align:center; font-family:${brandFont}; font-weight:${brand.editData?.fontWeight || 700}; font-size:${fontPt}pt; color:${color}; line-height:${lineH}; letter-spacing:${letterSp}; white-space:nowrap;">
      ${lines.map(l => `<div style="font-family:inherit;font-weight:inherit;white-space:nowrap;">${l}</div>`).join('')}
    </div>
    ${(localSlogan && !hideSlogan) ? `<div style="${PDFStyles.montserrat} font-size:7.5pt; font-weight:700; letter-spacing:1.5pt; text-transform:uppercase; color:#666; margin-top:8pt; text-align:center;">${localSlogan}</div>` : ''}
  `;

  return `
    ${logoBase}
    ${crmLine ? `<div style="${PDFStyles.montserrat} font-size:${crmSize}; letter-spacing:1pt; text-transform:uppercase; color:#bbb; margin-top:4pt; text-align:center; opacity:0.8;">${crmLine}</div>` : ''}
  `;
};

/**
 * Arte do Pratinho Pedagógico Completa e Expandida (Pág 5)
 */
export const PratinhoArtSVG = ({ circleColor, plateColor, accentColor, titleColor }) => `
  <div style="width:125mm; height:140mm; position:relative; margin-top:5mm;">
    <img src="/pratinho.png" style="width:100%; height:auto; display:block; position:absolute; top:0; left:0; z-index:1;" />
    
    <svg viewBox="0 0 263.981 214.751" style="position:absolute; top:0.5%; left:0.5%; width:99%; height:99%; z-index:2;">
        <circle cx="133.332" cy="87.338" r="131" fill="${circleColor}" opacity="0.22" />
        <circle cx="133.032" cy="85.538" r="69" fill="${plateColor}" />
        <g fill="white" stroke="white" stroke-width="0.1">
           <path d="M5.392,81.373c2.255,0,4.511,0,6.766,0c6.11,0,12.221,0,18.331,0c9.031,0,18.062,0,27.093,0c11.057,0,22.114,0,33.171,0 c12.113,0,24.225,0,36.338,0c12.143,0,24.287,0,36.43,0c11.401,0,22.801,0,34.202,0c9.631,0,19.261,0,28.892,0 c6.899,0,13.797,0,20.696,0c3.265,0,6.541,0.077,9.806,0c0.14-0.003,0.281,0,0.421,0c0.924,0,1.273-1.166,0.156-1.166 c-2.255,0-4.511,0-6.766,0c-6.11,0-12.221,0-18.331,0c-9.031,0-18.062,0-27.093,0c-11.057,0-22.114,0-33.171,0 c-12.113,0-24.225,0-36.338,0c-12.143,0-24.287,0-36.43,0c-11.401,0-22.801,0-34.202,0c-9.631,0-19.261,0-28.892,0 c-6.899,0-13.797,0-20.696,0c-3.265,0-6.541-0.077-9.806,0c-0.14,0.003-0.281,0-0.421,0C4.623,80.206,4.274,81.373,5.392,81.373 L5.392,81.373z" />
           <line x1="133.032" y1="80.838" x2="127.003" y2="208.38" stroke="white" stroke-width="1.2" />
           <line x1="133.032" y1="80.838" x2="229.352" y2="162.055" stroke="white" stroke-width="1.2" />

           {/* CEREAL E TUBERCULO */}
           <path d="M122.385,136.043c0.232-0.162,0.681-0.307,1.236-0.26c1.287,0.111,2.141,1.549,1.928,4.045 c-0.204,2.385-1.312,3.917-2.727,3.797c-0.57-0.049-0.912-0.283-1.057-0.432l0.211-0.79c0.208,0.2,0.516,0.363,0.895,0.396 c1.07,0.091,1.881-0.99,2.051-2.988c0.16-1.865-0.382-3.117-1.493-3.211c-0.358-0.031-0.735,0.061-0.989,0.233L122.385,136.043z" />
           <path d="M118.349,138.561l1.759,0.285l0.44-2.721l-1.96-0.316l0.133-0.816l2.543,0.41l-1.221,7.545l-2.443-0.395l0.133-0.818 l1.859,0.301l0.386-2.384l-1.759-0.284L118.349,138.561z" />
           <path d="M115.804,141.862c-0.315,0.03-0.745-0.015-1.144-0.109c-0.615-0.147-0.967-0.428-1.145-0.912 c-0.146-0.386-0.15-0.923-0.013-1.496c0.235-0.982,0.761-1.544,1.294-1.695l0.009-0.035c-0.297-0.279-0.376-0.857-0.298-1.654 c0.104-1.072,0.17-1.813,0.146-2.123l0.595,0.143c0.023,0.227-0.03,0.89-0.127,1.846c-0.113,1.057,0.033,1.5,0.548,1.657 l0.543,0.13l0.771-3.221l0.576,0.137L115.804,141.862z" />
           <path d="M110.299,136.002l1.699,0.539l0.833-2.627l-1.894-0.599l0.25-0.79l2.457,0.779l-2.31,7.281l-2.36-0.746l0.25-0.789 l1.796,0.568l0.729-2.301l-1.697-0.538L110.299,136.002z" />
           <path d="M108.545,133.846l1.345-2.047l0.566,0.23l-4.313,6.49l-0.662-0.268l1.426-7.668l0.586,0.238l-0.451,2.412L108.545,133.846z" />
           <path d="M102.568,136.721l-0.53-0.266l3.047-6.1l-1.754-0.877l0.37-0.739l2.285,1.14L102.568,136.721z" />
           <path d="M97.264,128.668l1.502,0.961l1.487-2.322l-1.671-1.07l0.446-0.697l2.171,1.39l-4.129,6.438l-2.084-1.335l0.447-0.696 l1.586,1.015l1.305-2.033l-1.501-0.961L97.264,128.668z" />
           <path d="M90.055,126.651l1.053,0.918l-0.553,0.633l-2.559-2.232l0.551-0.633l1.057,0.921l4.469-5.137l0.451,0.394L90.055,126.651z" />
           <path d="M86.601,124.283l3.24-3.161c1.226-1.196,1.427-2.03,0.999-2.469c-0.477-0.488-1.316-0.276-2.525,0.903l-3.241,3.162 l-0.419-0.43l3.191-3.113c1.682-1.64,2.89-1.781,3.584-1.07c0.657,0.672,0.51,1.805-1.188,3.461l-3.223,3.145L86.601,124.283z" />
           
           {/* LEGUMINOSA */}
           <path d="M178.55,124.683l-0.394,0.445l-5.116-4.504l-1.302,1.476l-0.621-0.547l1.694-1.921L178.55,124.683z" />
           <path d="M170.984,126.46l1.277-1.257l-1.935-1.965l-1.423,1.402l-0.581-0.591l1.847-1.818l5.364,5.446 l-1.774,1.747l-0.58-0.59l1.35-1.329l-1.695-1.722l-1.276,1.258L170.984,126.46z" />
           <path d="M164.803,127.211c0.102-0.293,0.337-0.831,0.813-1.231c0.534-0.448,1.164-0.592,1.968-0.335 c0.711,0.231,1.554,0.854,2.317,1.767c1.458,1.749,1.806,3.633,0.622,4.627c-0.408,0.343-0.852,0.463-1.104,0.469l-0.407-0.709 c0.305-0.02,0.635-0.104,0.991-0.403c0.858-0.721,0.677-2.076-0.553-3.544c-1.245-1.485-2.519-1.909-3.341-1.219 c-0.299,0.25-0.445,0.491-0.477,0.666l1.462,1.745l0.718-0.603l0.509,0.608l-1.161,0.977L164.803,127.211z" />
           <path d="M167.246,134.13l-2.582-3.71c-0.977-1.405-1.768-1.739-2.272-1.388 c-0.561,0.39-0.494,1.253,0.471,2.639l2.582,3.711l-0.494,0.343l-2.544-3.655c-1.339-1.924-1.277-3.14-0.458-3.71 c0.775-0.538,1.871-0.209,3.223,1.735l2.569,3.691L167.246,134.13z" />

           {/* CARNE E OVO */}
           <path d="M182.32,93.41c-2.587-0.486-3.782-1.688-3.567-2.839c0.222-1.191,1.918-1.737,4.192-1.31 c2.386,0.449,3.782,1.633,3.557,2.837C186.271,93.33,184.549,93.829,182.32,93.41z M182.851,89.888 c-1.606-0.302-3.142-0.051-3.313,0.866c-0.172,0.923,1.146,1.711,2.854,2.032c1.493,0.281,3.143,0.106,3.324-0.863 C185.895,90.959,184.5,90.199,182.851,89.888z" />
           <path d="M177.657,94.731l7.764,0.615l-0.172,0.615l-3.818-0.326c-1.047-0.087-1.988-0.173-2.884-0.297 l-0.004,0.014c0.817,0.361,1.693,0.805,2.601,1.27l3.428,1.762l-0.17,0.609l-6.92-3.634L177.657,94.731z" />
           <path d="M178.768,102.783c-2.464-0.924-3.432-2.312-3.021-3.406c0.427-1.132,2.191-1.377,4.357-0.564 c2.271,0.854,3.439,2.257,3.009,3.402C182.673,103.385,180.891,103.58,178.768,102.783z M179.904,99.412 c-1.529-0.573-3.086-0.592-3.414,0.28c-0.33,0.878,0.832,1.88,2.456,2.489c1.423,0.534,3.076,0.646,3.424-0.275 C182.713,100.99,181.475,100.002,179.904,99.412z" />
           <path d="M190.774,94.711c-0.146-0.244-0.256-0.702-0.168-1.253c0.207-1.276,1.703-2.02,4.178-1.62 c2.361,0.381,3.808,1.599,3.582,3.002c-0.09,0.564-0.349,0.888-0.508,1.02 l-0.772-0.268c0.215-0.193,0.399-0.487,0.461-0.863 c0.17-1.061-0.848-1.949-2.828-2.269c-1.848-0.297-3.137,0.149-3.313,1.251c-0.057,0.355,0.008,0.738,0.16,1.004L190.774,94.711z" />
        </g>
    </svg>

    <!-- GRUPO FRUTAS (SOBREMESA) RECONSTRUÍDO (APENAS ÍCONES PARA EVITAR CLONE) -->
    <div style="position:absolute; bottom:2mm; left:12mm; display:flex; align-items:center; gap:2.5mm; z-index:5;">
        <svg viewBox="0 0 100 100" width="10mm" height="10mm">
           <path d="M28.02,68.041c-0.401,3.27-2.316,6.38-5.385,8.151c-4.498,2.597-10.252,1.383-12.849-2.714 c-2.595-4.097-1.055-9.458,3.442-12.056c3.07-1.771,6.671-1.84,9.66-0.554C22.684,65.86,22.459,71.053,28.02,68.041z" fill="#D6E04A" />
           <path d="M68.53,52.33c0.354,4.281,2.83,8.048,6.804,9.69c5.823,2.405,12.567-0.34,15.064-6.13 c2.496-5.789-0.104-12.441-5.927-14.846c-3.974-1.643-8.384-0.89-11.585,1.554C72.637,45.426,68.176,48.049,68.53,52.33z" fill="#F15A24" />
           <path d="M54.782,75.386c1.171,4.148,4.191,7.447,8.386,8.441c6.148,1.457,12.28-2.348,13.695-8.497 c1.414-6.149-2.314-12.335-8.463-13.792c-4.195-0.993-8.406,0.613-11.026,3.694C57.433,68.961,53.611,71.238,54.782,75.386z" fill="#F9ED32" />
        </svg>
    </div>

    <!-- Etiqueta de Dica -->
    <div style="position:absolute; bottom:-12mm; left:32mm; width:74mm; background:${accentColor}22; border-radius:1.5mm; padding:2mm 3.5mm; border:0.2mm solid ${accentColor}33; text-align:left; z-index:4;">
        <div style="${PDFStyles.myriad} font-size:7pt; font-weight:800; color:${titleColor}; text-transform:uppercase; letter-spacing:0.1pt; line-height:1.2;">
            DICA: Frutas cítricas após a refeição auxiliam na absorção de ferro.
        </div>
    </div>
  </div>
`;

/**
 * Gera o Rodapé Industrial (Dados de Contato) com LOGO OPCIONAL
 */
export const genPDFFooter = ({ clinicaNome, endereco, allPhones, email, site, instagram, accentColor, logoHtml = null, crmLine = null }) => `
  <div style="position:absolute; bottom:8mm; left:18mm; right:18mm; background:#fff; border:0.15mm solid ${accentColor}20; border-radius:1.5mm; padding:4.5mm; z-index:4; display:flex; align-items:center; justify-content:${logoHtml ? 'space-between' : 'center'}; box-shadow:0 0.5mm 2mm rgba(0,0,0,0.05); min-height:24mm;">
      
      ${logoHtml ? `
      <div style="display:flex; flex-direction:column; align-items:center; gap:2mm; width:35%; overflow:visible;">
          <div style="width:100%; text-align:center; transform:scale(1.4); transform-origin:center center; margin-bottom:-10mm;">
            ${logoHtml}
          </div>
          ${crmLine ? `<div style="${PDFStyles.montserrat} font-size:6.5pt; color:#999; text-transform:uppercase; letter-spacing:0.5px; margin-top:12mm; text-align:center;">${crmLine}</div>` : ''}
      </div>
      ` : ''}

      <div style="text-align:${logoHtml ? 'right' : 'center'}; flex-grow:1;">
          <div style="${PDFStyles.montserrat} font-size:7.5pt; font-weight:800; color:${accentColor}; margin-bottom:1mm;">${clinicaNome || 'Sua Clínica'}</div>
          <div style="${PDFStyles.montserrat} font-size:6pt; color:#666; font-weight:500; line-height:1.4;">${endereco || 'Endereço não informado'}</div>
          
          <div style="display:flex; align-items:center; justify-content:${logoHtml ? 'flex-end' : 'center'}; gap:1.5mm; margin:1mm 0;">
              <div style="width:3.5mm; height:3.5mm; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                  <div style="width:1.8mm; height:1.8mm; border:0.35mm solid #fff; border-radius:0.4mm;"></div>
              </div>
              <div style="${PDFStyles.montserrat} font-size:7pt; font-weight:800; color:#333;">${allPhones}</div>
          </div>

          <div style="${PDFStyles.montserrat} font-size:6pt; color:#888; font-weight:500; letter-spacing:0.2px;">
              ${[email, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}
          </div>
      </div>
  </div>
`;
