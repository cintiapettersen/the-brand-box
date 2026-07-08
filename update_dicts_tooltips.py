import json

def update_dict(path, is_en):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'onboarding' in data:
        if is_en:
            data['onboarding']['step_2_hint'] = "Your contact name, not your brand name."
            data['onboarding']['step_2_email_placeholder'] = "Your best email"
        else:
            data['onboarding']['step_2_hint'] = "Seu nome de contato, como você se chama, e não a sua marca."
            data['onboarding']['step_2_email_placeholder'] = "O seu melhor e-mail"

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_dict('src/dictionaries/pt.json', False)
update_dict('src/dictionaries/en.json', True)
print("Dictionaries updated successfully!")
