const { createClient } = require('@supabase/supabase-js');
const url = "https://hdhqbkoinvehumwjlzfo.supabase.co";
const key = "sb_publishable_wCoOm66zInNZab8vhX64bw_4s6CTtRg";
const supabase = createClient(url, key);
supabase.from('variacoes_curadas').select('*').limit(1).then(res => console.log(res));
