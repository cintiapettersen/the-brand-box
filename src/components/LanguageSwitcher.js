'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '../app/LanguageContext';

export default function LanguageSwitcher({ style }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useTranslation();

  const handleLanguageChange = (newLocale) => {
    if (newLocale === lang) return;
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${lang}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(0, 0, 0, 0.04)',
      padding: '4px',
      borderRadius: '30px',
      zIndex: 1000,
      ...style
    }}>
      <button 
        onClick={() => handleLanguageChange('pt-BR')}
        style={{
          border: 'none',
          background: lang === 'pt-BR' ? '#fff' : 'transparent',
          boxShadow: lang === 'pt-BR' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '24px',
          opacity: lang === 'pt-BR' ? 1 : 0.6,
          filter: lang === 'pt-BR' ? 'none' : 'grayscale(100%)',
          transition: 'all 0.3s ease'
        }}
        title="Português"
      >
        🇧🇷
      </button>
      <button 
        onClick={() => handleLanguageChange('en')}
        style={{
          border: 'none',
          background: lang === 'en' ? '#fff' : 'transparent',
          boxShadow: lang === 'en' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '24px',
          opacity: lang === 'en' ? 1 : 0.6,
          filter: lang === 'en' ? 'none' : 'grayscale(100%)',
          transition: 'all 0.3s ease'
        }}
        title="English"
      >
        🇺🇸
      </button>
    </div>
  );
}
