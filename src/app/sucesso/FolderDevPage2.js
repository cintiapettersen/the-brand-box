import React from 'react';

export default function FolderDevPage2({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  const milestones = [
    { label: "Olha e sorri em resposta à estimulação", range: [1, 2] },
    { label: "Atende a ruídos e sons curvos", range: [1, 3] },
    { label: "Sorri em resposta à face humana", range: [1, 3] },
    { label: "Dá mostras de prazer e desprazer", range: [2, 4] },
    { label: "Sente-se bem acompanhado", range: [3, 5] },
    { label: "Reconhece vozes familiares", range: [3, 6] },
    { label: "Balbucia sons variados", range: [4, 7] },
    { label: "Silencia ao se aproximarem", range: [5, 8] },
    { label: "Localiza sons lateralmente", range: [6, 9] },
    { label: "Começa a diferenciar o estranho", range: [7, 10] },
    { label: "Brinca de esconde-esconde", range: [8, 11] },
    { label: "Vocaliza para chamar atenção", range: [8, 12] },
    { label: "Emite sons (balbucio)", range: [9, 13] },
    { label: "Controle de tom de voz", range: [10, 14] },
    { label: "Compreende palavras simples", range: [11, 15] },
  ];

  const months = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ fontSize: '8px', fontWeight: 900, color: mainColor, marginBottom: '6px', textAlign: 'center', textTransform: 'uppercase' }}>
        Marcos do Desenvolvimento (1-15 meses)
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: `0.3px solid ${mainColor}20`, borderRadius: '3px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', background: `${mainColor}10`, borderBottom: `0.3px solid ${mainColor}20` }}>
          <div style={{ width: '45%', padding: '3px', fontSize: '5px', fontWeight: 700, color: mainColor }}>HABILIDADES</div>
          <div style={{ flex: 1, display: 'flex' }}>
            {months.map(m => (
              <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: '4.5px', fontWeight: 800, color: mainColor, padding: '3px 0', borderLeft: `0.1px solid ${mainColor}10` }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {milestones.map((ms, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: `0.1px solid ${mainColor}10`, background: i % 2 === 0 ? '#fff' : `${mainColor}05` }}>
            <div style={{ width: '45%', padding: '2.5px 4px', fontSize: '4.2px', color: '#444', fontWeight: 500, lineHeight: 1 }}>{ms.label}</div>
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
              {months.map(m => (
                <div key={m} style={{ flex: 1, borderLeft: `0.1px solid ${mainColor}05`, height: '100%' }}>
                  {m >= ms.range[0] && m <= ms.range[1] && (
                    <div style={{ margin: '1px', height: 'calc(100% - 2px)', background: mainColor, borderRadius: '1px', opacity: 0.8 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '5px', textAlign: 'right', fontSize: '3.5px', color: '#aaa', fontWeight: 600 }}>IDADE EM MESES</div>
    </div>
  );
}
