import json
import re
import os

# 1. Update src/app/[lang]/page.js
with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    page_content = f.read()
page_content = page_content.replace('"Loja de Roupas / Moda Infantil"', '"Loja de Roupas / Moda"')
with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(page_content)

# 2. Update Dictionaries
for dict_path, en_text, pt_text in [
    ('src/dictionaries/en.json', 'Clothing Store / Fashion', 'Loja de Roupas / Moda'),
    ('src/dictionaries/pt.json', 'Loja de Roupas / Moda', 'Loja de Roupas / Moda')
]:
    with open(dict_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('"Loja de Roupas / Moda Infantil": "Clothing Store / Kids Fashion"', f'"{pt_text}": "{en_text}"')
    content = content.replace('"Loja de Roupas / Moda Infantil": "Loja de Roupas / Moda Infantil"', f'"{pt_text}": "{pt_text}"')
    with open(dict_path, 'w', encoding='utf-8') as f:
        f.write(content)

PRIORITY_RULE_GEMINI = """
    REGRA DE OURO 5 (Prioridade de Público): Se houver qualquer contradição entre a área de atuação (ex: "Loja de roupas infantil") e o público selecionado (ex: "Adultos"), considere SEMPRE o público selecionado como a verdade absoluta para a faixa etária. A área de atuação descreve apenas a categoria do negócio e não deve determinar a idade do público.
"""

PRIORITY_RULE_GPT = " REGRA DE PRIORIDADE: O campo de público (briefing.publico) é a verdade absoluta sobre a faixa etária. Se a área de atuação for Moda/Roupa e o público for Adulto, não escreva absolutamente nada sobre crianças, moda infantil ou infância. "

# 3. Update Matchmaker Prompt
with open('src/app/api/matchmaker/route.js', 'r', encoding='utf-8') as f:
    matchmaker_content = f.read()
rule_4 = "REGRA DE OURO 4 (Jardim Encantado e Público Adulto): É ESTRITAMENTE PROIBIDO recomendar o \"Jardim Encantado\" (ID 2) se o \"Público Alvo\" for exclusivamente de adultos (ex: \"Jovens e Adultos (18-60 anos)\"). O Jardim Encantado SÓ PODE ser sugerido se o público alvo incluir crianças, bebês ou adolescentes até 18 anos."
if "REGRA DE OURO 5" not in matchmaker_content:
    matchmaker_content = matchmaker_content.replace(rule_4, rule_4 + PRIORITY_RULE_GEMINI)
with open('src/app/api/matchmaker/route.js', 'w', encoding='utf-8') as f:
    f.write(matchmaker_content)

# 4. Update Creative Director Prompt
with open('src/app/api/creative-director/route.js', 'r', encoding='utf-8') as f:
    cd_content = f.read()
old_cd = "Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing."
if PRIORITY_RULE_GPT not in cd_content:
    cd_content = cd_content.replace(old_cd, old_cd + PRIORITY_RULE_GPT)
with open('src/app/api/creative-director/route.js', 'w', encoding='utf-8') as f:
    f.write(cd_content)

# 5. Update Taglines Prompt
with open('src/app/api/creative-director/taglines/route.js', 'r', encoding='utf-8') as f:
    taglines_content = f.read()
old_taglines = "nunca trate o nome da direção criativa como nome de marca."
if PRIORITY_RULE_GPT not in taglines_content:
    taglines_content = taglines_content.replace(old_taglines, old_taglines + PRIORITY_RULE_GPT)
with open('src/app/api/creative-director/taglines/route.js', 'w', encoding='utf-8') as f:
    f.write(taglines_content)

# 6. Update Refine Prompt
with open('src/app/api/creative-director/refine/route.js', 'r', encoding='utf-8') as f:
    refine_content = f.read()
old_refine = "nunca deve ser tratada como marca."
if PRIORITY_RULE_GPT not in refine_content:
    refine_content = refine_content.replace(old_refine, old_refine + PRIORITY_RULE_GPT)
with open('src/app/api/creative-director/refine/route.js', 'w', encoding='utf-8') as f:
    f.write(refine_content)

# 7. Update Manifesto Prompt
if os.path.exists('src/app/api/generate-manifesto/route.js'):
    with open('src/app/api/generate-manifesto/route.js', 'r', encoding='utf-8') as f:
        manifesto_content = f.read()
    old_manifesto = "Gere um manifesto poético e inspirador (max 4 parágrafos curtos) para a marca."
    if PRIORITY_RULE_GPT not in manifesto_content:
        manifesto_content = manifesto_content.replace(old_manifesto, old_manifesto + PRIORITY_RULE_GPT)
    with open('src/app/api/generate-manifesto/route.js', 'w', encoding='utf-8') as f:
        f.write(manifesto_content)

# 8. Update Tom de Voz Prompt
if os.path.exists('src/app/api/generate-tomdevoz/route.js'):
    with open('src/app/api/generate-tomdevoz/route.js', 'r', encoding='utf-8') as f:
        tomdevoz_content = f.read()
    old_tomdevoz = "O tom de voz deve refletir exatamente os objetivos emocionais, a área de atuação e a personalidade escolhida."
    if PRIORITY_RULE_GPT not in tomdevoz_content:
        tomdevoz_content = tomdevoz_content.replace(old_tomdevoz, old_tomdevoz + PRIORITY_RULE_GPT)
    with open('src/app/api/generate-tomdevoz/route.js', 'w', encoding='utf-8') as f:
        f.write(tomdevoz_content)

print("Updated all files with the priority rule.")
