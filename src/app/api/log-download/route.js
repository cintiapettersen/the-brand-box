import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      email = '', 
      entregaId = '', 
      itemName = 'Asset', 
      eventType = 'download',
      marca = '',
      crm = ''
    } = body;

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const timestampUtc = new Date().toISOString();
    const timestampBrt = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const logEntry = {
      email,
      entrega_id: entregaId,
      item_name: itemName,
      event_type: eventType,
      marca,
      crm,
      ip,
      user_agent: userAgent,
      timestamp_utc: timestampUtc,
      timestamp_brt: timestampBrt,
    };

    console.log('[AUDIT_LOG_DOWNLOAD]', JSON.stringify(logEntry));

    // Salva no Supabase (se a tabela existir no projeto)
    try {
      await supabase
        .from('download_logs')
        .insert([logEntry]);
    } catch (dbErr) {
      // Falha silenciosa para não travar o download do usuário se a tabela não tiver sido criada
      console.warn('[AUDIT_LOG] Aviso ao salvar em download_logs:', dbErr?.message || dbErr);
    }

    return NextResponse.json({ 
      success: true, 
      registered_at: timestampBrt,
      audit_token: Buffer.from(`${email || 'anon'}:${itemName}:${timestampUtc}`).toString('base64')
    });
  } catch (err) {
    console.error('Erro ao processar log de download:', err);
    return NextResponse.json({ error: 'Falha ao registrar log' }, { status: 500 });
  }
}
