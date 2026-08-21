import React from 'react';
import BrandElement from './BrandElement';

const BrandElementsSelector = ({ 
  generatedElements = [], 
  selectedElementId = null, 
  onSelect,
  onGenerate,
  isLoading = false,
  hasGenerated = false,
  hasPattern = false,
  primaryColor = '#2A897F',
  secondaryColor = '#E1EDE7',
  canRegenerate = true,
  onRegenerate = null
}) => {
  // Estado inicial: ainda não gerou elementos da estampa
  if (!hasGenerated || generatedElements.length === 0) {
    return (
      <div style={{
        width: '100%',
        padding: '16px 18px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '10px',
        marginTop: '12px'
      }}>
        <div style={{ fontSize: '1.3rem' }}>🎨✨</div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', margin: 0, letterSpacing: '0.02em' }}>
            Elementos Gráficos Exclusivos da sua Estampa
          </h4>
          <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.45, maxWidth: '420px' }}>
            {hasPattern 
              ? 'Deseja criar 3 opções de elementos visuais únicos derivados da sua estampa e do seu nicho para usar na sua marca?'
              : 'Selecione e aprove uma estampa acima para criar seus elementos gráficos personalizados.'}
          </p>
        </div>
        {hasPattern && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="btn-primary"
            style={{
              fontSize: '0.78rem',
              padding: '10px 20px',
              borderRadius: '20px',
              background: 'var(--accent-turquoise, #2A897F)',
              color: '#FFF',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.75 : 1,
              marginTop: '4px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(42, 137, 127, 0.25)'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                Interpretando estampa e criando elementos...
              </>
            ) : (
              '✨ Criar elementos gráficos desta estampa'
            )}
          </button>
        )}
      </div>
    );
  }

  // Estado com os 3 elementos gerados
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary, #475569)' }}>
          Elementos Gráficos da Sua Marca
        </label>
        <span style={{ fontSize: '0.65rem', background: '#E1EDE7', color: '#203830', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
          3 Opções Únicas
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {generatedElements.map((el, idx) => {
          const isSelected = selectedElementId === el.id || (selectedElementId === null && idx === 0);
          return (
            <button
              key={el.id || idx}
              type="button"
              onClick={() => onSelect && onSelect(el)}
              style={{
                borderRadius: '16px',
                padding: '12px 8px',
                border: isSelected ? '2.5px solid var(--accent-turquoise, #2A897F)' : '1px solid #E2E8F0',
                background: isSelected ? '#F0FDFA' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isSelected ? '0 8px 20px rgba(42, 137, 127, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                transform: isSelected ? 'translateY(-2px)' : 'none'
              }}
            >
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'var(--accent-turquoise, #2A897F)',
                  color: '#FFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                }}>
                  ✓
                </span>
              )}
              <BrandElement element={el} size={54} color={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '2px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E293B', textAlign: 'center', lineHeight: 1.2 }}>
                  {el.title || `Elemento 0${idx + 1}`}
                </span>
                {el.label && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--accent-turquoise, #2A897F)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {el.label}
                  </span>
                )}
                <span style={{ fontSize: '0.58rem', color: '#64748B', textAlign: 'center', marginTop: '2px', lineHeight: 1.25 }}>
                  {el.origin}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrandElementsSelector;
