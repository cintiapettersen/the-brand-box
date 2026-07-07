import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'ui' not in en: en['ui'] = {}
    if 'ui' not in pt: pt['ui'] = {}

    en['ui'].update({
        'company': 'Company',
        'company_placeholder': 'Complementary name (optional)',
        'tagline_placeholder': 'Tagline / Specialty',
        'phone': 'Phone',
        'phone2': 'Phone 2',
        'website': 'Website',
        'address': 'Address',
        'add_rqe': '+ Add RQE',
        'number': 'Number',
        'slogan': 'Slogan'
    })

    pt['ui'].update({
        'company': 'Empresa',
        'company_placeholder': 'Nome complementar (opcional)',
        'tagline_placeholder': 'Tagline / Especialidade',
        'phone': 'Telefone',
        'phone2': 'Telefone 2',
        'website': 'Site',
        'address': 'Endereço',
        'add_rqe': '+ Adicionar RQE',
        'number': 'Número',
        'slogan': 'Slogan'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Edit form instructions added to dictionaries!')
