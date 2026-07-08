import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Step 2 Hint block
step_2_old_hint = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>
              <div style={{ background: '#fff8f0', border: '1px solid #f5d9b8', borderRadius: '12px', padding: '12px 14px', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', color: '#7a4a1e', lineHeight: 1.5 }}>
                  💡 {dictionary?.onboarding?.step_2_hint || 'Seu nome ajuda a personalizar a experiência.'}
                </p>
              </div>"""

step_2_new_hint = """<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>
                <div className="hint-tooltip">
                  💡
                  <span className="tooltiptext">{dictionary?.onboarding?.step_2_hint || 'Seu nome de contato, como você se chama, e não a sua marca...'}</span>
                </div>
              </div>"""

content = content.replace(step_2_old_hint, step_2_new_hint)

# Replace Step 3 Hint block
step_3_old_hint = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px 14px', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                  💡 {dictionary?.onboarding?.step_3_hint || 'Grandes marcas geralmente começam com um nome simples. 🥹'}
                </p>
              </div>"""

step_3_new_hint = """<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>
                <div className="hint-tooltip">
                  💡
                  <span className="tooltiptext">{dictionary?.onboarding?.step_3_hint || 'Grandes marcas geralmente começam com um nome simples. 🥹'}</span>
                </div>
              </div>"""

content = content.replace(step_3_old_hint, step_3_new_hint)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("page.js updated with tooltips!")
