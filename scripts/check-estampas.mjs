import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: estilos } = await supabase.from('estilos').select('*');
  
  for (const estilo of (estilos || []).sort((a,b) => a.id - b.id)) {
    const { data: tipos } = await supabase
      .from('variacoes_curadas')
      .select('id, nome_variacao')
      .eq('estilo_id', estilo.id)
      .eq('tipo', 'TIPOGRAFIA');
    
    if (!tipos || tipos.length === 0) continue;
    
    console.log(`\n🎨 ${estilo.nome_estilo} (ID: ${estilo.id})`);
    tipos.forEach((t) => {
      console.log(`  → "${t.nome_variacao}"`);
    });
  }
}

check().catch(console.error);
