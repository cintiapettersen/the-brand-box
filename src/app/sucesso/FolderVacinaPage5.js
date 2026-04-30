import React from 'react';

export default function FolderVacinaPage5({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  const tables = [
    {
      title: "Meningo B",
      headers: ["PRIMEIRA DOSE", "SEGUNDA DOSE", "REFORÇO"],
      rows: [
        ["6-11 MESES", "2 MESES APÓS A 1ª DOSE", "No segundo ano de vida"],
        ["12-23 MESES", "2 MESES APÓS A 1ª DOSE", "12-23 meses após a 1ª dose"],
        [">24 MESES", "1 MÊS OU MAIS APÓS A 1ª DOSE", "Necessidade não estabelecida"]
      ]
    },
    {
      title: "Menveo (ACWY-CRM)",
      headers: ["PRIMEIRA DOSE", "SEGUNDA DOSE", "REFORÇO"],
      rows: [
        ["Mais de 6 semanas", "2 MESES APÓS A 1ª DOSE", "A cada 5 anos"],
        ["12 meses ou mais", "Não tem", "A cada 5 anos"]
      ]
    },
    {
      title: "Nimenrix ( ACWY - TT )",
      headers: ["", "", "", ""], // Image shows 4 columns here
      customHeaders: ["", "2 MESES APÓS A 1ª DOSE", "2 MESES APÓS A 2ª DOSE", "A cada 5 anos"],
      rows: [
        ["6-11 MESES", "2 MESES APÓS A 1ª DOSE", "2 MESES APÓS A 2ª DOSE", "A cada 5 anos"],
        ["12-23 MESES", "2 MESES APÓS A 1ª DOSE", "Não tem", "A cada 5 anos"],
        [">24 MESES", "Não tem", "Não tem", "A cada 5 anos"]
      ]
    }
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '6px 8px', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box',
      background: '#fff',
      gap: '8px'
    }}>
      <div style={{ fontSize: '4.5px', fontWeight: 800, color: '#000', marginBottom: '2px', lineHeight: 1.2 }}>
        Esquema das meningites quando iniciado fora do período do calendário vacinal:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {tables.map((t, ti) => (
          <div key={ti} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '5px', fontWeight: 900, color: mainColor, marginBottom: '2px' }}>{t.title}</div>
            <div style={{ display: 'flex', background: mainColor }}>
              {(t.customHeaders || t.headers).map((h, hi) => (
                <div key={hi} style={{ flex: 1, padding: '1.5px 2px', fontSize: '3.2px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.15px solid #fff' }}>
                  {h}
                </div>
              ))}
            </div>
            {t.rows.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', borderBottom: `0.15px solid ${mainColor}40`, borderLeft: `0.15px solid ${mainColor}40`, borderRight: `0.15px solid ${mainColor}40` }}>
                {row.map((cell, ci) => (
                  <div key={ci} style={{ flex: 1, padding: '1.5px 1px', fontSize: '2.8px', color: '#666', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: ci < row.length - 1 ? `0.15px solid ${mainColor}40` : 'none', lineHeight: 1 }}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2px' }}>
        <div style={{ fontSize: '5px', fontWeight: 900, color: mainColor, marginBottom: '2px' }}>Outras recomendações:</div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ borderBottom: `0.15px solid ${mainColor}30`, height: '7px', width: '100%' }} />
        ))}
      </div>
    </div>
  );
}
