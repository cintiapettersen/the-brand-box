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
        'mode_ampliada': 'Scaled Up',
        'mode_repetida': 'Pattern',
        'mode_mockup': 'In Context',
        'smooth_seams': '🪄 Smooth seams',
        'smoothing': '⏳ Smoothing...',
        'gallery_hint': '💡 Generated patterns are saved in the gallery above.<br/>Click the thumbnails to switch between versions.',
        'size': 'SIZE'
    })

    pt['pattern_tab'].update({
        'mode_ampliada': 'Ampliada',
        'mode_repetida': 'Repetida',
        'mode_mockup': 'No consultório',
        'smooth_seams': '🪄 Suavizar cortes',
        'smoothing': '⏳ Suavizando...',
        'gallery_hint': '💡 As estampas geradas ficam salvas na galeria acima.<br/>Clique nas miniaturas para alternar entre as versões.',
        'size': 'TAMANHO'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Pattern dictionaries updated!')
