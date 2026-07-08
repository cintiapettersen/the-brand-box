import re

path = 'src/app/[lang]/sucesso/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update ManifestoQuiz definition
content = content.replace(
    "function ManifestoQuiz({ accentColor, marca, tagline, estiloNome, isSaude, onManifestoGerado }) {",
    "function ManifestoQuiz({ accentColor, marca, tagline, estiloNome, atuacao, contextoExtra, isSaude, onManifestoGerado }) {"
)

# Update the fetch call inside ManifestoQuiz
old_fetch = """      const res = await fetch('/api/generate-manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, respostas: respostasArr, lang }),
      });"""
new_fetch = """      const res = await fetch('/api/generate-manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, atuacao, contextoExtra, respostas: respostasArr, lang }),
      });"""
content = content.replace(old_fetch, new_fetch)

# Update where ManifestoQuiz is called inside ManifestoStep
old_quiz_call = """return <ManifestoQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} isSaude={isSaude} onManifestoGerado={handleManifestoGerado} />;"""
new_quiz_call = """return <ManifestoQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} atuacao={brand.formData?.atuacao === 'Outra' ? brand.formData?.atuacaoOutra : brand.formData?.atuacao} contextoExtra={brand.formData?.contextoExtra} isSaude={isSaude} onManifestoGerado={handleManifestoGerado} />;"""
content = content.replace(old_quiz_call, new_quiz_call)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("sucesso/page.js updated successfully!")
