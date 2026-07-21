import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace nuncaPensarOpcoes
old_array = """  const nuncaPensarOpcoes = [
    "Infantil / Amadora",
    "Muito Séria / Fria",
    "Genérica / Sem Graça",
    "Poluída / Confusa",
    "Muito Simples / Básica",
    "Exageradamente Luxuosa",
    "Antiquada / Ultrapassada",
    "Pouco Confiável",
    "Outra..."
  ];"""

new_array = """  const nuncaPensarOpcoes = lang === 'en' ? [
    "Childish / Amateur",
    "Too Serious / Cold",
    "Generic / Boring",
    "Cluttered / Confusing",
    "Too Simple / Basic",
    "Overly Luxurious",
    "Old-fashioned / Outdated",
    "Untrustworthy",
    "Other..."
  ] : [
    "Infantil / Amadora",
    "Muito Séria / Fria",
    "Genérica / Sem Graça",
    "Poluída / Confusa",
    "Muito Simples / Básica",
    "Exageradamente Luxuosa",
    "Antiquada / Ultrapassada",
    "Pouco Confiável",
    "Outra..."
  ];"""

content = content.replace(old_array, new_array)

# Replace the Outra... check
content = content.replace(
    "{(formData.nuncaPensarTags || []).includes('Outra...') && (",
    "{( (formData.nuncaPensarTags || []).includes('Outra...') || (formData.nuncaPensarTags || []).includes('Other...') ) && ("
)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed")
