import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('entregas')
    .select('id, brand_data')
    .order('created_at', { ascending: false })
    .limit(1);

  console.log(JSON.stringify(data[0].brand_data.estampas_geradas_urls, null, 2));
}

run();
