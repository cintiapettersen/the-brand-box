export const STYLE_ICONS = {
  'Jardim Encantado': [
    { id: 'flor-amor',        label: 'Flor Amor',     path: '/icons/icon-flor-amor_infantil.png' },
    { id: 'flor-delicadeza',  label: 'Flor Suave',    path: '/icons/icon-flor-delicadeza_suave.png' },
    { id: 'flor-ludico',      label: 'Flor Lúdica',   path: '/icons/icon-flor-ludico_divertido.png' },
    { id: 'flor-simples',     label: 'Flor Feliz',    path: '/icons/icon-flor-simplicidade_feliz.png' },
    { id: 'passaro-jardim',   label: 'Passarinho',    path: '/icons/icon-passaro-fofura_amigavel.png' },
  ],
  'Escandinavo Acolhedor': [
    { id: 'baleia',    label: 'Baleia',      path: '/icons/icon-scandi-baleia-minimal.png' },
    { id: 'barco',     label: 'Barco',       path: '/icons/icon-scandi-barco-minimal.png' },
    { id: 'casa',      label: 'Casa',        path: '/icons/icon-scandi-casa-minimal.png' },
    { id: 'heart',     label: 'Coração',     path: '/icons/icon-scandi-heart-minimal.png' },
    { id: 'lua',       label: 'Lua',         path: '/icons/icon-scandi-lua-minimal.png' },
    { id: 'passaro',   label: 'Passarinho',  path: '/icons/icon-scandi-passarro-minimal.png' },
    { id: 'pato',      label: 'Patinho',     path: '/icons/icon-scandi-pato-minimal.png' },
  ],
  'Essência Atemporal': [
    { id: 'concha',      label: 'Concha',      path: '/icons/icon-essencia-concha.png' },
    { id: 'floral-mar',  label: 'Floral Mar',  path: '/icons/icon-essencia-floral-do-mar.png' },
    { id: 'floral-fem',  label: 'Floral',      path: '/icons/icon-essencia-floral-feminino.png' },
    { id: 'flor-sal',    label: 'Flor de Sal', path: '/icons/icon-essencia-florr-de-sal.png' },
    { id: 'trevo',       label: 'Trevo',       path: '/icons/icon-essencia-folhas-trevo.png' },
    { id: 'organico',    label: 'Orgânico',    path: '/icons/icon-essencia-organico-feminine.png' },
  ],
  'Doce Encantamento': [
    { id: 'bee',      label: 'Abelhinha',  path: '/icons/icon-doce-bee.png' },
    { id: 'bird',     label: 'Passarinho', path: '/icons/icon-doce-bird.png' },
    { id: 'rainbow',  label: 'Arco-íris',  path: '/icons/icon-doce-rainbow.png' },
    { id: 'sol',      label: 'Sol',        path: '/icons/icon-doce-sol.png' },
  ],
  'Raízes & Cuidado': [
    { id: 'raiz-flor-sal',  label: 'Flor de Sal', path: '/icons/icon-raiz-naturral-flor-de-sal.png' },
    { id: 'raiz-abstrato',  label: 'Abstrato',    path: '/icons/icon-raiz-naturral-organico-abstratoo.png' },
    { id: 'raiz-caule',     label: 'Caule',       path: '/icons/icon-raiz-naturral-organico-caule.png' },
    { id: 'raiz-circular',  label: 'Circular',    path: '/icons/icon-raiz-naturral-organico-circular.png' },
    { id: 'raiz-flor-bold', label: 'Flor Bold',   path: '/icons/icon-raiz-naturral-organico-flor-mdoerno-bold.png' },
    { id: 'raiz-horizonte', label: 'Horizonte',   path: '/icons/icon-raiz-naturral-organico-horiznte.png' },
  ],
  'Estético Editorial': [
    { id: 'flexibilidade',   label: 'Flexibilidade', path: '/icons/icon-estetico-flexibilidade.png' },
    { id: 'flexibilidade-2', label: 'Flex. 2',       path: '/icons/icon-estetico-flexibilidade-2.png' },
    { id: 'igualidade',      label: 'Igualdade',     path: '/icons/icon-estetico-igualidade.png' },
    { id: 'paridade',        label: 'Paridade',      path: '/icons/icon-estetico-paridade.png' },
    { id: 'uniao',           label: 'União',         path: '/icons/icon-estetico-uniao.png' },
  ],
};

export const getIconById = (estiloNome, iconId) => {
  const icons = STYLE_ICONS[estiloNome] || [];
  return icons.find(i => i.id === iconId) || null;
};
