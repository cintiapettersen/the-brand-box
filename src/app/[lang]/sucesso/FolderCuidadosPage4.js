import React from 'react';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const Card = ({ title, color, items, style }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', ...style }}>
    <div style={{ background: color, padding: '1px 3px', textAlign: 'center' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(color), textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{title}</span>
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
    <span style={{ fontSize: '3.5px', flexShrink: 0 }}></span>
    <span style={{ fontSize: '2.5px', color: '#555', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic' }}>{text}</span>
  </div>
);

const RxLine = ({ label, field, suffix, color }) => (
  <div style={{ display: 'flex', gap: '1.5px', alignItems: 'center' }}>
    <span style={{ fontSize: '3px', color: color, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
    <span style={{ fontSize: '2.6px', fontWeight: 800, color, fontFamily: 'Montserrat,sans-serif' }}>{label} </span>
    <span style={{ fontSize: '2.6px', fontWeight: 800, color: '#333', background: color + '20', borderRadius: '1px', padding: '0 2px', fontFamily: 'Montserrat,sans-serif', minWidth: '12px', display: 'inline-block' }}>{field}</span>
    <span style={{ fontSize: '2.6px', color: '#444', fontFamily: 'Montserrat,sans-serif' }}> {suffix}</span>
  </div>
);

export default function FolderCuidadosPage4({ accentColor, palette = [], fields = {} }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const simeticona = fields.simeticona || '______';
  const dipirona = fields.dipirona || '______';

  return (
    <div style={{ width: '100%', height: '210px', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '4px 5px 3px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* CÓLICAS */}
      <div style={{ background: '#fff', border: `0.5px solid ${c0}40`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ background: c0, padding: '1px 3px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>Cólicas</span>
        </div>
        <div style={{ padding: '2px 3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5px 4px' }}>
          {[
            'Surge na 2ª semana, melhora após 3 meses.',
            'Compressa morna na barriga.',
            'Massagem abdominal no sentido horário.',
            'Movimento de bicicleta com as pernas.',
            'Verificar pega (amamentação) ou diluição (fórmula).',
            'Ambiente calmo, colo e movimento suave ajudam.',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3px', color: c0, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
              <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '1px 3px 2px', borderTop: `0.3px solid ${c0}20`, display: 'flex', gap: '8px' }}>
          <RxLine label="Simeticona:" field={simeticona} suffix="gts — 8/8h após refeições" color={c0} />
          <RxLine label="Dipirona:" field={dipirona} suffix="gts — se dor intensa" color={c0} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        {/* NARIZ ENTUPIDO */}
        <Card color={c1} title="Nariz Entupido" items={[
          'Soro 0,9% antes das mamadas.',
          'Conta-gotas: 2–3 gotas, bebê deitado.',
          'Spray jato contínuo: 1 jato, bebê ereto.',
          'Seringa ponta romba: irrigação suave.',
          'Aspirador nasal para remover o excesso.',
          'Nariz + febre ou > 10 dias → pediatra.',
        ]} />

        {/* ASSADURAS */}
        <Card color={c2} title="Assaduras" items={[
          'Limpar com água morna + algodão.',
          'Secar com toque suave — não esfregar.',
          'Arejar antes da nova fralda.',
          'Leve: óxido de zinco (Desitin) a cada troca.',
          'Moderada: pomada mais espessa, mais trocas.',
          'Grave (sangramento/bolhas) → pediatra urgente.',
          'Pontos brancos + borda → candidíase → tto.',
        ]} />
      </div>

      {/* VISITAS & AMBIENTE */}
      <div style={{ background: '#fff', border: `0.5px solid ${c3}40`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ background: c3, padding: '1px 3px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>Visitas, Passeios & Ambiente</span>
        </div>
        <div style={{ padding: '2px 3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5px 4px' }}>
          {[
            'Visitas: peça que lavem as mãos antes de pegar o bebê.',
            'Evite beijos no rosto e nas mãos do recém-nascido.',
            'Pessoas com gripe, herpes ou doença → não segurar o bebê.',
            'Passeios ao ar livre: permitidos desde os primeiros dias.',
            'Evite locais fechados e com muita gente nas primeiras semanas.',
            'Sol direto: proibido antes dos 6 meses. Prefira sombra.',
            'Protetor solar: apenas a partir dos 6 meses com orientação.',
            'Temperatura do ambiente: 20–22°C, sem corrente de ar direta.',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3px', color: c3, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
              <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
