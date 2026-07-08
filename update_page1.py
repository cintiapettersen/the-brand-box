import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update formData initial state
content = content.replace(
    "nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: [], identidade: ''",
    "nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', nuncaPensar: ''"
)

# 2. Add arrays below `sensacoes`
arrays_to_add = """
  const primeirasImpressoes = ['Professional', 'Creative', 'Trustworthy', 'Premium', 'Friendly', 'Playful', 'Elegant', 'Modern', 'Calm', 'Bold', 'Natural', 'Innovative'];
  const personalidades = ['Calm', 'Bold', 'Elegant', 'Joyful', 'Minimal', 'Expressive'];
  const locais_options = ['Instagram', 'Printed materials', 'Packaging', 'Website', 'Clothing', 'Products', 'Signage', 'Presentations'];

  const toggleLocal = (val) => {
    setFormData(prev => ({
      ...prev,
      locais: prev.locais.includes(val) ? prev.locais.filter(item => item !== val) : [...prev.locais, val]
    }));
  };
"""
content = content.replace(
    "const sensacoes = [",
    arrays_to_add + "\n  const sensacoes = ["
)

# 3. Update Back button logic
old_back_logic = """if (step === 6) setStep(5.5);
             else if (step === 5.5) setStep(5);
             else setStep(s => s - 1);"""
new_back_logic = """if (step === 7.8) setStep(7.5);
             else if (step === 7.5) setStep(7.2);
             else if (step === 7.2) setStep(7);
             else if (step === 7) setStep(6.5);
             else if (step === 6.5) setStep(6);
             else if (step === 6) setStep(5.5);
             else if (step === 5.5) setStep(5.2);
             else if (step === 5.2) setStep(5);
             else setStep(s => s - 1);"""
content = content.replace(old_back_logic, new_back_logic)
content = content.replace("{step > 1 && step <= 7 && (", "{step > 1 && step < 8 && (")

# 4. Update Step 2 (Name & Email)
step_2_old = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{dictionary?.onboarding?.step_2_subtitle || 'Como você gostaria de ser chamada(o)?'}</p>"""
step_2_new = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>
              <div style={{ background: '#fff8f0', border: '1px solid #f5d9b8', borderRadius: '12px', padding: '12px 14px', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', color: '#7a4a1e', lineHeight: 1.5 }}>
                  💡 {dictionary?.onboarding?.step_2_hint || 'Seu nome ajuda a personalizar a experiência.'}
                </p>
              </div>"""
content = content.replace(step_2_old, step_2_new)

# 5. Update Step 3 (Brand)
step_3_old = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{dictionary?.onboarding?.step_3_subtitle || 'Este nome vai guiar toda a sua identidade visual.'}</p>"""
step_3_new = """<h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_3_title || 'E a sua marca?'}</h2>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px 14px', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                  💡 {dictionary?.onboarding?.step_3_hint || 'Grandes marcas geralmente começam com um nome simples. 🥹'}
                </p>
              </div>"""
content = content.replace(step_3_old, step_3_new)

# 6. Step 4 (Area) "Outra" option
step_4_grid = """{areas.map(a => ("""
step_4_grid_new = """{[...areas, 'Outra'].map(a => ("""
content = content.replace(step_4_grid, step_4_grid_new)

step_4_input = """<button onClick={nextStep} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra área' || formData.atuacaoOutra !== '')) ? 1 : 0.5, pointerEvents: (formData.atuacao !== '' && (formData.atuacao !== 'Outra área' || formData.atuacaoOutra !== '')) ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"""
step_4_input_new = """
              {formData.atuacao === 'Outra' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', marginBottom: '1rem' }}>
                  <input name="atuacaoOutra" value={formData.atuacaoOutra} onChange={handleInput} placeholder={dictionary?.onboarding?.step_4_other_placeholder || 'Digite sua área...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </motion.div>
              )}
              <button onClick={() => setStep(5)} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 1 : 0.5, pointerEvents: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 'auto' : 'none' }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>"""
content = content.replace(step_4_input, step_4_input_new)

# 7. Update button of step 5 to go to 5.2
content = content.replace(
    """<button onClick={() => setStep(5.5)} className="btn-secondary" style={{ opacity: formData.publico ? 1 : 0.5""",
    """<button onClick={() => setStep(5.2)} className="btn-secondary" style={{ opacity: formData.publico ? 1 : 0.5"""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("page.js phase 1 updated!")
