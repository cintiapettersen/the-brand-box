import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envStr = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envStr.split('\n').forEach(line => {
   if(line.includes('=')) {
      const parts = line.split('=');
      envVars[parts[0].trim()] = parts[1].trim().replace(/"/g, '');
   }
});
const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY']);

async function run() {
   const { data } = await supabase.from('estilos').select('*');
   console.log("ESTILOS NO DB:", JSON.stringify(data, null, 2));
}
run();
