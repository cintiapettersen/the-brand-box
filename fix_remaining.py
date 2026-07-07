import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to avoid repetitive code
def replace_jsx(pattern, replacement):
    global content
    content = re.sub(pattern, replacement, content)

# Diário do Xixi
replace_jsx(r">\s*DIÁRIO DO XIXI \(HÁBITO MICCIONAL\)\s*<", r">{dictionary?.diario_xixi?.titulo || 'DIÁRIO DO XIXI (HÁBITO MICCIONAL)'}<")
replace_jsx(r">DIÁRIO DO XIXI \(HÁBITO MICCIONAL\)<", r">${dictionary?.diario_xixi?.titulo || 'DIÁRIO DO XIXI (HÁBITO MICCIONAL)'}<")

# Checklist Maternidade
replace_jsx(r">\s*CHECKLIST MATERNIDADE\s*<", r">{dictionary?.checklist_maternidade?.titulo || 'CHECKLIST MATERNIDADE'}<")
replace_jsx(r">CHECKLIST MATERNIDADE<", r">${dictionary?.checklist_maternidade?.titulo || 'CHECKLIST MATERNIDADE'}<")

# Guia de Cuidados com o Bebê
replace_jsx(r">\s*GUIA DE\s*<", r">{dictionary?.guia_cuidados?.guia_de || 'GUIA DE'}<")
replace_jsx(r">\s*CUIDADOS COM O BEBÊ\s*<", r">{dictionary?.guia_cuidados?.titulo || 'CUIDADOS COM O BEBÊ'}<")

# Orientacoes RN
replace_jsx(r">\s*ALIMENTAÇÃO DA MÃE\s*<", r">{dictionary?.orientacoes_rn?.alimentacao_mae || 'ALIMENTAÇÃO DA MÃE'}<")
replace_jsx(r">\s*COMPOSIÇÃO DO LEITE MATERNO\s*<", r">{dictionary?.orientacoes_rn?.composicao_leite || 'COMPOSIÇÃO DO LEITE MATERNO'}<")
replace_jsx(r">\s*PROBLEMAS COMUNS\s*<", r">{dictionary?.orientacoes_rn?.problemas_comuns || 'PROBLEMAS COMUNS'}<")
replace_jsx(r">\s*APOIO EMOCIONAL\s*<", r">{dictionary?.orientacoes_rn?.apoio_emocional || 'APOIO EMOCIONAL'}<")
replace_jsx(r">\s*AMAMENTAÇÃO\s*<", r">{dictionary?.orientacoes_rn?.amamentacao || 'AMAMENTAÇÃO'}<")
replace_jsx(r">\s*ALEITAMENTO MATERNO EXCLUSIVO\s*<", r">{dictionary?.orientacoes_rn?.aleitamento || 'ALEITAMENTO MATERNO EXCLUSIVO'}<")

# CPF and Parentesco (in case they appear elsewhere)
replace_jsx(r">\s*GRAU DE PARENTESCO:\s*<", r">{dictionary?.ficha_cadastro?.grau_parentesco || 'GRAU DE PARENTESCO:'}<")
replace_jsx(r">\s*CPF:\s*<", r">{dictionary?.ficha_cadastro?.cpf || 'CPF:'}<")

# NOME and NASCIMENTO (used in folders)
replace_jsx(r">\s*NOME:\s*<", r">{dictionary?.ficha_cadastro?.nome || 'NOME:'}<")
replace_jsx(r">\s*NASCIMENTO:\s*<", r">{dictionary?.ficha_cadastro?.nascimento || 'NASCIMENTO:'}<")
replace_jsx(r">NOME:<", r">${dictionary?.ficha_cadastro?.nome || 'NOME:'}<")
replace_jsx(r">NASCIMENTO:<", r">${dictionary?.ficha_cadastro?.nascimento || 'NASCIMENTO:'}<")

# Any other specific items missing. Let's do Prontuario Preview
replace_jsx(r">\s*PRONTUÁRIO MÉDICO\s*<", r">{dictionary?.prontuario?.titulo || 'PRONTUÁRIO MÉDICO'}<")
replace_jsx(r">PRONTUÁRIO MÉDICO<", r">${dictionary?.prontuario?.titulo || 'PRONTUÁRIO MÉDICO'}<")

# Recibo
replace_jsx(r">\s*RECIBO\s*<", r">{dictionary?.recibo?.titulo || 'RECIBO'}<")
replace_jsx(r">RECIBO<", r">${dictionary?.recibo?.titulo || 'RECIBO'}<")
replace_jsx(r">\s*Nº\s*<", r">{dictionary?.recibo?.numero || 'Nº'}<")
replace_jsx(r">\s*VALOR:\s*<", r">{dictionary?.recibo?.valor || 'VALOR:'}<")

# Atestado
replace_jsx(r">\s*ATESTADO MÉDICO\s*<", r">{dictionary?.atestado?.titulo || 'ATESTADO MÉDICO'}<")
replace_jsx(r">ATESTADO MÉDICO<", r">${dictionary?.atestado?.titulo || 'ATESTADO MÉDICO'}<")

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
