import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Processamento seguro do .env
const envStr = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envStr.split('\n').forEach(line => {
   if(line.includes('=')) {
      const parts = line.split('=');
      envVars[parts[0].trim()] = parts[1].trim().replace(/"/g, '');
   }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

console.log("Tentativamente conectando ao Supabase em:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
     const { data, error } = await supabase.storage.listBuckets();
     if(error) throw error;
     
     console.log("VIVAAA! ✅ Conexão 100% segura e ativa com o banco da Sonho de Papel.");
     if(data.length === 0) {
        console.log("Tudo zerado, pronto para criarmos o bucket de imagens!");
     } else {
        console.log("Buckets atuais:", data.map(b => b.name));
     }
  } catch(e) {
     console.error("❌ ERRO NA CONEXÃO:", e.message);
  }
}

testConnection();
