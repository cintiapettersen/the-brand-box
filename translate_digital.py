import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'digital_tab' not in en: en['digital_tab'] = {}
    if 'digital_tab' not in pt: pt['digital_tab'] = {}

    en['digital_tab'].update({
        'horizontal_card': 'Horizontal (Card)',
        'portrait_screen': 'Portrait (Full Screen)',
        'contact_preference': 'How would you like to be contacted?',
        'fill_contacts': 'Fill in your contacts below',
        'share': '↑ Share',
        'send_whatsapp': 'Send on WhatsApp',
        'download_html': '⬇ Download HTML',
        'tagline_specialty': 'Tagline / Specialty',
        'contacts': 'Contacts',
        'layout_horizontal': 'Horizontal',
        'layout_2_lines': '2 Lines',
        'layout_stacked': 'Stacked',
        'qr_active': '✓ QR Code active',
        'add_qr': '+ QR Code',
        'qr_placeholder': 'Link for QR Code (website, WhatsApp...)'
    })

    pt['digital_tab'].update({
        'horizontal_card': 'Horizontal (Cartão)',
        'portrait_screen': 'Retrato (Full Screen)',
        'contact_preference': 'Como prefere entrar em contato?',
        'fill_contacts': 'Preencha os contatos abaixo',
        'share': '↑ Compartilhar',
        'send_whatsapp': 'Enviar no Whats',
        'download_html': '⬇ Baixar HTML',
        'tagline_specialty': 'Tagline / Especialidade',
        'contacts': 'Contatos',
        'layout_horizontal': 'Horizontal',
        'layout_2_lines': '2 Linhas',
        'layout_stacked': 'Empilhada',
        'qr_active': '✓ QR Code ativo',
        'add_qr': '+ QR Code',
        'qr_placeholder': 'Link para o QR Code (site, WhatsApp...)'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Digital tab dictionaries updated!')
