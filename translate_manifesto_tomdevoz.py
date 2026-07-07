import json

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

pt_data['manifesto'] = {
    "desc_title": "O Manifesto é a alma da sua marca em palavras.",
    "desc_text": "Responda 5 perguntas e a IA cria um texto único para ",
    "btn_create": "✨ Criar Manifesto com IA",
    "btn_creating": "✨ Criando manifesto...",
    "btn_generate": "✨ Gerar Manifesto",
    "label": "Manifesto",
    "btn_download": "⬇ Baixar PNG",
    "btn_copy": "📋 Copiar",
    "btn_copied": "✓ Copiado!",
    "btn_edit": "✏️ Editar",
    "btn_done": "✓ Feito",
    "btn_redo": "🔄 Refazer",
    "restante": "restante",
    "limite_atingido": "Limite de gerações atingido"
}

en_data['manifesto'] = {
    "desc_title": "The Manifesto is the soul of your brand in words.",
    "desc_text": "Answer 5 questions and the AI will create a unique text for ",
    "btn_create": "✨ Create Manifesto with AI",
    "btn_creating": "✨ Creating manifesto...",
    "btn_generate": "✨ Generate Manifesto",
    "label": "Manifesto",
    "btn_download": "⬇ Download PNG",
    "btn_copy": "📋 Copy",
    "btn_copied": "✓ Copied!",
    "btn_edit": "✏️ Edit",
    "btn_done": "✓ Done",
    "btn_redo": "🔄 Redo",
    "restante": "left",
    "limite_atingido": "Generation limit reached"
}

pt_data['tom_de_voz'] = {
    "desc_title": "O Tom de Voz dita como sua marca conversa com o mundo.",
    "desc_text": "Responda 4 perguntas e a IA define o estilo da sua marca.",
    "btn_create": "✨ Criar Tom de Voz com IA",
    "btn_creating": "✨ Criando tom de voz...",
    "btn_generate": "✨ Gerar Tom de Voz",
    "label": "Tom de Voz",
    "palavras_chave": "Palavras-chave",
    "orientacoes": "Orientações de Comunicação"
}

en_data['tom_de_voz'] = {
    "desc_title": "Tone of Voice dictates how your brand talks to the world.",
    "desc_text": "Answer 4 questions and the AI will define your brand's style.",
    "btn_create": "✨ Create Tone of Voice with AI",
    "btn_creating": "✨ Creating tone of voice...",
    "btn_generate": "✨ Generate Tone of Voice",
    "label": "Tone of Voice",
    "palavras_chave": "Keywords",
    "orientacoes": "Communication Guidelines"
}

pt_data['quiz'] = {
    "de": "de",
    "voltar": "← Voltar",
    "proxima": "Próxima →",
    "erro_gerar": "Não conseguimos gerar agora. Tente novamente.",
    "erro_conexao": "Erro de conexão. Tente novamente."
}

en_data['quiz'] = {
    "de": "of",
    "voltar": "← Back",
    "proxima": "Next →",
    "erro_gerar": "We couldn't generate it right now. Try again.",
    "erro_conexao": "Connection error. Try again."
}

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

print("Manifesto/TomDeVoz dictionary updated.")
