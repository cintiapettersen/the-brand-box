import Stripe from 'stripe';

// The Stripe instance will be created inside the POST handler 
// to avoid breaking the Vercel build if the env var is missing during build time.
const PLANOS = {
  starter: {
    name: 'Brand Box Starter',
    description: 'Logo tipográfica + variações, estampa personalizada, paleta de cores, tipografia, guia de uso da marca e cartão de visita interativo. Arquivos entregues por e-mail imediatamente após o pagamento.',
    amount: 49700,
  },
  pro: {
    name: 'Brand Box Pro',
    description: 'Tudo do Starter + impressos personalizados, templates para Instagram, mockups, ícones, avatares, estampa exclusiva, manifesto e tom de voz da marca. Arquivos entregues por e-mail imediatamente.',
    amount: 89700,
  },
};

export async function POST(request) {
  try {
    const { plano, marca, email, extrasCount = 0, sessionId, avulsoParam, itensSelecionados } = await request.json();
    const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key_for_build');

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Fluxo de itens avulsos (upsell da página de sucesso)
    if (plano === 'avulso' && itensSelecionados?.length > 0) {
      const ITEM_AVULSO_PARAM = {
        'Gráfico de Crescimento': 'grafico',
        'Cartão de Visita': 'cartao-visita',
        'Cartão de Retorno': 'cartao-retorno',
        'Cartão de Agradecimento (10x15cm)': 'agradecimento',
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
      // Compra avulso (sem sessionId, mesmo com múltiplos itens): redireciona para ?avulso=[param]
      // do item principal (avulsoParam, se houver, ou o primeiro selecionado) para continuar no fluxo avulso
      // Compra de múltiplos (upsell de sessão existente): redireciona de volta para a sessão como pro
      const itemParam = !sessionId
        ? (avulsoParam || ITEM_AVULSO_PARAM[itensSelecionados[0]] || encodeURIComponent(itensSelecionados[0]))
        : null;
      const line_items = [];
      const temCaderneta = itensSelecionados.includes("Caderneta de Saúde");
      const itensNormais = itensSelecionados.filter(item => item !== "Caderneta de Saúde");

      // Itens efetivamente pagos nesta sessão — vão na URL de retorno para que o app
      // libere todos eles, mesmo que o item principal (avulsoParam) seja outro.
      const itensComprados = encodeURIComponent(JSON.stringify(itensNormais));
      const successUrl = sessionId
        ? `${origin}/sucesso?session=${sessionId}&plano=avulso&avulso=${avulsoParam || 'inicio'}&upsell=1`
        : itemParam
          ? `${origin}/sucesso?avulso=${itemParam}&itens=${itensComprados}`
          : `${origin}/sucesso?plano=avulso&upsell=1`;

      if (temCaderneta) {
        line_items.push({
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Caderneta de Saúde (Customizada - 124 págs)',
              description: 'Caderneta de Saúde premium customizada com a sua marca (124 páginas).',
            },
            unit_amount: 18000,
          },
          quantity: 1,
        });
      }

      if (itensNormais.length > 0) {
        line_items.push({
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Impressos — Itens Avulsos',
              description: `${itensNormais.length} itens: ${itensNormais.join(', ')}`,
            },
            unit_amount: 3000,
          },
          quantity: itensNormais.length,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'pix'],
        line_items,
        mode: 'payment',
        customer_email: email || undefined,
        metadata: { plano: 'avulso', marca: (marca || '').slice(0, 100), sessionId: sessionId || '', qtd_itens: String(itensSelecionados.length), tem_caderneta: String(temCaderneta) },
        success_url: successUrl,
        cancel_url: avulsoParam
          ? (sessionId ? `${origin}/sucesso?session=${sessionId}&avulso=${avulsoParam}&cancelado=1` : `${origin}/sucesso?avulso=${avulsoParam}&cancelado=1`)
          : `${origin}/sucesso?session=${sessionId || ''}&cancelado=1`,
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
          currency: 'brl',
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
            currency: 'brl',
            product_data: {
              name: 'Gabaritos Extras de Impressos',
              description: `${extrasCountCalculado} itens avulsos de impressos bônus padrão-gráfica.`,
            },
            unit_amount: 3000,
          },
          quantity: extrasCountCalculado,
        });
      }

      if (temCaderneta) {
        line_items.push({
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Caderneta de Saúde (Customizada - 124 págs)',
              description: 'Caderneta de Saúde premium customizada com a sua marca (124 páginas).',
            },
            unit_amount: 18000,
          },
          quantity: 1,
        });
      }
    }

    const successUrl = sessionId
      ? `${origin}/sucesso?session=${sessionId}&plano=${plano}`
      : `${origin}/sucesso?plano=${plano}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items,
      mode: 'payment',
      customer_email: email || undefined,
      metadata: { plano, marca: marca || '', sessionId: sessionId || '' },
      success_url: successUrl,
      cancel_url: `${origin}/?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
