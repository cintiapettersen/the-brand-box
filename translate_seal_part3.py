import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['seal_tab'].update({
        'text_color': '✍️ Text Color',
        'download_files': '💾 Download Seal Files',
        'png_transparent': 'Transparent PNG',
        'seal_bg': 'Seal with Background'
    })

    pt['seal_tab'].update({
        'text_color': '✍️ Cor do Texto',
        'download_files': '💾 Baixar Arquivos do Selo',
        'png_transparent': 'PNG Transparente',
        'seal_bg': 'Selo com Fundo'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Seal tab dictionaries updated!')
