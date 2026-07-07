import json

pt_font = {
  "active_font": "Fonte ativa",
  "suggested": "Sugerida",
  "applied": "✓ Aplicada",
  "try_another": "Quero tentar outra →",
  "cursive": "Cursiva",
  "delicate": "Delicada",
  "elegant": "Elegante",
  "classic": "Clássica",
  "modern": "Moderna",
  "playful": "Lúdica",
  "fun": "Divertida",
  "custom_logo_msg": "Você enviou sua própria logo, então a fonte já faz parte da sua imagem!",
  "custom_logo_sub": "Para testar outras fontes ou usar as opções desta aba, volte à aba \"Sua Logo\" e selecione a \"Logo sugerida\"."
}

en_font = {
  "active_font": "Active font",
  "suggested": "Suggested",
  "applied": "✓ Applied",
  "try_another": "I want to try another →",
  "cursive": "Cursive",
  "delicate": "Delicate",
  "elegant": "Elegant",
  "classic": "Classic",
  "modern": "Modern",
  "playful": "Playful",
  "fun": "Fun",
  "custom_logo_msg": "You uploaded your own logo, so the font is already part of your image!",
  "custom_logo_sub": "To test other fonts or use the options on this tab, go back to the \"Your Logo\" tab and select the \"Suggested logo\"."
}

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

pt_data['font'] = pt_font
en_data['font'] = en_font

# also add reiniciar_teste to 'checkout' or 'misc' or root
pt_data['reiniciar_teste'] = "reiniciar teste"
en_data['reiniciar_teste'] = "restart test"

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Added font translations.")
