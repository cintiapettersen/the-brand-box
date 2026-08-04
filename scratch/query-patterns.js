import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

async function run() {
  const { data, error } = await supabase.from('entregas').select('brand_data').ilike('marca', '%Baby Boom%').limit(1);
  if (data && data.length > 0) {
    const brand = data[0].brand_data;
    console.log("Patterns length:", brand.patterns?.length);
    console.log("Patterns:", brand.patterns);
  }
}
run();
