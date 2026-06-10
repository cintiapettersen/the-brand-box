'use client';
import { useSearchParams } from 'next/navigation';
import { useTranslation, LanguageOverrideProvider } from '../../LanguageContext';
import BrandBoxNav from './BrandBoxNav';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import BrandTemplateSVG from '../../../components/BrandTemplateSVG';
import BrandBoard from '../../../components/BrandBoard';
import FolderPage2Art from './FolderPage2Art';
import FolderPage3Art from './FolderPage3Art';
import FolderPage4Art from './FolderPage4Art';
import FolderPage5Art from './FolderPage5Art';
import FolderDevPage2 from './FolderDevPage2';
import FolderDevPage3 from './FolderDevPage3';
import FolderDevPage4 from './FolderDevPage4';
import FolderDevPage5 from './FolderDevPage5';
import { genPDFLogoHtml, PratinhoArtSVG, genPDFFooter, genPDFSimpleFooter, PDFStyles } from './PDFTemplates';
import FolderPage6Etiqueta from './FolderPage6Etiqueta';
import PrenatalPage1 from './PrenatalPage1';
import PrenatalPage2 from './PrenatalPage2';
import PrenatalPage3 from './PrenatalPage3';
import PrenatalPage4 from './PrenatalPage4';
import { STYLE_ICONS } from '../../../lib/styleIcons';
import FONT_MAP from '../../../lib/fontMap';
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
import GuiaAlimentarPreview from './GuiaAlimentarPreview';
import FolderPage4Dynamic from './FolderPage4Dynamic';
import CadernetaPreview from './CadernetaPreview';
import { useScaleToFit } from './useScaleToFit';
import { createClient } from '@supabase/supabase-js';

const ITEM_KEYS_MAP = {
  'Cartão de Visita': 'cartao_visita',
  'Papel Timbrado': 'papel_timbrado',
  'Papel de Presente': 'papel_presente',
  'Tag para Sacola': 'tag_sacola',
  'Etiqueta para Correios': 'etiqueta_correios',
  'Envelope Ofício (23x11,5cm)': 'envelope_oficio',
  'Envelope Saco (24x34cm)': 'envelope_saco',
  'Recibo': 'recibo',
  'Pasta A4': 'pasta_a4',
  'Pasta': 'pasta_a4',
  'Caneca': 'caneca',
  'Cartão de Retorno': 'cartao_retorno',
  'Cartão de Agradecimento (10x15cm)': 'cartao_agradecimento',
  'Cartão de Agradecimento': 'cartao_agradecimento',
  'Caderno (Capa e Contra-capa)': 'caderno',
  'Caderno': 'caderno',
  'Receituário Padrão (A4 e A5)': 'receituario_padrao',
  'Receituário Padrão': 'receituario_padrao',
  'Atestado Médico (A4 e A5)': 'atestado_medico',
  'Atestado Médico': 'atestado_medico',
  'Receituário de Controle Especial': 'receituario_controle',
  'Checklist Maternidade': 'checklist_maternidade',
  'Orientações p/ Recém Nascidos': 'orientacoes_rn',
  'Guia de Cuidados': 'guia_cuidados',
  'Guia Alimentar': 'guia_alimentar',
  'Guia de Desenvolvimento': 'guia_desenvolvimento',
  'Cartão de Vacina': 'cartao_vacina',
  'Guia Pré-natal': 'guia_prenatal',
  'Guia do Sono': 'guia_sono',
  'Caderneta de Saúde': 'caderneta_saude',
  'Livro de Atividades': 'livro_atividades',
  'Certificado de Coragem': 'certificado_coragem',
  'Prontuário Médico': 'prontuario_medico',
  'Diário do Xixi': 'diario_xixi',
  'Meu Pratinho': 'meu_pratinho',
  'Ficha de Cadastro': 'ficha_cadastro',
  'Assinatura de E-mail': 'assinatura_email',
  'Fundo para Stories': 'fundo_stories',
  'Pack Digital para Instagram': 'pack_instagram'
};

const tItem = (itemName, dict) => {
  if (!dict || !dict.papelaria_itens) return itemName;
  const key = ITEM_KEYS_MAP[itemName];
  return key && dict.papelaria_itens[key] ? dict.papelaria_itens[key] : itemName;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.replace(/['"]/g, '') : undefined)
);

export const ITEM_CUSTOM_BASE_SCALES = {
  'Envelope Saco (24x34cm)': 2.0,
  'Envelope Saco': 2.0,
  'Pasta A4': 2.0,
  'Receituário Padrão (A4 e A5)': 2.0,
  'Receituário Padrão': 2.0, 
  'Receituário de Controle Especial': 2.0,
  'Atestado Médico (A4 e A5)': 2.0,
  'Atestado Médico': 2.0, 'Recibo': 2.0,
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
  'Cartão de Visita': 1.0,
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
  const { dictionary } = useTranslation();
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
  // BASE_SCALES foi criado para boostar logos de texto pequenos — não deve amplificar logo imagem
  const effectiveBaseScale = customLogoSrc ? 1 : baseScale;
  // Para texto: slider NÃO entra no tamanho base — é aplicado DEPOIS do autoFit como % de preenchimento
  // Para imagem: slider continua controlando o tamanho diretamente
  const effectiveScaleFactor = customLogoSrc
    ? scaleFactor * (customLogoScale / 100) * effectiveBaseScale
    : scaleFactor * effectiveBaseScale;
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

  React.useEffect(() => {
    if (customLogoSrc) return;
    const el = _fitRef.current;
    if (!autoFit || !el) {
      if (!_fitState.ready) _setFitState({ scale: 1, w: 'auto', h: 'auto', ready: true });
      return;
    }

    const measure = () => {
      if (!el || !_rootRef.current) return;
      const realParent = _rootRef.current.parentNode;
      let tMaxW = targetMaxW;
      let tMaxH = targetMaxH;
      if (maxWidth && String(maxWidth).includes('%') && realParent && realParent.clientWidth > 0) {
        const pct = realParent.clientWidth * (parseFloat(maxWidth) / 100);
        tMaxW = targetMaxW != null ? Math.min(targetMaxW, pct) : pct;
      }
      if (maxHeight && String(maxHeight).includes('%') && realParent && realParent.clientHeight > 0) {
        const pct = realParent.clientHeight * (parseFloat(maxHeight) / 100);
        tMaxH = targetMaxH != null ? Math.min(targetMaxH, pct) : pct;
      }
      const paddingW = withBackground ? 28 : 12;
      const paddingH = withBackground ? 32 : 10;
      tMaxW = Math.max(10, tMaxW - paddingW);
      tMaxH = Math.max(10, tMaxH - paddingH);
      const natW = el.offsetWidth;
      const natH = el.offsetHeight;
      if (!natW || !natH) return;
      const sx = tMaxW / natW;
      const sy = tMaxH / natH;
      const fillScale = Math.min(sx, sy);
      const scale = fillScale * (customLogoScale / 100);
      _setFitState(prev => {
        const nw = natW * scale;
        const nh = natH * scale;
        if (prev.ready) {
          const prevNatW = prev.w / prev.scale;
          const prevNatH = prev.h / prev.scale;
          if (Math.abs(prevNatW - natW) < 5 && Math.abs(prevNatH - natH) < 5) return prev;
          if (Math.abs(prev.scale - scale) < 0.01 && Math.abs(prev.w - nw) < 1.5 && Math.abs(prev.h - nh) < 1.5) return prev;
        }
        return { scale, w: nw, h: nh, ready: true };
      });
    };

    measure();
    // Re-mede quando fontes carregam (evita escala errada com fonte fallback)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [editData, effectiveScaleFactor, targetMaxW, targetMaxH, layout, crm, hideTagline, autoFit, maxWidth, maxHeight, withBackground, forceTrigger, customLogoSrc, customLogoScale]);

  if (customLogoSrc) {
    // BASE_SCALES não amplifica logo imagem — só texto pequeno precisa do boost
    let scaleMultiplier = (customLogoScale / 100) * scaleFactor;
    if (!item) scaleMultiplier *= 1.5; // Boost general views (Sua Logo, Placa, etc)
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
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.92)', padding: '2px 4px', borderRadius: '4px', backdropFilter: 'blur(2px)', maxWidth: '100%' }}>
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
  const taglineText = editData?.tagline || '';
  const taglineLen = taglineText.length;
  
  // Slogan dinâmico: quanto mais longo, menor a fonte e maior o espaçamento (tracking)
  // Ajuste mais agressivo para slogans gigantes (>50 caracteres)
  const taglineSizeBoostFactor = editData?.taglineSizeBoost !== undefined ? editData.taglineSizeBoost : 1.0;
  const taglineScale = (taglineLen > 50 ? 0.16 : taglineLen > 40 ? 0.20 : taglineLen > 25 ? 0.26 : 0.35) * taglineSizeBoostFactor;
  const taglineSizeRem = Math.max(logoSizeRem * taglineScale, 0.32 * effectiveScaleFactor);
  const taglineVisible = taglineSizeRem >= 0.08;
  
  // Gap customizável via taglineGap (fallback para o cálculo dinâmico)
  const gapMultiplier = editData?.taglineGap !== undefined ? editData.taglineGap : (taglineLen > 40 ? 0.20 : 0.35);
  const taglineGapPx = Math.round(taglineSizeRem * 16 * gapMultiplier);
  
  // Tracking (letter-spacing) compensatório ou manual
  const taglineLetterSpacing = editData?.taglineLetterSpacing !== undefined ? `${editData.taglineLetterSpacing}em` : (taglineLen > 45 ? '0.55em' : taglineLen > 30 ? '0.48em' : taglineLen > 15 ? '0.4em' : '0.35em');
  // Slogan wrap dinâmico ou manual
  const shouldWrap = editData?.taglineWrap !== undefined ? editData.taglineWrap : (taglineLen > 25);
  const displaySlogan = (taglineText && taglineText.includes('\n'))
    ? taglineText.split('\n').filter(l => l.trim() !== '')
    : (taglineText && shouldWrap)
      ? (() => {
          const words = taglineText.split(' ');
          const mid = Math.ceil(words.length / 2);
          return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
        })()
      : [taglineText];

  const innerContent = (
    <>
      <div style={{
        fontFamily: `'${editData?.fontFamily || 'Playfair Display'}', serif`,
        fontWeight: editData?.fontWeight || 700,
        fontSize,
        color: color,
        textAlign: alignLeft ? 'left' : 'center',
        lineHeight: editData?.fontLineHeight || (isScript ? 0.9 : 1.22),
        letterSpacing: editData?.fontLetterSpacing || (isScript ? '0px' : '1px'),
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontFamily: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', whiteSpace: 'nowrap' }}>{line}</div>
        ))}
      </div>
      {(editData?.tagline && !hideTagline && taglineVisible) && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${taglineSizeRem.toFixed(2)}rem`, letterSpacing: taglineLetterSpacing, textTransform: 'uppercase', color: taglineColor || '#666', marginTop: `${taglineGapPx}px`, textAlign: 'center', lineHeight: 1.2 }}>
          {displaySlogan.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap' }}>{line}</div>
          ))}
        </div>
      )}
      {crm && (
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: `${(taglineSizeRem * 0.75).toFixed(2)}rem`, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginTop: `${Math.max(1, Math.round(taglineGapPx * 0.35))}px`, textAlign: 'center', opacity: 0.8, whiteSpace: 'nowrap' }}>
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
      <div ref={_rootRef} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: alignLeft ? 'flex-start' : 'center', background: 'rgba(255,255,255,0.92)', padding: '18px 14px 14px', borderRadius: '4px', backdropFilter: 'blur(2px)', maxWidth: '100%', maxHeight: '100%', boxSizing: 'border-box' }}>
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

const MAX_GENERATIONS = 5;

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

function colorNamePT(hex, dictionary) {
  if (!hex || hex.length < 7) return dictionary?.color_names?.['Cor Especial'] || 'Cor Especial';
  const [r,g,b] = hexToRgb(hex);
  let minDist = Infinity, bestName = dictionary?.color_names?.['Tom Especial'] || 'Tom Especial';
  for (const [cr,cg,cb,name] of COLOR_PALETTE_AFETIVA) {
    const dist = Math.sqrt((r-cr)**2+(g-cg)**2+(b-cb)**2);
    if (dist < minDist) { minDist = dist; bestName = dictionary?.color_names?.[name] || name; }
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

function formatPaletaNome(nome, dictionary) {
  if (!nome) return '';
  const phrase = nome.split(/[-_\s]+/)
    .filter(w => w && !/^\d+$/.test(w) && w.toLowerCase() !== 'paleta')
    .map(w => {
      const wCap = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      return dictionary?.palette_words?.[wCap] || wCap;
    })
    .join(' ');
  return `${dictionary?.palette_words?.Paleta?.toUpperCase() || 'PALETA'} ${phrase.toUpperCase()}`;
}

function CoresSalvarButton({ colorOrder, accentColor }) {
  const { dictionary } = useTranslation();
  const [saved, setSaved] = React.useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <button onClick={handleSave} style={{ width: '100%', padding: '14px', background: saved ? '#4CAF50' : '#C03B66', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s' }}>
      {saved ? (dictionary?.color_tab?.order_saved || '✓ Ordem salva! Os impressos já foram atualizados.') : (dictionary?.color_tab?.save_order || 'Salvar ordem das cores →')}
    </button>
  );
}

function CoresPrioridadeStep({ paletteColors, colorOrder, setColorOrder, accentColor, onColorChange }) {
  const { dictionary } = useTranslation();
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

  const labels = [dictionary?.palette_tab?.main || 'Principal', '2ª cor', '3ª cor', '4ª cor', '5ª cor'];
  const sizes = [80, 68, 58, 50, 44];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '6px', fontFamily: 'Montserrat,sans-serif' }}>{dictionary?.color_tab?.priority_order || 'Ordem de Prioridade das Cores'}</p>
        <p style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.5 }}>
          {dictionary?.color_tab?.drag_reorder || 'Arraste para reordenar. A cor no topo aparece mais nas suas artes — a última, menos.'}
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
            <div style={{ position: 'relative', width: `${sizes[i] || 40}px`, height: `${sizes[i] || 40}px`, flexShrink: 0 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: item.color, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: onColorChange ? 'pointer' : 'default' }}
                onClick={() => onColorChange && document.getElementById(`avulso-color-${i}`)?.click()} />
              {onColorChange && (
                <input id={`avulso-color-${i}`} type="color" value={item.color || '#ffffff'}
                  onChange={e => onColorChange(item.idx, e.target.value)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} />
              )}
              {onColorChange && <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', fontSize: '9px', pointerEvents: 'none' }}>✏️</div>}
            </div>
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
  const { dictionary } = useTranslation();
  const tints = [0.25, 0.50, 0.72, 0.88];
  const roleLabels = [dictionary?.palette_tab?.main || 'Principal', dictionary?.palette_tab?.secondary || 'Secundária', dictionary?.palette_tab?.tertiary || 'Terciária', dictionary?.palette_tab?.complementary || 'Complementar', dictionary?.palette_tab?.support || 'Apoio'];

  return (
    <div ref={coresRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {paletaNome && (
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          {formatPaletaNome(paletaNome, dictionary)}
        </p>
      )}
      {paletteColors.map((hex, ci) => (
        <div key={ci} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#fff' }}>
          {/* Swatch principal */}
          <div style={{ background: hex, height: '100px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              {roleLabels[ci] || dictionary?.palette_tab?.color || 'Cor'}
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              {colorNamePT(hex, dictionary)}
            </p>
          </div>
          {/* Hex principal */}
          <div style={{ padding: '8px 16px 6px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.62rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{dictionary?.palette_tab?.main_palette_color || 'cor paleta principal'}</span>
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
                    <p style={{ margin: '0 0 2px', fontSize: '0.55rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{dictionary?.palette_tab?.shade || 'tom'} {ti+1}</p>
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
  const { dictionary } = useTranslation();
  const [localSlogan, setLocalSlogan] = useState(editData?.tagline || '');
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
  const setContact = (key, val) => setContacts(prev => ({ ...prev, [key]: val }));
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx]
    ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
    : null;
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
    <div style="text-align:center; width: 100%; display: flex; justify-content: center; margin-bottom: 8px;">
      ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan: editData.tagline || '', crmLine: null, fontPt: 36, lineH: editData?.fontLineHeight || 1.1, letterSp: editData?.fontLetterSpacing || '1px', hideSlogan: false, maxWidth: '280px', maxHeight: '120px', withBackground: false })}
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
          <button key={o} onClick={() => setOrientation(o)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid', borderColor: orientation === o ? '#C03B66' : '#eee', background: orientation === o ? 'rgba(192, 59, 102, 0.1)' : '#fff', color: orientation === o ? '#C03B66' : '#888', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            {o === 'landscape' ? (dictionary?.digital_tab?.horizontal_card || 'Horizontal (Cartão)') : (dictionary?.digital_tab?.portrait_screen || 'Retrato (Full Screen)')}
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
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} maxWidth="220px" maxHeight="100px" />
          </div>

          <div style={{ width: '50%', height: '1px', background: '#eee' }} />
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.5px' }}>
            {dictionary?.digital_tab?.contact_preference || 'Como prefere entrar em contato?'}
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
            <p style={{ color: '#ccc', fontSize: '0.8rem', textAlign: 'center' }}>{dictionary?.digital_tab?.fill_contacts || 'Preencha os contatos abaixo'}</p>
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
                border: '1px solid', borderColor: logoLayout === l ? '#C03B66' : '#eee',
                background: logoLayout === l ? 'rgba(192, 59, 102, 0.1)' : '#fff',
                color: logoLayout === l ? '#C03B66' : '#888', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {l === 'horizontal' ? (dictionary?.digital_tab?.layout_horizontal || 'Horizontal') : l === 'balanced' ? (dictionary?.digital_tab?.layout_2_lines || '2 Linhas') : (dictionary?.digital_tab?.layout_stacked || 'Empilhada')}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginTop: '1rem', width: '100%', flexWrap: 'wrap' }}>
        <button onClick={async () => {
          const html = downloadHTML(true);
          const file = new File([new Blob([html], { type: 'text/html' })], `${marca || 'marca'}-cartao-digital.html`, { type: 'text/html' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: `Cartão Digital — ${marca || 'Marca'}` }); } catch {}
            return;
          }
          downloadHTML();
        }} style={{ flex: 1, minWidth: '100px', padding: '13px 8px', background: '#C03B66', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
          {dictionary?.digital_tab?.share || '↑ Compartilhar'}
        </button>
        <a 
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Olá! Segue meu Cartão de Visitas Digital Interativo. Salve o arquivo HTML em anexo no seu celular para acessar todos os meus contatos com apenas um clique! 📲✨')}`}
          target="_blank"
          onClick={() => {
            // Baixa o arquivo primeiro
            downloadHTML();
            
            // Avisa o usuário que ele precisa anexar manualmente
            setTimeout(() => {
              alert('Pronto! O arquivo HTML do seu cartão foi baixado. 📥\n\nLembre-se de clicar no "clip de papel" ou "+" 📎 na tela do WhatsApp e anexar o arquivo HTML que baixamos junto com a mensagem!');
            }, 800);
          }} 
          style={{ flex: 1, minWidth: '100px', padding: '13px 8px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap', textDecoration: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="white" style={{ display: 'block' }}>
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.27 5.28.005 11.792.005c3.16.001 6.129 1.233 8.359 3.468s3.461 5.197 3.461 8.353c-.004 6.523-5.28 11.785-11.793 11.785-1.996-.002-3.957-.5-5.744-1.44L0 24zm5.824-2.871l.328.193c1.674.993 3.593 1.517 5.637 1.518 5.728 0 10.387-4.647 10.39-10.354.002-2.766-1.077-5.366-3.038-7.329s-4.564-3.04-7.33-3.04c-5.73 0-10.39 4.65-10.393 10.358 0 2.11.55 4.17 1.59 5.973l.21.36-1.002 3.658 3.73-.978zm13.125-7.794c-.315-.158-1.86-.918-2.175-1.033-.315-.115-.545-.172-.773.172-.228.345-.885 1.114-1.085 1.343-.2.228-.4.258-.715.1-.315-.158-1.33-.49-2.532-1.562-.936-.83-1.568-1.856-1.75-2.172-.182-.315-.02-.485.138-.642.142-.142.315-.368.473-.553.158-.185.21-.315.315-.525.105-.21.053-.394-.026-.552-.079-.158-.773-1.86-1.06-2.553-.28-.673-.562-.58-.773-.59-.2-.01-.428-.01-.657-.01-.228 0-.6.085-.914.428-.315.345-1.202 1.176-1.202 2.87 0 1.693 1.233 3.325 1.405 3.555.172.228 2.428 3.708 5.882 5.197.82.353 1.46.564 1.96.723.824.263 1.575.225 2.167.137.66-.098 1.86-.76 2.124-1.458.263-.697.263-1.3.185-1.428-.079-.128-.288-.208-.604-.366z"/>
          </svg>
          {dictionary?.digital_tab?.send_whatsapp || 'Enviar no Whats'}
        </a>
        <button onClick={downloadHTML} style={{ flex: 1, minWidth: '100px', padding: '13px 8px', background: 'none', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
          {dictionary?.digital_tab?.download_html || '⬇ Baixar HTML'}
        </button>
      </div>

      {/* Campos editáveis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SectionLabel>{dictionary?.digital_tab?.tagline_specialty || 'Tagline / Especialidade'}</SectionLabel>
        <input value={localSlogan} onChange={e => setLocalSlogan(e.target.value.slice(0, 45))} maxLength={45} placeholder="Ex: Ginecologia e Obstetrícia" style={inputStyle} />
        
        <SectionLabel>{dictionary?.digital_tab?.contacts || 'Contatos'}</SectionLabel>
        {CONTACT_FIELDS.map(f => (
          <input key={f.key} value={contacts[f.key]} onChange={e => setContact(f.key, e.target.value)} placeholder={f.label} style={inputStyle} />
        ))}
        <button onClick={() => setShowQR(v => !v)} style={{ padding: '10px', background: showQR ? '#C03B66' : 'none', color: showQR ? '#fff' : '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}>
          {showQR ? (dictionary?.digital_tab?.qr_active || '✓ QR Code ativo') : (dictionary?.digital_tab?.add_qr || '+ QR Code')}
        </button>
        {showQR && (
          <input value={qrLink} onChange={e => setQrLink(e.target.value)} placeholder={dictionary?.digital_tab?.qr_placeholder || 'Link para o QR Code (site, WhatsApp...)'} style={inputStyle} />
        )}
      </div>
    </div>
  );
}

function EstampaStep({ brand, accentColor, marca, patterns, setPatterns, genCount, setGenCount, selectedIdx, setSelectedIdx, paletteColors, patternScale, setPatternScale, estampasRef, originalPattern, setOriginalPattern }) {
  const { dictionary } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [fixingSeams, setFixingSeams] = useState(false);
  // originalPattern vem do pai para sobreviver a re-renders
  const [viewMode, setViewMode] = useState('ampliada');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const bxSpinStyle = `@keyframes bx-spin { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.5} }`;

  const remaining = MAX_GENERATIONS - genCount;
  const patternSrc = patterns[selectedIdx]
    ? (patterns[selectedIdx].url || `data:${patterns[selectedIdx].mimeType};base64,${patterns[selectedIdx].base64}`)
    : null;

  const handleGenerateClick = () => {
    if (patterns.length >= 3) {
      setShowSlotModal(true);
    } else {
      generate();
    }
  };

  const generate = async (replaceIdx = null) => {
    if (genCount >= MAX_GENERATIONS) return;
    setGenerating(true);
    setShowSlotModal(false);
    try {
      const paletas = brand.paletas || [];
      const sel = paletas.find(p => p.id === brand.selectedPaleta);
      const cores = sel?.paleta_hex || sel?.cores_hex || [];
      const estampas = (estampasRef && estampasRef.length > 0) ? estampasRef : (brand.estampas || []);
      const shuffled = [...estampas].sort(() => Math.random() - 0.5);
      const refs = shuffled.map(e => e.image_url).filter(Boolean);
      
      const currentCount = patterns?.length || 0;
      const requestCount = currentCount === 0 ? 3 : 1;
      console.log(`🎨 Gerando com ${refs.length} referência(s). Solicitando ${requestCount} estampa(s).`);

      const replaceUrl = (replaceIdx !== null && patterns[replaceIdx]) ? patterns[replaceIdx].url : null;

      const res = await fetch('/api/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paleta: paletteColors,
          estiloNome: brand.resultadoFinal?.estiloNome || '',
          marca: marca || brand.formData?.marca || '',
          descricao: brand.resultadoFinal?.mensagem || '',
          referenceUrls: refs,
          count: requestCount,
        }),
      });
      const data = await res.json();
      const novos = (data.images || []).filter(p => p.base64);
      if (novos.length > 0) {
        setPatterns(prev => {
          let next;
          if (replaceIdx !== null) {
            next = [...prev];
            next[replaceIdx] = novos[0];
          } else {
            next = [...prev, ...novos];
          }
          const nextActiveIdx = replaceIdx !== null ? replaceIdx : next.length - 1;
          setSelectedIdx(nextActiveIdx);
          try { localStorage.setItem('brandbox_pattern', JSON.stringify(next[nextActiveIdx])); } catch {}
          try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
          return next;
        });
        setGenCount(c => c + 1);

        const sessionId = typeof window !== 'undefined'
          ? (new URLSearchParams(window.location.search).get('session') || localStorage.getItem('brandbox_session'))
          : null;
        if (sessionId && novos[0]?.base64) {
          fetch('/api/salvar-estampa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64: novos[0].base64,
              mimeType: novos[0].mimeType || 'image/png',
              sessionId,
              allPatterns: novos,
              replaceUrl: replaceUrl,
            }),
          })
          .then(r => r.json())
          .then(r => {
            if (r.url) {
              console.log('✅ Estampa salva no Supabase:', r.url);
              setPatterns(prev => {
                const next = [...prev];
                if (replaceIdx !== null) {
                  if (next[replaceIdx]) next[replaceIdx].url = r.url;
                } else {
                  const startIdx = next.length - novos.length;
                  if (startIdx >= 0) {
                    if (next[startIdx]) next[startIdx].url = r.url;
                    if (r.extraUrls && r.extraUrls.length > 0) {
                      for (let j = 0; j < r.extraUrls.length; j++) {
                        const idx = startIdx + 1 + j;
                        if (next[idx]) next[idx].url = r.extraUrls[j];
                      }
                    }
                  }
                }
                try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
                return next;
              });
            } else {
              console.warn('⚠️ Estampa não salva:', r.error);
            }
          })
          .catch(e => console.warn('⚠️ Erro ao salvar estampa:', e));
        }
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

  const makeSeamless = async () => {
    const pat = patterns[selectedIdx];
    if (!pat?.base64) return;
    setOriginalPattern({ ...pat }); // salva backup antes de modificar
    setFixingSeams(true);
    try {
      const result = await new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          const W = img.width, H = img.height;
          const srcCanvas = document.createElement('canvas');
          srcCanvas.width = W; srcCanvas.height = H;
          const srcCtx = srcCanvas.getContext('2d');
          srcCtx.drawImage(img, 0, 0);
          const srcData = srcCtx.getImageData(0, 0, W, H).data;
          const out = new Uint8ClampedArray(srcData);
          const bW = Math.floor(W * 0.12);
          const bH = Math.floor(H * 0.12);
          for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
              const i = (y * W + x) * 4;
              const ax = x < bW ? x / bW : x > W - 1 - bW ? (W - 1 - x) / bW : 1;
              const ay = y < bH ? y / bH : y > H - 1 - bH ? (H - 1 - y) / bH : 1;
              const a = Math.min(ax, ay);
              if (a < 1) {
                const mx = (x + Math.floor(W / 2)) % W;
                const my = (y + Math.floor(H / 2)) % H;
                const mi = (my * W + mx) * 4;
                out[i]   = Math.round(srcData[i]   * a + srcData[mi]   * (1 - a));
                out[i+1] = Math.round(srcData[i+1] * a + srcData[mi+1] * (1 - a));
                out[i+2] = Math.round(srcData[i+2] * a + srcData[mi+2] * (1 - a));
              }
            }
          }
          const outCanvas = document.createElement('canvas');
          outCanvas.width = W; outCanvas.height = H;
          outCanvas.getContext('2d').putImageData(new ImageData(out, W, H), 0, 0);
          resolve(outCanvas.toDataURL('image/png').split(',')[1]);
        };
        img.src = `data:${pat.mimeType || 'image/png'};base64,${pat.base64}`;
      });
      const oldUrl = pat.url || null;
      setPatterns(prev => {
        const next = [...prev];
        next[selectedIdx] = { ...next[selectedIdx], base64: result, mimeType: 'image/png', url: null };
        try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
        try { localStorage.setItem('brandbox_pattern', JSON.stringify(next[selectedIdx])); } catch {}
        return next;
      });
      // Sobe a versão suavizada pro Supabase, substituindo a original
      const sessionId = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('session') || localStorage.getItem('brandbox_session'))
        : null;
      if (sessionId) {
        fetch('/api/salvar-estampa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: result, mimeType: 'image/png', sessionId, replaceUrl: oldUrl }),
        })
        .then(r => r.json())
        .then(r => {
          if (r.url) {
            setPatterns(prev => {
              const next = [...prev];
              if (next[selectedIdx]) {
                next[selectedIdx] = { ...next[selectedIdx], url: r.url };
                try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
                try { localStorage.setItem('brandbox_pattern', JSON.stringify(next[selectedIdx])); } catch {}
              }
              return next;
            });
          }
        })
        .catch(() => {});
      }
    } catch(e) { console.error('makeSeamless error', e); }
    finally { setFixingSeams(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <style>{bxSpinStyle}</style>
      {patternSrc && (
        <div style={{ display: 'flex', background: '#f0f0ee', borderRadius: '30px', padding: '3px', gap: '2px' }}>
          {['Ampliada', 'Repetida', 'No consultório'].map(mode => {
            const modeMap = {
              'Ampliada': 'ampliada',
              'Repetida': 'repetida',
              'No consultório': 'no_consultorio'
            };
            const labelMap = {
              'Ampliada': dictionary?.pattern_tab?.mode_ampliada || 'Ampliada',
              'Repetida': dictionary?.pattern_tab?.mode_repetida || 'Repetida',
              'No consultório': dictionary?.pattern_tab?.mode_mockup || 'No consultório'
            };
            const modeKey = modeMap[mode];
            const active = viewMode === modeKey;
            return (
              <button key={mode} onClick={() => setViewMode(modeKey)}
                style={{ flex: 1, padding: '8px', borderRadius: '26px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#1a1a1a' : '#aaa',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  transition: 'all 0.15s ease' }}>
                {labelMap[mode]}
              </button>
            );
          })}
        </div>
      )}

      {patternSrc ? (
        <div style={{ position: 'relative', width: '100%' }}>
          {generating && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 10 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: (paletteColors && paletteColors[i]) || accentColor, animation: `bx-spin 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 600, textAlign: 'center', lineHeight: 1.5 }}>Criando sua estampa exclusiva…<br/><span style={{ fontWeight: 400, fontSize: '0.78rem', color: '#888' }}>Isso leva cerca de 15–30 segundos</span></span>
            </div>
          )}
          {viewMode === 'no_consultorio' ? (
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
              backgroundSize: viewMode === 'ampliada' ? 'cover' : `${patternScale || 200}px`,
              backgroundRepeat: viewMode === 'ampliada' ? 'no-repeat' : 'repeat',
              backgroundPosition: viewMode === 'ampliada' ? 'center' : 'initial',
            }} />
          )}
          {patterns.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
              {patterns.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div onClick={() => setSelectedIdx(i)}
                    style={{ width: 44, height: 44, borderRadius: '8px', cursor: 'pointer',
                      backgroundImage: `url(${p.url || `data:${p.mimeType};base64,${p.base64}`})`,
                      backgroundSize: 'cover',
                      border: selectedIdx === i ? `3px solid ${accentColor}` : '2px solid #e0e0e0',
                      boxShadow: selectedIdx === i ? `0 0 0 1px ${accentColor}` : 'none' }} />
                  {patterns.length > 1 && !generating && (
                    <button onClick={(e) => {
                      e.stopPropagation();
                      const patternToDelete = p;
                      setPatterns(prev => {
                        const next = prev.filter((_, idx) => idx !== i);
                        if (selectedIdx >= next.length) setSelectedIdx(Math.max(0, next.length - 1));
                        try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
                        return next;
                      });

                      const sessionId = typeof window !== 'undefined'
                        ? (new URLSearchParams(window.location.search).get('session') || localStorage.getItem('brandbox_session'))
                        : null;
                      if (sessionId && patternToDelete.url) {
                        fetch('/api/salvar-estampa', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'delete',
                            sessionId,
                            replaceUrl: patternToDelete.url
                          })
                        })
                        .then(res => res.json())
                        .then(res => {
                          console.log('✅ Estampa excluída do Supabase:', patternToDelete.url);
                        })
                        .catch(err => console.warn('⚠️ Erro ao excluir estampa do Supabase:', err));
                      }
                    }} style={{ 
                      position: 'absolute', top: -6, right: -6, 
                      width: 18, height: 18, minWidth: 18,
                      borderRadius: '50%', background: '#ff4444', color: '#fff', 
                      border: '1px solid #fff', fontSize: '12px', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      padding: 0, margin: 0, zIndex: 10,
                      textAlign: 'center'
                    }}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Botões: varinha mágica + reverter */}
          {patternSrc && !generating && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={makeSeamless}
                disabled={fixingSeams}
                style={{ padding: '7px 18px', borderRadius: '20px', border: `1.5px solid ${accentColor}44`, background: fixingSeams ? `${accentColor}10` : '#fff', color: fixingSeams ? accentColor : '#666', fontSize: '0.72rem', fontWeight: 700, cursor: fixingSeams ? 'wait' : 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              >
                {fixingSeams ? (dictionary?.pattern_tab?.smoothing || '⏳ Suavizando...') : (dictionary?.pattern_tab?.smooth_seams || '🪄 Suavizar cortes')}
              </button>
              {originalPattern && (
                <button
                  onClick={() => {
                    setPatterns(prev => {
                      const next = [...prev];
                      next[selectedIdx] = originalPattern;
                      try { localStorage.setItem('brandbox_patterns_all', JSON.stringify(next)); } catch {}
                      try { localStorage.setItem('brandbox_pattern', JSON.stringify(originalPattern)); } catch {}
                      return next;
                    });
                    setOriginalPattern(null);
                  }}
                  style={{ padding: '7px 18px', borderRadius: '20px', border: '1.5px solid #ddd', background: '#fff', color: '#888', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                >
                  ↩ Reverter
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', background: generating ? `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)` : '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#bbb', transition: 'background 0.5s ease', border: generating ? `1.5px solid ${accentColor}33` : '1.5px solid transparent' }}>
          {generating ? (
            <>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: (paletteColors && paletteColors[i]) || accentColor, animation: `bx-spin 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 600, textAlign: 'center', lineHeight: 1.5 }}>Criando sua estampa exclusiva…<br/><span style={{ fontWeight: 400, fontSize: '0.78rem', color: '#aaa' }}>Isso leva cerca de 15–30 segundos</span></span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2rem' }}>✨</span>
              <span style={{ fontSize: '0.9rem' }}>Nenhuma estampa gerada ainda</span>
            </>
          )}
        </div>
      )}

      {showSlotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#333' }}>Galeria cheia (Máx. 3 estampas)</h4>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#666', lineHeight: 1.4 }}>
                Você já tem 3 estampas na sua galeria. Escolha uma abaixo para ser substituída pela nova versão:
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '8px 0' }}>
              {patterns.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => generate(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    backgroundImage: `url(${p.url || `data:${p.mimeType};base64,${p.base64}`})`,
                    backgroundSize: 'cover',
                    cursor: 'pointer',
                    border: '3px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.transform = 'scale(1)'; }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSlotModal(false)}
                style={{
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e5e5e5'}
                onMouseLeave={e => e.currentTarget.style.background = '#f0f0f0'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {patternSrc && (
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#999', margin: '-5px 0 5px' }}>
          <span dangerouslySetInnerHTML={{ __html: dictionary?.pattern_tab?.gallery_hint || '💡 As estampas geradas ficam salvas na galeria acima.<br/>Clique nas miniaturas para alternar entre as versões.' }} />
        </p>
      )}

      {patternSrc && setPatternScale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: '#f7f7f5', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.68rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap' }}>{dictionary?.pattern_tab?.size || 'TAMANHO'}</span>
          <input type="range" min="50" max="600" step="10"
            value={patternScale || 120}
            onChange={e => setPatternScale(parseInt(e.target.value))}
            style={{ flex: 1, cursor: 'pointer', accentColor: accentColor }}
          />
          <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px', textAlign: 'right' }}>{patternScale || 120}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {patternSrc && (
          <button onClick={download} style={{ flex: 1, padding: '13px 8px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            {dictionary?.pattern_tab?.download_pattern || '⬇ Baixar Estampa'}
          </button>
        )}
        {remaining > 0 && (
          <button
            onClick={handleGenerateClick}
            disabled={generating}
            style={{ flex: 1, padding: '13px 8px', background: 'none', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: generating ? 0.6 : 1 }}
          >
            {generating ? (dictionary?.pattern_tab?.generating_wait || '✨ Tecendo suas estampas... (isso leva uns 15s)') : (patternSrc ? (dictionary?.pattern_tab?.generate_new_options || '✨ Gerar novas opções') : (dictionary?.pattern_tab?.generate_pattern || '✨ Gerar estampa'))}
          </button>
        )}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb' }}>
        {remaining > 0 ? (dictionary?.pattern_tab?.remaining?.replace('{n}', remaining)?.replace('{n_word}', remaining > 1 ? 'gerações restantes' : 'geração restante') || `${remaining} ${remaining > 1 ? 'gerações restantes' : 'geração restante'}`) : (dictionary?.pattern_tab?.limit_reached_text || 'Limite de gerações atingido')}
      </p>
    </div>
  );
}

function AvulsoUpgradeCard({ accentColor, titulo, desc }) {
  return (
    <div style={{ background: '#fff', border: `1.5px solid ${accentColor}33`, borderRadius: '16px', padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', margin: '8px 0' }}>
      <div style={{ fontSize: '2rem' }}>🔒</div>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'Montserrat,sans-serif' }}>{titulo}</h3>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#777', lineHeight: 1.7, maxWidth: '320px', fontFamily: 'Montserrat,sans-serif' }}>{desc}</p>
      <a
        href="https://thebrandbox.sonhodepapel.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', background: `linear-gradient(135deg, #C03B66, #a12d52)`, color: '#fff', borderRadius: '50px', padding: '12px 28px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', textDecoration: 'none', boxShadow: '0 6px 20px rgba(192,59,102,0.3)' }}
      >
        Conhecer o Plano Completo →
      </a>
    </div>
  );
}

function AjudaStep({ brand, accentColor, onResendEmail, resendingEmail, resendStatus }) {
  const { dictionary } = useTranslation();
  const t = dictionary?.help || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const KB_ANSWERS = t.kb || {};

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchResult(null);
      return;
    }

    // Procura por palavras-chave
    let matchedKey = null;
    const keys = Object.keys(KB_ANSWERS);
    for (const key of keys) {
      if (query.includes(key) || key.includes(query) || (key === 'impressao' && (query.includes('imprim') || query.includes('print'))) || (key === 'exportacao' && (query.includes('baixar') || query.includes('export') || query.includes('png') || query.includes('pdf')))) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      setSearchResult({
        topic: matchedKey.toUpperCase(),
        text: KB_ANSWERS[matchedKey]
      });
    } else {
      setSearchResult({
        topic: t.busca_fallback_topico || "ASSISTENTE DIGITAL",
        text: t.busca_fallback_texto || "Desculpe, não encontrei uma resposta exata."
      });
    }
  };

  const faqs = t.faqs || [];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(cat => cat.items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    })))
  };

  return (
    <div style={{ padding: '24px 20px', background: '#faf9f7', borderRadius: '16px', border: '1px solid #eae7e2', fontFamily: 'Montserrat, sans-serif', color: '#333' }}>
      
      {/* Schema.org FAQ Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* 1. Busca IA */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 18px', border: '1.5px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {t.busca_titulo || '🤖 Busca Inteligente'}
        </h3>
        <p style={{ fontSize: '0.74rem', color: '#888', margin: '0 0 14px' }}>
          {t.busca_desc || 'Digite sua dúvida técnica abaixo para receber uma orientação instantânea sobre a plataforma.'}
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={t.busca_placeholder || 'Ex: Como imprimir? Como exportar em PNG?'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.82rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = '#C03B66'}
            onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#C03B66', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(192, 59, 102, 0.2)' }}>
            {t.busca_btn || 'Perguntar'}
          </button>
        </form>

        {searchResult && (
          <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(192, 59, 102, 0.04)', borderLeft: '3px solid #C03B66', borderRadius: '0 8px 8px 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#C03B66', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {t.busca_resposta || '🔍 RESPOSTA PARA:'} {searchResult.topic}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.6 }}>
              {searchResult.text}
            </div>
          </div>
        )}
      </div>

      {/* 2. Cards FAQ */}
      <h3 style={{ margin: '0 0 12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
        {t.faq_titulo || '📋 Perguntas Frequentes'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {faqs.map((cat, cIdx) => (
          <div key={cIdx} style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #eee', overflow: 'hidden' }}>
            <div style={{ background: '#fbfbf9', padding: '10px 14px', borderBottom: '1px solid #f0eee9', fontSize: '0.76rem', fontWeight: 800, color: '#555' }}>
              {cat.category}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cat.items.map((item, iIdx) => {
                const key = `${cIdx}-${iIdx}`;
                const isOpen = activeFaq === key;
                return (
                  <div key={iIdx} style={{ borderBottom: iIdx < cat.items.length - 1 ? '1px solid #f9f9f7' : 'none' }}>
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : key)}
                      style={{ width: '100%', padding: '12px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isOpen ? accentColor : '#333', transition: 'color 0.2s' }}>
                        {item.q}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 14px 14px', fontSize: '0.75rem', color: '#666', lineHeight: 1.6, animation: 'slideDown 0.2s ease' }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* 2.5 Sugestões & Melhorias (NEW) */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 18px', border: '1.5px dashed #ccc', marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#333', marginBottom: '6px' }}>
          {t.sugestoes_titulo || '💡 Sugestões & Melhorias'}
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.6, margin: '0 0 14px', maxWidth: '400px', display: 'inline-block' }}>
          {t.sugestoes_desc || 'Sentiu falta de algum item de papelaria? Tem ideias para melhorar a plataforma? Mande uma mensagem pra gente! Lemos todas as sugestões para tornar a The Brand Box cada vez melhor.'}
        </p>
        <div style={{ marginTop: '4px' }}>
          <a
            href={`mailto:${t.sugestoes_email || 'brandbox@sonhodepapel.co'}?subject=Sugestão de Melhoria - The Brand Box`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: '#f7f7f5', color: '#333', border: '1px solid #ddd', borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#eee'}
            onMouseLeave={e => e.currentTarget.style.background = '#f7f7f5'}
          >
            ✉️ {t.sugestoes_email || 'brandbox@sonhodepapel.co'}
          </a>
        </div>
      </div>

      {/* 3. Bloco Elegante Concierge Criativo */}
      <div style={{ background: '#fff', border: '1.5px solid #eaeaea', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'Montserrat, sans-serif' }}>
          {t.concierge_titulo || 'Quer ir além da experiência guiada?'}
        </h2>
        <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 18px' }}>
          {t.concierge_desc || 'Também oferecemos ajustes personalizados, refinamentos manuais e direção criativa exclusiva para marcas que desejam um acompanhamento mais próximo.'}
        </p>

        {/* Divisão dos Serviços */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', textAlign: 'left', margin: '0 auto 20px', maxWidth: '380px', background: '#fbfbf9', padding: '16px', borderRadius: '12px', border: '1px solid #f0eee9' }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>
              {t.suporte_gratuito_titulo || 'Suporte Gratuito'}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.74rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(t.suporte_gratuito_itens || ['Dúvidas de uso', 'Problemas de acesso', 'Suporte à impressão', 'Auxílio na exportação']).map((item, idx) => (
                <li key={idx}>✨ {tItem(item, dictionary)}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#b7791f', marginBottom: '8px' }}>
              {t.concierge_subtitulo || 'Concierge Criativo'}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.74rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(t.concierge_itens || ['Refinamentos de cores', 'Alterações especiais', 'Ajustes manuais de logo', 'Aplicações personalizadas']).map((item, idx) => (
                <li key={idx}>✨ {tItem(item, dictionary)}</li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href={`https://wa.me/4793630746?text=${encodeURIComponent(t.concierge_wpp_msg || 'Olá! Gostaria de saber mais sobre o acompanhamento de concierge criativo e ajustes extras premium para minha marca no Brand Box.')}`}
          target="_blank"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1a1a1a, #333)',
            color: '#fff', border: 'none', borderRadius: '50px',
            padding: '10px 24px', fontSize: '0.8rem', fontWeight: 700,
            textDecoration: 'none',
            cursor: 'pointer', letterSpacing: '0.3px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {t.concierge_btn || 'Solicitar ajuda personalizada →'}
        </a>
      </div>

      {onResendEmail && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '8px' }}>Precisa acessar seus arquivos novamente?</p>
          <button
            onClick={onResendEmail}
            disabled={resendingEmail}
            style={{ padding: '8px 20px', background: resendStatus?.includes('✓') ? '#e8f7f5' : '#fff', color: resendStatus?.includes('✓') ? '#1a7a6e' : '#888', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, cursor: resendingEmail ? 'wait' : 'pointer', transition: 'all 0.2s' }}
          >
            {resendingEmail ? 'Enviando...' : resendStatus || '📧 Reenviar e-mail com o link'}
          </button>
        </div>
      )}

    </div>
  );
}

function UpsellStep({ brand, accentColor, marca }) {
  const { dictionary } = useTranslation();
  const t = dictionary?.upsell || {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.8rem',
      padding: '24px 20px',
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
      border: '1.5px solid #eaeaea',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Premium Header */}
      <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '20px 10px 10px', borderRadius: '18px' }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #FFF0F5, #F5E6EE)',
          color: '#C03B66',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: '30px',
          marginBottom: '12px',
          border: '1px solid #F0D0E0'
        }}>
          {t.tag || '✨ Fechamento Premium & Arte Sob Medida'}
        </div>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#1a1a1a',
          lineHeight: 1.35,
          marginBottom: '8px'
        }}>
          {t.titulo || 'Deseja um toque extra de exclusividade autoral?'}
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          lineHeight: 1.6,
          maxWidth: '380px',
          margin: '0 auto'
        }}>
          {t.desc || 'Se você ama aquela sensação de marca única, com desenhos e ilustrações autorais que conectam toda a sua identidade, criamos o fechamento sob medida.'}
        </p>
      </div>

      {/* Cards de Opções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Opção 1: Logotipo Ilustrado */}
        <div style={{
          background: '#fcfcfc',
          border: '1.5px solid #eaeaea',
          borderRadius: '16px',
          padding: '20px',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>✍️</span>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                {t.opc1_titulo || 'Logotipo Ilustrado Exclusivo'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: accentColor, fontWeight: 700 }}>
                {t.opc1_sub || 'Arte Autoral Sob Medida'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={{ __html: t.opc1_desc || 'Nossos planos automáticos criam lindas logos tipográficas. Com este serviço premium, nossa diretora de arte desenhará um <strong>símbolo ou ilustração autoral exclusiva</strong> para ser integrado à sua marca.' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {(t.opc1_tags || ['100% autoral', 'Arquivo vetorial editável', 'Ajustes finos com designer']).map(tag => (
              <span key={tag} style={{ background: '#f0f0f0', color: '#555', fontSize: '0.65rem', fontWeight: 600, padding: '4px 8px', borderRadius: '12px' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Opção 2: Elementos Unificadores Ilustrados */}
        <div style={{
          background: '#fcfcfc',
          border: '1.5px solid #eaeaea',
          borderRadius: '16px',
          padding: '20px',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🎨</span>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                {t.opc2_titulo || 'Elementos Ilustrativos Unificadores'}
              </h3>
              <span style={{ fontSize: '0.72rem', color: accentColor, fontWeight: 700 }}>
                {t.opc2_sub || 'Conexão de Papelaria Premium'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={{ __html: t.opc2_desc || 'Criação de <strong>desenhos exclusivos para os rodapés e detalhes dos seus impressos</strong>. Ideal para criar uma experiência encantadora e um padrão visual acolhedor em todas as peças de papelaria.' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {(t.opc2_tags || ['Rodapés exclusivos', 'Estilo unificado autoral', 'Pronto para impressão']).map(tag => (
              <span key={tag} style={{ background: '#f0f0f0', color: '#555', fontSize: '0.65rem', fontWeight: 600, padding: '4px 8px', borderRadius: '12px' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nota Importante */}
      <div style={{
        background: '#FAF9F7',
        borderRadius: '14px',
        padding: '16px',
        borderLeft: `4px solid ${accentColor}`
      }}>
        <p style={{ fontSize: '0.75rem', color: '#555', lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={{ __html: t.nota || '💡 <strong>Como funciona:</strong> Ao contratar este serviço sob medida, você faz um briefing direto com o nosso time criativo e nós desenvolvemos as artes personalizadas e as inserimos diretamente nos seus gabaritos do The Brand Box.' }} />
      </div>

      {/* Call to Action WhatsApp */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
        <a
          href={`https://wa.me/4793630746?text=${encodeURIComponent((t.wpp_msg || 'Olá! Finalizei meu projeto no The Brand Box e amei! Gostaria de saber mais sobre o serviço de Desenhos de Rodapé e Logotipo Ilustrado para a minha marca ') + (marca || ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            padding: '14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            textDecoration: 'none',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.25)';
          }}
        >
          {t.wpp_btn || '💬 Falar com a Diretora de Arte no WhatsApp'}
        </a>
        <span style={{ fontSize: '0.7rem', color: '#999' }}>
          {t.wpp_desc || 'Disponibilidade imediata de atendimento'}
        </span>
      </div>
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

function deriveTone(estiloNome, dictionary) {
  let matchedWords = ['Autêntico','Único','Memorável','Confiável','Acolhedor'];
  for (const [key, words] of Object.entries(TONE_MAP)) {
    if (estiloNome?.toLowerCase().includes(key.toLowerCase())) {
      matchedWords = words;
      break;
    }
  }
  return matchedWords.map(w => dictionary?.tone_words?.[w] || w);
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
  const toneWords = deriveTone(estiloNome, dictionary);

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
          <p style="font-size:0.8rem;color:#555;line-height:1.7;font-family:Montserrat,sans-serif;">A estampa é aplicada em embalagens, impressos, tecidos e papel de parede.</p>
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
  <p style="font-size:0.58rem;letter-spacing:2px;text-transform:uppercase;color:#ccc;margin-bottom:64px;">{dictionary?.guide_tab?.brand_guidelines || 'Guia de Identidade Visual'}</p>
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
  <div class="sec-label">{dictionary?.guide_tab?.color_palette || 'Paleta de Cores'}</div>
  <div style="display:grid;grid-template-columns:repeat(${paletteColors.length},1fr);gap:10px;">
    ${colorsHtml}
  </div>
  <div class="divider"></div>
  <p style="font-size:0.75rem;color:#888;line-height:1.7;">Use a cor <strong style="color:#444;">${colorNamePT(paletteColors[0] || accentColor, dictionary)}</strong> como principal — ela deve predominar em todas as comunicações. As demais cores funcionam como apoio e devem ser utilizadas com equilíbrio.</p>
</div>

<!-- TIPOGRAFIA -->
<div class="page">
  <div class="sec-label">Tipografia</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">
    <div>
      <p style="font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:12px;">{dictionary?.guide_tab?.main_typography || 'Fonte Principal'}</p>
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
  const { dictionary } = useTranslation();
  const tMan = dictionary?.manifesto || {};
  const tQuiz = dictionary?.quiz || {};

  const QUIZ_PERGUNTAS = isSaude ? (dictionary?.quiz_perguntas_saude || QUIZ_PERGUNTAS_SAUDE) : (dictionary?.quiz_perguntas_geral || QUIZ_PERGUNTAS_GERAL);
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
        setErro(tQuiz.erro_gerar || 'Não conseguimos gerar agora. Tente novamente.');
      }
    } catch (e) {
      setErro(tQuiz.erro_conexao || 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {QUIZ_PERGUNTAS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < atual ? '#C03B66' : i === atual ? '#C03B6655' : '#eee', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Pergunta atual */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '22px 18px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C03B66aa', marginBottom: '14px' }}>{atual + 1} {tQuiz.de || 'de'} {QUIZ_PERGUNTAS.length}</p>
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
                    border: `1.5px solid ${selected ? '#C03B66' : '#eee'}`,
                    background: selected ? '#C03B6618' : '#fafafa', cursor: 'pointer',
                    fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif', fontWeight: selected ? 700 : 500,
                    color: selected ? '#C03B66' : '#555', transition: 'all 0.15s',
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
            {tQuiz.voltar || dictionary?.geral?.voltar || '← Voltar'}
          </button>
        )}
        {atual < QUIZ_PERGUNTAS.length - 1 ? (
          <button
            onClick={() => setAtual(a => a + 1)}
            disabled={!respostas[QUIZ_PERGUNTAS[atual].id]}
            style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: respostas[QUIZ_PERGUNTAS[atual].id] ? '#C03B66' : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: respostas[QUIZ_PERGUNTAS[atual].id] ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}
          >
            {tQuiz.proxima || 'Próxima →'}
          </button>
        ) : (
          <button
            onClick={handleGerar}
            disabled={!completo || loading}
            style={{ flex: 1, padding: '13px', borderRadius: '20px', border: 'none', background: completo ? '#C03B66' : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: completo ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {loading ? (tMan.btn_creating || '✨ Criando manifesto...') : (tMan.btn_generate || '✨ Gerar Manifesto')}
          </button>
        )}
      </div>

      {erro && <p style={{ textAlign: 'center', color: '#e55', fontSize: '0.75rem' }}>{erro}</p>}
    </div>
  );
}

function ManifestoDisplay({ manifesto, accentColor, marca, tagline, fontFamily, fontWeight, isScript, onRegerar, podeRefazer, geracoes, limite }) {
  const { dictionary } = useTranslation();
  const tMan = dictionary?.manifesto || {};

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
          <p style={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: accentColor + '88', marginBottom: '6px' }}>{tMan.label || 'Manifesto'}</p>
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
        <button onClick={handleBaixarPlaca} style={{ flex: 1, padding: '12px', borderRadius: '20px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          {tMan.btn_download || '⬇ Baixar PNG'}
        </button>
        <button onClick={handleCopiar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #C03B66', background: copiado ? '#C03B66' : 'transparent', color: copiado ? '#fff' : '#C03B66', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {copiado ? (tMan.btn_copied || '✓ Copiado!') : (tMan.btn_copy || '📋 Copiar')}
        </button>
        <button onClick={() => setEditando(e => !e)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #ddd', background: editando ? '#333' : 'transparent', color: editando ? '#fff' : '#888', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {editando ? (tMan.btn_done || '✓ Feito') : (tMan.btn_edit || '✏️ Editar')}
        </button>
        {podeRefazer ? (
          <button onClick={onRegerar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#bbb', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            {tMan.btn_redo || '🔄 Refazer'} ({limite - geracoes}x {tMan.restante || 'restante'})
          </button>
        ) : (
          <div style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#ccc', fontFamily: 'Montserrat, sans-serif' }}>{tMan.limite_atingido || 'Limite de gerações atingido'}</div>
        )}
      </div>
    </div>
  );
}

function ManifestoStep({ accentColor, marca, tagline, brand, isSaude, editData }) {
  const { dictionary } = useTranslation();
  const tMan = dictionary?.manifesto || {};

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
        <p style={{ fontFamily: `Georgia, serif`, fontSize: '1rem', color: '#555', lineHeight: 1.6, marginBottom: '6px' }}>{tMan.desc_title || 'O Manifesto é a alma da sua marca em palavras.'}</p>
        <p style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif' }}>{tMan.desc_text || 'Responda 5 perguntas e a IA cria um texto único para '}<strong style={{ color: accentColor }}>{marca}</strong>.</p>
      </div>
      <button
        onClick={() => setShowQuiz(true)}
        style={{ padding: '16px', borderRadius: '30px', border: 'none', background: '#C03B66', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        {tMan.btn_create || '✨ Criar Manifesto com IA'}
      </button>
    </div>
  );
}

function PlacaStep({ brand, accentColor, paletteColors, estampaPatterns, estampaSelectedIdx, editData, logoColor, logoLayout, iconPath, submarcaColor, submarcaTextColor }) {
  const { dictionary } = useTranslation();
  const t = dictionary?.placa || {};

  const placaRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setScale(prev => {
        const next = Math.min(1, w / 595);
        return Math.abs(prev - next) < 0.001 ? prev : next;
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const currentIdx = estampaSelectedIdx || 0;
  const patternImage = estampaPatterns?.[currentIdx]
    ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
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
            logoElement={<LogoPreviewHTML editData={editData} color={logoColor || accentColor} layout={logoLayout || 'stacked'} scaleFactor={1.0} maxWidth="400px" maxHeight="160px" />}
          />
        </div>
      </div>
      <button
        onClick={handleBaixar}
        style={{ width: '100%', padding: '14px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        {t.baixar || '⬇ Baixar Placa da Marca'}
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
  const { dictionary } = useTranslation();
  const tTom = dictionary?.tom_de_voz || {};
  const tQuiz = dictionary?.quiz || {};

  const PERGUNTAS = dictionary?.tomdevoz_perguntas || TOMDEVOZ_PERGUNTAS;

  const [respostas, setRespostas] = React.useState({});
  const [atual, setAtual] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);
  const completo = PERGUNTAS.every(q => respostas[q.id]);

  const handleGerar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const respostasArr = PERGUNTAS.map(q => ({ pergunta: q.pergunta, resposta: respostas[q.id] }));
      const res = await fetch('/api/generate-tomdevoz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, respostas: respostasArr }),
      });
      const data = await res.json();
      if (data.success) {
        onTomDeVozGerado({ palavras: data.palavras, frases: data.frases, descricao: data.descricao });
      } else {
        setErro(tQuiz.erro_gerar || 'Não conseguimos gerar agora. Tente novamente.');
      }
    } catch (e) {
      setErro(tQuiz.erro_conexao || 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {PERGUNTAS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < atual ? '#C03B66' : i === atual ? '#C03B6655' : '#eee', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '22px 18px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C03B66aa', marginBottom: '14px' }}>{atual + 1} {tQuiz.de || 'de'} {PERGUNTAS.length}</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#222', marginBottom: '18px', lineHeight: 1.4 }}>{PERGUNTAS[atual].pergunta}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PERGUNTAS[atual].opcoes.map(opcao => {
              const selected = respostas[PERGUNTAS[atual].id] === opcao;
              return (
                <button
                  key={opcao}
                  onClick={() => {
                    const novo = { ...respostas, [PERGUNTAS[atual].id]: opcao };
                    setRespostas(novo);
                    if (atual < PERGUNTAS.length - 1) {
                      setTimeout(() => setAtual(a => a + 1), 280);
                    }
                  }}
                  style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: '12px',
                    border: `1.5px solid ${selected ? '#C03B66' : '#eee'}`,
                    background: selected ? '#C03B6618' : '#fafafa', cursor: 'pointer',
                    fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif', fontWeight: selected ? 700 : 500,
                    color: selected ? '#C03B66' : '#555', transition: 'all 0.15s',
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
            {tQuiz.voltar || dictionary?.geral?.voltar || '← Voltar'}
          </button>
        )}
        {atual < PERGUNTAS.length - 1 ? (
          <button
            onClick={() => setAtual(a => a + 1)}
            disabled={!respostas[PERGUNTAS[atual].id]}
            style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: respostas[PERGUNTAS[atual].id] ? '#C03B66' : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: respostas[PERGUNTAS[atual].id] ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}
          >
            {tQuiz.proxima || 'Próxima →'}
          </button>
        ) : (
          <button
            onClick={handleGerar}
            disabled={!completo || loading}
            style={{ flex: 1, padding: '13px', borderRadius: '20px', border: 'none', background: completo ? '#C03B66' : '#ddd', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: completo ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {loading ? (tTom.btn_creating || '✨ Criando tom de voz...') : (tTom.btn_generate || '✨ Gerar Tom de Voz')}
          </button>
        )}
      </div>
      {erro && <p style={{ textAlign: 'center', color: '#e55', fontSize: '0.75rem' }}>{erro}</p>}
    </div>
  );
}

function TomDeVozDisplay({ tomDeVoz, accentColor, marca, onRegerar, podeRefazer, geracoes, limite }) {
  const { dictionary } = useTranslation();
  const tTom = dictionary?.tom_de_voz || {};
  const tMan = dictionary?.manifesto || {};

  const [copiado, setCopiado] = React.useState(false);
  const [editando, setEditando] = React.useState(false);
  const [descricao, setDescricao] = React.useState(tomDeVoz.descricao);

  React.useEffect(() => { setDescricao(tomDeVoz.descricao); }, [tomDeVoz.descricao]);

  const handleCopiar = () => {
    const texto = [tomDeVoz.descricao, '', `${tTom.palavras_chave || 'Palavras-chave'}:`, tomDeVoz.palavras.join(', '), '', `${tTom.orientacoes || 'Orientações'}:`, ...(tomDeVoz.frases || [])].join('\n');
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: '#faf9f7', borderRadius: '16px', padding: '22px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: `1.5px solid ${accentColor}33` }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: accentColor + '88', marginBottom: '10px' }}>{tTom.label || 'Tom de Voz'} — {marca}</p>
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
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>{tTom.palavras_chave || 'Palavras-chave'}</p>
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
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>{tTom.orientacoes || 'Orientações de comunicação'}</p>
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
        <button onClick={handleCopiar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #C03B66', background: copiado ? '#C03B66' : 'transparent', color: copiado ? '#fff' : '#C03B66', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {copiado ? (tMan.btn_copied || '✓ Copiado!') : (tMan.btn_copy || '📋 Copiar')}
        </button>
        <button onClick={() => setEditando(e => !e)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #ddd', background: editando ? '#333' : 'transparent', color: editando ? '#fff' : '#888', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s' }}>
          {editando ? (tMan.btn_done || '✓ Feito') : (tMan.btn_edit || '✏️ Editar')}
        </button>
        {podeRefazer ? (
          <button onClick={onRegerar} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1.5px solid #eee', background: 'transparent', color: '#bbb', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
            {tMan.btn_redo || '🔄 Refazer'} ({limite - geracoes}x {tMan.restante || 'restante'})
          </button>
        ) : (
          <div style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '0.65rem', color: '#ccc', fontFamily: 'Montserrat, sans-serif' }}>{tMan.limite_atingido || 'Limite de gerações atingido'}</div>
        )}
      </div>
    </div>
  );
}

function TomDeVozStep({ accentColor, marca, tagline, brand, editData }) {
  const { dictionary } = useTranslation();
  const tTom = dictionary?.tom_de_voz || {};

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
      <div style={{ background: accentColor + '10', borderRadius: '16px', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ fontFamily: `Georgia, serif`, fontSize: '1rem', color: '#555', lineHeight: 1.6, marginBottom: '6px' }}>{tTom.desc_title || 'O Tom de Voz define como sua marca fala com o mundo.'}</p>
        <p style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'Montserrat, sans-serif' }}>{tTom.desc_text || 'Responda 4 perguntas e a IA cria o guia de voz para '} <strong style={{ color: accentColor }}>{marca}</strong>.</p>
      </div>
      <button
        onClick={() => setShowQuiz(true)}
        style={{ padding: '16px', borderRadius: '30px', border: 'none', background: '#C03B66', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        {tTom.btn_create || '✨ Criar Tom de Voz com IA'}
      </button>
    </div>
  );
}

// Uma fonte curada por categoria para oferecer variedade sem overwhelm
const FONTE_CURADA = [
  { label: 'Cursiva',     labelId: 'cursiva',     fontFamily: 'Amelie',            weight: 400, style: 'script',  sizeBoost: 1.4, googleFont: false },
  { label: 'Delicada',    labelId: 'delicada',    fontFamily: 'Birthstone',        weight: 400, style: 'script',  sizeBoost: 1.4, googleFont: true  },
  { label: 'Elegante',    labelId: 'elegante',    fontFamily: 'Alex Brush',        weight: 400, style: 'script',  sizeBoost: 1.6, googleFont: true  },
  { label: 'Clássica',    labelId: 'classica',    fontFamily: 'Cinzel',            weight: 400, style: 'serif',   sizeBoost: 1.0, googleFont: true  },
  { label: 'Moderna',     labelId: 'moderna',     fontFamily: 'Raleway',           weight: 700, style: 'sans',    sizeBoost: 1.0, googleFont: true  },
  { label: 'Lúdica',      labelId: 'ludica',      fontFamily: 'LittleFriend',      weight: 400, style: 'display', sizeBoost: 1.0, googleFont: false },
  { label: 'Divertida',   labelId: 'divertida',   fontFamily: 'Borel',             weight: 400, style: 'script',  sizeBoost: 1.2, googleFont: true  },
];

function FonteStep({ brand, accentColor, logoColor, marca, tagline, editData, logoLayout, onFontChange }) {
  const { dictionary } = useTranslation();
  const tFont = dictionary?.font || {};

  const currentFont = editData?.fontFamily || 'Playfair Display';

  // Garante que a fonte original sempre apareça como opção "Sugerida"
  const opcoes = React.useMemo(() => {
    const originalFont = brand?.editData?.fontFamily || 'Playfair Display';
    const lista = [...FONTE_CURADA];
    
    // Remove a fonte original da lista caso já exista, para podermos inseri-la no topo
    const filteredLista = lista.filter(f => f.fontFamily !== originalFont);
    
    // Descobrir dados da fonte original no FONT_MAP
    const found = Object.values(FONT_MAP).find(f => f.fontFamily === originalFont);
    if (found) {
      filteredLista.unshift({ labelId: 'suggested', labelDefault: 'Sugerida', ...found });
    }
    
    return filteredLista.slice(0, 7);
  }, [brand]);

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

  const isActive = (f) => f.fontFamily === currentFont;

  const getLabel = (f) => {
    if (f.labelId) return tFont[f.labelId] || f.labelDefault || f.label;
    const key = f.label.toLowerCase().replace(/á/g, 'a').replace(/ú/g, 'u').replace(/í/g, 'i');
    return tFont[key] || f.label;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Preview principal — igual ao quadro da aba Logo */}
      <div style={{ width: '100%', aspectRatio: '3/1', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ width: '85%', height: '85%', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <LogoPreviewHTML
            editData={{ ...editData, fontFamily: preview.fontFamily, fontWeight: preview.weight || 700, fontStyle: preview.style, fontSizeBoost: preview.sizeBoost || 1, tagline: null }}
            color={logoColor || accentColor}
            layout="horizontal"
            scaleFactor={1.1}
            maxWidth="100%"
            maxHeight="100%"
          />
        </div>
      </div>

      {editData?.customLogoSrc ? (
        <div style={{ padding: '16px', background: '#fff0f5', borderRadius: '12px', border: '1.5px solid #ffb3c6', color: '#c03b66', fontSize: '0.82rem', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', fontWeight: 600 }}>
          {tFont.custom_logo_msg || 'Você enviou sua própria logo, então a fonte já faz parte da sua imagem!'}<br/><br/>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>{tFont.custom_logo_sub || 'Para testar outras fontes ou usar as opções desta aba, volte à aba "Sua Logo" e selecione a "Logo sugerida".'}</span>
        </div>
      ) : (
        <>
          {/* Fonte ativa em destaque */}
          {(() => {
            const activeFont = opcoes.find(f => isActive(f));
            return activeFont ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `${accentColor}10`, borderRadius: '12px', border: `1.5px solid ${accentColor}30` }}>
                <div>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '2px' }}>{tFont.active_font || 'Fonte ativa'}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'Montserrat,sans-serif' }}>{getLabel(activeFont)}</div>
                </div>
                <div style={{ background: accentColor, color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>{tFont.applied || '✓ Aplicada'}</div>
              </div>
            ) : null;
          })()}

          {/* Alternativas */}
          <div>
            <p style={{ fontSize: '0.65rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif', marginBottom: '8px' }}>{tFont.try_another || 'Quero tentar outra →'}</p>
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
                {getLabel(f)}
              </button>
            );
          })}
        </div>
      </div>
      </>)}
    </div>
  );
}

function GuiaStep({ brand, accentColor, paletteColors, marca, tagline, estampaPatterns, estampaSelectedIdx, editData }) {
  const { dictionary } = useTranslation();
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx]
    ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
    : null;
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const mensagem = brand.resultadoFinal?.mensagem || '';
  const fontFamily = editData.fontFamily || 'Playfair Display';
  const fontWeight = editData.fontWeight || 700;
  const isScript = editData.fontStyle === 'script';
  const toneWords = deriveTone(estiloNome, dictionary);

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
          <p style={{ fontSize: '0.52rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{dictionary?.guide_tab?.brand_guidelines || 'Guia de Identidade Visual'}</p>
          <h2 style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: '1.8rem', color: '#fff', letterSpacing: isScript ? '0px' : '1px', lineHeight: 1 }}>{marcaFormatted}</h2>
          {tagline && <p style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>{tagline}</p>}
        </div>

        {/* Paleta */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>{dictionary?.guide_tab?.color_palette || 'Paleta de Cores'}</p>
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
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '6px' }}>{dictionary?.guide_tab?.main_typography || 'Fonte Principal'}</p>
            <p style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: '1.2rem', color: accentColor }}>{fontFamily}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '6px' }}>{dictionary?.guide_tab?.support || 'Apoio'}</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#888' }}>Montserrat</p>
          </div>
        </div>

        {/* Tom de voz */}
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>{dictionary?.guide_tab?.tone_of_voice || 'Tom de Voz'}</p>
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
        style={{ width: '100%', padding: '15px', background: '#fff', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        {dictionary?.guide_tab?.download_pdf || '⬇ Baixar Guia em PDF'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#bbb' }}>
        {dictionary?.guide_tab?.new_tab || 'Uma nova aba abrirá — use "Salvar como PDF" no menu de impressão.'}<br/>
        <span style={{ fontSize: '0.62rem', color: '#ccc' }}>{dictionary?.guide_tab?.popups || '(Se não abrir, verifique se seu navegador bloqueou Pop-ups)'}</span>
      </p>
    </div>
  );
}

function CartaoRetornoPreview({ accentColor, patternSrc, cartaoContacts, crmLine, editData, logoColor, comBorda, setComBorda, clinicaNome, setClinicaNome, logoLayout, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const { dictionary } = useTranslation();
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
          <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.geral?.frente || 'Frente'}</p>
          <div style={{ width: '184px', height: '320px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
            {comBorda && patternSrc
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', zIndex: 0 }} />
              : <div style={{ position: 'absolute', inset: 0, border: `14px solid ${solidColor}`, zIndex: 0 }} />}
            
            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', background: '#fff', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px' }}>
              <div style={{ width: '100%', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', overflow: 'hidden' }}>
                <LogoPreviewHTML item="Cartão de Retorno" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.85} withBackground={false} hideTagline={true} maxWidth="130px" maxHeight="65px" />
              </div>
              {crmLine && <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '3.3px', color: '#999', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px', marginTop: '-6px', whiteSpace: 'nowrap' }}>{crmLine}</div>}
              
              <div style={{ background: accentColor, color: '#fff', width: '100%', padding: '4px 0', fontSize: '6.5px', fontWeight: 800, textAlign: 'center', letterSpacing: '1px', borderRadius: '2px', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>{dictionary?.geral?.retorno_consultas?.titulo || 'RETORNO DE CONSULTAS'}</div>

              {/* Tabela Pequena */}
              <div style={{ width: '100%', border: '1px solid #efefef', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', background: `${accentColor}15`, borderBottom: '1px solid #efefef' }}>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', borderRight: '1px solid #efefef', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>{dictionary?.geral?.retorno_consultas?.data || 'Data'}</div>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>{dictionary?.geral?.retorno_consultas?.horario || 'Horário'}</div>
                </div>
                {rows(8, '22px')}
              </div>
            </div>
          </div>
        </div>

        {/* VERSO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.geral?.verso || 'Verso'}</p>
          <div style={{ width: '184px', height: '320px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
            {comBorda && patternSrc
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', zIndex: 0 }} />
              : <div style={{ position: 'absolute', inset: 0, border: `14px solid ${solidColor}`, zIndex: 0 }} />}
            
            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', background: '#fff', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 8px' }}>
              {/* Tabela Grande */}
              <div style={{ width: '100%', border: '1px solid #efefef', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ display: 'flex', background: `${accentColor}15`, borderBottom: '1px solid #efefef' }}>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', borderRight: '1px solid #efefef', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>{dictionary?.geral?.retorno_consultas?.data || 'Data'}</div>
                  <div style={{ flex: 1, fontSize: '5px', fontWeight: 800, textAlign: 'center', padding: '3px 0', color: accentColor, fontFamily: 'Montserrat, sans-serif' }}>{dictionary?.geral?.retorno_consultas?.horario || 'Horário'}</div>
                </div>
                {rows(12, '18px')}
              </div>

              {/* Rodapé */}
              {(clinicaNome || endereco || instagram || site || mainPhone) ? (
                <div style={{ width: '100%', textAlign: 'left', borderTop: '0.6px solid #eee', paddingTop: '4px', marginTop: 'auto' }}>
                  {clinicaNome && <div style={{ fontFamily: brandFont, fontSize: '5.5px', color: accentColor, fontWeight: 700 }}>{clinicaNome}</div>}
                  <div style={{ fontSize: '3.4px', color: '#888', marginTop: '1.2px', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.2 }}>
                    {endereco && <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{endereco}</div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '1px' }}>
                       {instagram && <span>@{instagram}</span>}
                       {site && <span>· {site}</span>}
                    </div>
                    {(mainPhone || cartaoContacts?.telefone2) ? (
                      <div style={{ marginTop: '1px', fontWeight: 700, color: '#444', fontSize: '4px' }}>
                        {[mainPhone, cartaoContacts?.telefone2].filter(Boolean).join('  ·  ')}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartaoDeVisitaPreview({ accentColor, patternSrc, cartaoContacts, crmLine, editData, logoColor, comBorda, setComBorda, clinicaNome, setClinicaNome, logoLayout, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, retrato: retratoExterno, setRetrato: setRetratoExterno }) {
  const { dictionary } = useTranslation();
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

      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.geral?.frente || 'Frente'}</p>
      <div style={{ width: `${CW}px`, height: `${CH}px`, position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
        {comBorda && patternSrc && <>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.9, zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px', background: 'transparent', zIndex: 1 }} />
        </>}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Fundo branco com padding (visual) envolve container interno (medido pelo autoFit) */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: patternSrc ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.72)',
            padding: retrato ? '12px 14px' : '10px 16px 8px',
            borderRadius: '6px',
            maxWidth: retrato ? `${Math.round(CW * 0.76)}px` : undefined,
            maxHeight: `${Math.round(CH * (retrato ? 0.65 : 0.96))}px`,
            overflow: 'hidden',
          }}>
            {editData?.customLogoSrc ? (
              // imagem: sem maxHeight fixo — deixa imagem mostrar tamanho real, card clipa nas bordas
              <div style={{ display: 'inline-flex', maxWidth: isHorizontal ? `${Math.round(CW*0.95)}px` : `${Math.round(CW*0.82)}px`, alignItems: 'center', justifyContent: 'center' }}>
                <LogoPreviewHTML item="Cartão de Visita" editData={editData} color={logoColor} layout={logoLayout} crm={crmLine} hideTagline={hideTagline} scaleFactor={1.1} withBackground={false} maxWidth="100%" maxHeight="100%" />
              </div>
            ) : (
              <div style={{ display: 'flex', width: isHorizontal ? `${Math.round(CW*0.80)}px` : `${Math.round(CW*0.62)}px`, height: retrato ? `${Math.round(CH*0.40)}px` : `${Math.round(CH*0.52)}px`, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                <LogoPreviewHTML item="Cartão de Visita" editData={editData} color={logoColor} layout={logoLayout} crm={crmLine} hideTagline={hideTagline} scaleFactor={0.85} withBackground={false} maxWidth={`${isHorizontal ? Math.round(CW*0.78) : Math.round(CW*0.60)}px`} maxHeight={`${(retrato ? Math.round(CH*0.38) : Math.round(CH*0.50))}px`} />
              </div>
            )}
          </div>
        </div>
      </div>



      <p style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.geral?.verso || 'Verso'}</p>
      <div style={{ width: `${CW}px`, height: `${CH}px`, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
        {comBorda && patternSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', zIndex: 0 }} />
          : <div style={{ position: 'absolute', inset: 0, background: borderColor || accentColor, zIndex: 0 }} />}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(clinicaNome || crmLine || endereco || whatsapp || telefone || instagram || email || site) ? (
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
          </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Toggle compartilhado: Com/Sem estampa + bolinhas clicáveis de cor da paleta + Slider de Escala
export function BordaToggle({ comBorda, setComBorda, accentColor, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const { dictionary } = useTranslation();
  const btn = (active) => ({
    padding: '6px 16px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    cursor: 'pointer', border: 'none',
    background: active ? accentColor : '#eee', color: active ? '#fff' : '#888',
    transition: 'all 0.2s ease'
  });
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', background: '#fcfcfc', borderRadius: '30px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={btn(comBorda)} onClick={() => setComBorda(true)}>{dictionary?.geral?.estampa || 'Estampa'}</button>
        <button style={btn(!comBorda)} onClick={() => setComBorda(false)}>{dictionary?.geral?.solida || 'Sólida'}</button>
      </div>

      {comBorda && setPatternScale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #eee', paddingLeft: '12px', marginLeft: '4px' }}>
          <span style={{ fontSize: '0.62rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{dictionary?.geral?.tamanho || 'Tamanho:'}</span>
          <input 
            type="range" min="50" max="600" step="10"
            value={patternScale || 120} 
            onChange={(e) => setPatternScale(parseInt(e.target.value))}
            style={{ width: '80px', height: '4px', cursor: 'pointer', accentColor: accentColor }}
          />
        </div>
      )}

      {!comBorda && paletteColors?.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '4px', borderLeft: '1px solid #eee', paddingLeft: '12px' }}>
          {[...paletteColors, '#ffffff'].map((hex, i) => {
            const isSelected = (borderColor || accentColor) === hex;
            const isWhite = hex === '#ffffff';
            return (
              <div
                key={i}
                onClick={() => setBorderColor?.(hex)}
                style={{
                  width: '14px', height: '14px', borderRadius: '50%', background: hex,
                  cursor: 'pointer', flexShrink: 0, transition: 'transform 0.15s',
                  transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: isSelected
                    ? `0 0 0 2px #fff, 0 0 0 3.5px ${isWhite ? '#ccc' : hex}`
                    : isWhite ? '0 0 0 1px #ddd' : '0 0 0 1px rgba(0,0,0,0.1)',
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
  const { dictionary } = useTranslation();
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
          <div style={{ width: '160px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
            <LogoPreviewHTML item="Certificado de Coragem" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={editData?.customLogoSrc ? 1.6 : 0.65} withBackground={false} maxWidth="100%" maxHeight="100%" />
          </div>

          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.5rem', fontWeight: 600, color: '#7a7a7a', letterSpacing: '1px', marginBottom: '0px' }}>{dictionary?.certificado?.pediatrico_de || 'Certificado Pediátrico de'}</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem', fontWeight: 700, color: solidColor, margin: '0 0 8px', letterSpacing: '1px'
          }}>{dictionary?.certificado?.coragem || 'Coragem'}</h2>

          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.52rem', fontWeight: 400, color: '#5a5a5a', textAlign: 'center', lineHeight: 1.6, marginTop: '4px', width: '90%' }}>
            <div style={{ margin: 0 }}>{dictionary?.certificado?.certifico_fins || 'Certifico para os devidos e lúdicos fins, que __________________'}</div>
            <div style={{ margin: 0 }}>{dictionary?.certificado?.idade_comportou || 'idade _____ comportou-se corretamente na consulta de hoje,'}</div>
            <div style={{ margin: 0 }}>{dictionary?.certificado?.sendo_educado || 'sendo educado e demonstrando muita coragem e valentia.'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview proporcional A5 — usado por receituário, timbrado, etc.
function A5ItemPreview({ item, accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, folderRoof, setFolderRoof, paperSize, setPaperSize }) {
  const { dictionary } = useTranslation();
  const BORDER = 14;
  const { whatsapp, telefone, telefone2, email, instagram, site, endereco } = cartaoContacts || {};
  const phones = [whatsapp, telefone, telefone2].filter(Boolean).join('  ·  ');
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
            {folderRoof ? (dictionary?.geral?.recorte_casinha || '🏠 Recorte Casinha ATIVO') : (dictionary?.geral?.recorte_reto || '⬜️ Recorte Reto ATIVO')}
          </button>
        )}
        {setPaperSize && (
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '20px', padding: '3px' }}>
            {['a5', 'a4'].map(s => {
              const label = item === 'Caderno' ? (s === 'a5' ? '17 × 24 cm' : '21 × 28 cm') : s.toUpperCase();
              return (
              <button key={s} onClick={() => setPaperSize(s)} style={{ padding: '3px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: paperSize === s ? accentColor : 'transparent', color: paperSize === s ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {label}
              </button>
            )})}
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
      <div style={{ position: 'absolute', top: BORDER + 18, left: '50%', transform: 'translateX(-50%)', width: '140px', height: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LogoPreviewHTML item={item} editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} hideTagline={hideTagline} withBackground={false} maxWidth="140px" maxHeight="44px" />
      </div>
      {/* Rodapé — linha 1: clínica · telefones  /  linha 2: @ig · email · site · endereço */}
      <div style={{ position: 'absolute', bottom: BORDER + 3, left: BORDER + 4, right: BORDER + 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        {(clinicaNome || phones) && (
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
            {[clinicaNome, phones].filter(Boolean).join('  ·  ')}
          </div>
        )}
        {(instagram || email || site || endereco) && (
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '4.5px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
            {[instagram ? `@${instagram}` : '', email, site, endereco].filter(Boolean).join('  ·  ')}
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
  const { dictionary } = useTranslation();
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
            <div style={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' }}>
              <LogoPreviewHTML item="Prontuário Médico" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.6} crm={crmLine} hideTagline={hideTagline} withBackground={false} maxWidth="100%" maxHeight="100%" />
            </div>
            <div style={{ border: '0.4px solid #eee', borderRadius: '2px', padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '3.5px', marginTop: '2px' }}>
              {formRow(dictionary?.prontuario?.paciente || 'PACIENTE:', dictionary?.prontuario?.data_nasc || dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:')}
              {formRow(dictionary?.prontuario?.mae || 'NOME DA MÃE:', dictionary?.prontuario?.cpf || dictionary?.ficha_cadastro?.cpf || 'CPF:')}
              {formRow(dictionary?.prontuario?.telefone || 'TELEFONE:', dictionary?.prontuario?.email || 'EMAIL:')}
              {formRow(dictionary?.prontuario?.endereco || dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:', dictionary?.prontuario?.cidade || dictionary?.ficha_cadastro?.cidade || 'CIDADE:')}
              {formRow(dictionary?.prontuario?.convenio || 'CONVÊNIO:', dictionary?.prontuario?.carteirinha || 'Nº CARTEIRINHA:')}
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
  const { dictionary } = useTranslation();
  const scaleXixi = useScaleToFit(453, 320 + 12);
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

  const days = dictionary?.diario_xixi?.dias || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const weeks = [1, 2, 3, 4];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      <div ref={scaleXixi.wrapperRef} style={scaleXixi.wrapperStyle}>
      <div style={scaleXixi.innerStyle}>
      <div style={{ width: '453px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER + 2, background: '#fff', padding: '10px 15px', display: 'flex', flexDirection: 'column' }}>
          {/* Logo posicionada absolutamente no canto superior direito */}
          <div style={{ position: 'absolute', top: 4, right: BORDER + 8, width: '140px', height: '65px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <LogoPreviewHTML item="Diário do Xixi" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.6} crm={crmLine} hideTagline={hideTagline} withBackground={false} maxWidth="100%" maxHeight="100%" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            <div style={{ background: '#f5f5f5', padding: '4px 12px', borderRadius: '4px', border: '0.4px solid #ddd', alignSelf: 'flex-start', maxWidth: '270px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#333', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{dictionary?.diario_xixi?.titulo || 'DIÁRIO DO XIXI (HÁBITO MICCIONAL)'}</span>
            </div>
            <div style={{ fontSize: '7px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{dictionary?.diario_xixi?.subtitulo || 'Controle de Escapes e Enurese (Xixi na Cama)'}</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Montserrat', sans-serif", color: accentColor, fontWeight: 300, fontStyle: 'italic' }}>{dictionary?.diario_xixi?.nome || 'Nome:'}</span>
              <div style={{ flex: 1, borderBottom: '1px dashed #ccc', width: '230px', marginBottom: '2px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '7.5px', textTransform: 'uppercase', color: '#666', fontWeight: 800, letterSpacing: '0.8px' }}>{dictionary?.diario_xixi?.legenda || 'Legenda:'}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>0:</strong> {dictionary?.diario_xixi?.seco || 'Acordou Seco(a)'}</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>1:</strong> {dictionary?.diario_xixi?.gotas || 'Gotas/Umidade'}</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>2:</strong> {dictionary?.diario_xixi?.molhou_roupa || 'Molhou a Roupa/Fralda'}</span>
                <span style={{ fontSize: '7px', color: '#888' }}><strong>3:</strong> {dictionary?.diario_xixi?.abundante || 'Abundante (Molhou Cama)'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(4, 1fr)', gap: '1px', background: '#eee', border: '1px solid #eee', flex: 1 }}>
            <div style={{ background: '#fff', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ fontSize: '7px', fontWeight: 800, color: '#bbb', textTransform: 'uppercase' }}>{dictionary?.diario_xixi?.marque_0_3 || 'Marque 0 a 3'}</span>
            </div>
            {weeks.map(w => (
              <div key={w} style={{ background: '#fff', textAlign: 'center', padding: '5px 0' }}>
                <div style={{ fontSize: '8.5px', fontWeight: 700, color: accentColor, textTransform: 'uppercase' }}>{dictionary?.diario_xixi?.semana || 'Semana'} {w}</div>
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
      </div>
    </div>
  );
}


function FichaCadastroPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, fichaAdulto, setFichaAdulto }) {
  const { dictionary } = useTranslation();
  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;

  const rowsCrianca = [
    [{ w: 1, label: dictionary?.ficha_cadastro?.crianca_nome || 'NOME COMPLETO DA CRIANÇA :' }],
    [{ w: 0.45, label: dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:' }, { w: 0.55, label: dictionary?.ficha_cadastro?.idade || 'IDADE:' }],
    [{ w: 1, label: dictionary?.ficha_cadastro?.mae_nome || 'NOME DA MÃE :' }],
    [{ w: 0.65, label: dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:' }, { w: 0.35, label: dictionary?.ficha_cadastro?.cpf || 'CPF:' }],
    [{ w: 1, label: dictionary?.ficha_cadastro?.pai_nome || 'NOME DO PAI :' }],
    [{ w: 0.65, label: dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:' }, { w: 0.35, label: dictionary?.ficha_cadastro?.cpf || 'CPF:' }],
  ];

  const rowsAdulto = [
    [{ w: 1, label: dictionary?.ficha_cadastro?.completo_nome || 'NOME COMPLETO :' }],
    [{ w: 0.45, label: dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:' }, { w: 0.35, label: dictionary?.ficha_cadastro?.cpf || 'CPF:' }, { w: 0.20, label: dictionary?.ficha_cadastro?.rg || 'RG:' }],
    [{ w: 0.55, label: dictionary?.ficha_cadastro?.estado_civil || 'ESTADO CIVIL:' }, { w: 0.45, label: dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:' }],
    [{ w: 1, label: dictionary?.ficha_cadastro?.responsavel_nome || 'NOME DO RESPONSÁVEL (se menor):' }],
    [{ w: 0.6, label: dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:' }, { w: 0.4, label: dictionary?.ficha_cadastro?.cpf || 'CPF:' }],
  ];

  const rows = fichaAdulto ? rowsAdulto : rowsCrianca;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '4px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {[dictionary?.ficha_cadastro?.crianca || 'Criança', dictionary?.ficha_cadastro?.adulto || 'Adulto'].map((label, i) => {
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
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 800, color: '#111', letterSpacing: '0.5px' }}>{dictionary?.ficha_cadastro?.titulo || 'CADASTRO DE PACIENTES'}</div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif" }}>{dictionary?.ficha_cadastro?.data || 'DATA :'}</span>
              <div style={{ width: '80px', height: '10px', background: '#e6e3df', borderRadius: '1px' }} />
            </div>
          </div>
          <div style={{ width: '190px', height: '80px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginTop: '-10px' }}>
            <LogoPreviewHTML item="Ficha de Cadastro" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.6} crm={crmLine} hideTagline={hideTagline} withBackground={false} maxWidth="100%" maxHeight="100%" alignLeft={false} />
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
               <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{dictionary?.ficha_cadastro?.responsavel_acompanhante || 'NOME DO (A) RESPONSÁVEL ACOMPANHANTE:'}</span>
               <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
             </div>
             <div style={{ display: 'flex', gap: '6px' }}>
               <div style={{ flex: 0.6, display: 'flex', gap: '4px', alignItems: 'center' }}>
                 <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:'}</span>
                 <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
               </div>
               <div style={{ flex: 0.4, display: 'flex', gap: '4px', alignItems: 'center' }}>
                 <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{dictionary?.ficha_cadastro?.cpf || 'CPF:'}</span>
                 <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
               </div>
             </div>
          </div>}

          {[
            [{ w: 1, label: dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:' }],
            [{ w: 0.55, label: dictionary?.ficha_cadastro?.complemento || 'COMPLEMENTO:' }, { w: 0.45, label: dictionary?.ficha_cadastro?.bairro || 'BAIRRO:' }],
            [{ w: 0.55, label: dictionary?.ficha_cadastro?.cidade || 'CIDADE:' }, { w: 0.45, label: dictionary?.ficha_cadastro?.estado || 'ESTADO:' }],
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
          
          <div style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, marginTop: '2px' }}>{dictionary?.ficha_cadastro?.telefones || 'TELEFONES :'}</div>
          <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '-2px' }}>
            {fichaAdulto ? <>
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{dictionary?.ficha_cadastro?.celular || 'CELULAR:'}</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{dictionary?.ficha_cadastro?.residencial || 'RESIDENCIAL:'}</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
            </> : <>
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{dictionary?.ficha_cadastro?.mae || 'MÃE :'}</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{dictionary?.ficha_cadastro?.pai || 'PAI :'}</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
              <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{dictionary?.ficha_cadastro?.responsavel || 'RESPONSÁVEL:'}</span><div style={{ flex: 1, height: '12px', background: '#d0dbe9' }} />
            </>}
          </div>

          {[
            [{ w: 0.55, label: dictionary?.ficha_cadastro?.outros_telefones || 'OUTROS TELEFONES :' }, { w: 0.45, label: dictionary?.ficha_cadastro?.residencial_comercial || 'RESIDENCIAL ( ) COMERCIAL ( )', input: false }],
            [{ w: 0.55, label: dictionary?.ficha_cadastro?.outros_telefones || 'OUTROS TELEFONES :' }, { w: 0.45, label: dictionary?.ficha_cadastro?.residencial_comercial || 'RESIDENCIAL ( ) COMERCIAL ( )', input: false }],
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
            <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{dictionary?.ficha_cadastro?.emails || 'E-MAILS:'}</span>
            <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
          </div>

          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <span style={{ fontSize: '7px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>{dictionary?.ficha_cadastro?.como_conheceu || 'COMO CONHECEU A CLÍNICA:'}</span>
            <div style={{ flex: 1, height: '12px', background: '#d0dbe9', borderRadius: '1px' }} />
          </div>

        </div>
      </div>
    </div>
  );
}

function ReciboPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, marca }) {
  const { dictionary } = useTranslation();
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
            <div style={{ width: '130px', height: '45px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
               <LogoPreviewHTML item="Recibo" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.55} crm={crmLine} hideTagline={hideTagline} withBackground={false} alignLeft={true} maxWidth="100%" maxHeight="100%" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: accentColor, opacity: 0.12, letterSpacing: '2px' }}>{dictionary?.recibo?.titulo || 'RECIBO'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
            {[dictionary?.recibo?.recebi_de || 'Recebi de', dictionary?.recibo?.quantia_de || 'A quantia de', dictionary?.recibo?.referente_a || 'Referente a'].map(label => (
              <div key={label} style={{ borderBottom: '0.5px solid #eee', paddingBottom: '3px', display: 'flex', gap: '5px', alignItems: 'flex-end', minHeight: '14px' }}>
                <span style={{ fontSize: '4.5px', fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1 }}></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px', width: '100%', border: '0.5px solid #eee', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', background: '#f5f5f5', borderBottom: '0.5px solid #eee' }}>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', borderRight: '0.5px solid #eee' }}>{dictionary?.recibo?.data || 'DATA'}</div>
              <div style={{ flex: 4, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', borderRight: '0.5px solid #eee' }}>{dictionary?.recibo?.descricao || 'DESCRIÇÃO DOS SERVIÇOS'}</div>
              <div style={{ flex: 1.5, padding: '3px', fontSize: '4.5px', fontWeight: 700, color: '#1a1a1a', textAlign: 'right' }}>{dictionary?.recibo?.total || 'TOTAL'}</div>
            </div>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', borderBottom: '0.5px solid #f9f9f9', height: '11px' }}>
                <div style={{ flex: 1.5, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 4, borderRight: '0.5px solid #f9f9f9' }}></div>
                <div style={{ flex: 1.5 }}></div>
              </div>
            ))}
            <div style={{ display: 'flex', height: '11px', background: '#f9f9f9' }}>
               <div style={{ flex: 5.5, borderRight: '0.5px solid #f9f9f9', padding: '3px', textAlign: 'right', fontSize: '4.5px', fontWeight: 800, color: '#1a1a1a' }}>{dictionary?.recibo?.total || 'TOTAL'}</div>
               <div style={{ flex: 1.5 }}></div>
            </div>
          </div>
 
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '50px', borderTop: '0.5px solid #333', marginBottom: '2.5px' }}></div>
            <div style={{ fontSize: '5.5px', fontWeight: 700, color: '#1a1a1a' }}>{clinicaNome || ''}</div>
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
  const { dictionary } = useTranslation();
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
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', flexDirection: 'column', padding: '8px' }}>
          
          <div style={{ textAlign: 'center', fontSize: '5.5px', fontWeight: 800, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {dictionary?.controle_especial?.titulo || 'RECEITUÁRIO DE CONTROLE ESPECIAL'}
          </div>
 
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'stretch' }}>
            {/* Box Emitente */}
            <div style={{ flex: 1.4, background: `${accentColor}12`, border: `0.1mm solid ${accentColor}25`, padding: '3px 4px', borderRadius: '1.5px' }}>
              <div style={{ fontSize: '4.8px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', marginBottom: '3px', borderBottom: `0.1mm solid ${accentColor}30`, paddingBottom: '1.5px' }}>{dictionary?.controle_especial?.emitente || 'Identificação do Emitente'}</div>
              <div style={{ fontSize: '3.8px', color: '#555', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: accentColor, marginBottom: '1px' }}>{clinicaNome || marca}</div>
                {crmLine && <div style={{ fontWeight: 600 }}>{crmLine}</div>}
                {endereco && <div style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85px' }}>{endereco}</div>}
                {mainPhone && <div style={{ fontWeight: 600 }}>{mainPhone}</div>}
                {cartaoContacts?.email && <div style={{ opacity: 0.75 }}>{cartaoContacts.email}</div>}
                {cartaoContacts?.site && <div style={{ opacity: 0.75 }}>{cartaoContacts.site}</div>}
              </div>
            </div>
 
            {/* Logo e Vias */}
            <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <LogoPreviewHTML item="Receituário de Controle Especial" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} hideTagline={true} withBackground={false} maxWidth="100%" maxHeight="100%" />
              </div>
               <div style={{ fontSize: '3.5px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'center', marginTop: '1px', whiteSpace: 'pre-wrap' }}>
                  {dictionary?.controle_especial?.vias || '1ª VIA FARMÁCIA\n2ª VIA PACIENTE'}
               </div>
            </div>
          </div>
 
          {/* Campos Prescrição */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
            <div style={{ borderBottom: '0.1mm solid #eee', paddingBottom: '1px', display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>{dictionary?.controle_especial?.paciente || 'PACIENTE:'}</span>
            </div>
            <div style={{ borderBottom: '0.1mm solid #eee', paddingBottom: '1px', display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>{dictionary?.controle_especial?.endereco || dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:'}</span>
            </div>
            <div style={{ marginTop: '2px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#333' }}>{dictionary?.controle_especial?.prescricao || 'PRESCRIÇÃO:'}</span>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ borderBottom: '0.1mm solid #f5f5f5', height: '5px' }}></div>
              ))}
            </div>
          </div>
 
          {/* Data e Assinatura */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', alignItems: 'flex-start', padding: '4px 6px' }}>
             <div style={{ width: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '0.5px solid #999' }} />
                <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', marginTop: '1px' }}>{dictionary?.controle_especial?.data || 'Data'}</div>
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '0.5px solid #999' }} />
                <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', marginTop: '1px' }}>{dictionary?.controle_especial?.assinatura || 'Assinatura do Médico'}</div>
             </div>
          </div>
 
          {/* Rodapé Obrigatório */}
          <div style={{ display: 'flex', gap: '6px', height: '26px', marginTop: '2px', flexShrink: 0 }}>
             <div style={{ flex: 1, background: `${accentColor}10`, border: `0.5px solid ${accentColor}25`, padding: '2px 4px', borderRadius: '2px' }}>
                <div style={{ fontSize: '4.5px', fontWeight: 800, color: accentColor, marginBottom: '1px', textAlign: 'center', textTransform: 'uppercase' }}>{dictionary?.controle_especial?.comprador || 'IDENTIFICAÇÃO DO COMPRADOR'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8px' }}>
                  {['Nome', 'Ident.', 'Endereço', 'Cidade', 'Estado/Tel'].map(f => <div key={f} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)', height: '3px' }} />)}
                </div>
             </div>
             <div style={{ flex: 1, border: '0.5px solid #ddd', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, textAlign: 'center', fontSize: '4.5px', color: '#bbb', textTransform: 'uppercase', fontWeight: 700 }}>{dictionary?.controle_especial?.farmaceutico || 'ASSINATURA DO FARMACÊUTICO'}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistMaternidadePreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale }) {
  const { dictionary } = useTranslation();
  const BORDER = 10;
  const solidColor = borderColor || accentColor;
  const { whatsapp, telefone, telefone2, instagram, site, endereco } = cartaoContacts || {};
  const mainPhone = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');

  const SECOES = dictionary?.checklist_maternidade?.secoes || [
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
            <span style={{ flex: 1 }}>{tItem(item, dictionary)}</span>
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
            <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: '5.5px', fontWeight: 900, color: accentColor, letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.checklist_maternidade?.titulo || 'CHECKLIST MATERNIDADE'}</div>
          </div>
          {/* Conteúdo */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 5px 3px 5px', gap: '3px', overflow: 'hidden' }}>
            {/* Logo centralizada no topo */}
            <div style={{ width: '100%', height: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: `0.4px solid ${accentColor}25`, marginBottom: '4px', overflow: 'hidden' }}>
              <LogoPreviewHTML item="Checklist Maternidade" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.7} crm={crmLine} withBackground={false} maxWidth="100%" maxHeight="100%" />
            </div>
            {/* Grid 2x2 */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '2px 4px 6px' }}>
              {SECOES.map((s, i) => <Secao key={i} titulo={s.titulo} itens={s.itens} color={paletteColors[i % paletteColors.length] || accentColor} />)}
            </div>
            {/* Rodapé etiqueta */}
            {!!(clinicaNome || endereco || mainPhone || site || instagram) ? (
              <div style={{ borderTop: `0.3px solid ${accentColor}30`, paddingTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <div style={{ fontSize: '3px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>{clinicaNome || ''}</div>
                <div style={{ fontSize: '2.6px', color: '#888', textAlign: 'center', lineHeight: 1.3 }}>
                  {endereco && <div>{endereco}</div>}
                  {mainPhone && <div>{mainPhone}</div>}
                </div>
                <div style={{ fontSize: '2.6px', color: '#888', textAlign: 'right', flexShrink: 0 }}>
                  {site && <div>{site}</div>}
                  {instagram && <div>@{instagram}</div>}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrientacoesRNPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, rnFields = {}, setRnFields = {} }) {
  const { lang, dictionary } = useTranslation();
  const t = dictionary?.orientacoes_rn || {};
  const isEn = lang === 'en';

  const tVal = (val, ptDef, enDef) => {
    if (!val || val === ptDef || val === enDef) return isEn ? enDef : ptDef;
    return val;
  };

  const { whatsapp, telefone, telefone2, email, site, instagram } = cartaoContacts || {};
  const mainPhone = [whatsapp || telefone, telefone2].filter(Boolean).join(' / ');
  const solidColor = borderColor || paletteColors[0] || accentColor;
  const BORDER = 8; // Sempre tem borda (ou Estampa ou Sólida conforme BordaToggle)
  const c0 = ensureLegibleColor(paletteColors[0] || accentColor);
  const c1 = ensureLegibleColor(paletteColors[1] || accentColor);
  const c2 = ensureLegibleColor(paletteColors[2] || paletteColors[0] || accentColor);
  const c3 = ensureLegibleColor(paletteColors[3] || paletteColors[1] || accentColor);

  const f = rnFields;
  const umbigo = tVal(f.umbigo, 'álcool 70%', '70% rubbing alcohol');
  const soro = tVal(f.soro, 'Rinosoro ou Salsep', 'Saline nasal spray');
  const med1 = tVal(f.med1, 'Luftal', 'Infant Gas Relief / Simethicone');
  const int1 = tVal(f.int1, '8/8h', 'every 8 hours');
  const med2 = tVal(f.med2, 'Tylenol baby', 'Infant Tylenol / Acetaminophen');
  const int2 = tVal(f.int2, '6/6h', 'every 6 hours');
  const pomada = tVal(f.pomada, 'Desitin ou Bepantol', 'Desitin or Triple Paste');
  const vitDMed = tVal(f.vitDMed, 'Baby-D ou Addera D3', 'Infant Vitamin D3 Drops');
  
  const { nomeBebe='', dataNasc='', peso='', altura='', dose1='', dose2='', vitDDose='1', bcgData='', hepBData='', consultaData='', consultaHora='', urgencia='' } = rnFields;
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
          <div style={{ background: solidColor, padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.2, whiteSpace: 'pre-wrap' }}>
              {t.titulo || 'OS PRIMEIROS DIAS\nCOM MEU BEBÊ'}
            </div>
            <div style={{ width: '110px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
              <LogoPreviewHTML item="Orientações p/ Recém Nascidos" editData={editData} color={'#fff'} layout={logoLayout} scaleFactor={0.28} crm={null} hideTagline maxWidth="100%" maxHeight="100%" />
            </div>
          </div>

          {/* FAIXA DO BEBÊ */}
          <div style={{ background: c0+'12', borderBottom: `0.5px solid ${c0}30`, padding: '2px 6px', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 2 }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>{t.bebe || 'Bebê:'}</span>
              <F value={nomeBebe} onChange={setNomeBebe} width="40px" placeholder="" align="left" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>{t.nasc || 'Nasc:'}</span>
              <F value={dataNasc} onChange={setDataNasc} width="22px" placeholder="dd/mm/aa" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>{t.peso || 'Peso:'}</span>
              <F value={peso} onChange={setPeso} width="14px" placeholder="kg" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '3px', color: c0, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>{t.alt || 'Alt:'}</span>
              <F value={altura} onChange={setAltura} width="14px" placeholder="cm" />
            </div>
          </div>

          {/* CORPO - 2 colunas */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
            <div style={{ flex: '0 0 45%', padding: '4px 4px 2px 5px', borderRight: `0.4px solid ${c0}20`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Sec label={t.alimentacao_label || 'Alimentação:'} color={c0}>{t.alimentacao_text || 'Aleitamento materno sob livre demanda (à vontade).'}</Sec>
              <Sec label={t.umbigo_label || 'Umbigo:'} color={c1}>{t.umbigo_text_pre || 'Limpeza com '}<F value={umbigo} onChange={setUmbigo} width="36px" placeholder={t.umbigo || 'álcool 70%'} />{t.umbigo_text_pos || ' a cada troca de fralda e após o banho.'}</Sec>
              <Sec label={t.ictericia_label || 'Icterícia:'} color={c2}>{t.ictericia_text || 'Pele amarelada? Procure o pediatra imediatamente.'}</Sec>
              <Sec label={t.febre_label || 'Febre:'} color={c3}>{t.febre_text || 'Menores de 3 meses: emergência. Maiores de 3 meses: siga as orientações médicas.'}</Sec>
              <Sec label={t.higiene_label || 'Higiene:'} color={c0}>{t.higiene_text || '1 banho/dia com sabonete neutro. Sem talco ou perfume. Trocas com água morna e algodão.'}</Sec>
            </div>
            <div style={{ flex: 1, padding: '4px 5px 2px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Sec label={t.nariz_label || 'Nariz:'} color={c1}>{t.nariz_text_pre || 'Spray de soro 0,9% ('}<F value={soro} onChange={setSoro} width="38px" placeholder={t.soro || 'marca'} />{t.nariz_text_pos || ') antes de cada mamada.'}</Sec>
              <Sec label={t.colicas_label || 'Cólicas:'} color={c2}>
                {t.colicas_text_pre || 'Compressa morna. Se necessário: '}<F value={med1} onChange={setMed1} width="40px" placeholder={t.med1 || 'remédio'} /> <F value={dose1} onChange={setDose1} width="10px" placeholder="gts" /> {t.colicas_text_mid || 'gts'} <F value={int1} onChange={setInt1} width="22px" placeholder={t.int1 || '8/8h'} />. {t.colicas_text_mid2 || 'Sem melhora: '}<F value={med2} onChange={setMed2} width="40px" placeholder={t.med2 || 'remédio'} /> <F value={dose2} onChange={setDose2} width="10px" placeholder="gts" /> {t.colicas_text_mid || 'gts'} <F value={int2} onChange={setInt2} width="22px" placeholder={t.int2 || '6/6h'} />.
              </Sec>
              <Sec label={t.assaduras_label || 'Assaduras:'} color={c3}>{t.assaduras_text_pre || 'Secar bem antes de aplicar ('}<F value={pomada} onChange={setPomada} width="40px" placeholder={t.pomada || 'pomada'} />{t.assaduras_text_pos || ').'}</Sec>
              <Sec label={t.vitD_label || 'Vitamina D:'} color={c0}>{t.vitD_text_pre || ''}<F value={vitDMed} onChange={setVitDMed} width="42px" placeholder={t.vitDMed || 'marca'} />{t.vitD_text_pos || ' — '}<F value={vitDDose} onChange={setVitDDose} width="10px" placeholder="1" /> {t.vitD_text_pos2 || 'gota/dia desde o nascimento.'}</Sec>
            </div>
          </div>

          {/* VACINAS + PRÓXIMA CONSULTA */}
          <div style={{ borderTop: `0.5px solid ${c0}25`, padding: '2.5px 6px', flexShrink: 0, display: 'flex', gap: '6px', alignItems: 'center', background: c1+'0a' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '3.2px', fontWeight: 800, color: c1, fontFamily: 'Montserrat,sans-serif', marginBottom: '1px', textTransform: 'uppercase' }}>{t.vacinas_maternidade || 'Vacinas na maternidade'}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {t.bcg || 'BCG:'} <F value={bcgData} onChange={setBcgData} width="20px" placeholder="" />
                </div>
                <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {t.hepB || 'Hep B:'} <F value={hepBData} onChange={setHepBData} width="20px" placeholder="" />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, background: c2+'18', borderRadius: '3px', padding: '2px 4px', border: `0.5px solid ${c2}40` }}>
              <div style={{ fontSize: '3.2px', fontWeight: 800, color: c2, fontFamily: 'Montserrat,sans-serif', marginBottom: '1px', textTransform: 'uppercase' }}>{t.proxima_consulta || '📅 Próxima consulta'}</div>
              <div style={{ fontSize: '3.2px', color: '#555', fontFamily: 'Montserrat,sans-serif', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <F value={consultaData} onChange={setConsultaData} width="24px" placeholder="dd/mm/aa" />
                <span>{t.as || 'às'}</span>
                <F value={consultaHora} onChange={setConsultaHora} width="16px" placeholder="00h00" />
              </div>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div style={{ borderTop: `0.5px solid ${c0}25`, padding: '2px 6px', flexShrink: 0, background: c0+'08' }}>
            <div style={{ fontSize: '3.5px', fontWeight: 900, color: c0, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic', marginBottom: '1.5px' }}>{t.observacoes || 'Observações:'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 8px' }}>
              <div>
                <Bullet>{t.obs_1 || 'Consulta entre 7 e 14 dias de vida.'}</Bullet>
                <Bullet>{t.obs_2 || 'Levar ao Posto para vacinação.'}</Bullet>
                <Bullet>{t.obs_3 || 'Teste do Pezinho entre o 3º e 7º dia.'}</Bullet>
                <Bullet>{t.obs_4 || 'Teste da Orelhinha o quanto antes.'}</Bullet>
              </div>
              <div>
                <Bullet>{t.obs_5 || 'Dormir sempre de barriga para cima.'}</Bullet>
                <Bullet>{t.obs_6 || 'Sem travesseiros ou cobertores pesados.'}</Bullet>
                <Bullet>{t.obs_7 || 'Roupas leves no bebê.'}</Bullet>
                <Bullet>{t.obs_8 || 'Sólidos só após os 6 meses com orientação.'}</Bullet>
              </div>
            </div>
          </div>

          {/* RODAPÉ */}
          {!!(clinicaNome || urgenciaTel || mainPhone || site || instagram) ? (
            <div style={{ borderTop: `0.4px solid ${c0}30`, padding: '2px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px' }}>
                {clinicaNome && <div style={{ fontSize: '3.5px', fontWeight: 800, color: c0, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase' }}>{clinicaNome}</div>}
                {(urgenciaTel || mainPhone) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '3px', color: '#888', fontFamily: 'Montserrat,sans-serif' }}>Urgências:</span>
                    <F value={urgenciaTel} onChange={setUrgenciaTel} width="28px" placeholder="telefone" align="left" />
                  </div>
                )}
              </div>
              <div style={{ fontSize: '2.8px', color: '#aaa', fontFamily: 'Montserrat,sans-serif', textAlign: 'right' }}>
                {[mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GuiaCuidadosPreview({ brand, logoColor, logoLayout, comBorda, setComBorda, patternSrc, patternScale, setPatternScale, accentColor, borderColor, setBorderColor, paletteColors, cartaoContacts, crmLine, clinicaNome, editData, localSlogan }) {
  const { dictionary } = useTranslation();
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
          <LogoPreviewHTML item="Receituário" editData={editData} color={accentColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} withBackground={false} />
        </div>
        <div style={{ width:'13px', height:'0.7px', background:accentColor, marginBottom:'8px', borderRadius:'10px' }} />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0px' }}>
          <div style={{ fontSize:'3px', fontWeight:800, color:`${accentColor}cc`, textTransform:'uppercase', letterSpacing:'0.6px', fontStyle:'italic' }}>{dictionary?.guia_cuidados?.guia_de || 'GUIA DE'}</div>
          <div style={{ fontSize:'5.9px', fontWeight:800, color:'#333', textTransform:'uppercase', letterSpacing:'0.8px', lineHeight:1.2 }}>{dictionary?.guia_cuidados?.titulo || 'CUIDADOS COM O BEBÊ'}</div>
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
  const { dictionary, lang } = useTranslation();
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = editData || brand.editData || {};
  const instagram = cartaoContacts?.instagram || brand?.instagram || '';
  const site = cartaoContacts?.site || brand?.site || '';
  const clinicaNome = brand?.clinicaNome || brand?.editData?.clinicaNome || '';
  const endereco = cartaoContacts?.endereco || brand?.endereco || brand?.editData?.endereco || '';

  const allPhones = [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · ');
  const logoHtml = <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><LogoPreviewHTML item={title} editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={1} crm={crmLine} maxWidth="70px" maxHeight="35px" hideTagline /></div>;
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
      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '6px', color: '#ccc', fontWeight: 700, zIndex: 10 }}>{lang === 'en' ? 'PG' : 'PÁG'} {num} {num === 1 ? (lang === 'en' ? '(COVER)' : '(CAPA)') : ''}</div>
      <div style={{ position: 'relative', zIndex: 2, padding, height: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );

  // Lógica de Título em dois níveis
  const getTitleData = (raw) => {
    if (raw.includes('Alimentar')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'COMPLEMENTARY FEEDING' : 'INTRODUÇÃO ALIMENTAR', 
        tagline: lang === 'en' ? 'Nutrition and Health for Your Baby' : 'Nutrição e Saúde para o seu Bebê' 
      };
    }
    if (raw.includes('Cuidados')) {
      return { 
        pre: lang === 'en' ? 'BABY' : 'CUIDADOS', 
        main: lang === 'en' ? 'CARE' : 'COM O BEBÊ', 
        tagline: lang === 'en' ? 'Love and Attention in Every Detail' : 'Carinho e Atenção in Cada Detalhe' 
      };
    }
    if (raw.includes('Desenvolvimento')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'DEVELOPMENT' : 'DESENVOLVIMENTO', 
        tagline: lang === 'en' ? 'Follow Every Step of Your Baby\'s Growth' : 'Acompanhe Cada Passo do Crescimento do Seu Bebê' 
      };
    }
    if (raw.includes('Vacina')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'VACCINATION' : 'VACINAÇÃO', 
        tagline: lang === 'en' ? 'Immunization Schedule and Tracking' : 'Calendário e Acompanhamento de Imunização' 
      };
    }
    if (raw.includes('Sono')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DO', 
        main: lang === 'en' ? 'HEALTHY SLEEP' : 'SONO SAUDÁVEL', 
        tagline: lang === 'en' ? 'Routine and Safety for Baby\'s Sleep' : 'Rotina e Segurança para o Sono do Bebê' 
      };
    }
    if (raw.includes('Pré-Natal')) {
      return { 
        pre: lang === 'en' ? 'CARD FOR' : 'CARTÃO DE', 
        main: lang === 'en' ? 'PRENATAL EXAM' : 'EXAME PRÉ-NATAL', 
        tagline: lang === 'en' ? 'Caring for baby\'s and mom\'s health from the start...' : 'Cuidando da saúde do bebê e da mamãe desde o início...' 
      };
    }
    return { 
      pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
      main: raw.toUpperCase(), 
      tagline: lang === 'en' ? 'Pediatric Health and Well-Being' : 'Saúde e Bem-Estar Pediátrico' 
    };
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
          {folderRoof ? (lang === 'en' ? '🏠 House Cutout ACTIVE' : '🏠 Recorte Casinha ATIVO') : (lang === 'en' ? '⬜️ Straight Cutout ACTIVE' : '⬜️ Recorte Reto ATIVO')}
        </button>
      )}

      {/* LADO EXTERNO (5 | 6 | 1) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{lang === 'en' ? 'OUTSIDE (FACE 1)' : 'LADO EXTERNO (FACE 1)'}</span>
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
                <div style={{ position: 'absolute', top: '48%', left: '10px', right: '10px', zIndex: 3, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
                  <div style={{ width: '92%', background: mainColor, borderRadius: '4px', padding: '12px 14px', textAlign: 'center', position: 'relative', border: `0.4px solid ${mainColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                     <div style={{ fontFamily: `'Great Vibes', cursive`, color: '#fff', fontSize: '9px', marginBottom: '4px', textTransform: 'none' }}>
                       {isSono 
                         ? (lang === 'en' ? '"A well-rested baby is a happier baby!"' : '"Um bebê bem descansado é um bebê mais feliz!"')
                         : isCuidados 
                           ? (lang === 'en' ? '"You don\'t need to be perfect — you need to be present."' : '"Você não precisa ser perfeita — precisa estar presente."')
                           : isVacina 
                             ? (lang === 'en' ? '"Protection that starts from day one."' : '"Proteção que começa desde o primeiro dia."') 
                             : (lang === 'en' ? '"Play, talk and explore!"' : '"Brinque, converse e explore!"')}
                     </div>
                     <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 500, lineHeight: 1.5, fontFamily: 'Montserrat, sans-serif' }}>
                        {isSono 
                          ? (lang === 'en' ? 'Sleep is an essential physiological need for your baby\'s development. A consistent routine, safe environment, and respecting sleep cues make all the difference.' : 'O sono é uma necessidade fisiológica essencial para o desenvolvimento do seu bebê. Uma rotina consistente, ambiente seguro e respeito aos sinais de sono fazem toda a diferença.')
                          : isCuidados 
                            ? (lang === 'en' ? 'Caring for a baby is learning along with them. Every doubt is normal, every achievement is yours too. You are doing an amazing job.' : 'Cuidar de um bebê é aprender junto com ele. Cada dúvida é normal, cada conquista é sua também. Você está fazendo um trabalho incrível.')
                            : isVacina 
                              ? (lang === 'en' ? 'Vaccination is the greatest act of love and care. It protects not only your baby, but the entire community around them.' : 'A vacinação é o maior gesto de amor e cuidado. Ela protege não apenas o seu bebê, mas toda a comunidade ao redor.')
                              : (lang === 'en' ? 'Playtime is more than just fun. It helps your baby learn, develop new skills, and feel safe and loved.' : 'As brincadeiras são mais do que momentos de divertimento. Elas ajudam seu bebê a aprender, a desenvolver novas habilidades e a se sentir seguro e amado.')}
                     </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px', opacity: 0.18 }}>
                   {Array.from({length: 8}).map((_, i) => (
                     <div key={i} style={{ width: '3px', height: '3px', background: mainColor, borderRadius: '50%' }} />
                   ))}
                </div>
            </div>

            {/* ETIQUETA DE DADOS NO RODAPÉ (DISCRETA E ELEGANTE) */}
            {!!(clinicaNome || endereco || allPhones || brand.email || site || instagram) ? (
              <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', background: '#fff', border: `0.5px solid ${mainColor}15`, borderRadius: '3px', padding: '4px 10px', zIndex: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {clinicaNome && <div style={{ fontSize: '5.2px', fontWeight: 800, color: mainColor, marginBottom: '0.5px' }}>{clinicaNome}</div>}
                  {endereco && <div style={{ fontSize: '4.2px', color: '#999', fontWeight: 500, lineHeight: 1.1 }}>{endereco}</div>}
                  
                  {allPhones && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginTop: '0.5px' }}>
                       <svg viewBox="0 0 24 24" width="7" height="7" fill="#25D366" style={{ flexShrink: 0 }}><path d={ICON_PATHS.whatsapp}/></svg>
                       <div style={{ fontSize: '5.5px', fontWeight: 800, color: '#444' }}>{allPhones}</div>
                    </div>
                  )}

                  {(brand.email || site || instagram) && (
                    <div style={{ fontSize: '4px', color: '#aaa', marginTop: '0.5px' }}>
                       {[brand.email, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}
                    </div>
                  )}
              </div>
            ) : null}
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
                    }}>
                      {isSono 
                        ? (lang === 'en' ? 'SLEEP WELL, GROW WELL' : 'DURMA BEM, CRESÇA BEM') 
                        : isCuidados 
                          ? (lang === 'en' ? 'FROM DAY ONE WITH LOVE' : 'DO PRIMEIRO DIA COM MUITO AMOR') 
                          : isDev 
                            ? (lang === 'en' ? 'EVERY DAY A NEW DISCOVERY' : 'CADA DIA UM NOVO DESCOBRIMENTO') 
                            : isVacina 
                              ? (lang === 'en' ? 'PROTECTED FROM DAY ONE' : 'PROTEGIDO DESDE O PRIMEIRO DIA') 
                              : isPrenatal 
                                ? (lang === 'en' ? 'CARING FOR MOM AND BABY\'S HEALTH' : 'CUIDANDO DA SAÚDE DA MAMÃE E DO BEBÊ') 
                                : (lang === 'en' ? 'NUTRITION THAT TRANSFORMS' : 'NUTRIÇÃO QUE TRANSFORMA')}
                    </div>
                  </div>
                </div>
            </div>
          </Page>
        </div>
      </div>

      {/* LADO INTERNO (2 | 3 | 4) */}
      <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{lang === 'en' ? 'INSIDE (FACE 2)' : 'LADO INTERNO (FACE 2)'}</span>
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
  const { dictionary, lang } = useTranslation();
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = editData || brand.editData || {};

  const getTitleData = (raw) => {
    if (raw.includes('Alimentar')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'COMPLEMENTARY FEEDING' : 'INTRODUÇÃO ALIMENTAR', 
        tagline: lang === 'en' ? 'Nutrition and Health for Your Baby' : 'Nutrição e Saúde para o seu Bebê' 
      };
    }
    if (raw.includes('Cuidados')) {
      return { 
        pre: lang === 'en' ? 'BABY' : 'CUIDADOS', 
        main: lang === 'en' ? 'CARE' : 'COM O BEBÊ', 
        tagline: lang === 'en' ? 'Love and Attention in Every Detail' : 'Carinho e Atenção em Cada Detalhe' 
      };
    }
    if (raw.includes('Desenvolvimento')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'DEVELOPMENT' : 'DESENVOLVIMENTO', 
        tagline: lang === 'en' ? 'Follow Every Step of Your Baby\'s Growth' : 'Acompanhe Cada Passo do Crescimento do Seu Bebê' 
      };
    }
    if (raw.includes('Vacina')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
        main: lang === 'en' ? 'VACCINATION' : 'VACINAÇÃO', 
        tagline: lang === 'en' ? 'Immunization Schedule and Tracking' : 'Calendário e Acompanhamento de Imunização' 
      };
    }
    if (raw.includes('Sono')) {
      return { 
        pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DO', 
        main: lang === 'en' ? 'HEALTHY SLEEP' : 'SONO SAUDÁVEL', 
        tagline: lang === 'en' ? 'Routine and Safety for Baby\'s Sleep' : 'Rotina e Segurança for Baby\'s Sleep' 
      };
    }
    if (raw.includes('Pré-Natal')) {
      return { 
        pre: lang === 'en' ? 'CARD FOR' : 'CARTÃO DE', 
        main: lang === 'en' ? 'PRENATAL EXAM' : 'EXAME PRÉ-NATAL', 
        tagline: lang === 'en' ? 'Care from the Start' : 'Cuidado desde o Início' 
      };
    }
    return { 
      pre: lang === 'en' ? 'GUIDE TO' : 'GUIA DE', 
      main: raw.toUpperCase(), 
      tagline: lang === 'en' ? 'Pediatric Health and Well-Being' : 'Saúde e Bem-Estar Pediátrico' 
    };
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
      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '6px', color: '#ccc', fontWeight: 700, zIndex: 10 }}>{lang === 'en' ? 'PG' : 'PÁG'} {num} {num === 1 ? (lang === 'en' ? '(COVER)' : '(CAPA)') : ''}</div>
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
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>{lang === 'en' ? 'OUTSIDE (FACE 1)' : 'LADO EXTERNO (FACE 1)'}</span>
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={4} withPattern><PrenatalPage4 accentColor={accentColor} palette={paletteColors} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} /></Page>
          <Page num={1} withPattern><PrenatalPage1 accentColor={accentColor} palette={paletteColors} logoComponent={<LogoPreviewHTML item={title} editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={1} crm={crmLine} maxWidth="70px" maxHeight="35px" hideTagline />} folderRoof={folderRoof} tagline={finalTagline} comBorda={comBorda} patternSrc={patternSrc} patternScale={patternScale} borderColor={borderColor} /></Page>
        </div>
      </div>

      {/* FACE 2: Pág 2 | Pág 3 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>{lang === 'en' ? 'INSIDE (FACE 2)' : 'LADO INTERNO (FACE 2)'}</span>
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={2} withPattern><PrenatalPage2 accentColor={accentColor} palette={paletteColors} /></Page>
          <Page num={3} withPattern><PrenatalPage3 accentColor={accentColor} palette={paletteColors} /></Page>
        </div>
      </div>
    </div>
  );
}

function AtestadoPreview({ accentColor, patternSrc, editData, logoColor, logoLayout, crmLine, clinicaNome, marca, cartaoContacts, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, folderRoof, setFolderRoof, paperSize, setPaperSize, atestadoModelo = 1, setAtestadoModelo }) {
  const { dictionary } = useTranslation();
  const BORDER = 14;
  const { whatsapp, telefone, telefone2, email, instagram, site, endereco } = cartaoContacts || {};
  const footerLine1 = [clinicaNome, whatsapp, telefone, telefone2].filter(Boolean).join('  ·  ');
  const footerLine2 = [instagram ? `@${instagram}` : '', email, site, endereco].filter(Boolean).join('  ·  ');
  const B = ({ w }) => (
    <span style={{ display: 'inline-block', borderBottom: '0.6px solid #555', width: w, verticalAlign: 'bottom' }}>&nbsp;</span>
  );
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const roofClip = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setAtestadoModelo && (
        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '20px', padding: '3px' }}>
          {[1, 2].map(m => (
            <button key={m} onClick={() => setAtestadoModelo(m)} style={{ padding: '3px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: atestadoModelo === m ? accentColor : 'transparent', color: atestadoModelo === m ? '#fff' : '#888', transition: 'all 0.15s' }}>
              Modelo {m}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {setFolderRoof && (
          <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
            {folderRoof ? (dictionary?.geral?.recorte_casinha || '🏠 Recorte Casinha ATIVO') : (dictionary?.geral?.recorte_reto || '⬜️ Recorte Reto ATIVO')}
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
      <div style={{ position: 'absolute', top: `${BORDER + 18}px`, left: '50%', transform: 'translateX(-50%)', width: '180px', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LogoPreviewHTML item="Atestado Médico" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} hideTagline={hideTagline} withBackground={false} maxWidth="180px" maxHeight="60px" />
      </div>

      {/* Título */}
      <div style={{ position: 'absolute', top: '110px', left: 0, right: 0, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '7.5px', letterSpacing: '1.2px', textAlign: 'center', color: '#1a1a2e' }}>{dictionary?.atestado?.titulo?.toUpperCase() || 'ATESTADO MÉDICO'}</div>

      {atestadoModelo === 1 ? (
      <>
      {/* Texto: padding horizontal de 9mm → ~25px */}
      <div style={{ position: 'absolute', top: '135px', left: '25px', right: '22px', fontFamily: "'Montserrat',sans-serif", fontSize: '5.5px', color: '#333', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.2 }}>
        {[
          [[dictionary?.atestado?.declaracao || 'Declaro para os devidos fins, que', false], ['', true]],
          [['', true], [dictionary?.atestado?.esteve_em_consulta || ', esteve em consulta, das', false], ['', 'fixed:14px'], [dictionary?.atestado?.hs_as || 'hs às', false], ['', 'fixed:14px'], [',', false]],
          [[dictionary?.atestado?.hs_acompanhado || 'acompanhado de seu responsável Sr. (a)', false], ['', true]],
          [['', true], [dictionary?.atestado?.rg || ', R.G. n°', false], ['', true], [dictionary?.atestado?.necessitando || ', necessitando o mesmo', false]],
          [['de', false], ['', 'fixed:12px'], ['(', false], ['', 'fixed:8px'], [') ' + (dictionary?.atestado?.dias_dispensa || 'dias de dispensa.'), false]],
        ].map((row, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'flex-end', gap: '1px' }}>
            {row.map(([text, isBlank], ci) => isBlank === true
              ? <span key={ci} style={{ flex: 1, borderBottom: '0.6px solid #555' }}>&nbsp;</span>
              : isBlank && typeof isBlank === 'string' && isBlank.startsWith('fixed:')
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
      </>
      ) : (
      <>
      {/* Modelo 2: declaração curta + checkboxes + CID + Local/Data + Assinatura */}
      <div style={{ position: 'absolute', top: '128px', left: '25px', right: '22px', fontFamily: "'Montserrat',sans-serif", fontSize: '5.5px', color: '#333', display: 'flex', flexDirection: 'column', gap: '5px', lineHeight: 1.2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px' }}>
          <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.atesto_que || 'Atesto que o(a) Sr.(a)'}</span>
          <span style={{ flex: 1, borderBottom: '0.6px solid #555' }}>&nbsp;</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px' }}>
          <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.foi_atendido || 'foi atendido na Clínica Médica das'}</span>
          <span style={{ width: '10px', borderBottom: '0.6px solid #555', display: 'inline-block' }}>&nbsp;</span>
          <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.as || 'às'}</span>
          <span style={{ width: '10px', borderBottom: '0.6px solid #555', display: 'inline-block' }}>&nbsp;</span>
          <span style={{ whiteSpace: 'nowrap' }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          {[
            dictionary?.atestado?.check_retornar || 'Foi orientado a retornar ao trabalho.',
            dictionary?.atestado?.check_repouso_hoje || 'Foi orientado a permanecer em repouso hoje.',
          ].map((txt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '5px', height: '5px', border: '0.6px solid #555', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap' }}>{txt}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '5px', height: '5px', border: '0.6px solid #555', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.check_repouso_dias_pre || 'Deverá permanecer em repouso ('}</span>
            <span style={{ width: '8px', borderBottom: '0.6px solid #555', display: 'inline-block' }}>&nbsp;</span>
            <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.check_repouso_dias_pos || ') dia (s) a partir desta data'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '5px', height: '5px', border: '0.6px solid #555', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.check_apto_esportes || 'Está apto a exercer práticas desportivas.'}</span>
          </div>
        </div>
      </div>

      {/* CID */}
      <div style={{ position: 'absolute', top: '208px', left: '22px', right: '22px', display: 'flex', alignItems: 'flex-end', gap: '3px', fontFamily: "'Montserrat',sans-serif", fontSize: '5.5px', color: '#333' }}>
        <span style={{ whiteSpace: 'nowrap' }}>{dictionary?.atestado?.cid_label || 'CID:'}</span>
        <span style={{ width: '40px', borderBottom: '0.6px solid #555', display: 'inline-block' }}>&nbsp;</span>
        <span style={{ whiteSpace: 'nowrap', fontSize: '4px', color: '#999' }}>({dictionary?.atestado?.cid_caption || 'preenchimento com autorização do paciente'})</span>
      </div>

      {/* Local e Data */}
      <div style={{ position: 'absolute', top: '232px', left: '22px', width: '90px', borderBottom: '0.6px solid #555' }} />
      <div style={{ position: 'absolute', top: '234px', left: '22px', width: '90px', textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontSize: '4px', color: '#555' }}>
        {dictionary?.atestado?.local_data || 'Local e Data'}
      </div>

      {/* Assinatura do Médico */}
      <div style={{ position: 'absolute', top: '232px', right: '22px', width: '90px', borderBottom: '0.6px solid #555' }} />
      <div style={{ position: 'absolute', top: '234px', right: '22px', width: '90px', textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontSize: '4px', color: '#555' }}>
        {dictionary?.atestado?.assinatura_medico || 'Assinatura do Médico'}
      </div>
      </>
      )}

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
  const { dictionary } = useTranslation();
  const effectiveSrc = comBorda ? patternSrc : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
    <div style={{ width: '320px', height: '220px', position: 'relative', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      {effectiveSrc && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.1 }} />}
      <div style={{ position: 'relative', zIndex: 1, width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <LogoPreviewHTML editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} hideTagline={hideTagline} maxWidth="60px" maxHeight="60px" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '11px', color: accentColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{tItem(item, dictionary)}</div>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '9px', color: '#bbb', marginTop: '6px' }}>Preview gerado ao exportar o PDF</div>
      </div>
    </div>
    </div>
  );
}

function PapelTimbradoPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome, folderRoof, setFolderRoof }) {
  const { dictionary } = useTranslation();
  const BORDER = 12;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || paletteColors[0] || accentColor;
  const roofClip = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setFolderRoof && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
            {folderRoof ? (dictionary?.geral?.recorte_casinha || '🏠 Recorte Casinha ATIVO') : (dictionary?.geral?.recorte_reto || '⬜️ Recorte Reto ATIVO')}
          </button>
        </div>
      )}
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 4px 120px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {effectiveSrc
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', clipPath: roofClip, transition: 'clip-path 0.3s ease' }} />
        
        {/* Top Logo */}
        <div style={{ position: 'absolute', top: BORDER + (folderRoof ? 22 : 14), left: '50%', transform: 'translateX(-50%)', width: '160px', display: 'flex', justifyContent: 'center', transition: 'top 0.3s ease' }}>
          <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.6} crm={crmLine} maxWidth="160px" maxHeight="35px" />
        </div>

        {/* Central Watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15, width: '160px', display: 'flex', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
           <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.65} hideTagline maxWidth="160px" maxHeight="100px" />
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

const getStoryTemplates = (dictionary) => [
  { id: 'tiraduvidas', titulo: dictionary?.insta_pack?.tiraduvidas_title || 'Tira-Dúvidas',       subtitulo: dictionary?.insta_pack?.tiraduvidas_subtitle || 'Me manda sua pergunta!' },
  { id: 'enquete',     titulo: dictionary?.insta_pack?.enquete_title || 'Me conta!',           subtitulo: dictionary?.insta_pack?.enquete_subtitle || 'Qual é a sua dúvida?' },
  { id: 'mito',        titulo: dictionary?.insta_pack?.mito_title || 'Verdade ou Mito?',    subtitulo: dictionary?.insta_pack?.mito_subtitle || 'O que você já ouviu por aí?' },
  { id: 'dica',        titulo: dictionary?.insta_pack?.dica_title || 'Dica do Dia',         subtitulo: dictionary?.insta_pack?.dica_subtitle || 'Arrasta pra ver o conteúdo' },
  { id: 'indica',      titulo: dictionary?.insta_pack?.indica_title || 'Me Indica!',          subtitulo: dictionary?.insta_pack?.indica_subtitle || 'Qual produto você quer ver?' },
  { id: 'novidades',   titulo: dictionary?.insta_pack?.novidades_title || 'Novidades',           subtitulo: dictionary?.insta_pack?.novidades_subtitle || 'Tem coisa boa chegando!' },
  { id: 'sabiaque',    titulo: dictionary?.insta_pack?.sabiaque_title || 'Você Sabia?',         subtitulo: dictionary?.insta_pack?.sabiaque_subtitle || 'Um fato que vai te surpreender' },
  { id: 'livre',       titulo: dictionary?.insta_pack?.livre_title || 'Fala Comigo!',        subtitulo: dictionary?.insta_pack?.livre_subtitle || 'Manda sua mensagem' },
];

const INSTA_FORMATS = [
  { id: 'story', label: 'Story 9:16', pw: 180, ph: 320, rw: 1080, rh: 1920, logoSF: 0.45, titleTop: '95px', boxTop: '120px', boxH: '110px', footerBottom: '25px', titleSize: '9px', subSize: '6px' },
  { id: 'post',  label: 'Post 1:1',   pw: 280, ph: 280, rw: 1080, rh: 1080, logoSF: 0.55, titleTop: '80px', boxTop: '105px', boxH: '80px',  footerBottom: '18px', titleSize: '11px', subSize: '7px' },
];

function FundoInstaPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome, storyTemplateIdx, setStoryTemplateIdx, storyFormatIdx, setStoryFormatIdx }) {
  const { dictionary } = useTranslation();
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || paletteColors?.[0] || accentColor;
  const instagram = cartaoContacts?.instagram || '';
  const storyTemplates = getStoryTemplates(dictionary);
  const tmplIdx = storyTemplateIdx ?? 0;
  const tmpl = storyTemplates[tmplIdx] || storyTemplates[0];
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
        {storyTemplates.map((t, i) => (
          <button key={t.id} onClick={() => setStoryTemplateIdx && setStoryTemplateIdx(i)} style={{ padding: '4px 10px', borderRadius: '12px', border: `1px solid ${tmplIdx === i ? solidColor : '#ddd'}`, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '10px', fontWeight: 600, background: tmplIdx === i ? solidColor + '15' : 'transparent', color: tmplIdx === i ? solidColor : '#999', transition: 'all 0.2s' }}>
            {t.titulo}
          </button>
        ))}
      </div>

      <div id="insta-bg-preview" data-insta-preview style={{ width: `${fmt.pw}px`, height: `${fmt.ph}px`, position: 'relative', boxShadow: '0 4px 60px rgba(0,0,0,0.15)', borderRadius: fmt.id === 'story' ? '24px' : '12px', overflow: 'hidden', background: '#fff', transition: 'width 0.3s, height 0.3s' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
           {effectiveSrc && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 1.5}px`, backgroundRepeat: 'repeat', opacity: 0.32 }} />}
           <div style={{ position: 'absolute', inset: 0, background: !effectiveSrc ? `${solidColor}10` : 'transparent' }} />
        </div>
        <div style={{ position: 'absolute', top: fmt.id === 'post' ? '18px' : '30px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
           <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={fmt.logoSF} crm={crmLine} maxWidth="150px" maxHeight="45px" />
        </div>
        <div style={{ position: 'absolute', top: fmt.titleTop, left: '0', right: '0', textAlign: 'center', zIndex: 3 }}>
           <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: fmt.titleSize, fontWeight: 900, color: '#000000', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.9 }}>{tmpl.titulo}</div>
           <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: fmt.subSize, fontWeight: 500, color: '#000000', opacity: 0.7, marginTop: '2px' }}>{tmpl.subtitulo}</div>
        </div>
        <div style={{ position: 'absolute', top: fmt.boxTop, left: '20px', right: '20px', height: fmt.boxH, border: '1.5px dashed rgba(0,0,0,0.22)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', zIndex: 2 }}>
           <div data-html2canvas-ignore style={{ fontSize: '7px', color: 'rgba(0,0,0,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary?.insta_pack?.question_box_placeholder || 'ESPAÇO PARA A CAIXINHA DE PERGUNTAS'}</div>
        </div>
        <div style={{ position: 'absolute', bottom: fmt.footerBottom, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 3 }}>
           {instagram && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg viewBox="0 0 24 24" width="8" height="8" fill="#000000" style={{ opacity: 0.85 }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <div style={{ fontSize: '7px', fontWeight: 800, color: '#000000', opacity: 0.85 }}>@{instagram}</div>
             </div>
           )}
           <div style={{ fontSize: '5px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{clinicaNome}</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>{fmt.rw} × {fmt.rh}px</div>
    </div>
  );
}

function AssinaturaEmailPreview({ brand, editData, accentColor, logoColor, logoLayout, cartaoContacts, crmLine, localSlogan, clinicaNome, setCartaoContacts, setClinicaNome, setLocalSlogan }) {
  const { dictionary } = useTranslation();
  const { whatsapp, telefone, email, site, instagram } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const [copied, setCopied] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);

  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setScale(prev => {
        const next = Math.min(1, w / 450);
        return Math.abs(prev - next) < 0.001 ? prev : next;
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      {/* Container de Escala Responsivo para prevenir corte em telas mobile */}
      <div ref={wrapRef} style={{ width: '100%', maxWidth: '450px', height: `${140 * scale}px`, overflow: 'hidden', position: 'relative', borderRadius: '8px' }}>
        <div data-assinatura-preview style={{ 
          width: '450px', height: '140px', background: '#fff', 
          borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
          padding: '20px', display: 'flex', alignItems: 'center', gap: '25px', 
          position: 'absolute', top: 0, left: 0,
          transform: `scale(${scale})`, transformOrigin: 'top left',
          overflow: 'hidden' 
        }}>
           <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: `${accentColor}10`, borderRadius: '0 0 0 40px' }} />
           <div style={{ width: '150px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoPreviewHTML editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.72} hideTagline maxWidth="150px" maxHeight="90px" />
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
      </div>
      
      <button
        data-assinatura-copy
        onClick={copyToClipboard}
        style={{ display: 'none' }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d={copied ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" : "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"}/>
        </svg>
        {copied ? (dictionary?.ui?.copiado || 'Copiado!') : (dictionary?.ui?.copiar_assinatura_html || 'Copiar Assinatura HTML')}
      </button>
      
      <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'left', background: '#f8f9fa', padding: '12px 16px', borderRadius: '12px', marginTop: '12px', border: '1px solid #eee' }}>
        <div style={{ fontWeight: 700, marginBottom: '8px', color: '#333', fontSize: '0.8rem' }}>{dictionary?.digital_tab?.how_to_install || 'Como instalar no seu E-mail?'}</div>
        <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li dangerouslySetInnerHTML={{ __html: dictionary?.digital_tab?.install_step_1 || 'Clique no botão <b>Copiar HTML</b> (nós já formatamos tudo para você).' }}></li>
          <li dangerouslySetInnerHTML={{ __html: dictionary?.digital_tab?.install_step_2 || 'Abra as configurações do seu Gmail, Outlook ou Apple Mail.' }}></li>
          <li dangerouslySetInnerHTML={{ __html: dictionary?.digital_tab?.install_step_3 || 'Procure pela seção de <b>Assinatura</b> e crie uma nova.' }}></li>
          <li dangerouslySetInnerHTML={{ __html: dictionary?.digital_tab?.install_step_4 || 'Clique na caixa de texto em branco e <b>Cole (Ctrl+V ou Cmd+V)</b>. Pronto, a arte vai aparecer lá dentro magicamente! ✨' }}></li>
        </ol>
      </div>
      {(setCartaoContacts && setClinicaNome && setLocalSlogan) && (
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: '450px', background: '#fcfcfc', marginTop: '10px' }}>
          <button onClick={() => setContactOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', outline: 'none' }}>
            <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#555' }}>{dictionary?.ui?.editar_dados || 'Editar dados'}</span>
            <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{contactOpen ? '▲' : '▼'}</span>
          </button>
          {contactOpen && (
            <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>Tagline</span>
                <input
                  value={localSlogan}
                  onChange={e => setLocalSlogan(e.target.value.slice(0, 45))}
                  maxLength={45}
                  placeholder={dictionary?.ui?.tagline_placeholder || "Tagline / Especialidade"}
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', fontFamily: 'Montserrat, sans-serif' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>{dictionary?.ui?.company || 'Empresa'}</span>
                <input
                  value={clinicaNome}
                  onChange={e => setClinicaNome(e.target.value)}
                  placeholder={dictionary?.ui?.company_placeholder || "Nome complementar (opcional)"}
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', fontFamily: 'Montserrat, sans-serif' }}
                />
              </div>
              {[
                { key: 'telefone', label: dictionary?.ui?.phone || 'Telefone' },
                { key: 'whatsapp', label: 'WhatsApp' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'email', label: 'E-mail' },
                { key: 'site', label: dictionary?.ui?.website || 'Site' },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>{label}</span>
                  <input
                    value={cartaoContacts[key] || ''}
                    onChange={e => setCartaoContacts(c => ({ ...c, [key]: e.target.value }))}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', fontFamily: 'Montserrat, sans-serif' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EnvelopeSacoPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const { dictionary } = useTranslation();
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
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary?.geral?.frente || 'Frente'}</span>
          <div style={{ width: '220px', height: '300px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: abaColor, opacity: 0.9, zIndex: 5 }} />
            {/* Etiqueta com logo — centralizada na área abaixo da aba */}
            <div style={{ position: 'absolute', top: '172px', left: '50%', transform: 'translate(-50%, -50%)', padding: '12px 16px', background: 'rgba(255,255,255,0.93)', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '160px', height: '100px' }}>
              <LogoPreviewHTML item="Envelope Saco" editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.80} crm={crmLine} withBackground={false} maxWidth="100%" maxHeight="100%" />
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary?.geral?.verso || 'Verso'}</span>
          <div style={{ width: '220px', height: '300px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: abaColor, zIndex: 5 }} />
            
            {/* Etiqueta discreta — igual ao Envelope Ofício */}
            {!!(clinicaNome || endereco || mainPhone || email || site || instagram) ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvelopeOficioPreview({ brand, editData, accentColor, patternSrc, logoColor, logoLayout, comBorda, setComBorda, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, cartaoContacts, crmLine, localSlogan, clinicaNome }) {
  const { dictionary } = useTranslation();
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
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary?.geral?.frente || 'Frente'}</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba sólida no preview frontal */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: abaColor, opacity: 0.9, zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '10px', width: '110px', height: '50px', zIndex: 10, borderRadius: '3px' }}>
              {/* Camada branca separada */}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', opacity: 0.93, borderRadius: '3px' }} />
              <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px 6px' }}>
                <LogoPreviewHTML item="Envelope Ofício" editData={{ ...editData, tagline: localSlogan }} color={logoColor} layout={logoLayout} scaleFactor={0.65} crm={crmLine} withBackground={false} maxWidth="100%" maxHeight="100%" />
              </div>
            </div>
          </div>
        </div>

        {/* VERSO (com aba e estampa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary?.geral?.verso || 'Verso'}</span>
          <div style={{ width: '310px', height: '160px', position: 'relative', backgroundColor: comBorda && patternSrc ? 'transparent' : '#fff', backgroundImage: comBorda && patternSrc ? `url(${patternSrc})` : 'none', backgroundSize: `${(patternScale || 150) / 4}px`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Aba superior simulada */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35px', background: abaColor, zIndex: 5 }} />
            
            {/* Etiqueta discreta — largura automática */}
            {!!(clinicaNome || endereco || allPhones || email || site || instagram) ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CadernoPreview({ editData, accentColor, solidColor, logoColor, logoLayout, comBorda, setComBorda, patternSrc, paletteColors, borderColor, setBorderColor, patternScale, setPatternScale, hideTagline, paperSize, setPaperSize, cartaoContacts, clinicaNome }) {
  const { dictionary } = useTranslation();
  const scaleCaderno = useScaleToFit(480, 310 + 36);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      
      {setPaperSize && (
        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '20px', padding: '3px' }}>
          {['a5', 'a4'].map(s => {
            const label = s === 'a5' ? '17 × 24 cm' : '21 × 28 cm';
            return (
              <button key={s} onClick={() => setPaperSize(s)} style={{ padding: '3px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: paperSize === s ? accentColor : 'transparent', color: paperSize === s ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {label}
              </button>
            )
          })}
        </div>
      )}

      <p style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.papelaria_itens?.capa_contra_capa || 'Capa e Contra-capa'}</p>
      
      <div ref={scaleCaderno.wrapperRef} style={scaleCaderno.wrapperStyle}>
        <div style={scaleCaderno.innerStyle}>
          <div style={{ width: '480px', height: '310px', position: 'relative', background: '#f5f5f5', borderRadius: '4px', boxShadow: '0 15px 45px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            
            {/* Camada de Fundo (Pega os dois lados) */}
            {comBorda && patternSrc ? (
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: patternScale ? `${patternScale * 0.65}px` : '100%', opacity: 0.9 }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: borderColor || paletteColors?.[0] || accentColor }} />
            )}

            {/* FRENTE (Esquerda) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '240px', height: '310px' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '75%', height: '110px', display:'flex', justifyContent:'center', alignItems: 'center', zIndex: 1 }}>
                <LogoPreviewHTML item="Caderno" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.80} hideTagline={hideTagline} withBackground={comBorda} maxWidth="100%" maxHeight="100%" />
              </div>
            </div>

            {/* Espiral (Centro simulando wire-o) */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '235px', width: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', zIndex: 10 }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{ width: '10px', height: '5px', background: '#222', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }} />
              ))}
            </div>

            {/* VERSO (Direita) - Dados de contato */}
            <div style={{ position: 'absolute', top: 0, left: '240px', width: '240px', height: '310px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '18px', gap: '3px' }}>
              {(() => {
                const { whatsapp, telefone, telefone2, email, instagram, site, endereco } = cartaoContacts || {};
                const phones = [whatsapp, telefone, telefone2].filter(Boolean).join('  ·  ');
                const line2 = [instagram ? `@${instagram}` : '', email, site, endereco].filter(Boolean).join('  ·  ');
                const textStyle = { fontFamily: "'Montserrat',sans-serif", fontSize: '5px', color: logoColor || '#fff', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', opacity: 0.85 };
                return (
                  <>
                    {(clinicaNome || phones) && <div style={textStyle}>{[clinicaNome, phones].filter(Boolean).join('  ·  ')}</div>}
                    {line2 && <div style={{ ...textStyle, opacity: 0.65 }}>{line2}</div>}
                  </>
                );
              })()}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function PastaPreview({ brand, editData, accentColor, solidColor, logoColor, logoLayout, isSaude, crmData, comBorda, setComBorda, patternSrc, cartaoContacts, crmLine, paletteColors, borderColor, setBorderColor, patternScale, setBorderColorState, patternScaleState, setPatternScaleState, setPatternScale, hideTagline, folderRoof, setFolderRoof, clinicaNome: clinicaNomeProp }) {
  const { dictionary } = useTranslation();
  const brandFont = editData?.fontFamily || 'Playfair Display';
  const marca = editData?.marca || '';
  const clinicaNome = clinicaNomeProp || cartaoContacts?.clinica || '';
  const { endereco, instagram, site, whatsapp, telefone, telefone2 } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const allPhones = [mainPhone, telefone2].filter(Boolean).join(' / ');
  const hasPastaContacts = !!(clinicaNome || endereco || whatsapp || telefone || telefone2 || site || instagram);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setFolderRoof && (
        <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
          {folderRoof ? (dictionary?.geral?.recorte_casinha || '🏠 Recorte Casinha ATIVO') : (dictionary?.geral?.recorte_reto || '⬜️ Recorte Reto ATIVO')}
        </button>
      )}

      <p style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>{dictionary?.pasta_a4?.preview || 'Preview da Pasta (Frente e Verso)'}</p>
      
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
            <LogoPreviewHTML item="Pasta" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.80} hideTagline={hideTagline} withBackground={false} maxWidth="100%" maxHeight="100%" />
          </div>
        </div>

        {/* Linha de Dobra Central */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '240px', width: '0', borderLeft: '1px dashed rgba(0,0,0,0.1)', zIndex: 10 }} />

        {/* Capa Direita (VERSO no preview) */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '240px', height: '310px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
             {hasPastaContacts ? (
               <div style={{
                 background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(5px)',
                 margin: '0 10px 18px', padding: '6px 12px', borderRadius: '1.5px',
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                 border: '0.1mm solid rgba(0,0,0,0.05)'
               }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', width: '45%', height: '100%', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <LogoPreviewHTML item="Pasta" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.35} crm={crmLine} hideTagline={hideTagline} alignLeft={true} withBackground={false} maxWidth="100%" maxHeight="100%" />
                  </div>
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', fontSize: '3.8px', color: '#555', 
                    fontFamily: 'Montserrat, sans-serif', lineHeight: 1.5, textAlign: 'right', flex: 1
                  }}>
                    {clinicaNome && (
                      <div style={{ fontFamily: brandFont, fontSize: '6px', color: accentColor, fontWeight: 700, letterSpacing: '0.3px', marginBottom: '1px' }}>{clinicaNome}</div>
                    )}
                    {endereco && <div style={{ opacity: 0.8 }}>{endereco}</div>}
                    {allPhones && <div style={{ fontWeight: 600 }}>{allPhones}</div>}
                    <div style={{ opacity: 0.8 }}>{[site, instagram ? `@${instagram}` : ''].filter(Boolean).join(' · ')}</div>
                  </div>
               </div>
             ) : null}
        </div>

        <div style={{ position: 'absolute', top: 30, bottom: 30, left: '240px', width: '1px', background: 'rgba(255,255,255,0.3)', zIndex: 5 }} />
      </div>

      <div style={{ width: '100%', maxWidth: '480px', padding: '15px', background: `${accentColor}08`, borderRadius: '8px', border: `1px solid ${accentColor}20` }}>
        <p style={{ fontSize: '0.8rem', color: accentColor, fontWeight: 600, marginBottom: '5px' }}>{dictionary?.pasta_a4?.detalhamento || 'Detalhamento'}</p>
        <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.5 }}>
          {dictionary?.pasta_a4?.detalhamento_desc || 'A etiqueta foi afinada e os elementos (Logo, Clínica e CRM) agora estão harmoniosamente centralizados. O PDF final reflete esta atualização de alta fidelidade.'}
        </p>
      </div>
    </div>
  );
}

function UniversalPreviewScaler({ children, targetWidth = 595 }) {
  const wrapRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState('auto');

  React.useEffect(() => {
    const el = wrapRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const update = () => {
      const parentW = el.clientWidth || el.getBoundingClientRect().width;
      if (parentW > 0 && parentW < targetWidth) {
        const s = parentW / targetWidth;
        setScale(prev => Math.abs(prev - s) < 0.001 ? prev : s);
        const origH = content.offsetHeight || content.scrollHeight || 300;
        setHeight(prev => {
          const nextH = `${Math.round(origH * s)}px`;
          return prev === nextH ? prev : nextH;
        });
      } else {
        setScale(prev => prev === 1 ? prev : 1);
        setHeight(prev => prev === 'auto' ? prev : 'auto');
      }
    };

    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    obs.observe(content);
    return () => obs.disconnect();
  }, [targetWidth]);

  return (
    <div ref={wrapRef} style={{ width: '100%', height, overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <div ref={contentRef} style={{
        width: `${targetWidth}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        height: 'fit-content'
      }}>
        {children}
      </div>
    </div>
  );
}

const getPreviewTargetWidth = (item) => {
  if (!item) return 595;
  if (item.includes('Envelope Ofício')) return 640;
  if (item.includes('Envelope Saco')) return 460;
  if (item.includes('Pasta')) return 480;
  if (item.includes('Assinatura de E-mail')) return 450;
  if (item === 'Caneca' || item === 'Arte para Caneca') return 320;
  if (item === 'Papel de Presente') return 480;
  if (item === 'Tag para Sacola') return 320;
  if (item === 'Etiqueta para Correios') return 350;
  return 595; // Default para folders A4, receituários, diários, Meu Pratinho, etc.
};

function PapelariaStep({ brand, accentColor, paletteColors, estampaPatterns, estampaSelectedIdx, cartaoContacts, setCartaoContacts, plano, isSaude, crmData, setCrmData, marca, editData, logoColor, logoLayout, setLayout, clinicaNome, setClinicaNome, onNavSync, navIdx, setNavIdx, customLogoSrc, getCustomLogoScale, setCustomLogoScale, getCustomLogoScaleMax, customLogoScaleMap, submarcaColor, submarcaTextColor, iconPath, avulsoParam }) {
  const { dictionary, lang } = useTranslation();
  // Digitais: sempre inclusos no plano PRO
  const ITENS_DIGITAIS = []; // Pack Instagram e Assinatura ficam na aba Digital, não na Papelaria
  // Papelaria disponível para não-médicos
  const PAPELARIA_GERAL = [
    "Cartão de Visita", "Papel Timbrado", "Tag para Sacola",
    "Etiqueta para Correios", "Envelope Ofício (23x11,5cm)", "Envelope Saco (24x34cm)", "Recibo",
    "Pasta A4", "Caneca", "Cartão de Retorno", "Cartão de Agradecimento (10x15cm)", "Caderno (Capa e Contra-capa)"
  ];
  // Papelaria exclusiva para área médica
  const PAPELARIA_MEDICA = [
    "Receituário Padrão (A4 e A5)", "Atestado Médico (A4 e A5)",
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
  const TODOS_DISPONIVEIS = [...PAPELARIA_GERAL, ...(isSaude ? PAPELARIA_MEDICA : []), ...(isSaude ? DIGITAIS_MEDICOS : [])];
  // Normaliza nomes legados para compatibilidade com dados salvos anteriormente
  const LEGACY_NAMES = {
    'Pasta A4 Exclusiva': 'Pasta A4',
    'Papel Timbrado': 'Papel Timbrado', // Fix: keep full name to match PAPELARIA_GERAL!
    'Arte para Caneca/Brindes': 'Caneca',
    'Arte para Caneca': 'Caneca',
    'Recibo Comercial': 'Recibo', // Map to general Recibo
    'Cartão de Retorno/Fidelidade': 'Cartão de Retorno', // Map to general Cartão de Retorno
    'Cartão de Agradecimento (10x15cm)': 'Cartão de Agradecimento (10x15cm)',
    'Dicas de Introdução Alimentar': 'Guia Alimentar',
    'Orientação Pré-Natal': 'Guia de Cuidados',
    'Cartão de Exames': 'Cartão de Exame Pré-Natal',
    'Cartão de Exames Pré-Natal': 'Cartão de Exame Pré-Natal',
    'Quadro de Incentivo': 'Certificado de Coragem',
    'Card de Orientação de Sono': 'Guia do Sono',
  };
  const papelariaNorm = papelariaSelecionada.map(n => LEGACY_NAMES[n] || n);
  // Para médicos: PAPELARIA_GERAL sempre inclusa + itens comprados. Para não-médicos: só o que comprou.
  const _autoInclusos = (isSaude && plano !== 'avulso') ? PAPELARIA_GERAL : [];
  const ownedItems = papelariaNorm.length > 0
    ? TODOS_DISPONIVEIS.filter(i => papelariaNorm.includes(i) || _autoInclusos.includes(i))
    : _autoInclusos.length > 0 ? TODOS_DISPONIVEIS.filter(i => _autoInclusos.includes(i)) : [];
  const itens = [...TODOS_DISPONIVEIS].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (onNavSync) onNavSync(itens); }, [itens.join(',')]);
   const [idxLocal, setIdxLocal] = useState(0);
  const idx = (navIdx !== undefined && setNavIdx) ? navIdx : idxLocal;
  const setIdx = (setNavIdx && onNavSync) ? setNavIdx : setIdxLocal;
  const [comBorda, setComBordaState] = useState(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}');
      return cur.comBorda !== undefined ? cur.comBorda : true;
    } catch {
      return true;
    }
  });
  const [patternScale, setPatternScaleState] = useState(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}');
      return cur.patternScale !== undefined ? cur.patternScale : 320; // Default aumentado para 320
    } catch {
      return 320;
    }
  });
  const [borderColor, setBorderColorState] = useState(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('brandbox_papelaria') || '{}');
      return cur.borderColor || accentColor;
    } catch {
      return accentColor;
    }
  });
  const [localSlogan, setLocalSlogan] = useState(editData?.tagline || '');
  const [folderRoof, setFolderRoof] = useState(() => brand?.niche?.toLowerCase()?.includes('pedi'));
  const [paperSize, setPaperSize] = useState('a5'); // 'a5' | 'a4'
  const [atestadoModelo, setAtestadoModelo] = useState(1); // 1 | 2
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
  const [agradecimentoSizeIdx, setAgradecimentoSizeIdx] = useState(0);
  const [agradecimentoMsgIdx, setAgradecimentoMsgIdx] = useState(0);

  // Estado editável do Guia Alimentar
  const [guiaHorarios, setGuiaHorarios] = useState(dictionary?.guia_alimentar?.horarios || [
    { label: 'CAFÉ DA MANHÃ', val: 'Leite materno ou fórmula infantil' },
    { label: 'LANCHE DA MANHÃ', val: 'Fruta / leite materno ou fórmula' },
    { label: 'ALMOÇO', val: 'Cereal ou tubérculo + proteína animal + leguminosa + hortaliças (verduras +legumes) + fruta' },
    { label: 'LANCHE DA TARDE', val: 'Fruta /leite materno ou fórmula' },
    { label: 'JANTAR', val: 'Igual almoço' },
    { label: 'LANCHE DA NOITE', val: 'Leite materno ou fórmula infantil' }
  ]);
  const [guiaIntroducao, setGuiaIntroducao] = useState(dictionary?.guia_alimentar?.introducao || [
    { idade: 'A partir de 6 meses', text: 'Alimentos amassados', qty: 'Iniciar com 2 a 3 colheres de sopa e aumentar a quantidade conforme aceitação' },
    { idade: 'A partir dos 7 meses', text: 'Alimentos amassados', qty: '2/3 de uma xícara ou tigela de 250 ml' },
    { idade: '9 a 11 meses', text: 'Alimentos cortados ou levemente amassados', qty: '3/4 de uma xícara ou tigela de 250 ml' },
    { idade: '12 a 24 meses', text: 'Alimentos cortados', qty: 'Uma xícara ou tigela de 250 ml' }
  ]);

  useEffect(() => {
    if (dictionary?.guia_alimentar?.horarios) {
      setGuiaHorarios(dictionary.guia_alimentar.horarios);
    }
    if (dictionary?.guia_alimentar?.introducao) {
      setGuiaIntroducao(dictionary.guia_alimentar.introducao);
    }
  }, [dictionary]);

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
  const [showUpsell, setShowUpsell] = React.useState(false);

  const isProPlan = plano === 'pro' || plano === 'complete';

  const handleAvulsoCheckout = async (itemName) => {
      setUpsellLoading(true);
      try {
        let delivery = {};
        try { delivery = JSON.parse(localStorage.getItem('brandbox_delivery') || '{}'); } catch {}
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plano: 'avulso',
            marca: delivery.formData?.marca || delivery.editData?.marca || brand?.editData?.marca || '',
            email: delivery.formData?.email || brand?.formData?.email || '',
            sessionId: '',
            avulsoParam,
            itensSelecionados: [itemName],
          }),
        });
        let data;
        try { data = await res.json(); } catch { data = {}; }
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Erro ao iniciar pagamento: ' + (data.error || `status ${res.status}`));
        }
      } catch (e) {
        console.error('handleAvulsoCheckout error:', e);
        alert('Erro de conexão: ' + (e?.message || e));
      } finally {
        setUpsellLoading(false);
      }
  };

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
        // Se for avulso, não muda pra pro ainda, espera o Stripe retornar
        if (plano !== 'avulso') {
           localStorage.setItem('brandbox_plano', 'pro');
        }
        localStorage.setItem('brandbox_pending_upsell', JSON.stringify(upsellSelecionados));
        
        // Se estiver no plano avulso, o checkout do upsell deve cobrar o item principal TAMBÉM
        const itensParaCobrar = plano === 'avulso' 
           ? [...new Set([...upsellSelecionados, ...brand.papelariaSelecionada])]
           : upsellSelecionados;

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plano: 'avulso',
            marca: delivery.formData?.marca || delivery.editData?.marca || brand?.editData?.marca || '',
            email: delivery.formData?.email || brand?.formData?.email || '',
            sessionId,
            avulsoParam,
            itensSelecionados: itensParaCobrar,
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



  const currentIdx = estampaSelectedIdx || 0;
  const currentItem = itens[Math.min(idx, itens.length - 1)];
  // editData com scale correto para o item atual (sobrescreve customLogoScale)
  // Inclui customLogoScale só se o usuário mudou o valor (diferente do default)
  const _rawScale = customLogoScaleMap?.[currentItem]; // undefined se nunca tocou
  const itemEditData = (_rawScale !== undefined && getCustomLogoScale)
    ? { ...editData, customLogoScale: customLogoSrc
        ? getCustomLogoScale(currentItem) * (ITEM_CUSTOM_BASE_SCALES[currentItem] || 1)
        : getCustomLogoScale(currentItem) }
    : editData;
  const patternSrc = estampaPatterns?.[currentIdx]
    ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
    : null;
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
    'Arte para Caneca': '20x8cm', 'Caneca': '20x8cm',
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
    if (item === 'Caderneta de Saúde') {
      try {
        const response = await fetch('/api/generate-caderneta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logoSrc: editData?.customLogoSrc || null,
            clinicaNome: clinicaNome || brand?.clinicaNome || '',
            slogan: localSlogan || brand?.editData?.tagline || '',
            crmLine: isSaude && crmData?.crm ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}${crmData.rqe?.length > 0 ? ' · RQE ' + crmData.rqe.filter(Boolean).join(' / RQE ') : ''}` : null,
            accentColor: paletteColors?.[0] || accentColor,
            secondaryColor: paletteColors?.[1] || accentColor,
            address: cartaoContacts?.endereco || '',
            phone: [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · '),
            instagram: cartaoContacts?.instagram || '',
            email: brand?.email || '',
            site: cartaoContacts?.site || ''
          })
        });
        if (!response.ok) throw new Error('Erro ao gerar caderneta no servidor.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Caderneta_de_Saude_${(clinicaNome || 'Personalizada').replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert(err.message);
      }
      return;
    }

    const patternSrc = estampaPatterns?.[currentIdx]
      ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
      : null;

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
    const _globalBoost = (['Receituário', 'Recibo', 'Ficha', 'Prontuário', 'Certificado', 'Atestado'].some(n => item.includes(n)) || _isA4Global) ? 1.0 : 1.0;
    const _logoWidthMmGlobal = 100; // padronizado: A4 e A5 usam mesma caixa de logo
    
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
      customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100,
      maxWidth: `${_logoWidthMmGlobal}mm`,
      maxHeight: '36mm'
    });
    const logoHtml = logoHtmlWithCrm;

    // Determinar componentes
    const isDev = item.includes('Desenvolvimento');
    const isVacina = item.includes('Vacina');
    const isSono = item.includes('Sono');
    const isCuidados = item.includes('Cuidados');
    const Art2 = isVacina ? FolderVacinaPage2 : (isDev ? FolderDevPage2 : (isSono ? FolderSonoPage2 : (isCuidados ? FolderCuidadosPage2 : FolderPage2Art)));
    const Art3 = isVacina ? FolderVacinaPage3 : (isDev ? FolderDevPage3 : (isSono ? FolderSonoPage3 : (isCuidados ? FolderCuidadosPage3 : FolderPage3Art)));
    const Art4 = isVacina ? FolderVacinaPage4 : (isDev ? FolderDevPage4 : (isSono ? FolderSonoPage4 : (isCuidados ? FolderCuidadosPage4 : (item === 'Guia Alimentar' ? FolderPage4Dynamic : FolderPage4Art))));
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
        const yearLabels = dictionary?.graficos_crescimento?.yearLabels || ['Nasc.', '1 ano', '2 anos', '3 anos', '4 anos', '5 anos'];
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
        const gLabel = gender === 'menina' ? (dictionary?.graficos_crescimento?.menina?.toUpperCase() || 'MENINA') : (dictionary?.graficos_crescimento?.menino?.toUpperCase() || 'MENINO');
        const faceLabel = face === 'frente' ? `${dictionary?.graficos_crescimento?.imc || 'IMC'} · ${dictionary?.graficos_crescimento?.perimetro_cefalico || 'Perímetro Cefálico'}` : `${dictionary?.graficos_crescimento?.peso || 'Peso'} · ${dictionary?.graficos_crescimento?.altura || 'Altura'}`;
        const fieldLine = (lbl, w='40mm') => `<div style="display:flex;align-items:flex-end;gap:2mm;"><span style="font-size:7pt;font-weight:700;color:rgba(255,255,255,0.75);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.3pt;white-space:nowrap;">${lbl}:</span><div style="border-bottom:0.3mm solid rgba(255,255,255,0.5);width:${w};height:4.5mm;"></div></div>`;
        const chart1 = face === 'frente'
          ? renderChartSVG(d.imc, MONTHS, 10, 22, 1, dictionary?.graficos_crescimento?.imc_label || 'IMC', dictionary?.graficos_crescimento?.imc_por_idade || 'IMC por Idade', gColor)
          : renderChartSVG(d.peso, MONTHS, 0, 30, 2, dictionary?.graficos_crescimento?.peso_label || 'Peso (kg)', dictionary?.graficos_crescimento?.peso_por_idade || 'Peso por Idade', gColor);
        const chart2 = face === 'frente'
          ? renderChartSVG(d.pc, PC_MONTHS, 30, 58, 2, dictionary?.graficos_crescimento?.pc_label || 'PC (cm)', dictionary?.graficos_crescimento?.perimetro_cefalico || 'Perímetro Cefálico', gColor)
          : renderChartSVG(d.altura, MONTHS, 40, 130, 5, dictionary?.graficos_crescimento?.altura_label || 'Altura (cm)', dictionary?.graficos_crescimento?.altura_por_idade || 'Altura por Idade', gColor);

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
                <div style="font-size:8pt;font-weight:600;color:rgba(255,255,255,0.8);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.5pt;margin-bottom:1.5mm;">${dictionary?.graficos_crescimento?.titulo || 'Gráfico de Crescimento'} — ${faceLabel}</div>
                <div style="font-size:26pt;font-weight:900;color:#fff;font-family:'Montserrat',sans-serif;letter-spacing:2pt;line-height:1;">${gLabel}</div>
                <div style="font-size:6pt;color:rgba(255,255,255,0.6);font-family:'Montserrat',sans-serif;margin-top:1.5mm;">${dictionary?.graficos_crescimento?.fonte || 'Fonte: OMS — WHO Child Growth Standards 2006 · SBP'}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11pt;font-weight:900;color:#fff;font-family:'Montserrat',sans-serif;line-height:1.2;">${clinicaNome || marca}</div>
                ${crmLine ? `<div style="font-size:7pt;color:rgba(255,255,255,0.7);font-family:'Montserrat',sans-serif;">${crmLine}</div>` : ''}
                ${mainPhone ? `<div style="font-size:7pt;color:rgba(255,255,255,0.65);font-family:'Montserrat',sans-serif;">${mainPhone}</div>` : ''}
              </div>
            </div>
            <!-- Linha de dobra + campos -->
            <div style="border-top:0.4mm dashed rgba(255,255,255,0.4);padding-top:4mm;">
              <div style="font-size:7pt;font-weight:700;color:rgba(255,255,255,0.65);font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.5pt;margin-bottom:3mm;">${dictionary?.graficos_crescimento?.dados_consulta || '✎ Dados da consulta'}</div>
              <div style="display:flex;gap:6mm;flex-wrap:wrap;margin-bottom:3mm;">
                ${fieldLine(dictionary?.graficos_crescimento?.paciente || 'Paciente', '60mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.idade || 'Idade', '22mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.data || 'Data', '30mm')}
              </div>
              <div style="display:flex;gap:6mm;flex-wrap:wrap;">
                ${fieldLine(dictionary?.graficos_crescimento?.peso || 'Peso', '20mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.altura || 'Altura', '20mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.pc || 'PC', '20mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.imc || 'IMC', '20mm')}
                ${fieldLine(dictionary?.graficos_crescimento?.percentil || 'Percentil', '28mm')}
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
      const isEn = lang === 'en';
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
      const logoHtmlRN = genPDFLogoHtml({ brand, editDataOverride: editData, color: '#fff', localSlogan, crmLine, fontPt: 24, lineH: 1.1, letterSp: editData?.fontLetterSpacing || brand.editData?.fontLetterSpacing || '0.5pt', layout: logoLayout, hideSlogan: true, crmSize: '0', customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: false });

      const rnTitle = dictionary?.orientacoes_rn?.titulo || 'OS PRIMEIROS DIAS\nCOM MEU BEBÊ';

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${rnTitle.replace('\n', ' ')} - ${marca}</title>${fiRN}
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
    <div style="background:${solidColor};padding:6mm 10mm;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
      <div style="font-size:14pt;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.5pt;line-height:1.2;">${rnTitle.replace('\n', '<br/>')}</div>
      <div style="width:65mm;display:flex;align-items:center;justify-content:center;">${logoHtmlRN}</div>
    </div>

    <!-- FAIXA BEBÊ -->
    <div style="background:${solidColor}12;border-bottom:0.3mm solid ${solidColor}30;padding:3.5mm 10mm;display:flex;gap:8mm;align-items:center;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:2mm;flex:2;"><span style="font-size:8pt;font-weight:700;color:${solidColor};white-space:nowrap;">${dictionary?.orientacoes_rn?.bebe || 'Bebê:'}</span> ${f(rnNomeBebe, isEn ? 'baby name' : 'nome do bebê')}</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${solidColor};white-space:nowrap;">${dictionary?.orientacoes_rn?.nasc || 'Nasc:'}</span> ${f(rnDataNasc, isEn ? 'mm/dd/yyyy' : '__/__/____')}</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${solidColor};">${dictionary?.orientacoes_rn?.peso || 'Peso:'}</span> ${f(rnPeso,'___')} kg</div>
      <div style="display:flex;align-items:center;gap:2mm;"><span style="font-size:8pt;font-weight:700;color:${solidColor};">${dictionary?.orientacoes_rn?.alt || 'Alt:'}</span> ${f(rnAltura,'___')} cm</div>
    </div>

    <!-- CORPO -->
    <div style="flex:1;display:flex;overflow:hidden;align-items:center;">
      <div style="flex:0 0 47%;padding:8mm 5mm 6mm 10mm;border-right:0.3mm solid ${c0rn}20;display:flex;flex-direction:column;justify-content:center;">
        ${sec(dictionary?.orientacoes_rn?.alimentacao_label || 'Alimentação:', c0rn, dictionary?.orientacoes_rn?.alimentacao_text || 'Aleitamento materno sob livre demanda (à vontade).')}
        ${sec(dictionary?.orientacoes_rn?.umbigo_label || 'Umbigo:', c1rn, `${dictionary?.orientacoes_rn?.umbigo_text_pre || 'Limpeza com '}${f(rnUmbigo, dictionary?.orientacoes_rn?.umbigo || 'álcool 70%')}${dictionary?.orientacoes_rn?.umbigo_text_pos || ' a cada troca de fralda e após o banho.'}`)}
        ${sec(dictionary?.orientacoes_rn?.ictericia_label || 'Icterícia:', c2rn, dictionary?.orientacoes_rn?.ictericia_text || 'Pele amarelada? Procure o pediatra imediatamente.')}
        ${sec(dictionary?.orientacoes_rn?.febre_label || 'Febre:', c3rn, dictionary?.orientacoes_rn?.febre_text || 'Menores de 3 meses: emergência. Maiores de 3 meses: siga as orientações médicas.')}
        ${sec(dictionary?.orientacoes_rn?.higiene_label || 'Higiene:', c0rn, dictionary?.orientacoes_rn?.higiene_text || '1 banho/dia com sabonete neutro. Sem talco ou perfume. Trocas com água morna e algodão.')}
      </div>
      <div style="flex:1;padding:8mm 10mm 6mm 5mm;display:flex;flex-direction:column;justify-content:center;">
        ${sec(dictionary?.orientacoes_rn?.nariz_label || 'Nariz:', c1rn, `${dictionary?.orientacoes_rn?.nariz_text_pre || 'Spray de soro 0,9% ('}${f(rnSoro, dictionary?.orientacoes_rn?.soro || 'Rinosoro ou Salsep')}${dictionary?.orientacoes_rn?.nariz_text_pos || ') antes de cada mamada.'}`)}
        ${sec(dictionary?.orientacoes_rn?.colicas_label || 'Cólicas:', c2rn, `${dictionary?.orientacoes_rn?.colicas_text_pre || 'Compressa morna. Se necessário: '}${f(rnMed1, dictionary?.orientacoes_rn?.med1 || 'Luftal')} ${f(rnDose1,'__')}${dictionary?.orientacoes_rn?.colicas_text_mid || ' gotas se cólica de '}${f(rnInt1, dictionary?.orientacoes_rn?.int1 || '8/8h')}. ${isEn ? 'Without improvement: ' : 'Sem melhora: '}${f(rnMed2, dictionary?.orientacoes_rn?.med2 || 'Tylenol baby')} ${f(rnDose2,'__')}${dictionary?.orientacoes_rn?.colicas_text_mid2 || ' gotas se cólica de '}${f(rnInt2, dictionary?.orientacoes_rn?.int2 || '6/6h')}.`)}
        ${sec(dictionary?.orientacoes_rn?.assaduras_label || 'Assaduras:', c3rn, `${dictionary?.orientacoes_rn?.assaduras_text_pre || 'Secar bem antes de aplicar ('}${f(rnPomada, dictionary?.orientacoes_rn?.pomada || 'Desitin ou Bepantol')}${dictionary?.orientacoes_rn?.assaduras_text_pos || ').'}`)}
        ${sec(dictionary?.orientacoes_rn?.vitD_label || 'Vitamina D:', c0rn, `${dictionary?.orientacoes_rn?.vitD_text_pre || ''}${f(rnVitDMed, dictionary?.orientacoes_rn?.vitDMed || 'Baby-D ou Addera D3')} — ${f(rnVitDDose, dictionary?.orientacoes_rn?.vitDDose || '1')}${dictionary?.orientacoes_rn?.vitD_text_pos2 || ' gota/dia desde o nascimento.'}`)}
      </div>
    </div>

    <!-- VACINAS + CONSULTA -->
    <div style="border-top:0.3mm solid ${c0rn}25;padding:4mm 10mm;display:flex;gap:10mm;align-items:center;flex-shrink:0;background:${c1rn}0a;">
      <div style="flex:1;">
        <div style="font-size:8pt;font-weight:800;color:${c1rn};text-transform:uppercase;margin-bottom:2mm;">${dictionary?.orientacoes_rn?.vacinas_maternidade || 'Vacinas na maternidade'}</div>
        <div style="display:flex;gap:10mm;">
          <div style="font-size:8pt;color:#555;display:flex;align-items:center;gap:2mm;">${dictionary?.orientacoes_rn?.bcg || 'BCG:'} ${f(rnBcgData,'data')}</div>
          <div style="font-size:8pt;color:#555;display:flex;align-items:center;gap:2mm;">${dictionary?.orientacoes_rn?.hepB || 'Hepatite B:'} ${f(rnHepBData,'data')}</div>
        </div>
      </div>
      <div style="flex:1;background:${c2rn}18;border-radius:2.5mm;padding:3mm 5mm;border:0.2mm solid ${c2rn}40;">
        <div style="font-size:8pt;font-weight:800;color:${c2rn};text-transform:uppercase;margin-bottom:2mm;">${dictionary?.orientacoes_rn?.proxima_consulta || '📅 Próxima consulta'}</div>
        <div style="font-size:8.5pt;color:#444;display:flex;gap:4mm;align-items:center;">${f(rnConsultaData, isEn ? 'mm/dd/yyyy' : 'dd/mm/aaaa')} ${dictionary?.orientacoes_rn?.as || 'às'} ${f(rnConsultaHora,'00h00')}</div>
      </div>
    </div>

    <!-- OBSERVAÇÕES -->
    <div style="border-top:0.3mm solid ${c0rn}25;padding:4mm 10mm;flex-shrink:0;background:${c0rn}08;">
      <div style="font-size:9pt;font-weight:900;color:${c0rn};font-style:italic;margin-bottom:2.5mm;">${dictionary?.orientacoes_rn?.observacoes || 'Observações:'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12mm;">
        <div>
          ${bul(dictionary?.orientacoes_rn?.obs_1 || 'Consulta entre 7 e 14 dias de vida.')}
          ${bul(dictionary?.orientacoes_rn?.obs_2 || 'Levar ao Posto de Saúde para vacinação.')}
          ${bul(dictionary?.orientacoes_rn?.obs_3 || 'Teste do Pezinho entre o 3º e 7º dia.')}
          ${bul(dictionary?.orientacoes_rn?.obs_4 || 'Teste da Orelhinha o quanto antes.')}
        </div>
        <div>
          ${bul(dictionary?.orientacoes_rn?.obs_5 || 'Dormir sempre de barriga para cima.')}
          ${bul(dictionary?.orientacoes_rn?.obs_6 || 'Sem travesseiros ou cobertores pesados.')}
          ${bul(dictionary?.orientacoes_rn?.obs_7 || 'Roupas leves no bebê.')}
          ${bul(dictionary?.orientacoes_rn?.obs_8 || 'Sólidos só após os 6 meses com orientação.')}
        </div>
      </div>
    </div>

    <!-- RODAPÉ -->
    ${(clinicaNome || rnUrgencia || mainPhone || site || instagram) ? `
    <div style="border-top:0.3mm solid ${c0rn}30;padding:3.5mm 10mm;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div>
        ${clinicaNome ? `<div style="font-size:8.5pt;font-weight:800;color:${c0rn};text-transform:uppercase;">${clinicaNome}</div>` : ''}
        ${(rnUrgencia || mainPhone) ? `<div style="font-size:7pt;color:#888;">${dictionary?.orientacoes_rn?.urgencias || 'Urgências:'} ${rnUrgencia || mainPhone}</div>` : ''}
      </div>
      <div style="font-size:6.5pt;color:#aaa;text-align:right;">${[mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>
    </div>
    ` : ''}
  </div>
</div>
</body></html>`;

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const prevT = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { document.title = pdfTitle(dictionary?.orientacoes_rn?.titulo?.replace('\n', ' ') || 'Orientações RN'); iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000); }, 1500); });
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
      const hasPastaContacts = !!(clinicaNome || endereco || mainPhone || telefone2 || site || instagram);
      const _footerP = hasPastaContacts ? `
        <div style="background:rgba(255,255,255,0.92);backdrop-filter:blur(3mm);padding:6mm 10mm;margin:0 10mm 8mm;border-radius:1.5mm;display:flex;align-items:center;justify-content:space-between;border:0.1mm solid rgba(0,0,0,0.1);font-family:'Montserrat',sans-serif;width:220mm;min-height:38mm;">
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:48%;overflow:visible;">
               ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine: null, fontPt: (parseFloat(_fontPt) * 1.8).toFixed(1), lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '95mm', maxHeight: '42mm', withBackground: comBorda && patternSrc })}
            </div>
            <div style="text-align:right;font-size:7.5pt;color:#333;line-height:1.6;">
                ${clinicaNome ? `<div style="font-family:${_brandFont};font-size:10.5pt;color:${accentColor};font-weight:700;margin-bottom:1.5mm;">${clinicaNome}</div>` : ''}
                ${endereco ? `<div style="opacity:0.8;">${endereco}</div>` : ''}
                <div style="font-weight:700;">${allPhones}</div>
                <div style="opacity:0.8;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>
            </div>
        </div>` : '';

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

    // ── CADERNO ──────────────────────────────────────────────
    if (item.includes('Caderno')) {
      const BLEED = 5;
      const _ffC = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfC = LOCAL_FONT_FACES[_ffC];
      const fiC = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfC ? `<style>${_lfC}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffC)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const genBgC = () => comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${patternScale ? ((patternScale * 0.55).toFixed(1) + 'mm') : '100%'};opacity:1;"></div>`
        : `<div style="position:absolute;inset:0;background:${borderColor || paletteColors?.[0] || accentColor};"></div>`;

      const w_mm = paperSize === 'a5' ? 170 : 210;
      const h_mm = paperSize === 'a5' ? 240 : 280;
      const totalW = w_mm + (BLEED * 2);
      const totalH = h_mm + (BLEED * 2);

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Caderno - ${marca}</title>${fiC}
<style>
  * { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
  body { width: ${totalW}mm; height: ${totalH}mm; position: relative; overflow: hidden; background: #fff; }
  .page { width: ${totalW}mm; height: ${totalH}mm; position: relative; overflow: hidden; page-break-after: always; }
  @media print { body { margin:0; } @page { size: ${totalW}mm ${totalH}mm; margin: 0; } }
  .cm-tl-h { position:absolute; top:${BLEED}mm; left:0; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-tl-v { position:absolute; top:0; left:${BLEED}mm; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
  .cm-tr-h { position:absolute; top:${BLEED}mm; right:0; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-tr-v { position:absolute; top:0; right:${BLEED}mm; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
  .cm-bl-h { position:absolute; bottom:${BLEED}mm; left:0; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-bl-v { position:absolute; bottom:0; left:${BLEED}mm; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
  .cm-br-h { position:absolute; bottom:${BLEED}mm; right:0; width:${BLEED-0.5}mm; height:0.2mm; background:#000; z-index:100; }
  .cm-br-v { position:absolute; bottom:0; right:${BLEED}mm; width:0.2mm; height:${BLEED-0.5}mm; background:#000; z-index:100; }
  .cropmarks { position: absolute; inset: 0; pointer-events: none; z-index: 100; }
</style></head><body>

<!-- CAPA -->
<div class="page">
    ${genBgC()}
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${w_mm * 0.75}mm;height:${h_mm * 0.4}mm;display:flex;align-items:center;justify-content:center;z-index:10;">
        ${genPDFLogoHtml({ brand, editDataOverride: itemEditData, color: logoColor, layout: logoLayout, localSlogan, crmLine: null, fontPt: (parseFloat(_fontPt) * 1.65).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) * 1.2 : 120, maxWidth: '100%', maxHeight: '100%', withBackground: comBorda && patternSrc, hideSlogan: false })}
    </div>
    
    <div class="cropmarks">
        <div class="cm-tl-h"></div><div class="cm-tl-v"></div>
        <div class="cm-tr-h"></div><div class="cm-tr-v"></div>
        <div class="cm-bl-h"></div><div class="cm-bl-v"></div>
        <div class="cm-br-h"></div><div class="cm-br-v"></div>
    </div>
</div>

<!-- CONTRA-CAPA -->
<div class="page">
    ${genBgC()}
    
    <div class="cropmarks">
        <div class="cm-tl-h"></div><div class="cm-tl-v"></div>
        <div class="cm-tr-h"></div><div class="cm-tr-v"></div>
        <div class="cm-bl-h"></div><div class="cm-bl-v"></div>
        <div class="cm-br-h"></div><div class="cm-br-v"></div>
    </div>
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

    // ── CARTÃO DE AGRADECIMENTO ──────────────────────────────────────
    if (item.includes('Agradecimento')) {
      const BLEED = 3;
      const _ffA = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfA = LOCAL_FONT_FACES[_ffA];
      const fiA = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">${_lfA ? `<style>${_lfA}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffA)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      
      const SIZES_A = [
        { w: 100, h: 100 },
        { w: 150, h: 150 },
        { w: 200, h: 200 }
      ];
      const selASize = SIZES_A[agradecimentoSizeIdx] || SIZES_A[0];
      const W = selASize.w;
      const H = selASize.h;
      const totalW = W + BLEED * 2;
      const totalH = H + BLEED * 2;

      const solidColor = borderColor || accentColor;
      const c0 = paletteColors[0] || solidColor;

      const logoHtmlForAgradecimento = genPDFLogoHtml({
        brand,
        editDataOverride: editData,
        color: comBorda && patternSrc ? (logoColor || solidColor) : '#fff',
        layout: logoLayout,
        localSlogan,
        crmLine: null,
        fontPt: logoLayout === 'horizontal' ? (22 * (W / 100)) : (28 * (W / 100)),
        lineH: _lineH,
        letterSp: _letterSp,
        customLogoSrc,
        customLogoScale: customLogoSrc ? getCustomLogoScale(item) * 2.5 : 100,
        maxWidth: `${W * 0.75}mm`,
        maxHeight: `${H * 0.35}mm`,
        withBackground: !!(comBorda && patternSrc) || !!customLogoSrc,
        withBackgroundPadding: '4mm'
      });

      const MESSAGES_A = [
        dictionary?.cartao_agradecimento?.msg1 || 'Obrigada pela sua confiança! ✨',
        dictionary?.cartao_agradecimento?.msg2 || 'Foi um prazer te atender 🌸',
        dictionary?.cartao_agradecimento?.msg3 || 'Que bom ter você aqui! 💛',
      ];
      const selectedMessageText = MESSAGES_A[agradecimentoMsgIdx] || MESSAGES_A[0];

      const frenteBgHtml = comBorda && patternSrc
        ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${((patternScale || 150) * 0.22).toFixed(1)}mm;background-repeat:repeat;opacity:0.9;"></div>`
        : `<div style="position:absolute;inset:0;background:${solidColor};"></div>`;

      const frenteA = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${frenteBgHtml}
          <!-- circles overlay -->
          <div style="position:absolute; bottom:-15%; right:-15%; width:60%; height:60%; border-radius:50%; background:rgba(255,255,255,0.08);"></div>
          <div style="position:absolute; top:-10%; left:-10%; width:45%; height:45%; border-radius:50%; background:rgba(255,255,255,0.06);"></div>
          
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:75%; text-align:center;">
            ${logoHtmlForAgradecimento}
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const versoA = `
        <div class="card" style="position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:#fff;"></div>
          <div style="position:absolute; top:0; left:0; right:0; height:${(W * 0.045).toFixed(1)}mm; background:${solidColor};"></div>
          <div style="position:absolute; bottom:0; left:0; right:0; height:${(W * 0.045).toFixed(1)}mm; background:${solidColor};"></div>

          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6mm; padding:${(W * 0.1).toFixed(1)}mm;">
            <div style="font-size:14pt; color:${solidColor}; font-family:'Montserrat',sans-serif; font-weight:400; font-style:italic; text-align:center; letter-spacing:0.3px; max-width:90%; line-height:1.4;">
              ${selectedMessageText}
            </div>
            
            ${clinicaNome && clinicaNome.trim() ? `
              <div style="width:${(W * 0.12).toFixed(1)}mm; height:0.3mm; background:${c0}45;"></div>
              <div style="font-size:16pt; font-weight:600; color:#333; font-family:'Montserrat',sans-serif; text-align:center; line-height:1.4;">
                ${clinicaNome}
              </div>
              <div style="width:${(W * 0.12).toFixed(1)}mm; height:0.3mm; background:${c0}45;"></div>
            ` : ''}

            <div style="display:flex; flex-direction:column; align-items:center; gap:4mm; font-family:'Montserrat',sans-serif; margin-top:2mm;">
              ${telefone ? `<div style="font-size:11pt; color:#999; font-weight:300;">${telefone}</div>` : ''}
              ${instagram ? `<div style="font-size:11pt; color:${c0}; font-weight:400;">@${instagram.replace('@','')}</div>` : ''}
              ${site ? `<div style="font-size:10pt; color:#bbb; font-weight:300;">${site}</div>` : ''}
            </div>
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cartão de Agradecimento - ${marca}</title>${fiA}
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
.card { width: ${totalW}mm; height: ${totalH}mm; position: relative; }
.cm { position: absolute; width: 2mm; height: 2mm; pointer-events: none; }
.cm-tl { top: ${BLEED}mm; left: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-tr { top: ${BLEED}mm; right: ${BLEED}mm; border-top: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
.cm-bl { bottom: ${BLEED}mm; left: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-left: 0.3px solid rgba(0,0,0,0.4); }
.cm-br { bottom: ${BLEED}mm; right: ${BLEED}mm; border-bottom: 0.3px solid rgba(0,0,0,0.4); border-right: 0.3px solid rgba(0,0,0,0.4); }
@media print { body { margin:0; } .card { page-break-after: always; } @page { size: ${totalW}mm ${totalH}mm; margin: 0; } }
</style></head><body>${frenteA}${versoA}</body></html>`;

      const ex = document.getElementById('_gabarito_iframe'); if (ex) ex.remove();
      const iframe = document.createElement('iframe');
      iframe.id = '_gabarito_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300mm;height:300mm;border:none;visibility:hidden;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
      const _docTitle = pdfTitle('Cartão de Agradecimento');
      iframe.contentDocument.title = _docTitle;
      const prevT = document.title;
      iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
          document.title = _docTitle;
          iframe.contentWindow.focus(); iframe.contentWindow.print();
          setTimeout(() => { document.title = prevT; iframe.remove(); }, 3000);
        }, 400);
      });
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
            <div style="flex:1;font-size:6pt;font-weight:800;text-align:center;padding:1mm 0;border-right:0.3pt solid #eee;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;">${dictionary?.geral?.retorno_consultas?.data || 'Data'}</div>
            <div style="flex:1;font-size:6pt;font-weight:800;text-align:center;padding:1mm 0;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;">${dictionary?.geral?.retorno_consultas?.horario || 'Horário'}</div>
          </div>
          ${Array.from({ length: count }).map(() => `<div style="display:flex;border-bottom:0.3pt solid #eee;height:${rowH};"><div style="flex:1;border-right:0.3pt solid #eee;"></div><div style="flex:1;"></div></div>`).join('')}
        </div>`;

      const logoHtmlR = genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 0.75).toFixed(1), lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '48mm', maxHeight: '18mm', withBackground: false, hideSlogan: true });

      const frenteR = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${genBg(4)}
          <div style="position:absolute;top:${BLEED + 4}mm;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 4}mm;display:flex;flex-direction:column;align-items:center;padding:4mm 3mm;">
            <div style="margin-bottom:4mm;display:flex;flex-direction:column;align-items:center;width:100%">${logoHtmlR}</div>
            <div style="background:${accentColor};color:#fff;width:100%;padding:1mm 0;font-size:6.5pt;font-weight:800;text-align:center;letter-spacing:1pt;border-radius:0.5mm;margin-bottom:4mm;font-family:'Montserrat',sans-serif;">${dictionary?.geral?.retorno_consultas?.titulo || 'RETORNO DE CONSULTAS'}</div>
            ${genTable(8, '5.5mm')}
          </div>
          <div class="cm cm-tl"></div><div class="cm cm-tr"></div><div class="cm cm-bl"></div><div class="cm cm-br"></div>
        </div>`;

      const versoR = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${genBg(4)}
          <div style="position:absolute;top:${BLEED + 4}mm;left:${BLEED + 4}mm;right:${BLEED + 4}mm;bottom:${BLEED + 3}mm;display:flex;flex-direction:column;align-items:center;padding:3mm;">
            ${genTable(12, '5.5mm')}
            ${(clinicaNome || endereco || instagram || site || mainPhone || telefone2) ? `
            <div style="width:100%;text-align:left;border-top:0.3pt solid #eee;padding-top:1.5mm;margin-top:auto;font-family:'Montserrat',sans-serif;">
              ${clinicaNome ? `<div style="font-family:${_brandFont};font-size:5pt;color:${accentColor};font-weight:700;">${clinicaNome}</div>` : ''}
              <div style="font-size:3.7pt;color:#888;margin-top:1.2mm;line-height:1.4;">
                ${endereco ? `<div style="margin-bottom:0.5mm;">${endereco}</div>` : ''}
                <div style="display:flex; flex-wrap:wrap; gap:3mm; margin-top:0.5mm;">
                  ${instagram ? `<span>@${instagram}</span>` : ''}
                  ${site ? `<span>${site}</span>` : ''}
                </div>
                ${(mainPhone || telefone2) ? `
                <div style="font-weight:700;color:#444;margin-top:0.8mm;font-size:4pt;">
                  ${[mainPhone, telefone2].filter(Boolean).join('  ·  ')}
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}
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

      const _logoWPct = logoLayout === 'horizontal' ? 0.90 : (_isRetrato ? 0.78 : 0.85);
      const _logoW = `${Math.round(_logoWPct * 100)}%`;
      const _availW = (_isRetrato ? 61 : 96) * _logoWPct - 8;
      const _bgHPad = _isRetrato ? 6 : 8; // mm de cada lado
      const _bgPadStr = `4mm ${_bgHPad}mm`;
      const _availWContent = _availW - _bgHPad * 2;
      const _logoBoxH = _isRetrato ? '42mm' : '38mm';
      // fontPt dinâmico: cada elemento contribui sua altura proporcional ao fontPt
      const _logoBoxHmm = parseFloat(_logoBoxH);
      const _sloganLines = localSlogan ? (localSlogan.length > 28 ? 2 : 1) : 0;
      // altura em mm por pt de fontPt (logo lines + slogan proporcional)
      const _hPerPt = _lines.length * _lineH * 0.353           // logo principal
                    + _sloganLines * 0.40 * 1.2 * 0.353;       // slogan = 40% do font, lineH=1.2
      const _fixedH = (crmLine ? 5 * 0.353 : 0) + 2;          // CRM fixo + gap estimado
      const _bgPadV = 8;                                        // 4mm top + 4mm bottom do withBackgroundPadding
      const _maxPtByH = (_logoBoxHmm * 0.88 - _fixedH - _bgPadV) / (_hPerPt || 1);
      const _fontPtCV = (Math.min(parseFloat(_fontPt), _maxPtByH) * (_isRetrato ? 0.85 : 1)).toFixed(1);
      const frenteHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${frenteBgHtml}
          <div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            ${(comBorda && !!patternSrc)
              ? `<div style="background:rgba(255,255,255,0.88);padding:${_bgPadStr};border-radius:4px;display:inline-flex;align-items:center;justify-content:center;max-height:${_logoBoxH};">
                  ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: _fontPtCV, lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: `${_availW}mm`, maxHeight: _logoBoxH, withBackground: false })}
                </div>`
              : `<div style="width:${_logoW}; height:${_logoBoxH}; display:flex; align-items:center; justify-content:center; overflow:hidden; ${_isScript ? 'padding-top:2mm;' : ''}">
                  ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: _fontPtCV, lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: `${_availWContent}mm`, maxHeight: _logoBoxH, withBackground: false })}
                </div>`
            }
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

      const versoInnerHtml = contactLines
        ? `<div style="position:absolute;top:${BLEED}mm;left:${BLEED}mm;right:${BLEED}mm;bottom:${BLEED}mm;display:flex;align-items:center;justify-content:center;">
            <div style="background:rgba(255,255,255,0.93);padding:${_isRetrato ? '2.5mm 4mm' : '3mm 5mm'};border-radius:1.5mm;width:${_isRetrato ? '86%' : '82%'};text-align:center;font-family:'Montserrat',sans-serif;font-size:${_isRetrato ? '0.82em' : '1em'};">
              ${contactLines}
            </div>
          </div>`
        : '';

      const versoHtml = `
        <div class="card" style="position:relative;overflow:hidden;">
          ${versoBgHtml}
          ${versoInnerHtml}
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
      const genPattern = (scaleMul = 1) => (comBorda && patternSrc) ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.255 * scaleMul).toFixed(1)}mm;background-repeat:repeat;opacity:1;"></div>` : '';
      const _sacPhones = [mainPhone, telefone].filter(Boolean).join(' / ');
      const _ffSac = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfSac = LOCAL_FONT_FACES[_ffSac];
      const _fiSac = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfSac ? `<style>${_lfSac}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffSac.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const _waIcoSac = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

      const abaSupHtml = `<div style="position:absolute;top:0;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_S + BLEED}mm;background:${solidColor};"></div>`;
      const abaInfHtml = `<div style="position:absolute;top:${BLEED + ABA_S + H}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${ABA_I + BLEED}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;
      const abaLatHtml = `<div style="position:absolute;top:${BLEED + ABA_S}mm;left:0;width:${ABA_L + BLEED}mm;height:${H}mm;background:#fff;z-index:1;">${genPattern(1)}</div>`;

      // Preview: 220px container / 240mm = 0.917px/mm → zoom = 3.78/0.917 ≈ 4.12
      const _sacLogoInner = ReactDOMServer.renderToString(<LogoPreviewHTML editData={itemEditData} color={logoColor} layout={logoLayout||'stacked'} scaleFactor={0.80} crm={crmLine} hideTagline={false} maxWidth={`${W-30}mm`} />);
      const _sacLogoHtml = `<div style="zoom:4.12;">${_sacLogoInner}</div>`;
      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L}mm;width:${W}mm;height:${H}mm;overflow:hidden;background:#fff;z-index:2;">
            ${genPattern(1)}
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;background:rgba(255,255,255,0.93);border-radius:4px;padding:10mm 15mm;display:inline-flex;align-items:center;justify-content:center;width:150mm;height:95mm;">
              ${_sacLogoHtml}
            </div>
        </div>`;

      const hasEnvelopeContacts = !!(clinicaNome || endereco || _sacPhones || email || site || instagram);
      const versoHtml = `
        <div style="position:absolute;top:${BLEED + ABA_S}mm;left:${BLEED + ABA_L + W}mm;width:${W + BLEED}mm;height:${H}mm;background:#fff;overflow:hidden;z-index:2;border-left:0.1mm dashed rgba(0,0,0,0.1);">
            ${genPattern(1)}
            ${hasEnvelopeContacts ? `
            <div style="position:absolute;bottom:15mm;left:50%;transform:translateX(-50%);width:max-content;max-width:${W - 20}mm;background:rgba(255,255,255,0.97);padding:6mm 12mm;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
               <div style="font-size:11pt;color:#666;font-family:'Montserrat',sans-serif;line-height:1.7;">
                  ${clinicaNome ? `<div style="font-weight:700;color:${accentColor};font-size:14pt;margin-bottom:2mm;">${clinicaNome}</div>` : ''}
                  ${endereco ? `<div style="opacity:0.75;">${endereco}</div>` : ''}
                  ${_sacPhones ? `<div style="font-weight:700;color:#333;font-size:15pt;margin:2mm 0;">${_waIcoSac}${_sacPhones}</div>` : ''}
                  ${email ? `<div style="opacity:0.75;margin-bottom:1mm;">${email}</div>` : ''}
                  ${(site || instagram) ? `<div style="opacity:0.75;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
               </div>
            </div>
            ` : ''}
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
      const genPattern = (scaleMul = 1) => (comBorda && patternSrc) ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale * 0.28 * scaleMul).toFixed(1)}mm;background-repeat:repeat;opacity:1;"></div>` : '';
      const _envPhones = [mainPhone, telefone].filter(Boolean).join(' / ');

      const _ffEnv = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfEnv = LOCAL_FONT_FACES[_ffEnv];
      const _fiEnv = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">${_lfEnv ? `<style>${_lfEnv}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${_ffEnv.replace(/ /g,'+')}:wght@400;700&display=swap" rel="stylesheet">`}`;

      const abaHtml = `<div style="position:absolute;top:0;left:0;width:${totalW}mm;height:${ABA + BLEED}mm;background:${solidColor};"></div>`;

      const _logoEnvHtml = genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '68mm', maxHeight: '43mm', withBackground: false });
      const frenteHtml = `
        <div style="position:absolute;top:${BLEED + ABA}mm;left:0;width:${totalW}mm;height:${H}mm;background:#fff;overflow:hidden;">
            ${genPattern(1)}
            <div style="position:absolute;bottom:6mm;right:${COLA + 3}mm;width:78mm;height:42mm;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.93);border-radius:3px;padding:3mm 5mm;">${_logoEnvHtml}</div>
        </div>`;

      const _waIco = `<svg viewBox="0 0 24 24" width="9" height="9" style="display:inline;vertical-align:middle;margin-right:1.5pt;" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      const hasEnvelopeContacts = !!(clinicaNome || endereco || _envPhones || email || site || instagram);
      const versoHtml = `
        <div style="position:absolute;top:${BLEED + ABA + H}mm;left:0;width:${totalW}mm;height:${H + BLEED}mm;background:#fff;transform:rotate(180deg);overflow:hidden;">
            ${genPattern(1)}
            ${hasEnvelopeContacts ? `
            <div style="position:absolute;bottom:10mm;left:50%;transform:translateX(-50%);width:max-content;max-width:${W - 20}mm;background:rgba(255,255,255,0.97);padding:5mm 10mm;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0.2mm solid #ddd;text-align:center;white-space:nowrap;">
               <div style="font-size:9pt;color:#666;font-family:'Montserrat',sans-serif;line-height:1.65;">
                  ${clinicaNome ? `<div style="font-weight:700;color:${accentColor};font-size:10.5pt;margin-bottom:1.5mm;">${clinicaNome}</div>` : ''}
                  ${endereco ? `<div style="opacity:0.75;">${endereco}</div>` : ''}
                  ${_envPhones ? `<div style="font-weight:700;color:#333;font-size:11pt;margin:1.5mm 0;">${_waIco}${_envPhones}</div>` : ''}
                  ${email ? `<div style="opacity:0.75;">${email}</div>` : ''}
                  ${(site || instagram) ? `<div style="opacity:0.75;">${[site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ')}</div>` : ''}
               </div>
            </div>
            ` : ''}
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
                <h1 style="font-family:'Montserrat',sans-serif;font-size:18pt;font-weight:800;letter-spacing:1px;color:#111;margin:0;">${dictionary?.ficha_cadastro?.titulo || 'CADASTRO DE PACIENTES'}</h1>
                <div style="display:flex;align-items:center;gap:3mm;margin-top:5mm;">
                  <span style="font-size:10pt;font-weight:400;color:#222;">${dictionary?.ficha_cadastro?.data || 'DATA :'}</span>
                  <div style="width:40mm;height:6mm;background:#e2ddd7;border-radius:1px;"></div>
                </div>
              </div>
              <div style="width:80mm; display:flex; justify-content:flex-end; align-items:center;">
                ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc })}
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:7mm;font-family:'Montserrat',sans-serif;width:100%;flex:1;justify-content:space-between;">
              ${fichaAdulto ? `
              ${formRow(dictionary?.ficha_cadastro?.completo_nome || 'NOME COMPLETO :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:', 0.4)}
                ${formRow(dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.35)}
                ${formRow(dictionary?.ficha_cadastro?.rg || 'RG:', 0.25)}
              </div>
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.estado_civil || 'ESTADO CIVIL:', 0.5)}
                ${formRow(dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:', 0.5)}
              </div>
              <div style="border:0.5mm solid #cfd9e5;border-radius:2mm;padding:4mm;background:#f8fafc;display:flex;flex-direction:column;gap:3.5mm;">
                ${formRow(dictionary?.ficha_cadastro?.responsavel_nome || 'RESPONSÁVEL (se menor):', 1)}
                <div style="display:flex;gap:5mm;">
                  ${formRow(dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:', 0.6)}
                  ${formRow(dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.4)}
                </div>
              </div>
              ` : `
              ${formRow(dictionary?.ficha_cadastro?.crianca_nome || 'NOME COMPLETO DA CRIANÇA :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:', 0.45)}
                ${formRow(dictionary?.ficha_cadastro?.idade || 'IDADE:', 0.55)}
              </div>
              ${formRow(dictionary?.ficha_cadastro?.mae_nome || 'NOME DA MÃE :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:', 0.65)}
                ${formRow(dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.35)}
              </div>
              ${formRow(dictionary?.ficha_cadastro?.pai_nome || 'NOME DO PAI :', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:', 0.65)}
                ${formRow(dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.35)}
              </div>
              <div style="border:0.5mm solid #cfd9e5;border-radius:2mm;padding:4mm;background:#f8fafc;display:flex;flex-direction:column;gap:3.5mm;">
                ${formRow(dictionary?.ficha_cadastro?.responsavel_acompanhante || 'NOME DO (A) RESPONSÁVEL ACOMPANHANTE:', 1)}
                <div style="display:flex;gap:5mm;">
                  ${formRow(dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:', 0.6)}
                  ${formRow(dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.4)}
                </div>
              </div>
              `}
              ${formRow(dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:', 1)}
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.complemento || 'COMPLEMENTO:', 0.55)}
                ${formRow(dictionary?.ficha_cadastro?.bairro || 'BAIRRO:', 0.45)}
              </div>
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.cidade || 'CIDADE:', 0.55)}
                ${formRow(dictionary?.ficha_cadastro?.estado || 'ESTADO:', 0.45)}
              </div>
              
              <div style="margin-top:1mm;">
                <span style="font-size:8.5pt;font-weight:700;color:#222;">${dictionary?.ficha_cadastro?.telefones || 'TELEFONES :'}</span>
              </div>
              ${fichaAdulto ? `
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.celular || 'CELULAR:', 1)}
                ${formRow(dictionary?.ficha_cadastro?.residencial || 'RESIDENCIAL:', 1)}
              </div>` : `
              <div style="display:flex;gap:5mm;">
                ${formRow(dictionary?.ficha_cadastro?.mae || 'MÃE :', 1)}
                ${formRow(dictionary?.ficha_cadastro?.pai || 'PAI :', 1)}
                ${formRow(dictionary?.ficha_cadastro?.responsavel || 'RESPONSÁVEL:', 1)}
              </div>
              <div style="display:flex;gap:5mm;align-items:center;">
                ${formRow(dictionary?.ficha_cadastro?.outros_telefones || 'OUTROS TELEFONES :', 0.55)}
                ${formText(dictionary?.ficha_cadastro?.residencial_comercial || 'RESIDENCIAL ( &nbsp; &nbsp;) &nbsp; COMERCIAL ( &nbsp; &nbsp;)', 0.45)}
              </div>`}

              ${formRow(dictionary?.ficha_cadastro?.emails || 'E-MAILS:', 1)}
              ${formRow(dictionary?.ficha_cadastro?.como_conheceu || 'COMO CONHECEU A CLÍNICA:', 1)}

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
            <div style="margin-bottom:10mm;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding-top:12mm;">
               ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc })}
            </div>
            <div style="display:flex;flex-direction:column;gap:4mm;font-family:'Montserrat',sans-serif;width:100%;margin-top:1mm;border:0.25mm solid #eee;border-radius:1mm;padding:5mm 6mm;">
              ${formRow(dictionary?.prontuario?.paciente || 'PACIENTE:', dictionary?.prontuario?.data_nasc || 'NASC:', 0.6)}
              ${formRow(dictionary?.prontuario?.mae || 'NOME DA MÃE:', dictionary?.prontuario?.cpf || dictionary?.ficha_cadastro?.cpf || 'CPF:', 0.45)}
              ${formRow(dictionary?.prontuario?.telefone || 'TELEFONE:', dictionary?.prontuario?.email || 'EMAIL:', 0.45)}
              ${formRow(dictionary?.prontuario?.endereco || dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:', dictionary?.prontuario?.cidade || dictionary?.ficha_cadastro?.cidade || 'CIDADE:', 0.45)}
              ${formRow(dictionary?.prontuario?.convenio || 'CONVÊNIO:', dictionary?.prontuario?.carteirinha || 'Nº CARTEIRINHA:', 0.7)}
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
      const SECOES_CK = dictionary?.checklist_maternidade?.secoes || [
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
      const hasFooterData = !!(clinicaNome || endereco || _allPhonesCk || site || instagram);
      const footerHtml = hasFooterData ? `
        <div style="border-top:0.3mm solid ${accentColor}30;padding:3mm 2mm 0;display:flex;align-items:center;justify-content:space-between;gap:6mm;">
          <div style="font-family:'Montserrat',sans-serif;font-size:9pt;font-weight:800;color:${accentColor};text-transform:uppercase;letter-spacing:0.5pt;white-space:nowrap;">${clinicaNome || ''}</div>
          <div style="font-family:'Montserrat',sans-serif;font-size:7.5pt;color:#888;text-align:center;line-height:1.4;">
            ${endereco ? `<div>${endereco}</div>` : ''}
            ${_allPhonesCk ? `<div>${_allPhonesCk}</div>` : ''}
          </div>
          <div style="font-family:'Montserrat',sans-serif;font-size:7.5pt;color:#888;text-align:right;white-space:nowrap;">
            ${site ? `<div>${site}</div>` : ''}
            ${instagram ? `<div>@${instagram}</div>` : ''}
          </div>
        </div>
      ` : '';

      const _ffCk = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfCk = LOCAL_FONT_FACES[_ffCk];
      const _fiCk = _lfCk ? `<style>${_lfCk}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffCk)}:wght@400;700&display=swap" rel="stylesheet">`;
      const _logoCk = genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, layout: logoLayout, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc });
      const _cmCk = `
        <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;top:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED-0.5}mm;height:0.2mm;background:#000;z-index:100;"></div>
        <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.2mm;height:${BLEED-0.5}mm;background:#000;z-index:100;"></div>`;
      const htmlCk = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet">${_fiCk}<style>*{margin:0;padding:0;box-sizing:border-box;}body{width:220mm;height:307mm;}@media print{body{margin:0;}@page{size:220mm 307mm;margin:0;}}</style></head><body><div style="position:relative;width:220mm;height:307mm;${_patCk}">${_cmCk}<div style="position:absolute;top:${BLEED + 8}mm;left:${BLEED + 8}mm;right:${BLEED + 8}mm;bottom:${BLEED + 8}mm;background:#fff;display:flex;overflow:hidden;"><div style="width:16mm;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${accentColor}15;"><div style="transform:rotate(-90deg);white-space:nowrap;font-family:'Montserrat',sans-serif;font-size:15pt;font-weight:900;color:${accentColor};letter-spacing:4pt;text-transform:uppercase;">{dictionary?.checklist_maternidade?.titulo || 'CHECKLIST MATERNIDADE'}</div></div><div style="flex:1;display:flex;flex-direction:column;padding:12mm 8mm 10mm 8mm;gap:4mm;overflow:hidden;"><div style="display:flex;justify-content:center;padding-bottom:5mm;border-bottom:0.2mm solid ${accentColor}25;">${_logoCk}</div><div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:4mm;">${SECOES_CK.map((s, idx) => secaoHtmlCk(s, idx)).join('')}</div>${footerHtml}</div></div></div></body></html>`;
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

    if (item.includes('Atestado Médico')) {
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

    <div style="position:absolute;top:${_isA4 ? 12 : 11}mm;left:50%;transform:translateX(-50%);width:${Math.round((_pw - 2 * BLEED) * 0.90)}mm;display:flex;align-items:center;justify-content:center;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: (parseFloat(_fontPt) * 1.0).toFixed(1), lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: false, hideSlogan: false })}</div>

    <div style="position:absolute;top:${_isA4 ? 76 : 52}mm;left:0;right:0;text-align:center;font-size:${_isA4 ? 18 : 14}pt;font-weight:800;letter-spacing:2.5pt;color:#1a1a2e;">${dictionary?.atestado?.titulo?.toUpperCase() || 'ATESTADO MÉDICO'}</div>

    ${atestadoModelo === 1 ? `
    <div style="position:absolute;top:${_isA4 ? 96 : 66}mm;left:9mm;right:9mm;font-size:${_isA4 ? 13 : 10}pt;color:#222;display:flex;flex-direction:column;gap:${_isA4 ? 14 : 6}mm;line-height:1.3;">
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">${dictionary?.atestado?.declaracao || 'Declaro para os devidos fins, que'}</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">${dictionary?.atestado?.esteve_em_consulta || ', esteve em consulta, das'}</span>
        <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">${dictionary?.atestado?.hs_as || 'hs às'}</span>
        <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">,</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">${dictionary?.atestado?.hs_acompanhado || 'acompanhado de seu responsável Sr. (a)'}</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">${dictionary?.atestado?.rg || ', R.G. n°'}</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
        <span style="white-space:nowrap;">${dictionary?.atestado?.necessitando || ', necessitando o mesmo'}</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">de</span>
        <span class="blank" style="width:${_isA4 ? 28 : 20}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">(</span><span class="blank" style="width:${_isA4 ? 18 : 12}mm;">&nbsp;</span><span style="white-space:nowrap;">) ${dictionary?.atestado?.dias_dispensa || 'dias de dispensa.'}</span>
      </div>
    </div>

    <div style="position:absolute;top:${_isA4 ? 210 : 133}mm;left:0;right:0;text-align:center;font-size:${_isA4 ? 11 : 9}pt;color:#555;">
      <span class="blank" style="width:${_isA4 ? 52 : 38}mm;">&nbsp;</span>, <span class="blank" style="width:${_isA4 ? 14 : 10}mm;">&nbsp;</span>
      de <span class="blank" style="width:${_isA4 ? 30 : 22}mm;">&nbsp;</span> de <span class="blank" style="width:${_isA4 ? 16 : 12}mm;">&nbsp;</span>
    </div>

    <div style="position:absolute;top:${_isA4 ? 235 : 152}mm;left:20%;right:20%;border-top:0.7px solid #555;"></div>
    ` : `
    <div style="position:absolute;top:${_isA4 ? 96 : 66}mm;left:9mm;right:9mm;font-size:${_isA4 ? 13 : 10}pt;color:#222;display:flex;flex-direction:column;gap:${_isA4 ? 8 : 5}mm;line-height:1.3;">
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">${dictionary?.atestado?.atesto_que || 'Atesto que o(a) Sr.(a)'}</span>
        <span class="blank" style="flex:1;">&nbsp;</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:1mm;">
        <span style="white-space:nowrap;">${dictionary?.atestado?.foi_atendido || 'foi atendido na Clínica Médica das'}</span>
        <span class="blank" style="width:${_isA4 ? 22 : 16}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">${dictionary?.atestado?.as || 'às'}</span>
        <span class="blank" style="width:${_isA4 ? 22 : 16}mm;">&nbsp;</span>
        <span style="white-space:nowrap;">.</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:${_isA4 ? 6 : 4}mm;margin-top:${_isA4 ? 6 : 4}mm;">
        <div style="display:flex;align-items:center;gap:3mm;">
          <span style="width:${_isA4 ? 5 : 4}mm;height:${_isA4 ? 5 : 4}mm;border:0.8px solid #555;display:inline-block;flex-shrink:0;"></span>
          <span style="white-space:nowrap;">${dictionary?.atestado?.check_retornar || 'Foi orientado a retornar ao trabalho.'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:3mm;">
          <span style="width:${_isA4 ? 5 : 4}mm;height:${_isA4 ? 5 : 4}mm;border:0.8px solid #555;display:inline-block;flex-shrink:0;"></span>
          <span style="white-space:nowrap;">${dictionary?.atestado?.check_repouso_hoje || 'Foi orientado a permanecer em repouso hoje.'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:3mm;">
          <span style="width:${_isA4 ? 5 : 4}mm;height:${_isA4 ? 5 : 4}mm;border:0.8px solid #555;display:inline-block;flex-shrink:0;"></span>
          <span style="white-space:nowrap;">${dictionary?.atestado?.check_repouso_dias_pre || 'Deverá permanecer em repouso ('}</span>
          <span class="blank" style="width:${_isA4 ? 14 : 10}mm;">&nbsp;</span>
          <span style="white-space:nowrap;">${dictionary?.atestado?.check_repouso_dias_pos || ') dia (s) a partir desta data'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:3mm;">
          <span style="width:${_isA4 ? 5 : 4}mm;height:${_isA4 ? 5 : 4}mm;border:0.8px solid #555;display:inline-block;flex-shrink:0;"></span>
          <span style="white-space:nowrap;">${dictionary?.atestado?.check_apto_esportes || 'Está apto a exercer práticas desportivas.'}</span>
        </div>
      </div>
    </div>

    <div style="position:absolute;top:${_isA4 ? 200 : 128}mm;left:9mm;right:9mm;display:flex;align-items:flex-end;gap:2mm;font-size:${_isA4 ? 13 : 10}pt;color:#222;">
      <span style="white-space:nowrap;">${dictionary?.atestado?.cid_label || 'CID:'}</span>
      <span class="blank" style="width:${_isA4 ? 50 : 36}mm;">&nbsp;</span>
      <span style="white-space:nowrap;font-size:${_isA4 ? 9 : 7}pt;color:#999;">(${dictionary?.atestado?.cid_caption || 'preenchimento com autorização do paciente'})</span>
    </div>

    <div style="position:absolute;top:${_isA4 ? 235 : 152}mm;left:9mm;width:${_isA4 ? 80 : 56}mm;border-bottom:0.7px solid #555;"></div>
    <div style="position:absolute;top:${_isA4 ? 238 : 154}mm;left:9mm;width:${_isA4 ? 80 : 56}mm;text-align:center;font-size:${_isA4 ? 9 : 7}pt;color:#555;">${dictionary?.atestado?.local_data || 'Local e Data'}</div>

    <div style="position:absolute;top:${_isA4 ? 235 : 152}mm;right:9mm;width:${_isA4 ? 80 : 56}mm;border-bottom:0.7px solid #555;"></div>
    <div style="position:absolute;top:${_isA4 ? 238 : 154}mm;right:9mm;width:${_isA4 ? 80 : 56}mm;text-align:center;font-size:${_isA4 ? 9 : 7}pt;color:#555;">${dictionary?.atestado?.assinatura_medico || 'Assinatura do Médico'}</div>
    `}

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

      const days = dictionary?.diario_xixi?.dias || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
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
        <!-- Logo posicionada absolutamente no canto superior direito -->
        <div style="position:absolute;top:5mm;right:6mm;width:100mm;height:36mm;display:flex;align-items:center;justify-content:flex-end;overflow:hidden;">
            ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc })}
        </div>
        <div style="display:flex;flex-direction:column;gap:6mm;margin-bottom:8mm;padding-right:105mm;">
            <div style="background:#f5f5f5;padding:4mm 10mm;border-radius:1.5mm;border:0.4mm solid #ddd;display:inline-block;align-self:flex-start;">
                <span style="font-family:'Montserrat',sans-serif;font-size:16pt;font-weight:800;color:#333;letter-spacing:2pt;text-transform:uppercase;">${dictionary?.diario_xixi?.titulo || 'DIÁRIO DO XIXI (HÁBITO MICCIONAL)'}</span>
            </div>
            <div style="font-family:'Montserrat',sans-serif;font-size:10pt;color:${accentColor};font-weight:700;text-transform:uppercase;letter-spacing:1pt;margin-top:2mm;">${dictionary?.diario_xixi?.subtitulo || 'Controle de Escapes e Enurese (Xixi na Cama)'}</div>
            <div style="display:flex;gap:5mm;align-items:flex-end;margin-top:2mm;">
                <span style="font-family:'Montserrat',sans-serif;font-size:18pt;color:${accentColor};font-weight:300;font-style:italic;">${dictionary?.diario_xixi?.nome || 'Nome:'}</span>
                <div style="flex:1;border-bottom:0.5mm dashed #ccc;min-width:80mm;margin-bottom:2mm;"></div>
            </div>
        </div>

        <div style="display:flex;gap:15mm;align-items:center;margin-bottom:8mm;font-family:'Montserrat',sans-serif;">
            <div style="display:flex;gap:6mm;align-items:center;">
                <span style="font-size:11pt;text-transform:uppercase;color:#666;font-weight:800;letter-spacing:1pt;">${dictionary?.diario_xixi?.legenda || 'Legenda:'}</span>
                <span style="font-size:11pt;color:#888;"><strong>0:</strong> ${dictionary?.diario_xixi?.seco || 'Acordou Seco(a) / Sem Escapes'}</span>
                <span style="font-size:11pt;color:#888;"><strong>1:</strong> ${dictionary?.diario_xixi?.gotas || 'Gotas / Escape Leve'}</span>
                <span style="font-size:11pt;color:#888;"><strong>2:</strong> ${dictionary?.diario_xixi?.molhou_roupa || 'Molhou a Roupa ou Fralda'}</span>
                <span style="font-size:11pt;color:#888;"><strong>3:</strong> ${dictionary?.diario_xixi?.abundante || 'Abundante / Molhou a Cama'}</span>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:45mm repeat(4, 1fr);gap:0.3mm;background:#eee;border:0.3mm solid #eee;flex:1;">
            <div style="background:#fff;display:flex;align-items:center;padding-left:6mm;">
                <span style="font-family:'Montserrat',sans-serif;font-size:9pt;font-weight:800;color:#bbb;text-transform:uppercase;">${dictionary?.diario_xixi?.marque_0_3 || 'Marque 0 a 3'}</span>
            </div>
            ${weeks.map(w => `
              <div style="background:#fff;text-align:center;padding:4mm 0;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                <div style="font-family:'Montserrat',sans-serif;font-size:11pt;font-weight:800;color:${accentColor};text-transform:uppercase;">${dictionary?.diario_xixi?.semana || 'Semana'} ${w}</div>
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
      const _c4 = paletteColors[4] || _c2;

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
        <div style="font-family:'Montserrat',sans-serif;font-size:8pt;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5pt;">${dictionary?.meu_pratinho?.passo_a_passo || 'passo a passo'}</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:26pt;font-weight:900;color:${solidColor};text-transform:uppercase;line-height:0.95;">${dictionary?.meu_pratinho?.alimentacao || 'ALIMENTAÇÃO'}</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:21pt;font-weight:900;color:${solidColor};text-transform:uppercase;line-height:0.95;">${dictionary?.meu_pratinho?.complementar || 'COMPLEMENTAR'}</div>
      </div>
      <!-- Campos -->
      <div style="display:flex;flex-direction:column;gap:2mm;margin-bottom:6mm;padding:3mm 5mm;background:${solidColor}10;border-radius:2mm;border:0.2mm solid ${solidColor}20;">
        ${[[dictionary?.meu_pratinho?.nome || 'NOME'],[dictionary?.meu_pratinho?.data_nascimento || 'DATA DE NASCIMENTO']].map(([l]) => `
          <div style="display:flex;flex-direction:column;gap:0.5mm;">
            <span style="font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">${l}:</span>
            <div style="border-bottom:0.2mm solid ${solidColor}50;height:4mm;"></div>
          </div>`).join('')}
        <div style="display:flex;gap:6mm;font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">
          <div style="display:flex;align-items:center;gap:1.5mm;"><div style="width:3.5mm;height:3.5mm;border:0.2mm solid ${solidColor}60;border-radius:50%;"></div>${dictionary?.meu_pratinho?.menino || 'MENINO'}</div>
          <div style="display:flex;align-items:center;gap:1.5mm;"><div style="width:3.5mm;height:3.5mm;border:0.2mm solid ${solidColor}60;border-radius:50%;"></div>${dictionary?.meu_pratinho?.menina || 'MENINA'}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5mm;">
          <span style="font-family:'Montserrat',sans-serif;font-size:6.5pt;font-weight:800;color:#555;">${dictionary?.meu_pratinho?.responsavel || 'NOME DO RESPONSÁVEL'}:</span>
          <div style="border-bottom:0.2mm solid ${solidColor}50;height:4mm;"></div>
        </div>
      </div>
      <!-- Steps -->
      <div style="display:flex;flex-direction:column;gap:5mm;flex:1;">
        ${[[1,dictionary?.meu_pratinho?.idade_titulo || 'IDADE',_c0,dictionary?.meu_pratinho?.idade_desc || '6 meses, com os sinais de prontidão presentes.'],[2,dictionary?.meu_pratinho?.consistencia_titulo || 'CONSISTÊNCIA',_c1,dictionary?.meu_pratinho?.consistencia_desc || 'Proibido mixer, liquidificador, peneira ou redinha. O que não amassar, ofereça em pedaços para estimular a mastigação e o desenvolvimento orofacial.'],[3,dictionary?.meu_pratinho?.colher_titulo || 'ESCOLHA O TAMANHO DA COLHER',_c2,dictionary?.meu_pratinho?.colher_desc || 'Tamanho adequado ao diâmetro da boca da criança. Prefira silicone ou plástico.'],[4,dictionary?.meu_pratinho?.montar_titulo || 'MONTAR O PRATO',_c3,dictionary?.meu_pratinho?.montar_desc || 'Siga a proporção da imagem dando preferência a alimentos ricos, frescos e variados.']].map(([n,t,c,tx]) => `
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
        <div style="display:flex;justify-content:flex-end;align-items:center;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: logoLayout === 'horizontal' ? (marca.length > 18 ? 16 : marca.length > 12 ? 20 : 24) : _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc })}</div>
      </div>
      <!-- Prato com anel colorido -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center;">
        <div style="position:relative;width:140mm;height:140mm;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(${_c0} 0deg 180deg,${_c1} 180deg 360deg);"></div>
          <div style="position:absolute;inset:4mm;border-radius:50%;background:#fff;"></div>
          <div style="position:absolute;inset:6mm;border-radius:50%;overflow:hidden;">
            <div style="position:relative;width:100%;height:100%;border-radius:50%;background:conic-gradient(from 270deg,${_c1}e0 0deg 180deg,${_c4}e0 180deg 225deg,${_c3}e0 225deg 270deg,${_c2}e0 270deg 360deg);">
              <!-- Divisores brancos -->
              <div style="position:absolute;top:50%;left:0;right:0;height:0.5mm;background:#fff;transform:translateY(-50%);"></div>
              <div style="position:absolute;left:50%;top:50%;bottom:0;width:0.5mm;background:#fff;transform:translateX(-50%);"></div>
              <div style="position:absolute;left:50%;top:50%;width:0.5mm;height:50%;background:#fff;transform-origin:top center;transform:translateX(-50%) rotate(-45deg);"></div>
              <!-- Hortaliças (50%) -->
              <div style="position:absolute;top:18%;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:1.5mm;">
                <span style="font-size:26pt;line-height:1;">🥦🥕🍅</span>
                <span style="font-size:13pt;font-weight:900;color:#fff;text-shadow:0 0.3mm 0.8mm rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.2pt;white-space:nowrap;font-family:Montserrat,sans-serif;">${dictionary?.meu_pratinho?.hortalicas_label || 'Hortaliças (50%)'}</span>
              </div>
              <!-- Carboidratos (25%) -->
              <div style="position:absolute;bottom:20%;left:14%;display:flex;flex-direction:column;align-items:center;gap:1mm;">
                <span style="font-size:26pt;line-height:1;">🍚🥔</span>
                <span style="font-size:13pt;font-weight:900;color:#fff;text-shadow:0 0.3mm 0.8mm rgba(0,0,0,0.4);text-transform:uppercase;width:22mm;text-align:center;line-height:1.2;font-family:Montserrat,sans-serif;">${dictionary?.meu_pratinho?.carbo_label || 'Carbo (25%)'}</span>
              </div>
              <!-- Proteínas (12.5%) -->
              <div style="position:absolute;bottom:14%;right:27%;display:flex;flex-direction:column;align-items:center;gap:1mm;">
                <span style="font-size:26pt;line-height:1;">🍗</span>
                <span style="font-size:13pt;font-weight:900;color:#fff;text-shadow:0 0.3mm 0.8mm rgba(0,0,0,0.4);text-transform:uppercase;text-align:center;line-height:1.2;font-family:Montserrat,sans-serif;">${dictionary?.meu_pratinho?.proteina_label?.replace(' ', '<br/>') || 'Proteína<br/>(12.5%)'}</span>
              </div>
              <!-- Grãos (12.5%) -->
              <div style="position:absolute;bottom:27%;right:12%;display:flex;flex-direction:column;align-items:center;gap:1mm;">
                <span style="font-size:26pt;line-height:1;">🫘</span>
                <span style="font-size:13pt;font-weight:900;color:#fff;text-shadow:0 0.3mm 0.8mm rgba(0,0,0,0.4);text-transform:uppercase;text-align:center;line-height:1.2;font-family:Montserrat,sans-serif;">${dictionary?.meu_pratinho?.graos_label?.replace(' ', '<br/>') || 'Grãos<br/>(12.5%)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <div style="position:absolute;bottom:${BLEED+BORDER+2}mm;left:${BLEED+BORDER+5}mm;right:${BLEED+BORDER+5}mm;display:flex;justify-content:space-between;border-top:0.2mm solid #eee;padding-top:2mm;z-index:4;">
    <span style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#bbb;">${clinicaNome}${cartaoContacts?.telefone ? ` · ${cartaoContacts.telefone}` : ''}</span>
    <span style="font-family:'Montserrat',sans-serif;font-size:7pt;font-weight:900;color:${solidColor};text-transform:uppercase;">${dictionary?.meu_pratinho?.guia_alimentar_label || 'GUIA ALIMENTAR: MEU PRATINHO'}</span>
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
    <div style="font-family:'Montserrat',sans-serif;font-size:14pt;font-weight:900;color:${solidColor};text-transform:uppercase;text-align:center;margin-bottom:1mm;flex-shrink:0;">${dictionary?.meu_pratinho?.guia_alimentar_label?.replace('GUIA ALIMENTAR: ', '') || 'MEU PRATINHO'}</div>
    <div style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#999;text-align:center;margin-bottom:3mm;flex-shrink:0;">${dictionary?.meu_pratinho?.como_montar_subtitulo || 'Como montar um prato equilibrado para as crianças'}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:2.5mm;flex:1;overflow:hidden;">
      ${foodCard(dictionary?.meu_pratinho?.legumes_verduras_titulo || 'Legumes e Verduras',_c0,dictionary?.meu_pratinho?.legumes_verduras_desc || 'Ricos em vitaminas, minerais, fibras e ferro. Quanto mais colorido, melhor! Beterraba, chuchu, abobrinha, cenoura, alface, brócolis, couve-flor, espinafre, acelga, rúcula, agrião. Devem ocupar metade do pratinho.')}
      ${foodCard(dictionary?.meu_pratinho?.proteinas_titulo || 'Proteínas',_c1,dictionary?.meu_pratinho?.proteinas_desc || 'Fonte de proteína, gordura, ferro, zinco e vitamina B12. Carne, ovo, peixe e frango. Opte por carnes magras. Escolha 1 opção por refeição e varie ao longo da semana.')}
      ${foodCard(dictionary?.meu_pratinho?.agua_titulo || 'Água',_c2,dictionary?.meu_pratinho?.agua_desc || 'Oferte sempre após cada refeição e lanches. A água é fundamental para o bom funcionamento do organismo. Evite bebidas açucaradas, sucos e chás.')}
      ${foodCard(dictionary?.meu_pratinho?.leguminosas_titulo || 'Leguminosas',_c3,dictionary?.meu_pratinho?.leguminosas_desc || 'Proteínas, fibras, ferro, zinco e vitaminas do complexo B. Feijão, grão de bico, ervilha, lentilha, soja. Escolha 1 opção por refeição e varie a proteína vegetal.')}
      ${foodCard(dictionary?.meu_pratinho?.frutas_titulo || 'Frutas',_c0,dictionary?.meu_pratinho?.frutas_desc || 'Fonte de vitaminas, minerais, fibras e energia. Ótimas para sobremesa e lanchinhos. Abacate, abacaxi, banana, caqui, goiaba, kiwi, laranja, maçã, mamão, melancia, morango, pêra, uva.')}
      ${foodCard(dictionary?.meu_pratinho?.cereais_titulo || 'Cereais, Raízes e Tubérculos',_c1,dictionary?.meu_pratinho?.cereais_desc || 'Fontes de vitaminas, minerais e energia. Arroz, macarrão, batata, mandioca, inhame, cará. Varie ao longo da semana e prefira os integrais pela maior presença de fibras e nutrientes.')}
      ${foodCard(dictionary?.meu_pratinho?.oleos_titulo || 'Óleos e Gorduras',_c2,dictionary?.meu_pratinho?.oleos_desc || 'Importantes para o desenvolvimento saudável e absorção de vitaminas. Use pequenas quantidades de azeite de oliva ou óleo de canola. Evite gorduras saturadas, trans, margarina e frituras.')}
      ${foodCard(dictionary?.meu_pratinho?.leite_titulo || 'Leite e Derivados',_c3,dictionary?.meu_pratinho?.leite_desc || 'Fonte de proteína, gordura, cálcio e vitamina A. Leite, coalhadas, iogurtes naturais sem açúcar e queijos. Ótimos para o café da manhã e lanches. Prefira versões integrais.')}
      ${foodCard(dictionary?.meu_pratinho?.oleaginosas_titulo || 'Oleaginosas',_c0,dictionary?.meu_pratinho?.oleaginosas_desc || 'Fontes de vitaminas, fibras, gorduras saudáveis e antioxidantes. Amêndoas, amendoim, avelã, castanha-de-caju, castanha-do-brasil, noz-pecã e pistache. Ótimas para os lanchinhos.')}
    </div>
    <div style="display:flex;justify-content:space-between;border-top:0.2mm solid #ddd;padding-top:2mm;margin-top:2mm;flex-shrink:0;">
      <span style="font-family:'Montserrat',sans-serif;font-size:7pt;color:#999;">${clinicaNome}</span>
      <span style="font-family:'Montserrat',sans-serif;font-size:7pt;font-weight:900;color:${solidColor};text-transform:uppercase;">${dictionary?.meu_pratinho?.guia_alimentar_verso_label || 'GUIA ALIMENTAR: MEU PRATINHO (VERSO)'}</span>
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
      const FRASES_ET = dictionary?.etiqueta_correios?.frases || ['Oba, chegou!','Com muito amor e cuidado','Feito especialmente pra você','Sua encomenda chegou!'];
      const selSize = SIZES_ET[etiquetaSizeIdx] || SIZES_ET[0];
      const selFrase = FRASES_ET[etiquetaFraseIdx] || FRASES_ET[0];
      const BLEED_ET = 3;
      // scaleFactor e maxHeight por formato
      const _etSFMap = [0.30, 0.50, 0.28];
      const _etMaxHMap = ['22mm', '28mm', '20mm'];
      const _etSF = _etSFMap[etiquetaSizeIdx] ?? 0.30;
      const _etMaxH = _etMaxHMap[etiquetaSizeIdx] ?? '22mm';
      // zoom: PDF px/mm (3.78) ÷ preview px/mm
      const _etZoom = (3.78 / selSize.previewScale).toFixed(3);
      const logoHtmlEt = `<div style="zoom:${_etZoom};display:flex;flex-direction:column;align-items:center;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: solidColor, layout: logoLayout || 'stacked', localSlogan, scaleFactor: _etSF, crmLine: null, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: _etMaxH, withBackground: false })}</div>`;
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
      const logoHtmlRA = genPDFLogoHtml({ brand, editDataOverride: editData, color: '#fff', layout: _lyRA, localSlogan, hideSlogan: true, crmLine: null, fontPt: 22, lineH: 1.1, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', withBackground: false });
      const html = buildReceitaAltaHTML({ logoHtml: logoHtmlRA, solidColor, paletteColors, clinicaNome, cartaoContacts, crmLine, marca, fields: receitaFields, comBorda, patternSrc, patternScale, dictionary, lang });
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

    if (item === 'Caneca' || item === 'Arte para Caneca') {
      const solidColor = borderColor || accentColor;
      const _ffC = editData?.fontFamily || brand.editData?.fontFamily || 'Playfair Display';
      const _lfC = LOCAL_FONT_FACES[_ffC];
      const fiC = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">${_lfC ? `<style>${_lfC}</style>` : `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(_ffC)}:wght@400;700&display=swap" rel="stylesheet">`}`;
      const hasCustomLogoC = !!itemEditData?.customLogoSrc;
      const effectiveLayoutC = (comBorda && patternSrc && !hasCustomLogoC) ? 'balanced' : (logoLayout || 'stacked');
      const baseSFC = (comBorda && patternSrc) ? 0.8 : 1.2;
      const _sfC = hasCustomLogoC ? baseSFC * 1.45 : baseSFC; 
      const logoHtmlC = ReactDOMServer.renderToString(<LogoPreviewHTML editData={itemEditData} color="#ffffff" layout={effectiveLayoutC} scaleFactor={_sfC} crm={null} hideTagline={true} withBackground={hasCustomLogoC} />);
      const circleD = 44;
      const circleBgC = (comBorda && patternSrc) ? solidColor + 'd0' : 'rgba(255,255,255,0.22)';
      const bgStyleC = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${(patternScale*0.15).toFixed(1)}mm;background-repeat:repeat;`
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
        { label:'4,8 × 4,8 cm', w:48, h:48, shape:'square' },
        { label:'9 × 4,8 cm',   w:90, h:48, shape:'rect'   },
        { label:'6 × 6 cm',     w:60, h:60, shape:'circle' },
      ];
      const selT = SIZES_T[tagSacolaSizeIdx] || SIZES_T[0];
      const { w: TW, h: TH, shape: TSHAPE } = selT;
      const isCircleT = TSHAPE === 'circle';
      const totalW_T = TW + BLEED * 2;
      const totalH_T = TH + BLEED * 2;

      // Fundo
      const bgSizeMm = ((patternScale || 100) / 10).toFixed(1);
      const bgFixed = comBorda && patternSrc
        ? `background-image:url(${patternSrc});background-size:${bgSizeMm}mm;background-repeat:repeat;`
        : `background:${solidColor};`;

      // Logo — usa genPDFLogoHtml com hideSlogan para logo imagem, mostra slogan para logo texto
      const _hasImgT = !!itemEditData?.customLogoSrc;
      const isRectT = TSHAPE === 'rect'; const _logoBoxW = isCircleT ? (TW * 0.62).toFixed(0) : isRectT ? (TW * 0.58).toFixed(0) : (TW * 0.70).toFixed(0);
      const _logoBoxH = isCircleT ? (TH * 0.55).toFixed(0) : isRectT ? (TH * 0.58).toFixed(0) : (TH * 0.62).toFixed(0);
      const _logoColor = (comBorda && patternSrc) ? solidColor : '#fff';
      const _tagLogoHtml = genPDFLogoHtml({
        brand, editDataOverride: itemEditData,
        color: _logoColor,
        localSlogan: _hasImgT ? null : localSlogan,
        crmLine: null,
        fontPt: Math.min(
          Math.round(parseFloat(_logoBoxW) * 0.29 / (Math.max(...(marca || '').split(' ').map(w => w.length)) * (itemEditData?.fontStyle === 'script' ? 0.70 : 0.55) * 0.353)),
          Math.round(parseFloat(_logoBoxH) * 0.38 / 0.353 / (itemEditData?.fontStyle === 'script' ? 1.5 : 1.1))
        ).toString(),
        lineH: itemEditData?.fontStyle === 'script' ? 1.5 : 1.1,
        letterSp: itemEditData?.fontLetterSpacing || (itemEditData?.fontStyle === 'script' ? '0pt' : '0.5pt'),
        layout: logoLayout || 'stacked',
        customLogoSrc: itemEditData?.customLogoSrc,
        customLogoScale: _hasImgT ? Math.min(getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 100) : 100,
        maxWidth: `${_logoBoxW}mm`,
        maxHeight: `${_logoBoxH}mm`,
        withBackground: !!(comBorda && patternSrc),
        withBackgroundPadding: '2mm 3mm',
        sloganColor: (comBorda && patternSrc) ? undefined : 'rgba(255,255,255,0.75)',
        hideSlogan: _hasImgT,
      });

      // Marcas de corte
      const cms = `
        <div style="position:absolute;top:0;left:${BLEED}mm;width:0.1mm;height:${BLEED - 0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${BLEED}mm;left:0;width:${BLEED - 0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;top:0;right:${BLEED}mm;width:0.1mm;height:${BLEED - 0.5}mm;background:#000;"></div>
        <div style="position:absolute;top:${BLEED}mm;right:0;width:${BLEED - 0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;left:${BLEED}mm;width:0.1mm;height:${BLEED - 0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;left:0;width:${BLEED - 0.5}mm;height:0.1mm;background:#000;"></div>
        <div style="position:absolute;bottom:0;right:${BLEED}mm;width:0.1mm;height:${BLEED - 0.5}mm;background:#000;"></div>
        <div style="position:absolute;bottom:${BLEED}mm;right:0;width:${BLEED - 0.5}mm;height:0.1mm;background:#000;"></div>`;

      const { whatsapp, telefone, instagram, site } = cartaoContacts || {};
      const mainPhone = whatsapp || telefone || '';
      const borderR = isCircleT ? '50%' : '0';

      const frentePageT = `
        <div style="width:${totalW_T}mm;height:${totalH_T}mm;position:relative;overflow:hidden;border-radius:${borderR};">
          <div style="position:absolute;inset:0;${bgFixed}"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;">
            ${_tagLogoHtml}
          </div>
          ${cms}
        </div>`;

      const versoPageT = `
        <div style="width:${totalW_T}mm;height:${totalH_T}mm;position:relative;overflow:hidden;background:#fff;">
          <div style="position:absolute;inset:0;border:5mm solid ${solidColor};border-radius:${borderR};"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;display:flex;flex-direction:column;align-items:center;gap:2mm;text-align:center;overflow:hidden;max-height:80%;">
            ${clinicaNome ? `<div style="font-size:5mm;color:${solidColor};font-family:'Brush Script MT','Segoe Script',cursive;">${clinicaNome}</div>` : ''}
            <div style="width:5mm;height:0.2mm;background:${solidColor}60;"></div>
            ${mainPhone ? `<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;">${mainPhone}</div>` : ''}
            ${instagram ? `<div style="font-size:3mm;color:#888;font-family:'Montserrat',sans-serif;">@${instagram.replace('@','')}</div>` : ''}
            ${site ? `<div style="font-size:2.5mm;color:#bbb;font-family:'Montserrat',sans-serif;">${site}</div>` : ''}
          </div>
          ${cms}
        </div>`;

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tag para Sacola - ${marca}</title>${fiT}
<style>
* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
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
      const _pT = document.title; document.title = pdfTitle('Tag para Sacola');
      iframeT.contentWindow.document.fonts.ready.then(() => { setTimeout(() => { iframeT.contentWindow.focus(); iframeT.contentWindow.print(); setTimeout(() => { document.title = _pT; iframeT.remove(); }, 3000); }, 800); });
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
        const logoHtmlCe = genPDFLogoHtml({ brand, editDataOverride: editData, color: _lColor, layout: _lLayout, localSlogan, crmLine, fontPt: 12, lineH: 1.1, letterSp: '0.5pt', crmSize: '0', customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '38mm', maxHeight: '32mm', withBackground: comBorda && patternSrc });

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
        <div style="text-align:center;font-size:9pt;font-weight:800;color:#aaa;letter-spacing:2pt;text-transform:uppercase;margin-bottom:1mm;">${dictionary?.controle_especial?.titulo || 'RECEITUÁRIO DE CONTROLE ESPECIAL'}</div>

        <div style="display:flex;gap:6mm;align-items:stretch;">
            <div style="flex:2.5;background:${_accent}08;border:0.2mm solid ${_accent}20;padding:3mm 4mm;border-radius:1.5mm;">
                <div style="font-size:7pt;font-weight:800;color:${_accent};margin-bottom:1.5mm;border-bottom:0.2mm solid ${_accent}20;padding-bottom:1mm;text-transform:uppercase;">${dictionary?.controle_especial?.emitente || 'IDENTIFICAÇÃO DO EMITENTE'}</div>
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
                <div style="display:flex;align-items:center;justify-content:center;">${logoHtmlCe}</div>
                <div style="font-size:6.5pt;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:0.5pt;text-align:center;line-height:1.4;white-space:pre-wrap;">${dictionary?.controle_especial?.vias || '1ª VIA FARMÁCIA\n2ª VIA PACIENTE'}</div>
            </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:2.5mm;">
            <div style="border-bottom:0.15mm solid #eee;padding-bottom:1.5mm;display:flex;gap:3mm;"><span style="font-size:8pt;font-weight:700;color:#333;text-transform:uppercase;">${dictionary?.controle_especial?.paciente || 'PACIENTE:'}</span></div>
            <div style="border-bottom:0.15mm solid #eee;padding-bottom:1.5mm;display:flex;gap:3mm;"><span style="font-size:8pt;font-weight:700;color:#333;text-transform:uppercase;">${dictionary?.controle_especial?.endereco || dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:'}</span></div>
            <div style="margin-top:1mm;">
               <div style="font-size:8pt;font-weight:700;color:#333;margin-bottom:1mm;">${dictionary?.controle_especial?.prescricao || 'PRESCRIÇÃO:'}</div>
               ${Array.from({length: 8}).map(() => `<div style="border-bottom:0.1mm solid #f2f2f2;height:7mm;"></div>`).join('')}
            </div>
        </div>

        <div style="margin-top:auto;display:flex;gap:15mm;align-items:flex-start;padding:0 5mm;margin-bottom:3mm;">
             <div style="width:38mm;display:flex;flex-direction:column;align-items:center;">
                <div style="width:100%;border-top:0.2mm solid #999;"></div>
                <div style="font-size:7pt;font-weight:400;margin-top:1.5mm;color:#888;">${dictionary?.controle_especial?.data || 'Data'}</div>
             </div>
             <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                <div style="width:100%;border-top:0.2mm solid #999;"></div>
                <div style="font-size:7pt;font-weight:400;margin-top:1.5mm;color:#888;">${dictionary?.controle_especial?.assinatura || 'Assinatura do Médico'}</div>
             </div>
        </div>

        <div style="display:flex;gap:6mm;height:24mm;">
             <div style="flex:1;background:${_accent}10;border:0.2mm solid ${_accent}25;padding:2.5mm 4mm;border-radius:1.5mm;">
                <div style="font-size:6.5pt;font-weight:800;color:${_accent};margin-bottom:1.5mm;text-align:center;text-transform:uppercase;">${dictionary?.controle_especial?.comprador || 'IDENTIFICAÇÃO DO COMPRADOR'}</div>
                <div style="display:flex;flex-direction:column;gap:1mm;">
                  ${['Nome', 'Ident.', 'Endereço', 'Cidade'].map(f => `<div style="border-bottom:0.1mm solid rgba(0,0,0,0.08);height:3.5mm;"></div>`).join('')}
                </div>
             </div>
             <div style="flex:1;border:0.2mm solid #ddd;border-radius:1.5mm;position:relative;">
                <div style="position:absolute;bottom:2.5mm;left:0;right:0;text-align:center;font-size:6pt;color:#bbb;text-transform:uppercase;font-weight:700;">${dictionary?.controle_especial?.farmaceutico || 'ASSINATURA DO FARMACÊUTICO'}</div>
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
            <div style="display:flex;justify-content:flex-start;">${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '100mm', maxHeight: '36mm', alignLeft: true, withBackground: comBorda && patternSrc })}</div>
            <div style="text-align:right;">
                <div style="font-size:18pt;font-weight:800;color:${accentColor};opacity:0.1;letter-spacing:4pt;line-height:1;">${dictionary?.recibo?.titulo || 'RECIBO'}</div>
            </div>
        </div>

        <div class="field"><span class="label">${dictionary?.recibo?.recebi_de || 'Recebi de'}</span> <div style="flex:1;"></div></div>
        <div class="field"><span class="label">${dictionary?.recibo?.quantia_de || 'A quantia de'}</span> <div style="flex:1;"></div></div>
        <div class="field"><span class="label">${dictionary?.recibo?.referente_a || 'Referente a'}</span> <div style="flex:1;"></div></div>

        <table>
            <thead><tr><th style="width:20%;">${dictionary?.recibo?.data || 'Data'}</th><th>${dictionary?.recibo?.descricao || 'Descrição dos Serviços'}</th><th style="width:25%;text-align:right;">${dictionary?.recibo?.total || 'Total'}</th></tr></thead>
            <tbody>
                ${Array.from({length: 3}).map(() => `<tr><td></td><td></td><td></td></tr>`).join('')}
                <tr><td colspan="2" style="text-align:right;font-weight:700;color:#1a1a1a;text-transform:uppercase;">${dictionary?.recibo?.total || 'TOTAL'}</td><td style="background:#f9f9f9;"></td></tr>
            </tbody>
        </table>

        <div style="margin-top:auto;display:flex;flex-direction:column;align-items:center;padding-top:4mm;">
             <div style="width:80mm;border-top:0.2mm solid #333;margin-bottom:3mm;"></div>
             <div style="font-size:9pt;font-weight:700;color:#1a1a1a;">${clinicaNome || ''}</div>
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
        const isEn = lang === 'en';
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
            fontPt: 30,
            lineH: 1.1,
            letterSp: _letterSp,
            customLogoSrc,
            customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100,
            maxWidth: '18.5mm',
            maxHeight: '9.5mm',
            hideSlogan: true,
            withBackground: comBorda && patternSrc
          });
          const illustSrc = "/breastfeeding-guide.png";

          const pages = [
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage1 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} logoComponent={<div dangerouslySetInnerHTML={{ __html: logoHtmlAmam }} />} folderRoof={folderRoof} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage2 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage3 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage4 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} clinicaNome={clinicaNome} endereco={endereco} allPhones={allPhones} brand={brand} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage5 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage6 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage7 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} /></LanguageOverrideProvider>),
            ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage8 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustSrc} /></LanguageOverrideProvider>),
          ];

          const _amamBg = comBorda && patternSrc
            ? `background-image:url(${patternSrc});background-size:${((patternScale || 100) * 0.35).toFixed(1)}mm;background-repeat:repeat;`
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
            fontPt: 30,
            lineH: 1.1,
            letterSp: _letterSp,
            customLogoSrc,
            customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1),
            maxWidth: '22mm',
            maxHeight: '12mm',
            withBackground: comBorda && !!patternSrc
          });

          const themeTaglinePrenatal = item.includes('Pré-Natal') ? 'CUIDANDO DESDE O INÍCIO..' : 'Saúde e Bem-Estar Pediátrico';
          const finalTaglinePrenatal = (item.includes('Pré-Natal')) ? themeTaglinePrenatal : (brand.editData?.tagline || themeTaglinePrenatal);

          const p1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage1 accentColor={accentColor} palette={paletteColors} logoComponent={<div dangerouslySetInnerHTML={{ __html: logoHtmlPrenatal }} />} folderRoof={folderRoof} tagline={finalTaglinePrenatal} comBorda={comBorda} patternSrc={null} patternScale={patternScale} borderColor={borderColor} /></LanguageOverrideProvider>);
          const p2 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage2 accentColor={accentColor} palette={paletteColors} /></LanguageOverrideProvider>);
          const p3 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage3 accentColor={accentColor} palette={paletteColors} /></LanguageOverrideProvider>);
          const p4 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage4 accentColor={accentColor} palette={paletteColors} comBorda={comBorda} patternSrc={null} patternScale={patternScale} borderColor={borderColor} /></LanguageOverrideProvider>);

          // Escala exata 1px=1mm; fundo das páginas 1 e 4 estendido para cobrir a sangria
          const PX = 3.7795;
          const sX = PX.toFixed(4);
          const sY = PX.toFixed(4);
          const prenatalBg = borderColor || paletteColors[0] || accentColor;
          const prenatalBgStyle = (comBorda && patternSrc)
            ? `background-image:url(${patternSrc});background-size:${((patternScale || 100) * 0.35).toFixed(1)}mm;background-repeat:repeat;`
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
        const p5Content = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;"><div style="width:146px;height:210px;transform:scale(3.60);transform-origin:center center;flex-shrink:0;">${ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}>{React.createElement(Art5, { accentColor, palette: paletteColors })}</LanguageOverrideProvider>)}</div></div>`;

        // Conteúdo da Pág 6 (Contra Capa)
        const p6Content = `
          <div style="width:100%; height:100%; position:relative; display:flex; flex-direction:column; align-items:center;">
            <div class="quote-box" style="position:absolute; top:48%; left:50%; transform:translate(-50%, -50%); width:88%; background:${paletteColors[0] || accentColor}; border:0.4mm solid ${paletteColors[0] || accentColor}; border-radius:4mm; padding:10mm 8mm; text-align:center; box-shadow:0 2mm 8mm rgba(0,0,0,0.1); z-index:3;">
                <div style="font-family:'Brush Script MT','Segoe Script',cursive; font-style:italic; color:#fff !important; -webkit-text-fill-color:#fff; font-size:30pt; margin-bottom:4mm; text-transform:none;">
                   ${isSono 
                     ? (isEn ? '"A well-rested baby is a happier baby!"' : '"Um bebê bem descansado é um bebê mais feliz!"')
                     : isCuidados 
                       ? (isEn ? '"You don\'t need to be perfect — you need to be present."' : '"Você não precisa ser perfeita — precisa estar presente."')
                       : isVacina 
                         ? (isEn ? '"Protection that starts from day one."' : '"Proteção que começa desde o primeiro dia."') 
                         : (isEn ? '"Play, talk and explore!"' : '"Brinque, converse e explore!"')}
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:9pt;color:#fff !important;-webkit-text-fill-color:#fff;font-weight:500;line-height:1.5;">
                   ${isSono 
                     ? (isEn 
                        ? 'Sleep is an essential physiological need for your baby\'s development. A consistent routine, safe environment, and respecting sleep cues make all the difference. You are not alone in this journey!' 
                        : 'O sono é uma necessidade fisiológica essencial para o desenvolvimento do seu bebê. Uma rotina consistente, ambiente seguro e respeito aos sinais de sono fazem toda a diferença. Você não está sozinha nessa jornada!')
                     : isCuidados 
                       ? (isEn 
                          ? 'Caring for a baby is learning along with them. Every doubt is normal, every achievement is yours too. You are doing an amazing job.' 
                          : 'Cuidar de um bebê é aprender junto com ele. Cada dúvida é normal, cada conquista é sua também. Você está fazendo um trabalho incrível.')
                       : isVacina 
                         ? (isEn 
                            ? 'Vaccination is the greatest act of love and care. It protects not only your baby, but the entire community around them. Keep the records up to date and count on us to accompany each step of this protection.' 
                            : 'A vacinação é o maior gesto de amor e cuidado. Ela protege não apenas o seu bebê, mas toda a comunidade ao redor. Mantenha a carteirinha sempre em dia e conte conosco para acompanhar cada etapa dessa proteção.')
                         : (isEn 
                            ? 'Playtime is more than just fun. It helps your baby learn, develop new skills, and feel safe and loved. Ask questions, sing, play peek-a-boo and watch how much your baby grows every day.' 
                            : 'As brincadeiras são mais do que momentos de diversão. Elas ajudam seu bebê a aprender, a desenvolver novas habilidades e a se sentir seguro e amado. Pergunte, cante, brinque de esconde-esconde e observe o quanto seu bebê cresce a cada dia.')}
                </div>
            </div>

            <div style="position:absolute; top:75%; width:100%; opacity:0.3; display:flex; justify-content:center; gap:5mm; z-index:2;">
               ${Array.from({length: 8}).map((_, i) => `<div style="width:2.5mm;height:2.5mm;background:${accentColor};border-radius:50%;"></div>`).join('')}
            </div>

            <div style="width:100%; margin-top:auto;">
                ${genPDFSimpleFooter({ 
                  allPhones,
                  email: brand.email || '',
                  site: site || '',
                  instagram: instagram || '',
                  clinicaNome: clinicaNome || brand.clinicaNome || marca || '',
                  endereco: endereco || '',
                  accentColor
                })}
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
          fontPt: 30, 
          lineH: 1.1, 
          letterSp: _letterSp, 
          customLogoSrc, 
          customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), 
          maxWidth: '30mm', 
          maxHeight: '12mm' 
        });
        const p1Content = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10mm;text-align:center;height:100%;">
              <div style="margin-bottom:12mm;width:110mm;display:flex;justify-content:center;">${genPDFLogoHtml({
                brand,
                editDataOverride: editData,
                color: logoColor,
                layout: logoLayout||'stacked',
                localSlogan,
                crmLine,
                fontPt: 38,
                lineH: 1.1,
                letterSp: _letterSp,
                customLogoSrc,
                customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1),
                maxWidth: '68mm',
                maxHeight: '48mm',
                hideSlogan: false
              })}</div>
              <div style="width:30mm;height:1.2mm;background:${accentColor};margin-top:4mm;margin-bottom:15mm;border-radius:1mm;"></div>
              
              <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:2mm;">
                  <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:12pt;color:${accentColor}cc;letter-spacing:1.5pt;text-transform:uppercase;margin-bottom:4mm;font-style:italic;">
                     ${item.includes('Alimentar') || item.includes('Cuidados') || item.includes('Desenvolvimento') || item.includes('Vacina') 
                       ? (isEn ? 'GUIDE TO' : 'GUIA DE') 
                       : item.includes('Sono') 
                         ? (isEn ? 'GUIDE TO' : 'GUIA DO') 
                         : (isEn ? 'PRENATAL' : 'CARTÃO DE')}
                  </div>
                  <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:24pt;color:#1a1a1a;letter-spacing:1.2pt;text-transform:uppercase;line-height:1.25;">
                     ${item.includes('Alimentar') ? (isEn ? 'COMPLEMENTARY<br/>FEEDING' : 'INTRODUÇÃO<br/>ALIMENTAR') :
                       item.includes('Cuidados') ? (isEn ? 'BABY CARE' : 'CUIDADOS<br/>COM O BEBÊ') :
                       item.includes('Desenvolvimento') ? (isEn ? 'DEVELOPMENT' : 'DESENVOLVIMENTO') :
                       item.includes('Vacina') ? (isEn ? 'VACCINATION' : 'VACINAÇÃO') :
                       item.includes('Sono') ? (isEn ? 'HEALTHY<br/>SLEEP' : 'SONO<br/>SAUDÁVEL') : (isEn ? 'PRENATAL<br/>CARD' : 'EXAME<br/>PRÉ-NATAL')}
                  </div>
              </div>

              <div style="padding:2.5mm 10mm; background:${(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '28'}; border-radius:15mm; border:0.25mm solid ${(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor) + '50'}; margin-top:1.5mm;">
                  <div style="font-family:'Montserrat', sans-serif; font-size:10pt; font-weight:800; color:${_darkenHex(isPrenatal ? paletteColors[0] || accentColor : paletteColors[1] || accentColor)}; text-transform:uppercase; letter-spacing:1pt;">
                     ${isSono 
                       ? (isEn ? 'SLEEP WELL, GROW WELL' : 'DURMA BEM, CRESÇA BEM') 
                       : isCuidados 
                         ? (isEn ? 'FROM DAY ONE WITH MUCH LOVE' : 'DO PRIMEIRO DIA COM MUITO AMOR') 
                         : isDev 
                           ? (isEn ? 'EVERY DAY A NEW DISCOVERY' : 'CADA DIA UM NOVO DISCOBRIMENTO') 
                           : isVacina 
                             ? (isEn ? 'PROTECTED FROM DAY ONE' : 'PROTEGIDO DESDE O PRIMEIRO DIA') 
                             : isPrenatal 
                               ? (isEn ? 'CARING FOR MOTHER AND BABY HEALTH' : 'CUIDANDO DA SAÚDE DA MAMÃE E DO BEBÊ') 
                               : (isEn ? 'NUTRITION THAT TRANSFORMS' : 'NUTRIÇÃO QUE TRANSFORMA')}
                  </div>
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
          { num: 2, w: W3, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:148px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}>{React.createElement(Art2, { accentColor, palette: paletteColors })}</LanguageOverrideProvider>)}</div>` },
          { num: 3, w: W2, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:148px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}>{React.createElement(Art3, { accentColor, palette: paletteColors })}</LanguageOverrideProvider>)}</div>` },
          { num: 4, w: W1, content: `<div style="position:absolute;top:3.5mm;left:3.5mm;width:146px;height:210px;transform:scale(${sInner});transform-origin:top left;">${ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}>{React.createElement(Art4, { accentColor, palette: paletteColors, ...(item === 'Guia Alimentar' ? { horarios: guiaHorarios, introducao: guiaIntroducao } : {}) })}</LanguageOverrideProvider>)}</div>` }
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
    ${genPDFLogoHtml({ brand, editDataOverride: editData, color: accentColor, localSlogan: '', crmLine: '', fontPt: 24, lineH: _lineH, letterSp: _letterSp, hideSlogan: true, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '40mm', maxHeight: '20mm', withBackground: comBorda && patternSrc })}
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
        const _STORY_TMPLS = getStoryTemplates(dictionary);
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
    ${genPDFLogoHtml({ brand, editDataOverride: editData, color: accentColor, localSlogan, crmLine, fontPt: 32, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '100mm', maxHeight: '36mm', withBackground: comBorda && patternSrc })}
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
        const _clipRoof = folderRoof ? 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)' : 'none';

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
<div style="position:absolute; inset:0; overflow:hidden;">
  ${effectiveSrc
    ? `<div style="position:absolute; inset:0; background-image:url(${effectiveSrc}); background-size:${((patternScale || 100) * 0.5).toFixed(1)}mm; background-repeat:repeat;"></div>`
    : `<div style="position:absolute; inset:0; background:${solidColor};"></div>`}
  <div style="position:absolute; top:${BLEED + BORDER}mm; left:${BLEED + BORDER}mm; right:${BLEED + BORDER}mm; bottom:${BLEED + BORDER}mm; background:#fff; clip-path:${_clipRoof}; -webkit-clip-path:${_clipRoof};"></div>

  <div style="position:absolute; top:${BLEED + BORDER + (folderRoof ? 22 : 14)}mm; left:50%; transform:translateX(-50%); width:120mm; display:flex; justify-content:center;">
    ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: _fontPt, lineH: _lineH, letterSp: _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1) : 100, maxWidth: '120mm', maxHeight: '45mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); opacity:0.15; width:170mm; display:flex; justify-content:center; pointer-events:none;">
    ${genPDFLogoHtml({ brand, editDataOverride: editData, color: logoColor, layout: logoLayout, localSlogan, crmLine, fontPt: 72, lineH: _lineH, letterSp: _letterSp, hideSlogan: true, customLogoSrc, customLogoScale: getCustomLogoScale(item) * (ITEM_CUSTOM_BASE_SCALES[item] || 1), maxWidth: '160mm', maxHeight: '80mm', withBackground: comBorda && patternSrc })}
  </div>

  <div style="position:absolute; bottom:${BLEED + 6}mm; left:0; right:0; text-align:center;">
    ${genPDFSimpleFooter({ 
      clinicaNome,
      endereco,
      allPhones,
      email: brand.email || '',
      site: site || '',
      instagram: instagram || ''
    })}
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
        const logoHtmlCe = genPDFLogoHtml({ brand, editDataOverride: editData, color: _lColor, layout: logoLayout, localSlogan, crmLine, fontPt: logoLayout === 'horizontal' ? (marca.length > 18 ? 16 : marca.length > 12 ? 20 : 24) : _fontPt, lineH: _lineH, letterSp: editData?.fontLetterSpacing || brand.editData?.fontLetterSpacing || _letterSp, customLogoSrc, customLogoScale: customLogoSrc ? getCustomLogoScale(item) * 2.5 : 100, maxWidth: '100mm', maxHeight: '28mm', withBackground: comBorda && patternSrc });

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
        
        <div style="margin-bottom:18mm;display:flex;justify-content:center;align-items:center;">
            ${logoHtmlCe}
        </div>

        <div style="font-family:'Montserrat',sans-serif;font-size:10pt;font-weight:600;color:#7a7a7a;letter-spacing:0.8pt;margin-bottom:0;">${dictionary?.certificado?.pediatrico_de || 'Certificado Pediátrico de'}</div>
        <h2 style="font-family:'Playfair Display',serif;font-size:48pt;font-weight:700;color:${solidColor};margin:0 0 10mm;letter-spacing:1pt;">${dictionary?.certificado?.coragem || 'Coragem'}</h2>

        <div style="font-family:'Montserrat',sans-serif;font-size:14pt;font-weight:400;color:#5a5a5a;text-align:center;line-height:2.0;width:90%;margin-top:0;">
            <div style="margin:0;">${dictionary?.certificado?.certifico_fins || 'Certifico para os devidos e lúdicos fins, que __________________'}</div>
            <div style="margin:0;">${dictionary?.certificado?.idade_comportou || 'idade _____ comportou-se corretamente na consulta de hoje,'}</div>
            <div style="margin:0;">${dictionary?.certificado?.sendo_educado || 'sendo educado e demonstrando muita coragem e valentia.'}</div>
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
      'Agradecimento':       { w: 100, h: 150, bleed: 3 },
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
      <div style="position:absolute; bottom:10mm; left:12mm; right:12mm; border-top:0.5px solid #e0e0e0; padding-top:4mm; text-align:center; z-index:4;">
          <div style="font-family:'Montserrat',sans-serif; font-size:7.5pt; font-weight:700; color:#444; margin-bottom:1mm;">${allPhones}</div>
          <div style="font-family:'Montserrat',sans-serif; font-size:6.5pt; color:#999; font-weight:500; letter-spacing:0.2px;">
              ${[instagram ? `@${instagram}` : '', email, site].filter(Boolean).join('  ·  ')}
          </div>
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
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>
        {(() => {
          if (!currentItem) return '';
          const keyMap = {
            'Cartão de Visita': 'cartao_visita',
            'Papel Timbrado': 'papel_timbrado',
            'Papel de Presente': 'papel_presente',
            'Tag para Sacola': 'tag_sacola',
            'Etiqueta para Correios': 'etiqueta_correios',
            'Envelope Ofício (23x11,5cm)': 'envelope_oficio',
            'Envelope Ofício': 'envelope_oficio',
            'Envelope Saco (24x34cm)': 'envelope_saco',
            'Envelope Saco': 'envelope_saco',
            'Recibo': 'recibo',
            'Pasta A4': 'pasta_a4',
            'Pasta': 'pasta_a4',
            'Caneca': 'caneca',
            'Arte para Caneca': 'arte_caneca',
            'Cartão de Retorno': 'cartao_retorno',
            'Cartão de Agradecimento (10x15cm)': 'cartao_agradecimento',
            'Cartão de Agradecimento': 'cartao_agradecimento',
            'Caderno (Capa e Contra-capa)': 'caderno',
            'Caderno': 'caderno',
            'Receituário Padrão (A4 e A5)': 'receituario_padrao',
            'Receituário Padrão': 'receituario_padrao',
            'Receituário': 'receituario_padrao',
            'Atestado Médico (A4 e A5)': 'atestado_medico',
            'Atestado Médico': 'atestado_medico',
            'Receituário de Controle Especial': 'receituario_controle',
            'Controle Especial (A4 e A5)': 'receituario_controle',
            'Controle Especial': 'receituario_controle',
            'Prontuário Médico': 'prontuario_medico',
            'Receita de Alta': 'receita_alta',
            'Ficha de Cadastro': 'ficha_cadastro',
            'Guia Alimentar': 'guia_alimentar',
            'Guia de Cuidados': 'guia_cuidados',
            'Guia de Desenvolvimento': 'guia_desenvolvimento',
            'Guia de Vacina c/ Calendário': 'guia_vacina',
            'Guia de Vacina': 'guia_vacina',
            'Cartão de Vacina': 'cartao_vacina',
            'Cartão de Exame Pré-Natal': 'cartao_prenatal',
            'Cartão Pré-Natal': 'cartao_prenatal',
            'Gráfico de Crescimento': 'grafico_crescimento',
            'Checklist Maternidade': 'checklist_maternidade',
            'Guia do Sono': 'guia_sono',
            'Orientações p/ Recém Nascidos': 'orientacoes_rn',
            'Certificado de Coragem': 'certificado_coragem',
            'Diário do Xixi': 'diario_xixi',
            'Meu Pratinho': 'meu_pratinho',
            'Guia de Amamentação': 'guia_amamentacao',
            'Caderneta de Saúde': 'caderneta_saude',
            'Pack Digital para Instagram': 'pack_instagram',
            'Assinatura de E-mail': 'assinatura_email'
          };
          const key = keyMap[currentItem];
          if (key && dictionary?.papelaria_itens?.[key]) {
            return dictionary.papelaria_itens[key];
          }
          // Fallback parsing for anything missed
          const baseName = currentItem.split('(')[0].split(' c/ ')[0].split(' p/ ')[0].trim();
          let fKey = baseName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
          if (fKey === 'guia_de_vacina' || fKey === 'cartao_de_vacina') fKey = 'guia_vacina';
          if (fKey === 'orientacoes') return dictionary?.papelaria_itens?.orientacoes_rn || currentItem;
          if (fKey === 'diario_do_xixi') fKey = 'diario_xixi';
          if (fKey === 'guia_de_amamentacao') fKey = 'guia_amamentacao';
          if (fKey === 'guia_de_cuidados') fKey = 'guia_cuidados';
          if (fKey === 'guia_de_desenvolvimento') fKey = 'guia_desenvolvimento';
          if (fKey === 'guia_do_sono') fKey = 'guia_sono';
          if (fKey === 'controle_especial' || fKey === 'receituario_de_controle_especial') fKey = 'receituario_controle';
          if (fKey === 'pasta') fKey = 'pasta_a4';
          const t = dictionary?.papelaria_itens?.[fKey];
          if (!t) return currentItem;
          if (currentItem.includes('(A4 e A5)')) return `${t} ${lang === 'en' ? '(A4 & A5)' : '(A4 e A5)'}`;
          if (currentItem.includes('c/ Calendário')) return `${t} ${lang === 'en' ? 'w/ Calendar' : 'c/ Calendário'}`;
          return t;
        })()}
      </div>

      {/* Escala da logo — só para logo de imagem; logo de texto usa autoFit */}
      {customLogoSrc && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
          <span style={{ fontSize: '0.68rem', color: '#999', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>{dictionary?.ui?.escala_logo || 'Escala da logo'}</span>
          <input type="range" min="10"
            max={currentItem.includes('Cartão de Visita') && cartaoRetrato ? 105 : getCustomLogoScaleMax(currentItem)}
            step="5"
            value={Math.min(getCustomLogoScale(currentItem), currentItem.includes('Cartão de Visita') && cartaoRetrato ? 105 : getCustomLogoScaleMax(currentItem))}
            onChange={e => setCustomLogoScale(currentItem, parseInt(e.target.value))}
            style={{ flex: 1, accentColor }} />
          <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{getCustomLogoScale(currentItem)}%</span>
        </div>
      )}

      {/* Preview inline */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px', paddingBottom: '8px', width: '100%' }}>
        <UniversalPreviewScaler targetWidth={getPreviewTargetWidth(currentItem)}>
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
            : currentItem.includes('Agradecimento')
              ? <CartaoAgradecimentoPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} sizeIdx={agradecimentoSizeIdx} setSizeIdx={setAgradecimentoSizeIdx} msgIdx={agradecimentoMsgIdx} setMsgIdx={setAgradecimentoMsgIdx} />
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
            : currentItem === 'Caneca' || currentItem === 'Arte para Caneca'
              ? <CanecaPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} submarcaColor={submarcaColor} submarcaTextColor={submarcaTextColor} iconPath={iconPath} />
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
            : currentItem === 'Guia Alimentar'
              ? <GuiaAlimentarPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} cartaoContacts={cartaoContacts} folderRoof={folderRoof} setFolderRoof={setFolderRoof} crmLine={crmLine} horarios={guiaHorarios} setHorarios={setGuiaHorarios} introducao={guiaIntroducao} setIntroducao={setGuiaIntroducao} localSlogan={localSlogan} />
            : currentItem === 'Caderneta de Saúde'
              ? <CadernetaPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} setLocalSlogan={setLocalSlogan} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} crmData={crmData} setCrmData={setCrmData} setCartaoContacts={setCartaoContacts} isSaude={isSaude} />
            : ['Guia de Desenvolvimento', 'Guia de Vacina c/ Calendário', 'Cartão de Vacina', 'Guia do Sono'].some(n => currentItem === n)
              ? <FolderTrifoldPreview brand={brand} editData={itemEditData} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} patternScale={patternScale} setPatternScale={setPatternScale} accentColor={accentColor} borderColor={borderColor} setBorderColor={setBorderColor} paletteColors={paletteColors} title={currentItem} cartaoContacts={cartaoContacts} folderRoof={folderRoof} setFolderRoof={setFolderRoof} crmLine={crmLine} />
            : currentItem.includes('Atestado Médico')
              ? <AtestadoPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} crmLine={crmLine} clinicaNome={clinicaNome} marca={marca} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={setFolderRoof} paperSize={paperSize} setPaperSize={setPaperSize} atestadoModelo={atestadoModelo} setAtestadoModelo={setAtestadoModelo} />
            : currentItem.includes('Pasta')
              ? <PastaPreview brand={brand} editData={{ ...itemEditData, tagline: localSlogan }} accentColor={accentColor} solidColor={paletteColors[0]} logoColor={logoColor} logoLayout={logoLayout} isSaude={isSaude} crmLine={crmLine} clinicaNome={clinicaNome} cartaoContacts={cartaoContacts} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={setFolderRoof} />
            : currentItem === 'Papel Timbrado'
              ? <PapelTimbradoPreview brand={brand} editData={itemEditData} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} folderRoof={folderRoof} setFolderRoof={setFolderRoof} />
            : currentItem === 'Pack Digital para Instagram'
              ? <FundoInstaPreview brand={brand} editData={itemEditData} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />
            : currentItem === 'Assinatura de E-mail'
              ? <AssinaturaEmailPreview brand={brand} editData={itemEditData} accentColor={accentColor} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} setCartaoContacts={setCartaoContacts} setClinicaNome={setClinicaNome} setLocalSlogan={setLocalSlogan} />
            : currentItem.includes('Certificado')
              ? <CertificadoCoragemPreview accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
            : currentItem.includes('Caderno')
              ? <CadernoPreview editData={{ ...itemEditData, tagline: localSlogan }} accentColor={accentColor} solidColor={paletteColors[0]} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} patternSrc={patternSrc} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} paperSize={paperSize} setPaperSize={setPaperSize} cartaoContacts={cartaoContacts} clinicaNome={clinicaNome} />
            : ['Receituário','Timbrado','Cartão','Guia','Calendário','Atestado','Dicas','Ficha','Orientação','Checklist','Prontuário','Receita','Quadro','Gráfico','Diário','Card','Pratinho','Fundo','Arte','Etiqueta','Assinatura','Tag'].some(n => currentItem.includes(n))
              ? <A5ItemPreview item={currentItem} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} clinicaNome={clinicaNome} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} folderRoof={folderRoof} setFolderRoof={['Receituário','Atestado','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? setFolderRoof : undefined} paperSize={['Receituário','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? paperSize : undefined} setPaperSize={['Receituário','Recibo','Ficha','Prontuário','Certificado','Checklist'].some(n => currentItem.includes(n)) ? setPaperSize : undefined} />
            : <GenericItemPreview item={currentItem} marca={marca} accentColor={accentColor} patternSrc={patternSrc} editData={{ ...itemEditData, tagline: localSlogan }} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
          }
        </UniversalPreviewScaler>
      </div>

      {/* Aviso preview ilustrativo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '6px 10px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
        <span style={{ fontSize: '0.6rem', color: '#aaa', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.4 }}>
          ℹ️ <strong style={{ color: '#bbb' }}>{dictionary?.ui?.preview_aviso || 'Preview ilustrativo.'}</strong> {dictionary?.ui?.preview_aviso_desc || 'Proporções e tamanhos podem variar. Confira as dimensões reais no PDF antes de enviar para a gráfica.'}
        </span>
      </div>

      {/* Editar contatos — acordeão (todos os itens exceto caneca) */}
      {currentItem !== 'Caneca' && currentItem !== 'Arte para Caneca' && <div style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
          <button onClick={() => setContactOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#555' }}>{dictionary?.ui?.editar_dados || 'Editar dados'}</span>
            <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{contactOpen ? '▲' : '▼'}</span>
          </button>
          {contactOpen && (
            <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>{dictionary?.ui?.company || 'Empresa'}</span>
                <input
                  value={clinicaNome}
                  onChange={e => setClinicaNome(e.target.value)}
                  placeholder={dictionary?.ui?.company_placeholder || "Nome complementar (opcional)"}
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              {isSaude && (
                <div style={{ paddingBottom: '8px', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>CRM /</span>
                    <input value={crmData.uf} onChange={e => setCrmData(d => ({ ...d, uf: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="UF"
                      style={{ width: '44px', padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center', outline: 'none' }} />
                    <input value={crmData.crm} onChange={e => setCrmData(d => ({ ...d, crm: e.target.value }))} placeholder={dictionary?.ui?.number || "Número"}
                      style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  {crmData.rqe.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#888', width: '74px', flexShrink: 0 }}>RQE</span>
                      <input value={r} onChange={e => setCrmData(d => { const rqe = [...d.rqe]; rqe[i] = e.target.value; return { ...d, rqe }; })} placeholder={dictionary?.ui?.number || "Número"}
                        style={{ flex: 1, padding: '6px', fontSize: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' }} />
                      <button onClick={() => setCrmData(d => ({ ...d, rqe: d.rqe.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: '#c00', fontSize: '1rem', cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => setCrmData(d => ({ ...d, rqe: [...d.rqe, ''] }))} style={{ background: 'none', border: '1px dashed #ddd', color: '#888', borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    {dictionary?.ui?.add_rqe || '+ Adicionar RQE'}
                  </button>
                </div>
              )}
              {[
                { key: 'telefone', label: dictionary?.ui?.phone || 'Telefone' },
                { key: 'telefone2', label: dictionary?.ui?.phone2 || 'Telefone 2' },
                { key: 'whatsapp', label: 'WhatsApp' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'email', label: 'E-mail' },
                { key: 'site', label: dictionary?.ui?.website || 'Site' },
                { key: 'endereco', label: dictionary?.ui?.address || 'Endereço' },
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
          'Cartão de Retorno':      { cat: 'Cartão de retorno / fidelidade', tam: '9 × 4,8 cm', papel: 'Couché Fosco 300g', acabamento: 'Refile', preco: '~R$52,94 / 250 un.' },
          'Agradecimento':          { cat: 'Cartão de agradecimento', tam: '10 × 15 cm', papel: 'Couché Fosco 250g+', acabamento: 'Refile', preco: '~R$85,00 / 100 un.' },
          'Pasta':                  { cat: 'Pasta com bolsa', tam: '22 × 31 cm fechada · gabarito 485×385mm', papel: 'Cartão 300g', acabamento: 'Faca c/ Bolsa · Vinco · Dobra', preco: '~R$205,04 / 50 un.' },
          'Envelope Ofício (23x11,5cm)': { cat: 'Envelope', tam: '23 × 11,5 cm', papel: 'Offset 90g', acabamento: 'Faca especial · Cola', preco: '~R$319,24 / 50 un.' },
          'Envelope Saco (24x34cm)':   { cat: 'Envelope Saco', tam: '24 × 34 cm', papel: 'Offset 120g', acabamento: 'Faca especial · Cola', preco: '~R$400,00 / 50 un.' },
          'Envelope Ofício':        { cat: 'Envelope', tam: '23 × 11,5 cm', papel: 'Offset 90g', acabamento: 'Faca especial · Cola', preco: '~R$319,24 / 50 un.' },
          'Envelope Saco':          { cat: 'Envelope Saco', tam: '24 × 34 cm', papel: 'Offset 120g', acabamento: 'Faca especial · Cola', preco: '~R$400,00 / 50 un.' },
          'Recibo':                 { cat: 'Recibo', tam: 'A5 (14,8 × 21 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$120,84 / 10 blocos' },
          'Caneca':                 { cat: 'Caneca', tam: 'Arte: 20 × 8 cm', papel: 'Cerâmica', acabamento: 'Sublimação', preco: '~R$33,93 / un.' },
          'Receituário Padrão (A4 e A5)': { cat: 'Receituário', tam: 'A5 (14,8×21 cm) ou A4 (21×29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$109,19 / 10 blocos' },
          'Receituário Padrão':      { cat: 'Receituário', tam: 'A5 (14,8×21 cm) ou A4 (21×29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$109,19 / 10 blocos' },
          'Atestado Médico (A4 e A5)': { cat: 'Atestado', tam: 'A5 (14,8×21 cm) ou A4 (21×29,7 cm)', papel: 'Offset 90g', acabamento: 'Blocado Colado · 25 vias', preco: '~R$109,19 / 10 blocos' },
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
          'Caderno (Capa e Contra-capa)': { cat: 'Caderno Capa Dura', tam: '17 × 24 cm ou 21 × 28 cm', papel: 'Capa Rígida + Miolo Offset 70g (192 pág.)', acabamento: 'Wire-o preto · Laminação Fosca', preco: '~R$45,28 / un. (10 un.)' },
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
                <button onClick={() => { setShowPrintModal(false); openGabarito(pendingItem); }} style={{ flex: 2, padding: '11px', background: '#C03B66', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Entendi, baixar PDF →</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Botão download ou comprar */}
      {(() => {
        const isItemOwned = isProPlan || ownedItems.includes(currentItem);
        if (!isItemOwned) {
          return (
            <button
              onClick={() => handleAvulsoCheckout(currentItem)}
              disabled={upsellLoading}
              style={{ width: '100%', padding: '10px', background: '#C03B66', color: '#fff', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', cursor: upsellLoading ? 'wait' : 'pointer', marginBottom: '8px', opacity: upsellLoading ? 0.7 : 1, transition: 'all 0.2s' }}
            >
              {upsellLoading ? 'Aguarde...' : `🔒 Comprar Arquivo - R$ ${currentItem === 'Caderneta de Saúde' ? '180,00' : '30,00'}`}
            </button>
          );
        } else {
          return (
            <button
              onClick={() => { if (currentItem === 'Pack Digital para Instagram' || currentItem === 'Assinatura de E-mail') { openGabarito(currentItem); } else { setPendingItem(currentItem); setShowPrintModal(true); } }}
              style={{ width: '100%', padding: '10px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.2s' }}
            >
              {currentItem === 'Pack Digital para Instagram' ? (dictionary?.ui?.baixar_png || '⬇ Baixar PNG / JPG') : currentItem === 'Assinatura de E-mail' ? (dictionary?.ui?.baixar_assinatura || '⬇ Baixar Assinatura') : (dictionary?.ui?.baixar_pdf || '⬇ Baixar PDF Padrão Gráfica')}
            </button>
          );
        }
      })()}

      {/* Upsell: opções extras ocultas */}
      {(() => {
        if (isProPlan) return null; // Se for PRO, não tem upsell

        const todosDisponiveis = [...PAPELARIA_GERAL, ...(isSaude ? PAPELARIA_MEDICA : []), ...(isSaude ? DIGITAIS_MEDICOS : [])];
        const faltando = todosDisponiveis.filter(i => !ownedItems.includes(i));
        if (faltando.length === 0) return null;

        const isAvulsoMode = plano === 'avulso';
        
        // Recalcular total se houver selecionados
        const temCadernetaSelecionada = upsellSelecionados.includes("Caderneta de Saúde");
        const itensNormaisSelecionados = upsellSelecionados.filter(i => i !== "Caderneta de Saúde");
        const extraNormalItems = (isAvulsoMode && !temCadernetaSelecionada) ? 1 : 0; // Wait, we don't force them to buy the current item if they are buying via the bulk menu, but the handleUpsellCheckout adds it!
        // Actually, handleUpsellCheckout forces adding brand.papelariaSelecionada if avulsoMode. Let's make it clearer.
        const totalCalculado = (itensNormaisSelecionados.length * 30) + (temCadernetaSelecionada ? 180 : 0);
        const numItemsText = upsellSelecionados.length;

        return (
          <div style={{ marginTop: '16px' }}>
            <button onClick={() => setShowUpsell(!showUpsell)} style={{ background: 'transparent', border: 'none', color: '#c87000', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, width: '100%', justifyContent: 'center' }}>
              {showUpsell ? 'Ocultar outros itens' : 'Ver outros itens que você pode ter deixado de fora'} {showUpsell ? '▲' : '▼'}
            </button>
            {showUpsell && (
              <div style={{ marginTop: '12px', padding: '16px 18px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Montserrat,sans-serif', marginBottom: '10px' }}>
                  + Adicionar mais itens — R$ 30 cada
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {faltando.map(item => {
                    const isCaderneta = item === "Caderneta de Saúde";
                    const sel = upsellSelecionados.includes(item);
                    const btnStyle = {
                      padding: '5px 12px',
                      borderRadius: '20px',
                      border: `1.5px solid ${sel ? (isCaderneta ? '#e6af2e' : accentColor) : (isCaderneta ? '#f0d38d' : '#ddd')}`,
                      background: sel ? (isCaderneta ? '#fffcf0' : `${accentColor}12`) : '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: sel ? (isCaderneta ? '#b5891b' : accentColor) : (isCaderneta ? '#b5891b' : '#888'),
                      fontFamily: 'Montserrat,sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    };
                    return (
                      <button key={item} onClick={() => {
                        setUpsellSelecionados(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                      }} style={btnStyle}>
                        {isCaderneta
                          ? `${sel ? '✓ ' : '+ '}👑 Caderneta de Saúde (Premium - R$ 180)`
                          : `${sel ? '✓ ' : '+ '}${tItem(item, dictionary)}`}
                      </button>
                    );
                  })}
                </div>
                {upsellSelecionados.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333', fontFamily: 'Montserrat,sans-serif' }}>
                      {numItemsText} item{numItemsText > 1 ? 's' : ''} · <strong>R$ {totalCalculado.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <button onClick={handleUpsellCheckout} disabled={upsellLoading} style={{ padding: '8px 20px', background: accentColor, color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Montserrat,sans-serif', cursor: upsellLoading ? 'wait' : 'pointer', opacity: upsellLoading ? 0.7 : 1 }}>
                      {upsellLoading ? 'Aguarde...' : 'Comprar →'}
                    </button>
                  </div>
                )}
                {upsellErro && <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#e55', fontFamily: 'Montserrat,sans-serif' }}>{upsellErro}</div>}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function EntregaContent({ brand, plano, setBrand }) {
  const { dictionary } = useTranslation();
  const tLogo = dictionary?.logo_tab || {};
  const _params = useSearchParams();
  const avulsoParam = _params.has('avulso') ? (_params.get('avulso') || 'inicio') : null;
  const [step, setStepState] = useState('placa');
  const setStep = (s) => { setStepState(s); try { localStorage.setItem(`brandbox_step_${brand.id}`, s); } catch {} };
  // Avulso começa nos impressos, não no brand board
  React.useEffect(() => { if (brand.plano === 'avulso') setStepState('papelaria'); }, []);

  const [bgColor, setBgColor] = useState('#ffffff');
  const [submarcaBg, setSubmarcaBg] = useState(null); // null = usa accentColor como padrão
  const [submarcaColor, setSubmarcaColorState] = useState(() => { try { return localStorage.getItem(`brandbox_submarca_color_${brand.id}`) || null; } catch { return null; } });
  const setSubmarcaColor = (c) => { setSubmarcaColorState(c); try { localStorage.setItem(`brandbox_submarca_color_${brand.id}`, c); } catch {} };
  const [submarcaTextColor, setSubmarcaTextColorState] = useState(() => { try { return localStorage.getItem(`brandbox_submarca_text_color_${brand.id}`) || '#ffffff'; } catch { return '#ffffff'; } });
  const setSubmarcaTextColor = (c) => { setSubmarcaTextColorState(c); try { localStorage.setItem(`brandbox_submarca_text_color_${brand.id}`, c); } catch {} };
  const [submarcaTextType, setSubmarcaTextTypeState] = useState(() => { try { return localStorage.getItem(`brandbox_submarca_text_type_${brand.id}`) || 'marca'; } catch { return 'marca'; } });
  const setSubmarcaTextType = (t) => { setSubmarcaTextTypeState(t); try { localStorage.setItem(`brandbox_submarca_text_type_${brand.id}`, t); } catch {} };
  const [logoColor, setLogoColorState] = useState(() => { try { return localStorage.getItem(`brandbox_logo_color_${brand.id}`) || brand.activeColor || '#dc3495'; } catch { return brand.activeColor || '#dc3495'; } });
  const setLogoColor = (c) => { setLogoColorState(c); try { localStorage.setItem(`brandbox_logo_color_${brand.id}`, c); } catch {} };
  const [logoLayout, setLogoLayout] = useState(() => {
    const rawMarca = brand.editData?.marca || '';
    const defaultLayout = rawMarca.includes(',') ? 'balanced' : 'inline';
    try { return localStorage.getItem(`brandbox_logo_layout_${brand.id}`) || defaultLayout; } catch { return defaultLayout; }
  });
  const setLayout = (l) => { setLogoLayout(l); try { localStorage.setItem(`brandbox_logo_layout_${brand.id}`, l); } catch {} };
  const [downloading, setDownloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [marca, setMarcaState] = useState(brand.editData?.marca || '');
  const [tempMarca, setTempMarca] = useState(brand.editData?.marca || '');

  // Sincroniza marca state quando brand carrega do localStorage (brand começa null)
  React.useEffect(() => {
    const saved = brand?.editData?.marca;
    if (saved && !marca) {
      setMarcaState(saved);
      setTempMarca(saved);
    }
  }, [brand?.editData?.marca]);

  const commitMarcaChange = (newName) => {
    const cleaned = newName.trim();
    if (!cleaned) {
      setTempMarca(marca);
      return;
    }

    // Avulso: cliente está configurando sua própria marca, sem restrição de trocas
    if (plano === 'avulso') {
      setMarcaState(cleaned);
      setTempMarca(cleaned);
      // Persiste no brand e no localStorage para sobreviver ao reload
      const updatedBrand = { ...brand, editData: { ...brand.editData, marca: cleaned } };
      setBrand(updatedBrand);
      try { localStorage.setItem('brandbox_avulso_' + avulsoParam, JSON.stringify(updatedBrand)); } catch {}
      return;
    }

    const originalName = (brand.formData?.marca || brand.name || brand.editData?.marca || '').trim();
    if (!originalName) {
      setMarcaState(cleaned);
      return;
    }

    // Carregar nomes já usados
    let usedNames = [];
    try {
      usedNames = JSON.parse(localStorage.getItem(`brandbox_used_names_${brand.id}`) || '[]');
    } catch {}

    // Limpa strings vazias e normaliza
    usedNames = usedNames.map(n => n.trim()).filter(Boolean);

    // Inicializa a lista com o nome original se estiver vazia
    if (!usedNames.includes(originalName)) {
      usedNames.unshift(originalName);
    }

    // Se o nome digitado já foi usado antes, permite trocar de volta sem problemas
    if (usedNames.some(n => n.toLowerCase() === cleaned.toLowerCase())) {
      const match = usedNames.find(n => n.toLowerCase() === cleaned.toLowerCase());
      setMarcaState(match);
      setTempMarca(match);
      return;
    }

    // Se for um nome NOVO e já atingiu o limite de 2 nomes (Original + 1 Alteração)
    if (usedNames.length >= 2) {
      alert("Atenção: Por questões de segurança, você só pode alterar o nome da sua marca 1 vez. O limite de alterações de nome para esta licença foi atingido.");
      setTempMarca(marca); // Reverte o campo para o último nome válido
      return;
    }

    // Permite a alteração e registra na lista de usados
    usedNames.push(cleaned);
    try {
      localStorage.setItem(`brandbox_used_names_${brand.id}`, JSON.stringify(usedNames));
    } catch {}

    setMarcaState(cleaned);
    setTempMarca(cleaned);
  };
  const [tagline, setTaglineState] = useState(() => {
    try {
      return localStorage.getItem(`brandbox_tagline_${brand.id}`) || brand.editData?.tagline || '';
    } catch {
      return brand.editData?.tagline || '';
    }
  });
  const setTagline = (v) => {
    setTaglineState(v);
    try {
      localStorage.setItem(`brandbox_tagline_${brand.id}`, v);
    } catch {}
  };
  const [taglineGap, setTaglineGapState] = useState(() => { try { return parseFloat(localStorage.getItem(`brandbox_tagline_gap_${brand.id}`)) || brand.editData?.taglineGap || 0.35; } catch { return 0.35; } });
  const setTaglineGap = (v) => { setTaglineGapState(v); try { localStorage.setItem(`brandbox_tagline_gap_${brand.id}`, v); } catch {} };
  const [taglineWrap, setTaglineWrapState] = useState(() => { try { return localStorage.getItem(`brandbox_tagline_wrap_${brand.id}`) === 'true'; } catch { return false; } });
  const setTaglineWrap = (v) => { setTaglineWrapState(v); try { localStorage.setItem(`brandbox_tagline_wrap_${brand.id}`, v); } catch {} };
  const [taglineSizeBoost, setTaglineSizeBoostState] = useState(() => { try { return parseFloat(localStorage.getItem(`brandbox_tagline_size_boost_${brand.id}`)) || 1.0; } catch { return 1.0; } });
  const setTaglineSizeBoost = (v) => { setTaglineSizeBoostState(v); try { localStorage.setItem(`brandbox_tagline_size_boost_${brand.id}`, v); } catch {} };
  const [sloganEnabled, setSloganEnabledState] = useState(() => { try { return localStorage.getItem(`brandbox_slogan_enabled_${brand.id}`) !== 'false'; } catch { return true; } });
  const setSloganEnabled = (v) => { setSloganEnabledState(v); try { localStorage.setItem(`brandbox_slogan_enabled_${brand.id}`, v ? 'true' : 'false'); } catch {} };
  const [fontLineHeight, setFontLineHeightState] = useState(() => { try { return parseFloat(localStorage.getItem(`brandbox_font_line_height_${brand.id}`)) || brand.editData?.fontLineHeight || (brand.editData?.fontStyle === 'script' ? 0.9 : 1.22); } catch { return 1.22; } });
  const setFontLineHeight = (v) => { setFontLineHeightState(v); try { localStorage.setItem(`brandbox_font_line_height_${brand.id}`, v); } catch {} };
  const [taglineLetterSpacing, setTaglineLetterSpacingState] = useState(() => { try { return parseFloat(localStorage.getItem(`brandbox_tagline_letter_spacing_${brand.id}`)) || 0.35; } catch { return 0.35; } });
  const setTaglineLetterSpacing = (v) => { setTaglineLetterSpacingState(v); try { localStorage.setItem(`brandbox_tagline_letter_spacing_${brand.id}`, v); } catch {} };
  const [fontOverride, setFontOverrideState] = useState(() => {
    try { const s = localStorage.getItem(`brandbox_font_override_${brand.id}`); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const setFontOverride = (v) => {
    setFontOverrideState(v);
    try { if (v) localStorage.setItem(`brandbox_font_override_${brand.id}`, JSON.stringify(v)); else localStorage.removeItem(`brandbox_font_override_${brand.id}`); } catch {}
  };
  const [isInitialized, setIsInitialized] = useState(false);
  const [estampaPatterns, setEstampaPatterns] = useState(brand.pattern ? [brand.pattern] : []);
  const [estampaGenCount, setEstampaGenCount] = useState(brand.patternGenerationCount || 0);
  const [estampaSelectedIdx, setEstampaSelectedIdx] = useState(0);
  const [estampaOriginalPattern, setEstampaOriginalPattern] = useState(null); // backup pre-suavização
  const [estampasRef, setEstampasRef] = useState(brand.estampas || []);

  const [presets, setPresets] = useState(() => {
    try {
      const s = localStorage.getItem(`brandbox_presets_${brand.id}`);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [activePresetId, setActivePresetId] = useState(null);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const saveCurrentPreset = (name) => {
    if (!name.trim()) return;
    const newPreset = {
      id: Date.now().toString(),
      name: name.trim(),
      fontOverride: fontOverride,
      logoColor: logoColor,
      logoLayout: logoLayout,
      tagline: tagline,
      taglineGap: taglineGap,
      fontLineHeight: fontLineHeight,
      taglineWrap: taglineWrap,
      bgColor: bgColor
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    try {
      localStorage.setItem(`brandbox_presets_${brand.id}`, JSON.stringify(updated));
    } catch {}
    setActivePresetId(newPreset.id);
    setIsSavingPreset(false);
    setNewPresetName('');
  };

  const loadPreset = (preset) => {
    if (!preset) return;
    if (preset.fontOverride !== undefined) setFontOverride(preset.fontOverride);
    if (preset.logoColor !== undefined) setLogoColor(preset.logoColor);
    if (preset.logoLayout !== undefined) setLayout(preset.logoLayout);
    if (preset.tagline !== undefined) setTagline(preset.tagline);
    if (preset.taglineGap !== undefined) setTaglineGap(preset.taglineGap);
    if (preset.fontLineHeight !== undefined) setFontLineHeight(preset.fontLineHeight);
    if (preset.taglineWrap !== undefined) setTaglineWrap(preset.taglineWrap);
    if (preset.bgColor !== undefined) setBgColor(preset.bgColor);
    setActivePresetId(preset.id);
  };

  const deletePreset = (id, e) => {
    if (e) e.stopPropagation();
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(`brandbox_presets_${brand.id}`, JSON.stringify(updated));
    } catch {}
    if (activePresetId === id) {
      setActivePresetId(null);
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    const pat = estampaPatterns[estampaSelectedIdx];
    if (pat) {
      try { localStorage.setItem(`brandbox_pattern_${brand.id}`, JSON.stringify(pat)); } catch {}
      const sessionId = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('session') || localStorage.getItem('brandbox_session'))
        : null;
      if (sessionId && pat.url) {
        fetch('/api/salvar-estampa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'select',
            sessionId,
            selectedUrl: pat.url,
            base64: pat.base64,
            mimeType: pat.mimeType
          })
        }).catch(() => {});
      }
    }
    if (estampaPatterns.length > 0) {
      try { localStorage.setItem(`brandbox_patterns_all_${brand.id}`, JSON.stringify(estampaPatterns)); } catch {}
    }
    if (setBrand) {
      setBrand(prev => {
        if (!prev) return prev;
        const activePat = estampaPatterns[estampaSelectedIdx];
        const nextUrls = estampaPatterns.map(p => p.url).filter(Boolean);
        const updated = {
          ...prev,
          estampa_url: activePat?.url || prev.estampa_url,
          pattern: activePat || prev.pattern,
          estampas_geradas_urls: nextUrls
        };
        try {
          localStorage.setItem('brandbox_delivery', JSON.stringify(updated));
        } catch (_qe) {
          // quota excedida: ignora silenciosamente — dados estão no Supabase
        }
        return updated;
      });
    }
  }, [estampaPatterns, estampaSelectedIdx, isInitialized, setBrand]);
  const coresRef = useRef(null);
  const [colorOrder, setColorOrderState] = useState(() => { try { const s = localStorage.getItem(`brandbox_color_order_${brand.id}`); return s ? JSON.parse(s) : null; } catch { return null; } });
  const setColorOrder = (v) => { setColorOrderState(v); try { localStorage.setItem(`brandbox_color_order_${brand.id}`, JSON.stringify(v)); } catch {} };
  const [downloadingCores, setDownloadingCores] = useState(false);
  const [comBorda, setComBordaState] = useState(() => {
    try {
      return localStorage.getItem(`brandbox_comborda_${brand.id}`) !== 'false';
    } catch {
      return true;
    }
  });
  const setComBorda = (v) => {
    setComBordaState(v);
    try {
      localStorage.setItem(`brandbox_comborda_${brand.id}`, v ? 'true' : 'false');
    } catch {}
  };

  const [patternScale, setPatternScaleState] = useState(() => {
    try {
      const s = localStorage.getItem(`brandbox_pattern_scale_${brand.id}`);
      return s ? parseInt(s, 10) : 520; // Default aumentado para 520
    } catch {
      return 520;
    }
  });
  const setPatternScale = (v) => {
    setPatternScaleState(v);
    try {
      localStorage.setItem(`brandbox_pattern_scale_${brand.id}`, String(v));
    } catch {}
  };

  const [borderColor, setBorderColorState] = useState(() => {
    try {
      return localStorage.getItem(`brandbox_border_color_${brand.id}`) || null;
    } catch {
      return null;
    }
  });
  const setBorderColor = (v) => {
    setBorderColorState(v);
    try {
      if (v) localStorage.setItem(`brandbox_border_color_${brand.id}`, v);
      else localStorage.removeItem(`brandbox_border_color_${brand.id}`);
    } catch {}
  };
  const [localSlogan, setLocalSlogan] = useState(brand?.editData?.tagline || '');
  const [copiedAssinatura, setCopiedAssinatura] = useState(false);
  const [storyTemplateIdx, setStoryTemplateIdx] = useState(0);
  const [storyFormatIdx, setStoryFormatIdx] = useState(0);
  const [papelariaNavIdx, setPapelariaNavIdx] = useState(0);
  const [papelariaNavItens, setPapelariaNavItens] = useState([]);

  const ALL_STEPS = [
    'placa', 'manifesto', 'tomdevoz', 'fonte', 'logo', 'slogan', 
    ...(plano === 'pro' ? ['submarca'] : []), 
    'cores', 'paleta', 'estampa', 'guia',
    'cartao', 'pack-instagram', 'assinatura-email', 'papelaria',
    'ajuda', 'upsell'
  ];

  const goNext = () => {
    const curIdx = ALL_STEPS.indexOf(step);
    if (step === 'papelaria') {
      if (papelariaNavIdx < papelariaNavItens.length - 1) {
        setPapelariaNavIdx(papelariaNavIdx + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (curIdx < ALL_STEPS.length - 1) {
        setStep(ALL_STEPS[curIdx + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (curIdx < ALL_STEPS.length - 1) {
      setStep(ALL_STEPS[curIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    const curIdx = ALL_STEPS.indexOf(step);
    if (step === 'ajuda') {
      setStep('papelaria');
      setPapelariaNavIdx(papelariaNavItens.length - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'upsell') {
      setStep('ajuda');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'papelaria') {
      if (papelariaNavIdx > 0) {
        setPapelariaNavIdx(papelariaNavIdx - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStep(ALL_STEPS[curIdx - 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (curIdx > 0) {
      setStep(ALL_STEPS[curIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLastStep = step === 'upsell';
  const isFirstStep = step === 'placa';
  const [customLogoSrc, setCustomLogoSrcState] = useState(() => { try { return localStorage.getItem(`brandbox_custom_logo_${brand.id}`) || null; } catch { return null; } });
  const setCustomLogoSrc = (v) => { setCustomLogoSrcState(v); try { if (v) localStorage.setItem(`brandbox_custom_logo_${brand.id}`, v); else localStorage.removeItem(`brandbox_custom_logo_${brand.id}`); } catch {} };
  const [customLogoScaleMap, setCustomLogoScaleMapState] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`brandbox_custom_logo_scales_${brand.id}`) || '{}');
      // Migração: Tag para Sacola tinha max=50 antes; reset se <= 50 para usar default 100
      if (stored['Tag para Sacola'] != null && stored['Tag para Sacola'] <= 50) {
        delete stored['Tag para Sacola'];
      }
      return stored;
    } catch { return {}; }
  });
  
  const LOGO_SCALE_DEFAULTS = {
    'Cartão de Visita': 100,
    'Cartão de Retorno': 100,
    'Arte para Caneca': 180,
    'Caneca': 180,
    'Recibo': 100,
    'Envelope Ofício': 100,
    'Receituário Padrão': 100,
    'Receituário de Controle Especial': 100,
    'Prontuário Médico': 100,
    'Receita de Alta': 100,
    'Ficha de Cadastro': 100,
    'Guia de Vacinação': 100,
    'Guia de Desenvolvimento': 100,
    'Guia de Cuidados': 100,
    'Guia Alimentar': 100,
    'Guia do Sono': 100,
    'Orientação Recém-Nascido': 100,
    'Guia de Amamentação': 115,
    'Envelope Saco': 100,
    'Cartão de Exame Pré-Natal': 100,
    'Checklist Maternidade': 100,
    'Etiqueta para Correios': 100,
    'Tag para Sacola': 100,
    'Pasta A4': 100,
    'Certificado de Coragem': 135,
    'Diário do Xixi': 115,
    'Meu Pratinho': 150,
  };
  const getCustomLogoScale = (item) => customLogoScaleMap[item] ?? (LOGO_SCALE_DEFAULTS[item] || 100);
  const LOGO_SCALE_MAX = { 'Tag para Sacola': 200, 'Arte para Caneca': 300, 'Caneca': 300 };
  const getCustomLogoScaleMax = (item) => LOGO_SCALE_MAX[item] || 300;
  const setCustomLogoScale = (item, v) => {
    setCustomLogoScaleMapState(prev => {
      const next = { ...prev, [item]: v };
      try { localStorage.setItem(`brandbox_custom_logo_scales_${brand.id}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  // para aba logo (sem item específico) usa default geral
  const customLogoScale = getCustomLogoScale('Cartão de Visita');
  const [customLogoWarn, setCustomLogoWarn] = useState(null);
  
  // editData enriquecido com logo customizada — flui automaticamente para LogoPreviewHTML via editData
  const editDataWithLogo = React.useMemo(() => ({
    ...brand.editData,
    marca: marca || brand.editData?.marca || '',  // usa state `marca` que atualiza ao digitar
    tagline: sloganEnabled ? tagline : '',
    ...(fontOverride ? { fontFamily: fontOverride.fontFamily, fontWeight: fontOverride.weight || 700, fontStyle: fontOverride.style || 'serif', fontSizeBoost: fontOverride.sizeBoost || 1, fontLetterSpacing: fontOverride.letterSpacing || null } : {}),
    ...(customLogoSrc ? { customLogoSrc, customLogoScale } : {}),
    taglineGap,
    taglineWrap,
    fontLineHeight,
    taglineSizeBoost,
    taglineLetterSpacing,
  }), [marca, brand.editData, tagline, customLogoSrc, customLogoScale, fontOverride, taglineGap, taglineWrap, fontLineHeight, taglineSizeBoost, taglineLetterSpacing]);
  
  const currentIdx = estampaSelectedIdx || 0;
  const patternSrc = estampaPatterns?.[currentIdx]
    ? (estampaPatterns[currentIdx].url || `data:${estampaPatterns[currentIdx].mimeType};base64,${estampaPatterns[currentIdx].base64}`)
    : null;
  const [cartaoContacts, setCartaoContacts] = useState(() => { try { return JSON.parse(localStorage.getItem(`brandbox_cartao_${brand.id}`) || '{}').contacts || { telefone: '', whatsapp: '', email: '', site: '', instagram: '', endereco: '', telefone2: '' }; } catch { return { telefone: '', whatsapp: '', email: '', site: '', instagram: '', endereco: '', telefone2: '' }; } });
  const [cartaoQrLink, setCartaoQrLink] = useState(() => { try { return JSON.parse(localStorage.getItem(`brandbox_cartao_${brand.id}`) || '{}').qrLink || ''; } catch { return ''; } });
  const [cartaoShowQR, setCartaoShowQR] = useState(() => { try { return JSON.parse(localStorage.getItem(`brandbox_cartao_${brand.id}`) || '{}').showQR || false; } catch { return false; } });

  useEffect(() => {
    try { localStorage.setItem(`brandbox_cartao_${brand.id}`, JSON.stringify({ contacts: cartaoContacts, qrLink: cartaoQrLink, showQR: cartaoShowQR })); } catch {}
  }, [cartaoContacts, cartaoQrLink, cartaoShowQR]);

  const atuacoesSaude = ['Pediatria / Saúde infantil', 'Obstetrícia / Saúde da mulher', 'Clínica / Saúde geral adulta'];
  const isSaude = atuacoesSaude.includes(brand.formData?.atuacao);

  const [clinicaNome, setClinicaNomeState] = useState(() => { try { return JSON.parse(localStorage.getItem(`brandbox_papelaria_${brand.id}`) || '{}').clinicaNome || ''; } catch { return ''; } });
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const handleResendEmail = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    setResendStatus(null);
    try {
      const emailToSend = brand.formData?.email;
      const marcaToSend = brand.editData?.marca || brand.name;
      const sessionId = brand.sessionId || brand.id || new URLSearchParams(window.location.search).get('session') || 'no-session';
      
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend, marca: marcaToSend, sessionId, plano: plano || brand.plano }),
      });
      const data = await res.json();
      if (data.sent) {
        setResendStatus('✓ E-mail enviado!');
      } else {
        setResendStatus('❌ Erro: ' + (data.error || 'Falha no envio'));
      }
    } catch (e) {
      setResendStatus('❌ Erro de conexão');
    } finally {
      setResendingEmail(false);
      setTimeout(() => setResendStatus(null), 3000);
    }
  };
  const setClinicaNome = (v) => { setClinicaNomeState(v); try { const cur = JSON.parse(localStorage.getItem(`brandbox_papelaria_${brand.id}`) || '{}'); localStorage.setItem(`brandbox_papelaria_${brand.id}`, JSON.stringify({ ...cur, clinicaNome: v })); } catch {} };
  const [crmData, setCrmDataState] = useState({ crm: '', uf: '', rqe: [] });
  const setCrmData = (updater) => {
    setCrmDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(`brandbox_crm_${brand.id}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const crmLine = isSaude && crmData?.crm ? `CRM/${crmData.uf || 'UF'} ${crmData.crm}` : null;

  useEffect(() => {
    let isAsync = false;
    // Carregamento inicial de tudo
    try {
      const s = localStorage.getItem(`brandbox_step_${brand.id}`); if (s) setStepState(s);

      let allPatterns = JSON.parse(localStorage.getItem(`brandbox_patterns_all_${brand.id}`) || 'null');
      const singlePattern = JSON.parse(localStorage.getItem(`brandbox_pattern_${brand.id}`) || 'null');
      if (allPatterns && allPatterns.length > 0) {
        if (allPatterns.length > 3) {
          allPatterns = allPatterns.slice(-3);
          try { localStorage.setItem(`brandbox_patterns_all_${brand.id}`, JSON.stringify(allPatterns)); } catch {}
        }
        setEstampaPatterns(allPatterns);
        if (singlePattern) {
          const idx = allPatterns.findIndex(p => p.url === singlePattern.url || p.base64 === singlePattern.base64);
          if (idx >= 0) setEstampaSelectedIdx(idx);
        }
      } else if (singlePattern) {
        setEstampaPatterns([singlePattern]);
      }
      const crm = JSON.parse(localStorage.getItem(`brandbox_crm_${brand.id}`) || localStorage.getItem('brandbox_crm') || 'null'); if (crm) setCrmDataState(crm);
    } catch {}

    // Recupera estampa do banco: tenta carregar todas as estampas geradas
    let estampaUrls = brand?.estampas_geradas_urls || (brand?.estampa_url ? [brand.estampa_url] : []);
    
    // Prune to maximum 3 patterns to avoid gallery bloating and save database/Supabase storage memory
    if (estampaUrls.length > 3) {
      const activeUrl = brand?.estampa_url;
      let urlsToKeep = [];
      if (activeUrl && estampaUrls.includes(activeUrl)) {
        urlsToKeep.push(activeUrl);
      }
      const remainingUrls = estampaUrls.filter(u => u !== activeUrl);
      const slotsNeeded = 3 - urlsToKeep.length;
      if (slotsNeeded > 0) {
        const latestFromRemaining = remainingUrls.slice(-slotsNeeded);
        urlsToKeep = [...urlsToKeep, ...latestFromRemaining];
      }
      urlsToKeep = [...new Set(urlsToKeep)].filter(Boolean);
      
      const urlsToDelete = estampaUrls.filter(u => !urlsToKeep.includes(u));
      estampaUrls = urlsToKeep;

      const sessionId = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('session') || localStorage.getItem('brandbox_session'))
        : null;
      if (sessionId && urlsToDelete.length > 0) {
        console.log(`🧼 Cleaning up ${urlsToDelete.length} excess patterns from Supabase:`, urlsToDelete);
        urlsToDelete.forEach(url => {
          fetch('/api/salvar-estampa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'delete',
              sessionId,
              replaceUrl: url
            })
          }).catch(() => {});
        });
      }
    }

    const patLocal = (() => {
      try {
        const scoped = localStorage.getItem(`brandbox_pattern_${brand.id}`);
        return scoped ? JSON.parse(scoped) : null;
      } catch {
        return null;
      }
    })();
    const patAllLocal = (() => {
      try {
        const scoped = localStorage.getItem(`brandbox_patterns_all_${brand.id}`);
        return scoped ? JSON.parse(scoped) : null;
      } catch {
        return null;
      }
    })();

    const patAllLocalCount = patAllLocal ? patAllLocal.length : 0;
    // Se o localStorage tem patterns com url:null (editados localmente, ex: Suavizar cortes), eles têm prioridade
    const hasLocalEdits = patAllLocal && patAllLocal.some(p => p.base64 && !p.url);
    if (estampaUrls.length > 0 && (estampaUrls.length > patAllLocalCount || !patLocal || patAllLocalCount === 0) && !hasLocalEdits) {
      isAsync = true;
      // Initialize immediately with URL-only objects so they display instantly without causing blank layouts
      const initialPats = estampaUrls.map(url => {
        if (brand?.pattern && (brand.pattern.url === url || brand.pattern.base64)) {
          return { url, base64: brand.pattern.base64, mimeType: brand.pattern.mimeType || 'image/png' };
        }
        return { url };
      });
      setEstampaPatterns(initialPats);
      const localUrl = patLocal ? patLocal.url : null;
      const targetUrl = brand.estampa_url || localUrl;
      const initialActiveIdx = initialPats.findIndex(p => p.url === targetUrl);
      setEstampaSelectedIdx(initialActiveIdx >= 0 ? initialActiveIdx : 0);

      Promise.all(
        estampaUrls.map(url =>
          fetch(url)
            .then(r => r.blob())
            .then(blob => new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve({ base64: reader.result.split(',')[1], mimeType: blob.type, url });
              reader.onerror = () => resolve({ url });
              reader.readAsDataURL(blob);
            }))
            .catch(() => ({ url }))
        )
      )
      .then(pats => {
        setEstampaPatterns(prev => {
          return prev.map(p => {
            // Não sobrescreve patterns editados localmente (url:null = editado)
            if (!p.url && p.base64) return p;
            const loaded = pats.find(lp => lp.url === p.url);
            if (loaded && loaded.base64) {
              return { ...p, base64: loaded.base64, mimeType: loaded.mimeType };
            }
            return p;
          });
        });
        const validPats = pats.filter(p => p.base64);
        if (validPats.length > 0) {
          try { localStorage.setItem(`brandbox_patterns_all_${brand.id}`, JSON.stringify(validPats)); } catch {}
          const finalActiveIdx = validPats.findIndex(p => p.url === targetUrl);
          if (finalActiveIdx >= 0) {
            try { localStorage.setItem(`brandbox_pattern_${brand.id}`, JSON.stringify(validPats[finalActiveIdx])); } catch {}
          } else {
            try { localStorage.setItem(`brandbox_pattern_${brand.id}`, JSON.stringify(validPats[0])); } catch {}
          }
        }
        setIsInitialized(true);
      })
      .catch(() => {
        setIsInitialized(true);
      });
    } else if (!patLocal) {
      // Fallback: estampa salva diretamente no brand_data (campo legado)
      const legacyPatterns = brand?.generatedPatterns;
      const legacyPattern = brand?.pattern;
      if (legacyPatterns && legacyPatterns.length > 0) {
        setEstampaPatterns(legacyPatterns);
        try { localStorage.setItem(`brandbox_pattern_${brand.id}`, JSON.stringify(legacyPatterns[0])); } catch {}
      } else if (legacyPattern) {
        const pat = typeof legacyPattern === 'string'
          ? { base64: legacyPattern, mimeType: 'image/png' }
          : legacyPattern;
        setEstampaPatterns([pat]);
        try { localStorage.setItem(`brandbox_pattern_${brand.id}`, JSON.stringify(pat)); } catch {}
      }
    }

    if (!isAsync) {
      setIsInitialized(true);
    }

    // Re-busca as estampas de referência do estilo para que novas gerações
    // usem as imagens corretas (incluindo novos uploads recentes no banco)
    const estiloId = brand?.resultadoFinal?.estiloId;
    if (estiloId) {
      fetch(`/api/variacoes?id=${estiloId}&t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
          if (data.variacoes) {
            const estampasDoBanco = data.variacoes.filter(v => v.tipo === 'ESTAMPA');
            if (estampasDoBanco.length > 0) {
              setEstampasRef(estampasDoBanco);
              console.log(`✅ ${estampasDoBanco.length} referências de estilo recuperadas para geração.`);
            }
          }
        })
        .catch(() => {});
    }
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
  const [selectedIcon, setSelectedIconState] = useState(() => { try { return localStorage.getItem(`brandbox_selected_icon_${brand.id}`) || brand.selectedIcon || null; } catch { return brand.selectedIcon || null; } });
  const setSelectedIcon = (v) => { setSelectedIconState(v); try { if (v) localStorage.setItem(`brandbox_selected_icon_${brand.id}`, v); else localStorage.removeItem(`brandbox_selected_icon_${brand.id}`); } catch {} };
  const currentIconPath = styleIcons.find(i => i.id === selectedIcon)?.path || null;

  const editData = { ...brand.editData, marca, tagline };
  const seloData = editData.fontStyle === 'script'
    ? { ...editData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display', submarcaTextType }
    : { ...editData, submarcaTextType };

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

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* NOVO MENU DE NAVEGAÇÃO CATEGORIZADA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 4px 8px 0' }}>
          <LanguageSwitcher />
        </div>
        <BrandBoxNav step={step} setStep={setStep} plano={plano} papelariaItens={papelariaNavItens} papelariaIdx={papelariaNavIdx} setPapelariaIdx={setPapelariaNavIdx} />

        <div style={{ padding: '0.5rem 1.4rem 0' }}>

          {/* Header (Simplificado) */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
              {step === 'placa' ? (dictionary?.nav?.placa || 'Placa da Marca') : step === 'manifesto' ? (dictionary?.nav?.manifesto || 'Manifesto da Marca') : step === 'tomdevoz' ? (dictionary?.nav?.tomdevoz || 'Tom de Voz') : step === 'fonte' ? (dictionary?.nav?.fonte || 'Fonte da Marca') : step === 'slogan' ? (dictionary?.nav?.slogan || 'Tagline da Marca') : step === 'logo' ? (dictionary?.nav?.logo || 'Sua Logo') : step === 'submarca' ? (dictionary?.nav?.submarca || 'Sua Submarca') : step === 'estampa' ? (dictionary?.nav?.estampa || 'Sua Estampa') : step === 'cores' ? (dictionary?.nav?.cores || 'Suas Cores') : step === 'paleta' ? (dictionary?.nav?.paleta || 'Sua Paleta') : step === 'cartao' ? (dictionary?.nav?.cartao || 'Cartão Digital') : step === 'pack-instagram' ? (dictionary?.nav?.pack_instagram || 'Pack Digital para Instagram') : step === 'assinatura-email' ? (dictionary?.nav?.assinatura_email || 'Assinatura de E-mail') : step === 'guia' ? (dictionary?.nav?.guia || 'Guia da Marca') : step === 'ajuda' ? (dictionary?.nav?.ajuda_inspiracao || 'Ajuda & Inspiração ✨') : step === 'upsell' ? (dictionary?.nav?.upsell || 'Quer ir além? ✨') : (dictionary?.nav?.papelaria || 'Sua Papelaria')}
            </h1>
          </div>
          <div />
        </div>

        {/* Banner de upsell para steps exclusivos do pacote de identidade */}
        {plano === 'avulso' && ['placa', 'estampa', 'manifesto', 'tomdevoz', 'paleta', 'guia'].includes(step) && (
          <div style={{ background: '#fff8f0', border: '1.5px solid #fde8c8', borderRadius: '16px', padding: '20px 22px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✨</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c87000', fontFamily: 'Montserrat,sans-serif', marginBottom: '6px' }}>
              Recurso exclusivo do pacote completo
            </div>
            <div style={{ fontSize: '0.78rem', color: '#999', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.6 }}>
              Para personalizar suas cores, estampas, manifesto e tom de voz da marca, adquira o <strong style={{ color: '#c87000' }}>Pacote Completo de Identidade Visual</strong>.
            </div>
          </div>
        )}

        {/* Área da estampa */}
        {step === 'estampa' && plano !== 'avulso' && <EstampaStep brand={brand} accentColor={accentColor} marca={marca} patterns={estampaPatterns} setPatterns={setEstampaPatterns} genCount={estampaGenCount} setGenCount={setEstampaGenCount} selectedIdx={estampaSelectedIdx} setSelectedIdx={setEstampaSelectedIdx} paletteColors={paletteColors} patternScale={patternScale} setPatternScale={setPatternScale} estampasRef={estampasRef} originalPattern={estampaOriginalPattern} setOriginalPattern={setEstampaOriginalPattern} />}

        {/* Cores — prioridade/ordem */}
        {step === 'cores' && plano === 'avulso' && (
          <div style={{ background: '#f5f3f0', border: '1px solid #e8e3dc', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', fontSize: '0.74rem', color: '#888', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.6, textAlign: 'center' }}>
            🎨 Esta é a paleta da coleção <strong style={{ color: '#8B7355' }}>The Brand Box</strong>.<br />
            Para personalizar suas cores, clique no ícone de edição no círculo.
          </div>
        )}
        {step === 'cores' && <CoresPrioridadeStep paletteColors={paletteColors} colorOrder={colorOrder} setColorOrder={setColorOrder} accentColor={accentColor}
          onColorChange={plano === 'avulso' ? (idx, hex) => {
            const updated = [...paletteColors];
            updated[idx] = hex;
            const newBrand = { ...brand, currentPaletteColors: updated, activeColor: updated[0] };
            setBrand(newBrand);
            try { localStorage.setItem('brandbox_avulso_' + avulsoParam, JSON.stringify(newBrand)); } catch {}
          } : undefined}
        />}

        {/* Paleta — visualização completa */}
        {step === 'paleta' && plano !== 'avulso' && <CoresStep paletteColors={paletteColors} accentColor={accentColor} paletaNome={paletas?.find(p => p.id === brand.selectedPaleta)?.nome_variacao} coresRef={coresRef} />}

        {/* Cartão digital */}
        {step === 'cartao' && (plano === 'avulso' ? <AvulsoUpgradeCard accentColor={accentColor} titulo="Cartão Digital" desc="Crie seu cartão digital interativo com QR code, link para redes sociais e muito mais. Disponível no Plano Completo." /> : <CartaoStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} contacts={cartaoContacts} setContacts={setCartaoContacts} qrLink={cartaoQrLink} setQrLink={setCartaoQrLink} showQR={cartaoShowQR} setShowQR={setCartaoShowQR} logoLayout={logoLayout} editData={editDataWithLogo} logoColor={logoColor} setLayout={setLayout} />)}
        {step === 'pack-instagram' && (plano === 'avulso' ? <AvulsoUpgradeCard accentColor={accentColor} titulo="Pack Digital para Instagram" desc="Templates prontos para Stories e Feed com a sua identidade visual aplicada. Disponível no Plano Completo." /> : <FundoInstaPreview brand={brand} editData={editDataWithLogo} accentColor={accentColor} patternSrc={patternSrc} logoColor={logoColor} logoLayout={logoLayout} comBorda={comBorda} setComBorda={setComBorda} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} />)}
        {step === 'assinatura-email' && (plano === 'avulso' ? <AvulsoUpgradeCard accentColor={accentColor} titulo="Assinatura de E-mail" desc="Assinatura profissional com sua logo, dados de contato e links para usar no Gmail ou Outlook. Disponível no Plano Completo." /> : <AssinaturaEmailPreview brand={brand} editData={editDataWithLogo} accentColor={accentColor} logoColor={logoColor} logoLayout={logoLayout} cartaoContacts={cartaoContacts} crmLine={crmLine} localSlogan={localSlogan} clinicaNome={clinicaNome} storyTemplateIdx={storyTemplateIdx} setStoryTemplateIdx={setStoryTemplateIdx} storyFormatIdx={storyFormatIdx} setStoryFormatIdx={setStoryFormatIdx} setCartaoContacts={setCartaoContacts} setClinicaNome={setClinicaNome} setLocalSlogan={setLocalSlogan} />)}

        {/* Placa da marca */}
        {step === 'placa' && plano !== 'avulso' && <PlacaStep brand={brand} accentColor={accentColor} paletteColors={orderedPaletteColors} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} editData={editDataWithLogo} logoColor={logoColor} logoLayout={logoLayout} iconPath={currentIconPath} submarcaColor={submarcaColor} submarcaTextColor={submarcaTextColor} />}

        {/* Manifesto */}
        {step === 'manifesto' && plano !== 'avulso' && <ManifestoStep accentColor={accentColor} marca={marca} tagline={tagline} brand={brand} isSaude={isSaude} editData={editDataWithLogo} />}

        {/* Tom de Voz */}
        {step === 'tomdevoz' && plano !== 'avulso' && <TomDeVozStep accentColor={accentColor} marca={marca} tagline={tagline} brand={brand} editData={editDataWithLogo} />}

        {step === 'fonte' && <FonteStep brand={brand} accentColor={accentColor} logoColor={logoColor} marca={marca} tagline={tagline} editData={editDataWithLogo} onFontChange={(f) => setFontOverride(f)} />}

        {/* Aba Slogan */}
        {step === 'slogan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Preview da logo com slogan */}
            <div style={{
              width: '100%', aspectRatio: '1 / 1',
              background: bgColor,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}>
              <div style={{ width: '85%', height: '58%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogoPreviewHTML editData={editDataWithLogo} color={logoColor} layout={logoLayout} scaleFactor={1.1} maxWidth="100%" maxHeight="100%" />
              </div>
            </div>

            {/* Controles da tagline */}
            {editDataWithLogo?.customLogoSrc ? (
              <div style={{ padding: '16px', background: '#fff0f5', borderRadius: '12px', border: '1.5px solid #ffb3c6', color: '#c03b66', fontSize: '0.82rem', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', fontWeight: 600 }}>
                {dictionary?.tagline_tab?.custom_logo_msg || 'Você enviou sua própria logo, então a tagline (slogan) já faz parte da sua imagem!'}<br/><br/>
                <span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>{dictionary?.tagline_tab?.custom_logo_sub || 'Para alterar a tagline ou usar as opções desta aba, volte à aba "Sua Logo" e selecione a "Logo sugerida".'}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: '#fcfcfc', borderRadius: '16px', border: '1.5px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>{dictionary?.tagline_tab?.brand_tagline || '💬 Tagline da Marca'}</span>
                  <button
                    onClick={() => setSloganEnabled(!sloganEnabled)}
                    style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: sloganEnabled ? `${accentColor}15` : '#eee', color: sloganEnabled ? accentColor : '#999', transition: 'all 0.2s', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {sloganEnabled ? (dictionary?.tagline_tab?.with_tagline || '✓ Com tagline') : (dictionary?.tagline_tab?.without_tagline || '✗ Sem tagline')}
                  </button>
                </div>
                {sloganEnabled && (<>
                <input
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder={dictionary?.tagline_tab?.placeholder || 'Ex: Delicadeza em cada detalhe'}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${logoColor}22`, fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', background: '#fff', outline: 'none', color: '#444', letterSpacing: '0.3px' }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setTaglineWrap(false)} style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: !taglineWrap ? logoColor : '#eee', color: !taglineWrap ? '#fff' : '#888', cursor: 'pointer', transition: '0.2s' }}>{dictionary?.tagline_tab?.one_line || '1 Linha'}</button>
                  <button onClick={() => setTaglineWrap(true)} style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: taglineWrap ? logoColor : '#eee', color: taglineWrap ? '#fff' : '#888', cursor: 'pointer', transition: '0.2s' }}>{dictionary?.tagline_tab?.two_lines || '2 Linhas'}</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', background: '#f8f8f8', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '100px' }}>{dictionary?.tagline_tab?.scale || 'Escala Tagline'}</span>
                    <input type="range" min="0.2" max="2.5" step="0.05" value={taglineSizeBoost} onChange={e => setTaglineSizeBoost(parseFloat(e.target.value))} style={{ flex: 1, accentColor }} />
                    <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineSizeBoost.toFixed(2)}×</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '100px' }}>{dictionary?.tagline_tab?.distance || 'Distância'}</span>
                    <input type="range" min="0" max="1.5" step="0.05" value={taglineGap} onChange={e => setTaglineGap(parseFloat(e.target.value))} style={{ flex: 1, accentColor }} />
                    <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineGap.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '100px' }}>{dictionary?.tagline_tab?.spacing_slider || 'Espaçamento'}</span>
                    <input type="range" min="0.05" max="1.2" step="0.05" value={taglineLetterSpacing} onChange={e => setTaglineLetterSpacing(parseFloat(e.target.value))} style={{ flex: 1, accentColor }} />
                    <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineLetterSpacing.toFixed(2)}em</span>
                  </div>
                </div>
                </>)}
              </div>
            )}
          </div>
        )}

        {/* Guia da marca */}
        {step === 'guia' && plano !== 'avulso' && <GuiaStep brand={brand} accentColor={accentColor} paletteColors={paletteColors} marca={marca} tagline={tagline} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} editData={editDataWithLogo} />}

        {/* Papelaria / Gabaritos */}
        {step === 'papelaria' && <PapelariaStep brand={brand} accentColor={accentColor} paletteColors={orderedPaletteColors} estampaPatterns={estampaPatterns} estampaSelectedIdx={estampaSelectedIdx} cartaoContacts={cartaoContacts} setCartaoContacts={setCartaoContacts} plano={plano} isSaude={isSaude} crmData={crmData} setCrmData={setCrmData} marca={marca} editData={editDataWithLogo} logoColor={logoColor} logoLayout={logoLayout} setLayout={setLayout} clinicaNome={clinicaNome} setClinicaNome={setClinicaNome} onNavSync={setPapelariaNavItens} navIdx={papelariaNavIdx} setNavIdx={setPapelariaNavIdx} customLogoSrc={customLogoSrc} getCustomLogoScale={getCustomLogoScale} setCustomLogoScale={setCustomLogoScale} getCustomLogoScaleMax={getCustomLogoScaleMax} customLogoScaleMap={customLogoScaleMap} submarcaColor={submarcaColor} submarcaTextColor={submarcaTextColor} iconPath={currentIconPath} avulsoParam={avulsoParam} />}

        {/* Ajuda & Inspiração */}
        {step === 'ajuda' && (
          <>
            <AjudaStep brand={brand} accentColor={accentColor} onResendEmail={handleResendEmail} resendingEmail={resendingEmail} resendStatus={resendStatus} />
            {plano === 'avulso' && <AvulsoUpgradeCard accentColor={accentColor} titulo="Quer uma identidade visual completa?" desc="Com o Plano Completo você tem logo, paleta de cores, estampa, guia da marca, pack para Instagram, assinatura de e-mail e todos os impressos personalizados com a sua marca." />}
          </>
        )}

        {/* Upsell — página de fechamento com serviços extras */}
        {step === 'upsell' && (
          <UpsellStep brand={brand} accentColor={accentColor} marca={marca} />
        )}

        {/* Estilos Salvos — acima do preview na aba logo */}
        {step === 'logo' && !customLogoSrc && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 16px', background: '#fcfcfc', borderRadius: '16px', border: '1.5px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>{tLogo.saved_styles || '🎨 Estilos Salvos'}</span>
                {!isSavingPreset ? (
                  <button onClick={() => setIsSavingPreset(true)} style={{ background: `${accentColor}12`, color: accentColor, border: 'none', padding: '5px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>{tLogo.save_current || '+ Salvar atual'}</button>
                ) : null}
              </div>
              {isSavingPreset && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder={tLogo.style_name_placeholder || 'Nome do estilo...'} value={newPresetName} onChange={e => setNewPresetName(e.target.value)} style={{ flex: 1, padding: '7px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif', outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = accentColor} onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'} />
                  <button onClick={() => saveCurrentPreset(newPresetName)} style={{ background: accentColor, color: '#fff', border: 'none', borderRadius: '8px', width: '28px', height: '28px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</button>
                  <button onClick={() => { setIsSavingPreset(false); setNewPresetName(''); }} style={{ background: '#f0f0f0', color: '#666', border: 'none', borderRadius: '8px', width: '28px', height: '28px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✗</button>
                </div>
              )}
              {presets.length > 0 ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {presets.map(p => {
                    const active = activePresetId === p.id;
                    return (
                      <div key={p.id} onClick={() => loadPreset(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', fontWeight: 600, border: `1.5px solid ${active ? accentColor : '#e0e0e0'}`, background: active ? `${accentColor}12` : '#fff', color: active ? accentColor : '#666' }}>
                        <span>{p.name}</span>
                        <span onClick={(e) => deletePreset(p.id, e)} style={{ color: active ? accentColor : '#bbb', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#ff4d4f'} onMouseLeave={e => e.currentTarget.style.color = active ? accentColor : '#bbb'}>×</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '0.65rem', color: '#aaa', fontStyle: 'italic', fontFamily: 'Montserrat, sans-serif' }}>Nenhuma variação salva ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* Área da logo — layout 2 colunas na aba logo, normal nas outras */}
        {step !== 'estampa' && step !== 'cores' && step !== 'paleta' && step !== 'cartao' && step !== 'guia' && step !== 'manifesto' && step !== 'tomdevoz' && step !== 'fonte' && step !== 'placa' && step !== 'papelaria' && step !== 'pack-instagram' && step !== 'assinatura-email' && step !== 'slogan' && step !== 'ajuda' && step !== 'upsell' && (
          step === 'logo' ? (
            /* Layout coluna única: preview full-width + controles compactos abaixo */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Preview full-width */}
              <div
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
                <div style={{ width: '85%', height: '58%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {plano === 'avulso' && !marca && !customLogoSrc ? (
                    <div style={{ textAlign: 'center', color: '#ccc', fontFamily: 'Montserrat, sans-serif' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🖼️</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#bbb', marginBottom: '4px' }}>Envie sua logo acima</div>
                      <div style={{ fontSize: '0.68rem', color: '#ccc' }}>ou digite o nome da marca abaixo</div>
                    </div>
                  ) : (
                    <LogoPreviewHTML editData={{ ...editDataWithLogo, tagline: '' }} color={logoColor} layout={logoLayout} scaleFactor={1.1} maxWidth="100%" maxHeight="100%" />
                  )}
                </div>
              </div>

              {/* {tLogo.layout || '📐 Disposição / Layout'} & Altura das Linhas */}
              {!customLogoSrc && (
                <div style={{ padding: '12px 14px', background: '#fcfcfc', borderRadius: '14px', border: '1.5px solid #eaeaea', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {marca.split(' ').length > 1 && (
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{tLogo.layout || '📐 Disposição / Layout'}</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[
                          { key: 'horizontal', label: tLogo.one_line || '⟵→ Uma linha' },
                          { key: 'balanced', label: tLogo.two_lines || '⊟ Duas linhas', hide: marca.split(' ').length < 3 },
                          { key: 'stacked', label: tLogo.stacked || '≡ Empilhada' },
                        ].filter(o => !o.hide).map(({ key, label }) => (
                          <button key={key} onClick={() => setLayout(key)} style={{ padding: '5px 13px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: logoLayout === key ? logoColor : '#eee', color: logoLayout === key ? '#fff' : '#888', transition: 'all 0.15s ease' }}>{label}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {logoLayout !== 'horizontal' && (
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{tLogo.line_spacing || '↔️ Altura / Espaço entre Linhas'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="range" min="0.5" max="2" step="0.05" value={fontLineHeight} onChange={e => setFontLineHeight(parseFloat(e.target.value))} style={{ flex: 1, accentColor }} />
                        <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{fontLineHeight.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nome da Marca */}
              {!customLogoSrc && (
                <div style={{ padding: '12px 14px', background: '#fcfcfc', borderRadius: '14px', border: '1.5px solid #eaeaea' }}>
                  {plano === 'avulso' ? (
                    /* Avulso: campo aberto direto, sem toggle */
                    <>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{tLogo.brand_name || '✏️ Nome da Marca'}</span>
                      <input
                        value={tempMarca}
                        onChange={e => setTempMarca(e.target.value)}
                        onBlur={() => commitMarcaChange(tempMarca)}
                        onKeyDown={e => { if (e.key === 'Enter') { commitMarcaChange(tempMarca); e.target.blur(); } }}
                        placeholder="Digite o nome da sua marca"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                      />
                    </>
                  ) : (
                    /* Outros planos: toggle */
                    <>
                      <button onClick={() => setShowEdit(v => !v)} style={{ background: 'none', border: 'none', padding: 0, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>{tLogo.brand_name || '✏️ Nome da Marca'}</span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{showEdit ? '▲' : '▼'}</span>
                      </button>
                      {showEdit && (
                        <input
                          value={tempMarca}
                          onChange={e => setTempMarca(e.target.value)}
                          onBlur={() => commitMarcaChange(tempMarca)}
                          onKeyDown={e => { if (e.key === 'Enter') commitMarcaChange(tempMarca); }}
                          placeholder="Nome da marca"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', marginTop: '8px' }}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Origem da Logo */}
              <div style={{ padding: '12px 14px', background: '#fcfcfc', borderRadius: '14px', border: '1.5px solid #eaeaea' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{dictionary?.logo_tab?.origin || '📂 Origem da Logo'}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {plano !== 'avulso' && <button onClick={() => { setCustomLogoSrc(null); setCustomLogoWarn(null); }} style={{ flex: 1, padding: '8px 6px', border: `1.5px solid ${!customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: !customLogoSrc ? `${accentColor}12` : '#fff', color: !customLogoSrc ? accentColor : '#aaa' }}>{dictionary?.logo_tab?.suggested_logo || '✨ Logo sugerida'}</button>}
                  <label style={{ flex: 1, padding: '8px 6px', border: `1.5px solid ${customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: customLogoSrc ? `${accentColor}12` : '#fff', color: customLogoSrc ? accentColor : '#aaa', textAlign: 'center', display: 'block' }}>
                    {customLogoSrc ? '✓ Minha logo' : (dictionary?.logo_tab?.upload_logo || '📤 Enviar minha logo')}
                    <input type="file" accept="image/png" style={{ display: 'none' }} onClick={e => { e.target.value = null; }} onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;

                      // Limite inteligente de 8 uploads para evitar abusos
                      const uploadKey = `brandbox_custom_logo_upload_count_${brand.id}`;
                      const currentCount = parseInt(localStorage.getItem(uploadKey) || '0', 10);
                      if (currentCount >= 8) {
                        setCustomLogoWarn('⚠️ Limite de uploads de logo atingido para este projeto. Caso precise alterar novamente, por favor entre em contato com nosso suporte.');
                        return;
                      }

                      if (file.type !== 'image/png') { setCustomLogoWarn('Por favor envie um arquivo PNG.'); return; }
                      if (file.size > 5 * 1024 * 1024) { setCustomLogoWarn('Arquivo muito grande (máx. 5MB). Otimize o PNG e tente novamente.'); return; }
                      const reader = new FileReader();
                      reader.onload = ev => {
                        const src = ev.target.result;
                        const img = new Image();
                        img.onload = () => {
                          const minDim = Math.min(img.width, img.height);
                          if (minDim < 500) { setCustomLogoWarn(`Imagem muito pequena (${img.width}×${img.height}px). Envie pelo menos 500×500px.`); return; }
                          
                          // Incrementa upload válido
                          try { localStorage.setItem(uploadKey, String(currentCount + 1)); } catch {}
                          const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
                          const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
                          const pts = [[0,0],[img.width-1,0],[0,img.height-1],[img.width-1,img.height-1],[Math.floor(img.width/2),0],[Math.floor(img.width/2),img.height-1]];
                          const hasOpaqueCorner = pts.some(([x,y]) => ctx.getImageData(x,y,1,1).data[3] > 20);
                          const warn = hasOpaqueCorner ? '⚠️ A logo parece ter fundo. Para melhor resultado, use PNG com fundo transparente.' : minDim < 1000 ? `✓ Logo carregada (${img.width}×${img.height}px). Para alta qualidade, recomendamos acima de 1000px.` : null;
                          setCustomLogoWarn(warn);
                          if (!hasOpaqueCorner) {
                            const data = ctx.getImageData(0,0,img.width,img.height).data;
                            let top=img.height,bottom=0,left=img.width,right=0;
                            for (let y=0;y<img.height;y++) for (let x=0;x<img.width;x++) if (data[(y*img.width+x)*4+3]>10) { if(y<top)top=y;if(y>bottom)bottom=y;if(x<left)left=x;if(x>right)right=x; }
                            if (right>left&&bottom>top) {
                              const pad=Math.round(Math.max(img.width,img.height)*0.02);
                              const tx=Math.max(0,left-pad),ty=Math.max(0,top-pad),tw=Math.min(img.width,right+pad)-tx,th=Math.min(img.height,bottom+pad)-ty;
                              const tc=document.createElement('canvas');tc.width=tw;tc.height=th;
                              const tctx=tc.getContext('2d');tctx.drawImage(canvas,tx,ty,tw,th,0,0,tw,th);
                              const td=tctx.getImageData(0,0,tw,th);const d=td.data;
                              for(let i=0;i<d.length;i+=4) if(d[i]>240&&d[i+1]>240&&d[i+2]>240&&d[i+3]>200) d[i+3]=0;
                              tctx.putImageData(td,0,0);setCustomLogoSrc(tc.toDataURL('image/png'));setCustomLogoScaleMapState({});try{localStorage.removeItem('brandbox_custom_logo_scales');}catch{} return;
                            }
                          }
                          setCustomLogoSrc(src);setCustomLogoScaleMapState({});try{localStorage.removeItem('brandbox_custom_logo_scales');}catch{};
                        };
                        img.src = src;
                      };
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                </div>
                {customLogoWarn && <div style={{ fontSize: '0.7rem', color: '#b87000', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.4, marginTop: '6px' }}>{customLogoWarn}</div>}
                {customLogoSrc && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#999', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Escala</span>
                    <input type="range" min="10" max="200" step="5" value={customLogoScale} onChange={e => setCustomLogoScale(parseInt(e.target.value))} style={{ flex: 1, accentColor }} />
                    <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{customLogoScale}%</span>
                  </div>
                )}
              </div>

              {/* Cor Fundo + Cor Logo numa linha */}
              <div style={{ padding: '12px 14px', background: '#fcfcfc', borderRadius: '14px', border: '1.5px solid #eaeaea' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{dictionary?.logo_tab?.bg_color || '🖼️ Cor de Fundo'}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {BG_OPTIONS.map(opt => <ColorDot key={opt.label} color={opt.color} selected={bgColor === opt.color} onClick={() => setBgColor(opt.color)} />)}
                    </div>
                  </div>
                  <div style={{ width: '1px', background: '#eaeaea', alignSelf: 'stretch' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#555', display: 'block', marginBottom: '8px' }}>{dictionary?.logo_tab?.logo_color || '🎨 Cor da Logo'}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['#000000', '#ffffff'].map(hex => <ColorDot key={hex} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} outlined={hex === '#ffffff'} />)}
                      {paletteColors.length > 0
                        ? paletteColors.map((hex, i) => <ColorDot key={i} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} />)
                        : ['#D4C5B0', '#D4A0B0', '#C4A882', '#6B8CAE', '#E2894D'].map(hex => <ColorDot key={hex} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} />)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Layout normal para submarca */
            <div
              ref={logoRef}
              style={{
                width: '100%', aspectRatio: '1 / 1',
                background: submarcaBg || '#f5f5f5',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{ width: '85%', height: '58%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrandTemplateSVG data={seloData} color={submarcaColor || accentColor} textColor={submarcaTextColor} side="verso" hideBackground={true} iconPath={currentIconPath} />
              </div>
            </div>
          )
        )}

        {/* Download card — aba logo */}
        {step === 'logo' && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: '#fcfcfc', borderRadius: '16px', border: '1.5px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>{dictionary?.logo_tab?.download_files || '💾 Baixar Arquivos da Logo'}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button onClick={downloadTransparent} disabled={!!downloading} style={{ flex: 1, padding: '10px 8px', background: '#fff', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', opacity: downloading === 'png' ? 0.6 : 1 }}>
                {downloading === 'png' ? '...' : (dictionary?.logo_tab?.png_transparent || 'PNG Transparente')}
              </button>
              <button onClick={downloadComFundo} disabled={!!downloading} style={{ flex: 1, padding: '10px 8px', background: '#fff', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', opacity: downloading === 'fundo' ? 0.6 : 1 }}>
                {downloading === 'fundo' ? '...' : (dictionary?.logo_tab?.logo_bg || 'Logo com Fundo')}
              </button>
            </div>
          </div>
        )}

        {step !== 'estampa' && step !== 'cores' && step !== 'paleta' && step !== 'cartao' && step !== 'guia' && step !== 'manifesto' && step !== 'tomdevoz' && step !== 'fonte' && step !== 'placa' && step !== 'papelaria' && step !== 'pack-instagram' && step !== 'assinatura-email' && step !== 'slogan' && step !== 'logo' &&
        <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Estilos Salvos / Variações */}
          {!customLogoSrc && step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {tLogo.saved_styles || '🎨 Estilos Salvos'}
                </span>
                {!isSavingPreset ? (
                  <button
                    onClick={() => setIsSavingPreset(true)}
                    style={{
                      background: `${accentColor}12`,
                      color: accentColor,
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Montserrat, sans-serif',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${accentColor}22`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = `${accentColor}12`; e.currentTarget.style.transform = 'none'; }}
                  >
                    + Salvar atual
                  </button>
                ) : null}
              </div>

              {/* Inline Form para criar variação */}
              {isSavingPreset && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={tLogo.style_name_placeholder || 'Nome do estilo...'}
                    value={newPresetName}
                    onChange={e => setNewPresetName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'Montserrat, sans-serif',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = accentColor}
                    onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                  <button
                    onClick={() => saveCurrentPreset(newPresetName)}
                    style={{
                      background: accentColor,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      width: '28px',
                      height: '28px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'none'}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => { setIsSavingPreset(false); setNewPresetName(''); }}
                    style={{
                      background: '#f0f0f0',
                      color: '#666',
                      border: 'none',
                      borderRadius: '8px',
                      width: '28px',
                      height: '28px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✗
                  </button>
                </div>
              )}

              {/* Listagem de presets salvos em formato cápsula */}
              {presets.length > 0 ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {presets.map(p => {
                    const active = activePresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => loadPreset(p)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          border: `1.5px solid ${active ? accentColor : '#e0e0e0'}`,
                          background: active ? `${accentColor}12` : '#fff',
                          color: active ? accentColor : '#666',
                          transition: 'all 0.2s ease',
                          boxShadow: active ? `0 2px 6px ${accentColor}15` : 'none'
                        }}
                      >
                        <span>{p.name}</span>
                        <span
                          onClick={(e) => deletePreset(p.id, e)}
                          style={{
                            color: active ? accentColor : '#bbb',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            paddingLeft: '2px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ff4d4f'}
                          onMouseLeave={e => e.currentTarget.style.color = active ? accentColor : '#bbb'}
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '0.68rem', color: '#aaa', fontStyle: 'italic', fontFamily: 'Montserrat, sans-serif', padding: '4px 0' }}>
                  Nenhuma variação salva ainda. Experimente salvar o estilo atual!
                </div>
              )}
            </div>
          )}

          {/* Upload logo própria */}
          {step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.logo_tab?.origin || '📂 Origem da Logo'}
              </span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={() => { setCustomLogoSrc(null); setCustomLogoWarn(null); }}
                  style={{ flex: 1, padding: '10px 8px', border: `1.5px solid ${!customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: !customLogoSrc ? `${accentColor}12` : '#fff', color: !customLogoSrc ? accentColor : '#aaa', transition: 'all 0.15s' }}
                >
                  {dictionary?.logo_tab?.suggested_logo || '✨ Logo sugerida'}
                </button>
                <label style={{ flex: 1, padding: '10px 8px', border: `1.5px solid ${customLogoSrc ? accentColor : '#e0e0e0'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Montserrat,sans-serif', background: customLogoSrc ? `${accentColor}12` : '#fff', color: customLogoSrc ? accentColor : '#aaa', transition: 'all 0.15s' }}>
                  {customLogoSrc ? '✓ Minha logo' : (dictionary?.logo_tab?.upload_logo || '📤 Enviar minha logo')}
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
                            setCustomLogoScaleMapState({});
                            try { localStorage.removeItem('brandbox_custom_logo_scales'); } catch {}
                            return;
                          }
                        }
                        setCustomLogoSrc(src);
                        setCustomLogoScaleMapState({});
                        try { localStorage.removeItem('brandbox_custom_logo_scales'); } catch {};
                      };
                      img.src = src;
                    };
                    reader.readAsDataURL(file);
                  }} />
                </label>
              </div>
              {customLogoWarn && (
                <div style={{ fontSize: '0.72rem', color: '#b87000', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.4, marginTop: '4px' }}>
                  {customLogoWarn}
                </div>
              )}
              {customLogoSrc && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#999', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>Escala</span>
                  <input type="range" min="10" max="200" step="5" value={customLogoScale}
                    onChange={e => setCustomLogoScale(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '32px' }}>{customLogoScale}%</span>
                </div>
              )}
            </div>
          )}

          {/* Editar nome — colapsável */}
          {!customLogoSrc && step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <button
                onClick={() => setShowEdit(v => !v)}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {tLogo.brand_name || '✏️ Nome da Marca'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{showEdit ? '▲' : '▼'}</span>
              </button>
              {showEdit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <input
                    value={tempMarca}
                    onChange={e => setTempMarca(e.target.value)}
                    onBlur={() => commitMarcaChange(tempMarca)}
                    onKeyDown={e => { if (e.key === 'Enter') commitMarcaChange(tempMarca); }}
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
            </div>
          )}

          {/* Layout da logo */}
          {!customLogoSrc && step === 'logo' && marca.split(' ').length > 1 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {tLogo.layout || '📐 Disposição / Layout'}
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {[
                  { key: 'horizontal', label: tLogo.one_line || '⟵→ Uma linha' },
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.seal_tab?.seal_color || '🏷️ Cor do Selo'}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                {['#000000', '#ffffff'].map(hex => (
                  <ColorDot key={hex} color={hex} selected={(submarcaColor || accentColor) === hex} onClick={() => setSubmarcaColor(hex)} outlined={hex === '#ffffff'} />
                ))}
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={(submarcaColor || accentColor) === hex} onClick={() => setSubmarcaColor(hex)} />
                ))}
              </div>
            </div>
          )}

          {/* Texto do Selo: Nome da Marca ou Slogan */}
          {step === 'submarca' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.seal_tab?.seal_text || '✍️ Texto do Selo'}
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => setSubmarcaTextType('marca')}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: '20px',
                    fontSize: '0.68rem', fontWeight: 700,
                    background: submarcaTextType === 'marca' ? (submarcaColor || accentColor) : '#eee',
                    color: submarcaTextType === 'marca' ? '#fff' : '#888',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  {dictionary?.seal_tab?.brand_name || 'Nome da Marca'}
                </button>
                <button
                  onClick={() => setSubmarcaTextType('slogan')}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: '20px',
                    fontSize: '0.68rem', fontWeight: 700,
                    background: submarcaTextType === 'slogan' ? (submarcaColor || accentColor) : '#eee',
                    color: submarcaTextType === 'slogan' ? '#fff' : '#888',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  {dictionary?.seal_tab?.brand_tagline || 'Tagline da Marca'}
                </button>
              </div>
            </div>
          )}

          {/* Fundo (só na logo) */}
          {step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.logo_tab?.bg_color || '🖼️ Cor de Fundo'}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                {BG_OPTIONS.map(opt => (
                  <ColorDot
                    key={opt.label}
                    color={opt.color}
                    selected={bgColor === opt.color}
                    onClick={() => setBgColor(opt.color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ícone da submarca (só aparece na etapa submarca) */}
          {step === 'submarca' && styleIcons.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.seal_tab?.icon || '🌸 Ícone'}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
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

          {/* Cor da logo (só na logo) */}
          {step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.logo_tab?.logo_color || '🎨 Cor da Logo'}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                {/* Opções fixas: preto e branco */}
                {['#000000', '#ffffff'].map(hex => (
                  <ColorDot key={hex} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} outlined={hex === '#ffffff'} />
                ))}
                {/* Cores da paleta */}
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} />
                ))}
              </div>
            </div>
          )}

          {/* Tagline — sempre visível na aba logo (agora abaixo da cor da logo) */}
          {!customLogoSrc && step === 'logo' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.tagline_tab?.brand_tagline || '💬 Tagline da Marca'}
              </span>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder={dictionary?.tagline_tab?.placeholder || 'Ex: Delicadeza em cada detalhe'}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${logoColor}22`, fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', background: '#fff', outline: 'none', color: '#444', letterSpacing: '0.3px', marginTop: '4px' }}
              />
              {/* Toggle de quebra de slogan */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <button onClick={() => setTaglineWrap(false)} style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: !taglineWrap ? logoColor : '#eee', color: !taglineWrap ? '#fff' : '#888', cursor: 'pointer', transition: '0.2s' }}>{dictionary?.tagline_tab?.one_line || '1 Linha'}</button>
                <button onClick={() => setTaglineWrap(true)} style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: taglineWrap ? logoColor : '#eee', color: taglineWrap ? '#fff' : '#888', cursor: 'pointer', transition: '0.2s' }}>{dictionary?.tagline_tab?.two_lines || '2 Linhas'}</button>
              </div>
              {/* Sliders de ajuste fino */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px', padding: '10px', background: '#f8f8f8', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '90px' }}>{dictionary?.tagline_tab?.scale || 'Escala Tagline'}</span>
                  <input type="range" min="0.2" max="2.5" step="0.05" 
                    value={taglineSizeBoost}
                    onChange={e => setTaglineSizeBoost(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#C03B66' }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineSizeBoost.toFixed(2)}×</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '90px' }}>{dictionary?.tagline_tab?.distance_tagline || 'Distância Tagline'}</span>
                  <input type="range" min="0" max="1.5" step="0.05" 
                    value={taglineGap}
                    onChange={e => setTaglineGap(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#C03B66' }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineGap.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '90px' }}>{dictionary?.tagline_tab?.spacing_slider || 'Espaçamento'}</span>
                  <input type="range" min="0.05" max="1.2" step="0.05" 
                    value={taglineLetterSpacing}
                    onChange={e => setTaglineLetterSpacing(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#C03B66' }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{taglineLetterSpacing.toFixed(2)}em</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600, fontFamily: 'Montserrat,sans-serif', width: '90px' }}>Altura Logo</span>
                  <input type="range" min="0.5" max="2" step="0.05" 
                    value={fontLineHeight}
                    onChange={e => setFontLineHeight(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#C03B66' }} />
                  <span style={{ fontSize: '0.68rem', color: '#aaa', width: '30px' }}>{fontLineHeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cor do texto (só na submarca) */}
          {step === 'submarca' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.seal_tab?.text_color || '✍️ Cor do Texto'}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                {/* Opções fixas: preto e branco */}
                {['#000000', '#ffffff'].map(hex => (
                  <ColorDot key={hex} color={hex} selected={submarcaTextColor === hex} onClick={() => setSubmarcaTextColor(hex)} outlined={hex === '#ffffff'} />
                ))}
                {/* Cores da paleta */}
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={submarcaTextColor === hex} onClick={() => setSubmarcaTextColor(hex)} />
                ))}
              </div>
            </div>
          )}

          {/* CARD DE DOWNLOAD (AÇÃO PRO) — AGORA ENVELOPADO E COM ESPAÇAMENTO */}
          {(step === 'logo' || step === 'submarca') && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              background: '#fcfcfc',
              borderRadius: '16px',
              border: '1.5px solid #eaeaea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
              marginBottom: '14px' // Espaçamento generoso do botão de ir para a próxima etapa
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#333', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dictionary?.seal_tab?.download_files || '💾 Baixar Arquivos do Selo'}
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={downloadTransparent}
                  disabled={!!downloading}
                  style={{ flex: 1, padding: '10px 8px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', opacity: downloading === 'png' ? 0.6 : 1 }}
                >
                  {downloading === 'png' ? '...' : (dictionary?.seal_tab?.png_transparent || 'PNG Transparente')}
                </button>
                <button
                  onClick={downloadComFundo}
                  disabled={!!downloading}
                  style={{ flex: 1, padding: '10px 8px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', opacity: downloading === 'fundo' ? 0.6 : 1 }}
                >
                  {downloading === 'fundo' ? '...' : (dictionary?.seal_tab?.seal_bg || 'Selo com Fundo')}
                </button>
              </div>
            </div>
          )}
        </div>}

        {/* Botões REDESENHADOS */}
        <div style={{ marginTop: '1.6rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* BOTÕES DE DOWNLOAD (AÇÃO PRO) */}
          {/* BOTÕES DE DOWNLOAD (AÇÃO PRO) - MAIS SUTIS */}


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
            }} style={{ width: '100%', padding: '14px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              {dictionary?.ui?.baixar_png || '⬇ Baixar PNG'}
            </button>
          )}

          {step === 'assinatura-email' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => {
                const el = document.querySelector('[data-assinatura-copy]');
                if (el) {
                  el.click();
                  setCopiedAssinatura(true);
                  setTimeout(() => setCopiedAssinatura(false), 2000);
                }
              }}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  background: copiedAssinatura ? '#4CAF50' : 'none',
                  color: copiedAssinatura ? '#fff' : accentColor,
                  border: `2px solid ${copiedAssinatura ? '#4CAF50' : accentColor}`,
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {copiedAssinatura ? (dictionary?.ui?.copiado || 'Copiado!') : (dictionary?.ui?.copiar_html || 'Copiar HTML →')}
              </button>
              <button onClick={async () => {
                const el = document.querySelector('[data-assinatura-preview]');
                if (!el) return;
                const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                link.download = `Assinatura-Email_${marca || 'marca'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
              }} style={{ flex: 1, padding: '14px 8px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                {dictionary?.ui?.baixar_png || '⬇ Baixar PNG'}
              </button>
            </div>
          )}

          {step === 'paleta' && (
            <button onClick={downloadCoresPNG} disabled={downloadingCores} style={{ width: '100%', padding: '14px', background: '#fff', color: '#C03B66', border: '1.5px solid #C03B66', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: downloadingCores ? 0.6 : 1 }}>
              {downloadingCores ? '...' : (dictionary?.guide_tab?.download_palette || '⬇ Baixar Paleta de Cores')}
            </button>
          )}

          {/* NAVEGAÇÃO ENTRE ETAPAS (PRINCIPAL) - SEMPRE NO FINAL */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {!isFirstStep && (
              <button
                onClick={goBack}
                style={{ flex: 0.4, padding: '14px', background: '#eee', color: '#888', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                ← {dictionary?.geral?.voltar || 'Voltar'}
              </button>
            )}
            {!isLastStep && (
              <button
                onClick={goNext}
                style={{ flex: 1, padding: '14px', background: '#C03B66', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(192, 59, 102, 0.3)' }}
              >
                {step === 'guia' ? `${dictionary?.geral?.ir_digital || 'Ir para o Digital'} →` : step === 'assinatura-email' ? `${dictionary?.geral?.ir_papelaria || 'Ir para Papelaria'} →` : `${dictionary?.geral?.proxima_etapa || 'Próxima etapa'} →`}
              </button>
            )}
          </div>

        </div>

        </div> {/* Fecha o div de padding das etapas */}

        {/* Link de reset para testes */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button
            onClick={() => {
              localStorage.removeItem('brandbox_delivery');
              localStorage.removeItem(`brandbox_cartao_${brand.id}`);
              localStorage.removeItem(`brandbox_step_${brand.id}`);
              localStorage.removeItem('brandbox_cartao');
              localStorage.removeItem('brandbox_step');
              window.location.href = '/';
            }}
            style={{ background: 'none', border: 'none', fontSize: '0.62rem', color: '#ddd', cursor: 'pointer', letterSpacing: '1px' }}
          >
            {dictionary?.reiniciar_teste || 'reiniciar teste'}
          </button>
        </div>

      </div>
    </div>
  );
}

function SucessoContent() {
  const params = useSearchParams();
  const { dictionary } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0); // 0 = Welcome screen, 1 = Instructions screen
  const [showAvulsoWelcome, setShowAvulsoWelcome] = useState(() => {
    try {
      const _params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (!_params || !_params.has('avulso')) return false;
      const _ap = _params.get('avulso') || 'inicio';
      return localStorage.getItem('brandbox_avulso_welcome_' + _ap) !== 'seen';
    } catch { return false; }
  });
  const [avulsoEmail, setAvulsoEmail] = useState('');
  const [avulsoEmailSending, setAvulsoEmailSending] = useState(false);
  const [avulsoEmailSent, setAvulsoEmailSent] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('brandbox_welcome_seen') === 'true';
    } catch {
      return false;
    }
  });
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

  const sessionParam = params.get('session');
  const planoParam = params.get('plano');
  const devMode = params.get('dev') === '1';
  const avulsoParam = params.has('avulso') ? (params.get('avulso') || 'inicio') : null;

  useEffect(() => {
    if (params.get('reset') === '1') {
      localStorage.removeItem('brandbox_step');
      localStorage.removeItem('brandbox_crm');
      localStorage.removeItem('brandbox_papelaria');
      localStorage.removeItem('brandbox_session');
      localStorage.removeItem('brandbox_email_sent');
      localStorage.removeItem('brandbox_progress');
      localStorage.removeItem('brandbox_delivery');
      localStorage.removeItem('brandbox_custom_logo_scales');
      window.location.href = '/sucesso';
      return;
    }

    // Limpeza preventiva: se o localStorage estiver próximo do limite, remove brandbox_delivery
    // (dado mais pesado) para evitar QuotaExceededError no carregamento
    try {
      const _testKey = '__lsTest__';
      localStorage.setItem(_testKey, '1');
      localStorage.removeItem(_testKey);
    } catch (_lsFull) {
      // localStorage cheio: limpa o dado mais pesado para destravar o app
      try { localStorage.removeItem('brandbox_delivery'); } catch {}
      try { localStorage.removeItem('brandbox_custom_logo_scales'); } catch {}
    }

    // Se chegou aqui com sucesso, o rascunho anterior não faz mais sentido oferecer na home
    localStorage.removeItem('brandbox_progress');
    localStorage.removeItem('brandbox_step');

    const loadData = async () => {
      if (avulsoParam && !sessionParam) {
        const AVULSO_PARAM_MAP = {
          'grafico': 'Gráfico de Crescimento',
          'cartao-visita': 'Cartão de Visita',
          'cartao-retorno': 'Cartão de Retorno',
          'agradecimento': 'Cartão de Agradecimento (10x15cm)',
          'papel-timbrado': 'Papel Timbrado',
          'papel-presente': 'Papel de Presente',
          'tag-sacola': 'Tag para Sacola',
          'etiqueta': 'Etiqueta para Correios',
          'envelope-oficio': 'Envelope Ofício (23x11,5cm)',
          'envelope-saco': 'Envelope Saco (24x34cm)',
          'recibo': 'Recibo',
          'pasta': 'Pasta A4',
          'caneca': 'Caneca',
          'caderno': 'Caderno (Capa e Contra-capa)',
          'receituario': 'Receituário Padrão (A4 e A5)',
          'atestado': 'Atestado Médico (A4 e A5)',
          'controle-especial': 'Receituário de Controle Especial',
          'prontuario': 'Prontuário Médico',
          'receita-alta': 'Receita de Alta',
          'ficha': 'Ficha de Cadastro',
          'guia-alimentar': 'Guia Alimentar',
          'guia-cuidados': 'Guia de Cuidados',
          'guia-desenvolvimento': 'Guia de Desenvolvimento',
          'guia-vacina': 'Guia de Vacina c/ Calendário',
          'prenatal': 'Cartão de Exame Pré-Natal',
          'checklist': 'Checklist Maternidade',
          'guia-sono': 'Guia do Sono',
          'orientacoes-rn': 'Orientações p/ Recém Nascidos',
          'certificado': 'Certificado de Coragem',
          'diario-xixi': 'Diário do Xixi',
          'pratinho': 'Meu Pratinho',
          'amamentacao': 'Guia de Amamentação',
        };
        const itemName = AVULSO_PARAM_MAP[avulsoParam] || null;

        const AVULSO_VERSION = 7;
        // Paleta padrão BrandBox para clientes avulso
        const AVULSO_PALETTE = ['#D4C5B0', '#D4A0B0', '#C4A882', '#6B8CAE', '#E2894D'];
        const defaultAvulsoBrand = {
          _v: AVULSO_VERSION,
          plano: 'avulso',
          papelariaSelecionada: itemName ? [itemName] : [],
          formData: { nome: '', especialidade: '', cr: '', atuacao: 'Pediatria / Saúde infantil' },
          editData: { marca: '', fontStyle: 'serif', colors: AVULSO_PALETTE, fontSizeBoost: 0.65 },
          activeColor: '#D4C5B0',
          currentPaletteColors: AVULSO_PALETTE,
        };

        const savedAvulso = localStorage.getItem('brandbox_avulso_' + avulsoParam);
        if (savedAvulso) {
          const saved = JSON.parse(savedAvulso);
          if ((saved._v || 1) < AVULSO_VERSION) {
            // Versão antiga: atualiza defaults mas preserva o que o cliente já personalizou
            const merged = {
              ...defaultAvulsoBrand,
              editData: {
                ...defaultAvulsoBrand.editData,
                // Mantém a marca se o cliente já digitou algo diferente dos placeholders antigos
                marca: (saved.editData?.marca && !['SUA MARCA', 'SUA LOGO', ''].includes(saved.editData.marca)) ? saved.editData.marca : '',
                fontSizeBoost: defaultAvulsoBrand.editData.fontSizeBoost,
                // Preserva cores personalizadas se o usuário já editou
                colors: saved.editData?.colors || defaultAvulsoBrand.editData.colors,
              },
              // Mantém a cor só se o cliente já tinha escolhido algo diferente do pink padrão
              activeColor: (saved.activeColor && saved.activeColor !== '#dc3495') ? saved.activeColor : defaultAvulsoBrand.activeColor,
              // Preserva paleta personalizada se o usuário já editou
              currentPaletteColors: saved.currentPaletteColors || defaultAvulsoBrand.currentPaletteColors,
            };
            setBrand(merged);
            localStorage.setItem('brandbox_avulso_' + avulsoParam, JSON.stringify(merged));
          } else {
            setBrand(saved);
          }
        } else {
           setBrand(defaultAvulsoBrand);
           localStorage.setItem('brandbox_avulso_' + avulsoParam, JSON.stringify(defaultAvulsoBrand));
           // Sobrescreve o brandbox_delivery para que as edições locais funcionem na mesma estrutura
           localStorage.setItem('brandbox_delivery', JSON.stringify(defaultAvulsoBrand));
        }
        setPlano('avulso');
        setLoading(false);
        return;
      }

      // 1. Prioridade: API Route server-side (usa service role, bypassa RLS)
      if (sessionParam) {
        localStorage.setItem('brandbox_session', sessionParam);
        
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;

        while (attempts < maxAttempts && !success) {
          attempts++;
          try {
            const res = await fetch(`/api/get-entrega?id=${sessionParam}`);
            const json = await res.json();
            const data = json.data;

            if (res.ok && data && data.brand_data) {
              let brandFromDb = data.brand_data;

              // Se voltou do Stripe após upsell OU ainda tem pending não salvo, mescla ao brand_data
              const _pendingRaw = localStorage.getItem('brandbox_pending_upsell');
              const _pending = _pendingRaw ? (() => { try { return JSON.parse(_pendingRaw); } catch { return null; } })() : null;
              if (_pending && _pending.length > 0) {
                try {
                  const existentes = brandFromDb.papelariaSelecionada || [];
                  const merged = [...new Set([...existentes, ..._pending])];
                  brandFromDb = { ...brandFromDb, papelariaSelecionada: merged };
                  // Só remove do localStorage depois que o banco confirmar
                  fetch('/api/salvar-upsell', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: sessionParam, itensSelecionados: merged }),
                  }).then(r => r.json()).then(r => {
                    if (r.ok) localStorage.removeItem('brandbox_pending_upsell');
                  }).catch(() => {});
                } catch (e) { console.warn('Upsell merge failed:', e); }
              }

              try {
                // Tenta salvar versão completa; se exceder quota, salva versão enxuta (sem base64 de estampas)
                const _deliveryStr = JSON.stringify(brandFromDb);
                try {
                  localStorage.setItem('brandbox_delivery', _deliveryStr);
                } catch (_qe) {
                  // Quota excedida: limpa dados antigos e tenta versão enxuta sem estampas em base64
                  try { localStorage.removeItem('brandbox_delivery'); } catch {}
                  const _slim = { ...brandFromDb };
                  if (_slim.estampaPatterns) {
                    _slim.estampaPatterns = _slim.estampaPatterns.map(p => p.base64 ? { ...p, base64: null } : p);
                  }
                  try { localStorage.setItem('brandbox_delivery', JSON.stringify(_slim)); } catch {}
                  console.warn('brandbox_delivery salvo sem base64 (localStorage cheio):', _qe.name);
                }
                localStorage.setItem('brandbox_plano', data.plano || 'pro');
              } catch (e) { console.warn('Sync failed:', e); }

              setBrand(brandFromDb);
              const derivedPlano = (data.plano === 'complete' ? 'pro' : (data.plano || 'starter'));
              setPlano(derivedPlano);

              if (planoParam) setShowWelcome(true);
              setLoading(false);

              // Background email dispatch
              if (!data.email_enviado && data.email) {
                fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: data.email, marca: data.marca, sessionId: sessionParam, plano: derivedPlano }),
                }).then(() => {
                  fetch('/api/get-entrega', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: sessionParam }),
                  }).catch(() => {});
                }).catch(() => {});
              }
              success = true;
              return; 
            }
          } catch (e) { 
            console.warn(`Fetch attempt ${attempts} failed:`, e); 
          }
          
          if (!success && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }

      // 2. Fallback: LocalStorage
      try {
        const saved = localStorage.getItem('brandbox_delivery');
        if (saved) {
          const parsed = JSON.parse(saved);
          setBrand(parsed);
          const urlPlano = planoParam === 'pro' ? 'pro' : null;
          const savedPlano = urlPlano || localStorage.getItem('brandbox_plano') || (parsed.plano === 'complete' ? 'pro' : (parsed.plano || 'starter'));
          if (urlPlano) {
             localStorage.setItem('brandbox_plano', urlPlano);
             const updatedDelivery = { ...parsed, plano: urlPlano };
             localStorage.setItem('brandbox_delivery', JSON.stringify(updatedDelivery));
          }
          setPlano(savedPlano);
          if (planoParam) setShowWelcome(true);
        }
      } catch (e) { console.error('LocalStorage load failed:', e); }
      
      setLoading(false);
    };

    loadData();
  }, [sessionParam, planoParam]);


  if (loading) return null;

  if (showAvulsoWelcome && brand?.plano === 'avulso') {
    const accentAvulso = brand?.activeColor || '#D4C5B0';
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #fdf9f5 0%, #f5f0eb 100%)', padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.6rem' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>🎨</div>
          <div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accentAvulso, fontWeight: 700, margin: '0 0 0.6rem' }}>THE BRAND BOX</p>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, margin: 0 }}>
              {avulsoParam === 'inicio' ? 'Bem-vinda à The Brand Box!' : 'Bem-vinda à sua área criativa!'}
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.8, margin: 0 }}>
            {avulsoParam === 'inicio'
              ? 'Aqui você escolhe, personaliza e compra impressos avulsos com a sua marca. Veja como funciona:'
              : 'Aqui você personaliza e baixa os seus impressos. Siga os passos abaixo para começar:'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left' }}>
            {(avulsoParam === 'inicio' ? [
              { num: '1', icon: '🔍', titulo: 'Escolha um item', desc: 'Navegue pela aba Os Impressos e veja o preview de cada peça com a sua marca.' },
              { num: '2', icon: '🎨', titulo: 'Personalize', desc: 'Edite o nome da marca, cores e dados de contato em A Marca → Logo / Cores.' },
              { num: '3', icon: '🛒', titulo: 'Compre o arquivo', desc: 'Clique em "Comprar Arquivo" no item desejado e finalize o pagamento com segurança.' },
            ] : [
              { num: '1', icon: '✍️', titulo: 'Escreva o nome da sua marca', desc: 'Vá na aba A Marca → Logo e digite o nome que vai aparecer nos seus materiais.' },
              { num: '2', icon: '🎨', titulo: 'Escolha suas cores', desc: 'Na aba A Marca → Cores, clique no círculo para personalizar cada cor da paleta.' },
              { num: '3', icon: '📄', titulo: 'Acesse seus impressos', desc: 'Clique em Os Impressos para visualizar, personalizar e baixar seus arquivos PDF.' },
            ]).map(({ num, icon, titulo, desc }) => (
              <div key={num} style={{ display: 'flex', gap: '14px', background: '#fff', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accentAvulso + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>{icon}</div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.82rem', color: '#1a1a1a' }}>{titulo}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#777', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {avulsoParam === 'inicio' ? (
            <button
              onClick={() => {
                try { localStorage.setItem('brandbox_avulso_welcome_' + avulsoParam, 'seen'); } catch {}
                setShowAvulsoWelcome(false);
              }}
              style={{ background: `linear-gradient(135deg, ${accentAvulso}, ${accentAvulso}cc)`, color: '#fff', border: 'none', borderRadius: '50px', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: `0 10px 30px ${accentAvulso}55`, width: '100%' }}
            >
              Começar →
            </button>
          ) : (
            <>
              {/* Campo de email */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#444' }}>
                  📧 Para onde enviamos seu link de acesso?
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#999', lineHeight: 1.5 }}>
                  Guarde o link para acessar seus arquivos quando quiser.
                </p>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={avulsoEmail}
                  onChange={e => setAvulsoEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e0dbd5', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#333' }}
                />
                {avulsoEmailSent && (
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#1a7a6e', fontWeight: 700 }}>✓ E-mail enviado! Confira sua caixa de entrada.</p>
                )}
              </div>

              <button
                disabled={avulsoEmailSending || !avulsoEmail.includes('@')}
                onClick={async () => {
                  setAvulsoEmailSending(true);
                  const origin = window.location.origin;
                  const link = `${origin}/pt-BR/sucesso?avulso=${avulsoParam}`;
                  try {
                    await fetch('/api/send-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: avulsoEmail, marca: brand?.editData?.marca || '', sessionId: null, plano: 'avulso', avulsoLink: link }),
                    });
                    setAvulsoEmailSent(true);
                  } catch {}
                  setAvulsoEmailSending(false);
                  try { localStorage.setItem('brandbox_avulso_welcome_' + avulsoParam, 'seen'); } catch {}
                  setShowAvulsoWelcome(false);
                }}
                style={{ background: `linear-gradient(135deg, ${accentAvulso}, ${accentAvulso}cc)`, color: '#fff', border: 'none', borderRadius: '50px', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700, cursor: (avulsoEmailSending || !avulsoEmail.includes('@')) ? 'default' : 'pointer', boxShadow: `0 10px 30px ${accentAvulso}55`, width: '100%', opacity: (avulsoEmailSending || !avulsoEmail.includes('@')) ? 0.5 : 1, transition: 'opacity 0.2s' }}
              >
                {avulsoEmailSending ? 'Enviando...' : 'Enviar link e começar →'}
              </button>
              <button
                onClick={() => {
                  try { localStorage.setItem('brandbox_avulso_welcome_' + avulsoParam, 'seen'); } catch {}
                  setShowAvulsoWelcome(false);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#bbb', textDecoration: 'underline', padding: '4px' }}
              >
                Pular e acessar sem salvar o link
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (showWelcome) {
    const rawNome = brand?.formData?.nome || brand?.editData?.marca || '';
    const nomeCliente = rawNome.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    if (welcomeStep === 1) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)',
          padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Fundo decorativo */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(192,59,102,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(60,204,191,0.07)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            {/* Ícone */}
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>✨</div>

            {/* Título */}
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#C03B66', fontWeight: 700, marginBottom: '0.5rem' }}>
                Instruções & Dicas
              </p>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, margin: 0 }}>
                Como aproveitar sua experiência
              </h1>
            </div>

            {/* Instructions Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '24px 20px',
              boxShadow: '0 8px 32px rgba(192, 59, 102, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'left'
            }}>
              {[
                {
                  color: '#C03B66',
                  title: 'Use um Computador',
                  desc: 'Para melhor aproveitamento visual e facilidade ao baixar as artes e arquivos em alta qualidade.'
                },
                {
                  color: '#4EB0B5',
                  title: 'Siga o Botão de Avançar',
                  desc: 'Avançar passo a passo ajuda a construir sua identidade visual de forma fluida e natural.'
                },
                {
                  color: '#FBDA86',
                  title: 'Responda com Calma & Esteja Presente',
                  desc: 'Responda às perguntas com carinho e presença enquanto você vivencia a criação da sua marca.'
                },
                {
                  color: '#E08E79',
                  title: 'Consulte o Guia de Ajuda',
                  desc: 'Na dúvida, nossa aba de Ajuda tem todas as dicas e inspirações para te apoiar no processo.'
                }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: '6px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a', fontFamily: 'Montserrat, sans-serif' }}>{item.title}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#666', lineHeight: 1.4, fontFamily: 'Montserrat, sans-serif' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warm Closing */}
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#444',
              lineHeight: 1.5,
              margin: '0.5rem 0 0 0'
            }}>
              "Desejamos a você uma excelente experiência com a The Brand Box!" 🤍
            </p>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (!welcomeSeen) {
                  try { localStorage.setItem('brandbox_welcome_seen', 'true'); } catch {}
                  setWelcomeSeen(true);
                }
                setShowWelcome(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #C03B66, #a12d52)',
                color: '#fff', border: 'none', borderRadius: '50px',
                padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.3px',
                boxShadow: '0 10px 30px rgba(192, 59, 102, 0.3)',
                transition: 'transform 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {welcomeSeen ? 'Entrar na minha Brand Box →' : 'Começar minha experiência →'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #fff5fb 0%, #f0f9ff 100%)',
        padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Fundo decorativo */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(192,59,102,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(60,204,191,0.07)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {/* Ícone */}
          <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>✨</div>

          {/* Título */}
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#C03B66', fontWeight: 700, marginBottom: '0.75rem' }}>
              BRAND BOX
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, margin: 0 }}>
              {nomeCliente
                ? <><span style={{ fontFamily: "Sacramento, cursive", fontSize: '2.8rem', fontWeight: 400, color: '#1a1a1a' }}>{nomeCliente}</span><span style={{ fontWeight: 400, color: '#555', fontSize: '1.3rem' }}>,</span><br /></>
                : null
              }
              <span style={{ fontWeight: 800, color: '#1a1a1a' }}>
                {welcomeSeen ? 'sua Brand Box está te esperando!' : 'sua marca começou a ganhar forma ✨'}
              </span>
            </h1>
          </div>

          {/* Mensagem emocional */}
          {welcomeSeen ? (
            <div style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.8, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <p style={{ margin: 0 }}>
                Sua marca continua aqui, pronta para evoluir com você.
              </p>
              <p style={{ margin: 0 }}>
                Continue explorando combinações, ajustando detalhes e construindo uma marca cada vez mais sua.
              </p>
            </div>
          ) : (
            <div style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.8, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <p style={{ margin: 0 }}>
                Esse é o primeiro passo da sua Brand Box.
              </p>
              <p style={{ margin: 0 }}>
                A partir de agora, vamos te guiar por uma experiência criativa construída para transformar ideias, referências e essência em uma identidade visual completa.
              </p>
              <p style={{ margin: 0, fontWeight: 600, color: '#C03B66', marginTop: '0.4rem' }}>
                Você faz as escolhas. Nós organizamos o caminho.
              </p>
            </div>
          )}

          {/* Separador */}
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #C03B66, #3cccbf)', borderRadius: '2px' }} />

          {/* CTA */}
          <button
            onClick={() => {
              setWelcomeStep(1);
            }}
            style={{
              background: 'linear-gradient(135deg, #C03B66, #a12d52)',
              color: '#fff', border: 'none', borderRadius: '50px',
              padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.3px',
              boxShadow: '0 10px 30px rgba(192, 59, 102, 0.3)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {welcomeSeen ? 'Entrar na minha Brand Box →' : 'Começar minha marca →'}
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
        <p style={{ fontSize: '1rem', color: '#666', maxWidth: '450px', lineHeight: 1.7, marginBottom: '2rem' }}>
          Não conseguimos localizar os dados da sua identidade visual. Isso pode acontecer se o link expirou ou se houve um erro na finalização.<br/><br/>
          <strong>💡 Dica:</strong> Verifique seu e-mail, procure pela mensagem de confirmação do <strong>The Brand Box</strong> e tente acessar o link exclusivo novamente.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/" style={{ padding: '14px 28px', background: '#dc3495', color: '#fff', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 20px rgba(220,52,149,0.2)' }}>
            Criar nova marca
          </a>
          <button onClick={() => window.location.reload()} style={{ padding: '14px 28px', background: '#f5f5f5', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Tentar novamente
          </button>
          <a href="https://wa.me/4793630746" target="_blank" style={{ padding: '14px 28px', background: '#25D366', color: '#fff', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 20px rgba(37,211,102,0.2)' }}>
            Falar com suporte
          </a>
        </div>
      </div>
    );
  }

  return <EntregaContent brand={brand} plano={plano} setBrand={setBrand} />;
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
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '10px 8px', 
      boxSizing: 'border-box', 
      background: '#fff',
      position: 'relative',
      clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none',
      paddingTop: folderRoof ? '38px' : '15px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '15px', width: '100%' }}>
        <div style={{ width: '100%', height: '20px', marginBottom: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{logoComponent}</div>
        <div style={{ width: '35px', height: '1.5px', background: mainColor }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', letterSpacing: '2.5px', textTransform: 'uppercase' }}>{d?.guia_de || 'GUIA DE'}</div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#333', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1.1 }}>{d?.amamentacao_titulo || 'AMAMENTAÇÃO'}</div>
        </div>
        
        <div style={{ 
          padding: '2.5px 12px', 
          background: `${mainColor}15`, 
          borderRadius: '20px', 
          border: `0.3px solid ${mainColor}30`,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
           <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{d?.aleitamento || 'ALEITAMENTO MATERNO EXCLUSIVO'}</div>
        </div>
      </div>

      <div style={{ width: '100%', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 5px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>{d?.nome_label || 'NOME:'}</span>
           <div style={{ flex: 1, borderBottom: `0.3px solid ${mainColor}40`, height: '7px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>{d?.nascimento_label || 'NASCIMENTO:'}</span>
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
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '8px', borderRadius: '1px', textAlign: 'center' }}>{d?.alimentacao_mae || 'ALIMENTAÇÃO DA MÃE'}</div>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '10px' }}>
        {d?.alimentacao_texto_1 || 'Recomenda-se uma alimentação balanceada, rica em proteínas, fibras e vitaminas. Coma diversas vezes ao dia em pequenas porções para manter a energia.'}
      </p>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '15px' }}>
        <strong>{d?.agua_titulo || 'Água'}:</strong> {d?.agua_texto || 'consuma ao menos dois litros por dia. Mantenha copos d\'água nos cômodos onde você mais amamenta.'}
      </p>
      
      <div style={{ marginTop: '20px', border: `0.3px solid ${mainColor}40`, padding: '8px', borderRadius: '5px', background: `${mainColor}05` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '8px', textAlign: 'center', fontSize: '5.2px', letterSpacing: '0.5px' }}>{d?.composicao_leite || 'COMPOSIÇÃO DO LEITE MATERNO'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
          {[
            { label: d?.agentes_protecao || 'Agentes de proteção', w: '100%', c: mainColor },
            { label: d?.crescimento || 'Crescimento', w: '90%', c: palette[1] || mainColor },
            { label: d?.microbiota || 'Microbiota', w: '80%', c: palette[2] || mainColor },
            { label: d?.energia || 'Energia', w: '70%', c: palette[3] || mainColor },
            { label: d?.cerebro || 'Cérebro', w: '60%', c: palette[4] || mainColor },
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
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>{d?.problemas_comuns || 'PROBLEMAS COMUNS'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>{d?.fissuras_mamilos || 'Fissuras nos Mamilos'}</div>
          <p style={{ lineHeight: 1.4 }}><strong>Causa:</strong> {d?.fissuras_causa || 'Má posição do bebê ou técnica incorreta.'}</p>
          <p style={{ lineHeight: 1.4 }}><strong>Tratamento:</strong> {d?.fissuras_tratamento || 'Corrija a técnica, aplique leite materno após as mamadas.'}</p>
        </section>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>{d?.ingurgitamento || 'Ingurgitamento Mamário'}</div>
          <p style={{ lineHeight: 1.4 }}><strong>Causa:</strong> {d?.ingurgitamento_causa || 'Desequilíbrio na produção e drenagem.'}</p>
          <p style={{ lineHeight: 1.4 }}><strong>Alívio:</strong> {d?.ingurgitamento_alivio || 'Esvazie manualmente, faça massagens suaves na mama.'}</p>
        </section>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>{d?.antes_retorno || 'Antes do retorno:'}</div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: `${d?.antes_retorno_itens_1 || '• Aleitamento exclusivo'}<br/>${d?.antes_retorno_itens_2 || '• Retirada no local'}` }} />
        </div>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>{d?.apos_retorno || 'Após o retorno:'}</div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: `${d?.apos_retorno_itens_1 || '• Amamentar em casa'}<br/>${d?.apos_retorno_itens_2 || '• Ordenha no trabalho'}` }} />
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage4({ accentColor, borderColor, palette = [], clinicaNome, endereco, allPhones, brand }) {
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>{d?.apoio_emocional || 'APOIO EMOCIONAL'}</div>
      <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '4.6px' }}>{d?.apoio_familia || 'O apoio da família é fundamental:'}</p>
      <ul style={{ paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.5 }}>
        <li>{d?.apoio_item_1 || 'Ambiente calmo favorece a amamentação.'}</li>
        <li>{d?.apoio_item_2 || 'A mãe precisa de apoio em sua decisão.'}</li>
        <li>{d?.apoio_item_3 || 'Dividir as tarefas de casa é essencial.'}</li>
      </ul>
      <div style={{ background: '#f9f9f9', padding: '8px', borderRadius: '5px', border: `0.3px solid ${mainColor}30` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '6px', fontSize: '4.8px' }}>{d?.como_ajudar || 'Como Ajudar?'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {[d?.ajuda_item_1 || 'Buscar ajuda profissional se necessário', d?.ajuda_item_2 || 'Ambiente organizado e confortável', d?.ajuda_item_3 || 'Auxiliar nas tarefas domésticas'].map((text, i) => (
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
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ lineHeight: 1.5, marginBottom: '15px', fontSize: '4.6px' }}>
        <strong>{d?.muito_mais_que_nutrir_1 || 'Amamentar é muito mais que nutrir.'}</strong> {d?.muito_mais_que_nutrir_2 || 'É interação, imunidade e desenvolvimento emocional para o bebê.'}
      </p>
      <div style={{ background: `${mainColor}10`, padding: '10px', borderRadius: '5px', border: `0.2px solid ${mainColor}20`, marginBottom: '15px' }}>
        <p style={{ margin: 0, lineHeight: 1.4, textAlign: 'center' }}>
          {d?.oms_recomenda || 'A OMS recomenda aleitamento materno exclusivo nos primeiros seis meses de vida.'}
        </p>
      </div>
      
      <div style={{ fontWeight: 800, color: mainColor, marginBottom: '10px', textTransform: 'uppercase', fontSize: '5.2px', letterSpacing: '0.5px', textAlign: 'center' }}>{d?.beneficios || 'BENEFÍCIOS DO ALEITAMENTO'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { t: d?.para_bebe || 'Para o Bebê:', c: d?.para_bebe_desc || 'Melhor digestão, imunidade e redução de alergias.' },
          { t: d?.para_mamae || 'Para a Mamãe:', c: d?.para_mamae_desc || 'Auxilia na perda de peso e na saúde uterina.' },
          { t: d?.para_familia || 'Para a Família:', c: d?.para_familia_desc || 'Fortalece os vínculos e é prático no dia a dia.' },
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
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        {d?.pega_correta || 'A PEGA CORRETA'}
      </div>
      <p style={{ lineHeight: 1.4, marginBottom: '12px', textAlign: 'center' }}>
        {d?.pega_inadequada || 'Uma pega inadequada pode levar a mamilos doloridos e baixo ganho de peso do bebê.'}
      </p>
      
      <div style={{ position: 'relative', width: '68px', margin: '0 auto', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
        <img src="/pega-correta.png" style={{ width: '100%', display: 'block' }} />
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: `${mainColor}10`, padding: '8px 5px', borderRadius: '5px', border: `0.3px solid ${mainColor}20` }}>
          <div style={{ fontWeight: 800, color: mainColor, marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>{d?.certo || 'Certo:'}</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>{d?.certo_desc || 'Boca bem aberta, lábios para fora, queixo na mama.'}</div>
        </div>
        <div style={{ flex: 1, background: '#fff5f5', padding: '8px 5px', borderRadius: '5px', border: '0.3px solid #feb2b2' }}>
          <div style={{ fontWeight: 800, color: '#c53030', marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>{d?.errado || 'Errado:'}</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>{d?.errado_desc || 'Boca pouco aberta, bochechas encovadas, dor.'}</div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage7({ accentColor, borderColor, palette = [] }) {
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '15px', borderRadius: '1px', textAlign: 'center' }}>
        {d?.ordenha_manual || 'ORDENHA MANUAL'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '4px', lineHeight: 1.45 }}>
          <p><strong>1.</strong> {d?.ordenha_1 || 'Lave bem mãos e antebraços.'}</p>
          <p><strong>2.</strong> {d?.ordenha_2 || 'Massageie a mama suavemente.'}</p>
          <p><strong>3.</strong> {d?.ordenha_3 || 'Polegar acima da aréola, dedos abaixo.'}</p>
          <p><strong>4.</strong> {d?.ordenha_4 || 'Pressione para trás e solte.'}</p>
        </div>
        <div style={{ width: '100%', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
          <img src="/ordenha.png" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: '20px', background: '#fdfdfd', padding: '10px', borderRadius: '5px', border: '0.2px dashed #ddd', textAlign: 'center' }}>
        <p style={{ fontSize: '3.8px', fontStyle: 'italic', margin: 0, color: '#666' }}>
          {d?.dica_armazenar || 'Dica: Use sempre um frasco de vidro esterilizado com tampa plástica para armazenar.'}
        </p>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage8({ accentColor, borderColor, palette = [] }) {
  const { dictionary } = useTranslation();
  const d = dictionary?.guia_amamentacao_folder;
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        {d?.armazenamento_uso || 'ARMAZENAMENTO E USO'}
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '4px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${mainColor}40` }}>
              <th style={{ textAlign: 'left', padding: '4px' }}>{d?.local || 'Local'}</th>
              <th style={{ textAlign: 'right', padding: '4px' }}>{d?.tempo || 'Tempo'}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '0.1px solid #eee' }}><td style={{ padding: '5px 4px' }}>{d?.geladeira || 'Geladeira'}</td><td style={{ textAlign: 'right' }}>{d?.geladeira_tempo || 'Até 12 horas'}</td></tr>
            <tr style={{ borderBottom: '0.1px solid #eee' }}><td style={{ padding: '5px 4px' }}>{d?.congelador || 'Congelador'}</td><td style={{ textAlign: 'right' }}>{d?.congelador_tempo || 'Até 15 dias'}</td></tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ marginBottom: '10px', background: `${mainColor}05`, padding: '8px', borderRadius: '6px', border: `0.3px solid ${mainColor}15` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '3px', fontSize: '4.6px' }}>{d?.como_aquecer || 'Como Aquecer:'}</div>
        <p style={{ lineHeight: 1.3, margin: '0 0 8px 0' }}>{d?.aquecer_desc || 'Banho-maria (fogo desligado). Nunca use o micro-ondas, para não perder as propriedades.'}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '35px', height: '35px', position: 'relative', borderRadius: '50%', overflow: 'hidden', border: `0.5px solid ${mainColor}20`, background: '#fff' }}>
            <img src="/banho_maria_circular_neutro_1777906864151.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: '3.4px', color: '#777', margin: 0, fontStyle: 'italic', fontWeight: 600, textAlign: 'center' }}>{d?.frase_final || '"O leite materno é o melhor alimento para o seu bebê."'}</p>
        </div>
      </div>
    </div>
  );
}
