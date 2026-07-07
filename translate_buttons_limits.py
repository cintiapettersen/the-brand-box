import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'pattern_tab' not in en:
        en['pattern_tab'] = {}
    if 'pattern_tab' not in pt:
        pt['pattern_tab'] = {}

    en['pattern_tab'].update({
        'download_pattern': '⬇ Download Pattern',
        'generate_new_options': '✨ Generate new options',
        'generate_pattern': '✨ Generate pattern',
        'generating_wait': '✨ Weaving your patterns... (this takes ~15s)',
        'remaining': '{n} generations remaining',
        'limit_reached_text': 'Generation limit reached'
    })

    pt['pattern_tab'].update({
        'download_pattern': '⬇ Baixar Estampa',
        'generate_new_options': '✨ Gerar novas opções',
        'generate_pattern': '✨ Gerar estampa',
        'generating_wait': '✨ Tecendo suas estampas... (isso leva uns 15s)',
        'remaining': '{n} {n_word}',
        'limit_reached_text': 'Limite de gerações atingido'
    })

    # For palette download
    if 'guide_tab' not in en: en['guide_tab'] = {}
    if 'guide_tab' not in pt: pt['guide_tab'] = {}
    
    en['guide_tab']['download_palette'] = '⬇ Download Color Palette'
    pt['guide_tab']['download_palette'] = '⬇ Baixar Paleta de Cores'

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Buttons and limits dictionaries updated!')
