const { createClient } = require('@supabase/supabase-js');
const url = "https://hdhqbkoinvehumwjlzfo.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.key";
const supabase = createClient(url, key);
supabase.from('variacoes_curadas').select('*').limit(1).then(res => console.log(res));
