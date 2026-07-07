import re

with open('src/app/[lang]/page.js', 'r') as f:
    content = f.read()

replacements = [
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>Antes de começarmos...</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>E a sua marca\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>Qual é a sua área de atuação\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_4_title || 'Qual é a sua área de atuação?'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>Para quem você atende\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_title || 'Para quem você atende?'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>Qual a energia da sua marca\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_5_title || 'Qual a energia da sua marca?'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>Que sensações você quer transmitir\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_title || 'Que sensações você quer transmitir?'}</h2>"),
    (r"<h2 style=\{\{ fontSize: '2rem', marginBottom: '0.5rem' \}\}>O que não pode faltar no layout\?</h2>", r"<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_title || 'O que não pode faltar no layout?'}</h2>")
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/app/[lang]/page.js', 'w') as f:
    f.write(content)

