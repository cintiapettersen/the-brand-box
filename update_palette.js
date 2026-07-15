import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  const newPalette = ["#BC9399", "#93A1B5", "#A99379", "#D38B79", "#EFEBE4"];
  
  const { data, error } = await supabase
    .from('variacoes_curadas')
    .update({ paleta_hex: newPalette })
    .eq('id', 750); // ID for "paleta 01 neutro organico-mix"
    
  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Successfully updated palette 750 to:', newPalette);
  }
}
run();
