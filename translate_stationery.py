import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_jsx(pattern, replacement):
    global content
    content = re.sub(pattern, replacement, content)

# 1. Cartão de Retorno (Return Card)
# JSX:
replace_jsx(r">\s*RETORNO DE CONSULTAS\s*<", r">{dictionary?.retorno_consultas?.titulo || 'RETORNO DE CONSULTAS'}<")
replace_jsx(r">\s*FRENTE\s*<", r">{dictionary?.retorno_consultas?.frente || 'FRENTE'}<")
replace_jsx(r">\s*VERSO\s*<", r">{dictionary?.retorno_consultas?.verso || 'VERSO'}<")
replace_jsx(r">\s*Data\s*<", r">{dictionary?.retorno_consultas?.data || 'Data'}<")
replace_jsx(r">\s*Horário\s*<", r">{dictionary?.retorno_consultas?.horario || 'Horário'}<")

# PDF:
replace_jsx(r">RETORNO DE CONSULTAS<", r">${dictionary?.retorno_consultas?.titulo || 'RETORNO DE CONSULTAS'}<")
replace_jsx(r">FRENTE<", r">${dictionary?.retorno_consultas?.frente || 'FRENTE'}<")
replace_jsx(r">VERSO<", r">${dictionary?.retorno_consultas?.verso || 'VERSO'}<")
replace_jsx(r">Data<", r">${dictionary?.retorno_consultas?.data || 'Data'}<")
replace_jsx(r">Horário<", r">${dictionary?.retorno_consultas?.horario || 'Horário'}<")

# 2. Certificado de Coragem (Certificate of Courage)
# JSX:
replace_jsx(r">\s*Certificado Pediátrico de\s*<", r">{dictionary?.certificado_coragem?.pediatrico_de || 'Certificado Pediátrico de'}<")
replace_jsx(r">\s*Coragem\s*<", r">{dictionary?.certificado_coragem?.coragem || 'Coragem'}<")
replace_jsx(
    r">\s*Certifico para os devidos e lúdicos fins, que\s*",
    r">{dictionary?.certificado_coragem?.certifico_que || 'Certifico para os devidos e lúdicos fins, que'} "
)
replace_jsx(
    r"\s*idade\s+_____\s+comportou-se corretamente na consulta de hoje,\s*",
    r" {dictionary?.certificado_coragem?.idade || 'idade'} _____ {dictionary?.certificado_coragem?.comportou_se || 'comportou-se corretamente na consulta de hoje,'} "
)
replace_jsx(
    r"\s*sendo educado e demonstrando muita coragem e valentia.\s*<",
    r" {dictionary?.certificado_coragem?.sendo_educado || 'sendo educado e demonstrando muita coragem e valentia.'}<"
)

# PDF:
replace_jsx(r">Certificado Pediátrico de<", r">${dictionary?.certificado_coragem?.pediatrico_de || 'Certificado Pediátrico de'}<")
replace_jsx(r">Coragem<", r">${dictionary?.certificado_coragem?.coragem || 'Coragem'}<")
replace_jsx(
    r">Certifico para os devidos e lúdicos fins, que",
    r">${dictionary?.certificado_coragem?.certifico_que || 'Certifico para os devidos e lúdicos fins, que'}"
)
replace_jsx(
    r"idade\s+_____\s+comportou-se corretamente na consulta de hoje,",
    r"${dictionary?.certificado_coragem?.idade || 'idade'} _____ ${dictionary?.certificado_coragem?.comportou_se || 'comportou-se corretamente na consulta de hoje,'}"
)
replace_jsx(
    r"sendo educado e demonstrando muita coragem e valentia.<",
    r"${dictionary?.certificado_coragem?.sendo_educado || 'sendo educado e demonstrando muita coragem e valentia.'}<"
)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced!")
