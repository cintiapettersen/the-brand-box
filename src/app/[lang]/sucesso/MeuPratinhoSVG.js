'use client';
import React from 'react';

export default function MeuPratinhoSVG({ width = '100%' }) {
  return (
    <div style={{ width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src="/pratinho-plate.svg"
        alt="Meu Pratinho"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
