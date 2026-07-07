import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# For ChecklistMaternidadePreview
content = re.sub(
    r"const SECOES = \[",
    r"const SECOES = dictionary?.checklist_maternidade?.secoes || [",
    content
)

# For the PDF Generator
content = re.sub(
    r"const SECOES_CK = \[",
    r"const SECOES_CK = dictionary?.checklist_maternidade?.secoes || [",
    content
)

# Also fix the vertical text "CHECKLIST MATERNIDADE" in the PDF since it's hardcoded there
# I did this for the JSX but forgot the PDF version of the text
content = re.sub(
    r">CHECKLIST MATERNIDADE<",
    r">${dictionary?.checklist_maternidade?.titulo || 'CHECKLIST MATERNIDADE'}<",
    content
)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translated checklists.")
