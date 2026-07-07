import re

with open('src/app/[lang]/page.js', 'r') as f:
    content = f.read()

replacements = [
    # Step 8
    (r"<h2 style=\{\{ fontSize: '1\.8rem', marginBottom: '0\.8rem', color: 'var\(--accent-turquoise\)' \}\}>Traduzindo sua essência em direção visual\.\.\.</h2>",
     r"<h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', color: 'var(--accent-turquoise)' }}>{dictionary?.postmatch?.step_8_title || 'Traduzindo sua essência em direção visual...'}</h2>"),
    (r">Nosso motor criativo está analisando o seu perfil para encontrar a combinação perfeita para você\.</p>",
     r">{dictionary?.postmatch?.step_8_subtitle || 'Nosso motor criativo está analisando o seu perfil para encontrar a combinação perfeita para você.'}</p>"),
    
    # Step 9
    (r">O MATCH PERFEITO PARA \{formData\.marca \|\| \"SUA MARCA\"\}</p>",
     r">{dictionary?.postmatch?.step_9_perfect_match || 'O MATCH PERFEITO PARA'} {formData.marca || 'SUA MARCA'}</p>"),
    (r">Personalizar minha Identidade</button>",
     r">{dictionary?.postmatch?.step_9_btn_customize || 'Personalizar minha Identidade'}</button>"),
    (r">Limite de tentativas atingido\.</p>",
     r">{dictionary?.postmatch?.step_9_limit_reached || 'Limite de tentativas atingido.'}</p>"),
    
    # Needs custom logic for the complex string, let's target the exact line for 'Refazer o questionário'
    (r"Refazer o questionário \(\{2 - refazerAttempts\} tentativa\{2 - refazerAttempts !== 1 \? 's' : ''\} restante\{2 - refazerAttempts !== 1 \? 's' : ''\}\)",
     r"{dictionary?.postmatch?.step_9_btn_retake || 'Refazer o questionário'} {(dictionary?.postmatch?.step_9_attempts_remaining || '({count} tentativa{s} restante{s})').replace('{count}', 2 - refazerAttempts).replace('{s}', 2 - refazerAttempts !== 1 ? 's' : '')}"),

    # Modal Refazer
    (r">Tem certeza\?</h3>",
     r">{dictionary?.postmatch?.modal_retake_title || 'Tem certeza?'}</h3>"),
    (r"Você perderá o modelo gerado e <strong>não poderá recuperá-lo</strong>\.",
     r"<span dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.modal_retake_desc_1 || 'Você perderá o modelo gerado e <strong>não poderá recuperá-lo</strong>.' }} />"),
    (r"Após refazer, você terá mais <strong>\{1 - refazerAttempts\} tentativa\{1 - refazerAttempts !== 1 \? 's' : ''\}</strong> restante\{1 - refazerAttempts !== 1 \? 's' : ''\}\.",
     r"<span dangerouslySetInnerHTML={{ __html: (dictionary?.postmatch?.modal_retake_desc_2 || 'Após refazer, você terá mais <strong>{count} tentativa{s}</strong> restante{s}.').replace('{count}', 1 - refazerAttempts).replace('{s}', 1 - refazerAttempts !== 1 ? 's' : '') }} />"),
    (r">Cancelar\s*</button>",
     r">{dictionary?.postmatch?.modal_btn_cancel || 'Cancelar'}</button>"),
    (r">Sim, refazer\s*</button>",
     r">{dictionary?.postmatch?.modal_btn_confirm || 'Sim, refazer'}</button>"),

    # Step 10
    (r"<h2 style=\{\{ fontSize: '1\.8rem', marginBottom: '0\.5rem', textAlign: 'center' \}\}>Refinamento Visual</h2>",
     r"<h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>{dictionary?.postmatch?.step_10_title || 'Refinamento Visual'}</h2>"),
    (r"\{customStep === 'tipo' \? '1\. Escolha a sua Tipografia ideal' : customStep === 'paleta' \? '2\. Defina sua Paleta de Cores' : '3\. Qual cor será o destaque da sua marca\?'\}",
     r"{customStep === 'tipo' ? (dictionary?.postmatch?.step_10_subtitle_tipo || '1. Escolha a sua Tipografia ideal') : customStep === 'paleta' ? (dictionary?.postmatch?.step_10_subtitle_paleta || '2. Defina sua Paleta de Cores') : (dictionary?.postmatch?.step_10_subtitle_cor || '3. Qual cor será o destaque da sua marca?')}"),
    (r">Carregando estilos exclusivos\.\.\.</p>",
     r">{dictionary?.postmatch?.step_10_loading_styles || 'Carregando estilos exclusivos...'}</p>"),
    (r">Ops! Não conseguimos carregar as tipografias\.</p>",
     r">{dictionary?.postmatch?.step_10_error_title || 'Ops! Não conseguimos carregar as tipografias.'}</p>"),
    (r"Isso pode ser um erro de conexão temporário ou falta de dados para o estilo <strong>\{resultadoFinal\?\.estiloNome\}</strong>\.",
     r"{dictionary?.postmatch?.step_10_error_desc || 'Isso pode ser um erro de conexão temporário ou falta de dados para o estilo'} <strong>{resultadoFinal?.estiloNome}</strong>."),
    (r">Tentar carregar novamente</button>",
     r">{dictionary?.postmatch?.step_10_btn_retry || 'Tentar carregar novamente'}</button>"),
    (r">Essa cor será usada no logo, submarca e nos elementos de destaque da sua identidade visual\.</p>",
     r">{dictionary?.postmatch?.step_10_color_desc || 'Essa cor será usada no logo, submarca e nos elementos de destaque da sua identidade visual.'}</p>"),
    (r">Nenhuma cor encontrada\. Rode o upload_drive\.mjs para este estilo\.</p>",
     r">{dictionary?.postmatch?.step_10_no_color || 'Nenhuma cor encontrada.'}</p>"),
    (r"Cor selecionada: <span style=\{\{ color: editData\.corAtiva, fontWeight: 800 \}\}>\{editData\.corAtiva\}</span>",
     r"{dictionary?.postmatch?.step_10_color_selected || 'Cor selecionada:'} <span style={{ color: editData.corAtiva, fontWeight: 800 }}>{editData.corAtiva}</span>"),
    (r">Ver Inspiração ✨</button>",
     r">{dictionary?.postmatch?.step_10_btn_inspiration || 'Ver Inspiração ✨'}</button>"),
    
    # Step 11
    (r">Moodboard</p>",
     r">{dictionary?.postmatch?.step_11_moodboard || 'Moodboard'}</p>"),
    (r">Universo Visual de \{formData\.marca\}</p>",
     r">{dictionary?.postmatch?.step_11_visual_universe || 'Universo Visual de'} {formData.marca}</p>"),
    (r">✨ As imagens abaixo são <strong>referências visuais</strong> que servirão de inspiração para criar a identidade da sua marca\. Elas não farão parte do material final — são o ponto de partida do seu universo visual\.\s*</p>",
     r" dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_11_references_note || '✨ As imagens abaixo são <strong>referências visuais</strong> que servirão de inspiração para criar a identidade da sua marca. Elas não farão parte do material final — são o ponto de partida do seu universo visual.' }}></p>"),
    (r">Definir minha Tagline ✨</button>",
     r">{dictionary?.postmatch?.step_11_btn_tagline || 'Definir minha Tagline ✨'}</button>"),

    # Step 11.5
    (r">Sua Voz de Marca</p>",
     r">{dictionary?.postmatch?.step_115_voice || 'Sua Voz de Marca'}</p>"),
    (r">Qual a sua tagline\?</h2>",
     r">{dictionary?.postmatch?.step_115_title || 'Qual a sua tagline?'}</h2 >"),
    (r">Frase curta e memorável que captura a essência, o propósito e o posicionamento da sua marca\.\s*</p>",
     r">{dictionary?.postmatch?.step_115_subtitle || 'Frase curta e memorável que captura a essência, o propósito e o posicionamento da sua marca.'}</p>"),
    (r">Sugestões para o estilo \{resultadoFinal\?\.estiloNome\}\s*</p>",
     r">{dictionary?.postmatch?.step_115_suggestions || 'Sugestões para o estilo'} {resultadoFinal?.estiloNome}</p>"),
    (r">Ou escreva a sua\s*</p>",
     r">{dictionary?.postmatch?.step_115_or_write || 'Ou escreva a sua'}</p>"),
    (r">Escreva sua especialidade ou uma frase de posicionamento curta\.\s*</p>",
     r">{dictionary?.postmatch?.step_115_write_desc || 'Escreva sua especialidade ou uma frase de posicionamento curta.'}</p>"),
    (r">Criar Minha Estampa ✨\s*</button>",
     r">{dictionary?.postmatch?.step_115_btn_pattern || 'Criar Minha Estampa ✨'}</button>"),
    
    # Step 11.7
    (r">Sua Estampa Exclusiva</h2>",
     r">{dictionary?.postmatch?.step_117_title || 'Sua Estampa Exclusiva'}</h2>"),
    (r"Agora a mágica acontece! ✨<br/>",
     r"{dictionary?.postmatch?.step_117_magic || 'Agora a mágica acontece! ✨'}<br/>"),
    (r"<span style=\{\{ fontSize: '0\.8rem' \}\}>A <strong>The Brand Box</strong> vai criar uma estampa que traduz a essência da sua marca em cada detalhe\.</span>",
     r"<span style={{ fontSize: '0.8rem' }} dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_117_magic_desc || 'A <strong>The Brand Box</strong> vai criar uma estampa que traduz a essência da sua marca em cada detalhe.' }} />"),
    (r">Referências do seu universo visual</p>",
     r">{dictionary?.postmatch?.step_117_references || 'Referências do seu universo visual'}</p>"),
    (r">\s*✨ Criar Minha Estampa\s*</button>",
     r">{dictionary?.postmatch?.step_117_btn_create || '✨ Criar Minha Estampa'}</button>"),
    (r">Desenhando com carinho\.\.\.</p>",
     r">{dictionary?.postmatch?.step_117_drawing || 'Desenhando com carinho...'}</p>"),
    (r">Toque no cartão que mais combina com a sua marca\s*</p>",
     r">{dictionary?.postmatch?.step_117_tap_card || 'Toque no cartão que mais combina com a sua marca'}</p>"),
    (r">\s*🔄 Gerar novas opções\s*</button>",
     r">{dictionary?.postmatch?.step_117_btn_regenerate || '🔄 Gerar novas opções'}</button>"),
    (r">\s*Ver Minha Placa ✨\s*</button>",
     r">{dictionary?.postmatch?.step_117_btn_board || 'Ver Minha Placa ✨'}</button>"),

]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/app/[lang]/page.js', 'w') as f:
    f.write(content)

