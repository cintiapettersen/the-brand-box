import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Lê as variáveis do .env.local
const envStr = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envStr.split('\n').forEach(line => {
  if (line.includes('=')) {
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1');
    envVars[key] = val;
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY']; // service role = pode inserir sem RLS

console.log('🔗 Conectando ao Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// Dados de teste mínimos que a página /sucesso precisa
const brandState = {
  formData: {
    nome: 'Teste',
    email: 'teste@sonhodepapel.com',
    marca: 'Clínica Teste',
    atuacao: 'Pediatria / Saúde infantil',
    publico: 'Bebês e criancinhas (0 a 6 anos)',
    sentimentos: ['Acolhimento e cuidado', 'Alegria e leveza'],
    elementosVisuais: ['Bichinhos / Animais Fofos'],
  },
  resultadoFinal: {
    estiloId: 8,
    estiloNome: 'Doce Encantamento',
    paleta: ['#FFB7C5', '#FFE4EC', '#B5EAD7', '#C7CEEA', '#FFDAC1'],
    mensagem: 'Sua marca tem uma essência doce e encantadora!',
  },
  editData: {
    marca: 'Clínica Teste',
    tagline: 'Cuidado com carinho',
    whatsapp: '(11) 99999-9999',
    instagram: 'clinicateste',
    corAtiva: '#FFB7C5',
    itemSelecionado: 'cartao',
    viewType: 'itens',
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    fontStyle: 'serif',
    fontSizeBoost: 1,
    fontLetterSpacing: '1px',
  },
  selectedPaleta: null,
  selectedTipo: null,
  selectedIcon: null,
  paletas: [],
  tipografias: [],
  estampas: [],
  activeColor: '#FFB7C5',
  pattern: null,
  iconPath: null,
  patternGenerationCount: 0,
};

async function criarSessao() {
  try {
    const { data, error } = await supabase
      .from('entregas')
      .insert({
        plano: 'pro',
        email: 'teste@sonhodepapel.com',
        marca: 'Clínica Teste',
        brand_data: brandState,
        email_enviado: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erro ao inserir:', error.message);
      console.error('Detalhes:', error);
      return;
    }

    const sessionId = data.id;
    console.log('');
    console.log('✅ Sessão de teste criada com sucesso!');
    console.log('');
    console.log('📋 Session ID:', sessionId);
    console.log('');
    console.log('🔗 URL para testar (localhost):');
    console.log(`   http://localhost:3000/sucesso?session=${sessionId}&plano=pro`);
    console.log('');
    console.log('💾 Salve esse ID! Você pode reutilizá-lo quantas vezes quiser.');

  } catch (err) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

criarSessao();
