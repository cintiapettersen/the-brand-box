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
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      ...style
    }}>
      <button 
        onClick={() => handleLanguageChange('pt-BR')}
        style={{
          border: 'none',
          background: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          opacity: lang === 'pt-BR' ? 1 : 0.4,
          filter: lang === 'pt-BR' ? 'none' : 'grayscale(100%)',
          transition: 'all 0.2s'
        }}
        title="Português"
      >
        🇧🇷
      </button>
      <button 
        onClick={() => handleLanguageChange('en')}
        style={{
          border: 'none',
          background: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          opacity: lang === 'en' ? 1 : 0.4,
          filter: lang === 'en' ? 'none' : 'grayscale(100%)',
          transition: 'all 0.2s'
        }}
        title="English"
      >
        🇺🇸
      </button>
    </div>
  );
}
