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

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
  try {
     console.log("Checking style IDs inside variacoes_curadas...");
     const { data, error } = await supabase
       .from('variacoes_curadas')
       .select('estilo_id, tipo');
     
     if (error) {
       console.error("Error:", error.message);
       return;
     }

     const counts = {};
     data.forEach(row => {
       const key = `style_${row.estilo_id}`;
       counts[key] = counts[key] || { total: 0, paleta: 0, tipografia: 0, estampa: 0 };
       counts[key].total++;
       if (row.tipo === 'PALETA') counts[key].paleta++;
       if (row.tipo === 'TIPOGRAFIA') counts[key].tipografia++;
       if (row.tipo === 'ESTAMPA') counts[key].estampa++;
     });

     console.log("Counts per style in variacoes_curadas:", counts);
     
     console.log("\nChecking style IDs inside moodboards...");
     const { data: moodData, error: moodError } = await supabase
       .from('moodboards')
       .select('estilo_id');
     
     if (moodError) {
       console.error("Error:", moodError.message);
       return;
     }

     const moodCounts = {};
     moodData.forEach(row => {
       const key = `style_${row.estilo_id}`;
       moodCounts[key] = (moodCounts[key] || 0) + 1;
     });

     console.log("Counts per style in moodboards:", moodCounts);
  } catch(e) {
     console.error("FATAL ERROR:", e.message);
  }
}

checkCounts();
