import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  'pt-BR': () => import('./dictionaries/pt.json').then((module) => module.default),
}

export const getDictionary = async (locale) => {
  return dictionaries[locale]?.() ?? dictionaries['pt-BR']()
}
