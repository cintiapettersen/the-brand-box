'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialDictionary }) {
  const params = useParams();
  const lang = params?.lang || 'pt-BR';

  return (
    <LanguageContext.Provider value={{ dictionary: initialDictionary, lang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
