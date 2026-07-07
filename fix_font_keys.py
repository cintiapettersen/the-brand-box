import json

def fix_dict(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    font_data = data.get('font', {})
    
    # Map old keys to new keys
    key_map = {
        'cursive': 'cursiva',
        'delicate': 'delicada',
        'elegant': 'elegante',
        'classic': 'classica',
        'modern': 'moderna',
        'playful': 'ludica',
        'fun': 'divertida'
    }
    
    new_font_data = {}
    for k, v in font_data.items():
        if k in key_map:
            new_font_data[key_map[k]] = v
        else:
            new_font_data[k] = v
            
    data['font'] = new_font_data
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

fix_dict('src/dictionaries/pt.json')
fix_dict('src/dictionaries/en.json')

print("Fixed font keys in dictionaries.")
