'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderVacinaPage3({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  
  const rowCount = 18; // Matching the number of vaccines in Page 2
  const colCount = 10; // Number of data slots

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '4px 6px', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box',
      background: '#fff'
    }}>
      <div style={{ 
        background: '#E6C673', 
        padding: '2px 8px', 
        borderRadius: '2px 2px 0 0',
        marginBottom: '1px', // Match Page 2 margin
        width: 'fit-content',
        height: '8.5px', // Approximate header height alignment
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ color: '#fff', fontSize: '5px', fontWeight: 900, letterSpacing: '1px' }}>
          {lang === 'en' ? "DATE" : "DATA"}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            gap: '1px',
            height: '9.6px', // Exact match with Page 2
            borderBottom: '0.15px solid #eee',
            alignItems: 'center'
          }}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} style={{ 
                flex: 1,
                background: '#F9F9F9',
                height: '7px',
                borderRadius: '1px'
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
