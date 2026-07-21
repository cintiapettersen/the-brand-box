import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Change default state
content = content.replace(
    "const [customStep, setCustomStep] = useState('tipo');",
    "const [customStep, setCustomStep] = useState('paleta');"
)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed default customStep")
