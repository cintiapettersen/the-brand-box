import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  try {
    const { data: estilo, error: e1 } = await supabase.from('estilos').select('*').eq('id', 2).single();
    const { data: paletas, error: e2 } = await supabase.from('variacoes_curadas').select('*').eq('estilo_id', 2).eq('tipo', 'palette');
    
    if (e1) console.error('Erro Estilo:', e1);
    if (e2) console.error('Erro Paletas:', e2);

    console.log('--- ESTILO JARDIM ---');
    console.log(estilo);
    console.log('\n--- PALETAS ENCONTRADAS ---');
    console.log(paletas);
  } catch (err) {
    console.error('Erro fatal:', err);
  }
}

check();
