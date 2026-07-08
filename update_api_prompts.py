import re

# Update Manifesto API
path_man = 'src/app/api/generate-manifesto/route.js'
with open(path_man, 'r', encoding='utf-8') as f:
    content_man = f.read()

content_man = content_man.replace(
    "const { marca, tagline, estiloNome, respostas, lang = 'pt-BR' } = await req.json();",
    "const { marca, tagline, estiloNome, atuacao, contextoExtra, respostas, lang = 'pt-BR' } = await req.json();"
)

old_prompt_man = """Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\\n')}"""

new_prompt_man = """Contexto da marca:
${atuacao ? `- Área de atuação: ${atuacao}` : ''}
${contextoExtra ? `- Informações extras da fundadora: "${contextoExtra}"` : ''}

Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\\n')}"""
content_man = content_man.replace(old_prompt_man, new_prompt_man)

with open(path_man, 'w', encoding='utf-8') as f:
    f.write(content_man)


# Update Tom de Voz API
path_tom = 'src/app/api/generate-tomdevoz/route.js'
with open(path_tom, 'r', encoding='utf-8') as f:
    content_tom = f.read()

content_tom = content_tom.replace(
    "const { marca, tagline, estiloNome, respostas, lang = 'pt-BR' } = await req.json();",
    "const { marca, tagline, estiloNome, atuacao, contextoExtra, respostas, lang = 'pt-BR' } = await req.json();"
)

old_prompt_tom = """Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\\n')}"""

new_prompt_tom = """Contexto da marca:
${atuacao ? `- Área de atuação: ${atuacao}` : ''}
${contextoExtra ? `- Informações extras da fundadora: "${contextoExtra}"` : ''}

Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\\n')}"""
content_tom = content_tom.replace(old_prompt_tom, new_prompt_tom)

with open(path_tom, 'w', encoding='utf-8') as f:
    f.write(content_tom)

print("API prompts updated successfully!")
