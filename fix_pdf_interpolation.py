import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_pdf_template = False
for i, line in enumerate(lines):
    if "const frenteR = `" in line or "const versoR = `" in line or "const html = `<!DOCTYPE html>" in line:
        in_pdf_template = True
    
    if in_pdf_template:
        lines[i] = lines[i].replace(">{dictionary", ">${dictionary")
    
    if "`;" in line and in_pdf_template:
        in_pdf_template = False

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed PDF interpolation!")
