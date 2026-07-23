'use client';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../../LanguageContext';

// Official Briefing Palette Categories
const BB_MARCA = '#C9D7E5';    // Powder Blue Mist
const BB_DIGITAL = '#C7B49F';  // Cashmere Taupe
const BB_PAPELARIA = '#9B8B9B';// Dusty Lilac Mauve
const BB_AJUDA = '#515361';    // Obsidian Slate Charcoal

function SubMenu({ items, activeId, onSelect, color, renderLabel }) {
  const scrollRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowArrow(el.scrollWidth > el.clientWidth + 4);
    check();
    const obs = new ResizeObserver(check);
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.map(i => (i.id ?? i)).join(',')]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('[data-active="true"]');
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  return (
    <div style={{ 
      position: 'relative', 
      background: color, 
      borderRadius: '0 0 16px 16px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
      transition: 'background 0.3s ease'
    }}>
      <div 
        ref={scrollRef} 
        style={{ 
          padding: '8px 12px', 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto', 
          scrollbarWidth: 'none', 
          paddingRight: showArrow ? '30px' : '12px',
          alignItems: 'center' 
        }}
      >
        {items.map((item, i) => {
          const active = (item.id !== undefined ? item.id === activeId : i === activeId);
          const locked = item.locked;
          const label = renderLabel ? renderLabel(item) : item.label ?? item;
          
          return (
            <button
              key={item.id ?? i}
              data-active={active ? 'true' : 'false'}
              onClick={() => onSelect(item.id ?? i)}
              style={{
                whiteSpace: 'nowrap',
                padding: active ? '7px 18px' : '6px 14px',
                borderRadius: '20px',
                fontSize: active ? '0.72rem' : '0.68rem',
                fontWeight: active ? 700 : 600,
                fontFamily: "'Cinzel', 'Montserrat', sans-serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: locked ? 'default' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                background: active ? '#C7B49F' : 'transparent', // Cashmere Taupe active pill as shown in mockup
                color: active ? '#FFFFFF' : (color === '#C9D7E5' ? '#1E2D3B' : '#FFFFFF'),
                boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                transform: active ? 'scale(1.03)' : 'scale(1)',
                opacity: locked ? 0.5 : (active ? 1 : 0.88)
              }}
            >
              {locked ? `🔒 ${label}` : label}
            </button>
          );
        })}
      </div>
      {showArrow && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '30px',
          background: `linear-gradient(to right, transparent, ${color})`,
          borderRadius: '0 0 16px 0', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px',
        }}>
          <span style={{ color: color === '#C9D7E5' ? '#1E2D3B' : '#FFFFFF', fontSize: '0.75rem', fontWeight: 900 }}>›</span>
        </div>
      )}
    </div>
  );
}

const MARCA_STEPS = ['placa', 'manifesto', 'tomdevoz', 'fonte', 'logo', 'slogan', 'submarca', 'cores', 'paleta', 'estampa', 'guia'];
const DIGITAL_STEPS = ['cartao', 'pack-instagram', 'assinatura-email'];
const AJUDA_STEPS = ['ajuda', 'upsell'];

export default function BrandBoxNav({ step, setStep, plano, papelariaItens = [], papelariaIdx = 0, setPapelariaIdx }) {
  const { dictionary } = useTranslation();
  const isMarca = MARCA_STEPS.includes(step);
  const isDigital = DIGITAL_STEPS.includes(step);
  const isPapelaria = step === 'papelaria';
  const isAjuda = AJUDA_STEPS.includes(step);
  const activeCat = isMarca ? 'marca' : isDigital ? 'digital' : isPapelaria ? 'papelaria' : 'ajuda';

  const renderItemLabel = (item) => {
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
      'Capa de Caderno / Agenda': 'caderno',
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
    const key = keyMap[item.label];
    return (key && dictionary?.papelaria_itens?.[key]) || item.label;
  };

  const marcaItems = [
    { id: 'placa', label: dictionary?.nav?.placa || 'Placa', lockedOnAvulso: true },
    { id: 'manifesto', label: dictionary?.nav?.manifesto || 'Manifesto', lockedOnAvulso: true },
    { id: 'tomdevoz', label: dictionary?.nav?.tomdevoz || 'Tom de Voz', lockedOnAvulso: true },
    { id: 'fonte', label: dictionary?.nav?.fonte || 'Fonte', lockedOnAvulso: true },
    { id: 'logo', label: dictionary?.nav?.logo || 'Logo' },
    { id: 'slogan', label: dictionary?.nav?.slogan || 'Tagline' },
    { id: 'submarca', label: dictionary?.nav?.submarca || 'Selo', planOnly: 'pro' },
    { id: 'cores', label: dictionary?.nav?.cores || 'Cores' },
    { id: 'paleta', label: dictionary?.nav?.paleta || 'Paleta', lockedOnAvulso: true },
    { id: 'estampa', label: dictionary?.nav?.estampa || 'Estampa', lockedOnAvulso: true },
    { id: 'guia', label: dictionary?.nav?.guia || 'Guia', lockedOnAvulso: true },
  ].filter(i => !i.planOnly || plano === i.planOnly)
   .map(i => ({ ...i, locked: i.lockedOnAvulso && plano === 'avulso' }));

  const digitalItems = [
    { id: 'cartao', label: dictionary?.nav?.cartao || 'Cartão Digital' },
    { id: 'pack-instagram', label: dictionary?.nav?.pack_instagram || 'Pack Instagram' },
    { id: 'assinatura-email', label: dictionary?.nav?.assinatura_email || 'Assinatura E-mail' },
  ];

  const ajudaItems = [
    { id: 'ajuda', label: dictionary?.nav?.ajuda_inspiracao || 'Ajuda & Inspiração' },
    { id: 'upsell', label: dictionary?.nav?.upsell || 'Quer ir além? ✨' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.4rem', position: 'relative' }}>
      {/* Tabs principais */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[
          { id: 'marca', label: dictionary?.nav?.marca || 'THE BRAND', color: BB_MARCA, textColor: '#1E2D3B', radius: '16px 16px 0 0', action: () => setStep('placa') },
          { id: 'digital', label: dictionary?.nav?.digital || 'THE DIGITAL', color: BB_DIGITAL, textColor: '#FFFFFF', radius: '16px 16px 0 0', action: () => { if (!isDigital) setStep('cartao'); } },
          { id: 'papelaria', label: dictionary?.nav?.papelaria || 'STATIONERY', color: BB_PAPELARIA, textColor: '#FFFFFF', radius: '16px 16px 0 0', action: () => setStep('papelaria') },
          { id: 'ajuda', label: dictionary?.nav?.ajuda || 'HELP ✨', color: BB_AJUDA, textColor: '#FFFFFF', radius: '16px 16px 0 0', action: () => { if (!isAjuda) setStep('ajuda'); } },
        ].map(tab => {
          const active = activeCat === tab.id;
          const locked = tab.lockedOnAvulso && plano === 'avulso';
          return (
            <button
              key={tab.id}
              onClick={locked ? undefined : tab.action}
              style={{
                flex: 1,
                padding: active ? '14px 6px' : '12px 6px',
                border: 'none',
                cursor: locked ? 'default' : 'pointer',
                fontSize: active ? '0.78rem' : '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: "'Cinzel', 'Montserrat', sans-serif",
                background: active ? tab.color : locked ? '#EFECE3' : '#E5E2DA',
                color: active ? tab.textColor : (locked ? '#AAAAAA' : '#555555'),
                borderRadius: tab.radius,
                boxShadow: active ? `0 4px 16px ${tab.color}66` : 'none',
                transition: 'all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: active ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {locked ? `🔒 ${tab.label}` : tab.label}
            </button>
          );
        })}
      </div>

      {isMarca && <SubMenu items={marcaItems} activeId={step} onSelect={setStep} color={BB_MARCA} />}
      {isDigital && <SubMenu items={digitalItems} activeId={step} onSelect={setStep} color={BB_DIGITAL} />}
      {isPapelaria && papelariaItens.length > 0 && setPapelariaIdx && (
        <SubMenu items={papelariaItens.map((label, i) => ({ id: i, label }))} activeId={papelariaIdx} onSelect={setPapelariaIdx} color={BB_PAPELARIA} renderLabel={renderItemLabel} />
      )}
      {isAjuda && <SubMenu items={ajudaItems} activeId={step} onSelect={setStep} color={BB_AJUDA} />}
    </div>
  );
}
