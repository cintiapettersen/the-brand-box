import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Argumentos do Terminal
const args = process.argv.slice(2);
if(args.length < 4) {
   console.log("Uso: node upload_drive.mjs <NomeEstilo> <FolderKey> <MacPath> <Descricao>");
   process.exit(1);
}

const [ESTILO_NOME, FOLDER_KEY, MAC_PATH, DESCRICAO] = args;

// 1. Process as chaves
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

async function uploadFile(filePath, bucketPath) {
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if(ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    if(ext === '.webp') mimeType = 'image/webp';

    const { data, error } = await supabase.storage.from('sonho_assets').upload(bucketPath, fileContent, {
        contentType: mimeType,
        upsert: true
    });

    if(error) throw error;
    const { data: publicUrlData } = supabase.storage.from('sonho_assets').getPublicUrl(bucketPath);
    return publicUrlData.publicUrl;
}

function cleanName(filename) {
   let name = filename.replace(/\.(png|jpe?g|webp)$/i, '');
   return name.replace(/_/g, ' ');
}

async function run() {
    console.log(`🚀 Iniciando Upload Mágico para o estilo: ${ESTILO_NOME}`);
    
    // Limpando antigos
    await supabase.from('estilos').delete().eq('folder_name', FOLDER_KEY);
    
    // Cadastrar estilo no banco
    const { data: estiloData, error: estiloError } = await supabase.from('estilos').insert([
        { nome_estilo: ESTILO_NOME, descricao_afetiva: DESCRICAO, folder_name: FOLDER_KEY }
    ]).select('*').single();
    
    if (estiloError) {
         console.error("Erro Criando Estilo:", estiloError);
         return;
    }
    const estilo_id = estiloData.id;
    console.log(`✅ Estilo cadastrado! ID Genuíno no Banco: ${estilo_id}`);

    if(!fs.existsSync(MAC_PATH)){
        console.log("Pasta não encontrada no Mac:", MAC_PATH);
        return;
    }

    const dirs = fs.readdirSync(MAC_PATH);
    for(const sub of dirs) {
        const subPath = path.join(MAC_PATH, sub);
        if(!fs.statSync(subPath).isDirectory()) continue;
        
        let normalizedSub = sub.trim().toLowerCase(); 
        const files = fs.readdirSync(subPath);

        for(const file of files) {
           if(file.startsWith('.')) continue;
           
           const filePath = path.join(subPath, file);
           const ext = path.extname(file).toLowerCase();
           if(!['.png','.jpg','.jpeg','.webp'].includes(ext)) { continue; }

           const rawName = cleanName(file);
           const remotePath = `${FOLDER_KEY}/${normalizedSub}/${file.replace(/\s+/g, '_')}`;
           
           console.log(`⬆️  Subindo ${file}...`);
           const publicUrl = await uploadFile(filePath, remotePath);

           if(normalizedSub === 'paleta' || normalizedSub === 'paletas') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'PALETA', nome_variacao: rawName, image_url: publicUrl
               }]);
           } else if(normalizedSub === 'tipografias' || normalizedSub === 'tipografia' || normalizedSub === 'tipo') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'TIPOGRAFIA', nome_variacao: rawName, image_url: publicUrl
               }]);
           } else {
               await supabase.from('moodboards').insert([{
                   estilo_id, image_url: publicUrl, alt_text: rawName
               }]);
           }
        }
    }
    console.log(`✨ BOOOM! ${ESTILO_NOME} 100% ONLINE na plataforma!`);
}

run().catch(console.error);
