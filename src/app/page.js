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
    nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: []
  });

  const elementosDesc = [
    "Cores vibrantes", "Universo Lúdico (Fadas, Princesas)", "Bichinhos / Animais Fofos", 
    "Aquarela Clássica", "Minimalismo e Traços Limpos", "Tons Quentes / Linho Orgânico", 
    "Clássico e Nostálgico", "Clean / Tipografia Pura"
  ];
  
  const toggleElemento = (val) => {
    setFormData(prev => ({
      ...prev,
      elementosVisuais: prev.elementosVisuais.includes(val)
        ? prev.elementosVisuais.filter(item => item !== val)
        : (prev.elementosVisuais.length < 3 ? [...prev.elementosVisuais, val] : prev.elementosVisuais)
    }));
  };

  const [paletas, setPaletas] = useState([]);
  const [tipografias, setTipografias] = useState([]);
  const [moodboards, setMoodboards] = useState([]);
  
  const [selectedPaleta, setSelectedPaleta] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [customStep, setCustomStep] = useState('tipo'); // Controle do carrossel da visualização
  const [showPediatriaModal, setShowPediatriaModal] = useState(false);

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
    setMoodboards(moodData || []);
    setSelectedTipo(null);
    setSelectedPaleta(null);
    setStep(10);
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
    setStep(8); // Vai para a tela de loading automático
    
    try {
      const response = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.estiloNome) {
        setResultadoFinal(data);
        setStep(9); // Tela de Resultado Triunfal
      } else {
        alert("Ops, deu um pequeno tilt na IA. Refaça por favor!");
        setStep(7);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na conexão com o servidor mágico.");
      setStep(7);
    }
  };

  const areas = [
    "Pediatria / Saúde infantil",
    "Obstetrícia / Saúde da mulher",
    "Clínica / Saúde geral adulta",
    "Terapia / Saúde mental",
    "Estética / Bem-estar / Nutrição",
    "Cosméticos Naturais / Bem-estar Consciente",
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

        {step > 1 && step <= 7 && (
           <button onClick={() => setStep(s => s - 1)} style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: '30px', padding: '6px 14px', color: 'var(--text-secondary)', cursor: 'pointer', zIndex: 100, fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '5px' }}>
             ← Voltar
           </button>
        )}
        
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
              <button onClick={nextStep} className="btn-primary" style={{ opacity: formData.sentimentos.length > 0 ? 1 : 0.5, pointerEvents: formData.sentimentos.length > 0 ? 'auto' : 'none' }}>Avançar</button>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="step7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '95%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>O que não pode faltar no layout?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Quais elementos visuais e temáticos são vitais para você? (Escolha até 3)</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {elementosDesc.map(s => {
                  const isSelected = formData.elementosVisuais.includes(s);
                  return (
                    <button key={s} onClick={() => toggleElemento(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{s}</button>
                  )
                })}
              </div>
              <button onClick={callMatchmaker} className="btn-primary" style={{ opacity: formData.elementosVisuais.length > 0 ? 1 : 0.5, pointerEvents: formData.elementosVisuais.length > 0 ? 'auto' : 'none' }}>Ativar Casamenteira ✨</button>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div 
              key="step8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
              >✦</motion.div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', color: 'var(--accent-turquoise)' }}>Encontrando a sua essência visual...</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>Nosso motor criativo está analisando o seu perfil para encontrar a combinação perfeita para você.</p>
            </motion.div>
          )}

          {/* O GLORIOSO RESULTADO */}
          {step === 9 && resultadoFinal && (
            <motion.div 
              key="step9" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
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

          {step === 10 && (
            <motion.div 
              key="step10" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
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
                             <img src={`${t.image_url}?t=${Date.now()}`} alt={t.nome_variacao} style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px', background: '#f9f9f9' }} />
                          </div>
                        ))}
                     </motion.div>
                  )}

                  {customStep === 'paleta' && (
                     <motion.div key="cpaleta" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {paletas.map(p => (
                          <div key={p.id} onClick={() => setSelectedPaleta(p.id)} style={{ border: selectedPaleta === p.id ? '2px solid var(--accent-magenta)' : '1px solid var(--border)', borderRadius: '12px', padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <img src={`${p.image_url}?t=${Date.now()}`} alt={p.nome_variacao} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f9f9f9' }} />
                          </div>
                        ))}
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                 {customStep === 'paleta' && <button onClick={() => setCustomStep('tipo')} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>}
                 <button onClick={() => setStep(11)} className="btn-primary" style={{ flex: 1, background: (selectedTipo && selectedPaleta) ? 'var(--accent-turquoise)' : '#ccc', pointerEvents: (selectedTipo && selectedPaleta) ? 'auto' : 'none' }}>Gerar Meu Moodboard Final</button>
              </div>
            </motion.div>
          )}

          {/* A GRANDE REVELAÇÃO: O MOODBOARD PURO (Etapa 11) */}
          {step === 11 && (
            <motion.div 
              key="step11" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', zIndex: 10, background: '#fff' }}>
                 <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 'bold' }}>Sua Nova Era Visual</p>
                 <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-magenta)' }}>{resultadoFinal?.estiloNome}</h2>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#fafafa' }}>
                  
                  {/* MANIFESTO AUTOMÁTICO */}
                  <div style={{ gridColumn: 'span 3', background: '#fcfbf9', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '12px', padding: '25px', textAlign: 'center', marginBottom: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                     <h3 style={{ fontSize: '0.85rem', marginBottom: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>M/A — O Seu Manifesto</h3>
                     <p style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        "Uma identidade cirurgicamente desenhada para inspirar <b>{formData.sentimentos.join(' e ')}</b>, 
                        traduzindo toda a essência da {formData.marca || 'sua marca'} em conexões visuais perfeitas."
                     </p>
                  </div>

                  {/* Tipografia Principal e Secundária (Lado a Lado) */}
                  <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                     {/* Tipografia Primária (Logo) */}
                     {selectedTipo && tipografias.find(t => t.id === selectedTipo) && (
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '10px', border: '1px solid var(--border)' }}>
                           <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>Tipografia em Destaque (Logotipo)</p>
                           <img src={`${tipografias.find(t => t.id === selectedTipo).image_url}?t=${Date.now()}`} style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                     )}

                     {/* Tipografia Secundária (Texto) via CSS Pura */}
                     <div style={{ background: '#fff', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>Tipografia de Textos (Apoio)</p>
                        <div style={{ padding: '10px', background: 'var(--bg-soft)', borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                           <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-1px' }}>Aa</span>
                           <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Google Fonts: Inter</span>
                        </div>
                     </div>
                  </div>

                  {/* Paleta Escolhida */}
                  {selectedPaleta && paletas.find(p => p.id === selectedPaleta) && (
                     <div style={{ gridColumn: 'span 3', background: '#fff', borderRadius: '12px', padding: '10px', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>Sua Cartela de Cores</p>
                        <img src={`${paletas.find(p => p.id === selectedPaleta).image_url}?t=${Date.now()}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                     </div>
                  )}

                  {/* Moodboard Mosaico com Pinterest Style */}
                  <div style={{ gridColumn: 'span 3', columnCount: 2, columnGap: '10px', position: 'relative' }}>
                     <p style={{ columnSpan: 'all', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600, textAlign: 'center' }}>Elementos & Atmosfera (Inspiração)</p>
                     {moodboards.map(m => (
                        <div key={m.id} style={{ breakInside: 'avoid', marginBottom: '10px', width: '100%' }}>
                           <img src={`${m.image_url}?t=${Date.now()}`} style={{ width: '100%', borderRadius: '6px', objectFit: 'cover' }} />
                        </div>
                     ))}
                     
                     {/* DISCLAIMER DE PROTEÇÃO / AVISO */}
                     <div style={{ columnSpan: 'all', marginTop: '10px', padding: '12px', borderTop: '1px dashed var(--border)', breakInside: 'avoid' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                           <b>Nota de Design:</b> Este moodboard apresenta sugestões inspiracionais. O seu projeto será inédito e desenhado sob medida a partir desta exata essência visual.
                        </p>
                     </div>
                  </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10 }}>
                 <button onClick={() => setStep(12)} className="btn-primary" style={{ width: '100%', background: 'var(--accent-turquoise)' }}>Tornar essa Marca Minha 🤍</button>
              </div>
            </motion.div>
          )}

          {/* PLANOS DE COMPRA E CHECKOUT MÁGICO (Etapa 12) */}
          {step === 12 && (
            <motion.div 
              key="step12" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f7f9fa', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              {/* Painel Mural/Moodboard de Fundo focado */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', opacity: 0.15, overflow: 'hidden', pointerEvents: 'none' }}>
                  {moodboards.map(m => (
                     <div key={m.id} style={{ width: 'calc(33% - 8px)', height: '140px', background: `url(${m.image_url}) center/cover no-repeat`, borderRadius: '6px' }} />
                  ))}
              </div>

              {/* Camada Vitrine Escura */}
              <div style={{ position: 'relative', zIndex: 10, padding: '2.5rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                 <p style={{ color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>Invista no seu Negócio</p>
                 <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-magenta)', textAlign: 'center' }}>Escolha o seu Pacote</h2>
                 <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>A essência visual da <b>{formData.marca || 'sua marca'}</b> foi aprovada por você!<br/>Selecione como deseja receber a papelaria e arquivos:</p>

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
                       <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>Quero este pacote</button>
                    </motion.div>

                    {/* PACOTE COMPLETO */}
                    <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'var(--accent-magenta)', borderRadius: '16px', padding: '20px', color: '#ffffff', boxShadow: '0 8px 25px rgba(220, 52, 149, 0.2)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Pacote Completo</h3>
                          <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem' }}>R$ 897</span>
                       </div>
                       <ul style={{ fontSize: '0.9rem', margin: '0 0 15px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Tudo do Pacote Base</li>
                          
                          {/* LÓGICA DE BÔNUS DE PEDIATRIA */}
                          {formData.atuacao.includes('Pediatria') ? (
                             <li style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, listStyle: 'none', marginLeft: '-20px' }} onClick={() => setShowPediatriaModal(true)}>
                                🎁 <span style={{ textDecoration: 'underline' }}>EXCLUSIVO PEDIATRIA: Ver Papelaria Integrada (15 Itens)</span>
                             </li>
                          ) : (
                             <li>Papelaria Focada {formData.atuacao !== 'Outra área' && formData.atuacao !== '' ? `para ${formData.atuacao}` : 'Exclusiva'}</li>
                          )}

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

        {/* MODAL DE BÔNUS - PEDIATRIA */}
        <AnimatePresence>
           {showPediatriaModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                 <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} style={{ background: '#fff', width: '100%', maxWidth: '800px', height: '85vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    
                    <div style={{ padding: '20px', background: 'var(--accent-magenta)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Bônus: Papelaria Clínica</h2>
                          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Os clientes do Pacote Completo têm direito a 15 itens à escolha!</p>
                       </div>
                       <button onClick={() => setShowPediatriaModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                    </div>

                    <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', background: '#fcfcfc' }}>
                       {[
                         "Cartão de Visita", "Receituário Padrão", "Atestado Médico", "Cartão de Retorno", "Pasta A4 Exclusiva",
                         "Envelope", "Recibo", "Receituário de Controle Especial", "Dicas de Introdução Alimentar",
                         "Guia de Vacina c/ Calendário", "Ficha de Acompanhamento", "Orientação Pré-Natal",
                         "Cartão de Exames", "Checklist Maternidade", "Guia do Sono", "Orientações p/ Recém Nascidos",
                         "Prontuário Médico", "Receita de Alta", "Ficha de Cadastro",
                         "Certificado de Coragem", "Quadro de Incentivo", "Cartão de Aniversário Exclusivo",
                         "Arte para Caneca/Brindes", "Gráfico de Crescimento", "Diário do Xixi", "Card de Orientação de Sono",
                         "Meu Pratinho", "Guia de Amamentação", "Fundo de Tira Dúvidas Instagram"
                       ].map(item => (
                          <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                             <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent-magenta)' }} />
                             {item}
                          </label>
                       ))}
                    </div>

                    <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                       <button onClick={() => setShowPediatriaModal(false)} className="btn-primary" style={{ background: 'var(--accent-magenta)', width: '250px' }}>Salvar Minhas Escolhas</button>
                    </div>

                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>

      </div>
    </div>
  );
}
