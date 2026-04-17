import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Argumentos do Terminal
const args = process.argv.slice(2);
if(args.length < 4) {
   console.log("Uso: node upload_drive.mjs <NomeEstilo> <FolderKey> <MacPath> <Descricao>");
   process.exit(1);
}

const [ESTILO_NOME, FOLDER_KEY, MAC_PATH, DESCRICAO] = args;

// 1. Carregamento robusto do ambiente (Lê .env.local diretamente)
const envStr = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envStr.split('\n').forEach(line => {
   if(line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      envVars[key.trim()] = valueParts.join('=').trim().replace(/"/g, '').replace(/'/g, '');
   }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];
const geminiKey = envVars['GEMINI_API_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Chaves do Supabase não encontradas no .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);

async function getColorsFromImage(fileBuffer) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Analise esta paleta de cores e retorne EXCLUSIVAMENTE um array JSON com os 5 principais códigos HEX encontrados. Ex: ['#HEX1', '#HEX2', '#HEX3', '#HEX4', '#HEX5']";
        
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: fileBuffer.toString("base64"), mimeType: "image/png" } }
        ]);

        const text = result.response.text();
        const hexMatch = text.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
        return hexMatch ? hexMatch.slice(0, 5) : null;
    } catch (err) {
        console.error("  ⚠️ Erro na IA:", err.message);
        return null;
    }
}

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
    console.log(`🚀 Iniciando Upload Mágico Inteligente para: ${ESTILO_NOME}`);
    
    // Verificar se o estilo já existe no banco
    const { data: existente } = await supabase.from('estilos').select('id').eq('folder_name', FOLDER_KEY).single();
    
    let estilo_id;
    
    if (existente) {
        estilo_id = existente.id;
        await supabase.from('estilos').update({ nome_estilo: ESTILO_NOME, descricao_afetiva: DESCRICAO }).eq('id', estilo_id);
        await supabase.from('variacoes_curadas').delete().eq('estilo_id', estilo_id);
        await supabase.from('moodboards').delete().eq('estilo_id', estilo_id);
        console.log(`♻️  Estilo já existia! Reusando ID: ${estilo_id}`);
    } else {
        const { data: estiloData, error: estiloError } = await supabase.from('estilos').insert([
            { nome_estilo: ESTILO_NOME, descricao_afetiva: DESCRICAO, folder_name: FOLDER_KEY }
        ]).select('*').single();
        
        if (estiloError) {
             console.error("Erro Criando Estilo:", estiloError);
             return;
        }
        estilo_id = estiloData.id;
        console.log(`✅ Estilo NOVO cadastrado! ID: ${estilo_id}`);
    }

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
           const fileBuffer = fs.readFileSync(filePath);
           const publicUrl = await uploadFile(filePath, remotePath);

           if(normalizedSub === 'paleta' || normalizedSub === 'paletas') {
               console.log(`  🔍 Extraindo cores de ${file}...`);
               const cores = await getColorsFromImage(fileBuffer);
               
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'PALETA', nome_variacao: rawName, image_url: publicUrl, paleta_hex: cores
               }]);
               if(cores) console.log(`  ✨ Cores: ${cores.join(', ')}`);
           } else if(normalizedSub === 'tipografias' || normalizedSub === 'tipografia' || normalizedSub === 'tipo') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'TIPOGRAFIA', nome_variacao: rawName, image_url: publicUrl
               }]);
           } else if(normalizedSub === 'estampas' || normalizedSub === 'estampa') {
               await supabase.from('variacoes_curadas').insert([{
                   estilo_id, tipo: 'ESTAMPA', nome_variacao: rawName, image_url: publicUrl
               }]);
               console.log(`  🎨 Estampa de referência salva: ${rawName}`);
           } else {
               await supabase.from('moodboards').insert([{
                   estilo_id, image_url: publicUrl, alt_text: rawName
               }]);
           }
        }
    }
    console.log(`✨ BOOOM! ${ESTILO_NOME} está 100% ONLINE e inteligente!`);
}

run().catch(console.error);
