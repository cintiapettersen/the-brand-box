// MAPEAMENTO COMPLETO DE FONTES - THE BRAND BOX
// style: 'script' = handwritten/cursiva (usa capitalize, tamanho maior)
//        'display' = decorativa bold (uppercase)
//        'serif'/'sans' = clássica (uppercase normal)
// sizeBoost: multiplicador de tamanho para compensar fontes menores

const FONT_MAP = {
  // ============================================================
  // POP CRIATIVO (ID: 1)
  // ============================================================
  "fonte-principal-moderna-divertida": {
    fontFamily: "Quicksand", googleFont: true, weight: 600, style: "sans",
  },
  "fonte-principal-moderna-secundaria": {
    fontFamily: "Poppins", googleFont: true, weight: 500, style: "sans",
  },
  "tipografia-principal-moderna-assinatura.feminina": {
    fontFamily: "Allura", googleFont: true, weight: 400, style: "script", sizeBoost: 1.5,
  },
  "tipografia-principal-moderna-divertida-2": {
    fontFamily: "Nunito", googleFont: true, weight: 700, style: "sans",
  },
  "tipografia-secundaria-1": {
    fontFamily: "DM Sans", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia-secundaria-2": {
    fontFamily: "Raleway", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia-secundaria-3": {
    fontFamily: "Montserrat", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia principal-assinatura-2": {
    fontFamily: "Amelie", fontFile: "/fonts/Amelie.otf", weight: 400, style: "script", sizeBoost: 1.4,
  },
  "tipografia principal-assinatura": {
    fontFamily: "Sacramento", googleFont: true, weight: 400, style: "script", sizeBoost: 1.5,
  },
  "tipografia principal-caligrafia": {
    fontFamily: "JulietaProGota", fontFile: "/fonts/Latinotype - JulietaProGota.otf", weight: 400, style: "display", sizeBoost: 0.9,
  },
  "tipografia principal-caligrafia 3": {
    fontFamily: "Vellary", fontFile: "/fonts/Vellary.otf", weight: 400, style: "script", sizeBoost: 1.6,
  },

  // ============================================================
  // JARDIM ENCANTADO (ID: 2)
  // ============================================================
  "tipografia destaque bold ludica": {
    fontFamily: "Cafigine", fontFile: "/fonts/cafigine.otf", weight: 400, style: "sans", letterSpacing: '2px',
  },
  "tipografia secundaria neutra moderna": {
    fontFamily: "Vellary", fontFile: "/fonts/Vellary.otf", weight: 400, style: "script", sizeBoost: 1.6,
  },
  "tipografia secundaria clean minimalista": {
    fontFamily: "Outfit", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia principal elegante moderna": {
    fontFamily: "Julius Sans One", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia principal": {
    fontFamily: "LittleFriend", fontFile: "/fonts/LittleFriend.otf", weight: 400, style: "display", letterSpacing: '2px',
  },
  "tipografia destaque delicada handwritten": {
    fontFamily: "Celina", fontFile: "/fonts/Celina-Regular Done.ttf", weight: 400, style: "display", sizeBoost: 1.2, letterSpacing: '1px',
  },

  // ============================================================
  // ESCANDINAVO ACOLHEDOR (ID: 3)
  // ============================================================
  "tipografia afetiva assinatura suave": {
    fontFamily: "Amelie", fontFile: "/fonts/Amelie.otf", weight: 400, style: "script", sizeBoost: 1.4,
  },
  "tipografia destaque leve decorativa": {
    fontFamily: "Celina", fontFile: "/fonts/Celina-Regular Done.ttf", weight: 400, style: "display", sizeBoost: 1.2, letterSpacing: '1px',
  },
  "tipografia destaque ludica suave": {
    fontFamily: "LittleFriend", fontFile: "/fonts/LittleFriend.otf", weight: 400, style: "display", letterSpacing: '2px',
  },
  "tipografia principal elegante nordica": {
    fontFamily: "Cormorant Garamond", googleFont: true, weight: 300, style: "serif",
  },
  "tipografia principal suave moderna": {
    fontFamily: "Manrope", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia secundaria minimalista fria": {
    fontFamily: "GoldenBlast", fontFile: "/fonts/GoldenBlast-YzaVL 2.ttf", weight: 400, style: "script", sizeBoost: 0.95,
  },

  // ============================================================
  // ESSÊNCIA ATEMPORAL (ID: 5)
  // ============================================================
  "tipografia apoio assinatura elegante-(Allura)": {
    fontFamily: "Allura", googleFont: true, weight: 400, style: "script", sizeBoost: 1.5,
  },
  "tipografia principal serif classica-(Cinzel)": {
    fontFamily: "Cinzel", googleFont: true, weight: 400, style: "serif",
  },
  "tipografia principal serif editorial-(Cormorant)": {
    fontFamily: "Cormorant Garamond", googleFont: true, weight: 400, style: "serif",
  },
  "tipografia secundaria sans moderna-(Montserrat)": {
    fontFamily: "Montserrat", googleFont: true, weight: 700, style: "sans",
  },
  "tipografia secundaria sans neutra-(Noto-Sans)": {
    fontFamily: "Noto Sans", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia secundaria sans refinada-(Raleway)": {
    fontFamily: "GoldenBlast", fontFile: "/fonts/GoldenBlast-YzaVL 2.ttf", weight: 400, style: "script", sizeBoost: 0.95,
  },

  // ============================================================
  // RAÍZES & CUIDADO (ID: 6)
  // ============================================================
  "tipografia principal serif display organico moderno": {
    fontFamily: "Aberforth", fontFile: "/fonts/Aberforth Demo.ttf", weight: 400, style: "display", letterSpacing: '3px',
  },
  "tipografia principal serif natural-(Dokyo)": {
    fontFamily: "Dokyo", fontFile: "/fonts/DOKYO___.TTF", weight: 400, style: "display", letterSpacing: '2px',
  },
  "tipografia serif natural elegante": {
    fontFamily: "Vellary", fontFile: "/fonts/Vellary.otf", weight: 400, style: "script", sizeBoost: 1.6,
  },

  // ============================================================
  // DOCE ENCANTAMENTO (ID: 8) - Tags reais do banco
  // ============================================================
  "tipografia principal script fluida delicada": {
    fontFamily: "Sacramento", googleFont: true, weight: 400, style: "script", sizeBoost: 1.5,
  },
  "tipografia secundaria minimal ludica": {
    fontFamily: "Quicksand", googleFont: true, weight: 500, style: "sans",
  },
  "tipografia primaria assinaturra-virrginia": {
    fontFamily: "Amelie", fontFile: "/fonts/Amelie.otf", weight: 400, style: "script", sizeBoost: 1.1,
  },
  "tipografia principal handrwritem-julieta": {
    fontFamily: "JulietaProGota", fontFile: "/fonts/Latinotype - JulietaProGota.otf", weight: 400, style: "display", sizeBoost: 1.2, letterSpacing: '2px',
  },
  "tipografia principal script delicada-assinatura-faustiine": {
    fontFamily: "Vellary", fontFile: "/fonts/Vellary.otf", weight: 400, style: "script", sizeBoost: 1.6,
  },
  "tipografia principal script delicada-tuttifruti": {
    fontFamily: "TuttiFrutti", fontFile: "/fonts/TuttiFrutti Regular.ttf", weight: 400, style: "display", sizeBoost: 0.85,
  },

  // ============================================================
  // ESTÉTICO EDITORIAL (ID: 10 e 11)
  // ============================================================
  "tipografia primaria 01 serif cinzel": {
    fontFamily: "Cinzel", googleFont: true, weight: 400, style: "serif",
  },
  "tipografia primaria 02 serif baskerville": {
    fontFamily: "Libre Baskerville", googleFont: true, weight: 700, style: "serif",
  },
  "tipografia primaria 03 serif cormorant-elegante": {
    fontFamily: "Cormorant Garamond", googleFont: true, weight: 300, style: "serif",
  },
  "tipografia secundaria 01 sans noto-clean": {
    fontFamily: "Noto Sans", googleFont: true, weight: 400, style: "sans",
  },
  "tipografia secundaria 02 sans raleway-elegante": {
    fontFamily: "GoldenBlast", fontFile: "/fonts/GoldenBlast-YzaVL 2.ttf", weight: 400, style: "script", sizeBoost: 0.95,
  },
  "tipografia secundaria 03 sans nunito-soft": {
    fontFamily: "Nunito", googleFont: true, weight: 700, style: "sans",
  },
};

export default FONT_MAP;
