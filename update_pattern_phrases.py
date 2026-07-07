import json

with open('src/dictionaries/pt.json', 'r') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r') as f:
    en_data = json.load(f)

if 'postmatch' not in pt_data:
    pt_data['postmatch'] = {}
if 'postmatch' not in en_data:
    en_data['postmatch'] = {}

pt_data['postmatch']['pattern_phrases'] = [
    "A <strong>The Brand Box</strong> está criando<br/>padrões únicos com as cores da sua paleta 🎨",
    "Desenhando as formas que combinam<br/>com o seu estilo ✨",
    "Buscando as melhores proporções<br/>para a sua estampa 🌟",
    "Ajustando os contrastes para<br/>um resultado perfeito 🖌️",
    "Preparando a versão final<br/>em alta resolução 🎀"
]

en_data['postmatch']['pattern_phrases'] = [
    "<strong>The Brand Box</strong> is creating<br/>unique patterns with your palette colors 🎨",
    "Drawing shapes that match<br/>your style ✨",
    "Finding the best proportions<br/>for your pattern 🌟",
    "Adjusting the contrasts for<br/>a perfect result 🖌️",
    "Preparing the final version<br/>in high resolution 🎀"
]

with open('src/dictionaries/pt.json', 'w') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/en.json', 'w') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
