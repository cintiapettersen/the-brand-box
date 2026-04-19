export const STYLE_ICONS = {
  'Jardim Encantado': [
    { id: 'flor-amor',        label: 'Flor Amor',     path: '/icons/icon-flor-amor_infantil.svg' },
    { id: 'flor-delicadeza',  label: 'Flor Suave',    path: '/icons/icon-flor-delicadeza_suave.svg' },
    { id: 'flor-ludico',      label: 'Flor Lúdica',   path: '/icons/icon-flor-ludico_divertido.svg' },
    { id: 'flor-simples',     label: 'Flor Feliz',    path: '/icons/icon-flor-simplicidade_feliz.svg' },
    { id: 'passaro-jardim',   label: 'Passarinho',    path: '/icons/icon-passaro-fofura_amigavel.svg' },
  ],
  'Escandinavo Acolhedor': [
    { id: 'baleia',    label: 'Baleia',      path: '/icons/icon-scandi-baleia-minimal.svg' },
    { id: 'barco',     label: 'Barco',       path: '/icons/icon-scandi-barco-minimal.svg' },
    { id: 'casa',      label: 'Casa',        path: '/icons/icon-scandi-casa-minimal.svg' },
    { id: 'heart',     label: 'Coração',     path: '/icons/icon-scandi-heart-minimal.svg' },
    { id: 'lua',       label: 'Lua',         path: '/icons/icon-scandi-lua-minimal.svg' },
    { id: 'passaro',   label: 'Passarinho',  path: '/icons/icon-scandi-passarro-minimal.svg' },
    { id: 'pato',      label: 'Patinho',     path: '/icons/icon-scandi-pato-minimal.svg' },
  ],
  'Essência Atemporal': [
    { id: 'concha',      label: 'Concha',      path: '/icons/icon-essencia-concha.svg' },
    { id: 'floral-mar',  label: 'Floral Mar',  path: '/icons/icon-essencia-floral-do-mar.svg' },
    { id: 'floral-fem',  label: 'Floral',      path: '/icons/icon-essencia-floral-feminino.svg' },
    { id: 'flor-sal',    label: 'Flor de Sal', path: '/icons/icon-essencia-florr-de-sal.svg' },
    { id: 'trevo',       label: 'Trevo',       path: '/icons/icon-essencia-folhas-trevo.svg' },
    { id: 'organico',    label: 'Orgânico',    path: '/icons/icon-essencia-organico-feminine.svg' },
  ],
  'Doce Encantamento': [
    { id: 'bee',      label: 'Abelhinha',  path: '/icons/icon-doce-bee.svg' },
    { id: 'bird',     label: 'Passarinho', path: '/icons/icon-doce-bird.svg' },
    { id: 'rainbow',  label: 'Arco-íris',  path: '/icons/icon-doce-rainbow.svg' },
    { id: 'sol',      label: 'Sol',        path: '/icons/icon-doce-sol.svg' },
  ],
  'Raízes & Cuidado': [
    { id: 'raiz-flor-sal',  label: 'Flor de Sal', path: '/icons/icon-raiz-naturral-flor-de-sal.svg' },
    { id: 'raiz-abstrato',  label: 'Abstrato',    path: '/icons/icon-raiz-naturral-organico-abstratoo.svg' },
    { id: 'raiz-caule',     label: 'Caule',       path: '/icons/icon-raiz-naturral-organico-caule.svg' },
    { id: 'raiz-circular',  label: 'Circular',    path: '/icons/icon-raiz-naturral-organico-circular.svg' },
    { id: 'raiz-flor-bold', label: 'Flor Bold',   path: '/icons/icon-raiz-naturral-organico-flor-mdoerno-bold.svg' },
    { id: 'raiz-horizonte', label: 'Horizonte',   path: '/icons/icon-raiz-naturral-organico-horiznte.svg' },
  ],
  'Estético Editorial': [
    { id: 'flexibilidade',   label: 'Flexibilidade', path: '/icons/icon-estetico-flexibilidade.svg' },
    { id: 'flexibilidade-2', label: 'Flex. 2',       path: '/icons/icon-estetico-flexibilidade-2.svg' },
    { id: 'igualidade',      label: 'Igualdade',     path: '/icons/icon-estetico-igualidade.svg' },
    { id: 'paridade',        label: 'Paridade',      path: '/icons/icon-estetico-paridade.svg' },
    { id: 'uniao',           label: 'União',         path: '/icons/icon-estetico-uniao.svg' },
  ],
};

export const getIconById = (estiloNome, iconId) => {
  const icons = STYLE_ICONS[estiloNome] || [];
  return icons.find(i => i.id === iconId) || null;
};
