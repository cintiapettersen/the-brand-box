import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'insta_pack' not in en: en['insta_pack'] = {}
    if 'insta_pack' not in pt: pt['insta_pack'] = {}
    
    en['insta_pack'].update({
        'tiraduvidas_title': 'Q&A',
        'tiraduvidas_subtitle': 'Send me your question!',
        'enquete_title': 'Tell me!',
        'enquete_subtitle': 'What is your doubt?',
        'mito_title': 'Fact or Myth?',
        'mito_subtitle': 'What have you heard?',
        'dica_title': 'Tip of the Day',
        'dica_subtitle': 'Swipe to see the content',
        'indica_title': 'Recommendations!',
        'indica_subtitle': 'What product do you want to see?',
        'novidades_title': 'News',
        'novidades_subtitle': 'Good things are coming!',
        'sabiaque_title': 'Did You Know?',
        'sabiaque_subtitle': 'A fact that will surprise you',
        'livre_title': 'Talk to Me!',
        'livre_subtitle': 'Send your message',
        'question_box_placeholder': 'SPACE FOR THE QUESTION BOX'
    })

    pt['insta_pack'].update({
        'tiraduvidas_title': 'Tira-Dúvidas',
        'tiraduvidas_subtitle': 'Me manda sua pergunta!',
        'enquete_title': 'Me conta!',
        'enquete_subtitle': 'Qual é a sua dúvida?',
        'mito_title': 'Verdade ou Mito?',
        'mito_subtitle': 'O que você já ouviu por aí?',
        'dica_title': 'Dica do Dia',
        'dica_subtitle': 'Arrasta pra ver o conteúdo',
        'indica_title': 'Me Indica!',
        'indica_subtitle': 'Qual produto você quer ver?',
        'novidades_title': 'Novidades',
        'novidades_subtitle': 'Tem coisa boa chegando!',
        'sabiaque_title': 'Você Sabia?',
        'sabiaque_subtitle': 'Um fato que vai te surpreender',
        'livre_title': 'Fala Comigo!',
        'livre_subtitle': 'Manda sua mensagem',
        'question_box_placeholder': 'ESPAÇO PARA A CAIXINHA DE PERGUNTAS'
    })

    # Global UI or Email Signature
    if 'ui' not in en: en['ui'] = {}
    if 'ui' not in pt: pt['ui'] = {}
    
    en['ui'].update({
        'baixar_png': '⬇ Download PNG',
        'copiar_html': 'Copy HTML →',
        'copiado': 'Copied!'
    })

    pt['ui'].update({
        'baixar_png': '⬇ Baixar PNG',
        'copiar_html': 'Copiar HTML →',
        'copiado': 'Copiado!'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Insta pack dictionaries updated!')
