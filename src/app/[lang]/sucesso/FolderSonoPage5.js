import React from 'react';

export default function FolderSonoPage5({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const posP1meses = [
    { title: 'Janela de Sono', text: 'Aumenta para 1h30–2h. Ideal para 2–3 cochilos por dia.', color: c0 },
    { title: 'Associações de Sono', text: 'Evite depender do colo ou mamada para dormir. Coloque sonolento!', color: c1 },
    { title: 'Rotina Flexível', text: 'Horário de banho e ritual previsível ajudam a regular o relógio biológico.', color: c2 },
    { title: 'Regressões', text: 'Picos às 4, 8 e 12 meses são normais. Mantenha a rotina!', color: c3 },
  ];

  const associacoes = [
    { bad: 'Adormecer no colo', good: 'Colocar sonolento no berço' },
    { bad: 'Mamar até dormir sempre', good: 'Mamar → aguardar → deitar' },
    { bad: 'Balançar até dormir', good: 'Ninada curta + pousar' },
    { bad: 'TV ou celular à noite', good: 'Música suave ou ruído branco' },
  ];

  const razoes = [
    { icon: '🌡️', text: 'Temperatura inadequada' },
    { icon: '😤', text: 'Cólicas ou refluxo' },
    { icon: '🏠', text: 'Barulho ou luz excessiva' },
    { icon: '📵', text: 'Falta de rotina' },
    { icon: '⏰', text: 'Ciclo circadiano imaturo' },
    { icon: '🔗', text: 'Associação inadequada' },
  ];

  return (
    <div style={{
      width: '100%', height: '210px',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: 'border-box',
      padding: '5px 5px 4px',
      gap: '0',
      justifyContent: 'flex-start',
      background: '#fff',
      overflow: 'hidden'
    }}>

      {/* BLOCO 1: Após o Primeiro Mês */}
      <div style={{
        flex: '0 0 auto',
        marginBottom: '14px',
        background: c0 + '0a',
        borderRadius: '3px',
        padding: '2px 3px',
        border: `0.3px solid ${c0}25`
      }}>
        <div style={{ fontSize: '4.8px', fontWeight: 900, color: c0, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
          📈 Após o Primeiro Mês
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px' }}>
          {posP1meses.map((item, i) => (
            <div key={i} style={{
              padding: '2px 3px', borderRadius: '2px',
              background: '#fff',
              borderLeft: `1.5px solid ${item.color}`,
            }}>
              <div style={{ fontSize: '2.8px', fontWeight: 800, color: item.color, lineHeight: 1, marginBottom: '0.5px' }}>{item.title}</div>
              <div style={{ fontSize: '2.5px', color: '#666', lineHeight: 1.2 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 2: Trocando Associações */}
      <div style={{
        flex: '0 0 auto',
        marginBottom: '14px',
        background: c1 + '0a',
        borderRadius: '3px',
        padding: '2px 3px',
        border: `0.3px solid ${c1}25`
      }}>
        <div style={{ fontSize: '4.8px', fontWeight: 900, color: c1, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '1.5px' }}>
          🔄 Trocando Associações de Sono
        </div>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '1px' }}>
          <div style={{ flex: 1, fontSize: '2.8px', fontWeight: 800, color: '#e05', textAlign: 'center' }}>❌ EVITAR</div>
          <div style={{ width: '6px' }} />
          <div style={{ flex: 1, fontSize: '2.8px', fontWeight: 800, color: '#0a6', textAlign: 'center' }}>✓ SUBSTITUIR</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {associacoes.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'stretch' }}>
              <div style={{
                flex: 1, padding: '1px 2px', borderRadius: '1.5px',
                background: '#fff0f2', border: '0.2px solid #ffcccc',
                fontSize: '2.5px', color: '#c00', textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.2
              }}>{a.bad}</div>
              <div style={{ fontSize: '5px', color: c1, display: 'flex', alignItems: 'center' }}>→</div>
              <div style={{
                flex: 1, padding: '1px 2px', borderRadius: '1.5px',
                background: '#f0fff6', border: '0.2px solid #aaddcc',
                fontSize: '2.5px', color: '#055', textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.2
              }}>{a.good}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 3: Por que não dorme? */}
      <div style={{
        flex: '0 0 auto',
        background: c2 + '0a',
        borderRadius: '3px',
        padding: '2px 3px',
        border: `0.3px solid ${c2}25`
      }}>
        <div style={{ fontSize: '4.8px', fontWeight: 900, color: c2, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
          🤔 Por Que Meu Bebê Não Dorme?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2px' }}>
          {razoes.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1.5px',
              padding: '1.5px 2px', borderRadius: '1.5px',
              background: '#fff',
              border: `0.2px solid ${(i % 4 === 0 ? c0 : i % 4 === 1 ? c1 : i % 4 === 2 ? c2 : c3)}30`
            }}>
              <span style={{ fontSize: '5.5px', flexShrink: 0 }}>{r.icon}</span>
              <span style={{ fontSize: '2.5px', color: '#555', lineHeight: 1.2 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
