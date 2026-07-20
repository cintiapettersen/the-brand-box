import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleUpsellCheckout
old_upsell_checkout = """        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plano: 'avulso',
            marca: delivery.formData?.marca || delivery.editData?.marca || brand?.editData?.marca || '',
            email: delivery.formData?.email || brand?.formData?.email || '',
            sessionId,
            avulsoParam,
            itensSelecionados: itensParaCobrar,
            lang,
          }),
        });"""

new_upsell_checkout = """        if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
          const successUrl = sessionId
            ? `/sucesso?session=${sessionId}&plano=avulso&avulso=${avulsoParam || encodeURIComponent(itensParaCobrar[0]||'')}&upsell=1&lang=${lang}`
            : `/sucesso?plano=avulso&upsell=1&lang=${lang}`;
          window.location.href = successUrl;
          return;
        }

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plano: 'avulso',
            marca: delivery.formData?.marca || delivery.editData?.marca || brand?.editData?.marca || '',
            email: delivery.formData?.email || brand?.formData?.email || '',
            sessionId,
            avulsoParam,
            itensSelecionados: itensParaCobrar,
            lang,
          }),
        });"""

content = content.replace(old_upsell_checkout, new_upsell_checkout)

# Update listener checkout
old_listener_checkout = """          const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: next,
              brandId: brand.id,
              email: brand.email || brand.formData?.email || '',
              marca: marca || '',
              plano: plano || brand.plano || 'avulso',
              returnUrl: window.location.href,
              sessionId: brand.sessionId || brand.id
            }),
          });"""

new_listener_checkout = """          if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
             const url = new URL(window.location.href);
             url.searchParams.set('upsell', '1');
             window.location.href = url.toString();
             return;
          }

          const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: next,
              brandId: brand.id,
              email: brand.email || brand.formData?.email || '',
              marca: marca || '',
              plano: plano || brand.plano || 'avulso',
              returnUrl: window.location.href,
              sessionId: brand.sessionId || brand.id
            }),
          });"""

content = content.replace(old_listener_checkout, new_listener_checkout)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Upsell demo bypass implemented")
