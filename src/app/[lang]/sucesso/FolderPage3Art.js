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

export default function FolderPage3Art({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || c0;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;
  const c4 = palette[4] || c2;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '6px 8px 8px', gap: '4px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* Banner título */}
      <div style={{ background: c0, borderRadius: '3px', padding: '3px 5px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '4.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Montserrat,sans-serif' }}>
          {lang === 'en' ? 'Hygiene and Contamination Care' : 'Cuidado com a Higiene e Contaminação'}
        </div>
        <div style={{ fontSize: '3px', color: textColor(c0), opacity: 0.85, marginTop: '1px', fontStyle: 'italic' }}>
          {lang === 'en' ? 'Prefer seasonal and organic foods' : 'Prefira alimentos de estação e orgânicos'}
        </div>
      </div>

      {/* Grid 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1.2fr', gap: '4px', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        <Section title={lang === 'en' ? '💧 Water' : '💧 Água'} color={c1}>
          {lang === 'en' ? (
            <>
              <Bullet color={c1} text="Only filtered or boiled water." />
              <Bullet color={c1} text="Starting with complementary feeding." />
              <Bullet color={c1} text="Does not count as breast milk." />
              <Bullet color={c1} text="Small amounts, multiple times a day." />
              <Bullet color={c1} text="Offer on very hot days." />
            </>
          ) : (
            <>
              <Bullet color={c1} text="Somente água filtrada ou fervida." />
              <Bullet color={c1} text="A partir da introdução alimentar." />
              <Bullet color={c1} text="Não conta como leite materno." />
              <Bullet color={c1} text="Pouca quantidade, várias vezes ao dia." />
              <Bullet color={c1} text="Oferecer em dias de calor intenso." />
            </>
          )}
        </Section>

        <Section title={lang === 'en' ? '🥦 Hygiene' : '🥦 Higienização'} color={c3}>
          {lang === 'en' ? (
            <>
              <Bullet color={c3} text="Wash vegetables leaf by leaf." />
              <Bullet color={c3} text="Sodium hypochlorite for 15 min." />
              <Bullet color={c3} text="Rinse thoroughly before preparing." />
              <Bullet color={c3} text="Fruits: wash before peeling." />
              <Bullet color={c3} text="Wash hands before preparing." />
            </>
          ) : (
            <>
              <Bullet color={c3} text="Lavar hortaliças folha a folha." />
              <Bullet color={c3} text="Hipoclorito de sódio por 15 min." />
              <Bullet color={c3} text="Enxaguar bem antes de preparar." />
              <Bullet color={c3} text="Frutas: lavar antes de descascar." />
              <Bullet color={c3} text="Lavar as mãos antes de preparar." />
            </>
          )}
        </Section>

        <Section title={lang === 'en' ? '🔥 Cooking' : '🔥 Fogo'} color={c2}>
          {lang === 'en' ? (
            <>
              <Bullet color={c2} text="Meats, eggs, and chicken: > 70°C." />
              <Bullet color={c2} text="Do not reheat more than once." />
              <Bullet color={c2} text="Do not microwave breast milk." />
              <Bullet color={c2} text="Prepared food: up to 24h in fridge." />
              <Bullet color={c2} text="Defrost in the fridge, not on counter." />
            </>
          ) : (
            <>
              <Bullet color={c2} text="Carnes, ovos e frango: > 70°C." />
              <Bullet color={c2} text="Não reaquecer mais de uma vez." />
              <Bullet color={c2} text="Não usar micro-ondas com leite materno." />
              <Bullet color={c2} text="Alimentos prontos: até 24h na geladeira." />
              <Bullet color={c2} text="Descongelar na geladeira, não na bancada." />
            </>
          )}
        </Section>

        <Section title={lang === 'en' ? '🍽️ Plate' : '🍽️ Prato'} color={c4}>
          {lang === 'en' ? (
            <>
              <Bullet color={c4} text="Meat: 50–70g/day on the menu." />
              <Bullet color={c4} text="Legumes: beans, lentils, chickpeas." />
              <Bullet color={c4} text="Cereals + legumes = complete protein." />
              <Bullet color={c4} text="Variety of colors = more nutrients." />
              <Bullet color={c4} text="Avoid fried and processed foods." />
            </>
          ) : (
            <>
              <Bullet color={c4} text="Carne: 50–70g/dia no cardápio." />
              <Bullet color={c4} text="Leguminosas: feijão, lentilha, grão-de-bico." />
              <Bullet color={c4} text="Cereais + leguminosa = proteína completa." />
              <Bullet color={c4} text="Variedade de cores = mais nutrientes." />
              <Bullet color={c4} text="Evitar frituras e alimentos processados." />
            </>
          )}
        </Section>

      </div>
    </div>
  );
}
