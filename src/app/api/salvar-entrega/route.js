import { createClient } from '@supabase/supabase-js';

// Usa a service role key (segura, só roda no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined)
);

export async function POST(request) {
  try {
    const { brandState, plano, email, marca } = await request.json();

    if (!brandState) {
      return Response.json({ error: 'Dados da marca ausentes.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('entregas')
      .insert({
        plano: plano || 'experience',
        email: email || null,
        marca: marca || null,
        brand_data: brandState,
        email_enviado: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Disparo imediato do e-mail (background)
    const host = request.headers.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const appUrl = `${protocol}://${host}`;

    fetch(`${appUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, marca, sessionId: data.id, plano }),
    }).then(async () => {
      await supabase.from('entregas').update({ email_enviado: true }).eq('id', data.id);
    }).catch(e => console.error('Immediate email dispatch failed:', e));

    return Response.json({ sessionId: data.id });
  } catch (err) {
    console.error('salvar-entrega error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
