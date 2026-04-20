import Stripe from 'stripe';

// The Stripe instance will be created inside the POST handler 
// to avoid breaking the Vercel build if the env var is missing during build time.
const PLANOS = {
  experience: {
    name: 'Brand Box Experience',
    description: 'Logo tipográfica + variações, estampa personalizada, paleta de cores, tipografia, guia de uso da marca e cartão de visita interativo. Arquivos entregues por e-mail imediatamente após o pagamento.',
    amount: 49700,
  },
  complete: {
    name: 'Brand Box Complete',
    description: 'Tudo do Experience + papelaria personalizada, templates para Instagram, mockups, ícones, avatares, estampa exclusiva, manifesto e tom de voz da marca. Arquivos entregues por e-mail em até 2 dias úteis.',
    amount: 89700,
  },
};

export async function POST(request) {
  try {
    const { plano, marca, email } = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build');

    const planoData = PLANOS[plano];
    if (!planoData) {
      return Response.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planoData.name,
              description: planoData.description,
            },
            unit_amount: planoData.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      metadata: { plano, marca: marca || '' },
      success_url: `${origin}/sucesso?plano=${plano}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
