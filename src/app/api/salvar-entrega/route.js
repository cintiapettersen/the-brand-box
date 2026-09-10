import { createClient } from '@supabase/supabase-js';
import { linkJourneyToDelivery } from '../../../lib/aiTelemetry.js';

// Usa a service role key (segura, só roda no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

export async function POST(request) {
  try {
    const { brandState, plano, email, marca, sessionId, journeyId: explicitJourneyId } = await request.json();
    const journeyId = explicitJourneyId || brandState?.resultadoFinal?.creativeDirectorJourneyId || null;

    if (!brandState) {
      return Response.json({ error: 'Dados da marca ausentes.' }, { status: 400 });
    }

    const finishWithSession = async (resId) => {
      if (journeyId && resId) {
        try {
          await linkJourneyToDelivery(journeyId, resId);
        } catch (linkErr) {
          console.warn('[salvar-entrega] Could not link journey to delivery:', linkErr);
        }
      }
      return Response.json({ sessionId: resId });
    };

    // 1. Se um sessionId de rascunho foi fornecido, verifica se a entrega existe e ainda é rascunho pendente
    if (sessionId) {
      const { data: existing } = await supabase
        .from('entregas')
        .select('id, paid, payment_status, marca')
        .eq('id', sessionId)
        .maybeSingle();

      // Garante que:
      // - Registro existente ainda não foi pago e está como 'pending' (não reutiliza registros superseded, abandoned ou paid)
      // - Não sobrescreve um projeto genuinamente novo se o nome da marca foi alterado
      const existingMarca = (existing?.marca || '').trim().toLowerCase();
      const currentMarca = (marca || '').trim().toLowerCase();
      const brandMatches = !existingMarca || !currentMarca || existingMarca === currentMarca;

      if (existing && !existing.paid && existing.payment_status === 'pending' && brandMatches) {
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
          return await finishWithSession(updatedData.id);
        }
      }
    }

    // 2. Fallback escopado: se nenhum sessionId foi passado ou se não encontrou pelo ID,
    // busca rascunho pendente do MESMO cliente E DA MESMA MARCA (escopo estrito por email + marca + pending).
    // Jamais reutiliza rascunhos de marcas diferentes do mesmo cliente.
    if (email && marca) {
      const { data: draft } = await supabase
        .from('entregas')
        .select('id, paid, payment_status, marca')
        .ilike('email', email.trim())
        .ilike('marca', marca.trim())
        .eq('paid', false)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (draft && !draft.paid && draft.payment_status === 'pending') {
        const { data: updatedData, error: updateError } = await supabase
          .from('entregas')
          .update({
            plano: plano || 'experience',
            email: email || null,
            marca: marca || null,
            brand_data: brandState,
          })
          .eq('id', draft.id)
          .select('id')
          .single();

        if (!updateError && updatedData) {
          return await finishWithSession(updatedData.id);
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

    return await finishWithSession(data.id);
  } catch (err) {
    console.error('salvar-entrega error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
