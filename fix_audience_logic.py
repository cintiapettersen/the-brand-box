import json
import re

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

# 3. Update Matchmaker Prompt
with open('src/app/api/matchmaker/route.js', 'r', encoding='utf-8') as f:
    matchmaker_content = f.read()

rule_4 = "REGRA DE OURO 4 (Jardim Encantado e Público Adulto): É ESTRITAMENTE PROIBIDO recomendar o \"Jardim Encantado\" (ID 2) se o \"Público Alvo\" for exclusivamente de adultos (ex: \"Jovens e Adultos (18-60 anos)\"). O Jardim Encantado SÓ PODE ser sugerido se o público alvo incluir crianças, bebês ou adolescentes até 18 anos."

new_rule = """
    REGRA DE OURO 5 (Prioridade de Público): Se houver qualquer contradição entre a área de atuação (ex: "Loja de roupas infantil") e o público selecionado (ex: "Adultos"), considere SEMPRE o público selecionado como a verdade absoluta para a faixa etária. A área de atuação descreve apenas a categoria do negócio e não deve determinar a idade do público.
"""

if "REGRA DE OURO 5" not in matchmaker_content:
    matchmaker_content = matchmaker_content.replace(rule_4, rule_4 + new_rule)

with open('src/app/api/matchmaker/route.js', 'w', encoding='utf-8') as f:
    f.write(matchmaker_content)


# 4. Update Creative Director Prompt
with open('src/app/api/creative-director/route.js', 'r', encoding='utf-8') as f:
    cd_content = f.read()

old_cd_prompt = "Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing. O campo de nome pessoal/de contato da usuária foi removido do briefing e nunca deve ser tratado como nome público da marca."

new_cd_prompt = "Não invente fatos, especialidades, públicos ou promessas que não estejam no briefing. REGRA DE PRIORIDADE: Se houver divergência entre a área de atuação e a faixa etária do público (ex: 'Moda' vs 'Adultos'), o campo de público (briefing.publico) é a verdade absoluta. Não escreva frases referenciando crianças ou moda infantil se o público foi marcado como adulto. O campo de nome pessoal/de contato da usuária foi removido do briefing e nunca deve ser tratado como nome público da marca."

if "REGRA DE PRIORIDADE" not in cd_content:
    cd_content = cd_content.replace(old_cd_prompt, new_cd_prompt)

with open('src/app/api/creative-director/route.js', 'w', encoding='utf-8') as f:
    f.write(cd_content)

print("Updated all files successfully.")
