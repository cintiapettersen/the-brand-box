import json
import os

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['logo_tab'].update({
        'origin': '📂 Logo Origin',
        'suggested_logo': '✨ Suggested logo',
        'upload_logo': '📤 Upload my logo',
        'bg_color': '🖼️ Background Color',
        'logo_color': '🎨 Logo Color',
        'download_files': '💾 Download Logo Files',
        'png_transparent': 'Transparent PNG',
        'logo_bg': 'Logo with Background'
    })

    pt['logo_tab'].update({
        'origin': '📂 Origem da Logo',
        'suggested_logo': '✨ Logo sugerida',
        'upload_logo': '📤 Enviar minha logo',
        'bg_color': '🖼️ Cor de Fundo',
        'logo_color': '🎨 Cor da Logo',
        'download_files': '💾 Baixar Arquivos da Logo',
        'png_transparent': 'PNG Transparente',
        'logo_bg': 'Logo com Fundo'
    })

    # Let's add general navigation strings if they don't exist
    if 'geral' not in en:
        en['geral'] = {}
    if 'geral' not in pt:
        pt['geral'] = {}

    en['geral'].update({
        'voltar': '← Back',
        'proxima_etapa': 'Next step'
    })
    pt['geral'].update({
        'voltar': '← Voltar',
        'proxima_etapa': 'Próxima etapa'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

def update_page_js():
    with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Logo tab replacements
    content = content.replace(
        "📂 Origem da Logo",
        "{dictionary?.logo_tab?.origin || '📂 Origem da Logo'}"
    )
    content = content.replace(
        "✨ Logo sugerida",
        "{dictionary?.logo_tab?.suggested_logo || '✨ Logo sugerida'}"
    )
    content = content.replace(
        "📤 Enviar minha logo",
        "{dictionary?.logo_tab?.upload_logo || '📤 Enviar minha logo'}"
    )
    content = content.replace(
        "🖼️ Cor de Fundo",
        "{dictionary?.logo_tab?.bg_color || '🖼️ Cor de Fundo'}"
    )
    content = content.replace(
        "🎨 Cor da Logo",
        "{dictionary?.logo_tab?.logo_color || '🎨 Cor da Logo'}"
    )
    content = content.replace(
        "💾 Baixar Arquivos da Logo",
        "{dictionary?.logo_tab?.download_files || '💾 Baixar Arquivos da Logo'}"
    )
    content = content.replace(
        "PNG Transparente",
        "{dictionary?.logo_tab?.png_transparent || 'PNG Transparente'}"
    )
    content = content.replace(
        "Logo com Fundo",
        "{dictionary?.logo_tab?.logo_bg || 'Logo com Fundo'}"
    )
    
    # Navigation replacements
    content = content.replace(
        "← Voltar",
        "{dictionary?.geral?.voltar || '← Voltar'}"
    )

    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)

update_dictionaries()
update_page_js()
print('Remaining Logo tab elements parsed and updated!')
