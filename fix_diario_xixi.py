import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the days array
content = content.replace(
    "const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];",
    "const days = dictionary?.diario_xixi?.dias || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];"
)

# Fix the Preview strings
preview_replacements = {
    "Controle de Escapes e Enurese (Xixi na Cama)": "{dictionary?.diario_xixi?.subtitulo || 'Controle de Escapes e Enurese (Xixi na Cama)'}",
    ">Nome:<": ">{dictionary?.diario_xixi?.nome || 'Nome:'}<",
    ">Legenda:<": ">{dictionary?.diario_xixi?.legenda || 'Legenda:'}<",
    ">0:<": ">0:<", # Keep 0:
    "Acordou Seco(a) / Sem Escapes": "{dictionary?.diario_xixi?.seco || 'Acordou Seco(a) / Sem Escapes'}",
    "Gotas / Escape Leve": "{dictionary?.diario_xixi?.gotas || 'Gotas / Escape Leve'}",
    "Molhou a Roupa ou Fralda": "{dictionary?.diario_xixi?.molhou_roupa || 'Molhou a Roupa ou Fralda'}",
    "Abundante / Molhou a Cama": "{dictionary?.diario_xixi?.abundante || 'Abundante / Molhou a Cama'}",
    "Marque 0 a 3": "{dictionary?.diario_xixi?.marque_0_3 || 'Marque 0 a 3'}",
    "Semana ${w}": "${dictionary?.diario_xixi?.semana || 'Semana'} ${w}"
}

for k, v in preview_replacements.items():
    content = content.replace(k, v)

# Fix the PDF strings (those that differ from Preview)
pdf_replacements = {
    "Controle de Escapes e Enurese (Xixi na Cama)": "${dictionary?.diario_xixi?.subtitulo || 'Controle de Escapes e Enurese (Xixi na Cama)'}",
    ">Nome:<": ">${dictionary?.diario_xixi?.nome || 'Nome:'}<",
    ">Legenda:<": ">${dictionary?.diario_xixi?.legenda || 'Legenda:'}<",
    "Acordou Seco(a) / Sem Escapes": "${dictionary?.diario_xixi?.seco || 'Acordou Seco(a) / Sem Escapes'}",
    "Gotas / Escape Leve": "${dictionary?.diario_xixi?.gotas || 'Gotas / Escape Leve'}",
    "Molhou a Roupa ou Fralda": "${dictionary?.diario_xixi?.molhou_roupa || 'Molhou a Roupa ou Fralda'}",
    "Abundante / Molhou a Cama": "${dictionary?.diario_xixi?.abundante || 'Abundante / Molhou a Cama'}",
    "Marque 0 a 3": "${dictionary?.diario_xixi?.marque_0_3 || 'Marque 0 a 3'}",
    "Semana ${w}": "${dictionary?.diario_xixi?.semana || 'Semana'} ${w}"
}

# Wait, since I replaced the preview strings, the literal strings like "Acordou Seco(a) / Sem Escapes" 
# will already be replaced if they match exactly. But in the PDF they are raw text!
# Let's read the file line by line and fix it manually to avoid messing up.
