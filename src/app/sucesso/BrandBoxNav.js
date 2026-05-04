'use client';

const BB_MARCA = '#65BDB9';
const BB_DIGITAL = '#A83B5C';
const BB_PAPELARIA = '#8DBD8E';

const MARCA_STEPS = ['logo', 'submarca', 'estampa', 'cores', 'guia'];
const DIGITAL_STEPS = ['cartao', 'pack-instagram', 'assinatura-email'];

export default function BrandBoxNav({ step, setStep, plano }) {
  const isMarca = MARCA_STEPS.includes(step);
  const isDigital = DIGITAL_STEPS.includes(step);
  const activeCat = isMarca ? 'marca' : isDigital ? 'digital' : 'papelaria';

  const marcaItems = [
    { id: 'logo', label: 'Logo' },
    { id: 'submarca', label: 'Selo', planOnly: 'personalizado' },
    { id: 'estampa', label: 'Estampa' },
    { id: 'cores', label: 'Cores' },
    { id: 'guia', label: 'Manifesto' },
  ].filter(i => !i.planOnly || plano === i.planOnly);

  const digitalItems = [
    { id: 'cartao', label: 'Cartão Digital' },
    { id: 'pack-instagram', label: 'Pack Instagram' },
    { id: 'assinatura-email', label: 'Assinatura E-mail' },
  ];

  const subItems = isMarca ? marcaItems : isDigital ? digitalItems : [];
  const subColor = isMarca ? BB_MARCA : BB_DIGITAL;

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

      {/* Sub-menu colado abaixo da tab ativa */}
      {subItems.length > 0 && (
        <div style={{
          background: subColor + '14',
          borderRadius: '0 0 10px 10px',
          padding: '6px 10px',
          display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {subItems.map(item => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              style={{
                whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px',
                fontSize: '0.66rem', fontWeight: 700, border: 'none',
                cursor: 'pointer', transition: 'all 0.15s',
                background: step === item.id ? subColor : 'transparent',
                color: step === item.id ? '#fff' : '#aaa',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
