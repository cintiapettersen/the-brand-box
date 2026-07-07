
export const ESTILO_NOME_BY_ID = {
  2: 'Jardim Encantado',
  3: 'Escandinavo Acolhedor',
  8: 'Doce Encantamento',
  5: 'Essência Atemporal',
  6: 'Raízes & Cuidado',
  11: 'Estético Editorial'
};

export const STYLE_ICONS = {
  'Doce Encantamento': [
    { id: 'icon--51', label: ' 51', path: '/icons/icon--51.png' },
    { id: 'icon-_icon-doce-bee', label: 'doce bee', path: '/icons/icon-_icon-doce-bee.png' },
    { id: 'icon-_icon-doce-bird-47', label: 'doce bird 47', path: '/icons/icon-_icon-doce-bird-47.png' },
    { id: 'icon-_icon-doce-bird-50', label: 'doce bird 50', path: '/icons/icon-_icon-doce-bird-50.png' },
    { id: 'icon-_icon-doce-rainbow', label: 'doce rainbow', path: '/icons/icon-_icon-doce-rainbow.png' },
    { id: 'icon-_icon-doce-sol', label: 'doce sol', path: '/icons/icon-_icon-doce-sol.png' },
  ],
  'Escandinavo Acolhedor': [
    { id: 'icon-_icon-scandi-baleia-minimal', label: 'scandi baleia minimal', path: '/icons/icon-_icon-scandi-baleia-minimal.png' },
    { id: 'icon-_icon-scandi-barco-minimal', label: 'scandi barco minimal', path: '/icons/icon-_icon-scandi-barco-minimal.png' },
    { id: 'icon-_icon-scandi-casa-minimal', label: 'scandi casa minimal', path: '/icons/icon-_icon-scandi-casa-minimal.png' },
    { id: 'icon-_icon-scandi-heart-minimal', label: 'scandi heart minimal', path: '/icons/icon-_icon-scandi-heart-minimal.png' },
    { id: 'icon-_icon-scandi-passarro-minimal', label: 'scandi passarro minimal', path: '/icons/icon-_icon-scandi-passarro-minimal.png' },
  ],
  'Essência Atemporal': [
    { id: 'icon-_icon-essencia-concha', label: 'essencia concha', path: '/icons/icon-_icon-essencia-concha.png' },
    { id: 'icon-_icon-essencia-floral-do-mar', label: 'essencia floral do mar', path: '/icons/icon-_icon-essencia-floral-do-mar.png' },
    { id: 'icon-_icon-essencia-floral-feminino', label: 'essencia floral feminino', path: '/icons/icon-_icon-essencia-floral-feminino.png' },
    { id: 'icon-_icon-essencia-florr-de-sal', label: 'essencia florr de sal', path: '/icons/icon-_icon-essencia-florr-de-sal.png' },
    { id: 'icon-_icon-essencia-folhas-trevo', label: 'essencia folhas trevo', path: '/icons/icon-_icon-essencia-folhas-trevo.png' },
    { id: 'icon-_icon-essencia-organico-feminine', label: 'essencia organico feminine', path: '/icons/icon-_icon-essencia-organico-feminine.png' },
  ],
  'Estético Editorial': [
    { id: 'icon-estetico-flexibilidade-2', label: 'estetico flexibilidade 2', path: '/icons/icon-estetico-flexibilidade-2.png' },
    { id: 'icon-estetico-flexibilidade', label: 'estetico flexibilidade', path: '/icons/icon-estetico-flexibilidade.png' },
    { id: 'icon-estetico-igualidade', label: 'estetico igualidade', path: '/icons/icon-estetico-igualidade.png' },
    { id: 'icon-estetico-paridade', label: 'estetico paridade', path: '/icons/icon-estetico-paridade.png' },
    { id: 'icon-estetico-uniao', label: 'estetico uniao', path: '/icons/icon-estetico-uniao.png' },
  ],
  'Jardim Encantado': [
    { id: 'icon-_icon-flor-amor_infantil', label: 'flor amor infantil', path: '/icons/icon-_icon-flor-amor_infantil.png' },
    { id: 'icon-_icon-flor-de-tulips', label: 'flor de tulips', path: '/icons/icon-_icon-flor-de-tulips.png' },
    { id: 'icon-_icon-flor-delicadeza_suave', label: 'flor delicadeza suave', path: '/icons/icon-_icon-flor-delicadeza_suave.png' },
    { id: 'icon-_icon-flor-ludico_divertido', label: 'flor ludico divertido', path: '/icons/icon-_icon-flor-ludico_divertido.png' },
    { id: 'icon-_icon-flor-simplicidade_feliz', label: 'flor simplicidade feliz', path: '/icons/icon-_icon-flor-simplicidade_feliz.png' },
    { id: 'icon-_icon-passaro-fofura_amigavel', label: 'passaro fofura amigavel', path: '/icons/icon-_icon-passaro-fofura_amigavel.png' },
  ],
  'Raízes & Cuidado': [
    { id: 'icon-_icon-raiz-naturral-flor-de-sal', label: 'raiz naturral flor de sal', path: '/icons/icon-_icon-raiz-naturral-flor-de-sal.png' },
    { id: 'icon-_icon-raiz-naturral-organico-abstratoo', label: 'raiz naturral organico abstratoo', path: '/icons/icon-_icon-raiz-naturral-organico-abstratoo.png' },
    { id: 'icon-_icon-raiz-naturral-organico-caule', label: 'raiz naturral organico caule', path: '/icons/icon-_icon-raiz-naturral-organico-caule.png' },
    { id: 'icon-_icon-raiz-naturral-organico-circular', label: 'raiz naturral organico circular', path: '/icons/icon-_icon-raiz-naturral-organico-circular.png' },
    { id: 'icon-_icon-raiz-naturral-organico-flor-mdoerno-bold', label: 'raiz naturral organico flor mdoerno bold', path: '/icons/icon-_icon-raiz-naturral-organico-flor-mdoerno-bold.png' },
  ],
};

export const getIconById = (estiloNome, iconId) => {
  const icons = STYLE_ICONS[estiloNome] || [];
  return icons.find(i => i.id === iconId) || null;
};

