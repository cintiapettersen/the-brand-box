import { createClient } from '@supabase/supabase-js';

// Usa service role — roda só no servidor, bypassa o RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return Response.json({ error: 'Session ID ausente.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('entregas')
      .select('brand_data, plano, email, marca, email_enviado, paid, payment_status')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return Response.json({ error: 'Entrega não encontrada.' }, { status: 404 });
    }

    // Regra estrita de autorização (Whitelist):
    // 1. Permitir apenas registros antigos pré-existentes (legados onde payment_status é null/undefined)
    // 2. Permitir registros onde pagamento foi confirmado no servidor (payment_status === 'paid' e paid === true)
    // 3. Negar qualquer outro estado ('pending', 'unpaid', 'failed', desautorizados ou desconhecidos)
    const isLegacyRecord = data.payment_status === null || data.payment_status === undefined;
    const isConfirmedPaid = data.payment_status === 'paid' && data.paid === true;

    if (!isLegacyRecord && !isConfirmedPaid) {
      return Response.json({
        error: 'Acesso não autorizado ou pagamento pendente/não confirmado.',
        payment_status: data.payment_status || 'unauthorized'
      }, { status: 402 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error('get-entrega error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { sessionId, emailEnviado, brandState, plano, email, marca } = await request.json();
    if (!sessionId) return Response.json({ error: 'Session ID ausente.' }, { status: 400 });

    const updates = {};
    if (emailEnviado !== undefined) {
      updates.email_enviado = emailEnviado;
    }
    if (brandState !== undefined) {
      updates.brand_data = brandState;
    }
    if (plano !== undefined) {
      updates.plano = plano;
    }
    if (email !== undefined) {
      updates.email = email;
    }
    if (marca !== undefined) {
      updates.marca = marca;
    }

    // Compatibilidade reversa: se nenhuma propriedade de atualização específica for passada,
    // assume que é a chamada antiga de disparo de e-mail e atualiza email_enviado para true.
    if (Object.keys(updates).length === 0) {
      updates.email_enviado = true;
    }

    const { error } = await supabase
      .from('entregas')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      console.error('PATCH get-entrega Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('PATCH get-entrega unexpected error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
