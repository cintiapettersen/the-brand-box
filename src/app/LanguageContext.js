'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialDictionary }) {
  const params = useParams();
  const lang = params?.lang || 'pt-BR';
  const [dictionary, setDictionary] = useState(initialDictionary);

  useEffect(() => {
    // If the language changes, dynamically load the correct dictionary file
    if (lang === 'en') {
      import('../dictionaries/en.json').then((module) => {
        setDictionary(module.default);
      });
    } else {
      import('../dictionaries/pt.json').then((module) => {
        setDictionary(module.default);
      });
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ dictionary, lang }}>
      {children}
    </LanguageContext.Provider>
  );
}


export function LanguageOverrideProvider({ children, lang, dictionary = {} }) {
  return (
    <LanguageContext.Provider value={{ lang, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return { lang: 'pt', dictionary: {} };
  }
  return context;
}
