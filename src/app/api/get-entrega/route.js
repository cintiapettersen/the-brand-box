import { createClient } from '@supabase/supabase-js';
import { mergePaletteIntoBrandData, isExplicitlyPaid, verifyDeliveryAuthorization } from '../../../lib/paletteValidation.js';

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
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId);

    let data = null;
    let error = null;

    // 1. Método de acesso preferencial: UUID direto da entrega
    if (isUUID) {
      const res = await supabase
        .from('entregas')
        .select('id, brand_data, plano, email, marca, email_enviado, paid, payment_status, stripe_session_id')
        .eq('id', sessionId)
        .maybeSingle();
      data = res.data;
      error = res.error;
    }

    // 2. Acesso via Stripe Checkout Session ID de alta entropia (cs_live_... / cs_test_...)
    if (!data && (sessionId.startsWith('cs_live_') || sessionId.startsWith('cs_test_') || sessionId.startsWith('cs_'))) {
      const res = await supabase
        .from('entregas')
        .select('id, brand_data, plano, email, marca, email_enviado, paid, payment_status, stripe_session_id')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();
      data = res.data;
      error = res.error;
    }

    if (error || !data) {
      return Response.json({ error: 'Entrega não encontrada.' }, { status: 404 });
    }

    // Validação estrita de pagamento e conclusão (fail-closed, sem regras permissivas de !status)
    if (!isExplicitlyPaid(data)) {
      return Response.json({
        error: 'Acesso não autorizado ou pagamento pendente/não confirmado.',
        payment_status: data.payment_status || 'unconfirmed'
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
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;

    let body = {};
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Payload JSON inválido.' }, { status: 400 });
    }

    const {
      deliveryId,
      id,
      sessionId,
      accessCredential: bodyCredential,
      sessionToken,
      token,
      paletteUpdate,
      brandState,
      emailEnviado,
      plano,
      email,
      marca,
    } = body;

    const accessCredential = (bodyCredential || sessionToken || token || bearerToken || '').trim();
    const targetId = (deliveryId || id || sessionId || '').trim();

    if (!targetId) {
      return Response.json({ error: 'Identificador da entrega ausente.' }, { status: 400 });
    }

    if (!accessCredential) {
      return Response.json({ error: 'Credencial de acesso não fornecida.' }, { status: 401 });
    }

    // 1. Carregar entrega existente no banco
    const { data: existing, error: fetchErr } = await supabase
      .from('entregas')
      .select('id, brand_data, plano, email, marca, email_enviado, paid, payment_status, stripe_session_id')
      .eq('id', targetId)
      .maybeSingle();

    if (fetchErr || !existing) {
      return Response.json({ error: 'Entrega não encontrada.' }, { status: 404 });
    }

    // 2. Autorização estrita e validação de pagamento comprovado
    const authResult = verifyDeliveryAuthorization(existing, accessCredential);
    if (!authResult.authorized) {
      return Response.json({
        error: authResult.error,
        ...(authResult.payment_status ? { payment_status: authResult.payment_status } : {})
      }, { status: authResult.status });
    }

    const updates = {};

    // 3. Atualização de paleta (whitelist rigoroso e merge não-destrutivo no servidor)
    const incomingPaletteData = paletteUpdate || (brandState?.currentPaletteColors ? {
      currentPaletteColors: brandState.currentPaletteColors,
      colorOrder: brandState.colorOrder,
      activeColor: brandState.activeColor,
    } : null);

    if (incomingPaletteData) {
      try {
        const mergedBrandData = mergePaletteIntoBrandData(existing.brand_data, incomingPaletteData);
        updates.brand_data = mergedBrandData;
      } catch (valErr) {
        return Response.json({ error: valErr.message || 'Dados de paleta inválidos.' }, { status: 400 });
      }
    }

    // 4. Compatibilidade com elemento de marca selecionado
    if (brandState?.selectedBrandElementId !== undefined) {
      const baseBrandData = updates.brand_data || (typeof existing.brand_data === 'string' ? JSON.parse(existing.brand_data) : existing.brand_data) || {};
      updates.brand_data = {
        ...baseBrandData,
        selectedBrandElementId: brandState.selectedBrandElementId,
        brandElement: brandState.brandElement,
        editData: {
          ...(baseBrandData.editData || {}),
          brandElement: brandState.brandElement,
        }
      };
    }

    if (emailEnviado !== undefined) {
      updates.email_enviado = Boolean(emailEnviado);
    }
    if (plano !== undefined && typeof plano === 'string') {
      updates.plano = plano;
    }
    if (email !== undefined && typeof email === 'string') {
      updates.email = email;
    }
    if (marca !== undefined && typeof marca === 'string') {
      updates.marca = marca;
    }

    if (Object.keys(updates).length === 0) {
      updates.email_enviado = true;
    }

    const { data: updatedRows, error: updateErr } = await supabase
      .from('entregas')
      .update(updates)
      .eq('id', existing.id)
      .select('id, brand_data');

    if (updateErr) {
      console.error('PATCH get-entrega Supabase error:', updateErr);
      return Response.json({ error: 'Erro ao atualizar dados da entrega.' }, { status: 500 });
    }

    if (!updatedRows || updatedRows.length === 0) {
      return Response.json({ error: 'Nenhum registro de entrega atualizado no banco.' }, { status: 404 });
    }

    const savedRecord = updatedRows[0];
    let persistedColors = null;
    if (savedRecord.brand_data) {
      const parsed = typeof savedRecord.brand_data === 'string' ? JSON.parse(savedRecord.brand_data) : savedRecord.brand_data;
      persistedColors = parsed?.currentPaletteColors || parsed?.editData?.colors || null;
    }

    return Response.json({
      ok: true,
      updated: true,
      deliveryId: savedRecord.id,
      currentPaletteColors: persistedColors,
    });
  } catch (err) {
    console.error('PATCH get-entrega unexpected error:', err);
    return Response.json({ error: 'Erro inesperado ao processar requisição.' }, { status: 500 });
  }
}
