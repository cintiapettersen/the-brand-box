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
  secondaryColor = '#E1EDE7' 
}) => {
  // Se ainda não gerou elementos a partir da estampa
  if (!hasGenerated || generatedElements.length === 0) {
    return (
      <div style={{
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #F0FDFA 0%, #E6FFFA 100%)',
        border: '1px solid #B2F5EA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '10px'
      }}>
        <div style={{ fontSize: '1.2rem' }}>🎨✨</div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2C7A7B', margin: 0 }}>
            Elementos Gráficos Exclusivos da sua Estampa
          </h4>
          <p style={{ fontSize: '0.72rem', color: '#4A5568', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            {hasPattern 
              ? 'Deseja extrair motivos visuais únicos (folhas, flores, formas) diretamente da estampa que você aprovou?'
              : 'Selecione e aprove uma estampa acima para extrair seus elementos gráficos individuais.'}
          </p>
        </div>
        {hasPattern && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="btn-primary"
            style={{
              fontSize: '0.75rem',
              padding: '8px 16px',
              borderRadius: '20px',
              background: '#2A897F',
              color: '#FFF',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '4px',
              fontWeight: 600
            }}
          >
            {isLoading ? 'Analisando estampa e extraindo motivos...' : '✨ Criar elementos gráficos desta estampa'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Elementos Extraídos da Sua Estampa
        </label>
        <span style={{ fontSize: '0.65rem', background: '#E6FFFA', color: '#2C7A7B', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
          3 Motivos Únicos
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
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
                border: isSelected ? '2px solid var(--accent-turquoise, #2A897F)' : '1px solid #E2E8F0',
                background: isSelected ? '#F0FDFA' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(42, 137, 127, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: '#2A897F',
                  color: '#FFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✓
                </span>
              )}
              <BrandElement element={el} size={48} color={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D3748', textAlign: 'center' }}>
                  {el.title || `Motivo ${idx + 1}`}
                </span>
                <span style={{ fontSize: '0.58rem', color: '#718096', textAlign: 'center', marginTop: '2px', lineHeight: 1.2 }}>
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
