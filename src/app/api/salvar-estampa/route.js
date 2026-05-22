import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'estampas';

export async function POST(request) {
  try {
    const { base64, mimeType, sessionId, allPatterns, replaceUrl, action, selectedUrl } = await request.json();

    if (!sessionId) {
      return Response.json({ error: 'Parâmetros ausentes.' }, { status: 400 });
    }

    // 1. Ação de Seleção da estampa ativa
    if (action === 'select') {
      const { data: current } = await supabase
        .from('entregas')
        .select('brand_data')
        .eq('id', sessionId)
        .single();

      if (current?.brand_data) {
        const updated = {
          ...current.brand_data,
          estampa_url: selectedUrl,
          pattern: base64 ? { base64, mimeType: mimeType || 'image/png' } : current.brand_data.pattern,
        };
        await supabase
          .from('entregas')
          .update({ brand_data: updated })
          .eq('id', sessionId);

        console.log(`🎯 Estampa ativa selecionada para sessão ${sessionId}: ${selectedUrl}`);
        return Response.json({ success: true });
      }
      return Response.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    // 2. Ação de Deleção de estampa
    if (action === 'delete' || (!base64 && replaceUrl)) {
      try {
        const parts = replaceUrl.split(`/storage/v1/object/public/${BUCKET}/`);
        if (parts.length > 1) {
          const relativePath = decodeURIComponent(parts[1]);
          const { error: deleteError } = await supabase.storage
            .from(BUCKET)
            .remove([relativePath]);
          if (deleteError) {
            console.error('Erro ao excluir do Supabase Storage:', deleteError);
          } else {
            console.log('Excluído do Supabase Storage com sucesso:', relativePath);
          }
        }
      } catch (errDelete) {
        console.error('Erro ao processar exclusão no Supabase:', errDelete);
      }

      const { data: current } = await supabase
        .from('entregas')
        .select('brand_data')
        .eq('id', sessionId)
        .single();

      if (current?.brand_data) {
        const prevUrls = current.brand_data.estampas_geradas_urls || [];
        const todasUrls = prevUrls.filter(u => u !== replaceUrl);

        let novaEstampaUrl = current.brand_data.estampa_url;
        let novoPattern = current.brand_data.pattern;

        if (novaEstampaUrl === replaceUrl) {
          novaEstampaUrl = todasUrls[todasUrls.length - 1] || null;
          if (!novaEstampaUrl) novoPattern = null;
        }

        const updated = {
          ...current.brand_data,
          estampa_url: novaEstampaUrl,
          pattern: novoPattern,
          estampas_geradas_urls: todasUrls,
        };
        await supabase
          .from('entregas')
          .update({ brand_data: updated })
          .eq('id', sessionId);

        console.log(`❌ Estampa excluída da sessão ${sessionId}. Restam ${todasUrls.length}`);
        return Response.json({ success: true, remainingUrls: todasUrls });
      }
      return Response.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    // 3. Salvamento normal (nova estampa gerada)
    const buffer = Buffer.from(base64, 'base64');
    const ext = mimeType?.includes('png') ? 'png' : 'jpg';
    const fileName = `${sessionId}/estampa_${Date.now()}.${ext}`;

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

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    const publicUrl = urlData?.publicUrl;

    const extraUrls = [];
    if (allPatterns && allPatterns.length > 1) {
      for (let i = 1; i < allPatterns.length; i++) {
        const p = allPatterns[i];
        if (!p?.base64) continue;
        try {
          const buf = Buffer.from(p.base64, 'base64');
          const ext2 = (p.mimeType || 'image/png').includes('png') ? 'png' : 'jpg';
          const fn = `${sessionId}/estampa_${Date.now()}_${i}.${ext2}`;
          const { error: e2 } = await supabase.storage
            .from(BUCKET)
            .upload(fn, buf, { contentType: p.mimeType || 'image/png', upsert: true });
          if (!e2) {
            const { data: u2 } = supabase.storage.from(BUCKET).getPublicUrl(fn);
            if (u2?.publicUrl) extraUrls.push(u2.publicUrl);
          }
        } catch {}
      }
    }

    const { data: current } = await supabase
      .from('entregas')
      .select('brand_data')
      .eq('id', sessionId)
      .single();

    if (current?.brand_data) {
      const prevUrls = current.brand_data.estampas_geradas_urls || [];
      
      let filteredUrls = prevUrls;
      if (replaceUrl) {
        filteredUrls = prevUrls.filter(u => u !== replaceUrl);
        try {
          const parts = replaceUrl.split(`/storage/v1/object/public/${BUCKET}/`);
          if (parts.length > 1) {
            const relativePath = decodeURIComponent(parts[1]);
            const { error: deleteError } = await supabase.storage
              .from(BUCKET)
              .remove([relativePath]);
            if (deleteError) {
              console.error('Erro ao excluir do Supabase Storage:', deleteError);
            } else {
              console.log('Excluído do Supabase Storage com sucesso:', relativePath);
            }
          }
        } catch (errDelete) {
          console.error('Erro ao processar exclusão no Supabase:', errDelete);
        }
      }

      const todasUrls = [...new Set([...filteredUrls, publicUrl, ...extraUrls])];

      const updated = {
        ...current.brand_data,
        estampa_url: publicUrl,
        estampas_geradas_urls: todasUrls,
      };
      await supabase
        .from('entregas')
        .update({ brand_data: updated })
        .eq('id', sessionId);

      console.log(`✅ ${todasUrls.length} estampa(s) salvas para sessão ${sessionId}`);
    }

    return Response.json({ url: publicUrl, extraUrls });
  } catch (err) {
    console.error('salvar-estampa error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
