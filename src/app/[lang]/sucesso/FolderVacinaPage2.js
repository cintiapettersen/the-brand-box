import React from 'react';

export default function FolderVacinaPage2({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  const vaccines = [
    { name: "BCG ID", doses: "Dose única ao nascer" },
    { name: "Hepatite B", doses: "3 doses * ao nascer + 2m + 6m" },
    { name: "Tríplice bacteriana (DTPw ou DTPa)", doses: "3 doses (2, 4 e 6m) + REF. (15 à 18m) + REF. (4 à 5 anos)" },
    { name: "Haemophilus influenzae b", doses: "3 doses (2, 4 e 6m) + REF. (15 à 18m)" },
    { name: "Poliomielite (vírus inativados)", doses: "3 doses (2, 4 e 6m) + REF. (15 à 18m) + REF. (4 à 5 anos)" },
    { name: "Rotavírus", doses: "Duas ou três doses, dependendo da vacina utilizada ( de 2 à 8 m )" },
    { name: "Pneumocócicas conjugadas", doses: "Duas ou três doses, dependendo da vacina utilizada ( de 2 à 8 m ) + REF. ( 12 à 15m )" },
    { name: "Meningocócicas conjugadas ACWY/C", doses: "2 doses ( 3 e 5m ) + REF. ( 12 à 15m ) + REF. ( 5 à 6 anos )" },
    { name: "Meningocócica B", doses: "2 doses ( 3 e 5m ) + REF. ( 12 à 15m )" },
    { name: "Influenza ( gripe )", doses: "Dose anual. Duas doses na primovacinação dos 6m aos 9 anos de idade." },
    { name: "Poliomielite oral (vírus vivos atenuados)", doses: "DIAS NACIONAIS DE VACINAÇÃO 12m aos 4 anos" },
    { name: "Febre amarela", doses: "1 dose ( 9m ) + REF. ( 4 anos )" },
    { name: "Hepatite A", doses: "2 doses ( 12m e 18m )" },
    { name: "Tríplice viral (sarampo, caxumba e rubéola)", doses: "2 doses ( 12m e 15 à 24m )" },
    { name: "Varicela (catapora)", doses: "2 doses ( 12m e 15 à 24 m )" },
    { name: "HPV", doses: "2 doses ( 9 à 10 anos )" },
    { name: "Vacina tríplice bacteriana acelular do tipo adulto (dTpa)", doses: "REF. ( 9 à 10 anos )" },
    { name: "Dengue", doses: "*Três doses para soropositivos" },
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '4px 6px', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box',
      background: '#fff'
    }}>
      <div style={{ 
        display: 'flex', 
        background: mainColor, 
        padding: '2px 4px', 
        borderRadius: '2px 2px 0 0',
        marginBottom: '1px'
      }}>
        <div style={{ flex: 1.2, color: '#fff', fontSize: '4.5px', fontWeight: 800, letterSpacing: '0.5px' }}>VACINAS</div>
        <div style={{ flex: 2, color: '#fff', fontSize: '4.5px', fontWeight: 800, letterSpacing: '0.5px' }}>DOSES E REFORÇOS</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {vaccines.map((v, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            borderBottom: '0.15px solid #eee',
            height: '9.6px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1.2, fontSize: '3.1px', fontWeight: 700, color: mainColor, paddingRight: '3px', lineHeight: 1.0 }}>
              {v.name}
            </div>
            <div style={{ flex: 2, fontSize: '3.1px', fontWeight: 600, color: '#666', fontStyle: 'italic', lineHeight: 1.0 }}>
              {v.doses}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
