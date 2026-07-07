import json

def fix_dict():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['logo_tab'] = {
        'saved_styles': '🎨 Saved Styles',
        'save_current': '+ Save current',
        'style_name_placeholder': 'Style name...',
        'no_variations': 'No variations saved yet.',
        'layout': '📐 Arrangement / Layout',
        'one_line': '⟵→ One line',
        'two_lines': '⊟ Two lines',
        'stacked': '≡ Stacked',
        'line_spacing': '↔️ Height / Line Spacing',
        'brand_name': '✏️ Brand Name'
    }

    pt['logo_tab'] = {
        'saved_styles': '🎨 Estilos Salvos',
        'save_current': '+ Salvar atual',
        'style_name_placeholder': 'Nome do estilo...',
        'no_variations': 'Nenhuma variação salva ainda.',
        'layout': '📐 Disposição / Layout',
        'one_line': '⟵→ Uma linha',
        'two_lines': '⊟ Duas linhas',
        'stacked': '≡ Empilhada',
        'line_spacing': '↔️ Altura / Espaço entre Linhas',
        'brand_name': '✏️ Nome da Marca'
    }

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

fix_dict()
print('Fixed logo_tab dictionaries')
