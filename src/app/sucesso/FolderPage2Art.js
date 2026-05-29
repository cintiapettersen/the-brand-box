import React from 'react';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const Card = ({ title, color, items, twoCol = false }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: color, padding: '2px 4px' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(color), textTransform: 'uppercase', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>{title}</span>
    </div>
    <div style={{ padding: '2px 4px', flex: 1, ...(twoCol ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px 6px' } : { display: 'flex', flexDirection: 'column', gap: '1.5px' }) }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '3px', color: color, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
          <span style={{ fontSize: '2.8px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function FolderPage2Art({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || c0;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const faixas = [
    { faixa: 'Até 6 meses', tipo: 'Leite materno exclusivo' },
    { faixa: '6 a 12 meses', tipo: 'Leite materno complementado' },
    { faixa: '1 ao 3 anos', tipo: 'Alimentos da família' },
    { faixa: '3° ao 6° ano', tipo: 'Consistência da família' },
  ];

  return (
    <div style={{ width: '100%', height: '210px', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '3px 8px 4px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* Banner título */}
      <div style={{ background: c0, borderRadius: '3px', padding: '3px 5px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '4.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Montserrat,sans-serif' }}>Alimentação Complementar</div>
        <div style={{ fontSize: '3px', color: textColor(c0), opacity: 0.85, marginTop: '1px', fontStyle: 'italic' }}>De forma lenta e gradual, respeitando a vontade da criança</div>
      </div>

      {/* Tabela FAIXA ETÁRIA */}
      <div style={{ background: '#fff', border: `0.5px solid ${c0}40`, borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ background: c0, padding: '1.5px 4px', display: 'flex' }}>
          <span style={{ flex: 1, fontSize: '3.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Faixa Etária</span>
          <span style={{ flex: 1.6, fontSize: '3.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Tipo de Alimento</span>
        </div>
        {faixas.map((row, i) => (
          <div key={i} style={{ display: 'flex', background: i % 2 === 0 ? '#fff' : c0 + '12', borderTop: `0.2px solid ${c0}25` }}>
            <div style={{ flex: 1, padding: '2px 4px', fontSize: '3px', fontWeight: 700, color: c0, lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif' }}>{row.faixa}</div>
            <div style={{ flex: 1.6, padding: '2px 4px', fontSize: '3px', color: '#555', lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif' }}>{row.tipo}</div>
          </div>
        ))}
      </div>

      {/* Linha superior: Na refeição + A partir de 6 meses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', flexShrink: 0, height: '62px' }}>
        <Card color={c1} title="Na refeição" items={[
          'Alimentos amassados, não liquidificados.',
          'Estimular a interação com a comida.',
          'Respeitar sinais de saciedade.',
          'Não forçar — autonomia alimentar.',
          'Consistência pastosa até os 12 meses.',
        ]} />
        <Card color={c3} title="A partir de 6 meses" items={[
          'Iniciar com 2–3 colheres, aumentar gradual.',
          'Cereais, tubérculos, leguminosas e carnes.',
          'Hortaliças: variar as cores a cada refeição.',
          'Água filtrada após os 6 meses.',
          'Não substituir o leite materno.',
          'Frutas como sobremesa, não como refeição.',
        ]} />
      </div>

      {/* Linha inferior: IMPORTANTES largura total, 2 colunas de bullets */}
      <div style={{ flex: 1, minHeight: 0, marginBottom: '2px' }}>
        <Card color={c2} title="Importantes" twoCol items={[
          'Sem sal no 1° ano de vida.',
          'Sem açúcar antes dos 2 anos.',
          'Mel: proibido antes de 1 ano (botulismo).',
          'Frutas cítricas pós-refeição: absorção de ferro.',
          'Evitar alimentos ultraprocessados.',
          'Leite de vaca: evitar antes de 1 ano.',
        ]} />
      </div>
    </div>
  );
}
