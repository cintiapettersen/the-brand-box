import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_step_5_2_header = """<h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_2_title || 'O que você quer que as pessoas pensem quando virem sua marca pela primeira vez? ❤️'}</h2>"""
new_step_5_2_header = """<h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_2_title || 'O que você quer que as pessoas pensem quando virem sua marca pela primeira vez? ❤️'}</h2>"""
content = content.replace(old_step_5_2_header, new_step_5_2_header)

old_step_5_2_grid = """<div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>"""
new_step_5_2_grid = """<div style={{ width: '100%', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>"""
content = content.replace(old_step_5_2_grid, new_step_5_2_grid)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Step 5.2 updated successfully!")
