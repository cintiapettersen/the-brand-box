import re

def insert_translation(content, func_name):
    pattern = r'(function\s+' + func_name + r'\s*\([^)]*\)\s*\{)'
    replacement = r'\1\n  const { dictionary } = useTranslation();'
    return re.sub(pattern, replacement, content)

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = insert_translation(content, 'CoresSalvarButton')
content = insert_translation(content, 'CoresPrioridadeStep')
content = insert_translation(content, 'CoresStep')
content = insert_translation(content, 'EstampaStep')
content = insert_translation(content, 'GuiaStep')

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
