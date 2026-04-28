import React from 'react';

export default function FolderDevPage3({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  const milestones = [
    { label: "Levanta os braços ao pedido", range: [0, 1] }, // 18-21m
    { label: "Aponta direção de objeto comum", range: [0, 2] }, // 18m-2y
    { label: "Reconhece o próprio nome", range: [1, 3] }, // 21m-3y
    { label: "Faz 'não' e acena 'tchau'", range: [2, 4] }, // 2y-4y
    { label: "Expressa primeiras palavras", range: [2, 4] }, // 2y-4y
    { label: "Repete sons e entonação", range: [3, 5] }, // 3y-5y
    { label: "Atende ao que lhe é pedido", range: [3, 6] }, // 3y-6y
    { label: "Reconhece sons e pessoas", range: [4, 6] }, // 4y-6y
    { label: "Tenta falar palavras ouvidas", range: [5, 6] }, // 5y-6y
    { label: "Imita sons que ouve", range: [5, 6] }, // 5y-6y
    { label: "Aponta com polegar e indicador", range: [6, 6] }, // 6y
  ];

  const headers = ["18m", "21m", "2a", "3a", "4a", "5a", "6a"];

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ fontSize: '8px', fontWeight: 900, color: mainColor, marginBottom: '6px', textAlign: 'center', textTransform: 'uppercase' }}>
        Marcos do Desenvolvimento (18m - 6 anos)
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: `0.3px solid ${mainColor}20`, borderRadius: '3px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', background: `${mainColor}10`, borderBottom: `0.3px solid ${mainColor}20` }}>
          <div style={{ width: '45%', padding: '4px', fontSize: '5px', fontWeight: 700, color: mainColor }}>HABILIDADES</div>
          <div style={{ flex: 1, display: 'flex' }}>
            {headers.map((h, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '4.5px', fontWeight: 800, color: mainColor, padding: '4px 0', borderLeft: `0.1px solid ${mainColor}10` }}>
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {milestones.map((ms, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: `0.1px solid ${mainColor}10`, background: i % 2 === 0 ? '#fff' : `${mainColor}05` }}>
            <div style={{ width: '45%', padding: '3.5px 4px', fontSize: '4.2px', color: '#444', fontWeight: 500, lineHeight: 1 }}>{ms.label}</div>
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
              {headers.map((_, idx) => (
                <div key={idx} style={{ flex: 1, borderLeft: `0.1px solid ${mainColor}05`, height: '100%' }}>
                  {idx >= ms.range[0] && idx <= ms.range[1] && (
                    <div style={{ margin: '1px', height: 'calc(100% - 2px)', background: mainColor, borderRadius: '1px', opacity: 0.8 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '5px', textAlign: 'right', fontSize: '3.5px', color: '#aaa', fontWeight: 600 }}>IDADE EM MESES/ANOS</div>
    </div>
  );
}
