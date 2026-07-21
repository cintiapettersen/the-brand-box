import json

def update_dict(file_path, is_en=False):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if 'onboarding' in data and 'elementos_options' in data['onboarding']:
        data['onboarding']['elementos_options'] = {
            "Toque Lúdico / Elementos Mágicos": "Playful Touch / Magical Elements" if is_en else "Toque Lúdico / Elementos Mágicos",
            "Mascotes / Ícones Divertidos": "Mascots / Fun Icons" if is_en else "Mascotes / Ícones Divertidos",
            "Minimalismo / Linhas Retas": "Minimalism / Straight Lines" if is_en else "Minimalismo / Linhas Retas",
            "Aquarela Clássica": "Classic Watercolor" if is_en else "Aquarela Clássica",
            "Formas Orgânicas / Tons Terrosos": "Organic Shapes / Earthy Tones" if is_en else "Formas Orgânicas / Tons Terrosos",
            "Tipografia Pura / Editorial": "Pure Typography / Editorial" if is_en else "Tipografia Pura / Editorial"
        }

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_dict('src/dictionaries/en.json', True)
update_dict('src/dictionaries/pt.json', False)
print("Updated dictionaries")
