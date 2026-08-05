export function isEnglishLocale(locale) {
  return typeof locale === 'string' && locale.toLowerCase().startsWith('en');
}

export function getCreativeDiagnosisCopy(locale) {
  return isEnglishLocale(locale)
    ? { title: 'CREATIVE DIAGNOSIS', personality: 'Brand personality', audience: 'What the audience needs to feel', goals: 'Emotional goals', why: 'Why this direction fits', risks: 'Creative risks to avoid', loading: 'Preparing your creative diagnosis…', fallback: 'The Creative Director is temporarily unavailable. Your Gemini match remains available.', retry: 'Try again' }
    : { title: 'DIAGNÓSTICO CRIATIVO', personality: 'Personalidade da marca', audience: 'O que o público precisa sentir', goals: 'Objetivos emocionais', why: 'Por que essa direção combina', risks: 'Riscos criativos a evitar', loading: 'Preparando seu diagnóstico criativo…', fallback: 'A Creative Director está temporariamente indisponível. Seu match Gemini continua disponível.', retry: 'Tentar novamente' };
}
