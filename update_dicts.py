import json

pt_onboarding = {
    "step_2_title": "Antes de começarmos...",
    "step_2_subtitle": "Como você gostaria de ser chamada(o)?",
    "step_2_name_placeholder": "Seu nome ou apelido",
    "step_2_email_placeholder": "O seu melhor e-mail",
    "btn_continue": "Continuar",
    "btn_next": "Avançar",
    "btn_next_heart": "Avançar 🤍",
    "step_3_title": "E a sua marca?",
    "step_3_subtitle": "Este nome vai guiar toda a sua identidade visual.",
    "step_3_placeholder": "Ex: Clínica Sonho Meu...",
    "step_3_words_ok": "{count} palavra(s) — ótimo para uma logo bonita ✓",
    "step_3_words_warning": "{count} palavras — veja a dica abaixo",
    "step_3_success": "✅ Nome atualizado! Ficou muito mais elegante para a logo.",
    "step_3_tip": "💡 <strong>Dica visual:</strong> nomes longos ficam difíceis de ler na logo. Abreviar o nome do meio mantém a elegância sem perder a identidade.",
    "step_3_use_suggestion": "Usar \"{sugestao}\"",
    "step_3_dr_tip": "👩‍⚕️ Quer manter o título <strong>Dra.</strong> na logo? Fica lindo em alguns estilos! Pode deixar — a gente vai usar na identidade visual.",
    "step_4_title": "Qual é a sua área de atuação?",
    "step_4_subtitle": "Escolha a que mais combina com o seu negócio.",
    "step_5_title": "Para quem você atende?",
    "step_5_subtitle": "Qual o seu público principal?",
    "step_5_5_title": "Qual a energia da sua marca?",
    "step_5_5_subtitle": "Isso ajuda a calibrarmos as cores e os elementos visuais (evitando estampas que não combinem com você).",
    "step_6_title": "Que sensações você quer transmitir?",
    "step_6_subtitle": "Selecione até 2 opções que mais se conectam com a sua marca.",
    "step_6_selected": "Selecionadas: {count}/2",
    "step_7_title": "O que não pode faltar no layout?",
    "step_7_subtitle": "Quais elementos visuais e temáticos são vitais para você? (Escolha 1 opção)",
    "btn_matchmaker": "Descobrir meu Estilo Ideal ✨",
    "areas_options": {
        "Pediatria / Saúde infantil": "Pediatria / Saúde infantil",
        "Obstetrícia / Saúde da mulher": "Obstetrícia / Saúde da mulher",
        "Clínica / Saúde geral adulta": "Clínica / Saúde geral adulta",
        "Terapia / Saúde mental": "Terapia / Saúde mental",
        "Estética / Bem-estar / Nutrição": "Estética / Bem-estar / Nutrição",
        "Cosméticos Naturais / Bem-estar Consciente": "Cosméticos Naturais / Bem-estar Consciente",
        "Marca Pessoal / Profissional Liberal": "Marca Pessoal / Profissional Liberal",
        "Loja de Roupas / Moda Infantil": "Loja de Roupas / Moda Infantil"
    },
    "publicos_options": {
        "Bebês e criancinhas (0 a 6 anos)": "Bebês e criancinhas (0 a 6 anos)",
        "Crianças e adolescentes (6 a 18 anos)": "Crianças e adolescentes (6 a 18 anos)",
        "Adultos em geral": "Adultos em geral"
    },
    "identidades_options": {
        "Feminina": "Feminina",
        "Masculina": "Masculina",
        "Neutra / Unissex": "Neutra / Unissex"
    },
    "sensacoes_options": {
        "Acolhimento e cuidado": "Acolhimento e cuidado",
        "Alegria e leveza": "Alegria e leveza",
        "Confiança e profissionalismo": "Confiança e profissionalismo",
        "Sofisticação e elegância": "Sofisticação e elegância",
        "Criatividade e originalidade": "Criatividade e originalidade",
        "Encantamento e delicadeza": "Encantamento e delicadeza",
        "Natureza e tranquilidade": "Natureza e tranquilidade"
    },
    "elementos_options": {
        "Cores vibrantes": "Cores vibrantes",
        "Universo Lúdico (Fadas, Princesas)": "Universo Lúdico (Fadas, Princesas)",
        "Bichinhos / Animais Fofos": "Bichinhos / Animais Fofos",
        "Aquarela Clássica": "Aquarela Clássica",
        "Minimalismo e Traços Limpos": "Minimalismo e Traços Limpos",
        "Tons Quentes / Linho Orgânico": "Tons Quentes / Linho Orgânico",
        "Clássico e Nostálgico": "Clássico e Nostálgico",
        "Clean / Tipografia Pura": "Clean / Tipografia Pura"
    }
}

en_onboarding = {
    "step_2_title": "Before we start...",
    "step_2_subtitle": "How would you like to be called?",
    "step_2_name_placeholder": "Your name or nickname",
    "step_2_email_placeholder": "Your best e-mail",
    "btn_continue": "Continue",
    "btn_next": "Next",
    "btn_next_heart": "Next 🤍",
    "step_3_title": "And your brand?",
    "step_3_subtitle": "This name will guide your entire visual identity.",
    "step_3_placeholder": "Ex: My Dream Clinic...",
    "step_3_words_ok": "{count} word(s) — great for a beautiful logo ✓",
    "step_3_words_warning": "{count} words — see the tip below",
    "step_3_success": "✅ Name updated! Much more elegant for the logo.",
    "step_3_tip": "💡 <strong>Visual tip:</strong> long names are hard to read on a logo. Abbreviating the middle name keeps elegance without losing identity.",
    "step_3_use_suggestion": "Use \"{sugestao}\"",
    "step_3_dr_tip": "👩‍⚕️ Want to keep the **Dr.** title on the logo? It looks great in some styles! You can leave it — we will use it in the visual identity.",
    "step_4_title": "What is your field of work?",
    "step_4_subtitle": "Choose the one that best suits your business.",
    "step_5_title": "Who do you serve?",
    "step_5_subtitle": "What is your main audience?",
    "step_5_5_title": "What is the energy of your brand?",
    "step_5_5_subtitle": "This helps us calibrate colors and visual elements (avoiding patterns that don't match you).",
    "step_6_title": "What feelings do you want to convey?",
    "step_6_subtitle": "Select up to 2 options that best connect with your brand.",
    "step_6_selected": "Selected: {count}/2",
    "step_7_title": "What cannot be missing in the layout?",
    "step_7_subtitle": "Which visual and thematic elements are vital to you? (Choose 1 option)",
    "btn_matchmaker": "Discover my Ideal Style ✨",
    "areas_options": {
        "Pediatria / Saúde infantil": "Pediatrics / Children's Health",
        "Obstetrícia / Saúde da mulher": "Obstetrics / Women's Health",
        "Clínica / Saúde geral adulta": "Clinic / General Adult Health",
        "Terapia / Saúde mental": "Therapy / Mental Health",
        "Estética / Bem-estar / Nutrição": "Aesthetics / Wellness / Nutrition",
        "Cosméticos Naturais / Bem-estar Consciente": "Natural Cosmetics / Conscious Wellness",
        "Marca Pessoal / Profissional Liberal": "Personal Brand / Freelancer",
        "Loja de Roupas / Moda Infantil": "Clothing Store / Kids Fashion"
    },
    "publicos_options": {
        "Bebês e criancinhas (0 a 6 anos)": "Babies and toddlers (0 to 6 years)",
        "Crianças e adolescentes (6 a 18 anos)": "Children and teenagers (6 to 18 years)",
        "Adultos em geral": "Adults in general"
    },
    "identidades_options": {
        "Feminina": "Feminine",
        "Masculina": "Masculine",
        "Neutra / Unissex": "Neutral / Unisex"
    },
    "sensacoes_options": {
        "Acolhimento e cuidado": "Welcoming and care",
        "Alegria e leveza": "Joy and lightness",
        "Confiança e profissionalismo": "Trust and professionalism",
        "Sofisticação e elegância": "Sophistication and elegance",
        "Criatividade e originalidade": "Creativity and originality",
        "Encantamento e delicadeza": "Enchantment and delicacy",
        "Natureza e tranquilidade": "Nature and tranquility"
    },
    "elementos_options": {
        "Cores vibrantes": "Vibrant colors",
        "Universo Lúdico (Fadas, Princesas)": "Playful Universe (Fairies, Princesses)",
        "Bichinhos / Animais Fofos": "Cute Animals / Pets",
        "Aquarela Clássica": "Classic Watercolor",
        "Minimalismo e Traços Limpos": "Minimalism and Clean Lines",
        "Tons Quentes / Linho Orgânico": "Warm Tones / Organic Linen",
        "Clássico e Nostálgico": "Classic and Nostalgic",
        "Clean / Tipografia Pura": "Clean / Pure Typography"
    }
}

with open('src/dictionaries/pt.json', 'r') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r') as f:
    en_data = json.load(f)

pt_data['onboarding'] = pt_onboarding
en_data['onboarding'] = en_onboarding

with open('src/dictionaries/pt.json', 'w') as f:
    json.dump(pt_data, f, ensure_ascii=False, indent=2)

with open('src/dictionaries/en.json', 'w') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)
