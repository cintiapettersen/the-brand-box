'use client';
import React from 'react';

const textColor = (hex) => {
  const h = (hex || '#000').replace('#','');
  const r = parseInt(h.substr(0,2),16);
  const g = parseInt(h.substr(2,2),16);
  const b = parseInt(h.substr(4,2),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.6 ? '#333' : '#fff';
};

export default function FolderPage5Art({ accentColor = '#879A6C', palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || c0;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;
  const c4 = palette[4] || c2;

  // Lógica de Contraste para o Título
  const getSafeColor = (hex, amount = 20) => {
    if (!hex) return hex;
    const h = hex.replace('#', '');
    if (h.length < 6) return hex;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 210) {
      const darken = (v) => Math.max(0, Math.min(255, Math.floor(v * (1 - amount/100))));
      return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
    }
    return hex;
  };

  const titleColor = getSafeColor(c0, 30);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '6px 8px 8px', gap: '4px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* Banner título */}
      <div style={{ background: c0, borderRadius: '3px', padding: '3px 5px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '4.5px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Montserrat,sans-serif' }}>Esquema do Prato Saudável</div>
        <div style={{ fontSize: '3px', color: textColor(c0), opacity: 0.85, marginTop: '1px', fontStyle: 'italic' }}>Proporção ideal para todas as idades, variando as porções</div>
      </div>

      {/* Pratinho em CSS Conic-Gradient com Emojis */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 0, padding: '2px 0' }}>
        <div style={{
          position: 'relative',
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '2px solid #e2e8f0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {/* Aba/Borda interna do prato */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `conic-gradient(from 270deg,
              ${c1}e0 0deg 180deg, 
              ${c4}e0 180deg 225deg, 
              ${c3}e0 225deg 270deg, 
              ${c2}e0 270deg 360deg
            )`,
            position: 'relative',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Linhas de divisão brancas do pratinho */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '0.4px', background: '#fff', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', bottom: 0, width: '0.4px', background: '#fff', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: '0.4px', height: '32px', background: '#fff', transformOrigin: 'top center', transform: 'translateX(-50%) rotate(-45deg)' }} />

            {/* Emojis e Textos dos Setores */}
            {/* 1. Hortaliças (50%) */}
            <div style={{ position: 'absolute', top: '13%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5px' }}>
              <span style={{ fontSize: '5.5px', filter: 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))' }}>🥦🥕🍅</span>
              <span style={{ fontSize: '3px', fontWeight: 900, color: '#fff', textShadow: '0 0.5px 1px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1px', whiteSpace: 'nowrap' }}>Hortaliças (50%)</span>
            </div>

            {/* 2. Carboidratos (25%) */}
            <div style={{ position: 'absolute', bottom: '18%', left: '16%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5px' }}>
              <span style={{ fontSize: '5.5px', filter: 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))' }}>🍚🥔🍠</span>
              <span style={{ fontSize: '2.5px', fontWeight: 900, color: '#fff', textShadow: '0 0.5px 1px rgba(0,0,0,0.4)', textTransform: 'uppercase', width: '22px', textAlign: 'center', lineHeight: 1.1 }}>Carbo (25%)</span>
            </div>

            {/* 3. Proteínas (12.5%) */}
            <div style={{ position: 'absolute', bottom: '12%', right: '23%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2px' }}>
              <span style={{ fontSize: '5.5px', filter: 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))' }}>🍗</span>
              <span style={{ fontSize: '2.8px', fontWeight: 900, color: '#fff', textShadow: '0 0.5px 1px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1px', textAlign: 'center', lineHeight: 1.05 }}>
                Proteína
                <span style={{ display: 'block', fontSize: '2.3px', fontWeight: 800, marginTop: '0.2px' }}>(12.5%)</span>
              </span>
            </div>

            {/* 4. Grãos (12.5%) */}
            <div style={{ position: 'absolute', bottom: '26%', right: '8%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2px' }}>
              <span style={{ fontSize: '5.5px', filter: 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))' }}>🫘</span>
              <span style={{ fontSize: '2.8px', fontWeight: 900, color: '#fff', textShadow: '0 0.5px 1px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1px', textAlign: 'center', lineHeight: 1.05 }}>
                Grãos
                <span style={{ display: 'block', fontSize: '2.3px', fontWeight: 800, marginTop: '0.2px' }}>(12.5%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2x2 com detalhes dos grupos de alimentos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', flexShrink: 0 }}>
        {/* Hortaliças */}
        <div style={{ background: '#fff', border: `0.5px solid ${c1}30`, borderRadius: '3px', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px' }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: c1 }} />
            <span style={{ fontSize: '3px', fontWeight: 800, color: '#333', textTransform: 'uppercase' }}>Hortaliças (50%)</span>
          </div>
          <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.25 }}>Legumes e verduras cozidos ou ralados (cenoura, brócolis, tomate, abóbora).</div>
        </div>

        {/* Carboidratos */}
        <div style={{ background: '#fff', border: `0.5px solid ${c2}30`, borderRadius: '3px', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px' }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: c2 }} />
            <span style={{ fontSize: '3px', fontWeight: 800, color: '#333', textTransform: 'uppercase' }}>Carboidratos (25%)</span>
          </div>
          <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.25 }}>Fontes de energia limpa (arroz integral, batata, mandioca, macarrão, cará).</div>
        </div>

        {/* Proteínas */}
        <div style={{ background: '#fff', border: `0.5px solid ${c3}30`, borderRadius: '3px', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px' }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: c3 }} />
            <span style={{ fontSize: '3px', fontWeight: 800, color: '#333', textTransform: 'uppercase' }}>Proteínas (12.5%)</span>
          </div>
          <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.25 }}>Crescimento e tecidos (frango desfiado, ovo cozido, peixe sem espinhos, carne).</div>
        </div>

        {/* Grãos e Fibras */}
        <div style={{ background: '#fff', border: `0.5px solid ${c4}30`, borderRadius: '3px', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px' }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: c4 }} />
            <span style={{ fontSize: '3px', fontWeight: 800, color: '#333', textTransform: 'uppercase' }}>Grãos (12.5%)</span>
          </div>
          <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.25 }}>Leguminosas ricas em ferro e fibras (feijão carioca/preto, lentilha, grão-de-bico).</div>
        </div>
      </div>

      {/* Dica das Frutas e absorção de Ferro no rodapé */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px', flexShrink: 0 }}>
        {/* Linha da Fruta */}
        <div style={{ background: '#fff', border: '0.5px solid #e2874340', borderRadius: '3px', padding: '2px 5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '4.5px' }}>🍉</span>
          <div style={{ fontSize: '2.8px', color: '#333', lineHeight: 1.2 }}>
            <strong>Sobremesa:</strong> Ofereça sempre uma fruta fresca (de preferência cítrica).
          </div>
        </div>

        {/* Lembrete Dinâmico */}
        <div style={{ background: `${c1}08`, border: `0.5px solid ${c1}25`, borderRadius: '3px', padding: '3.5px 5px', textAlign: 'center' }}>
          <div style={{ fontSize: '3px', fontWeight: 800, color: titleColor, textTransform: 'uppercase', letterSpacing: '0.1px', marginBottom: '1px' }}>💡 Dica de Absorção de Ferro</div>
          <div style={{ fontSize: '2.6px', color: '#555', lineHeight: 1.3 }}>
            Frutas cítricas (laranja, limão, acerola) após a refeição melhoram muito a absorção do ferro não-heme dos vegetais e grãos!
          </div>
        </div>
      </div>
    </div>
  );
}
