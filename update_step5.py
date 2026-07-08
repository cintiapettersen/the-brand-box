import json
import re

# 1. Update Dictionaries
def update_dict(path, is_en):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'onboarding' in data:
        if is_en:
            data['onboarding']['step_5_subtitle'] = "Your audience influences the style, colors and visual language we'll suggest."
            data['onboarding']['step_5_hint'] = "Think about who you're trying to connect with, not necessarily who buys from you."
        else:
            data['onboarding']['step_5_subtitle'] = "Seu público influencia o estilo, cores e linguagem visual que vamos sugerir."
            data['onboarding']['step_5_hint'] = "Pense com quem você quer se conectar, não necessariamente quem compra de você."

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_dict('src/dictionaries/pt.json', False)
update_dict('src/dictionaries/en.json', True)

# 2. Update page.js
path_page = 'src/app/[lang]/page.js'
with open(path_page, 'r', encoding='utf-8') as f:
    content = f.read()

old_step_5_header = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_title || 'Para quem você atende?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_subtitle || 'Qual o seu público principal?'}</p>"""

new_step_5_header = """<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dictionary?.onboarding?.step_5_title || 'Para quem você atende?'}</h2>
                <div className="hint-tooltip">
                  💡
                  <span className="tooltiptext">{dictionary?.onboarding?.step_5_hint || 'Pense com quem você quer se conectar, não necessariamente quem compra de você.'}</span>
                </div>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_subtitle || 'Seu público influencia o estilo, cores e linguagem visual que vamos sugerir.'}</p>"""

content = content.replace(old_step_5_header, new_step_5_header)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content)

print("Step 5 updated successfully!")
