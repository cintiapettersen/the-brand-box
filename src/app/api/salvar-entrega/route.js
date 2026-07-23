import { createClient } from '@supabase/supabase-js';

// Usa a service role key (segura, só roda no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

export async function POST(request) {
  try {
    const { brandState, plano, email, marca, sessionId } = await request.json();

    if (!brandState) {
      return Response.json({ error: 'Dados da marca ausentes.' }, { status: 400 });
    }

    // Se um sessionId de rascunho foi fornecido, verifica se a entrega existe e ainda é rascunho (não paga)
    if (sessionId) {
      const { data: existing } = await supabase
        .from('entregas')
        .select('id, paid, payment_status')
        .eq('id', sessionId)
        .maybeSingle();

      if (existing && !existing.paid && existing.payment_status !== 'paid') {
        const { data: updatedData, error: updateError } = await supabase
          .from('entregas')
          .update({
            plano: plano || 'experience',
            email: email || null,
            marca: marca || null,
            brand_data: brandState,
          })
          .eq('id', sessionId)
          .select('id')
          .single();

        if (!updateError && updatedData) {
          return Response.json({ sessionId: updatedData.id });
        }
      }
    }

    // Se não houver sessionId ou se a busca por ID falhar/for já paga, cria uma nova entrega rascunho
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
