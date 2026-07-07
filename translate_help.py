import json

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

# Fix Pezinho in EN
if 'orientacoes_rn' in en_data and 'obs_3' in en_data['orientacoes_rn']:
    en_data['orientacoes_rn']['obs_3'] = "Newborn screening between 3rd & 7th day."

# Add Help section in PT
pt_data['help'] = {
    "busca_titulo": "🤖 Busca Inteligente",
    "busca_desc": "Digite sua dúvida técnica abaixo para receber uma orientação instantânea sobre a plataforma.",
    "busca_placeholder": "Ex: Como imprimir? Como exportar em PNG?",
    "busca_btn": "Perguntar",
    "busca_resposta": "🔍 RESPOSTA PARA:",
    "busca_fallback_topico": "ASSISTENTE DIGITAL",
    "busca_fallback_texto": "Desculpe, não encontrei uma resposta exata para a sua dúvida. Tente pesquisar por palavras como 'impressão', 'exportação', 'cores', 'impressos' ou consulte as perguntas frequentes abaixo!",
    "faq_titulo": "📋 Perguntas Frequentes",
    "concierge_titulo": "Quer ir além da experiência guiada?",
    "concierge_desc": "Também oferecemos ajustes personalizados, refinamentos manuais e direção criativa exclusiva para marcas que desejam um acompanhamento mais próximo.",
    "sugestoes_titulo": "💡 Sugestões & Melhorias",
    "sugestoes_desc": "Sentiu falta de algum item de papelaria? Tem ideias para melhorar a plataforma? Mande uma mensagem pra gente! Lemos todas as sugestões para tornar a The Brand Box cada vez melhor.",
    "sugestoes_email": "brandbox@sonhodepapel.co",
    "kb": {
      "impressao": "Para imprimir suas estampas e impressos com máxima qualidade, recomendamos utilizar os arquivos em PDF Vetorial de Alta Resolução disponibilizados na aba 'Os Impressos'. Se for imprimir em gráfica (como a Printi), selecione a opção 'Enviar minha arte final'. Se for imprimir em casa, utilize papel couchê ou offset de alta gramatura (mínimo 180g) na sua impressora caseira. Mas lembre-se: dobras complexas e formatos especiais exigem uma gráfica profissional!",
      "exportacao": "Você pode exportar sua Logo e Submarca em formato PNG com fundo transparente (perfeito para posts de Instagram, marca d'água ou assinaturas) ou em formato PNG com fundo colorido diretamente na aba 'Logo'. Já os impressos e guias são exportados em PDF padrão gráfica, com cores em alta definição e prontos para impressão!",
      "cores": "As cores da sua paleta são cuidadosamente geradas com base na essência da sua marca. Na aba 'Cores', você pode alterar a ordem de prioridade das cores (arrastando e soltando os blocos) para destacar qual cor deve ser mais dominante nas suas artes, assinaturas e materiais promocionais!",
      "tamanhos": "Os gabaritos gerados na aba 'Os Impressos' seguem formatos oficiais de mercado. No entanto, para ajustar a escala da logo (já que fontes diferentes têm larguras e comportamentos distintos nas peças), disponibilizamos o controle deslizante de 'Escala da Logo' na aba 'Os Impressos'. Esse ajuste ajuda você a equilibrar perfeitamente a logo no espaço reservado, e sim, o PDF gerado atualiza em tempo real com o tamanho escolhido!",
      "uso da marca": "Seu Guia de Marca (disponível para download na aba 'Guia') descreve exatamente as regras de ouro para o uso correto da sua nova identidade visual: como combinar as fontes, qual paleta de cores usar in fundos claros e escuros, e qual a aplicação correta da logo e do selo em diferentes superfícies!",
      "papelaria": "A aba 'Os Impressos' é o seu hub completo de produção! Ela gera gabaritos perfeitos de sacolas, receitas de alta, cartões de agradecimento, tags de sacola, etiquetas de correios e gráficos de crescimento. Todos os arquivos são gerados dinamicamente em PDF vetorial de altíssima definição!",
      "limites do sistema": "Para garantir o equilíbrio técnico e a estabilidade da sua Brand Box, as gerações de estampa possuem um limite padrão de 3 tentativas na galeria. Além disso, as alterações de nome da marca são limitadas a 1 alteração por licença, o que previne abusos e assegura a consistência da sua nova identidade visual!"
    },
    "faqs": [
      {
        "category": "🎨 Personalização",
        "items": [
          { "q": "Posso mudar minhas cores?", "a": "As cores são geradas com base no seu diagnóstico. Na aba 'Cores' você pode reorganizar a prioridade das cores (arrastando e soltando os blocos) para destacar suas cores favoritas no design." },
          { "q": "Quantas estampas posso gerar?", "a": "Cada projeto permite até 3 novas gerações de estampas na sua galeria para garantir que você tenha opções exclusivas e perfeitas." },
          { "q": "Posso trocar minha logo de lugar?", "a": "Para manter o equilíbrio visual e a consistência da identidade, as posições dos elementos seguem uma estrutura profissional fixa, mas você pode escolher entre diferentes layouts na aba 'Logo'." },
          { "q": "Como deixar minha logo mais equilibrada?", "a": "Utilize o controle 'Altura da Logo' para ajustar o espaçamento entre a marca e o slogan, e selecione layouts horizontais, verticais ou empilhados que combinem melhor com o seu nome!" },
          { "q": "Como escolher o melhor tamanho?", "a": "Os gabaritos gerados em PDF na aba 'Os Impressos' já estão perfeitamente dimensionados nos formatos padrão de mercado (são gabaritos oficiais prontos). No entanto, para ajustar a escala da logo nas peças (já que fontes diferentes têm comportamentos e larguras distintas), disponibilizamos o controle deslizante de 'Escala da Logo' na aba 'Os Impressos'. Esse ajuste ajuda você a equilibrar perfeitamente a logo no espaço reservado, e sim, o PDF gerado é atualizado em tempo real com o tamanho escolhido!" },
          { "q": "Posso ter mais opções de fonte?", "a": "Nosso algoritmo inteligente selecionou um grupo exclusivo de 6 fontes premium que possuem afinidade perfeita com a essência e o estilo identificados para a sua marca. Para manter a coerência e harmonia da sua identidade visual, a seleção é limitada a essas 6 opções curadas por projeto." },
          { "q": "Posso enviar minha própria logo?", "a": "Sim! Se você já tiver uma imagem de logo ou um símbolo próprio, pode fazer o upload dela diretamente no topo da aba 'Logo'. O sistema aplicará a sua logo personalizada em todos os materiais impressos, cartão digital e posts de forma automática." }
        ]
      },
      {
        "category": "🖨️ Impressão",
        "items": [
          { "q": "Posso imprimir em casa?", "a": "Você pode imprimir itens planos comuns em formato A4 (como receitas, folhas de pedido ou papel timbrado) diretamente na sua impressora doméstica. No entanto, itens com dobras ou formatos mais complexos (como sacolas, pouches, papel de seda gigante ou tags de formato especial) exigem acabamentos que as impressoras caseiras não comportam. Para estes, a recomendação absoluta é o envio para uma gráfica profissional." },
          { "q": "O que fazer na hora de imprimir em casa?", "a": "Configuração crucial: sempre configure a sua impressora para 'Tamanho Real / Escala 100%'. Nunca selecione 'Ajustar à página' ou 'Reduzir para caber', pois isso desalinhará os gabaritos e as marcas de corte! E lembre-se de configurar a qualidade de impressão para 'Alta' no papel adequado para remover imperfeições e garantir fidelidade de cor." },
          { "q": "Como enviar para uma gráfica?", "a": "Baixe o PDF em alta resolução da aba 'Os Impressos' e envie diretamente para a gráfica de sua preferência (como a Printi). Os arquivos já estão fechados no padrão profissional de impressão. Dica importante: o preview na tela é apenas uma simulação visual aproximada. O arquivo PDF baixado é o documento oficial de alta definição 100% fiel e exato para impressão. Sempre abra e revise o arquivo PDF baixado no seu computador antes de enviá-lo para a gráfica para garantir que tudo está perfeito!" },
          { "q": "Qual formato usar?", "a": "Para visualização digital e redes sociais, exporte em PNG (fundo transparente). Para impressão profissional de sacolas e materiais impressos, sempre use o PDF disponibilizado na aba correspondente." },
          { "q": "Como saber qual papel devo usar para imprimir?", "a": "Você pode consultar a gráfica de sua preferência ou verificar diretamente os detalhes recomendados na plataforma! Ao clicar no botão de baixar o PDF de qualquer item na aba 'Os Impressos', o sistema exibe uma ficha técnica completa com o tamanho exato da peça, a gramatura e tipo de papel indicados, e até o custo médio estimado de produção desse item no mercado." },
          { "q": "Como evitar cortes na estampa?", "a": "Se a repetição da sua estampa apresentar marcas visíveis nas bordas ou cortes secos, acesse a aba 'Estampa' e clique no botão mágico 'Suavizar cortes'. Nosso algoritmo mesclará as emendas automaticamente para tornar a estampa 100% contínua! Se necessário, o profissional da sua gráfica parceira também poderá dar uma ajuda ajustando a escala de repetição para encaixe perfeito nas bobinas de papel ou sacolas." }
        ]
      },
      {
        "category": "💾 Projeto",
        "items": [
          { "q": "Como acessar meu link novamente?", "a": "O link de acesso à sua Brand Box foi enviado para o seu e-mail cadastrado logo após a confirmação do pagamento. Você também pode salvá-lo nos seus favoritos do navegador." },
          { "q": "Posso mudar o nome do projeto?", "a": "Sim! Para evitar abusos do sistema, permitimos realizar 1 alteração de nome da marca na aba 'Logo' (completando o total de 2 nomes válidos: o original e a correção)." },
          { "q": "Meu link expira?", "a": "Não! O seu projeto e todos os seus downloads ficam disponíveis para acesso sempre que você precisar, sem data de expiração." },
          { "q": "Posso acessar pelo celular?", "a": "Sim! A Brand Box é totalmente responsiva. Você pode visualizar sua identidade, baixar as logos diretamente no rolo de câmera e revisar o seu guia de marca do seu smartphone." }
        ]
      },
      {
        "category": "✨ Experiência",
        "items": [
          { "q": "Como descobrir o melhor estilo para minha marca?", "a": "O estilo ideal é o que conecta a essência do seu negócio ao coração do seu cliente. Nosso algoritmo inteligente cruzou suas respostas na pesquisa para encontrar o encaixe perfeito entre as 6 direções estéticas premium." },
          { "q": "O que é o manifesto da marca?", "a": "É a voz conceitual da sua marca escrita em prosa poética e inspiracional. Ele serve para alinhar o seu propósito e emocionar o seu cliente na sua comunicação oficial." },
          { "q": "Como definir meu tom de voz?", "a": "O tom de voz (aba 'Tom de Voz') define as diretrizes de escrita: as palavras a usar, o que evitar, e a atitude da sua marca ao falar com o público no dia a dia." }
        ]
      }
    ]
}

# Add Help section in EN
en_data['help'] = {
    "busca_titulo": "🤖 Smart Search",
    "busca_desc": "Type your technical question below for instant guidance about the platform.",
    "busca_placeholder": "Ex: How to print? How to export as PNG?",
    "busca_btn": "Ask",
    "busca_resposta": "🔍 ANSWER FOR:",
    "busca_fallback_topico": "DIGITAL ASSISTANT",
    "busca_fallback_texto": "Sorry, I couldn't find an exact answer for your question. Try searching for words like 'printing', 'export', 'colors', 'stationery' or check the frequently asked questions below!",
    "faq_titulo": "📋 Frequently Asked Questions",
    "concierge_titulo": "Want to go beyond the guided experience?",
    "concierge_desc": "We also offer custom adjustments, manual refinements, and exclusive creative direction for brands looking for closer support.",
    "sugestoes_titulo": "💡 Suggestions & Improvements",
    "sugestoes_desc": "Did you miss a specific stationery item? Have ideas to improve the platform? Send us a message! We read all suggestions to make The Brand Box even better.",
    "sugestoes_email": "brandbox@sonhodepapel.co",
    "kb": {
      "impressao": "To print your stationery with maximum quality, we recommend using the High-Resolution Vector PDF files available in the 'Stationery' tab. If you're using a professional printer, select the option 'Submit my final artwork'. If printing at home, use high-weight coated or offset paper (minimum 180g). Remember: complex folds and special formats require a professional printing service!",
      "exportacao": "You can export your Logo and Seal in PNG format with a transparent background (perfect for Instagram posts, watermarks, or signatures) or with a colored background directly in the 'Logo' tab. The stationery and guides are exported in standard printing PDF, with high-definition colors and ready to print!",
      "cores": "Your palette colors are carefully generated based on your brand's essence. In the 'Colors' tab, you can change the priority order of the colors (by dragging and dropping the blocks) to highlight which color should be more dominant in your artwork, signatures, and promotional materials!",
      "tamanhos": "The templates generated in the 'Stationery' tab follow official market formats. However, to adjust the logo scale (since different fonts have distinct widths and behaviors on the pieces), we provide a 'Logo Scale' slider in the 'Stationery' tab. This adjustment helps you perfectly balance the logo in the reserved space, and yes, the generated PDF updates in real-time with the chosen size!",
      "uso da marca": "Your Brand Guide (available for download in the 'Guide' tab) precisely describes the golden rules for the correct use of your new visual identity: how to combine fonts, which color palette to use on light and dark backgrounds, and the correct application of the logo and seal on different surfaces!",
      "papelaria": "The 'Stationery' tab is your complete production hub! It generates perfect templates for bags, discharge summaries, thank you cards, bag tags, shipping labels, and growth charts. All files are dynamically generated in ultra-high-definition vector PDF!",
      "limites do sistema": "To ensure technical balance and stability of your Brand Box, pattern generations have a standard limit of 3 attempts in the gallery. In addition, brand name changes are limited to 1 change per license, which prevents abuse and ensures the consistency of your new visual identity!"
    },
    "faqs": [
      {
        "category": "🎨 Customization",
        "items": [
          { "q": "Can I change my colors?", "a": "Colors are generated based on your diagnosis. In the 'Colors' tab, you can rearrange the priority of the colors (dragging and dropping blocks) to highlight your favorite colors in the design." },
          { "q": "How many patterns can I generate?", "a": "Each project allows up to 3 new pattern generations in your gallery to ensure you have exclusive and perfect options." },
          { "q": "Can I move my logo?", "a": "To maintain visual balance and identity consistency, element positions follow a fixed professional structure, but you can choose between different layouts in the 'Logo' tab." },
          { "q": "How can I make my logo more balanced?", "a": "Use the 'Logo Height' control to adjust the spacing between the brand and the tagline, and select horizontal, vertical, or stacked layouts that best match your name!" },
          { "q": "How do I choose the best size?", "a": "The PDF templates generated in the 'Stationery' tab are already perfectly sized in standard market formats (they are official ready-to-use templates). However, to adjust the logo scale on the pieces, we provide a 'Logo Scale' slider in the 'Stationery' tab. This adjustment helps you perfectly balance the logo, and the generated PDF is updated in real-time!" },
          { "q": "Can I have more font options?", "a": "Our intelligent algorithm has selected an exclusive group of 6 premium fonts that have perfect affinity with the essence and style identified for your brand. To maintain the coherence and harmony of your visual identity, the selection is limited to these 6 curated options per project." },
          { "q": "Can I upload my own logo?", "a": "Yes! If you already have a logo image or your own symbol, you can upload it directly at the top of the 'Logo' tab. The system will apply your custom logo to all printed materials, digital cards, and posts automatically." }
        ]
      },
      {
        "category": "🖨️ Printing",
        "items": [
          { "q": "Can I print at home?", "a": "You can print common flat items in A4 format (such as prescriptions, order sheets, or letterheads) directly on your home printer. However, items with folds or more complex formats (such as bags, pouches, giant tissue paper, or special format tags) require finishes that home printers cannot handle. For these, the absolute recommendation is to send them to a professional printing shop." },
          { "q": "What should I do when printing at home?", "a": "Crucial setting: always set your printer to 'Actual Size / 100% Scale'. Never select 'Fit to page' or 'Shrink to fit', as this will misalign the templates and crop marks! And remember to set the print quality to 'High' on the appropriate paper to remove imperfections and ensure color fidelity." },
          { "q": "How to send to a print shop?", "a": "Download the high-resolution PDF from the 'Stationery' tab and send it directly to your preferred print shop. The files are already closed in the professional printing standard. Important tip: the on-screen preview is just an approximate visual simulation. The downloaded PDF file is the official 100% accurate high-definition document for printing. Always open and review the downloaded PDF file on your computer before sending it to the print shop to ensure everything is perfect!" },
          { "q": "Which format should I use?", "a": "For digital viewing and social media, export in PNG (transparent background). For professional printing of bags and printed materials, always use the PDF available in the corresponding tab." },
          { "q": "How do I know which paper to use for printing?", "a": "You can consult your preferred print shop or check the recommended details directly on the platform! By clicking the button to download the PDF of any item in the 'Stationery' tab, the system displays a complete technical sheet with the exact size of the piece, the recommended paper weight and type, and even the estimated average cost of producing this item in the market." },
          { "q": "How to avoid cuts in the pattern?", "a": "If the repetition of your pattern shows visible marks on the edges or hard cuts, go to the 'Pattern' tab and click the magic button 'Smooth cuts'. Our algorithm will blend the seams automatically to make the pattern 100% continuous! If necessary, your partner print shop professional can also help by adjusting the repetition scale to perfectly fit paper rolls or bags." }
        ]
      },
      {
        "category": "💾 Project",
        "items": [
          { "q": "How to access my link again?", "a": "The access link to your Brand Box was sent to your registered email right after payment confirmation. You can also save it in your browser bookmarks." },
          { "q": "Can I change the project name?", "a": "Yes! To prevent system abuse, we allow 1 brand name change in the 'Logo' tab (completing a total of 2 valid names: the original and the correction)." },
          { "q": "Does my link expire?", "a": "No! Your project and all your downloads are available for access whenever you need them, with no expiration date." },
          { "q": "Can I access it from my phone?", "a": "Yes! The Brand Box is fully responsive. You can view your identity, download the logos directly to your camera roll, and review your brand guide from your smartphone." }
        ]
      },
      {
        "category": "✨ Experience",
        "items": [
          { "q": "How to find the best style for my brand?", "a": "The ideal style is the one that connects the essence of your business to your customer's heart. Our intelligent algorithm crossed your survey answers to find the perfect match among the 6 premium aesthetic directions." },
          { "q": "What is the brand manifesto?", "a": "It's the conceptual voice of your brand written in poetic and inspirational prose. It serves to align your purpose and touch your customer in your official communication." },
          { "q": "How to define my tone of voice?", "a": "The tone of voice ('Tone of Voice' tab) defines the writing guidelines: the words to use, what to avoid, and your brand's attitude when talking to the audience on a daily basis." }
        ]
      }
    ]
}

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

print("Translation dictionaries updated.")
