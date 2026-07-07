import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'ui' not in en: en['ui'] = {}
    if 'ui' not in pt: pt['ui'] = {}
    
    en['ui']['copiar_assinatura_html'] = 'Copy HTML Signature'
    pt['ui']['copiar_assinatura_html'] = 'Copiar Assinatura HTML'

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Assinatura dictionaries updated!')
