/**
 * upload-estampas-ref.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Sobe imagens de referência de estampa pro Supabase e registra na tabela
 * variacoes_curadas com tipo = 'ESTAMPA'.
 *
 * USO:
 *   node scripts/upload-estampas-ref.mjs <estilo_id>
 *
 * EXEMPLOS:
 *   node scripts/upload-estampas-ref.mjs 2    # Jardim Encantado
 *   node scripts/upload-estampas-ref.mjs 8    # Doce Encantamento
 *   node scripts/upload-estampas-ref.mjs all  # Todos os estilos
 *
 * ESTRUTURA DE PASTAS ESPERADA:
 *   estampas-ref/
 *     jardim-encantado/       → estilo_id 2
 *     escandinavo-acolhedor/  → estilo_id 3
 *     essencia-atemporal/     → estilo_id 5
 *     raizes-e-cuidado/       → estilo_id 6
 *     doce-encantamento/      → estilo_id 8
 *     estetico-editorial/     → estilo_id 11
 *
 * Coloque arquivos .png ou .jpg dentro de cada pasta e rode o script.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Carrega .env.local
const envStr = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const envVars = {};
envStr.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...val] = line.split('=');
    envVars[key.trim()] = val.join('=').trim().replace(/"/g, '').replace(/'/g, '');
  }
});

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
);

const BUCKET = 'sonho_assets';

// Mapa de estilos: id → nome da pasta
const ESTILOS = {
  2:  { nome: 'Jardim Encantado',       pasta: 'jardim-encantado' },
  3:  { nome: 'Escandinavo Acolhedor',  pasta: 'escandinavo-acolhedor' },
  5:  { nome: 'Essência Atemporal',     pasta: 'essencia-atemporal' },
  6:  { nome: 'Raízes & Cuidado',       pasta: 'raizes-e-cuidado' },
  8:  { nome: 'Doce Encantamento',      pasta: 'doce-encantamento' },
  11: { nome: 'Estético Editorial',     pasta: 'estetico-editorial' },
};

const BASE_REF = path.join(ROOT, 'estampas-ref');

async function uploadEstampa(filePath, estiloId, pasta) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const storagePath = `estilos/estilo_${estiloId}/Estampas/${fileName}`;
  const fileBuffer = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) {
    console.error(`  ❌ Upload falhou: ${fileName} —`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function syncEstilo(estiloId) {
  const estilo = ESTILOS[estiloId];
  if (!estilo) {
    console.error(`❌ Estilo ID ${estiloId} não reconhecido.`);
    return;
  }

  const pasta = path.join(BASE_REF, estilo.pasta);
  if (!fs.existsSync(pasta)) {
    console.warn(`⚠️  Pasta não encontrada: estampas-ref/${estilo.pasta}/  (pulando)`);
    return;
  }

  const arquivos = fs.readdirSync(pasta).filter(f =>
    ['.png', '.jpg', '.jpeg'].includes(path.extname(f).toLowerCase())
  );

  if (arquivos.length === 0) {
    console.warn(`⚠️  Nenhuma imagem encontrada em estampas-ref/${estilo.pasta}/`);
    return;
  }

  console.log(`\n🎨 ${estilo.nome} (id=${estiloId}) — ${arquivos.length} imagem(ns) encontrada(s)`);

  // Verifica quais já existem no banco pra não duplicar
  const { data: existentes } = await supabase
    .from('variacoes_curadas')
    .select('nome_variacao')
    .eq('estilo_id', estiloId)
    .eq('tipo', 'ESTAMPA');

  const nomesExistentes = new Set((existentes || []).map(e => e.nome_variacao));

  let adicionadas = 0;
  let puladas = 0;

  for (const arquivo of arquivos) {
    const nomeVariacao = path.basename(arquivo, path.extname(arquivo)).replace(/_/g, ' ');

    if (nomesExistentes.has(nomeVariacao)) {
      console.log(`  ⏭️  "${nomeVariacao}" já existe — pulando`);
      puladas++;
      continue;
    }

    const filePath = path.join(pasta, arquivo);
    console.log(`  ⬆️  Enviando "${arquivo}"...`);
    const publicUrl = await uploadEstampa(filePath, estiloId, estilo.pasta);

    if (publicUrl) {
      const { error } = await supabase.from('variacoes_curadas').insert({
        estilo_id: estiloId,
        tipo: 'ESTAMPA',
        nome_variacao: nomeVariacao,
        image_url: publicUrl,
      });

      if (error) {
        console.error(`  ❌ Erro ao salvar no banco:`, error.message);
      } else {
        console.log(`  ✅ "${nomeVariacao}" adicionada com sucesso!`);
        adicionadas++;
      }
    }
  }

  console.log(`  📊 Resultado: ${adicionadas} adicionada(s), ${puladas} já existia(m).`);
}

async function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.log(`
📋 USO: node scripts/upload-estampas-ref.mjs <estilo_id|all>

Estilos disponíveis:
${Object.entries(ESTILOS).map(([id, e]) => `  ${id}  →  ${e.nome}  (pasta: estampas-ref/${e.pasta}/)`).join('\n')}

  all  →  Todos os estilos de uma vez
    `);
    process.exit(0);
  }

  // Garante que a pasta raiz existe
  if (!fs.existsSync(BASE_REF)) {
    fs.mkdirSync(BASE_REF, { recursive: true });
    console.log(`📁 Pasta criada: estampas-ref/`);
  }

  // Cria subpastas para cada estilo se não existirem
  for (const [, e] of Object.entries(ESTILOS)) {
    const p = path.join(BASE_REF, e.pasta);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }

  if (arg === 'all') {
    console.log('🚀 Sincronizando TODOS os estilos...');
    for (const id of Object.keys(ESTILOS)) {
      await syncEstilo(Number(id));
    }
  } else {
    const id = Number(arg);
    if (!ESTILOS[id]) {
      console.error(`❌ Estilo ID "${arg}" inválido. Use um dos IDs: ${Object.keys(ESTILOS).join(', ')} ou "all"`);
      process.exit(1);
    }
    await syncEstilo(id);
  }

  console.log('\n✨ Pronto!');
}

main().catch(err => {
  console.error('❌ Erro inesperado:', err.message);
  process.exit(1);
});
