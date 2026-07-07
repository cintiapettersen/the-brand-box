import re

with open('src/app/[lang]/page.js', 'r') as f:
    content = f.read()

replacements = [
    (r"<h2>Antes de começarmos...</h2>", r"<h2>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>"),
    (r"<h2>E a sua marca\?</h2>", r"<h2>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>"),
    (r"<h2>Qual é a sua área de atuação\?</h2>", r"<h2>{dictionary?.onboarding?.step_4_title || 'Qual é a sua área de atuação?'}</h2>"),
    (r"<h2>Para quem você atende\?</h2>", r"<h2>{dictionary?.onboarding?.step_5_title || 'Para quem você atende?'}</h2>"),
    (r"<h2>Qual a energia da sua marca\?</h2>", r"<h2>{dictionary?.onboarding?.step_5_5_title || 'Qual a energia da sua marca?'}</h2>"),
    (r"<h2>Que sensações você quer transmitir\?</h2>", r"<h2>{dictionary?.onboarding?.step_6_title || 'Que sensações você quer transmitir?'}</h2>"),
    (r"<h2>O que não pode faltar no layout\?</h2>", r"<h2>{dictionary?.onboarding?.step_7_title || 'O que não pode faltar no layout?'}</h2>"),

    (r">Como você gostaria de ser chamada\(o\)\?</p>", r">{dictionary?.onboarding?.step_2_subtitle || 'Como você gostaria de ser chamada(o)?'}</p>"),
    (r"placeholder=\"Seu nome ou apelido\"", r"placeholder={dictionary?.onboarding?.step_2_name_placeholder || 'Seu nome ou apelido'}"),
    (r"placeholder=\"O seu melhor e-mail\"", r"placeholder={dictionary?.onboarding?.step_2_email_placeholder || 'O seu melhor e-mail'}"),
    (r">Continuar</button>", r">{dictionary?.onboarding?.btn_continue || 'Continuar'}</button>"),

    (r">Este nome vai guiar toda a sua identidade visual\.</p>", r">{dictionary?.onboarding?.step_3_subtitle || 'Este nome vai guiar toda a sua identidade visual.'}</p>"),
    (r"placeholder=\"Ex: Clínica Sonho Meu\.\.\.\"", r"placeholder={dictionary?.onboarding?.step_3_placeholder || 'Ex: Clínica Sonho Meu...'}"),

    (r"\{ok \? `\$\{count\} palavra\$\{count > 1 \? 's' : ''\} — ótimo para uma logo bonita ✓` : `\$\{count\} palavras — veja a dica abaixo`\}", 
     r"{ok ? (dictionary?.onboarding?.step_3_words_ok?.replace('{count}', count) || `${count} palavra${count > 1 ? 's' : ''} — ótimo para uma logo bonita ✓`) : (dictionary?.onboarding?.step_3_words_warning?.replace('{count}', count) || `${count} palavras — veja a dica abaixo`)}"),

    (r"✅ Nome atualizado! Ficou muito mais elegante para a logo\.", r"{dictionary?.onboarding?.step_3_success || '✅ Nome atualizado! Ficou muito mais elegante para a logo.'}"),

    (r"<p style=\{\{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6, marginBottom: sugestao \? '8px' : '0' \}\}>\s*💡 <strong>Dica visual:</strong> nomes longos ficam difíceis de ler na logo\. Abreviar o nome do meio mantém a elegância sem perder a identidade\.\s*</p>",
     r"<p style={{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6, marginBottom: sugestao ? '8px' : '0' }} dangerouslySetInnerHTML={{ __html: dictionary?.onboarding?.step_3_tip || '💡 <strong>Dica visual:</strong> nomes longos ficam difíceis de ler na logo. Abreviar o nome do meio mantém a elegância sem perder a identidade.' }} />"),

    (r"Usar \"\{sugestao\}\"", r"{dictionary?.onboarding?.step_3_use_suggestion?.replace('{sugestao}', sugestao) || `Usar \"${sugestao}\"`}"),

    (r"<p style=\{\{ fontSize: '0.8rem', color: '#2a5a8a', lineHeight: 1.6 \}\}>\s*👩‍⚕️ Quer manter o título <strong>Dra\.</strong> na logo\? Fica lindo em alguns estilos! Pode deixar — a gente vai usar na identidade visual\.\s*</p>",
     r"<p style={{ fontSize: '0.8rem', color: '#2a5a8a', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: dictionary?.onboarding?.step_3_dr_tip || '👩‍⚕️ Quer manter o título <strong>Dra.</strong> na logo? Fica lindo em alguns estilos! Pode deixar — a gente vai usar na identidade visual.' }} />"),

    (r">Avançar 🤍</button>", r">{dictionary?.onboarding?.btn_next_heart || 'Avançar 🤍'}</button>"),

    (r">Escolha a que mais combina com o seu negócio\.</p>", r">{dictionary?.onboarding?.step_4_subtitle || 'Escolha a que mais combina com o seu negócio.'}</p>"),
    (r"\{\s*a\s*\}\s*</button>", r"{dictionary?.onboarding?.areas_options?.[a] || a}</button>"),

    (r">Qual o seu público principal\?</p>", r">{dictionary?.onboarding?.step_5_subtitle || 'Qual o seu público principal?'}</p>"),
    (r"\{\s*p\s*\}\s*</button>", r"{dictionary?.onboarding?.publicos_options?.[p] || p}</button>"),

    (r">Isso ajuda a calibrarmos as cores e os elementos visuais \(evitando estampas que não combinem com você\)\.</p>", r">{dictionary?.onboarding?.step_5_5_subtitle || 'Isso ajuda a calibrarmos as cores e os elementos visuais (evitando estampas que não combinem com você).'}</p>"),
    (r"\{\s*i\s*\}\s*</button>", r"{dictionary?.onboarding?.identidades_options?.[i] || i}</button>"),

    (r">Selecione até 2 opções que mais se conectam com a sua marca\.</p>", r">{dictionary?.onboarding?.step_6_subtitle || 'Selecione até 2 opções que mais se conectam com a sua marca.'}</p>"),
    (r"\{\s*s\s*\}\s*</button>", r"{dictionary?.onboarding?.sensacoes_options?.[s] || s}</button>"),

    (r"\{s\}\s*</button>", r"{dictionary?.onboarding?.elementos_options?.[s] || s}</button>"),

    (r"Selecionadas: \{formData\.sentimentos\.length\}/2", r"{dictionary?.onboarding?.step_6_selected?.replace('{count}', formData.sentimentos.length) || `Selecionadas: ${formData.sentimentos.length}/2`}"),

    (r">Quais elementos visuais e temáticos são vitais para você\? \(Escolha 1 opção\)</p>", r">{dictionary?.onboarding?.step_7_subtitle || 'Quais elementos visuais e temáticos são vitais para você? (Escolha 1 opção)'}</p>"),

    (r">Avançar</button>", r">{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"),
    (r">Descobrir meu Estilo Ideal ✨</button>", r">{dictionary?.onboarding?.btn_matchmaker || 'Descobrir meu Estilo Ideal ✨'}</button>"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/app/[lang]/page.js', 'w') as f:
    f.write(content)

