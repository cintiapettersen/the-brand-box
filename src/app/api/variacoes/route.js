import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'ID do estilo ausente.' }, { status: 400 });
  }

  try {
    // Buscar variações
    const { data: varData, error: varError } = await supabase
      .from('variacoes_curadas')
      .select('*')
      .eq('estilo_id', id);

    if (varError) throw varError;

    // Buscar moodboard
    const { data: moodData, error: moodError } = await supabase
      .from('moodboards')
      .select('*')
      .eq('estilo_id', id);

    if (moodError) throw moodError;

    // Se não encontrar nada para o estilo solicitado, tenta o fallback para o estilo 1 (segurança)
    if ((!varData || varData.length === 0) && id !== '1') {
      const { data: fallbackData } = await supabase
        .from('variacoes_curadas')
        .select('*')
        .eq('estilo_id', 1);
      
      const { data: fallbackMood } = await supabase
        .from('moodboards')
        .select('*')
        .eq('estilo_id', 1);

      return Response.json({
        variacoes: fallbackData || [],
        moodboard: fallbackMood || [],
        isFallback: true
      });
    }

    return Response.json({
      variacoes: varData || [],
      moodboard: moodData || [],
      isFallback: false
    });
  } catch (err) {
    console.error('API variacoes error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
