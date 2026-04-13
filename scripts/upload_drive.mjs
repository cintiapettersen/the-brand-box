import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

// O Caminho mágico onde achei sua pasta (com os espaços problemáticos lidamos via Node!)
const basePath = "/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada/ Poético_Navegante ";

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
   // Substitui tags ou underscores pra nomes legíveis pro usuário
   return name.replace(/_/g, ' ');
}

async function run() {
    console.log("🚀 Iniciando Upload Mágico Sonho de Papel...");
    
    // 1. Limpando a casa (Apagando registros velhos de teste para ser idempotente)
    await supabase.from('estilos').delete().eq('folder_name', 'poetico_navegante');
    
    // 2. Criar Master Style no Banco de Dados
    const estiloNome = "Poético Navegante";
    const { data: estiloData, error: estiloError } = await supabase.from('estilos').insert([
        { 
          nome_estilo: estiloNome, 
          descricao_afetiva: "Delicado, acolhedor. Ludicidade base. Bom para infanto-maternal afetuoso.",
          folder_name: "poetico_navegante"
        }
    ]).select('*').single();
    
    if (estiloError) {
         console.error("Erro Criando Estilo:", estiloError);
         return;
    }
    const estilo_id = estiloData.id;
    console.log("✅ Estilo cadastrado! O Cérebro já conhece as tabelas.");

    // 3. Caminhar pelas subpastas locais mágicas
    const dirs = fs.readdirSync(basePath);
    
    for(const sub of dirs) {
        const subPath = path.join(basePath, sub);
        if(!fs.statSync(subPath).isDirectory()) continue;
        
        let normalizedSub = sub.trim().toLowerCase(); // Tira espaços sobrando do seu Mac
        
        const files = fs.readdirSync(subPath);
        for(const file of files) {
           if(file.startsWith('.')) continue; // Pula os arquivos ocultos de sistema (.DS_Store)
           
           const filePath = path.join(subPath, file);
           const ext = path.extname(file).toLowerCase();
           if(!['.png','.jpg','.jpeg','.webp'].includes(ext)) {
               console.log(`Pulando ${file} (não é imagem web)`);
               continue;
           }

           const rawName = cleanName(file);
           // Cria caminho limpo na nuvem
           const remotePath = `poetico_navegante/${normalizedSub}/${file.replace(/\s+/g, '_')}`;
           
           console.log(`⬆️  Mágica: Subindo ${file}...`);
           const publicUrl = await uploadFile(filePath, remotePath);

           // 4. Cadastrar no banco de relações exatas
           if(normalizedSub === 'paleta' || normalizedSub === 'paletas') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'PALETA', nome_variacao: rawName, image_url: publicUrl
               }]);
           } 
           else if(normalizedSub === 'tipografias' || normalizedSub === 'tipografia') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'TIPOGRAFIA', nome_variacao: rawName, image_url: publicUrl
               }]);
           }
           else {
               // Tudo que for Logo, estampas, Moodboard cai pro painel geral
               await supabase.from('moodboards').insert([{
                   estilo_id, image_url: publicUrl, alt_text: rawName
               }]);
           }
        }
    }
    
    console.log("✨ BOOOM! MAGIA CONCLUÍDA: A Biblioteca inteira foi sincronizada pro seu App de Prod!");
}

run().catch(console.error);
