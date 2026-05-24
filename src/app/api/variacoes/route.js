import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL está ausente no ambiente do servidor.");
    }
    if (!key) {
      throw new Error("Ambas as chaves SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_ANON_KEY estão ausentes no ambiente do servidor.");
    }
    
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');

  if (!idStr) {
    return Response.json({ error: 'ID do estilo ausente.' }, { status: 400 });
  }

  const id = parseInt(idStr, 10);

  try {
    const supabase = getSupabase();
    
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
    if ((!varData || varData.length === 0) && id !== 1) {
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
