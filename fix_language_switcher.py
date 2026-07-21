import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{/* <LanguageSwitcher style={{ position: 'absolute', top: '12px', right: '20px' }} /> */}",
    "{devMode && <LanguageSwitcher style={{ position: 'absolute', top: '12px', right: '20px' }} />}"
)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace(
    "{/* <LanguageSwitcher /> */}",
    "{devMode && <LanguageSwitcher />}"
)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Restored LanguageSwitcher for devMode only")
