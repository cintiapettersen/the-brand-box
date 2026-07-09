import json
import re

# 1. Update pt.json
path_pt = 'src/dictionaries/pt.json'
with open(path_pt, 'r', encoding='utf-8') as f:
    data_pt = json.load(f)

if 'onboarding' in data_pt:
    data_pt['onboarding']['step_6_title'] = "Como as pessoas devem se sentir após interagir com a sua marca?"
    if 'sensacoes_options' in data_pt['onboarding']:
        data_pt['onboarding']['sensacoes_options']['Inovação e modernidade'] = "Inovação e modernidade"

with open(path_pt, 'w', encoding='utf-8') as f:
    json.dump(data_pt, f, ensure_ascii=False, indent=2)

# 2. Update en.json
path_en = 'src/dictionaries/en.json'
with open(path_en, 'r', encoding='utf-8') as f:
    data_en = json.load(f)

if 'onboarding' in data_en:
    data_en['onboarding']['step_6_title'] = "How should people feel after interacting with your brand?"
    if 'sensacoes_options' in data_en['onboarding']:
        data_en['onboarding']['sensacoes_options']['Inovação e modernidade'] = "Innovation and modernity"

with open(path_en, 'w', encoding='utf-8') as f:
    json.dump(data_en, f, ensure_ascii=False, indent=2)

# 3. Update page.js
path_page = 'src/app/[lang]/page.js'
with open(path_page, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Inovação e modernidade to sensacoes
old_sensacoes = """  const sensacoes = [
    "Acolhimento e cuidado",
    "Alegria e leveza",
    "Confiança e profissionalismo",
    "Sofisticação e elegância",
    "Criatividade e originalidade",
    "Encantamento e delicadeza",
    "Natureza e tranquilidade"
  ];"""

new_sensacoes = """  const sensacoes = [
    "Acolhimento e cuidado",
    "Alegria e leveza",
    "Confiança e profissionalismo",
    "Sofisticação e elegância",
    "Criatividade e originalidade",
    "Encantamento e delicadeza",
    "Natureza e tranquilidade",
    "Inovação e modernidade"
  ];"""
content = content.replace(old_sensacoes, new_sensacoes)

# Remove heart from title fallback
old_title = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_title || 'Como as pessoas devem se sentir após interagir com a sua marca? ❤️'}</h2>"""
new_title = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_title || 'Como as pessoas devem se sentir após interagir com a sua marca?'}</h2>"""
content = content.replace(old_title, new_title)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content)

print("Step 6 updated successfully!")
