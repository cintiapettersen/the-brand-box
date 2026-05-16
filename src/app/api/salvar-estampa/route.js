import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'estampas';

export async function POST(request) {
  try {
    const { base64, mimeType, sessionId } = await request.json();

    if (!base64 || !sessionId) {
      return Response.json({ error: 'Parâmetros ausentes.' }, { status: 400 });
    }

    // Converte base64 para Buffer
    const buffer = Buffer.from(base64, 'base64');
    const ext = mimeType?.includes('png') ? 'png' : 'jpg';
    const fileName = `${sessionId}/estampa_${Date.now()}.${ext}`;

    // Upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: mimeType || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    // Gera URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    const publicUrl = urlData?.publicUrl;

    // Salva a URL dentro do brand_data (sem precisar de coluna nova)
    // Primeiro busca o brand_data atual
    const { data: current } = await supabase
      .from('entregas')
      .select('brand_data')
      .eq('id', sessionId)
      .single();

    if (current?.brand_data) {
      const updated = { ...current.brand_data, estampa_url: publicUrl };
      await supabase
        .from('entregas')
        .update({ brand_data: updated })
        .eq('id', sessionId);
    }

    return Response.json({ url: publicUrl });
  } catch (err) {
    console.error('salvar-estampa error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
