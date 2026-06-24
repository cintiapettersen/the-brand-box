import { createClient } from '@supabase/supabase-js';

// Usa service role — roda só no servidor, bypassa o RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined)
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
      .select('brand_data, plano, email, marca, email_enviado')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return Response.json({ error: 'Entrega não encontrada.' }, { status: 404 });
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
