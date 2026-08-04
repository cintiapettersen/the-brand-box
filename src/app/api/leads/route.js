import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      nome, 
      email, 
      source, 
      last_step, 
      project_completed, 
      accepts_marketing,
      marketing_consent,
      marketing_consent_at,
      marketing_consent_source,
      marketing_consent_version
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const hasMarketingOptIn = marketing_consent === true || accepts_marketing === true;

    // Primeiro tentamos ver se o lead já existe
    const { data: existing, error: searchError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email);

    if (searchError) {
      console.error('Erro ao buscar lead no Supabase:', searchError);
    }

    if (existing && existing.length > 0) {
      // Atualiza o lead existente
      const updateData = {};
      if (nome) updateData.nome = nome;
      if (source) updateData.source = source;
      if (last_step) updateData.last_step = last_step;
      if (project_completed !== undefined) updateData.project_completed = project_completed;
      
      // Registrar consentimento apenas se o usuário realmente marcou a caixa
      if (hasMarketingOptIn) {
        updateData.marketing_consent = true;
        updateData.accepts_marketing = true;
        if (marketing_consent_at) updateData.marketing_consent_at = marketing_consent_at;
        if (marketing_consent_source) updateData.marketing_consent_source = marketing_consent_source;
        if (marketing_consent_version) updateData.marketing_consent_version = marketing_consent_version;
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('email', email);

      if (error) {
        console.error('Erro ao atualizar lead no Supabase:', error);
        return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
      }
    } else {
      // Insere um novo lead
      const insertData = {
        nome: nome || '',
        email,
        source: source || 'Direct',
        last_step: last_step || 'Started',
        project_completed: project_completed || false
      };

      if (hasMarketingOptIn) {
        insertData.marketing_consent = true;
        insertData.accepts_marketing = true;
        if (marketing_consent_at) insertData.marketing_consent_at = marketing_consent_at;
        if (marketing_consent_source) insertData.marketing_consent_source = marketing_consent_source;
        if (marketing_consent_version) insertData.marketing_consent_version = marketing_consent_version;
      }

      const { error } = await supabase
        .from('leads')
        .insert([insertData]);

      if (error) {
        console.error('Erro ao salvar lead no Supabase:', error);
        return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Lead capturado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro inesperado na rota de leads:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
