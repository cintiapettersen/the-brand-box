import json

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

# Add to PT
pt_data['help']['suporte_gratuito_titulo'] = "Suporte Gratuito"
pt_data['help']['suporte_gratuito_itens'] = [
    "Dúvidas de uso",
    "Problemas de acesso",
    "Suporte à impressão",
    "Auxílio na exportação"
]
pt_data['help']['concierge_subtitulo'] = "Concierge Criativo"
pt_data['help']['concierge_itens'] = [
    "Refinamentos de cores",
    "Alterações especiais",
    "Ajustes manuais de logo",
    "Aplicações personalizadas"
]
pt_data['help']['concierge_btn'] = "Solicitar ajuda personalizada →"
pt_data['help']['concierge_wpp_msg'] = "Olá! Gostaria de saber mais sobre o acompanhamento de concierge criativo e ajustes extras premium para minha marca no Brand Box."


# Add to EN
en_data['help']['suporte_gratuito_titulo'] = "Free Support"
en_data['help']['suporte_gratuito_itens'] = [
    "Usage questions",
    "Access problems",
    "Printing support",
    "Export assistance"
]
en_data['help']['concierge_subtitulo'] = "Creative Concierge"
en_data['help']['concierge_itens'] = [
    "Color refinements",
    "Special modifications",
    "Manual logo adjustments",
    "Custom applications"
]
en_data['help']['concierge_btn'] = "Request personalized help →"
en_data['help']['concierge_wpp_msg'] = "Hello! I would like to know more about the creative concierge service and premium extra adjustments for my brand on the Brand Box."

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

print("Translation dictionaries updated part 2.")
