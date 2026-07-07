import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    if 'tone_words' not in en:
        en['tone_words'] = {}
    if 'tone_words' not in pt:
        pt['tone_words'] = {}

    tone_mapping_en = {
        'Afetivo': 'Affectionate',
        'Acolhedor': 'Cozy',
        'Delicado': 'Delicate',
        'Elegante': 'Elegant',
        'Emotivo': 'Emotional',
        'Limpo': 'Clean',
        'Objetivo': 'Objective',
        'Sofisticado': 'Sophisticated',
        'Atemporal': 'Timeless',
        'Preciso': 'Precise',
        'Tradicional': 'Traditional',
        'Confiável': 'Reliable',
        'Sólido': 'Solid',
        'Respeitável': 'Respectable',
        'Inovador': 'Innovative',
        'Ousado': 'Bold',
        'Dinâmico': 'Dynamic',
        'Atual': 'Current',
        'Direto': 'Direct',
        'Alegre': 'Joyful',
        'Criativo': 'Creative',
        'Espontâneo': 'Spontaneous',
        'Colorido': 'Colorful',
        'Vibrante': 'Vibrant',
        'Exclusivo': 'Exclusive',
        'Refinado': 'Refined',
        'Premium': 'Premium',
        'Elevado': 'Elevated',
        'Orgânico': 'Organic',
        'Autêntico': 'Authentic',
        'Gentil': 'Gentle',
        'Consciente': 'Conscious',
        'Leve': 'Light',
        'Lúdico': 'Playful',
        'Carinhoso': 'Caring',
        'Imaginativo': 'Imaginative',
        'Seguro': 'Safe',
        'Único': 'Unique',
        'Memorável': 'Memorable'
    }

    # Add to English dict
    for pt_word, en_word in tone_mapping_en.items():
        en['tone_words'][pt_word] = en_word
        pt['tone_words'][pt_word] = pt_word

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Tone words dictionaries updated!')
