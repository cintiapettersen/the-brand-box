const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['"]/g, '') : undefined) || 'dummy_key'
);

async function check() {
  const sessionId = '11aaad70-1b11-46f8-9dbf-d8c9b922834c'; // Or fetch the most recently modified ones
  
  const { data, error } = await supabase
    .from('entregas')
    .select('id, brand_data, email, marca')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error:", error);
    return;
  }
  
  for (const row of data) {
    console.log(`\n--- Delivery ID: ${row.id} ---`);
    console.log(`Email: ${row.email}, Marca: ${row.marca}`);
    let bd = row.brand_data;
    if (typeof bd === 'string') bd = JSON.parse(bd);
    console.log(`Estampa URL:`, bd?.estampa_url);
    console.log(`Estampas Geradas URLs:`, bd?.estampas_geradas_urls);
    
    if (bd?.estampas_geradas_urls) {
      for (const url of bd.estampas_geradas_urls) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          console.log(`- ${url} : ${res.status}`);
        } catch (e) {
          console.log(`- ${url} : Fetch Error`);
        }
      }
    }
  }
}

check();
