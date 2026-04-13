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

async function setupStorage() {
  try {
     console.log("Tentando criar o Bucket Público 'sonho_assets'...");
     const { data, error } = await supabase.storage.createBucket('sonho_assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
     });
     if(error) {
         if(error.message.includes("already exists")) {
            console.log("Bucket já existia! Perfeito.");
         } else {
            throw error;
         }
     } else {
         console.log("✅ Bucket 'sonho_assets' criado com SUCESSO!");
     }
  } catch(e) {
     console.error("❌ ERRO BUCKET:", e.message);
  }
}

setupStorage();
