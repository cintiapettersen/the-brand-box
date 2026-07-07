import json

pt_postmatch = {
    "step_8_title": "Traduzindo sua essência em direção visual...",
    "step_8_subtitle": "Nosso motor criativo está analisando o seu perfil para encontrar a combinação perfeita para você.",
    
    "step_9_perfect_match": "O MATCH PERFEITO PARA",
    "step_9_btn_customize": "Personalizar minha Identidade",
    "step_9_btn_retake": "Refazer o questionário",
    "step_9_attempts_remaining": "({count} tentativa{s} restante{s})",
    "step_9_limit_reached": "Limite de tentativas atingido.",
    
    "modal_retake_title": "Tem certeza?",
    "modal_retake_desc_1": "Você perderá o modelo gerado e <strong>não poderá recuperá-lo</strong>.",
    "modal_retake_desc_2": "Após refazer, você terá mais <strong>{count} tentativa{s}</strong> restante{s}.",
    "modal_btn_cancel": "Cancelar",
    "modal_btn_confirm": "Sim, refazer",
    
    "step_10_title": "Refinamento Visual",
    "step_10_subtitle_tipo": "1. Escolha a sua Tipografia ideal",
    "step_10_subtitle_paleta": "2. Defina sua Paleta de Cores",
    "step_10_subtitle_cor": "3. Qual cor será o destaque da sua marca?",
    "step_10_loading_styles": "Carregando estilos exclusivos...",
    "step_10_error_title": "Ops! Não conseguimos carregar as tipografias.",
    "step_10_error_desc": "Isso pode ser um erro de conexão temporário ou falta de dados para o estilo",
    "step_10_btn_retry": "Tentar carregar novamente",
    "step_10_color_desc": "Essa cor será usada no logo, submarca e nos elementos de destaque da sua identidade visual.",
    "step_10_no_color": "Nenhuma cor encontrada.",
    "step_10_color_selected": "Cor selecionada:",
    "step_10_btn_inspiration": "Ver Inspiração ✨",
    
    "step_11_moodboard": "Moodboard",
    "step_11_visual_universe": "Universo Visual de",
    "step_11_references_note": "✨ As imagens abaixo são <strong>referências visuais</strong> que servirão de inspiração para criar a identidade da sua marca. Elas não farão parte do material final — são o ponto de partida do seu universo visual.",
    "step_11_btn_tagline": "Definir minha Tagline ✨",
    
    "step_115_voice": "Sua Voz de Marca",
    "step_115_title": "Qual a sua tagline?",
    "step_115_subtitle": "Frase curta e memorável que captura a essência, o propósito e o posicionamento da sua marca.",
    "step_115_suggestions": "Sugestões para o estilo",
    "step_115_or_write": "Ou escreva a sua",
    "step_115_write_desc": "Escreva sua especialidade ou uma frase de posicionamento curta.",
    "step_115_btn_pattern": "Criar Minha Estampa ✨",
    
    "step_117_title": "Sua Estampa Exclusiva",
    "step_117_magic": "Agora a mágica acontece! ✨",
    "step_117_magic_desc": "A <strong>The Brand Box</strong> vai criar uma estampa que traduz a essência da sua marca em cada detalhe.",
    "step_117_references": "Referências do seu universo visual",
    "step_117_btn_create": "✨ Criar Minha Estampa",
    "step_117_drawing": "Desenhando com carinho...",
    "step_117_tap_card": "Toque no cartão que mais combina com a sua marca",
    "step_117_btn_regenerate": "🔄 Gerar novas opções",
    "step_117_btn_board": "Ver Minha Placa ✨"
}

en_postmatch = {
    "step_8_title": "Translating your essence into visual direction...",
    "step_8_subtitle": "Our creative engine is analyzing your profile to find the perfect match for you.",
    
    "step_9_perfect_match": "THE PERFECT MATCH FOR",
    "step_9_btn_customize": "Customize my Identity",
    "step_9_btn_retake": "Retake the questionnaire",
    "step_9_attempts_remaining": "({count} attempt{s} remaining)",
    "step_9_limit_reached": "Attempt limit reached.",
    
    "modal_retake_title": "Are you sure?",
    "modal_retake_desc_1": "You will lose the generated model and <strong>will not be able to recover it</strong>.",
    "modal_retake_desc_2": "After retaking, you will have <strong>{count} attempt{s}</strong> remaining.",
    "modal_btn_cancel": "Cancel",
    "modal_btn_confirm": "Yes, retake",
    
    "step_10_title": "Visual Refinement",
    "step_10_subtitle_tipo": "1. Choose your ideal Typography",
    "step_10_subtitle_paleta": "2. Define your Color Palette",
    "step_10_subtitle_cor": "3. Which color will highlight your brand?",
    "step_10_loading_styles": "Loading exclusive styles...",
    "step_10_error_title": "Oops! We couldn't load the typographies.",
    "step_10_error_desc": "This might be a temporary connection error or missing data for the style",
    "step_10_btn_retry": "Try loading again",
    "step_10_color_desc": "This color will be used in the logo, sub-brand, and highlight elements of your visual identity.",
    "step_10_no_color": "No color found.",
    "step_10_color_selected": "Selected color:",
    "step_10_btn_inspiration": "See Inspiration ✨",
    
    "step_11_moodboard": "Moodboard",
    "step_11_visual_universe": "Visual Universe of",
    "step_11_references_note": "✨ The images below are <strong>visual references</strong> that will inspire the creation of your brand identity. They won't be part of the final material — they are the starting point of your visual universe.",
    "step_11_btn_tagline": "Define my Tagline ✨",
    
    "step_115_voice": "Your Brand Voice",
    "step_115_title": "What is your tagline?",
    "step_115_subtitle": "A short and memorable phrase that captures the essence, purpose, and positioning of your brand.",
    "step_115_suggestions": "Suggestions for the style",
    "step_115_or_write": "Or write your own",
    "step_115_write_desc": "Write your specialty or a short positioning phrase.",
    "step_115_btn_pattern": "Create My Pattern ✨",
    
    "step_117_title": "Your Exclusive Pattern",
    "step_117_magic": "Now the magic happens! ✨",
    "step_117_magic_desc": "<strong>The Brand Box</strong> will create a pattern that translates the essence of your brand in every detail.",
    "step_117_references": "References from your visual universe",
    "step_117_btn_create": "✨ Create My Pattern",
    "step_117_drawing": "Designing with care...",
    "step_117_tap_card": "Tap the card that best matches your brand",
    "step_117_btn_regenerate": "🔄 Generate new options",
    "step_117_btn_board": "See My Brand Board ✨"
}

with open('src/dictionaries/pt.json', 'r') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r') as f:
    en_data = json.load(f)

pt_data['postmatch'] = pt_postmatch
en_data['postmatch'] = en_postmatch

with open('src/dictionaries/pt.json', 'w') as f:
    json.dump(pt_data, f, ensure_ascii=False, indent=2)

with open('src/dictionaries/en.json', 'w') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)
