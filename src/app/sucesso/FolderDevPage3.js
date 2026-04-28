import React from 'react';

export default function FolderDevPage3({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  // Data from the original image for Page 3
  const columns = [
    { label: '10', type: 'month' },
    { label: '11', type: 'month' },
    { label: '13', type: 'month' },
    { label: '14', type: 'month' },
    { label: '15', type: 'month' },
    { label: '18', type: 'month' },
    { label: '21', type: 'month' },
    { label: '2', type: 'year' },
    { label: '3', type: 'year' },
    { label: '4', type: 'year' },
    { label: '5', type: 'year' },
    { label: '6', type: 'year' },
  ];

  const milestones = [
    { label: "Anda sozinho e raramente cai", start: 2, end: 6 }, // 13m to 21m
    { label: "Tira sozinho qualquer peça do vestuário", start: 3, end: 7 }, // 14m to 2y
    { label: "Combina pelo menos 2 ou 3 palavras", start: 3, end: 8 }, // 14m to 3y
    { label: "Distancia-se da mãe sem perdê-la de vista", start: 3, end: 8 }, // 14m to 3y
    { label: "Leva os alimentos a boca com sua própria mão", start: 3, end: 9 }, // 14m to 4y
    { label: "Corre e/ou sobe degraus baixos", start: 4, end: 9 }, // 15m to 4y
    { label: "Aceita a companhia de outras crianças, mas brinca isoladamente", start: 4, end: 9 }, // 15m to 4y
    { label: "Diz seu próprio nome e nomeia objetos como sendo seus", start: 5, end: 10 }, // 18m to 5y
    { label: "Veste-se com auxílio", start: 6, end: 10 }, // 21m to 5y
    { label: "Fica sobre um pé, momentaneamente", start: 6, end: 10 }, // 21m to 5y
    { label: "Usa frases", start: 7, end: 11 }, // 2y to 6y
    { label: "Começa o controle esfincteriano", start: 7, end: 11 }, // 2y to 6y
    { label: "Reconhece mais de duas cores", start: 7, end: 11 }, // 2y to 6y
    { label: "Pula sobre um pé só", start: 8, end: 11 }, // 3y to 6y
    { label: "Brinca com outras crianças", start: 8, end: 11 }, // 3y to 6y
    { label: "Imita pessoas da vida cotidiana (pai, mãe, médico)", start: 8, end: 11 }, // 3y to 6y
    { label: "Veste-se sozinho", start: 9, end: 11 }, // 4y to 6y
    { label: "Pula alternadamente com um e outro pé", start: 9, end: 11 }, // 4y to 6y
    { label: "Alterna momentos cooperativos com agressivos", start: 10, end: 11 }, // 5y to 6y
    { label: "Capaz de expressar preferências e ideias próprias", start: 10, end: 11 }, // 5y to 6y
  ];

  return (
    <div style={{ width: '100%', height: '100%', padding: '2px 4px', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif", boxSizing: 'border-box' }}>
      <div style={{ fontSize: '6px', fontWeight: 900, color: mainColor, marginBottom: '2px', textAlign: 'center', textTransform: 'uppercase' }}>
        Marcos de Desenvolvimento
      </div>
      <div style={{ fontSize: '4px', fontWeight: 600, color: '#666', marginBottom: '4px', textAlign: 'center' }}>
        (resposta esperada)
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${mainColor}` }}>
          <div style={{ width: '50%', padding: '1px 2px', fontSize: '3.5px', fontWeight: 700, color: mainColor, display: 'flex', alignItems: 'flex-end' }}>
            HABILIDADES
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', width: '100%', marginBottom: '1px' }}>
                <div style={{ flex: 7, fontSize: '3.5px', color: '#666', textAlign: 'center' }}>Idade em meses</div>
                <div style={{ flex: 5, fontSize: '3.5px', color: '#666', textAlign: 'center' }}>Idade em anos</div>
             </div>
             <div style={{ display: 'flex', width: '100%' }}>
              {columns.map((col, idx) => (
                <div key={idx} style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  fontSize: '3.5px', 
                  fontWeight: 800, 
                  color: '#fff', 
                  background: col.type === 'month' ? '#72A9D1' : '#E67E7E', 
                  padding: '1px 0', 
                  borderLeft: '0.1px solid #fff' 
                }}>
                  {col.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '1px' }}>
          {milestones.map((ms, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', borderBottom: '0.3px solid #ccc' }}>
              <div style={{ width: '50%', padding: '0.8px 2px', fontSize: '2.8px', color: '#444', lineHeight: 1 }}>
                {ms.label}
              </div>
              <div style={{ flex: 1, display: 'flex', height: '100%', borderRight: '0.2px solid #ccc' }}>
                {columns.map((_, idx) => {
                  const isFilled = idx >= ms.start && idx <= ms.end;
                  return (
                    <div key={idx} style={{ flex: 1, borderLeft: '0.2px solid #ccc', position: 'relative' }}>
                      {isFilled && (
                        <div style={{ position: 'absolute', top: '0.3px', bottom: '0.3px', left: 0, right: 0, background: '#E3998D' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
