import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r">\s*Frente\s*<", r">{dictionary?.geral?.frente || 'Frente'}<", content)
content = re.sub(r">\s*Verso\s*<", r">{dictionary?.geral?.verso || 'Verso'}<", content)
content = re.sub(r">\s*FRENTE\s*<", r">{dictionary?.geral?.frente?.toUpperCase() || 'FRENTE'}<", content)
content = re.sub(r">\s*VERSO\s*<", r">{dictionary?.geral?.verso?.toUpperCase() || 'VERSO'}<", content)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced Frente and Verso")
