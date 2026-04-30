import React from 'react';

const StormIcon = () => (
  <svg viewBox="0 0 24 24" width="6" height="6" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.433-1.92-4.417-4.33-4.496C17.065 6.096 13.84 3 10 3 6.476 3 3.553 5.584 3.08 8.955A5.5 5.5 0 0 0 3 19.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14v4M12 15v4M16 14v4" strokeLinecap="round"/>
  </svg>
);

const SunCloudIcon = () => (
  <svg viewBox="0 0 24 24" width="6" height="6" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M8 8a4 4 0 0 1 8 0" strokeLinecap="round"/>
    <path d="M12 2v2M19.07 4.93l-1.41 1.41M22 12h-2" strokeLinecap="round"/>
    <path d="M16 18c1.657 0 3-1.343 3-3s-1.343-3-3-3c-.113 0-.224.006-.333.018C15.025 10.25 13.626 9 12 9c-1.85 0-3.376 1.306-3.618 3.033A3.498 3.498 0 0 0 5.5 15c0 1.933 1.567 3.5 3.5 3.5h7z" strokeLinecap="round" strokeLinejoin="round" fill="#fff"/>
  </svg>
);

export default function FolderDevPage4({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';
  const tertiaryColor = palette[2] || '#E6C673';

  const redWeeks = [5, 8, 9, 12, 15, 16, 17, 18, 19, 23, 24, 25, 26, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 51, 52, 53, 54, 60, 61, 62, 63, 64, 71, 72, 73, 74, 75];
  
  const icons = {
    5: { type: 'storm', label: 'salto 1' },
    6: { type: 'sun' },
    8: { type: 'storm', label: 'salto 2' },
    10: { type: 'sun' },
    12: { type: 'storm', label: 'salto 3' },
    13: { type: 'sun' },
    15: { type: 'storm', label: 'salto 4' },
    20: { type: 'sun' },
    23: { type: 'storm', label: 'salto 5' },
    27: { type: 'sun' },
    34: { type: 'storm', label: 'salto 6' },
    39: { type: 'sun' },
    41: { type: 'storm', label: 'salto 7' },
    48: { type: 'sun' },
    51: { type: 'storm', label: 'salto 8' },
    55: { type: 'sun' },
    60: { type: 'storm', label: 'salto 9' },
    62: { type: 'sun' },
    71: { type: 'storm', label: 'salto 10' },
    76: { type: 'sun' },
  };

  const block1Rows = [
    [0, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39, 40, 41],
  ];

  const block2Rows = [
    [42, 43, 44, 45, 46, 47, 48],
    [49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69],
    [70, 71, 72, 73, 74, 75, 76],
    [77, 78, 79, 80, 81, 82, 83],
  ];

  const renderTimelineBlock = (rows) => (
    <div style={{ flex: 1, border: `2px solid ${tertiaryColor}60`, borderRadius: '8px', padding: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fff' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '1px' }}>
          {row.map(w => (
            <div key={w} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', paddingTop: '6px' }}>
               {icons[w] && (
                 <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   {icons[w].type === 'storm' ? <StormIcon /> : <SunCloudIcon />}
                   {icons[w].label && <span style={{ fontSize: '1.8px', fontWeight: 800, color: '#555', whiteSpace: 'nowrap' }}>{icons[w].label}</span>}
                 </div>
               )}
               <div style={{ height: '3px', width: '100%', background: redWeeks.includes(w) ? '#E67E7E' : '#E6C673' }} />
               <div style={{ fontSize: '2.8px', marginTop: '1px', fontWeight: 700, color: '#333', textAlign: 'center' }}>{w}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', padding: '6px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: "'Montserrat', sans-serif", background: `${mainColor}08` }}>
      
      {/* Top Half */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
        
        {/* Left Col */}
        <div style={{ flex: '0 0 53%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ alignSelf: 'flex-start', background: '#E67E7E', color: '#fff', fontSize: '4.8px', fontWeight: 900, fontStyle: 'italic', padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase', boxShadow: '1px 1px 0 rgba(0,0,0,0.1)' }}>
            SALTO DE DESENVOLVIMENTO:
          </div>
          <div style={{ fontSize: '3.3px', color: '#444', lineHeight: 1.25, textAlign: 'justify', fontWeight: 500 }}>
            Quando a criança aprende algo novo, adquire alguma habilidade nova ela quer treinar aquela habilidade exaustivamente, até mesmo enquanto deveria estar dormindo. São os chamados saltos de desenvolvimento. Ao longo do tempo, essa habilidade nova vai dando prazer para a criança e a ansiedade vai indo embora. Os saltos têm datas para ocorrer, mas, como tudo na infância, isso varia de bebê para bebê. Eles se tornam mais importantes no 3-4º mês e no 9º mês. Eles podem durar dias ou persistirem até duas semanas em média.
          </div>
        </div>

        {/* Right Col */}
        <div style={{ flex: '1', background: secondaryColor, borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: tertiaryColor, padding: '2.5px', textAlign: 'center', fontWeight: 800, fontSize: '3px', color: '#222' }}>
            Nesse período, é esperado<br/>que o bebê:
          </div>
          <div style={{ padding: '3.5px', fontSize: '2.8px', color: '#222', display: 'flex', flexDirection: 'column', gap: '2px', lineHeight: 1.15, fontWeight: 500 }}>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Procure ficar mais perto da MÃE, ou seja sua base de tudo, pois é o que ele conhece melhor;</span></div>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Fique mais carente, precisando de colo, segurança e orientação maternal de perto;</span></div>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Coma mal e durma pior;</span></div>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Pode pedir para mamar com mais frequência;</span></div>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Comece a fazer coisas que não fazia antes da crise tal como rir, sentar, engatinhar, interagir, ....</span></div>
            <div style={{ display: 'flex', gap: '2px' }}><span style={{fontWeight:800}}>◊</span><span>Demonstre felicidade com o final da crise e superação do desenvolvimento adquirida.</span></div>
          </div>
        </div>

      </div>

      {/* Bottom Half: Timelines */}
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {renderTimelineBlock(block1Rows)}
        {renderTimelineBlock(block2Rows)}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '6px', height: '3px', background: '#E67E7E' }} />
          <span style={{ fontSize: '2.8px', fontWeight: 700, color: '#444' }}>Período de Salto</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '6px', height: '3px', background: '#E6C673' }} />
          <span style={{ fontSize: '2.8px', fontWeight: 700, color: '#444' }}>Período Calmo</span>
        </div>
      </div>

    </div>
  );
}
