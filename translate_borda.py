import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'geral' not in en: en['geral'] = {}
    if 'geral' not in pt: pt['geral'] = {}

    en['geral'].update({
        'estampa': 'Pattern',
        'solida': 'Solid',
        'tamanho': 'Size:'
    })

    pt['geral'].update({
        'estampa': 'Estampa',
        'solida': 'Sólida',
        'tamanho': 'Tamanho:'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Added geral keys for BordaToggle!')
