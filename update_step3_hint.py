import json

def update_dict(path, is_en):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'onboarding' in data:
        if is_en:
            data['onboarding']['step_3_hint'] = "Short names are usually easier to remember, but the most important thing is that it makes sense to you. You can still change this name later."
        else:
            data['onboarding']['step_3_hint'] = "Nomes curtos costumam ser mais fáceis de lembrar, mas o mais importante é que ele faça sentido para você. Você ainda pode mudar esse nome depois."

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_dict('src/dictionaries/pt.json', False)
update_dict('src/dictionaries/en.json', True)
print("Dictionaries updated successfully!")
