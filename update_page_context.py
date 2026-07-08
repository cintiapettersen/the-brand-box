import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initial state and add showContext
content = content.replace(
    "nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', nuncaPensar: ''",
    "nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', contextoExtra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', nuncaPensar: ''"
)

content = content.replace(
    "const [marcaSugestaoAceita, setMarcaSugestaoAceita] = useState(false);",
    "const [marcaSugestaoAceita, setMarcaSugestaoAceita] = useState(false);\n  const [showContext, setShowContext] = useState(false);"
)

# 2. Update step 4 "Outra" to use dictionary string in the loop
old_step_4_map = """                  {[...areas, 'Outra'].map(a => ("""
new_step_4_map = """                  {[...areas, 'Other'].map(a => {
                    const isOther = a === 'Other';
                    const displayLabel = isOther ? (dictionary?.onboarding?.step_4_other_btn || 'Outra') : (dictionary?.onboarding?.areas_options?.[a] || a);
                    const value = isOther ? 'Outra' : a;
                    return ("""

content = content.replace(old_step_4_map, new_step_4_map)

old_step_4_btn = """                      key={a}
                      onClick={() => setSingleChoice('atuacao', a)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '14px',
                        border: formData.atuacao === a ? '2px solid var(--accent-turquoise)' : '1.5px solid var(--border)',
                        background: formData.atuacao === a ? 'rgba(60,204,191,0.08)' : '#fafafa',
                        color: formData.atuacao === a ? 'var(--accent-turquoise)' : 'var(--text-primary)',
                        fontWeight: formData.atuacao === a ? 700 : 500,
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {dictionary?.onboarding?.areas_options?.[a] || a}</button>
                  ))}"""

new_step_4_btn = """                      key={value}
                      onClick={() => setSingleChoice('atuacao', value)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '14px',
                        border: formData.atuacao === value ? '2px solid var(--accent-turquoise)' : '1.5px solid var(--border)',
                        background: formData.atuacao === value ? 'rgba(60,204,191,0.08)' : '#fafafa',
                        color: formData.atuacao === value ? 'var(--accent-turquoise)' : 'var(--text-primary)',
                        fontWeight: formData.atuacao === value ? 700 : 500,
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {displayLabel}</button>
                  )})}"""
content = content.replace(old_step_4_btn, new_step_4_btn)

# 3. Add expandable context textarea below area input
old_step_4_input = """              {formData.atuacao === 'Outra' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', marginBottom: '1rem' }}>
                  <input name="atuacaoOutra" value={formData.atuacaoOutra} onChange={handleInput} placeholder={dictionary?.onboarding?.step_4_other_placeholder || 'Digite sua área...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </motion.div>
              )}
              <button onClick={() => setStep(5)} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 1 : 0.5, pointerEvents: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"""

new_step_4_input = """              {formData.atuacao === 'Outra' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', marginBottom: '1rem' }}>
                  <input name="atuacaoOutra" value={formData.atuacaoOutra} onChange={handleInput} placeholder={dictionary?.onboarding?.step_4_other_placeholder || 'Digite sua área...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </motion.div>
              )}
              
              <div style={{ width: '100%', marginBottom: '1.5rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {!showContext ? (
                  <button onClick={() => setShowContext(true)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-turquoise)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', padding: '10px' }}>
                    {dictionary?.onboarding?.step_4_add_context_btn || 'Adicionar mais contexto +'}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%' }}>
                    <textarea 
                      name="contextoExtra" 
                      value={formData.contextoExtra} 
                      onChange={handleInput} 
                      placeholder={dictionary?.onboarding?.step_4_context_placeholder || 'Isso nos ajuda a entender o contexto e a alma da sua marca. Conte mais sobre o que você faz, seu diferencial, etc. (Opcional)'}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.95rem', minHeight: '100px', outline: 'none' }} 
                    />
                  </motion.div>
                )}
              </div>

              <button onClick={() => setStep(5)} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 1 : 0.5, pointerEvents: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"""

content = content.replace(old_step_4_input, new_step_4_input)

# 4. Update the reset state at the end of the file (if the user decides to reset the form)
content = content.replace(
    "setFormData({ nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: [] });",
    "setFormData({ nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', contextoExtra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', nuncaPensar: '' });\n                      setShowContext(false);"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("page.js updated successfully!")
