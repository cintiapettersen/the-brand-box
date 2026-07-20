import re
import json

# 1. Update dictionaries
for filename in ['src/dictionaries/pt.json', 'src/dictionaries/en.json']:
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'landing' in data and 'criar_marca' in data['landing']:
        data['landing']['criar_marca'] = "START BUILDING MY BRAND"
        
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 2. Update page.js
with open('src/app/[lang]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add demo param check in useEffect
old_use_effect = """  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get('utm_source') || params.get('source') || 'Direct');
  }, []);"""

new_use_effect = """  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get('utm_source') || params.get('source') || 'Direct');
    if (params.get('demo') === 'BUILDWEEK100') {
      localStorage.setItem('brandbox_demo_mode', 'BUILDWEEK100');
    }
  }, []);"""

content = content.replace(old_use_effect, new_use_effect)

# Update starter checkout logic
old_starter_checkout = """                          const res = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plano: 'starter', marca: formData.marca, email: formData.email, sessionId: sessionIdExp, lang }),
                          });"""

new_starter_checkout = """                          if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
                            const successUrl = sessionIdExp
                              ? `/sucesso?session=${sessionIdExp}&plano=starter&lang=${lang}`
                              : `/sucesso?plano=starter&lang=${lang}`;
                            window.location.href = successUrl;
                            return;
                          }

                          const res = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plano: 'starter', marca: formData.marca, email: formData.email, sessionId: sessionIdExp, lang }),
                          });"""
content = content.replace(old_starter_checkout, new_starter_checkout)

# Update pro checkout logic
old_pro_checkout = """      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: 'pro', marca: formData.marca, email: formData.email, extrasCount, papelaria: papelariaSelecionada, sessionId: sessionIdPro, lang }),
      });"""

new_pro_checkout = """      if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
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
      });"""
content = content.replace(old_pro_checkout, new_pro_checkout)

with open('src/app/[lang]/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Demo bypass implemented")
