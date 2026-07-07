import re

def update_page_js():
    with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 🎨 Estilos Salvos
    content = content.replace("🎨 Estilos Salvos", "{tLogo.saved_styles || '🎨 Estilos Salvos'}")
    # Fix the double braces if they happen
    content = content.replace(">{tLogo.saved_styles || '🎨 Estilos Salvos'}</span>", ">{tLogo.saved_styles || '🎨 Estilos Salvos'}</span>")

    # 2. + Salvar atual
    content = content.replace(">+ Salvar atual</button>", ">{tLogo.save_current || '+ Salvar atual'}</button>")

    # 3. Nome do estilo...
    content = content.replace("placeholder=\"Nome do estilo...\"", "placeholder={tLogo.style_name_placeholder || 'Nome do estilo...'}")

    # 4. Nenhuma variação salva ainda.
    content = content.replace(">Nenhuma variação salva ainda.</p>", ">{tLogo.no_variations || 'Nenhuma variação salva ainda.'}</p>")
    content = content.replace(">Nenhuma variação salva ainda.</i></p>", "><i>{tLogo.no_variations || 'Nenhuma variação salva ainda.'}</i></p>")

    # 5. 📐 Disposição / Layout
    content = content.replace("📐 Disposição / Layout", "{tLogo.layout || '📐 Disposição / Layout'}")

    # 6. Uma linha, Duas linhas, Empilhada
    content = content.replace("{ key: 'horizontal', label: '⟵→ Uma linha' }", "{ key: 'horizontal', label: tLogo.one_line || '⟵→ Uma linha' }")
    content = content.replace("{ key: 'balanced', label: '⊟ Duas linhas'", "{ key: 'balanced', label: tLogo.two_lines || '⊟ Duas linhas'")
    content = content.replace("{ key: 'stacked', label: '≡ Empilhada' }", "{ key: 'stacked', label: tLogo.stacked || '≡ Empilhada' }")

    # 7. ↔️ Altura / Espaço entre Linhas
    content = content.replace("↔️ Altura / Espaço entre Linhas", "{tLogo.line_spacing || '↔️ Altura / Espaço entre Linhas'}")

    # 8. ✏️ Nome da Marca
    content = content.replace("✏️ Nome da Marca", "{tLogo.brand_name || '✏️ Nome da Marca'}")

    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)

update_page_js()
print("Updated page.js for Logo tab")
