import { createClient } from '@supabase/supabase-js';

// Usa a service role key (segura, só roda no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
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
        payment_status: 'pending',
        paid: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ sessionId: data.id });
  } catch (err) {
    console.error('salvar-entrega error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
