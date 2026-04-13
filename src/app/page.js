'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [step, setStep] = useState(1);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    marca: '',
    atuacao: '',
    atuacaoOutra: '',
    publico: '',
    sentimentos: []
  });

  const [paletas, setPaletas] = useState([]);
  const [tipografias, setTipografias] = useState([]);
  const [moodboards, setMoodboards] = useState([]);
  
  const [selectedPaleta, setSelectedPaleta] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [customStep, setCustomStep] = useState('tipo'); // Controle do carrossel da visualização

  const fetchVariacoes = async () => {
    const id = resultadoFinal?.estiloId || 1;
    
    // Buscar paletas e tipografias
    const { data: varData } = await supabase.from('variacoes_curadas').select('*').eq('estilo_id', id);
    if(varData) {
       setPaletas(varData.filter(d => d.tipo === 'PALETA'));
       setTipografias(varData.filter(d => d.tipo === 'TIPOGRAFIA'));
    }

    // Buscar imagens do moodboard daquela raiz
    const { data: moodData } = await supabase.from('moodboards').select('*').eq('estilo_id', id);
    if(moodData) {
       setMoodboards(moodData);
    }

    setStep(9);
  };

  const nextStep = () => setStep((s) => s + 1);
  
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setSingleChoice = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleSentimento = (label) => {
    setFormData(prev => {
      const current = prev.sentimentos;
      if (current.includes(label)) {
        return { ...prev, sentimentos: current.filter(item => item !== label) };
      }
      if (current.length < 3) {
        return { ...prev, sentimentos: [...current, label] };
      }
      return prev;
    });
  };

  const selectTipoItem = (id) => {
     setSelectedTipo(id);
     setTimeout(() => setCustomStep('paleta'), 300); // Auto avanço chic
  }

  // Aqui é onde ativamos a Mágica
  const callMatchmaker = async () => {
    setStep(7); // Vai para a tela de loading automático
    
    try {
      const response = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.estiloNome) {
        setResultadoFinal(data);
        setStep(8); // Tela de Resultado Triunfal
      } else {
        alert("Ops, deu um pequeno tilt na IA. Refaça por favor!");
        setStep(6);
      }
    } catch (e) {
      console.error(e);
      alert("Demorou muito ou falhou. Teste novamente!");
      setStep(6);
    }
  };

  const areas = [
    "Pediatria / Saúde infantil",
    "Obstetrícia / Saúde da mulher",
    "Clínica / Saúde geral adulta",
    "Terapia / Saúde mental",
    "Estética / Bem-estar / Nutrição",
    "Loja de Roupas / Marcas Infantis",
    "Outra área"
  ];

  const publicos = [
    "Bebês e criancinhas (0 a 6 anos)",
    "Crianças e adolescentes (6 a 18 anos)",
    "Mulheres adultas",
    "Adultos em geral"
  ];

  const sensacoes = [
    "Acolhimento e cuidado",
    "Alegria e leveza",
    "Confiança e profissionalismo",
    "Sofisticação e elegância",
    "Criatividade e originalidade",
    "Encantamento e delicadeza",
    "Natureza e tranquilidade"
  ];

  const variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  const chipStyle = (isSelected) => ({
    background: isSelected ? 'var(--accent-turquoise)' : '#fff',
    color: isSelected ? '#fff' : 'var(--text-secondary)',
    border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`,
    padding: '12px 24px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: isSelected ? 500 : 400,
    width: '100%',
    textAlign: 'center'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem', background: '#ffffff' }}>
      <div style={{ width: '100%', maxWidth: '700px', position: 'relative', height: '85vh' }}>
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div 
              key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'var(--bg-soft)', borderRadius: '24px', padding: '3rem' }}
            >
              <h1 style={{ fontSize: '2.5rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--accent-turquoise)' }}>Deixe sua<br/>marca de amor.</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '90%' }}>Você não precisa saber design. Eu vou te guiar em cada etapa para criar uma marca com sentido e personalidade autêntica.</p>
              <button onClick={nextStep} className="btn-primary">Começar minha marca ✨</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '15%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Antes de começarmos...</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Como você gostaria de ser chamada(o)?</p>
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input name="nome" value={formData.nome} onChange={handleInput} placeholder="Seu nome ou apelido" />
                <input name="email" value={formData.email} onChange={handleInput} type="email" placeholder="O seu melhor e-mail" />
              </div>
              <button onClick={nextStep} className="btn-secondary" style={{ opacity: formData.nome ? 1 : 0.5, pointerEvents: formData.nome ? 'auto' : 'none' }}>Continuar</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '30%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>E a sua marca?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Qual o nome dela? Pode ser um nome provisório.</p>
              <div style={{ width: '100%', marginBottom: '2rem' }}>
                <input name="marca" value={formData.marca} onChange={handleInput} placeholder="Ex: Clínica Sonho Meu..." />
              </div>
              <button onClick={nextStep} className="btn-secondary" style={{ opacity: formData.marca ? 1 : 0.5, pointerEvents: formData.marca ? 'auto' : 'none' }}>Avançar 🤍</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '50%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Qual é a sua área de atuação?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Para entendermos melhor o seu mercado.</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', overflowY: 'auto', maxHeight: '40vh', padding: '10px 5px' }}>
                {areas.map(a => (<button key={a} onClick={() => setSingleChoice('atuacao', a)} style={chipStyle(formData.atuacao === a)}>{a}</button>))}
                <AnimatePresence>
                  {formData.atuacao === 'Outra área' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ width: '100%', overflow: 'hidden' }}>
                      <input name="atuacaoOutra" value={formData.atuacaoOutra} onChange={handleInput} placeholder="Descreva sua área..." style={{ marginTop: '10px' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={nextStep} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra área' || formData.atuacaoOutra !== '')) ? 1 : 0.5, pointerEvents: (formData.atuacao !== '' && (formData.atuacao !== 'Outra área' || formData.atuacaoOutra !== '')) ? 'auto' : 'none' }}>Avançar</button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '70%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Para quem você atende?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Qual o seu público principal?</p>
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {publicos.map(p => (<button key={p} onClick={() => setSingleChoice('publico', p)} style={chipStyle(formData.publico === p)}>{p}</button>))}
              </div>
              <button onClick={nextStep} className="btn-secondary" style={{ opacity: formData.publico ? 1 : 0.5, pointerEvents: formData.publico ? 'auto' : 'none' }}>Avançar</button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="step6" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '90%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Que sensações você quer transmitir?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Selecione até 3 opções que mais se conectam com a sua marca.</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {sensacoes.map(s => {
                  const isSelected = formData.sentimentos.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSentimento(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{s}</button>
                  )
                })}
              </div>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500}}>Selecionadas: {formData.sentimentos.length}/3</p>
              <button onClick={callMatchmaker} className="btn-primary" style={{ opacity: formData.sentimentos.length > 0 ? 1 : 0.5, pointerEvents: formData.sentimentos.length > 0 ? 'auto' : 'none' }}>Descobrir Essência ✨</button>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="step7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</h2>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-turquoise)' }}>Conectando com o Gemini...</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Nossa IA está cruzando seus dados de Sofisticação e Ludicidade com o banco de estilos ativos da Sonho de Papel.</p>
            </motion.div>
          )}

          {/* O GLORIOSO RESULTADO */}
          {step === 8 && resultadoFinal && (
            <motion.div 
              key="step8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            >
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>O MATCH PERFEITO PARA {formData.marca || "SUA MARCA"}</p>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-magenta)', fontWeight: 600 }}>{resultadoFinal.estiloNome}</h2>
              
              <div style={{ background: 'var(--bg-soft)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{resultadoFinal.mensagem}"
                </p>
              </div>

              <button onClick={fetchVariacoes} className="btn-primary" style={{ background: 'var(--accent-turquoise)', boxShadow: 'none' }}>Personalizar minha Identidade</button>
            </motion.div>
          )}

          {step === 9 && (
            <motion.div 
              key="step9" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border)', overflowY: 'hidden' }}
            >
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Refinamento Visual</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>{customStep === 'tipo' ? '1. Escolha a sua Tipografia ideal' : '2. Defina sua Paleta de Cores'}</p>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                 <div onClick={() => setCustomStep('tipo')} style={{ height: '6px', width: '40%', borderRadius: '4px', cursor: 'pointer', background: customStep === 'tipo' ? 'var(--accent-turquoise)' : 'var(--border)', transition: 'background 0.3s' }} />
                 <div onClick={() => setCustomStep('paleta')} style={{ height: '6px', width: '40%', borderRadius: '4px', cursor: 'pointer', background: customStep === 'paleta' ? 'var(--accent-magenta)' : 'var(--border)', transition: 'background 0.3s' }} />
              </div>

              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  {customStep === 'tipo' && (
                     <motion.div key="ctipo" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {tipografias.map(t => (
                          <div key={t.id} onClick={() => selectTipoItem(t.id)} style={{ border: selectedTipo === t.id ? '2px solid var(--accent-turquoise)' : '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <img src={t.image_url} alt={t.nome_variacao} style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px', marginBottom: '10px', background: '#f9f9f9' }} />
                             <p style={{ fontSize: '0.9rem', fontWeight: selectedTipo === t.id ? 600 : 400, textAlign: 'center' }}>{t.nome_variacao}</p>
                          </div>
                        ))}
                     </motion.div>
                  )}

                  {customStep === 'paleta' && (
                     <motion.div key="cpaleta" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {paletas.map(p => (
                          <div key={p.id} onClick={() => setSelectedPaleta(p.id)} style={{ border: selectedPaleta === p.id ? '2px solid var(--accent-magenta)' : '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <img src={p.image_url} alt={p.nome_variacao} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', background: '#f9f9f9' }} />
                             <p style={{ fontSize: '0.9rem', fontWeight: selectedPaleta === p.id ? 600 : 400, textAlign: 'center' }}>{p.nome_variacao}</p>
                          </div>
                        ))}
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                 {customStep === 'paleta' && <button onClick={() => setCustomStep('tipo')} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>}
                 <button onClick={() => setStep(10)} className="btn-primary" style={{ flex: 1, background: (selectedTipo && selectedPaleta) ? 'var(--accent-turquoise)' : '#ccc', pointerEvents: (selectedTipo && selectedPaleta) ? 'auto' : 'none' }}>Gerar Meu Moodboard Final</button>
              </div>
            </motion.div>
          )}

          {/* MOODBOARD GERAL + PLANOS DE COMPRA (Etapa 10) */}
          {step === 10 && (
            <motion.div 
              key="step10" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f7f9fa', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              {/* Painel Mural/Moodboard de Fundo */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', opacity: 0.25, overflow: 'hidden', pointerEvents: 'none' }}>
                  {moodboards.map(m => (
                     <div key={m.id} style={{ width: 'calc(33% - 8px)', height: '140px', background: `url(${m.image_url}) center/cover no-repeat`, borderRadius: '6px' }} />
                  ))}
              </div>

              {/* Camada Vitrine */}
              <div style={{ position: 'relative', zIndex: 10, padding: '2.5rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                 <p style={{ color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>Identidade Visual Pronta</p>
                 <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-magenta)', textAlign: 'center' }}>{resultadoFinal?.estiloNome}</h2>
                 <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>O conceito da sua marca {formData.marca || ''} foi desenhado e aprovado.<br/>Selecione como deseja receber os seus arquivos:</p>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* PACOTE BASE */}
                    <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Pacote Base</h3>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-turquoise)', fontSize: '1.2rem' }}>R$ 497</span>
                       </div>
                       <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 15px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Logo Principal + Variações</li>
                          <li>Paleta de Cores & Tipografia</li>
                          <li>Guia de Uso da Marca (PDF)</li>
                          <li>Cartão de Visita Interativo</li>
                       </ul>
                       <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>Quero este</button>
                    </motion.div>

                    {/* PACOTE COMPLETO */}
                    <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'var(--accent-magenta)', borderRadius: '16px', padding: '20px', color: '#ffffff', boxShadow: '0 8px 25px rgba(220, 52, 149, 0.2)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Pacote Completo</h3>
                          <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem' }}>R$ 897</span>
                       </div>
                       <ul style={{ fontSize: '0.9rem', margin: '0 0 15px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Tudo do Pacote Base</li>
                          <li>Papelaria Focada {formData.atuacao !== 'Outra área' && formData.atuacao !== '' ? `para ${formData.atuacao}` : 'Exclusiva'}</li>
                          <li>Templates Editáveis para Instagram</li>
                          <li>Adesivos / Mockups / Avatares</li>
                       </ul>
                       <button className="btn-primary" style={{ width: '100%', padding: '12px', background: '#ffffff', color: 'var(--accent-magenta)' }}>Quero a Imersão Completa</button>
                    </motion.div>
                 </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
