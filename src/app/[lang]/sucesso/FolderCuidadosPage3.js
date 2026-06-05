'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const Section = ({ title, color, children }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: color, padding: '2px 4px' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(color), textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'Montserrat,sans-serif' }}>{title}</span>
    </div>
    <div style={{ padding: '2.5px 3.5px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
      {children}
    </div>
  </div>
);

const Bullet = ({ text, color }) => (
  <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
    <span style={{ fontSize: '3px', color: color, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
    <span style={{ fontSize: '2.8px', color: '#444', lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif' }}>{text}</span>
  </div>
);

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

export default function FolderCuidadosPage3({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  return (
    <div style={{ width: '100%', height: '210px', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '4px 5px 3px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c0} title={lang === 'en' ? "Vernix Caseosa" : "Vérnix Caseoso"} items={lang === 'en' ? [
          'White substance covering the baby at birth.',
          'Do not remove in the first hours.',
          'Natural protector: hydrates and prevents infection.',
          'Absorbs on its own — do not force removal.',
        ] : [
          'Substância branca que cobre o bebê ao nascer.',
          'Não remover nas primeiras horas.',
          'Protetor natural: hidrata e previne infecção.',
          'Absorve sozinho — não forçar remoção.',
        ]} />
        <Card color={c1} title={lang === 'en' ? "Bath" : "Banho"} items={lang === 'en' ? [
          'Start after 24h of birth.',
          'Water temp: 36.9–37.5°C (elbow test).',
          '5–10 min soak, 3x a week.',
          'Dry skin folds thoroughly after.',
          'Never leave alone in the tub.',
        ] : [
          'Iniciar após 24h do nascimento.',
          'Temp. da água: 36,9–37,5°C (cotovelo).',
          '5–10 min de imersão, 3x por semana.',
          'Secar bem as dobrinhas após.',
          'Nunca deixar sozinho na banheira.',
        ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c2} title={lang === 'en' ? "Products" : "Produtos"} items={lang === 'en' ? [
          'pH 5.5–6.5, fragrance-free, hypoallergenic.',
          'Same soap for hair and body.',
          'No talc or perfume on skin.',
          'Mild moisturizer after bath.',
        ] : [
          'pH 5,5–6,5, sem fragrância, hipoalergênico.',
          'Mesmo sabonete para cabelo e corpo.',
          'Sem talco ou perfume na pele.',
          'Hidratante neutro após o banho.',
        ]} />
        <Card color={c3} title={lang === 'en' ? "Daily Hygiene" : "Higiene Diária"} items={lang === 'en' ? [
          'Change diaper every 2–3h.',
          'Wipe from front to back.',
          'Skin folds: neck, armpits, groin — dry.',
          'Irritated skin: avoid alcohol wipes.',
        ] : [
          'Trocar fralda a cada 2–3h.',
          'Limpar da frente para trás.',
          'Dobrinhas: pescoço, axilas, virilha — secar.',
          'Pele irritada: evitar lenço com álcool.',
        ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c0} title={lang === 'en' ? "Hair" : "Cabelos"} items={lang === 'en' ? [
          'Same shampoo as body wash.',
          'Gentle massage on scalp.',
          'Cradle cap: coconut oil + fine comb.',
          'Fontanelle (soft spot): normal to pulse slightly.',
          'Sunken fontanelle → sign of dehydration.',
        ] : [
          'Mesmo shampoo do corpo.',
          'Massagem suave no couro cabeludo.',
          'Crosta láctea: óleo de coco + pente fino.',
          'Moleira (fontanela): normal pulsar levemente.',
          'Fontanela afundada → sinal de desidratação.',
        ]} />
        <Card color={c1} title={lang === 'en' ? "Nails" : "Unhas"} items={lang === 'en' ? [
          'Cut straight across, do not round.',
          'Rounded-tip scissors or emery board.',
          'Do not cut too short — ingrowing risk.',
          'Frequency: 1–2x a week (they grow fast!).',
          'Best time: baby sleeping.',
        ] : [
          'Cortar em linha reta, sem arredondar.',
          'Tesoura de ponta arredondada ou lixa.',
          'Não cortar muito curtas — risco de encravamento.',
          'Frequência: 1–2x por semana (crescem rápido!).',
          'Melhor momento: bebê dormindo.',
        ]} />
      </div>

      <Tip text={lang === 'en' ? "Did you know? The fontanelle (soft spot) closes naturally between 12–18 months. Touching it gently is safe!" : "Sabia que? A fontanela (moleira) se fecha naturalmente entre 12–18 meses. Tocar com cuidado é seguro!"} color={c2} />

    </div>
  );
}
