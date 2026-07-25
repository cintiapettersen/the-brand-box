import React from 'react';

const BrandElement = ({ 
  element = null,
  type = 'abstract', 
  color = '#2A897F', 
  secondaryColor = '#E1EDE7',
  size = 120,
  className = ''
}) => {
  // Se element for um objeto gerado dinamicamente com base64
  if (element && element.base64) {
    const imgSrc = element.base64.startsWith('data:') 
      ? element.base64 
      : `data:${element.mimeType || 'image/png'};base64,${element.base64}`;

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

  // Fallback interno estático
  const renderShape = () => {
    switch (type) {
      case 'arch':
      case 'arco':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M20 80V50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50V80H20Z" fill={color} />
            <circle cx="50" cy="50" r="15" fill={secondaryColor} opacity="0.8" />
          </svg>
        );

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
            <path d="M75 25C75 33.2843 81.7157 40 90 40C81.7157 40 75 46.7157 75 55C75 46.7157 68.2843 40 60 40C68.2843 40 75 33.2843 75 25Z" fill={secondaryColor} opacity="0.9" />
          </svg>
        );

      case 'wave':
      case 'onda':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M10 40C30 20 40 60 60 40C80 20 90 60 90 60V80H10V40Z" fill={color} opacity="0.85" />
            <path d="M10 55C30 35 40 75 60 55C80 35 90 75 90 75V85H10V55Z" fill={secondaryColor} opacity="0.6" />
          </svg>
        );

      case 'sunburst':
      case 'sol':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="22" fill={color} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke={secondaryColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
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
