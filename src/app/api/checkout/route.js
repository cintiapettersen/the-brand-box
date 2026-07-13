import Stripe from 'stripe';

export async function POST(request) {
  try {
    const { plano, marca, email, extrasCount = 0, sessionId, avulsoParam, itensSelecionados, papelaria, lang = 'pt' } = await request.json();
    const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key_for_build');

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const isEn = lang === 'en';
    const currency = isEn ? 'usd' : 'brl';
    const locale = isEn ? 'en' : 'pt-BR';

    const PLANOS = {
      starter: {
        name: isEn ? 'Brand Box Starter' : 'Brand Box Starter',
        description: isEn 
          ? 'Typographic logo + variations, custom pattern, color palette, typography, brand guidelines, and interactive digital card. Files delivered by email immediately.' 
          : 'Logo tipográfica + variações, estampa personalizada, paleta de cores, tipografia, guia de uso da marca e cartão de visita interativo. Arquivos entregues por e-mail imediatamente após o pagamento.',
        amount: isEn ? 9800 : 49700,
      },
      pro: {
        name: isEn ? 'Brand Box Studio' : 'Brand Box Pro',
        description: isEn 
          ? 'Everything in Starter + custom stationery, Instagram templates, mockups, icons, avatars, exclusive pattern, brand manifesto and tone of voice. Delivered immediately.' 
          : 'Tudo do Starter + impressos personalizados, templates para Instagram, mockups, ícones, avatares, estampa exclusiva, manifesto e tom de voz da marca. Arquivos entregues por e-mail imediatamente.',
        amount: isEn ? 17376 : 89700,
      },
    };

    // Fluxo de itens avulsos (upsell da página de sucesso)
    if (plano === 'avulso' && itensSelecionados?.length > 0) {
      const ITEM_AVULSO_PARAM = {
        'Gráfico de Crescimento': 'grafico',
        'Cartão de Visita': 'cartao-visita',
        'Cartão de Retorno': 'cartao-retorno',
        'Cartão de Agradecimento (10x15cm)': 'agradecimento',
        'Capa de Caderno / Agenda': 'caderno',
        'Papel Timbrado': 'papel-timbrado',
        'Papel de Presente': 'papel-presente',
        'Tag para Sacola': 'tag-sacola',
        'Etiqueta para Correios': 'etiqueta',
        'Envelope Ofício (23x11,5cm)': 'envelope-oficio',
        'Envelope Saco (24x34cm)': 'envelope-saco',
        'Recibo': 'recibo',
        'Pasta A4': 'pasta',
        'Caneca': 'caneca',
        'Caderno (Capa e Contra-capa)': 'caderno',
        'Receituário Padrão (A4 e A5)': 'receituario',
        'Atestado Médico (A4 e A5)': 'atestado',
        'Receituário de Controle Especial': 'controle-especial',
        'Prontuário Médico': 'prontuario',
        'Receita de Alta': 'receita-alta',
        'Ficha de Cadastro': 'ficha',
        'Guia Alimentar': 'guia-alimentar',
        'Guia de Cuidados': 'guia-cuidados',
        'Guia de Desenvolvimento': 'guia-desenvolvimento',
        'Guia de Vacina c/ Calendário': 'guia-vacina',
        'Cartão de Exame Pré-Natal': 'prenatal',
        'Checklist Maternidade': 'checklist',
        'Guia do Sono': 'guia-sono',
        'Orientações p/ Recém Nascidos': 'orientacoes-rn',
        'Certificado de Coragem': 'certificado',
        'Diário do Xixi': 'diario-xixi',
        'Meu Pratinho': 'pratinho',
        'Guia de Amamentação': 'amamentacao',
      };
      const itemParam = !sessionId
        ? (avulsoParam || ITEM_AVULSO_PARAM[itensSelecionados[0]] || encodeURIComponent(itensSelecionados[0]))
        : null;
      const line_items = [];
      const temCaderneta = itensSelecionados.includes("Caderneta de Saúde");
      const itensNormais = itensSelecionados.filter(item => item !== "Caderneta de Saúde");

      const itensComprados = encodeURIComponent(JSON.stringify(itensNormais));
      const successUrl = sessionId
        ? `${origin}/sucesso?session=${sessionId}&plano=avulso&avulso=${avulsoParam || 'inicio'}&upsell=1&lang=${lang}`
        : itemParam
          ? `${origin}/sucesso?avulso=${itemParam}&itens=${itensComprados}&lang=${lang}`
          : `${origin}/sucesso?plano=avulso&upsell=1&lang=${lang}`;

      if (temCaderneta) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: isEn ? 'Health Record Booklet (Custom - 124 pages)' : 'Caderneta de Saúde (Customizada - 124 págs)',
              description: isEn ? 'Premium health record booklet custom-made with your brand (124 pages).' : 'Caderneta de Saúde premium customizada com a sua marca (124 páginas).',
            },
            unit_amount: isEn ? 3500 : 18000,
          },
          quantity: 1,
        });
      }

      if (itensNormais.length > 0) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: isEn ? 'Stationery — Extra Items' : 'Impressos — Itens Avulsos',
              description: isEn ? `${itensNormais.length} items: ${itensNormais.join(', ')}` : `${itensNormais.length} itens: ${itensNormais.join(', ')}`,
            },
            unit_amount: isEn ? 700 : 3000,
          },
          quantity: itensNormais.length,
        });
      }

      const payment_method_types = isEn ? ['card'] : ['card', 'pix'];

      const session = await stripe.checkout.sessions.create({
        payment_method_types,
        line_items,
        mode: 'payment',
        locale,
        customer_email: email || undefined,
        metadata: { plano: 'avulso', marca: (marca || '').slice(0, 100), sessionId: sessionId || '', qtd_itens: String(itensSelecionados.length), tem_caderneta: String(temCaderneta) },
        success_url: successUrl,
        cancel_url: avulsoParam
          ? (sessionId ? `${origin}/sucesso?session=${sessionId}&avulso=${avulsoParam}&cancelado=1&lang=${lang}` : `${origin}/sucesso?avulso=${avulsoParam}&cancelado=1&lang=${lang}`)
          : `${origin}/sucesso?session=${sessionId || ''}&cancelado=1&lang=${lang}`,
      });
      return Response.json({ url: session.url });
    }

    const planoData = PLANOS[plano];
    if (!planoData) {
      return Response.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: planoData.name, description: planoData.description },
          unit_amount: planoData.amount,
        },
        quantity: 1,
      },
    ];

    if (plano === 'pro') {
      const temCaderneta = papelaria && papelaria.includes("Caderneta de Saúde");
      const extrasCountCalculado = papelaria
        ? Math.max(0, papelaria.filter(item => item !== "Caderneta de Saúde").length - 5)
        : (extrasCount || 0);

      if (extrasCountCalculado > 0) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: isEn ? 'Extra Stationery Templates' : 'Gabaritos Extras de Impressos',
              description: isEn ? `${extrasCountCalculado} extra standard stationery items.` : `${extrasCountCalculado} itens avulsos de impressos bônus padrão-gráfica.`,
            },
            unit_amount: isEn ? 700 : 3000,
          },
          quantity: extrasCountCalculado,
        });
      }

      if (temCaderneta) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: isEn ? 'Health Record Booklet (Custom - 124 pages)' : 'Caderneta de Saúde (Customizada - 124 págs)',
              description: isEn ? 'Premium health record booklet custom-made with your brand (124 pages).' : 'Caderneta de Saúde premium customizada com a sua marca (124 páginas).',
            },
            unit_amount: isEn ? 3500 : 18000,
          },
          quantity: 1,
        });
      }
    }

    const payment_method_types = isEn ? ['card'] : ['card', 'pix'];

    const successUrl = sessionId
      ? `${origin}/sucesso?session=${sessionId}&plano=${plano}&lang=${lang}`
      : `${origin}/sucesso?plano=${plano}&lang=${lang}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      line_items,
      mode: 'payment',
      locale,
      customer_email: email || undefined,
      metadata: { plano, marca: marca || '', sessionId: sessionId || '' },
      success_url: successUrl,
      cancel_url: `${origin}/?canceled=1&lang=${lang}`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
