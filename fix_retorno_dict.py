import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('dictionary?.retorno_consultas', 'dictionary?.geral?.retorno_consultas')

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
