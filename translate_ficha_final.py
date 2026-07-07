import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# React component arrays (using labels in single quotes)
replacements = {
    "'NOME COMPLETO DA CRIANÇA :'": "dictionary?.ficha_cadastro?.crianca_nome || 'NOME COMPLETO DA CRIANÇA :'",
    "'DATA DE NASCIMENTO:'": "dictionary?.ficha_cadastro?.data_nasc || 'DATA DE NASCIMENTO:'",
    "'IDADE:'": "dictionary?.ficha_cadastro?.idade || 'IDADE:'",
    "'NOME DA MÃE :'": "dictionary?.ficha_cadastro?.mae_nome || 'NOME DA MÃE :'",
    "'PROFISSÃO:'": "dictionary?.ficha_cadastro?.profissao || 'PROFISSÃO:'",
    "'CPF:'": "dictionary?.ficha_cadastro?.cpf || 'CPF:'",
    "'NOME DO PAI :'": "dictionary?.ficha_cadastro?.pai_nome || 'NOME DO PAI :'",
    "'NOME COMPLETO :'": "dictionary?.ficha_cadastro?.completo_nome || 'NOME COMPLETO :'",
    "'RG:'": "dictionary?.ficha_cadastro?.rg || 'RG:'",
    "'ESTADO CIVIL:'": "dictionary?.ficha_cadastro?.estado_civil || 'ESTADO CIVIL:'",
    "'NOME DO RESPONSÁVEL (se menor):'": "dictionary?.ficha_cadastro?.responsavel_nome || 'NOME DO RESPONSÁVEL (se menor):'",
    "'GRAU DE PARENTESCO:'": "dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:'",
    "'ENDEREÇO:'": "dictionary?.ficha_cadastro?.endereco || 'ENDEREÇO:'",
    "'COMPLEMENTO:'": "dictionary?.ficha_cadastro?.complemento || 'COMPLEMENTO:'",
    "'BAIRRO:'": "dictionary?.ficha_cadastro?.bairro || 'BAIRRO:'",
    "'CIDADE:'": "dictionary?.ficha_cadastro?.cidade || 'CIDADE:'",
    "'ESTADO:'": "dictionary?.ficha_cadastro?.estado || 'ESTADO:'",
    "'OUTROS TELEFONES :'": "dictionary?.ficha_cadastro?.outros_telefones || 'OUTROS TELEFONES :'",
    "'RESIDENCIAL ( ) COMERCIAL ( )'": "dictionary?.ficha_cadastro?.residencial_comercial || 'RESIDENCIAL ( ) COMERCIAL ( )'",
    "'RESIDENCIAL ( &nbsp; &nbsp;) &nbsp; COMERCIAL ( &nbsp; &nbsp;)'": "dictionary?.ficha_cadastro?.residencial_comercial || 'RESIDENCIAL ( &nbsp; &nbsp;) &nbsp; COMERCIAL ( &nbsp; &nbsp;)'",
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Update arrays mapped manually
content = content.replace("['Criança', 'Adulto']", "[dictionary?.ficha_cadastro?.crianca || 'Criança', dictionary?.ficha_cadastro?.adulto || 'Adulto']")

# Update specific JSX and template literal text 
# Note: we are careful not to replace it if it's already translated
if "CADASTRO DE PACIENTES" in content:
    # 1. In React Component (JSX):
    content = re.sub(
        r">\s*CADASTRO DE PACIENTES\s*<",
        r">{dictionary?.ficha_cadastro?.titulo || 'CADASTRO DE PACIENTES'}<",
        content
    )
    # 2. In PDF generator (template literal):
    content = re.sub(
        r">CADASTRO DE PACIENTES<",
        r">${dictionary?.ficha_cadastro?.titulo || 'CADASTRO DE PACIENTES'}<",
        content
    )

if "DATA :" in content:
    content = re.sub(
        r">\s*DATA :\s*<",
        r">{dictionary?.ficha_cadastro?.data || 'DATA :'}<",
        content
    )
    content = re.sub(
        r">DATA :<",
        r">${dictionary?.ficha_cadastro?.data || 'DATA :'}<",
        content
    )

if "NOME DO (A) RESPONSÁVEL ACOMPANHANTE:" in content:
    content = re.sub(
        r">\s*NOME DO \(A\) RESPONSÁVEL ACOMPANHANTE:\s*<",
        r">{dictionary?.ficha_cadastro?.responsavel_acompanhante || 'NOME DO (A) RESPONSÁVEL ACOMPANHANTE:'}<",
        content
    )
    content = re.sub(
        r"formRow\('NOME DO \(A\) RESPONSÁVEL ACOMPANHANTE:',\s*1\)",
        r"formRow(dictionary?.ficha_cadastro?.responsavel_acompanhante || 'NOME DO (A) RESPONSÁVEL ACOMPANHANTE:', 1)",
        content
    )

if "TELEFONES :" in content:
    content = re.sub(
        r">\s*TELEFONES :\s*<",
        r">{dictionary?.ficha_cadastro?.telefones || 'TELEFONES :'}<",
        content
    )
    content = re.sub(
        r">TELEFONES :<",
        r">${dictionary?.ficha_cadastro?.telefones || 'TELEFONES :'}<",
        content
    )

content = re.sub(r">\s*CELULAR:\s*<", r">{dictionary?.ficha_cadastro?.celular || 'CELULAR:'}<", content)
content = re.sub(r">\s*RESIDENCIAL:\s*<", r">{dictionary?.ficha_cadastro?.residencial || 'RESIDENCIAL:'}<", content)
content = re.sub(r">\s*MÃE :\s*<", r">{dictionary?.ficha_cadastro?.mae || 'MÃE :'}<", content)
content = re.sub(r">\s*PAI :\s*<", r">{dictionary?.ficha_cadastro?.pai || 'PAI :'}<", content)
content = re.sub(r">\s*RESPONSÁVEL:\s*<", r">{dictionary?.ficha_cadastro?.responsavel || 'RESPONSÁVEL:'}<", content)
content = re.sub(r">\s*E-MAILS:\s*<", r">{dictionary?.ficha_cadastro?.emails || 'E-MAILS:'}<", content)
content = re.sub(r">\s*COMO CONHECEU A CLÍNICA:\s*<", r">{dictionary?.ficha_cadastro?.como_conheceu || 'COMO CONHECEU A CLÍNICA:'}<", content)

# PDF forms for these specific ones:
content = re.sub(r"formRow\('CELULAR:',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.celular || 'CELULAR:', 1)", content)
content = re.sub(r"formRow\('RESIDENCIAL:',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.residencial || 'RESIDENCIAL:', 1)", content)
content = re.sub(r"formRow\('MÃE :',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.mae || 'MÃE :', 1)", content)
content = re.sub(r"formRow\('PAI :',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.pai || 'PAI :', 1)", content)
content = re.sub(r"formRow\('RESPONSÁVEL:',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.responsavel || 'RESPONSÁVEL:', 1)", content)
content = re.sub(r"formRow\('E-MAILS:',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.emails || 'E-MAILS:', 1)", content)
content = re.sub(r"formRow\('COMO CONHECEU A CLÍNICA:',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.como_conheceu || 'COMO CONHECEU A CLÍNICA:', 1)", content)
content = re.sub(r"formRow\('RESPONSÁVEL \(se menor\):',\s*1\)", r"formRow(dictionary?.ficha_cadastro?.responsavel_nome || 'RESPONSÁVEL (se menor):', 1)", content)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translation applied successfully!")
