'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

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

export default function FolderCuidadosPage5({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const alertas = lang === 'en' ? [
    'Fever in baby < 3 months (> 37.8°C / 100°F)',
    'Difficulty breathing or wheezing',
    'Bluish lips or skin',
    'Extreme sleepiness, hard to wake up',
    'Food refusal for more than 8 hours',
    'Seizures or shaking of the whole body',
    'Dehydration: no wet diapers, dry mouth',
    'Repeated vomiting or blood in stool',
    'Inconsolable crying for more than 3h',
    'Extreme floppiness or irritability',
  ] : [
    'Febre em bebê < 3 meses (> 37,8°C)',
    'Dificuldade para respirar ou chiado',
    'Lábios ou pele azulados',
    'Sonolência extrema, difícil de acordar',
    'Recusa alimentar por mais de 8 horas',
    'Convulsão ou tremores no corpo todo',
    'Desidratação: sem xixi, boca seca',
    'Vômitos repetidos ou sangue nas fezes',
    'Choro inconsolável por mais de 3h',
    'Moleza intensa ou irritabilidade extrema',
  ];

  const triagens = lang === 'en' ? [
    { label: 'Heel Prick', text: '3–5 days of life. Do not delay.' },
    { label: 'Hearing', text: 'Before discharge or up to 1 month.' },
    { label: 'Eye Test', text: 'Red reflex in the maternity ward and visits.' },
    { label: 'Heart Test', text: 'Pulse oximetry before hospital discharge.' },
    { label: 'Tongue Tie', text: 'Lingual frenulum — evaluate in maternity.' },
    { label: 'Hip Exam', text: 'Ultrasound for dysplasia — 1st month of life.' },
  ] : [
    { label: 'Pezinho', text: '3–5 dias de vida. Não atrasar.' },
    { label: 'Orelhinha', text: 'Antes da alta ou até 1 mês.' },
    { label: 'Olhinho', text: 'Reflexo vermelho na maternidade e consultas.' },
    { label: 'Coraçãozinho', text: 'Oximetria antes da alta hospitalar.' },
    { label: 'Linguinha', text: 'Frênulo lingual — avaliar na maternidade.' },
    { label: 'Quadril', text: 'Ultrassom para displasia — 1º mês de vida.' },
  ];

  const mamae = lang === 'en' ? [
    { label: 'Baby blues:', text: 'Sadness, crying and irritability in the first 15 days — it is normal and passes.' },
    { label: 'PPD:', text: 'Intense sadness after 2 weeks → seek help. It is not weakness, it is health.' },
    { label: 'Hydration:', text: 'Drink plenty of water — especially if breastfeeding.' },
    { label: 'Nutrition:', text: 'Regular meals, rich in iron and protein. Do not skip meals.' },
    { label: 'Ask for help:', text: 'It is a sign of strength, not weakness. Accept support from those around.' },
    { label: 'Self-care:', text: 'Sleep when the baby sleeps. You do not need to do everything alone.' },
  ] : [
    { label: 'Baby blues:', text: 'Tristeza, choro e irritabilidade nos primeiros 15 dias — é normal e passa.' },
    { label: 'DPP:', text: 'Tristeza intensa após 2 sem. → busque ajuda. Não é frescura, é saúde.' },
    { label: 'Hidratação:', text: 'Beba bastante água — especialmente se estiver amamentando.' },
    { label: 'Alimentação:', text: 'Refeições regulares, ricas em ferro e proteína. Não pule refeições.' },
    { label: 'Pedir ajuda:', text: 'É sinal de força, não de fraqueza. Aceite o apoio de quem está ao redor.' },
    { label: 'Autocuidado:', text: 'Dormir quando o bebê dormir. Você não precisa dar conta de tudo sozinha.' },
  ];

  const sonoSeguro = lang === 'en' ? [
    'Always on the back — reduces sudden infant death syndrome (SIDS).',
    'Firm mattress. No pillow, stuffed animals, or fluffy blankets.',
    'Environment: 20–22°C, smoke-free, no strong light.',
    'Co-sleeping: not recommended under 6 months.',
    'Pacifier can be offered after breastfeeding is established.',
    'Never leave baby sleeping in the stroller or infant car seat.',
  ] : [
    'Sempre de barriga para cima — reduz morte súbita.',
    'Colchão firme. Sem travesseiro, pelúcia ou cobertor fofo.',
    'Ambiente: 20–22°C, sem fumaça, sem luz forte.',
    'Cama compartilhada: não recomendada < 6 meses.',
    'Chupeta pode ser oferecida após amamentação estabelecida.',
    'Nunca deixar bebê dormindo no carrinho ou bebê conforto.',
  ];

  return (
    <div style={{ width: '100%', height: '210px', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '4px 5px 3px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* SINAIS DE ALERTA */}
      <div style={{ background: '#fff', border: `0.5px solid ${c0}60`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ background: c0, padding: '1px 3px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{lang === 'en' ? "When to Go to the ER" : "Quando Ir ao Pronto-Socorro"}</span>
        </div>
        <div style={{ padding: '2px 3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5px 4px' }}>
          {alertas.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3px', color: c0, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
              <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif' }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

        {/* TRIAGENS NEONATAIS */}
        <div style={{ background: '#fff', border: `0.5px solid ${c0}40`, borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ background: c0, padding: '1px 3px', textAlign: 'center' }}>
            <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{lang === 'en' ? "Newborn Screening" : "Triagens Neonatais"}</span>
          </div>
          <div style={{ padding: '2px 3px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {triagens.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '3px', color: [c0,c1,c2,c3,c0,c1][i], flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
                <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif' }}>
                  <b style={{ fontWeight: 800, color: [c0,c1,c2,c3,c0,c1][i] }}>{t.label}:</b> {t.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BEM-ESTAR DA MAMÃE */}
        <div style={{ background: '#fff', border: `0.5px solid ${c1}40`, borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ background: c1, padding: '1px 3px', textAlign: 'center' }}>
            <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{lang === 'en' ? "Mother's Well-being" : "Bem-estar da Mamãe"}</span>
          </div>
          <div style={{ padding: '2px 3px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {mamae.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '3px', color: [c1,c2,c3,c0,c1,c2][i], flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
                <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif' }}>
                  <b style={{ fontWeight: 800, color: [c1,c2,c3,c0,c1,c2][i] }}>{t.label}</b> {t.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SONO SEGURO */}
      <div style={{ background: '#fff', border: `0.5px solid ${c2}40`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ background: c2, padding: '1px 3px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{lang === 'en' ? "Safe Sleep" : "Sono Seguro"}</span>
        </div>
        <div style={{ padding: '2px 3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5px 4px' }}>
          {sonoSeguro.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3px', color: c2, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
              <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
