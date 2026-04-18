import React from 'react';

const flower = (color) => (
  <g fill={color}>
    {[0, 72, 144, 216, 288].map(a => (
      <ellipse key={a} cx={0} cy={0} rx={3.5} ry={7} transform={`rotate(${a})`} opacity="0.85" />
    ))}
    <circle cx={0} cy={0} r={3.5} fill="white" />
    <circle cx={0} cy={0} r={1.8} fill={color} />
  </g>
);

const butterfly = (color) => (
  <g fill={color}>
    <ellipse cx={-5} cy={-4} rx={5.5} ry={4} transform="rotate(-20, -5, -4)" opacity="0.9" />
    <ellipse cx={5} cy={-4} rx={5.5} ry={4} transform="rotate(20, 5, -4)" opacity="0.9" />
    <ellipse cx={-4} cy={4} rx={3.5} ry={2.5} transform="rotate(15, -4, 4)" opacity="0.7" />
    <ellipse cx={4} cy={4} rx={3.5} ry={2.5} transform="rotate(-15, 4, 4)" opacity="0.7" />
    <ellipse cx={0} cy={0} rx={1} ry={5.5} fill={color} />
  </g>
);

const leaf = (color) => (
  <g>
    <path d="M0,-11 C7,-6 7,6 0,11 C-7,6 -7,-6 0,-11 Z" fill={color} />
    <line x1="0" y1="-9" x2="0" y2="9" stroke="white" strokeWidth="1.1" />
    <line x1="0" y1="-1" x2="-4.5" y2="-5" stroke="white" strokeWidth="0.8" />
    <line x1="0" y1="-1" x2="4.5" y2="-5" stroke="white" strokeWidth="0.8" />
    <line x1="0" y1="3" x2="-4" y2="0" stroke="white" strokeWidth="0.8" />
    <line x1="0" y1="3" x2="4" y2="0" stroke="white" strokeWidth="0.8" />
  </g>
);

const snowflake = (color) => (
  <g stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none">
    <line x1="-10" y1="0" x2="10" y2="0" />
    <line x1="-5" y1="-8.66" x2="5" y2="8.66" />
    <line x1="5" y1="-8.66" x2="-5" y2="8.66" />
    <line x1="-6.5" y1="-2.5" x2="-6.5" y2="2.5" />
    <line x1="6.5" y1="-2.5" x2="6.5" y2="2.5" />
    <line x1="-2" y1="-7.5" x2="2" y2="-7.5" />
    <line x1="-2" y1="7.5" x2="2" y2="7.5" />
    <line x1="2" y1="-7" x2="-2" y2="-4" />
    <line x1="-2" y1="-7" x2="2" y2="-4" />
  </g>
);

const star5 = (color) => (
  <polygon
    points="0,-11 2.6,-3.8 10.5,-3.4 4.2,1.5 6.5,9.5 0,5.5 -6.5,9.5 -4.2,1.5 -10.5,-3.4 -2.6,-3.8"
    fill={color}
  />
);

const pine = (color) => (
  <g fill={color}>
    <polygon points="0,-12 -3.5,-5 3.5,-5" />
    <polygon points="0,-8 -5.5,1 5.5,1" />
    <polygon points="0,-3 -8,8 8,8" />
    <rect x="-2" y="8" width="4" height="4" />
  </g>
);

const teardrop = (color) => (
  <path d="M0,-11 C8,-4 8,4 0,10 C-8,4 -8,-4 0,-11 Z" fill={color} />
);

const feather = (color) => (
  <g>
    <path d="M-2,10 C-9,-1 -9,-11 0,-12 C9,-11 9,-1 2,10 Z" fill={color} opacity="0.9" />
    <line x1="-1.5" y1="10" x2="0" y2="-12" stroke="white" strokeWidth="1.2" />
    <line x1="0" y1="-5" x2="-5" y2="-3" stroke="white" strokeWidth="0.7" />
    <line x1="0" y1="-5" x2="5" y2="-3" stroke="white" strokeWidth="0.7" />
    <line x1="0" y1="0" x2="-5.5" y2="2" stroke="white" strokeWidth="0.7" />
    <line x1="0" y1="0" x2="5.5" y2="2" stroke="white" strokeWidth="0.7" />
  </g>
);

const rings = (color) => (
  <g stroke={color} fill="none">
    <circle cx={0} cy={0} r={10} strokeWidth={2} />
    <circle cx={0} cy={0} r={5.5} strokeWidth={1.5} />
    <circle cx={0} cy={0} r={2} fill={color} stroke="none" />
  </g>
);

const heart = (color) => (
  <path d="M0,8 C-8,2 -12,-6 -6,-10 C-2,-12 0,-7 0,-7 C0,-7 2,-12 6,-10 C12,-6 8,2 0,8 Z" fill={color} />
);

const bow = (color) => (
  <g fill={color}>
    <path d="M-2,0 L-11,-7 L-11,7 Z" />
    <path d="M2,0 L11,-7 L11,7 Z" />
    <circle cx={0} cy={0} r={2.8} />
    <line x1="-2" y1="0" x2="2" y2="0" stroke={color} strokeWidth="1" />
  </g>
);

const cherry = (color) => (
  <g>
    <circle cx={-4} cy={6} r={4.5} fill={color} />
    <circle cx={4} cy={6} r={4.5} fill={color} />
    <path d="M-4,1.5 C-4,-6 0,-12 4,1.5" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <line x1="0" y1="-12" x2="2" y2="-15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </g>
);

const seedling = (color) => (
  <g>
    <line x1="0" y1="12" x2="0" y2="-3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path d="M0,-3 C-2,-9 -9,-10 -8,-5 C-8,-5 -5,-1 0,-3 Z" fill={color} />
    <path d="M0,-3 C2,-9 9,-10 8,-5 C8,-5 5,-1 0,-3 Z" fill={color} />
    <path d="M0,2 C2,-4 9,-5 8,0 C8,0 5,4 0,2 Z" fill={color} opacity="0.75" />
  </g>
);

const herb = (color) => (
  <g>
    <line x1="0" y1="12" x2="0" y2="-8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <ellipse cx={-5.5} cy={-5} rx={5} ry={3} transform="rotate(-35, -5.5, -5)" fill={color} />
    <ellipse cx={5.5} cy={-5} rx={5} ry={3} transform="rotate(35, 5.5, -5)" fill={color} />
    <ellipse cx={-4.5} cy={2} rx={4} ry={2.5} transform="rotate(-20, -4.5, 2)" fill={color} opacity="0.8" />
    <ellipse cx={4.5} cy={2} rx={4} ry={2.5} transform="rotate(20, 4.5, 2)" fill={color} opacity="0.8" />
  </g>
);

const lotus = (color) => (
  <g fill={color}>
    <path d="M0,8 C-3,2 -3,-6 0,-10 C3,-6 3,2 0,8 Z" />
    <path d="M0,8 C-7,2 -12,-5 -8,-9 C-4,-8 -2,-2 0,8 Z" opacity="0.8" />
    <path d="M0,8 C7,2 12,-5 8,-9 C4,-8 2,-2 0,8 Z" opacity="0.8" />
    <path d="M0,8 C-12,5 -14,-1 -10,-6 C-6,-4 -3,2 0,8 Z" opacity="0.5" />
    <path d="M0,8 C12,5 14,-1 10,-6 C6,-4 3,2 0,8 Z" opacity="0.5" />
  </g>
);

const cross = (color) => (
  <g stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <line x1="0" y1="-10" x2="0" y2="10" />
    <line x1="-10" y1="0" x2="10" y2="0" />
  </g>
);

const diamond = (color) => (
  <g>
    <polygon points="0,-12 9,0 0,12 -9,0" fill={color} />
    <polygon points="0,-6 4.5,0 0,6 -4.5,0" fill="white" />
  </g>
);

const dots = (color) => (
  <g fill={color}>
    <circle cx={0} cy={-7.5} r={3.5} />
    <circle cx={-6.5} cy={4} r={3.5} />
    <circle cx={6.5} cy={4} r={3.5} />
  </g>
);

export const STYLE_ICONS = {
  'Jardim Encantado': [
    { id: 'flower',    label: 'Flor',      render: flower },
    { id: 'butterfly', label: 'Borboleta', render: butterfly },
    { id: 'leaf',      label: 'Folha',     render: leaf },
  ],
  'Escandinavo Acolhedor': [
    { id: 'snowflake', label: 'Floco',     render: snowflake },
    { id: 'star5',     label: 'Estrela',   render: star5 },
    { id: 'pine',      label: 'Abeto',     render: pine },
  ],
  'Essência Atemporal': [
    { id: 'teardrop',  label: 'Gota',      render: teardrop },
    { id: 'feather',   label: 'Pena',      render: feather },
    { id: 'rings',     label: 'Círculos',  render: rings },
  ],
  'Doce Encantamento': [
    { id: 'heart',     label: 'Coração',   render: heart },
    { id: 'bow',       label: 'Laço',      render: bow },
    { id: 'cherry',    label: 'Cereja',    render: cherry },
  ],
  'Raízes & Cuidado': [
    { id: 'seedling',  label: 'Broto',     render: seedling },
    { id: 'herb',      label: 'Erva',      render: herb },
    { id: 'lotus',     label: 'Lótus',     render: lotus },
  ],
  'Estético Editorial': [
    { id: 'cross',     label: 'Cruz',      render: cross },
    { id: 'diamond',   label: 'Diamante',  render: diamond },
    { id: 'dots',      label: 'Pontos',    render: dots },
  ],
};

export const getIconById = (estiloNome, iconId) => {
  const icons = STYLE_ICONS[estiloNome] || [];
  return icons.find(i => i.id === iconId) || null;
};
