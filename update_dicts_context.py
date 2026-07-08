import json

def update_dict(path, is_en):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'onboarding' in data:
        if is_en:
            data['onboarding']['step_4_other_btn'] = "Other"
            data['onboarding']['step_4_other_placeholder'] = "Type your field..."
            data['onboarding']['step_4_add_context_btn'] = "Add more context +"
            data['onboarding']['step_4_context_placeholder'] = "This helps us understand the context behind your brand. Tell us more about what you do, your unique approach, etc. (Optional)"
        else:
            data['onboarding']['step_4_other_btn'] = "Outra"
            data['onboarding']['step_4_other_placeholder'] = "Digite sua área..."
            data['onboarding']['step_4_add_context_btn'] = "Adicionar mais contexto +"
            data['onboarding']['step_4_context_placeholder'] = "Isso nos ajuda a entender o contexto e a alma da sua marca. Conte mais sobre o que você faz, seu diferencial, etc. (Opcional)"

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_dict('src/dictionaries/pt.json', False)
update_dict('src/dictionaries/en.json', True)
print("Dictionaries updated successfully!")
