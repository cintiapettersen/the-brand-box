import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

async function sendAccessEmailIdempotent(entrega, sessionId, lang = 'pt-BR') {
  try {
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;
    if (!smtpEmail || !smtpPassword) {
      console.warn('⚠️ SMTP_EMAIL ou SMTP_PASSWORD não configurados. Pulando envio de e-mail.');
      return;
    }

    // 🔒 OPERAÇÃO ATÔMICA NO SUPABASE (Resolução de Condição de Corrida)
    // Tenta reservar atomicamente o direito de enviar o e-mail via UPDATE condicional no Postgres.
    // Se duas requisições concorrentes executarem este bloco juntas, apenas UMA conseguirá atualizar
    // o registro onde email_enviado === false e retornará o id afetado.
    const { data: claimData, error: claimErr } = await supabase
      .from('entregas')
      .update({ email_enviado: true })
      .eq('id', sessionId)
      .eq('email_enviado', false)
      .select('id');

    if (claimErr) {
      console.error('❌ Erro de reserva atômica no Supabase:', claimErr);
      return;
    }

    if (!claimData || claimData.length === 0) {
      console.log(`ℹ️ E-mail já enviado ou reservado por requisição concorrente para entrega ${sessionId}. Ignorando.`);
      return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thebrandbox.sonhodepapel.com';
    const emailRes = await fetch(`${appUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: entrega.email,
        marca: entrega.marca,
        sessionId,
        plano: entrega.plano,
        lang,
      }),
    });

    if (emailRes.ok) {
      console.log(`✅ E-mail de acesso enviado com sucesso para ${entrega.email}`);
    } else {
      console.error('❌ Erro na API /api/send-email. Revertendo reserva de envio.');
      // Se o envio falhar (ex: erro de rede/SMTP), reverte email_enviado para permitir nova tentativa pelo Stripe
      await supabase
        .from('entregas')
        .update({ email_enviado: false })
        .eq('id', sessionId);
    }
  } catch (err) {
    console.error('❌ Erro inesperado no envio de e-mail do webhook:', err);
    try {
      await supabase.from('entregas').update({ email_enviado: false }).eq('id', sessionId);
    } catch {}
  }
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // 🔴 1. Se STRIPE_WEBHOOK_SECRET não estiver configurado, recusa com erro 500 sem processar
  if (!webhookSecret) {
    console.error('❌ ERRO CRÍTICO: STRIPE_WEBHOOK_SECRET não configurado.');
    return Response.json({ error: 'Webhook secret not configured on server.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');

  // 🔴 2. Se o header stripe-signature estiver ausente, recusa com erro 400
  if (!signature) {
    console.error('❌ ERRO: Header stripe-signature ausente.');
    return Response.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.replace(/['"]/g, '') : undefined;
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY missing in runtime environment');
    return Response.json({ error: 'payment_configuration_error' }, { status: 503 });
  }
  const stripe = new Stripe(stripeSecretKey);

  const body = await request.text();
  let event;

  // 🔴 3. Validação estrita da assinatura do Stripe (sem fallbacks de JSON não assinado)
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`❌ ERRO: Assinatura de Webhook inválida.`);
    return Response.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  const session = event.data?.object;
  const sessionId = session?.metadata?.sessionId;

  console.log(`🔔 Stripe Webhook legítimo recebido: [${event.type}] para entrega ID: ${sessionId || 'N/A'}`);

  if (!sessionId) {
    return Response.json({ received: true, note: 'Sessão sem metadata.sessionId' });
  }

  const { data: entrega, error: fetchErr } = await supabase
    .from('entregas')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchErr || !entrega) {
    console.warn(`⚠️ Entrega com ID ${sessionId} não encontrada.`);
    return Response.json({ received: true, error: 'Entrega não encontrada' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const isPaid = session.payment_status === 'paid';
      const isFreeOrder = session.payment_status === 'no_payment_required' || session.amount_total === 0;

      if (isPaid || isFreeOrder) {
        console.log(`✅ Pagamento verificado e confirmado para entrega ${sessionId}`);
        
        await supabase
          .from('entregas')
          .update({
            paid: true,
            payment_status: 'paid',
            stripe_session_id: session.id,
            stripe_event_id: event.id,
          })
          .eq('id', sessionId);

        await sendAccessEmailIdempotent(entrega, sessionId, session.locale === 'en' ? 'en' : 'pt-BR');
      } else if (session.payment_status === 'unpaid') {
        console.log(`⏳ Pagamento pendente (ex: Pix) registrado para entrega ${sessionId}`);
        await supabase
          .from('entregas')
          .update({
            paid: false,
            payment_status: 'unpaid',
            stripe_session_id: session.id,
            stripe_event_id: event.id,
          })
          .eq('id', sessionId);
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      console.log(`✅ Pagamento assíncrono (Pix) confirmado para entrega ${sessionId}`);
      await supabase
        .from('entregas')
        .update({
          paid: true,
          payment_status: 'paid',
          stripe_session_id: session.id,
          stripe_event_id: event.id,
        })
        .eq('id', sessionId);

      await sendAccessEmailIdempotent(entrega, sessionId, session.locale === 'en' ? 'en' : 'pt-BR');
      break;
    }

    case 'checkout.session.async_payment_failed': {
      console.warn(`❌ Pagamento assíncrono (Pix) falhou ou expirou para entrega ${sessionId}`);
      await supabase
        .from('entregas')
        .update({
          paid: false,
          payment_status: 'failed',
          stripe_session_id: session.id,
          stripe_event_id: event.id,
        })
        .eq('id', sessionId);
      break;
    }

    default:
      console.log(`ℹ️ Evento não tratado: ${event.type}`);
  }

  return Response.json({ received: true });
}
