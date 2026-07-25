import React from 'react';
import BrandElement from './BrandElement';

const ELEMENT_TYPES = [
  { id: 'arch', label: 'Arco Orgânico' },
  { id: 'flower', label: 'Floral Elegante' },
  { id: 'star', label: 'Estrela Guia' },
  { id: 'wave', label: 'Onda Suave' },
  { id: 'sunburst', label: 'Sol Radiante' },
  { id: 'abstract', label: 'Forma Abstrata' },
];

const BrandElementsSelector = ({ 
  selectedElement = 'abstract', 
  onSelect,
  primaryColor = '#2A897F',
  secondaryColor = '#E1EDE7' 
}) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
        Elemento Gráfico da Marca
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {ELEMENT_TYPES.map((el) => {
          const isSelected = selectedElement === el.id;
          return (
            <button
              key={el.id}
              type="button"
              onClick={() => onSelect && onSelect(el.id)}
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
                boxShadow: isSelected ? '0 4px 12px rgba(42, 137, 127, 0.15)' : 'none'
              }}
            >
              <BrandElement 
                type={el.id} 
                color={primaryColor} 
                secondaryColor={secondaryColor} 
                size={40} 
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#334155', textAlign: 'center' }}>
                {el.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrandElementsSelector;
