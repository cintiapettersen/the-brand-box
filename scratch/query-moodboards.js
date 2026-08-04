import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

async function run() {
  const { data, error } = await supabase.from('moodboards').select('*').eq('estilo_id', 6);
  if (error) console.error(error);
  console.log("Moodboards for Estilo 6:", data?.length);
  if (data?.length > 0) {
    console.log(data.map(d => d.image_url));
  }
}
run();
