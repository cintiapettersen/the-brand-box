import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

export async function POST(request) {
  try {
    const { sessionId, imageUrl, estilo, status } = await request.json();

    if (!sessionId || !imageUrl || !status) {
      return Response.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
    }

    if (status !== 'liked' && status !== 'disliked') {
      return Response.json({ error: 'Status de feedback inválido.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('estampas_feedback')
      .insert([
        {
          session_id: sessionId,
          image_url: imageUrl,
          estilo: estilo || null,
          status: status
        }
      ]);

    if (error) {
      console.error('Erro ao salvar feedback da estampa:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Feedback '${status}' salvo para a estampa da sessão ${sessionId}`);
    return Response.json({ success: true, data });

  } catch (err) {
    console.error('Erro geral ao processar feedback de estampa:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
