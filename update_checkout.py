import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Header
    (r"Clareza criativa, mesmo para quem nunca criou uma marca antes.", 
     r"{dictionary?.checkout?.header_pretitle || 'Clareza criativa, mesmo para quem nunca criou uma marca antes.'}"),
    (r"Escolha a experiência ideal para sua marca\.<br/>Do essencial ao extraordinário\.", 
     r"{dictionary?.checkout?.header_title ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.header_title }} /> : <>Escolha a experiência ideal para sua marca.<br/>Do essencial ao extraordinário.</>}"),
    (r"Sua identidade visual está pronta para deixar de ser ideia e começar a existir de verdade\.", 
     r"{dictionary?.checkout?.header_subtitle || 'Sua identidade visual está pronta para deixar de ser ideia e começar a existir de verdade.'}"),
    
    # Essence
    (r">ESSENCE<", 
     r">{dictionary?.checkout?.plan_essence_title || 'ESSENCE'}<"),
    (r">Sua marca completa<", 
     r">{dictionary?.checkout?.plan_essence_badge || 'Sua marca completa'}<"),
    (r"\['Logo tipográfica \+ variações', 'Estampa exclusiva da marca', 'Manifesto e Tom de Voz', 'Paleta de cores \+ tipografia', 'Guia da Marca completo \(PDF\)'\]", 
     r"(dictionary?.checkout?.plan_essence_features || ['Logo tipográfica + variações', 'Estampa exclusiva da marca', 'Manifesto e Tom de Voz', 'Paleta de cores + tipografia', 'Guia da Marca completo (PDF)'])"),
    (r"✨ O essencial para começar sua marca", 
     r"{dictionary?.checkout?.plan_essence_highlight || '✨ O essencial para começar sua marca'}"),
    (r"⚠️ <strong>Aviso:</strong> Este plano é focado em design tipográfico moderno e estampa geométrica/abstrata do sistema\. Não inclui ilustrações exclusivas personalizadas, logomarcas desenhadas à mão ou padrões ilustrados de rodapé\.", 
     r"<span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.plan_essence_warning || '⚠️ <strong>Aviso:</strong> Este plano é focado em design tipográfico moderno e estampa geométrica/abstrata do sistema. Não inclui ilustrações exclusivas personalizadas, logomarcas desenhadas à mão ou padrões ilustrados de rodapé.' }} />"),
    (r"\{loadingCheckout === 'starter' \? 'Processando\.\.\.' : 'Começar minha marca'\}", 
     r"{loadingCheckout === 'starter' ? (dictionary?.checkout?.btn_processing || 'Processando...') : (dictionary?.checkout?.plan_essence_btn || 'Começar minha marca')}"),

    # Studio
    (r">MAIS ESCOLHIDO<", 
     r">{dictionary?.checkout?.plan_studio_badge || 'MAIS ESCOLHIDO'}<"),
    (r">STUDIO<", 
     r">{dictionary?.checkout?.plan_studio_title || 'STUDIO'}<"),
    (r">Marca \+ Digital \+ Impressos<", 
     r">{dictionary?.checkout?.plan_studio_subbadge || 'Marca + Digital + Impressos'}<"),
    (r">\(\+ adicionais\)<", 
     r">{dictionary?.checkout?.plan_studio_adicionais || '(+ adicionais)'}<"),
    (r"\['Tudo do Brand Box Starter', 'PAPELARIA', 'Pack completo para Instagram', 'Cartão Digital \+ Assinatura de E-mail'\]", 
     r"(dictionary?.checkout?.plan_studio_features || ['Tudo do Brand Box Starter', 'PAPELARIA', 'Pack completo para Instagram', 'Cartão Digital + Assinatura de E-mail'])"),
    (r"const text = isPapelaria \n\s*\? \(papelariaSelecionada\.length > 0 \? `\$\{papelariaSelecionada\.length\} itens impressos marcados` : '5 Itens impressos à escolha'\)\n\s*: i;", 
     r"const text = isPapelaria ? (papelariaSelecionada.length > 0 ? (dictionary?.checkout?.plan_studio_bonus_selected?.replace('{count}', papelariaSelecionada.length) || `${papelariaSelecionada.length} itens impressos marcados`) : (dictionary?.checkout?.plan_studio_bonus_unselected || '5 Itens impressos à escolha')) : i;"),
    (r"👀 Selecionar itens", 
     r"{dictionary?.checkout?.plan_studio_btn_bonus || '👀 Selecionar itens'}"),
    (r"✨ Sua marca pronta para o mundo", 
     r"{dictionary?.checkout?.plan_studio_highlight || '✨ Sua marca pronta para o mundo'}"),
    (r"⚠️ <strong>Aviso:</strong> Este plano é focado em layouts digitais e estruturação moderna de papelaria\. Não inclui desenhos/ilustrações de rodapé sob medida, nem logotipos ilustrados à mão \(estas opções de arte exclusiva podem ser solicitadas pós-checkout ou contratando o plano <em>Signature</em>\)\.", 
     r"<span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.plan_studio_warning || '⚠️ <strong>Aviso:</strong> Este plano é focado em layouts digitais e estruturação moderna de papelaria. Não inclui desenhos/ilustrações de rodapé sob medida, nem logotipos ilustrados à mão (estas opções de arte exclusiva podem ser solicitadas pós-checkout ou contratando o plano <em>Signature</em>).' }} />"),
    (r"\{loadingCheckout === 'pro' \? 'Processando\.\.\.' : 'Quero minha marca completa'\}", 
     r"{loadingCheckout === 'pro' ? (dictionary?.checkout?.btn_processing || 'Processando...') : (dictionary?.checkout?.plan_studio_btn || 'Quero minha marca completa')}"),
    
    # Signature
    (r">SIGNATURE<", 
     r">{dictionary?.checkout?.plan_sig_title || 'SIGNATURE'}<"),
    (r"✨ Uma experiência exclusiva criada junto com uma designer", 
     r"{dictionary?.checkout?.plan_sig_badge || '✨ Uma experiência exclusiva criada junto com uma designer'}"),
    (r"A partir de<br/>R\$ 2\.900", 
     r"{dictionary?.checkout?.plan_sig_price ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.plan_sig_price }} /> : <>A partir de<br/>R$ 2.900</>}"),
    (r"\n\s*\[\n\s*'Direção criativa personalizada',\n\s*'Ajustes e refinamentos manuais ilimitados',\n\s*'Logotipo ilustrado ou símbolo desenhado sob medida',\n\s*'Desenhos e ilustrações unificadoras exclusivas \(ex: detalhes de rodapé para impressos\)',\n\s*'Aplicações exclusivas sob medida para sua atuação',\n\s*'Acompanhamento próximo pelo WhatsApp'\n\s*\]", 
     r"\n                      (dictionary?.checkout?.plan_sig_features || ['Direção criativa personalizada', 'Ajustes e refinamentos manuais ilimitados', 'Logotipo ilustrado ou símbolo desenhado sob medida', 'Desenhos e ilustrações unificadoras exclusivas (ex: detalhes de rodapé para impressos)', 'Aplicações exclusivas sob medida para sua atuação', 'Acompanhamento próximo pelo WhatsApp'])"),
    (r"Olá!%20Quero%20saber%20mais%20sobre%20o%20Brand%20Box%20Signature%20para%20a%20marca%20\$\{encodeURIComponent\(formData\.marca \|\| ''\)\}", 
     r"${encodeURIComponent(dictionary?.checkout?.plan_sig_msg?.replace('{marca}', formData.marca) || `Olá! Quero saber mais sobre o Brand Box Signature para a marca ${formData.marca || ''}`)}"),
    (r"\n\s*Falar no WhatsApp\n\s*</a>", 
     r"\n                      {dictionary?.checkout?.plan_sig_btn || 'Falar no WhatsApp'}\n                    </a>"),
    
    # Footer
    (r"Não precisa saber por onde começar\.<br/>Eu te guio em cada etapa\.", 
     r"{dictionary?.checkout?.footer_msg ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.footer_msg }} /> : <>Não precisa saber por onde começar.<br/>Eu te guio em cada etapa.</>}"),
    (r"\n\s*Recomeçar do zero\n\s*</button>", 
     r"\n                    {dictionary?.checkout?.footer_btn_restart || 'Recomeçar do zero'}\n                  </button>"),

    # Modal Bonus
    (r">Bônus: Seus Impressos<", 
     r">{dictionary?.checkout?.modal_bonus_title || 'Bônus: Seus Impressos'}<"),
    (r">Escolha seus 5 impressos gratuitos\. Itens adicionais saem por R\$30 cada!<", 
     r">{dictionary?.checkout?.modal_bonus_subtitle || 'Escolha seus 5 impressos gratuitos. Itens adicionais saem por R$30 cada!'}<"),
    (r">\{item\}<", 
     r">{dictionary?.papelaria?.[item] || item}<"),
    (r"👑 PREMIUM — 124 Págs", 
     r"{dictionary?.checkout?.modal_bonus_premium || '👑 PREMIUM — 124 Págs'}"),
    (r"Adicional exclusivo: <strong>\+R\$ 180,00</strong>\. Ideal para acompanhamento completo do bebê\. <em>Não consome os 5 bônus grátis!</em>", 
     r"<span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.modal_bonus_premium_info || 'Adicional exclusivo: <strong>+R$ 180,00</strong>. Ideal para acompanhamento completo do bebê. <em>Não consome os 5 bônus grátis!</em>' }} />"),
    (r"Selecionados: \{itensNormais\.length\} de 5 grátis \{temCaderneta && `\(\+ 1 Item Premium\)`\}", 
     r"{dictionary?.checkout?.modal_bonus_selected?.replace('{count}', itensNormais.length)?.replace('{premium_text}', temCaderneta ? (dictionary?.checkout?.modal_bonus_premium_text || '(+ 1 Item Premium)') : '') || `Selecionados: ${itensNormais.length} de 5 grátis ${temCaderneta ? ' (+ 1 Item Premium)' : ''}`}"),
    (r"\{extrasCount > 0 && `\+\$\{extrasCount\} extra\(s\) \(\+R\$ \$\{extrasCount \* 30\}\)`\}", 
     r"{extrasCount > 0 && (dictionary?.checkout?.modal_bonus_extra?.replace('{count}', extrasCount)?.replace('{price}', extrasCount * 30) || `+${extrasCount} extra(s) (+R$ ${extrasCount * 30})`)}"),
    (r"\{extrasCount > 0 && temCaderneta && ' e '\}", 
     r"{extrasCount > 0 && temCaderneta && (dictionary?.checkout?.modal_bonus_and || ' e ')}"),
    (r"\{temCaderneta && `\+1 Item Premium \(\+R\$ 180\)`\}", 
     r"{temCaderneta && (dictionary?.checkout?.modal_bonus_premium_price || '+1 Item Premium (+R$ 180)')}"),
    (r"\{\(isSaude \? PAPELARIA_CLINICA : PAPELARIA_INSTITUCIONAL\)\.length === papelariaSelecionada\.length \? 'Desmarcar todos' : 'Marcar todos'\}", 
     r"{(isSaude ? PAPELARIA_CLINICA : PAPELARIA_INSTITUCIONAL).length === papelariaSelecionada.length ? (dictionary?.checkout?.modal_bonus_uncheck_all || 'Desmarcar todos') : (dictionary?.checkout?.modal_bonus_check_all || 'Marcar todos')}"),
    (r">Salvar Escolhas<", 
     r">{dictionary?.checkout?.modal_bonus_btn_save || 'Salvar Escolhas'}<")
]

for src, tgt in replacements:
    content = re.sub(src, tgt, content)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Checkout updated!')
