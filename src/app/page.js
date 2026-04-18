'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import BrandTemplateSVG from '../components/BrandTemplateSVG';
import BrandBoard from '../components/BrandBoard';
import { createClient } from '@supabase/supabase-js';
import FONT_MAP from '../lib/fontMap';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [step, setStep] = useState(1);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [selectedTagline, setSelectedTagline] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: []
  });

  // Sugestões de tagline agrupadas por categoria
  const TAGLINES_BY_ESTILO = {
    'Jardim Encantado':       ['Onde cada detalhe floresce com amor', 'Cuidado que encanta, saúde que transforma', 'Pequenos sonhos, grandes cuidados'],
    'Escandinavo Acolhedor':  ['Simples, humano e essencial', 'Cuidado com presença e leveza', 'O cuidado que você merece'],
    'Essência Atemporal':     ['Elegância que cuida, confiança que permanece', 'Sofisticação com propósito', 'Cuidado que não precisa se explicar'],
    'Doce Encantamento':      ['Delicadeza em cada detalhe', 'Feito com carinho para momentos especiais', 'Amor e cuidado em cada encontro'],
    'Raízes & Cuidado':       ['Da natureza para o seu cuidado', 'Natural, consciente e verdadeiro', 'Raízes que nutrem, cuidado que transforma'],
    'Estético Editorial':     ['Precisão, cuidado e resultado', 'Onde ciência encontra beleza', 'Excelência que você vê e sente'],
  };

  const getTaglineSuggestions = () => {
    const estilo = resultadoFinal?.estiloNome || '';
    return TAGLINES_BY_ESTILO[estilo] || TAGLINES_BY_ESTILO['Essência Atemporal'];
  };

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
  const [estampas, setEstampas] = useState([]);
  const [generatedPatterns, setGeneratedPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [patternLoading, setPatternLoading] = useState(false);
  
  const [selectedPaleta, setSelectedPaleta] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [customStep, setCustomStep] = useState('tipo');
  const [editData, setEditData] = useState({
    marca: '',
    tagline: 'Design de Interiores',
    whatsapp: '',
    instagram: '',
    corAtiva: '',
    itemSelecionado: 'cartao',
    viewType: 'itens'
  });
  
  const [showPediatriaModal, setShowPediatriaModal] = useState(false);
  const [patternGenerationCount, setPatternGenerationCount] = useState(0);
  const [showRefazerModal, setShowRefazerModal] = useState(false);
  const [refazerAttempts, setRefazerAttempts] = useState(0);
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [marcaSugestaoAceita, setMarcaSugestaoAceita] = useState(false);
  const brandBoardRef = useRef(null);

  // Restaura progresso salvo ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brandbox_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.selectedTagline) setSelectedTagline(parsed.selectedTagline);
        if (parsed.customTagline) setCustomTagline(parsed.customTagline);
        if (parsed.editData) setEditData(prev => ({ ...prev, ...parsed.editData }));
        if (parsed.patternGenerationCount) setPatternGenerationCount(parsed.patternGenerationCount);
        if (parsed.refazerAttempts) setRefazerAttempts(parsed.refazerAttempts);
      }
    } catch(e) { /* ignora dados corrompidos */ }
  }, []);

  // Salva progresso automaticamente
  useEffect(() => {
    try {
      localStorage.setItem('brandbox_progress', JSON.stringify({
        step, formData, selectedTagline, customTagline,
        editData: { marca: editData.marca, tagline: editData.tagline, whatsapp: editData.whatsapp, instagram: editData.instagram },
        patternGenerationCount, refazerAttempts
      }));
    } catch(e) {}
  }, [step, formData, selectedTagline, customTagline, editData]);

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
       setEstampas(varData.filter(d => d.tipo === 'ESTAMPA'));
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

  const MAX_PATTERN_GENERATIONS = 3;

  const generatePatterns = async () => {
    if (patternGenerationCount >= MAX_PATTERN_GENERATIONS) {
      alert('Você atingiu o limite de 3 gerações de estampa. Tente novamente amanhã!');
      return;
    }
    setPatternGenerationCount(c => c + 1);
    setPatternLoading(true);
    setGeneratedPatterns([]);
    try {
      const sel = paletas.find(p => p.id === selectedPaleta);
      const cores = sel?.paleta_hex || sel?.cores_hex || [];
      
      // Selecionar 2 estampas aleatórias diferentes como referência
      const shuffled = [...estampas].sort(() => Math.random() - 0.5);
      const refs = shuffled.slice(0, 2).map(e => e.image_url);
      console.log('🎨 Referências de estampa:', refs);
      console.log('🎨 Total estampas no banco:', estampas.length);
      
      const res = await fetch('/api/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paleta: cores,
          estiloNome: resultadoFinal?.estiloNome || 'Elegante',
          marca: formData.marca || 'Marca',
          descricao: resultadoFinal?.mensagem || '',
          referenceUrls: refs
        })
      });
      
      const data = await res.json();
      if (data.success && data.images) {
        setGeneratedPatterns(data.images);
      } else {
        console.error('Erro na geração:', data.error);
        alert('Ops! Não conseguimos gerar as estampas. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro chamando API:', err);
      alert('Erro de conexão. Verifique se o servidor está rodando.');
    }
    setPatternLoading(false);
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
     const tipo = tipografias.find(t => t.id === id);
     if (tipo) {
       const fontInfo = FONT_MAP[tipo.nome_variacao];
       if (fontInfo) {
         setEditData(prev => ({ 
           ...prev, 
           fontFamily: fontInfo.fontFamily, 
           fontWeight: fontInfo.weight || 400,
           fontStyle: fontInfo.style || 'serif',
           fontSizeBoost: fontInfo.sizeBoost || 1,
           fontLetterSpacing: fontInfo.letterSpacing || '0px'
         }));
       }
     }
     setTimeout(() => setCustomStep('paleta'), 300);
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
    "Marca Pessoal / Profissional Liberal",
    "Loja de Roupas / Moda Infantil"
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

              {/* DEV SHORTCUTS - só aparece em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '12px', width: '100%' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#856404', marginBottom: '8px', letterSpacing: '1px' }}>⚡ ATALHO DEV (sem gastar crédito)</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {[
                      { id: 2, nome: 'Jardim Encantado' },
                      { id: 3, nome: 'Escandinavo Acolhedor' },
                      { id: 5, nome: 'Essência Atemporal' },
                      { id: 6, nome: 'Raízes & Cuidado' },
                      { id: 8, nome: 'Doce Encantamento' },
                      { id: 10, nome: 'Estético Editorial' },
                    ].map(e => (
                      <button key={e.id} onClick={() => {
                        setFormData(prev => ({ ...prev, marca: prev.marca || 'Minha Marca', nome: prev.nome || 'Dev' }));
                        setResultadoFinal({ estiloId: e.id, estiloNome: e.nome, mensagem: `Teste direto do estilo ${e.nome}` });
                        setStep(9);
                      }} style={{ padding: '5px 10px', fontSize: '0.65rem', borderRadius: '8px', border: '1px solid #856404', background: '#fff', color: '#856404', cursor: 'pointer' }}>
                        {e.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Este nome vai guiar toda a sua identidade visual.</p>
              <div style={{ width: '100%', marginBottom: '0.75rem' }}>
                <input name="marca" value={formData.marca} onChange={e => { handleInput(e); setMarcaSugestaoAceita(false); }} placeholder="Ex: Clínica Sonho Meu..." />
              </div>

              {/* Contador de palavras */}
              {formData.marca && (() => {
                const palavras = formData.marca.trim().split(/\s+/).filter(Boolean);
                const count = palavras.length;
                const ok = count <= 3;
                return (
                  <p style={{ fontSize: '0.78rem', color: ok ? '#3cccbf' : '#e07a30', fontWeight: 600, marginBottom: '0.75rem', transition: 'color 0.3s' }}>
                    {ok ? `${count} palavra${count > 1 ? 's' : ''} — ótimo para uma logo bonita ✓` : `${count} palavras — veja a dica abaixo`}
                  </p>
                );
              })()}

              {/* Confirmação de sugestão aceita */}
              {marcaSugestaoAceita && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                  <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                    ✅ Nome atualizado! Ficou muito mais elegante para a logo.
                  </p>
                </motion.div>
              )}

              {/* Dica para nomes longos */}
              {!marcaSugestaoAceita && formData.marca && formData.marca.trim().split(/\s+/).filter(Boolean).length >= 4 && (() => {
                const palavras = formData.marca.trim().split(/\s+/).filter(Boolean);
                const temTitulo = /^(dra?\.?|dr\.?)$/i.test(palavras[0]);
                const nomesSemTitulo = temTitulo ? palavras.slice(1) : palavras;
                let sugestao = '';
                if (nomesSemTitulo.length >= 3) {
                  const abreviados = nomesSemTitulo.slice(1, -1).map(n => n.charAt(0).toUpperCase() + '.');
                  sugestao = (temTitulo ? palavras[0] + ' ' : '') + nomesSemTitulo[0] + ' ' + abreviados.join(' ') + ' ' + nomesSemTitulo[nomesSemTitulo.length - 1];
                }
                return (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff8f0', border: '1px solid #f5d9b8', borderRadius: '12px', padding: '12px 14px', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                    <p style={{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6, marginBottom: sugestao ? '8px' : '0' }}>
                      💡 <strong>Dica visual:</strong> nomes longos ficam difíceis de ler na logo. Abreviar o nome do meio mantém a elegância sem perder a identidade.
                    </p>
                    {sugestao && (
                      <button
                        onClick={() => { setFormData(prev => ({ ...prev, marca: sugestao })); setMarcaSugestaoAceita(true); }}
                        style={{ fontSize: '0.8rem', color: '#e07a30', background: 'rgba(224,122,48,0.08)', border: '1px solid rgba(224,122,48,0.3)', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Usar "{sugestao}"
                      </button>
                    )}
                  </motion.div>
                );
              })()}

              {/* Dica sobre título Dra./Dr. */}
              {formData.marca && /^(dra?\.?|dr\.?)\s/i.test(formData.marca.trim()) && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0f7ff', border: '1px solid #c0d8f5', borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                  <p style={{ fontSize: '0.8rem', color: '#2a5a8a', lineHeight: 1.6 }}>
                    👩‍⚕️ Quer manter o título <strong>Dra.</strong> na logo? Fica lindo em alguns estilos! Pode deixar — a gente vai usar na identidade visual.
                  </p>
                </motion.div>
              )}

              <button onClick={nextStep} className="btn-secondary" style={{ opacity: formData.marca ? 1 : 0.5, pointerEvents: formData.marca ? 'auto' : 'none', marginTop: '0.5rem' }}>Avançar 🤍</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '50%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Qual é a sua área de atuação?</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Escolha a que mais combina com o seu negócio.</p>
              <div style={{ width: '100%', marginBottom: '1rem', overflowY: 'auto', maxHeight: '45vh' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '4px' }}>
                  {areas.map(a => (
                    <button
                      key={a}
                      onClick={() => setSingleChoice('atuacao', a)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '14px',
                        border: formData.atuacao === a ? '2px solid var(--accent-turquoise)' : '1.5px solid var(--border)',
                        background: formData.atuacao === a ? 'rgba(60,204,191,0.08)' : '#fafafa',
                        color: formData.atuacao === a ? 'var(--accent-turquoise)' : 'var(--text-primary)',
                        fontWeight: formData.atuacao === a ? 700 : 500,
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
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

              {refazerAttempts < 2 ? (
                <button
                  onClick={() => setShowRefazerModal(true)}
                  style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Refazer o questionário ({2 - refazerAttempts} tentativa{2 - refazerAttempts !== 1 ? 's' : ''} restante{2 - refazerAttempts !== 1 ? 's' : ''})
                </button>
              ) : (
                <p style={{ marginTop: '12px', fontSize: '0.78rem', color: '#bbb', textAlign: 'center' }}>
                  Limite de tentativas atingido.
                </p>
              )}
            </motion.div>
          )}

          {/* MODAL REFAZER */}
          <AnimatePresence>
            {showRefazerModal && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                >
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</p>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Tem certeza?</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Você perderá o modelo gerado e <strong>não poderá recuperá-lo</strong>.<br/>
                    Após refazer, você terá mais <strong>{1 - refazerAttempts} tentativa{1 - refazerAttempts !== 1 ? 's' : ''}</strong> restante{1 - refazerAttempts !== 1 ? 's' : ''}.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setShowRefazerModal(false)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setShowRefazerModal(false);
                        setRefazerAttempts(a => a + 1);
                        setResultadoFinal(null);
                        setGeneratedPatterns([]);
                        setSelectedPattern(null);
                        setSelectedPaleta(null);
                        setSelectedTipo(null);
                        setStep(1);
                      }}
                      className="btn-primary"
                      style={{ flex: 1, padding: '12px', background: 'var(--accent-magenta)' }}
                    >
                      Sim, refazer
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 10 && (
            <motion.div 
              key="step10" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border)', overflowY: 'hidden' }}
            >
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>Refinamento Visual</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
                {customStep === 'tipo' ? '1. Escolha a sua Tipografia ideal' : customStep === 'paleta' ? '2. Defina sua Paleta de Cores' : '3. Qual cor será o destaque da sua marca?'}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                 <div onClick={() => setCustomStep('tipo')} style={{ height: '6px', width: '30%', borderRadius: '4px', cursor: 'pointer', background: customStep === 'tipo' ? 'var(--accent-turquoise)' : (selectedTipo ? 'var(--accent-turquoise)' : 'var(--border)'), opacity: customStep === 'tipo' ? 1 : 0.4, transition: 'all 0.3s' }} />
                 <div onClick={() => selectedTipo ? setCustomStep('paleta') : null} style={{ height: '6px', width: '30%', borderRadius: '4px', cursor: selectedTipo ? 'pointer' : 'default', background: customStep === 'paleta' ? 'var(--accent-magenta)' : (selectedPaleta ? 'var(--accent-magenta)' : 'var(--border)'), opacity: customStep === 'paleta' ? 1 : 0.4, transition: 'all 0.3s' }} />
                 <div onClick={() => selectedPaleta ? setCustomStep('cor') : null} style={{ height: '6px', width: '30%', borderRadius: '4px', cursor: selectedPaleta ? 'pointer' : 'default', background: customStep === 'cor' ? 'var(--accent-magenta)' : (editData.corAtiva ? 'var(--accent-magenta)' : 'var(--border)'), opacity: customStep === 'cor' ? 1 : 0.4, transition: 'all 0.3s' }} />
              </div>

              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  {customStep === 'tipo' && (
                     <motion.div key="ctipo" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {tipografias.map(t => {
                          const fontInfo = FONT_MAP[t.nome_variacao];
                          const fontFamily = fontInfo?.fontFamily || 'Outfit';
                          const fontWeight = fontInfo?.weight || 400;
                          const isScript = fontInfo?.style === 'script';
                          const sizeBoost = fontInfo?.sizeBoost || 1;
                          const extraSpacing = fontInfo?.letterSpacing || '0px';
                          const isPrimary = t.nome_variacao.includes('principal') || t.nome_variacao.includes('primaria') || t.nome_variacao.includes('destaque');
                          // Mostrar o nome da marca no estilo da fonte
                          const brandName = formData.marca || 'Sua Marca';
                          const displayName = isScript 
                            ? brandName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                            : brandName.toUpperCase();
                          const baseSize = isPrimary ? 1.3 : 1.15;
                          const finalSize = `${(baseSize * sizeBoost).toFixed(2)}rem`;
                          return (
                            <div key={t.id} onClick={() => selectTipoItem(t.id)} style={{ 
                              border: selectedTipo === t.id ? '3px solid var(--accent-turquoise)' : '1px solid var(--border)', 
                              borderRadius: '12px', padding: '15px 10px', cursor: 'pointer', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              minHeight: '110px', background: selectedTipo === t.id ? 'rgba(60,204,191,0.05)' : '#fafafa',
                              transition: 'all 0.2s ease',
                              boxShadow: selectedTipo === t.id ? '0 4px 15px rgba(60,204,191,0.2)' : 'none'
                            }}>
                              <p style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: finalSize, textAlign: 'center', lineHeight: 1.2, color: '#333', letterSpacing: extraSpacing }}>
                                {displayName}
                              </p>
                              <p style={{ fontSize: '0.5rem', color: '#aaa', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Outfit', sans-serif" }}>
                                {fontFamily}
                              </p>
                            </div>
                          );
                        })}
                     </motion.div>
                  )}

                  {customStep === 'paleta' && (
                     <motion.div key="cpaleta" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {paletas.map((p, pi) => {
                          const cores = p.paleta_hex || p.cores_hex || [];
                          const blobShapes = [
                            '60% 40% 55% 45% / 50% 60% 40% 50%',
                            '45% 55% 50% 50% / 55% 45% 55% 45%',
                            '50% 50% 40% 60% / 45% 55% 50% 50%',
                            '55% 45% 60% 40% / 50% 50% 45% 55%',
                            '40% 60% 50% 50% / 60% 40% 55% 45%',
                          ];
                          const row1 = cores.slice(0, 3);
                          const row2 = cores.slice(3, 5);
                          return (
                            <div key={p.id} onClick={() => { setSelectedPaleta(p.id); setTimeout(() => setCustomStep('cor'), 300); }} style={{ 
                              border: selectedPaleta === p.id ? '2px solid var(--accent-magenta)' : '1px solid var(--border)', 
                              borderRadius: '16px', padding: '20px 12px', cursor: 'pointer', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              background: selectedPaleta === p.id ? 'rgba(210,47,90,0.03)' : '#fafafa',
                              transition: 'all 0.2s ease',
                              boxShadow: selectedPaleta === p.id ? '0 4px 15px rgba(210,47,90,0.15)' : 'none'
                            }}>
                              {cores.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    {row1.map((hex, ci) => (
                                      <div key={ci} style={{
                                        width: ci === 0 ? '58px' : '50px',
                                        height: ci === 0 ? '58px' : '50px',
                                        backgroundColor: hex,
                                        borderRadius: blobShapes[(ci + pi) % blobShapes.length],
                                        boxShadow: `0 3px 10px ${hex}35`,
                                      }} />
                                    ))}
                                  </div>
                                  {row2.length > 0 && (
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                      {row2.map((hex, ci) => (
                                        <div key={ci} style={{
                                          width: '46px',
                                          height: '46px',
                                          backgroundColor: hex,
                                          borderRadius: blobShapes[(ci + 3 + pi) % blobShapes.length],
                                          boxShadow: `0 3px 10px ${hex}35`,
                                        }} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <img src={`${p.image_url}?t=${Date.now()}`} alt={p.nome_variacao} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                              )}
                            </div>
                          );
                        })}
                     </motion.div>
                  )}

                  {customStep === 'cor' && (
                     <motion.div key="ccor" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px', paddingBottom: '2rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5 }}>
                          Essa cor será usada no logo, submarca e nos elementos de destaque da sua identidade visual.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {(() => {
                            const sel = paletas.find(p => p.id === selectedPaleta);
                            console.log('🎯 Cor picker - selectedPaleta:', selectedPaleta, 'sel:', sel);
                            console.log('🎯 Todas paletas:', paletas.map(p => ({ id: p.id, hex: p.paleta_hex, cores: p.cores_hex })));
                            // Tenta: paleta_hex da selecionada > cores_hex > qualquer paleta com hex
                            let cores = sel?.paleta_hex || sel?.cores_hex || [];
                            if (cores.length === 0) {
                              const qualquer = paletas.find(p => (p.paleta_hex?.length > 0) || (p.cores_hex?.length > 0));
                              cores = qualquer?.paleta_hex || qualquer?.cores_hex || [];
                            }
                            if (cores.length === 0) return <p style={{ color: '#999', fontSize: '0.8rem' }}>Nenhuma cor encontrada. Rode o upload_drive.mjs para este estilo.</p>;
                            return cores.map((hex, i) => (
                              <div
                                key={i}
                                onClick={() => setEditData(prev => ({ ...prev, corAtiva: hex }))}
                                style={{
                                  width: '60px', height: '60px', borderRadius: '50%',
                                  background: hex, cursor: 'pointer',
                                  border: editData.corAtiva === hex ? '4px solid #333' : '3px solid #fff',
                                  boxShadow: editData.corAtiva === hex ? '0 0 0 2px #333, 0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.15)',
                                  transition: 'all 0.2s ease',
                                  transform: editData.corAtiva === hex ? 'scale(1.15)' : 'scale(1)'
                                }}
                              />
                            ));
                          })()}
                        </div>
                        {editData.corAtiva && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Cor selecionada: <span style={{ color: editData.corAtiva, fontWeight: 800 }}>{editData.corAtiva}</span>
                          </p>
                        )}
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                 {customStep === 'paleta' && <button onClick={() => setCustomStep('tipo')} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>}
                 {customStep === 'cor' && <button onClick={() => setCustomStep('paleta')} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>}
                 <button onClick={() => setStep(11)} className="btn-primary" style={{ flex: 1, background: (selectedTipo && selectedPaleta && editData.corAtiva) ? 'var(--accent-turquoise)' : '#ccc', pointerEvents: (selectedTipo && selectedPaleta && editData.corAtiva) ? 'auto' : 'none' }}>Ver Minha Inspiração ✨</button>
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
                 <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '2px' }}>Moodboard</p>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '1px' }}>Universo Visual de {formData.marca}</p>
                 <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-magenta)' }}>{resultadoFinal?.estiloNome}</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#fafafa' }}>
                  {/* Nota sobre referências visuais */}
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '8px 15px', marginBottom: '5px' }}>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                        ✨ As imagens abaixo são <strong>referências visuais</strong> que servirão de inspiração para criar a identidade da sua marca. Elas não farão parte do material final — são o ponto de partida do seu universo visual.
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
                 <button onClick={() => { setSelectedTagline(''); setCustomTagline(''); setStep(11.5); }} className="btn-primary" style={{ width: '100%', background: 'var(--accent-turquoise)' }}>Criar meu Slogan ✨</button>
              </div>
            </motion.div>
          )}

          {/* STEP 11.5: ESCOLHA SEU SLOGAN */}
          {step === 11.5 && (
            <motion.div
              key="step115" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', background: '#fff', zIndex: 10 }}>
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '4px' }}>Sua Voz de Marca</p>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>Qual o seu slogan?</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Escolha uma sugestão ou escreva do seu jeito</p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Sugestões para o estilo {resultadoFinal?.estiloNome}
                </p>

                {getTaglineSuggestions().map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedTagline(opt); setCustomTagline(''); }}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: selectedTagline === opt ? '2px solid var(--accent-turquoise)' : '1.5px solid var(--border)',
                      background: selectedTagline === opt ? 'rgba(60,204,191,0.07)' : '#fafafa',
                      color: selectedTagline === opt ? 'var(--accent-turquoise)' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: selectedTagline === opt ? 600 : 400,
                      transition: 'all 0.2s ease',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedTagline === opt ? '✓  ' : ''}{opt}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '4px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Ou escreva o seu
                  </p>
                  <textarea
                    placeholder="Ex: Cuidado que transforma vidas · Pediatria Integrativa · Saúde da Mulher"
                    value={customTagline}
                    onChange={(e) => { setCustomTagline(e.target.value); setSelectedTagline(''); }}
                    rows={2}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: customTagline ? '2px solid var(--accent-magenta)' : '1.5px solid var(--border)', fontSize: '0.95rem', resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)' }}
                  />
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    Pode ser um slogan, sua especialidade ou uma frase que representa você.
                  </p>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(11)} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>
                <button
                  onClick={() => {
                    const tagline = customTagline.trim() || selectedTagline;
                    setEditData(prev => ({ ...prev, tagline: tagline || 'Identidade Visual' }));
                    setStep(11.7);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, background: (selectedTagline || customTagline.trim()) ? 'var(--accent-magenta)' : '#ccc', pointerEvents: (selectedTagline || customTagline.trim()) ? 'auto' : 'none' }}
                >
                  Criar Minha Estampa ✨
                </button>
              </div>
            </motion.div>
          )}
          {/* STEP 11.7: GERAÇÃO DE ESTAMPA COM IA */}
          {step === 11.7 && (
            <motion.div 
              key="step117" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '2rem 2rem 0.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-magenta)', marginBottom: '8px' }}>THE BRAND BOX</p>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Sua Estampa Exclusiva</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                
                {/* Estado inicial: botão gerar */}
                {generatedPatterns.length === 0 && !patternLoading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
                      Agora a mágica acontece! ✨<br/>
                      <span style={{ fontSize: '0.8rem' }}>A <strong>The Brand Box</strong> vai criar uma estampa que traduz a essência da sua marca em cada detalhe.</span>
                    </p>
                    {estampas.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {estampas.slice(0, 3).map(e => (
                          <img key={e.id} src={`${e.image_url}?t=1`} style={{ width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)', opacity: 0.7 }} />
                        ))}
                        <p style={{ width: '100%', textAlign: 'center', fontSize: '0.6rem', color: '#bbb', marginTop: '2px' }}>Referências do seu universo visual</p>
                      </div>
                    )}
                    <button onClick={generatePatterns} className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-magenta), var(--accent-turquoise))', padding: '16px 40px', fontSize: '1rem' }}>
                      ✨ Criar Minha Estampa
                    </button>
                  </div>
                )}

                {/* Loading */}
                {patternLoading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid var(--border)', borderTop: '4px solid var(--accent-magenta)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Desenhando com carinho...</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                      A <strong>The Brand Box</strong> está criando<br/>padrões únicos com as cores da sua paleta 🎨
                    </p>
                  </div>
                )}

                {/* Resultado: 2 cartões mockup */}
                {generatedPatterns.length > 0 && !patternLoading && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      Toque no cartão que mais combina com a sua marca
                    </p>
                    <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                      {generatedPatterns.slice(0, 2).map((p, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedPattern(i)}
                          style={{
                            width: '45%', aspectRatio: '0.6', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                            position: 'relative',
                            border: selectedPattern === i ? '3px solid var(--accent-magenta)' : '2px solid var(--border)',
                            boxShadow: selectedPattern === i ? '0 8px 25px rgba(210,47,90,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                            transform: selectedPattern === i ? 'scale(1.03)' : 'scale(1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <img 
                            src={`data:${p.mimeType};base64,${p.base64}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          <div style={{
                            position: 'absolute', bottom: '15%', left: '10%', right: '10%',
                            background: 'rgba(255,255,255,0.92)', borderRadius: '6px',
                            padding: '12px 10px', textAlign: 'center',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {(() => {
                              const isScript = editData.fontStyle === 'script';
                              const raw = formData.marca || 'SUA MARCA';
                              const name = isScript 
                                ? raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                                : raw.toUpperCase();
                              return (
                                <p style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: editData.fontLetterSpacing || '1px', color: editData.corAtiva || '#333', lineHeight: 1.2, fontFamily: editData.fontFamily ? `'${editData.fontFamily}', serif` : 'inherit' }}>
                                  {name}
                                </p>
                              );
                            })()}
                            <p style={{ fontSize: '0.45rem', color: '#888', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                              {editData.tagline || ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={generatePatterns} style={{ fontSize: '0.75rem', color: 'var(--accent-magenta)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>
                      🔄 Gerar novas opções
                    </button>
                  </>
                )}
              </div>

              <div style={{ padding: '1.2rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(11.5)} className="btn-secondary" style={{ padding: '14px 20px', flex: 0.3 }}>Voltar</button>
                <button 
                  onClick={() => setStep(12)} 
                  className="btn-primary" 
                  style={{ flex: 1, background: selectedPattern !== null ? 'var(--accent-magenta)' : '#ccc', pointerEvents: selectedPattern !== null ? 'auto' : 'none' }}
                >
                  Ver Minha Placa da Marca ✨
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 12: PLACA DA MARCA (SOMENTE A PLACA - sem editor) */}
          {step === 12 && (
            <motion.div 
              key="step12" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fafafa', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '1.2rem', textAlign: 'center', borderBottom: '1px solid var(--border)', background: '#fff', zIndex: 10 }}>
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '4px' }}>Identidade Visual</p>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Sua Placa da Marca</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px' }}>
                <div ref={brandBoardRef} style={{ transform: 'scale(0.82)', transformOrigin: 'top center' }}>
                  {(() => { console.log('🎨 paletas state:', paletas.map(p => ({ id: p.id, nome: p.nome_variacao, hex: p.paleta_hex }))); return null; })()}
                  <BrandBoard 
                    data={editData} 
                    palette={(() => {
                      // Prioridade: paleta selecionada > primeira paleta com hex > fallback
                      const sel = paletas.find(p => p.id === selectedPaleta);
                      if (sel?.paleta_hex?.length > 0) return sel.paleta_hex;
                      // Busca a primeira paleta que tenha paleta_hex preenchido
                      const comHex = paletas.find(p => p.paleta_hex && p.paleta_hex.length > 0);
                      if (comHex) return comHex.paleta_hex;
                      // Fallback: se nenhuma paleta tem hex, tenta montar do campo cores_hex
                      const comCores = paletas.find(p => p.cores_hex && p.cores_hex.length > 0);
                      if (comCores) return comCores.cores_hex;
                      return ['#eee','#ddd','#ccc','#bbb','#aaa'];
                    })()} 
                    color={editData.corAtiva || '#d22f5a'}
                    patternImage={selectedPattern !== null && generatedPatterns[selectedPattern] ? `data:${generatedPatterns[selectedPattern].mimeType};base64,${generatedPatterns[selectedPattern].base64}` : null}
                  />
                </div>
              </div>

              {/* Seletor de cor ao vivo */}
              <div style={{ padding: '10px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap' }}>Cor Principal:</p>
                {(() => {
                  const sel = paletas.find(p => p.id === selectedPaleta);
                  const cores = sel?.paleta_hex || sel?.cores_hex || [];
                  const todasCores = cores.length > 0 ? cores : (paletas.find(p => p.paleta_hex?.length > 0)?.paleta_hex || []);
                  return todasCores.map((hex, i) => (
                    <div
                      key={i}
                      onClick={() => setEditData(prev => ({ ...prev, corAtiva: hex }))}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: hex, cursor: 'pointer',
                        border: editData.corAtiva === hex ? '3px solid #333' : '2px solid #fff',
                        boxShadow: editData.corAtiva === hex ? '0 0 0 1px #333' : '0 2px 6px rgba(0,0,0,0.15)',
                        transition: 'all 0.15s ease',
                        transform: editData.corAtiva === hex ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                  ));
                })()}
              </div>

              <div style={{ padding: '1.2rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <button onClick={() => { setApprovalChecked(false); setStep(12.8); }} className="btn-primary" style={{ width: '100%', background: 'var(--accent-magenta)' }}>Continuar para o Checkout ✨</button>
              </div>
            </motion.div>
          )}

          {/* TELA DE APROVAÇÃO PRÉ-PAGAMENTO (Etapa 12.8) */}
          {step === 12.8 && (
            <motion.div
              key="step12_8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#faf9f7', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '2rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '1.2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '3px', fontWeight: 600, marginBottom: '0.5rem' }}>antes de continuar</p>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>Confirme sua identidade visual</h2>
                </div>

                {/* Resumo do que foi criado */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.75rem' }}>Sua marca</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{formData.marca || 'Sua Marca'}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estilo: <strong>{resultadoFinal?.estiloNome || '—'}</strong></p>
                  {editData.tagline ? <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Slogan: <strong>{editData.tagline}</strong></p> : null}
                  {editData.corAtiva ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: editData.corAtiva, border: '1px solid #ddd' }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Cor principal: <strong>{editData.corAtiva}</strong></span>
                    </div>
                  ) : null}
                </div>

                {/* Aviso importante */}
                <div style={{ background: '#fff8f0', borderRadius: '14px', padding: '1rem 1.2rem', border: '1px solid #f5d9b8' }}>
                  <p style={{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6 }}>
                    ⚠️ <strong>Atenção:</strong> o modelo visual acima foi gerado com base nas suas respostas. Ao prosseguir, você confirma que aprova esta base como ponto de partida para a sua marca.
                  </p>
                </div>

                {/* Checkbox de aprovação */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', background: '#fff', borderRadius: '14px', padding: '1rem 1.2rem', border: `2px solid ${approvalChecked ? 'var(--accent-turquoise)' : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={approvalChecked}
                    onChange={e => setApprovalChecked(e.target.checked)}
                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-turquoise)', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    Aprovo o modelo gerado e entendo que os próximos passos dependem do plano escolhido.
                  </span>
                </label>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => setStep(13)}
                    disabled={!approvalChecked}
                    className="btn-primary"
                    style={{ width: '100%', background: approvalChecked ? 'var(--accent-magenta)' : '#ccc', pointerEvents: approvalChecked ? 'auto' : 'none', transition: 'background 0.2s' }}
                  >
                    Escolher meu plano ✨
                  </button>
                  <button onClick={() => setStep(12)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'center' }}>
                    ← Voltar e ajustar
                  </button>
                </div>
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

                  {/* PLANO 1 — Experience */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Experience</h3>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.3rem', whiteSpace: 'nowrap' }}>R$ 497</span>
                    </div>
                    <span style={{ display: 'inline-block', background: '#e8f7f5', color: '#1a7a6e', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', letterSpacing: '0.5px', marginBottom: '10px' }}>Apenas logo tipográfica</span>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Logo tipográfica + variações', 'Paleta de cores + tipografia', 'Guia simples de uso da marca', 'Cartão de visita interativo'].map(i => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--accent-turquoise)', fontWeight: 700 }}>✔</span>{i}</li>)}
                    </ul>
                    <div style={{ background: '#f7f9ff', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.8rem', color: '#3a5a8a', lineHeight: 1.5 }}>
                      Após o pagamento, você recebe os arquivos da sua marca imediatamente por e-mail.
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>Começar minha marca</button>
                  </motion.div>

                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', padding: '0 1rem', lineHeight: 1.6 }}>Você pode seguir sozinha —<br/>ou ter alguém criando com você.</p>

                  {/* PLANO 2 — Complete (DESTAQUE) */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#f5d6e8', borderRadius: '16px', padding: '20px', color: '#3a1a2e', boxShadow: '0 8px 30px rgba(220,52,149,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(220,52,149,0.15)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--accent-magenta)' }}>MAIS ESCOLHIDO</div>
                    <div style={{ marginBottom: '8px', paddingRight: '90px' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--accent-magenta)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                      <h3 style={{ color: '#3a1a2e', fontSize: '1.2rem', fontWeight: 700 }}>Complete</h3>
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(220,52,149,0.12)', color: 'var(--accent-magenta)', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', letterSpacing: '0.5px', marginBottom: '10px' }}>Logo tipográfica ou com ilustração</span>
                    <span style={{ fontWeight: 700, fontSize: '1.4rem', display: 'block', marginBottom: '10px', color: '#3a1a2e' }}>R$ 897</span>
                    <ul style={{ fontSize: '0.85rem', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Tudo do Brand Box Experience', 'Papelaria personalizada para sua marca', 'Templates editáveis para Instagram', 'Elementos visuais (mockups, ícones, avatares)', '✨ Manifesto da sua marca', '✨ Tom de voz e comunicação da marca'].map(i => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a1f3a' }}>
                          {!i.startsWith('✨') && <span style={{ color: 'var(--accent-magenta)', fontWeight: 700 }}>✔</span>}
                          {i}
                        </li>
                      ))}
                    </ul>
                    <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.8rem', color: '#5a2a4a', lineHeight: 1.5 }}>
                      Após o pagamento, entraremos em contato em até <strong>2 dias úteis</strong> pelo e-mail cadastrado para iniciar a criação da sua marca.
                    </div>
                    <button className="btn-primary" style={{ width: '100%', padding: '12px', background: 'var(--accent-magenta)', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Quero minha marca completa</button>
                  </motion.div>

                  {/* PLANO 3 — Signature */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#1a1a1a', borderRadius: '16px', padding: '20px', border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Signature</h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>Para quem quer uma marca exclusiva,<br/>criada junto com uma designer.</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', opacity: 0.8 }}>A partir de<br/>R$ 2.900</span>
                    </div>
                    <ul style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {['Direção criativa personalizada', 'Ajustes e refinamentos exclusivos', 'Aplicações pensadas para o seu negócio', 'Acompanhamento próximo durante o processo'].map(i => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>✔</span>{i}</li>)}
                    </ul>
                    <a
                      href={`https://wa.me/4793630746?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Brand%20Box%20Signature%20para%20a%20marca%20${encodeURIComponent(formData.marca || '')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px', textAlign: 'center', textDecoration: 'none' }}
                    >
                      Falar no WhatsApp
                    </a>
                  </motion.div>

                  {/* Micro copy final */}
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '0.5rem 1rem 0.5rem', lineHeight: 1.6 }}>Não precisa saber por onde começar.<br/>Eu te guio em cada etapa.</p>

                  <button
                    onClick={() => {
                      localStorage.removeItem('brandbox_progress');
                      setStep(1);
                      setFormData({ nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', publico: '', sentimentos: [], elementosVisuais: [] });
                      setResultadoFinal(null);
                      setSelectedTagline('');
                      setCustomTagline('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', paddingBottom: '1.5rem' }}
                  >
                    Recomeçar do zero
                  </button>

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
