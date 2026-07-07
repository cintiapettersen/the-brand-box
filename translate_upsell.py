import json

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

# Upsell texts
upsell_pt = {
    "tag": "✨ Fechamento Premium & Arte Sob Medida",
    "titulo": "Deseja um toque extra de exclusividade autoral?",
    "desc": "Se você ama aquela sensação de marca única, com desenhos e ilustrações autorais que conectam toda a sua identidade, criamos o fechamento sob medida.",
    "opc1_titulo": "Logotipo Ilustrado Exclusivo",
    "opc1_sub": "Arte Autoral Sob Medida",
    "opc1_desc": "Nossos planos automáticos criam lindas logos tipográficas. Com este serviço premium, nossa diretora de arte desenhará um <strong>símbolo ou ilustração autoral exclusiva</strong> para ser integrado à sua marca.",
    "opc1_tags": ["100% autoral", "Arquivo vetorial editável", "Ajustes finos com designer"],
    "opc2_titulo": "Elementos Ilustrativos Unificadores",
    "opc2_sub": "Conexão de Papelaria Premium",
    "opc2_desc": "Criação de <strong>desenhos exclusivos para os rodapés e detalhes dos seus impressos</strong>. Ideal para criar uma experiência encantadora e um padrão visual acolhedor em todas as peças de papelaria.",
    "opc2_tags": ["Rodapés exclusivos", "Estilo unificado autoral", "Pronto para impressão"],
    "nota": "💡 <strong>Como funciona:</strong> Ao contratar este serviço sob medida, você faz um briefing direto com o nosso time criativo e nós desenvolvemos as artes personalizadas e as inserimos diretamente nos seus gabaritos do The Brand Box.",
    "wpp_btn": "💬 Falar com a Diretora de Arte no WhatsApp",
    "wpp_desc": "Disponibilidade imediata de atendimento",
    "wpp_msg": "Olá! Finalizei meu projeto no The Brand Box e amei! Gostaria de saber mais sobre o serviço de Desenhos de Rodapé e Logotipo Ilustrado para a minha marca "
}

upsell_en = {
    "tag": "✨ Premium Closing & Custom Artwork",
    "titulo": "Want an extra touch of exclusivity?",
    "desc": "If you love that feeling of a unique brand, with original drawings and illustrations that connect your entire identity, we create custom closing.",
    "opc1_titulo": "Exclusive Illustrated Logo",
    "opc1_sub": "Custom Original Art",
    "opc1_desc": "Our automatic plans create beautiful typographic logos. With this premium service, our art director will design an <strong>exclusive symbol or original illustration</strong> to be integrated into your brand.",
    "opc1_tags": ["100% original", "Editable vector file", "Fine adjustments with designer"],
    "opc2_titulo": "Unifying Illustrative Elements",
    "opc2_sub": "Premium Stationery Connection",
    "opc2_desc": "Creation of <strong>exclusive drawings for footers and details of your printed materials</strong>. Ideal to create a charming experience and a welcoming visual pattern in all stationery pieces.",
    "opc2_tags": ["Exclusive footers", "Original unified style", "Ready to print"],
    "nota": "💡 <strong>How it works:</strong> By hiring this custom service, you brief directly with our creative team and we develop the personalized arts and insert them directly into your The Brand Box templates.",
    "wpp_btn": "💬 Talk to the Art Director on WhatsApp",
    "wpp_desc": "Immediate service availability",
    "wpp_msg": "Hello! I finished my project on The Brand Box and I loved it! I would like to know more about the Footer Drawings and Illustrated Logo service for my brand "
}

pt_data['upsell'] = upsell_pt
en_data['upsell'] = upsell_en

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

print("Upsell dictionary updated.")
