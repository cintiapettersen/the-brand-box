'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import BrandTemplateSVG from '../../components/BrandTemplateSVG';
import { STYLE_ICONS } from '../../lib/styleIcons';
import html2canvas from 'html2canvas';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function LogoPreviewHTML({ editData, color, layout = 'stacked', scaleFactor = 1, crm = null, hideTagline = false }) {
  const isScript = editData?.fontStyle === 'script';
  const sizeBoost = editData?.fontSizeBoost || 1;
  const marca = editData?.marca || '';
  const words = marca.split(' ').map(w =>
    isScript ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase()
  );

  let lines, baseSize;
  if (layout === 'horizontal') {
    lines = [words.join(' ')];
    baseSize = marca.length > 18 ? 1.0 : marca.length > 12 ? 1.4 : 1.9;
  } else if (layout === 'balanced' && words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    baseSize = marca.length > 15 ? 1.3 : 1.7;
  } else {
    lines = words;
    baseSize = words.length >= 3 ? (marca.length > 15 ? 1.1 : 1.4) : words.length === 2 ? 1.8 : 2.4;
  }
  const fontSize = `${(baseSize * sizeBoost * scaleFactor).toFixed(2)}rem`;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        fontFamily: `'${editData?.fontFamily || 'Playfair Display'}', serif`,
        fontWeight: editData?.fontWeight || 700,
        fontSize,
        color: color,
        textAlign: 'center',
        lineHeight: editData?.fontLineHeight || (isScript ? 0.9 : 1.1),
        letterSpacing: editData?.fontLetterSpacing || (isScript ? '0px' : '1px'),
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ 
            fontFamily: 'inherit', 
            fontWeight: 'inherit', 
            letterSpacing: 'inherit',
            whiteSpace: layout === 'horizontal' ? 'nowrap' : 'normal'
          }}>{line}</div>
        ))}
      </div>
      {(editData?.tagline && !hideTagline) && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${(0.42 * scaleFactor).toFixed(2)}rem`, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999', marginTop: `${6 * scaleFactor}px`, textAlign: 'center', lineHeight: 1.2, maxWidth: '100%', whiteSpace: 'nowrap' }}>
          {editData.tagline}
        </div>
      )}
      {crm && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${(0.35 * scaleFactor).toFixed(2)}rem`, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginTop: `${3 * scaleFactor}px`, textAlign: 'center', opacity: 0.8 }}>
          {crm}
        </div>
      )}
    </div>
  );
}

function ColorDot({ color, selected, onClick, size = 32 }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: color,
        cursor: 'pointer',
        border: selected ? '3px solid #333' : '2px solid transparent',
        boxShadow: selected
          ? '0 0 0 1px #333, 0 2px 8px rgba(0,0,0,0.15)'
          : '0 2px 6px rgba(0,0,0,0.12)',
        transform: selected ? 'scale(1.18)' : 'scale(1)',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '8px' }}>
      {children}
    </p>
  );
}

const MAX_GENERATIONS = 15;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

function tint(hex, amount) {
  const [r,g,b] = hexToRgb(hex);
  const t = v => Math.round(v + (255-v)*amount).toString(16).padStart(2,'0');
  return `#${t(r)}${t(g)}${t(b)}`;
}

// Mesmo dicionário afetivo do BrandBoard — garante consistência
const COLOR_PALETTE_AFETIVA = [
  [255,198,37,'Sol de Verão'],[255,223,186,'Pêssego Suave'],[255,182,193,'Rosa Algodão'],
  [255,105,120,'Framboesa'],[220,20,60,'Carmim Intenso'],[255,0,100,'Dose de Amor'],
  [180,0,60,'Amora Selvagem'],[255,140,0,'Âmbar Quente'],[230,100,30,'Terracota'],
  [210,140,100,'Adobe Rosado'],[188,143,143,'Rosewood Suave'],[205,170,125,'Linho Dourado'],
  [245,222,179,'Baunilha'],[250,240,227,'Creme Delicado'],[144,238,144,'Verde Menta'],
  [102,204,102,'Musgo Vivo'],[60,140,60,'Folha Densa'],[34,100,34,'Floresta'],
  [143,188,143,'Salvia'],[176,224,230,'Névoa Matinal'],[135,206,250,'Céu Aberto'],
  [100,180,230,'Azul Serenidade'],[70,130,180,'Azul Aço'],[25,90,180,'Índigo Profundo'],
  [100,149,237,'Azul Lavanda'],[60,100,200,'Safira'],[0,70,140,'Azul Marinho'],
  [200,162,200,'Lavanda Rosa'],[186,130,200,'Malva Seda'],[148,103,189,'Ametista'],
  [102,51,153,'Violeta Real'],[80,0,120,'Roxo Profundo'],[255,228,225,'Misty Rose'],
  [255,192,203,'Blush Seda'],[240,200,220,'Quartzo Rosa'],[220,180,200,'Rosé Antigo'],
  [190,150,170,'Borgonha Suave'],[245,245,245,'Branco Algodão'],[220,220,220,'Prata Suave'],
  [180,180,180,'Cinza Névoa'],[120,120,120,'Granito'],[60,60,60,'Carvão'],
  [30,30,30,'Noite Profunda'],[255,250,200,'Limão Docinho'],[200,230,170,'Pistache'],
  [170,220,200,'Água Turquesa'],[64,190,172,'Verde Jade'],[0,150,136,'Esmeralda Serena'],
  [255,87,51,'Coral Vivo'],[255,160,122,'Salmão'],[210,105,30,'Canela'],
];

function colorNamePT(hex) {
  if (!hex || hex.length < 7) return 'Cor Especial';
  const [r,g,b] = hexToRgb(hex);
  let minDist = Infinity, bestName = 'Tom Especial';
  for (const [cr,cg,cb,name] of COLOR_PALETTE_AFETIVA) {
    const dist = Math.sqrt((r-cr)**2+(g-cg)**2+(b-cb)**2);
    if (dist < minDist) { minDist = dist; bestName = name; }
  }
  return bestName;
}

function CopyHex({ hex, accent }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{hex}</span>
      <span style={{ fontSize: '0.6rem', color: copied ? accent : '#ccc', fontWeight: 700, transition: 'color 0.2s' }}>{copied ? '✓' : '⎘'}</span>
    </button>
  );
}

function formatPaletaNome(nome) {
  if (!nome) return '';
  return nome.split('-')
    .filter(w => w && !/^\d+$/.test(w) && w.toLowerCase() !== 'paleta')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function CoresStep({ paletteColors, accentColor, paletaNome, coresRef }) {
  const tints = [0.25, 0.50, 0.72, 0.88];
  const roleLabels = ['Principal', 'Secundária', 'Terciária', 'Complementar', 'Apoio'];

  return (
    <div ref={coresRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {paletaNome && (
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          {formatPaletaNome(paletaNome)}
        </p>
      )}
      {paletteColors.map((hex, ci) => (
        <div key={ci} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#fff' }}>
          {/* Swatch principal */}
          <div style={{ background: hex, height: '100px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              {roleLabels[ci] || 'Cor'}
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              {colorNamePT(hex)}
            </p>
          </div>
          {/* Hex principal */}
          <div style={{ padding: '8px 16px 6px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.62rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>cor paleta principal</span>
            <CopyHex hex={hex} accent={accentColor} />
          </div>
          {/* Tints */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {tints.map((amount, ti) => {
              const tHex = tint(hex, amount);
              return (
                <div key={ti} style={{ borderRight: ti < 3 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ background: tHex, height: '54px' }} />
                  <div style={{ padding: '6px 8px', borderTop: '1px solid #f0f0f0' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '0.55rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>tom {ti+1}</p>
                    <CopyHex hex={tHex} accent={accentColor} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const ICON_PATHS = {
  endereco: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  telefone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  site: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
};

const CONTACT_FIELDS = [
  { key: 'telefone',  label: '📞 Telefone',  placeholder: '(11) 99999-9999' },
  { key: 'whatsapp', label: '💬 WhatsApp',  placeholder: '(11) 99999-9999' },
  { key: 'email',    label: '✉️ E-mail',     placeholder: 'contato@suamarca.com' },
  { key: 'site',     label: '🌐 Site',       placeholder: 'https://suamarca.com' },
  { key: 'instagram',label: '📸 Instagram', placeholder: '@suamarca' },
  { key: 'endereco', label: '📍 Endereço',   placeholder: 'Rua, número — Cidade' },
];

function buildLink(key, value) {
  if (!value) return null;
  try {
    switch (key) {
      case 'telefone': return `tel:+55${value.replace(/\D/g, '')}`;
      case 'whatsapp': {
        // Se começa com +, já é formato internacional — usa direto
        if (value.trim().startsWith('+')) {
          return `https://wa.me/${value.replace(/\D/g, '')}`;
        }
        const digits = value.replace(/\D/g, '');
        // 12+ dígitos sem + = já tem código de país; senão adiciona Brasil (55)
        const num = digits.length >= 12 ? digits : `55${digits}`;
        return `https://wa.me/${num}`;
      }
      case 'email': return value.includes('@') ? `mailto:${value}` : null;
      case 'site': return value.startsWith('http') ? value : `https://${value}`;
      case 'instagram': return `https://instagram.com/${value.replace('@', '')}`;
      case 'endereco': return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
      default: return null;
    }
  } catch { return null; }
}

function CartaoStep({ brand, accentColor, paletteColors, marca, estampaPatterns, estampaSelectedIdx, contacts, setContacts, qrLink, setQrLink, showQR, setShowQR, logoLayout, editData, logoColor, setLayout }) {
  const [localSlogan, setLocalSlogan] = useState(editData?.tagline || '');
  const setContact = (key, val) => setContacts(prev => ({ ...prev, [key]: val }));
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;
  const colors = paletteColors.length ? paletteColors : [accentColor];
  const activeContacts = CONTACT_FIELDS.filter(f => contacts[f.key]);
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', background: '#fff', textAlign: 'left' };

  const downloadHTML = (returnOnly = false) => {
    const iconsHtml = activeContacts.map((f, i) => {
      const link = buildLink(f.key, contacts[f.key]);
      const color = colors[i % colors.length];
      return `<a href="${link || '#'}" target="_blank" rel="noopener" style="width:54px;height:54px;border-radius:12px;background:${color};display:inline-flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,0.15);transition:transform 0.15s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="${ICON_PATHS[f.key]}"/></svg>
      </a>`;
    }).join('');
    const qrHtml = showQR && qrLink ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrLink)}&bgcolor=ffffff" width="100" height="100" style="border-radius:8px;margin-top:8px;" />` : '';
    const patternStyle = patternSrc ? `background-image:url(${patternSrc});background-size:22%;background-repeat:repeat;` : 'background:#f5f5f5;';
    const fontUrl = `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=${encodeURIComponent(editData.fontFamily || 'Playfair Display')}:ital,wght@0,400;1,400&display=swap`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${marca || 'Cartão Digital'}</title>
<link href="${fontUrl}" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0ece6;font-family:'Montserrat',sans-serif;padding:20px;}</style>
</head>
<body>
<div style="border-radius:20px;overflow:hidden;${patternStyle}padding:14px;box-shadow:0 8px 40px rgba(0,0,0,0.13);max-width:480px;width:100%;">
  <div style="background:#fff;border-radius:12px;padding:28px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:14px;">
    <div style="text-align:center;">
      <p style="font-family:'Montserrat',sans-serif;font-size:1.8rem;font-weight:800;color:${accentColor};text-transform:uppercase;letter-spacing:3px;">${marca || ''}</p>
      ${editData.tagline ? `<p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">${editData.tagline}</p>` : ''}
    </div>
    <div style="width:50%;height:1px;background:#eee;"></div>
    <p style="text-align:center;font-size:0.72rem;color:#aaa;font-family:'Montserrat',sans-serif;letter-spacing:0.5px;">Como prefere entrar em contato?</p>
    ${activeContacts.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-start;width:100%;margin-top:4px;">${iconsHtml}</div>` : ''}
    ${qrHtml}
  </div>
</div>
</body>
</html>`;
    if (returnOnly) return html;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.download = `${marca || 'marca'}-cartao-digital.html`;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      {/* Preview interativo */}
      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
        backgroundImage: patternSrc ? `url(${patternSrc})` : undefined,
        background: patternSrc ? undefined : '#f5f5f5',
        backgroundSize: '22%', backgroundRepeat: 'repeat',
        padding: '14px',
      }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative' }}>
          {/* QR discreto no canto superior direito */}
          {showQR && qrLink && (
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrLink)}&bgcolor=ffffff&color=555555`} alt="QR" width={42} height={42} style={{ borderRadius: '5px', display: 'block' }} crossOrigin="anonymous" />
            </div>
          )}
          <div style={{ width: '70%', maxWidth: '210px' }}>
            <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={accentColor} layout={logoLayout} />
          </div>

          <div style={{ width: '50%', height: '1px', background: '#eee' }} />
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.5px' }}>
            Como prefere entrar em contato?
          </p>
          {activeContacts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start', width: '100%', marginTop: '4px' }}>
              {activeContacts.map((f, i) => {
                const link = buildLink(f.key, contacts[f.key]);
                return (
                  <a key={f.key} href={link || undefined} target="_blank" rel="noopener noreferrer"
                    onClick={e => { if (!link) e.preventDefault(); }}
                    style={{ width: 54, height: 54, borderRadius: '12px', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'transform 0.15s', cursor: link ? 'pointer' : 'default' }}
                  >
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                      <path d={ICON_PATHS[f.key]} />
                    </svg>
                  </a>
                );
              })}
            </div>
          )}
          {activeContacts.length === 0 && (
            <p style={{ color: '#ccc', fontSize: '0.8rem', textAlign: 'center' }}>Preencha os contatos abaixo</p>
          )}
        </div>
      </div>

      {/* Seletor de Layout (Fora do cartão para não sair no download) */}
      {marca.split(' ').length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '0.4rem' }}>
          {['horizontal', 'balanced', 'stacked'].map(l => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                border: '1px solid', borderColor: logoLayout === l ? accentColor : '#eee',
                background: logoLayout === l ? `${accentColor}10` : '#fff',
                color: logoLayout === l ? accentColor : '#888', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {l === 'horizontal' ? 'Horizontal' : l === 'balanced' ? '2 Linhas' : 'Empilhada'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
        <button onClick={async () => {
          const html = downloadHTML(true);
          const file = new File([new Blob([html], { type: 'text/html' })], `${marca || 'marca'}-cartao-digital.html`, { type: 'text/html' });
          if (navigator.canShare?.({ files: [file] })) {
            try { await navigator.share({ files: [file], title: `Cartão Digital — ${marca || 'Marca'}` }); return; } catch {}
          }
          downloadHTML();
        }} style={{ flex: 1, padding: '13px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          ↑ Compartilhar
        </button>
        <button onClick={downloadHTML} style={{ flex: 1, padding: '13px', background: 'none', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          ⬇ Baixar HTML
        </button>
      </div>

      {/* Campos editáveis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SectionLabel>Slogan / Especialidade</SectionLabel>
        <input value={localSlogan} onChange={e => setLocalSlogan(e.target.value)} placeholder="Ex: Ginecologia e Obstetrícia" style={inputStyle} />
        
        <SectionLabel>Contatos</SectionLabel>
        {CONTACT_FIELDS.map(f => (
          <input key={f.key} value={contacts[f.key]} onChange={e => setContact(f.key, e.target.value)} placeholder={f.label} style={inputStyle} />
        ))}
        <button onClick={() => setShowQR(v => !v)} style={{ padding: '10px', background: showQR ? accentColor : 'none', color: showQR ? '#fff' : accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}>
          {showQR ? '✓ QR Code ativo' : '+ QR Code'}
        </button>
        {showQR && (
          <input value={qrLink} onChange={e => setQrLink(e.target.value)} placeholder="Link para o QR Code (site, WhatsApp...)" style={inputStyle} />
        )}
      </div>
    </div>
  );
}

function EstampaStep({ brand, accentColor, marca, patterns, setPatterns, genCount, setGenCount, selectedIdx, setSelectedIdx, paletteColors }) {
  const [generating, setGenerating] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  const remaining = MAX_GENERATIONS - genCount;
  const patternSrc = patterns[selectedIdx]
    ? `data:${patterns[selectedIdx].mimeType};base64,${patterns[selectedIdx].base64}`
    : null;

  const generate = async () => {
    if (genCount >= MAX_GENERATIONS) return;
    setGenerating(true);
    try {
      const paletas = brand.paletas || [];
      const sel = paletas.find(p => p.id === brand.selectedPaleta);
      const cores = sel?.paleta_hex || sel?.cores_hex || [];
      const estampas = brand.estampas || [];
      // Sorteia as referências para garantir que não use sempre as mesmas 2
      const shuffled = [...estampas].sort(() => Math.random() - 0.5);
      const refs = shuffled.map(e => e.image_url).filter(Boolean);

      const res = await fetch('/api/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paleta: paletteColors,
          estiloNome: brand.resultadoFinal?.estiloNome || '',
          marca: marca || brand.formData?.marca || '',
          descricao: brand.resultadoFinal?.mensagem || '',
          referenceUrls: refs,
        }),
      });
      const data = await res.json();
      const novos = (data.images || []).filter(p => p.base64);
      if (novos.length > 0) {
        setPatterns(prev => {
          const next = [...prev, ...novos];
          setSelectedIdx(next.length - 1);
          return next;
        });
        setGenCount(c => c + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const download = () => {
    if (!patternSrc) return;
    const link = document.createElement('a');
    link.download = `${marca || 'estampa'}-padrao.png`;
    link.href = patternSrc;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {patternSrc && (
        <div style={{ display: 'flex', background: '#f0f0ee', borderRadius: '30px', padding: '3px', gap: '2px' }}>
          {['Estampa', 'No consultório'].map(label => (
            <button key={label} onClick={() => setShowMockup(label === 'No consultório')}
              style={{ flex: 1, padding: '8px', borderRadius: '26px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                background: (label === 'No consultório') === showMockup ? '#fff' : 'transparent',
                color: (label === 'No consultório') === showMockup ? '#1a1a1a' : '#aaa',
                boxShadow: (label === 'No consultório') === showMockup ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                transition: 'all 0.15s ease' }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {patternSrc ? (
        <>
          {showMockup ? (
            <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', position: 'relative' }}>
              <img src="/mockups/clinica.jpg" alt="consultório" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${patternSrc})`,
                backgroundSize: '28%', backgroundRepeat: 'repeat',
                mixBlendMode: 'normal',
                opacity: 0.52,
                WebkitMaskImage: 'url(/mockups/clinica-mask.svg)',
                WebkitMaskSize: 'cover',
                WebkitMaskRepeat: 'no-repeat',
                maskImage: 'url(/mockups/clinica-mask.svg)',
                maskSize: 'cover',
                maskRepeat: 'no-repeat',
              }} />
            </div>
          ) : (
            <div style={{
              width: '100%', aspectRatio: '1 / 1', borderRadius: '16px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
              backgroundImage: `url(${patternSrc})`,
              backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }} />
          )}
          {patterns.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {patterns.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div onClick={() => setSelectedIdx(i)}
                    style={{ width: 44, height: 44, borderRadius: '8px', cursor: 'pointer',
                      backgroundImage: `url(data:${p.mimeType};base64,${p.base64})`,
                      backgroundSize: 'cover',
                      border: selectedIdx === i ? `3px solid ${accentColor}` : '2px solid #e0e0e0',
                      boxShadow: selectedIdx === i ? `0 0 0 1px ${accentColor}` : 'none' }} />
                  {patterns.length > 1 && (
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setPatterns(prev => {
                        const next = prev.filter((_, idx) => idx !== i);
                        if (selectedIdx >= next.length) setSelectedIdx(Math.max(0, next.length - 1));
                        return next;
                      });
                    }} style={{ 
                      position: 'absolute', top: -6, right: -6, 
                      width: 18, height: 18, minWidth: 18,
                      borderRadius: '50%', background: '#ff4444', color: '#fff', 
                      border: '1px solid #fff', fontSize: '12px', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      padding: 0, margin: 0, zIndex: 10, lineWeight: 1,
                      textAlign: 'center'
                    }}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#bbb' }}>
          <span style={{ fontSize: '2rem' }}>✨</span>
          <span style={{ fontSize: '0.9rem' }}>Nenhuma estampa gerada ainda</span>
        </div>
      )}

      {patternSrc && (
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#999', margin: '-5px 0 5px' }}>
          💡 As estampas geradas ficam salvas na galeria acima.<br/>Clique nas miniaturas para alternar entre as versões.
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {patternSrc && (
          <button onClick={download} style={{ flex: 1, padding: '13px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            ⬇ Baixar
          </button>
        )}
        {remaining > 0 && (
          <button
            onClick={generate}
            disabled={generating}
            style={{ flex: 1, padding: '13px 8px', background: 'none', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: generating ? 0.6 : 1 }}
          >
            {generating ? '✨ Tecendo suas estampas... (isso leva uns 15s)' : `✨ ${patternSrc ? 'Gerar novas opções' : 'Gerar estampa'}`}
          </button>
        )}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb' }}>
        {remaining > 0 ? `${remaining} ${remaining > 1 ? 'gerações restantes' : 'geração restante'}` : 'Limite de gerações atingido'}
      </p>
    </div>
  );
}

const TONE_MAP = {
  'Romântico': ['Afetivo','Acolhedor','Delicado','Elegante','Emotivo'],
  'Minimalista': ['Limpo','Objetivo','Sofisticado','Atemporal','Preciso'],
  'Clássico': ['Tradicional','Confiável','Elegante','Sólido','Respeitável'],
  'Moderno': ['Inovador','Ousado','Dinâmico','Atual','Direto'],
  'Divertido': ['Alegre','Criativo','Espontâneo','Colorido','Vibrante'],
  'Luxo': ['Exclusivo','Refinado','Premium','Sofisticado','Elevado'],
  'Natural': ['Orgânico','Autêntico','Gentil','Consciente','Leve'],
  'Infantil': ['Lúdico','Carinhoso','Colorido','Imaginativo','Seguro'],
};

function deriveTone(estiloNome) {
  for (const [key, words] of Object.entries(TONE_MAP)) {
    if (estiloNome?.toLowerCase().includes(key.toLowerCase())) return words;
  }
  return ['Autêntico','Único','Memorável','Confiável','Acolhedor'];
}

function buildGuiaHTML({ marca, tagline, accentColor, paletteColors, fontFamily, fontWeight, patternSrc, estiloNome, mensagem, isScript }) {
  const fontEnc = encodeURIComponent(fontFamily);
  const fontUrl = `https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=${fontEnc}:ital,wght@0,400;0,700;1,400&display=swap`;
  const roleLabels = ['Principal','Secundária','Terciária','Complementar','Apoio'];
  const toneWords = deriveTone(estiloNome);

  const colorsHtml = paletteColors.map((hex, i) => {
    const [r,g,b] = [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    let minDist = Infinity, bestName = 'Tom Especial';
    for (const [cr,cg,cb,name] of COLOR_PALETTE_AFETIVA) {
      const d = Math.sqrt((r-cr)**2+(g-cg)**2+(b-cb)**2);
      if (d < minDist) { minDist = d; bestName = name; }
    }
    return `<div style="border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">
      <div style="height:110px;background:${hex};"></div>
      <div style="padding:10px 10px 12px;background:#fafafa;border:1px solid #f0f0f0;border-top:none;border-radius:0 0 12px 12px;">
        <p style="font-size:0.62rem;font-weight:800;color:#444;margin-bottom:3px;font-family:Montserrat,sans-serif;">${bestName}</p>
        <p style="font-size:0.6rem;font-family:monospace;color:#888;">${hex.toUpperCase()}</p>
        <p style="font-size:0.55rem;font-weight:700;color:#bbb;letter-spacing:1px;text-transform:uppercase;margin-top:4px;font-family:Montserrat,sans-serif;">${roleLabels[i]||'Cor'}</p>
      </div>
    </div>`;
  }).join('');

  const patternHtml = patternSrc
    ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;align-items:center;">
        <div style="height:160px;border-radius:12px;background-image:url(${patternSrc});background-size:40%;border:1px solid #f0f0f0;"></div>
        <div>
          <p style="font-size:0.8rem;color:#555;line-height:1.7;font-family:Montserrat,sans-serif;">A estampa é aplicada em embalagens, papelaria, tecidos e papel de parede.</p>
          <p style="font-size:0.75rem;color:#999;margin-top:10px;font-family:Montserrat,sans-serif;">Para gráficas: solicite arquivo PNG em alta resolução (300 dpi). A estampa é repetível — informe o padrão de repetição ao fornecedor.</p>
        </div>
      </div>`
    : `<p style="font-size:0.8rem;color:#bbb;margin-top:16px;font-family:Montserrat,sans-serif;">Estampa não gerada.</p>`;

  const keywordsHtml = toneWords.map((w, i) =>
    `<span style="padding:8px 18px;border-radius:20px;font-size:0.78rem;font-weight:600;font-family:Montserrat,sans-serif;${i % 2 === 0 ? `background:${accentColor};color:#fff;` : `border:1.5px solid ${accentColor};color:${accentColor};background:transparent;`}">${w}</span>`
  ).join('');

  const marcaDisplay = isScript
    ? (marca || 'Sua Marca').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : (marca || 'SUA MARCA').toUpperCase();

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Guia de Marca — ${marca || 'Marca'}</title>
<link href="${fontUrl}" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Montserrat',sans-serif;background:#f0ece6;color:#1a1a1a;}
.page{width:794px;background:#fff;margin:0 auto 32px;padding:60px 64px;min-height:1000px;position:relative;}
.divider{height:1px;background:#efefef;margin:32px 0;}
.sec-label{font-size:0.58rem;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#ccc;display:flex;align-items:center;gap:14px;margin-bottom:20px;}
.sec-label::before,.sec-label::after{content:'';flex:1;height:1px;background:#efefef;}
.print-btn{position:fixed;bottom:30px;right:30px;padding:14px 28px;background:${accentColor};color:#fff;border:none;border-radius:30px;font-weight:700;font-size:0.95rem;cursor:pointer;font-family:'Montserrat',sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:999;}
@media print{
  body{background:white;}
  .page{margin:0;padding:50px 56px;page-break-after:always;min-height:auto;}
  .print-btn{display:none;}
  @page{size:A4;margin:0;}
}
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Salvar como PDF</button>

<!-- CAPA -->
<div class="page" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:1100px;text-align:center;">
  <div style="width:50px;height:2px;background:${accentColor};margin:0 auto 48px;"></div>
  <p style="font-size:0.58rem;letter-spacing:6px;text-transform:uppercase;color:#ccc;margin-bottom:64px;">Guia de Identidade Visual</p>
  <h1 style="font-family:'${fontFamily}',serif;font-weight:${fontWeight};font-size:4rem;color:${accentColor};letter-spacing:${isScript ? '0px' : '2px'};line-height:1;margin-bottom:14px;">${marcaDisplay}</h1>
  ${tagline ? `<p style="font-size:0.68rem;letter-spacing:4px;text-transform:uppercase;color:#aaa;margin-bottom:64px;">${tagline}</p>` : '<div style="height:64px;"></div>'}
  <div style="width:50px;height:1px;background:#e0e0e0;margin:0 auto 24px;"></div>
  <p style="font-size:0.55rem;letter-spacing:5px;text-transform:uppercase;color:#ddd;">The Brand Box</p>
</div>

<!-- PALETA DE CORES -->
<div class="page">
  <div class="sec-label">Paleta de Cores</div>
  <div style="display:grid;grid-template-columns:repeat(${paletteColors.length},1fr);gap:10px;">
    ${colorsHtml}
  </div>
  <div class="divider"></div>
  <p style="font-size:0.75rem;color:#888;line-height:1.7;">Use a cor <strong style="color:#444;">${colorNamePT(paletteColors[0] || accentColor)}</strong> como principal — ela deve predominar em todas as comunicações. As demais cores funcionam como apoio e devem ser utilizadas com equilíbrio.</p>
</div>

<!-- TIPOGRAFIA -->
<div class="page">
  <div class="sec-label">Tipografia</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">
    <div>
      <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:12px;">Fonte Principal</p>
      <p style="font-family:'${fontFamily}',serif;font-weight:${fontWeight};font-size:2.6rem;color:${accentColor};line-height:1;margin-bottom:10px;">${fontFamily}</p>
      <p style="font-family:'${fontFamily}',serif;font-size:1.1rem;color:#666;line-height:1.6;margin-bottom:6px;">Aa Bb Cc Dd Ee Ff Gg</p>
      <p style="font-family:'${fontFamily}',serif;font-size:0.9rem;color:#999;line-height:1.6;">1 2 3 4 5 6 7 8 9 0</p>
    </div>
    <div>
      <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:12px;">Fonte de Apoio</p>
      <p style="font-family:'Montserrat',sans-serif;font-weight:600;font-size:2.2rem;color:#444;line-height:1;margin-bottom:10px;">Montserrat</p>
      <p style="font-family:'Montserrat',sans-serif;font-size:1.1rem;color:#666;line-height:1.6;margin-bottom:6px;">Aa Bb Cc Dd Ee Ff Gg</p>
      <p style="font-family:'Montserrat',sans-serif;font-size:0.9rem;color:#999;line-height:1.6;">1 2 3 4 5 6 7 8 9 0</p>
    </div>
  </div>
  <div class="divider"></div>
  <p style="font-size:0.75rem;color:#888;line-height:1.7;">Use <strong style="color:#444;">${fontFamily}</strong> em títulos, logomarca e destaques. Use <strong style="color:#444;">Montserrat</strong> em textos corridos, legendas e informações de apoio.</p>
</div>

<!-- ESTAMPA -->
<div class="page">
  <div class="sec-label">Estampa Exclusiva</div>
  ${patternHtml}
</div>

<!-- DICAS PRÁTICAS -->
<div class="page">
  <div class="sec-label">Dicas Práticas de Uso</div>
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div style="padding:20px 22px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;display:flex;gap:16px;align-items:flex-start;">
      <span style="font-size:1.4rem;flex-shrink:0;">📁</span>
      <div>
        <h4 style="font-size:0.72rem;font-weight:800;color:#333;margin-bottom:6px;font-family:Montserrat,sans-serif;">Arquivos da logo</h4>
        <p style="font-size:0.78rem;color:#666;line-height:1.6;font-family:Montserrat,sans-serif;">Use o arquivo <strong>PNG sem fundo</strong> em materiais digitais e sobre fundos coloridos. Use o <strong>PNG com fundo branco</strong> para impressão simples (banners, folhetos, camisetas). Nunca envie foto da tela para uma gráfica.</p>
      </div>
    </div>
    <div style="padding:20px 22px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;display:flex;gap:16px;align-items:flex-start;">
      <span style="font-size:1.4rem;flex-shrink:0;">🎨</span>
      <div>
        <h4 style="font-size:0.72rem;font-weight:800;color:#333;margin-bottom:6px;font-family:Montserrat,sans-serif;">Cores</h4>
        <p style="font-size:0.78rem;color:#666;line-height:1.6;font-family:Montserrat,sans-serif;">Use sempre os códigos hexadecimais desta paleta. No Canva, cole o código da cor no campo de cor personalizada. Nunca substitua por cores similares — pequenas variações quebram a consistência da marca.</p>
      </div>
    </div>
    <div style="padding:20px 22px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;display:flex;gap:16px;align-items:flex-start;">
      <span style="font-size:1.4rem;flex-shrink:0;">🌀</span>
      <div>
        <h4 style="font-size:0.72rem;font-weight:800;color:#333;margin-bottom:6px;font-family:Montserrat,sans-serif;">Estampa para gráficas e fornecedores</h4>
        <p style="font-size:0.78rem;color:#666;line-height:1.6;font-family:Montserrat,sans-serif;">Solicite o arquivo PNG em <strong>alta resolução (300 dpi)</strong>. Informe ao fornecedor que é uma estampa repetível — ele deve aplicar no modo <em>tile</em> ou <em>repeat</em>. Serve para papel de parede, tecido, embalagens e adesivos.</p>
      </div>
    </div>
    <div style="padding:20px 22px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;display:flex;gap:16px;align-items:flex-start;">
      <span style="font-size:1.4rem;flex-shrink:0;">📱</span>
      <div>
        <h4 style="font-size:0.72rem;font-weight:800;color:#333;margin-bottom:6px;font-family:Montserrat,sans-serif;">Redes sociais</h4>
        <p style="font-size:0.78rem;color:#666;line-height:1.6;font-family:Montserrat,sans-serif;">Use a logo sempre sobre fundo branco, creme ou da cor principal da marca. Mantenha a mesma paleta de cores e o mesmo estilo de edição nos posts para criar identidade visual consistente.</p>
      </div>
    </div>
    <div style="padding:20px 22px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;display:flex;gap:16px;align-items:flex-start;">
      <span style="font-size:1.4rem;flex-shrink:0;">✍️</span>
      <div>
        <h4 style="font-size:0.72rem;font-weight:800;color:#333;margin-bottom:6px;font-family:Montserrat,sans-serif;">Fontes</h4>
        <p style="font-size:0.78rem;color:#666;line-height:1.6;font-family:Montserrat,sans-serif;">Use <strong>Montserrat</strong> para textos do dia a dia (disponível grátis no Google Fonts). Canva, Word e Google Apresentações aceitam fontes do Google Fonts — busque por Montserrat para instalá-la.</p>
      </div>
    </div>
  </div>
</div>

<!-- TOM DE VOZ -->
<div class="page">
  <div class="sec-label">Tom de Voz</div>
  ${mensagem ? `<p style="font-size:0.82rem;color:#666;line-height:1.8;margin-bottom:28px;">${mensagem}</p>` : ''}
  <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:16px;">Palavras-chave da personalidade</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px;">
    ${keywordsHtml}
  </div>
  <div class="divider"></div>
  <p style="font-size:0.75rem;color:#888;line-height:1.7;">Sua comunicação deve sempre refletir esses valores. Seja nas redes sociais, embalagens, atendimento ou conteúdo: a identidade visual e o tom de voz devem caminhar juntos.</p>
  <div style="margin-top:40px;padding-top:32px;border-top:1px solid #f0f0f0;text-align:center;">
    <p style="font-size:0.55rem;letter-spacing:4px;text-transform:uppercase;color:#ddd;">The Brand Box • Identidade Visual Profissional</p>
  </div>
</div>

</body>
</html>`;
}

function GuiaStep({ brand, accentColor, paletteColors, marca, tagline, estampaPatterns, estampaSelectedIdx, editData }) {
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx]
    ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`
    : null;
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const mensagem = brand.resultadoFinal?.mensagem || '';
  const fontFamily = editData.fontFamily || 'Playfair Display';
  const fontWeight = editData.fontWeight || 700;
  const isScript = editData.fontStyle === 'script';
  const toneWords = deriveTone(estiloNome);

  const getPapelariaItems = () => {
    // Liberação total de todos os itens para revisão completa
    return ['Cartão de Visita', 'Atestado Médico', 'Pasta', 'Receituário', 'Envelope Ofício', 'Envelope Saco', 'Recibo', 'Timbrado'];
  };

  const marcaFormatted = isScript
    ? (marca || 'Sua Marca').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : (marca || 'SUA MARCA').toUpperCase();

  const openPrint = () => {
    const html = buildGuiaHTML({ marca, tagline, accentColor, paletteColors, fontFamily, fontWeight, patternSrc, estiloNome, mensagem, isScript });
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Preview compacto */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        {/* Capa mini */}
        <div style={{ background: accentColor, padding: '28px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.52rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Guia de Identidade Visual</p>
          <h2 style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: '1.8rem', color: '#fff', letterSpacing: isScript ? '0px' : '1px', lineHeight: 1 }}>{marcaFormatted}</h2>
          {tagline && <p style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>{tagline}</p>}
        </div>

        {/* Paleta */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>Paleta de Cores</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {paletteColors.map((hex, i) => (
              <div key={i} style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: hex, height: '40px' }} />
                <p style={{ fontSize: '0.48rem', textAlign: 'center', color: '#aaa', padding: '3px 0', fontFamily: 'monospace' }}>{hex.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipografia */}
        <div className="mobile-wrap" style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '6px' }}>Fonte Principal</p>
            <p style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: '1.2rem', color: accentColor }}>{fontFamily}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '6px' }}>Apoio</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#888' }}>Montserrat</p>
          </div>
        </div>

        {/* Tom de voz */}
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>Tom de Voz</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {toneWords.map((w, i) => (
              <span key={w} style={{ padding: '5px 12px', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600, background: i % 2 === 0 ? accentColor : 'transparent', color: i % 2 === 0 ? '#fff' : accentColor, border: `1.5px solid ${accentColor}` }}>{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Botão */}
      <button
        onClick={openPrint}
        style={{ width: '100%', padding: '15px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        ⬇ Baixar Guia em PDF
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#bbb' }}>
        Uma nova aba abrirá — use "Salvar como PDF" no menu de impressão.<br/>
        <span style={{ fontSize: '0.62rem', color: '#ccc' }}>(Se não abrir, verifique se seu navegador bloqueou Pop-ups)</span>
      </p>
    </div>
  );
}

function CartaoRetornoPreview({ accentColor, patternSrc, cartaoContacts, crmLine, editData, logoColor, comBorda, setComBorda, clinicaNome, setClinicaNome, logoLayout, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const brandFont = `'${editData?.fontFamily || 'Playfair Display'}', serif`;
  const { endereco, whatsapp, telefone, telefone2, instagram, site } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const solidColor = borderColor || accentColor;

  const rows = (count, h = '16px') => Array.from({ length: count }).map((_, i) => (
    <div key={i} style={{ display: 'flex', borderBottom: '1px solid #eee', height: h, alignItems: 'center' }}>
      <div style={{ flex: 1, borderRight: '1px solid #eee', height: '100%' }} />
      <div style={{ flex: 1, height: '100%' }} />
    </div>
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* FRENTE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Frente</p>
          <div style={{ width: '184px', height: '320px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
            {comBorda && patternSrc
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: '100px', backgroundRepeat: 'repeat', zIndex: 0 }} />
              : <div style={{ position: 'absolute', inset: 0, border: `14px solid ${solidColor}`, zIndex: 0 }} />}
            
            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', background: '#fff', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
                <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.27} />
              </div>
              {crmLine && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '3.3px', color: '#999', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px', marginTop: '-6px', whiteSpace: 'nowrap' }}>{crmLine}</div>}
              
              <div style={{ background: accentColor, color: '#fff', width: '100%', padding: '4px 0', fontSize: '6.5px', fontWeight: 800, textAlign: 'center', letterSpacing: '1px', borderRadius: '2px', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>
                RETORNO DE CONSULTAS
              </div>

              {/* Tabela Pequena */}
              <div style={{ width: '100%', border: '1px solid #efefef', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', background: `${accentColor}15`, borderBottom: '1px solid #efefef' }}>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', borderRight: '1px solid #efefef', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>Data</div>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>Horário</div>
                </div>
                {rows(8, '22px')}
              </div>
            </div>
          </div>
        </div>

        {/* VERSO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Verso</p>
          <div style={{ width: '184px', height: '320px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
            {comBorda && patternSrc
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: '100px', backgroundRepeat: 'repeat', zIndex: 0 }} />
              : <div style={{ position: 'absolute', inset: 0, border: `14px solid ${solidColor}`, zIndex: 0 }} />}
            
            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', background: '#fff', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 8px' }}>
              {/* Tabela Grande */}
              <div style={{ width: '100%', border: '1px solid #efefef', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ display: 'flex', background: `${accentColor}15`, borderBottom: '1px solid #efefef' }}>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', borderRight: '1px solid #efefef', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>Data</div>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>Horário</div>
                </div>
                {rows(12, '18px')}
              </div>

              {/* Rodapé */}
              <div style={{ width: '100%', textAlign: 'left', borderTop: '0.6px solid #eee', paddingTop: '4px', marginTop: 'auto' }}>
                <div style={{ fontFamily: brandFont, fontSize: '5.5px', color: accentColor, fontWeight: 700 }}>{clinicaNome || editData.marca}</div>
                <div style={{ fontSize: '3.4px', color: '#888', marginTop: '1.2px', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.2 }}>
                  {endereco && <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{endereco}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '1px' }}>
                     {instagram && <span>@{instagram}</span>}
                     {site && <span>· {site}</span>}
                  </div>
                  <div style={{ marginTop: '1px', fontWeight: 700, color: '#444', fontSize: '4px' }}>
                    {[mainPhone, cartaoContacts?.telefone2].filter(Boolean).join('  ·  ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartaoDeVisitaPreview({ accentColor, patternSrc, cartaoContacts, crmLine, editData, logoColor, comBorda, setComBorda, clinicaNome, setClinicaNome, logoLayout, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const brandFont = `'${editData?.fontFamily || 'Playfair Display'}', serif`;
  const { endereco, whatsapp, telefone, telefone2, instagram, email, site } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const solidColor = borderColor || accentColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Frente</p>
      <div style={{ width: '320px', height: '178px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
        {comBorda && patternSrc && <>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.9, zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px', background: '#fff', zIndex: 1 }} />
        </>}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '52%', height: '52%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} crm={crmLine} hideTagline={hideTagline} />
          </div>
        </div>
      </div>



      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Verso</p>
      <div style={{ width: '320px', height: '178px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
        {comBorda && patternSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', zIndex: 0 }} />
          : <div style={{ position: 'absolute', inset: 0, background: borderColor || accentColor, zIndex: 0 }} />}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.93)', padding: '12px 22px', borderRadius: '6px', textAlign: 'center', width: '82%' }}>
            {clinicaNome && <div style={{ fontFamily: brandFont, fontSize: '9px', color: accentColor, fontWeight: editData?.fontWeight || 700, marginBottom: '3px' }}>{clinicaNome}</div>}
            {endereco && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '6.5px', color: '#444', lineHeight: 1.5, marginBottom: '6px' }}>{endereco}</div>}
            {whatsapp && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '8px', fontWeight: 700, color: '#222', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="10" height="10" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {whatsapp}
            </div>}
            {[telefone, telefone2].filter(Boolean).length > 0 && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '6.5px', color: '#555', marginTop: '1px' }}>{[telefone, telefone2].filter(Boolean).join('  ·  ')}</div>}
            {email && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '6.5px', color: '#666', marginTop: '6px' }}>{email}</div>}
            {(instagram || site) && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '6.5px', color: '#666', marginTop: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {instagram && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <svg viewBox="0 0 24 24" width="9" height="9"><defs><linearGradient id="igP" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path fill="url(#igP)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                {instagram}
              </span>}
              {site && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {site}
              </span>}
            </div>}
            {!clinicaNome && !crmLine && !endereco && !whatsapp && !telefone && !instagram && !email && !site && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '7px', color: '#aaa', fontStyle: 'italic' }}>Preencha seus dados no Cartão Digital</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle compartilhado: Com/Sem estampa + bolinhas clicáveis de cor da paleta + Slider de Escala
function BordaToggle({ comBorda, setComBorda, accentColor, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const btn = (active) => ({
    padding: '6px 16px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    cursor: 'pointer', border: 'none',
    background: active ? accentColor : '#eee', color: active ? '#fff' : '#888',
    transition: 'all 0.2s ease'
  });
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', background: '#fcfcfc', borderRadius: '30px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={btn(comBorda)} onClick={() => setComBorda(true)}>Estampa</button>
        <button style={btn(!comBorda)} onClick={() => setComBorda(false)}>Sólida</button>
      </div>

      {comBorda && setPatternScale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #eee', paddingLeft: '12px', marginLeft: '4px' }}>
          <span style={{ fontSize: '0.62rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Tamanho:</span>
          <input 
            type="range" min="50" max="300" step="10"
            value={patternScale || 120} 
            onChange={(e) => setPatternScale(parseInt(e.target.value))}
            style={{ width: '80px', height: '4px', cursor: 'pointer', accentColor: accentColor }}
          />
        </div>
      )}

      {!comBorda && paletteColors?.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '4px', borderLeft: '1px solid #eee', paddingLeft: '12px' }}>
          {paletteColors.map((hex, i) => {
            const isSelected = (borderColor || accentColor) === hex;
            return (
              <div
                key={i}
                onClick={() => setBorderColor?.(hex)}
                style={{
                  width: '14px', height: '14px', borderRadius: '50%', background: hex,
                  cursor: 'pointer', flexShrink: 0, transition: 'transform 0.15s',
                  transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 0 2px #fff, 0 0 0 3.5px ${hex}` : '0 0 0 1px rgba(0,0,0,0.1)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Preview proporcional A5 — usado por receituário, timbrado, etc.
function A5ItemPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const BORDER = 14;
  const { whatsapp, telefone, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
    <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      {/* Borda de estampa */}
      {effectiveSrc
        ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
        : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
      {/* Área branca interna */}
      <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff' }} />
      {/* Logo no topo — ~20% da largura interna */}
      <div style={{ position: 'absolute', top: BORDER + 14, left: '50%', transform: 'translateX(-50%)', width: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.38} crm={crmLine} hideTagline={hideTagline} />
      </div>
      {/* Rodapé — linha 1: clínica · telefone  /  linha 2: @ig · site · endereço */}
      <div style={{ position: 'absolute', bottom: BORDER + 3, left: BORDER + 4, right: BORDER + 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        {(clinicaNome || mainPhone) && (
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
            {[clinicaNome, mainPhone].filter(Boolean).join('  ·  ')}
          </div>
        )}
        {(instagram || site || endereco) && (
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
            {[instagram ? `@${instagram}` : '', site, endereco].filter(Boolean).join('  ·  ')}
          </div>
        )}
      </div>
      {/* Linha separadora rodapé */}
      <div style={{ position: 'absolute', bottom: BORDER + (clinicaNome || mainPhone ? 12 : 6) + (instagram || site || endereco ? 8 : 0), left: BORDER + 8, right: BORDER + 8, height: '0.5px', background: '#e0e0e0' }} />
    </div>
    </div>
  );
}

function ReciboPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, marca }) {
  const BORDER = 10;
  const { whatsapp, telefone, telefone2, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {/* Borda de estampa */}
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        
        {/* Área branca interna */}
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', flexDirection: 'column', padding: '12px 10px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '4px', borderBottom: '0.1mm solid #f0f0f0' }}>
            <div style={{ width: '85px' }}>
               <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.32} crm={crmLine} hideTagline={hideTagline} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: accentColor, opacity: 0.12, letterSpacing: '2px' }}>RECIBO</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
            {['Recebi de', 'A quantia de', 'Referente a'].map(label => (
              <div key={label} style={{ borderBottom: '0.5px solid #eee', paddingBottom: '3px', display: 'flex', gap: '5px', alignItems: 'flex-end', minHeight: '14px' }}>
                <span style={{ fontSize: '4.5px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1 }}></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px', width: '100%', border: '0.5px solid #eee', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', background: `${accentColor}08`, borderBottom: '0.5px solid #eee' }}>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: accentColor, borderRight: '0.5px solid #eee' }}>DATA</div>
              <div style={{ flex: 4, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: accentColor, borderRight: '0.5px solid #eee' }}>DESCRIÇÃO DOS SERVIÇOS</div>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: accentColor, textAlign: 'right' }}>TOTAL</div>
            </div>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ display: 'flex', borderBottom: '0.5px solid #f9f9f9', height: '11px' }}>
                <div style={{ flex: 1.5, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 4, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 1.5 }}></div>
              </div>
            ))}
            <div style={{ display: 'flex', height: '11px', background: `${accentColor}05` }}>
              <div style={{ flex: 5.5, borderRight: '0.5px solid #f9f9f9', padding: '3px', textAlign: 'right', fontSize: '4.5px', fontWeight: 800, color: accentColor }}>TOTAL</div>
              <div style={{ flex: 1.5 }}></div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '50px', borderTop: '0.5px solid #333', marginBottom: '2.5px' }}></div>
            <div style={{ fontSize: '5.5px', fontWeight: 700, color: '#1a1a1a' }}>{clinicaNome || marca}</div>
            <div style={{ fontSize: '4px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>{crmLine}</div>
            
            <div style={{ width: '100%', borderTop: '0.1mm solid #f2f2f2', paddingTop: '3px', display: 'flex', justifyContent: 'space-between', fontSize: '3.6px', color: '#aaa', fontFamily: 'Montserrat, sans-serif' }}>
              <div>{endereco || ''}</div>
              <div style={{ fontWeight: 600 }}>{[whatsapp || telefone, telefone2].filter(Boolean).join(' / ')}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ControleEspecialPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, marca }) {
  const BORDER = 10;
  const { whatsapp, telefone, telefone2, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {/* Borda de estampa */}
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        
        {/* Área branca interna */}
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', flexDirection: 'column', padding: '10px' }}>
          
          <div style={{ textAlign: 'center', fontSize: '5.5px', fontWeight: 800, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            RECEITUÁRIO DE CONTROLE ESPECIAL
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {/* Box Emitente */}
            <div style={{ flex: 1.2, background: `${accentColor}12`, border: `0.1mm solid ${accentColor}25`, padding: '4px', borderRadius: '1.5px' }}>
              <div style={{ fontSize: '4.5px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', marginBottom: '2px', borderBottom: `0.1mm solid ${accentColor}30`, paddingBottom: '1.5px' }}>IDENTIFICAÇÃO DO EMITENTE</div>
              <div style={{ fontSize: '3.4px', color: '#555', lineHeight: 1.35 }}>
                <div style={{ fontWeight: 700, color: accentColor }}>{clinicaNome || marca}</div>
                <div style={{ fontWeight: 600 }}>{crmLine}</div>
                <div style={{ marginTop: '1.5px', opacity: 0.8 }}>{endereco}</div>
                <div style={{ fontWeight: 600 }}>{mainPhone}</div>
              </div>
            </div>
            
            {/* Logo e Vias */}
            <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
               <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.2} crm={crmLine} hideTagline={hideTagline} />
               <div style={{ fontSize: '3.5px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'center' }}>
                  1ª VIA FARMÁCIA<br/>2ª VIA PACIENTE
               </div>
            </div>
          </div>

          {/* Campos Prescrição */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
            <div style={{ borderBottom: '0.1mm solid #eee', paddingBottom: '1.5px', display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>PACIENTE:</span>
            </div>
            <div style={{ borderBottom: '0.1mm solid #eee', paddingBottom: '1.5px', display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>ENDEREÇO:</span>
            </div>
            <div style={{ marginTop: '3px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>PRESCRIÇÃO:</span>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ borderBottom: '0.1mm solid #f5f5f5', height: '8px' }}></div>
              ))}
            </div>
          </div>

          {/* Data e Assinatura */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px', padding: '0 10px' }}>
             <div style={{ borderBottom: '0.2mm solid #333', width: '40px', textAlign: 'center', paddingBottom: '1.5px', fontSize: '3.5px' }}>Data</div>
             <div style={{ borderBottom: '0.2mm solid #333', width: '80px', textAlign: 'center', paddingBottom: '1.5px', fontSize: '3.5px', fontWeight: 700 }}>Assinatura do Médico</div>
          </div>

          {/* Rodapé Obrigatório */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '5px' }}>
             <div style={{ flex: 1, background: `${accentColor}18`, border: `0.1mm solid ${accentColor}30`, padding: '4px', borderRadius: '1.5px' }}>
                <div style={{ fontSize: '3.5px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', marginBottom: '2px', textAlign: 'center' }}>IDENTIFICAÇÃO DO COMPRADOR</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                  {['Nome', 'Ident.', 'Endereço', 'Cidade'].map(f => (
                    <div key={f} style={{ borderBottom: '0.05mm solid rgba(0,0,0,0.1)', height: '4px' }}></div>
                  ))}
                </div>
             </div>
             <div style={{ flex: 1, border: '0.1mm solid #ddd', borderRadius: '1.5px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, textAlign: 'center', fontSize: '3px', color: '#aaa', textTransform: 'uppercase' }}>ASSINATURA DO FARMACÊUTICO</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AtestadoPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, crmLine, clinicaNome, marca, cartaoContacts, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const BORDER = 14;
  const { whatsapp, telefone, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const footerLine1 = [clinicaNome, mainPhone].filter(Boolean).join('  ·  ');
  const footerLine2 = [instagram ? `@${instagram}` : '', site, endereco].filter(Boolean).join('  ·  ');
  const B = ({ w }) => (
    <span style={{ display: 'inline-block', borderBottom: '0.6px solid #555', width: w, verticalAlign: 'bottom' }}>&nbsp;</span>
  );
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
    <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 120px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      {effectiveSrc
        ? <><div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} /><div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff' }} /></>
        : <div style={{ position: 'absolute', inset: 0, background: '#fff', border: `${BORDER}px solid ${solidColor}` }} />}

      {/* Logo: 16mm abaixo da área branca → ~34px */}
      <div style={{ position: 'absolute', top: '34px', left: '50%', transform: 'translateX(-50%)', width: '109px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.38} crm={crmLine} hideTagline={hideTagline} />
      </div>

      {/* Título: SVG y=84.65 → 82px */}
      <div style={{ position: 'absolute', top: '82px', left: 0, right: 0, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '7.5px', letterSpacing: '1.2px', textAlign: 'center', color: '#1a1a2e' }}>ATESTADO MÉDICO</div>

      {/* Texto: padding horizontal de 9mm → ~25px */}
      <div style={{ position: 'absolute', top: '118px', left: '25px', right: '22px', fontFamily: "'Montserrat',sans-serif", fontSize: '5.5px', color: '#333', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.2 }}>
        {[
          [['Declaro para os devidos fins, que', false], ['', true]],
          [['', true], [', esteve em consulta, das', false], ['', 'fixed:14px'], ['hs às', false], ['', 'fixed:14px'], ['hs,', false]],
          [['acompanhado de seu responsável Sr. (a)', false], ['', true]],
          [['', true], [', R.G. n°', false], ['', true], [', necessitando o mesmo', false]],
          [['de', false], ['', 'fixed:12px'], ['(', false], ['', 'fixed:8px'], [') dias de dispensa.', false]],
        ].map((row, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'flex-end', gap: '1px' }}>
            {row.map(([text, isBlank], ci) => isBlank === true
              ? <span key={ci} style={{ flex: 1, borderBottom: '0.6px solid #555' }}>&nbsp;</span>
              : isBlank && isBlank.startsWith('fixed:')
                ? <span key={ci} style={{ width: isBlank.replace('fixed:', ''), borderBottom: '0.6px solid #555', display: 'inline-block' }}>&nbsp;</span>
                : <span key={ci} style={{ whiteSpace: 'nowrap' }}>{text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Data/cidade: SVG y=222.64 → 216px */}
      <div style={{ position: 'absolute', top: '216px', left: 0, right: 0, textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#555' }}>
        <B w="26px" />, <B w="9px" /> de <B w="16px" /> de <B w="9px" />
      </div>

      {/* Assinatura: SVG y=251.6 → 244px */}
      <div style={{ position: 'absolute', top: '244px', left: '20%', right: '20%', borderTop: '0.5px solid #555' }} />

      {/* Rodapé: SVG y=309 → bottom */}
      {(footerLine1 || footerLine2) && <>
        <div style={{ position: 'absolute', bottom: BORDER + 3, left: BORDER + 4, right: BORDER + 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          {footerLine1 && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{footerLine1}</div>}
          {footerLine2 && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{footerLine2}</div>}
        </div>
        <div style={{ position: 'absolute', bottom: BORDER + (footerLine1 && footerLine2 ? 18 : 11), left: BORDER + 8, right: BORDER + 8, height: '0.5px', background: '#e0e0e0' }} />
      </>}
    </div>
    </div>
  );
}

function GenericItemPreview({ item, marca, accentColor, patternSrc, editData, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, localSlogan }) {
  const effectiveSrc = comBorda ? patternSrc : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
    <div style={{ width: '320px', height: '220px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      {effectiveSrc && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.1 }} />}
      <div style={{ position: 'relative', zIndex: 1, width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} hideTagline={hideTagline} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '11px', color: accentColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{item}</div>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '9px', color: '#bbb', marginTop: '6px' }}>Preview gerado ao exportar o PDF</div>
      </div>
    </div>
    </div>
  );
}

function EnvelopeSacoPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const { endereco, instagram, site, whatsapp, telefone, email } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const allPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* FRENTE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Frente</span>
          <div style={{ width: '220px', height: '300px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: solidColor, opacity: 0.9, zIndex: 5 }} />
            {/* Etiqueta com logo — centralizada na área abaixo da aba */}
            <div style={{ position: 'absolute', top: '172px', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px 18px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)', borderRadius: '2px', border: '0.5px solid #ddd', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.42} crm={crmLine} />
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Verso</span>
          <div style={{ width: '220px', height: '300px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: solidColor, zIndex: 5 }} />
            
            {/* Etiqueta discreta — igual ao Envelope Ofício */}
            <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', width: 'fit-content', maxWidth: '78%', padding: '5px 10px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #ddd', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '4.5px', color: '#666', lineHeight: 1.55 }}>
                  {clinicaNome && <div style={{ fontWeight: 700, color: accentColor, fontSize: '5px', marginBottom: '1px' }}>{clinicaNome}</div>}
                  {endereco && <div style={{ opacity: 0.75 }}>{endereco}</div>}
                  {mainPhone && <div style={{ fontWeight: 700, color: '#333', fontSize: '5.5px', margin: '1px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    <svg viewBox="0 0 24 24" width="6" height="6" fill="#25D366" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {mainPhone}
                  </div>}
                  {email && <div style={{ opacity: 0.75 }}>{email}</div>}
                  {(site || instagram) && <div style={{ opacity: 0.75 }}>{[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvelopeOficioPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const BORDER = 15;
  const { endereco, instagram, site, whatsapp, telefone, email } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const allPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* FRENTE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Frente</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba sólida no preview frontal */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: solidColor, opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '130px', textAlign: 'right' }}>
              <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.5} />
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Verso</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: solidColor, zIndex: 5 }} />
            
            {/* Etiqueta discreta — largura automática */}
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: 'fit-content', maxWidth: '78%', padding: '5px 10px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #ddd', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '4.5px', color: '#666', lineHeight: 1.55 }}>
                  {clinicaNome && <div style={{ fontWeight: 700, color: accentColor, fontSize: '5px', marginBottom: '1px' }}>{clinicaNome}</div>}
                  {endereco && <div style={{ opacity: 0.75 }}>{endereco}</div>}
                  {allPhones && <div style={{ fontWeight: 700, color: '#333', fontSize: '5.5px', margin: '1px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    <svg viewBox="0 0 24 24" width="6" height="6" fill="#25D366" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {allPhones}
                  </div>}
                  {email && <div style={{ opacity: 0.75 }}>{email}</div>}
                  {(site || instagram) && <div style={{ opacity: 0.75 }}>{[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PastaPreview({ brand, editData, accentColor, solidColor, logoColor, logoLayout, isSaude, crmData, comBorda, setComBorda, patternSrc, cartaoContacts, crmLine, paletteColors, borderColor, setBorderColor, patternScale, setBorderColorState, patternScaleState, setPatternScaleState, setPatternScale, hideTagline, folderRoof }) {
  const brandFont = editData?.fontFamily || 'Playfair Display';
  const marca = editData?.marca || '';
  const clinicaNome = cartaoContacts?.clinica || '';
  const { endereco, instagram, site, whatsapp, telefone, telefone2 } = cartaoContacts;
  const mainPhone = whatsapp || telefone || '';
  const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      
      <p style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Preview da Pasta (Frente e Verso)</p>
      
      <div style={{ width: '480px', height: '310px', position: 'relative', background: '#f5f5f5', borderRadius: '4px', boxShadow: '0 15px 45px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        
        {/* Camada de Fundo */}
        {comBorda && patternSrc ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale || 120}px`, opacity: 0.9 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: borderColor || solidColor }} />
        )}

        {/* Capa Esquerda (FRENTE no preview) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '240px', height: '310px' }}>
           <div style={{ 
             position: 'absolute', 
             bottom: '20px', left: '10px', right: '10px', top: '30px', 
             background: '#fff', borderRadius: '2px',
             clipPath: folderRoof 
               ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' 
               : 'none',
             boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
           }} />
           <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }}>
              <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.58} hideTagline={hideTagline} />
           </div>
        </div>

        {/* Linha de Dobra Central */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '240px', width: '0', borderLeft: '1px dashed rgba(0,0,0,0.1)', zIndex: 10 }} />

        {/* Capa Direita (VERSO no preview) */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '240px', height: '310px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
             <div style={{ 
               background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(5px)',
               margin: '0 10px 45px', padding: '6px 12px', borderRadius: '1.5px', 
               display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
               border: '0.1mm solid rgba(0,0,0,0.05)'
             }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '30%' }}>
                  <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.18} crm={crmLine} hideTagline={hideTagline} />
                </div>
                <div style={{ 
                  display: 'flex', flexDirection: 'column', fontSize: '3.8px', color: '#555', 
                  fontFamily: 'Montserrat, sans-serif', lineHeight: 1.5, textAlign: 'right', flex: 1
                }}>
                  {clinicaNome && (
                    <div style={{ fontFamily: brandFont, fontSize: '4.5px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '1px' }}>{clinicaNome}</div>
                  )}
                  {endereco && <div style={{ opacity: 0.8 }}>{endereco}</div>}
                  {allPhones && <div style={{ fontWeight: 600 }}>{allPhones}</div>}
                  <div style={{ opacity: 0.8 }}>{[site, instagram ? `@${instagram}` : ''].filter(Boolean).join(' · ')}</div>
                </div>
             </div>
        </div>

        <div style={{ position: 'absolute', top: 30, bottom: 30, left: '240px', width: '1px', background: 'rgba(255,255,255,0.3)', zIndex: 5 }} />
      </div>

      <div style={{ width: '100%', maxWidth: '480px', padding: '15px', background: `${accentColor}08`, borderRadius: '8px', border: `1px solid ${accentColor}20` }}>
        <p style={{ fontSize: '0.8rem', color: accentColor, fontWeight: 600, marginBottom: '5px' }}>Detalhamento</p>
        <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.5 }}>
          A etiqueta foi afinada e os elementos (Logo, Clínica e CRM) agora estão harmoniosamente centralizados. O PDF final reflete esta atualização de alta fidelidade.
        </p>
      </div>
    </div>
  );
}

function PapelariaStep({ brand, accentColor, paletteColors, estampaPatterns, estampaSelectedIdx, cartaoContacts, setCartaoContacts, plano, isSaude, crmData, setCrmData, marca, editData, logoColor, logoLayout, setLayout, clinicaNome, setClinicaNome }) {
  // ATUALIZAÇÃO: MEGA PACOTE COMPLETO (Listas Clínica + Institucional)
  const itens = [
    "Cartão de Visita", "Receituário Padrão", "Atestado Médico", "Cartão de Retorno", "Pasta A4 Exclusiva",
    "Envelope Ofício", "Envelope Saco", "Recibo", "Receituário de Controle Especial", "Dicas de Introdução Alimentar",
    "Guia de Vacina c/ Calendário", "Ficha de Acompanhamento", "Orientação Pré-Natal",
    "Cartão de Exames", "Checklist Maternidade", "Guia do Sono", "Orientações p/ Recém Nascidos",
    "Prontuário Médico", "Receita de Alta", "Ficha de Cadastro",
    "Certificado de Coragem", "Quadro de Incentivo", "Cartão de Aniversário Exclusivo",
    "Arte para Caneca/Brindes", "Gráfico de Crescimento", "Diário do Xixi", "Card de Orientação de Sono",
    "Meu Pratinho", "Guia de Amamentação", "Fundo de Tira Dúvidas Instagram",
    "Papel Timbrado", "Cartão de Agradecimento (10x15cm)", "Etiqueta para Correios", 
    "Recibo Comercial", "Cartão de Retorno/Fidelidade", "Assinatura de E-mail", "Tag para Sacola"
  ];
   const [idx, setIdx] = useState(0);
  const [comBorda, setComBordaState] = useState(true);
  const [patternScale, setPatternScaleState] = useState(150);
  const [borderColor, setBorderColorState] = useState(() => accentColor);
  const [localSlogan, setLocalSlogan] = useState(editData?.tagline || '');
  const [folderRoof, setFolderRoof] = useState(() => brand?.niche?.toLowerCase()?.includes('pedi'));
  const persistPapelaria = (updates) => { try { const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}'); localStorage.setItem('brandbox_papelaria', JSON.stringify({ ...cur, ...updates })); } catch {} };
  const setComBorda = (v) => { setComBordaState(v); persistPapelaria({ comBorda: v }); };
  const setPatternScale = (v) => { setPatternScaleState(v); persistPapelaria({ patternScale: v }); };
  const setBorderColor = (v) => { setBorderColorState(v); persistPapelaria({ borderColor: v }); };
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}');
      if (saved.comBorda !== undefined) setComBordaState(saved.comBorda);
      if (saved.patternScale) setPatternScaleState(saved.patternScale);
      if (saved.borderColor) setBorderColorState(saved.borderColor);
    } catch {}
  }, []);
  const [crmOpen, setCrmOpen] = useState(!crmData?.crm);
  const [contactOpen, setContactOpen] = useState(false);

  if (plano !== 'complete' || itens.length === 0) {
     return <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>Nenhuma papelaria inclusa no seu pacote.</div>;
  }

  const currentIdx = estampaSelectedIdx || 0;
  const currentItem = itens[idx];
  const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;
  const isScript = editData?.fontStyle === 'script';
  const crmLine = isSaude && crmData?.crm
    ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe?.length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / RQE ') : ''}`
    : null;

  const openGabarito = (item) => {
    const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;

    // URLs absolutas para fontes self-hosted — necessário na nova janela
    const _origin = window.location.origin;
    const LOCAL_FONT_FACES = {
      'Aberforth':    `@font-face{font-family:'Aberforth';src:url('${_origin}/fonts/Aberforth Demo.ttf') format('truetype');}`,
      'Dokyo':        `@font-face{font-family:'Dokyo';src:url('${_origin}/fonts/DOKYO___.TTF') format('truetype');}`,
      'Vellary':      `@font-face{font-family:'Vellary';src:url('${_origin}/fonts/Vellary.otf') format('opentype');}`,
      'Amelie':       `@font-face{font-family:'Amelie';src:url('${_origin}/fonts/Amelie.otf') format('opentype');}`,
      'Celina':       `@font-face{font-family:'Celina';src:url('${_origin}/fonts/Celina-Regular Done.ttf') format('truetype');}`,
      'LittleFriend': `@font-face{font-family:'LittleFriend';src:url('${_origin}/fonts/LittleFriend.otf') format('opentype');}`,
      'Cafigine':     `@font-face{font-family:'Cafigine';src:url('${_origin}/fonts/cafigine.otf') format('opentype');}`,
      'JulietaProGota':`@font-face{font-family:'JulietaProGota';src:url('${_origin}/fonts/Latinotype - JulietaProGota.otf') format('opentype');}`,
      'TuttiFrutti':  `@font-face{font-family:'TuttiFrutti';src:url('${_origin}/fonts/TuttiFrutti Regular.ttf') format('truetype');}`,
      'GoldenBlast':  `@font-face{font-family:'GoldenBlast';src:url('${_origin}/fonts/GoldenBlast-YzaVL 2.ttf') format('truetype');}`,
      'Solea':        `@font-face{font-family:'Solea';font-weight:300;src:url('${_origin}/fonts/Solea-Light.ttf') format('truetype');}@font-face{font-family:'Solea';font-weight:700;src:url('${_origin}/fonts/Solea-Bold.ttf') format('truetype');}`,
    };

    // Gera logo diretamente — logoRef.current é null na etapa de papelaria
    const _isScript = brand.editData?.fontStyle === 'script';
    const _boost = brand.editData?.fontSizeBoost || 1;
    const _words = marca.split(' ').map(w => _isScript ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase());
    let _lines, _basePt;
    if (logoLayout === 'horizontal') { _lines = [_words.join(' ')]; _basePt = marca.length > 18 ? 10 : marca.length > 12 ? 14 : marca.length > 8 ? 18 : 22; }
    else if (logoLayout === 'balanced' && _words.length >= 3) { const m = Math.ceil(_words.length / 2); _lines = [_words.slice(0, m).join(' '), _words.slice(m).join(' ')]; _basePt = marca.length > 15 ? 16 : 21; }
    else { _lines = _words; _basePt = _words.length >= 3 ? (marca.length > 15 ? 14 : 17) : _words.length === 2 ? 22 : 29; }
    const _fontPt = (_basePt * _boost).toFixed(1);
    const _lineH = brand.editData?.fontLineHeight || (_isScript ? 0.9 : 1.1);
    const _letterSp = brand.editData?.fontLetterSpacing || (_isScript ? '0pt' : '0.5pt');
    const _brandFont = `'${brand.editData?.fontFamily || 'Playfair Display'}', serif`;
    const { endereco, whatsapp, telefone, telefone2, instagram, email, site } = cartaoContacts;
    const mainPhone = whatsapp || telefone || '';
    const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

    const crmLine = isSaude && crmData.crm
      ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe?.length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / RQE ') : ''}`
      : null;
    
    const localSlogan = brand.editData?.tagline || tagline || '';
    
    // Suporte a ocultar tagline e mostrar CRM no gabarito
    const logoHtml = `
      <div style="text-align:center;font-family:${_brandFont};font-weight:${brand.editData?.fontWeight || 700};font-size:${_fontPt}pt;color:${accentColor};line-height:${_lineH};letter-spacing:${_letterSp};white-space:nowrap;">
        ${_lines.map(l => `<div style="font-family:inherit;font-weight:inherit;white-space:nowrap;">${l}</div>`).join('')}
      </div>
      ${localSlogan ? `<div style="font-family:'Montserrat',sans-serif;font-size:4pt;letter-spacing:2pt;text-transform:uppercase;color:#999;margin-top:3pt;text-align:center;">${localSlogan}</div>` : ''}
    `;

    const logoHtmlWithCrm = `
      ${logoHtml}
      ${crmLine ? `<div style="font-family:'Montserrat',sans-serif;font-size:3.5pt;letter-spacing:1pt;text-transform:uppercase;color:#bbb;margin-top:2pt;text-align:center;opacity:0.8;">${crmLine}</div>` : ''}
    `;

    // ── PASTA ──────────────────────────────────────────────────────
    if (item.includes('Pasta')) {
      const BLEED = 5;
      const _ffP = brand.editData?.fontFamily || 'Playfair Display';
      const _lfP = LOCAL_FONT_FACES[_ffP];
      const fiP = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfP ? `<style>${_lfP}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffP.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const genBgP = () => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.83).toFixed(1)}mm;opacity:1;"></div>`
        : `<div style="position:absolute;inset:0;background:${borderColor || accentColor};"></div>`;

      const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

      // Barra de Dados no Verso (Capa Esquerda no GABARITO TÉCNICO)
      const _footerP = `
        <div style="background:rgba(255,255,255,0.92);backdrop-filter:blur(3mm);padding:6mm 10mm;margin:0 10mm 45mm;border-radius:1.5mm;display:flex;align-items:center;justify-content:space-between;border:0.1mm solid rgba(0,0,0,0.1);font-family:'Montserrat',sans-serif;width:220mm;min-height:24mm;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:3mm;width:35%;overflow:visible;">
               <div style="width:100%;text-align:center;transform:scale(1.4);transform-origin:center center;margin-bottom:-12mm;">
                 ${logoHtml}
               </div>
               ${crmLine ? `<div style="font-size:6.5pt;color:#999;text-transform:uppercase;letter-spacing:0.5px;margin-top:14mm;text-align:center;">${crmLine}</div>` : ''}
            </div>
            <div style="text-align:right;font-size:7.5pt;color:#333;line-height:1.6;">
                ${clinicaNome ? `<div style="font-family:${_brandFont};font-size:10.5pt;color:${accentColor};font-weight:700;margin-bottom:1.5mm;">${clinicaNome}</div>` : ''}
                ${endereco ? `<div style="opacity:0.8;">${endereco}</div>` : ''}
                <div style="font-weight:700;">${allPhones}</div>
                <div style="opacity:0.8;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>
            </div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pasta - ${marca}</title>${fiP}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width: 480mm; height: 380mm; position: relative; overflow: hidden; background: #fff; }
.page { width: 480mm; height: 380mm; position: relative; overflow: hidden; }
.cm { position: absolute; width: 10mm; height: 10mm; border-color: rgba(0,0,0,0.5); border-style: solid; border-width: 0; pointer-events: none; }
.cm-tl { top:0; left:0; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:0; right:0; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:0; left:0; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:0; right:0; border-bottom:0.2mm solid; border-right:0.2mm solid; }
.fold { position: absolute; opacity: 0.3; pointer-events: none; border-color: #000; }
.fold-v { top: 0; bottom: 0; left: 240mm; border-left: 0.1mm dashed; height: 100%; }
.fold-h { left: 0; right: 0; bottom: 70mm; border-top: 0.1mm dashed; width: 100%; }
@media print { body { margin:0; } @page { size: 480mm 380mm; margin: 0; } }
</style></head><body>
<div class="page">
    ${genBgP()}
    
    <!-- Capa Direita (Frente Técnica) -->
    <div style="position:absolute;top:0;right:0;width:240mm;height:310mm;">
        <div style="position:absolute;bottom:20mm;left:10mm;right:10mm;top:30mm;background:#fff;border-radius:2mm;${folderRoof ? 'clip-path:polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%);' : ''}"></div>
        <div style="position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);width:180mm;text-align:center;">
            <div style="width:100%;height:auto;zoom:2.2;display:inline-block;text-align:center;">${logoHtmlWithCrm}</div>
        </div>
    </div>

    <!-- Capa Esquerda (Verso Técnico) -->
    <div style="position:absolute;top:0;left:0;width:240mm;height:310mm;display:flex;flex-direction:column;justify-content:flex-end;">
        ${_footerP}
    </div>

    <!-- Bolso Técnio -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:70mm;border-top:0.2mm dashed rgba(255,255,255,0.4);"></div>

    <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
    <div class="fold fold-v"></div><div class="fold fold-h"></div>
</div>
</body></html>`;

      const ex = document.getElementById('_gabarito_v2'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_v2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 1000); });
      return;
    }

    // ── CARTÃO DE RETORNO ──────────────────────────────────────────
    if (item === 'Cartão de Retorno') {
      const BLEED = 3;
      const _ffR = brand.editData?.fontFamily || 'Playfair Display';
      const _lfR = LOCAL_FONT_FACES[_ffR];
      const fiR = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfR ? `<style>${_lfR}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffR.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const _bcR = borderColor || accentColor;
      const genBg = (innerPad = 5) => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.2).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>
           <div style="position:absolute;top:${BLEED + innerPad}mm;left:${BLEED + innerPad}mm;right:${BLEED + innerPad}mm;bottom:${BLEED + innerPad}mm;background:#fff;"></div>`
        : comBorda ? `<div style="position:absolute;inset:0;background:#fff;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BLEED + innerPad}mm solid ${_bcR};"></div>`;

      const genTable = (count, rowH = '6mm') => `
        <div style="width:100%;border:0.3pt solid #eee;border-radius:1mm;overflow:hidden;margin-bottom:2mm;">
          <div style="display:flex;background:${accentColor}20;border-bottom:0.3pt solid #eee;font-family:'Montserrat',sans-serif;">
            <div style="flex:1;font-size:6pt;font-weight:800;text-align:center;padding:1mm 0;border-right:0.3pt solid #eee;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;">Data</div>
            <div style="flex:1;font-size:6pt;font-weight:800;text-align:center;padding:1mm 0;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;">Horário</div>
          </div>
          ${Array.from({ length: count }).map(() => `<div style="display:flex;border-bottom:0.3pt solid #eee;height:${rowH};"><div style="flex:1;border-right:0.3pt solid #eee;"></div><div style="flex:1;"></div></div>`).join('')}
        </div>`;

      // Logo reduzido drasticamente para o formato vertical (fator 0.5)
      const _logoSizeR = (_basePt * 0.5 * _boost).toFixed(1);
      const logoHtmlR = `<div style="text-align:center;font-family:${_brandFont};font-weight:${brand.editData?.fontWeight || 700};font-size:${_logoSizeR}pt;color:${accentColor};line-height:${_lineH};letter-spacing:${_letterSp};${_noWrap}">${_lines.map(l => `<div style="font-family:inherit;font-weight:inherit;${_noWrap}">${l}</div>`).join('')}</div>${_tagline ? `<div style="font-family:'Montserrat',sans-serif;font-size:3.2pt;letter-spacing:1.2pt;text-transform:uppercase;color:#999;margin-top:2.2pt;text-align:center;white-space:nowrap;">${_tagline}</div>` : ''}`;

      const frenteR = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${genBg(4)}
          <div style="position:absolute;top:${BLEED + 4}mm;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 4}mm;display:flex;flex-direction:column;align-items:center;padding:4mm 3mm;">
            <div style="margin-bottom:6mm;display:flex;flex-direction:column;align-items:center;width:100%">${logoHtmlR}</div>
            ${crmLine ? `<div style="font-family:'Montserrat',sans-serif;font-size:3.2pt;color:#999;letter-spacing:0.8pt;text-transform:uppercase;margin-top:-3.5mm;margin-bottom:4mm;">${crmLine}</div>` : ''}
            <div style="background:${accentColor};color:#fff;width:100%;padding:1mm 0;font-size:6.5pt;font-weight:800;text-align:center;letter-spacing:1pt;border-radius:0.5mm;margin-bottom:4mm;font-family:'Montserrat',sans-serif;">RETORNO DE CONSULTAS</div>
            ${genTable(8, '5.5mm')}
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const versoR = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${genBg(4)}
          <div style="position:absolute;top:${BLEED + 4}mm;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 3}mm;display:flex;flex-direction:column;align-items:center;padding:3mm;">
            ${genTable(12, '5.5mm')}
            <div style="width:100%;text-align:left;border-top:0.3pt solid #eee;padding-top:1.5mm;margin-top:auto;font-family:'Montserrat',sans-serif;">
              <div style="font-family:${_brandFont};font-size:5pt;color:${accentColor};font-weight:700;">${clinicaNome || marca}</div>
              <div style="font-size:3.7pt;color:#888;margin-top:1.2mm;line-height:1.4;">
                ${endereco ? `<div style="margin-bottom:0.5mm;">${endereco}</div>` : ''}
                <div style="display:flex; flex-wrap:wrap; gap:3mm; margin-top:0.5mm;">
                  ${instagram ? `<span>@${instagram}</span>` : ''}
                  ${site ? `<span>${site}</span>` : ''}
                </div>
                <div style="font-weight:700;color:#444;margin-top:0.8mm;font-size:4pt;">
                  ${[mainPhone, telefone2].filter(Boolean).join('  ·  ')}
                </div>
              </div>
            </div>
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cartão de Retorno - ${marca}</title>${fiR}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
.card { width: 56mm; height: 96mm; position: relative; }
.cm { position: absolute; width: 2mm; height: 2mm; pointer-events: none; }
.cm-tl { top: 3mm; left: 3mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-tr { top: 3mm; right: 3mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
.cm-bl { bottom: 3mm; left: 3mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-br { bottom: 3mm; right: 3mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
@media print { body { margin:0; } .card { page-break-after: always; } @page { size: 56mm 96mm; margin: 0; } }
</style></head><body>${frenteR}${versoR}</body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:100mm;height:120mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      iframe.contentDocument.title = `Cartão de Retorno - ${marca}`;
      const prevT = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = `Cartão de Retorno - ${marca}`; iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 400); });
      return;
    }

    // ── CARTÃO DE VISITA ────────────────────────────────────────────
    // Sangria: 3mm em cada lado → página com sangria = 96mm × 56mm
    // Área de corte: 90mm × 50mm (a 3mm das bordas da página)
    // Zona segura: 6mm das bordas da página (3mm da linha de corte)
    if (item === 'Cartão de Visita') {
      const BLEED = 3; // mm
      const _fontFamily = brand.editData?.fontFamily || 'Playfair Display';
      const _localFace = LOCAL_FONT_FACES[_fontFamily];
      const fontImports = `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
        ${_localFace
          ? `<style>${_localFace}</style>`
          : `<link href="https://fonts.googleapis.com/css2?family=${_fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">`
        }
      `;

      // Frente: background branco / estampa como borda — estende até a sangria
      const frenteBgHtml = comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.22).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>
           <div style="position:absolute;top:${BLEED + 5}mm;left:${BLEED + 5}mm;right:${BLEED + 5}mm;bottom:${BLEED + 5}mm;background:#fff;"></div>`
        : `<div style="position:absolute;inset:0;background:#fff;"></div>`;

      const frenteHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${frenteBgHtml}
          <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            <div style="width:58%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              ${logoHtmlWithCrm}
            </div>
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const _waIconSvg = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:2pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      const _igIconSvg = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:2pt;"><defs><linearGradient id="igG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f09433"/><stop offset="50%" stop-color="#dc2743"/><stop offset="100%" stop-color="#bc1888"/></linearGradient></defs><path fill="url(#igG)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
      
      const variationPrompts = [
        `REPLICATE ARTISTIC DNA - IGNORE REFERENCE COLORS: Follow the exact drawing technique of the reference image but REPAINT EVERYTHING with ONLY these colors: ${paletteColors.join(', ')}. This is mandatory. FULL BLEED - NO WHITE MARGINS. 100% Seamless Tile.`,
        `STYLISTIC EVOLUTION - PALETTE IS THE LAW: Maintain visual soul but explore NEW COMPOSITION. STRICTLY USE ONLY: ${paletteColors.join(', ')}. Do not use any colors from the reference. Technically perfect infinite repeat tile.`,
        `BRAND FAMILY VARIATION - STRICT COLORS: Create an original repeatable pattern tile in the same collection. MANDATORY COLOR PALETTE: ${paletteColors.join(', ')}. No other colors allowed. Clean white background. Full-bleed continuity.`
      ];

      const _extraPhones = [telefone, telefone2].filter(Boolean);
      const _siteIconSvg = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:2pt;" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
      const contactLines = [
        clinicaNome ? `<div style="font-family:${_brandFont};font-size:7pt;color:${accentColor};font-weight:${brand.editData?.fontWeight || 700};margin-bottom:1.5mm;">${clinicaNome}</div>` : '',
        endereco ? `<div style="font-size:5pt;color:#444;line-height:1.5;margin-bottom:1mm;">${endereco}</div>` : '',
        whatsapp ? `<div style="font-size:6.5pt;font-weight:700;color:#222;margin-top:1mm;">${_waIconSvg}${whatsapp}</div>` : '',
        _extraPhones.length > 0 ? `<div style="font-size:5.5pt;color:#555;margin-top:0.5mm;">${_extraPhones.join('  ·  ')}</div>` : '',
        email ? `<div style="font-size:5pt;color:#666;margin-top:1mm;">${email}</div>` : '',
        (instagram || site) ? `<div style="font-size:5pt;color:#666;margin-top:1.5mm;display:flex;justify-content:center;align-items:center;gap:4mm;">${instagram ? `<span>${_igIconSvg}${instagram}</span>` : ''}${site ? `<span>${_siteIconSvg}${site}</span>` : ''}</div>` : '',
      ].filter(Boolean).join('');

      // Verso: fundo colorido / estampa estende até a sangria
      const _bc = borderColor || accentColor;
      const versoBgHtml = comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.22).toFixed(1)}mm;background-repeat:repeat;"></div>`
        : `<div style="position:absolute;inset:0;background:${_bc};"></div>`;

      const versoHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${versoBgHtml}
          <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            <div style="background:rgba(255,255,255,0.93);padding:3mm 5mm;border-radius:1.5mm;width:82%;text-align:center;font-family:'Montserrat',sans-serif;">
              ${contactLines || `<span style="font-size:5pt;color:#aaa;">Adicione seus dados no Cartão Digital</span>`}
            </div>
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cartão de Visita - ${marca}</title>
${fontImports}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── CARD (com sangria) ── */
  /* Tamanho total da página = 90+6 × 50+6 = 96mm × 56mm */
  .card {
    width: 96mm;
    height: 56mm;
    position: relative;
  }

  /* Marcas de corte (crop marks) — mostram a linha de corte a 3mm das bordas */
  .crop-marks::before,
  .crop-marks::after {
    content: '';
    position: absolute;
    background: rgba(0,0,0,0.35);
  }
  /* Linha horizontal de corte: canto superior e inferior */
  .crop-corner {
    position: absolute;
    pointer-events: none;
  }
  /* Cantos de corte em cada canto do card */
  .cm { position: absolute; width: 2mm; height: 2mm; pointer-events: none; }
  .cm-tl { top: 3mm; left: 3mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
  .cm-tr { top: 3mm; right: 3mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
  .cm-bl { bottom: 3mm; left: 3mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
  .cm-br { bottom: 3mm; right: 3mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }

  /* ── IMPRESSÃO ── */
  * { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
  @media print {
    body { margin: 0; }
    .card { page-break-after: always; }
    @page { size: 96mm 56mm; margin: 0; }
  }
</style>
</head>
<body>
${frenteHtml}
${versoHtml}
</body>
</html>`;

      // Impressão via iframe invisível — usuário fica na mesma página
      const existing = document.getElementById('_gabarito_iframe');
      if (existing) existing.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:200mm;height:150mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open();
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();
      const _docTitle = `Cartão de Visita 9x5cm - ${marca}`;
      iframe.contentDocument.title = _docTitle;
      const _prevTitle = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
          document.title = _docTitle;
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setTimeout(() => { document.title = _prevTitle; iframe.remove(); }, 3000);
        }, 300);
      });
      return;
    }

    // ── ENVELOPE SACO (GABARITO HORIZONTAL PRINTI) ──────────────────
    if (item.includes('Envelope Saco')) {
      const BLEED = 3;
      const W = 225; const H = 311; 
      const ABA_S = 40; const ABA_I = 15; const ABA_L = 15;
      // totalW: sangria + aba lateral + frente + verso + sangria
      const totalW = (BLEED * 2) + ABA_L + (W * 2); 
      // totalH: sangria + aba superior + altura + aba inferior + sangria
      const totalH = (BLEED * 2) + ABA_S + H + ABA_I;

      const solidColor = borderColor || accentColor;
      const genPattern = (scaleMul = 1) => patternSrc ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.18 * scaleMul).toFixed(1)}mm;opacity:1;"></div>` : '';
      const _sacLogoZoom = 2.2;
      const _sacPhones = [mainPhone, telefone].filter(Boolean).join(' / ');
      const _ffSac = brand.editData?.fontFamily || 'Playfair Display';
      const _lfSac = LOCAL_FONT_FACES[_ffSac];
      const _fiSac = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfSac ? `<style>${_lfSac}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffSac.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _waIcoSac = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

      // Componentes do gabarito horizontal
      const abaSupHtml = `<div style="position:absolute;top:0;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_S + BLEED}mm;background:${solidColor};"></div>`;
      const abaInfHtml = `<div style="position:absolute;top:${BLEED + ABA_S + H}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_I + BLEED}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;
      const abaLatHtml = `<div style="position:absolute;top:${BLEED + ABA_S}mm;left:0;width:${ABA_L + BLEED}mm;height:${H}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;

      // FRENTE (Centro-Esquerda)
      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${H}mm;overflow:hidden;background:#fff;z-index:2;">
            ${genPattern(1)}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;background:rgba(255,255,255,0.97);padding:8mm 16mm;border-radius:2mm;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
              <div style="zoom:${_sacLogoZoom};">${logoHtmlWithCrm}</div>
            </div>
        </div>`;

      // VERSO (Centro-Direita, SEM rotação neste layout)
      const versoHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L + W}mm;width:${W + BLEED}mm;height:${H}mm;background:#fff;overflow:hidden;z-index:2;border-left:0.1mm dashed rgba(0,0,0,0.1);">
            ${genPattern(1)}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:max-content;max-width:${W - 20}mm;background:rgba(255,255,255,0.97);padding:8mm 16mm;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
               <div style="font-size:11pt;color:#666;font-family:'Montserrat',sans-serif;line-height:1.7;">
                  ${clinicaNome ? `<div style="font-weight:700;color:${accentColor};font-size:14pt;margin-bottom:2mm;">${clinicaNome}</div>` : ''}
                  ${endereco ? `<div style="opacity:0.75;">${endereco}</div>` : ''}
                  ${_sacPhones ? `<div style="font-weight:700;color:#333;font-size:15pt;margin:2mm 0;">${_waIcoSac}${_sacPhones}</div>` : ''}
                  ${email ? `<div style="opacity:0.75;margin-bottom:1mm;">${email}</div>` : ''}
                  ${(site || instagram) ? `<div style="opacity:0.75;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
               </div>
            </div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Envelope Saco Gabarito - ${marca}</title>${_fiSac}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; background:#fff; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div style="width:${totalW}mm; height:${totalH}mm; position:relative;">${abaSupHtml}${abaInfHtml}${abaLatHtml}${frenteHtml}${versoHtml}</div></body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:500mm;height:400mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 500); });
      return;
    }

    // ── ENVELOPE OFÍCIO ───────────────────────────────────────────
    if (item.includes('Envelope Ofício')) {
      const BLEED = 3;
      const W = 220; const H = 113; // Face
      const ABA = 35; const COLA = 12;
      const totalW = W + (COLA * 2) + (BLEED * 2);
      const totalH = (H * 2) + ABA + (BLEED * 2);

      const solidColor = borderColor || accentColor;
      // Fator 0.18: calibrado para que 310px (preview) = 220mm (PDF) com patternScale/4 px
      const genPattern = (scaleMul = 1) => patternSrc ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.18 * scaleMul).toFixed(1)}mm;opacity:1;"></div>` : '';
      const _envPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

      // Imports de fonte — necessário para logo aparecer com a fonte da marca
      const _ffEnv = brand.editData?.fontFamily || 'Playfair Display';
      const _lfEnv = LOCAL_FONT_FACES[_ffEnv];
      const _fiEnv = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfEnv ? `<style>${_lfEnv}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffEnv.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;

      const abaHtml = `<div style="position:absolute;top:0;left:0;width:${totalW}mm;height:${ABA + BLEED}mm;background:${solidColor};"></div>`;

      // Gabarito Printi: ABA (topo) → FRENTE (meio) → VERSO (baixo, rotacionado)
      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA}mm;left:0;width:${totalW}mm;height:${H}mm;background:#fff;overflow:hidden;">
            <div style="position:absolute;bottom:8mm;right:${COLA + 8}mm;transform:scale(1.6);transform-origin:right bottom;text-align:right;">${logoHtmlWithCrm}</div>
        </div>`;

      const _waIco = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      const versoHtml = `
        <div style="position:absolute;top:${BLEED + ABA + H}mm;left:0;width:${totalW}mm;height:${H + BLEED}mm;background:#fff;transform:rotate(180deg);overflow:hidden;">
            ${genPattern(0.6)}
            <div style="position:absolute;bottom:10mm;left:50%;transform:translateX(-50%);width:max-content;max-width:${W - 20}mm;background:rgba(255,255,255,0.97);padding:5mm 10mm;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
               <div style="font-size:9pt;color:#666;font-family:'Montserrat',sans-serif;line-height:1.65;">
                  ${clinicaNome ? `<div style="font-weight:700;color:${accentColor};font-size:10.5pt;margin-bottom:1.5mm;">${clinicaNome}</div>` : ''}
                  ${endereco ? `<div style="opacity:0.75;">${endereco}</div>` : ''}
                  ${_envPhones ? `<div style="font-weight:700;color:#333;font-size:11pt;margin:1.5mm 0;">${_waIco}${_envPhones}</div>` : ''}
                  ${email ? `<div style="opacity:0.75;">${email}</div>` : ''}
                  ${(site || instagram) ? `<div style="opacity:0.75;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
               </div>
            </div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Envelope Ofício - ${marca}</title>${_fiEnv}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; background:#fff; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div style="width:${totalW}mm; height:${totalH}mm; position:relative;">${abaHtml}${frenteHtml}${versoHtml}</div></body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:300mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 500); });
      return;
    }

    // ── ATESTADO MÉDICO ─────────────────────────────────────────────
    if (item === 'Atestado Médico') {
      const _fa2 = brand.editData?.fontFamily || 'Playfair Display';
      const _lf2 = LOCAL_FONT_FACES[_fa2];
      const fi2 = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lf2 ? `<style>${_lf2}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_fa2.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _bw = '8mm';
      const _bc2 = borderColor || accentColor;
      const _pat2 = (comBorda && patternSrc)
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.35).toFixed(1)}mm;background-repeat:repeat;"></div><div style="position:absolute;top:${_bw};left:${_bw};right:${_bw};bottom:${_bw};background:#fff;"></div>`
        : comBorda
          ? `<div style="position:absolute;inset:0;background:#fff;"></div>`
          : `<div style="position:absolute;inset:0;background:#fff;border:${_bw} solid ${_bc2};box-sizing:border-box;"></div>`;
      const _atFooter1 = [clinicaNome, mainPhone].filter(Boolean).join(' · ');
      const _atFooter2 = [instagram ? `@${instagram}` : '', site, endereco].filter(Boolean).join(' · ');
      const _hasFooter = !!(  _atFooter1 || _atFooter2);
      const _footerH = _atFooter1 && _atFooter2 ? 13 : 8; // mm de altura do bloco rodapé
      const _atFooterHtml = _hasFooter ? `
        <div style="position:absolute;bottom:10mm;left:${_bw};right:${_bw};text-align:center;font-family:'Montserrat',sans-serif;color:#555;line-height:1.7;">
          ${_atFooter1 ? `<div style="font-size:6pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_atFooter1}</div>` : ''}
          ${_atFooter2 ? `<div style="font-size:5.5pt;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_atFooter2}</div>` : ''}
        </div>
        <div style="position:absolute;bottom:${7 + _footerH}mm;left:12mm;right:12mm;border-top:0.5px solid #e0e0e0;"></div>` : '';
      const _atBottom = _hasFooter ? `${7 + _footerH + 2}mm` : _bw;
      // Posições derivadas do SVG de referência (240.96×330) → A5 (148×210mm)
      // scaleY = 210/330 = 0.6364  |  posições inside do content div (top:8mm) = pos_mm - 8
      const _atHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Atestado Médico - ${marca}</title>${fi2}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { margin:0; } @media print { @page { size: A5 portrait; margin:0; } }
.blank { display:inline-block; border-bottom:0.8px solid #555; vertical-align:bottom; }
</style></head><body>
<div style="position:relative;width:148mm;height:210mm;overflow:hidden;">
  ${_pat2}
  ${_atFooterHtml}
  <div style="position:absolute;top:${_bw};left:${_bw};right:${_bw};bottom:${_atBottom};font-family:'Montserrat',sans-serif;">

    <!-- Logo: 16mm abaixo do início da área branca -->
    <div style="position:absolute;top:16mm;left:50%;transform:translateX(-50%);width:48mm;display:inline-flex;flex-direction:column;align-items:center;">${logoHtml}</div>

    <!-- Título -->
    <div style="position:absolute;top:48mm;left:0;right:0;text-align:center;font-size:14pt;font-weight:800;letter-spacing:2.5pt;color:#1a1a2e;">ATESTADO MÉDICO</div>

    <!-- Texto: 4 linhas, nome ocupa fim da linha 1 e início da linha 2 -->
    <div style="position:absolute;top:66mm;left:9mm;right:9mm;font-size:10pt;color:#222;display:flex;flex-direction:column;gap:6mm;line-height:1.2;">
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">Declaro para os devidos fins, que</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">, esteve em consulta, das</span>
        <span class="blank" style="width:22mm;">&nbsp;</span>
        <span style="white-space:nowrap;">hs às</span>
        <span class="blank" style="width:22mm;">&nbsp;</span>
        <span style="white-space:nowrap;">hs,</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">acompanhado de seu responsável Sr. (a)</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">, R.G. n°</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">, necessitando o mesmo</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">de</span>
        <span class="blank" style="width:20mm;">&nbsp;</span>
        <span style="white-space:nowrap;">(</span><span class="blank" style="width:12mm;">&nbsp;</span><span style="white-space:nowrap;">) dias de dispensa.</span>
      </div>
    </div>

    <!-- Data/cidade: SVG y=222.64 → 141mm page → 133mm content -->
    <div style="position:absolute;top:133mm;left:0;right:0;text-align:center;font-size:9pt;color:#555;">
      <span class="blank" style="width:38mm;">&nbsp;</span>, <span class="blank" style="width:10mm;">&nbsp;</span>
      de <span class="blank" style="width:22mm;">&nbsp;</span> de <span class="blank" style="width:12mm;">&nbsp;</span>
    </div>

    <!-- Assinatura: SVG y=251.6 → 160mm page → 152mm content -->
    <div style="position:absolute;top:152mm;left:20%;right:20%;border-top:0.7px solid #555;"></div>

  </div>
</div></body></html>`;
      const _dt = `Atestado Médico - ${marca}`;
      const _ex = document.getElementById('_gabarito_iframe'); if (_ex) _ex.remove();
      const _if = document.createElement('iframe');
      _if.id = '_gabarito_iframe';
      _if.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:200mm;height:280mm;border:none;visibility:hidden;';
      document.body.appendChild(_if);
      _if.contentDocument.open(); _if.contentDocument.write(_atHtml); _if.contentDocument.close();
      _if.contentDocument.title = _dt;
      const _pv = document.title;
      _if.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = _dt; _if.contentWindow.focus(); _if.contentWindow.print(); setTimeout(() => { document.title = _pv; _if.remove(); }, 3000); }, 400); });
      return;
    }

      // ── RECEITUÁRIO DE CONTROLE ESPECIAL ────────────────────────────
      if (item.includes('Controle Especial')) {
        const BLEED = 3;
        const _ffCe = brand.editData?.fontFamily || 'Playfair Display';
        const _lfCe = LOCAL_FONT_FACES[_ffCe];
        const fiCe = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfCe ? `<style>${_lfCe}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffCe.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
        
        const W = 148, H = 210;
        const BORDER = 10;
        const _bcCe = borderColor || accentColor;
        
        const patternBorder = (comBorda && patternSrc) ? `
          <div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.42).toFixed(1)}mm;background-repeat:repeat;"></div>
          <div style="position:absolute;top:${BORDER}mm;left:${BORDER}mm;right:${BORDER}mm;bottom:${BORDER}mm;background:#fff;"></div>
        ` : comBorda ? `<div style="position:absolute;inset:0;background:#fff;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BORDER}mm solid ${_bcCe};box-sizing:border-box;"></div>`;

        // Gerar HTML de Logo específico para este tamanho
        const logoHtmlCe = `<div style="width:42mm;display:flex;flex-direction:column;align-items:center;justify-content:center;">${ReactDOMServer.renderToString(<LogoPreviewHTML editData={brand?.editData} color={logoColor} layout={logoLayout} scaleFactor={0.25} crm={crmLine} hideTagline={false} />)}</div>`;

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receituário Controle Especial - ${marca}</title>${fiCe}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${W + BLEED*2}mm; height:${H + BLEED*2}mm; position:relative; overflow:hidden; background:#fff; font-family:'Montserrat',sans-serif; }
.cm { position:absolute; width:10mm; height:10mm; border-color:rgba(0,0,0,0.5); border-style:solid; border-width:0; pointer-events:none; }
.cm-tl { top:0; left:0; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:0; right:0; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:0; left:0; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:0; right:0; border-bottom:0.2mm solid; border-right:0.2mm solid; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin:0; } }
</style></head><body>
<div style="position:relative;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;overflow:hidden;padding:${BLEED + BORDER + 4}mm ${BLEED + BORDER + 8}mm;display:flex;flex-direction:column;gap:5mm;">
    ${patternBorder}
    
    <div style="text-align:center;font-size:11pt;font-weight:800;color:#aaa;letter-spacing:2pt;text-transform:uppercase;">RECEITUÁRIO DE CONTROLE ESPECIAL</div>

    <div style="display:flex;gap:8mm;align-items:flex-start;">
        <div style="flex:1.2;background:${accentColor}08;border:0.2mm solid ${accentColor}20;padding:3mm 4mm;border-radius:1.5mm;">
            <div style="font-size:8pt;font-weight:800;color:${accentColor};margin-bottom:2mm;border-bottom:0.2mm solid ${accentColor}20;padding-bottom:1mm;text-transform:uppercase;">IDENTIFICAÇÃO DO EMITENTE</div>
            <div style="font-size:8.5pt;line-height:1.4;color:#444;">
                <div style="font-weight:700;color:${accentColor};">${clinicaNome || marca}</div>
                <div style="font-weight:700;">${crmLine || ''}</div>
                <div style="opacity:0.8;font-size:7.5pt;margin-top:1mm;">${endereco || ''}</div>
                <div style="font-weight:700;margin-top:1.5mm;">${allPhones}</div>
            </div>
        </div>
        <div style="flex:0.8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3mm;padding-top:2mm;">
            ${logoHtmlCe}
            <div style="font-size:7.5pt;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:0.5pt;text-align:center;line-height:1.2;">1ª VIA FARMÁCIA<br/>2ª VIA PACIENTE</div>
        </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:3mm;">
        ${['PACIENTE', 'ENDEREÇO'].map(l => `<div style="border-bottom:0.15mm solid #eee;padding-bottom:1.5mm;display:flex;gap:3mm;"><span style="font-size:8.5pt;font-weight:700;color:#333;text-transform:uppercase;">${l}:</span></div>`).join('')}
        <div style="margin-top:2mm;">
           <div style="font-size:8.5pt;font-weight:700;color:#333;margin-bottom:1.5mm;">PRESCRIÇÃO:</div>
           ${Array.from({length: 8}).map(() => `<div style="border-bottom:0.1mm solid #f2f2f2;height:7.5mm;"></div>`).join('')}
        </div>
    </div>

    <div style="margin-top:4mm;display:flex;justify-content:space-between;align-items:flex-end;padding:0 8mm;">
         <div style="border-bottom:0.2mm solid #333;width:35mm;text-align:center;padding-bottom:1.5mm;font-size:8pt;">Data</div>
         <div style="border-bottom:0.2mm solid #333;width:75mm;text-align:center;padding-bottom:1.5mm;font-size:8pt;font-weight:700;">Assinatura do Médico</div>
    </div>

    <div style="margin-top:auto;display:flex;gap:6mm;height:32mm;margin-bottom:2mm;">
         <div style="flex:1;background:${accentColor}10;border:0.2mm solid ${accentColor}25;padding:3mm 4mm;border-radius:1.5mm;">
            <div style="font-size:7.5pt;font-weight:800;color:${accentColor};margin-bottom:2mm;text-align:center;text-transform:uppercase;">IDENTIFICAÇÃO DO COMPRADOR</div>
            <div style="display:flex;flex-direction:column;gap:1mm;">
              ${['Nome', 'Ident.', 'Endereço', 'Cidade', 'Estado/Telefone'].map(f => `<div style="border-bottom:0.1mm solid rgba(0,0,0,0.08);height:4.2mm;"></div>`).join('')}
            </div>
         </div>
         <div style="flex:1;border:0.2mm solid #ddd;border-radius:1.5mm;position:relative;">
            <div style="position:absolute;bottom:2mm;left:0;right:0;text-align:center;font-size:7pt;color:#bbb;text-transform:uppercase;font-weight:700;">ASSINATURA DO FARMACÊUTICO</div>
         </div>
    </div>

    <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
</body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:400mm;border:none;visibility:hidden;';
        document.body.appendChild(iframe);
        iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
        const prevT = document.title;
        iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = `Controle Especial - ${marca}`; iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
        return;
      }
      if (item === 'Recibo') {
        const BLEED = 3;
        const _ffRec = brand.editData?.fontFamily || 'Playfair Display';
        const _lfRec = LOCAL_FONT_FACES[_ffRec];
        const fiRec = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfRec ? `<style>${_lfRec}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffRec.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
        
        const W = 148, H = 210;
        const BORDER = 10;
        const _bcRec = borderColor || accentColor;
        
        const patternBorder = (comBorda && patternSrc) ? `
          <div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.45).toFixed(1)}mm;background-repeat:repeat;"></div>
          <div style="position:absolute;top:${BORDER}mm;left:${BORDER}mm;right:${BORDER}mm;bottom:${BORDER}mm;background:#fff;"></div>
        ` : comBorda ? `<div style="position:absolute;inset:0;background:#fff;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BORDER}mm solid ${_bcRec};box-sizing:border-box;"></div>`;

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Recibo - ${marca}</title>${fiRec}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${W + BLEED*2}mm; height:${H + BLEED*2}mm; position:relative; overflow:hidden; background:#fff; font-family:'Montserrat',sans-serif; }
.cm { position:absolute; width:10mm; height:10mm; border-color:rgba(0,0,0,0.5); border-style:solid; border-width:0; pointer-events:none; }
.cm-tl { top:0; left:0; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:0; right:0; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:0; left:0; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:0; right:0; border-bottom:0.2mm solid; border-right:0.2mm solid; }
.field { border-bottom: 0.2mm solid #ddd; padding: 2mm 0; font-size: 10pt; color: #333; margin-top: 4mm; display:flex; gap: 4mm; align-items:flex-end; }
.label { font-weight: 700; color: ${accentColor}; text-transform: uppercase; font-size: 8pt; flex-shrink: 0; margin-bottom: 0.5mm; }
table { width: 100%; border-collapse: collapse; margin-top: 10mm; }
th { background: ${accentColor}12; color: ${accentColor}; font-size: 8pt; text-transform: uppercase; padding: 3mm; text-align: left; border: 0.2mm solid #eee; }
td { padding: 4mm 3mm; border: 0.2mm solid #eee; font-size: 10pt; color: #555; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin:0; } }
</style></head><body>
<div style="position:relative;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;overflow:hidden;">
    ${patternBorder}
    <div style="position:absolute;top:${BLEED + BORDER + 8}mm;left:${BLEED + BORDER + 12}mm;right:${BLEED + BORDER + 12}mm;bottom:${BLEED + BORDER + 12}mm;display:flex;flex-direction:column;">
        
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12mm;padding-bottom:4mm;border-bottom:0.1mm solid #f0f0f0;">
            <div style="width:65mm;">${logoHtmlWithCrm}</div>
            <div style="text-align:right;">
                <div style="font-size:18pt;font-weight:800;color:${accentColor};opacity:0.1;letter-spacing:4pt;line-height:1;">RECIBO</div>
            </div>
        </div>

        <div class="field"><span class="label">Recebi de</span> <div style="flex:1;"></div></div>
        <div class="field"><span class="label">A quantia de</span> <div style="flex:1;"></div></div>
        <div class="field"><span class="label">Referente a</span> <div style="flex:1;"></div></div>

        <table>
            <thead><tr><th style="width:20%;">Data</th><th>Descrição dos Serviços</th><th style="width:25%;text-align:right;">Total</th></tr></thead>
            <tbody>
                ${Array.from({length: 6}).map(() => `<tr><td></td><td></td><td></td></tr>`).join('')}
                <tr><td colspan="2" style="text-align:right;font-weight:700;color:${accentColor};">TOTAL</td><td style="background:${accentColor}08;"></td></tr>
            </tbody>
        </table>

        <div style="margin-top:auto;display:flex;flex-direction:column;align-items:center;">
             <div style="width:80mm;border-top:0.2mm solid #333;margin-bottom:3mm;"></div>
             <div style="font-size:9pt;font-weight:700;color:#1a1a1a;">${clinicaNome || marca}</div>
             <div style="font-size:7.5pt;color:#999;margin-top:1mm;text-transform:uppercase;letter-spacing:1pt;">${crmLine || ''}</div>
        </div>

        <div style="margin-top:8mm;padding-top:4mm;border-top:0.2mm solid #f0f0f0;display:flex;justify-content:space-between;font-size:7pt;color:#888;">
            <div>${endereco || ''}</div>
            <div style="font-weight:700;">${allPhones}</div>
        </div>
    </div>
    <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
</body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:400mm;border:none;visibility:hidden;';
        document.body.appendChild(iframe);
        iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
        const prevT = document.title;
        iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = `Recibo - ${marca}`; iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
        return;
      }

    // ── OUTROS ITENS ────────────────────────────────────────────────
    const _fontFamily2 = brand.editData?.fontFamily || 'Playfair Display';
    const _localFace2 = LOCAL_FONT_FACES[_fontFamily2];
    const fontImports2 = `
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      ${_localFace2
        ? `<style>${_localFace2}</style>`
        : `<link href="https://fonts.googleapis.com/css2?family=${_fontFamily2.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">`
      }`;

    // Tamanho de página por item
    const PAGE_SIZES = {
      'Receituário':         { w: '148mm', h: '210mm', page: 'size: A5 portrait' },
      'Timbrado':            { w: '210mm', h: '297mm', page: 'size: A4 portrait' },
      'Cartão de Retorno':   { w: '105mm', h: '148mm', page: 'size: A6 portrait' },
      'Envelope Ofício':     { w: '220mm', h: '113mm', page: 'size: 220mm 113mm landscape' },
      'Recibo':              { w: '75mm',  h: '230mm', page: 'size: 75mm 230mm portrait' },
      'Cartão de Aniversário': { w: '105mm', h: '148mm', page: 'size: A6 portrait' },
    };
    const psKey = Object.keys(PAGE_SIZES).find(k => item.includes(k));
    const ps = PAGE_SIZES[psKey] || { w: '210mm', h: '297mm', page: 'size: A4 portrait' };

    const BORDER_W = '8mm';
    const _bc3 = borderColor || accentColor;
    const patternBorder = (comBorda && patternSrc) ? `
      <div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.4).toFixed(1)}mm;background-repeat:repeat;"></div>
      <div style="position:absolute;top:${BORDER_W};left:${BORDER_W};right:${BORDER_W};bottom:${BORDER_W};background:#fff;"></div>
    ` : comBorda
      ? `<div style="position:absolute;inset:0;background:#fff;"></div>`
      : `<div style="position:absolute;inset:0;background:#fff;border:${BORDER_W} solid ${_bc3};box-sizing:border-box;"></div>`;

    // Etiqueta discreta — proporcional ao tamanho do item
    const _pw = parseFloat(ps.w); // largura em mm
    const _fs = _pw >= 200 ? '5.5' : _pw >= 140 ? '5' : '4.5'; // body font
    const _fsN = _pw >= 200 ? '6.5' : _pw >= 140 ? '5.5' : '5'; // nome font
    const _fsP = _pw >= 200 ? '6' : _pw >= 140 ? '5.5' : '5'; // phone font
    const _pad = _pw >= 200 ? '3.5mm 6mm' : '2.5mm 5mm'; // padding
    const _waIco2 = `<svg viewBox="0 0 24 24" width="7" height="7" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
    const _hasFooterData = !!(clinicaNome || mainPhone || instagram || site || endereco || email);
    const _fH = _pw >= 200 ? 18 : 14;
    const footerHtml = _hasFooterData ? `
      <div style="position:absolute;bottom:9mm;left:50%;transform:translateX(-50%);width:max-content;max-width:calc(100% - 20mm);background:rgba(255,255,255,0.97);padding:${_pad};border-radius:1mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.12mm solid #ddd;text-align:center;font-family:'Montserrat',sans-serif;white-space:nowrap;">
        ${clinicaNome ? `<div style="font-size:${_fsN}pt;font-weight:700;color:${accentColor};margin-bottom:0.8mm;">${clinicaNome}</div>` : ''}
        ${endereco ? `<div style="font-size:${_fs}pt;color:#666;opacity:0.8;">${endereco}</div>` : ''}
        ${mainPhone ? `<div style="font-size:${_fsP}pt;font-weight:700;color:#333;margin:0.8mm 0;">${_waIco2}${mainPhone}</div>` : ''}
        ${email ? `<div style="font-size:${_fs}pt;color:#666;opacity:0.8;">${email}</div>` : ''}
        ${(instagram || site) ? `<div style="font-size:${_fs}pt;color:#777;opacity:0.8;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
      </div>
      <div style="position:absolute;bottom:${8 + _fH}mm;left:14mm;right:14mm;border-top:0.4px solid #e5e5e5;"></div>` : '';

    const _logoWidthMm = logoLayout === 'horizontal'
      ? Math.round(parseFloat(ps.w) * 0.72)
      : Math.round(parseFloat(ps.w) * 0.28);
    const pageHtml = `
      <div style="position:relative;width:${ps.w};height:${ps.h};overflow:hidden;">
        ${patternBorder}
        <div style="position:absolute;top:${BORDER_W};left:50%;transform:translateX(-50%);width:${_logoWidthMm}mm;padding-top:5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          ${logoHtml}
        </div>
        ${footerHtml}
      </div>`;

    const _docTitle2 = `${item} - ${marca}`;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${_docTitle2}</title>
${fontImports2}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
  body { margin: 0; }
  @media print { @page { ${ps.page}; margin: 0; } }
</style>
</head>
<body>${pageHtml}</body>
</html>`;

    const existing2 = document.getElementById('_gabarito_iframe');
    if (existing2) existing2.remove();
    const iframe2 = document.createElement('iframe');
    iframe2.id = '_gabarito_iframe';
    iframe2.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:400mm;border:none;visibility:hidden;';
    document.body.appendChild(iframe2);
    iframe2.contentDocument.open();
    iframe2.contentDocument.write(html);
    iframe2.contentDocument.close();
    iframe2.contentDocument.title = _docTitle2;
    const _prevTitle2 = document.title;
    iframe2.contentWindow.document.fonts.ready.then(() => {
      setTimeout(() => {
        document.title = _docTitle2;
        iframe2.contentWindow.focus();
        iframe2.contentWindow.print();
        setTimeout(() => { document.title = _prevTitle2; iframe2.remove(); }, 3000);
      }, 400);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Form CRM/RQE — colapsável */}
      {isSaude && (
        <div style={{ background: '#fdf0f7', border: '1px solid #f0c0dc', borderRadius: '12px', overflow: 'hidden' }}>
          <button onClick={() => setCrmOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#8a1a50' }}>
              {crmData.crm ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe.filter(Boolean).length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / ') : ''}` : 'CRM / RQE (materiais médicos)'}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#c080b0' }}>{crmOpen ? '▲' : '▼'}</span>
          </button>
          {crmOpen && (
            <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>CRM /</span>
                <input value={crmData.uf} onChange={e => setCrmData(d => ({ ...d, uf: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="UF"
                  style={{ width: '44px', padding: '6px', fontSize: '0.8rem', border: '1px solid #e0c0d0', borderRadius: '8px', textAlign: 'center', outline: 'none' }} />
                <input value={crmData.crm} onChange={e => setCrmData(d => ({ ...d, crm: e.target.value }))} placeholder="Número"
                  style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0c0d0', borderRadius: '8px', outline: 'none' }} />
              </div>
              {crmData.rqe.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555' }}>RQE</span>
                  <input value={r} onChange={e => setCrmData(d => { const rqe = [...d.rqe]; rqe[i] = e.target.value; return { ...d, rqe }; })} placeholder="Número"
                    style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0c0d0', borderRadius: '8px', outline: 'none' }} />
                  <button onClick={() => setCrmData(d => ({ ...d, rqe: d.rqe.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: '#c00', fontSize: '1rem', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              <button onClick={() => setCrmData(d => ({ ...d, rqe: [...d.rqe, ''] }))} style={{ background: 'none', border: '1px dashed #d090b8', color: '#a0408a', borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                + Adicionar RQE
              </button>
              {crmData.crm && <button onClick={() => setCrmOpen(false)} style={{ background: accentColor, border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 14px', fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-end', fontWeight: 700 }}>Salvar</button>}
            </div>
          )}
        </div>
      )}

      {/* Contador de item */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700 }}>Item {idx + 1} de {itens.length}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {itens.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === idx ? accentColor : '#ddd', border: 'none', cursor: 'pointer', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* Nome do item atual */}
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>{currentItem}</div>

      {/* Preview inline */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px', paddingBottom: '8px' }}>
        {currentItem.includes('Cartão de Visita')
          ? <CartaoDeVisitaPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem.includes('Envelope Ofício')
            ? <EnvelopeOficioPreview accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} brand={brand} editData={editData} clinicaNome={clinicaNome} />
          : currentItem.includes('Envelope Saco')
            ? <EnvelopeSacoPreview accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} brand={brand} editData={editData} clinicaNome={clinicaNome} />
          : currentItem === 'Recibo'
            ? <ReciboPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} marca={marca} />
          : currentItem.includes('Cartão de Retorno')
            ? <CartaoRetornoPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
            : currentItem.includes('Controle Especial')
            ? <ControleEspecialPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} marca={marca} />
          : currentItem.includes('Atestado Médico')
              ? <AtestadoPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} crmLine={crmLine} clinicaNome={clinicaNome} marca={marca} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
              : currentItem.includes('Pasta')
                ? <PastaPreview brand={brand} editData={{ ...editData, tagline: localSlogan }} accentColor={accentColor} solidColor={paletteColors[0]} logoColor={logoColor} logoLayout={logoLayout} isSaude={isSaude} crmLine={crmLine} clinicaNome={clinicaNome} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} />
                : currentItem.includes('Envelope Ofício')
                  ? <EnvelopeOficioPreview accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} brand={brand} editData={editData} clinicaNome={clinicaNome} />
                : ['Receituário','Timbrado','Cartão','Guia','Calendário','Atestado','Dicas','Ficha','Orientação','Checklist','Prontuário','Receita','Certificado','Quadro','Gráfico','Diário','Card','Pratinho','Fundo','Arte','Etiqueta','Assinatura','Tag'].some(n => currentItem.includes(n))
                ? <A5ItemPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
                : <GenericItemPreview item={currentItem} marca={marca} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...editData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
        }
      </div>

      {/* Atalho de Layout na Papelaria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {currentItem.includes('Pasta') && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <button 
              onClick={() => setFolderRoof(!folderRoof)}
              style={{
                padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem',
                border: '1px solid', borderColor: folderRoof ? accentColor : '#eee',
                background: folderRoof ? `${accentColor}10` : '#fff',
                color: folderRoof ? accentColor : '#aaa', cursor: 'pointer',
                fontWeight: folderRoof ? 700 : 400, display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
            </button>
          </div>
        )}

        {marca.split(' ').length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {['horizontal', 'balanced', 'stacked'].map(l => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  padding: '5px 10px', borderRadius: '20px', fontSize: '0.68rem',
                  border: '1px solid', borderColor: logoLayout === l ? accentColor : '#eee',
                  background: logoLayout === l ? `${accentColor}10` : '#fff',
                  color: logoLayout === l ? accentColor : '#aaa', cursor: 'pointer',
                  fontWeight: logoLayout === l ? 700 : 400
                }}
              >
                {l === 'horizontal' ? '⟵→' : l === 'balanced' ? '⊟' : '≡'} {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editar contatos — acordeão (todos os itens) */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
          <button onClick={() => setContactOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#555' }}>Editar dados</span>
            <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{contactOpen ? '▲' : '▼'}</span>
          </button>
          {contactOpen && (
            <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>Slogan</span>
                <input
                  value={localSlogan}
                  onChange={e => setLocalSlogan(e.target.value)}
                  placeholder="Slogan / Especialidade"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>Clínica</span>
                <input
                  value={clinicaNome}
                  onChange={e => setClinicaNome(e.target.value)}
                  placeholder="Nome no verso (opcional)"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              {[
                { key: 'telefone', label: 'Telefone' },
                { key: 'telefone2', label: 'Telefone 2' },
                { key: 'whatsapp', label: 'WhatsApp' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'email', label: 'E-mail' },
                { key: 'site', label: 'Site' },
                { key: 'endereco', label: 'Endereço' },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>{label}</span>
                  <input
                    value={cartaoContacts[key] || ''}
                    onChange={e => setCartaoContacts(c => ({ ...c, [key]: e.target.value }))}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Modal de instruções de impressão */}
      {showPrintModal && (() => {
        const SPECS = {
          'Cartão de Visita':       { cat: 'Cartão de visita', tam: '8,5 × 5,5 cm', papel: 'Couché 300g', acabamento: 'Refile', preco: '~R$52,94 / 250 un.' },
          'Receituário':            { cat: 'Receituário', tam: 'A5', papel: 'Offset 90g+', acabamento: 'Blocos 25, 50 ou 100 fls · Mínimo 10 blocos', preco: '~R$109,19 / 10 blocos de 25 fls' },
          'Timbrado':               { cat: 'Timbrado', tam: 'A4', papel: 'Offset 90g+', acabamento: 'Refile', preco: '~R$170,85 / 250 un.' },
          'Cartão de Retorno':      { cat: 'Cartão de visita', tam: '5 × 9 cm (vertical)', papel: 'Couché 300g', acabamento: 'Refile', preco: '~R$52,94 / 250 un.' },
          'Pasta':                  { cat: 'Pasta com bolsa (sem orelha)', tam: '22 × 31 cm', papel: '', acabamento: '', preco: '~R$205,04 / 50 un.' },
          'Envelope Ofício':        { cat: 'Envelope', tam: '22 × 11,3 cm', papel: 'Acima de 120g', acabamento: 'Refile', preco: '~R$319,24 / 50 un.' },
          'Recibo':                 { cat: 'Recibo A5', tam: '14,8 × 21 cm', papel: 'Offset 120g', acabamento: 'Refile · Blocos', preco: '~R$120,84 / 10 blocos', obs: 'Formato A5 Padrão Printi. Pode ser produzido em blocos ou folhas avulsas.' },
          'Caneca':                 { cat: 'Caneca', tam: 'Arte: 20 × 8 cm · 325ml', papel: '', acabamento: '', preco: '~R$33,93 / un.', obs: 'A impressão pode deixar bordas brancas de ~1cm nas laterais.' },
          'Cartão de Aniversário':  { cat: 'Flyer', tam: 'A6', papel: 'Couché 240g+', acabamento: 'Frente e verso', preco: '~R$131,92 / 250 un.' },
          'Caderneta':              { cat: 'Livreto', tam: 'A5 (14,8 × 21 cm)', papel: 'Miolo: Offset 120g · Capa: Couché 150g+', acabamento: 'Grampo · Shirink opcional', preco: '' },
          'Livro de Atividades':    { cat: 'Livreto', tam: 'A5', papel: 'Miolo: Offset 120g · Capa: Couché 150g+', acabamento: 'Grampo', preco: '' },
        };
        const folderItems = ['Guia de Cuidados','Guia Alimentar','Guia de Desenvolvimento','Cartão de Vacina','Guia Pré-natal'];
        const spec = Object.keys(SPECS).find(k => pendingItem?.includes(k)) ? SPECS[Object.keys(SPECS).find(k => pendingItem?.includes(k))] : (folderItems.some(f => pendingItem?.includes(f)) ? { cat: 'Folder', tam: 'A5 (6 páginas)', papel: 'Couché ou Cartão 150g+', acabamento: '2 dobras (sanfonado)', preco: '~R$250,00 / 250 un.' } : null);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
            onClick={() => setShowPrintModal(false)}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px 22px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: accentColor, marginBottom: '16px' }}>
                Como salvar o PDF padrão gráfica
              </div>
              {[
                ['Margens → Nenhuma', 'Na janela de impressão, defina as margens como Nenhuma para preservar a sangria.'],
                ['Gráficos de fundo ativado', 'Ative "Gráficos de fundo" (Background graphics) para cores e estampas aparecerem.'],
                ['Destino → Salvar como PDF', 'Selecione Salvar como PDF — não envie para impressora.'],
              ].map(([titulo, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: accentColor, color: '#fff', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat',sans-serif", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.78rem', lineHeight: 1.6, color: '#333' }}>
                    <strong style={{ display: 'block', marginBottom: '1px' }}>{titulo}</strong>
                    {desc}
                  </div>
                </div>
              ))}

              {spec && <>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '0.8rem', color: '#333', margin: '16px 0 10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Especificações para a gráfica
                </div>
                <div style={{ background: '#f7f7f7', borderRadius: '10px', padding: '12px 14px', fontFamily: "'Montserrat',sans-serif", fontSize: '0.75rem', color: '#555', lineHeight: 1.8 }}>
                  {spec.cat && <div><strong>Categoria:</strong> {spec.cat}</div>}
                  {spec.tam && <div><strong>Tamanho:</strong> {spec.tam}</div>}
                  {spec.papel && <div><strong>Papel:</strong> {spec.papel}</div>}
                  {spec.acabamento && <div><strong>Acabamento:</strong> {spec.acabamento}</div>}
                  {spec.preco && <div><strong>Preço médio:</strong> {spec.preco}</div>}
                  {spec.obs && <div style={{ marginTop: '6px', color: '#c0392b', fontSize: '0.72rem' }}>⚠️ {spec.obs}</div>}
                </div>
              </>}

              <div style={{ background: '#fffbea', borderRadius: '10px', padding: '10px 14px', fontFamily: "'Montserrat',sans-serif", fontSize: '0.74rem', color: '#555', lineHeight: 1.7, margin: '12px 0 16px' }}>
                <strong>Sugestão de gráfica:</strong> printi.com.br<br/>
                Selecione <em>"Enviar minha arte final"</em> e envie o PDF gerado.<br/>
                <strong style={{ color: '#b7791f' }}>Cupom 5% off:</strong> <span style={{ fontWeight: 700, letterSpacing: '1px' }}>CIN243460MS</span> (primeira compra)
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowPrintModal(false)} style={{ flex: 1, padding: '11px', background: 'none', border: '1px solid #e0e0e0', borderRadius: '30px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', color: '#888' }}>Cancelar</button>
                <button onClick={() => { setShowPrintModal(false); openGabarito(pendingItem); }} style={{ flex: 2, padding: '11px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Entendi, baixar PDF →</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Botão download */}
      <button
        onClick={() => { setPendingItem(currentItem); setShowPrintModal(true); }}
        style={{ width: '100%', padding: '14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
      >
        Baixar PDF Padrão Gráfica →
      </button>

      {/* Navegação prev/next */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {idx > 0 && (
          <button onClick={() => setIdx(idx - 1)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #e0e0e0', borderRadius: '30px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: '#888' }}>
            ← {itens[idx - 1]}
          </button>
        )}
        {idx < itens.length - 1 && (
          <button onClick={() => setIdx(idx + 1)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #e0e0e0', borderRadius: '30px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: '#888' }}>
            {itens[idx + 1]} →
          </button>
        )}
      </div>
    </div>
  );
}

function EntregaContent({ brand, plano }) {
  const [step, setStepState] = useState('logo');
  const setStep = (s) => { setStepState(s); try { localStorage.setItem('brandbox_step', s); } catch {} };

  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoColor, setLogoColor] = useState(brand.activeColor || '#dc3495');
  const [logoLayout, setLogoLayout] = useState(() => { try { return localStorage.getItem('brandbox_logo_layout') || 'stacked'; } catch { return 'stacked'; } });
  const setLayout = (l) => { setLogoLayout(l); try { localStorage.setItem('brandbox_logo_layout', l); } catch {} };
  const [downloading, setDownloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [marca, setMarca] = useState(brand.editData?.marca || '');
  const [tagline, setTagline] = useState(brand.editData?.tagline || '');
  const [estampaPatterns, setEstampaPatterns] = useState(brand.pattern ? [brand.pattern] : []);
  const [estampaGenCount, setEstampaGenCount] = useState(brand.patternGenerationCount || 0);
  const [estampaSelectedIdx, setEstampaSelectedIdx] = useState(0);

  useEffect(() => {
    const pat = estampaPatterns[estampaSelectedIdx];
    if (pat) try { localStorage.setItem('brandbox_pattern', JSON.stringify(pat)); } catch {}
  }, [estampaPatterns, estampaSelectedIdx]);
  const coresRef = useRef(null);
  const [downloadingCores, setDownloadingCores] = useState(false);
  const [cartaoContacts, setCartaoContacts] = useState(() => { try { return JSON.parse(localStorage.getItem('brandbox_cartao') || '{}').contacts || { telefone: '', whatsapp: '', email: '', site: '', instagram: '', endereco: '', telefone2: '' }; } catch { return { telefone: '', whatsapp: '', email: '', site: '', instagram: '', endereco: '', telefone2: '' }; } });
  const [cartaoQrLink, setCartaoQrLink] = useState(() => { try { return JSON.parse(localStorage.getItem('brandbox_cartao') || '{}').qrLink || ''; } catch { return ''; } });
  const [cartaoShowQR, setCartaoShowQR] = useState(() => { try { return JSON.parse(localStorage.getItem('brandbox_cartao') || '{}').showQR || false; } catch { return false; } });

  useEffect(() => {
    try { localStorage.setItem('brandbox_cartao', JSON.stringify({ contacts: cartaoContacts, qrLink: cartaoQrLink, showQR: cartaoShowQR })); } catch {}
  }, [cartaoContacts, cartaoQrLink, cartaoShowQR]);

  const atuacoesSaude = ['Pediatria / Saúde infantil', 'Obstetrícia / Saúde da mulher', 'Clínica / Saúde geral adulta', 'Terapia / Saúde mental', 'Estética / Bem-estar / Nutrição'];
  const isSaude = atuacoesSaude.includes(brand.formData?.atuacao);

  const [clinicaNome, setClinicaNomeState] = useState(() => { try { return JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}').clinicaNome || ''; } catch { return ''; } });
  const setClinicaNome = (v) => { setClinicaNomeState(v); try { const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}'); localStorage.setItem('brandbox_papelaria', JSON.stringify({ ...cur, clinicaNome: v })); } catch {} };
  const [crmData, setCrmDataState] = useState({ crm: '', uf: '', rqe: [] });
  const setCrmData = (updater) => {
    setCrmDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem('brandbox_crm', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  useEffect(() => {
    // Carregamento inicial de tudo
    try {
      const s = localStorage.getItem('brandbox_step'); if (s) setStepState(s);

      const p = JSON.parse(localStorage.getItem('brandbox_pattern') || 'null'); if (p && !brand.pattern) setEstampaPatterns([p]);
      const crm = JSON.parse(localStorage.getItem('brandbox_crm') || 'null'); if (crm) setCrmDataState(crm);
    } catch {}
  }, []);

  const downloadCoresPNG = async () => {
    if (!coresRef.current) return;
    setDownloadingCores(true);
    try {
      const canvas = await html2canvas(coresRef.current, { scale: 3, useCORS: true, backgroundColor: '#faf9f7' });
      const link = document.createElement('a');
      link.download = `${marca || 'marca'}-paleta-cores.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloadingCores(false);
    }
  };
  const logoRef = useRef(null);

  const { paletas } = brand;
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const styleIcons = STYLE_ICONS[estiloNome] || [];
  const [selectedIcon, setSelectedIcon] = useState(brand.selectedIcon || null);
  const currentIconPath = styleIcons.find(i => i.id === selectedIcon)?.path || null;

  const editData = { ...brand.editData, marca, tagline };
  const seloData = editData.fontStyle === 'script'
    ? { ...editData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' }
    : editData;

  // Espera a fonte da marca estar disponível antes de renderizar o logo.
  // fontReady começa false e volta a false sempre que fontFamily muda —
  // isso evita o bug onde a primeira render (brand={}) seta fontReady=true
  // antes do localStorage carregar, fazendo o SVG aparecer sem a fonte certa.
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    const fontName = editData?.fontFamily;
    const fontWeight = editData?.fontWeight || 400;
    setFontReady(false);
    if (!fontName) { setFontReady(true); return; }
    let cancelled = false;
    const t = setTimeout(() => { if (!cancelled) setFontReady(true); }, 5000);

    const loadFont = () => {
      document.fonts.load(`${fontWeight} 16px '${fontName}'`)
        .then(() => { if (!cancelled) setFontReady(true); })
        .catch(() => { if (!cancelled) setFontReady(true); });
    };

    // Fontes locais já estão registradas via globals.css — document.fonts.ready é suficiente.
    // Google Fonts precisam de um <link> específico para garantir que o @font-face seja
    // registrado antes de chamarmos document.fonts.load().
    const LOCAL_FONTS = ['Amelie', 'Vellary', 'GoldenBlast', 'LittleFriend', 'Celina', 'Cafigine', 'Aberforth', 'Dokyo'];
    if (LOCAL_FONTS.includes(fontName)) {
      document.fonts.ready.then(loadFont);
    } else {
      const selector = `link[data-font="${CSS.escape(fontName)}"]`;
      const existing = document.querySelector(selector);
      if (existing) {
        loadFont();
      } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-font', fontName);
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${fontWeight}&display=swap`;
        link.onload = () => { if (!cancelled) loadFont(); };
        link.onerror = () => { if (!cancelled) setFontReady(true); };
        document.head.appendChild(link);
      }
    }

    return () => { cancelled = true; clearTimeout(t); };
  }, [editData?.fontFamily, editData?.fontWeight]);

  const paletteColors = (() => {
    // 1. Prioridade total: cores salvas diretamente no objeto da marca
    if (brand.currentPaletteColors?.length > 0) return brand.currentPaletteColors;

    // 2. Fallback: buscar na lista global pelo ID
    const sel = paletas?.find(p => p.id === brand.selectedPaleta);
    const hex = sel?.paleta_hex || sel?.cores_hex || [];
    if (hex.length > 0) return hex;

    // 3. Fallback de emergência: qualquer paleta carregada ou a cor ativa
    const any = paletas?.find(p => p.paleta_hex?.length > 0);
    return any?.paleta_hex || [brand.activeColor || '#dc3495'];
  })();

  const BG_OPTIONS = [
    { color: '#ffffff', label: 'Branco' },
    { color: '#faf8f4', label: 'Creme' },
    { color: logoColor, label: 'Marca' },
    { color: '#1a1a1a', label: 'Escuro' },
    { color: '#f0ece6', label: 'Neutro' },
  ];

  const downloadComFundo = async () => {
    if (!logoRef.current) return;
    setDownloading('fundo');
    const el = logoRef.current;
    try {
      const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: bgColor });
      const link = document.createElement('a');
      link.download = `${marca || 'logo'}-com-fundo.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const downloadTransparent = async () => {
    if (!logoRef.current) return;
    setDownloading('png');
    const el = logoRef.current;
    const prev = el.style.background;
    try {
      el.style.background = 'transparent';
      const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: null });
      el.style.background = prev;
      const link = document.createElement('a');
      link.download = `${marca || 'logo'}-sem-fundo.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      el.style.background = prev;
    } finally {
      setDownloading(false);
    }
  };

  const accentColor = logoColor || '#dc3495';

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: 'Montserrat, sans-serif', paddingBottom: '3rem' }}>

      {/* Banner topo */}
      <div className="mobile-col" style={{ background: '#e8f7f5', padding: '10px 20px', textAlign: 'center', fontSize: '0.78rem', color: '#1a7a6e', fontWeight: 600, letterSpacing: '0.3px', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
        <span>🎉 Pagamento confirmado! Aqui está sua marca.</span>
        <span style={{ fontSize: '0.7rem', color: '#115048' }}>Faça o download dos arquivos neste dispositivo atual por segurança.</span>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1.4rem 0' }}>

        {/* NOVO MENU DE NAVEGAÇÃO CATEGORIZADA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', background: '#eee', padding: '3px', borderRadius: '12px', gap: '2px' }}>
            {['marca', 'digital', 'papelaria'].map(cat => {
              const isActive = (cat === 'marca' && ['logo','submarca','estampa','cores','guia'].includes(step)) ||
                               (cat === 'digital' && step === 'cartao') ||
                               (cat === 'papelaria' && step === 'papelaria');
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'marca') setStep('logo');
                    if (cat === 'digital') setStep('cartao');
                    if (cat === 'papelaria') setStep('papelaria');
                  }}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: '10px', border: 'none',
                    fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                    background: isActive ? '#fff' : 'transparent',
                    color: isActive ? '#1a1a1a' : '#999',
                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  {cat === 'marca' ? '✨ A Marca' : cat === 'digital' ? '📱 O Digital' : '📂 Papelaria'}
                </button>
              );
            })}
          </div>

          {/* Sub-menu para Marca */}
          {['logo','submarca','estampa','cores','guia'].includes(step) && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '5px 0', scrollbarWidth: 'none' }} className="no-scrollbar">
              {[
                { id: 'logo', label: 'Logo' },
                { id: 'submarca', label: 'Selo' },
                { id: 'estampa', label: 'Estampa' },
                { id: 'cores', label: 'Cores' },
                { id: 'guia', label: 'Manifesto' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setStep(item.id)}
                  style={{
                    whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
                    background: step === item.id ? `${accentColor}15` : 'transparent',
                    color: step === item.id ? accentColor : '#bbb',
                    border: 'none', cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header (Simplificado) */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
              {step === 'logo' ? 'Sua Logo' : step === 'submarca' ? 'Sua Submarca' : step === 'estampa' ? 'Sua Estampa' : step === 'cores' ? 'Suas Cores' : step === 'cartao' ? 'Cartão Digital' : step === 'guia' ? 'Guia da Marca' : 'Gabaritos'}
            </h1>
          </div>
        </div>

        {/* Área da estampa */}
        {step === 'estampa' && <EstampaStep brand={brand} accentColor={accentColor} marca={marca} patterns={estampaPatterns} setPatterns={setEstampaPatterns} genCount={estampaGenCount} setGenCount={setEstampaGenCount} selectedIdx={estampaSelectedIdx} setSelectedIdx={setEstampaSelectedIdx} paletteColors={paletteColors} />}

        {/* Área das cores */}
        {step === 'cores' && <CoresStep paletteColors={paletteColors} accentColor={accentColor} paletaNome={paletas?.find(p => p.id === brand.selectedPaleta)?.nome_variacao} coresRef={coresRef} />}

        {/* Cartão digital */}
        {step === 'cartao' && <CartaoStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} contacts={cartaoContacts} setContacts={setCartaoContacts} qrLink={cartaoQrLink} setQrLink={setCartaoQrLink} showQR={cartaoShowQR} setShowQR={setCartaoShowQR} logoLayout={logoLayout} editData={editData} logoColor={logoColor} setLayout={setLayout} />}

        {/* Guia da marca */}
        {step === 'guia' && <GuiaStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} tagline={tagline} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} editData={editData} />}

        {/* Papelaria / Gabaritos */}
        {step === 'papelaria' && <PapelariaStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} cartaoContacts={cartaoContacts} setCartaoContacts={setCartaoContacts} plano={plano} isSaude={isSaude} crmData={crmData} setCrmData={setCrmData} marca={marca} editData={editData} logoColor={logoColor} logoLayout={logoLayout} setLayout={setLayout} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} />}

        {/* Área da logo */}
        {step !== 'estampa' && step !== 'cores' && step !== 'cartao' && step !== 'guia' && step !== 'papelaria' && <div
          ref={logoRef}
          style={{
            width: '100%', aspectRatio: '1 / 1',
            background: bgColor,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <div style={{ width: '68%', height: '68%' }}>
            {step === 'logo'
              ? <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} />
              : <BrandTemplateSVG
                  data={seloData}
                  color={logoColor}
                  side="verso"
                  hideBackground={true}
                  iconPath={currentIconPath}
                />
            }
          </div>
        </div>}

        {/* Controles */}
        {step !== 'estampa' && step !== 'cores' && step !== 'cartao' && step !== 'guia' && step !== 'papelaria' &&
        <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Editar texto */}
          <div>
            <button
              onClick={() => setShowEdit(v => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <SectionLabel>✏️ Editar texto {showEdit ? '▲' : '▼'}</SectionLabel>
            </button>
            {showEdit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <input
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  placeholder="Nome da marca"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />
                <input
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Tagline / frase da marca"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />
              </div>
            )}
          </div>

          {/* Layout da logo */}
          {step === 'logo' && marca.split(' ').length > 1 && (
            <div>
              <SectionLabel>Layout</SectionLabel>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'horizontal', label: '⟵→ Uma linha' },
                  { key: 'balanced',   label: '⊟ Duas linhas',     hide: marca.split(' ').length < 3 },
                  { key: 'stacked',    label: '≡ Empilhada' },
                ].filter(o => !o.hide).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLayout(key)}
                    style={{
                      padding: '5px 13px', borderRadius: '20px', fontSize: '0.72rem',
                      fontWeight: 600, cursor: 'pointer', border: 'none',
                      background: logoLayout === key ? logoColor : '#eee',
                      color: logoLayout === key ? '#fff' : '#888',
                      transition: 'all 0.15s ease',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Fundo (só na logo) */}
          {step === 'logo' && <div>
            <SectionLabel>Fundo</SectionLabel>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {BG_OPTIONS.map(opt => (
                <ColorDot
                  key={opt.label}
                  color={opt.color}
                  selected={bgColor === opt.color}
                  onClick={() => setBgColor(opt.color)}
                />
              ))}
            </div>
          </div>}

          {/* Ícone da submarca (só aparece na etapa submarca) */}
          {step === 'submarca' && styleIcons.length > 0 && (
            <div>
              <SectionLabel>Ícone</SectionLabel>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  onClick={() => setSelectedIcon(null)}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
                    background: selectedIcon === null ? logoColor : '#f5f5f5',
                    border: selectedIcon === null ? '3px solid #333' : '2px solid #ddd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: selectedIcon === null ? '#fff' : '#aaa', fontWeight: 700,
                    flexShrink: 0, transition: 'all 0.15s ease',
                    transform: selectedIcon === null ? 'scale(1.15)' : 'scale(1)',
                  }}
                >—</div>
                {styleIcons.map(icon => (
                  <div
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon.id)}
                    title={icon.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
                      background: selectedIcon === icon.id ? logoColor : '#f5f5f5',
                      border: selectedIcon === icon.id ? '3px solid #333' : '2px solid #ddd',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s ease',
                      transform: selectedIcon === icon.id ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <img src={icon.path} alt={icon.label}
                      style={{ width: 22, height: 22, objectFit: 'contain',
                        filter: selectedIcon === icon.id ? 'brightness(0) invert(1)' : 'none' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cor da logo */}
          {paletteColors.length > 0 && (
            <div>
              <SectionLabel>Cor da logo</SectionLabel>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} />
                ))}
              </div>
            </div>
          )}
        </div>}

        {/* Botões REDESENHADOS */}
        <div style={{ marginTop: '1.6rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* BOTÕES DE DOWNLOAD (AÇÃO PRO) */}
          {(step === 'logo' || step === 'submarca') && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={downloadTransparent}
                disabled={!!downloading}
                style={{ flex: 1, padding: '14px 8px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: downloading === 'png' ? 0.6 : 1 }}
              >
                {downloading === 'png' ? '...' : <><span style={{ fontSize: '1.1rem' }}>⬇</span> PNG Transparente</>}
              </button>
              <button
                onClick={downloadComFundo}
                disabled={!!downloading}
                style={{ flex: 1, padding: '14px 8px', background: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: downloading === 'fundo' ? 0.6 : 1 }}
              >
                {downloading === 'fundo' ? '...' : <><span style={{ fontSize: '1.1rem' }}>⬇</span> Com Fundo</>}
              </button>
            </div>
          )}

          {step === 'cores' && (
            <button onClick={downloadCoresPNG} disabled={downloadingCores} style={{ width: '100%', padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: downloadingCores ? 0.6 : 1 }}>
              {downloadingCores ? '...' : <><span style={{ fontSize: '1.1rem' }}>⬇</span> Baixar Paleta de Cores (PNG)</>}
            </button>
          )}

          {/* BOTÃO DE NAVEGAÇÃO (CONECTOR) */}
          <div style={{ marginTop: '5px' }}>
            {step === 'logo' && (
              <button onClick={() => setStep('submarca')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                Próximo: Submarca →
              </button>
            )}
            {step === 'submarca' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setStep('estampa')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Próximo: Estampa →
                </button>
                <button onClick={() => setStep('logo')} style={{ width: '100%', padding: '8px', background: 'none', color: '#bbb', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  ← Voltar para a logo
                </button>
              </div>
            )}
            {step === 'estampa' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setStep('cores')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Próximo: Cores →
                </button>
                <button onClick={() => setStep('submarca')} style={{ width: '100%', padding: '8px', background: 'none', color: '#bbb', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  ← Voltar para a submarca
                </button>
              </div>
            )}
            {step === 'cores' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setStep('cartao')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Próximo: Cartão Digital →
                </button>
                <button onClick={() => setStep('estampa')} style={{ width: '100%', padding: '8px', background: 'none', color: '#bbb', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  ← Voltar para a estampa
                </button>
              </div>
            )}
            {step === 'cartao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setStep(plano === 'complete' ? 'papelaria' : 'guia')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {plano === 'complete' ? 'Próximo: Papelaria →' : 'Próximo: Guia da Marca →'}
                </button>
                <button onClick={() => setStep('cores')} style={{ width: '100%', padding: '8px', background: 'none', color: '#bbb', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  ← Voltar para as cores
                </button>
              </div>
            )}
            {step === 'papelaria' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setStep('guia')} style={{ width: '100%', padding: '13px', background: `${accentColor}20`, color: accentColor, border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Próximo: Guia da Marca →
                </button>
                <button onClick={() => setStep('cartao')} style={{ width: '100%', padding: '8px', background: 'none', color: '#bbb', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  ← Voltar para o cartão
                </button>
              </div>
            )}
            {step === 'guia' && (
              <button onClick={() => setStep(plano === 'complete' ? 'papelaria' : 'cartao')} style={{ width: '100%', padding: '10px', background: 'none', color: '#999', border: '1px solid #ddd', borderRadius: '30px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                {plano === 'complete' ? '← Voltar para a papelaria' : '← Voltar para o cartão'}
              </button>
            )}
          </div>
        </div>

        {/* Link de reset para testes */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button
            onClick={() => { localStorage.removeItem('brandbox_delivery'); localStorage.removeItem('brandbox_cartao'); localStorage.removeItem('brandbox_step'); window.location.href = '/'; }}
            style={{ background: 'none', border: 'none', fontSize: '0.62rem', color: '#ddd', cursor: 'pointer', letterSpacing: '1px' }}
          >
            reiniciar teste
          </button>
        </div>

      </div>
    </div>
  );
}

function SucessoContent() {
  const params = useSearchParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [plano, setPlano] = useState(() => {
    try {
      const stored = localStorage.getItem('brandbox_plano');
      if (stored) return stored;
      const delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
      if (delivery.plano) return delivery.plano;
      if (delivery.papelariaSelecionada?.length > 0) return 'complete';
    } catch {}
    return 'experience';
  });

  useEffect(() => {

    const sessionParam = params.get('session');
    const planoParam = params.get('plano');

    if (params.get('reset') === '1') {
      localStorage.removeItem('brandbox_step');
      localStorage.removeItem('brandbox_crm');
      localStorage.removeItem('brandbox_papelaria');
      localStorage.removeItem('brandbox_session');
      localStorage.removeItem('brandbox_email_sent');
      localStorage.removeItem('brandbox_progress');
      window.location.href = '/sucesso';
      return;
    }

    // Se chegou aqui com sucesso, o rascunho anterior não faz mais sentido oferecer na home
    localStorage.removeItem('brandbox_progress');
    localStorage.removeItem('brandbox_step');

    const loadData = async () => {
      // 1. Se tem session na URL, busca no Supabase (link permanente)
      if (sessionParam) {
        localStorage.setItem('brandbox_session', sessionParam);
        try {
          const { data, error } = await supabase
            .from('entregas')
            .select('brand_data, plano, email, marca, email_enviado')
            .eq('id', sessionParam)
            .single();

          if (!error && data) {
            const brandFromDb = data.brand_data;
            setBrand(brandFromDb);
            const planoFromDb = data.plano || planoParam || 'experience';
            setPlano(planoFromDb);
            localStorage.setItem('brandbox_plano', planoFromDb);

            // Disparar e-mail na primeira visita
            if (!data.email_enviado && data.email) {
              try {
                await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: data.email,
                    marca: data.marca,
                    sessionId: sessionParam,
                    plano: planoFromDb,
                  }),
                });
                // Marcar como enviado no Supabase
                await supabase
                  .from('entregas')
                  .update({ email_enviado: true })
                  .eq('id', sessionParam);
              } catch (e) {
                console.warn('Email dispatch failed:', e);
              }
            }

            setShowWelcome(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch failed, fallback para localStorage:', e);
        }
      }

      // 2. Fallback: lê do localStorage (sem sessão Supabase)
      // Se veio do Stripe (tem planoParam) e email ainda não foi enviado, dispara agora
      if (planoParam && !localStorage.getItem('brandbox_email_sent')) {
        try {
          const delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
          const emailToSend = delivery.formData?.email;
          const marcaToSend = delivery.formData?.marca || delivery.editData?.marca;
          if (emailToSend) {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: emailToSend, marca: marcaToSend, sessionId: 'no-session', plano: planoParam }),
            }).then(() => localStorage.setItem('brandbox_email_sent', '1')).catch(() => {});
          }
        } catch {}
      }

      if (planoParam) {
        localStorage.setItem('brandbox_plano', planoParam);
        setPlano(planoParam);
      } else {
        const savedPlano = localStorage.getItem('brandbox_plano');
        if (savedPlano) {
          setPlano(savedPlano);
        } else {
          try {
            const delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
            const derived = delivery.plano || (delivery.papelariaSelecionada ? 'complete' : 'experience');
            localStorage.setItem('brandbox_plano', derived);
            setPlano(derived);
          } catch { setPlano('experience'); }
        }
      }

      try {
        const saved = localStorage.getItem('brandbox_delivery');
        if (saved) setBrand(JSON.parse(saved));
      } catch {}
      if (planoParam) setShowWelcome(true);
      setLoading(false);
    };

    loadData();
  }, []);


  if (loading) return null;

  if (showWelcome) {
    const rawNome = brand?.formData?.nome || brand?.editData?.marca || '';
    const nomeCliente = rawNome.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)',
        padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Fundo decorativo */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(220,52,149,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(60,204,191,0.07)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {/* Ícone */}
          <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>✨</div>

          {/* Título */}
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#dc3495', fontWeight: 700, marginBottom: '0.75rem' }}>
              BRAND BOX
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, margin: 0 }}>
              {nomeCliente
                ? <><span style={{ fontFamily: "Sacramento, cursive", fontSize: '2.8rem', fontWeight: 400, color: '#1a1a1a' }}>{nomeCliente}</span><span style={{ fontWeight: 400, color: '#555', fontSize: '1.3rem' }}>,</span><br /></>
                : null
              }
              <span style={{ fontWeight: 800, color: '#1a1a1a' }}>sua marca está nascendo agora!</span>
            </h1>
          </div>

          {/* Mensagem emocional */}
          <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
            Esse é o começo de algo lindo. Nós vamos te guiar, passo a passo, para você construir a <strong>marca dos seus sonhos</strong> — com a sua essência, do seu jeito.
          </p>

          {/* Separador */}
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #dc3495, #3cccbf)', borderRadius: '2px' }} />

          {/* CTA */}
          <button
            onClick={() => setShowWelcome(false)}
            style={{
              background: 'linear-gradient(135deg, #dc3495, #c42d84)',
              color: '#fff', border: 'none', borderRadius: '50px',
              padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.3px',
              boxShadow: '0 10px 30px rgba(220,52,149,0.3)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Vamos construir minha marca →
          </button>

          <p style={{ fontSize: '0.75rem', color: '#bbb', margin: 0 }}>
            Pagamento confirmado · {plano === 'complete' ? 'Brand Box Complete' : 'Brand Box Experience'}
          </p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>Pagamento confirmado!</h1>
        <p style={{ fontSize: '1rem', color: '#555', maxWidth: '400px', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {plano === 'experience'
            ? 'Seus arquivos estão sendo preparados e você receberá tudo por e-mail em instantes.'
            : 'Entraremos em contato em até 2 dias úteis pelo e-mail cadastrado.'}
        </p>
        <a href="/" style={{ padding: '12px 28px', background: '#dc3495', color: '#fff', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
          Voltar ao início
        </a>
      </div>
    );
  }

  return <EntregaContent brand={brand} plano={plano} />;
}

export default function Sucesso() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', color: '#aaa' }}>Carregando sua marca...</div>}>
      <SucessoContent />
    </Suspense>
  );
}
