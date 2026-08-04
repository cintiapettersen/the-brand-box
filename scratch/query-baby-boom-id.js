import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

async function run() {
  const { data, error } = await supabase.from('entregas').select('*').ilike('marca', '%Baby Boom%').limit(1);
  if (data && data.length > 0) {
    const brand = data[0].brand_data;
    console.log("Baby Boom EstiloId:", brand.resultadoFinal?.estiloId);
    console.log("Baby Boom EstiloNome:", brand.resultadoFinal?.estiloNome);
  }
}
run();
