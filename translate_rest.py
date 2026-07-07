import json
import os

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['tagline_tab'] = {
        'custom_logo_msg': 'You uploaded your own logo, so the tagline is already part of your image!',
        'custom_logo_sub': 'To change the tagline or use the options on this tab, go back to the "Your Logo" tab and select "Suggested logo".',
        'brand_tagline': '💬 Brand Tagline',
        'with_tagline': '✓ With tagline',
        'without_tagline': '✗ No tagline',
        'placeholder': 'Ex: Delicacy in every detail',
        'ai_tip': '📝 AI Tip',
        'choose_focused': 'Choose a tagline focused on',
        'examples': 'Examples:',
        'font_style': 'Aa Font Style',
        'spacing': '↔ Spacing'
    }

    pt['tagline_tab'] = {
        'custom_logo_msg': 'Você enviou sua própria logo, então a tagline (slogan) já faz parte da sua imagem!',
        'custom_logo_sub': 'Para alterar a tagline ou usar as opções desta aba, volte à aba "Sua Logo" e selecione a "Logo sugerida".',
        'brand_tagline': '💬 Tagline da Marca',
        'with_tagline': '✓ Com tagline',
        'without_tagline': '✗ Sem tagline',
        'placeholder': 'Ex: Delicadeza em cada detalhe',
        'ai_tip': '📝 Dica da IA',
        'choose_focused': 'Escolha uma tagline focada em',
        'examples': 'Exemplos:',
        'font_style': 'Aa Estilo da Fonte',
        'spacing': '↔ Espaçamento'
    }

    en['seal_tab'] = {
        'custom_logo_msg': 'You uploaded your own logo, so the seal was generated from it!',
        'custom_logo_sub': 'To test automatic formats, go back to the "Your Logo" tab and select "Suggested logo".',
        'seal_style': '✨ Seal Style',
        'circular': '⭕ Circular',
        'minimal': '⚡ Minimal',
        'seal_desc': 'Seals (or submarks) are compact variations of your logo,',
        'seal_desc_2': 'perfect to use as profile pictures, stamps, or stickers.'
    }

    pt['seal_tab'] = {
        'custom_logo_msg': 'Você enviou sua própria logo, então a submarca (selo) foi gerada a partir dela!',
        'custom_logo_sub': 'Para testar os formatos automáticos, volte à aba "Sua Logo" e selecione a "Logo sugerida".',
        'seal_style': '✨ Estilo da Submarca',
        'circular': '⭕ Circular',
        'minimal': '⚡ Minimal',
        'seal_desc': 'As submarcas (ou selos) são variações compactas do seu logo,',
        'seal_desc_2': 'perfeitas para usar como foto de perfil, carimbos ou adesivos.'
    }

    en['color_tab'] = {
        'priority_order': 'Color Priority Order',
        'drag_reorder': 'Drag to reorder. The top color appears more in your arts — the last one, less.',
        'save_order': 'Save color order →',
        'order_saved': '✓ Order saved! Prints have been updated.'
    }

    pt['color_tab'] = {
        'priority_order': 'Ordem de Prioridade das Cores',
        'drag_reorder': 'Arraste para reordenar. A cor no topo aparece mais nas suas artes — a última, menos.',
        'save_order': 'Salvar ordem das cores →',
        'order_saved': '✓ Ordem salva! Os impressos já foram atualizados.'
    }

    en['palette_tab'] = {
        'main': 'Main',
        'secondary': 'Secondary',
        'tertiary': 'Tertiary',
        'complementary': 'Complementary',
        'support': 'Support',
        'color': 'Color',
        'main_palette_color': 'main palette color',
        'shade': 'shade'
    }

    pt['palette_tab'] = {
        'main': 'Principal',
        'secondary': 'Secundária',
        'tertiary': 'Terciária',
        'complementary': 'Complementar',
        'support': 'Apoio',
        'color': 'Cor',
        'main_palette_color': 'cor paleta principal',
        'shade': 'tom'
    }

    en['pattern_tab'] = {
        'generating': 'Generating patterns...',
        'generate_new': '✨ Generate New Pattern',
        'left': 'left',
        'limit_reached': 'Limit reached',
        'smooth_seams': 'Smooth seams',
        'zoom': 'Zoom',
        'qr_link': 'Link for QR Code (website, WhatsApp...)',
        'limit_reached_desc': 'Generation limit reached. Pro plan allows...',
        'change_reference': 'Change reference',
        'confirm': 'Confirm',
        'cancel': 'Cancel',
        'select_base': 'Select the base reference pattern:'
    }

    pt['pattern_tab'] = {
        'generating': 'Gerando estampas...',
        'generate_new': '✨ Gerar Nova Estampa',
        'left': 'Restam',
        'limit_reached': 'Restam 0',
        'smooth_seams': 'Suavizar emendas',
        'zoom': 'Zoom',
        'qr_link': 'Link para o QR Code (site, WhatsApp...)',
        'limit_reached_desc': 'Limite de gerações atingido. O plano Pro permite...',
        'change_reference': 'Mudar referência',
        'confirm': 'Confirmar',
        'cancel': 'Cancelar',
        'select_base': 'Selecione a estampa de referência base:'
    }

    en['guide_tab'] = {
        'brand_guidelines': 'Brand Guidelines',
        'color_palette': 'Color Palette',
        'main_typography': 'Main Font',
        'support': 'Support',
        'tone_of_voice': 'Tone of Voice',
        'download_pdf': '⬇ Download Full Guide in PDF',
        'new_tab': 'A new tab will open — use "Save as PDF" in the print menu.',
        'popups': '(If it does not open, check if your browser blocked Pop-ups)'
    }

    pt['guide_tab'] = {
        'brand_guidelines': 'Guia de Identidade Visual',
        'color_palette': 'Paleta de Cores',
        'main_typography': 'Fonte Principal',
        'support': 'Apoio',
        'tone_of_voice': 'Tom de Voz',
        'download_pdf': '⬇ Baixar Guia em PDF',
        'new_tab': 'Uma nova aba abrirá — use "Salvar como PDF" no menu de impressão.',
        'popups': '(Se não abrir, verifique se seu navegador bloqueou Pop-ups)'
    }

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

def update_page_js():
    with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Color tab
    content = content.replace(
        "Ordem de Prioridade das Cores",
        "{dictionary?.color_tab?.priority_order || 'Ordem de Prioridade das Cores'}"
    )
    content = content.replace(
        "Arraste para reordenar. A cor no topo aparece mais nas suas artes — a última, menos.",
        "{dictionary?.color_tab?.drag_reorder || 'Arraste para reordenar. A cor no topo aparece mais nas suas artes — a última, menos.'}"
    )
    content = content.replace(
        "✓ Ordem salva! Os impressos já foram atualizados.",
        "{dictionary?.color_tab?.order_saved || '✓ Ordem salva! Os impressos já foram atualizados.'}"
    )
    content = content.replace(
        "Salvar ordem das cores →",
        "{dictionary?.color_tab?.save_order || 'Salvar ordem das cores →'}"
    )
    # The array in CoresPrioridadeStep
    content = content.replace(
        "const labels = ['Principal', '2ª cor', '3ª cor', '4ª cor', '5ª cor'];",
        "const labels = [dictionary?.palette_tab?.main || 'Principal', '2ª cor', '3ª cor', '4ª cor', '5ª cor'];"
    )

    # Palette tab
    content = content.replace(
        "const roleLabels = ['Principal', 'Secundária', 'Terciária', 'Complementar', 'Apoio'];",
        "const roleLabels = [dictionary?.palette_tab?.main || 'Principal', dictionary?.palette_tab?.secondary || 'Secundária', dictionary?.palette_tab?.tertiary || 'Terciária', dictionary?.palette_tab?.complementary || 'Complementar', dictionary?.palette_tab?.support || 'Apoio'];"
    )
    content = content.replace(
        "{roleLabels[ci] || 'Cor'}",
        "{roleLabels[ci] || dictionary?.palette_tab?.color || 'Cor'}"
    )
    content = content.replace(
        "cor paleta principal",
        "{dictionary?.palette_tab?.main_palette_color || 'cor paleta principal'}"
    )
    content = content.replace(
        ">tom {ti+1}</p>",
        ">{dictionary?.palette_tab?.shade || 'tom'} {ti+1}</p>"
    )

    # Pattern tab
    content = content.replace(
        "Gerando estampas...",
        "{dictionary?.pattern_tab?.generating || 'Gerando estampas...'}"
    )
    content = content.replace(
        "✨ Gerar Nova Estampa",
        "{dictionary?.pattern_tab?.generate_new || '✨ Gerar Nova Estampa'}"
    )
    content = content.replace(
        "Restam {remaining}",
        "{dictionary?.pattern_tab?.left || 'Restam'} {remaining}"
    )
    content = content.replace(
        "Restam 0",
        "{dictionary?.pattern_tab?.limit_reached || 'Restam 0'}"
    )
    content = content.replace(
        "Suavizar emendas",
        "{dictionary?.pattern_tab?.smooth_seams || 'Suavizar emendas'}"
    )
    content = content.replace(
        "Link para o QR Code (site, WhatsApp...)",
        "{dictionary?.pattern_tab?.qr_link || 'Link para o QR Code (site, WhatsApp...)'}"
    )
    content = content.replace(
        "Limite de gerações atingido. O plano Pro permite...",
        "{dictionary?.pattern_tab?.limit_reached_desc || 'Limite de gerações atingido. O plano Pro permite...'}"
    )
    content = content.replace(
        "Mudar referência",
        "{dictionary?.pattern_tab?.change_reference || 'Mudar referência'}"
    )
    content = content.replace(
        "Selecione a estampa de referência base:",
        "{dictionary?.pattern_tab?.select_base || 'Selecione a estampa de referência base:'}"
    )

    # Guide tab
    content = content.replace(
        "Guia de Identidade Visual",
        "{dictionary?.guide_tab?.brand_guidelines || 'Guia de Identidade Visual'}"
    )
    content = content.replace(
        "Paleta de Cores",
        "{dictionary?.guide_tab?.color_palette || 'Paleta de Cores'}"
    )
    content = content.replace(
        "Fonte Principal",
        "{dictionary?.guide_tab?.main_typography || 'Fonte Principal'}"
    )
    content = content.replace(
        ">Apoio</p>",
        ">{dictionary?.guide_tab?.support || 'Apoio'}</p>"
    )
    content = content.replace(
        ">Tom de Voz</p>",
        ">{dictionary?.guide_tab?.tone_of_voice || 'Tom de Voz'}</p>"
    )
    content = content.replace(
        "⬇ Baixar Guia em PDF",
        "{dictionary?.guide_tab?.download_pdf || '⬇ Baixar Guia em PDF'}"
    )
    content = content.replace(
        "Uma nova aba abrirá — use \"Salvar como PDF\" no menu de impressão.",
        "{dictionary?.guide_tab?.new_tab || 'Uma nova aba abrirá — use \"Salvar como PDF\" no menu de impressão.'}"
    )
    content = content.replace(
        "(Se não abrir, verifique se seu navegador bloqueou Pop-ups)",
        "{dictionary?.guide_tab?.popups || '(Se não abrir, verifique se seu navegador bloqueou Pop-ups)'}"
    )

    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)

update_dictionaries()
update_page_js()
print('All tabs parsed and updated!')
