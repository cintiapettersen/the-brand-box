import json

with open('src/dictionaries/pt.json', 'r') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r') as f:
    en_data = json.load(f)

if 'postmatch' not in pt_data: pt_data['postmatch'] = {}
if 'postmatch' not in en_data: en_data['postmatch'] = {}

pt_data['postmatch']['step_12_subtitle'] = "Identidade Visual"
pt_data['postmatch']['step_12_title'] = "Sua Placa da Marca"
pt_data['postmatch']['step_12_main_color'] = "Cor Principal:"
pt_data['postmatch']['step_12_icon'] = "Ícone:"
pt_data['postmatch']['step_12_btn_packages'] = "Ver pacotes disponíveis ✨"

en_data['postmatch']['step_12_subtitle'] = "Visual Identity"
en_data['postmatch']['step_12_title'] = "Your Brand Board"
en_data['postmatch']['step_12_main_color'] = "Main Color:"
en_data['postmatch']['step_12_icon'] = "Icon:"
en_data['postmatch']['step_12_btn_packages'] = "View available packages ✨"

with open('src/dictionaries/pt.json', 'w') as f:
    json.dump(pt_data, f, ensure_ascii=False, indent=2)

with open('src/dictionaries/en.json', 'w') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

