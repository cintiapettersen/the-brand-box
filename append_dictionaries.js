const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enCheckout = {
  "checkout": {
    "header_pretitle": "Creative clarity, even for those who have never created a brand before.",
    "header_title": "Choose the ideal experience for your brand.<br/>From essential to extraordinary.",
    "header_subtitle": "Your visual identity is ready to stop being an idea and start existing for real.",
    "plan_essence_title": "ESSENCE",
    "plan_essence_badge": "Your complete brand",
    "plan_essence_features": [
      "Typographic logo + variations",
      "Exclusive brand pattern",
      "Manifesto and Tone of Voice",
      "Color palette + typography",
      "Complete Brand Guide (PDF)"
    ],
    "plan_essence_highlight": "✨ The essentials to start your brand",
    "plan_essence_warning": "⚠️ <strong>Notice:</strong> This plan focuses on modern typographic design and geometric/abstract system patterns. It does not include exclusive custom illustrations, hand-drawn logos, or illustrated footer patterns.",
    "plan_essence_btn": "Start my brand",
    "btn_processing": "Processing...",
    
    "plan_studio_title": "STUDIO",
    "plan_studio_badge": "MOST CHOSEN",
    "plan_studio_subbadge": "Brand + Digital + Prints",
    "plan_studio_features": [
      "Everything from Brand Box Starter",
      "STATIONERY",
      "Complete pack for Instagram",
      "Digital Card + E-mail Signature"
    ],
    "plan_studio_highlight": "✨ Your brand ready for the world",
    "plan_studio_warning": "⚠️ <strong>Notice:</strong> This plan focuses on digital layouts and modern stationery structuring. It does not include custom footer illustrations or hand-drawn logos (these exclusive art options can be requested post-checkout or by contracting the <em>Signature</em> plan).",
    "plan_studio_btn": "I want my complete brand",
    "plan_studio_btn_bonus": "👀 Select items",
    "plan_studio_bonus_selected": "{count} printed items marked",
    "plan_studio_bonus_unselected": "5 printed items of your choice",
    "plan_studio_adicionais": "(+ additional)",

    "plan_sig_title": "SIGNATURE",
    "plan_sig_badge": "✨ An exclusive experience created together with a designer",
    "plan_sig_price": "Starting at<br/>$ 580",
    "plan_sig_features": [
      "Personalized creative direction",
      "Unlimited manual adjustments and refinements",
      "Illustrated logo or custom-drawn symbol",
      "Exclusive unifying drawings and illustrations (e.g. footer details for prints)",
      "Exclusive applications tailored to your field",
      "Close follow-up via WhatsApp"
    ],
    "plan_sig_btn": "Talk on WhatsApp",
    "plan_sig_msg": "Hello! I want to know more about the Brand Box Signature for the brand {marca}",

    "footer_msg": "You don't need to know where to start.<br/>I will guide you through each step.",
    "footer_btn_restart": "Start over from scratch",

    "modal_bonus_title": "Bonus: Your Prints",
    "modal_bonus_subtitle": "Choose your 5 free prints. Additional items are $6 each!",
    "modal_bonus_premium": "👑 PREMIUM — 124 Pages",
    "modal_bonus_premium_info": "Exclusive add-on: <strong>+$ 36.00</strong>. Ideal for complete baby tracking. <em>Does not consume the 5 free bonuses!</em>",
    "modal_bonus_selected": "Selected: {count} of 5 free {premium_text}",
    "modal_bonus_premium_text": "(+ 1 Premium Item)",
    "modal_bonus_extra": "+{count} extra(s) (+$ {price})",
    "modal_bonus_and": " and ",
    "modal_bonus_premium_price": "+1 Premium Item (+$ 36)",
    "modal_bonus_uncheck_all": "Uncheck all",
    "modal_bonus_check_all": "Check all",
    "modal_bonus_btn_save": "Save Choices"
  },
  "papelaria": {
    "Cartão de Visita": "Business Card",
    "Receituário Padrão (A4 e A5)": "Standard Prescription (A4 and A5)",
    "Atestado Médico (A4 e A5)": "Medical Certificate (A4 and A5)",
    "Cartão de Retorno": "Return Card",
    "Pasta A4 Exclusiva": "Exclusive A4 Folder",
    "Envelope Ofício (23x11,5cm)": "Office Envelope (23x11.5cm)",
    "Envelope Saco (24x34cm)": "Large Envelope (24x34cm)",
    "Recibo": "Receipt",
    "Receituário de Controle Especial": "Special Control Prescription",
    "Dicas de Introdução Alimentar": "Food Introduction Tips",
    "Guia de Vacina c/ Calendário": "Vaccine Guide w/ Calendar",
    "Guia de Desenvolvimento": "Development Guide",
    "Orientação Pré-Natal": "Prenatal Guidance",
    "Cartão de Exame Pré-Natal": "Prenatal Exam Card",
    "Checklist Maternidade": "Maternity Checklist",
    "Guia do Sono": "Sleep Guide",
    "Orientações p/ Recém Nascidos": "Newborn Guidelines",
    "Prontuário Médico": "Medical Record",
    "Receita de Alta": "Discharge Prescription",
    "Ficha de Cadastro": "Registration Form",
    "Certificado de Coragem": "Certificate of Courage",
    "Quadro de Incentivo": "Incentive Chart",
    "Arte para Caneca/Brindes": "Art for Mug/Gifts",
    "Gráfico de Crescimento": "Growth Chart",
    "Diário do Xixi": "Pee Diary",
    "Card de Orientação de Sono": "Sleep Orientation Card",
    "Meu Pratinho": "My Little Plate",
    "Guia de Amamentação": "Breastfeeding Guide",
    "T-Shirt": "T-Shirt",
    "Caderneta de Saúde": "Health Booklet",
    "Papel Timbrado": "Letterhead",
    "Cartão de Agradecimento (10x15cm)": "Thank You Card (10x15cm)",
    "Etiqueta para Correios": "Shipping Label",
    "Recibo Comercial": "Commercial Receipt",
    "Cartão de Retorno/Fidelidade": "Return/Loyalty Card",
    "Assinatura de E-mail": "E-mail Signature",
    "Tag para Sacola": "Bag Tag"
  }
};

const ptCheckout = {
  "checkout": {
    "header_pretitle": "Clareza criativa, mesmo para quem nunca criou uma marca antes.",
    "header_title": "Escolha a experiência ideal para sua marca.<br/>Do essencial ao extraordinário.",
    "header_subtitle": "Sua identidade visual está pronta para deixar de ser ideia e começar a existir de verdade.",
    "plan_essence_title": "ESSENCE",
    "plan_essence_badge": "Sua marca completa",
    "plan_essence_features": [
      "Logo tipográfica + variações",
      "Estampa exclusiva da marca",
      "Manifesto e Tom de Voz",
      "Paleta de cores + tipografia",
      "Guia da Marca completo (PDF)"
    ],
    "plan_essence_highlight": "✨ O essencial para começar sua marca",
    "plan_essence_warning": "⚠️ <strong>Aviso:</strong> Este plano é focado em design tipográfico moderno e estampa geométrica/abstrata do sistema. Não inclui ilustrações exclusivas personalizadas, logomarcas desenhadas à mão ou padrões ilustrados de rodapé.",
    "plan_essence_btn": "Começar minha marca",
    "btn_processing": "Processando...",

    "plan_studio_title": "STUDIO",
    "plan_studio_badge": "MAIS ESCOLHIDO",
    "plan_studio_subbadge": "Marca + Digital + Impressos",
    "plan_studio_features": [
      "Tudo do Brand Box Starter",
      "PAPELARIA",
      "Pack completo para Instagram",
      "Cartão Digital + Assinatura de E-mail"
    ],
    "plan_studio_highlight": "✨ Sua marca pronta para o mundo",
    "plan_studio_warning": "⚠️ <strong>Aviso:</strong> Este plano é focado em layouts digitais e estruturação moderna de papelaria. Não inclui desenhos/ilustrações de rodapé sob medida, nem logotipos ilustrados à mão (estas opções de arte exclusiva podem ser solicitadas pós-checkout ou contratando o plano <em>Signature</em>).",
    "plan_studio_btn": "Quero minha marca completa",
    "plan_studio_btn_bonus": "👀 Selecionar itens",
    "plan_studio_bonus_selected": "{count} itens impressos marcados",
    "plan_studio_bonus_unselected": "5 Itens impressos à escolha",
    "plan_studio_adicionais": "(+ adicionais)",

    "plan_sig_title": "SIGNATURE",
    "plan_sig_badge": "✨ Uma experiência exclusiva criada junto com uma designer",
    "plan_sig_price": "A partir de<br/>R$ 2.900",
    "plan_sig_features": [
      "Direção criativa personalizada",
      "Ajustes e refinamentos manuais ilimitados",
      "Logotipo ilustrado ou símbolo desenhado sob medida",
      "Desenhos e ilustrações unificadoras exclusivas (ex: detalhes de rodapé para impressos)",
      "Aplicações exclusivas sob medida para sua atuação",
      "Acompanhamento próximo pelo WhatsApp"
    ],
    "plan_sig_btn": "Falar no WhatsApp",
    "plan_sig_msg": "Olá! Quero saber mais sobre o Brand Box Signature para a marca {marca}",

    "footer_msg": "Não precisa saber por onde começar.<br/>Eu te guio em cada etapa.",
    "footer_btn_restart": "Recomeçar do zero",

    "modal_bonus_title": "Bônus: Seus Impressos",
    "modal_bonus_subtitle": "Escolha seus 5 impressos gratuitos. Itens adicionais saem por R$30 cada!",
    "modal_bonus_premium": "👑 PREMIUM — 124 Págs",
    "modal_bonus_premium_info": "Adicional exclusivo: <strong>+R$ 180,00</strong>. Ideal para acompanhamento completo do bebê. <em>Não consome os 5 bônus grátis!</em>",
    "modal_bonus_selected": "Selecionados: {count} de 5 grátis {premium_text}",
    "modal_bonus_premium_text": "(+ 1 Item Premium)",
    "modal_bonus_extra": "+{count} extra(s) (+R$ {price})",
    "modal_bonus_and": " e ",
    "modal_bonus_premium_price": "+1 Item Premium (+R$ 180)",
    "modal_bonus_uncheck_all": "Desmarcar todos",
    "modal_bonus_check_all": "Marcar todos",
    "modal_bonus_btn_save": "Salvar Escolhas"
  },
  "papelaria": {
    "Cartão de Visita": "Cartão de Visita",
    "Receituário Padrão (A4 e A5)": "Receituário Padrão (A4 e A5)",
    "Atestado Médico (A4 e A5)": "Atestado Médico (A4 e A5)",
    "Cartão de Retorno": "Cartão de Retorno",
    "Pasta A4 Exclusiva": "Pasta A4 Exclusiva",
    "Envelope Ofício (23x11,5cm)": "Envelope Ofício (23x11,5cm)",
    "Envelope Saco (24x34cm)": "Envelope Saco (24x34cm)",
    "Recibo": "Recibo",
    "Receituário de Controle Especial": "Receituário de Controle Especial",
    "Dicas de Introdução Alimentar": "Dicas de Introdução Alimentar",
    "Guia de Vacina c/ Calendário": "Guia de Vacina c/ Calendário",
    "Guia de Desenvolvimento": "Guia de Desenvolvimento",
    "Orientação Pré-Natal": "Orientação Pré-Natal",
    "Cartão de Exame Pré-Natal": "Cartão de Exame Pré-Natal",
    "Checklist Maternidade": "Checklist Maternidade",
    "Guia do Sono": "Guia do Sono",
    "Orientações p/ Recém Nascidos": "Orientações p/ Recém Nascidos",
    "Prontuário Médico": "Prontuário Médico",
    "Receita de Alta": "Receita de Alta",
    "Ficha de Cadastro": "Ficha de Cadastro",
    "Certificado de Coragem": "Certificado de Coragem",
    "Quadro de Incentivo": "Quadro de Incentivo",
    "Arte para Caneca/Brindes": "Arte para Caneca/Brindes",
    "Gráfico de Crescimento": "Gráfico de Crescimento",
    "Diário do Xixi": "Diário do Xixi",
    "Card de Orientação de Sono": "Card de Orientação de Sono",
    "Meu Pratinho": "Meu Pratinho",
    "Guia de Amamentação": "Guia de Amamentação",
    "T-Shirt": "T-Shirt",
    "Caderneta de Saúde": "Caderneta de Saúde",
    "Papel Timbrado": "Papel Timbrado",
    "Cartão de Agradecimento (10x15cm)": "Cartão de Agradecimento (10x15cm)",
    "Etiqueta para Correios": "Etiqueta para Correios",
    "Recibo Comercial": "Recibo Comercial",
    "Cartão de Retorno/Fidelidade": "Cartão de Retorno/Fidelidade",
    "Assinatura de E-mail": "Assinatura de E-mail",
    "Tag para Sacola": "Tag para Sacola"
  }
};

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

Object.assign(enData, enCheckout);
Object.assign(ptData, ptCheckout);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));

console.log('Dictionaries updated!');
