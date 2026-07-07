import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# React component replacements
content = content.replace("'NOME COMPLETO DA CRIANÇA :'", "dictionary?.ficha_cadastro?.crianca_nome || 'NOME COMPLETO DA CRIANÇA :'")
content = content.replace("'DATA DE NASCIMENTO:'", "dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:'")
content = content.replace("'IDADE:'", "dictionary?.ficha_cadastro?.idade || 'IDADE:'")
content = content.replace("'NOME DA MÃE :'", "dictionary?.ficha_cadastro?.mae_nome || 'NOME DA MÃE :'")
content = content.replace("'PROFISSÃO:'", "dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:'")
content = content.replace("'CPF:'", "dictionary?.ficha_cadastro?.cpf || 'CPF:'")
content = content.replace("'NOME DO PAI :'", "dictionary?.ficha_cadastro?.pai_nome || 'NOME DO PAI :'")
content = content.replace("'NOME COMPLETO :'", "dictionary?.ficha_cadastro?.completo_nome || 'NOME COMPLETO :'")
content = content.replace("'RG:'", "dictionary?.ficha_cadastro?.rg || 'RG:'")
content = content.replace("'ESTADO CIVIL:'", "dictionary?.ficha_cadastro?.estado_civil || 'ESTADO CIVIL:'")
content = content.replace("'NOME DO RESPONSÁVEL (se menor):'", "dictionary?.ficha_cadastro?.responsavel_nome || 'NOME DO RESPONSÁVEL (se menor):'")
content = content.replace("'GRAU DE PARENTESCO:'", "dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:'")

content = content.replace("['Criança', 'Adulto']", "[dictionary?.ficha_cadastro?.crianca || 'Criança', dictionary?.ficha_cadastro?.adulto || 'Adulto']")

content = content.replace("CADASTRO DE PACIENTES", "{dictionary?.ficha_cadastro?.titulo || 'CADASTRO DE PACIENTES'}")
# Wait, CADASTRO DE PACIENTES in the PDF generator shouldn't have {}!
# We'll fix it manually for the PDF generator and the React component.

with open('translate_ficha.py_wip', 'w', encoding='utf-8') as f:
    f.write('done')
