import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { nome, email } = await req.json();

    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    // Inserimos o lead usando upsert baseado no email, ou apenas insert
    // Vamos fazer insert para registrar cada acesso, ou usar um upsert pra evitar dupes, mas se a pessoa acessar varias vezes pode ser util saber
    // Para simplificar, insert básico
    const { data, error } = await supabase
      .from('leads')
      .insert([
        { nome, email }
      ]);

    if (error) {
      console.error('Erro ao salvar lead no Supabase:', error);
      return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lead capturado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro inesperado na rota de leads:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
