import React from 'react';

const BrandElement = ({ 
  element = null,
  type = 'abstract', 
  color = '#2A897F', 
  secondaryColor = '#E1EDE7',
  size = 48,
  className = ''
}) => {
  // Se element for um objeto gerado dinamicamente com base64 ou string data URI
  if (element) {
    const imgSrc = typeof element === 'string'
      ? (element.startsWith('data:') ? element : `data:image/png;base64,${element}`)
      : (element.base64 ? (element.base64.startsWith('data:') ? element.base64 : `data:${element.mimeType || 'image/png'};base64,${element.base64}`) : null);

    if (imgSrc) {
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
          <img 
            src={imgSrc} 
            alt={element.title || 'Elemento Gráfico'} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    }
  }

  // Fallback interno de formas estáticas
  const renderShape = () => {
    switch (type) {
      case 'flower':
      case 'flor':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="30" r="16" fill={secondaryColor} />
            <circle cx="70" cy="50" r="16" fill={secondaryColor} />
            <circle cx="50" cy="70" r="16" fill={secondaryColor} />
            <circle cx="30" cy="50" r="16" fill={secondaryColor} />
            <circle cx="50" cy="50" r="14" fill={color} />
          </svg>
        );

      case 'star':
      case 'estrela':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M50 10C50 32.0914 67.9086 50 90 50C67.9086 50 50 67.9086 50 90C50 67.9086 32.0914 50 10 50C32.0914 50 50 32.0914 50 10Z" fill={color} />
          </svg>
        );

      case 'abstract':
      case 'abstrato':
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="42" cy="42" r="28" fill={color} />
            <rect x="42" y="42" width="40" height="40" rx="12" fill={secondaryColor} opacity="0.8" />
          </svg>
        );
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {renderShape()}
    </div>
  );
};

export default BrandElement;
