import { createClient } from '@supabase/supabase-js';

// Usa service role — roda só no servidor, bypassa o RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('id') || searchParams.get('session') || searchParams.get('session_id') || searchParams.get('project');

    if (!rawId) {
      return Response.json({ error: 'Session ID ausente.' }, { status: 400 });
    }

    const sessionId = rawId.trim();

    // Busca por id ou session_id em entregas
    const { data, error } = await supabase
      .from('entregas')
      .select('id, brand_data, plano, email, marca, email_enviado, paid, payment_status')
      .or(`id.eq.${sessionId},session_id.eq.${sessionId}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return Response.json({ error: 'Entrega não encontrada.' }, { status: 404 });
    }

    // Regra flexível de autorização (Compatibilidade legada):
    // Permite se payment_status for paid/complete/succeeded ou null/undefined (antigos), ou se paid != false
    const status = (data.payment_status || '').toLowerCase();
    const isPaidStatus = !status || status === 'paid' || status === 'complete' || status === 'completed' || status === 'succeeded';
    const isNotExplicitlyFailed = data.paid !== false && status !== 'failed' && status !== 'unpaid';

    if (!isPaidStatus && !isNotExplicitlyFailed) {
      return Response.json({
        error: 'Acesso não autorizado ou pagamento pendente/não confirmado.',
        payment_status: data.payment_status || 'unauthorized'
      }, { status: 402 });
    }

    // Parse brand_data se for string JSON
    let brand_data = data.brand_data;
    if (typeof brand_data === 'string') {
      try { brand_data = JSON.parse(brand_data); } catch (e) { console.error('Failed to parse brand_data JSON in API:', e); }
    }

    return Response.json({ data: { ...data, brand_data } });
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
