import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sessionId = 'f46fdc85-5fc7-4bc3-9d49-f73dee7c381e';
  const { data: current } = await supabase
    .from('entregas')
    .select('id, brand_data')
    .eq('id', sessionId)
    .single();

  const brandData = current.brand_data;
  
  // List valid files in bucket
  const { data: files } = await supabase.storage.from('estampas').list(sessionId);
  const validNames = files.map(f => f.name);

  // Filter out 404s
  const validUrls = (brandData.estampas_geradas_urls || []).filter(url => {
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    return validNames.includes(name);
  });

  // If she only has 1 valid URL left (estampa_1783025416490.png), let's add the latest from the bucket to give her 3 again
  if (validUrls.length < 3) {
      files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      for (const f of files) {
          const u = `${supabaseUrl}/storage/v1/object/public/estampas/${sessionId}/${f.name}`;
          if (!validUrls.includes(u)) {
              validUrls.push(u);
          }
          if (validUrls.length >= 3) break;
      }
  }

  brandData.estampas_geradas_urls = validUrls;

  await supabase.from('entregas').update({ brand_data: brandData }).eq('id', sessionId);
  console.log('Fixed!', validUrls);
}

run();
