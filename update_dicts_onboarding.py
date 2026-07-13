import json

def update_dict(path, is_en):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    ob = data.get('onboarding', {})

    # Step 2 Updates
    ob['step_2_hint'] = "Your name helps personalize your experience." if is_en else "Seu nome ajuda a personalizar a experiência."
    ob['step_2_name_placeholder'] = "Maria" if is_en else "Maria"
    ob['step_2_email_placeholder'] = "We'll save your project automatically. ❤️" if is_en else "Salvaremos seu projeto automaticamente. ❤️"

    # Step 3 Updates
    ob['step_3_hint'] = "Great brands often start with a simple name. 🥹" if is_en else "Grandes marcas geralmente começam com um nome simples. 🥹"
    ob['step_3_placeholder'] = "Ex: Bright Kids, Studio Bloom, Olive Skin" if is_en else "Ex: Bright Kids, Studio Bloom, Olive Skin"

    # Step 5.2 - First Impression
    ob['step_5_2_title'] = "What do you want people to think when they first see your brand? ❤️" if is_en else "O que você quer que as pessoas pensem quando virem sua marca pela primeira vez? ❤️"
    ob['step_5_2_subtitle'] = "Choose the main first impression." if is_en else "Escolha a principal primeira impressão."
    
    primeiras_impressoes = {
        "Professional": "Professional",
        "Creative": "Creative",
        "Trustworthy": "Trustworthy",
        "Premium": "Premium",
        "Friendly": "Friendly",
        "Playful": "Playful",
        "Elegant": "Elegant",
        "Modern": "Modern",
        "Calm": "Calm",
        "Bold": "Bold",
        "Natural": "Natural",
        "Innovative": "Innovative"
    } if is_en else {
        "Professional": "Profissional",
        "Creative": "Criativa",
        "Trustworthy": "Confiável",
        "Premium": "Premium",
        "Friendly": "Amigável",
        "Playful": "Lúdica",
        "Elegant": "Elegante",
        "Modern": "Moderna",
        "Calm": "Calma",
        "Bold": "Ousada / Forte",
        "Natural": "Natural",
        "Innovative": "Inovadora"
    }
    ob['primeiras_impressoes_options'] = primeiras_impressoes

    # Step 5.5 - Personality (Replacing old energy)
    ob['step_5_5_title'] = "Which best describes your brand personality?" if is_en else "Qual descreve melhor a personalidade da sua marca?"
    ob['step_5_5_subtitle'] = "This helps calibrate colors and visual elements." if is_en else "Isso ajuda a calibrar as cores e os elementos visuais."
    
    personalidades = {
        "Calm": "Calm",
        "Bold": "Bold",
        "Elegant": "Elegant",
        "Joyful": "Joyful",
        "Minimal": "Minimal",
        "Expressive": "Expressive"
    } if is_en else {
        "Calm": "Calma",
        "Bold": "Ousada",
        "Elegant": "Elegante",
        "Joyful": "Alegre",
        "Minimal": "Minimalista",
        "Expressive": "Expressiva"
    }
    ob['personalidades_options'] = personalidades

    # Step 6 - Feelings (Question update)
    ob['step_6_title'] = "How should people feel after interacting with your brand? ❤️" if is_en else "Como as pessoas devem se sentir após interagir com a sua marca? ❤️"
    
    # Step 6.5 - Where it appears
    ob['step_6_5_title'] = "Where will your brand appear most often?" if is_en else "Onde a sua marca vai aparecer com mais frequência?"
    ob['step_6_5_subtitle'] = "Select all that apply." if is_en else "Selecione todos que se aplicam."
    
    locais = {
        "Instagram": "Instagram",
        "Printed materials": "Printed materials",
        "Packaging": "Packaging",
        "Website": "Website",
        "Clothing": "Clothing",
        "Products": "Products",
        "Signage": "Signage",
        "Presentations": "Presentations"
    } if is_en else {
        "Instagram": "Instagram",
        "Printed materials": "Materiais impressos",
        "Packaging": "Embalagem",
        "Website": "Website",
        "Clothing": "Vestuário / Roupas",
        "Products": "Produtos",
        "Signage": "Fachada / Placas",
        "Presentations": "Apresentações"
    }
    ob['locais_options'] = locais

    # Step 7.2 - Inspiring Brands
    ob['step_7_2_title'] = "Which styles or brands inspire you?" if is_en else "Quais estilos ou marcas te inspiram?"
    ob['step_7_2_subtitle'] = "Not to copy, but to calibrate the style. Select the ones you identify with. (Optional)" if is_en else "Não para copiar, mas para calibrar o estilo. Selecione os que você mais se identifica. (Opcional)"
    ob['step_7_2_placeholder'] = "Type here..." if is_en else "Escreva aqui..."

    # Step 7.5 - Never think
    ob['step_7_5_title'] = "What should people never think about your brand?" if is_en else "O que as pessoas NUNCA devem pensar da sua marca?"
    ob['step_7_5_subtitle'] = "Ex: 'I don't want to look childish', 'I don't want to look expensive'. (Optional)" if is_en else "Ex: 'Não quero parecer infantil', 'Não quero parecer cara demais'. (Opcional)"
    ob['step_7_5_placeholder'] = "Type here..." if is_en else "Escreva aqui..."

    # Step 7.8 - Summary
    ob['step_7_8_title'] = "Here's what I understood about your brand." if is_en else "Aqui está o que eu entendi sobre a sua marca."
    ob['step_7_8_btn'] = "Generating..." if is_en else "Gerando..."
    ob['summary_audience'] = "Audience" if is_en else "Público"
    ob['summary_personality'] = "Personality" if is_en else "Personalidade"
    ob['summary_feelings'] = "Feelings" if is_en else "Sentimentos"
    ob['summary_style'] = "Style" if is_en else "Estilo"
    ob['summary_goals'] = "Goals" if is_en else "Objetivos"
    ob['summary_text'] = "Based on this, I'm now looking for visual directions that fit your brand." if is_en else "Com base nisso, estou buscando as direções visuais que melhor se encaixam na sua marca."

    data['onboarding'] = ob

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_dict('src/dictionaries/pt.json', False)
update_dict('src/dictionaries/en.json', True)
print("Dictionaries updated successfully!")
