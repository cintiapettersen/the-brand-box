import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_click = """onClick={async (e) => {
                        setLoadingCheckout('pro');
                        if (papelariaSelecionada.length === 0) {
                          setShowPediatriaModal(true);
                          setLoadingCheckout(false);
                          return;
                        }
                        const itensNormais = papelariaSelecionada.filter(item => item !== "Caderneta de Saúde");
                        if (itensNormais.length < 5) {
                          const confirmar = window.confirm(`Você selecionou apenas ${itensNormais.length} impresso${itensNormais.length > 1 ? 's' : ''} gratuito(s), mas seu plano inclui 5 grátis. Deseja continuar assim ou voltar para escolher mais?`);
                          if (!confirmar) { setShowPediatriaModal(true); setLoadingCheckout(false); return; }
                        }
                        try {
                          const patternObj = selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder
                            ? { mimeType: generatedPatterns[selectedPattern].mimeType, base64: generatedPatterns[selectedPattern].base64 }
                            : null;

                          const brandState = {
                            editData, formData, resultadoFinal,
                            selectedPaleta, selectedIcon, selectedTipo,
                            currentPaletteColors: paletas?.find(p => p.id === selectedPaleta)?.paleta_hex || [],
                            paletas, tipografias,
                            activeColor: editData.corAtiva,
                            pattern: patternObj,
                            iconPath: getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null,
                            patternGenerationCount,
                            estampas,
                            papelariaSelecionada,
                            plano: 'pro',
                          };
                          
                          ['brandbox_step', 'brandbox_cartao', 'brandbox_crm', 'brandbox_papelaria'].forEach(k => localStorage.removeItem(k));
                          localStorage.setItem('brandbox_plano', 'pro');
                          const extrasCount = Math.max(0, papelariaSelecionada.filter(item => item !== "Caderneta de Saúde").length - 5);

                          let sessionIdPro = null;
                          try {
                            const cleanState = { ...brandState, estampas: null, generatedPatterns: null };
                            cleanState.pattern = null;
                            const saveRes = await fetch('/api/salvar-entrega', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ brandState: cleanState, plano: 'pro', email: formData.email, marca: formData.marca }),
                            });
                            const saveData = await saveRes.json();
                            if (saveData.sessionId) {
                              sessionIdPro = saveData.sessionId;
                              localStorage.setItem('brandbox_session', sessionIdPro);
                            }
                          } catch (e) { console.warn('Supabase save failed:', e); }

                          let finalPatternUrl = null;
                          if (patternObj && sessionIdPro) {
                            try {
                              const uploadRes = await fetch('/api/salvar-estampa', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ base64: patternObj.base64, marca: formData.marca, sessionId: sessionIdPro })
                              });
                              const uploadData = await uploadRes.json();
                              if (uploadData.url) finalPatternUrl = uploadData.url;
                            } catch (e) { console.warn('Pattern upload error:', e); }
                          }

                          if (brandState.pattern && !finalPatternUrl) try { localStorage.setItem('brandbox_pattern', JSON.stringify(brandState.pattern)); } catch {}
                          try { localStorage.setItem('brandbox_delivery', JSON.stringify({ ...brandState, pattern: finalPatternUrl ? { url: finalPatternUrl } : null })); } catch {}

                          const res = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plano: 'pro', marca: formData.marca, email: formData.email, extrasCount, papelaria: papelariaSelecionada, sessionId: sessionIdPro, lang }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            console.error('Checkout error:', data.error);
                            alert('Houve um problema ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
                            setLoadingCheckout(false);
                          }
                        } catch (err) {
                          console.error('Checkout error:', err);
                          setLoadingCheckout(false);
                        }
                      }}"""

new_click = """onClick={(e) => {
                        if (papelariaSelecionada.length === 0) {
                          setShowPediatriaModal(true);
                          return;
                        }
                        handleCheckoutPro();
                      }}"""

new_fn = """  const handleCheckoutPro = async () => {
    setLoadingCheckout('pro');
    setShowPediatriaModal(false);
    try {
      const patternObj = selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder
        ? { mimeType: generatedPatterns[selectedPattern].mimeType, base64: generatedPatterns[selectedPattern].base64 }
        : null;

      const brandState = {
        editData, formData, resultadoFinal,
        selectedPaleta, selectedIcon, selectedTipo,
        currentPaletteColors: paletas?.find(p => p.id === selectedPaleta)?.paleta_hex || [],
        paletas, tipografias,
        activeColor: editData.corAtiva,
        pattern: patternObj,
        iconPath: getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null,
        patternGenerationCount,
        estampas,
        papelariaSelecionada,
        plano: 'pro',
      };
      
      ['brandbox_step', 'brandbox_cartao', 'brandbox_crm', 'brandbox_papelaria'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('brandbox_plano', 'pro');
      const extrasCount = Math.max(0, papelariaSelecionada.filter(item => item !== "Caderneta de Saúde").length - 5);

      let sessionIdPro = null;
      try {
        const cleanState = { ...brandState, estampas: null, generatedPatterns: null };
        cleanState.pattern = null;
        const saveRes = await fetch('/api/salvar-entrega', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brandState: cleanState, plano: 'pro', email: formData.email, marca: formData.marca }),
        });
        const saveData = await saveRes.json();
        if (saveData.sessionId) {
          sessionIdPro = saveData.sessionId;
          localStorage.setItem('brandbox_session', sessionIdPro);
        }
      } catch (e) { console.warn('Supabase save failed:', e); }

      let finalPatternUrl = null;
      if (patternObj && sessionIdPro) {
        try {
          const uploadRes = await fetch('/api/salvar-estampa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: patternObj.base64, marca: formData.marca, sessionId: sessionIdPro })
          });
          const uploadData = await uploadRes.json();
          if (uploadData.url) finalPatternUrl = uploadData.url;
        } catch (e) { console.warn('Pattern upload error:', e); }
      }

      if (brandState.pattern && !finalPatternUrl) try { localStorage.setItem('brandbox_pattern', JSON.stringify(brandState.pattern)); } catch {}
      try { localStorage.setItem('brandbox_delivery', JSON.stringify({ ...brandState, pattern: finalPatternUrl ? { url: finalPatternUrl } : null })); } catch {}

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: 'pro', marca: formData.marca, email: formData.email, extrasCount, papelaria: papelariaSelecionada, sessionId: sessionIdPro, lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Houve um problema ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoadingCheckout(false);
    }
  };
"""

content = content.replace(old_click, new_click)
if "const handleCheckoutPro = async () =>" not in content:
    content = content.replace("  return (\n    <div className=", new_fn + "\n  return (\n    <div className=")

content = content.replace(
    """<button onClick={() => setShowPediatriaModal(false)} className="btn-primary" style={{ background: 'var(--accent-magenta)', width: '250px' }}>{dictionary?.checkout?.modal_bonus_btn_save || 'Salvar Escolhas'}</button>""",
    """<button onClick={() => handleCheckoutPro()} className="btn-primary" style={{ background: 'var(--accent-magenta)', width: '270px' }}>{dictionary?.checkout?.modal_bonus_btn_save || 'Salvar e Ir para o Pagamento ✨'}</button>"""
)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactor complete!")
