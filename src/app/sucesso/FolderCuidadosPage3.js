import React from 'react';

const Card = ({ title, color, items, style }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', ...style }}>
    <div style={{ background: color, padding: '1px 3px' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{title}</span>
    </div>
    <div style={{ padding: '2px 3px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '3px', color: color, flexShrink: 0, marginTop: '0.2px', fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
          <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const Tip = ({ text, color }) => (
  <div style={{ background: color + '15', border: `0.4px solid ${color}40`, borderRadius: '2px', padding: '1.5px 3px', display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
    <span style={{ fontSize: '3.5px', flexShrink: 0 }}>💡</span>
    <span style={{ fontSize: '2.5px', color: '#555', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic' }}>{text}</span>
  </div>
);

export default function FolderCuidadosPage3({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  return (
    <div style={{ width: '100%', height: '210px', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '4px 5px 3px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c0} title="🤍 Vérnix Caseoso" items={[
          'Substância branca que cobre o bebê ao nascer.',
          'Não remover nas primeiras horas.',
          'Protetor natural: hidrata e previne infecção.',
          'Absorve sozinho — não forçar remoção.',
        ]} />
        <Card color={c1} title="🛁 Banho" items={[
          'Iniciar após 24h do nascimento.',
          'Temp. da água: 36,9–37,5°C (cotovelo).',
          '5–10 min de imersão, 3x por semana.',
          'Secar bem as dobrinhas após.',
          'Nunca deixar sozinho na banheira.',
        ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c2} title="🧴 Produtos" items={[
          'pH 5,5–6,5, sem fragrância, hipoalergênico.',
          'Mesmo sabonete para cabelo e corpo.',
          'Sem talco ou perfume na pele.',
          'Hidratante neutro após o banho.',
        ]} />
        <Card color={c3} title="🧹 Higiene Diária" items={[
          'Trocar fralda a cada 2–3h.',
          'Limpar da frente para trás.',
          'Dobrinhas: pescoço, axilas, virilha — secar.',
          'Pele irritada: evitar lenço com álcool.',
        ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c0} title="💇 Cabelos" items={[
          'Mesmo shampoo do corpo.',
          'Massagem suave no couro cabeludo.',
          'Crosta láctea: óleo de coco + pente fino.',
          'Moleira (fontanela): normal pulsar levemente.',
          'Fontanela afundada → sinal de desidratação.',
        ]} />
        <Card color={c1} title="✂️ Unhas" items={[
          'Cortar em linha reta, sem arredondar.',
          'Tesoura de ponta arredondada ou lixa.',
          'Não cortar muito curtas — risco de encravamento.',
          'Frequência: 1–2x por semana (crescem rápido!).',
          'Melhor momento: bebê dormindo.',
        ]} />
      </div>

      <Tip text="Sabia que? A fontanela (moleira) se fecha naturalmente entre 12–18 meses. Tocar com cuidado é seguro!" color={c2} />

    </div>
  );
}
