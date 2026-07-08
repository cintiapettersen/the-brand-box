import re

path = 'src/app/[lang]/sucesso/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update TomDeVozQuiz definition
content = content.replace(
    "function TomDeVozQuiz({ accentColor, marca, tagline, estiloNome, onTomDeVozGerado }) {",
    "function TomDeVozQuiz({ accentColor, marca, tagline, estiloNome, atuacao, contextoExtra, onTomDeVozGerado }) {"
)

# Update the fetch call inside TomDeVozQuiz
old_fetch = """      const res = await fetch('/api/generate-tomdevoz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, respostas: respostasArr, lang }),
      });"""
new_fetch = """      const res = await fetch('/api/generate-tomdevoz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, tagline, estiloNome, atuacao, contextoExtra, respostas: respostasArr, lang }),
      });"""
content = content.replace(old_fetch, new_fetch)

# Update where TomDeVozQuiz is called inside TomDeVozStep
old_quiz_call = """return <TomDeVozQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} onTomDeVozGerado={handleTomDeVozGerado} />;"""
new_quiz_call = """return <TomDeVozQuiz accentColor={accentColor} marca={marca} tagline={tagline} estiloNome={estiloNome} atuacao={brand.formData?.atuacao === 'Outra' ? brand.formData?.atuacaoOutra : brand.formData?.atuacao} contextoExtra={brand.formData?.contextoExtra} onTomDeVozGerado={handleTomDeVozGerado} />;"""
content = content.replace(old_quiz_call, new_quiz_call)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("sucesso/page.js updated successfully for TomDeVozQuiz!")
