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
    const { sessionId } = await request.json();
    if (!sessionId) return Response.json({ error: 'Session ID ausente.' }, { status: 400 });

    await supabase
      .from('entregas')
      .update({ email_enviado: true })
      .eq('id', sessionId);

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
