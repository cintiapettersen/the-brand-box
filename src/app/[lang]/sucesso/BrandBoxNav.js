'use client';
import { useRef, useState, useEffect } from 'react';

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
  }, [items]);

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
          const label = renderLabel ? renderLabel(item) : item.label ?? item;
          return (
            <button
              key={item.id ?? i}
              data-active={active ? 'true' : 'false'}
              onClick={() => onSelect(item.id ?? i)}
              style={{
                whiteSpace: 'nowrap', padding: active ? '6px 16px' : '5px 12px',
                borderRadius: '20px', fontSize: active ? '0.7rem' : '0.66rem',
                fontWeight: 700, borderWidth: '1.5px', borderStyle: 'solid', borderColor: active ? color : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                background: active ? color : 'transparent',
                color: active ? '#fff' : '#555',
                boxShadow: active ? `0 2px 8px ${color}55` : 'none',
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {label}
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
  const isMarca = MARCA_STEPS.includes(step);
  const isDigital = DIGITAL_STEPS.includes(step);
  const isPapelaria = step === 'papelaria';
  const isAjuda = AJUDA_STEPS.includes(step);
  const activeCat = isMarca ? 'marca' : isDigital ? 'digital' : isPapelaria ? 'papelaria' : 'ajuda';

  const marcaItems = [
    { id: 'placa', label: 'Placa' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'tomdevoz', label: 'Tom de Voz' },
    { id: 'fonte', label: 'Fonte' },
    { id: 'logo', label: 'Logo' },
    { id: 'slogan', label: 'Tagline' },
    { id: 'submarca', label: 'Selo', planOnly: 'pro' },
    { id: 'cores', label: 'Cores' },
    { id: 'paleta', label: 'Paleta' },
    { id: 'estampa', label: 'Estampa' },
    { id: 'guia', label: 'Guia' },
  ].filter(i => !i.planOnly || plano === i.planOnly);

  const digitalItems = [
    { id: 'cartao', label: 'Cartão Digital' },
    { id: 'pack-instagram', label: 'Pack Instagram' },
    { id: 'assinatura-email', label: 'Assinatura E-mail' },
  ];

  const ajudaItems = [
    { id: 'ajuda', label: 'Ajuda & Inspiração' },
    { id: 'upsell', label: 'Quer ir além? ✨' },
  ];

  const subColor = isMarca ? BB_MARCA : isDigital ? BB_DIGITAL : isPapelaria ? BB_PAPELARIA : BB_AJUDA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.2rem' }}>

      {/* Tabs principais */}
      <div style={{ display: 'flex', gap: '3px' }}>
        {[
          { id: 'marca', label: 'A Marca', color: BB_MARCA, radius: '12px 0 0 0', action: () => setStep('placa') },
          { id: 'digital', label: 'O Digital', color: BB_DIGITAL, radius: '0', action: () => { if (!isDigital) setStep('cartao'); } },
          { id: 'papelaria', label: 'Os Impressos', color: BB_PAPELARIA, radius: '0', action: () => setStep('papelaria') },
          { id: 'ajuda', label: 'Ajuda ✨', color: BB_AJUDA, radius: '0 12px 0 0', action: () => { if (!isAjuda) setStep('ajuda'); } },
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
        <SubMenu items={papelariaItens.map((label, i) => ({ id: i, label }))} activeId={papelariaIdx} onSelect={setPapelariaIdx} color={BB_PAPELARIA} />
      )}
      {isAjuda && <SubMenu items={ajudaItems} activeId={step} onSelect={setStep} color={BB_AJUDA} />}
    </div>
  );
}
