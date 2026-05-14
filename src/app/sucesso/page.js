'use client';
import { useSearchParams } from 'next/navigation';
import BrandBoxNav from './BrandBoxNav';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import BrandTemplateSVG from '../../components/BrandTemplateSVG';
import BrandBoard from '../../components/BrandBoard';
import FolderPage2Art from './FolderPage2Art';
import FolderPage3Art from './FolderPage3Art';
import FolderPage4Art from './FolderPage4Art';
import FolderPage5Art from './FolderPage5Art';
import FolderDevPage2 from './FolderDevPage2';
import FolderDevPage3 from './FolderDevPage3';
import FolderDevPage4 from './FolderDevPage4';
import FolderDevPage5 from './FolderDevPage5';
import { genPDFLogoHtml, PratinhoArtSVG, genPDFFooter, PDFStyles } from './PDFTemplates';
import FolderPage6Etiqueta from './FolderPage6Etiqueta';
import PrenatalPage1 from './PrenatalPage1';
import PrenatalPage2 from './PrenatalPage2';
import PrenatalPage3 from './PrenatalPage3';
import PrenatalPage4 from './PrenatalPage4';
import { STYLE_ICONS } from '../../lib/styleIcons';
import FONT_MAP from '../../lib/fontMap';
import FolderVacinaPage1 from './FolderVacinaPage1';
import FolderVacinaPage2 from './FolderVacinaPage2';
import FolderVacinaPage3 from './FolderVacinaPage3';
import FolderVacinaPage4 from './FolderVacinaPage4';
import FolderVacinaPage5 from './FolderVacinaPage5';
import FolderVacinaPage6 from './FolderVacinaPage6';
import GraficoCrescimentoPreview, { WHO, MONTHS, PC_MONTHS, Z_CURVES, GrowthChart } from './GraficoCrescimento';
import FolderCuidadosPage2 from './FolderCuidadosPage2';
import FolderCuidadosPage3 from './FolderCuidadosPage3';
import FolderCuidadosPage4 from './FolderCuidadosPage4';
import FolderCuidadosPage5 from './FolderCuidadosPage5';
import FolderSonoPage2 from './FolderSonoPage2';
import FolderSonoPage3 from './FolderSonoPage3';
import FolderSonoPage4 from './FolderSonoPage4';
import FolderSonoPage5 from './FolderSonoPage5';
// FolderAmamentacaoPages defined locally below
import html2canvas from 'html2canvas';
import MeuPratinhoPreview from './MeuPratinhoPreview';
import EtiquetaCorreiosPreview from './EtiquetaCorreiosPreview';
import SacolaPapelPreview from './SacolaPapelPreview';
import TagSacolaPreview from './TagSacolaPreview';
import CartaoAgradecimentoPreview from './CartaoAgradecimentoPreview';
import ReceitaAltaPreview, { buildReceitaAltaHTML } from './ReceitaAltaPreview';
import CanecaPreview from './CanecaPreview';
import PapelPresentePreview from './PapelPresentePreview';
import GuiaAmamentacaoPreview from './GuiaAmamentacaoPreview';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const ITEM_CUSTOM_BASE_SCALES = {
  'Envelope Saco (24x34cm)': 2.0,
  'Envelope Saco': 2.0,
  'Pasta A4': 2.0,
  'Receituário Padrão': 2.0, 
  'Receituário de Controle Especial': 2.0,
  'Atestado Médico': 2.0, 'Recibo': 2.0, 'Cartão de Retorno': 2.0,
  'Ficha de Cadastro': 2.0, 'Prontuário Médico': 2.0,
  'Certificado de Coragem': 2.0,
  // Folders and other standardized items
  'Guia Alimentar': 2.0,
  'Guia de Cuidados': 2.0,
  'Guia de Desenvolvimento': 2.0,
  'Cartão de Exame Pré-Natal': 2.0,
  'Guia do Sono': 2.0,
  'Guia de Amamentação': 2.0,
  'Guia de Vacina c/ Calendário': 2.0,
  'Cartão de Vacina': 2.0,
  'Diário do Xixi': 2.0,
  'Cartão de Visita': 2.0,
  'Tag para Sacola': 2.0,
  'Etiqueta para Correios': 2.0,
  'Checklist Maternidade': 2.0,
  'Envelope Ofício (23x11,5cm)': 2.0,
  'Envelope Ofício': 2.0,
  'Orientações p/ Recém Nascidos': 2.0,
  'Sacola de Papel': 2.0,
  'Pasta': 2.0,
  'Receituário': 2.0,
};

export function LogoPreviewHTML({ item = null, editData, color, layout = 'stacked', scaleFactor = 1, crm = null, hideTagline = false, customLogoSrc: customLogoSrcProp = null, customLogoScale: customLogoScaleProp = 100, maxWidth = null, maxHeight = null, withBackground = false, alignLeft = false, taglineColor = null, autoFit = true }) {
  const _fitRef = React.useRef(null);
  const _rootRef = React.useRef(null);
  const [_fitState, _setFitState] = React.useState({ scale: 1, w: 'auto', h: 'auto', ready: false });
  const [forceTrigger, setForceTrigger] = React.useState(0);

  React.useEffect(() => {
    const t1 = setTimeout(() => setForceTrigger(1), 50);
    const t2 = setTimeout(() => setForceTrigger(2), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const customLogoSrc = customLogoSrcProp || editData?.customLogoSrc || null;
  const customLogoScale = customLogoSrcProp ? customLogoScaleProp : (editData?.customLogoScale || 100);

  const isScript = editData?.fontStyle === 'script';
  const sizeBoost = editData?.fontSizeBoost || 1;
  const baseScale = (item && ITEM_CUSTOM_BASE_SCALES[item]) || 1;
  const effectiveScaleFactor = scaleFactor * (customLogoScale / 100) * baseScale;
  const marca = editData?.marca || '';
  const words = marca.split(' ').map(w => isScript ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase());

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
  const explicitMaxH = (maxHeight && !String(maxHeight).includes('%')) ? parseInt(maxHeight) : null;
  const explicitMaxW = (maxWidth && !String(maxWidth).includes('%')) ? parseInt(maxWidth) : null;
  const targetMaxW = explicitMaxW || Math.round(400 * effectiveScaleFactor);
  const targetMaxH = explicitMaxH || Math.round(180 * effectiveScaleFactor);

  React.useLayoutEffect(() => {
    if (customLogoSrc) return;
    const el = _fitRef.current;
    if (!autoFit || !el) {
      if (!_fitState.ready) _setFitState({ scale: 1, w: 'auto', h: 'auto', ready: true });
      return;
    }
    const observer = new ResizeObserver(() => {
      const natW = el.offsetWidth;
      const natH = el.offsetHeight;
      if (!natW || !natH) return;
      let tMaxW = targetMaxW;
      let tMaxH = targetMaxH;
      const realParent = _rootRef.current ? _rootRef.current.parentNode : null;
      if (maxWidth && String(maxWidth).includes('%') && realParent && realParent.clientWidth > 0) {
         tMaxW = Math.min(targetMaxW, realParent.clientWidth * (parseFloat(maxWidth)/100));
      }
      if (maxHeight && String(maxHeight).includes('%') && realParent && realParent.clientHeight > 0) {
         tMaxH = Math.min(targetMaxH, realParent.clientHeight * (parseFloat(maxHeight)/100));
      }
      if (withBackground) {
        tMaxW = Math.max(10, tMaxW - 28);
        tMaxH = Math.max(10, tMaxH - 16);
      }
      const sx = tMaxW / natW;
      const sy = tMaxH / natH;
      const scale = Math.min(sx, sy, 1.15);
      _setFitState({ scale, w: natW * scale, h: natH * scale, ready: true });
    });
    observer.observe(el);
    const realParentToObserve = _rootRef.current ? _rootRef.current.parentNode : null;
    if (realParentToObserve) observer.observe(realParentToObserve);
    return () => observer.disconnect();
  }, [editData, effectiveScaleFactor, targetMaxW, targetMaxH, layout, crm, hideTagline, autoFit, maxWidth, maxHeight, withBackground, forceTrigger, customLogoSrc]);

  if (customLogoSrc) {
    const baseScale = (item && ITEM_CUSTOM_BASE_SCALES[item]) || 1;
    const scaleMultiplier = (customLogoScale / 100) * baseScale * scaleFactor;
    const explicitMaxH = (maxHeight && !String(maxHeight).includes('%')) ? parseInt(maxHeight) : null;
    const explicitMaxW = (maxWidth && !String(maxWidth).includes('%')) ? parseInt(maxWidth) : null;
    const baseH = 60; // Altura base fixa para imagens no preview
    const maxH = (baseH * scaleMultiplier);
    
    const imgStyle = {
      maxWidth: explicitMaxW ? `${explicitMaxW}px` : (maxWidth || '100%'),
      maxHeight: explicitMaxH ? `min(${maxH}px, ${explicitMaxH}px)` : (maxHeight || '100%'),
      width: 'auto',
      height: `${maxH}px`,
      display: 'block',
      objectFit: 'contain',
      mixBlendMode: withBackground ? 'normal' : 'multiply'
    };

    const containerStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: alignLeft ? 'flex-start' : 'center',
      maxWidth: maxWidth || '100%',
      maxHeight: maxHeight || 'none',
      overflow: 'hidden',
      height: '100%'
    };

    if (withBackground) {
      return (
        <div style={containerStyle}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.92)', padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(2px)', maxWidth: '100%' }}>
            <img src={customLogoSrc} alt="logo" style={imgStyle} />
          </div>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <img src={customLogoSrc} alt="logo" style={imgStyle} />
      </div>
    );
  }

  const isSansBold = !isScript && (editData?.fontWeight || 700) >= 700 && (sizeBoost <= 1.0);
  const sansPenalty = (isSansBold && effectiveScaleFactor > 1.5) ? (marca.length > 18 ? 0.42 : marca.length > 12 ? 0.55 : marca.length > 8 ? 0.68 : 1) : 1;
  const logoSizeRem = baseSize * sizeBoost * effectiveScaleFactor * sansPenalty;
  const fontSize = `${logoSizeRem.toFixed(2)}rem`;
  const taglineSizeRem = Math.max(logoSizeRem * 0.40, 0.38 * effectiveScaleFactor);
  const taglineVisible = taglineSizeRem >= 0.08;
  const taglineGapPx = Math.round(taglineSizeRem * 16 * 0.4);
  const taglineLetterSpacing = '0.35em';



  const innerContent = (
    <>
      <div style={{
        fontFamily: `'${editData?.fontFamily || 'Playfair Display'}', serif`,
        fontWeight: editData?.fontWeight || 700,
        fontSize,
        color: color,
        textAlign: alignLeft ? 'left' : 'center',
        lineHeight: editData?.fontLineHeight || (isScript ? 1.6 : 1.1),
        letterSpacing: editData?.fontLetterSpacing || (isScript ? '0px' : '1px'),
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontFamily: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', whiteSpace: 'nowrap' }}>{line}</div>
        ))}
      </div>
      {(editData?.tagline && !hideTagline && taglineVisible) && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${taglineSizeRem.toFixed(2)}rem`, letterSpacing: taglineLetterSpacing, textTransform: 'uppercase', color: taglineColor || '#666', marginTop: `${taglineGapPx}px`, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          {editData.tagline}
        </div>
      )}
      {crm && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${(taglineSizeRem * 0.75).toFixed(2)}rem`, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginTop: `${Math.round(taglineGapPx * 0.5)}px`, textAlign: 'center', opacity: 0.8, whiteSpace: 'nowrap' }}>
          {crm}
        </div>
      )}
    </>
  );

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: alignLeft ? 'flex-start' : 'center',
    width: _fitState.ready && _fitState.w !== 'auto' ? `${_fitState.w}px` : 'auto',
    height: _fitState.ready && _fitState.h !== 'auto' ? `${_fitState.h}px` : 'auto',
    maxWidth: '100%',
    position: 'relative',
    // Remover opacity: 0 para evitar que a logo suma no PDF (SSR/html2canvas)
  };

  const innerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: alignLeft ? 'flex-start' : 'center',
    justifyContent: 'center',
    width: 'max-content',
    flexShrink: 0,
    transform: `scale(${_fitState.scale})`,
    transformOrigin: alignLeft ? 'left center' : 'center center',
  };

  const textContent = (
    <div ref={!withBackground ? _rootRef : null} style={wrapperStyle}>
      <div style={innerStyle}>
        <div ref={_fitRef} style={{ display: 'flex', flexDirection: 'column', alignItems: alignLeft ? 'flex-start' : 'center' }}>
          {innerContent}
        </div>
      </div>
    </div>
  );

  if (withBackground) {
    return (
      <div ref={_rootRef} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: alignLeft ? 'flex-start' : 'center', background: 'rgba(255,255,255,0.92)', padding: '8px 14px', borderRadius: '4px', backdropFilter: 'blur(2px)', maxWidth: '100%', maxHeight: '100%', boxSizing: 'border-box' }}>
        {textContent}
      </div>
    );
  }
  return textContent;
}

function ColorDot({ color, selected, onClick, size = 32, outlined = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: color,
        cursor: 'pointer',
        border: selected ? '3px solid #333' : outlined ? '1.5px solid #ccc' : '2px solid transparent',
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

function shade(hex, amount) {
  const [r,g,b] = hexToRgb(hex);
  const s = v => Math.round(v * (1-amount)).toString(16).padStart(2,'0');
  return `#${s(r)}${s(g)}${s(b)}`;
}

function getLuminance(hex) {
  const [r,g,b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function ensureLegibleColor(hex) {
  if (!hex || hex === 'transparent' || hex.length < 4) return '#666';
  const lum = getLuminance(hex);
  if (lum > 0.65) return shade(hex, 0.4); 
  return hex;
}

function getLegibleBgOpacity(hex) {
  if (!hex || hex === 'transparent' || hex.length < 4) return '0d';
  const lum = getLuminance(hex);
  if (lum > 0.85) return '26'; // Cores muito claras (amarelo) - 15%
  if (lum > 0.65) return '1a'; // Cores claras (pastel) - 10%
  return '0f'; // Cores escuras - 6%
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

function CoresSalvarButton({ colorOrder, accentColor }) {
  const [saved, setSaved] = React.useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <button onClick={handleSave} style={{ width: '100%', padding: '14px', background: saved ? '#4CAF50' : accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s' }}>
      {saved ? '✓ Ordem salva! A papelaria já foi atualizada.' : 'Salvar ordem das cores →'}
    </button>
  );
}

function CoresPrioridadeStep({ paletteColors, colorOrder, setColorOrder, accentColor }) {
  const ordered = React.useMemo(() => {
    if (!colorOrder) return paletteColors.map((c, i) => ({ color: c, idx: i }));
    return colorOrder.map(i => ({ color: paletteColors[i], idx: i })).filter(x => x.color);
  }, [paletteColors, colorOrder]);

  const [dragging, setDragging] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(null);

  const onDragStart = (i) => setDragging(i);
  const onDragOver = (e, i) => { e.preventDefault(); setDragOver(i); };
  const onDrop = (e, i) => {
    e.preventDefault();
    if (dragging === null || dragging === i) { setDragging(null); setDragOver(null); return; }
    const newOrder = [...ordered];
    const [moved] = newOrder.splice(dragging, 1);
    newOrder.splice(i, 0, moved);
    setColorOrder(newOrder.map(x => x.idx));
    setDragging(null); setDragOver(null);
  };

  const labels = ['Principal', '2ª cor', '3ª cor', '4ª cor', '5ª cor'];
  const sizes = [80, 68, 58, 50, 44];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '6px', fontFamily: 'Montserrat,sans-serif' }}>Ordem de Prioridade das Cores</p>
        <p style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.5 }}>
          Arraste para reordenar. A cor no topo aparece mais nas suas artes — a última, menos.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ordered.map((item, i) => (
          <div
            key={item.idx}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={() => { setDragging(null); setDragOver(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 16px', borderRadius: '12px', cursor: 'grab',
              background: dragOver === i ? `${accentColor}12` : '#f9f9f9',
              border: `1.5px solid ${dragOver === i ? accentColor : '#eee'}`,
              transition: 'all 0.15s', opacity: dragging === i ? 0.4 : 1,
              userSelect: 'none',
            }}
          >
            <div style={{ width: `${sizes[i] || 40}px`, height: `${sizes[i] || 40}px`, borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', fontFamily: 'Montserrat,sans-serif' }}>{labels[i] || `${i+1}ª cor`}</div>
              <div style={{ fontSize: '0.65rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif', marginTop: '2px' }}>{item.color?.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: '1.2rem', color: '#ccc' }}>⠿</div>
          </div>
        ))}
      </div>

      {colorOrder && (
        <button onClick={() => setColorOrder(null)} style={{ background: 'none', border: '1px solid #eee', borderRadius: '20px', padding: '8px 16px', fontSize: '0.7rem', color: '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', alignSelf: 'center' }}>
          Restaurar ordem original
        </button>
      )}
    </div>
  );
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
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
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

    const isPortrait = orientation === 'portrait';
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${marca || 'Cartão Digital'}</title>
<link href="${fontUrl}" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background: #f0ece6; 
    font-family: 'Montserrat', sans-serif; 
    padding: ${isPortrait ? '0' : '20px'};
  }
  .card-container {
    ${isPortrait ? 'width: 100vw; height: 100vh; border-radius: 0;' : 'max-width: 480px; width: 100%; border-radius: 20px;'}
    overflow: hidden;
    ${patternStyle}
    padding: ${isPortrait ? '40px 20px' : '14px'};
    box-shadow: 0 8px 40px rgba(0,0,0,0.13);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .card-content {
    background: #fff;
    border-radius: 12px;
    padding: ${isPortrait ? '40px 24px' : '28px 20px 24px'};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${isPortrait ? '24px' : '14px'};
    width: 100%;
    ${isPortrait ? 'max-width: 380px;' : ''}
  }
  .icon-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: ${isPortrait ? 'center' : 'flex-start'};
    width: 100%;
    margin-top: 4px;
  }
  .icon-btn {
    width: 54px;
    height: 54px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    transition: transform 0.15s;
  }
  .icon-btn:hover { transform: scale(1.08); }
</style>
</head>
<body>
<div class="card-container">
  <div class="card-content">
    <div style="text-align:center;">
      <p style="font-family:'Montserrat',sans-serif;font-size:1.8rem;font-weight:800;color:${accentColor};text-transform:uppercase;letter-spacing:3px;">${marca || ''}</p>
      ${editData.tagline ? `<p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">${editData.tagline}</p>` : ''}
    </div>
    <div style="width:50%;height:1px;background:#eee;"></div>
    <p style="text-align:center;font-size:0.72rem;color:#aaa;font-family:'Montserrat',sans-serif;letter-spacing:0.5px;">Como prefere entrar em contato?</p>
    ${activeContacts.length > 0 ? `<div class="icon-grid">${activeContacts.map((f, i) => {
      const link = buildLink(f.key, contacts[f.key]);
      const color = colors[i % colors.length];
      return `<a href="${link || '#'}" target="_blank" rel="noopener" class="icon-btn" style="background:${color};">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="${ICON_PATHS[f.key]}"/></svg>
      </a>`;
    }).join('')}</div>` : ''}
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
      {/* Seletor de Orientação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '-0.5rem' }}>
        {['landscape', 'portrait'].map(o => (
          <button key={o} onClick={() => setOrientation(o)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid', borderColor: orientation === o ? accentColor : '#eee', background: orientation === o ? `${accentColor}10` : '#fff', color: orientation === o ? accentColor : '#888', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            {o === 'landscape' ? 'Horizontal (Cartão)' : 'Retrato (Full Screen)'}
          </button>
        ))}
      </div>

      {/* Preview interativo */}
      <div style={{
        borderRadius: orientation === 'portrait' ? '30px' : '20px', 
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
        backgroundImage: patternSrc ? `url(${patternSrc})` : undefined,
        background: patternSrc ? undefined : '#f5f5f5',
        backgroundSize: '22%', backgroundRepeat: 'repeat',
        padding: orientation === 'portrait' ? '40px 14px' : '14px',
        width: orientation === 'portrait' ? '300px' : '100%',
        height: orientation === 'portrait' ? '533px' : 'auto',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: orientation === 'portrait' ? '30px 20px' : '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: orientation === 'portrait' ? '20px' : '14px', position: 'relative' }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: orientation === 'portrait' ? 'center' : 'flex-start', width: '100%', marginTop: '4px' }}>
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

function EstampaStep({ brand, accentColor, marca, patterns, setPatterns, genCount, setGenCount, selectedIdx, setSelectedIdx, paletteColors, patternScale, setPatternScale }) {
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
    const pattern = patterns[selectedIdx];
    const binary = atob(pattern.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Estampa_${marca || 'marca'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
              backgroundSize: `${patternScale || 120}px`, backgroundRepeat: 'repeat',
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

      {patternSrc && setPatternScale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: '#f7f7f5', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.68rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap' }}>Tamanho</span>
          <input type="range" min="50" max="300" step="10"
            value={patternScale || 120}
            onChange={e => setPatternScale(parseInt(e.target.value))}
            style={{ flex: 1, cursor: 'pointer', accentColor: accentColor }}
          />
          <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px', textAlign: 'right' }}>{patternScale || 120}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {patternSrc && (
          <button onClick={download} style={{ flex: 1, padding: '13px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            ⬇ Baixar Estampa
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

const LOCAL_FONT_FACES = {
  'Amelie':        `@font-face{font-family:'Amelie';src:url('/fonts/Amelie.otf') format('opentype');}`,
  'Vellary':       `@font-face{font-family:'Vellary';src:url('/fonts/Vellary.otf') format('opentype');}`,
  'GoldenBlast':   `@font-face{font-family:'GoldenBlast';src:url('/fonts/GoldenBlast-YzaVL 2.ttf') format('truetype');}`,
  'LittleFriend':  `@font-face{font-family:'LittleFriend';src:url('/fonts/LittleFriend.otf') format('opentype');}`,
  'Celina':        `@font-face{font-family:'Celina';src:url('/fonts/Celina-Regular Done.ttf') format('truetype');}`,
  'Cafigine':      `@font-face{font-family:'Cafigine';src:url('/fonts/cafigine.otf') format('opentype');}`,
  'Aberforth':     `@font-face{font-family:'Aberforth';src:url('/fonts/Aberforth Demo.ttf') format('truetype');}`,
  'Dokyo':         `@font-face{font-family:'Dokyo';src:url('/fonts/DOKYO___.TTF') format('truetype');}`,
  'JulietaProGota':`@font-face{font-family:'JulietaProGota';src:url('/fonts/Latinotype - JulietaProGota.otf') format('opentype');}`,
  'TuttiFrutti':   `@font-face{font-family:'TuttiFrutti';src:url('/fonts/TuttiFrutti Regular.ttf') format('truetype');}`,
  'Solea':         `@font-face{font-family:'Solea';font-weight:300;src:url('/fonts/Solea-Light.ttf') format('truetype');}@font-face{font-family:'Solea';font-weight:700;src:url('/fonts/Solea-Bold.ttf') format('truetype');}`,
};

function buildGuiaHTML({ marca, tagline, accentColor, paletteColors, fontFamily, fontWeight, patternSrc, estiloNome, mensagem, isScript, manifesto, tomDeVoz }) {
  const isLocal = !!LOCAL_FONT_FACES[fontFamily];
  const fontEnc = encodeURIComponent(fontFamily);
  const fontUrl = isLocal
    ? `https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap`
    : `https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=${fontEnc}:ital,wght@0,400;0,700;1,400&display=swap`;
  const localFontStyle = isLocal ? `<style>${LOCAL_FONT_FACES[fontFamily]}</style>` : '';
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
${localFontStyle}
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
  <p style="font-size:0.58rem;letter-spacing:2px;text-transform:uppercase;color:#ccc;margin-bottom:64px;">Guia de Identidade Visual</p>
  <h1 style="font-family:'${fontFamily}',serif;font-weight:${fontWeight};font-size:4rem;color:${accentColor};letter-spacing:${isScript ? '0px' : '2px'};line-height:1;margin-bottom:14px;">${marcaDisplay}</h1>
  ${tagline ? `<p style="font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:64px;">${tagline}</p>` : '<div style="height:64px;"></div>'}
  <div style="width:50px;height:1px;background:#e0e0e0;margin:0 auto 24px;"></div>
  <p style="font-size:0.55rem;letter-spacing:2px;text-transform:uppercase;color:#ddd;">The Brand Box</p>
</div>

<!-- MANIFESTO -->
${manifesto ? `<div class="page" style="display:flex;flex-direction:column;justify-content:center;min-height:900px;">
  <div class="sec-label">Manifesto da Marca</div>
  <div style="position:relative;padding:40px 48px;border:1px solid ${accentColor}22;border-radius:16px;background:#faf9f7;">
    <div style="position:absolute;top:12px;left:12px;width:18px;height:18px;border-top:2px solid ${accentColor};border-left:2px solid ${accentColor};"></div>
    <div style="position:absolute;top:12px;right:12px;width:18px;height:18px;border-top:2px solid ${accentColor};border-right:2px solid ${accentColor};"></div>
    <div style="position:absolute;bottom:12px;left:12px;width:18px;height:18px;border-bottom:2px solid ${accentColor};border-left:2px solid ${accentColor};"></div>
    <div style="position:absolute;bottom:12px;right:12px;width:18px;height:18px;border-bottom:2px solid ${accentColor};border-right:2px solid ${accentColor};"></div>
    <p style="font-family:Georgia,serif;font-size:0.95rem;line-height:1.9;color:#444;white-space:pre-wrap;text-align:justify;">${manifesto}</p>
    <div style="text-align:center;margin-top:24px;"><span style="color:${accentColor};letter-spacing:8px;font-size:0.8rem;">✦ ✦ ✦</span></div>
  </div>
</div>` : ''}

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
  ${tomDeVoz?.descricao ? `<p style="font-size:0.85rem;color:#555;line-height:1.8;margin-bottom:28px;font-style:italic;">"${tomDeVoz.descricao}"</p>` : mensagem ? `<p style="font-size:0.82rem;color:#666;line-height:1.8;margin-bottom:28px;">${mensagem}</p>` : ''}
  <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:16px;">Palavras-chave da personalidade</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px;">
    ${(tomDeVoz?.palavras || toneWords).map((w, i) =>
      `<span style="padding:8px 18px;border-radius:20px;font-size:0.78rem;font-weight:600;font-family:Montserrat,sans-serif;${i % 2 === 0 ? `background:${accentColor};color:#fff;` : `border:1.5px solid ${accentColor};color:${accentColor};background:transparent;`}">${w}</span>`
    ).join('')}
  </div>
  ${tomDeVoz?.frases?.length ? `
  <div class="divider"></div>
  <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:14px;">Orientações de comunicação</p>
  <div style="display:flex;flex-direction:column;gap:10px;">
    ${tomDeVoz.frases.map(f => `<div style="display:flex;gap:10px;align-items:flex-start;"><span style="color:${accentColor};font-size:0.7rem;margin-top:2px;">✦</span><p style="font-size:0.8rem;color:#555;line-height:1.6;font-family:Montserrat,sans-serif;">${f}</p></div>`).join('')}
  </div>` : ''}
  <div class="divider"></div>
  <p style="font-size:0.75rem;color:#888;line-height:1.7;">Sua comunicação deve sempre refletir esses valores. Seja nas redes sociais, embalagens, atendimento ou conteúdo: a identidade visual e o tom de voz devem caminhar juntos.</p>
  <div style="margin-top:40px;padding-top:32px;border-top:1px solid #f0f0f0;text-align:center;">
    <p style="font-size:0.55rem;letter-spacing:4px;text-transform:uppercase;color:#ddd;">The Brand Box • Identidade Visual Profissional</p>
  </div>
</div>

</body>
</html>`;
}

const QUIZ_PERGUNTAS_GERAL = [
  {
    id: 'origem',
    pergunta: 'Como você descreveria a origem da sua marca?',
    opcoes: ['Nasceu de um sonho pessoal e paixão', 'De uma necessidade que eu mesma senti', 'Queria mudar algo no meu mercado', 'Foi evoluindo naturalmente da minha vida'],
  },
  {
    id: 'cliente',
    pergunta: 'Para quem você cria?',
    opcoes: ['Mulheres que buscam cuidado e acolhimento', 'Pessoas que valorizam qualidade e exclusividade', 'Quem quer se sentir especial no dia a dia', 'Mulheres em transformação e autoconhecimento'],
  },
  {
    id: 'promessa',
    pergunta: 'O que você entrega além do produto/serviço?',
    opcoes: ['Uma experiência de leveza e beleza', 'Confiança e segurança', 'Conexão e pertencimento', 'Transformação e empoderamento'],
  },
  {
    id: 'essencia',
    pergunta: 'Se sua marca fosse uma sensação, seria…',
    opcoes: ['Aquele abraço quentinho', 'A leveza de uma manhã ensolarada', 'A elegância de algo feito à mão com amor', 'A emoção de uma descoberta'],
  },
  {
    id: 'diferencial',
    pergunta: 'O que torna sua marca única?',
    opcoes: ['O carinho em cada detalhe', 'A autenticidade e história real por trás', 'A combinação de estética e propósito', 'O olhar humano e personalizado'],
  },
];

const QUIZ_PERGUNTAS_SAUDE = [
  {
    id: 'origem',
    pergunta: 'O que te levou a escolher essa área da saúde?',
    opcoes: ['Uma vocação que sempre existiu em mim', 'A vontade de fazer a diferença na vida das pessoas', 'Uma experiência pessoal que me transformou', 'O desejo de unir ciência e acolhimento'],
  },
  {
    id: 'publico',
    pergunta: 'Você atende principalmente…',
    opcoes: ['Crianças e suas famílias', 'Mulheres em diferentes fases da vida', 'Adultos em geral', 'Pessoas em busca de equilíbrio mental e emocional'],
  },
  {
    id: 'paciente',
    pergunta: 'Como você quer que seus pacientes se sintam ao te procurar?',
    opcoes: ['Acolhidos e seguros desde o primeiro contato', 'Confiantes de que estão em boas mãos', 'Ouvidos e respeitados em cada detalhe', 'Em paz — como se finalmente encontrassem a pessoa certa'],
  },
  {
    id: 'promessa',
    pergunta: 'O que você entrega além do atendimento técnico?',
    opcoes: ['Humanização e escuta verdadeira', 'Clareza e confiança para o paciente e família', 'Um espaço seguro para falar abertamente', 'Cuidado que vai além da consulta'],
  },
  {
    id: 'essencia',
    pergunta: 'Se seu consultório fosse uma sensação, seria…',
    opcoes: ['Aquele abraço de mãe que acalma tudo', 'A leveza de sair com respostas e tranquilidade', 'A segurança de estar em mãos competentes e gentis', 'A clareza de finalmente entender o que está acontecendo'],
  },
  {
    id: 'diferencial',
    pergunta: 'O que torna sua prática única?',
    opcoes: ['O olhar humano e a presença de verdade', 'A combinação de rigor técnico e cuidado gentil', 'A forma como explico e envolvo a família no processo', 'O vínculo que construo com cada paciente ao longo do tempo'],
  },
];

function ManifestoQuiz({ accentColor, marca, tagline, estiloNome, isSaude, onManifestoGerado }) {
  const QUIZ_PERGUNTAS = isSaude ? QUIZ_PERGUNTAS_SAUDE : QUIZ_PERGUNTAS_GERAL;
  const [respostas, setRespostas] = React.useState({});
  const [atual, setAtual] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);
  const completo = QUIZ_PERGUNTAS.every(q => respostas[q.id]);

  const handleGerar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const respostasArr = QUIZ_PERGUNTAS.map(q => ({ pergunta: q.pergunta, resposta: respostas[q.id] }));
      const res = await fetch('/api/generate-manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, respostas: respostasArr }),
      });
      const data = await res.json();
      if (data.success) {
        onManifestoGerado(data.manifesto);
      } else {
        setErro('Não conseguimos gerar agora. Tente novamente.');
      }
    } catch (e) {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {QUIZ_PERGUNTAS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < atual ? accentColor : i === atual ? accentColor + '55' : '#eee', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Pergunta atual */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '22px 18px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accentColor + 'aa', marginBottom: '14px' }}>{atual + 1} de {QUIZ_PERGUNTAS.length}</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#222', marginBottom: '18px', lineHeight: 1.4 }}>{QUIZ_PERGUNTAS[atual].pergunta}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUIZ_PERGUNTAS[atual].opcoes.map(opcao => {
              const selected = respostas[QUIZ_PERGUNTAS[atual].id] === opcao;
              return (
                <button
                  key={opcao}
                  onClick={() => {
                    const novo = { ...respostas, [QUIZ_PERGUNTAS[atual].id]: opcao };
                    setRespostas(novo);
                    if (atual < QUIZ_PERGUNTAS.length - 1) {
                      setTimeout(() => setAtual(a => a + 1), 280);
                    }
                  }}
                  style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: '12px',
                    border: `1.5px solid ${selected ? accentColor : '#eee'}`,
                    background: selected ? accentColor + '18' : '#fafafa', cursor: 'pointer',
                    fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif', fontWeight: selected ? 700 : 500,
                    color: selected ? accentColor : '#555', transition: 'all 0.15s',
                  }}
                >
                  {opcao}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {atual > 0 && (
          <button onClick={() => setAtual(a => a - 1)} style={{ padding: '12px 20px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#aaa', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            ← Voltar
          </button>
        )}
        {atual < QUIZ_PERGUNTAS.length - 1 ? (
          <button
            onClick={() => setAtual(a => a + 1)}
            disabled={!respostas[QUIZ_PERGUNTAS[atual].id]}
            style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: respostas[QUIZ_PERGUNTAS[atual].id] ? accentColor : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: respostas[QUIZ_PERGUNTAS[atual].id] ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}
          >
            Próxima →
          </button>
        ) : (
          <button
            onClick={handleGerar}
            disabled={!completo || loading}
            style={{ flex: 1, padding: '13px', borderRadius: '20px', border: 'none', background: completo ? accentColor : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: completo ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {loading ? '✨ Criando manifesto...' : '✨ Gerar Manifesto'}
          </button>
        )}
      </div>

      {erro && <p style={{ textAlign: 'center', color: '#e55', fontSize: '0.75rem' }}>{erro}</p>}
    </div>
  );
}

function ManifestoDisplay({ manifesto, accentColor, marca, tagline, fontFamily, fontWeight, isScript, onRegerar, podeRefazer, geracoes, limite }) {
  const [copiado, setCopiado] = React.useState(false);
  const [editando, setEditando] = React.useState(false);
  const [texto, setTexto] = React.useState(manifesto);
  const placaRef = React.useRef(null);

  React.useEffect(() => { setTexto(manifesto); }, [manifesto]);

  const marcaFormatted = isScript
    ? (marca || 'Sua Marca').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : (marca || 'SUA MARCA').toUpperCase();

  const handleCopiar = () => {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const handleBaixarPlaca = async () => {
    if (!placaRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(placaRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `manifesto-${(marca || 'marca').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Plaquinha para download */}
      <div ref={placaRef} style={{ background: '#faf9f7', borderRadius: '16px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `1.5px solid ${accentColor}33`, position: 'relative' }}>
        {/* Cantos decorativos */}
        <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, borderRadius: '3px 0 0 0' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderTop: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, borderRadius: '0 3px 0 0' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderBottom: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, borderRadius: '0 0 0 3px' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, borderRadius: '0 0 3px 0' }} />

        {/* Cabeçalho com nome da marca */}
        <div style={{ textAlign: 'center', marginBottom: '22px', paddingBottom: '16px', borderBottom: `1px solid ${accentColor}22` }}>
          <p style={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: accentColor + '88', marginBottom: '6px' }}>Manifesto</p>
          <h3 style={{ fontFamily: `'${fontFamily || 'Playfair Display'}', serif`, fontWeight: fontWeight || 700, fontSize: '1.3rem', color: accentColor, letterSpacing: isScript ? '0' : '1px', lineHeight: 1 }}>{marcaFormatted}</h3>
          {tagline && <p style={{ fontSize: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginTop: '5px' }}>{tagline}</p>}
        </div>

        {/* Texto */}
        {editando ? (
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            style={{ width: '100%', minHeight: '200px', fontSize: '0.82rem', lineHeight: 1.8, color: '#444', fontFamily: 'Georgia, serif', border: `1.5px solid ${accentColor}`, borderRadius: '10px', padding: '12px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: 'transparent' }}
          />
        ) : (
          <div style={{ fontSize: '0.82rem', lineHeight: 1.85, color: '#444', fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{texto}</div>
        )}

        {/* Rodapé com ornamento */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '14px', borderTop: `1px solid ${accentColor}22` }}>
          <span style={{ color: accentColor, fontSize: '0.7rem', letterSpacing: '6px' }}>✦ ✦ ✦</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={handleBaixarPlaca} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          ⬇ Baixar PNG
        </button>
        <button onClick={handleCopiar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: `1.5px solid ${accentColor}`, background: copiado ? accentColor : 'transparent', color: copiado ? '#fff' : accentColor, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {copiado ? '✓ Copiado!' : '📋 Copiar'}
        </button>
        <button onClick={() => setEditando(e => !e)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #ddd', background: editando ? '#333' : 'transparent', color: editando ? '#fff' : '#888', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {editando ? '✓ Feito' : '✏️ Editar'}
        </button>
        {podeRefazer ? (
          <button onClick={onRegerar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#bbb', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            🔄 Refazer ({limite - geracoes}x restante)
          </button>
        ) : (
          <div style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#ccc', fontFamily: 'Montserrat, sans-serif' }}>Limite de gerações atingido</div>
        )}
      </div>
    </div>
  );
}

function ManifestoStep({ accentColor, marca, tagline, brand, isSaude, editData }) {
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const fontFamily = editData?.fontFamily || 'Playfair Display';
  const fontWeight = editData?.fontWeight || 700;
  const isScript = editData?.fontStyle === 'script';
  const [manifesto, setManifesto] = React.useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(`brandbox_manifesto_${marca}`) || null;
    return null;
  });
  const [geracoes, setGeracoes] = React.useState(() => {
    if (typeof window !== 'undefined') return parseInt(localStorage.getItem(`brandbox_manifesto_count_${marca}`) || '0', 10);
    return 0;
  });
  const LIMITE = 2;
  const [showQuiz, setShowQuiz] = React.useState(false);

  const handleManifestoGerado = (texto) => {
    const novaContagem = geracoes + 1;
    setManifesto(texto);
    setGeracoes(novaContagem);
    setShowQuiz(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`brandbox_manifesto_${marca}`, texto);
      localStorage.setItem(`brandbox_manifesto_count_${marca}`, String(novaContagem));
    }
  };

  const handleRegerar = () => {
    if (geracoes >= LIMITE) return;
    setManifesto(null);
    setShowQuiz(true);
  };

  if (manifesto && !showQuiz) {
    return <ManifestoDisplay manifesto={manifesto} accentColor={accentColor} marca={marca} tagline={tagline} fontFamily={fontFamily} fontWeight={fontWeight} isScript={isScript} onRegerar={handleRegerar} podeRefazer={geracoes < LIMITE} geracoes={geracoes} limite={LIMITE} />;
  }
  if (showQuiz) {
    return <ManifestoQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} isSaude={isSaude} onManifestoGerado={handleManifestoGerado} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
      <div style={{ background: accentColor + '10', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>✦</p>
        <p style={{ fontFamily: `Georgia, serif`, fontSize: '1rem', color: '#555', lineHeight: 1.6, marginBottom: '6px' }}>O Manifesto é a alma da sua marca em palavras.</p>
        <p style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif' }}>Responda 5 perguntas e a IA cria um texto único para <strong style={{ color: accentColor }}>{marca}</strong>.</p>
      </div>
      <button
        onClick={() => setShowQuiz(true)}
        style={{ padding: '16px', borderRadius: '30px', border: 'none', background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        ✨ Criar Manifesto com IA
      </button>
    </div>
  );
}

function PlacaStep({ brand, accentColor, paletteColors, estampaPatterns, estampaSelectedIdx, editData, logoColor, iconPath, submarcaColor, submarcaTextColor }) {
  const placaRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setScale(Math.min(1, w / 595));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const currentIdx = estampaSelectedIdx || 0;
  const patternImage = estampaPatterns?.[currentIdx]
    ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`
    : null;
  const customLogoSrc = editData?.customLogoSrc || null;

  const handleBaixar = async () => {
    if (!placaRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(placaRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `placa-${(editData?.marca || 'marca').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Wrapper responsivo que escala o BrandBoard (sempre 595px) */}
      <div ref={wrapRef} style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', height: `${842 * scale}px` }}>
        <div ref={placaRef} style={{ transformOrigin: 'top left', transform: `scale(${scale})`, width: '595px' }}>
          <BrandBoard
            data={editData}
            palette={paletteColors}
            color={logoColor || accentColor}
            seloColor={submarcaColor || accentColor}
            seloTextColor={submarcaTextColor}
            patternImage={patternImage}
            iconPath={iconPath}
            customLogoSrc={customLogoSrc}
          />
        </div>
      </div>
      <button
        onClick={handleBaixar}
        style={{ width: '100%', padding: '14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        ⬇ Baixar Placa da Marca
      </button>
    </div>
  );
}

const TOMDEVOZ_PERGUNTAS = [
  {
    id: 'estilo',
    pergunta: 'Como você escreve para sua audiência?',
    opcoes: ['De forma próxima e informal, como uma amiga', 'Com leveza mas com cuidado — nem formal, nem íntimo demais', 'De forma profissional e clara', 'Com inspiração — textos que tocam e emocionam'],
  },
  {
    id: 'tratamento',
    pergunta: 'Como você trata seu cliente nas mensagens?',
    opcoes: ['Você (próximo e direto)', 'Você + nome próprio às vezes', 'Prezado/a (mais formal)', 'Amiga, amor, querida (muito íntimo)'],
  },
  {
    id: 'nunca',
    pergunta: 'Que tipo de comunicação você NUNCA faria?',
    opcoes: ['Linguagem fria e corporativa', 'Texto longo e difícil de ler', 'Algo exagerado ou apelativo', 'Conteúdo técnico sem humanização'],
  },
  {
    id: 'ritmo',
    pergunta: 'Qual o ritmo das suas mensagens?',
    opcoes: ['Curto, direto e objetivo', 'Narrativo — gosto de contar histórias', 'Poético e cheio de metáforas', 'Informativo e educativo'],
  },
];

function TomDeVozQuiz({ accentColor, marca, tagline, estiloNome, onTomDeVozGerado }) {
  const [respostas, setRespostas] = React.useState({});
  const [atual, setAtual] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);
  const completo = TOMDEVOZ_PERGUNTAS.every(q => respostas[q.id]);

  const handleGerar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const respostasArr = TOMDEVOZ_PERGUNTAS.map(q => ({ pergunta: q.pergunta, resposta: respostas[q.id] }));
      const res = await fetch('/api/generate-tomdevoz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, respostas: respostasArr }),
      });
      const data = await res.json();
      if (data.success) {
        onTomDeVozGerado({ palavras: data.palavras, frases: data.frases, descricao: data.descricao });
      } else {
        setErro('Não conseguimos gerar agora. Tente novamente.');
      }
    } catch (e) {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {TOMDEVOZ_PERGUNTAS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < atual ? accentColor : i === atual ? accentColor + '55' : '#eee', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '22px 18px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: accentColor + 'aa', marginBottom: '14px' }}>{atual + 1} de {TOMDEVOZ_PERGUNTAS.length}</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#222', marginBottom: '18px', lineHeight: 1.4 }}>{TOMDEVOZ_PERGUNTAS[atual].pergunta}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TOMDEVOZ_PERGUNTAS[atual].opcoes.map(opcao => {
              const selected = respostas[TOMDEVOZ_PERGUNTAS[atual].id] === opcao;
              return (
                <button
                  key={opcao}
                  onClick={() => {
                    const novo = { ...respostas, [TOMDEVOZ_PERGUNTAS[atual].id]: opcao };
                    setRespostas(novo);
                    if (atual < TOMDEVOZ_PERGUNTAS.length - 1) {
                      setTimeout(() => setAtual(a => a + 1), 280);
                    }
                  }}
                  style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: '12px',
                    border: `1.5px solid ${selected ? accentColor : '#eee'}`,
                    background: selected ? accentColor + '18' : '#fafafa', cursor: 'pointer',
                    fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif', fontWeight: selected ? 700 : 500,
                    color: selected ? accentColor : '#555', transition: 'all 0.15s',
                  }}
                >
                  {opcao}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {atual > 0 && (
          <button onClick={() => setAtual(a => a - 1)} style={{ padding: '12px 20px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#aaa', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            ← Voltar
          </button>
        )}
        {atual < TOMDEVOZ_PERGUNTAS.length - 1 ? (
          <button
            onClick={() => setAtual(a => a + 1)}
            disabled={!respostas[TOMDEVOZ_PERGUNTAS[atual].id]}
            style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: respostas[TOMDEVOZ_PERGUNTAS[atual].id] ? accentColor : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: respostas[TOMDEVOZ_PERGUNTAS[atual].id] ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}
          >
            Próxima →
          </button>
        ) : (
          <button
            onClick={handleGerar}
            disabled={!completo || loading}
            style={{ flex: 1, padding: '13px', borderRadius: '20px', border: 'none', background: completo ? accentColor : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: completo ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {loading ? '✨ Criando tom de voz...' : '✨ Gerar Tom de Voz'}
          </button>
        )}
      </div>
      {erro && <p style={{ textAlign: 'center', color: '#e55', fontSize: '0.75rem' }}>{erro}</p>}
    </div>
  );
}

function TomDeVozDisplay({ tomDeVoz, accentColor, marca, onRegerar, podeRefazer, geracoes, limite }) {
  const [copiado, setCopiado] = React.useState(false);
  const [editando, setEditando] = React.useState(false);
  const [descricao, setDescricao] = React.useState(tomDeVoz.descricao);

  React.useEffect(() => { setDescricao(tomDeVoz.descricao); }, [tomDeVoz.descricao]);

  const handleCopiar = () => {
    const texto = [tomDeVoz.descricao, '', 'Palavras-chave:', tomDeVoz.palavras.join(', '), '', 'Orientações:', ...(tomDeVoz.frases || [])].join('\n');
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: '#faf9f7', borderRadius: '16px', padding: '22px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: `1.5px solid ${accentColor}33` }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: accentColor + '88', marginBottom: '10px' }}>Tom de Voz — {marca}</p>
        {editando ? (
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            style={{ width: '100%', minHeight: '80px', fontSize: '0.85rem', lineHeight: 1.7, color: '#444', fontFamily: 'Georgia, serif', border: `1.5px solid ${accentColor}`, borderRadius: '10px', padding: '10px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: 'transparent', fontStyle: 'italic' }}
          />
        ) : (
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#555', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{descricao}</p>
        )}
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>Palavras-chave</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(tomDeVoz.palavras || []).map((w, i) => (
            <span key={i} style={{ padding: '8px 18px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', ...(i % 2 === 0 ? { background: accentColor, color: '#fff' } : { border: `1.5px solid ${accentColor}`, color: accentColor, background: 'transparent' }) }}>
              {w}
            </span>
          ))}
        </div>
      </div>
      {tomDeVoz.frases?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>Orientações de comunicação</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tomDeVoz.frases.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: accentColor, fontSize: '0.7rem', marginTop: '2px', flexShrink: 0 }}>✦</span>
                <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.6, fontFamily: 'Montserrat, sans-serif' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={handleCopiar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: `1.5px solid ${accentColor}`, background: copiado ? accentColor : 'transparent', color: copiado ? '#fff' : accentColor, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {copiado ? '✓ Copiado!' : '📋 Copiar'}
        </button>
        <button onClick={() => setEditando(e => !e)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #ddd', background: editando ? '#333' : 'transparent', color: editando ? '#fff' : '#888', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {editando ? '✓ Feito' : '✏️ Editar'}
        </button>
        {podeRefazer ? (
          <button onClick={onRegerar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#bbb', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            🔄 Refazer ({limite - geracoes}x restante)
          </button>
        ) : (
          <div style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#ccc', fontFamily: 'Montserrat, sans-serif' }}>Limite de gerações atingido</div>
        )}
      </div>
    </div>
  );
}

function TomDeVozStep({ accentColor, marca, tagline, brand, editData }) {
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const [tomDeVoz, setTomDeVoz] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(`brandbox_tomdevoz_${marca}`);
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  });
  const [geracoes, setGeracoes] = React.useState(() => {
    if (typeof window !== 'undefined') return parseInt(localStorage.getItem(`brandbox_tomdevoz_count_${marca}`) || '0', 10);
    return 0;
  });
  const LIMITE = 2;
  const [showQuiz, setShowQuiz] = React.useState(false);

  const handleTomDeVozGerado = (data) => {
    const novaContagem = geracoes + 1;
    setTomDeVoz(data);
    setGeracoes(novaContagem);
    setShowQuiz(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`brandbox_tomdevoz_${marca}`, JSON.stringify(data));
      localStorage.setItem(`brandbox_tomdevoz_count_${marca}`, String(novaContagem));
    }
  };

  const handleRegerar = () => {
    if (geracoes >= LIMITE) return;
    setTomDeVoz(null);
    setShowQuiz(true);
  };

  if (tomDeVoz && !showQuiz) {
    return <TomDeVozDisplay tomDeVoz={tomDeVoz} accentColor={accentColor} marca={marca} onRegerar={handleRegerar} podeRefazer={geracoes < LIMITE} geracoes={geracoes} limite={LIMITE} />;
  }
  if (showQuiz) {
    return <TomDeVozQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} onTomDeVozGerado={handleTomDeVozGerado} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
      <div style={{ background: accentColor + '10', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🗣️</p>
        <p style={{ fontFamily: `Georgia, serif`, fontSize: '1rem', color: '#555', lineHeight: 1.6, marginBottom: '6px' }}>O Tom de Voz define como sua marca fala com o mundo.</p>
        <p style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif' }}>Responda 4 perguntas e a IA cria o guia de voz para <strong style={{ color: accentColor }}>{marca}</strong>.</p>
      </div>
      <button
        onClick={() => setShowQuiz(true)}
        style={{ padding: '16px', borderRadius: '30px', border: 'none', background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        ✨ Criar Tom de Voz com IA
      </button>
    </div>
  );
}

// Uma fonte curada por categoria para oferecer variedade sem overwhelm
const FONTE_CURADA = [
  { label: 'Cursiva',     fontFamily: 'Amelie',            weight: 400, style: 'script',  sizeBoost: 1.4, googleFont: false },
  { label: 'Delicada',    fontFamily: 'Sacramento',        weight: 400, style: 'script',  sizeBoost: 1.1, googleFont: true  },
  { label: 'Elegante',    fontFamily: 'Alex Brush',        weight: 400, style: 'script',  sizeBoost: 1.6, googleFont: true  },
  { label: 'Clássica',    fontFamily: 'Cormorant Garamond',weight: 300, style: 'serif',   sizeBoost: 1.0, googleFont: true  },
  { label: 'Moderna',     fontFamily: 'Raleway',           weight: 700, style: 'sans',    sizeBoost: 1.0, googleFont: true  },
  { label: 'Lúdica',      fontFamily: 'LittleFriend',      weight: 400, style: 'display', sizeBoost: 1.0, googleFont: false },
];

function FonteStep({ brand, accentColor, marca, tagline, editData, logoLayout, onFontChange }) {
  const currentFont = editData?.fontFamily || 'Playfair Display';

  // Garante que a fonte atual sempre apareça como opção
  const opcoes = React.useMemo(() => {
    const lista = [...FONTE_CURADA];
    if (!lista.find(f => f.fontFamily === currentFont)) {
      // Descobrir dados da fonte atual no FONT_MAP
      const found = Object.values(FONT_MAP).find(f => f.fontFamily === currentFont);
      if (found) lista.unshift({ label: 'Sugerida', ...found });
    }
    return lista.slice(0, 6);
  }, [currentFont]);

  const [preview, setPreview] = React.useState(
    () => opcoes.find(f => f.fontFamily === currentFont) || opcoes[0]
  );

  // Carregar fontes locais e Google Fonts
  React.useEffect(() => {
    opcoes.forEach(f => {
      const id = `ff-${f.fontFamily.replace(/\s/g,'-')}`;
      if (document.getElementById(id)) return;
      if (f.googleFont) {
        const link = document.createElement('link');
        link.id = id; link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.fontFamily)}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      } else if (LOCAL_FONT_FACES[f.fontFamily]) {
        const s = document.createElement('style');
        s.id = id; s.textContent = LOCAL_FONT_FACES[f.fontFamily];
        document.head.appendChild(s);
      }
    });
  }, [opcoes]);

  const formatName = (f) => {
    const text = marca || 'Sua Marca';
    return f.style === 'script'
      ? text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : text.toUpperCase();
  };

  const isActive = (f) => f.fontFamily === currentFont;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Preview principal — igual ao quadro da aba Logo */}
      <div style={{ width: '100%', aspectRatio: '3/1', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '85%', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoPreviewHTML
            editData={{ ...editData, fontFamily: preview.fontFamily, fontWeight: preview.weight || 700, fontStyle: preview.style, fontSizeBoost: preview.sizeBoost || 1, tagline: null }}
            color={accentColor}
            layout="horizontal"
            scaleFactor={1.2}
          />
        </div>
      </div>

      {/* Fonte ativa em destaque */}
      {(() => {
        const activeFont = opcoes.find(f => isActive(f));
        return activeFont ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `${accentColor}10`, borderRadius: '12px', border: `1.5px solid ${accentColor}30` }}>
            <div>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '2px' }}>Fonte ativa</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'Montserrat,sans-serif' }}>{activeFont.label}</div>
            </div>
            <div style={{ background: accentColor, color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>✓ Aplicada</div>
          </div>
        ) : null;
      })()}

      {/* Alternativas */}
      <div>
        <p style={{ fontSize: '0.65rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif', marginBottom: '8px' }}>Quero tentar outra →</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {opcoes.filter(f => !isActive(f)).map(f => {
            const previewing = preview.fontFamily === f.fontFamily;
            return (
              <button
                key={f.fontFamily}
                onMouseEnter={() => setPreview(f)}
                onMouseLeave={() => { const active = opcoes.find(x => isActive(x)); if (active) setPreview(active); }}
                onClick={() => { setPreview(f); onFontChange(f); }}
                style={{
                  padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                  fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', fontWeight: 600,
                  transition: 'all 0.15s',
                  borderWidth: '1.5px', borderStyle: 'solid',
                  borderColor: previewing ? accentColor + '88' : '#e0e0e0',
                  background: previewing ? accentColor + '10' : '#fff',
                  color: previewing ? accentColor : '#666',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
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
    const manifesto = typeof window !== 'undefined' ? localStorage.getItem(`brandbox_manifesto_${marca}`) || null : null;
    const tomDeVozRaw = typeof window !== 'undefined' ? localStorage.getItem(`brandbox_tomdevoz_${marca}`) : null;
    const tomDeVoz = tomDeVozRaw ? JSON.parse(tomDeVozRaw) : null;
    const html = buildGuiaHTML({ marca, tagline, accentColor, paletteColors, fontFamily, fontWeight, patternSrc, estiloNome, mensagem, isScript, manifesto, tomDeVoz });
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
              <div style={{ width: '100%', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <LogoPreviewHTML item="Cartão de Retorno" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
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

function CartaoDeVisitaPreview({ accentColor, patternSrc, cartaoContacts, crmLine, editData, logoColor, comBorda, setComBorda, clinicaNome, setClinicaNome, logoLayout, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, retrato: retratoExterno, setRetrato: setRetratoExterno }) {
  const [retratoLocal, setRetratoLocal] = React.useState(false);
  const retrato = retratoExterno !== undefined ? retratoExterno : retratoLocal;
  const setRetrato = setRetratoExterno || setRetratoLocal;
  const brandFont = `'${editData?.fontFamily || 'Playfair Display'}', serif`;
  const { endereco, whatsapp, telefone, telefone2, instagram, email, site } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const solidColor = borderColor || accentColor;
  const CW = retrato ? 178 : 320;
  const CH = retrato ? 320 : 178;
  const isHorizontal = logoLayout === 'horizontal';
  const logoScale = retrato
    ? (isHorizontal ? 0.55 : 0.75)
    : (isHorizontal ? 0.65 : 0.85);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Toggle retrato/paisagem */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {[['Paisagem', false], ['Retrato', true]].map(([label, val]) => (
          <button key={label} onClick={() => setRetrato(val)} style={{ padding: '5px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: retrato === val ? solidColor : 'transparent', color: retrato === val ? '#fff' : '#888', transition: 'all 0.2s' }}>{label}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Frente</p>
      <div style={{ width: `${CW}px`, height: `${CH}px`, position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
        {comBorda && patternSrc && <>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.9, zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px', background: 'transparent', zIndex: 1 }} />
        </>}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: isHorizontal ? '65%' : '50%', height: retrato ? '40%' : '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <LogoPreviewHTML item="Cartão de Visita" editData={editData} color={logoColor} layout={logoLayout} crm={crmLine} hideTagline={hideTagline} scaleFactor={0.24} withBackground={!!patternSrc} maxWidth="100%" maxHeight="100%" />
          </div>
        </div>
      </div>



      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Verso</p>
      <div style={{ width: `${CW}px`, height: `${CH}px`, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
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
export function BordaToggle({ comBorda, setComBorda, accentColor, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
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

// Preview do Certificado de Coragem (A4 Horizontal, casinha branca e borda estampada)
function CertificadoCoragemPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const scriptFont = "'Great Vibes', cursive";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" />
      
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      
      <div style={{ width: '360px', height: '254px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {/* Background com estampa */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: effectiveSrc ? `url(${effectiveSrc})` : 'none',
          backgroundSize: `${patternScale / 4}px`,
          backgroundColor: !effectiveSrc ? solidColor : 'transparent'
        }} />

        {/* Casinha Branca no meio */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '12px', bottom: '12px',
          background: '#fff',
          clipPath: 'polygon(0% 18%, 50% 0%, 100% 18%, 100% 100%, 0% 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '30px 15px 15px'
        }}>
          {/* Logo Rectangle / Space */}
          <div style={{ width: '180px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <LogoPreviewHTML item="Certificado de Coragem" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} hideTagline={hideTagline} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
          </div>

          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.5rem', fontWeight: 600, color: '#7a7a7a', letterSpacing: '1px', marginBottom: '2px' }}>
            Certificado Pediátrico de
          </div>
          <h2 style={{
            fontFamily: `'${editData?.fontFamily || 'Playfair Display'}', serif`,
            fontSize: '1.5rem', fontWeight: 700, color: solidColor, margin: '0 0 18px', letterSpacing: '1px'
          }}>
            Coragem
          </h2>

          <div style={{ fontFamily: scriptFont, fontSize: '0.6rem', color: '#5a5a5a', textAlign: 'center', lineHeight: 1.5, marginTop: '2px', width: '90%' }}>
            <div style={{ margin: 0 }}>Certifico para os devidos e lúdicos fins, que __________________</div>
            <div style={{ margin: 0 }}>idade _____ comportou-se corretamente na consulta de hoje,</div>
            <div style={{ margin: 0 }}>sendo educado e demonstrando muita coragem e valentia.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview proporcional A5 — usado por receituário, timbrado, etc.
function A5ItemPreview({ item, accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, folderRoof, setFolderRoof, paperSize, setPaperSize }) {
  const BORDER = 14;
  const { whatsapp, telefone, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const hasCustomLogo = !!editData?.customLogoSrc;
  const roofClip = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {setFolderRoof && (
          <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
            {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
          </button>
        )}
        {setPaperSize && (
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '20px', padding: '3px' }}>
            {['a5', 'a4'].map(s => (
              <button key={s} onClick={() => setPaperSize(s)} style={{ padding: '3px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: paperSize === s ? accentColor : 'transparent', color: paperSize === s ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      {/* Fundo — estampa ou cor sólida */}
      {effectiveSrc
        ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
        : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
      {/* Área branca com recorte casinha (funciona em ambos os modos) */}
      <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', clipPath: roofClip }} />
      {/* Logo no topo */}
      <div style={{ position: 'absolute', top: BORDER + 6, left: '50%', transform: 'translateX(-50%)', width: '90px', height: '35px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <LogoPreviewHTML item={item} editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.3} crm={crmLine} hideTagline={hideTagline} withBackground={!!effectiveSrc} maxWidth="100%" maxHeight="100%" />
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

function ProntuarioPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  
  const formRow = (label1, label2) => (
    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
      <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontSize: '4.8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap', opacity: 0.8 }}>{label1}</span>
        <div style={{ flex: 1, height: '9px', background: '#f2e8e0', borderRadius: '1px' }} />
      </div>
      {label2 && (
        <div style={{ width: '80px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '4.8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap', opacity: 0.8 }}>{label2}</span>
          <div style={{ flex: 1, height: '9px', background: '#f2e8e0', borderRadius: '1px' }} />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ display: 'flex', gap: '15px' }}>
        {/* FRENTE */}
        <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          {effectiveSrc
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
          <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', padding: '12px 14px' }}>
            <div style={{ width: '100%', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <LogoPreviewHTML item="Prontuário Médico" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} crm={crmLine} hideTagline={hideTagline} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
            </div>
            <div style={{ border: '0.4px solid #eee', borderRadius: '2px', padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '3.5px', marginTop: '2px' }}>
              {formRow('PACIENTE:', 'DATA DE NASCIMENTO:')}
              {formRow('NOME DA MÃE:', 'CPF:')}
              {formRow('TELEFONE:', 'EMAIL:')}
              {formRow('ENDEREÇO:', 'CIDADE:')}
              {formRow('CONVÊNIO:', 'Nº CARTEIRINHA:')}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8.5px' }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{ borderBottom: '0.4px solid #eee', width: '100%', height: '1px' }} />
              ))}
            </div>
          </div>
        </div>

        {/* VERSO */}
        <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          {effectiveSrc
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
          <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', padding: '12px 14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8.5px', marginTop: '5px' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ borderBottom: '0.4px solid #eee', width: '100%', height: '1px' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '8px', right: '12px', opacity: 0.4 }}>
               <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.2} hideTagline={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function DiarioXixiPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline }) {
  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  const SunIcon = (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );

  const CloudIcon = (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.4-1.9-4.3-4.3-4.5-.6-3.1-3.3-5.5-6.7-5.5-3.1 0-5.8 2.1-6.5 5.1C2.1 10.3 0 12.5 0 15.5c0 3 2.4 5.5 5.5 5.5" />
      <path d="M8 20v2" />
      <path d="M12 20v2" />
      <path d="M16 20v2" />
    </svg>
  );

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const weeks = [1, 2, 3, 4];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '453px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER + 2, background: '#fff', padding: '10px 15px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: '#f5f5f5', padding: '4px 12px', borderRadius: '4px', border: '0.4px solid #ddd', alignSelf: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#333', letterSpacing: '1px' }}>DIÁRIO DO XIXI (HÁBITO MICCIONAL)</span>
              </div>
              <div style={{ fontSize: '7px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Controle de Escapes e Enurese (Xixi na Cama)</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif", color: accentColor, fontWeight: 300, fontStyle: 'italic' }}>Nome:</span>
                <div style={{ flex: 1, borderBottom: '1px dashed #ccc', width: '230px', marginBottom: '2px' }} />
              </div>
            </div>
            <div style={{ width: '130px', height: '60px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginTop: '2px' }}>
              <LogoPreviewHTML item="Diário do Xixi" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.3} crm={crmLine} hideTagline={hideTagline} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '7.5px', textTransform: 'uppercase', color: '#666', fontWeight: 800, letterSpacing: '0.8px' }}>Legenda:</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>0:</strong> Acordou Seco(a)</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>1:</strong> Gotas/Umidade</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>2:</strong> Molhou a Roupa/Fralda</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>3:</strong> Abundante (Molhou Cama)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(4, 1fr)', gap: '1px', background: '#eee', border: '1px solid #eee', flex: 1 }}>
            <div style={{ background: '#fff', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ fontSize: '7px', fontWeight: 800, color: '#bbb', textTransform: 'uppercase' }}>Marque 0 a 3</span>
            </div>
            {weeks.map(w => (
              <div key={w} style={{ background: '#fff', textAlign: 'center', padding: '5px 0' }}>
                <div style={{ fontSize: '8.5px', fontWeight: 700, color: accentColor, textTransform: 'uppercase' }}>Semana {w}</div>
                <div style={{ width: '24px', height: '1px', background: accentColor, margin: '2px auto' }} />
              </div>
            ))}
            {days.map(day => (
              <React.Fragment key={day}>
                <div style={{ background: '#fff', padding: '5px 10px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: accentColor, fontStyle: 'italic' }}>{day}</span>
                </div>
                {weeks.map(w => (
                  <div key={`${day}-${w}`} style={{ background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[0, 1, 2, 3].map(n => (
                        <div key={n} style={{ width: '14px', height: '14px', border: '0.6px solid #ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#999' }}>{n}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function FichaCadastroPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, fichaAdulto, setFichaAdulto }) {
  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  const rowsCrianca = [
    [{ w: 1, label: 'NOME COMPLETO DA CRIANÇA :' }],
    [{ w: 0.45, label: 'DATA DE NASCIMENTO:' }, { w: 0.55, label: 'IDADE:' }],
    [{ w: 1, label: 'NOME DA MÃE :' }],
    [{ w: 0.65, label: 'PROFISSÃO:' }, { w: 0.35, label: 'CPF:' }],
    [{ w: 1, label: 'NOME DO PAI :' }],
    [{ w: 0.65, label: 'PROFISSÃO:' }, { w: 0.35, label: 'CPF:' }],
  ];

  const rowsAdulto = [
    [{ w: 1, label: 'NOME COMPLETO :' }],
    [{ w: 0.45, label: 'DATA DE NASCIMENTO:' }, { w: 0.35, label: 'CPF:' }, { w: 0.20, label: 'RG:' }],
    [{ w: 0.55, label: 'ESTADO CIVIL:' }, { w: 0.45, label: 'PROFISSÃO:' }],
    [{ w: 1, label: 'NOME DO RESPONSÁVEL (se menor):' }],
    [{ w: 0.6, label: 'GRAU DE PARENTESCO:' }, { w: 0.4, label: 'CPF:' }],
  ];

  const rows = fichaAdulto ? rowsAdulto : rowsCrianca;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '4px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {['Criança', 'Adulto'].map((label, i) => {
          const active = fichaAdulto === (i === 1);
          return <button key={label} onClick={() => setFichaAdulto(i === 1)} style={{ padding: '6px 18px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: active ? solidColor : 'transparent', color: active ? '#fff' : '#888', transition: 'all 0.2s' }}>{label}</button>;
        })}
      </div>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '320px', height: '453px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff' }} />

        <div style={{ position: 'absolute', top: BORDER + 15, left: BORDER + 15, right: BORDER + 15, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 800, color: '#111', letterSpacing: '0.5px' }}>
              CADASTRO DE PACIENTES
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif" }}>DATA :</span>
              <div style={{ width: '80px', height: '10px', background: '#e6e3df', borderRadius: '1px' }} />
            </div>
          </div>
          <div style={{ width: '150px', height: '60px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginTop: '0px' }}>
            <LogoPreviewHTML item="Ficha de Cadastro" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.3} crm={crmLine} hideTagline={hideTagline} withBackground={!!effectiveSrc} maxWidth="100%" maxHeight="100%" alignLeft={false} />
          </div>
        </div>

        <div style={{ position: 'absolute', top: BORDER + 82, bottom: BORDER + 12, left: BORDER + 15, right: BORDER + 15, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', width: '100%' }}>
              {row.map((col, j) => (
                <div key={j} style={{ flex: col.w, display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{col.label}</span>
                  <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
                </div>
              ))}
            </div>
          ))}

          {!fichaAdulto && <div style={{ border: '0.5px solid #d0dbe9', borderRadius: '4px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc' }}>
             <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
               <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>NOME DO (A) RESPONSÁVEL ACOMPANHANTE:</span>
               <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
             </div>
             <div style={{ display: 'flex', gap: '6px' }}>
               <div style={{ flex: 0.6, display: 'flex', gap: '4px', alignItems: 'center' }}>
                 <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>GRAU DE PARENTESCO:</span>
                 <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
               </div>
               <div style={{ flex: 0.4, display: 'flex', gap: '4px', alignItems: 'center' }}>
                 <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>CPF:</span>
                 <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
               </div>
             </div>
          </div>}

          {[
            [{ w: 1, label: 'ENDEREÇO:' }],
            [{ w: 0.55, label: 'COMPLEMENTO:' }, { w: 0.45, label: 'BAIRRO:' }],
            [{ w: 0.55, label: 'CIDADE:' }, { w: 0.45, label: 'ESTADO:' }],
          ].map((row, i) => (
            <div key={`end-${i}`} style={{ display: 'flex', gap: '6px', width: '100%' }}>
              {row.map((col, j) => (
                <div key={j} style={{ flex: col.w, display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{col.label}</span>
                  <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
                </div>
              ))}
            </div>
          ))}
          
          <div style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, marginTop: '2px' }}>TELEFONES :</div>
          <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '-2px' }}>
            {fichaAdulto ? <>
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>CELULAR:</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>RESIDENCIAL:</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
            </> : <>
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>MÃE :</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>PAI :</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>RESPONSÁVEL:</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
            </>}
          </div>

          {[
            [{ w: 0.55, label: 'OUTROS TELEFONES :' }, { w: 0.45, label: 'RESIDENCIAL ( ) COMERCIAL ( )', input: false }],
            [{ w: 0.55, label: 'OUTROS TELEFONES :' }, { w: 0.45, label: 'RESIDENCIAL ( ) COMERCIAL ( )', input: false }],
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', width: '100%' }}>
              {row.map((col, j) => (
                <div key={j} style={{ flex: col.w, display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{col.label}</span>
                  {col.input !== false && <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />}
                </div>
              ))}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>E-MAILS:</span>
            <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
          </div>

          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>COMO CONHECEU A CLÍNICA:</span>
            <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
          </div>

        </div>
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
            <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
               <LogoPreviewHTML item="Recibo" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} crm={crmLine} hideTagline={hideTagline} withBackground={!!effectiveSrc} alignLeft={true} maxWidth="100%" maxHeight="100%" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: accentColor, opacity: 0.12, letterSpacing: '2px' }}>RECIBO</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
            {['Recebi de', 'A quantia de', 'Referente a'].map(label => (
              <div key={label} style={{ borderBottom: '0.5px solid #eee', paddingBottom: '3px', display: 'flex', gap: '5px', alignItems: 'flex-end', minHeight: '14px' }}>
                <span style={{ fontSize: '4.5px', fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1 }}></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px', width: '100%', border: '0.5px solid #eee', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', background: '#f5f5f5', borderBottom: '0.5px solid #eee' }}>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', borderRight: '0.5px solid #eee' }}>DATA</div>
              <div style={{ flex: 4, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', borderRight: '0.5px solid #eee' }}>DESCRIÇÃO DOS SERVIÇOS</div>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', textAlign: 'right' }}>TOTAL</div>
            </div>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ display: 'flex', borderBottom: '0.5px solid #f9f9f9', height: '11px' }}>
                <div style={{ flex: 1.5, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 4, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 1.5 }}></div>
              </div>
            ))}
            <div style={{ display: 'flex', height: '11px', background: '#f9f9f9' }}>
              <div style={{ flex: 5.5, borderRight: '0.5px solid #f9f9f9', padding: '3px', textAlign: 'right', fontSize: '4.5px', fontWeight: 800, color: '#1a1a1a' }}>TOTAL</div>
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
          
          <div style={{ textAlign: 'center', fontSize: '5.5px', fontWeight: 800, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            RECEITUÁRIO DE CONTROLE ESPECIAL
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'stretch' }}>
            {/* Box Emitente */}
            <div style={{ flex: 1.4, background: `${accentColor}12`, border: `0.1mm solid ${accentColor}25`, padding: '5px 6px', borderRadius: '1.5px' }}>
              <div style={{ fontSize: '4.8px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', marginBottom: '4px', borderBottom: `0.1mm solid ${accentColor}30`, paddingBottom: '2px' }}>Identificação do Emitente</div>
              <div style={{ fontSize: '3.8px', color: '#555', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: accentColor, marginBottom: '1px' }}>{clinicaNome || marca}</div>
                {crmLine && <div style={{ fontWeight: 600 }}>{crmLine}</div>}
                {endereco && <div style={{ opacity: 0.8 }}>{endereco}</div>}
                {mainPhone && <div style={{ fontWeight: 600 }}>{mainPhone}</div>}
                {cartaoContacts?.email && <div style={{ opacity: 0.75 }}>{cartaoContacts.email}</div>}
                {cartaoContacts?.site && <div style={{ opacity: 0.75 }}>{cartaoContacts.site}</div>}
              </div>
            </div>

            {/* Logo e Vias */}
            <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <LogoPreviewHTML item="Receituário de Controle Especial" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} crm={crmLine} hideTagline={hideTagline} withBackground={!!effectiveSrc} maxWidth="100%" maxHeight="100%" />
              </div>
               <div style={{ fontSize: '3.5px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'center', marginTop: '2px' }}>
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
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ borderBottom: '0.1mm solid #f5f5f5', height: '8px' }}></div>
              ))}
            </div>
          </div>

          {/* Data e Assinatura */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', alignItems: 'flex-start', padding: '10px 15px' }}>
             <div style={{ width: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '0.5px solid #999' }} />
                <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', marginTop: '2px' }}>Data</div>
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '0.5px solid #999' }} />
                <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', marginTop: '2px' }}>Assinatura do Médico</div>
             </div>
          </div>

          {/* Rodapé Obrigatório */}
          <div style={{ display: 'flex', gap: '6px', height: '36px', marginTop: '2px', flexShrink: 0 }}>
             <div style={{ flex: 1, background: `${accentColor}10`, border: `0.5px solid ${accentColor}25`, padding: '4px 8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '5.5px', fontWeight: 800, color: accentColor, marginBottom: '2px', textAlign: 'center', textTransform: 'uppercase' }}>IDENTIFICAÇÃO DO COMPRADOR</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2px' }}>
                  {['Nome', 'Ident.', 'Endereço', 'Cidade', 'Estado/Tel'].map(f => <div key={f} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)', height: '5px' }} />)}
                </div>
             </div>
             <div style={{ flex: 1, border: '0.5px solid #ddd', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '4px', left: 0, right: 0, textAlign: 'center', fontSize: '5.5px', color: '#bbb', textTransform: 'uppercase', fontWeight: 700 }}>ASSINATURA DO FARMACÊUTICO</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistMaternidadePreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const BORDER = 10;
  const solidColor = borderColor || accentColor;
  const { whatsapp, telefone, telefone2, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');

  const SECOES = [
    { titulo: 'check list bebê', itens: ['4 mudas para troca de roupas','1 saída de maternidade','4 pares de meia','Fraldinhas de boca','2 mantas','1 pacote de fralda descartável (RN P dependendo do tamanho do bebê)','1 toalha fralda','Sabonete líquido de glicerina','Algodão','Frasco de álcool','Pomada para prevenção de assadura','1 sacolinha para roupas sujas','Pente para cabelo','Almofada de amamentação','1 Coeiro','Cadeirinha ou bebê conforto para o carro'] },
    { titulo: 'check list mamãe', itens: ['2 ou mais camisolas/pijamas com abertura frontal','5 calcinhas confortáveis','Chinelo de dedo confortável','Sutiã de amamentação','Absorvente íntimo','Produtos de higiene pessoal ex: (escova de dente, pasta de dente, sabonete, desodorante sem cheiro por causa do bebê, pente de cabelo, absorvente noturno)','1 muda de roupa para saída pós parto','Prendedor de cabelo','Produtos de beleza (batom pra animar a puérpera)','1 sacola para roupas sujas','Travesseiro de uso pessoal','Toalha de banho'] },
    { titulo: 'check list documentos', itens: ['RG dos pais ou documento com foto','Carteirinha do plano de saúde','Cartão do pré natal!!!','Últimos exames feitos','Se pais casados: certidão de casamento'] },
    { titulo: 'check list acompanhante', itens: ['2 mudas de roupa','Produtos de higiene pessoal','Chinelo','Carregador de celular','Lanchinho'] },
  ];

  const Secao = ({ titulo, itens, color }) => (
    <div style={{ background: `${color}${getLegibleBgOpacity(color)}`, border: `0.5px solid ${color}35`, borderRadius: '3px', padding: '3px 6px', display: 'flex', flexDirection: 'column', gap: '1px', height: '100%' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '4.8px', fontWeight: 700, color: ensureLegibleColor(color), marginBottom: '2.5px', borderBottom: `0.4px solid ${color}30`, paddingBottom: '1.5px', textTransform: 'lowercase' }}>{titulo}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {itens.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '2px', fontSize: '3.2px', color: '#333', lineHeight: 1.2, fontWeight: 500, borderBottom: i === itens.length - 1 ? 'none' : '0.2px solid #00000008', paddingBottom: '1.2px', marginBottom: '1px' }}>
            <div style={{ width: '4px', height: '4px', border: `0.5px solid ${ensureLegibleColor(color)}`, borderRadius: '1px', flexShrink: 0, marginTop: '0.4px', background: '#fff' }} />
            <span style={{ flex: 1 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {/* A4 proporcional: 226×320 ≈ A5, A4 ≈ 226×320 → usar 226×320 para A5, A4 = 226×320 */}
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {comBorda && patternSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        {/* Área branca interna */}
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', overflow: 'hidden' }}>
          {/* Título vertical */}
          <div style={{ width: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${accentColor}10` }}>
            <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: '5.5px', fontWeight: 900, color: accentColor, letterSpacing: '2px', textTransform: 'uppercase' }}>
              CHECKLIST MATERNIDADE
            </div>
          </div>
          {/* Conteúdo */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 5px 3px 5px', gap: '3px', overflow: 'hidden' }}>
            {/* Logo centralizada no topo */}
            <div style={{ width: '100%', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0 6px', borderBottom: `0.4px solid ${accentColor}25`, marginBottom: '4px' }}>
              <LogoPreviewHTML item="Checklist Maternidade" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} crm={crmLine} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
            </div>
            {/* Grid 2x2 */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '2px 4px 6px' }}>
              {SECOES.map((s, i) => <Secao key={i} titulo={s.titulo} itens={s.itens} color={paletteColors[i % paletteColors.length] || accentColor} />)}
            </div>
            {/* Rodapé etiqueta */}
            <div style={{ borderTop: `0.3px solid ${accentColor}30`, paddingTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <div style={{ fontSize: '3px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>{clinicaNome || editData?.marca}</div>
              <div style={{ fontSize: '2.6px', color: '#888', textAlign: 'center', lineHeight: 1.3 }}>
                {endereco && <div>{endereco}</div>}
                {mainPhone && <div>{mainPhone}</div>}
              </div>
              <div style={{ fontSize: '2.6px', color: '#888', textAlign: 'right', flexShrink: 0 }}>
                {site && <div>{site}</div>}
                {instagram && <div>@{instagram}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrientacoesRNPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, rnFields = {}, setRnFields = {} }) {
  const { whatsapp, telefone, telefone2, email, site, instagram } = cartaoContacts || {};
  const mainPhone = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');
  const solidColor = borderColor || paletteColors[0] || accentColor;
  const BORDER = 8; // Sempre tem borda (ou Estampa ou Sólida conforme BordaToggle)
  const c0 = ensureLegibleColor(paletteColors[0] || accentColor);
  const c1 = ensureLegibleColor(paletteColors[1] || accentColor);
  const c2 = ensureLegibleColor(paletteColors[2] || paletteColors[0] || accentColor);
  const c3 = ensureLegibleColor(paletteColors[3] || paletteColors[1] || accentColor);

  const { nomeBebe='', dataNasc='', peso='', altura='', umbigo='álcool 70%', soro='Rinosoro ou Salsep', med1='Luftal', dose1='', int1='8/8h', med2='Tylenol baby', dose2='', int2='6/6h', pomada='Desitin ou Bepantol', vitDMed='Baby-D ou Addera D3', vitDDose='1', bcgData='', hepBData='', consultaData='', consultaHora='', urgencia='' } = rnFields;
  const { setNomeBebe=()=>{}, setDataNasc=()=>{}, setPeso=()=>{}, setAltura=()=>{}, setUmbigo=()=>{}, setSoro=()=>{}, setMed1=()=>{}, setDose1=()=>{}, setInt1=()=>{}, setMed2=()=>{}, setDose2=()=>{}, setInt2=()=>{}, setPomada=()=>{}, setVitDMed=()=>{}, setVitDDose=()=>{}, setBcgData=()=>{}, setHepBData=()=>{}, setConsultaData=()=>{}, setConsultaHora=()=>{}, setUrgencia=()=>{} } = setRnFields;
  const urgenciaTel = urgencia; const setUrgenciaTel = setUrgencia;

  const F = ({ value, onChange, width = '18px', placeholder = '___', align = 'center' }) => (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width, border: 'none', borderBottom: `0.5px solid ${c0}90`, outline: 'none',
        fontSize: '3.5px', fontFamily: 'Montserrat,sans-serif', color: '#222',
        background: 'transparent', padding: '0 1px', textAlign: align,
        display: 'inline-block', verticalAlign: 'baseline' }} />
  );
  const Label = ({ children, color }) => {
    const legible = ensureLegibleColor(color || c0);
    return (
      <div style={{ display: 'inline-block', background: legible + '18', border: `0.5px solid ${legible}45`, borderRadius: '10px', padding: '0.4px 5px', marginBottom: '1.5px' }}>
        <span style={{ fontSize: '3.5px', fontWeight: 800, color: legible, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic' }}>{children}</span>
      </div>
    );
  };
  const Sec = ({ label, color, children }) => (
    <div style={{ marginBottom: '3.5px' }}>
      <Label color={color}>{label}</Label>
      <div style={{ fontSize: '3.5px', color: '#444', lineHeight: 1.35, fontFamily: 'Montserrat,sans-serif' }}>{children}</div>
    </div>
  );
  const Bullet = ({ children }) => (
    <div style={{ display: 'flex', gap: '1.5px', marginBottom: '1px' }}>
      <span style={{ fontSize: '3.5px', color: c0, flexShrink: 0 }}>•</span>
      <span style={{ fontSize: '3.5px', color: '#444', lineHeight: 1.35, fontFamily: 'Montserrat,sans-serif' }}>{children}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {comBorda && patternSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale||150)/2.5}px`, backgroundRepeat: 'repeat', zIndex: 0 }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor, zIndex: 0 }} />
        }
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1, isolation: 'isolate' }}>

          {/* CABEÇALHO */}
          <div style={{ background: c0, padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.2 }}>
              OS PRIMEIROS DIAS<br/>COM MEU BEBÊ
            </div>
            <div style={{ width: '80px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
              <LogoPreviewHTML item="Certificado de Coragem" editData={editData} color={'#fff'} layout={logoLayout} scaleFactor={0.12} crm={null} hideTagline maxWidth="100%" maxHeight="100%" />
            </div>
          </div>

          {/* FAIXA DO BEBÊ */}
          <div style={{ background: c0+'12', borderBottom: `0.5px solid ${c0}30`, padding: '2px 6px', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 2 }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Bebê:</span>
              <F value={nomeBebe} onChange={setNomeBebe} width="40px" placeholder="nome do bebê" align="left" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Nasc:</span>
              <F value={dataNasc} onChange={setDataNasc} width="22px" placeholder="dd/mm/aa" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>Peso:</span>
              <F value={peso} onChange={setPeso} width="14px" placeholder="kg" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>Alt:</span>
              <F value={altura} onChange={setAltura} width="14px" placeholder="cm" />
            </div>
          </div>

          {/* CORPO - 2 colunas */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
            <div style={{ flex: '0 0 45%', padding: '4px 4px 2px 5px', borderRight: `0.4px solid ${c0}20`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Sec label="Alimentação:" color={c0}>Aleitamento materno sob livre demanda (à vontade).</Sec>
              <Sec label="Umbigo:" color={c1}>Limpeza com <F value={umbigo} onChange={setUmbigo} width="28px" placeholder="álcool 70%" /> a cada troca de fralda e após o banho.</Sec>
              <Sec label="Icterícia:" color={c2}>Pele amarelada? Procure o pediatra imediatamente.</Sec>
              <Sec label="Febre:" color={c3}>Menores de 3 meses: emergência. Maiores de 3 meses: siga as orientações médicas.</Sec>
              <Sec label="Higiene:" color={c0}>1 banho/dia com sabonete neutro. Sem talco ou perfume. Trocas com água morna e algodão.</Sec>
            </div>
            <div style={{ flex: 1, padding: '4px 5px 2px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Sec label="Nariz:" color={c1}>Spray de soro 0,9% (<F value={soro} onChange={setSoro} width="28px" placeholder="marca" />) antes de cada mamada.</Sec>
              <Sec label="Cólicas:" color={c2}>
                Compressa morna. Se necessário: <F value={med1} onChange={setMed1} width="20px" placeholder="remédio" /> <F value={dose1} onChange={setDose1} width="10px" placeholder="gts" /> gts <F value={int1} onChange={setInt1} width="14px" placeholder="8/8h" />. Sem melhora: <F value={med2} onChange={setMed2} width="22px" placeholder="remédio" /> <F value={dose2} onChange={setDose2} width="10px" placeholder="gts" /> gts <F value={int2} onChange={setInt2} width="14px" placeholder="6/6h" />.
              </Sec>
              <Sec label="Assaduras:" color={c3}>Secar bem antes de aplicar (<F value={pomada} onChange={setPomada} width="36px" placeholder="pomada" />).</Sec>
              <Sec label="Vitamina D:" color={c0}><F value={vitDMed} onChange={setVitDMed} width="30px" placeholder="marca" /> — <F value={vitDDose} onChange={setVitDDose} width="8px" placeholder="1" /> gota/dia desde o nascimento.</Sec>
            </div>
          </div>

          {/* VACINAS + PRÓXIMA CONSULTA */}
          <div style={{ borderTop: `0.5px solid ${c0}25`, padding: '2.5px 6px', flexShrink: 0, display: 'flex', gap: '6px', alignItems: 'center', background: c1+'0a' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '3.2px', fontWeight: 800, color: c1, fontFamily: 'Montserrat,sans-serif', marginBottom: '1px', textTransform: 'uppercase' }}>Vacinas na maternidade</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  BCG: <F value={bcgData} onChange={setBcgData} width="20px" placeholder="data" />
                </div>
                <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Hep B: <F value={hepBData} onChange={setHepBData} width="20px" placeholder="data" />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, background: c2+'18', borderRadius: '3px', padding: '2px 4px', border: `0.5px solid ${c2}40` }}>
              <div style={{ fontSize: '3.2px', fontWeight: 800, color: c2, fontFamily: 'Montserrat,sans-serif', marginBottom: '1px', textTransform: 'uppercase' }}>📅 Próxima consulta</div>
              <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <F value={consultaData} onChange={setConsultaData} width="24px" placeholder="dd/mm/aa" />
                <span>às</span>
                <F value={consultaHora} onChange={setConsultaHora} width="16px" placeholder="00h00" />
              </div>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div style={{ borderTop: `0.5px solid ${c0}25`, padding: '2px 6px', flexShrink: 0, background: c0+'08' }}>
            <div style={{ fontSize: '3.5px', fontWeight: 900, color: c0, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic', marginBottom: '1.5px' }}>Observações:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 8px' }}>
              <div>
                <Bullet>Consulta entre 7 e 14 dias de vida.</Bullet>
                <Bullet>Levar ao Posto para vacinação.</Bullet>
                <Bullet>Teste do Pezinho entre o 3º e 7º dia.</Bullet>
                <Bullet>Teste da Orelhinha o quanto antes.</Bullet>
              </div>
              <div>
                <Bullet>Dormir sempre de barriga para cima.</Bullet>
                <Bullet>Sem travesseiros ou cobertores pesados.</Bullet>
                <Bullet>Roupas leves no bebê.</Bullet>
                <Bullet>Sólidos só após os 6 meses com orientação.</Bullet>
              </div>
            </div>
          </div>

          {/* RODAPÉ */}
          <div style={{ borderTop: `0.4px solid ${c0}30`, padding: '2px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px' }}>
              <div style={{ fontSize: '3.5px', fontWeight: 800, color: c0, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase' }}>{clinicaNome || editData?.marca || 'Sua Clínica'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '3px', color: '#888', fontFamily: 'Montserrat,sans-serif' }}>Urgências:</span>
                <F value={urgenciaTel} onChange={setUrgenciaTel} width="28px" placeholder="telefone" align="left" />
              </div>
            </div>
            <div style={{ fontSize: '2.8px', color: '#aaa', fontFamily: 'Montserrat,sans-serif', textAlign: 'right' }}>
              {[mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuiaCuidadosPreview({ brand, logoColor, logoLayout, comBorda, setComBorda, patternSrc, patternScale, setPatternScale, accentColor, borderColor, setBorderColor, paletteColors, cartaoContacts, crmLine, clinicaNome, editData, localSlogan }) {
  const [svgContent, setSvgContent] = React.useState('');
  const color1 = paletteColors[0] || accentColor;
  const color1b = paletteColors[1] || paletteColors[0] || accentColor;
  const color2 = paletteColors[1] || accentColor;
  const { whatsapp, telefone, email, site, instagram } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const draNome = clinicaNome || brand?.editData?.marca || '';
  const especialidade = cartaoContacts?.especialidade || 'pediatra';

  React.useEffect(() => {
    fetch('/guia-de-cuidados-clean.svg').then(r => r.text()).then(svg => {
      const patTile = Math.round((patternScale || 150) / 4 * (428 / 220));
      const solidColor = borderColor || accentColor;
      const estampaDefs = comBorda && patternSrc ? `
        <defs>
          <pattern id="guiaPat" x="854" y="0" width="${patTile}" height="${patTile}" patternUnits="userSpaceOnUse">
            <image href="${patternSrc}" x="0" y="0" width="${patTile}" height="${patTile}" preserveAspectRatio="xMidYMid slice"/>
          </pattern>
          <pattern id="guiaPat5" x="0" y="0" width="${patTile}" height="${patTile}" patternUnits="userSpaceOnUse">
            <image href="${patternSrc}" x="0" y="0" width="${patTile}" height="${patTile}" preserveAspectRatio="xMidYMid slice"/>
          </pattern>
        </defs>
      ` : '';
      // Rect de cor na capa (FINAL para cobrir o branco original do SVG)
      // Pág 5 (x=0) não recebe overlay sólido — texto deve aparecer
      const estampaRects = comBorda && patternSrc ? `
        <rect x="854" y="10" width="428" height="626" fill="url(#guiaPat)" opacity="0.9"/>
        <rect x="0" y="10" width="427" height="626" fill="url(#guiaPat5)" opacity="0.15"/>
      ` : `
        <rect x="854" y="10" width="428" height="626" fill="${solidColor}" opacity="0.9"/>
      `;
      svg = svg
        .replace(/<\?xml[^?]*\?>\s*/g, '')
        .replace(/(<rect x="434[^"]*" y="[^"]*" style="fill:#E4D1C1;" width="417[^"]*" height="[^"]*"\/>)/, `<rect x="427" y="10" style="fill:${color1};" width="428" height="626"/>`)
        .replace(/(<rect x="434\.863" y="648[^"]*" style="fill:#E4D1C1;" width="416[^"]*" height="[^"]*"\/>)/, `<rect x="427" y="645" style="fill:${color1b};" width="428" height="626"/>`)
        .replace(/#E4D1C1/gi, color1)
        .replace(/#2D3615/gi, color2)
        .replace(/(<svg[^>]*>)/, `$1<rect width="1282" height="1271" fill="#fff"/>${estampaDefs}`);
      // Apenas etiqueta Pág 6 — capa é renderizada pelo overlay React; estampa no final cobre o branco original
      const etiquetaPreview = `
        <rect x="451" y="565" width="380" height="42" rx="2" fill="rgba(255,255,255,0.92)" stroke="${accentColor}" stroke-width="0.4"/>
        <text x="641" y="579" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="7.5" font-weight="700" fill="${accentColor}">${draNome}${crmLine ? `  ·  ${crmLine}` : ''}</text>
        <text x="641" y="592" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="6.5" fill="#555">${[mainPhone, email, site].filter(Boolean).join('  ·  ')}</text>
      `;
      svg = svg.replace('</svg>', estampaRects + etiquetaPreview + '</svg>');
      setSvgContent(svg);
    });
  }, [patternSrc, patternScale, comBorda, borderColor, color1, color1b, color2, accentColor, draNome, crmLine]);

  const svgInner = React.useMemo(() => {
    if (!svgContent) return '';
    const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    return match ? match[1] : '';
  }, [svgContent]);

  // Capa HTML igual ao Guia Alimentar — overlay sobre o SVG
  const capaOverlay = (
    <div style={{ position:'absolute', right:0, top:0, width:'33.1%', height:'100%',
      pointerEvents:'none' }}>
      <div style={{ position:'absolute', top:'1.6%', left:'2.4%', right:'2.4%', bottom:'1.6%',
        background: (comBorda && patternSrc) ? 'transparent' : '#fff', borderRadius:'2px', display:'flex',
        flexDirection:'column', alignItems:'center', justifyContent:'flex-start',
        paddingTop:'19px', textAlign:'center',
        clipPath: (comBorda && patternSrc) ? 'none' : 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' }}>
        <div style={{ width: '80%', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <LogoPreviewHTML item="Receituário" editData={editData} color={accentColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} withBackground={!!patternSrc} />
        </div>
        <div style={{ width:'13px', height:'0.7px', background:accentColor, marginBottom:'8px', borderRadius:'10px' }} />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0px' }}>
          <div style={{ fontSize:'3px', fontWeight:800, color:`${accentColor}cc`, textTransform:'uppercase', letterSpacing:'0.6px', fontStyle:'italic' }}>GUIA DE</div>
          <div style={{ fontSize:'5.9px', fontWeight:800, color:'#333', textTransform:'uppercase', letterSpacing:'0.8px', lineHeight:1.2 }}>CUIDADOS COM O BEBÊ</div>
        </div>
        <div style={{ marginTop:'3px', padding:'0.6px 3px', background:`${accentColor}15`, borderRadius:'20px', border:`0.4px solid ${accentColor}30` }}>
          <div style={{ fontSize:'2.8px', fontWeight:800, color:accentColor, letterSpacing:'0.2px', textTransform:'uppercase' }}>Saúde e Bem-Estar Pediátrico</div>
        </div>
      </div>
    </div>
  );

  const face = (label, vb, overlay) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', width:'100%' }}>
      <span style={{ fontSize:'0.65rem', color:'#aaa', textTransform:'uppercase', letterSpacing:'2px' }}>{label}</span>
      <div style={{ width:'100%', maxWidth:'760px', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', borderRadius:'4px', overflow:'hidden', position:'relative' }}>
        <svg viewBox={vb} width="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          dangerouslySetInnerHTML={{ __html: svgInner }} />
        {overlay}
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', alignItems:'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {svgInner ? <>
        {face('Lado Externo (Face 1)', '10 10 1262 616', capaOverlay)}
        {face('Lado Interno (Face 2)', '10 646 1262 616', null)}
      </> : <div style={{ padding:'40px', color:'#aaa', fontSize:'0.8rem' }}>Carregando preview...</div>}
    </div>
  );
}

function FolderTrifoldPreview({ brand, editData, logoColor, logoLayout, comBorda, setComBorda, patternSrc, patternScale, setPatternScale, accentColor, borderColor, setBorderColor, paletteColors, title, subtitle, cartaoContacts, folderRoof, setFolderRoof, crmLine }) {
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = editData || brand.editData || {};
  const instagram = cartaoContacts?.instagram || brand?.instagram || '';
  const site = cartaoContacts?.site || brand?.site || '';
  const clinicaNome = brand?.clinicaNome || brand?.editData?.clinicaNome || 'Sua Clínica';
  const endereco = cartaoContacts?.endereco || brand?.endereco || brand?.editData?.endereco || 'Endereço não informado';

  const allPhones = [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · ');
  const logoHtml = <LogoPreviewHTML item={title} editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={0.16} crm={crmLine} maxWidth="100%" maxHeight="100%" />;
  const _borderColor = borderColor || accentColor;
  
  // Página do Folder (A5 148x210mm)
  const Page = ({ num, children, isSmall = false, withPattern = false, padding = '15px' }) => (
    <div style={{ 
      width: isSmall ? '146px' : '148px', 
      height: '210px', 
      background: '#fff', 
      borderRight: num === 2 || num === 3 || num === 5 || num === 6 ? '1px dashed rgba(0,0,0,0.06)' : 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {withPattern && (
        comBorda && patternSrc ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.3}px`, backgroundRepeat: 'repeat', opacity: 0.1 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: borderColor || paletteColors[0] || accentColor, opacity: 0.12 }} />
        )
      )}
      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '6px', color: '#ccc', fontWeight: 700, zIndex: 10 }}>PÁG {num} {num === 1 ? '(CAPA)' : ''}</div>
      <div style={{ position: 'relative', zIndex: 2, padding, height: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );

  // Lógica de Título em dois níveis
  const getTitleData = (raw) => {
    if (raw.includes('Alimentar')) return { pre: 'GUIA DE', main: 'INTRODUÇÃO ALIMENTAR', tagline: 'Nutrição e Saúde para o seu Bebê' };
    if (raw.includes('Cuidados')) return { pre: 'CUIDADOS', main: 'COM O BEBÊ', tagline: 'Carinho e Atenção em Cada Detalhe' };
    if (raw.includes('Desenvolvimento')) return { pre: 'GUIA DE', main: 'DESENVOLVIMENTO', tagline: 'Acompanhe Cada Passo do Crescimento do Seu Bebê' };
    if (raw.includes('Vacina')) return { pre: 'GUIA DE', main: 'VACINA', tagline: 'Calendário e Acompanhamento de Imunização' };
    if (raw.includes('Sono')) return { pre: 'GUIA DO', main: 'SONO SAUDÁVEL', tagline: 'Rotina e Segurança para o Sono do Bebê' };
    if (raw.includes('Pré-Natal')) return { pre: 'CARTÃO DE', main: 'EXAME PRÉ-NATAL', tagline: 'Cuidando da saúde do bebê e da mamãe desde o início...' };
    return { pre: 'GUIA DE', main: raw.toUpperCase(), tagline: 'Saúde e Bem-Estar Pediátrico' };
  };
  const { pre, main, tagline: themeTagline } = getTitleData(title || 'Guia Alimentar');
  const isPrenatal = (title || '').includes('Pré-Natal');

  // Determinar quais componentes de arte usar
  const isDev = (title || '').includes('Desenvolvimento');
  const isVacina = (title || '').includes('Vacina');
  const isSono = (title || '').includes('Sono');
  const isCuidados = (title || '').includes('Cuidados');

  const finalTagline = (isPrenatal || isSono || isVacina || isDev || isCuidados || (title || '').includes('Alimentar')) ? themeTagline : (_brandData.tagline || themeTagline);

  const darkenHex = (hex, factor = 0.55) => {
    const h = hex.replace('#', '');
    const r = Math.round(parseInt(h.substring(0,2),16) * factor);
    const g = Math.round(parseInt(h.substring(2,4),16) * factor);
    const b = Math.round(parseInt(h.substring(4,6),16) * factor);
    return `rgb(${r},${g},${b})`;
  };

  const Art2 = isVacina ? FolderVacinaPage2 : (isDev ? FolderDevPage2 : (isSono ? FolderSonoPage2 : (isCuidados ? FolderCuidadosPage2 : FolderPage2Art)));
  const Art3 = isVacina ? FolderVacinaPage3 : (isDev ? FolderDevPage3 : (isSono ? FolderSonoPage3 : (isCuidados ? FolderCuidadosPage3 : FolderPage3Art)));
  const Art4 = isVacina ? FolderVacinaPage4 : (isDev ? FolderDevPage4 : (isSono ? FolderSonoPage4 : (isCuidados ? FolderCuidadosPage4 : FolderPage4Art)));
  const Art5 = isVacina ? FolderVacinaPage5 : (isDev ? FolderDevPage5 : (isSono ? FolderSonoPage5 : (isCuidados ? FolderCuidadosPage5 : FolderPage5Art)));
  const Art6 = isVacina ? FolderVacinaPage6 : null;
  const Art1 = isVacina ? FolderVacinaPage1 : null;

  return (
    <div id="folder-trifold-preview" style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', alignItems: 'center', paddingBottom: '40px' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" />
      
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setFolderRoof && (
        <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
          {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
        </button>
      )}

      {/* LADO EXTERNO (5 | 6 | 1) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO EXTERNO (FACE 1)</span>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          {/* Pág 5 - Aba que dobra pra dentro */}
          <Page num={5} isSmall>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
               {comBorda && patternSrc && (
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.3}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
               )}
               <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}10` : (!comBorda ? 'transparent' : 'transparent') }} />
            </div>
            <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '6px', background: '#fff', borderRadius: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', justifyContent: 'center' }}>
               <div style={{ width: '100%', height: '100%', transform: 'scale(0.92)', transformOrigin: 'center center' }}>
                 <Art5 accentColor={accentColor} palette={paletteColors} />
               </div>
            </div>
          </Page>


          {/* Pág 6 - Contra-capa (ESTAMPA COMPLETA + LEMBRE-SE) */}
          <Page num={6}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
              {comBorda && patternSrc && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.3}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}10` : 'transparent' }} />
            </div>
            
             <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '6px', background: '#fff', borderRadius: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
              {isVacina ? (
                <Art6 accentColor={accentColor} palette={paletteColors} />
              ) : (
                <>
                  <div style={{ position: 'absolute', top: '48%', left: '10px', right: '10px', zIndex: 3, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
                    <div style={{ width: '92%', background: mainColor, borderRadius: '4px', padding: '12px 14px', textAlign: 'center', position: 'relative', border: `0.4px solid ${mainColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                       <div style={{ fontFamily: `'Great Vibes', cursive`, color: '#fff', fontSize: '9px', marginBottom: '4px', textTransform: 'none' }}>{isSono ? '"Um bebê bem descansado é um bebê mais feliz!"' : isCuidados ? '"Você não precisa ser perfeita — precisa estar presente."' : '"Brinque, converse e explore!"'}</div>
                       <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 500, lineHeight: 1.5, fontFamily: 'Montserrat, sans-serif' }}>
                         {isSono ? 'O sono é uma necessidade fisiológica essencial para o desenvolvimento do seu bebê. Uma rotina consistente, ambiente seguro e respeito aos sinais de sono fazem toda a diferença.' : isCuidados ? 'Cuidar de um bebê é aprender junto com ele. Cada dúvida é normal, cada conquista é sua também. Você está fazendo um trabalho incrível.' : 'As brincadeiras são mais do que momentos de diversão. Elas ajudam seu bebê a aprender, a desenvolver novas habilidades e a se sentir seguro e amado. Pergunte, cante, brinque de esconde-esconde e observe o quanto seu bebê cresce a cada dia.'}
                       </div>
                    </div>
                 </div>

                <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px', opacity: 0.18 }}>
                   {Array.from({length: 8}).map((_, i) => (
                     <div key={i} style={{ width: '3px', height: '3px', background: mainColor, borderRadius: '50%' }} />
                   ))}
                </div>
              </>
              )}
            </div>

            {/* ETIQUETA DE DADOS NO RODAPÉ (DISCRETA E ELEGANTE) */}
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', background: '#fff', border: `0.5px solid ${mainColor}15`, borderRadius: '3px', padding: '4px 10px', zIndex: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <div style={{ fontSize: '5.2px', fontWeight: 800, color: mainColor, marginBottom: '0.5px' }}>{clinicaNome}</div>
                <div style={{ fontSize: '4.2px', color: '#999', fontWeight: 500, lineHeight: 1.1 }}>{endereco}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginTop: '0.5px' }}>
                   <svg viewBox="0 0 24 24" width="7" height="7" fill="#25D366" style={{ flexShrink: 0 }}><path d={ICON_PATHS.whatsapp}/></svg>
                   <div style={{ fontSize: '5.5px', fontWeight: 800, color: '#444' }}>{allPhones}</div>
                </div>

                <div style={{ fontSize: '4px', color: '#aaa', marginTop: '0.5px' }}>
                   {[brand.email, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}
                </div>
            </div>
          </Page>

          {/* Pág 1 - Capa Principal (ESTAMPA NA BORDA) */}
          <Page num={1}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
               {comBorda && patternSrc && (
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.35}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
               )}
               <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}15` : 'transparent' }} />
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', background: '#fff', borderRadius: '2px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `0.5px solid ${accentColor}15`, clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none', transition: 'clip-path 0.3s ease' }}>
                {isVacina ? (
                  <div style={{ width: '100%', height: '100%', transform: 'scale(0.92)', transformOrigin: 'center center' }}>
                    <Art1 accentColor={accentColor} palette={paletteColors} logoComponent={<LogoPreviewHTML editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={0.16} crm={crmLine} maxWidth="100%" maxHeight="100%" />} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '32px', textAlign: 'center', width: '100%', height: '100%' }}>
                    <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{logoHtml}</div>
                    <div style={{ width: '22px', height: '1.2px', background: accentColor, marginBottom: '14px', borderRadius: '10px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                       <div style={{ fontSize: '5.2px', fontWeight: 800, color: `${accentColor}cc`, textTransform: 'uppercase', letterSpacing: '0.6px', fontStyle: 'italic' }}>{pre}</div>
                       <div style={{ fontSize: '9.2px', fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: '0.8px', lineHeight: 1.2 }}>{main}</div>
                    </div>
                    <div style={{
                      marginTop: '5px',
                      padding: '2px 10px',
                      background: (isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '28',
                      borderRadius: '20px',
                      border: `0.5px solid ${(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '50'}`
                    }}>
                      <div style={{
                        fontSize: '4.8px',
                        fontWeight: 800,
                        color: darkenHex(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor),
                        letterSpacing: '0.2px',
                        fontFamily: '"Myriad Pro Condensed", "MyriadPro-Cond", sans-serif',
                        textTransform: 'uppercase'
                      }}>{isSono ? 'DURMA BEM, CRESÇA BEM' : isCuidados ? 'DO PRIMEIRO DIA COM MUITO AMOR' : isDev ? 'CADA DIA UM NOVO DESCOBRIMENTO' : isVacina ? 'PROTEGIDO DESDE O PRIMEIRO DIA' : isPrenatal ? 'CUIDANDO DA SAÚDE DA MAMÃE E DO BEBÊ' : 'NUTRIÇÃO QUE TRANSFORMA'}</div>
                    </div>
                  </div>
                )}
            </div>
          </Page>
        </div>
      </div>

      {/* LADO INTERNO (2 | 3 | 4) */}
      <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO INTERNO (FACE 2)</span>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={2} withPattern padding="15px 4px 6px 4px">
            <Art2 accentColor={accentColor} palette={paletteColors} />
          </Page>
          <Page num={3} withPattern padding="15px 4px 6px 4px">
            <Art3 accentColor={accentColor} palette={paletteColors} />
          </Page>
          <Page num={4} isSmall withPattern padding="15px 4px 6px 4px">
            <Art4 accentColor={accentColor} palette={paletteColors} />
          </Page>
        </div>
      </div>
    </div>
  );
}

function FolderA5Preview({ brand, editData, logoColor, logoLayout, comBorda, setComBorda, patternSrc, patternScale, setPatternScale, accentColor, borderColor, setBorderColor, paletteColors, title, cartaoContacts, crmLine, folderRoof }) {
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = editData || brand.editData || {};
  const logoHtml = <LogoPreviewHTML editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={0.16} crm={crmLine} maxWidth="100%" maxHeight="100%" />;

  const getTitleData = (raw) => {
    if (raw.includes('Alimentar')) return { pre: 'GUIA DE', main: 'INTRODUÇÃO ALIMENTAR', tagline: 'Nutrição e Saúde para o seu Bebê' };
    if (raw.includes('Cuidados')) return { pre: 'CUIDADOS', main: 'COM O BEBÊ', tagline: 'Carinho e Atenção em Cada Detalhe' };
    if (raw.includes('Desenvolvimento')) return { pre: 'GUIA DE', main: 'DESENVOLVIMENTO', tagline: 'Acompanhe Cada Passo do Crescimento do Seu Bebê' };
    if (raw.includes('Vacina')) return { pre: 'GUIA DE', main: 'VACINA', tagline: 'Calendário e Acompanhamento de Imunização' };
    if (raw.includes('Sono')) return { pre: 'GUIA DO', main: 'SONO SAUDÁVEL', tagline: 'Rotina e Segurança para o Sono do Bebê' };
    if (raw.includes('Pré-Natal')) return { pre: 'CARTÃO DE', main: 'EXAME PRÉ-NATAL', tagline: 'Cuidado desde o Início' };
    return { pre: 'GUIA DE', main: raw.toUpperCase(), tagline: 'Saúde e Bem-Estar Pediátrico' };
  };
  const { pre, main, tagline: themeTagline } = getTitleData(title || 'Pré-Natal');
  const isPrenatal = (title || '').includes('Pré-Natal');
  const finalTagline = (isPrenatal || (title || '').includes('Sono') || (title || '').includes('Vacina')) ? themeTagline : (_brandData.tagline || themeTagline);

  const Page = ({ num, children, withPattern = false }) => (
    <div style={{ 
      width: '148px', 
      height: '210px', 
      background: '#fff', 
      borderRight: num === 4 || num === 2 ? '1px dashed rgba(0,0,0,0.06)' : 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {withPattern && (
        comBorda && patternSrc ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.3}px`, backgroundRepeat: 'repeat', opacity: 0.1 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: borderColor || paletteColors[0] || accentColor, opacity: 0.12 }} />
        )
      )}
      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '6px', color: '#ccc', fontWeight: 700, zIndex: 10 }}>PÁG {num} {num === 1 ? '(CAPA)' : ''}</div>
      <div style={{ position: 'relative', zIndex: 2, height: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', alignItems: 'center', paddingBottom: '40px' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* FACE 1: Pág 4 (Verso) | Pág 1 (Capa) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>LADO EXTERNO (FACE 1)</span>
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={4} withPattern><PrenatalPage4 accentColor={accentColor} palette={paletteColors} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} /></Page>
          <Page num={1} withPattern><PrenatalPage1 accentColor={accentColor} palette={paletteColors} logoComponent={<LogoPreviewHTML editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={0.30} crm={crmLine} maxWidth="100%" maxHeight="100%" />} folderRoof={folderRoof} tagline={finalTagline} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} /></Page>
        </div>
      </div>

      {/* FACE 2: Pág 2 | Pág 3 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>LADO INTERNO (FACE 2)</span>
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={2} withPattern><PrenatalPage2 accentColor={accentColor} palette={paletteColors} /></Page>
          <Page num={3} withPattern><PrenatalPage3 accentColor={accentColor} palette={paletteColors} /></Page>
        </div>
      </div>
    </div>
  );
}

function AtestadoPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, crmLine, clinicaNome, marca, cartaoContacts, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, folderRoof, setFolderRoof, paperSize, setPaperSize }) {
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
  const roofClip = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {setFolderRoof && (
          <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
            {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
          </button>
        )}
        {setPaperSize && (
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '20px', padding: '3px' }}>
            {['a5', 'a4'].map(s => (
              <button key={s} onClick={() => setPaperSize(s)} style={{ padding: '3px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: paperSize === s ? accentColor : 'transparent', color: paperSize === s ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 120px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
      {effectiveSrc
        ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
        : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
      <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', clipPath: roofClip }} />

      {/* Logo no topo */}
      <div style={{ position: 'absolute', top: `${BORDER + 6}px`, left: '50%', transform: 'translateX(-50%)', width: '180px', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LogoPreviewHTML item="Atestado Médico" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.24} crm={crmLine} hideTagline={hideTagline} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
      </div>

      {/* Título */}
      <div style={{ position: 'absolute', top: '90px', left: 0, right: 0, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '7.5px', letterSpacing: '1.2px', textAlign: 'center', color: '#1a1a2e' }}>ATESTADO MÉDICO</div>

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

function PapelTimbradoPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const BORDER = 12;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || paletteColors[0] || accentColor;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 120px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {effectiveSrc
          ? <><div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} /><div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff' }} /></>
          : <div style={{ position: 'absolute', inset: 0, background: '#fff', border: `${BORDER}px solid ${solidColor}` }} />}
        
        {/* Top Logo */}
        <div style={{ position: 'absolute', top: BORDER + 8, left: '50%', transform: 'translateX(-50%)', width: '100px', display: 'flex', justifyContent: 'center' }}>
          <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.35} crm={crmLine} />
        </div>

        {/* Central Watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15, width: '160px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
           <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.65} hideTagline />
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: BORDER + 15, left: BORDER + 10, right: BORDER + 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
           <div style={{ fontSize: '4.5px', fontWeight: 800, color: accentColor, textAlign: 'center' }}>{clinicaNome}</div>
           <div style={{ fontSize: '4px', color: '#888', textAlign: 'center' }}>
              {[cartaoContacts.whatsapp, cartaoContacts.telefone, cartaoContacts.email, cartaoContacts.site].filter(Boolean).join('  ·  ')}
           </div>
        </div>
      </div>
    </div>
  );
}

const STORY_TEMPLATES = [
  { id: 'tiraduvidas', titulo: 'Tira-Dúvidas',       subtitulo: 'Me manda sua pergunta!',      caixinha: 'caixinha de perguntas' },
  { id: 'enquete',     titulo: 'Me conta!',           subtitulo: 'Qual é a sua dúvida?',        caixinha: 'enquete ou caixinha' },
  { id: 'mito',        titulo: 'Verdade ou Mito?',    subtitulo: 'O que você já ouviu por aí?', caixinha: 'caixinha de perguntas' },
  { id: 'dica',        titulo: 'Dica do Dia',         subtitulo: 'Arrasta pra ver o conteúdo',  caixinha: 'área de conteúdo' },
  { id: 'indica',      titulo: 'Me Indica!',          subtitulo: 'Qual produto você quer ver?', caixinha: 'caixinha de respostas' },
  { id: 'novidades',   titulo: 'Novidades',           subtitulo: 'Tem coisa boa chegando!',     caixinha: 'área de conteúdo' },
  { id: 'sabiaque',    titulo: 'Você Sabia?',         subtitulo: 'Um fato que vai te surpreender', caixinha: 'área de conteúdo' },
  { id: 'livre',       titulo: 'Fala Comigo!',        subtitulo: 'Manda sua mensagem',          caixinha: 'caixinha de perguntas' },
];

const INSTA_FORMATS = [
  { id: 'story', label: 'Story 9:16', pw: 180, ph: 320, rw: 1080, rh: 1920, logoSF: 0.45, titleTop: '95px', boxTop: '120px', boxH: '110px', footerBottom: '25px', titleSize: '9px', subSize: '6px' },
  { id: 'post',  label: 'Post 1:1',   pw: 280, ph: 280, rw: 1080, rh: 1080, logoSF: 0.55, titleTop: '80px', boxTop: '105px', boxH: '80px',  footerBottom: '18px', titleSize: '11px', subSize: '7px' },
];

function FundoInstaPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome, storyTemplateIdx, setStoryTemplateIdx, storyFormatIdx, setStoryFormatIdx }) {
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || paletteColors?.[0] || accentColor;
  const instagram = cartaoContacts?.instagram || '';
  const tmplIdx = storyTemplateIdx ?? 0;
  const tmpl = STORY_TEMPLATES[tmplIdx] || STORY_TEMPLATES[0];
  const fmtIdx = storyFormatIdx ?? 0;
  const fmt = INSTA_FORMATS[fmtIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Seletor de formato */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {INSTA_FORMATS.map((f, i) => (
          <button key={f.id} onClick={() => setStoryFormatIdx && setStoryFormatIdx(i)} style={{ padding: '6px 18px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: fmtIdx === i ? solidColor : 'transparent', color: fmtIdx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Seletor de template */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '380px' }}>
        {STORY_TEMPLATES.map((t, i) => (
          <button key={t.id} onClick={() => setStoryTemplateIdx && setStoryTemplateIdx(i)} style={{ padding: '4px 10px', borderRadius: '12px', border: `1px solid ${tmplIdx === i ? solidColor : '#ddd'}`, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '10px', fontWeight: 600, background: tmplIdx === i ? solidColor + '15' : 'transparent', color: tmplIdx === i ? solidColor : '#999', transition: 'all 0.2s' }}>
            {t.titulo}
          </button>
        ))}
      </div>

      <div id="insta-bg-preview" data-insta-preview style={{ width: `${fmt.pw}px`, height: `${fmt.ph}px`, position: 'relative', boxShadow: '0 4px 60px rgba(0,0,0,0.15)', borderRadius: fmt.id === 'story' ? '24px' : '12px', overflow: 'hidden', background: '#fff', transition: 'width 0.3s, height 0.3s' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
           {effectiveSrc && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.2 }} />}
           <div style={{ position: 'absolute', inset: 0, background: !effectiveSrc ? `${solidColor}10` : 'transparent' }} />
        </div>
        <div style={{ position: 'absolute', top: fmt.id === 'post' ? '18px' : '30px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
           <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={fmt.logoSF} crm={crmLine} />
        </div>
        <div style={{ position: 'absolute', top: fmt.titleTop, left: '0', right: '0', textAlign: 'center', zIndex: 3 }}>
           <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: fmt.titleSize, fontWeight: 900, color: accentColor, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>{tmpl.titulo}</div>
           <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: fmt.subSize, fontWeight: 500, color: accentColor, opacity: 0.6, marginTop: '2px' }}>{tmpl.subtitulo}</div>
        </div>
        <div style={{ position: 'absolute', top: fmt.boxTop, left: '20px', right: '20px', height: fmt.boxH, border: `1.5px dashed ${accentColor}40`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)', zIndex: 2 }}>
           <div data-html2canvas-ignore style={{ fontSize: '7px', color: `${accentColor}80`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Espaço para a {tmpl.caixinha}</div>
        </div>
        <div style={{ position: 'absolute', bottom: fmt.footerBottom, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 3 }}>
           {instagram && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg viewBox="0 0 24 24" width="8" height="8" fill={accentColor}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <div style={{ fontSize: '7px', fontWeight: 800, color: accentColor }}>@{instagram}</div>
             </div>
           )}
           <div style={{ fontSize: '5px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{clinicaNome}</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>{fmt.rw} × {fmt.rh}px</div>
    </div>
  );
}

function AssinaturaEmailPreview({ brand, editData, accentColor, logoColor, logoLayout, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const { whatsapp, telefone, email, site, instagram } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    const html = `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #333333; line-height: 1.4;">
        <tr>
          <td style="padding-right: 20px; border-right: 1px solid #eeeeee; vertical-align: middle;">
            <div style="font-size: 18px; font-weight: bold; color: ${accentColor}; text-align: center;">
              ${clinicaNome}
            </div>
          </td>
          <td style="padding-left: 20px; vertical-align: middle;">
            <div style="font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 2px;">${clinicaNome}</div>
            <div style="font-size: 10px; font-weight: bold; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${localSlogan || 'Saúde e Bem-Estar'}</div>
            
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 11px; color: #666666;">
              ${mainPhone ? `<tr><td style="padding-bottom: 2px;"><b>WhatsApp:</b> ${mainPhone}</td></tr>` : ''}
              ${email ? `<tr><td style="padding-bottom: 2px;"><b>E-mail:</b> ${email.toLowerCase()}</td></tr>` : ''}
              ${instagram ? `<tr><td style="padding-top: 4px;"><a href="https://instagram.com/${instagram}" style="color: #333333; text-decoration: none; font-weight: bold;">@${instagram}</a></td></tr>` : ''}
              ${site ? `<tr><td style="padding-top: 2px;"><a href="${site.startsWith('http') ? site : 'https://' + site}" style="color: ${accentColor}; text-decoration: none; font-weight: bold;">${site.replace('https://','').replace('http://','')}</a></td></tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': html })];
    
    navigator.clipboard.write(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
      <div data-assinatura-preview style={{ width: '450px', height: '140px', background: '#fff', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '20px', display: 'flex', alignItems: 'center', gap: '25px', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: `${accentColor}10`, borderRadius: '0 0 0 40px' }} />
         <div style={{ width: '150px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.72} hideTagline />
         </div>
         <div style={{ width: '1px', height: '80%', background: '#eee', flexShrink: 0 }} />
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, paddingRight: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '0.5px' }}>{clinicaNome}</div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{localSlogan || 'Saúde e Bem-Estar'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
               {mainPhone && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#666' }}>
                    <svg viewBox="0 0 24 24" width="10" height="10" fill={accentColor}><path d={ICON_PATHS.whatsapp}/></svg>
                    <span>{mainPhone}</span>
                 </div>
               )}
               {email && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#666' }}>
                    <svg viewBox="0 0 24 24" width="10" height="10" fill={accentColor}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span>{email.toLowerCase()}</span>
                 </div>
               )}
               {(site || instagram) && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                    {site && <div style={{ fontSize: '9px', color: accentColor, fontWeight: 700 }}>{site.replace('https://','').replace('http://','')}</div>}
                    {instagram && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#333', fontWeight: 700 }}>
                         <svg viewBox="0 0 24 24" width="10" height="10" fill="#333"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                         <span>@{instagram}</span>
                      </div>
                    )}
                 </div>
               )}
            </div>
         </div>
      </div>
      
      <button
        data-assinatura-copy
        onClick={copyToClipboard}
        style={{
          background: copied ? '#4CAF50' : accentColor,
          color: '#fff', 
          border: 'none', 
          borderRadius: '20px', 
          padding: '8px 20px', 
          fontSize: '12px', 
          fontWeight: 700, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d={copied ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" : "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"}/>
        </svg>
        {copied ? 'Copiado!' : 'Copiar Assinatura HTML'}
      </button>
      
      <div style={{ fontSize: '10px', color: '#aaa', textAlign: 'center' }}>
        Dica: Ao copiar o HTML, você pode colá-lo diretamente nas configurações de assinatura do Gmail ou Outlook.
      </div>
    </div>
  );
}

function EnvelopeSacoPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const { endereco, instagram, site, whatsapp, telefone, email } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const abaColor = solidColor; // aba usa cor selecionada
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: abaColor, opacity: 0.9, zIndex: 5 }} />
            {/* Etiqueta com logo — centralizada na área abaixo da aba */}
            <div style={{ position: 'absolute', top: '172px', left: '50%', transform: 'translate(-50%, -50%)', padding: '8px 14px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)', borderRadius: '2px', border: '0.5px solid #ddd', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '50px' }}>
              <LogoPreviewHTML item="Envelope Saco" editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.4} crm={crmLine} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Verso</span>
          <div style={{ width: '220px', height: '300px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: abaColor, zIndex: 5 }} />
            
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
  const abaColor = solidColor; // aba usa cor selecionada
  const allPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* FRENTE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Frente</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba sólida no preview frontal */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: abaColor, opacity: 0.9, zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '120px', height: '45px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <LogoPreviewHTML item="Envelope Ofício" editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.35} crm={crmLine} withBackground={!!effectiveSrc} maxWidth="100%" maxHeight="100%" />
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Verso</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: abaColor, zIndex: 5 }} />
            
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

function PastaPreview({ brand, editData, accentColor, solidColor, logoColor, logoLayout, isSaude, crmData, comBorda, setComBorda, patternSrc, cartaoContacts, crmLine, paletteColors, borderColor, setBorderColor, patternScale, setBorderColorState, patternScaleState, setPatternScaleState, setPatternScale, hideTagline, folderRoof, setFolderRoof, clinicaNome: clinicaNomeProp }) {
  const brandFont = editData?.fontFamily || 'Playfair Display';
  const marca = editData?.marca || '';
  const clinicaNome = clinicaNomeProp || cartaoContacts?.clinica || '';
  const { endereco, instagram, site, whatsapp, telefone, telefone2 } = cartaoContacts;
  const mainPhone = whatsapp || telefone || '';
  const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setFolderRoof && (
        <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
          {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
        </button>
      )}

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
            clipPath: folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }} />
          <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '75px', display:'flex', justifyContent:'center', alignItems: 'center', zIndex: 1 }}>
            <LogoPreviewHTML item="Pasta" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.85} hideTagline={hideTagline} withBackground={comBorda && !!patternSrc} maxWidth="100%" maxHeight="100%" />
          </div>
        </div>

        {/* Linha de Dobra Central */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '240px', width: '0', borderLeft: '1px dashed rgba(0,0,0,0.1)', zIndex: 10 }} />

        {/* Capa Direita (VERSO no preview) */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '240px', height: '310px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
             <div style={{
               background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(5px)',
               margin: '0 10px 18px', padding: '6px 12px', borderRadius: '1.5px',
               display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
               border: '0.1mm solid rgba(0,0,0,0.05)'
             }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', width: '45%', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  <LogoPreviewHTML item="Pasta" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.38} crm={crmLine} hideTagline={hideTagline} alignLeft={true} withBackground={comBorda && !!patternSrc} maxWidth="100%" />
                </div>
                <div style={{ 
                  display: 'flex', flexDirection: 'column', fontSize: '3.8px', color: '#555', 
                  fontFamily: 'Montserrat, sans-serif', lineHeight: 1.5, textAlign: 'right', flex: 1
                }}>
                  {clinicaNome && (
                    <div style={{ fontFamily: brandFont, fontSize: '6px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '1px' }}>{clinicaNome}</div>
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

function PapelariaStep({ brand, accentColor, paletteColors, estampaPatterns, estampaSelectedIdx, cartaoContacts, setCartaoContacts, plano, isSaude, crmData, setCrmData, marca, editData, logoColor, logoLayout, setLayout, clinicaNome, setClinicaNome, onNavSync, navIdx, setNavIdx, customLogoSrc, getCustomLogoScale, setCustomLogoScale, getCustomLogoScaleMax, customLogoScaleMap }) {
  // Digitais: sempre inclusos no plano PRO
  const ITENS_DIGITAIS = []; // Pack Instagram e Assinatura ficam na aba Digital, não na Papelaria
  // Papelaria disponível para não-médicos
  const PAPELARIA_GERAL = [
    "Cartão de Visita", "Papel Timbrado", "Papel de Presente", "Tag para Sacola",
    "Etiqueta para Correios", "Envelope Ofício (23x11,5cm)", "Envelope Saco (24x34cm)", "Recibo",
    "Pasta A4", "Arte para Caneca",
  ];
  // Papelaria exclusiva para área médica
  const PAPELARIA_MEDICA = [
    "Receituário Padrão", "Atestado Médico", "Cartão de Retorno",
    "Receituário de Controle Especial", "Prontuário Médico", "Receita de Alta",
    "Ficha de Cadastro",
  ];
  // Digitais/clínicos médicos: sempre inclusos se isSaude
  const DIGITAIS_MEDICOS = [
    "Guia Alimentar", "Guia de Cuidados", "Guia de Desenvolvimento",
    "Guia de Vacina c/ Calendário", "Cartão de Exame Pré-Natal",
    "Gráfico de Crescimento", "Checklist Maternidade", "Guia do Sono",
    "Orientações p/ Recém Nascidos", "Certificado de Coragem",
    "Diário do Xixi", "Meu Pratinho", "Guia de Amamentação",
  ];
  // Monta lista final: papelaria selecionada no checkout + digitais automáticos
  const papelariaSelecionada = brand?.papelariaSelecionada || [];
  const TODOS_DISPONIVEIS = [...PAPELARIA_GERAL, ...(isSaude ? PAPELARIA_MEDICA : []),
    "Pack Digital para Instagram", "Assinatura de E-mail", ...(isSaude ? DIGITAIS_MEDICOS : [])];
  // Normaliza nomes legados para compatibilidade com dados salvos anteriormente
  const LEGACY_NAMES = { 'Pasta A4 Exclusiva': 'Pasta A4', 'Papel Timbrado': 'Timbrado', 'Arte para Caneca/Brindes': 'Arte para Caneca' };
  const papelariaNorm = papelariaSelecionada.map(n => LEGACY_NAMES[n] || n);
  const itens = papelariaNorm.length > 0
    ? TODOS_DISPONIVEIS.filter(i => papelariaNorm.includes(i))
    : TODOS_DISPONIVEIS;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (onNavSync) onNavSync(itens); }, [itens.join(',')]);
   const [idxLocal, setIdxLocal] = useState(0);
  const idx = (navIdx !== undefined && setNavIdx) ? navIdx : idxLocal;
  const setIdx = (setNavIdx && onNavSync) ? setNavIdx : setIdxLocal;
  const [comBorda, setComBordaState] = useState(true);
  const [patternScale, setPatternScaleState] = useState(100);
  const [borderColor, setBorderColorState] = useState(() => accentColor);
  const [localSlogan, setLocalSlogan] = useState(editData?.tagline || '');
  const [folderRoof, setFolderRoof] = useState(() => brand?.niche?.toLowerCase()?.includes('pedi'));
  const [paperSize, setPaperSize] = useState('a5'); // 'a5' | 'a4'
  const persistPapelaria = (updates) => { try { const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}'); localStorage.setItem('brandbox_papelaria', JSON.stringify({ ...cur, ...updates })); } catch {} };
  const setComBorda = (v) => { setComBordaState(v); persistPapelaria({ comBorda: v }); };
  const setPatternScale = (v) => { setPatternScaleState(v); persistPapelaria({ patternScale: v }); };
  const setBorderColor = (v) => { setBorderColorState(v); persistPapelaria({ borderColor: v }); };
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  // Estado editável do Orientações RN
  const [rnNomeBebe, setRnNomeBebe] = useState('');
  const [rnDataNasc, setRnDataNasc] = useState('');
  const [rnPeso, setRnPeso] = useState('');
  const [rnAltura, setRnAltura] = useState('');
  const [rnUmbigo, setRnUmbigo] = useState('álcool 70%');
  const [rnSoro, setRnSoro] = useState('Rinosoro ou Salsep');
  const [rnMed1, setRnMed1] = useState('Luftal');
  const [rnDose1, setRnDose1] = useState('');
  const [rnInt1, setRnInt1] = useState('8/8h');
  const [rnMed2, setRnMed2] = useState('Tylenol baby');
  const [rnDose2, setRnDose2] = useState('');
  const [rnInt2, setRnInt2] = useState('6/6h');
  const [rnPomada, setRnPomada] = useState('Desitin ou Bepantol');
  const [rnVitDMed, setRnVitDMed] = useState('Baby-D ou Addera D3');
  const [rnVitDDose, setRnVitDDose] = useState('1');
  const [rnBcgData, setRnBcgData] = useState('');
  const [rnHepBData, setRnHepBData] = useState('');
  const [rnConsultaData, setRnConsultaData] = useState('');
  const [rnConsultaHora, setRnConsultaHora] = useState('');
  const [rnUrgencia, setRnUrgencia] = useState('');
  const [etiquetaSizeIdx, setEtiquetaSizeIdx] = useState(0);
  const [tagSacolaSizeIdx, setTagSacolaSizeIdx] = useState(0);
  const [papelPresenteSizeIdx, setPapelPresenteSizeIdx] = useState(1);
  const [fichaAdulto, setFichaAdulto] = useState(false);
  const [cartaoRetrato, setCartaoRetrato] = useState(false);
  const [storyTemplateIdx, setStoryTemplateIdx] = useState(0);
  const [storyFormatIdx, setStoryFormatIdx] = useState(0);

  const [etiquetaFraseIdx, setEtiquetaFraseIdx] = useState(0);
  const [receitaFields, setReceitaFields] = useState({
    med1Nome:'Vitamina D 200UI/gota', med1Qty:'1 vidro', med1Dose:'2',
    med2Nome:'Colidis', med2Qty:'1 vidro', med2Dose:'5 gotas 1 vez ao dia',
    med3Nome:'Tylenol baby 140mg/ml', med3Qty:'1 frasco', med3Dose:'___',
    med4Nome:'Mylicon / Simeticona', med4Qty:'1 frasco', med4Dose:'3',
    top1Nome:'Bepantol baby', top2Nome:'Álcool 70%', top3Nome:'Rinossoro infantil', top4Nome:'Sabonete Johnsons / Cetrilan',
    consulta:'', obsExtra:'',
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}');
      if (saved.comBorda !== undefined) setComBordaState(saved.comBorda);
      if (saved.patternScale) setPatternScaleState(saved.patternScale);
      if (saved.borderColor) setBorderColorState(saved.borderColor);
    } catch {}
  }, []);
  const [contactOpen, setContactOpen] = useState(false);

  const [upsellSelecionados, setUpsellSelecionados] = React.useState([]);
  const [upsellLoading, setUpsellLoading] = React.useState(false);
  const [upsellErro, setUpsellErro] = React.useState('');

  const isProPlan = plano === 'pro' || plano === 'complete';

  const handleUpsellCheckout = async () => {
      if (upsellSelecionados.length === 0) return;
      setUpsellLoading(true);
      setUpsellErro('');
      try {
        const sessionId = localStorage.getItem('brandbox_session') || '';
        const delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
        // Salva itens no localStorage antes de ir pro Stripe
        const existentes = delivery.papelariaSelecionada || [];
        const merged = [...new Set([...existentes, ...upsellSelecionados])];
        delivery.papelariaSelecionada = merged;
        localStorage.setItem('brandbox_delivery', JSON.stringify(delivery));
        localStorage.setItem('brandbox_plano', 'pro');
        localStorage.setItem('brandbox_pending_upsell', JSON.stringify(upsellSelecionados));
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plano: 'avulso',
            marca: delivery.formData?.marca || delivery.editData?.marca || brand?.editData?.marca || '',
            email: delivery.formData?.email || brand?.formData?.email || '',
            sessionId,
            itensSelecionados: upsellSelecionados,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setUpsellErro(data.error || 'Erro ao iniciar pagamento. Tente novamente.');
        }
      } catch (e) {
        console.error(e);
        setUpsellErro('Erro de conexão. Tente novamente.');
      } finally {
        setUpsellLoading(false);
      }
  };

  if (!isProPlan || itens.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0' }}>
        <div style={{ background: '#fff8f0', border: '1px solid #fde8c8', borderRadius: '16px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c87000', fontFamily: 'Montserrat,sans-serif', marginBottom: '4px' }}>📂 Papelaria não inclusa no seu plano</div>
              <div style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.5 }}>
                Selecione os itens que deseja adicionar. Cada item custa <strong style={{ color: '#c87000' }}>R$ 30,00</strong>.
              </div>
            </div>
            <button onClick={() => {
              const todos = isSaude ? [...PAPELARIA_GERAL, ...PAPELARIA_MEDICA, ...DIGITAIS_MEDICOS] : PAPELARIA_GERAL;
              const tudo = upsellSelecionados.length === todos.length;
              setUpsellSelecionados(tudo ? [] : [...todos]);
            }} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: '20px', border: `1.5px solid #c87000`, background: 'transparent', color: '#c87000', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {upsellSelecionados.length === (isSaude ? PAPELARIA_GERAL.length + PAPELARIA_MEDICA.length + DIGITAIS_MEDICOS.length : PAPELARIA_GERAL.length) ? 'Desmarcar todos' : 'Marcar todos'}
            </button>
          </div>
        </div>

        {/* Grupo: Papelaria Geral */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '8px' }}>
            📄 Papelaria
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PAPELARIA_GERAL.map(item => {
              const sel = upsellSelecionados.includes(item);
              return (
                <label key={item} onClick={() => setUpsellSelecionados(sel ? upsellSelecionados.filter(i => i !== item) : [...upsellSelecionados, item])}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', border: `1.5px solid ${sel ? accentColor : '#eee'}`, background: sel ? `${accentColor}08` : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '5px', border: `2px solid ${sel ? accentColor : '#ddd'}`, background: sel ? accentColor : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {sel && <svg viewBox="0 0 12 12" width="10" height="10"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: sel ? 700 : 500, color: sel ? '#333' : '#666', fontFamily: 'Montserrat,sans-serif', flex: 1 }}>{item}</span>
                  <span style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif' }}>R$ 30</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Grupo: Papelaria Médica — só se isSaude */}
        {isSaude && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '8px' }}>
              🩺 Papelaria Clínica
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PAPELARIA_MEDICA.map(item => {
                const sel = upsellSelecionados.includes(item);
                return (
                  <label key={item} onClick={() => setUpsellSelecionados(sel ? upsellSelecionados.filter(i => i !== item) : [...upsellSelecionados, item])}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', border: `1.5px solid ${sel ? accentColor : '#eee'}`, background: sel ? `${accentColor}08` : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '5px', border: `2px solid ${sel ? accentColor : '#ddd'}`, background: sel ? accentColor : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {sel && <svg viewBox="0 0 12 12" width="10" height="10"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: sel ? 700 : 500, color: sel ? '#333' : '#666', fontFamily: 'Montserrat,sans-serif', flex: 1 }}>{item}</span>
                    <span style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif' }}>R$ 30</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Grupo: Guias e Digitais Clínicos — só se isSaude */}
        {isSaude && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '8px' }}>
              📋 Guias e Papelaria Pediátrica
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {DIGITAIS_MEDICOS.map(item => {
                const sel = upsellSelecionados.includes(item);
                return (
                  <label key={item} onClick={() => setUpsellSelecionados(sel ? upsellSelecionados.filter(i => i !== item) : [...upsellSelecionados, item])}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', border: `1.5px solid ${sel ? accentColor : '#eee'}`, background: sel ? `${accentColor}08` : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '5px', border: `2px solid ${sel ? accentColor : '#ddd'}`, background: sel ? accentColor : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {sel && <svg viewBox="0 0 12 12" width="10" height="10"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: sel ? 700 : 500, color: sel ? '#333' : '#666', fontFamily: 'Montserrat,sans-serif', flex: 1 }}>{item}</span>
                    <span style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif' }}>R$ 30</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {upsellSelecionados.length > 0 && (
          <div style={{ position: 'sticky', bottom: '16px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#999', fontFamily: 'Montserrat,sans-serif' }}>{upsellSelecionados.length} iten{upsellSelecionados.length > 1 ? 's' : ''} selecionado{upsellSelecionados.length > 1 ? 's' : ''}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#333', fontFamily: 'Montserrat,sans-serif' }}>R$ {total.toFixed(2).replace('.', ',')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {upsellErro && <div style={{ fontSize: '0.7rem', color: '#e55', fontFamily: 'Montserrat,sans-serif' }}>{upsellErro}</div>}
            <button onClick={handleUpsellCheckout} disabled={upsellLoading}
              style={{ padding: '12px 24px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Montserrat,sans-serif', cursor: upsellLoading ? 'wait' : 'pointer', opacity: upsellLoading ? 0.7 : 1 }}>
              {upsellLoading ? 'Aguarde...' : 'Ir para pagamento →'}
            </button>
          </div>
          </div>
        )}
      </div>
    );
  }

  const currentIdx = estampaSelectedIdx || 0;
  const currentItem = itens[Math.min(idx, itens.length - 1)];
  // editData com scale correto para o item atual (sobrescreve customLogoScale)
  // Inclui customLogoScale só se o usuário mudou o valor (diferente do default)
  const _rawScale = customLogoScaleMap?.[currentItem]; // undefined se nunca tocou
  const itemEditData = (_rawScale !== undefined && getCustomLogoScale)
    ? { ...editData, customLogoScale: getCustomLogoScale(currentItem) * (ITEM_CUSTOM_BASE_SCALES[currentItem] || 1) }
    : editData;
  const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;
  const isScript = editData?.fontStyle === 'script';
  const crmLine = isSaude && crmData?.crm
    ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe?.length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / RQE ') : ''}`
    : null;

  const ITEM_SIZES = {
    'Cartão de Visita': '9x4,8cm', 'Cartão de Retorno': '9x4,8cm',
    'Receituário': 'A5', 'Receita de Alta': 'A4',
    'Atestado Médico': 'A5-ouA4', 'Recibo': 'A5',
    'Certificado de Coragem': 'A5-Horizontal',
    'Papel Timbrado': 'A4', 'Prontuário Médico': 'A4',
    'Checklist Maternidade': 'A4', 'Ficha de Cadastro': 'A4',
    'Guia Alimentar': 'FolderA5-6pag', 'Guia de Cuidados': 'FolderA5-6pag',
    'Guia de Desenvolvimento': 'FolderA5-6pag', 'Guia de Vacina': 'FolderA5-6pag',
    'Gráfico de Crescimento': 'A4-4pag', 'Guia do Sono': 'FolderA5-6pag',
    'Guia de Amamentação': 'FolderDL-8pag', 'Orientação': 'A4',
    'Pré-Natal': 'FolderA5-4pag',
    'Diário do Xixi': 'A4-Horizontal', 'Meu Pratinho': 'A4-Horizontal',
    'Pasta': '22x31cm', 'Envelope Ofício (23x11,5cm)': '23x11,5cm', 'Envelope Saco (24x34cm)': '24x34cm', 'Envelope Ofício': '23x11,5cm', 'Envelope Saco': '24x34cm',
    'Arte para Caneca': '20x8cm',
    'Papel de Presente': '65x95cm', 'Tag para Sacola': 'tag',
    'Etiqueta para Correios': '10x15cm',
  };
  const pdfTitle = (item) => {
    const sizeKey = Object.keys(ITEM_SIZES).find(k => item.includes(k));
    const size = sizeKey ? ITEM_SIZES[sizeKey] : null;
    const slug = marca ? marca.replace(/\s+/g, '_') : 'marca';
    return size ? `${item}_${size}_${slug}` : `${item}_${slug}`;
  };

  const openGabarito = async (item) => {
    const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;

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

    const _isScript = editData?.fontStyle === 'script';
    const _boost = editData?.fontSizeBoost || 1;
    const _words = marca.split(' ').map(w => _isScript ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase());
    let _lines, _basePt;
    if (logoLayout === 'horizontal') { _lines = [_words.join(' ')]; _basePt = marca.length > 18 ? 10 : marca.length > 12 ? 14 : marca.length > 8 ? 18 : 22; }
    else if (logoLayout === 'balanced' && _words.length >= 3) { const m = Math.ceil(_words.length / 2); _lines = [_words.slice(0, m).join(' '), _words.slice(m).join(' ')]; _basePt = marca.length > 15 ? 16 : 21; }
    else { _lines = _words; _basePt = _words.length >= 3 ? (marca.length > 15 ? 14 : 17) : _words.length === 2 ? 22 : 29; }
    const _fontPt = (_basePt * _boost).toFixed(1);
    const _lineH = editData?.fontLineHeight || (_isScript ? 0.9 : 1.1);
    const _letterSp = editData?.fontLetterSpacing || (_isScript ? '0pt' : '1px');
    const _brandFont = `'${editData?.fontFamily || 'Playfair Display'}', serif`;
    const { endereco, whatsapp, telefone, telefone2, instagram, email, site } = cartaoContacts;
    const mainPhone = whatsapp || telefone || '';
    const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

    const crmLine = isSaude && crmData.crm
      ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe?.length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / RQE ') : ''}`
      : null;
    
    const localSlogan = editData?.tagline || brand.editData?.tagline || '';
    
    const _psLower = (paperSize || '').toLowerCase();
    const _isA4Global = _psLower.includes('a4') || ['Receita de Alta', 'Timbrado', 'Diário', 'Ficha', 'Cadastro', 'Prontuário', 'Checklist', 'Orientação'].some(n => item.includes(n));
    const _globalBoost = (['Receituário', 'Recibo', 'Ficha', 'Prontuário', 'Certificado', 'Atestado'].some(n => item.includes(n)) || _isA4Global) ? 1.5 : 1.0;
    const _logoWidthMmGlobal = logoLayout === 'horizontal' ? Math.round(65 * 1.2) : 65;
    
    const logoHtmlWithCrm = genPDFLogoHtml({ 
      brand, 
      editDataOverride: editData, 
      color: logoColor, 
      layout: logoLayout, 
      localSlogan, 
      crmLine, 
      fontPt: (parseFloat(_fontPt) * _globalBoost).toFixed(1), 
      lineH: _lineH, 
      letterSp: _letterSp, 
      customLogoSrc, 
      customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
      maxWidth: `${_logoWidthMmGlobal}mm`, 
      maxHeight: _isA4Global ? '64mm' : '32mm' 
    });
    const logoHtml = logoHtmlWithCrm;

    // Determinar componentes
    const isDev = item.includes('Desenvolvimento');
    const isVacina = item.includes('Vacina');
    const isSono = item.includes('Sono');
    const isCuidados = item.includes('Cuidados');
    const Art2 = isVacina ? FolderVacinaPage2 : (isDev ? FolderDevPage2 : (isSono ? FolderSonoPage2 : (isCuidados ? FolderCuidadosPage2 : FolderPage2Art)));
    const Art3 = isVacina ? FolderVacinaPage3 : (isDev ? FolderDevPage3 : (isSono ? FolderSonoPage3 : (isCuidados ? FolderCuidadosPage3 : FolderPage3Art)));
    const Art4 = isVacina ? FolderVacinaPage4 : (isDev ? FolderDevPage4 : (isSono ? FolderSonoPage4 : (isCuidados ? FolderCuidadosPage4 : FolderPage4Art)));
    const Art5 = isVacina ? FolderVacinaPage5 : (isDev ? FolderDevPage5 : (isSono ? FolderSonoPage5 : (isCuidados ? FolderCuidadosPage5 : FolderPage5Art)));
    const Art6 = isVacina ? FolderVacinaPage6 : null;
    const Art1 = isVacina ? FolderVacinaPage1 : null;

    // ── GRÁFICO DE CRESCIMENTO ──────────────────────────────────────
    if (item === 'Gráfico de Crescimento') {
      const _ffG = brand.editData?.fontFamily || 'Playfair Display';
      const _lfG = LOCAL_FONT_FACES[_ffG];
      const fiG = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">`;

      const renderChartSVG = (data, months, yMin, yMax, yStep, xLabel, title, gColor, W = 700, H = 310) => {
        const PAD = { top: 22, right: 40, bottom: 46, left: 46 };
        const CW = W - PAD.left - PAD.right, CH = H - PAD.top - PAD.bottom;
        const xMax = 60;
        const toX = m => PAD.left + (m / xMax) * CW;
        const toY = v => PAD.top + CH - ((v - yMin) / (yMax - yMin)) * CH;
        const years = [0, 12, 24, 36, 48, 60];
        const yearLabels = ['Nasc.', '1 ano', '2 anos', '3 anos', '4 anos', '5 anos'];
        const minorX = Array.from({ length: 31 }, (_, i) => i * 2);
        const yTicks = [];
        for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);
        const tension = 0.4;
        const smooth = (pts) => {
          if (pts.length < 2) return '';
          let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
          for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i-1,0)], p1 = pts[i], p2 = pts[i+1], p3 = pts[Math.min(i+2,pts.length-1)];
            const cp1x = p1[0]+(p2[0]-p0[0])*tension, cp1y = p1[1]+(p2[1]-p0[1])*tension;
            const cp2x = p2[0]-(p3[0]-p1[0])*tension, cp2y = p2[1]-(p3[1]-p1[1])*tension;
            d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
          }
          return d;
        };
        const curves = [
          { key: 'Z+3', color: '#555', dash: '', label: '3', sw: 1.2 },
          { key: 'Z+2', color: '#e05c5c', dash: '', label: '2', sw: 1.0 },
          { key: 'Z0',  color: '#3a8a5c', dash: '', label: '0', sw: 1.4 },
          { key: 'Z-2', color: '#e05c5c', dash: '5,4', label: '-2', sw: 1.0 },
          { key: 'Z-3', color: '#555', dash: '5,4', label: '-3', sw: 1.2 },
        ];
        const paths = curves.map(c => {
          if (!data[c.key]) return '';
          const pts = months.map((m, i) => [toX(m), toY(data[c.key][i])]);
          const lastY = toY(data[c.key][data[c.key].length - 1]);
          return `<path d="${smooth(pts)}" fill="none" stroke="${c.color}" stroke-width="${c.sw}" stroke-dasharray="${c.dash}" stroke-linecap="round"/>
                  <text x="${PAD.left+CW+6}" y="${lastY+3}" font-size="9" fill="${c.color}" font-weight="${c.key==='Z0'?'700':'400'}" font-family="Montserrat,sans-serif">${c.label}</text>`;
        }).join('');
        const gridV = minorX.map(m => `<line x1="${toX(m)}" y1="${PAD.top}" x2="${toX(m)}" y2="${PAD.top+CH}" stroke="${years.includes(m)?'#bbb':'#ebebeb'}" stroke-width="${years.includes(m)?'1':'0.5'}"/>`).join('');
        const gridH = yTicks.map(v => `<line x1="${PAD.left}" y1="${toY(v)}" x2="${PAD.left+CW}" y2="${toY(v)}" stroke="${v%(yStep*2)===0?'#ddd':'#f2f2f2'}" stroke-width="0.6"/>`).join('');
        const yLabels = yTicks.filter((_, i) => i % 2 === 0).map(v => `<text x="${PAD.left-4}" y="${toY(v)+3}" text-anchor="end" font-size="8" fill="#999" font-family="Montserrat,sans-serif">${v}</text>`).join('');
        const xLabels = years.map((m, i) => `<text x="${toX(m)}" y="${PAD.top+CH+14}" text-anchor="middle" font-size="8" fill="#777" font-family="Montserrat,sans-serif">${yearLabels[i]}</text>`).join('');
        const minorLabels = minorX.filter(m => !years.includes(m) && m % 6 === 0).map(m => `<text x="${toX(m)}" y="${PAD.top+CH+8}" text-anchor="middle" font-size="6" fill="#bbb" font-family="Montserrat,sans-serif">${m%12}</text>`).join('');
        return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <rect x="${PAD.left}" y="${PAD.top}" width="${CW}" height="${CH}" fill="#fff" stroke="#ccc" stroke-width="0.8"/>
          ${gridV}${gridH}${yLabels}${xLabels}${minorLabels}${paths}
          <text transform="translate(${PAD.left-30},${PAD.top+CH/2}) rotate(-90)" text-anchor="middle" font-size="9" fill="${gColor}" font-weight="700" font-family="Montserrat,sans-serif">${xLabel}</text>
          <text x="${PAD.left}" y="${PAD.top-6}" font-size="10" fill="${gColor}" font-weight="800" font-family="Montserrat,sans-serif">${title.toUpperCase()}</text>
          <text x="${PAD.left+4}" y="${PAD.top+CH-4}" font-size="7" fill="#bbb" font-family="Montserrat,sans-serif">Z-scores: -3, -2, 0, +2, +3</text>
        </svg>`;
      };

      const renderPage = (gender, face) => {
        const d = WHO[gender];
        const gColor = gender === 'menina' ? '#c8699a' : '#4a8bb5';
        const gLabel = gender === 'menina' ? 'MENINA' : 'MENINO';
        const faceLabel = face === 'frente' ? 'IMC · Perímetro Cefálico' : 'Peso · Altura';
        const fieldLine = (lbl, w='40mm') => `<div style="display:flex;align-items:flex-end;gap:2mm;"><span style="font-size:7pt;font-weight:700;color:rgba(255,255,255,0.75);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.3pt;white-space:nowrap;">${lbl}:</span><div style="border-bottom:0.3mm solid rgba(255,255,255,0.5);width:${w};height:4.5mm;"></div></div>`;
        const chart1 = face === 'frente'
          ? renderChartSVG(d.imc, MONTHS, 10, 22, 1, 'IMC', 'IMC por Idade', gColor)
          : renderChartSVG(d.peso, MONTHS, 0, 30, 2, 'Peso (kg)', 'Peso por Idade', gColor);
        const chart2 = face === 'frente'
          ? renderChartSVG(d.pc, PC_MONTHS, 30, 58, 2, 'PC (cm)', 'Perímetro Cefálico', gColor)
          : renderChartSVG(d.altura, MONTHS, 40, 130, 5, 'Altura (cm)', 'Altura por Idade', gColor);

        const borderBg = comBorda && patternSrc
          ? `background-image:url(${patternSrc});background-size:${(patternScale*0.83).toFixed(1)}mm;background-repeat:repeat;`
          : `background:${borderColor || paletteColors[0] || accentColor};`;
        const BLEED = 6;

        const B = 3; // sangria 3mm
        return `
        <div class="page" style="position:relative;">
          <!-- Marcas de corte apontando para fora -->
          <div style="position:absolute;top:${B}mm;left:0;width:2.5mm;height:0.2mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;top:0;left:${B}mm;width:0.2mm;height:2.5mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;top:${B}mm;right:0;width:2.5mm;height:0.2mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;top:0;right:${B}mm;width:0.2mm;height:2.5mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;bottom:${B}mm;left:0;width:2.5mm;height:0.2mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;bottom:0;left:${B}mm;width:0.2mm;height:2.5mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;bottom:${B}mm;right:0;width:2.5mm;height:0.2mm;background:#000;z-index:100;"></div>
          <div style="position:absolute;bottom:0;right:${B}mm;width:0.2mm;height:2.5mm;background:#000;z-index:100;"></div>
          <!-- Borda/Estampa — preenche incluindo sangria -->
          <div style="position:absolute;inset:0;${borderBg}"></div>
          <!-- Conteúdo interno: inset 3mm (sangria) + BLEED (borda colorida) -->
          <div style="position:absolute;top:${B+BLEED}mm;left:${B+BLEED}mm;right:${B+BLEED}mm;bottom:${B+BLEED}mm;display:flex;flex-direction:column;overflow:hidden;background:#fff;">
          <!-- Cabeçalho / Capa -->
          <div style="background:${gColor};padding:5mm 7mm 4mm;display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4mm;">
              <div>
                <div style="font-size:8pt;font-weight:600;color:rgba(255,255,255,0.8);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.5pt;margin-bottom:1.5mm;">Gráfico de Crescimento — ${faceLabel}</div>
                <div style="font-size:26pt;font-weight:900;color:#fff;font-family:'Montserrat',sans-serif;letter-spacing:2pt;line-height:1;">${gLabel}</div>
                <div style="font-size:6pt;color:rgba(255,255,255,0.6);font-family:'Montserrat',sans-serif;margin-top:1.5mm;">Fonte: OMS — WHO Child Growth Standards 2006 · SBP</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11pt;font-weight:900;color:#fff;font-family:'Montserrat',sans-serif;line-height:1.2;">${clinicaNome || marca}</div>
                ${crmLine ? `<div style="font-size:7pt;color:rgba(255,255,255,0.7);font-family:'Montserrat',sans-serif;">${crmLine}</div>` : ''}
                ${mainPhone ? `<div style="font-size:7pt;color:rgba(255,255,255,0.65);font-family:'Montserrat',sans-serif;">${mainPhone}</div>` : ''}
              </div>
            </div>
            <!-- Linha de dobra + campos -->
            <div style="border-top:0.4mm dashed rgba(255,255,255,0.4);padding-top:4mm;">
              <div style="font-size:7pt;font-weight:700;color:rgba(255,255,255,0.65);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.5pt;margin-bottom:3mm;">✎ Dados da consulta</div>
              <div style="display:flex;gap:6mm;flex-wrap:wrap;margin-bottom:3mm;">
                ${fieldLine('Paciente', '60mm')}
                ${fieldLine('Idade', '22mm')}
                ${fieldLine('Data', '30mm')}
              </div>
              <div style="display:flex;gap:6mm;flex-wrap:wrap;">
                ${fieldLine('Peso', '20mm')}
                ${fieldLine('Altura', '20mm')}
                ${fieldLine('PC', '20mm')}
                ${fieldLine('IMC', '20mm')}
                ${fieldLine('Percentil', '28mm')}
              </div>
            </div>
          </div>
          <!-- Gráficos -->
          <div style="flex:1;display:flex;flex-direction:column;gap:0;padding:2mm 3mm 2mm;background:#fff;">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;">${chart1}</div>
            <div style="height:0.3mm;background:#e0e0e0;margin:1mm 0;"></div>
            <div style="flex:1;display:flex;align-items:center;justify-content:center;">${chart2}</div>
          </div>
          </div>
        </div>`;
      };

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Gráfico de Crescimento - ${marca}</title>${fiG}
<style>
* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { font-family:'Montserrat',sans-serif; background:#fff; }
.page { width:216mm; height:303mm; position:relative; overflow:hidden; background:#fff; page-break-after:always; }
@media print { body{margin:0;} @page{size:216mm 303mm;margin:0;} .page{page-break-after:always;} }
</style></head><body>
${renderPage('menina','frente')}
${renderPage('menina','verso')}
${renderPage('menino','frente')}
${renderPage('menino','verso')}
</body></html>`;

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:216mm;height:303mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const prevT = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
          document.title = pdfTitle('Gráfico de Crescimento');
          iframe.contentWindow.focus(); iframe.contentWindow.print();
          setTimeout(() => { document.title = prevT; iframe.remove(); }, 4000);
        }, 2000);
      });
      return;
    }

    // ── ORIENTAÇÕES RECÉM NASCIDO ──────────────────────────────────
    if (item === 'Orientações p/ Recém Nascidos') {
      const _ffRN = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfRN = LOCAL_FONT_FACES[_ffRN];
      const fiRN = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfRN ? `<style>${_lfRN}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffRN.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const c0rn = ensureLegibleColor(paletteColors[0] || accentColor);
      const c1rn = ensureLegibleColor(paletteColors[1] || accentColor);
      const c2rn = ensureLegibleColor(paletteColors[2] || paletteColors[0] || accentColor);
      const c3rn = ensureLegibleColor(paletteColors[3] || paletteColors[1] || accentColor);
      const solidColor = borderColor || paletteColors[0] || accentColor;
      const BORDER_RN = 12; // Sempre tem borda (ou Estampa ou Sólida)
      const BLEED = 3;

      const f = (v, placeholder='') => v ? `<span style="color:#222;">${v}</span>` : `<span style="border-bottom:0.3mm solid ${c0rn}88;display:inline-block;min-width:12mm;color:#aaa;font-style:italic;">${placeholder}</span>`;
      
      const lbl = (text, color) => {
        const legible = ensureLegibleColor(color);
        return `<span style="display:inline-block;background:${legible}15;border:0.25mm solid ${legible}40;border-radius:4mm;padding:0.8mm 3.5mm;font-weight:800;font-style:italic;color:${legible};font-size:9pt;margin-bottom:1mm;">${text}</span>`;
      };

      const sec = (label, color, content) => `<div style="margin-bottom:6mm;"><div>${lbl(label,color)}</div><div style="font-size:9pt;color:#444;line-height:1.5;margin-top:1.5mm;font-weight:500;">${content}</div></div>`;
      const bul = (text) => `<div style="display:flex;gap:1.5mm;margin-bottom:1.2mm;"><span style="color:${c0rn};font-weight:900;">•</span><span style="font-size:7.5pt;color:#444;line-height:1.4;">${text}</span></div>`;
      const logoHtmlRN = genPDFLogoHtml({ brand, editDataOverride: editData, color: '#fff', localSlogan, crmLine, fontPt: 18, lineH: 1.1, letterSp: editData?.fontLetterSpacing || brand.editData?.fontLetterSpacing || '0.5pt', layout: logoLayout, hideSlogan: true, crmSize: '0', customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '60mm', maxHeight: '25mm', withBackground: comBorda && patternSrc });

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Orientações RN - ${marca}</title>${fiRN}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { font-family:'Montserrat',sans-serif; background:#fff; }
.page { width:${210 + BLEED*2}mm; height:${297 + BLEED*2}mm; position:relative; overflow:hidden; background:#fff; display:flex; flex-direction:column; }
@media print { body { margin:0; } @page { size: ${210 + BLEED*2}mm ${297 + BLEED*2}mm; margin:0; } }
</style></head><body>
<div class="page" style="position:relative;">
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <!-- BACKGROUND / BORDER -->
  ${comBorda && patternSrc 
    ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale*0.4).toFixed(1)}mm;background-repeat:repeat;"></div>`
    : `<div style="position:absolute;inset:0;background:${solidColor};"></div>`}
  
  <div style="position:absolute;top:${BLEED + BORDER_RN}mm;left:${BLEED + BORDER_RN}mm;right:${BLEED + BORDER_RN}mm;bottom:${BLEED + BORDER_RN}mm;background:#fff;display:flex;flex-direction:column;overflow:hidden;">
    <!-- HEADER -->
    <div style="background:${c0rn};padding:6mm 10mm;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
      <div style="font-size:14pt;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.5pt;line-height:1.2;">OS PRIMEIROS DIAS<br/>COM MEU BEBÊ</div>
      <div style="zoom:1.1;">${logoHtmlRN}</div>
    </div>

    <!-- FAIXA BEBÊ -->
    <div style="background:${c0rn}12;border-bottom:0.3mm solid ${c0rn}30;padding:3.5mm 10mm;display:flex;gap:8mm;align-items:center;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:2mm;flex:2;"><span style="font-size:8pt;font-weight:700;color:${c0rn};white-space:nowrap;">Bebê:</span> ${f(rnNomeBebe,'nome do bebê')}</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${c0rn};white-space:nowrap;">Nasc:</span> ${f(rnDataNasc,'__/__/____')}</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${c0rn};">Peso:</span> ${f(rnPeso,'___')} kg</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${c0rn};">Alt:</span> ${f(rnAltura,'___')} cm</div>
    </div>

    <!-- CORPO -->
    <div style="flex:1;display:flex;overflow:hidden;align-items:center;">
      <div style="flex:0 0 47%;padding:8mm 5mm 6mm 10mm;border-right:0.3mm solid ${c0rn}20;display:flex;flex-direction:column;justify-content:center;">
        ${sec('Alimentação:', c0rn, 'Aleitamento materno sob livre demanda (à vontade).')}
        ${sec('Umbigo:', c1rn, `Limpeza com ${f(rnUmbigo,'álcool 70%')} a cada troca de fralda e após o banho.`)}
        ${sec('Icterícia:', c2rn, 'Pele amarelada? Procure o pediatra imediatamente.')}
        ${sec('Febre:', c3rn, 'Menores de 3 meses: emergência. Maiores de 3 meses: siga as orientações médicas.')}
        ${sec('Higiene:', c0rn, '1 banho/dia com sabonete neutro. Sem talco ou perfume. Trocas com água morna e algodão.')}
      </div>
      <div style="flex:1;padding:8mm 10mm 6mm 5mm;display:flex;flex-direction:column;justify-content:center;">
        ${sec('Nariz:', c1rn, `Spray de soro 0,9% (${f(rnSoro,'Rinosoro ou Salsep')}) antes de cada mamada.`)}
        ${sec('Cólicas:', c2rn, `Compressa morna. Se necessário: ${f(rnMed1,'Luftal')} ${f(rnDose1,'__')} gts ${f(rnInt1,'8/8h')}. Sem melhora: ${f(rnMed2,'Tylenol baby')} ${f(rnDose2,'__')} gts ${f(rnInt2,'6/6h')}.`)}
        ${sec('Assaduras:', c3rn, `Secar bem antes de aplicar (${f(rnPomada,'Desitin ou Bepantol')}).`)}
        ${sec('Vitamina D:', c0rn, `${f(rnVitDMed,'Baby-D ou Addera D3')} — ${f(rnVitDDose,'1')} gota/dia desde o nascimento.`)}
      </div>
    </div>

    <!-- VACINAS + CONSULTA -->
    <div style="border-top:0.3mm solid ${c0rn}25;padding:4mm 10mm;display:flex;gap:10mm;align-items:center;flex-shrink:0;background:${c1rn}0a;">
      <div style="flex:1;">
        <div style="font-size:8pt;font-weight:800;color:${c1rn};text-transform:uppercase;margin-bottom:2mm;">Vacinas na maternidade</div>
        <div style="display:flex;gap:10mm;">
          <div style="font-size:8pt;color:#555;display:flex;align-items:center;gap:2mm;">BCG: ${f(rnBcgData,'data')}</div>
          <div style="font-size:8pt;color:#555;display:flex;align-items:center;gap:2mm;">Hepatite B: ${f(rnHepBData,'data')}</div>
        </div>
      </div>
      <div style="flex:1;background:${c2rn}18;border-radius:2.5mm;padding:3mm 5mm;border:0.2mm solid ${c2rn}40;">
        <div style="font-size:8pt;font-weight:800;color:${c2rn};text-transform:uppercase;margin-bottom:2mm;">📅 Próxima consulta</div>
        <div style="font-size:8.5pt;color:#444;display:flex;gap:4mm;align-items:center;">${f(rnConsultaData,'dd/mm/aaaa')} às ${f(rnConsultaHora,'00h00')}</div>
      </div>
    </div>

    <!-- OBSERVAÇÕES -->
    <div style="border-top:0.3mm solid ${c0rn}25;padding:4mm 10mm;flex-shrink:0;background:${c0rn}08;">
      <div style="font-size:9pt;font-weight:900;color:${c0rn};font-style:italic;margin-bottom:2.5mm;">Observações:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12mm;">
        <div>
          ${bul('Consulta entre 7 e 14 dias de vida.')}
          ${bul('Levar ao Posto de Saúde para vacinação.')}
          ${bul('Teste do Pezinho entre o 3º e 7º dia.')}
          ${bul('Teste da Orelhinha o quanto antes.')}
        </div>
        <div>
          ${bul('Dormir sempre de barriga para cima.')}
          ${bul('Sem travesseiros ou cobertores pesados.')}
          ${bul('Roupas leves no bebê.')}
          ${bul('Sólidos só após os 6 meses com orientação.')}
        </div>
      </div>
    </div>

    <!-- RODAPÉ -->
    <div style="border-top:0.3mm solid ${c0rn}30;padding:3.5mm 10mm;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div>
        <div style="font-size:8.5pt;font-weight:800;color:${c0rn};text-transform:uppercase;">${clinicaNome || marca}</div>
        <div style="font-size:7pt;color:#888;">Urgências: ${f(rnUrgencia, mainPhone || 'telefone')}</div>
      </div>
      <div style="font-size:6.5pt;color:#aaa;text-align:right;">${[mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>
    </div>
  </div>
</div>
</body></html>`;

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const prevT = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle('Orientações RN'); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1500); });
      return;
    }

    // ── PASTA ──────────────────────────────────────────────────────
    if (item.includes('Pasta')) {
      const BLEED = 5;
      const _ffP = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfP = LOCAL_FONT_FACES[_ffP];
      const fiP = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfP ? `<style>${_lfP}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffP)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const genBgP = () => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.83).toFixed(1)}mm;opacity:1;"></div>`
        : `<div style="position:absolute;inset:0;background:${borderColor || accentColor};"></div>`;

      const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');

      // Barra de Dados no Verso (Capa Esquerda no GABARITO TÉCNICO)
      const _footerP = `
        <div style="background:rgba(255,255,255,0.92);backdrop-filter:blur(3mm);padding:6mm 10mm;margin:0 10mm 8mm;border-radius:1.5mm;display:flex;align-items:center;justify-content:space-between;border:0.1mm solid rgba(0,0,0,0.1);font-family:'Montserrat',sans-serif;width:220mm;min-height:38mm;">
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:48%;overflow:visible;">
               ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine: null, fontPt: (parseFloat(_fontPt) * 1.8).toFixed(1), lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '95mm', maxHeight: '42mm', withBackground: comBorda && patternSrc })}
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
body { width: 485.775mm; height: 385.233mm; position: relative; overflow: hidden; background: #fff; }
.page { width: 485.775mm; height: 385.233mm; position: relative; overflow: hidden; }
.fold { position: absolute; opacity: 0.3; pointer-events: none; border-color: #000; }
.fold-v { top: 0; bottom: 0; left: 242.888mm; border-left: 0.1mm dashed; height: 100%; }
.fold-h { left: 0; right: 0; bottom: 75mm; border-top: 0.1mm dashed; width: 100%; }
@media print { body { margin:0; } @page { size: 485.775mm 385.233mm; margin: 0; } }
</style></head><body>
<div class="page">
    ${genBgP()}
    
    <!-- Capa Direita (Frente Técnica) -->
    <div style="position:absolute;top:0;right:0;width:242.888mm;height:310mm;">
        <div style="position:absolute;bottom:12mm;left:10mm;right:10mm;top:30mm;background:#fff;border-radius:2mm;${folderRoof ? 'clip-path:polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%);' : ''}"></div>
        <div style="position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);width:190mm;height:80mm;display:flex;align-items:center;justify-content:center;">
            <div style="zoom:3.78;">${ReactDOMServer.renderToString(<LogoPreviewHTML item="Folder de Vacinação" editData={itemEditData} color={logoColor} layout={logoLayout||'stacked'} scaleFactor={0.85} hideTagline={false} maxWidth="100%" maxHeight="100%" />)}</div>
        </div>
    </div>

    <!-- Capa Esquerda (Verso Técnico) -->
    <div style="position:absolute;top:0;left:0;width:242.888mm;height:310mm;display:flex;flex-direction:column;justify-content:flex-end;">
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
      const _ffR = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfR = LOCAL_FONT_FACES[_ffR];
      const fiR = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfR ? `<style>${_lfR}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffR)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
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

      const logoHtmlR = genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 0.5).toFixed(1), lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '48mm', maxHeight: '12mm', withBackground: comBorda && patternSrc });

      const frenteR = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${genBg(4)}
          <div style="position:absolute;top:${BLEED + 4}mm;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 4}mm;display:flex;flex-direction:column;align-items:center;padding:4mm 3mm;">
            <div style="margin-bottom:4mm;display:flex;flex-direction:column;align-items:center;width:100%">${logoHtmlR}</div>
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
.cm-tl { top: ${BLEED}mm; left: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-tr { top: ${BLEED}mm; right: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
.cm-bl { bottom: ${BLEED}mm; left: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-br { bottom: ${BLEED}mm; right: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
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
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle('Cartão de Retorno'); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 400); });
      return;
    }

    // ── CARTÃO DE VISITA ────────────────────────────────────────────
    if (item === 'Cartão de Visita') {
      const BLEED = 3;
      const _isRetrato = cartaoRetrato;
      const _cW = _isRetrato ? '61mm' : '96mm';
      const _cH = _isRetrato ? '96mm' : '61mm';
      const _fontFamily = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _localFace = LOCAL_FONT_FACES[_fontFamily];
      const fontImports = `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
        ${_localFace
          ? `<style>${_localFace}</style>`
          : `<link href="https://fonts.googleapis.com/css2?family=${_fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">`
        }
      `;

      const frenteBgHtml = comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.22).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>`
        : `<div style="position:absolute;inset:0;background:#fff;"></div>`;

      const _logoW = logoLayout === 'horizontal' ? '65%' : '50%';
      const _availW = (_isRetrato ? 61 : 96) * (logoLayout === 'horizontal' ? 0.65 : 0.50) - 8;
      const _availH = (_isRetrato ? 96 : 61) * (_isRetrato ? 0.40 : 0.50) - 5;
      const frenteHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${frenteBgHtml}
          <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            <div style="padding:2.5mm 4mm; width:${_logoW}; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden;">
              <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
                ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: `${_availW}mm`, maxHeight: `${_availH}mm`, withBackground: comBorda && !!patternSrc })}
              </div>
            </div>
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const _waIconSvg = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:2pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      const _igIconSvg = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:2pt;"><defs><linearGradient id="igG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f09433"/><stop offset="50%" stop-color="#dc2743"/><stop offset="100%" stop-color="#bc1888"/></linearGradient></defs><path fill="url(#igG)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
      
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

      const _bc = borderColor || accentColor;
      const versoBgHtml = comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.22).toFixed(1)}mm;background-repeat:repeat;"></div>`
        : `<div style="position:absolute;inset:0;background:${_bc};"></div>`;

      const versoHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${versoBgHtml}
          <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            <div style="background:rgba(255,255,255,0.93);padding:${_isRetrato ? '2.5mm 4mm' : '3mm 5mm'};border-radius:1.5mm;width:${_isRetrato ? '86%' : '82%'};text-align:center;font-family:'Montserrat',sans-serif;font-size:${_isRetrato ? '0.82em' : '1em'};">
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
  .card { width: ${_cW}; height: ${_cH}; position: relative; }
  .cm { position: absolute; width: 2mm; height: 2mm; pointer-events: none; }
  .cm-tl { top: ${BLEED}mm; left: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
  .cm-tr { top: ${BLEED}mm; right: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
  .cm-bl { bottom: ${BLEED}mm; left: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
  .cm-br { bottom: ${BLEED}mm; right: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
  * { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
  @media print { body { margin: 0; } .card { page-break-after: always; } @page { size: ${_cW} ${_cH}; margin: 0; } }
</style>
</head>
<body>
${frenteHtml}
${versoHtml}
</body>
</html>`;

      const existing2 = document.getElementById('_gabarito_iframe');
      if (existing2) existing2.remove();
      const iframe2 = document.createElement('iframe');
      iframe2.id = '_gabarito_iframe';
      iframe2.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:200mm;height:150mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe2);
      iframe2.contentDocument.open();
      iframe2.contentDocument.write(html);
      iframe2.contentDocument.close();
      const _docTitle = pdfTitle('Cartão de Visita');
      iframe2.contentDocument.title = _docTitle;
      const _prevTitle = document.title;
      iframe2.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
          document.title = _docTitle;
          iframe2.contentWindow.focus();
          iframe2.contentWindow.print();
          setTimeout(() => { document.title = _prevTitle; iframe2.remove(); }, 3000);
        }, 300);
      });
      return;
    }

    if (item.includes('Envelope Saco')) {
      const BLEED = 3;
      const W = 225; const H = 311; 
      const ABA_S = 40; const ABA_I = 15; const ABA_L = 15;
      const totalW = (BLEED * 2) + ABA_L + (W * 2); 
      const totalH = (BLEED * 2) + ABA_S + H + ABA_I;

      const solidColor = borderColor || accentColor;
      const genPattern = (scaleMul = 1) => (comBorda && patternSrc) ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.18 * scaleMul).toFixed(1)}mm;background-repeat:repeat;opacity:1;"></div>` : '';
      const _sacPhones = [mainPhone, telefone].filter(Boolean).join(' / ');
      const _ffSac = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfSac = LOCAL_FONT_FACES[_ffSac];
      const _fiSac = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfSac ? `<style>${_lfSac}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffSac.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _waIcoSac = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

      const abaSupHtml = `<div style="position:absolute;top:0;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_S + BLEED}mm;background:${solidColor};"></div>`;
      const abaInfHtml = `<div style="position:absolute;top:${BLEED + ABA_S + H}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_I + BLEED}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;
      const abaLatHtml = `<div style="position:absolute;top:${BLEED + ABA_S}mm;left:0;width:${ABA_L + BLEED}mm;height:${H}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;

      // Preview: 220px container / 240mm = 0.917px/mm → zoom = 3.78/0.917 ≈ 4.12
      const _sacLogoInner = ReactDOMServer.renderToString(<LogoPreviewHTML editData={itemEditData} color={logoColor} layout={logoLayout||'stacked'} scaleFactor={0.42} crm={crmLine} hideTagline={false} maxWidth={`${W-30}mm`} />);
      const _sacLogoHtml = `<div style="zoom:4.12;">${_sacLogoInner}</div>`;
      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${H}mm;overflow:hidden;background:#fff;z-index:2;">
            ${genPattern(1)}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;background:rgba(255,255,255,0.97);padding:4mm 8mm;border-radius:2mm;border:0.2mm solid #ddd;display:inline-flex;align-items:center;justify-content:center;max-width:${W - 20}mm;">
              ${_sacLogoHtml}
            </div>
        </div>`;

      const versoHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L + W}mm;width:${W + BLEED}mm;height:${H}mm;background:#fff;overflow:hidden;z-index:2;border-left:0.1mm dashed rgba(0,0,0,0.1);">
            ${genPattern(1)}
            <div style="position:absolute;bottom:15mm;left:50%;transform:translateX(-50%);width:max-content;max-width:${W - 20}mm;background:rgba(255,255,255,0.97);padding:6mm 12mm;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
               <div style="font-size:11pt;color:#666;font-family:'Montserrat',sans-serif;line-height:1.7;">
                  ${clinicaNome ? `<div style="font-weight:700;color:${accentColor};font-size:14pt;margin-bottom:2mm;">${clinicaNome}</div>` : ''}
                  ${endereco ? `<div style="opacity:0.75;">${endereco}</div>` : ''}
                  ${_sacPhones ? `<div style="font-weight:700;color:#333;font-size:15pt;margin:2mm 0;">${_waIcoSac}${_sacPhones}</div>` : ''}
                  ${email ? `<div style="opacity:0.75;margin-bottom:1mm;">${email}</div>` : ''}
                  ${(site || instagram) ? `<div style="opacity:0.75;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
               </div>
            </div>
        </div>`;

      const _Bs = BLEED;
      const cmsSac = `
        <div style="position:absolute;top:${_Bs}mm;left:0;width:${_Bs-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;left:${_Bs}mm;width:0.2mm;height:${_Bs-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${_Bs}mm;right:0;width:${_Bs-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${_Bs}mm;width:0.2mm;height:${_Bs-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${_Bs}mm;left:0;width:${_Bs-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${_Bs}mm;width:0.2mm;height:${_Bs-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${_Bs}mm;right:0;width:${_Bs-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${_Bs}mm;width:0.2mm;height:${_Bs-0.5}mm;background:#000;"></div>`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Envelope Saco Gabarito - ${marca}</title>${_fiSac}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; background:#fff; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div style="width:${totalW}mm; height:${totalH}mm; position:relative;">${abaSupHtml}${abaInfHtml}${abaLatHtml}${frenteHtml}${versoHtml}${cmsSac}</div></body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:500mm;height:400mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const _pT_4882 = document.title; document.title = pdfTitle('Envelope Saco');
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 500); });
      return;
    }

    if (item.includes('Envelope Ofício')) {
      const BLEED = 3;
      const W = 220; const H = 113;
      const ABA = 35; const COLA = 12;
      const totalW = W + (COLA * 2) + (BLEED * 2);
      const totalH = (H * 2) + ABA + (BLEED * 2);

      const solidColor = borderColor || accentColor;
      const genPattern = (scaleMul = 1) => (comBorda && patternSrc) ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.18 * scaleMul).toFixed(1)}mm;background-repeat:repeat;opacity:1;"></div>` : '';
      const _envPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

      const _ffEnv = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfEnv = LOCAL_FONT_FACES[_ffEnv];
      const _fiEnv = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfEnv ? `<style>${_lfEnv}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffEnv.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;

      const abaHtml = `<div style="position:absolute;top:0;left:0;width:${totalW}mm;height:${ABA + BLEED}mm;background:${solidColor};"></div>`;

      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA}mm;left:0;width:${totalW}mm;height:${H}mm;background:#fff;overflow:hidden;">
            <div style="position:absolute;bottom:8mm;right:${COLA + 3}mm;transform:scale(1.6);transform-origin:right bottom;text-align:right;">${logoHtmlWithCrm}</div>
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

      const B = BLEED;
      const cmsEnv = `
        <div style="position:absolute;top:${B}mm;left:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;left:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${B}mm;right:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${B}mm;left:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${B}mm;right:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Envelope Ofício - ${marca}</title>${_fiEnv}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; background:#fff; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div style="width:${totalW}mm; height:${totalH}mm; position:relative;">${abaHtml}${frenteHtml}${versoHtml}${cmsEnv}</div></body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:300mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const _pT_4945 = document.title; document.title = pdfTitle('Envelope Ofício');
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 500); });
      return;
    }

    if (item === 'Ficha de Cadastro') {
      const BLEED = 5;
      const W = 210, H = 297;
      const totalW = W + BLEED * 2;
      const totalH = H + BLEED * 2;
      const _ffC = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfC = LOCAL_FONT_FACES[_ffC];
      const fiC = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">${_lfC ? `<style>${_lfC}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffC)}:wght@400;700&display=swap" rel="stylesheet">`}`;

      const genBg = (innerPad = 8) => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.4).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>
           <div style="position:absolute;top:${BLEED + innerPad}mm;left:${BLEED + innerPad}mm;right:${BLEED + innerPad}mm;bottom:${BLEED + innerPad}mm;background:#fff;"></div>`
        : comBorda ? `<div style="position:absolute;inset:0;background:#fff;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BLEED + innerPad}mm solid ${borderColor || accentColor};box-sizing:border-box;"></div>`;

      const formRow = (label, flex, bg='#cfd9e5', w='100%') => `
        <div style="display:flex;align-items:center;gap:3mm;flex:${flex};width:${w};">
          <span style="font-size:8.5pt;font-weight:700;white-space:nowrap;color:#222;">${label}</span>
          <div style="flex:1;height:5.5mm;background:${bg};border-radius:1px;"></div>
        </div>
      `;
      const formText = (label, flex) => `
        <div style="display:flex;align-items:center;gap:3mm;flex:${flex};">
          <span style="font-size:8.5pt;font-weight:700;white-space:nowrap;color:#222;">${label}</span>
        </div>
      `;

      const pageHtml = `
        <div class="card" style="position:relative;overflow:hidden;width:${totalW}mm;height:${totalH}mm;background:#fff;">
          ${genBg(8)}
          <div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + 8}mm;padding:12mm 15mm;display:flex;flex-direction:column;">
            
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10mm;">
              <div style="padding-top:2mm;">
                <h1 style="font-family:'Montserrat',sans-serif;font-size:18pt;font-weight:800;letter-spacing:1px;color:#111;margin:0;">CADASTRO DE PACIENTES</h1>
                <div style="display:flex;align-items:center;gap:3mm;margin-top:5mm;">
                  <span style="font-size:10pt;font-weight:400;color:#222;">DATA :</span>
                  <div style="width:40mm;height:6mm;background:#e2ddd7;border-radius:1px;"></div>
                </div>
              </div>
              <div style="width:85mm; height:25mm; display:flex; justify-content:flex-end; align-items:flex-start; overflow:hidden;">
                ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 1.5).toFixed(1), lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '85mm', maxHeight: '25mm', withBackground: comBorda && patternSrc })}
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:7mm;font-family:'Montserrat',sans-serif;width:100%;flex:1;justify-content:space-between;">
              ${fichaAdulto ? `
              ${formRow('NOME COMPLETO :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow('DATA DE NASCIMENTO:', 0.4)}
                ${formRow('CPF:', 0.35)}
                ${formRow('RG:', 0.25)}
              </div>
              <div style="display:flex;gap:5mm;">
                ${formRow('ESTADO CIVIL:', 0.5)}
                ${formRow('PROFISSÃO:', 0.5)}
              </div>
              <div style="border:0.5mm solid #cfd9e5;border-radius:2mm;padding:4mm;background:#f8fafc;display:flex;flex-direction:column;gap:3.5mm;">
                ${formRow('RESPONSÁVEL (se menor):', 1)}
                <div style="display:flex;gap:5mm;">
                  ${formRow('GRAU DE PARENTESCO:', 0.6)}
                  ${formRow('CPF:', 0.4)}
                </div>
              </div>
              ` : `
              ${formRow('NOME COMPLETO DA CRIANÇA :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow('DATA DE NASCIMENTO:', 0.45)}
                ${formRow('IDADE:', 0.55)}
              </div>
              ${formRow('NOME DA MÃE :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow('PROFISSÃO:', 0.65)}
                ${formRow('CPF:', 0.35)}
              </div>
              ${formRow('NOME DO PAI :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow('PROFISSÃO:', 0.65)}
                ${formRow('CPF:', 0.35)}
              </div>
              <div style="border:0.5mm solid #cfd9e5;border-radius:2mm;padding:4mm;background:#f8fafc;display:flex;flex-direction:column;gap:3.5mm;">
                ${formRow('NOME DO (A) RESPONSÁVEL ACOMPANHANTE:', 1)}
                <div style="display:flex;gap:5mm;">
                  ${formRow('GRAU DE PARENTESCO:', 0.6)}
                  ${formRow('CPF:', 0.4)}
                </div>
              </div>
              `}
              ${formRow('ENDEREÇO:', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow('COMPLEMENTO:', 0.55)}
                ${formRow('BAIRRO:', 0.45)}
              </div>
              <div style="display:flex;gap:5mm;">
                ${formRow('CIDADE:', 0.55)}
                ${formRow('ESTADO:', 0.45)}
              </div>
              
              <div style="margin-top:1mm;">
                <span style="font-size:8.5pt;font-weight:700;color:#222;">TELEFONES :</span>
              </div>
              ${fichaAdulto ? `
              <div style="display:flex;gap:5mm;">
                ${formRow('CELULAR:', 1)}
                ${formRow('RESIDENCIAL:', 1)}
              </div>` : `
              <div style="display:flex;gap:5mm;">
                ${formRow('MÃE :', 1)}
                ${formRow('PAI :', 1)}
                ${formRow('RESPONSÁVEL:', 1)}
              </div>
              <div style="display:flex;gap:5mm;align-items:center;">
                ${formRow('OUTROS TELEFONES :', 0.55)}
                ${formText('RESIDENCIAL ( &nbsp; &nbsp;) &nbsp; COMERCIAL ( &nbsp; &nbsp;)', 0.45)}
              </div>`}

              ${formRow('E-MAILS:', 1)}
              ${formRow('COMO CONHECEU A CLÍNICA:', 1)}

            </div>

          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ficha de Cadastro - ${marca}</title>${fiC}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width: 220mm; height: 307mm; position: relative; overflow: hidden; background: #fff; }
.card { width: 220mm; height: 307mm; }
.cm { position: absolute; width: 5mm; height: 5mm; border-color: rgba(0,0,0,0.5); border-style: solid; border-width: 0; pointer-events: none; }
.cm-tl { top:${BLEED}mm; left:${BLEED}mm; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:${BLEED}mm; right:${BLEED}mm; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:${BLEED}mm; left:${BLEED}mm; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:${BLEED}mm; right:${BLEED}mm; border-bottom:0.2mm solid; border-right:0.2mm solid; }
@media print { body { margin:0; } @page { size: 220mm 307mm; margin: 0; } }
</style></head><body>${pageHtml}</body></html>`;

      const ex = document.getElementById('_gabarito_v2'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_v2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const _pT_5091 = document.title; document.title = pdfTitle('Ficha de Cadastro');
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 1000); });
      return;
    }

    if (item === 'Prontuário Médico') {
      const BLEED = 5;
      const _ffPr = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfPr = LOCAL_FONT_FACES[_ffPr];
      const fiPr = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">${_lfPr ? `<style>${_lfPr}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffPr.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const genBg = (innerPad = 8) => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.4).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>
           <div style="position:absolute;top:${BLEED + innerPad}mm;left:${BLEED + innerPad}mm;right:${BLEED + innerPad}mm;bottom:${BLEED + innerPad}mm;background:#fff;"></div>`
        : comBorda ? `<div style="position:absolute;inset:0;background:#fff;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BLEED + innerPad}mm solid ${borderColor || accentColor};"></div>`;

      const formRow = (label1, label2, flex2 = 0.4) => `
        <div style="display:flex;gap:5mm;width:100%;align-items:center;">
          <div style="flex:1;display:flex;gap:3mm;align-items:center;">
            <span style="font-size:7.5pt;font-weight:700;color:#222;white-space:nowrap;opacity:0.8;">${label1}</span>
            <div style="flex:1;height:5.5mm;background:#f2e8e0;border-radius:1px;"></div>
          </div>
          ${label2 ? `
          <div style="flex:${flex2};display:flex;gap:3mm;align-items:center;">
            <span style="font-size:7.5pt;font-weight:700;color:#222;white-space:nowrap;opacity:0.8;">${label2}</span>
            <div style="flex:1;height:5.5mm;background:#f2e8e0;border-radius:1px;"></div>
          </div>` : ''}
        </div>
      `;

      const lines = (count, gap = '9mm') => `
        <div style="display:flex;flex-direction:column;gap:${gap};margin-top:2mm;width:100%;">
          ${Array.from({ length: count }).map(() => `<div style="border-bottom:0.2mm solid #eee;width:100%;height:1px;"></div>`).join('')}
        </div>
      `;

      const frenteHtml = `
        <div class="page" style="position:relative;overflow:hidden;background:#fff;">
          ${genBg(8)}
          <div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + 8}mm;padding:12mm 15mm;display:flex;flex-direction:column;align-items:center;overflow:hidden;">
            <div style="margin-bottom:10mm;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:32mm;overflow:hidden;">
               ${logoHtmlWithCrm}
            </div>
            <div style="display:flex;flex-direction:column;gap:4mm;font-family:'Montserrat',sans-serif;width:100%;margin-top:1mm;border:0.25mm solid #eee;border-radius:1mm;padding:5mm 6mm;">
              ${formRow('PACIENTE:', 'NASC:', 0.6)}
              ${formRow('NOME DA MÃE:', 'CPF:', 0.45)}
              ${formRow('TELEFONE:', 'EMAIL:', 0.45)}
              ${formRow('ENDEREÇO:', 'CIDADE:', 0.45)}
              ${formRow('CONVÊNIO:', 'Nº CARTEIRINHA:', 0.7)}
            </div>
            <div style="flex:1;width:100%;margin-top:10mm;">
              ${lines(18, '10mm')}
            </div>
          </div>
          <div class="cm-h cm-tl-h"></div><div class="cm-v cm-tl-v"></div>
          <div class="cm-h cm-tr-h"></div><div class="cm-v cm-tr-v"></div>
          <div class="cm-h cm-bl-h"></div><div class="cm-v cm-bl-v"></div>
          <div class="cm-h cm-br-h"></div><div class="cm-v cm-br-v"></div>
        </div>`;

      const versoHtml = `
        <div class="page" style="position:relative;overflow:hidden;background:#fff;page-break-before:always;">
          ${genBg(8)}
          <div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + 8}mm;padding:15mm 15mm;display:flex;flex-direction:column;overflow:hidden;">
            <div style="flex:1;width:100%;">
              ${lines(25, '10.5mm')}
            </div>
            <div style="align-self:flex-end;margin-top:5mm;opacity:0.35;">
               ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan: '', crmLine: null, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, hideSlogan: true, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '40mm', maxHeight: '22mm', withBackground: comBorda && patternSrc })}
            </div>
          </div>
          <div class="cm-h cm-tl-h"></div><div class="cm-v cm-tl-v"></div>
          <div class="cm-h cm-tr-h"></div><div class="cm-v cm-tr-v"></div>
          <div class="cm-h cm-bl-h"></div><div class="cm-v cm-bl-v"></div>
          <div class="cm-h cm-br-h"></div><div class="cm-v cm-br-v"></div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Prontuário Médico - ${marca}</title>${fiPr}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width: 220mm; height: 307mm; background: #fff; }
.page { width: 220mm; height: 307mm; position: relative; }
.cm-h { position:absolute; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
.cm-v { position:absolute; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
.cm-tl-h { top:${BLEED}mm; left:0; } .cm-tl-v { top:0; left:${BLEED}mm; }
.cm-tr-h { top:${BLEED}mm; right:0; } .cm-tr-v { top:0; right:${BLEED}mm; }
.cm-bl-h { bottom:${BLEED}mm; left:0; } .cm-bl-v { bottom:0; left:${BLEED}mm; }
.cm-br-h { bottom:${BLEED}mm; right:0; } .cm-br-v { bottom:0; right:${BLEED}mm; }
@media print { body { margin:0; } @page { size: 220mm 307mm; margin: 0; } }
</style></head><body>${frenteHtml}${versoHtml}</body></html>`;

      const ex = document.getElementById('_gabarito_v2'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_v2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const _pT_5186 = document.title; document.title = pdfTitle('Prontuário Médico');
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { iframe.remove(); }, 3000); }, 1000); });
      return;
    }

    if (item === 'Checklist Maternidade') {
      const BLEED = 5;
      const _bc = borderColor || accentColor;
      const _bwCk = '8mm';
      const _patCk = (comBorda && patternSrc)
        ? `background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.35).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${_bc};`;
      const SECOES_CK = [
        { titulo: 'check list bebê', itens: ['4 mudas para troca de roupas','1 saída de maternidade','4 pares de meia','Fraldinhas de boca','2 mantas','1 pacote de fralda descartável (RN P dependendo do tamanho do bebê)','1 toalha fralda','Sabonete líquido de glicerina','Algodão','Frasco de álcool','Pomada para prevenção de assadura','1 sacolinha para roupas sujas','Pente para cabelo','Almofada de amamentação','1 Coeiro','Cadeirinha ou bebê conforto para o carro'] },
        { titulo: 'check list mamãe', itens: ['2 ou mais camisolas/pijamas com abertura frontal','5 calcinhas confortáveis','Chinelo de dedo confortável','Sutiã de amamentação','Absorvente íntimo','Produtos de higiene pessoal ex: (escova de dente, pasta de dente, sabonete, desodorante sem cheiro por causa do bebê, pente de cabelo, absorvente noturno)','1 muda de roupa para saída pós parto','Prendedor de cabelo','Produtos de beleza (batom pra animar a puérpera)','1 sacola para roupas sujas','Travesseiro de uso pessoal','Toalha de banho'] },
        { titulo: 'check list documentos', itens: ['RG dos pais ou documento com foto','Carteirinha do plano de saúde','Cartão do pré natal!!!','Últimos exames feitos','Se pais casados: certidão de casamento'] },
        { titulo: 'check list acompanhante', itens: ['2 mudas de roupa','Produtos de higiene pessoal','Chinelo','Carregador de celular','Lanchinho'] },
      ];
      const secaoHtmlCk = (s, idx) => {
        const color = paletteColors[idx % paletteColors.length] || accentColor;
        const op = getLegibleBgOpacity(color);
        const legibleBorder = ensureLegibleColor(color);
        return `
          <div style="background:${color}${op}; border:0.35mm solid ${color}40; border-radius:1.5mm; padding:2.5mm 4mm; display:flex; flex-direction:column; gap:1mm; height:100%;">
            <div style="font-family:Georgia,serif; font-style:italic; font-size:9.5pt; font-weight:700; color:${legibleBorder}; margin-bottom:1.5mm; border-bottom:0.25mm solid ${color}30; padding-bottom:1.5mm; text-transform:lowercase;">${s.titulo}</div>
            <div style="display:flex; flex-direction:column; gap:0.5mm;">
              ${s.itens.map((it, iIdx) => `
                <div style="display:flex; align-items:flex-start; gap:2.5mm; font-family:'Montserrat',sans-serif; font-size:8.1pt; color:#333; line-height:1.3; font-weight:500; border-bottom:${iIdx === s.itens.length - 1 ? 'none' : '0.15mm solid #00000008'}; padding-bottom:1.2mm; margin-bottom:0.5mm;">
                  <div style="width:3.5mm; height:3.5mm; border:0.4mm solid ${legibleBorder}; border-radius:0.8mm; flex-shrink:0; margin-top:0.4mm; background:#fff;"></div>
                  <span style="flex:1;">${it}</span>
                </div>
              `).join('')}
            </div>
          </div>`;
      };
      const _allPhonesCk = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');
      const _ffCk = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfCk = LOCAL_FONT_FACES[_ffCk];
      const _fiCk = _lfCk ? `<style>${_lfCk}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffCk)}:wght@400;700&display=swap" rel="stylesheet">`;
      const _logoCk = genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: 24, lineH: 1.2, letterSp: editData?.fontLetterSpacing || brand.editData?.fontLetterSpacing || '0.5pt', layout: logoLayout, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '100mm', maxHeight: '35mm', withBackground: comBorda && patternSrc });
      const _cmCk = `
        <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>`;
      const htmlCk = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet">${_fiCk}<style>*{margin:0;padding:0;box-sizing:border-box;}body{width:220mm;height:307mm;}@media print{body{margin:0;}@page{size:220mm 307mm;margin:0;}}</style></head><body><div style="position:relative;width:220mm;height:307mm;${_patCk}">${_cmCk}<div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + 8}mm;background:#fff;display:flex;overflow:hidden;"><div style="width:16mm;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${accentColor}15;"><div style="transform:rotate(-90deg);white-space:nowrap;font-family:'Montserrat',sans-serif;font-size:15pt;font-weight:900;color:${accentColor};letter-spacing:4pt;text-transform:uppercase;">CHECKLIST MATERNIDADE</div></div><div style="flex:1;display:flex;flex-direction:column;padding:12mm 8mm 10mm 8mm;gap:4mm;overflow:hidden;"><div style="display:flex;justify-content:center;padding-bottom:5mm;border-bottom:0.2mm solid ${accentColor}25;">${_logoCk}</div><div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:4mm;">${SECOES_CK.map((s, idx) => secaoHtmlCk(s, idx)).join('')}</div><div style="border-top:0.3mm solid ${accentColor}30;padding:3mm 2mm 0;display:flex;align-items:center;justify-content:space-between;gap:6mm;"><div style="font-family:'Montserrat',sans-serif;font-size:9pt;font-weight:800;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;white-space:nowrap;">${clinicaNome || marca}</div><div style="font-family:'Montserrat',sans-serif;font-size:7.5pt;color:#888;text-align:center;line-height:1.4;">${endereco ? `<div>${endereco}</div>` : ''}${_allPhonesCk ? `<div>${_allPhonesCk}</div>` : ''}</div><div style="font-family:'Montserrat',sans-serif;font-size:7.5pt;color:#888;text-align:right;white-space:nowrap;">${site ? `<div>${site}</div>` : ''}${instagram ? `<div>@${instagram}</div>` : ''}</div></div></div></div></div></body></html>`;
      const exCk = document.getElementById('_gabarito_iframe'); if (exCk) exCk.remove();
      const blobCk = new Blob([htmlCk], { type: 'text/html;charset=utf-8' });
      const blobUrlCk = URL.createObjectURL(blobCk);
      const iframeCk = document.createElement('iframe');
      iframeCk.id = '_gabarito_iframe';
      iframeCk.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeCk);
      iframeCk.src = blobUrlCk;
      const _pT_5241 = document.title; document.title = pdfTitle('Checklist Maternidade');
      iframeCk.onload = () => setTimeout(() => { iframeCk.contentWindow.focus(); iframeCk.contentWindow.print(); setTimeout(() => { iframeCk.remove(); URL.revokeObjectURL(blobUrlCk); }, 2000); }, 800);
      return;
    }

    if (item === 'Atestado Médico') {
      const _fa2 = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lf2 = LOCAL_FONT_FACES[_fa2];
      const fi2 = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lf2 ? `<style>${_lf2}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_fa2.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _bw = '8mm';
      const BLEED = 5;
      const _isA4 = paperSize === 'a4';
      const _pw = _isA4 ? 220 : 158; // mm com bleed
      const _ph = _isA4 ? 307 : 220;
      const _bc2 = borderColor || accentColor;
      const _clipAt = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';
      const _pat2 = (comBorda && patternSrc)
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.35).toFixed(1)}mm;background-repeat:repeat;"></div><div style="position:absolute;top:${_bw};left:${_bw};right:${_bw};bottom:${_bw};background:#fff;clip-path:${_clipAt};"></div>`
        : `<div style="position:absolute;inset:0;background:${_bc2};"></div><div style="position:absolute;top:${_bw};left:${_bw};right:${_bw};bottom:${_bw};background:#fff;clip-path:${_clipAt};"></div>`;
      const _atFooter1 = [clinicaNome, mainPhone].filter(Boolean).join(' · ');
      const _atFooter2 = [instagram ? `@${instagram}` : '', site, endereco].filter(Boolean).join(' · ');
      const _hasFooter = !!(  _atFooter1 || _atFooter2);
      const _footerH = _atFooter1 && _atFooter2 ? 13 : 8; 
      const _atFooterHtml = _hasFooter ? `
        <div style="position:absolute;bottom:10mm;left:${_bw};right:${_bw};text-align:center;font-family:'Montserrat',sans-serif;color:#555;line-height:1.7;">
          ${_atFooter1 ? `<div style="font-size:6pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_atFooter1}</div>` : ''}
          ${_atFooter2 ? `<div style="font-size:5.5pt;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_atFooter2}</div>` : ''}
        </div>
        <div style="position:absolute;bottom:${7 + _footerH}mm;left:12mm;right:12mm;border-top:0.5px solid #e0e0e0;"></div>` : '';
      const _atBottom = _hasFooter ? `${7 + _footerH + 2}mm` : _bw;
      const _atHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Atestado Médico - ${marca}</title>${fi2}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { margin:0; } @media print { @page { size: ${_pw}mm ${_ph}mm; margin:0; } }
.blank { display:inline-block; border-bottom:0.8px solid #555; vertical-align:bottom; }
</style></head><body>
<div style="position:relative;width:${_pw}mm;height:${_ph}mm;overflow:hidden;">
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  ${_pat2}
  ${_atFooterHtml}
  <div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + _footerH + 10}mm;font-family:'Montserrat',sans-serif;">

    <div style="position:absolute;top:${_isA4 ? 18 : 16}mm;left:50%;transform:translateX(-50%);width:${Math.round((_pw - 2 * BLEED) * 0.75)}mm;display:inline-flex;flex-direction:column;align-items:center;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 1.5).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: `${Math.round((_pw - 2 * BLEED) * 0.70)}mm`, maxHeight: _isA4 ? '64mm' : '48mm', withBackground: comBorda && patternSrc })}</div>

    <div style="position:absolute;top:${_isA4 ? 76 : 52}mm;left:0;right:0;text-align:center;font-size:${_isA4 ? 18 : 14}pt;font-weight:800;letter-spacing:2.5pt;color:#1a1a2e;">ATESTADO MÉDICO</div>

    <div style="position:absolute;top:${_isA4 ? 96 : 66}mm;left:9mm;right:9mm;font-size:${_isA4 ? 13 : 10}pt;color:#222;display:flex;flex-direction:column;gap:${_isA4 ? 14 : 6}mm;line-height:1.3;">
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">Declaro para os devidos fins, que</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">, esteve em consulta, das</span>
        <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">hs às</span>
        <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span>
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
        <span class="blank" style="width:${_isA4 ? 28 : 20}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">(</span><span class="blank" style="width:${_isA4 ? 18 : 12}mm;">&nbsp;</span><span style="white-space:nowrap;">) dias de dispensa.</span>
      </div>
    </div>

    <div style="position:absolute;top:${_isA4 ? 210 : 133}mm;left:0;right:0;text-align:center;font-size:${_isA4 ? 11 : 9}pt;color:#555;">
      <span class="blank" style="width:${_isA4 ? 52 : 38}mm;">&nbsp;</span>, <span class="blank" style="width:${_isA4 ? 14 : 10}mm;">&nbsp;</span>
      de <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span> de <span class="blank" style="width:${_isA4 ? 16 : 12}mm;">&nbsp;</span>
    </div>

    <div style="position:absolute;top:${_isA4 ? 235 : 152}mm;left:20%;right:20%;border-top:0.7px solid #555;"></div>

  </div>
</div></body></html>`;
      const _dt = pdfTitle('Atestado Médico');
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

    // ── DIÁRIO DO XIXI ───────────────────────────────────────────
    if (item === 'Diário do Xixi') {
      const BLEED = 3;
      const _ffD = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfD = LOCAL_FONT_FACES[_ffD];
      const fiD = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfD ? `<style>${_lfD}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffD.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const genBg = (innerPad = 5) => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.4).toFixed(1)}mm;background-repeat:repeat;opacity:1;"></div>
           <div style="position:absolute;top:${BLEED + innerPad}mm;left:${BLEED + innerPad}mm;right:${BLEED + innerPad}mm;bottom:${BLEED + innerPad}mm;background:#fff;"></div>`
        : `<div style="position:absolute;inset:0;background:${borderColor || accentColor};"></div>
           <div style="position:absolute;top:${BLEED + innerPad}mm;left:${BLEED + innerPad}mm;right:${BLEED + innerPad}mm;bottom:${BLEED + innerPad}mm;background:#fff;"></div>`;

      const SunIcon = `<svg width="12mm" height="12mm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>`;
      const CloudIcon = `<svg width="12mm" height="12mm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.4-1.9-4.3-4.3-4.5-.6-3.1-3.3-5.5-6.7-5.5-3.1 0-5.8 2.1-6.5 5.1C2.1 10.3 0 12.5 0 15.5c0 3 2.4 5.5 5.5 5.5"/><path d="M8 20v2"/><path d="M12 20v2"/><path d="M16 20v2"/></svg>`;

      const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const weeks = [1, 2, 3, 4];

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Diário do Xixi - ${marca}</title>${fiD}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width: 303mm; height: 216mm; position: relative; overflow: hidden; background: #fff; }
.page { width: 303mm; height: 216mm; position: relative; overflow: hidden; }
@media print { body { margin:0; } @page { size: 303mm 216mm; margin: 0; } }
</style></head><body>
<div class="page">
    ${genBg(10)}
    <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
    <div style="position:absolute;top:${BLEED + 10}mm;left:${BLEED + 10}mm;right:${BLEED + 10}mm;bottom:${BLEED + 10}mm;display:flex;flex-direction:column;padding:5mm 6mm 4mm;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm;">
            <div style="display:flex;flex-direction:column;gap:6mm;">
                <div style="background:#f5f5f5;padding:4mm 10mm;border-radius:1.5mm;border:0.4mm solid #ddd;display:inline-block;align-self:flex-start;">
                    <span style="font-family:'Montserrat',sans-serif;font-size:16pt;font-weight:800;color:#333;letter-spacing:2pt;text-transform:uppercase;">DIÁRIO DO XIXI (HÁBITO MICCIONAL)</span>
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:10pt;color:${accentColor};font-weight:700;text-transform:uppercase;letter-spacing:1pt;margin-top:2mm;">Controle de Escapes e Enurese (Xixi na Cama)</div>
                <div style="display:flex;gap:5mm;align-items:flex-end;margin-top:2mm;">
                    <span style="font-family:'Montserrat',sans-serif;font-size:18pt;color:${accentColor};font-weight:300;font-style:italic;">Nome:</span>
                    <div style="flex:1;border-bottom:0.5mm dashed #ccc;min-width:140mm;margin-bottom:2mm;"></div>
                </div>
            </div>
            <div style="width:70mm;display:flex;flex-direction:column;align-items:flex-end;margin-top:2mm;">
                ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 2.0).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '70mm', maxHeight: '20mm', withBackground: comBorda && patternSrc })}
            </div>
        </div>

        <div style="display:flex;gap:15mm;align-items:center;margin-bottom:8mm;font-family:'Montserrat',sans-serif;">
            <div style="display:flex;gap:6mm;align-items:center;">
                <span style="font-size:11pt;text-transform:uppercase;color:#666;font-weight:800;letter-spacing:1pt;">Legenda:</span>
                <span style="font-size:11pt;color:#888;"><strong>0:</strong> Acordou Seco(a) / Sem Escapes</span>
                <span style="font-size:11pt;color:#888;"><strong>1:</strong> Gotas / Escape Leve</span>
                <span style="font-size:11pt;color:#888;"><strong>2:</strong> Molhou a Roupa ou Fralda</span>
                <span style="font-size:11pt;color:#888;"><strong>3:</strong> Abundante / Molhou a Cama</span>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:45mm repeat(4, 1fr);gap:0.3mm;background:#eee;border:0.3mm solid #eee;flex:1;">
            <div style="background:#fff;display:flex;align-items:center;padding-left:6mm;">
                <span style="font-family:'Montserrat',sans-serif;font-size:9pt;font-weight:800;color:#bbb;text-transform:uppercase;">Marque 0 a 3</span>
            </div>
            ${weeks.map(w => `
              <div style="background:#fff;text-align:center;padding:4mm 0;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                <div style="font-family:'Montserrat',sans-serif;font-size:11pt;font-weight:800;color:${accentColor};text-transform:uppercase;">Semana ${w}</div>
                <div style="width:15mm;height:0.6mm;background:${accentColor};margin-top:2mm;"></div>
              </div>
            `).join('')}
            ${days.map(day => `
                <div style="background:#fff;padding:3mm 6mm;display:flex;align-items:center;">
                  <span style="font-family:'Montserrat',sans-serif;font-size:13pt;font-weight:800;color:${accentColor};font-style:italic;">${day}</span>
                </div>
                ${weeks.map(() => `
                  <div style="background:#fff;display:flex;justify-content:center;align-items:center;padding:2mm;">
                    <div style="display:flex;gap:3mm;">
                      ${[0,1,2,3].map(n => `<div style="width:9mm;height:9mm;border:0.4mm solid #ddd;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:9pt;color:#999;">${n}</div>`).join('')}
                    </div>
                  </div>
                `).join('')}
            `).join('')}
        </div>
    </div>
    <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
</body></html>`;

      const exD = document.getElementById('_gabarito_v2'); if (exD) exD.remove();
      const iframeD = document.createElement('iframe');
      iframeD.id = '_gabarito_v2';
      iframeD.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeD);
      iframeD.contentDocument.open(); iframeD.contentDocument.write(html); iframeD.contentDocument.close();
      const _pT_5440 = document.title; document.title = pdfTitle('Diário do Xixi');
      iframeD.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeD.contentWindow.focus(); iframeD.contentWindow.print(); setTimeout(() => { iframeD.remove(); }, 3000); }, 1000); });
      return;
    }

    if (item === 'Meu Pratinho') {
      const pratinhoBlob = null; // unused, kept for cleanup logic below
      const BLEED = 3;
      const W = 297, H = 210;
      const BORDER = 10;
      const solidColor = borderColor || accentColor;
      const _ffP = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfP = LOCAL_FONT_FACES[_ffP];
      const fiP = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfP ? `<style>${_lfP}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffP.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const patternBorder = (comBorda && patternSrc) ? `
        <div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.4).toFixed(1)}mm;background-repeat:repeat;z-index:1;"></div>
        <div style="position:absolute;top:${BORDER}mm;left:${BORDER}mm;right:${BORDER}mm;bottom:${BORDER}mm;background:#fff;z-index:2;"></div>
      ` : comBorda ? `<div style="position:absolute;inset:0;background:#fff;z-index:1;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BORDER}mm solid ${solidColor};box-sizing:border-box;z-index:1;"></div>`;

      const sectionTitle = (num, text, color = solidColor) => `
        <div style="display:flex;align-items:center;gap:3mm;margin-bottom:2mm;">
          <div style="width:7mm;height:7mm;background:${color};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:10pt;font-weight:900;">${num}</div>
          <div style="font-family:'Montserrat',sans-serif;font-size:10pt;font-weight:900;color:${color};text-transform:uppercase;letter-spacing:0.5pt;">${text}</div>
        </div>
      `;

      const _c0 = paletteColors[0] || solidColor;
      const _c1 = paletteColors[1] || solidColor;
      const _c2 = paletteColors[2] || _c0;
      const _c3 = paletteColors[3] || _c1;

      const foodCard = (title, color, text) => `
        <div style="background:#fff;border-radius:2mm;box-shadow:0 0.5mm 2mm rgba(0,0,0,0.10);overflow:hidden;border:0.2mm solid ${color}30;display:flex;flex-direction:column;">
          <div style="background:${color};padding:2mm 3.5mm;">
            <span style="font-family:'Montserrat',sans-serif;font-size:10pt;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.3pt;">${title}</span>
          </div>
          <div style="padding:3mm 3.5mm;flex:1;">
            <span style="font-family:'Montserrat',sans-serif;font-size:9.5pt;color:#555;line-height:1.45;">${text}</span>
          </div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Meu Pratinho - ${marca}</title>${fiP}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; color-adjust:exact !important; }
body { background:#fff; }
.page { width:${W + BLEED*2}mm; height:${H + BLEED*2}mm; position:relative; overflow:hidden; page-break-after:always; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin: 0; } }
</style></head><body>

<!-- FRENTE -->
<div class="page">
  ${patternBorder}
  <div style="position:absolute;top:${BLEED+BORDER}mm;left:${BLEED+BORDER}mm;right:${BLEED+BORDER}mm;bottom:${BLEED+BORDER}mm;display:flex;z-index:3;">

    <!-- Coluna esquerda: título + campos + steps -->
    <div style="flex:0 0 105mm;display:flex;flex-direction:column;padding:8mm 8mm 8mm 10mm;border-right:0.2mm solid ${solidColor}20;">
      <!-- Título -->
      <div style="margin-bottom:5mm;">
        <div style="font-family:'Montserrat',sans-serif;font-size:8pt;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5pt;">passo a passo</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:26pt;font-weight:900;color:${solidColor};text-transform:uppercase;line-height:0.95;">ALIMENTAÇÃO</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:21pt;font-weight:900;color:${solidColor};text-transform:uppercase;line-height:0.95;">COMPLEMENTAR</div>
      </div>
      <!-- Campos -->
      <div style="display:flex;flex-direction:column;gap:2mm;margin-bottom:6mm;padding:3mm 5mm;background:${solidColor}10;border-radius:2mm;border:0.2mm solid ${solidColor}20;">
        ${[['NOME'],['DATA DE NASCIMENTO']].map(([l]) => `
          <div style="display:flex;flex-direction:column;gap:0.5mm;">
            <span style="font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">${l}:</span>
            <div style="border-bottom:0.2mm solid ${solidColor}50;height:4mm;"></div>
          </div>`).join('')}
        <div style="display:flex;gap:6mm;font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">
          <div style="display:flex;align-items:center;gap:1.5mm;"><div style="width:3.5mm;height:3.5mm;border:0.2mm solid ${solidColor}60;border-radius:50%;"></div>MENINO</div>
          <div style="display:flex;align-items:center;gap:1.5mm;"><div style="width:3.5mm;height:3.5mm;border:0.2mm solid ${solidColor}60;border-radius:50%;"></div>MENINA</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5mm;">
          <span style="font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">NOME DO RESPONSÁVEL:</span>
          <div style="border-bottom:0.2mm solid ${solidColor}50;height:4mm;"></div>
        </div>
      </div>
      <!-- Steps -->
      <div style="display:flex;flex-direction:column;gap:5mm;flex:1;">
        ${[[1,'IDADE',_c0,'6 meses, com os sinais de prontidão presentes.'],[2,'CONSISTÊNCIA',_c1,'Proibido mixer, liquidificador, peneira ou redinha. O que não amassar, ofereça em pedaços para estimular a mastigação e o desenvolvimento orofacial.'],[3,'ESCOLHA O TAMANHO DA COLHER',_c2,'Tamanho adequado ao diâmetro da boca da criança. Prefira silicone ou plástico.'],[4,'MONTAR O PRATO',_c3,'Siga a proporção da imagem dando preferência a alimentos ricos, frescos e variados.']].map(([n,t,c,tx]) => `
          <div style="display:flex;gap:3mm;align-items:flex-start;">
            <div style="width:5.5mm;height:5.5mm;background:${c};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:8pt;font-weight:900;flex-shrink:0;">${n}</div>
            <div>
              <div style="font-family:'Montserrat',sans-serif;font-size:11pt;font-weight:900;color:${c};text-transform:uppercase;line-height:1.1;margin-bottom:1mm;">${t}</div>
              <div style="font-family:'Montserrat',sans-serif;font-size:9.5pt;color:#444;line-height:1.4;">${tx}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Coluna direita: logo + prato -->
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:4mm 10mm 16mm 6mm;">
      <div style="width:100%;display:flex;justify-content:flex-end;margin-bottom:4mm;">
        <div style="width:90mm;zoom:1.3;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: logoLayout === 'horizontal' ? (marca.length > 18 ? 16 : marca.length > 12 ? 20 : 24) : _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '90mm', maxHeight: '50mm', withBackground: comBorda && patternSrc })}</div>
      </div>
      <!-- Prato com anel colorido -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center;">
        <div style="position:relative;width:126mm;height:126mm;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(${_c0} 0deg 180deg,${_c1} 180deg 360deg);"></div>
          <div style="position:absolute;inset:3.5mm;border-radius:50%;background:#fff;"></div>
          <div style="position:absolute;inset:5mm;border-radius:50%;overflow:hidden;">
            <img src="${window.location.origin}/pratinho-plate.svg" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </div>
      </div>
    </div>

  </div>
  <div style="position:absolute;bottom:${BLEED+BORDER+2}mm;left:${BLEED+BORDER+5}mm;right:${BLEED+BORDER+5}mm;display:flex;justify-content:space-between;border-top:0.2mm solid #eee;padding-top:2mm;z-index:4;">
    <span style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#bbb;">${clinicaNome}${cartaoContacts?.telefone ? ` · ${cartaoContacts.telefone}` : ''}</span>
    <span style="font-family:'Montserrat',sans-serif;font-size:7pt;font-weight:900;color:${solidColor};text-transform:uppercase;">GUIA ALIMENTAR: MEU PRATINHO</span>
  </div>
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
</div>

<!-- VERSO -->
<div class="page">
  ${patternBorder}
  <div style="position:absolute;top:${BLEED+BORDER}mm;left:${BLEED+BORDER}mm;right:${BLEED+BORDER}mm;bottom:${BLEED+BORDER}mm;display:flex;flex-direction:column;z-index:3;background:#f5f5f5;padding:5mm 6mm 6mm;overflow:hidden;">
    <div style="font-family:'Montserrat',sans-serif;font-size:14pt;font-weight:900;color:${solidColor};text-transform:uppercase;text-align:center;margin-bottom:1mm;flex-shrink:0;">MEU PRATINHO</div>
    <div style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#999;text-align:center;margin-bottom:3mm;flex-shrink:0;">Como montar um prato equilibrado para as crianças</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:2.5mm;flex:1;overflow:hidden;">
      ${foodCard('Legumes e Verduras',_c0,'Ricos em vitaminas, minerais, fibras e ferro. Quanto mais colorido, melhor! Beterraba, chuchu, abobrinha, cenoura, alface, brócolis, couve-flor, espinafre, acelga, rúcula, agrião. Devem ocupar metade do pratinho.')}
      ${foodCard('Proteínas',_c1,'Fonte de proteína, gordura, ferro, zinco e vitamina B12. Carne, ovo, peixe e frango. Opte por carnes magras. Escolha 1 opção por refeição e varie ao longo da semana.')}
      ${foodCard('Água',_c2,'Oferte sempre após cada refeição e lanches. A água é fundamental para o bom funcionamento do organismo. Evite bebidas açucaradas, sucos e chás.')}
      ${foodCard('Leguminosas',_c3,'Proteínas, fibras, ferro, zinco e vitaminas do complexo B. Feijão, grão de bico, ervilha, lentilha, soja. Escolha 1 opção por refeição e varie a proteína vegetal.')}
      ${foodCard('Frutas',_c0,'Fonte de vitaminas, minerais, fibras e energia. Ótimas para sobremesa e lanchinhos. Abacate, abacaxi, banana, caqui, goiaba, kiwi, laranja, maçã, mamão, melancia, morango, pêra, uva.')}
      ${foodCard('Cereais, Raízes e Tubérculos',_c1,'Fontes de vitaminas, minerais e energia. Arroz, macarrão, batata, mandioca, inhame, cará. Varie ao longo da semana e prefira os integrais pela maior presença de fibras e nutrientes.')}
      ${foodCard('Óleos e Gorduras',_c2,'Importantes para o desenvolvimento saudável e absorção de vitaminas. Use pequenas quantidades de azeite de oliva ou óleo de canola. Evite gorduras saturadas, trans, margarina e frituras.')}
      ${foodCard('Leite e Derivados',_c3,'Fonte de proteína, gordura, cálcio e vitamina A. Leite, coalhadas, iogurtes naturais sem açúcar e queijos. Ótimos para o café da manhã e lanches. Prefira versões integrais.')}
      ${foodCard('Oleaginosas',_c0,'Fontes de vitaminas, fibras, gorduras saudáveis e antioxidantes. Amêndoas, amendoim, avelã, castanha-de-caju, castanha-do-brasil, noz-pecã e pistache. Ótimas para os lanchinhos.')}
    </div>
    <div style="display:flex;justify-content:space-between;border-top:0.2mm solid #ddd;padding-top:2mm;margin-top:2mm;flex-shrink:0;">
      <span style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#999;">${clinicaNome}</span>
      <span style="font-family:'Montserrat',sans-serif;font-size:7pt;font-weight:900;color:${solidColor};text-transform:uppercase;">GUIA ALIMENTAR: MEU PRATINHO (VERSO)</span>
    </div>
  </div>
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div><div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
</div>

</body></html>`;

      const exP = document.getElementById('_gabarito_v2'); if (exP) exP.remove();
      const iframeP = document.createElement('iframe');
      iframeP.id = '_gabarito_v2';
      iframeP.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeP);
      iframeP.contentDocument.open(); iframeP.contentDocument.write(html); iframeP.contentDocument.close();
      const _pT_5593 = document.title; document.title = pdfTitle('Meu Pratinho');
      iframeP.contentWindow.document.fonts.ready.then(() => {
        const imgs = Array.from(iframeP.contentDocument.images);
        const waitImgs = imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }));
        Promise.all(waitImgs).then(() => {
          setTimeout(() => {
            iframeP.contentWindow.focus(); iframeP.contentWindow.print();
            setTimeout(() => { if (pratinhoBlob) URL.revokeObjectURL(pratinhoDataUrl); iframeP.remove(); }, 3000);
          }, 400);
        });
      });
      return;
    }

    if (item === 'Etiqueta para Correios') {
      const solidColor = borderColor || accentColor;
      const _ffEt = editData?.fontFamily || brand.editData?.fontFamily || 'Montserrat';
      const _lfEt = LOCAL_FONT_FACES[_ffEt];
      const fiEt = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">${_lfEt ? `<style>${_lfEt}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffEt)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const { instagram, telefone, whatsapp } = cartaoContacts || {};
      const mainPhone = whatsapp || telefone || '';
      const bgEt = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${(patternScale*0.2).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${solidColor};`;
      const igIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${solidColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="${solidColor}" stroke="none"/></svg>`;
      const waIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="${solidColor}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      // SIZES em mm (w/h) e px/mm do preview (scale/10) para calcular zoom
      const SIZES_ET = [
        {label:'10×10cm', w:100, h:100, previewScale:2.6},
        {label:'15×10cm', w:150, h:100, previewScale:2.2},
        {label:'10×15cm', w:100, h:150, previewScale:2.0},
      ];
      const FRASES_ET = ['Oba, chegou!','Com muito amor e cuidado','Feito especialmente pra você','Sua encomenda chegou!'];
      const selSize = SIZES_ET[etiquetaSizeIdx] || SIZES_ET[0];
      const selFrase = FRASES_ET[etiquetaFraseIdx] || FRASES_ET[0];
      const BLEED_ET = 3;
      // scaleFactor igual ao preview: size.w(cm) * 0.044 — selSize.w em mm, divide por 10
      const _etSF = (selSize.w / 10) * 0.044;
      // zoom: PDF px/mm (3.78) ÷ preview px/mm
      const _etZoom = (3.78 / selSize.previewScale).toFixed(3);
      const logoHtmlEt = `<div style="zoom:${_etZoom};display:flex;flex-direction:column;align-items:center;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: '#fff', layout: logoLayout || 'stacked', scaleFactor: _etSF, crmLine: null, maxWidth: '100mm', maxHeight: '30mm', withBackground: comBorda && patternSrc })}</div>`;
      // Marcas de corte padrão gráfica: ficam NO sangria, apontando para fora da área de corte
      // gap 0.5mm entre linha de corte e início da marca; marca com 2.5mm de comprimento
      const B = BLEED_ET;
      const cms = `
        <div style="position:absolute;top:${B}mm;left:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;left:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${B}mm;right:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${B}mm;left:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${B}mm;right:0;width:${B-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${B}mm;width:0.2mm;height:${B-0.5}mm;background:#000;"></div>`;
      const etiquetaBlock = `
        <div style="position:absolute;inset:0;${bgEt}"></div>
        <div style="position:absolute;top:${B}mm;left:${B}mm;width:${selSize.w}mm;height:${selSize.h}mm;">
          <div style="position:absolute;inset:3mm;border:0.3mm solid rgba(255,255,255,0.45);border-radius:2mm;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:82%;min-height:70%;background:rgba(255,255,255,0.88);border-radius:2.5mm;padding:5mm 5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3mm;">
            <div style="font-size:5.5mm;font-weight:800;color:${solidColor};font-family:'Montserrat',sans-serif;text-align:center;line-height:1.25;">${selFrase}</div>
            <div style="width:25%;height:0.2mm;background:${solidColor}40;"></div>
            ${logoHtmlEt}
            <div style="display:flex;flex-direction:column;align-items:center;gap:2mm;margin-top:4mm;">
              ${instagram ? `<div style="display:flex;align-items:center;gap:2mm;">${igIcon}<span style="font-size:3.5mm;color:${solidColor};font-family:'Montserrat',sans-serif;font-weight:600;">@${instagram.replace('@','')}</span></div>` : ''}
              ${mainPhone ? `<div style="display:flex;align-items:center;gap:2mm;">${waIcon}<span style="font-size:3.2mm;color:${solidColor}bb;font-family:'Montserrat',sans-serif;font-weight:400;">${mainPhone}</span></div>` : ''}
            </div>
          </div>
        </div>
        ${cms}`;
      const totalW = selSize.w + B*2, totalH = selSize.h + B*2;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Etiqueta Adesiva - ${marca}</title>${fiEt}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
html, body { width:${totalW}mm; height:${totalH}mm; overflow:hidden; }
@page { size:${totalW}mm ${totalH}mm; margin:0; }
</style></head><body>
<div style="position:relative;width:${totalW}mm;height:${totalH}mm;">${etiquetaBlock}</div>
</body></html>`;
      const exE = document.getElementById('_gabarito_etiq'); if (exE) exE.remove();
      const iframeE = document.createElement('iframe');
      iframeE.id = '_gabarito_etiq';
      iframeE.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:600mm;height:400mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeE);
      iframeE.contentDocument.open(); iframeE.contentDocument.write(html); iframeE.contentDocument.close();
      const _pT_5665 = document.title; document.title = pdfTitle('Etiqueta para Correios');
      iframeE.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeE.contentWindow.focus(); iframeE.contentWindow.print(); setTimeout(() => { iframeE.remove(); }, 3000); }, 1000); });
      return;
    }

        if (item === 'Receita de Alta') {
      const solidColor = borderColor || accentColor;
      const _ffRA = editData?.fontFamily || brand.editData?.fontFamily || 'Montserrat';
      const _lfRA = LOCAL_FONT_FACES[_ffRA];
      const fiRA = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700;1,800&display=swap" rel="stylesheet">${_lfRA ? `<style>${_lfRA}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffRA)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _lyRA = logoLayout || 'stacked';
      const logoHtmlRA = genPDFLogoHtml({ brand, editDataOverride: editData, color: '#fff', layout: _lyRA, localSlogan, crmLine: null, fontPt: 22, lineH: 1.1, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '140mm', maxHeight: '45mm', withBackground: comBorda && patternSrc });
      const html = buildReceitaAltaHTML({ logoHtml: logoHtmlRA, solidColor, paletteColors, clinicaNome, cartaoContacts, crmLine, marca, fields: receitaFields, comBorda, patternSrc, patternScale });
      const htmlFinal = html.replace('<head>', `<head>${fiRA.replace(/<link[^>]*>/, '')}`);
      const exRA = document.getElementById('_gabarito_receita_alta'); if (exRA) exRA.remove();
      const iframeRA = document.createElement('iframe');
      iframeRA.id = '_gabarito_receita_alta';
      iframeRA.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeRA);
      iframeRA.contentDocument.open(); iframeRA.contentDocument.write(htmlFinal); iframeRA.contentDocument.close();
      const _pT_5684 = document.title; document.title = pdfTitle('Receita de Alta');
      iframeRA.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeRA.contentWindow.focus(); iframeRA.contentWindow.print(); setTimeout(() => { iframeRA.remove(); }, 3000); }, 1000); });
      return;
    }

    if (item === 'Arte para Caneca' || item === 'Arte para Caneca') {
      const solidColor = borderColor || accentColor;
      const _ffC = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfC = LOCAL_FONT_FACES[_ffC];
      const fiC = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfC ? `<style>${_lfC}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffC)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const hasCustomLogoC = !!itemEditData?.customLogoSrc;
      const effectiveLayoutC = (comBorda && patternSrc && !hasCustomLogoC) ? 'balanced' : (logoLayout || 'stacked');
      const _sfC = (comBorda && patternSrc) ? 1.06 : 1.68; // 2x vs preview (logo no PDF era metade)
      const logoHtmlC = ReactDOMServer.renderToString(<LogoPreviewHTML editData={itemEditData} color="#ffffff" layout={effectiveLayoutC} scaleFactor={_sfC} crm={null} hideTagline={true} withBackground={hasCustomLogoC} />);
      const circleD = 32;
      const circleBgC = (comBorda && patternSrc) ? solidColor + 'cc' : 'rgba(255,255,255,0.22)';
      const bgStyleC = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${(patternScale*0.35).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${solidColor};`;
      const mkCircle = (leftPct) => `<div style="position:absolute;top:50%;left:${leftPct};transform:translate(-50%,-50%);width:${circleD}mm;height:${circleD}mm;border-radius:50%;background:${circleBgC};display:flex;align-items:center;justify-content:center;text-align:center;">${logoHtmlC}</div>`;
      const BC = 3; // bleed 3mm
      const TW = 200 + BC*2, TH = 80 + BC*2;
      const cmsC = `
        <div style="position:absolute;top:${BC}mm;left:0;width:${BC-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;left:${BC}mm;width:0.2mm;height:${BC-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${BC}mm;right:0;width:${BC-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${BC}mm;width:0.2mm;height:${BC-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BC}mm;left:0;width:${BC-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${BC}mm;width:0.2mm;height:${BC-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BC}mm;right:0;width:${BC-0.5}mm;height:0.2mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${BC}mm;width:0.2mm;height:${BC-0.5}mm;background:#000;"></div>`;
      const hasPattern = comBorda && patternSrc;
      // Círculo: só para logo de texto com estampa. Logo imagem já tem fundo branco próprio.
      const useCircle = hasPattern && !hasCustomLogoC;
      const logoPos = (leftPct) => useCircle
        ? mkCircle(leftPct)
        : `<div style="position:absolute;top:50%;left:${leftPct};transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;">${logoHtmlC}</div>`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Arte Caneca - ${marca}</title>${fiC}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
html, body { width:${TW}mm; height:${TH}mm; overflow:hidden; }
@page { size:${TW}mm ${TH}mm; margin:0; }
</style></head><body>
<div style="width:${TW}mm;height:${TH}mm;position:relative;overflow:hidden;${bgStyleC}">
  <div style="position:absolute;top:${BC}mm;left:${BC}mm;width:200mm;height:80mm;overflow:hidden;">
    ${logoPos('25%')}
    ${logoPos('75%')}
    <div style="position:absolute;top:10%;bottom:10%;left:50%;width:0.3mm;background:rgba(255,255,255,0.25);"></div>
  </div>
  ${cmsC}
</div>
</body></html>`;
      const exC = document.getElementById('_gabarito_caneca'); if (exC) exC.remove();
      const iframeC = document.createElement('iframe');
      iframeC.id = '_gabarito_caneca';
      iframeC.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400mm;height:200mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeC);
      iframeC.contentDocument.open(); iframeC.contentDocument.write(html); iframeC.contentDocument.close();
      const _pT_5734 = document.title; document.title = pdfTitle('Arte para Caneca');
      iframeC.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeC.contentWindow.focus(); iframeC.contentWindow.print(); setTimeout(() => { iframeC.remove(); }, 3000); }, 1000); });
      return;
    }


    if (item === 'Papel de Presente') {
      const solidColor = borderColor || accentColor;
      const BLEED = 3; // 3mm sangria
      const SIZES_PP = [
        { label:'49,8 × 72,5 cm', w:498, h:725 },
        { label:'A4 — 21 × 29,7 cm', w:210, h:297 },
        { label:'72,8 × 104,3 cm', w:728, h:1043 },
      ];
      const selPP = SIZES_PP[papelPresenteSizeIdx] || SIZES_PP[1];
      const totalW = selPP.w + BLEED*2, totalH = selPP.h + BLEED*2;
      const bgPP = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${(patternScale*0.93).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${solidColor};`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Papel de Presente - ${marca}</title>
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
html, body { width:${totalW}mm; height:${totalH}mm; overflow:hidden; }
@page { size:${totalW}mm ${totalH}mm; margin:0; }
</style></head><body>
<div style="width:${totalW}mm;height:${totalH}mm;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;${bgPP}"></div>
  <!-- Marcas de corte -->
  <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;width:8mm;height:0.3mm;background:#fff;opacity:0.5;"></div><div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;width:0.3mm;height:8mm;background:#fff;opacity:0.5;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:${BLEED}mm;width:8mm;height:0.3mm;background:#fff;opacity:0.5;"></div><div style="position:absolute;top:${BLEED}mm;right:${BLEED}mm;width:0.3mm;height:8mm;background:#fff;opacity:0.5;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:${BLEED}mm;width:8mm;height:0.3mm;background:#fff;opacity:0.5;"></div><div style="position:absolute;bottom:${BLEED}mm;left:${BLEED}mm;width:0.3mm;height:8mm;background:#fff;opacity:0.5;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:${BLEED}mm;width:8mm;height:0.3mm;background:#fff;opacity:0.5;"></div><div style="position:absolute;bottom:${BLEED}mm;right:${BLEED}mm;width:0.3mm;height:8mm;background:#fff;opacity:0.5;"></div>
</div>
</body></html>`;
      const exPP = document.getElementById('_gabarito_pp'); if (exPP) exPP.remove();
      const iframePP = document.createElement('iframe');
      iframePP.id = '_gabarito_pp';
      iframePP.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${totalW+10}mm;height:${totalH+10}mm;border:none;visibility:hidden;`;
      document.body.appendChild(iframePP);
      iframePP.contentDocument.open(); iframePP.contentDocument.write(html); iframePP.contentDocument.close();
      const _pT_5772 = document.title; document.title = pdfTitle('Papel de Presente');
      iframePP.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframePP.contentWindow.focus(); iframePP.contentWindow.print(); setTimeout(() => { iframePP.remove(); }, 3000); }, 800); });
      return;
    }

        if (item === 'Tag para Sacola') {
      const solidColor = borderColor || accentColor;
      const _ffT = editData?.fontFamily || brand.editData?.fontFamily || 'Montserrat';
      const _lfT = LOCAL_FONT_FACES[_ffT];
      const fiT = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfT ? `<style>${_lfT}</style>` : ''}`;
      const BLEED = 3;
      const SIZES_T = [
        { label:'9 × 4,8 cm', w:90, h:48, shape:'rect' },
        { label:'4,8 × 4,8 cm', w:48, h:48, shape:'square' },
        { label:'6 × 6 cm', w:60, h:60, shape:'circle' },
      ];
      const bgT = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${(patternScale*0.38).toFixed(1)}mm;background-repeat:repeat;`
        : `background:${solidColor};`;
      const logoHtmlFrenteT = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${ReactDOMServer.renderToString(<LogoPreviewHTML editData={editData || {}} color={comBorda && patternSrc ? solidColor : '#fff'} layout={logoLayout || 'stacked'} scaleFactor={0.45} crm={null} hideTagline={false} maxWidth="100%" maxHeight="100%" />)}</div>`;
      const { telefone, whatsapp, instagram, site } = cartaoContacts || {};
      const mainPhone = whatsapp || telefone || '';

      const tagBlock = (w, h, shape) => {
        const isCircle = shape === 'circle';
        const isSquare = shape === 'square';
        const totalW = w + BLEED*2, totalH = h + BLEED*2;
        const holeD = Math.round(w * 0.06);
        const logoWrap = (comBorda && patternSrc)
          ? ReactDOMServer.renderToString(<LogoPreviewHTML editData={editData || {}} color={solidColor} layout={logoLayout || 'stacked'} scaleFactor={0.45} crm={null} hideTagline={false} withBackground={true} maxWidth={`${w*0.82}mm`} maxHeight={`${h*0.55}mm`} />)
          : ReactDOMServer.renderToString(<LogoPreviewHTML editData={editData || {}} color={'#fff'} layout={logoLayout || 'stacked'} scaleFactor={0.45} crm={null} hideTagline={false} taglineColor="rgba(255,255,255,0.75)" maxWidth="100%" maxHeight="100%" />);
        const frente = `
          <div style="width:${totalW}mm;height:${totalH}mm;position:relative;overflow:hidden;border-radius:${isCircle ? '50%' : '2mm'};">
            <div style="position:absolute;inset:0;${bgT}"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:2;">${logoWrap}</div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;display:flex;flex-direction:column;align-items:center;gap:${isCircle ? 1 : 2}mm;text-align:center;">
              ${clinicaNome ? `<div style="font-size:${isCircle ? 4 : 5}mm;color:${solidColor};font-family:'Brush Script MT','Segoe Script',cursive;">${clinicaNome}</div>` : ''}
              <div style="width:5mm;height:0.2mm;background:${solidColor}60;"></div>
              ${mainPhone ? `<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;font-weight:400;">${mainPhone}</div>` : ''}
              ${instagram ? `<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;">@${instagram.replace('@','')}</div>` : ''}
              ${site ? `<div style="font-size:2.5mm;color:#bbb;font-family:'Montserrat',sans-serif;">${site}</div>` : ''}
            </div>
          </div>`;
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:2mm;">
          <div style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#999;font-weight:700;">${w}×${h}mm · ${isCircle?'Redondo':isSquare?'Quadrado':'Retangular'}</div>
          <div style="display:flex;gap:6mm;align-items:center;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:1mm;"><div style="font-size:6pt;color:#bbb;font-family:'Montserrat',sans-serif;">Frente</div>${frente}</div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:1mm;"><div style="font-size:6pt;color:#bbb;font-family:'Montserrat',sans-serif;">Verso</div>${verso}</div>
          </div>
        </div>`;
      };

      const selT = SIZES_T[tagSacolaSizeIdx] || SIZES_T[0];
      const totalW_T = selT.w + BLEED*2, totalH_T = selT.h + BLEED*2;
      const isCircleT = selT.shape === 'circle';
      const holeDT = (selT.w * 0.06).toFixed(1);
      const bgSizeT = ((patternScale || 100) / 10).toFixed(1);
      const bgTFixed = comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${bgSizeT}mm;background-repeat:repeat;` : `background:${solidColor};`;
      const logoScaleT = selT.shape === 'square' ? 0.72 : selT.shape === 'circle' ? 0.68 : 0.65;
      const _tagSF = selT.shape === 'square' ? (selT.w/10) * 0.28 : (selT.w/10) * 0.22;
      const _tagZoom = (3.78 / 2.8).toFixed(3); // PDF px/mm ÷ preview px/mm = 1.35x boost
      const _tagLogoInner = (comBorda&&patternSrc)
        ? ReactDOMServer.renderToString(<LogoPreviewHTML item="Tag para Sacola" editData={itemEditData} color={solidColor} layout={logoLayout||'stacked'} scaleFactor={_tagSF} crm={null} hideTagline={false} withBackground={true} maxWidth={`${(selT.w+BLEED*2)*3.78}px`} maxHeight={`${(selT.h+BLEED*2)*3.78}px`} />)
        : ReactDOMServer.renderToString(<LogoPreviewHTML item="Tag para Sacola" editData={itemEditData} color={'#fff'} layout={logoLayout||'stacked'} scaleFactor={_tagSF} crm={null} hideTagline={false} taglineColor="rgba(255,255,255,0.75)" maxWidth={`${(selT.w+BLEED*2)*3.78}px`} maxHeight={`${(selT.h+BLEED*2)*3.78}px`} />);
      const logoWrapT = `<div style="zoom:${_tagZoom};">${_tagLogoInner}</div>`;
      const _cms = `
        <div style="position:absolute;top:0;left:${BLEED}mm;width:0.1mm;height:${BLEED-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${BLEED}mm;width:0.1mm;height:${BLEED-0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.1mm;height:${BLEED-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.1mm;height:${BLEED-0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.1mm;background:#000;"></div>`;
      const frentePageT = `<div style="width:${totalW_T}mm;height:${totalH_T}mm;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;${bgTFixed}"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:2;">${logoWrapT}</div>${_cms}</div>`;
      const versoPageT = `<div style="width:${totalW_T}mm;height:${totalH_T}mm;position:relative;overflow:hidden;background:#fff;"><div style="position:absolute;inset:0;border:5mm solid ${solidColor};border-radius:${isCircleT?'50%':'0'};"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;display:flex;flex-direction:column;align-items:center;gap:${isCircleT?1:2}mm;text-align:center;">${clinicaNome?`<div style="font-size:${isCircleT?4:5}mm;color:${solidColor};font-family:'Brush Script MT','Segoe Script',cursive;">${clinicaNome}</div>`:''}<div style="width:5mm;height:0.2mm;background:${solidColor}60;"></div>${mainPhone?`<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;">${mainPhone}</div>`:''}${instagram?`<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;">@${instagram.replace('@','')}</div>`:''}${site?`<div style="font-size:2.5mm;color:#bbb;font-family:'Montserrat',sans-serif;">${site}</div>`:''}</div>${_cms}</div>`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tag para Sacola - ${marca}</title>${fiT}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
.page { width:${totalW_T}mm; height:${totalH_T}mm; display:flex; align-items:center; justify-content:center; page-break-after:always; }
@media print { @page { size:${totalW_T}mm ${totalH_T}mm; margin:0; } }
</style></head><body>
<div class="page">${frentePageT}</div>
<div class="page">${versoPageT}</div>
</body></html>`;
      const exT = document.getElementById('_gabarito_tag'); if (exT) exT.remove();
      const iframeT = document.createElement('iframe');
      iframeT.id = '_gabarito_tag';
      iframeT.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${totalW_T+10}mm;height:${totalH_T*2+20}mm;border:none;visibility:hidden;`;
      document.body.appendChild(iframeT);
      iframeT.contentDocument.open(); iframeT.contentDocument.write(html); iframeT.contentDocument.close();
      const _pT_5861 = document.title; document.title = pdfTitle('Tag para Sacola');
      iframeT.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeT.contentWindow.focus(); iframeT.contentWindow.print(); setTimeout(() => { iframeT.remove(); }, 3000); }, 1000); });
      return;
    }

        if (item === 'Sacola de Papel') {
      const SIZES_S = [{ label:'P — 18×25cm', w:180, h:250 }, { label:'M — 24×31cm', w:240, h:310 }, { label:'G — 30×40cm', w:300, h:400 }];
      const solidColor = borderColor || accentColor;
      const _ffS = editData?.fontFamily || brand.editData?.fontFamily || 'Montserrat';
      const _lfS = LOCAL_FONT_FACES[_ffS];
      const fiS = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfS ? `<style>${_lfS}</style>` : ''}`;

      const arteFlat = (w, h, label) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4mm;">
          <div style="font-family:'Montserrat',sans-serif;font-size:9pt;color:#999;font-weight:700;">${label}</div>
          <div style="width:${w}mm;height:${h}mm;position:relative;overflow:hidden;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${(patternScale*0.4).toFixed(1)}mm;background-repeat:repeat;` : `background:${solidColor};`}">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-5deg);width:60%;text-align:center;">
              ${logoHtml}
            </div>
          </div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sacola de Papel - ${marca}</title>${fiS}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { background:#f0f0f0; display:flex; flex-wrap:wrap; gap:10mm; padding:10mm; justify-content:center; align-items:flex-start; }
@media print { body { background:none; gap:8mm; padding:5mm; } @page { size:auto; margin:5mm; } }
</style></head><body>
${SIZES_S.map(s => arteFlat(s.w, s.h, s.label)).join('')}
</body></html>`;

      const exS = document.getElementById('_gabarito_sacola'); if (exS) exS.remove();
      const iframeS = document.createElement('iframe');
      iframeS.id = '_gabarito_sacola';
      iframeS.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1200mm;height:1000mm;border:none;visibility:hidden;';
      document.body.appendChild(iframeS);
      iframeS.contentDocument.open(); iframeS.contentDocument.write(html); iframeS.contentDocument.close();
      const _pT_5896 = document.title; document.title = pdfTitle('Sacola de Papel');
      iframeS.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeS.contentWindow.focus(); iframeS.contentWindow.print(); setTimeout(() => { iframeS.remove(); }, 3000); }, 1000); });
      return;
    }

      if (item.includes('Controle Especial')) {
        const BLEED = 3;
        const _brandData = editData || {};
        const _ffCe = _brandData.fontFamily || 'Playfair Display';
        const _lfCe = LOCAL_FONT_FACES[_ffCe];
        const fiCe = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfCe ? `<style>${_lfCe}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffCe.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
        
        const W = 148, H = 210;
        const BORDER = 10;
        const _accent = brand.activeColor || '#dc3495';
        const _bcCe = borderColor || _accent;
        
        const patternBorder = (comBorda && patternSrc) ? `
          <div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.42).toFixed(1)}mm;background-repeat:repeat;z-index:1;"></div>
          <div style="position:absolute;top:${BORDER}mm;left:${BORDER}mm;right:${BORDER}mm;bottom:${BORDER}mm;background:#fff;z-index:2;"></div>
        ` : comBorda ? `<div style="position:absolute;inset:0;background:#fff;z-index:1;"></div>` : `<div style="position:absolute;inset:0;background:#fff;border:${BORDER}mm solid ${_bcCe};box-sizing:border-box;z-index:1;"></div>`;

        const _lColor = logoColor || _accent;
        const _lLayout = logoLayout || 'stacked';
        const logoHtmlCe = genPDFLogoHtml({ brand, editDataOverride: editData, color: _lColor, layout: _lLayout, localSlogan, crmLine, fontPt: 10, lineH: 1.1, letterSp: '0.5pt', hideSlogan: true, crmSize: '0', customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '34mm', maxHeight: '28mm', withBackground: comBorda && patternSrc });

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receituário Controle Especial - ${marca}</title>${fiCe}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${W + BLEED*2}mm; height:${H + BLEED*2}mm; position:relative; overflow:hidden; background:#fff; font-family:'Montserrat',sans-serif; }
.cm { position:absolute; width:10mm; height:10mm; border-color:rgba(0,0,0,0.5); border-style:solid; border-width:0; pointer-events:none; z-index:10; }
.cm-tl { top:${BLEED}mm; left:${BLEED}mm; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:${BLEED}mm; right:${BLEED}mm; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:${BLEED}mm; left:${BLEED}mm; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:${BLEED}mm; right:${BLEED}mm; border-bottom:0.2mm solid; border-right:0.2mm solid; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin:0; } }
</style></head><body>
<div style="position:relative;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;overflow:hidden;">
    ${patternBorder}
    
    <div style="position:absolute;top:${BLEED + BORDER + 8}mm;left:${BLEED + BORDER + 8}mm;right:${BLEED + BORDER + 8}mm;bottom:${BLEED + BORDER + 4}mm;display:flex;flex-direction:column;gap:3mm;z-index:3;">
        <div style="text-align:center;font-size:9pt;font-weight:800;color:#aaa;letter-spacing:2pt;text-transform:uppercase;margin-bottom:1mm;">RECEITUÁRIO DE CONTROLE ESPECIAL</div>

        <div style="display:flex;gap:6mm;align-items:stretch;">
            <div style="flex:2.5;background:${_accent}08;border:0.2mm solid ${_accent}20;padding:3mm 4mm;border-radius:1.5mm;">
                <div style="font-size:7pt;font-weight:800;color:${_accent};margin-bottom:1.5mm;border-bottom:0.2mm solid ${_accent}20;padding-bottom:1mm;text-transform:uppercase;">IDENTIFICAÇÃO DO EMITENTE</div>
                <div style="font-size:7.5pt;line-height:1.5;color:#444;">
                    <div style="font-weight:700;color:${_accent};">${clinicaNome || marca}</div>
                    ${crmLine ? `<div style="font-weight:700;">${crmLine}</div>` : ''}
                    ${endereco ? `<div style="opacity:0.8;font-size:6.5pt;margin-top:0.5mm;">${endereco}</div>` : ''}
                    ${allPhones ? `<div style="font-weight:700;margin-top:0.5mm;font-size:7pt;white-space:nowrap;">${allPhones}</div>` : ''}
                    ${email ? `<div style="opacity:0.8;font-size:6.5pt;">${email}</div>` : ''}
                    ${site ? `<div style="opacity:0.8;font-size:6.5pt;">${site}</div>` : ''}
                </div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;">
                <div style="width:38mm;min-height:20mm;max-height:35mm;display:flex;align-items:center;justify-content:center;overflow:hidden;">${logoHtmlCe}</div>
                <div style="font-size:6.5pt;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:0.5pt;text-align:center;line-height:1.4;">1ª VIA FARMÁCIA<br/>2ª VIA PACIENTE</div>
            </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:2.5mm;">
            ${['PACIENTE', 'ENDEREÇO'].map(l => `<div style="border-bottom:0.15mm solid #eee;padding-bottom:1.5mm;display:flex;gap:3mm;"><span style="font-size:8pt;font-weight:700;color:#333;text-transform:uppercase;">${l}:</span></div>`).join('')}
            <div style="margin-top:1mm;">
               <div style="font-size:8pt;font-weight:700;color:#333;margin-bottom:1mm;">PRESCRIÇÃO:</div>
               ${Array.from({length: 8}).map(() => `<div style="border-bottom:0.1mm solid #f2f2f2;height:7mm;"></div>`).join('')}
            </div>
        </div>

        <div style="margin-top:auto;display:flex;gap:15mm;align-items:flex-start;padding:0 5mm;margin-bottom:3mm;">
             <div style="width:38mm;display:flex;flex-direction:column;align-items:center;">
                <div style="width:100%;border-top:0.2mm solid #999;"></div>
                <div style="font-size:7pt;font-weight:400;margin-top:1.5mm;color:#888;">Data</div>
             </div>
             <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                <div style="width:100%;border-top:0.2mm solid #999;"></div>
                <div style="font-size:7pt;font-weight:400;margin-top:1.5mm;color:#888;">Assinatura do Médico</div>
             </div>
        </div>

        <div style="display:flex;gap:6mm;height:24mm;">
             <div style="flex:1;background:${_accent}10;border:0.2mm solid ${_accent}25;padding:2.5mm 4mm;border-radius:1.5mm;">
                <div style="font-size:6.5pt;font-weight:800;color:${_accent};margin-bottom:1.5mm;text-align:center;text-transform:uppercase;">IDENTIFICAÇÃO DO COMPRADOR</div>
                <div style="display:flex;flex-direction:column;gap:1mm;">
                  ${['Nome', 'Ident.', 'Endereço', 'Cidade'].map(f => `<div style="border-bottom:0.1mm solid rgba(0,0,0,0.08);height:3.5mm;"></div>`).join('')}
                </div>
             </div>
             <div style="flex:1;border:0.2mm solid #ddd;border-radius:1.5mm;position:relative;">
                <div style="position:absolute;bottom:2.5mm;left:0;right:0;text-align:center;font-size:6pt;color:#bbb;text-transform:uppercase;font-weight:700;">ASSINATURA DO FARMACÊUTICO</div>
             </div>
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
        iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle('Receituário de Controle Especial'); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
        return;
      }
      if (item === 'Recibo') {
        const BLEED = 3;
        const _ffRec = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
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
.cm-tl { top:${BLEED}mm; left:${BLEED}mm; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:${BLEED}mm; right:${BLEED}mm; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:${BLEED}mm; left:${BLEED}mm; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:${BLEED}mm; right:${BLEED}mm; border-bottom:0.2mm solid; border-right:0.2mm solid; }
.field { border-bottom: 0.2mm solid #ddd; padding: 2mm 0; font-size: 10pt; color: #333; margin-top: 4mm; display:flex; gap: 4mm; align-items:flex-end; }
.label { font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 8pt; flex-shrink: 0; margin-bottom: 0.5mm; }
table { width: 100%; border-collapse: collapse; margin-top: 10mm; }
th { background: #f5f5f5; color: #1a1a1a; font-size: 8pt; text-transform: uppercase; padding: 3mm; text-align: left; border: 0.2mm solid #eee; }
td { padding: 4mm 3mm; border: 0.2mm solid #eee; font-size: 10pt; color: #555; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin:0; } }
</style></head><body>
<div style="position:relative;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;overflow:hidden;">
    ${patternBorder}
    <div style="position:absolute;top:${BLEED + BORDER + 8}mm;left:${BLEED + BORDER + 12}mm;right:${BLEED + BORDER + 12}mm;bottom:${BLEED + BORDER + 18}mm;display:flex;flex-direction:column;">
        
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12mm;padding-bottom:4mm;border-bottom:0.1mm solid #f0f0f0;">
            <div style="width:65mm;display:flex;justify-content:flex-start;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 1.5).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '60mm', maxHeight: '32mm', alignLeft: true, withBackground: comBorda && patternSrc })}</div>
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
                ${Array.from({length: 5}).map(() => `<tr><td></td><td></td><td></td></tr>`).join('')}
                <tr><td colspan="2" style="text-align:right;font-weight:700;color:#1a1a1a;">TOTAL</td><td style="background:#f9f9f9;"></td></tr>
            </tbody>
        </table>

        <div style="margin-top:auto;display:flex;flex-direction:column;align-items:center;">
             <div style="width:80mm;border-top:0.2mm solid #333;margin-bottom:3mm;"></div>
             <div style="font-size:9pt;font-weight:700;color:#1a1a1a;">${clinicaNome || marca}</div>
             <div style="font-size:7.5pt;color:#999;margin-top:1mm;text-transform:uppercase;letter-spacing:1pt;">${crmLine || ''}</div>
        </div>

        <div style="margin-top:6mm;padding-top:4mm;border-top:0.2mm solid #f0f0f0;display:flex;justify-content:space-between;font-size:7pt;color:#888;">
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
        iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle('Recibo'); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
        return;
      }

      if (['Guia Alimentar', 'Guia de Cuidados', 'Guia de Desenvolvimento', 'Guia de Vacina c/ Calendário', 'Cartão de Vacina', 'Cartão de Exame Pré-Natal', 'Cartão de Exames Pré-Natal', 'Guia de Amamentação', 'Guia do Sono'].includes(item)) {
        const isPrenatal = item.includes('Pré-Natal');
        const isAmamentacao = item.includes('Amamentação');
        const BLEED = 5;

        if (isAmamentacao) {
          // Folder DL (8 páginas - 4 de cada lado)
          const W = 100, H = 200;
          const totalW = (W * 4) + (BLEED * 2);
          const totalH = H + (BLEED * 2);

          const _ffAmam = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
          const _lfAmam = LOCAL_FONT_FACES[_ffAmam];
          const fiAmam = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">${_lfAmam ? `<style>${_lfAmam}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffAmam.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;

          const logoHtmlAmam = genPDFLogoHtml({ 
            brand, 
            editDataOverride: editData, 
            color: logoColor, 
            layout: logoLayout, 
            localSlogan, 
            crmLine, 
            fontPt: 12, 
            lineH: 1.1, 
            letterSp: _letterSp, 
            customLogoSrc, 
            customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
            maxWidth: '28mm', 
            maxHeight: '12mm',
            withBackground: comBorda && patternSrc
          });
          const illustSrc = "/breastfeeding-guide.png";

          const pages = [
            ReactDOMServer.renderToString(<FolderAmamentacaoPage1 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} logoComponent={<div dangerouslySetInnerHTML={{ __html: logoHtmlAmam }} />} folderRoof={folderRoof} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage2 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage3 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage4 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} clinicaNome={clinicaNome} endereco={endereco} allPhones={allPhones} brand={brand} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage5 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage6 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage7 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} />),
            ReactDOMServer.renderToString(<FolderAmamentacaoPage8 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} />),
          ];

          const _amamBg = comBorda && patternSrc
            ? `background-image:url(${patternSrc});background-size:25mm;background-repeat:repeat;`
            : `background:${borderColor || paletteColors[0] || accentColor};`;
          const renderSide = (pageIndices) => `
            <div class="page">
              <!-- Fundo full-bleed cobrindo sangria -->
              <div style="position:absolute;inset:0;${comBorda ? _amamBg : _amamBg}z-index:0;"></div>
              <div class="face">
                ${pageIndices.map((idx, i) => `
                  <div class="panel" style="${i < 3 ? 'border-right:0.1mm dashed rgba(0,0,0,0.1);' : ''} position:relative;">
                    <!-- White Content Box inset dentro do trim -->
                    <div style="position:absolute;top:${BLEED+4}mm;left:${i===0?BLEED+4:4}mm;right:${i===3?BLEED+4:4}mm;bottom:${BLEED+4}mm;background:#fff;border-radius:0.4mm;z-index:2;overflow:hidden;${(idx === 0 && folderRoof) ? 'clip-path:polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%);' : ''}">
                      <div style="width:${W}px;height:${H}px;transform:scale(3.45);transform-origin:top left;">${pages[idx]}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
              <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
            </div>`;

          const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title>${fiAmam}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { font-family:'Montserrat',sans-serif; }
.page { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; background:#fff; border: 1px solid #eee; }
.face { display:flex; width:100%; height:100%; position:relative; }
.panel { flex:1; height:100%; position:relative; overflow:hidden; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } .page { page-break-after:always; border:none; } }
</style></head><body>
<!-- FACE 1: Pág 4 | Pág 3 | Pág 2 | Pág 1 -->
${renderSide([3, 2, 1, 0])}
<!-- FACE 2: Pág 5 | Pág 6 | Pág 7 | Pág 8 -->
${renderSide([4, 5, 6, 7])}
</body></html>`;

          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
          document.body.appendChild(iframe);
          iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
          const prevT = document.title;
          iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle(item); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
          return;
        }

        if (isPrenatal) {
          // Folder A5 (4 páginas)
          const W = 148, H = 210;
          const totalW = (W * 2) + (BLEED * 2);
          const totalH = H + (BLEED * 2);
          const scaleF = (totalH / 2) / H;

          const _ffPrenatal = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
          const _lfPrenatal = LOCAL_FONT_FACES[_ffPrenatal];
          const fiPrenatal = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">${_lfPrenatal ? `<style>${_lfPrenatal}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffPrenatal)}:wght@400;700&display=swap" rel="stylesheet">`}`;

          const logoHtmlPrenatal = genPDFLogoHtml({ 
            brand, 
            editDataOverride: editData, 
            color: logoColor, 
            layout: logoLayout, 
            localSlogan, 
            crmLine, 
            fontPt: 13, 
            lineH: 1.1, 
            letterSp: _letterSp, 
            customLogoSrc, 
            customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
            maxWidth: '70mm', 
            maxHeight: '32mm',
            withBackground: comBorda && !!patternSrc
          });

          const themeTaglinePrenatal = item.includes('Pré-Natal') ? 'CUIDANDO DESDE O INÍCIO..' : 'Saúde e Bem-Estar Pediátrico';
          const finalTaglinePrenatal = (item.includes('Pré-Natal')) ? themeTaglinePrenatal : (brand.editData?.tagline || themeTaglinePrenatal);

          const p1 = ReactDOMServer.renderToString(<PrenatalPage1 accentColor={accentColor} palette={paletteColors} logoComponent={<div dangerouslySetInnerHTML={{ __html: logoHtmlPrenatal }} />} folderRoof={folderRoof} tagline={finalTaglinePrenatal} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} />);
          const p2 = ReactDOMServer.renderToString(<PrenatalPage2 accentColor={accentColor} palette={paletteColors} />);
          const p3 = ReactDOMServer.renderToString(<PrenatalPage3 accentColor={accentColor} palette={paletteColors} />);
          const p4 = ReactDOMServer.renderToString(<PrenatalPage4 accentColor={accentColor} palette={paletteColors} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} />);

          // Escala exata 1px=1mm; fundo das páginas 1 e 4 estendido para cobrir a sangria
          const PX = 3.7795;
          const sX = PX.toFixed(4);
          const sY = PX.toFixed(4);
          const prenatalBg = borderColor || paletteColors[0] || accentColor;
          const prenatalBgStyle = (comBorda && patternSrc)
            ? `background-image:url(${patternSrc});background-size:${(patternScale||120)*0.56}px;background-repeat:repeat;`
            : `background:${prenatalBg};`;

          const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title>${fiPrenatal}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { font-family:'Montserrat',sans-serif; }
.page { width:${totalW}mm; height:${totalH}mm; position:relative; overflow:hidden; display:flex; }
.panel { width:50%; height:100%; position:relative; overflow:hidden; flex-shrink:0; }
@media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } .page { page-break-after:always; } }
</style></head><body>
<!-- FACE 1: Pág 4 (verso capa) | Pág 1 (capa) -->
<div style="position:relative;width:${totalW}mm;height:${totalH}mm;">
  <div class="page" style="position:absolute;top:0;left:0;">
    <div class="panel" style="border-right:0.1mm dashed #ccc;${prenatalBgStyle}">
      <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;">
        <div style="width:148px;height:210px;transform:scale(${sX});transform-origin:top left;">${p4}</div>
      </div>
    </div>
    <div class="panel" style="${prenatalBgStyle}">
      <div style="position:absolute;top:${BLEED}mm;left:0;">
        <div style="width:148px;height:210px;transform:scale(${sX});transform-origin:top left;">${p1}</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
</div>
<!-- FACE 2: Pág 2 | Pág 3 -->
<div style="position:relative;width:${totalW}mm;height:${totalH}mm;page-break-before:always;">
  <div class="page" style="position:absolute;top:0;left:0;">
    <div class="panel" style="border-right:0.1mm dashed #ccc;">
      <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;">
        <div style="width:148px;height:210px;transform:scale(${sX});transform-origin:top left;">${p2}</div>
      </div>
    </div>
    <div class="panel">
      <div style="position:absolute;top:${BLEED}mm;left:0;">
        <div style="width:148px;height:210px;transform:scale(${sX});transform-origin:top left;">${p3}</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
</div>
</body></html>`;

          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
          document.body.appendChild(iframe);
          iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
          const prevT = document.title;
          iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle(item); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
          return;
        }

        const _darkenHex = (hex, factor = 0.55) => { const h = (hex||'').replace('#',''); if(h.length<6) return hex; const r=Math.round(parseInt(h.substring(0,2),16)*factor); const g=Math.round(parseInt(h.substring(2,4),16)*factor); const b=Math.round(parseInt(h.substring(4,6),16)*factor); return `rgb(${r},${g},${b})`; };
        const W1 = 146, W2 = 148, W3 = 148;
        const totalW = W1 + W2 + W3 + (BLEED * 2);
        const totalH = 210 + (BLEED * 2);

        const _getTitleData = (raw) => {
          if (raw.includes('Alimentar')) return { tagline: 'Nutrição e Saúde para o seu Bebê' };
          if (raw.includes('Cuidados')) return { tagline: 'Carinho e Atenção em Cada Detalhe' };
          if (raw.includes('Desenvolvimento')) return { tagline: 'Acompanhe Cada Passo do Crescimento do Seu Bebê' };
          if (raw.includes('Vacina')) return { tagline: 'Calendário e Acompanhamento de Imunização' };
          if (raw.includes('Sono')) return { tagline: 'Rotina e Segurança para o Sono do Bebê' };
          if (raw.includes('Pré-Natal')) return { tagline: 'Cuidando da saúde do bebê e da mamãe desde o início...' };
          return { tagline: 'Saúde e Bem-Estar Pediátrico' };
        };
        const finalTagline = brand.editData?.tagline || _getTitleData(item).tagline;

        const _ffTri = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
        const _lfTri = LOCAL_FONT_FACES[_ffTri];
        const fiTri = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">${_lfTri ? `<style>${_lfTri}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffTri.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
        
        const renderPattern = (opacity = 1, sizeBoost = 0.45) => {
          if (comBorda && patternSrc) {
            return `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * sizeBoost).toFixed(1)}mm;background-repeat:repeat;opacity:${opacity};z-index:1;"></div>`;
          }
          const solidBg = borderColor || paletteColors[0] || accentColor;
          return `<div style="position:absolute;inset:0;background:${solidBg};opacity:${opacity};z-index:1;"></div>`;
        };

        const renderTrifoldFace = (panels, withMargem = true) => {
          return `
            <div class="page" style="width:${totalW}mm;height:${totalH}mm;position:relative;overflow:hidden;background:#fff;${panels[0].num === 2 ? 'page-break-before:always;' : ''}">
              ${withMargem ? renderPattern(1) : renderPattern(0.1)}
              
              <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;gap:0;z-index:2;">
                ${panels.map((p, i) => `
                  <div style="flex:0 0 ${p.w}mm; position:relative; overflow:hidden; ${i < 2 ? 'border-right:0.1mm dashed rgba(0,0,0,0.1);' : ''}">
                    ${withMargem ? `
                      <div style="position:absolute;top:5mm;left:5mm;right:5mm;bottom:5mm;background:#fff;border:0.2mm solid ${accentColor}30;z-index:2;box-shadow:0 3mm 10mm rgba(0,0,0,0.15);overflow:hidden;${p.clip ? 'clip-path:'+p.clip+';-webkit-clip-path:'+p.clip+';' : ''}">
                        ${p.content}
                      </div>
                    ` : `
                      <div style="width:100%;height:100%;position:relative;overflow:hidden;z-index:2;">
                        ${p.content}
                      </div>
                    `}
                  </div>
                `).join('')}
              </div>

              <div class="cm-h cm-tl-h"></div><div class="cm-v cm-tl-v"></div>
              <div class="cm-h cm-tr-h"></div><div class="cm-v cm-tr-v"></div>
              <div class="cm-h cm-bl-h"></div><div class="cm-v cm-bl-v"></div>
              <div class="cm-h cm-br-h"></div><div class="cm-v cm-br-v"></div>
            </div>`;
        };

        // Conteúdo da Pág 5 (Aba Interna)
        const p5Content = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;"><div style="width:146px;height:210px;transform:scale(3.60);transform-origin:center center;flex-shrink:0;">${ReactDOMServer.renderToString(React.createElement(Art5, { accentColor, palette: paletteColors }))}</div></div>`;

        // Conteúdo da Pág 6 (Contra Capa)
        const p6Content = isVacina ? `<div style="width:148px; height:210px; transform:scale(3.78); transform-origin:top left;">${ReactDOMServer.renderToString(React.createElement(Art6, { accentColor, palette: paletteColors }))}</div>` : `
          <div style="width:100%; height:100%; position:relative; display:flex; flex-direction:column; align-items:center;">
            <div class="quote-box" style="position:absolute; top:48%; left:50%; transform:translate(-50%, -50%); width:88%; background:${paletteColors[0] || accentColor}; border:0.4mm solid ${paletteColors[0] || accentColor}; border-radius:4mm; padding:10mm 8mm; text-align:center; box-shadow:0 2mm 8mm rgba(0,0,0,0.1); z-index:3;">
                <div style="font-family:'Brush Script MT','Segoe Script',cursive; font-style:italic; color:#fff !important; -webkit-text-fill-color:#fff; font-size:30pt; margin-bottom:4mm; text-transform:none;">${isSono ? '"Um bebê bem descansado é um bebê mais feliz!"' : isCuidados ? '"Você não precisa ser perfeita — precisa estar presente."' : '"Brinque, converse e explore!"'}</div>
                <div style="font-family:'Montserrat',sans-serif;font-size:9pt;color:#fff !important;-webkit-text-fill-color:#fff;font-weight:500;line-height:1.5;">
                   ${isSono ? 'O sono é uma necessidade fisiológica essencial para o desenvolvimento do seu bebê. Uma rotina consistente, ambiente seguro e respeito aos sinais de sono fazem toda a diferença. Você não está sozinha nessa jornada!' : isCuidados ? 'Cuidar de um bebê é aprender junto com ele. Cada dúvida é normal, cada conquista é sua também. Você está fazendo um trabalho incrível.' : 'As brincadeiras são mais do que momentos de diversão. Elas ajudam seu bebê a aprender, a desenvolver novas habilidades e a se sentir seguro e amado. Pergunte, cante, brinque de esconde-esconde e observe o quanto seu bebê cresce a cada dia.'}
                </div>
            </div>

            <div style="position:absolute; top:75%; width:100%; opacity:0.3; display:flex; justify-content:center; gap:5mm; z-index:2;">
               ${Array.from({length: 8}).map((_, i) => `<div style="width:2.5mm;height:2.5mm;background:${accentColor};border-radius:50%;"></div>`).join('')}
            </div>

            <div style="width:100%; margin-top:auto;">
                ${genPDFFooter({ clinicaNome, endereco, allPhones, email: brand.email, site, instagram, accentColor, logoHtml: null, crmLine })}
            </div>
          </div>`;

        // Conteúdo da Pág 1 (Capa)
        // No contexto scale(3.78): 1mm = 3.78px na tela → usar px equivalentes (Xmm / 3.78 = Xpx)
        // No contexto scale(3.78): 1px = 1mm no papel — scaleFactor igual ao preview
        const _vacinaLogoHtml = genPDFLogoHtml({ 
          brand, 
          editDataOverride: editData, 
          color: logoColor, 
          layout: logoLayout||'stacked', 
          localSlogan, 
          crmLine, 
          fontPt: 7, 
          lineH: 1.1, 
          letterSp: _letterSp, 
          customLogoSrc, 
          customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
          maxWidth: '30mm', 
          maxHeight: '12mm' 
        });
        const p1Content = isVacina ? `<div style="width:148px; height:210px; transform:scale(3.78); transform-origin:top left;">${ReactDOMServer.renderToString(React.createElement(Art1, { accentColor, palette: paletteColors, pdfMode: true, logoComponent: <div dangerouslySetInnerHTML={{ __html: _vacinaLogoHtml }} /> }))}</div>` : `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10mm;text-align:center;height:100%;">
              <div style="margin-bottom:12mm;width:100mm;display:flex;justify-content:center;">${genPDFLogoHtml({ 
                brand, 
                editDataOverride: editData, 
                color: logoColor, 
                layout: logoLayout||'stacked', 
                localSlogan, 
                crmLine, 
                fontPt: 18, 
                lineH: 1.1, 
                letterSp: _letterSp, 
                customLogoSrc, 
                customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
                maxWidth: '85mm', 
                maxHeight: '38mm' 
              })}</div>
              <div style="width:30mm;height:1.2mm;background:${accentColor};margin-top:4mm;margin-bottom:15mm;border-radius:1mm;"></div>
              
              <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10mm;">
                  <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:12pt;color:${accentColor}cc;letter-spacing:1.5pt;text-transform:uppercase;margin-bottom:4mm;font-style:italic;">
                     ${item.includes('Alimentar') || item.includes('Cuidados') || item.includes('Desenvolvimento') ? 'GUIA DE' : item.includes('Sono') ? 'GUIA DO' : 'CARTÃO DE'}
                  </div>
                  <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:24pt;color:#1a1a1a;letter-spacing:1.2pt;text-transform:uppercase;line-height:1.25;">
                     ${item.includes('Alimentar') ? 'INTRODUÇÃO<br/>ALIMENTAR' :
                       item.includes('Cuidados') ? 'CUIDADOS<br/>COM O BEBÊ' :
                       item.includes('Desenvolvimento') ? 'DESENVOLVIMENTO' :
                       item.includes('Sono') ? 'SONO<br/>SAUDÁVEL' : 'EXAME<br/>PRÉ-NATAL'}
                  </div>
              </div>

              <div style="padding:2.5mm 10mm; background:${(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '28'}; border-radius:15mm; border:0.25mm solid ${(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '50'}; margin-top:5mm;">
                  <div style="font-family:'Montserrat', sans-serif; font-size:10pt; font-weight:800; color:${_darkenHex(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor)}; text-transform:uppercase; letter-spacing:1pt;">${isSono ? 'DURMA BEM, CRESÇA BEM' : isCuidados ? 'DO PRIMEIRO DIA COM MUITO AMOR' : isDev ? 'CADA DIA UM NOVO DESCOBRIMENTO' : isVacina ? 'PROTEGIDO DESDE O PRIMEIRO DIA' : isPrenatal ? 'CUIDANDO DA SAÚDE DA MAMÃE E DO BEBÊ' : 'NUTRIÇÃO QUE TRANSFORMA'}</div>
              </div>
          </div>`;

        const page1 = renderTrifoldFace([
          { num: 5, w: W1, content: p5Content },
          { num: 6, w: W2, content: p6Content },
          { num: 1, w: W3, content: p1Content, clip: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : null }
        ], true);

        // scale 3.60 (vs 3.78) dá ~3.5mm de margem em cada lado no painel
        const sInner = 3.60;
        const page2 = renderTrifoldFace([
          { num: 2, w: W3, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:148px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(React.createElement(Art2, { accentColor, palette: paletteColors }))}</div>` },
          { num: 3, w: W2, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:148px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(React.createElement(Art3, { accentColor, palette: paletteColors }))}</div>` },
          { num: 4, w: W1, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:146px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(React.createElement(Art4, { accentColor, palette: paletteColors }))}</div>` }
        ], false);

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title>${fiTri}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; color-adjust:exact !important; }
.quote-box, .quote-box * { color:#fff !important; -webkit-text-fill-color:#fff !important; }
body { background:#eee; }
.page { background:#fff; margin:0 auto; }
.cm-h { position:absolute; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
.cm-v { position:absolute; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
.cm-tl-h { top:${BLEED}mm; left:0; } .cm-tl-v { top:0; left:${BLEED}mm; }
.cm-tr-h { top:${BLEED}mm; right:0; } .cm-tr-v { top:0; right:${BLEED}mm; }
.cm-bl-h { bottom:${BLEED}mm; left:0; } .cm-bl-v { bottom:0; left:${BLEED}mm; }
.cm-br-h { bottom:${BLEED}mm; right:0; } .cm-br-v { bottom:0; right:${BLEED}mm; }
@media print { body { background:none; } .page { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body>${page1}${page2}</body></html>`;

        const _launchTrifoldPrint = (finalHtml) => {
          const iframe = document.createElement('iframe');
          iframe.id = '_gabarito_trifold';
          iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
          document.body.appendChild(iframe);
          iframe.contentDocument.open(); iframe.contentDocument.write(finalHtml); iframe.contentDocument.close();
          const prevT = document.title;
          iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle(item); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 5000); }, 1500); });
        };
        try {
          const cssResp = await fetch('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          const cssText = await cssResp.text();
          const woffUrl = cssText.match(/url\(([^)]+)\)/)?.[1];
          if (woffUrl) {
            const fontResp = await fetch(woffUrl);
            const fontBlob = await fontResp.blob();
            const fontB64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(fontBlob); });
            const fontFace = `@font-face { font-family: 'Great Vibes'; src: url('${fontB64}') format('woff2'); font-weight: normal; font-style: normal; }`;
            const htmlWithFont = html.replace('</style>', fontFace + '</style>');
            const htmlFixed = htmlWithFont.replace(/font-family:'Brush Script MT','Segoe Script',cursive; font-style:italic;/g, "font-family:'Great Vibes',cursive;");
            _launchTrifoldPrint(htmlFixed);
          } else { _launchTrifoldPrint(html); }
        } catch(e) { _launchTrifoldPrint(html); }
        return;
      }      if (item === 'Assinatura de E-mail') {
        const W = 180, H = 60; // Standard signature size in mm (approx)
        const totalW = W, totalH = H;
        const { whatsapp, telefone, email, site, instagram } = cartaoContacts || {};
        const mainPhone = whatsapp || telefone || '';

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,700&display=swap" rel="stylesheet"/>
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { background:#eee; }
.page { width:${totalW}mm; height:${totalH}mm; background:#fff; position:relative; overflow:hidden; margin:0 auto; display:flex; align-items:center; padding:10mm 15mm; gap:12mm; }
@media print { body { background:none; } .page { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div class="page">
  <div style="position:absolute; top:0; right:0; width:25mm; height:25mm; background:${accentColor}10; border-radius:0 0 0 25mm;"></div>
  
  <div style="width:50mm; display:flex; justify-content:center; flex-shrink:0;">
    ${genPDFLogoHtml({ brand, color: accentColor, localSlogan: '', crmLine: '', fontPt: 24, lineH: _lineH, letterSp: _letterSp, hideSlogan: true, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '40mm', maxHeight: '20mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="width:0.5mm; height:70%; background:#eee;"></div>

  <div style="display:flex; flex-direction:column; gap:2mm;">
     <div style="font-family:'Montserrat',sans-serif; font-size:18pt; font-weight:800; color:#1a1a1a;">${clinicaNome}</div>
     <div style="font-family:'Montserrat',sans-serif; font-size:12pt; font-weight:600; color:${accentColor}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:2mm;">${localSlogan || 'Saúde e Bem-Estar'}</div>
     
     <div style="display:flex; flex-direction:column; gap:1.5mm;">
        ${mainPhone ? `<div style="display:flex; align-items:center; gap:2mm; font-family:'Montserrat',sans-serif; font-size:10pt; color:#666;">
           <svg viewBox="0 0 24 24" width="14" height="14" fill="${accentColor}"><path d="M12.01 2.01C6.48 2.01 2 6.48 2 12.01c0 2.17.69 4.19 1.86 5.83l-1.38 5.12 5.24-1.38c1.64 1.17 3.66 1.86 5.83 1.86 5.53 0 10.01-4.48 10.01-10.01S17.54 2.01 12.01 2.01zm4.12 13.91c-.24.69-1.23 1.25-1.71 1.33-.48.08-1.11.13-3.23-.74-2.7-1.12-4.44-3.86-4.57-4.04-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2.01.95-2.29.24-.28.53-.35.71-.35.18 0 .35 0 .5.01.16.01.37-.06.58.45.22.53.75 1.84.81 1.97.06.13.11.29.02.46-.09.18-.14.29-.27.46-.13.18-.28.4-.39.54-.13.15-.27.32-.12.58.15.26.65 1.07 1.39 1.74.96.85 1.76 1.12 2.02 1.25.26.13.41.11.56-.06.15-.17.65-.75.82-.95.17-.2.35-.17.58-.08.24.08 1.5.71 1.76.84.26.13.44.2.5.31.06.11.06.66-.18 1.35z"/></svg>
           <span>${mainPhone}</span>
        </div>` : ''}
        ${email ? `<div style="display:flex; align-items:center; gap:2mm; font-family:'Montserrat',sans-serif; font-size:10pt; color:#666;">
           <svg viewBox="0 0 24 24" width="14" height="14" fill="${accentColor}"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
           <span>${email.toLowerCase()}</span>
        </div>` : ''}
        <div style="display:flex; align-items:center; gap:5mm; margin-top:2mm;">
           ${site ? `<div style="font-family:'Montserrat',sans-serif; font-size:10pt; color:${accentColor}; font-weight:800;">${site.replace('https://','').replace('http://','')}</div>` : ''}
           ${instagram ? `<div style="display:flex; align-items:center; gap:1.5mm; font-family:'Montserrat',sans-serif; font-size:10pt; color:#333; font-weight:800;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#333"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>@${instagram}</span>
           </div>` : ''}
        </div>
     </div>
  </div>
</div></body></html>`;

        const ifrAS = document.createElement('iframe');
        ifrAS.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1800px;height:600px;border:none;visibility:hidden;';
        document.body.appendChild(ifrAS);
        ifrAS.contentDocument.open(); ifrAS.contentDocument.write(html); ifrAS.contentDocument.close();
        ifrAS.contentWindow.document.fonts.ready.then(() => {
          setTimeout(async () => {
            try {
              const h2c = (await import('html2canvas')).default;
              const canvas = await h2c(ifrAS.contentDocument.querySelector('.page'), {
                scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
                logging: false,
              });
              const url = canvas.toDataURL('image/png', 1.0);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Assinatura-Email-${marca}.png`;
              a.click();
            } catch(e) { console.error(e); alert('Erro ao gerar imagem'); }
            ifrAS.remove();
          }, 1200);
        });
        return;
      }

      if (item === 'Pack Digital para Instagram') {
        const BLEED = 0;
        const _INSTA_FMTS = [{id:'story',rw:1080,rh:1920,W:108,H:192},{id:'post',rw:1080,rh:1080,W:108,H:108}];
        const _fmt = _INSTA_FMTS[storyFormatIdx] || _INSTA_FMTS[0];
        const W = _fmt.W, H = _fmt.H; // ratio for PDF rendering
        const totalW = W;
        const totalH = H;
        const effectiveSrc = comBorda ? patternSrc : null;
        const solidColor = borderColor || paletteColors?.[0] || accentColor;
        const instagram = cartaoContacts?.instagram || '';
        const _STORY_TMPLS = [{id:'tiraduvidas',titulo:'Tira-Dúvidas',subtitulo:'Me manda sua pergunta!'},{id:'enquete',titulo:'Me conta!',subtitulo:'Qual é a sua dúvida?'},{id:'mito',titulo:'Verdade ou Mito?',subtitulo:'O que você já ouviu por aí?'},{id:'dica',titulo:'Dica do Dia',subtitulo:'Arrasta pra ver o conteúdo'},{id:'indica',titulo:'Me Indica!',subtitulo:'Qual produto você quer ver?'},{id:'novidades',titulo:'Novidades',subtitulo:'Tem coisa boa chegando!'},{id:'sabiaque',titulo:'Você Sabia?',subtitulo:'Um fato que vai te surpreender'},{id:'livre',titulo:'Fala Comigo!',subtitulo:'Manda sua mensagem'}];
        const _storyTmpl = _STORY_TMPLS[storyTemplateIdx] || _STORY_TMPLS[0];

        const RW = _fmt.rw, RH = _fmt.rh;
        const isPost = _fmt.id === 'post';
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,700&display=swap" rel="stylesheet"/>
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
html, body { width:${RW}px; height:${RH}px; overflow:hidden; background:#fff; }
.page { width:${RW}px; height:${RH}px; position:relative; overflow:hidden; }
</style></head><body><div class="page">
  <div style="position:absolute; inset:0; overflow:hidden;">
     ${effectiveSrc ? `<div style="position:absolute; inset:0; background-image:url(${effectiveSrc}); background-size:300px; background-repeat:repeat; opacity:0.2;"></div>` : ''}
     <div style="position:absolute; inset:0; background:${!effectiveSrc ? `${solidColor}10` : 'transparent'};"></div>
  </div>

  <div style="position:absolute; top:${isPost ? Math.round(RH*0.09) : Math.round(RH*0.07)}px; left:0; right:0; display:flex; justify-content:center; transform:scale(${isPost ? 1.3 : 1.0}); transform-origin:top center;">
    ${genPDFLogoHtml({ brand, color: accentColor, localSlogan, crmLine, fontPt: 32, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '120mm', maxHeight: '45mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="position:absolute; top:${isPost ? Math.round(RH*0.40) : Math.round(RH*0.28)}px; left:0; right:0; text-align:center;">
    <div style="font-family:'Montserrat', sans-serif; font-size:${isPost ? 54 : 44}px; font-weight:900; color:${accentColor}; letter-spacing:8px; text-transform:uppercase; opacity:0.85;">${_storyTmpl.titulo}</div>
    <div style="font-family:'Montserrat', sans-serif; font-size:${isPost ? 30 : 26}px; font-weight:500; color:${accentColor}; opacity:0.6; margin-top:18px;">${_storyTmpl.subtitulo}</div>
  </div>

  <!-- Área da caixinha limpa, sem texto -->
  <div style="position:absolute; top:${isPost ? Math.round(RH*0.50) : Math.round(RH*0.38)}px; left:${Math.round(RW*0.08)}px; right:${Math.round(RW*0.08)}px; height:${isPost ? Math.round(RH*0.24) : Math.round(RH*0.30)}px; border:4px dashed ${accentColor}35; border-radius:48px; background:rgba(255,255,255,0.3);"></div>

  <div style="position:absolute; bottom:${Math.round(RH*0.06)}px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:12px;">
     ${instagram ? `<div style="display:flex; align-items:center; gap:2mm;">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="${accentColor}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        <div style="font-family:'Montserrat', sans-serif; font-size:10pt; font-weight:800; color:${accentColor};">@${instagram}</div>
     </div>` : ''}
     <div style="font-family:'Montserrat', sans-serif; font-size:7pt; color:#999; text-transform:uppercase; letter-spacing:1pt;">${clinicaNome}</div>
  </div>
</div></body></html>`;
        return;
      }

      if (item === 'Papel Timbrado') {
        const BLEED = 3;
        const W = 210, H = 297;
        const totalW = W + (BLEED * 2);
        const totalH = H + (BLEED * 2);
        const BORDER = 15;
        const effectiveSrc = comBorda ? patternSrc : null;
        const solidColor = borderColor || paletteColors[0] || accentColor;

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${item} - ${marca}</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,700&display=swap" rel="stylesheet"/>
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { background:#eee; }
.page { width:${totalW}mm; height:${totalH}mm; background:#fff; position:relative; overflow:hidden; margin:0 auto; box-shadow:0 0 10mm rgba(0,0,0,0.1); }
.cm { position:absolute; width:10mm; height:10mm; border-color:rgba(0,0,0,0.5); border-style:solid; border-width:0; pointer-events:none; z-index:100; }
.cm-tl { top:${BLEED}mm; left:${BLEED}mm; border-top:0.2mm solid; border-left:0.2mm solid; }
.cm-tr { top:${BLEED}mm; right:${BLEED}mm; border-top:0.2mm solid; border-right:0.2mm solid; }
.cm-bl { bottom:${BLEED}mm; left:${BLEED}mm; border-bottom:0.2mm solid; border-left:0.2mm solid; }
.cm-br { bottom:${BLEED}mm; right:${BLEED}mm; border-bottom:0.2mm solid; border-right:0.2mm solid; }
@media print { body { background:none; } .page { margin:0; box-shadow:none; } @page { size: ${totalW}mm ${totalH}mm; margin:0; } }
</style></head><body><div class="page">
<div style="position:absolute; inset:${BLEED}mm; overflow:hidden;">
  ${effectiveSrc
    ? `<div style="position:absolute; inset:0; background-image:url(${effectiveSrc}); background-size:50mm; background-repeat:repeat;"></div><div style="position:absolute; inset:${BORDER}mm; background:#fff;"></div>`
    : `<div style="position:absolute; inset:0; background:#fff; border:${BORDER}mm solid ${solidColor}; box-sizing:border-box;"></div>`}
  
  <div style="position:absolute; top:${BORDER + 10}mm; left:50%; transform:translateX(-50%); width:100mm; display:flex; justify-content:center;">
    ${genPDFLogoHtml({ brand, editDataOverride: editData, color: accentColor, layout: logoLayout, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 1.5).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '100mm', maxHeight: '38mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); opacity:0.15; width:140mm; display:flex; justify-content:center; pointer-events:none;">
    ${genPDFLogoHtml({ brand, color: accentColor, localSlogan, crmLine, fontPt: 48, lineH: _lineH, letterSp: _letterSp, hideSlogan: true, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '140mm', maxHeight: '60mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="position:absolute; bottom:${BORDER + 10}mm; left:0; right:0; text-align:center;">
    ${genPDFFooter({ clinicaNome, endereco, allPhones, email: brand.email, site, instagram, accentColor, logoHtml: null, crmLine })}
  </div>
</div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div></body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1000mm;height:1000mm;border:none;visibility:hidden;';
        document.body.appendChild(iframe);
        iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
        const prevT = document.title;
        iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle(item); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1000); });
        return;
      }

      if (item.includes('Certificado')) {
        const W = 210, H = 148; // A5 Horizontal
        const BLEED = 5;
        const _ffCe = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
        const _lfCe = LOCAL_FONT_FACES[_ffCe];
        const fiCe = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">${_lfCe ? `<style>${_lfCe}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffCe.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;

        const _accent = brand.activeColor || '#dc3495';
        const _bcCe = borderColor || _accent;
        const solidColor = _bcCe;
        const effectiveSrc = comBorda ? patternSrc : null;

        const _lColor = logoColor || _accent;
        const logoHtmlCe = genPDFLogoHtml({ brand, editDataOverride: editData, color: _lColor, layout: logoLayout, localSlogan, crmLine, fontPt: logoLayout === 'horizontal' ? (marca.length > 18 ? 16 : marca.length > 12 ? 20 : 24) : _fontPt, lineH: _lineH, letterSp: editData?.fontLetterSpacing || brand.editData?.fontLetterSpacing || _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '100mm', maxHeight: '22mm', withBackground: comBorda && patternSrc });

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado de Coragem - ${marca}</title>${fiCe}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
body { width:${W + BLEED*2}mm; height:${H + BLEED*2}mm; position:relative; overflow:hidden; background:#fff; font-family:'Montserrat',sans-serif; }
@media print { body { margin:0; } @page { size: ${W + BLEED*2}mm ${H + BLEED*2}mm; margin:0; } }
</style></head><body>
<div style="position:relative;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fff;">
  <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
    <!-- Background -->
    <div style="position:absolute;inset:0;background-image:${effectiveSrc ? `url(${effectiveSrc})` : 'none'};background-size:${patternScale * 0.3}mm;background-color:${!effectiveSrc ? solidColor : 'transparent'};"></div>
    
    <!-- Casinha -->
    <div style="position:absolute;top:${BLEED + 6}mm;left:${BLEED + 6}mm;right:${BLEED + 6}mm;bottom:${BLEED + 6}mm;background:#fff;clip-path:polygon(0% 18%, 50% 0%, 100% 18%, 100% 100%, 0% 100%);-webkit-clip-path:polygon(0% 18%, 50% 0%, 100% 18%, 100% 100%, 0% 100%);display:flex;flex-direction:column;align-items:center;padding:12mm 10mm 10mm;">
        
        <div style="height:25mm;margin-bottom:6mm;display:flex;justify-content:center;align-items:center;overflow:hidden;">
            ${logoHtmlCe}
        </div>

        <div style="font-family:'Montserrat',sans-serif;font-size:10pt;font-weight:600;color:#7a7a7a;letter-spacing:0.8pt;margin-bottom:1mm;">
            Certificado Pediátrico de
        </div>
        <h2 style="font-family:'${_ffCe}',serif;font-size:38pt;font-weight:700;color:${solidColor};margin:0 0 8mm;letter-spacing:1pt;">
            Coragem
        </h2>

        <div style="font-family:'Great Vibes','Brush Script MT',cursive;font-size:22pt;color:#5a5a5a;text-align:center;line-height:1.5;width:90%;margin-top:8mm;">
            <div style="margin:0;">Certifico para os devidos e lúdicos fins, que __________________</div>
            <div style="margin:0;">idade _____ comportou-se corretamente na consulta de hoje,</div>
            <div style="margin:0;">sendo educado e demonstrando muita coragem e valentia.</div>
        </div>
    </div>
    
    <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div></body></html>`;

        const _dt = pdfTitle('Certificado de Coragem');
        const _ex = document.getElementById('_gabarito_iframe'); if (_ex) _ex.remove();
        const _if = document.createElement('iframe');
        _if.id = '_gabarito_iframe';
        _if.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${W + BLEED*2}mm;height:${H + BLEED*2}mm;border:none;visibility:hidden;`;
        document.body.appendChild(_if);
        _if.contentDocument.open(); _if.contentDocument.write(html); _if.contentDocument.close();
        _if.contentDocument.title = _dt;
        const _pv = document.title;
        _if.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = _dt; _if.contentWindow.focus(); _if.contentWindow.print(); setTimeout(() => { document.title = _pv; _if.remove(); }, 3000); }, 400); });
        return;
      }

    // ── OUTROS ITENS ────────────────────────────────────────────────
    const _fontFamily2 = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
    const _localFace2 = LOCAL_FONT_FACES[_fontFamily2];
    const fontImports2 = `
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      ${_localFace2
        ? `<style>${_localFace2}</style>`
        : `<link href="https://fonts.googleapis.com/css2?family=${_fontFamily2.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">`
      }`;

    // Tamanho de página por item (com sangria industrial de 5mm inclusa)
    const PAGE_SIZES = {
      'Receituário':         { w: 148, h: 210, bleed: 5 },
      'Timbrado':            { w: 210, h: 297, bleed: 5 },
      'Cartão de Retorno':   { w: 90, h: 48, bleed: 3 },
      'Envelope Ofício':     { w: 220, h: 113, bleed: 5 },
      'Recibo':              { w: 148, h: 210, bleed: 5 },
      'Cartão de Aniversário': { w: 105, h: 148, bleed: 5 },
    };
    const psKey = Object.keys(PAGE_SIZES).find(k => item.includes(k));
    let ps = PAGE_SIZES[psKey] || { w: 210, h: 297, bleed: 5 };
    // A4 upgrade para itens que suportam
    if (paperSize === 'a4' && ['Receituário', 'Recibo', 'Ficha', 'Prontuário', 'Certificado', 'Checklist'].some(n => item.includes(n))) {
      ps = { w: 210, h: 297, bleed: 5 };
    }
    const totalW_gen = ps.w + (ps.bleed * 2);
    const totalH_gen = ps.h + (ps.bleed * 2);
    const bleed_gen = ps.bleed;

    const BORDER_W = '8mm';
    const _bc3 = borderColor || accentColor;
    const _clipRoof = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';
    const patternBorder = (comBorda && patternSrc)
      ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.4).toFixed(1)}mm;background-repeat:repeat;"></div>
         <div style="position:absolute;top:${BORDER_W};left:${BORDER_W};right:${BORDER_W};bottom:${BORDER_W};background:#fff;clip-path:${_clipRoof};"></div>`
      : `<div style="position:absolute;inset:0;background:${_bc3};"></div>
         <div style="position:absolute;top:${BORDER_W};left:${BORDER_W};right:${BORDER_W};bottom:${BORDER_W};background:#fff;clip-path:${_clipRoof};"></div>`;

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
      </div>` : '';

    const _logoWidthMm = logoLayout === 'horizontal'
      ? Math.round(ps.w * 0.72)
      : Math.round(ps.w * 0.57);
    const pageHtml = `
      <div style="position:relative;width:${totalW_gen}mm;height:${totalH_gen}mm;overflow:hidden;">
        <div class="cm-tl-h"></div><div class="cm-tl-v"></div>
        <div class="cm-tr-h"></div><div class="cm-tr-v"></div>
        <div class="cm-bl-h"></div><div class="cm-bl-v"></div>
        <div class="cm-br-h"></div><div class="cm-br-v"></div>
        ${patternBorder}
        <div style="position:absolute;top:${bleed_gen + (folderRoof ? 22 : 15)}mm;left:50%;transform:translateX(-50%);width:${_logoWidthMm}mm;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          ${logoHtml}
        </div>
        ${footerHtml}
      </div>`;

    const _docTitle2 = pdfTitle(item);
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${_docTitle2}</title>
${fontImports2}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
  body { margin: 0; }
  @media print { @page { size: ${totalW_gen}mm ${totalH_gen}mm; margin: 0; } }
  .cm-tl-h { position:absolute; top:${bleed_gen}mm; left:0; width:${bleed_gen-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-tl-v { position:absolute; top:0; left:${bleed_gen}mm; width:0.2mm; height:${bleed_gen-0.5}mm; background:#000; z-index:100; }
  .cm-tr-h { position:absolute; top:${bleed_gen}mm; right:0; width:${bleed_gen-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-tr-v { position:absolute; top:0; right:${bleed_gen}mm; width:0.2mm; height:${bleed_gen-0.5}mm; background:#000; z-index:100; }
  .cm-bl-h { position:absolute; bottom:${bleed_gen}mm; left:0; width:${bleed_gen-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-bl-v { position:absolute; bottom:0; left:${bleed_gen}mm; width:0.2mm; height:${bleed_gen-0.5}mm; background:#000; z-index:100; }
  .cm-br-h { position:absolute; bottom:${bleed_gen}mm; right:0; width:${bleed_gen-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-br-v { position:absolute; bottom:0; right:${bleed_gen}mm; width:0.2mm; height:${bleed_gen-0.5}mm; background:#000; z-index:100; }
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

      {/* Nome do item atual */}
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>{currentItem}</div>

      {/* Escala da logo — acima do preview para ajuste em tempo real */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
        <span style={{ fontSize: '0.68rem', color: '#999', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Escala da logo</span>
        <input type="range" min="10"
          max={currentItem.includes('Cartão de Visita') && cartaoRetrato ? 105 : getCustomLogoScaleMax(currentItem)}
          step="5"
          value={Math.min(getCustomLogoScale(currentItem), currentItem.includes('Cartão de Visita') && cartaoRetrato ? 105 : getCustomLogoScaleMax(currentItem))}
          onChange={e => setCustomLogoScale(currentItem, parseInt(e.target.value))}
          style={{ flex: 1, accentColor }} />
        <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{getCustomLogoScale(currentItem)}%</span>
      </div>

      {/* Preview inline */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px', paddingBottom: '8px' }}>
        {currentItem.includes('Cartão de Visita')
          ? <CartaoDeVisitaPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} retrato={cartaoRetrato} setRetrato={setCartaoRetrato} />
          : currentItem.includes('Envelope Ofício')
            ? <EnvelopeOficioPreview accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} brand={brand} editData={itemEditData} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
          : currentItem.includes('Envelope Saco')
            ? <EnvelopeSacoPreview accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} brand={brand} editData={itemEditData} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
          : currentItem === 'Recibo'
            ? <ReciboPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} marca={marca} />
          : currentItem.includes('Cartão de Retorno')
            ? <CartaoRetornoPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Ficha de Cadastro'
            ? <FichaCadastroPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} fichaAdulto={fichaAdulto} setFichaAdulto={setFichaAdulto} />
          : currentItem === 'Prontuário Médico'
            ? <ProntuarioPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Checklist Maternidade'
            ? <ChecklistMaternidadePreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem.includes('Controle Especial')
            ? <ControleEspecialPreview accentColor={accentColor} patternSrc={patternSrc} cartaoContacts={cartaoContacts} crmLine={crmLine} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} comBorda={comBorda} setComBorda={setComBorda} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} logoLayout={logoLayout} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} marca={marca} />
          : currentItem === 'Gráfico de Crescimento'
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
                <GraficoCrescimentoPreview accentColor={accentColor} paletteColors={paletteColors} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} borderColor={borderColor} setBorderColor={setBorderColor} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} />
              </div>
          : currentItem === 'Diário do Xixi'
            ? <DiarioXixiPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Receita de Alta'
            ? <ReceitaAltaPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} receitaFields={receitaFields} setReceitaFields={setReceitaFields} />
          : currentItem === 'Arte para Caneca' || currentItem === 'Arte para Caneca'
            ? <CanecaPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Papel de Presente'
            ? <PapelPresentePreview accentColor={accentColor} paletteColors={paletteColors} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} borderColor={borderColor} setBorderColor={setBorderColor} sizeIdx={papelPresenteSizeIdx} setSizeIdx={setPapelPresenteSizeIdx} />
          : currentItem === 'Tag para Sacola'
            ? <TagSacolaPreview item={currentItem} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} sizeIdx={tagSacolaSizeIdx} setSizeIdx={setTagSacolaSizeIdx} />
          : currentItem === 'Sacola de Papel'
            ? <SacolaPapelPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Etiqueta para Correios'
            ? <EtiquetaCorreiosPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} sizeIdx={etiquetaSizeIdx} setSizeIdx={setEtiquetaSizeIdx} fraseIdx={etiquetaFraseIdx} setFraseIdx={setEtiquetaFraseIdx} />
          : currentItem === 'Meu Pratinho'
            ? <MeuPratinhoPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : currentItem === 'Guia de Amamentação'
            ? <GuiaAmamentacaoPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} cartaoContacts={cartaoContacts} crmLine={crmLine} illustrationsSrc="/breastfeeding-guide.png" folderRoof={folderRoof} setFolderRoof={setFolderRoof} />
          : currentItem === 'Guia de Cuidados'
            ? <FolderTrifoldPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} title={currentItem} cartaoContacts={cartaoContacts} folderRoof={folderRoof} setFolderRoof={setFolderRoof} crmLine={crmLine} />
          : currentItem === 'Orientações p/ Recém Nascidos'
            ? <OrientacoesRNPreview accentColor={accentColor} patternSrc={patternSrc} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale}
                rnFields={{ nomeBebe: rnNomeBebe, dataNasc: rnDataNasc, peso: rnPeso, altura: rnAltura, umbigo: rnUmbigo, soro: rnSoro, med1: rnMed1, dose1: rnDose1, int1: rnInt1, med2: rnMed2, dose2: rnDose2, int2: rnInt2, pomada: rnPomada, vitDMed: rnVitDMed, vitDDose: rnVitDDose, bcgData: rnBcgData, hepBData: rnHepBData, consultaData: rnConsultaData, consultaHora: rnConsultaHora, urgencia: rnUrgencia }}
                setRnFields={{ setNomeBebe: setRnNomeBebe, setDataNasc: setRnDataNasc, setPeso: setRnPeso, setAltura: setRnAltura, setUmbigo: setRnUmbigo, setSoro: setRnSoro, setMed1: setRnMed1, setDose1: setRnDose1, setInt1: setRnInt1, setMed2: setRnMed2, setDose2: setRnDose2, setInt2: setRnInt2, setPomada: setRnPomada, setVitDMed: setRnVitDMed, setVitDDose: setRnVitDDose, setBcgData: setRnBcgData, setHepBData: setRnHepBData, setConsultaData: setRnConsultaData, setConsultaHora: setRnConsultaHora, setUrgencia: setRnUrgencia }}
              />
          : currentItem.includes('Pré-Natal')
            ? <FolderA5Preview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} title={currentItem} cartaoContacts={cartaoContacts} crmLine={crmLine} folderRoof={folderRoof} />
          : ['Guia Alimentar', 'Guia de Desenvolvimento', 'Guia de Vacina c/ Calendário', 'Cartão de Vacina', 'Guia do Sono'].some(n => currentItem === n)
            ? <FolderTrifoldPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} title={currentItem} cartaoContacts={cartaoContacts} folderRoof={folderRoof} setFolderRoof={setFolderRoof} crmLine={crmLine} />
          : currentItem.includes('Atestado Médico')
            ? <AtestadoPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} crmLine={crmLine} clinicaNome={clinicaNome} marca={marca} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={setFolderRoof} paperSize={paperSize} setPaperSize={setPaperSize} />
          : currentItem.includes('Pasta')
            ? <PastaPreview brand={brand} editData={{ ...itemEditData, tagline: localSlogan }} accentColor={accentColor} solidColor={paletteColors[0]} logoColor={logoColor} logoLayout={logoLayout} isSaude={isSaude} crmLine={crmLine} clinicaNome={clinicaNome} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={setFolderRoof} />
          : currentItem === 'Papel Timbrado'
            ? <PapelTimbradoPreview brand={brand} editData={itemEditData} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
          : currentItem === 'Pack Digital para Instagram'
            ? <FundoInstaPreview brand={brand} editData={itemEditData} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
          : currentItem === 'Assinatura de E-mail'
            ? <AssinaturaEmailPreview brand={brand} editData={itemEditData} accentColor={accentColor} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
          : currentItem.includes('Certificado')
            ? <CertificadoCoragemPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          : ['Receituário','Timbrado','Cartão','Guia','Calendário','Atestado','Dicas','Ficha','Orientação','Checklist','Prontuário','Receita','Quadro','Gráfico','Diário','Card','Pratinho','Fundo','Arte','Etiqueta','Assinatura','Tag'].some(n => currentItem.includes(n))
            ? <A5ItemPreview item={currentItem} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={['Receituário','Atestado','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? setFolderRoof : undefined} paperSize={['Receituário','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? paperSize : undefined} setPaperSize={['Receituário','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? setPaperSize : undefined} />
          : <GenericItemPreview item={currentItem} marca={marca} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
        }
      </div>

      {/* Aviso preview ilustrativo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '6px 10px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
        <span style={{ fontSize: '0.6rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.4 }}>
          ℹ️ <strong style={{ color: '#bbb' }}>Preview ilustrativo.</strong> Proporções e tamanhos podem variar. Confira as dimensões reais no PDF antes de enviar para a gráfica.
        </span>
      </div>

      {/* Editar contatos — acordeão (todos os itens exceto caneca) */}
      {currentItem !== 'Arte para Caneca' && <div style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
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
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>Empresa</span>
                <input
                  value={clinicaNome}
                  onChange={e => setClinicaNome(e.target.value)}
                  placeholder="Nome complementar (opcional)"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              {isSaude && (
                <div style={{ paddingBottom: '8px', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>CRM /</span>
                    <input value={crmData.uf} onChange={e => setCrmData(d => ({ ...d, uf: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="UF"
                      style={{ width: '44px', padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center', outline: 'none' }} />
                    <input value={crmData.crm} onChange={e => setCrmData(d => ({ ...d, crm: e.target.value }))} placeholder="Número"
                      style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  {crmData.rqe.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>RQE</span>
                      <input value={r} onChange={e => setCrmData(d => { const rqe = [...d.rqe]; rqe[i] = e.target.value; return { ...d, rqe }; })} placeholder="Número"
                        style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }} />
                      <button onClick={() => setCrmData(d => ({ ...d, rqe: d.rqe.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: '#c00', fontSize: '1rem', cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => setCrmData(d => ({ ...d, rqe: [...d.rqe, ''] }))} style={{ background: 'none', border: '1px dashed #ddd', color: '#888', borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    + Adicionar RQE
                  </button>
                </div>
              )}
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
        </div>}

      {/* Modal de instruções de impressão */}
      {showPrintModal && (() => {
        const SPECS = {
          'Cartão de Visita':       { cat: 'Cartão de visita', tam: '9 × 4,8 cm', papel: 'Couché 300g', acabamento: 'Refile', preco: '~R$52,94 / 250 un.' },
          'Receituário':            { cat: 'Receituário', tam: 'A5 (14,8×21 cm) ou A4 (21×29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$109,19 / 10 blocos' },
          'Timbrado':               { cat: 'Timbrado', tam: 'A4 (21 × 29,7 cm)', papel: 'Offset 90g+', acabamento: 'Folhas avulsas', preco: '~R$170,85 / 250 un.' },
          'Cartão de Retorno':      { cat: 'Cartão de visita', tam: '9 × 4,8 cm', papel: 'Couché Fosco 300g', acabamento: 'Refile', preco: '~R$52,94 / 250 un.' },
          'Pasta':                  { cat: 'Pasta com bolsa', tam: '22 × 31 cm fechada · gabarito 485×385mm', papel: 'Cartão 300g', acabamento: 'Faca c/ Bolsa · Vinco · Dobra', preco: '~R$205,04 / 50 un.' },
          'Envelope Ofício (23x11,5cm)': { cat: 'Envelope', tam: '23 × 11,5 cm', papel: 'Offset 90g', acabamento: 'Faca especial · Cola', preco: '~R$319,24 / 50 un.' },
          'Envelope Saco (24x34cm)':   { cat: 'Envelope Saco', tam: '24 × 34 cm', papel: 'Offset 120g', acabamento: 'Faca especial · Cola', preco: '~R$400,00 / 50 un.' },
          'Envelope Ofício':        { cat: 'Envelope', tam: '23 × 11,5 cm', papel: 'Offset 90g', acabamento: 'Faca especial · Cola', preco: '~R$319,24 / 50 un.' },
          'Envelope Saco':          { cat: 'Envelope Saco', tam: '24 × 34 cm', papel: 'Offset 120g', acabamento: 'Faca especial · Cola', preco: '~R$400,00 / 50 un.' },
          'Recibo':                 { cat: 'Recibo', tam: 'A5 (14,8 × 21 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$120,84 / 10 blocos' },
          'Caneca':                 { cat: 'Caneca', tam: 'Arte: 20 × 8 cm', papel: 'Cerâmica', acabamento: 'Sublimação', preco: '~R$33,93 / un.' },
          'Atestado Médico':        { cat: 'Atestado', tam: 'A5 (14,8×21 cm) ou A4 (21×29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$109,19 / 10 blocos' },
          'Receita de Alta':        { cat: 'Receituário Especial', tam: 'A4 (21 × 29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 50 vias', preco: '' },
          'Checklist Maternidade':  { cat: 'Checklist', tam: 'A4 (21 × 29,7 cm)', papel: 'Offset 120g', acabamento: 'Refile · Frente', preco: '~R$261,07 / 250 un.' },
          'Prontuário Médico':      { cat: 'Prontuário', tam: 'A4 (21 × 29,7 cm)', papel: 'Couché Fosco 150g (ou 300g premium)', acabamento: 'Refile · Frente e Verso', preco: '' },
          'Gráfico de Crescimento':  { cat: 'Gráfico Clínico', tam: 'A4 (21 × 29,7 cm) · 4 páginas', papel: 'Offset 120g', acabamento: 'Refile · Frente e Verso', preco: '~R$244,59 / 250 un.' },
          'Orientação':              { cat: 'Orientação Médica', tam: 'A4 (21 × 29,7 cm)', papel: 'Offset 120g', acabamento: 'Refile · Frente', preco: '~R$261,07 / 250 un.' },          'Diário do Xixi':         { cat: 'Diário de Controle', tam: 'A4 Horizontal', papel: 'Offset 120g+', acabamento: 'Refile', preco: '' },
          'Meu Pratinho':           { cat: 'Guia Educativo', tam: 'A4 Horizontal', papel: 'Couché Fosco 115g', acabamento: 'Refile · Frente e Verso', preco: '~R$318,80 / 250 un.' },
          'Ficha de Cadastro':      { cat: 'Ficha Cadastral', tam: 'A4 (21 × 29,7 cm)', papel: 'Offset 120g', acabamento: 'Blocado Colado · 50 vias', preco: '' },
          'Certificado de Coragem': { cat: 'Certificado', tam: 'A5 (14,8 × 21 cm)', papel: 'Cartão 300g', acabamento: 'Refile · Frente', preco: '~R$409,09 / 250 un.' },
          'Tag para Sacola':        { cat: 'Tag / Etiqueta', tam: '9×4,8 cm · 4,8×4,8 cm · 6×6 cm', papel: 'Couché 300g+', acabamento: 'Refile · Furo', preco: '' },
          'Cartão de Aniversário':  { cat: 'Flyer', tam: 'A6 (10,5 × 14,8 cm)', papel: 'Couché 240g+', acabamento: 'Refile', preco: '' },
          'Caderneta':              { cat: 'Livreto', tam: 'A5 (14,8 × 21 cm)', papel: 'Offset 120g+', acabamento: 'Grampo canoa', preco: '' },
          'Livro de Atividades':    { cat: 'Livreto', tam: 'A5 (14,8 × 21 cm)', papel: 'Offset 120g+', acabamento: 'Grampo canoa', preco: '' },
        };
        const folderItems = ['Guia de Cuidados','Guia Alimentar','Guia de Desenvolvimento','Cartão de Vacina','Guia Pré-natal', 'Guia do Sono'];
        const isAmamentacaoModal = pendingItem?.includes('Amamentação');
        
        let spec = Object.keys(SPECS).find(k => pendingItem?.includes(k)) ? SPECS[Object.keys(SPECS).find(k => pendingItem?.includes(k))] : (folderItems.some(f => pendingItem?.includes(f)) ? { cat: 'Folder Trifold', tam: 'A5 fechado (14,8×21 cm) · 6 páginas', papel: 'Couché Fosco 90g', acabamento: 'Carteira · 2 Dobras', preco: '~R$326,56 / 250 un.' } : null);
        
        if (isAmamentacaoModal) {
          spec = { cat: 'Folder Sanfonado', tam: 'DL (10×20 cm) · 8 páginas', papel: 'Couché Fosco 90g', acabamento: 'Sanfona · 3 Dobras', preco: '~R$337,60 / 250 un.' };
        }
        if (pendingItem?.includes('Pré-Natal') || pendingItem?.includes('Pre-Natal')) {
          spec = { cat: 'Folder Simples', tam: 'A5 fechado (14,8×21 cm) · 4 páginas', papel: 'Couché Fosco 150g', acabamento: 'Simples · 1 Dobra', preco: '~R$430,95 / 250 un.' };
        }
        // A4 upgrade para itens que suportam
        if (spec && paperSize === 'a4' && ['Receituário', 'Recibo', 'Ficha', 'Prontuário', 'Certificado', 'Checklist', 'Atestado'].some(n => pendingItem?.includes(n))) {
          spec = { ...spec, tam: 'A4 (21 × 29,7 cm)' };
        }

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
        onClick={() => { if (currentItem === 'Pack Digital para Instagram' || currentItem === 'Assinatura de E-mail') { openGabarito(currentItem); } else { setPendingItem(currentItem); setShowPrintModal(true); } }}
        style={{ width: '100%', padding: '14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
      >
        {currentItem === 'Pack Digital para Instagram' ? `Baixar ${(INSTA_FORMATS[storyFormatIdx]||INSTA_FORMATS[0]).id === 'post' ? 'Post' : 'Story'} — PNG / JPG →` : currentItem === 'Assinatura de E-mail' ? 'Baixar Assinatura — PNG →' : 'Baixar PDF Padrão Gráfica →'}
      </button>

      {/* Upsell: só no último item */}
      {(() => {
        const isLastItem = idx === itens.length - 1;
        const todosDisponiveis = [...PAPELARIA_GERAL, ...(isSaude ? PAPELARIA_MEDICA : []), ...(isSaude ? DIGITAIS_MEDICOS : [])];
        const faltando = todosDisponiveis.filter(i => !itens.includes(i));
        if (!isLastItem || faltando.length === 0) return null;
        return (
          <div style={{ marginTop: '8px', padding: '16px 18px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '10px' }}>
              + Adicionar mais itens — R$ 30 cada
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {faltando.map(item => (
                <button key={item} onClick={() => {
                  setUpsellSelecionados(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                }} style={{ padding: '5px 12px', borderRadius: '20px', border: `1.5px solid ${upsellSelecionados.includes(item) ? accentColor : '#ddd'}`, background: upsellSelecionados.includes(item) ? `${accentColor}12` : '#fff', fontSize: '0.72rem', fontWeight: 600, color: upsellSelecionados.includes(item) ? accentColor : '#888', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {upsellSelecionados.includes(item) ? '✓ ' : '+ '}{item}
                </button>
              ))}
            </div>
            {upsellSelecionados.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333', fontFamily: 'Montserrat,sans-serif' }}>
                  {upsellSelecionados.length} item{upsellSelecionados.length > 1 ? 's' : ''} · <strong>R$ {(upsellSelecionados.length * 30).toFixed(2).replace('.', ',')}</strong>
                </div>
                <button onClick={handleUpsellCheckout} disabled={upsellLoading} style={{ padding: '8px 20px', background: accentColor, color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Montserrat,sans-serif', cursor: upsellLoading ? 'wait' : 'pointer', opacity: upsellLoading ? 0.7 : 1 }}>
                  {upsellLoading ? 'Aguarde...' : 'Adicionar →'}
                </button>
              </div>
            )}
            {upsellErro && <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#e55', fontFamily: 'Montserrat,sans-serif' }}>{upsellErro}</div>}
          </div>
        );
      })()}
    </div>
  );
}

function EntregaContent({ brand, plano }) {
  const [step, setStepState] = useState('placa');
  const setStep = (s) => { setStepState(s); try { localStorage.setItem('brandbox_step', s); } catch {} };

  const [bgColor, setBgColor] = useState('#ffffff');
  const [submarcaBg, setSubmarcaBg] = useState(null); // null = usa accentColor como padrão
  const [submarcaColor, setSubmarcaColorState] = useState(() => { try { return localStorage.getItem('brandbox_submarca_color') || null; } catch { return null; } });
  const setSubmarcaColor = (c) => { setSubmarcaColorState(c); try { localStorage.setItem('brandbox_submarca_color', c); } catch {} };
  const [submarcaTextColor, setSubmarcaTextColorState] = useState(() => { try { return localStorage.getItem('brandbox_submarca_text_color') || '#ffffff'; } catch { return '#ffffff'; } });
  const setSubmarcaTextColor = (c) => { setSubmarcaTextColorState(c); try { localStorage.setItem('brandbox_submarca_text_color', c); } catch {} };
  const [logoColor, setLogoColorState] = useState(() => { try { return localStorage.getItem('brandbox_logo_color') || brand.activeColor || '#dc3495'; } catch { return brand.activeColor || '#dc3495'; } });
  const setLogoColor = (c) => { setLogoColorState(c); try { localStorage.setItem('brandbox_logo_color', c); } catch {} };
  const [logoLayout, setLogoLayout] = useState(() => { try { return localStorage.getItem('brandbox_logo_layout') || 'stacked'; } catch { return 'stacked'; } });
  const setLayout = (l) => { setLogoLayout(l); try { localStorage.setItem('brandbox_logo_layout', l); } catch {} };
  const [downloading, setDownloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [marca, setMarca] = useState(brand.editData?.marca || '');
  const [tagline, setTagline] = useState(brand.editData?.tagline || '');
  const [fontOverride, setFontOverrideState] = useState(() => {
    try { const s = localStorage.getItem('brandbox_font_override'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const setFontOverride = (v) => {
    setFontOverrideState(v);
    try { if (v) localStorage.setItem('brandbox_font_override', JSON.stringify(v)); else localStorage.removeItem('brandbox_font_override'); } catch {}
  };
  const [estampaPatterns, setEstampaPatterns] = useState(brand.pattern ? [brand.pattern] : []);
  const [estampaGenCount, setEstampaGenCount] = useState(brand.patternGenerationCount || 0);
  const [estampaSelectedIdx, setEstampaSelectedIdx] = useState(0);

  useEffect(() => {
    const pat = estampaPatterns[estampaSelectedIdx];
    if (pat) try { localStorage.setItem('brandbox_pattern', JSON.stringify(pat)); } catch {}
  }, [estampaPatterns, estampaSelectedIdx]);
  const coresRef = useRef(null);
  const [colorOrder, setColorOrderState] = useState(() => { try { const s = localStorage.getItem('brandbox_color_order'); return s ? JSON.parse(s) : null; } catch { return null; } });
  const setColorOrder = (v) => { setColorOrderState(v); try { localStorage.setItem('brandbox_color_order', JSON.stringify(v)); } catch {} };
  const [downloadingCores, setDownloadingCores] = useState(false);
  const [comBorda, setComBorda] = useState(true);
  const [patternScale, setPatternScale] = useState(150);
  const [borderColor, setBorderColor] = useState(null);
  const [localSlogan, setLocalSlogan] = useState(brand?.editData?.tagline || '');
  const [storyTemplateIdx, setStoryTemplateIdx] = useState(0);
  const [storyFormatIdx, setStoryFormatIdx] = useState(0);
  const [papelariaNavIdx, setPapelariaNavIdx] = useState(0);
  const [papelariaNavItens, setPapelariaNavItens] = useState([]);
  const [customLogoSrc, setCustomLogoSrcState] = useState(() => { try { return localStorage.getItem('brandbox_custom_logo') || null; } catch { return null; } });
  const setCustomLogoSrc = (v) => { setCustomLogoSrcState(v); try { if (v) localStorage.setItem('brandbox_custom_logo', v); else localStorage.removeItem('brandbox_custom_logo'); } catch {} };
  const [customLogoScaleMap, setCustomLogoScaleMapState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('brandbox_custom_logo_scales') || '{}'); } catch { return {}; }
  });
  
  const LOGO_SCALE_DEFAULTS = {
    'Cartão de Visita': 135,
    'Cartão de Retorno': 200,
    'Arte para Caneca': 180,
    'Recibo': 165,
    'Envelope Ofício': 135,
    'Receituário Padrão': 180,
    'Receituário de Controle Especial': 105,
    'Prontuário Médico': 190,
    'Receita de Alta': 215,
    'Ficha de Cadastro': 155,
    'Guia de Vacinação': 150,
    'Guia de Desenvolvimento': 155,
    'Guia de Cuidados': 150,
    'Guia Alimentar': 150,
    'Guia do Sono': 150,
    'Orientação Recém-Nascido': 160,
    'Guia de Amamentação': 210,
    'Envelope Saco': 130,
    'Guia de Desenvolvimento': 85,
    'Cartão de Exame Pré-Natal': 120,
    'Checklist Maternidade': 175,
    'Etiqueta para Correios': 200,
    'Tag para Sacola': 40,
    'Pasta A4': 150,
    'Certificado de Coragem': 270,
    'Diário do Xixi': 115,
    'Meu Pratinho': 150,
  };
  const getCustomLogoScale = (item) => customLogoScaleMap[item] ?? (LOGO_SCALE_DEFAULTS[item] || 100);
  const LOGO_SCALE_MAX = { 'Tag para Sacola': 50, 'Arte para Caneca': 300 };
  const getCustomLogoScaleMax = (item) => LOGO_SCALE_MAX[item] || 300;
  const setCustomLogoScale = (item, v) => {
    setCustomLogoScaleMapState(prev => {
      const next = { ...prev, [item]: v };
      try { localStorage.setItem('brandbox_custom_logo_scales', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  // para aba logo (sem item específico) usa default geral
  const customLogoScale = getCustomLogoScale('Cartão de Visita');
  const [customLogoWarn, setCustomLogoWarn] = useState(null);
  
  // editData enriquecido com logo customizada — flui automaticamente para LogoPreviewHTML via editData
  const editDataWithLogo = React.useMemo(() => ({
    ...brand.editData,
    ...(fontOverride ? { fontFamily: fontOverride.fontFamily, fontWeight: fontOverride.weight || 700, fontStyle: fontOverride.style || 'serif', fontSizeBoost: fontOverride.sizeBoost || 1, fontLetterSpacing: fontOverride.letterSpacing || null } : {}),
    ...(customLogoSrc ? { customLogoSrc, customLogoScale } : {}),
  }), [brand.editData, customLogoSrc, customLogoScale, fontOverride]);
  
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx] ? `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}` : null;
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
  const crmLine = isSaude && crmData?.crm ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}` : null;

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
      link.download = `Paleta-de-Cores_${marca || 'marca'}.png`;
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
  const [selectedIcon, setSelectedIconState] = useState(() => { try { return localStorage.getItem('brandbox_selected_icon') || brand.selectedIcon || null; } catch { return brand.selectedIcon || null; } });
  const setSelectedIcon = (v) => { setSelectedIconState(v); try { if (v) localStorage.setItem('brandbox_selected_icon', v); else localStorage.removeItem('brandbox_selected_icon'); } catch {} };
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

  // Aplica ordem de prioridade definida pelo usuário
  const orderedPaletteColors = colorOrder
    ? colorOrder.map(i => paletteColors[i]).filter(Boolean)
    : paletteColors;

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
      const _dlBg = step === 'submarca' ? (submarcaBg || '#f5f5f5') : bgColor;
      const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: _dlBg });
      const link = document.createElement('a');
      link.download = `Logo_com-fundo_${marca || 'marca'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const trimCanvas = (canvas, padding = 20) => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let minX = width, minY = height, maxX = 0, maxY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 8) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width - 1, maxX + padding);
    maxY = Math.min(height - 1, maxY + padding);
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    out.getContext('2d').drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
    return out;
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
      const trimmed = trimCanvas(canvas, 24);
      const link = document.createElement('a');
      link.download = `Logo_transparente_${marca || 'marca'}.png`;
      link.href = trimmed.toDataURL('image/png');
      link.click();
    } catch {
      el.style.background = prev;
    } finally {
      setDownloading(false);
    }
  };

  // accentColor = cor principal: respeita a ordem definida na aba Cores, senão usa logoColor
  const accentColor = orderedPaletteColors[0] || logoColor || '#dc3495';

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: 'Montserrat, sans-serif', paddingBottom: '3rem' }}>

      {/* Banner topo */}
      <div className="mobile-col" style={{ background: '#e8f7f5', padding: '10px 20px', textAlign: 'center', fontSize: '0.78rem', color: '#1a7a6e', fontWeight: 600, letterSpacing: '0.3px', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
        <span>🎉 Pagamento confirmado! Aqui está sua marca.</span>
        <span style={{ fontSize: '0.7rem', color: '#115048' }}>Faça o download dos arquivos neste dispositivo atual por segurança.</span>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1.4rem 0' }}>

        {/* NOVO MENU DE NAVEGAÇÃO CATEGORIZADA */}
        <BrandBoxNav step={step} setStep={setStep} plano={plano} papelariaItens={papelariaNavItens} papelariaIdx={papelariaNavIdx} setPapelariaIdx={setPapelariaNavIdx} />

        {/* Header (Simplificado) */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
              {step === 'placa' ? 'Placa da Marca' : step === 'manifesto' ? 'Manifesto da Marca' : step === 'tomdevoz' ? 'Tom de Voz' : step === 'fonte' ? 'Fonte da Marca' : step === 'logo' ? 'Sua Logo' : step === 'submarca' ? 'Sua Submarca' : step === 'estampa' ? 'Sua Estampa' : step === 'cores' ? 'Suas Cores' : step === 'paleta' ? 'Sua Paleta' : step === 'cartao' ? 'Cartão Digital' : step === 'pack-instagram' ? 'Pack Digital para Instagram' : step === 'assinatura-email' ? 'Assinatura de E-mail' : step === 'guia' ? 'Guia da Marca' : 'Sua Papelaria'}
            </h1>
          </div>
        </div>

        {/* Área da estampa */}
        {step === 'estampa' && <EstampaStep brand={brand} accentColor={accentColor} marca={marca} patterns={estampaPatterns} setPatterns={setEstampaPatterns} genCount={estampaGenCount} setGenCount={setEstampaGenCount} selectedIdx={estampaSelectedIdx} setSelectedIdx={setEstampaSelectedIdx} paletteColors={paletteColors} patternScale={patternScale} setPatternScale={setPatternScale} />}

        {/* Cores — prioridade/ordem */}
        {step === 'cores' && <CoresPrioridadeStep paletteColors={paletteColors} colorOrder={colorOrder} setColorOrder={setColorOrder} accentColor={accentColor} />}

        {/* Paleta — visualização completa */}
        {step === 'paleta' && <CoresStep paletteColors={paletteColors} accentColor={accentColor} paletaNome={paletas?.find(p => p.id === brand.selectedPaleta)?.nome_variacao} coresRef={coresRef} />}

        {/* Cartão digital */}
        {step === 'cartao' && <CartaoStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} contacts={cartaoContacts} setContacts={setCartaoContacts} qrLink={cartaoQrLink} setQrLink={setCartaoQrLink} showQR={cartaoShowQR} setShowQR={setCartaoShowQR} logoLayout={logoLayout} editData={editDataWithLogo} logoColor={logoColor} setLayout={setLayout} />}
        {step === 'pack-instagram' && <FundoInstaPreview brand={brand} editData={editDataWithLogo} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />}
        {step === 'assinatura-email' && <AssinaturaEmailPreview brand={brand} editData={editDataWithLogo} accentColor={accentColor} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />}

        {/* Placa da marca */}
        {step === 'placa' && <PlacaStep brand={brand} accentColor={accentColor} paletteColors={orderedPaletteColors} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} editData={editDataWithLogo} logoColor={logoColor} iconPath={currentIconPath} submarcaColor={submarcaColor} submarcaTextColor={submarcaTextColor} />}

        {/* Manifesto */}
        {step === 'manifesto' && <ManifestoStep accentColor={accentColor} marca={marca} tagline={tagline} brand={brand} isSaude={isSaude} editData={editDataWithLogo} />}

        {/* Tom de Voz */}
        {step === 'tomdevoz' && <TomDeVozStep accentColor={accentColor} marca={marca} tagline={tagline} brand={brand} editData={editDataWithLogo} />}

        {step === 'fonte' && <FonteStep brand={brand} accentColor={accentColor} marca={marca} tagline={tagline} editData={editDataWithLogo} onFontChange={(f) => setFontOverride(f)} />}

        {/* Guia da marca */}
        {step === 'guia' && <GuiaStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} tagline={tagline} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} editData={editDataWithLogo} />}

        {/* Papelaria / Gabaritos */}
        {step === 'papelaria' && <PapelariaStep brand={brand} accentColor={accentColor} paletteColors={orderedPaletteColors} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} cartaoContacts={cartaoContacts} setCartaoContacts={setCartaoContacts} plano={plano} isSaude={isSaude} crmData={crmData} setCrmData={setCrmData} marca={marca} editData={editDataWithLogo} logoColor={logoColor} logoLayout={logoLayout} setLayout={setLayout} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} onNavSync={setPapelariaNavItens} navIdx={papelariaNavIdx} setNavIdx={setPapelariaNavIdx} customLogoSrc={customLogoSrc} getCustomLogoScale={getCustomLogoScale} setCustomLogoScale={setCustomLogoScale} getCustomLogoScaleMax={getCustomLogoScaleMax} customLogoScaleMap={customLogoScaleMap} />}

        {/* Área da logo */}
        {step !== 'estampa' && step !== 'cores' && step !== 'paleta' && step !== 'cartao' && step !== 'guia' && step !== 'manifesto' && step !== 'tomdevoz' && step !== 'fonte' && step !== 'placa' && step !== 'papelaria' && step !== 'pack-instagram' && step !== 'assinatura-email' && <div
          ref={logoRef}
          style={{
            width: '100%', aspectRatio: '1 / 1',
            background: step === 'submarca' ? (submarcaBg || '#f5f5f5') : bgColor,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <div style={{ width: '85%', height: '68%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {step === 'logo' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogoPreviewHTML editData={editDataWithLogo} color={logoColor} layout={logoLayout} scaleFactor={1.1} maxWidth="100%" maxHeight="100%" />
              </div>
            )}
            {step !== 'logo' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrandTemplateSVG
                  data={seloData}
                  color={submarcaColor || accentColor}
                  textColor={submarcaTextColor}
                  side="verso"
                  hideBackground={true}
                  iconPath={currentIconPath}
                />
              </div>
            )}
          </div>
        </div>}

        {/* Controles */}
        {step !== 'estampa' && step !== 'cores' && step !== 'paleta' && step !== 'cartao' && step !== 'guia' && step !== 'manifesto' && step !== 'tomdevoz' && step !== 'fonte' && step !== 'placa' && step !== 'papelaria' && step !== 'pack-instagram' && step !== 'assinatura-email' &&
        <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Upload logo própria */}
          {step === 'logo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SectionLabel>Usar logo própria</SectionLabel>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => { setCustomLogoSrc(null); setCustomLogoWarn(null); }}
                  style={{ flex: 1, padding: '10px 8px', border: `1.5px solid ${!customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: !customLogoSrc ? `${accentColor}12` : '#fff', color: !customLogoSrc ? accentColor : '#aaa', transition: 'all 0.15s' }}
                >
                  ✨ Logo sugerida
                </button>
                <label style={{ flex: 1, padding: '10px 8px', border: `1.5px solid ${customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: customLogoSrc ? `${accentColor}12` : '#fff', color: customLogoSrc ? accentColor : '#aaa', transition: 'all 0.15s' }}>
                  {customLogoSrc ? '✓ Minha logo' : '+ Minha logo'}
                  <input type="file" accept="image/png" style={{ display: 'none' }} onClick={e => { e.target.value = null; }} onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.type !== 'image/png') {
                      setCustomLogoWarn('Por favor envie um arquivo PNG.');
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      setCustomLogoWarn('Arquivo muito grande (máx. 5MB). Otimize o PNG e tente novamente.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = ev => {
                      const src = ev.target.result;
                      // Verifica fundo transparente via canvas
                      const img = new Image();
                      img.onload = () => {
                        const minDim = Math.min(img.width, img.height);
                        if (minDim < 500) {
                          setCustomLogoWarn(`Imagem muito pequena (${img.width}×${img.height}px). Envie pelo menos 500×500px para garantir qualidade na impressão.`);
                          return;
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width; canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const pts = [
                          [0, 0], [img.width - 1, 0], [0, img.height - 1], [img.width - 1, img.height - 1],
                          [Math.floor(img.width / 2), 0], [Math.floor(img.width / 2), img.height - 1],
                        ];
                        const hasOpaqueCorner = pts.some(([x, y]) => ctx.getImageData(x, y, 1, 1).data[3] > 20);
                        const warn = hasOpaqueCorner
                          ? '⚠️ A logo parece ter fundo. Para melhor resultado, use PNG com fundo transparente.'
                          : minDim < 1000
                          ? `✓ Logo carregada (${img.width}×${img.height}px). Para impressão de alta qualidade, recomendamos acima de 1000px.`
                          : null;
                        setCustomLogoWarn(warn);

                        // Auto-trim: remove espaço transparente ao redor da logo
                        if (!hasOpaqueCorner) {
                          const data = ctx.getImageData(0, 0, img.width, img.height).data;
                          let top = img.height, bottom = 0, left = img.width, right = 0;
                          for (let y = 0; y < img.height; y++) {
                            for (let x = 0; x < img.width; x++) {
                              if (data[(y * img.width + x) * 4 + 3] > 10) {
                                if (y < top) top = y;
                                if (y > bottom) bottom = y;
                                if (x < left) left = x;
                                if (x > right) right = x;
                              }
                            }
                          }
                          if (right > left && bottom > top) {
                            const pad = Math.round(Math.max(img.width, img.height) * 0.02);
                            const tx = Math.max(0, left - pad), ty = Math.max(0, top - pad);
                            const tw = Math.min(img.width, right + pad) - tx;
                            const th = Math.min(img.height, bottom + pad) - ty;
                            const trimCanvas = document.createElement('canvas');
                            trimCanvas.width = tw; trimCanvas.height = th;
                            const trimCtx = trimCanvas.getContext('2d');
                            trimCtx.drawImage(canvas, tx, ty, tw, th, 0, 0, tw, th);
                            // Remove pixels quase-brancos das bordas (fundo branco residual)
                            const trimData = trimCtx.getImageData(0, 0, tw, th);
                            const d = trimData.data;
                            for (let i = 0; i < d.length; i += 4) {
                              if (d[i] > 240 && d[i+1] > 240 && d[i+2] > 240 && d[i+3] > 200) {
                                d[i+3] = 0; // torna transparente
                              }
                            }
                            trimCtx.putImageData(trimData, 0, 0);
                            setCustomLogoSrc(trimCanvas.toDataURL('image/png'));
                            return;
                          }
                        }
                        setCustomLogoSrc(src);
                      };
                      img.src = src;
                    };
                    reader.readAsDataURL(file);
                  }} />
                </label>
              </div>
              {customLogoWarn && (
                <div style={{ fontSize: '0.72rem', color: '#b87000', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.4 }}>
                  {customLogoWarn}
                </div>
              )}
              {customLogoSrc && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#999', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Escala</span>
                  <input type="range" min="10" max="200" step="5" value={customLogoScale}
                    onChange={e => setCustomLogoScale(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{customLogoScale}%</span>
                </div>
              )}
            </div>
          )}

          {/* Slogan — sempre visível na aba logo */}
          {!customLogoSrc && step === 'logo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SectionLabel>Slogan</SectionLabel>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Ex: Delicadeza em cada detalhe"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${logoColor}44`, fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', background: '#fff', outline: 'none', color: '#444', letterSpacing: '0.3px' }}
              />
            </div>
          )}

          {/* Editar nome — colapsável */}
          {!customLogoSrc && <div>
            <button
              onClick={() => setShowEdit(v => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <SectionLabel>✏️ Editar nome {showEdit ? '▲' : '▼'}</SectionLabel>
            </button>
            {showEdit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <input
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  placeholder="Nome da marca"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />
                {step !== 'logo' && (
                  <input
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="Tagline / frase da marca"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                  />
                )}
              </div>
            )}
          </div>}

          {/* Layout da logo */}
          {!customLogoSrc && step === 'logo' && marca.split(' ').length > 1 && (
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

          {/* Cor do selo (submarca) — independente da cor da logo */}
          {step === 'submarca' && (
            <div>
              <SectionLabel>Cor do selo</SectionLabel>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {['#000000', '#ffffff'].map(hex => (
                  <ColorDot key={hex} color={hex} selected={(submarcaColor || accentColor) === hex} onClick={() => setSubmarcaColor(hex)} outlined={hex === '#ffffff'} />
                ))}
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={(submarcaColor || accentColor) === hex} onClick={() => setSubmarcaColor(hex)} />
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

          {/* Cor da logo / texto */}
          <div>
            <SectionLabel>{step === 'submarca' ? 'Cor do texto' : 'Cor da logo'}</SectionLabel>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Opções fixas: preto e branco */}
              {['#000000', '#ffffff'].map(hex => (
                <ColorDot key={hex} color={hex} selected={step === 'submarca' ? submarcaTextColor === hex : logoColor === hex} onClick={() => step === 'submarca' ? setSubmarcaTextColor(hex) : setLogoColor(hex)} outlined={hex === '#ffffff'} />
              ))}
              {/* Cores da paleta */}
              {paletteColors.map((hex, i) => (
                <ColorDot key={i} color={hex} selected={step === 'submarca' ? submarcaTextColor === hex : logoColor === hex} onClick={() => step === 'submarca' ? setSubmarcaTextColor(hex) : setLogoColor(hex)} />
              ))}
            </div>
          </div>
        </div>}

        {/* Botões REDESENHADOS */}
        <div style={{ marginTop: '1.6rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* BOTÕES DE DOWNLOAD (AÇÃO PRO) */}
          {(step === 'logo' || step === 'submarca') && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={downloadTransparent}
                disabled={!!downloading}
                style={{ flex: 1, padding: '14px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: downloading === 'png' ? 0.6 : 1 }}
              >
                {downloading === 'png' ? '...' : 'PNG Transparente →'}
              </button>
              <button
                onClick={downloadComFundo}
                disabled={!!downloading}
                style={{ flex: 1, padding: '14px 8px', background: 'none', color: accentColor, border: `2px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: downloading === 'fundo' ? 0.6 : 1 }}
              >
                {downloading === 'fundo' ? '...' : 'Com Fundo →'}
              </button>
            </div>
          )}

          {step === 'cores' && <CoresSalvarButton colorOrder={colorOrder} accentColor={accentColor} />}

          {step === 'pack-instagram' && (
            <button onClick={async () => {
              const el = document.querySelector('[data-insta-preview]');
              if (!el) return;
              const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
              const link = document.createElement('a');
              link.download = `Pack-Instagram_${marca || 'marca'}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
            }} style={{ width: '100%', padding: '14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              Baixar PNG →
            </button>
          )}

          {step === 'assinatura-email' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { const el = document.querySelector('[data-assinatura-copy]'); if (el) el.click(); }}
                style={{ flex: 1, padding: '14px 8px', background: 'none', color: accentColor, border: `2px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Copiar HTML →
              </button>
              <button onClick={async () => {
                const el = document.querySelector('[data-assinatura-preview]');
                if (!el) return;
                const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                link.download = `Assinatura-Email_${marca || 'marca'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
              }} style={{ flex: 1, padding: '14px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Baixar PNG →
              </button>
            </div>
          )}

          {step === 'paleta' && (
            <button onClick={downloadCoresPNG} disabled={downloadingCores} style={{ width: '100%', padding: '14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: downloadingCores ? 0.6 : 1 }}>
              {downloadingCores ? '...' : 'Baixar Paleta de Cores (PNG) →'}
            </button>
          )}

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
  const normalizePlano = (p) => (p === 'complete' || p === 'experience') ? (p === 'complete' ? 'pro' : 'starter') : (p || 'starter');
  const [plano, setPlano] = useState(() => {
    try {
      const stored = localStorage.getItem('brandbox_plano');
      if (stored) return stored === 'complete' ? 'pro' : stored === 'experience' ? 'starter' : stored;
      const delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
      if (delivery.plano) return delivery.plano === 'complete' ? 'pro' : delivery.plano === 'experience' ? 'starter' : delivery.plano;
      if (delivery.papelariaSelecionada?.length > 0) return 'pro';
    } catch {}
    return 'starter';
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
      // 0. Upsell pago — itens já estão no localStorage (salvos antes do redirect pro Stripe)
      if (params.get('upsell') === '1') {
        localStorage.setItem('brandbox_plano', 'pro');
        setPlano('pro');
        localStorage.removeItem('brandbox_pending_upsell');
      }

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
            // Recupera papelariaSelecionada do localStorage (atualizado com novosItens)
            try {
              const localDelivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}');
              if (localDelivery.papelariaSelecionada?.length > 0) {
                brandFromDb.papelariaSelecionada = localDelivery.papelariaSelecionada;
              }
            } catch {}
            // Se veio de upsell, força plano pro
            if (params.get('upsell') === '1') {
              setPlano('pro');
              localStorage.setItem('brandbox_plano', 'pro');
            }
            setBrand(brandFromDb);
            const rawPlano = data.plano || planoParam || 'starter';
            const planoFromDb = rawPlano === 'complete' ? 'pro' : rawPlano;
            setPlano(planoFromDb);
            localStorage.setItem('brandbox_plano', planoFromDb);

            // Disparar e-mail na primeira visita (sem travar o carregamento da tela)
            if (!data.email_enviado && data.email) {
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: data.email,
                  marca: data.marca,
                  sessionId: sessionParam,
                  plano: planoFromDb,
                }),
              }).then(async () => {
                await supabase
                  .from('entregas')
                  .update({ email_enviado: true })
                  .eq('id', sessionParam);
              }).catch(e => console.warn('Background email dispatch failed:', e));
            }

            if (brandFromDb) {
              setBrand(brandFromDb);
              setLoading(false);
              setShowWelcome(true);
              return;
            }
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
            const derived = delivery.plano || (delivery.papelariaSelecionada ? 'pro' : 'starter');
            localStorage.setItem('brandbox_plano', derived);
            setPlano(derived);
          } catch { setPlano('starter'); }
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
            Pagamento confirmado · {plano === 'pro' ? 'Brand Box Pro' : 'Brand Box Starter'}
          </p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', background: '#fff' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔍</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#1a1a1a' }}>Ops! Não encontramos sua marca</h1>
        <p style={{ fontSize: '1rem', color: '#666', maxWidth: '400px', lineHeight: 1.7, marginBottom: '2rem' }}>
          Não conseguimos localizar os dados da sua identidade visual. Isso pode acontecer se o link expirou ou se houve um erro na finalização.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" style={{ padding: '14px 28px', background: '#dc3495', color: '#fff', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 20px rgba(220,52,149,0.2)' }}>
            Criar nova marca
          </a>
          <button onClick={() => window.location.reload()} style={{ padding: '14px 28px', background: '#f5f5f5', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
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
// FolderAmamentacaoPages logic moved here

const getSafeColor = (hex, amount = 25) => {
  if (!hex) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 200) {
    const darken = (v) => Math.max(0, Math.min(255, Math.floor(v * (1 - amount/100))));
    return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
  }
  return hex;
};

// Quadrants for the generated image:
// 1: Top-Left (Mother)
// 2: Top-Right (Latch)
// 3: Bottom-Left (Manual)
// 4: Bottom-Right (Storage)
const Illustration = ({ quadrant, src }) => {
  const positions = [
    '0% 0%',   // 1
    '100% 0%', // 2
    '0% 100%', // 3
    '100% 100%' // 4
  ];
  if (!src) return <div style={{ width: '100%', height: '80px', background: '#f9f9f9', borderRadius: '4px', border: '1px dashed #ddd' }} />;
  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '1 / 1',
      margin: '0 auto',
      backgroundImage: `url(${src})`,
      backgroundSize: '200% 200%',
      backgroundPosition: positions[quadrant - 1],
      backgroundRepeat: 'no-repeat',
      borderRadius: '4px',
      position: 'relative'
    }} />
  );
};

export function FolderAmamentacaoPage1({ accentColor, borderColor, palette = [], logoComponent, folderRoof = true }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '15px 12px', 
      boxSizing: 'border-box', 
      background: '#fff',
      position: 'relative',
      clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none',
      paddingTop: folderRoof ? '38px' : '15px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
        <div style={{ width: '120px', height: '40px', marginBottom: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{logoComponent}</div>
        <div style={{ width: '35px', height: '1.5px', background: mainColor }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', letterSpacing: '2.5px', textTransform: 'uppercase' }}>GUIA DE</div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#333', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1.1 }}>AMAMENTAÇÃO</div>
        </div>
        
        <div style={{ 
          padding: '2.5px 12px', 
          background: `${mainColor}15`, 
          borderRadius: '20px', 
          border: `0.3px solid ${mainColor}30`,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
           <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, textTransform: 'uppercase', letterSpacing: '0.8px' }}>ALEITAMENTO MATERNO EXCLUSIVO</div>
        </div>
      </div>

      <div style={{ width: '100%', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 5px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>NOME:</span>
           <div style={{ flex: 1, borderBottom: `0.3px solid ${mainColor}40`, height: '7px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>NASCIMENTO:</span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '7px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '8px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage2({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '8px', borderRadius: '1px', textAlign: 'center' }}>
        ALIMENTAÇÃO DA MÃE
      </div>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '10px' }}>
        Recomenda-se uma alimentação balanceada, rica em proteínas, fibras e vitaminas. Coma diversas vezes ao dia em pequenas porções para manter a energia.
      </p>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '15px' }}>
        <strong>Água:</strong> consuma ao menos dois litros por dia. Mantenha copos d'água nos cômodos onde você mais amamenta.
      </p>
      
      <div style={{ marginTop: '20px', border: `0.3px solid ${mainColor}40`, padding: '8px', borderRadius: '5px', background: `${mainColor}05` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '8px', textAlign: 'center', fontSize: '5.2px', letterSpacing: '0.5px' }}>COMPOSIÇÃO DO LEITE MATERNO</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
          {[
            { label: 'Agentes de proteção', w: '100%', c: mainColor },
            { label: 'Crescimento', w: '90%', c: palette[1] || mainColor },
            { label: 'Microbiota', w: '80%', c: palette[2] || mainColor },
            { label: 'Energia', w: '70%', c: palette[3] || mainColor },
            { label: 'Cérebro', w: '60%', c: palette[4] || mainColor },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '38px', textAlign: 'right', fontSize: '3.4px', fontWeight: 600 }}>{item.label}</div>
              <div style={{ flex: 1, height: '4.5px', background: `${item.c}20`, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: item.w, height: '100%', background: item.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage3({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>
        PROBLEMAS COMUNS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>Fissuras nos Mamilos</div>
          <p style={{ lineHeight: 1.4 }}><strong>Causa:</strong> Má posição do bebê ou técnica incorreta.</p>
          <p style={{ lineHeight: 1.4 }}><strong>Tratamento:</strong> Corrija a técnica, aplique leite materno após as mamadas.</p>
        </section>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>Ingurgitamento Mamário</div>
          <p style={{ lineHeight: 1.4 }}><strong>Causa:</strong> Desequilíbrio na produção e drenagem.</p>
          <p style={{ lineHeight: 1.4 }}><strong>Alívio:</strong> Esvazie manualmente, faça massagens suaves na mama.</p>
        </section>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>Antes do retorno:</div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }}>• Aleitamento exclusivo;<br/>• Retirada no local.</div>
        </div>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>Após o retorno:</div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }}>• Amamentar em casa;<br/>• Ordenha no trabalho.</div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage4({ accentColor, borderColor, palette = [], clinicaNome, endereco, allPhones, brand }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>
        APOIO EMOCIONAL
      </div>
      <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '4.6px' }}>O apoio da família é fundamental:</p>
      <ul style={{ paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.5 }}>
        <li>Ambiente calmo favorece a amamentação.</li>
        <li>A mãe precisa de apoio em sua decisão.</li>
        <li>Dividir as tarefas de casa é essencial.</li>
      </ul>
      <div style={{ background: '#f9f9f9', padding: '8px', borderRadius: '5px', border: `0.3px solid ${mainColor}30` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '6px', fontSize: '4.8px' }}>Como Ajudar?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {['Buscar ajuda profissional se necessário', 'Ambiente organizado e confortável', 'Auxiliar nas tarefas domésticas'].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', border: `0.3px solid ${mainColor}`, borderRadius: '1px' }} />
              <span style={{ fontSize: '4px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '12px', textAlign: 'center', borderTop: `0.3px solid ${mainColor}20`, paddingTop: '8px', paddingBottom: '5px' }}>
        <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, marginBottom: '1px' }}>{clinicaNome}</div>
        <div style={{ fontSize: '3.8px', color: '#999', marginBottom: '3px' }}>{endereco}</div>
        <div style={{ fontSize: '5px', fontWeight: 800, color: '#444' }}>{allPhones}</div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage5({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ lineHeight: 1.5, marginBottom: '15px', fontSize: '4.6px' }}>
        <strong>Amamentar é muito mais que nutrir.</strong> É interação, imunidade e desenvolvimento emocional para o bebê.
      </p>
      <div style={{ background: `${mainColor}10`, padding: '10px', borderRadius: '5px', border: `0.2px solid ${mainColor}20`, marginBottom: '15px' }}>
        <p style={{ margin: 0, lineHeight: 1.4, textAlign: 'center' }}>
          A OMS recomenda aleitamento materno exclusivo nos primeiros seis meses de vida.
        </p>
      </div>
      
      <div style={{ fontWeight: 800, color: mainColor, marginBottom: '10px', textTransform: 'uppercase', fontSize: '5.2px', letterSpacing: '0.5px', textAlign: 'center' }}>BENEFÍCIOS DO ALEITAMENTO</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { t: 'Para o Bebê:', c: 'Melhor digestão, imunidade e redução de alergias.' },
          { t: 'Para a Mamãe:', c: 'Auxilia na perda de peso e na saúde uterina.' },
          { t: 'Para a Família:', c: 'Fortalece os vínculos e é prático no dia a dia.' },
        ].map((box, i) => (
          <div key={i} style={{ borderLeft: `2.5px solid ${mainColor}`, paddingLeft: '10px', background: `${mainColor}05`, padding: '6px 10px', borderRadius: '0 4px 4px 0' }}>
            <div style={{ fontWeight: 800, color: mainColor, marginBottom: '2px' }}>{box.t}</div>
            <div style={{ fontSize: '3.8px', color: '#666', lineHeight: 1.3 }}>{box.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage6({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        A PEGA CORRETA
      </div>
      <p style={{ lineHeight: 1.4, marginBottom: '12px', textAlign: 'center' }}>
        Uma pega inadequada pode levar a mamilos doloridos e baixo ganho de peso do bebê.
      </p>
      
      <div style={{ position: 'relative', width: '68px', margin: '0 auto', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
        <img src="/pega-correta.png" style={{ width: '100%', display: 'block' }} />
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: `${mainColor}10`, padding: '8px 5px', borderRadius: '5px', border: `0.3px solid ${mainColor}20` }}>
          <div style={{ fontWeight: 800, color: mainColor, marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>Certo:</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>Boca bem aberta, lábios para fora, queixo na mama.</div>
        </div>
        <div style={{ flex: 1, background: '#fff5f5', padding: '8px 5px', borderRadius: '5px', border: '0.3px solid #feb2b2' }}>
          <div style={{ fontWeight: 800, color: '#c53030', marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>Errado:</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>Boca pouco aberta, bochechas encovadas, dor.</div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage7({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '15px', borderRadius: '1px', textAlign: 'center' }}>
        ORDENHA MANUAL
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '4px', lineHeight: 1.45 }}>
          <p><strong>1.</strong> Lave bem mãos e antebraços.</p>
          <p><strong>2.</strong> Massageie a mama suavemente.</p>
          <p><strong>3.</strong> Polegar acima da aréola, dedos abaixo.</p>
          <p><strong>4.</strong> Pressione para trás e solte.</p>
        </div>
        <div style={{ width: '100%', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
          <img src="/ordenha.png" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: '20px', background: '#fdfdfd', padding: '10px', borderRadius: '5px', border: '0.2px dashed #ddd', textAlign: 'center' }}>
        <p style={{ fontSize: '3.8px', fontStyle: 'italic', margin: 0, color: '#666' }}>
          Dica: Use sempre um frasco de vidro esterilizado com tampa plástica para armazenar.
        </p>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage8({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        ARMAZENAMENTO E USO
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '4px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${mainColor}40` }}>
              <th style={{ textAlign: 'left', padding: '4px' }}>Local</th>
              <th style={{ textAlign: 'right', padding: '4px' }}>Tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '0.1px solid #eee' }}><td style={{ padding: '5px 4px' }}>Geladeira</td><td style={{ textAlign: 'right' }}>Até 12 horas</td></tr>
            <tr style={{ borderBottom: '0.1px solid #eee' }}><td style={{ padding: '5px 4px' }}>Congelador</td><td style={{ textAlign: 'right' }}>Até 15 dias</td></tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ marginBottom: '10px', background: `${mainColor}05`, padding: '8px', borderRadius: '6px', border: `0.3px solid ${mainColor}15` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '3px', fontSize: '4.6px' }}>Como Aquecer:</div>
        <p style={{ lineHeight: 1.3, margin: '0 0 8px 0' }}>Banho-maria (fogo desligado). Nunca use o micro-ondas, para não perder as propriedades.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '35px', height: '35px', position: 'relative', borderRadius: '50%', overflow: 'hidden', border: `0.5px solid ${mainColor}20`, background: '#fff' }}>
            <img src="/banho_maria_circular_neutro_1777906864151.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: '3.4px', color: '#777', margin: 0, fontStyle: 'italic', fontWeight: 600, textAlign: 'center' }}>"O leite materno é o melhor alimento para o seu bebê."</p>
        </div>
      </div>
    </div>
  );
}
