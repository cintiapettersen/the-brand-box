'use client';

const BB_MARCA = '#65BDB9';
const BB_DIGITAL = '#dc3895'; // pink mais vibrante
const BB_PAPELARIA = '#8DBD8E';

const MARCA_STEPS = ['logo', 'submarca', 'estampa', 'cores', 'guia'];
const DIGITAL_STEPS = ['cartao', 'pack-instagram', 'assinatura-email'];

export default function BrandBoxNav({ step, setStep, plano, papelariaItens = [], papelariaIdx = 0, setPapelariaIdx }) {
  const isMarca = MARCA_STEPS.includes(step);
  const isDigital = DIGITAL_STEPS.includes(step);
  const isPapelaria = step === 'papelaria';
  const activeCat = isMarca ? 'marca' : isDigital ? 'digital' : 'papelaria';

  const marcaItems = [
    { id: 'logo', label: 'Logo' },
    { id: 'submarca', label: 'Selo', planOnly: 'pro' },
    { id: 'estampa', label: 'Estampa' },
    { id: 'cores', label: 'Cores' },
    { id: 'guia', label: 'Manifesto' },
  ].filter(i => !i.planOnly || plano === i.planOnly);

  const digitalItems = [
    { id: 'cartao', label: 'Cartão Digital' },
    { id: 'pack-instagram', label: 'Pack Instagram' },
    { id: 'assinatura-email', label: 'Assinatura E-mail' },
  ];

  const subColor = isMarca ? BB_MARCA : isDigital ? BB_DIGITAL : BB_PAPELARIA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.2rem' }}>

      {/* Tabs principais */}
      <div style={{ display: 'flex', gap: '3px' }}>
        {[
          { id: 'marca', label: 'A Marca', color: BB_MARCA, radius: '12px 0 0 0', action: () => setStep('logo') },
          { id: 'digital', label: 'O Digital', color: BB_DIGITAL, radius: '0', action: () => { if (!isDigital) setStep('cartao'); } },
          { id: 'papelaria', label: 'Papelaria', color: BB_PAPELARIA, radius: '0 12px 0 0', action: () => setStep('papelaria') },
        ].map(tab => {
          const active = activeCat === tab.id;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              style={{
                flex: 1, padding: '11px 4px', border: 'none', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.8px', fontFamily: 'Montserrat,sans-serif',
                background: active ? tab.color : '#ece9e4',
                color: active ? '#fff' : '#aaa',
                borderRadius: tab.radius,
                borderBottom: active ? ('3px solid ' + tab.color) : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-menu: Marca */}
      {isMarca && (
        <div style={{ background: BB_MARCA + '14', borderRadius: '0 0 10px 10px', padding: '6px 10px', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {marcaItems.map(item => (
            <button key={item.id} onClick={() => setStep(item.id)} style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: step === item.id ? BB_MARCA : 'transparent', color: step === item.id ? '#fff' : '#aaa' }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-menu: Digital */}
      {isDigital && (
        <div style={{ background: BB_DIGITAL + '14', borderRadius: '0 0 10px 10px', padding: '6px 10px', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {digitalItems.map(item => (
            <button key={item.id} onClick={() => setStep(item.id)} style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: step === item.id ? BB_DIGITAL : 'transparent', color: step === item.id ? '#fff' : '#aaa' }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-menu: Papelaria — lista de itens */}
      {isPapelaria && papelariaItens.length > 0 && setPapelariaIdx && (
        <div style={{ background: BB_PAPELARIA + '14', borderRadius: '0 0 10px 10px', padding: '6px 10px', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {papelariaItens.map((item, i) => (
            <button key={item} onClick={() => setPapelariaIdx(i)} style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: papelariaIdx === i ? BB_PAPELARIA : 'transparent', color: papelariaIdx === i ? '#fff' : '#aaa' }}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
