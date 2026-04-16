'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import BrandTemplateSVG from '../components/BrandTemplateSVG';
import BrandBoard from '../components/BrandBoard';
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
  const [customStep, setCustomStep] = useState('tipo'); // 'tipo' ou 'paleta'
  const [editData, setEditData] = useState({
    marca: '',
    tagline: 'Design de Interiores', // Valor padrão inicial
    whatsapp: '',
    instagram: '',
    corAtiva: '',
    itemSelecionado: 'cartao', // 'cartao' ou 'tag'
    viewType: 'itens' // 'itens' ou 'placa'
  });
  
  const [showPediatriaModal, setShowPediatriaModal] = useState(false);
  const brandBoardRef = useRef(null);

  const downloadBrandBoard = async () => {
    if (brandBoardRef.current) {
      try {
        const canvas = await html2canvas(brandBoardRef.current, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#fafafa'
        });
        const link = document.createElement('a');
        link.download = `BrandBoard-${formData.marca || 'SuaMarca'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Erro ao gerar placa:", err);
      }
    }
  };

  // GERADOR DE PDF PARA IMPRESSÃO (85x55mm ou 40x80mm)
  const generatePrintPDF = async () => {
    const isCartao = editData.itemSelecionado === 'cartao';
    const dims = isCartao ? [85, 55] : [40, 80];
    
    const accentColor = editData.corAtiva || '#d22f5a';
    const isDoceEncanto = resultadoFinal?.estiloId === 2;

    try {
      // PÁGINA 1: PLACA DA MARCA (A4)
      const a4Width = 210;
      const a4Height = 297;
      
      // Adiciona página A4 se não for a padrão (a padrão já inicia com dims)
      // Melhor: Vamos iniciar o doc com A4 e depois adicionar as outras
      const docMaster = new jsPDF({ unit: 'mm', format: 'a4' });
      
      docMaster.setFillColor(255, 255, 255);
      docMaster.rect(0, 0, a4Width, a4Height, 'F');
      
      // Cabeçalho Placa
      docMaster.setDrawColor(50, 50, 50);
      docMaster.setLineWidth(0.2);
      docMaster.line(20, 30, a4Width - 20, 30);
      docMaster.setFont('helvetica', 'bold');
      docMaster.setFontSize(8);
      docMaster.text("LOGOMARCA PRINCIPAL", a4Width/2, 33, { align: 'center' });
      
      // Logo na Placa
      docMaster.setFont('times', 'bold');
      docMaster.setFontSize(22);
      docMaster.setTextColor(0,0,0);
      const logoWords = editData.marca.toUpperCase().split(' ');
      let boardY = 60;
      logoWords.forEach(w => {
         docMaster.text(w, a4Width/2, boardY, { align: 'center' });
         boardY += 10;
      });

      // Paleta na Placa
      docMaster.line(20, 110, a4Width - 20, 110);
      docMaster.text("PALETA DE CORES", a4Width/2, 113, { align: 'center' });
      
      const palette = resultadoFinal?.paleta || ['#eee','#ddd','#ccc','#bbb','#aaa'];
      let px = 25;
      palette.forEach(c => {
         docMaster.setFillColor(c);
         docMaster.rect(px, 125, 30, 20, 'F');
         docMaster.setFontSize(6);
         docMaster.text(c, px + 15, 150, { align: 'center' });
         px += 33;
      });

      // PÁGINA 2: FRENTE DO ITEM
      docMaster.addPage(dims, isCartao ? 'landscape' : 'portrait');
      docMaster.setFillColor(accentColor);
      docMaster.rect(0, 0, dims[0], dims[1], 'F');

      docMaster.setTextColor(0, 0, 0); 
      docMaster.setFont('times', 'bold');
      
      const words = editData.marca.toUpperCase().split(' ');
      const fontSize = words.length > 1 ? (editData.marca.length > 15 ? 12 : 14) : 18;
      const leading = fontSize * 0.4;
      
      docMaster.setFontSize(fontSize);
      let currentY = (dims[1] / 2) - ((words.length - 1) * (leading / 2));
      
      words.forEach((word) => {
        docMaster.text(word, dims[0] / 2, currentY, { align: 'center' });
        currentY += leading;
      });

      docMaster.setFontSize(isCartao ? 8 : 6); 
      docMaster.setFont('helvetica', 'normal');
      docMaster.text(editData.tagline.toUpperCase(), dims[0] / 2, currentY + 4, { align: 'center' });

      // PÁGINA 3: VERSO DO ITEM
      docMaster.addPage(dims, isCartao ? 'landscape' : 'portrait');
      docMaster.setFillColor(255, 255, 255);
      docMaster.rect(0, 0, dims[0], dims[1], 'F');
      
      docMaster.setDrawColor(accentColor);
      const borderWidth = isDoceEncanto ? 5 : 3;
      docMaster.setLineWidth(borderWidth);
      docMaster.roundedRect(2, 2, dims[0] - 4, dims[1] - 4, 3, 3, 'D');

      const sealX = isCartao ? dims[0] - 14 : dims[0] - 11;
      const sealY = 14;
      docMaster.setFillColor(accentColor);
      docMaster.circle(sealX, sealY, isCartao ? 7 : 5, 'F');
      docMaster.setTextColor(255, 255, 255);
      docMaster.setFontSize(isCartao ? 6 : 5);
      docMaster.text(editData.marca.substring(0, 2).toUpperCase(), sealX, sealY + 1, { align: 'center' });

      docMaster.setTextColor(30, 30, 30);
      docMaster.setFont('helvetica', 'normal');
      docMaster.setFontSize(isCartao ? 7 : 6);
      docMaster.text(`${editData.whatsapp}`, 8, dims[1] - (isCartao ? 14 : 11));
      docMaster.text(`@${editData.instagram}`, 8, dims[1] - (isCartao ? 10 : 8));

      docMaster.save(`IDENTIDADE-${editData.marca.toUpperCase()}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    }
  };

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
    
    if (resultadoFinal) {
      setStep(10);
      setEditData(prev => ({ 
        ...prev, 
        marca: formData.marca, 
        tagline: 'Identidade Visual', // Sugestão base
        instagram: formData.marca.toLowerCase().replace(/\s/g, ''),
        whatsapp: '(11) 99999-9999'
      }));
    }
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
    "Loja de Roupas / Marcas Infantis",
    "Obstetrícia / Saúde da mulher",
    "Clínica / Saúde geral adulta",
    "Terapia / Saúde mental",
    "Estética / Bem-estar / Nutrição",
    "Cosméticos Naturais / Bem-estar Consciente",
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
              <p style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>sonho de papel apresenta</p>
              {/* Logo com fonte Golden Blast */}
              <img src="/the-brand-box-logo.png" alt="the brand box." style={{ width: '85%', maxWidth: '420px', marginBottom: '0.5rem', mixBlendMode: 'multiply' }} />
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '85%', fontWeight: 500 }}>Sua marca já existe dentro de você.</p>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '85%' }}>A gente só ajuda ela a aparecer.<br/>Uma experiência guiada que transforma a essência do seu negócio em identidade visual — sem precisar saber nada de design.</p>
              <button onClick={nextStep} className="btn-primary">CRIAR MINHA MARCA AGORA</button>
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
                 <button onClick={() => setStep(11)} className="btn-primary" style={{ flex: 1, background: (selectedTipo && selectedPaleta) ? 'var(--accent-turquoise)' : '#ccc', pointerEvents: (selectedTipo && selectedPaleta) ? 'auto' : 'none' }}>Visualizar Minha Marca ✨</button>
              </div>
            </motion.div>
          )}

          {/* STEP 11: O MOODBOARD EMOCIONAL (AQUELE QUE ELA GOSTOU) */}
          {step === 11 && (
            <motion.div 
              key="step11" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', zIndex: 10, background: '#fff' }}>
                 <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 'bold' }}>Universo Visual de {formData.marca}</p>
                 <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-magenta)' }}>{resultadoFinal?.estiloNome}</h2>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#fafafa' }}>
                  {/* Manifesto na própria tela de Moodboard para impacto */}
                  <div style={{ gridColumn: 'span 3', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '25px', textAlign: 'center', marginBottom: '10px' }}>
                     <p style={{ fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        "{resultadoFinal.mensagem}"
                     </p>
                  </div>

                  {/* Mosaico Pinterest Estilo Original */}
                  <div style={{ gridColumn: 'span 3', columnCount: 2, columnGap: '10px' }}>
                     {moodboards.map(m => (
                        <div key={m.id} style={{ breakInside: 'avoid', marginBottom: '10px', width: '100%' }}>
                           <img src={`${m.image_url}?t=${Date.now()}`} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                        </div>
                     ))}
                  </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10 }}>
                 <button onClick={() => setStep(12)} className="btn-primary" style={{ width: '100%', background: 'var(--accent-turquoise)' }}>Ver Minha Placa da Marca ✨</button>
              </div>
            </motion.div>
          )}

          {/* STEP 12: BRAND BOARD TÉCNICO + PERSONALIZADOR (EDOITOR) */}
          {step === 12 && (
            <motion.div 
              key="step12" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* PREVIEW DA PLACA (Área de Visualização) */}
                <div 
                  ref={brandBoardRef}
                  style={{ background: '#fff', padding: '35px', borderBottom: '1px solid #eee' }}
                >
                  {/* Cabeçalho dinâmico com a cor editada */}
                  <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '4px', fontWeight: 700, marginBottom: '8px' }}>brand box editor • live preview</p>
                    <h2 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', fontFamily: "'Georgia', serif", fontStyle: 'italic', margin: '8px 0' }}>{editData.marca}</h2>
                    <div style={{ width: '40px', height: '1.5px', background: editData.corAtiva || 'var(--accent-magenta)', margin: '0 auto' }}></div>
                  </div>

                  {/* Logotipo Circular Dinâmico */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '35px' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px', animation: 'spin 20s linear infinite' }}>
                      <path id="boardPath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                      <text style={{ fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fill: editData.corAtiva || 'var(--accent-magenta)' }}>
                        <textPath xlinkHref="#boardPath">
                          {editData.marca} • {editData.marca} • {editData.marca} • 
                        </textPath>
                      </text>
                      <circle cx="50" cy="50" r="4" fill={editData.corAtiva || 'var(--accent-magenta)'} />
                    </svg>
                  </div>

                  {/* VISUALIZADOR DE IMPRESSÃO (FRENTE E VERSO LADO A LADO) */}
                  <div style={{ background: '#f8f8f8', padding: '40px 20px', borderRadius: '20px', textAlign: 'center', marginBottom: '35px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
                     <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', marginBottom: '25px' }}>Visualização para Gráfica (1:1)</p>
                     
                     <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
                        <button 
                           onClick={() => setEditData(prev => ({ ...prev, viewType: 'itens' }))}
                           style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: editData.viewType === 'itens' ? 'var(--dark-charcoal)' : '#eee', color: editData.viewType === 'itens' ? '#fff' : '#666', border: 'none', cursor: 'pointer', letterSpacing: '1px' }}>
                           📄 ITENS
                        </button>
                        <button 
                           onClick={() => setEditData(prev => ({ ...prev, viewType: 'placa' }))}
                           style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: editData.viewType === 'placa' ? 'var(--dark-charcoal)' : '#eee', color: editData.viewType === 'placa' ? '#fff' : '#666', border: 'none', cursor: 'pointer', letterSpacing: '1px' }}>
                           📕 PLACA DA MARCA
                        </button>
                     </div>

                     <div style={{ 
                        display: 'flex', 
                        flexDirection: editData.itemSelecionado === 'cartao' ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '25px',
                        flexWrap: 'wrap'
                     }}>
                        {editData.viewType === 'placa' ? (
                           <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', width: '100%', display: 'flex', justifyContent: 'center' }}>
                              <BrandBoard 
                                 data={editData} 
                                 palette={paletas.find(p => p.id === selectedPaleta)?.paleta_hex || resultadoFinal?.paleta || []} 
                                 color={editData.corAtiva} 
                              />
                           </div>
                        ) : (
                           <>
                              <div style={{ textAlign: 'center' }}>
                                 <p style={{ fontSize: '0.6rem', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Frente</p>
                                 <div style={{ 
                                    width: editData.itemSelecionado === 'cartao' ? '300px' : '180px', 
                                    height: editData.itemSelecionado === 'cartao' ? '180px' : '280px', 
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.1))'
                                 }}>
                                    <BrandTemplateSVG data={editData} color={editData.corAtiva} side="frente" />
                                 </div>
                              </div>

                              <div style={{ textAlign: 'center' }}>
                                 <p style={{ fontSize: '0.6rem', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verso</p>
                                 <div style={{ 
                                    width: editData.itemSelecionado === 'cartao' ? '300px' : '180px', 
                                    height: editData.itemSelecionado === 'cartao' ? '180px' : '280px', 
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.1))'
                                 }}>
                                    <BrandTemplateSVG data={editData} color={editData.corAtiva} side="verso" />
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                  </div>
                </div>

                {/* PAINEL DE PERSONALIZAÇÃO (O EDITOR) */}
                <div style={{ padding: '25px', background: '#fcfcfc', flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Personalize seus Itens ✨</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Escolha do Item */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                       <button onClick={() => setEditData({...editData, itemSelecionado: 'cartao'})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: editData.itemSelecionado === 'cartao' ? '2px solid var(--accent-turquoise)' : '1px solid #ddd', background: '#fff', fontSize: '0.8rem' }}>Cartão (85x55)</button>
                       <button onClick={() => setEditData({...editData, itemSelecionado: 'tag'})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: editData.itemSelecionado === 'tag' ? '2px solid var(--accent-turquoise)' : '1px solid #ddd', background: '#fff', fontSize: '0.8rem' }}>Tag (40x80)</button>
                    </div>

                    {/* Inputs de Texto */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                       <div>
                          <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Nome no Item</label>
                          <input 
                            className="form-input" value={editData.marca} 
                            onChange={(e) => setEditData({...editData, marca: e.target.value})}
                            style={{ marginTop: '5px', padding: '8px 12px' }}
                          />
                       </div>
                       <div>
                          <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Tagline (Slogan)</label>
                          <input 
                            className="form-input" value={editData.tagline} 
                            onChange={(e) => setEditData({...editData, tagline: e.target.value})}
                            style={{ marginTop: '5px', padding: '8px 12px' }}
                          />
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                       <div>
                          <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>WhatsApp</label>
                          <input 
                            className="form-input" value={editData.whatsapp} 
                            onChange={(e) => setEditData({...editData, whatsapp: e.target.value})}
                            style={{ marginTop: '5px', padding: '8px 12px' }}
                          />
                       </div>
                       <div>
                          <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Instagram</label>
                          <input 
                            className="form-input" value={editData.instagram} 
                            onChange={(e) => setEditData({...editData, instagram: e.target.value})}
                            style={{ marginTop: '5px', padding: '8px 12px' }}
                          />
                       </div>
                    </div>

                    {/* Escolha da Cor de Destaque (Baseado na Paleta) */}
                    <div>
                       <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Cor de Destaque da Marca</label>
                       <div style={{ display: 'flex', gap: '12px' }}>
                          {/* Botões de Cores (Cores padrão para o teste se não houver hex no banco) */}
                          {['#f06292', '#4db6ac', '#81c784', '#e1a6ad', '#b8a18b'].map(color => (
                             <div 
                               key={color} 
                               onClick={() => setEditData({...editData, corAtiva: color})}
                               style={{ width: '28px', height: '28px', borderRadius: '50%', background: color, cursor: 'pointer', border: editData.corAtiva === color ? '2px solid #000' : 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                             ></div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={downloadBrandBoard} className="btn-secondary" style={{ flex: 1 }}>📥 Baixar Placa</button>
                    <button onClick={generatePrintPDF} className="btn-primary" style={{ flex: 1, background: 'var(--accent-turquoise)' }}>📄 Baixar PDF do {editData.itemSelecionado === 'cartao' ? 'Cartão' : 'Tag'}</button>
                 </div>
                 <button onClick={() => setStep(13)} className="btn-secondary" style={{ width: '100%', border: 'none', color: '#999', fontSize: '0.8rem' }}>Próximo Passo: Checkout →</button>
              </div>
            </motion.div>
          )}

          {/* PLANOS DE COMPRA E CHECKOUT (Etapa 13) */}
          {step === 13 && (
            <motion.div 
              key="step13" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#faf9f7', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'relative', zIndex: 10, padding: '2rem 1.5rem 1rem', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                
                {/* Cabeçalho */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 600, marginBottom: '0.5rem' }}>sua marca ganhou forma</p>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>Escolha como você quer<br/>viver sua marca</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Sua marca já começou a ganhar forma.<br/>Agora é hora de levar isso para o mundo.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* PLANO 1 — Experience (leve) */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Experience</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>Crie sua marca com uma experiência guiada,<br/>mesmo sem saber nada de design.</p>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.3rem', whiteSpace: 'nowrap' }}>R$ 497</span>
                    </div>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 15px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Logo principal + variações', 'Paleta de cores + tipografia', 'Guia simples de uso da marca', 'Cartão de visita interativo'].map(i => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--accent-turquoise)', fontWeight: 700 }}>✔</span>{i}</li>)}
                    </ul>
                    <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>Começar minha marca</button>
                  </motion.div>

                  {/* FRASE ENTRE PLANOS */}
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', padding: '0 1rem', lineHeight: 1.6 }}>Você pode seguir sozinha —<br/>ou ter alguém criando com você.</p>

                  {/* PLANO 2 — Complete (DESTAQUE) */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#f5d6e8', borderRadius: '16px', padding: '20px', color: '#3a1a2e', boxShadow: '0 8px 30px rgba(220,52,149,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(220,52,149,0.15)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--accent-magenta)' }}>MAIS ESCOLHIDO</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingRight: '80px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--accent-magenta)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: '#3a1a2e', fontSize: '1.2rem', fontWeight: 700 }}>Complete</h3>
                        <p style={{ color: '#6b3d5a', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>Uma imersão completa para transformar sua marca<br/>em uma presença forte e encantadora.</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.4rem', display: 'block', marginBottom: '12px', color: '#3a1a2e' }}>R$ 897</span>
                    <ul style={{ fontSize: '0.85rem', margin: '0 0 15px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Tudo do Brand Box Experience', 'Papelaria personalizada para sua marca', 'Templates editáveis para Instagram', 'Elementos visuais (mockups, ícones, avatares)', '✨ Manifesto da sua marca', '✨ Tom de voz e comunicação da marca', '✨ Direção para seu conteúdo', '✨ Sugestão de bio e posicionamento'].map(i => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a1f3a' }}>
                          {!i.startsWith('✨') && <span style={{ color: 'var(--accent-magenta)', fontWeight: 700 }}>✔</span>}
                          {i}
                        </li>
                      ))}
                    </ul>
                    <button className="btn-primary" style={{ width: '100%', padding: '12px', background: 'var(--accent-magenta)', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Quero minha marca completa</button>
                  </motion.div>

                  {/* PLANO 3 — Signature (clean e elegante) */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#1a1a1a', borderRadius: '16px', padding: '20px', border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Signature</h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>Para quem quer uma marca exclusiva,<br/>criada junto com uma designer.</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', opacity: 0.8 }}>A partir de<br/>R$ 2.900</span>
                    </div>
                    <ul style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 15px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Direção criativa personalizada', 'Ajustes e refinamentos exclusivos', 'Aplicações pensadas para o seu negócio', 'Acompanhamento próximo durante o processo'].map(i => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>✔</span>{i}</li>)}
                    </ul>
                    <button style={{ width: '100%', padding: '12px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px', transition: 'all 0.2s' }}>Quero criar com você</button>
                  </motion.div>

                  {/* Micro copy final */}
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '0.5rem 1rem 1.5rem', lineHeight: 1.6 }}>Não precisa saber por onde começar.<br/>Eu te guio em cada etapa.</p>

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
