import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// 1. Carregamento robusto do ambiente
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

const STYLE_ID = 2; // Jardim Encantado / Doce Encanto
const BASE_PATH = '/Users/cintiapettersen/.gemini/antigravity/scratch/DoceEncantamento';
const BUCKET = 'sonho_assets';

// Função Mágica para extrair HEX via visão computacional
async function getColorsFromImage(fileBuffer) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Analise esta paleta de cores e retorne EXCLUSIVAMENTE um array JSON com os 5 principais códigos HEX encontrados, na ordem de destaque. Ex: ['#HEX1', '#HEX2', '#HEX3', '#HEX4', '#HEX5']";
        
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: fileBuffer.toString("base64"), mimeType: "image/png" } }
        ]);

        const text = result.response.text();
        const hexMatch = text.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
        return hexMatch ? hexMatch.slice(0, 5) : null;
    } catch (err) {
        console.error("  ⚠️ Erro na extração de cores via IA:", err.message);
        return null;
    }
}

async function uploadFile(filePath, subFolder) {
    const fileName = path.basename(filePath);
    const storagePath = `estilos/estilo_${STYLE_ID}/${subFolder}/${fileName}`;
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error(`❌ Erro no upload de ${fileName}:`, error.message);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

    return publicUrl;
}

async function sync() {
    console.log('🤖 INICIANDO ROBÔ DE SINCRONIZAÇÃO INTELIGENTE: JARDIM ENCANTADO...');

    // Limpar variações antigas para garantir que as novas cores entrem
    await supabase.from('variacoes_curadas').delete().eq('estilo_id', STYLE_ID);

    const config = [
        { folder: 'paleta', type: 'palette' },
        { folder: 'Tipografias', type: 'tipografia' },
        { folder: 'Moodboard', type: 'moodboard' }
    ];

    for (const item of config) {
        const fullDirPath = path.join(BASE_PATH, item.folder);
        if (!fs.existsSync(fullDirPath)) continue;

        const files = fs.readdirSync(fullDirPath).filter(f => f.endsWith('.png'));
        console.log(`\n📁 Processando ${item.folder} (${files.length} arquivos)...`);

        for (const file of files) {
            const filePath = path.join(fullDirPath, file);
            const fileBuffer = fs.readFileSync(filePath);
            const publicUrl = await uploadFile(filePath, item.folder);

            if (publicUrl) {
                let cores = null;
                if (item.type === 'palette') {
                    console.log(`  🔍 Analisando cores de ${file}...`);
                    cores = await getColorsFromImage(fileBuffer);
                    if (cores) console.log(`  ✨ Cores extraídas: ${cores.join(', ')}`);
                }

                const { error } = await supabase
                    .from('variacoes_curadas')
                    .insert({
                        estilo_id: STYLE_ID,
                        nome_variacao: file.replace('.png', '').replace(/_/g, ' '),
                        image_url: publicUrl,
                        tipo: item.type,
                        paleta_hex: cores
                    });

                if (error) console.error(`❌ Erro ao salvar no banco:`, error.message);
                else console.log(`  ✅ ${file} sincronizado!`);
            }
        }
    }

    console.log('\n✨ MÁGICA CONCLUÍDA! Estilo Jardim Encantado está ativo e com cores extraídas via IA.');
}

sync();
