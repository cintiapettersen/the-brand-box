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

async function testFetch() {
  const id = '5';
  try {
    const { data: varData, error: varError } = await supabase
      .from('variacoes_curadas')
      .select('*')
      .eq('estilo_id', id);

    if (varError) throw varError;

    const { data: moodData, error: moodError } = await supabase
      .from('moodboards')
      .select('*')
      .eq('estilo_id', id);

    if (moodError) throw moodError;

    console.log("SUCCESS! varData length:", varData.length);
    console.log("SUCCESS! moodData length:", moodData.length);
    console.log("First varData:", varData[0]);
  } catch (err) {
    console.error("ERROR REPLICATING API:", err.message);
  }
}

testFetch();
