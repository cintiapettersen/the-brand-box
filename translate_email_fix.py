import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'digital_tab' not in en: en['digital_tab'] = {}
    if 'digital_tab' not in pt: pt['digital_tab'] = {}

    en['digital_tab'].update({
        'how_to_install': 'How to install in your E-mail?',
        'install_step_1': 'Click on the <b>Copy HTML</b> button (we have already formatted everything for you).',
        'install_step_2': 'Open the settings of your Gmail, Outlook or Apple Mail.',
        'install_step_3': 'Look for the <b>Signature</b> section and create a new one.',
        'install_step_4': 'Click on the blank text box and <b>Paste (Ctrl+V or Cmd+V)</b>. Done, the art will magically appear inside! ✨'
    })

    pt['digital_tab'].update({
        'how_to_install': 'Como instalar no seu E-mail?',
        'install_step_1': 'Clique no botão <b>Copiar HTML</b> (nós já formatamos tudo para você).',
        'install_step_2': 'Abra as configurações do seu Gmail, Outlook ou Apple Mail.',
        'install_step_3': 'Procure pela seção de <b>Assinatura</b> e crie uma nova.',
        'install_step_4': 'Clique na caixa de texto em branco e <b>Cole (Ctrl+V ou Cmd+V)</b>. Pronto, a arte vai aparecer lá dentro magicamente! ✨'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Assinatura instructions added to dictionaries!')
