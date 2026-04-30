import React from 'react';

export default function FolderSonoPage4({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;
  const c4 = palette[4] || c0;

  const fase0a1 = [
    { icon: '🤱', text: 'Bebês se acostumam ao colo e ao peito — é normal!' },
    { icon: '🔄', text: 'Sono alterna entre tranquilo e agitado (ciclos de 45–50 min)' },
    { icon: '⏰', text: 'Dormem em média 16–22h por dia, em vários períodos' },
    { icon: '🌙', text: 'Ainda não diferencia dia de noite — paciência!' },
    { icon: '👶', text: 'Imaturidade neurológica é a causa dos despertares noturnos' },
  ];

  const estrategias = [
    { icon: '🌯', title: 'Envolva com swaddle', desc: 'Imita o útero; reduz reflexo de moro.', color: c0 },
    { icon: '🔊', title: 'Shushing (shhh)', desc: 'Som contínuo em volume moderado.', color: c1 },
    { icon: '🌊', title: 'Ruído branco', desc: 'Chuva, ventoinha ou app específico.', color: c2 },
    { icon: '🤗', title: 'Ninada suave', desc: 'Movimento rítmico por poucos minutos.', color: c3 },
    { icon: '🟡', title: 'Luz âmbar à noite', desc: 'Não inibe melatonina como a luz azul.', color: c4 },
  ];

  const hormonios = [
    { nome: 'Melatonina', color: c0, desc: 'Hormônio do sono. Produção madura ~3–6 meses. À noite com luz baixa.' },
    { nome: 'Cortisol',   color: c1, desc: 'Hormônio do estresse. Sobe quando o bebê não dorme o suficiente.' },
    { nome: 'GH',         color: c2, desc: 'Hormônio do crescimento. Secretado principalmente durante o sono.' },
  ];

  return (
    <div style={{
      width: '100%', height: '210px',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: 'border-box',
      padding: '5px 5px 3px',
      gap: '2.5px',
      background: '#fff',
      overflow: 'hidden'
    }}>

      {/* SEÇÃO: O Sono de 0 a 1 Mês */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{
          background: c0, borderRadius: '2px',
          padding: '1.5px 4px',
          display: 'flex', alignItems: 'center', gap: '2px',
          marginBottom: '1.5px'
        }}>
          <span style={{ fontSize: '6px' }}>🌙</span>
          <div style={{ fontSize: '4.5px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            O Sono de 0 a 1 Mês
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {fase0a1.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
              <span style={{ fontSize: '5.5px', flexShrink: 0, lineHeight: 1.2 }}>{item.icon}</span>
              <span style={{ fontSize: '2.8px', color: '#555', lineHeight: 1.3 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div style={{ height: '0.4px', background: c1 + '40' }} />

      {/* SEÇÃO: Estratégias — cards em grid */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: '4.5px', fontWeight: 900, color: c1, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
          💡 Como Acalmar Bebês Menores de 30 dias
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px' }}>
          {estrategias.map((e, i) => (
            <div key={i} style={{
              padding: '2px 3px',
              borderRadius: '2px',
              background: e.color + '15',
              borderTop: `1.5px solid ${e.color}`,
              display: 'flex', flexDirection: 'column', gap: '0.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '6px' }}>{e.icon}</span>
                <div style={{ fontSize: '3px', fontWeight: 800, color: e.color, lineHeight: 1.1 }}>{e.title}</div>
              </div>
              <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.2 }}>{e.desc}</div>
            </div>
          ))}
          {/* célula fantasma pra fechar o grid par */}
          <div />
        </div>
      </div>

      {/* Divisor */}
      <div style={{ height: '0.4px', background: c2 + '40' }} />

      {/* SEÇÃO: Hormônios */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: '4.5px', fontWeight: 900, color: c2, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '1.5px' }}>
          ⚗️ Hormônios do Sono
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2px' }}>
          {hormonios.map((h, i) => (
            <div key={i} style={{
              display: 'flex', gap: '3px', alignItems: 'flex-start',
              padding: '1.5px 2.5px', borderRadius: '1.5px',
              border: `0.2px solid ${h.color}35`,
              background: h.color + '0e'
            }}>
              <div style={{
                background: h.color, color: '#fff',
                fontSize: '2.6px', fontWeight: 800,
                padding: '1px 2px', borderRadius: '1px',
                flexShrink: 0, whiteSpace: 'nowrap', alignSelf: 'flex-start', marginTop: '0.5px'
              }}>{h.nome}</div>
              <span style={{ fontSize: '2.7px', color: '#555', lineHeight: 1.3 }}>{h.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
