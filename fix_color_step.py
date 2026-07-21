import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the subtitle text
old_subtitle = "(dictionary?.postmatch?.step_10_subtitle_cor || '2. Qual cor será o destaque da sua marca?')"
new_subtitle = "<span dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_10_subtitle_cor || (lang === 'en' ? '3. Which color will <strong>highlight</strong> your brand?' : '2. Qual cor será o <strong>destaque</strong> da sua marca?') }} />"
content = content.replace(old_subtitle, new_subtitle)

# Fix the onClick for light colors
old_onclick = """                                  onClick={() => {
                                    if (!tooLight) setEditData(prev => ({ ...prev, corAtiva: hex }));
                                  }}"""
new_onclick = """                                  onClick={() => {
                                    if (!tooLight) {
                                      setEditData(prev => ({ ...prev, corAtiva: hex }));
                                    } else {
                                      alert(lang === 'en' ? 'This color is too light to be used as a highlight. Please choose a darker tone.' : 'Essa cor é muito clara para ser usada como destaque. Por favor, escolha um tom mais escuro.');
                                    }
                                  }}"""
content = content.replace(old_onclick, new_onclick)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated page.js with highlight fix and color alert")
