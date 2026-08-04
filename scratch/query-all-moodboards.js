import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

async function run() {
  const { data, error } = await supabase.from('moodboards').select('estilo_id, image_url');
  if (error) console.error(error);
  if (data) {
    const map = {};
    for (const row of data) {
      if (!map[row.estilo_id]) map[row.estilo_id] = new Set();
      const parts = row.image_url.split('/');
      const folder = parts[parts.length - 3] + '/' + parts[parts.length - 2];
      map[row.estilo_id].add(folder);
    }
    for (const id in map) {
      console.log(`Estilo ID ${id}:`, Array.from(map[id]));
    }
  }
}
run();
