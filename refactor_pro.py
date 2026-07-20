import re

with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

handle_checkout_pro = """  const handleCheckoutPro = async () => {
    setLoadingCheckout('pro');
    setShowPediatriaModal(false);
    try {
      const patternObj = selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder
        ? { mimeType: generatedPatterns[selectedPattern].mimeType, base64: generatedPatterns[selectedPattern].base64 }
        : null;

      const brandState = {
        editData, formData, resultadoFinal,
        selectedPaleta, selectedIcon, selectedTipo,
        paletas, tipografias,
        activeColor: editData.corAtiva,
        pattern: patternObj,
        iconPath: getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null,
        patternGenerationCount,
        estampas,
        papelariaSelecionada,
      };

      ['brandbox_step', 'brandbox_cartao', 'brandbox_crm', 'brandbox_plano', 'brandbox_papelaria'].forEach(k => localStorage.removeItem(k));
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

      if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
        const successUrl = sessionIdPro
          ? `/sucesso?session=${sessionIdPro}&plano=pro&lang=${lang}`
          : `/sucesso?plano=pro&lang=${lang}`;
        window.location.href = successUrl;
        return;
      }

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

if "const handleCheckoutPro =" not in content:
    content = content.replace("  return (\n    <div style={{ display: 'flex'", handle_checkout_pro + "  return (\n    <div style={{ display: 'flex'")
    with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected handleCheckoutPro")
else:
    print("Already injected")
