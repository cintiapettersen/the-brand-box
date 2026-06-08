'use client';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../../LanguageContext';

const BB_MARCA = '#65BDB9';
const BB_DIGITAL = '#dc3895'; // pink mais vibrante
const BB_PAPELARIA = '#8DBD8E';

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

  // Scroll ativo para visível ao montar/mudar
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('[data-active="true"]');
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  return (
    <div style={{ position: 'relative', background: color + '14', borderRadius: '0 0 10px 10px' }}>
      <div ref={scrollRef} style={{ padding: '6px 10px', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', paddingRight: showArrow ? '28px' : '10px' }}>
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
                whiteSpace: 'nowrap', padding: active ? '6px 16px' : '5px 12px',
                borderRadius: '20px', fontSize: active ? '0.7rem' : '0.66rem',
                fontWeight: 700, borderWidth: '1.5px', borderStyle: 'solid',
                borderColor: active ? color : locked ? '#e0dbd5' : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                background: active ? color : locked ? '#f5f3f0' : 'transparent',
                color: active ? '#fff' : locked ? '#bbb' : '#555',
                boxShadow: active ? `0 2px 8px ${color}55` : 'none',
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {locked ? `🔒 ${label}` : label}
            </button>
          );
        })}
      </div>
      {showArrow && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '28px',
          background: `linear-gradient(to right, transparent, ${color}22 40%, ${color}55)`,
          borderRadius: '0 0 10px 0', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
        }}>
          <span style={{ color, fontSize: '0.65rem', fontWeight: 900 }}>›</span>
        </div>
      )}
    </div>
  );
}

const BB_AJUDA = '#8a7b6e';

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
    { id: 'placa', label: dictionary?.nav?.placa || 'Placa' },
    { id: 'manifesto', label: dictionary?.nav?.manifesto || 'Manifesto', lockedOnAvulso: true },
    { id: 'tomdevoz', label: dictionary?.nav?.tomdevoz || 'Tom de Voz', lockedOnAvulso: true },
    { id: 'fonte', label: dictionary?.nav?.fonte || 'Fonte' },
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

  const subColor = isMarca ? BB_MARCA : isDigital ? BB_DIGITAL : isPapelaria ? BB_PAPELARIA : BB_AJUDA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.2rem', position: 'relative' }}>
      {/* Tabs principais */}
      <div style={{ display: 'flex', gap: '3px' }}>
        {[
          { id: 'marca', label: dictionary?.nav?.marca || 'A Marca', color: BB_MARCA, radius: '12px 0 0 0', action: () => setStep('placa') },
          { id: 'digital', label: dictionary?.nav?.digital || 'O Digital', color: BB_DIGITAL, radius: '0', action: () => { if (!isDigital) setStep('cartao'); } },
          { id: 'papelaria', label: dictionary?.nav?.papelaria || 'Os Impressos', color: BB_PAPELARIA, radius: '0', action: () => setStep('papelaria') },
          { id: 'ajuda', label: dictionary?.nav?.ajuda || 'Ajuda ✨', color: BB_AJUDA, radius: '0 12px 0 0', action: () => { if (!isAjuda) setStep('ajuda'); } },
        ].map(tab => {
          const active = activeCat === tab.id;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              style={{
                flex: 1, padding: active ? '13px 4px' : '11px 4px', border: 'none', cursor: 'pointer',
                fontSize: active ? '0.76rem' : '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.8px', fontFamily: 'Montserrat,sans-serif',
                background: active ? tab.color : '#ece9e4',
                color: active ? '#fff' : '#555',
                borderRadius: tab.radius,
                boxShadow: active ? `0 3px 12px ${tab.color}55` : 'none',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
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
