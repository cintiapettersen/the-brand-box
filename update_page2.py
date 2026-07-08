import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Step 5.5 old content with the new Step 5.2 and 5.5
old_step_5_5 = """          {step === 5.5 && (
            <motion.div 
              key="step5_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '80%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_5_title || 'Qual a energia da sua marca?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_5_subtitle || 'Isso ajuda a calibrarmos as cores e os elementos visuais (evitando estampas que não combinem com você).'}</p>
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {identidades.map(i => (<button key={i} onClick={() => setSingleChoice('identidade', i)} style={chipStyle(formData.identidade === i)}>{dictionary?.onboarding?.identidades_options?.[i] || i}</button>))}
              </div>
              <button onClick={() => setStep(6)} className="btn-secondary" style={{ opacity: formData.identidade ? 1 : 0.5, pointerEvents: formData.identidade ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}"""

new_step_5_blocks = """          {step === 5.2 && (
            <motion.div 
              key="step5_2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '75%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_2_title || 'O que você quer que as pessoas pensem quando virem sua marca pela primeira vez? ❤️'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_2_subtitle || 'Escolha a principal primeira impressão.'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {primeirasImpressoes.map(i => (
                   <button key={i} onClick={() => setSingleChoice('primeiraImpressao', i)} style={chipStyle(formData.primeiraImpressao === i)}>
                     {dictionary?.onboarding?.primeiras_impressoes_options?.[i] || i}
                   </button>
                ))}
              </div>
              <button onClick={() => setStep(5.5)} className="btn-secondary" style={{ opacity: formData.primeiraImpressao ? 1 : 0.5, pointerEvents: formData.primeiraImpressao ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 5.5 && (
            <motion.div 
              key="step5_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '80%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_5_5_title || 'Qual descreve melhor a personalidade da sua marca?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_5_subtitle || 'Isso ajuda a calibrar as cores e os elementos visuais.'}</p>
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {personalidades.map(i => (<button key={i} onClick={() => setSingleChoice('personalidade', i)} style={chipStyle(formData.personalidade === i)}>{dictionary?.onboarding?.personalidades_options?.[i] || i}</button>))}
              </div>
              <button onClick={() => setStep(6)} className="btn-secondary" style={{ opacity: formData.personalidade ? 1 : 0.5, pointerEvents: formData.personalidade ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}"""
content = content.replace(old_step_5_5, new_step_5_blocks)

# Update Step 6
content = content.replace(
    "{dictionary?.onboarding?.step_6_title || 'Que sensações você quer transmitir?'}",
    "{dictionary?.onboarding?.step_6_title || 'Como as pessoas devem se sentir após interagir com a sua marca? ❤️'}"
)
# Update Step 6 button to go to 6.5
content = content.replace(
    """<button onClick={nextStep} className="btn-primary" style={{ opacity: formData.sentimentos.length > 0 ? 1 : 0.5, pointerEvents: formData.sentimentos.length > 0 ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>""",
    """<button onClick={() => setStep(6.5)} className="btn-primary" style={{ opacity: formData.sentimentos.length > 0 ? 1 : 0.5, pointerEvents: formData.sentimentos.length > 0 ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"""
)

# Replace Step 7 completely and append the rest
old_step_7 = """          {step === 7 && (
            <motion.div 
              key="step7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '95%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_title || 'O que não pode faltar no layout?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_subtitle || 'Quais elementos visuais e temáticos são vitais para você? (Escolha 1 opção)'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {elementosDesc.map(s => {
                  const isSelected = formData.elementosVisuais.includes(s);
                  return (
                    <button key={s} onClick={() => toggleElemento(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{dictionary?.onboarding?.elementos_options?.[s] || s}</button>
                  )
                })}
              </div>
              <button onClick={callMatchmaker} className="btn-primary" style={{ opacity: formData.elementosVisuais.length > 0 ? 1 : 0.5, pointerEvents: formData.elementosVisuais.length > 0 ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_matchmaker || 'Descobrir meu Estilo Ideal ✨'}</button>
            </motion.div>
          )}"""

new_steps = """          {step === 6.5 && (
            <motion.div 
              key="step6_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '92%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_5_title || 'Onde a sua marca vai aparecer com mais frequência?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_6_5_subtitle || 'Selecione todos que se aplicam.'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {locais_options.map(s => {
                  const isSelected = formData.locais.includes(s);
                  return (
                    <button key={s} onClick={() => toggleLocal(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{dictionary?.onboarding?.locais_options?.[s] || s}</button>
                  )
                })}
              </div>
              <button onClick={() => setStep(7)} className="btn-primary" style={{ opacity: formData.locais.length > 0 ? 1 : 0.5, pointerEvents: formData.locais.length > 0 ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="step7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '94%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_title || 'O que não pode faltar no layout?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_subtitle || 'Quais elementos visuais e temáticos são vitais para você? (Escolha 1 opção)'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {elementosDesc.map(s => {
                  const isSelected = formData.elementosVisuais.includes(s);
                  return (
                    <button key={s} onClick={() => toggleElemento(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{dictionary?.onboarding?.elementos_options?.[s] || s}</button>
                  )
                })}
              </div>
              <button onClick={() => setStep(7.2)} className="btn-primary" style={{ opacity: formData.elementosVisuais.length > 0 ? 1 : 0.5, pointerEvents: formData.elementosVisuais.length > 0 ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7.2 && (
            <motion.div 
              key="step7_2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '96%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_2_title || 'Quais marcas te inspiram?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_2_subtitle || 'Não para copiar, mas para calibrar o estilo. Escreva nomes ou cole links. (Opcional)'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem' }}>
                <textarea name="inspiracoes" value={formData.inspiracoes} onChange={handleInput} placeholder={dictionary?.onboarding?.step_7_2_placeholder || 'Ex: Apple, Natura, Nubank...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', minHeight: '100px' }} />
              </div>
              <button onClick={() => setStep(7.5)} className="btn-secondary">{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7.5 && (
            <motion.div 
              key="step7_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '98%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_5_title || 'O que as pessoas NUNCA devem pensar da sua marca? 😳'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_5_subtitle || \"Ex: 'Não quero parecer infantil', 'Não quero parecer cara demais'. (Opcional)\"}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem' }}>
                <textarea name="nuncaPensar" value={formData.nuncaPensar} onChange={handleInput} placeholder={dictionary?.onboarding?.step_7_5_placeholder || 'Escreva aqui...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', minHeight: '100px' }} />
              </div>
              <button onClick={() => setStep(7.8)} className="btn-secondary">{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7.8 && (
            <motion.div 
              key="step7_8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '100%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{dictionary?.onboarding?.step_7_8_title || 'Aqui está o que eu entendi sobre a sua marca.'}</h2>
              <div style={{ background: 'var(--bg-soft)', borderRadius: '16px', padding: '1.5rem', width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_audience || 'Público'}:</strong> {dictionary?.onboarding?.publicos_options?.[formData.publico] || formData.publico}</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_personality || 'Personalidade'}:</strong> {dictionary?.onboarding?.personalidades_options?.[formData.personalidade] || formData.personalidade}</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_feelings || 'Sentimentos'}:</strong> {formData.sentimentos.length} selecionados</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_style || 'Estilo'}:</strong> {dictionary?.onboarding?.primeiras_impressoes_options?.[formData.primeiraImpressao] || formData.primeiraImpressao}</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_goals || 'Objetivos'}:</strong> Alinhados</p>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.summary_text || 'Com base nisso, estou buscando as direções visuais que melhor se encaixam na sua marca.'}</p>
              <button onClick={callMatchmaker} className="btn-primary" style={{ background: 'var(--accent-magenta)' }}>{dictionary?.onboarding?.step_7_8_btn || 'Gerando...'}</button>
            </motion.div>
          )}"""
content = content.replace(old_step_7, new_steps)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("page.js phase 2 updated!")
