import json

for lang in ['en', 'pt']:
    with open(f'src/dictionaries/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'geral' not in data:
        data['geral'] = {}
        
    data['geral']['frente'] = 'Front' if lang == 'en' else 'Frente'
    data['geral']['verso'] = 'Back' if lang == 'en' else 'Verso'
    
    with open(f'src/dictionaries/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

print("Dictionaries updated with geral.frente and verso.")
