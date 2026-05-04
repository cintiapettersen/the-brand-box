import Stripe from 'stripe';

// The Stripe instance will be created inside the POST handler 
// to avoid breaking the Vercel build if the env var is missing during build time.
const PLANOS = {
  experience: {
    name: 'Brand Box Starter',
    description: 'Logo tipográfica + variações, estampa personalizada, paleta de cores, tipografia, guia de uso da marca e cartão de visita interativo. Arquivos entregues por e-mail imediatamente após o pagamento.',
    amount: 49700,
  },
  complete: {
    name: 'Brand Box Pro',
    description: 'Tudo do Experience + papelaria personalizada, templates para Instagram, mockups, ícones, avatares, estampa exclusiva, manifesto e tom de voz da marca. Arquivos entregues por e-mail em até 2 dias úteis.',
    amount: 89700,
  },
};

export async function POST(request) {
  try {
    const { plano, marca, email, extrasCount = 0, sessionId, itensSelecionados } = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build');

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Fluxo de itens avulsos (upsell da página de sucesso)
    if (plano === 'avulso' && itensSelecionados?.length > 0) {
      const itensParam = encodeURIComponent(JSON.stringify(itensSelecionados));
      const successUrl = sessionId
        ? `${origin}/sucesso?session=${sessionId}&plano=pro&novosItens=${itensParam}`
        : `${origin}/sucesso?plano=pro&novosItens=${itensParam}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'pix'],
        line_items: [{
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Papelaria — Itens Avulsos',
              description: `${itensSelecionados.length} itens: ${itensSelecionados.join(', ')}`,
            },
            unit_amount: 3000,
          },
          quantity: itensSelecionados.length,
        }],
        mode: 'payment',
        customer_email: email || undefined,
        metadata: { plano: 'avulso', marca: marca || '', sessionId: sessionId || '', itens: itensSelecionados.join('|') },
        success_url: successUrl,
        cancel_url: `${origin}/sucesso?session=${sessionId || ''}&cancelado=1`,
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

    if (plano === 'pro' && extrasCount > 0) {
      line_items.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Gabaritos Extras de Papelaria',
            description: `${extrasCount} itens avulsos de papelaria padrão-gráfica.`,
          },
          unit_amount: 3000,
        },
        quantity: extrasCount,
      });
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
