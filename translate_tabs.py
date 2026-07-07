import os

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Tagline tab
    content = content.replace(
        "Você enviou sua própria logo, então a tagline (slogan) já faz parte da sua imagem!<br/><br/>",
        "{dictionary?.tagline_tab?.custom_logo_msg || 'Você enviou sua própria logo, então a tagline (slogan) já faz parte da sua imagem!'}<br/><br/>"
    )
    content = content.replace(
        "<span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>Para alterar a tagline ou usar as opções desta aba, volte à aba \"Sua Logo\" e selecione a \"Logo sugerida\".</span>",
        "<span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>{dictionary?.tagline_tab?.custom_logo_sub || 'Para alterar a tagline ou usar as opções desta aba, volte à aba \"Sua Logo\" e selecione a \"Logo sugerida\".'}</span>"
    )
    content = content.replace(
        "💬 Tagline da Marca",
        "{dictionary?.tagline_tab?.brand_tagline || '💬 Tagline da Marca'}"
    )
    content = content.replace(
        "{sloganEnabled ? '✓ Com tagline' : '✗ Sem tagline'}",
        "{sloganEnabled ? (dictionary?.tagline_tab?.with_tagline || '✓ Com tagline') : (dictionary?.tagline_tab?.without_tagline || '✗ Sem tagline')}"
    )
    content = content.replace(
        "placeholder=\"Ex: Delicadeza em cada detalhe\"",
        "placeholder={dictionary?.tagline_tab?.placeholder || 'Ex: Delicadeza em cada detalhe'}"
    )
    content = content.replace(
        "📝 Dica da IA",
        "{dictionary?.tagline_tab?.ai_tip || '📝 Dica da IA'}"
    )
    content = content.replace(
        "Escolha uma tagline focada em",
        "{dictionary?.tagline_tab?.choose_focused || 'Escolha uma tagline focada em'}"
    )
    content = content.replace(
        "Exemplos:",
        "{dictionary?.tagline_tab?.examples || 'Exemplos:'}"
    )
    content = content.replace(
        "Aa Estilo da Fonte",
        "{dictionary?.tagline_tab?.font_style || 'Aa Estilo da Fonte'}"
    )
    content = content.replace(
        "↔ Espaçamento",
        "{dictionary?.tagline_tab?.spacing || '↔ Espaçamento'}"
    )

    # Seal tab (Submarca)
    content = content.replace(
        "Você enviou sua própria logo, então a submarca (selo) foi gerada a partir dela!<br/><br/>",
        "{dictionary?.seal_tab?.custom_logo_msg || 'Você enviou sua própria logo, então a submarca (selo) foi gerada a partir dela!'}<br/><br/>"
    )
    content = content.replace(
        "<span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>Para testar os formatos automáticos, volte à aba \"Sua Logo\" e selecione a \"Logo sugerida\".</span>",
        "<span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>{dictionary?.seal_tab?.custom_logo_sub || 'Para testar os formatos automáticos, volte à aba \"Sua Logo\" e selecione a \"Logo sugerida\".'}</span>"
    )
    content = content.replace(
        "✨ Estilo da Submarca",
        "{dictionary?.seal_tab?.seal_style || '✨ Estilo da Submarca'}"
    )
    content = content.replace(
        "{ key: 'circular', label: '⭕ Circular' }",
        "{ key: 'circular', label: dictionary?.seal_tab?.circular || '⭕ Circular' }"
    )
    content = content.replace(
        "{ key: 'minimal', label: '⚡ Minimal' }",
        "{ key: 'minimal', label: dictionary?.seal_tab?.minimal || '⚡ Minimal' }"
    )
    content = content.replace(
        "As submarcas (ou selos) são variações compactas do seu logo,",
        "{dictionary?.seal_tab?.seal_desc || 'As submarcas (ou selos) são variações compactas do seu logo,'}"
    )
    content = content.replace(
        "perfeitas para usar como foto de perfil, carimbos ou adesivos.",
        "{dictionary?.seal_tab?.seal_desc_2 || 'perfeitas para usar como foto de perfil, carimbos ou adesivos.'}"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('src/app/[lang]/sucesso/page.js')
print('Done translating Slogan and Seal tabs')
