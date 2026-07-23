'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Libraries dynamically imported for performance
import BrandTemplateSVG from '../../components/BrandTemplateSVG';
import BrandBoard from '../../components/BrandBoard';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../LanguageContext';
import { createClient } from '@supabase/supabase-js';
import FONT_MAP from '../../lib/fontMap';
import { STYLE_ICONS, getIconById, ESTILO_NOME_BY_ID } from '../../lib/styleIcons';
import Image from 'next/image';

const PAPELARIA_CLINICA = [
  "Cartão de Visita", "Papel Timbrado", "Receituário Padrão (A4 e A5)", "Atestado Médico (A4 e A5)", "Cartão de Retorno", "Pasta A4 Exclusiva",
  "Envelope Ofício (23x11,5cm)", "Envelope Saco (24x34cm)", "Recibo", "Receituário de Controle Especial", 
  "Dicas de Introdução Alimentar", "Guia de Vacina c/ Calendário", "Guia de Desenvolvimento", "Orientação Pré-Natal",
  "Cartão de Exame Pré-Natal", "Checklist Maternidade", "Guia do Sono", "Orientações p/ Recém Nascidos",
  "Prontuário Médico", "Receita de Alta", "Ficha de Cadastro",
  "Certificado de Coragem", "Quadro de Incentivo",
  "Arte para Caneca/Brindes", "Gráfico de Crescimento", "Diário do Xixi", "Card de Orientação de Sono",
  "Meu Pratinho", "Guia de Amamentação", "T-Shirt", "Cartão de Agradecimento (10x15cm)", "Tag para Sacola"
];

const PAPELARIA_INSTITUCIONAL = [
  "Cartão de Visita", "Pasta A4 Exclusiva", "Envelope Ofício (23x11,5cm)", "Envelope Saco (24x34cm)", "Papel Timbrado", 
  "Cartão de Agradecimento (10x15cm)", "Etiqueta para Correios", "Recibo Comercial",
  "Cartão de Retorno/Fidelidade", "Tag para Sacola", "Arte para Caneca/Brindes", "Ficha de Cadastro", "T-Shirt"
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.replace(/['"]/g, '') : undefined);
const supabase = createClient(supabaseUrl, supabaseKey);


const LightbulbIcon = ({ size = 20, color = 'var(--text-primary)' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M9.5 14h5" />
    <path d="M12 2v1" />
    <path d="M20 8h-1" />
    <path d="M5 8H4" />
    <path d="M17.65 3.35l-1.41 1.41" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.65 12.65l-1.41-1.41" />
    <path d="M4.93 11.07l1.41-1.41" />
  </svg>
);

export default function Home() {
  const { dictionary, lang } = useTranslation();

  const patternPhrases = dictionary?.postmatch?.pattern_phrases || [
    "A <strong>The Brand Box</strong> está criando<br/>padrões únicos com as cores da sua paleta 🎨",
    "Desenhando as formas que combinam<br/>com o seu estilo ✨",
    "Buscando as melhores proporções<br/>para a sua estampa 🌟",
    "Ajustando os contrastes para<br/>um resultado perfeito 🖌️",
    "Preparando a versão final<br/>em alta resolução 🎀"
  ];
  const [devMode, setDevMode] = useState(false);
  const [devTapCount, setDevTapCount] = useState(0);
  useEffect(() => {
    setDevMode(new URLSearchParams(window.location.search).get('dev') === '1');
    const existingSessionId = localStorage.getItem('brandbox_ai_session_id');
    if (existingSessionId) {
      setAiSessionId(existingSessionId);
      return;
    }
    const newSessionId = window.crypto?.randomUUID?.() || `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('brandbox_ai_session_id', newSessionId);
    setAiSessionId(newSessionId);
  }, []);
  const handleDevTap = () => {
    const next = devTapCount + 1;
    setDevTapCount(next);
    if (next >= 5) {
      setDevMode(d => !d);
      setDevTapCount(0);
    }
  };

  const [step, setStep] = useState(1);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [isCreativeDirectorLoading, setIsCreativeDirectorLoading] = useState(false);
  const [isTaglineLoading, setIsTaglineLoading] = useState(false);
  const [aiSessionId, setAiSessionId] = useState('');
  const [selectedTagline, setSelectedTagline] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', contextoExtra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', inspiracoesTags: [], nuncaPensar: '', nuncaPensarTags: []
  });

  const refineCopy = {
    button: dictionary?.postmatch?.creative_refine_button || 'Refinar esta direção',
    tension: dictionary?.postmatch?.creative_refine_tension || 'Tensão identificada',
    question: dictionary?.postmatch?.creative_refine_question || 'Pergunta da diretora criativa',
    placeholder: dictionary?.postmatch?.creative_refine_placeholder || 'Escreva sua resposta aqui...',
    analyze: dictionary?.postmatch?.creative_refine_analyze || 'Analisar minha resposta',
    keepCurrent: dictionary?.postmatch?.creative_refine_keep_current || 'Manter direção atual',
    loadingQuestion: dictionary?.postmatch?.creative_refine_loading_question || 'Conversando com a AI Creative Director...',
    loadingResolution: dictionary?.postmatch?.creative_refine_loading_resolution || 'Analisando sua resposta...',
    decision: dictionary?.postmatch?.creative_refine_decision || 'Decisão',
    direction: dictionary?.postmatch?.creative_refine_direction || 'Direção refinada',
    palette: dictionary?.postmatch?.creative_refine_palette || 'Impacto na paleta',
    typography: dictionary?.postmatch?.creative_refine_typography || 'Impacto na tipografia',
    composition: dictionary?.postmatch?.creative_refine_composition || 'Impacto na composição',
    pattern: dictionary?.postmatch?.creative_refine_pattern || 'Impacto na estampa',
    altStyle: dictionary?.postmatch?.creative_refine_alt_style || 'Estilo alternativo recomendado',
    altNote: dictionary?.postmatch?.creative_refine_alt_note || 'Esta recomendação é apenas consultiva e não será aplicada automaticamente.',
    unavailable: dictionary?.postmatch?.creative_refine_unavailable || 'Não foi possível analisar agora. Sua direção atual continua salva.',
    close: dictionary?.postmatch?.creative_refine_close || 'Fechar',
    retry: dictionary?.postmatch?.creative_refine_retry || 'Tentar novamente',
    regenerate: dictionary?.postmatch?.creative_refine_regenerate || 'Gerar novamente em português',
    regenerating: dictionary?.postmatch?.creative_refine_regenerating || 'Gerando novamente em português...'
  };

  const [source, setSource] = useState('Direct');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const lastStepRef = useRef('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get('utm_source') || params.get('source') || 'Direct');
    if (params.get('demo') === 'BUILDWEEK100' || localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
      localStorage.setItem('brandbox_demo_mode', 'BUILDWEEK100');
      setIsDemoMode(true);
      // E-mail de demo removido: não deve vazar para sessões reais do Stripe
    }
  }, []);


  useEffect(() => {
    const emailTrimmed = formData.email ? formData.email.trim() : '';
    if (!emailTrimmed || step <= 2) return;

    let stepName = 'Started';
    if (step >= 2 && step < 8) stepName = 'Brand Questions';
    if (step >= 8 && step < 11.5) stepName = 'Creative Direction';
    if (step >= 11.5 && step < 12.8) stepName = 'Moodboard';
    if (step >= 12.8 && step < 13) stepName = 'Logo';
    if (step >= 13) stepName = 'Checkout';

    if (lastStepRef.current !== stepName) {
      lastStepRef.current = stepName;
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: formData.nome, 
          email: emailTrimmed, 
          source: source,
          last_step: stepName,
          project_completed: step >= 13
        })
      }).catch(err => console.error('Erro ao atualizar lead:', err));
    }
  }, [step, source, formData.nome]);

  // Sugestões de tagline agrupadas por categoria
  const TAGLINES_BY_ESTILO = {
    'Jardim Encantado':       ['Onde a imaginação encontra o cuidado', 'Criatividade que floresce todos os dias', 'O olhar lúdico e afetuoso da infância'],
    'Escandinavo Acolhedor':  ['Onde o cuidado encontra o aconchego', 'A beleza da simplicidade no acolhimento', 'Cuidado gentil que transforma e acolhe'],
    'Essência Atemporal':     ['A sutil arte de revelar sua melhor versão', 'Onde a simplicidade encontra o extraordinário', 'Sutileza, elegância e essência'],
    'Doce Encantamento':      ['Feito para encantar e acolher a alma', 'Criações exclusivas que carregam afeto', 'Delicadeza, arte e essência'],
    'Raízes & Cuidado':       ['Orgânico, consciente e acolhedor', 'Essência da terra, respeito ao tempo', 'Onde o tempo vira afeto'],
    'Estético Editorial':     ['Presença, precisão e estratégia', 'Estrutura, precisão e presença', 'Presença atemporal e estratégica', 'A estética da excelência e da autoridade', 'Técnica, elegância e exclusividade'],
  };

  const FONT_PRESETS_BY_FAMILY = {
    'Playfair Display': { fontFamily: 'Playfair Display', weight: 600, style: 'serif', sizeBoost: 1 },
    'Borel': { fontFamily: 'Borel', weight: 400, style: 'script', sizeBoost: 1.15, lineHeight: 1.25, marginTop: '2px' },
    'Abril Fatface': { fontFamily: 'Abril Fatface', weight: 400, style: 'display', sizeBoost: 0.95, letterSpacing: '1px' },
    'DM Sans': { fontFamily: 'DM Sans', weight: 500, style: 'sans', sizeBoost: 1 },
    'Julius Sans One': { fontFamily: 'Julius Sans One', weight: 400, style: 'sans', sizeBoost: 0.95, letterSpacing: '2px' },
    'Sacramento': { fontFamily: 'Sacramento', weight: 400, style: 'script', sizeBoost: 1.5, lineHeight: 0.9 },
    'Allura': { fontFamily: 'Allura', weight: 400, style: 'script', sizeBoost: 1.5, lineHeight: 0.9 },
    'Libre Baskerville': { fontFamily: 'Libre Baskerville', weight: 700, style: 'serif', sizeBoost: 0.9 },
    'Quicksand': { fontFamily: 'Quicksand', weight: 600, style: 'sans', sizeBoost: 1 },
    'Nunito': { fontFamily: 'Nunito', weight: 700, style: 'sans', sizeBoost: 1 }
  };

  const getFontPresetByFamily = (fontFamily) => (
    Object.values(FONT_MAP).find(font => font.fontFamily === fontFamily)
    || FONT_PRESETS_BY_FAMILY[fontFamily]
    || null
  );

  const getSecondaryFontForPrimary = (fontInfo = {}) => {
    const primaryStyle = fontInfo.style || 'serif';
    const primaryFamily = fontInfo.fontFamily || '';

    if (primaryStyle === 'script') {
      return { secondaryFontFamily: 'DM Sans', secondaryFontWeight: 500, secondaryFontStyle: 'sans' };
    }
    if (primaryStyle === 'serif') {
      return { secondaryFontFamily: primaryFamily === 'Cormorant Garamond' ? 'Manrope' : 'Plus Jakarta Sans', secondaryFontWeight: 500, secondaryFontStyle: 'sans' };
    }
    if (primaryStyle === 'display') {
      return { secondaryFontFamily: 'Inter', secondaryFontWeight: 500, secondaryFontStyle: 'sans' };
    }
    return { secondaryFontFamily: primaryFamily === 'Raleway' ? 'Inter' : 'Raleway', secondaryFontWeight: 500, secondaryFontStyle: 'sans' };
  };

  const buildFontEditProps = (fontInfo = {}) => ({
    fontFamily: fontInfo.fontFamily,
    fontWeight: fontInfo.weight || 400,
    fontStyle: fontInfo.style || 'serif',
    fontSizeBoost: fontInfo.sizeBoost || 1,
    fontLetterSpacing: fontInfo.letterSpacing || '0px',
    fontLineHeight: fontInfo.lineHeight,
    fontFeatureSettings: fontInfo.featureSettings,
    ...getSecondaryFontForPrimary(fontInfo)
  });

  const getTaglineSuggestions = () => {
    const idToKey = {
      2: 'Jardim Encantado',
      3: 'Escandinavo Acolhedor',
      5: 'Essência Atemporal',
      6: 'Raízes & Cuidado',
      8: 'Doce Encantamento',
      11: 'Estético Editorial'
    };
    const key = idToKey[resultadoFinal?.estiloId] || 'Essência Atemporal';
    return dictionary?.postmatch?.taglines_by_estilo?.[key] || TAGLINES_BY_ESTILO[key] || TAGLINES_BY_ESTILO['Essência Atemporal'];
  };

  const getCreativeTaglineSuggestions = () => {
    const suggestions = (resultadoFinal?.creativeDirector?.taglineSuggestions || resultadoFinal?.taglineSuggestions)?.suggestions;
    return Array.isArray(suggestions) && suggestions.length === 3
      ? suggestions.map(suggestion => suggestion.text).filter(Boolean)
      : [];
  };

  const getVisibleTaglineSuggestions = () => {
    const creativeSuggestions = getCreativeTaglineSuggestions();
    return creativeSuggestions.length === 3 ? creativeSuggestions : getTaglineSuggestions();
  };

  const elementosDesc = [
    "Toque Lúdico / Elementos Mágicos", // Substituto mais versátil para fadas/princesas
    "Mascotes / Ícones Divertidos", // Substituto para bichinhos
    "Minimalismo / Linhas Retas",
    "Aquarela Clássica",
    "Formas Orgânicas / Tons Terrosos",
    "Tipografia Pura / Editorial"
  ];
  
  const toggleElemento = (val) => {
    setFormData(prev => ({
      ...prev,
      elementosVisuais: prev.elementosVisuais.includes(val) ? [] : [val]
    }));
  };

  const [paletas, setPaletas] = useState([]);
  const [tipografias, setTipografias] = useState([]);
  const [moodboards, setMoodboards] = useState([]);
  const [estampas, setEstampas] = useState([]);
  const [generatedPatterns, setGeneratedPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [patternLoading, setPatternLoading] = useState(false);
  const [patternPhraseIndex, setPatternPhraseIndex] = useState(0);
  const [loadingVariacoes, setLoadingVariacoes] = useState(false);
  
  const [selectedPaleta, setSelectedPaleta] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [customStep, setCustomStep] = useState('paleta');
  const [editData, setEditData] = useState({
    marca: '',
    tagline: 'Design de Interiores',
    whatsapp: '',
    instagram: '',
    corAtiva: '',
    secondaryFontFamily: 'Montserrat',
    secondaryFontWeight: 500,
    secondaryFontStyle: 'sans',
    itemSelecionado: 'cartao',
    viewType: 'itens'
  });
  
  const atuacoesSaude = ['Pediatria / Saúde infantil', 'Obstetrícia / Saúde da mulher', 'Clínica / Saúde geral adulta'];
  const isSaude = atuacoesSaude.includes(formData.atuacao);

  const [showPediatriaModal, setShowPediatriaModal] = useState(false);
  const [papelariaSelecionada, setPapelariaSelecionada] = useState([]);
  const [patternGenerationCount, setPatternGenerationCount] = useState(0);
  const [showRefazerModal, setShowRefazerModal] = useState(false);
  const [refazerAttempts, setRefazerAttempts] = useState(0);
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [marcaSugestaoAceita, setMarcaSugestaoAceita] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinementQuestion, setRefinementQuestion] = useState(null);
  const [refinementAnswer, setRefinementAnswer] = useState('');
  const [isRefinementLoading, setIsRefinementLoading] = useState(false);
  const [refinementStep, setRefinementStep] = useState('idle');
  const [paletteFeedback, setPaletteFeedback] = useState(null);
  const [isPaletteFeedbackLoading, setIsPaletteFeedbackLoading] = useState(false);


  const brandBoardRef = useRef(null);
  const selectedVisualBrandRef = useRef({ optionId: '', fontFamily: '' });
  const paletteFeedbackRequestRef = useRef('');

  const [isHydrated, setIsHydrated] = useState(false);

  // Restaura progresso salvo ao montar
  useEffect(() => {
    console.log('🔍 Verificando progresso salvo...');
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const isCanceled = params.get('canceled') === '1';

      const saved = localStorage.getItem('brandbox_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✨ Progresso encontrado:', parsed.formData?.marca || 'Sem nome');
        if (parsed.step && parsed.step > 1) {
          setSavedProgress(parsed);
          // Se o usuário está retornando do Stripe após cancelar o pagamento, restaura diretamente
          if (isCanceled) {
            restoreProgress(parsed);
            if (parsed.step >= 12) setStep(13);
          } else {
            setShowResumePrompt(true);
          }
        }
      } else {
        console.log('ℹ️ Nenhum progresso anterior encontrado no localStorage.');
      }
    } catch(e) { 
      console.error('❌ Erro ao ler progresso:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!patternLoading) {
      setPatternPhraseIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setPatternPhraseIndex(prev => (prev + 1) % patternPhrases.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [patternLoading]);

  const restoreProgress = async (parsed) => {
    if (parsed.step) setStep(parsed.step);
    if (parsed.formData) {
      setFormData(parsed.formData);
      selectedVisualBrandRef.current = {
        optionId: parsed.formData.inspiracoesVisual || '',
        fontFamily: parsed.formData.selectedBrandFont || ''
      };
    }
    if (parsed.selectedTagline) setSelectedTagline(parsed.selectedTagline);
    if (parsed.customTagline) setCustomTagline(parsed.customTagline);
    if (parsed.editData) setEditData(prev => ({ ...prev, ...parsed.editData }));
    if (parsed.patternGenerationCount) setPatternGenerationCount(parsed.patternGenerationCount);
    if (parsed.refazerAttempts) setRefazerAttempts(parsed.refazerAttempts);
    if (parsed.resultadoFinal) setResultadoFinal(parsed.resultadoFinal);
    if (parsed.generatedPatterns) setGeneratedPatterns(parsed.generatedPatterns);
    if (parsed.selectedPattern !== undefined) setSelectedPattern(parsed.selectedPattern);
    if (parsed.papelariaSelecionada) setPapelariaSelecionada(parsed.papelariaSelecionada);

    if (parsed.sessionId) {
      try { localStorage.setItem('brandbox_session', parsed.sessionId); } catch {}
    }

    // Re-busca paletas/tipografias do Supabase se estava em etapa avançada
    if (parsed.resultadoFinal?.estiloId && parsed.step >= 10) {
      setLoadingVariacoes(true);
      try {
        const id = parsed.resultadoFinal.estiloId;
        const res = await fetch(`/api/variacoes?id=${id}&t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        
        if (data.variacoes) {
          setPaletas(data.variacoes.filter(d => d.tipo === 'PALETA'));
          setTipografias(data.variacoes.filter(d => d.tipo === 'TIPOGRAFIA'));
          setEstampas(data.variacoes.filter(d => d.tipo === 'ESTAMPA'));
        }
        setMoodboards(data.moodboard || []);
      } catch (e) {
        console.error("Erro ao restaurar variações via API:", e);
      } finally {
        if (parsed.selectedPaleta) setSelectedPaleta(parsed.selectedPaleta);
        if (parsed.selectedTipo) setSelectedTipo(parsed.selectedTipo);
        setLoadingVariacoes(false);
      }
    }
    if (parsed.selectedIcon) setSelectedIcon(parsed.selectedIcon);
  };

  // Salva progresso automaticamente APÓS a hidratação inicial ser concluída
  useEffect(() => {
    if (!isHydrated) return;

    const activeSessionId = typeof window !== 'undefined' ? localStorage.getItem('brandbox_session') : null;

    const dataToSave = {
      step, formData, selectedTagline, customTagline,
      editData: {
        marca: editData.marca, tagline: editData.tagline, whatsapp: editData.whatsapp, instagram: editData.instagram,
        fontFamily: editData.fontFamily, fontStyle: editData.fontStyle, fontWeight: editData.fontWeight,
        fontSizeBoost: editData.fontSizeBoost, fontLetterSpacing: editData.fontLetterSpacing, fontLineHeight: editData.fontLineHeight,
        fontFeatureSettings: editData.fontFeatureSettings, secondaryFontFamily: editData.secondaryFontFamily,
        secondaryFontWeight: editData.secondaryFontWeight, secondaryFontStyle: editData.secondaryFontStyle, corAtiva: editData.corAtiva
      },
      patternGenerationCount, refazerAttempts,
      resultadoFinal, selectedPaleta, selectedTipo, selectedIcon,
      generatedPatterns, selectedPattern, papelariaSelecionada,
      sessionId: activeSessionId || undefined
    };
    try {
      localStorage.setItem('brandbox_progress', JSON.stringify(dataToSave));
    } catch(e) {
      console.warn("localStorage quota exceeded, saving minified patterns...");
      try {
        // Fallback 1: Keep only the selected pattern's base64 to save space
        const minimizedPatterns = generatedPatterns.map((p, i) => i === selectedPattern ? p : { ...p, base64: null });
        localStorage.setItem('brandbox_progress', JSON.stringify({ ...dataToSave, generatedPatterns: minimizedPatterns }));
      } catch (e2) {
        // Fallback 2: Strip all base64 if it still fails
        try {
           const strippedPatterns = generatedPatterns.map(p => ({ ...p, base64: null }));
           localStorage.setItem('brandbox_progress', JSON.stringify({ ...dataToSave, generatedPatterns: strippedPatterns }));
        } catch (e3) {
           console.error("Fatal error saving progress", e3);
        }
      }
    }
  }, [isHydrated, step, formData, selectedTagline, customTagline, editData, generatedPatterns, selectedPattern, resultadoFinal, papelariaSelecionada]);

  useEffect(() => {
    if (step !== 11.5 || !resultadoFinal || resultadoFinal?.creativeDirector?.taglineSuggestions || resultadoFinal?.taglineSuggestions) return;
    generateCreativeTaglines();
    // Depend only on step so changing the interface language does not auto-regenerate AI content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const downloadBrandBoard = async () => {
    if (brandBoardRef.current) {
      try {
        const html2canvas = (await import('html2canvas')).default;
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
      const { jsPDF } = await import('jspdf');
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
    setLoadingVariacoes(true);
    
    try {
      console.log('--- DIAGNÓSTICO BRAND BOX ---');
      console.log('Solicitando variações para estilo:', id);
      
      setCustomStep('paleta'); // Pula o passo 'tipo' (fonte é setada no callMatchmaker)
      
      const res = await fetch(`/api/variacoes?id=${id}&t=${Date.now()}`);
      if (!res.ok) {
        let errMsg = `Erro HTTP: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg += ` (${errData.error})`;
          }
        } catch (e) {}
        throw new Error(errMsg);
      }
      
      const data = await res.json();
      console.log('Dados recebidos da API:', data);
      
      if (data.variacoes && data.variacoes.length > 0) {
         setPaletas(data.variacoes.filter(d => d.tipo === 'PALETA'));
         setTipografias(data.variacoes.filter(d => d.tipo === 'TIPOGRAFIA'));
         setEstampas(data.variacoes.filter(d => d.tipo === 'ESTAMPA'));
         console.log(`Sucesso: ${data.variacoes.length} variações carregadas.`);
      } else {
         console.error('API retornou lista de variações vazia.');
      }
      
      setMoodboards(data.moodboard || []);
    } catch (err) {
      console.error('ERRO FATAL NO DIAGNÓSTICO:', err.message);
      setAlertMessage(`Erro ao carregar estilos: ${err.message}. Verifique a conexão com o banco.`);
    } finally {
      setLoadingVariacoes(false);
      setSelectedTipo(null);
      setSelectedPaleta(null);
      
      if (resultadoFinal) {
        setStep(10);

        // Transfere a lógica de tipografia escolhida nos cards visuais
        const selectedVisualId = selectedVisualBrandRef.current.optionId || formData.inspiracoesVisual;
        const selectedFontFamily = getVisualBrandFont(selectedVisualId, resultadoFinal.estiloId)
          || getFontFromSimilarOptions(formData.selectedBrandFontOptions, resultadoFinal.estiloId)
          || selectedVisualBrandRef.current.fontFamily
          || formData.selectedBrandFont;
        const found = getFontPresetByFamily(selectedFontFamily);
        const fontProps = found ? buildFontEditProps(found) : {};

        setEditData(prev => ({ 
          ...prev, 
          marca: formData.marca, 
          tagline: editData.tagline || 'Identidade Visual',
          instagram: formData.marca.toLowerCase().replace(/\s/g, ''),
          whatsapp: prev.whatsapp || '(11) 99999-9999',
          fontFamily: fontProps.fontFamily || selectedFontFamily || prev.fontFamily,
          fontWeight: fontProps.fontWeight || prev.fontWeight,
          fontStyle: fontProps.fontStyle || prev.fontStyle,
          fontSizeBoost: fontProps.fontSizeBoost || prev.fontSizeBoost,
          fontLetterSpacing: fontProps.fontLetterSpacing || prev.fontLetterSpacing,
          fontLineHeight: fontProps.fontLineHeight || prev.fontLineHeight,
          fontFeatureSettings: fontProps.fontFeatureSettings || prev.fontFeatureSettings,
          secondaryFontFamily: fontProps.secondaryFontFamily || prev.secondaryFontFamily || 'Montserrat',
          secondaryFontWeight: fontProps.secondaryFontWeight || prev.secondaryFontWeight || 500,
          secondaryFontStyle: fontProps.secondaryFontStyle || prev.secondaryFontStyle || 'sans'
        }));
      }
    }
  };

  const MAX_PATTERN_GENERATIONS = 3;

  const generatePatterns = async () => {
    if (devMode) {
      setGeneratedPatterns([
        { base64: null, mimeType: null, _devPlaceholder: true },
        { base64: null, mimeType: null, _devPlaceholder: true },
        { base64: null, mimeType: null, _devPlaceholder: true },
      ]);
      return;
    }
    if (patternGenerationCount >= MAX_PATTERN_GENERATIONS) {
      setAlertMessage('Você atingiu o limite de 3 gerações de estampa. Tente novamente amanhã!');
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
          estiloNome: ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome || 'Elegante',
          marca: formData.marca || 'Marca',
          descricao: resultadoFinal?.mensagem || '',
          referenceUrls: refs
        })
      });
      
      const data = await res.json();
      if (data.success && data.images) {
        setGeneratedPatterns(data.images);
        setSelectedPattern(0);
      } else {
        console.error('Erro na geração:', data.error);
        setAlertMessage('Ops! Não conseguimos gerar as estampas. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro chamando API:', err);
      setAlertMessage('Erro de conexão. Verifique se o servidor está rodando.');
    }
    setPatternLoading(false);
  };

  const nextStep = () => setStep((s) => s + 1);

  const handleStep2Submit = () => {
    const emailTrimmed = formData.email ? formData.email.trim() : '';
    if (emailTrimmed) {
      lastStepRef.current = 'Brand Questions';
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: formData.nome, 
          email: emailTrimmed, 
          source: source,
          last_step: 'Brand Questions',
          project_completed: false
        })
      }).catch(err => console.error('Erro ao salvar lead:', err));
    } else if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'demo_access_anonymous', { source });
      } catch (e) {}
    }
    nextStep();
  };
  
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
           ...buildFontEditProps(fontInfo)
         }));
       }
     }
     setTimeout(() => setCustomStep('paleta'), 300);
  }

  const isDifferentLanguage = (content) => Boolean(content?.language && content.language !== lang);

  const getAiUsageKey = (contentType, targetLanguage = lang) => `${contentType}:${targetLanguage}`;

  const hasAiUsage = (contentType, targetLanguage = lang) => {
    const key = getAiUsageKey(contentType, targetLanguage);
    return Boolean(resultadoFinal?.aiUsage?.[key]);
  };

  const markAiUsage = (contentType, targetLanguage = lang) => {
    const key = getAiUsageKey(contentType, targetLanguage);
    const timestamp = new Date().toISOString();
    setResultadoFinal(prev => prev ? ({
      ...prev,
      aiUsage: {
        ...(prev.aiUsage || {}),
        [key]: timestamp
      }
    }) : prev);
  };

  const getRequestKey = (contentType, targetLanguage = lang) => `${aiSessionId || 'pending'}:${getAiUsageKey(contentType, targetLanguage)}`;

  const requestPaletteFeedback = async (primaryColor, palette) => {
    const requestId = `${selectedPaleta}:${primaryColor}:${Date.now()}`;
    paletteFeedbackRequestRef.current = requestId;
    setPaletteFeedback(null);
    setIsPaletteFeedbackLoading(true);

    try {
      const response = await fetch('/api/creative-director/palette-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          resultadoFinal,
          palette,
          primaryColor,
          idioma: lang,
          requestKey: `${aiSessionId || 'pending'}:palette_feedback:${selectedPaleta}:${primaryColor}`
        })
      });

      if (!response.ok || paletteFeedbackRequestRef.current !== requestId) return;
      setPaletteFeedback(await response.json());
    } catch (error) {
      console.warn('Feedback de paleta indisponível; mantendo o fluxo de escolha.', error);
    } finally {
      if (paletteFeedbackRequestRef.current === requestId) setIsPaletteFeedbackLoading(false);
    }
  };

  const handlePrimaryColorSelect = (hex, colors) => {
    setEditData(prev => ({ ...prev, corAtiva: hex }));
    requestPaletteFeedback(hex, colors);
  };

  const fetchCreativeDirectorDiagnostic = async (baseResult) => {
    const creativeResponse = await fetch('/api/creative-director', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData,
        estiloId: baseResult.estiloId,
        estiloNome: baseResult.estiloNome,
        mensagem: baseResult.mensagem,
        idioma: lang,
        requestKey: getRequestKey('diagnostic')
      })
    });

    if (!creativeResponse.ok) return null;

    const creativeDirector = await creativeResponse.json();
    return { ...creativeDirector, language: lang, generatedAt: new Date().toISOString() };
  };

  const regenerateCreativeDirector = async () => {
    if (!resultadoFinal || isCreativeDirectorLoading || hasAiUsage('diagnostic_regeneration')) return;

    markAiUsage('diagnostic_regeneration');
    setIsCreativeDirectorLoading(true);
    try {
      const creativeDirector = await fetchCreativeDirectorDiagnostic(resultadoFinal);
      if (creativeDirector) {
        setResultadoFinal(prev => prev ? ({ ...prev, creativeDirector: { ...creativeDirector, refinement: prev.creativeDirector?.refinement } }) : prev);
      }
    } catch (error) {
      console.warn('Regeneração do Diagnóstico Criativo indisponível; mantendo conteúdo anterior.', error);
    } finally {
      setIsCreativeDirectorLoading(false);
    }
  };

  const fetchCreativeTaglines = async () => {
    if (!resultadoFinal) return null;

    const response = await fetch('/api/creative-director/taglines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData,
        resultadoFinal,
        idioma: lang,
        requestKey: getRequestKey('taglines')
      })
    });

    if (!response.ok) return null;

    const taglines = await response.json();
    return { ...taglines, language: lang, generatedAt: new Date().toISOString() };
  };

  const generateCreativeTaglines = async () => {
    if (!resultadoFinal || isTaglineLoading || hasAiUsage('taglines')) return;

    markAiUsage('taglines');
    setIsTaglineLoading(true);
    try {
      const taglines = await fetchCreativeTaglines();
      if (taglines) {
        setResultadoFinal(prev => prev ? (prev.creativeDirector
          ? {
              ...prev,
              creativeDirector: {
                ...prev.creativeDirector,
                taglineSuggestions: taglines
              }
            }
          : {
              ...prev,
              taglineSuggestions: taglines
            }) : prev);
        if (selectedTagline && !taglines.suggestions.some(suggestion => suggestion.text === selectedTagline)) {
          setSelectedTagline('');
        }
      }
    } catch (error) {
      console.warn('Sugestões de tagline indisponíveis; usando sugestões curadas.', error);
    } finally {
      setIsTaglineLoading(false);
    }
  };

  const startCreativeRefinement = async () => {
    if (isRefinementLoading) return;

    setShowRefinement(true);
    const savedQuestion = resultadoFinal?.creativeDirector?.refinementQuestion;
    if (savedQuestion?.language === lang) {
      setRefinementQuestion(savedQuestion);
      setRefinementStep('answer');
      return;
    }

    if (hasAiUsage('refinement_question')) {
      setRefinementStep('unavailable');
      return;
    }

    setRefinementStep('question');
    setIsRefinementLoading(true);
    markAiUsage('refinement_question');

    try {
      const response = await fetch('/api/creative-director/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'question',
          formData,
          resultadoFinal,
          idioma: lang,
          requestKey: getRequestKey('refinement_question')
        })
      });

      if (response.ok) {
        const question = await response.json();
        const questionWithMeta = { ...question, language: lang, generatedAt: new Date().toISOString() };
        setRefinementQuestion(questionWithMeta);
        setResultadoFinal(prev => prev ? ({
          ...prev,
          creativeDirector: {
            ...prev.creativeDirector,
            refinementQuestion: questionWithMeta
          }
        }) : prev);
        setRefinementStep('answer');
      } else {
        setRefinementStep('unavailable');
      }
    } catch (error) {
      console.warn('Refinamento criativo indisponível; mantendo a direção atual.', error);
      setRefinementStep('unavailable');
    } finally {
      setIsRefinementLoading(false);
    }
  };

  const submitCreativeRefinement = async () => {
    const respostaUsuario = refinementAnswer.trim();
    if (!respostaUsuario || !refinementQuestion || isRefinementLoading || hasAiUsage('refinement_resolution')) return;

    setIsRefinementLoading(true);
    markAiUsage('refinement_resolution');

    try {
      const response = await fetch('/api/creative-director/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'resolution',
          formData,
          resultadoFinal,
          pergunta: refinementQuestion.pergunta,
          respostaUsuario,
          idioma: lang,
          requestKey: getRequestKey('refinement_resolution')
        })
      });

      if (response.ok) {
        const resolution = await response.json();
        const refinement = {
          ...resolution,
          pergunta: refinementQuestion.pergunta,
          respostaUsuario,
          language: lang,
          generatedAt: new Date().toISOString()
        };
        setResultadoFinal(prev => prev ? ({
          ...prev,
          creativeDirector: {
            ...prev.creativeDirector,
            refinement
          }
        }) : prev);
        setRefinementStep('result');
      } else {
        setRefinementStep('unavailable');
      }
    } catch (error) {
      console.warn('Análise do refinamento indisponível; mantendo a direção atual.', error);
      setRefinementStep('unavailable');
    } finally {
      setIsRefinementLoading(false);
    }
  };

  const regenerateRefinementResolution = async () => {
    const currentRefinement = resultadoFinal?.creativeDirector?.refinement;
    if (!currentRefinement?.respostaUsuario || !currentRefinement?.pergunta || isRefinementLoading || hasAiUsage('refinement_resolution_regeneration')) return;

    setIsRefinementLoading(true);
    setRefinementStep('result');
    markAiUsage('refinement_resolution_regeneration');

    try {
      const response = await fetch('/api/creative-director/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'resolution',
          formData,
          resultadoFinal,
          pergunta: currentRefinement.pergunta,
          respostaUsuario: currentRefinement.respostaUsuario,
          idioma: lang,
          requestKey: getRequestKey('refinement_resolution_regeneration')
        })
      });

      if (response.ok) {
        const resolution = await response.json();
        setResultadoFinal(prev => prev ? ({
          ...prev,
          creativeDirector: {
            ...prev.creativeDirector,
            refinement: {
              ...resolution,
              pergunta: currentRefinement.pergunta,
              respostaUsuario: currentRefinement.respostaUsuario,
              language: lang,
              generatedAt: new Date().toISOString()
            }
          }
        }) : prev);
      }
    } catch (error) {
      console.warn('Regeneração do refinamento indisponível; mantendo conteúdo anterior.', error);
    } finally {
      setIsRefinementLoading(false);
    }
  };

  const keepCurrentDirection = () => {
    setShowRefinement(false);
    setRefinementStep('idle');
    setRefinementQuestion(null);
    setRefinementAnswer('');
  };

  // Aqui é onde ativamos a Mágica
  const callMatchmaker = async () => {
    setStep(8); // Vai para a tela de loading automático
    
    try {
      const response = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang })
      });
      
      const data = await response.json();
      
      if (data.estiloNome) {
        setIsCreativeDirectorLoading(true);
        setResultadoFinal({
          ...data,
          aiUsage: {
            [getAiUsageKey('diagnostic')]: new Date().toISOString()
          }
        });
        setStep(9); // Tela de Resultado Triunfal

        try {
          const creativeDirector = await fetchCreativeDirectorDiagnostic(data);

          if (creativeDirector) {
            setResultadoFinal(prev => prev ? ({ ...prev, creativeDirector }) : prev);
          }
        } catch (creativeError) {
          console.warn('Creative Director indisponível; mantendo o fluxo antigo.', creativeError);
        } finally {
          setIsCreativeDirectorLoading(false);
        }
      } else {
        setAlertMessage("Ops, deu um pequeno tilt na IA. Refaça por favor!");
        setStep(7);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage("Erro na conexão com o servidor mágico.");
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
    "Loja de Roupas / Moda"
  ];

  const publicos = [
    "Bebês e criancinhas (0 a 6 anos)",
    "Crianças e adolescentes (6 a 18 anos)",
    "Adultos em geral"
  ];

  const identidades = [
    "Feminina",
    "Masculina",
    "Neutra / Unissex"
  ];

  
  const primeirasImpressoes = ['Professional', 'Creative', 'Trustworthy', 'Premium', 'Friendly', 'Playful', 'Elegant', 'Modern', 'Calm', 'Bold', 'Natural', 'Innovative'];
  const personalidades = ['Calm', 'Bold', 'Elegant', 'Joyful', 'Minimal', 'Expressive'];
  const locais_options = ['Instagram', 'Printed materials', 'Packaging', 'Website', 'Clothing', 'Products', 'Signage', 'Presentations'];

  const toggleLocal = (val) => {
    setFormData(prev => ({
      ...prev,
      locais: prev.locais.includes(val) ? prev.locais.filter(item => item !== val) : [...prev.locais, val]
    }));
  };

  const sensacoes = [
    "Sofisticada / Premium",
    "Minimalista / Moderna",
    "Acolhedora / Humana",
    "Ousada / Inovadora",
    "Criativa / Divertida",
    "Leve / Delicada",
    "Natural / Orgânica",
    "Profissional / Confiável",
    "Elegante / Clássica"
  ];

  const nuncaPensarOpcoes = lang === 'en' ? [
    "Childish / Amateur",
    "Too Serious / Cold",
    "Generic / Boring",
    "Cluttered / Confusing",
    "Too Simple / Basic",
    "Overly Luxurious",
    "Old-fashioned / Outdated",
    "Untrustworthy",
    "Other..."
  ] : [
    "Infantil / Amadora",
    "Muito Séria / Fria",
    "Genérica / Sem Graça",
    "Poluída / Confusa",
    "Muito Simples / Básica",
    "Exageradamente Luxuosa",
    "Antiquada / Ultrapassada",
    "Pouco Confiável",
    "Outra..."
  ];

  const toggleNuncaPensar = (val) => {
    setFormData(prev => {
      const current = prev.nuncaPensarTags || [];
      if (current.includes(val)) {
        return { ...prev, nuncaPensarTags: current.filter(item => item !== val) };
      }
      if (current.length < 3) {
        return { ...prev, nuncaPensarTags: [...current, val] };
      }
      return prev;
    });
  };

  const visualBrandOptions = [
    { id: 'brand_1', image: '/estilos de fontes/estilo-de-fontes-1-01.png', font: 'Playfair Display', fonts: ['Playfair Display', 'Cormorant Garamond', 'Libre Baskerville'] },
    { id: 'brand_2', image: '/estilos de fontes/estilo-de-fontes-1-02.png', font: 'Borel', fonts: ['Borel', 'LittleFriend', 'Cafigine'] },
    { id: 'brand_3', image: '/estilos de fontes/estilo-de-fontes-1-03.png', font: 'Abril Fatface', fonts: ['Abril Fatface', 'Cinzel', 'Libre Baskerville'] },
    { id: 'brand_4', image: '/estilos de fontes/estilo-de-fontes-1-04.png', font: 'Sacramento', fonts: ['Sacramento', 'Allura', 'Amelie', 'Vellary'] },
    { id: 'brand_5', image: '/estilos de fontes/estilo-de-fontes-1-05.png', font: 'Julius Sans One', fonts: ['Julius Sans One', 'Josefin Sans', 'Raleway'] },
    { id: 'brand_6', image: '/estilos de fontes/estilo-de-fontes-1-06.png', font: 'DM Sans', fonts: ['DM Sans', 'Quicksand', 'Nunito'] },
  ];

  const getVisualBrandOption = (optionId) => visualBrandOptions.find(option => option.id === optionId);

  const getFontFromSimilarOptions = (fonts = [], estiloId) => {
    if (!Array.isArray(fonts) || fonts.length === 0) return '';
    const numericStyleId = Number(estiloId) || 0;
    return fonts[numericStyleId % fonts.length] || fonts[0];
  };

  const getVisualBrandFont = (optionId, estiloId) => {
    const option = getVisualBrandOption(optionId);
    if (!option) return '';
    return getFontFromSimilarOptions(option.fonts || [option.font], estiloId) || option.font;
  };

  const toggleInspiracoes = (option) => {
    const fontName = getVisualBrandFont(option.id) || option.font;
    selectedVisualBrandRef.current = { optionId: option.id, fontFamily: fontName };
    const found = getFontPresetByFamily(fontName);
    if (found) {
      setEditData(prev => ({
        ...prev,
        ...buildFontEditProps(found)
      }));
    }
    setFormData(prev => ({
      ...prev,
      inspiracoesVisual: option.id,
      selectedBrandFont: fontName,
      selectedBrandFontOptions: option.fonts || [option.font]
    }));
  };

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

  const handleCheckoutPro = async () => {
    setLoadingCheckout('pro');
    setShowPediatriaModal(false);
    try {
      const patternObj = selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder
        ? { mimeType: generatedPatterns[selectedPattern].mimeType, base64: generatedPatterns[selectedPattern].base64 }
        : null;

      const brandState = {
        editData, formData, resultadoFinal,
        selectedPaleta, selectedIcon, selectedTipo,
        paletas, tipografias,
        activeColor: editData.corAtiva,
        pattern: patternObj,
        iconPath: getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null,
        patternGenerationCount,
        estampas,
        papelariaSelecionada,
      };

      ['brandbox_step', 'brandbox_cartao', 'brandbox_crm', 'brandbox_plano', 'brandbox_papelaria'].forEach(k => localStorage.removeItem(k));
      const extrasCount = Math.max(0, papelariaSelecionada.filter(item => item !== "Caderneta de Saúde").length - 5);

      let sessionIdPro = null;
      try {
        const existingSessionId = typeof window !== 'undefined' ? localStorage.getItem('brandbox_session') : null;
        const cleanState = { ...brandState, estampas: null, generatedPatterns: null };
        cleanState.pattern = null;
        const saveRes = await fetch('/api/salvar-entrega', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brandState: cleanState, plano: 'pro', email: formData.email, marca: formData.marca, sessionId: existingSessionId || undefined }),
        });
        const saveData = await saveRes.json();
        if (saveData.sessionId) {
          sessionIdPro = saveData.sessionId;
          localStorage.setItem('brandbox_session', sessionIdPro);
        }
      } catch (e) { console.warn('Supabase save failed:', e); }

      let finalPatternUrl = null;
      if (patternObj && sessionIdPro) {
        try {
          const uploadRes = await fetch('/api/salvar-estampa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: patternObj.base64, marca: formData.marca, sessionId: sessionIdPro })
          });
          const uploadData = await uploadRes.json();
          if (uploadData.url) finalPatternUrl = uploadData.url;
        } catch (e) { console.warn('Pattern upload error:', e); }
      }

      if (brandState.pattern && !finalPatternUrl) try { localStorage.setItem('brandbox_pattern', JSON.stringify(brandState.pattern)); } catch {}
      try { 
        const deliveryData = { ...brandState, pattern: finalPatternUrl ? { url: finalPatternUrl } : null, id: sessionIdPro };
        localStorage.setItem('brandbox_delivery', JSON.stringify(deliveryData)); 
        if (sessionIdPro) localStorage.setItem(`brandbox_brand_${sessionIdPro}`, JSON.stringify(deliveryData));
      } catch {}

      // DEMO mode: pula o Stripe e vai direto para a experência mock com os DADOS REAIS GERADOS
                          if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
                            window.location.href = `/${lang}/sucesso?demo=1&plano=pro&lang=${lang}`;
                            return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: 'pro', marca: formData.marca, email: formData.email, extrasCount, papelaria: papelariaSelecionada, sessionId: sessionIdPro, lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        setAlertMessage('Houve um problema ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoadingCheckout(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem', background: '#ffffff', position: 'relative' }}>
      {devMode && <LanguageSwitcher style={{ position: 'absolute', top: '12px', right: '20px' }} />}
      {devMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#1a1a1a', color: '#f90', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, padding: '4px', zIndex: 9999, letterSpacing: '1px' }}>
          ⚡ MODO DEV ATIVO — estampas não consomem créditos
        </div>
      )}
      <div style={{ width: '100%', maxWidth: '700px', position: 'relative', height: '85vh', marginTop: devMode ? '22px' : 0 }}>

        {step > 1 && step < 8 && (
           <button onClick={() => {
             if (step === 7.8) setStep(7.5);
             else if (step === 7.5) setStep(7.2);
             else if (step === 7.2) setStep(7);
             else if (step === 7) setStep(6.5);
             else if (step === 6.5) setStep(6);
             else if (step === 6) setStep(5);
             
             else if (step === 5.2) setStep(5);
             else setStep(s => s - 1);
           }} style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: '30px', padding: '6px 14px', color: 'var(--text-secondary)', cursor: 'pointer', zIndex: 100, fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '5px' }}>
             ← {dictionary?.onboarding?.btn_back || 'Voltar'}
           </button>
        )}
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div 
              key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-color)', borderRadius: '24px', border: 'none', boxShadow: 'none' }}
            >
              <p style={{ fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent-turquoise)', marginBottom: '2rem', fontWeight: 600 }}>{dictionary?.landing?.apresenta || 'THE BRAND BOX.'}</p>
              
              {/* Logo com fonte Golden Blast */}
              <Image src="/the-brand-box-logo.png" alt="the brand box." width={1024} height={225} priority={true} style={{ width: '80%', maxWidth: '380px', height: 'auto', marginBottom: '1.5rem', mixBlendMode: 'multiply', opacity: 0.9 }} />
              
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.2rem', lineHeight: 1.35, maxWidth: '90%', fontWeight: 700, letterSpacing: '-0.5px' }}>{dictionary?.landing?.marca_ja_existe || 'Sua marca já existe dentro de você.'}</h1>
              
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '90%', fontWeight: 400 }}>
                {dictionary?.landing?.ajuda_aparecer || 'Nós apenas ajudamos a revelá-la ao mundo.'}
                {dictionary?.landing?.experiencia_guiada && (
                  <><br/>{dictionary.landing.experiencia_guiada}</>
                )}
              </p>
              
              <button onClick={nextStep} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>{dictionary?.landing?.criar_marca || 'CRIAR MINHA MARCA AGORA'}</button>

              {/* DEV SHORTCUTS - só aparece em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '30px', padding: '15px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: '12px', width: '100%' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>⚡ Atalho Dev</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {[
                      { id: 2, nome: 'Jardim Encantado' },
                      { id: 3, nome: 'Escandinavo Acolhedor' },
                      { id: 5, nome: 'Essência Atemporal' },
                      { id: 6, nome: 'Raízes & Cuidado' },
                      { id: 8, nome: 'Doce Encantamento' },
                      { id: 11, nome: 'Estético Editorial' },
                    ].map(e => (
                      <button key={e.id} onClick={() => {
                        setFormData(prev => ({ ...prev, marca: prev.marca || 'Minha Marca', nome: prev.nome || 'Dev' }));
                        setResultadoFinal({ estiloId: e.id, estiloNome: e.nome, mensagem: `Teste direto do estilo ${e.nome}` });
                        setStep(9);
                      }} style={{ padding: '6px 12px', fontSize: '0.65rem', borderRadius: '30px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
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
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '15%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dictionary?.onboarding?.step_2_title || 'Antes de começarmos...'}</h2>
                <div className="hint-tooltip">
                  <LightbulbIcon size={20} />
                  <span className="tooltiptext">{dictionary?.onboarding?.step_2_hint || 'Seu nome de contato, como você se chama, e não a sua marca...'}</span>
                </div>
              </div>
              <div style={{ width: '100%', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input name="nome" value={formData.nome} onChange={handleInput} placeholder={dictionary?.onboarding?.step_2_name_placeholder || 'Seu nome ou apelido'} />
                {isDemoMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', width: '100%' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '4px' }}>
                      {dictionary?.onboarding?.step_2_email_label_demo || (lang === 'en' ? 'Email (optional)' : 'E-mail (opcional)')}
                    </label>
                    <input 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInput} 
                      type="email" 
                      placeholder={dictionary?.onboarding?.step_2_email_placeholder_demo || (lang === 'en' ? 'Want to say hello? Leave your email ✨' : 'Quer se apresentar? Deixe seu e-mail ✨')} 
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px', marginLeft: '4px' }}>
                      {dictionary?.onboarding?.step_2_email_support_demo || (lang === 'en' ? 'You can continue the demo without signing up.' : 'Você pode continuar a demonstração sem preencher.')}
                    </span>
                  </div>
                ) : (
                  <input name="email" value={formData.email} onChange={handleInput} type="email" placeholder={dictionary?.onboarding?.step_2_email_placeholder || 'O seu melhor e-mail'} />
                )}
              </div>
              <button 
                onClick={handleStep2Submit} 
                className="btn-secondary" 
                style={{ 
                  opacity: isDemoMode ? (formData.nome && formData.nome.trim() ? 1 : 0.5) : (formData.nome && formData.email && formData.email.includes('@') ? 1 : 0.5), 
                  pointerEvents: isDemoMode ? (formData.nome && formData.nome.trim() ? 'auto' : 'none') : (formData.nome && formData.email && formData.email.includes('@') ? 'auto' : 'none') 
                }}
              >
                {isDemoMode ? (dictionary?.onboarding?.btn_continue_demo || (lang === 'en' ? 'Continue demo' : 'Continuar demonstração')) : (dictionary?.onboarding?.btn_continue || 'Continuar')}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '30%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{dictionary?.onboarding?.step_3_title || 'Qual nome vai aparecer na sua identidade visual?'}</h2>
                <div className="hint-tooltip">
                  <LightbulbIcon size={20} />
                  <span className="tooltiptext">{dictionary?.onboarding?.step_3_hint || 'Não se preocupe: você poderá alterar o nome da sua marca depois dentro da plataforma. Pode testar sem medo! ✨'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '450px' }}>
                {dictionary?.onboarding?.step_3_subtitle || 'Pode ser o nome da sua empresa, da sua marca, do seu produto ou até o seu próprio nome.'}
              </p>
              <div style={{ width: '100%', marginBottom: '0.75rem' }}>
                <input name="marca" value={formData.marca} onChange={e => { handleInput(e); setMarcaSugestaoAceita(false); }} placeholder={dictionary?.onboarding?.step_3_placeholder || 'Ex: Clínica Sonho Meu...'} />
              </div>

              {/* Contador de palavras */}
              {formData.marca && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {(() => {
                    const val = formData.marca.trim();
                    if (val.length === 0) return null;
                    
                    const isPersonal = /^(dr|dra|dr\.|dra\.|doutor|doutora|prof|profa|prof\.|profa\.|psicóloga|psicólogo|nutri|nutricionista|advogado|advogada|arquiteto|arquiteta|eng\.|eng|engenheiro|engenheira)\b/i.test(val);
                    const wordCount = val.split(/\s+/).length;
                    
                    if (isPersonal) {
                      return <span style={{ color: 'var(--accent-turquoise)' }}>{dictionary?.onboarding?.step_3_feedback_personal || '💡 Marcas pessoais costumam transmitir mais proximidade e confiança.'}</span>;
                    } else if (wordCount > 3) {
                      return <span style={{ color: 'var(--accent-magenta)' }}>{dictionary?.onboarding?.step_3_feedback_long || '💡 Nomes longos podem funcionar, mas talvez uma versão reduzida fique mais memorável.'}</span>;
                    } else {
                      const text = dictionary?.onboarding?.step_3_feedback_short?.replace('{count}', wordCount) || `✅ Nome de ${wordCount} palavra(s). Fácil de memorizar.`;
                      return <span style={{ color: 'var(--accent-turquoise)' }}>{text}</span>;
                    }
                  })()}
                </div>
              )}

              {/* Confirmação de sugestão aceita */}
              {marcaSugestaoAceita && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                  <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                    {dictionary?.onboarding?.step_3_success || '✅ Nome atualizado! Ficou muito mais elegante para a logo.'}
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
                    <p style={{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6, marginBottom: sugestao ? '8px' : '0' }} dangerouslySetInnerHTML={{ __html: dictionary?.onboarding?.step_3_tip || '💡 <strong>Dica visual:</strong> nomes longos ficam difíceis de ler na logo. Abreviar o nome do meio mantém a elegância sem perder a identidade.' }} />
                    {sugestao && (
                      <button
                        onClick={() => { setFormData(prev => ({ ...prev, marca: sugestao })); setMarcaSugestaoAceita(true); }}
                        style={{ fontSize: '0.8rem', color: '#e07a30', background: 'rgba(224,122,48,0.08)', border: '1px solid rgba(224,122,48,0.3)', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {dictionary?.onboarding?.step_3_use_suggestion?.replace('{sugestao}', sugestao) || `Usar \"${sugestao}\"`}
                      </button>
                    )}
                  </motion.div>
                );
              })()}

              {/* Dica sobre título Dra./Dr. */}
              {formData.marca && /^(dra?\.?|dr\.?)\s/i.test(formData.marca.trim()) && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0f7ff', border: '1px solid #c0d8f5', borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                  <p style={{ fontSize: '0.8rem', color: '#2a5a8a', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: dictionary?.onboarding?.step_3_dr_tip || '👩‍⚕️ Quer manter o título <strong>Dra.</strong> na logo? Fica lindo em alguns estilos! Pode deixar — a gente vai usar na identidade visual.' }} />
                </motion.div>
              )}

              <button onClick={nextStep} className="btn-secondary" style={{ opacity: formData.marca ? 1 : 0.5, pointerEvents: formData.marca ? 'auto' : 'none', marginTop: '0.5rem' }}>{dictionary?.onboarding?.btn_next_heart || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '50%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_4_title || 'Qual é a sua área de atuação?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_4_subtitle || 'Escolha a que mais combina com o seu negócio.'}</p>
              <div style={{ width: '100%', marginBottom: '1rem', overflowY: 'auto', maxHeight: '50vh', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '4px' }}>
                  {[...areas, 'Other'].map((a, i) => {
                    const isOther = a === 'Other';
                    const displayLabel = isOther ? (dictionary?.onboarding?.step_4_other_btn || 'Outra') : (dictionary?.onboarding?.areas_options?.[a] || a);
                    const value = isOther ? 'Outra' : a;
                    const isSelected = formData.atuacao === value;
                    const PALETTE = ["#E8EAEB", "#F2E3D5", "#E3EBE6", "#C3CEDB", "#C6B098", "#D1B875", "#909887", "#EFEBE4"];
                    const baseColor = PALETTE[i % PALETTE.length];
                    return (
                      <button
                        key={value}
                        onClick={() => setSingleChoice('atuacao', value)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--border)',
                          background: isSelected ? baseColor : '#F9F8F6',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '0.82rem',
                          lineHeight: 1.3,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '110px',
                          boxShadow: isSelected ? '0 6px 15px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {formData.atuacao === 'Outra' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', marginBottom: '1rem' }}>
                  <input name="atuacaoOutra" value={formData.atuacaoOutra} onChange={handleInput} placeholder={dictionary?.onboarding?.step_4_other_placeholder || 'Digite sua área...'} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </motion.div>
              )}
              
              <div style={{ width: '100%', marginBottom: '1.5rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {!showContext ? (
                  <button onClick={() => setShowContext(true)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-turquoise)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', padding: '10px' }}>
                    {dictionary?.onboarding?.step_4_add_context_btn || 'Adicionar mais contexto +'}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%' }}>
                    <textarea 
                      name="contextoExtra" 
                      value={formData.contextoExtra} 
                      onChange={handleInput} 
                      placeholder={dictionary?.onboarding?.step_4_context_placeholder || 'Isso nos ajuda a entender o contexto e a alma da sua marca. Conte mais sobre o que você faz, seu diferencial, etc. (Opcional)'}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.95rem', minHeight: '100px', outline: 'none' }} 
                    />
                  </motion.div>
                )}
              </div>

              <button onClick={() => {
                if (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) {
                  setStep(5);
                } else {
                  setAlertMessage(dictionary?.onboarding?.step_4_alert || 'Por favor, selecione uma área de atuação antes de avançar.');
                }
              }} className="btn-secondary" style={{ opacity: (formData.atuacao !== '' && (formData.atuacao !== 'Outra' || formData.atuacaoOutra !== '')) ? 1 : 0.5 }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '70%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dictionary?.onboarding?.step_5_title || 'Para quem você atende?'}</h2>
                <div className="hint-tooltip">
                  <LightbulbIcon size={20} />
                  <span className="tooltiptext">{dictionary?.onboarding?.step_5_hint || 'Pense com quem você quer se conectar, não necessariamente quem compra de você.'}</span>
                </div>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_5_subtitle || 'Seu público influencia o estilo, cores e linguagem visual que vamos sugerir.'}</p>
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {publicos.map(p => (<button key={p} onClick={() => setSingleChoice('publico', p)} style={chipStyle(formData.publico === p)}>{dictionary?.onboarding?.publicos_options?.[p] || p}</button>))}
              </div>
              <button onClick={() => { if (formData.publico) setStep(6); else setAlertMessage(dictionary?.onboarding?.alert_select_option || 'Por favor, selecione uma opção antes de avançar.'); }} className="btn-secondary" style={{ opacity: formData.publico ? 1 : 0.5 }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="step6" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '70%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_title || 'Como as pessoas devem se sentir após interagir com a sua marca?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_6_subtitle || 'Escolha até 3 opções.'}</p>
              
              <div style={{ width: '100%', marginBottom: '1rem', overflowY: 'auto', maxHeight: '50vh', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '4px' }}>
                  {(() => {
                    const SENSACOES_PALETTE = {
                      "Sofisticada / Premium": {
                        bg: "#4E4656",
                        color: "#FFFFFF",
                        border: "#3B3442"
                      },
                      "Minimalista / Moderna": {
                        bg: "#5A6D7C",
                        color: "#FFFFFF",
                        border: "#465663"
                      },
                      "Acolhedora / Humana": {
                        bg: "#D6A185",
                        color: "#FFFFFF",
                        border: "#C08A6E"
                      },
                      "Ousada / Inovadora": {
                        bg: "#CA7D74",
                        color: "#FFFFFF",
                        border: "#B3675E"
                      },
                      "Criativa / Divertida": {
                        bg: "#D6B579",
                        color: "#FFFFFF",
                        border: "#BF9F63"
                      },
                      "Leve / Delicada": {
                        bg: "#8AB5A3",
                        color: "#FFFFFF",
                        border: "#739E8C"
                      },
                      "Natural / Orgânica": {
                        bg: "#8F9F7F",
                        color: "#FFFFFF",
                        border: "#788868"
                      },
                      "Profissional / Confiável": {
                        bg: "#496880",
                        color: "#FFFFFF",
                        border: "#365167"
                      },
                      "Elegante / Clássica": {
                        bg: "#B59E87",
                        color: "#FFFFFF",
                        border: "#9E8771"
                      }
                    };

                    return sensacoes.map(s => {
                      const isSelected = formData.sentimentos.includes(s);
                      const config = SENSACOES_PALETTE[s] || {
                        bg: "#F5F5F5",
                        color: "var(--text-primary)",
                        border: "var(--border)"
                      };
                      
                      return (
                        <button 
                          key={s} 
                          onClick={() => toggleSentimento(s)} 
                          style={{
                            position: 'relative',
                            background: config.bg,
                            color: config.color,
                            border: isSelected ? '3px solid var(--accent-turquoise)' : `1.5px solid ${config.border}`, 
                            padding: '16px 12px', 
                            borderRadius: '16px', 
                            cursor: 'pointer',
                            transition: 'all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)', 
                            fontSize: '0.85rem', 
                            fontWeight: isSelected ? 700 : 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '105px',
                            boxShadow: isSelected 
                              ? '0 12px 28px rgba(0, 0, 0, 0.22), 0 0 0 4px rgba(42, 137, 127, 0.3)' 
                              : '0 4px 14px rgba(0, 0, 0, 0.09), 0 1px 3px rgba(0, 0, 0, 0.04)',
                            transform: isSelected ? 'translateY(-4px) scale(1.03)' : 'translateY(0) scale(1)'
                          }}
                        >
                          {isSelected && (
                            <span style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'var(--accent-turquoise)',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}>
                              ✓
                            </span>
                          )}
                          <span>{dictionary?.onboarding?.sensacoes_options?.[s] || s}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500}}>{dictionary?.onboarding?.step_6_selected?.replace('{count}', formData.sentimentos.length) || `Selecionadas: ${formData.sentimentos.length}/3`}</p>
              <button onClick={() => { if (formData.sentimentos.length > 0) setStep(6.5); else setAlertMessage(dictionary?.onboarding?.alert_select_option || 'Por favor, selecione uma opção antes de avançar.'); }} className="btn-primary" style={{ opacity: formData.sentimentos.length > 0 ? 1 : 0.5 }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 6.5 && (
            <motion.div 
              key="step6_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '92%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_6_5_title || 'Onde a sua marca vai aparecer com mais frequência?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_6_5_subtitle || 'Selecione todos que se aplicam.'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {locais_options.map(s => {
                  const isSelected = formData.locais.includes(s);
                  return (
                    <button key={s} onClick={() => toggleLocal(s)} style={{ background: isSelected ? 'var(--accent-turquoise)' : '#fff', color: isSelected ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}>{dictionary?.onboarding?.locais_options?.[s] || s}</button>
                  )
                })}
              </div>
              <button onClick={() => { if (formData.locais.length > 0) setStep(7); else setAlertMessage(dictionary?.onboarding?.alert_select_option || 'Por favor, selecione uma opção antes de avançar.'); }} className="btn-primary" style={{ opacity: formData.locais.length > 0 ? 1 : 0.5 }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="step7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '94%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_title || 'O que não pode faltar no layout?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_subtitle || 'Quais elementos visuais e temáticos são vitais para você? (Escolha 1 opção)'}</p>
              <div style={{ width: '100%', marginBottom: '1.5rem', overflowY: 'auto', maxHeight: '50vh', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '4px' }}>
                  {(() => {
                    const ELEMENTO_COLORS = {
                      "Toque Lúdico / Elementos Mágicos": "#E6DDF2", // Lilac
                      "Mascotes / Ícones Divertidos": "#F2E8D5", // Warm yellow/beige
                      "Minimalismo / Linhas Retas": "#E8EAEB", // Cool grey
                      "Aquarela Clássica": "#F2E3E9", // Soft pink
                      "Formas Orgânicas / Tons Terrosos": "#C6B098", // Porcini / Taupe
                      "Tipografia Pura / Editorial": "#C3CEDB" // Plein Air (Azul acinzentado chique)
                    };
                    return elementosDesc.map(s => {
                      const isSelected = formData.elementosVisuais.includes(s);
                      const baseColor = ELEMENTO_COLORS[s] || '#F9F8F6';
                      const isDark = ["Formas Orgânicas / Tons Terrosos", "Tipografia Pura / Editorial"].includes(s);

                      return (
                        <button 
                          key={s} 
                          onClick={() => toggleElemento(s)} 
                          style={{
                            background: isSelected ? baseColor : '#F9F8F6',
                            color: isSelected ? (isDark ? '#fff' : 'var(--text-primary)') : 'var(--text-secondary)',
                            border: isSelected ? `2px solid ${isDark ? baseColor : 'var(--text-primary)'}` : '1px solid var(--border)', 
                            padding: '16px 12px', 
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease', 
                            fontSize: '0.82rem', 
                            fontWeight: isSelected ? 600 : 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '100px',
                            boxShadow: isSelected ? '0 6px 15px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.02)'
                          }}
                        >
                          {dictionary?.onboarding?.elementos_options?.[s] || s}
                        </button>
                      )
                    });
                  })()}
                </div>
              </div>
              <button onClick={() => { if (formData.elementosVisuais.length > 0) setStep(7.2); else setAlertMessage(dictionary?.onboarding?.alert_select_option || 'Por favor, selecione uma opção antes de avançar.'); }} className="btn-primary" style={{ opacity: formData.elementosVisuais.length > 0 ? 1 : 0.5 }}>{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7.2 && (
            <motion.div 
              key="step7_2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '96%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_2_title || 'Existe alguma marca cujo estilo você admira?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_2_subtitle || '(Opcional)'}</p>
              
              <div style={{ width: '100%', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {visualBrandOptions.map(opt => {
                  const isSelected = formData.inspiracoesVisual === opt.id;
                  return (
                    <div 
                      key={opt.id} 
                      onClick={() => toggleInspiracoes(opt)}
                      style={{
                        border: `2px solid ${isSelected ? 'var(--accent-turquoise)' : 'var(--border)'}`, 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 0 2px var(--accent-turquoise)' : 'none',
                        background: '#f9f9f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <img src={opt.image} alt={`Style ${opt.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )
                })}
              </div>

              <button 
                onClick={() => { 
                  if (formData.inspiracoesVisual) setStep(7.5); 
                  else setAlertMessage(dictionary?.onboarding?.alert_select_brand || 'Por favor, selecione uma marca que te inspira para definirmos a sua fonte inicial.'); 
                }} 
                className="btn-primary" 
                style={{ opacity: formData.inspiracoesVisual ? 1 : 0.5 }}
              >
                {dictionary?.onboarding?.btn_next || 'Avançar'}
              </button>
            </motion.div>
          )}

          {step === 7.5 && (
            <motion.div 
              key="step7_5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '98%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.step_7_5_title || 'O que as pessoas NUNCA devem pensar da sua marca?'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.step_7_5_subtitle || 'Escolha até 3 opções.'}</p>
              
              <div style={{ width: '100%', marginBottom: '1rem', overflowY: 'auto', maxHeight: '50vh', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '4px' }}>
                  {nuncaPensarOpcoes.map((s, i) => {
                    const isSelected = (formData.nuncaPensarTags || []).includes(s);
                    const PALETTE = ["#E8EAEB", "#F2E3D5", "#E3EBE6", "#C3CEDB", "#C6B098", "#D1B875", "#909887", "#EFEBE4"];
                    const baseColor = PALETTE[i % PALETTE.length];
                    return (
                      <button 
                        key={s} 
                        onClick={() => toggleNuncaPensar(s)} 
                        style={{
                          background: isSelected ? baseColor : '#F9F8F6',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--border)', 
                          padding: '16px 12px', 
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease', 
                          fontSize: '0.82rem', 
                          fontWeight: isSelected ? 600 : 400,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          minHeight: '100px',
                          boxShadow: isSelected ? '0 6px 15px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                      >
                        {dictionary?.onboarding?.nunca_pensar_options?.[s] || s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <AnimatePresence>
                {( (formData.nuncaPensarTags || []).includes('Outra...') || (formData.nuncaPensarTags || []).includes('Other...') ) && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ width: '100%', marginBottom: '1.5rem' }}>
                    <textarea name="nuncaPensar" value={formData.nuncaPensar} onChange={handleInput} placeholder={dictionary?.onboarding?.step_7_5_placeholder || "Ex: 'Não quero parecer infantil', 'Não quero parecer cara demais'."} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', minHeight: '80px' }} autoFocus />
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={() => setStep(7.8)} className="btn-secondary">{dictionary?.onboarding?.btn_next || 'Avançar'}</button>
            </motion.div>
          )}

          {step === 7.8 && (
            <motion.div 
              key="step7_8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ position: 'absolute', top: '3rem', left: '3rem', right: '3rem', height: '4px', background: 'var(--border)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'var(--accent-turquoise)', width: '100%', borderRadius: '4px', transition: 'width 0.5s' }} /></div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{dictionary?.onboarding?.step_7_8_title || 'Aqui está o que eu entendi sobre a sua marca.'}</h2>
              <div style={{ background: 'var(--bg-soft)', borderRadius: '16px', padding: '1.5rem', width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_audience || 'Público'}:</strong> {dictionary?.onboarding?.publicos_options?.[formData.publico] || formData.publico}</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_feelings || 'Sentimentos'}:</strong> {formData.sentimentos.length} selecionados</p>
                 <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>✅ <strong>{dictionary?.onboarding?.summary_goals || 'Objetivos'}:</strong> Alinhados</p>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{dictionary?.onboarding?.summary_text || 'Com base nisso, estou buscando as direções visuais que melhor se encaixam na sua marca.'}</p>
              <button onClick={callMatchmaker} className="btn-primary" style={{ background: 'var(--accent-magenta)' }}>{dictionary?.onboarding?.step_7_8_btn || 'Traduzir a essência da minha marca'}</button>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div 
              key="step8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
              >✦</motion.div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', color: 'var(--accent-turquoise)' }}>{dictionary?.postmatch?.step_8_title || 'Interpretando sua marca...'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>{dictionary?.postmatch?.step_8_subtitle || 'Nosso motor criativo está analisando o seu perfil para encontrar a combinação perfeita para você.'}</p>
            </motion.div>
          )}

          {/* O GLORIOSO RESULTADO */}
          {step === 9 && resultadoFinal && (
            <motion.div 
              key="step9" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              className="wizard-step" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-color)', borderRadius: '24px', border: 'none', boxShadow: 'none' }}
            >
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{dictionary?.postmatch?.step_9_perfect_match || 'O MATCH PERFEITO PARA'} {formData.marca || 'SUA MARCA'}</p>
              {(() => {
                const styleColors = {
                  'Jardim Encantado': '#C492B1', // Dusty magical lilac/pink
                  'Escandinavo Acolhedor': '#C9B6A1', // Warm sand
                  'Essência Atemporal': '#363532', // Obsidian
                  'Raízes & Cuidado': '#A2AD91', // Olive green
                  'Doce Encantamento': '#E8B4B8', // Soft sweet pink
                  'Estético Editorial': '#C3CEDB', // Plein Air Blue
                };
                const titleColor = styleColors[resultadoFinal.estiloNome] || 'var(--accent-magenta)';
                return (
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: titleColor, fontWeight: 600 }}>{resultadoFinal.estiloNome}</h2>
                );
              })()}
              
              {!isCreativeDirectorLoading && !resultadoFinal.creativeDirector && (
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <p className="mobile-font-sm" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 400, letterSpacing: '0.2px' }}>
                    &quot;{resultadoFinal.mensagem}&quot;
                  </p>
                </div>
              )}

              {isCreativeDirectorLoading && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: '1.25rem' }}>
                  Preparando seu diagnóstico criativo...
                </p>
              )}

              {resultadoFinal.creativeDirector && (
                <div style={{ width: '100%', maxWidth: '620px', background: '#ffffff', padding: '1.5rem', borderRadius: '18px', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent-magenta)', textTransform: 'uppercase', letterSpacing: '1.8px', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Diagnóstico Criativo</p>
                  {isDifferentLanguage(resultadoFinal.creativeDirector) && (
                    <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
                      <button type="button" onClick={regenerateCreativeDirector} disabled={isCreativeDirectorLoading || hasAiUsage('diagnostic_regeneration')} className="btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem', opacity: isCreativeDirectorLoading || hasAiUsage('diagnostic_regeneration') ? 0.65 : 1 }}>
                        {isCreativeDirectorLoading ? refineCopy.regenerating : refineCopy.regenerate}
                      </button>
                    </div>
                  )}
                  <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.2rem', textAlign: 'center' }}>{resultadoFinal.creativeDirector.diagnostico}</p>

                  <div style={{ display: 'grid', gap: '0.9rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Personalidade da marca</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{resultadoFinal.creativeDirector.personalidade.join(' • ')}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>O que o público precisa sentir</strong>
                      <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem', paddingLeft: '1.1rem' }}>
                        {resultadoFinal.creativeDirector.expectativasPublico.map((item, index) => <li key={`expectativa-${index}`}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Objetivos emocionais</strong>
                      <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem', paddingLeft: '1.1rem' }}>
                        {resultadoFinal.creativeDirector.objetivosEmocionais.map((item, index) => <li key={`objetivo-${index}`}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Por que essa direção combina</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{resultadoFinal.creativeDirector.porqueEsseEstilo}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem' }}>{resultadoFinal.creativeDirector.direcaoVisual}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Riscos criativos a evitar</strong>
                      <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem', paddingLeft: '1.1rem' }}>
                        {resultadoFinal.creativeDirector.riscosEvitar.map((item, index) => <li key={`risco-${index}`}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={startCreativeRefinement}
                      disabled={isRefinementLoading}
                      className="btn-secondary"
                      style={{ padding: '0.85rem 1.2rem', fontSize: '0.9rem', opacity: isRefinementLoading ? 0.65 : 1 }}
                    >
                      {refineCopy.button}
                    </button>
                  </div>

                  {showRefinement && (
                    <div style={{ marginTop: '1rem', background: 'var(--bg-color)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--border)' }}>
                      {isRefinementLoading && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                          {refinementStep === 'question' ? refineCopy.loadingQuestion : refineCopy.loadingResolution}
                        </p>
                      )}

                      {!isRefinementLoading && refinementStep === 'answer' && refinementQuestion && (
                        <div>
                          {refinementQuestion.tensaoIdentificada && (
                            <div style={{ marginBottom: '0.85rem' }}>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{refineCopy.tension}</strong>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{refinementQuestion.tensaoIdentificada}</p>
                            </div>
                          )}
                          <div style={{ marginBottom: '0.85rem' }}>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{refineCopy.question}</strong>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{refinementQuestion.pergunta}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginTop: '0.35rem' }}>{refinementQuestion.porquePerguntar}</p>
                            {isDifferentLanguage(refinementQuestion) && (
                              <button type="button" onClick={startCreativeRefinement} disabled={isRefinementLoading || hasAiUsage('refinement_question')} className="btn-secondary" style={{ marginTop: '0.65rem', padding: '0.65rem 0.9rem', fontSize: '0.82rem', opacity: isRefinementLoading || hasAiUsage('refinement_question') ? 0.65 : 1 }}>
                                {refineCopy.regenerate}
                              </button>
                            )}
                          </div>
                          <textarea
                            value={refinementAnswer}
                            onChange={(event) => setRefinementAnswer(event.target.value)}
                            placeholder={refineCopy.placeholder}
                            rows={3}
                            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem', resize: 'vertical', fontFamily: 'inherit', color: 'var(--text-primary)' }}
                          />
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={submitCreativeRefinement}
                              disabled={!refinementAnswer.trim() || isRefinementLoading}
                              className="btn-primary"
                              style={{ padding: '0.8rem 1rem', opacity: refinementAnswer.trim() && !isRefinementLoading ? 1 : 0.55 }}
                            >
                              {refineCopy.analyze}
                            </button>
                            <button type="button" onClick={keepCurrentDirection} className="btn-secondary" style={{ padding: '0.8rem 1rem' }}>
                              {refineCopy.keepCurrent}
                            </button>
                          </div>
                        </div>
                      )}

                      {!isRefinementLoading && refinementStep === 'result' && resultadoFinal.creativeDirector.refinement && (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div style={{ background: '#fff', borderRadius: '12px', padding: '0.85rem' }}>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{refineCopy.decision}</strong>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{resultadoFinal.creativeDirector.refinement.resumoDecisao}</p>
                          </div>
                          <div style={{ background: '#fff', borderRadius: '12px', padding: '0.85rem' }}>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{refineCopy.direction}</strong>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{resultadoFinal.creativeDirector.refinement.direcaoRefinada}</p>
                            {isDifferentLanguage(resultadoFinal.creativeDirector.refinement) && (
                              <button type="button" onClick={regenerateRefinementResolution} disabled={isRefinementLoading || hasAiUsage('refinement_resolution_regeneration')} className="btn-secondary" style={{ marginTop: '0.65rem', padding: '0.65rem 0.9rem', fontSize: '0.82rem', opacity: isRefinementLoading || hasAiUsage('refinement_resolution_regeneration') ? 0.65 : 1 }}>
                                {isRefinementLoading ? refineCopy.regenerating : refineCopy.regenerate}
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'grid', gap: '0.65rem' }}>
                            {[
                              [refineCopy.palette, resultadoFinal.creativeDirector.refinement.impactoPaleta],
                              [refineCopy.typography, resultadoFinal.creativeDirector.refinement.impactoTipografia],
                              [refineCopy.composition, resultadoFinal.creativeDirector.refinement.impactoComposicao],
                              [refineCopy.pattern, resultadoFinal.creativeDirector.refinement.impactoEstampa]
                            ].map(([label, value]) => (
                              <div key={label} style={{ background: '#fff', borderRadius: '12px', padding: '0.85rem' }}>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>{label}</strong>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, marginTop: '0.25rem' }}>{value}</p>
                              </div>
                            ))}
                          </div>
                          {resultadoFinal.creativeDirector.refinement.estiloAlternativoId && (
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--accent-magenta)' }}>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{refineCopy.altStyle}</strong>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.25rem' }}>
                                {resultadoFinal.creativeDirector.refinement.estiloAlternativoNome}. {refineCopy.altNote}
                              </p>
                            </div>
                          )}
                          <button type="button" onClick={keepCurrentDirection} className="btn-secondary" style={{ padding: '0.8rem 1rem', justifySelf: 'center' }}>
                            {refineCopy.keepCurrent}
                          </button>
                        </div>
                      )}

                      {!isRefinementLoading && refinementStep === 'unavailable' && (
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                            {refineCopy.unavailable}
                          </p>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button type="button" onClick={startCreativeRefinement} className="btn-primary" style={{ padding: '0.8rem 1rem' }}>
                              {refineCopy.retry}
                            </button>
                            <button type="button" onClick={keepCurrentDirection} className="btn-secondary" style={{ padding: '0.8rem 1rem' }}>
                              {refineCopy.close}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button onClick={fetchVariacoes} className="btn-primary" style={{ background: 'var(--accent-magenta)', color: 'var(--text-primary)', boxShadow: 'none' }}>{dictionary?.postmatch?.step_9_btn_customize || 'Personalizar minha Identidade'}</button>

              {refazerAttempts < 2 ? (
                <button
                  onClick={() => setShowRefazerModal(true)}
                  style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {dictionary?.postmatch?.step_9_btn_retake || 'Refazer o questionário'} {(dictionary?.postmatch?.step_9_attempts_remaining || '({count} tentativa{s} restante{s})').replace('{count}', 2 - refazerAttempts).replace('{s}', 2 - refazerAttempts !== 1 ? 's' : '')}
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
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{dictionary?.postmatch?.modal_retake_title || 'Tem certeza?'}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    <span dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.modal_retake_desc_1 || 'Você perderá o modelo gerado e <strong>não poderá recuperá-lo</strong>.' }} /><br/>
                    <span dangerouslySetInnerHTML={{ __html: (dictionary?.postmatch?.modal_retake_desc_2 || 'Após refazer, você terá mais <strong>{count} tentativa{s}</strong> restante{s}.').replace('{count}', 1 - refazerAttempts).replace('{s}', 1 - refazerAttempts !== 1 ? 's' : '') }} />
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
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', padding: '1.5rem 1.25rem', border: '1px solid var(--border)', overflowY: 'hidden' }}
            >
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>{dictionary?.postmatch?.step_10_title || 'Refinamento Visual'}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
                {/* customStep === 'tipo' ? (dictionary?.postmatch?.step_10_subtitle_tipo || '1. Escolha a sua Tipografia ideal') : */ customStep === 'paleta' ? (dictionary?.postmatch?.step_10_subtitle_paleta || '1. Defina sua Paleta de Cores') : <span dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_10_subtitle_cor || (lang === 'en' ? '3. Which color will <strong>highlight</strong> your brand?' : '2. Qual cor será o <strong>destaque</strong> da sua marca?') }} />}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                 {/* Aba Tipografia Oculta: <div onClick={() => setCustomStep('tipo')} style={{ height: '6px', width: '30%', borderRadius: '4px', cursor: 'pointer', background: customStep === 'tipo' ? 'var(--accent-turquoise)' : (selectedTipo ? 'var(--accent-turquoise)' : 'var(--border)'), opacity: customStep === 'tipo' ? 1 : 0.4, transition: 'all 0.3s' }} /> */}
                 <div onClick={() => setCustomStep('paleta')} style={{ height: '6px', width: '45%', borderRadius: '4px', cursor: 'pointer', background: customStep === 'paleta' ? 'var(--accent-magenta)' : (selectedPaleta ? 'var(--accent-magenta)' : 'var(--border)'), opacity: customStep === 'paleta' ? 1 : 0.4, transition: 'all 0.3s' }} />
                 <div onClick={() => selectedPaleta ? setCustomStep('cor') : null} style={{ height: '6px', width: '45%', borderRadius: '4px', cursor: selectedPaleta ? 'pointer' : 'default', background: customStep === 'cor' ? 'var(--accent-magenta)' : (editData.corAtiva ? 'var(--accent-magenta)' : 'var(--border)'), opacity: customStep === 'cor' ? 1 : 0.4, transition: 'all 0.3s' }} />
              </div>

              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  {loadingVariacoes ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                       <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent-turquoise)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{dictionary?.postmatch?.step_10_loading_styles || 'Carregando estilos exclusivos...'}</p>
                    </motion.div>
                  ) : customStep === 'tipo' && (
                     <motion.div key="ctipo" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        {tipografias.length === 0 ? (
                          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', background: '#fff0f0', borderRadius: '12px', border: '1px solid #ffcccc' }}>
                            <p style={{ color: '#d32f2f', fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>{dictionary?.postmatch?.step_10_error_title || 'Ops! Não conseguimos carregar as tipografias.'}</p>
                            <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>{dictionary?.postmatch?.step_10_error_desc || 'Isso pode ser um erro de conexão temporário ou falta de dados para o estilo'} <strong>{resultadoFinal?.estiloNome}</strong>.</p>
                            <button onClick={fetchVariacoes} style={{ marginTop: '15px', padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>{dictionary?.postmatch?.step_10_btn_retry || 'Tentar carregar novamente'}</button>
                          </div>
                        ) : tipografias.map(t => {
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
                              <p style={{ fontFamily: `'${fontFamily}', serif`, fontWeight, fontSize: finalSize, textAlign: 'center', lineHeight: fontInfo?.lineHeight || 1.2, color: '#333', letterSpacing: extraSpacing }}>
                                {fontInfo?.featureSettings ? (
                                  <><span style={{ fontFeatureSettings: fontInfo.featureSettings }}>{displayName[0]}</span><span style={{ fontFeatureSettings: 'normal' }}>{displayName.slice(1)}</span></>
                                ) : displayName}
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
                     <motion.div key="cpaleta" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingBottom: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px' }}>
                          {paletas.map((p, pi) => {
                            const cores = p.paleta_hex || p.cores_hex || [];
                            const isSelected = selectedPaleta === p.id;
                            const isAiPalette = p.source === 'openai' || p.origem === 'OPENAI' || p.isAiGenerated;
                            const paletteLabel = isAiPalette
                              ? (dictionary?.postmatch?.creative_palette_suggested || 'Paleta sugerida {count}').replace('{count}', pi + 1)
                              : (dictionary?.postmatch?.creative_palette_curated || 'Paleta curada');
                            return (
                              <div key={p.id} onClick={() => { setSelectedPaleta(p.id); setTimeout(() => setCustomStep('cor'), 300); }} style={{
                                border: isSelected ? '2px solid var(--accent-magenta)' : '1px solid rgba(0,0,0,0.06)',
                                borderRadius: '18px', padding: '0', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'stretch',
                                background: '#fff',
                                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                boxShadow: isSelected ? '0 16px 34px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                transform: isSelected ? 'translateY(-2px) scale(1.015)' : 'translateY(0)',
                                minHeight: '158px',
                                outline: isSelected ? '3px solid rgba(217, 74, 138, 0.12)' : 'none'
                              }}>
                                {cores.length > 0 ? (
                                  <div title={cores.map(c => c.toUpperCase()).join(' · ')} style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: '100%' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cores.length}, minmax(0, 1fr))`, width: '100%', flex: 1, minHeight: '128px' }}>
                                      {cores.map((hex, ci) => (
                                        <div key={`${hex}-${ci}`} style={{
                                          backgroundColor: hex,
                                          minHeight: '128px'
                                        }} />
                                      ))}
                                    </div>
                                    <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                      <p style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: 0 }}>
                                        {paletteLabel}
                                      </p>
                                      {isSelected && <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--accent-magenta)', flexShrink: 0 }} />}
                                    </div>
                                  </div>
                                ) : (
                                  <img src={`${p.image_url}?t=${Date.now()}`} alt={p.nome_variacao} style={{ width: '100%', height: '158px', objectFit: 'cover' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Bloco de garantia de personalização + Chamada para o Consultor IA (Gemini) */}
                        <div style={{ marginTop: '6px', padding: '12px 14px', background: '#fafafa', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.7rem', color: '#777', lineHeight: 1.4, margin: 0 }}>
                            💡 {lang === 'en' 
                              ? 'These color palettes were curated for your project based on your unique answers, never randomly.' 
                              : 'Estas paletas foram criadas especialmente para o seu projeto com base nas suas respostas, nunca aleatoriamente.'}
                          </p>
                          <button 
                            onClick={() => {
                              setShowContext(true);
                              startCreativeRefinement();
                            }}
                            style={{ padding: '9px 15px', background: 'transparent', color: 'var(--accent-turquoise)', border: '1.5px solid var(--accent-turquoise)', borderRadius: '20px', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            ✨ {lang === 'en' ? 'Did not like any? Talk to AI Creative Director' : 'Não gostou de nenhuma? Consultar a Diretora IA'}
                          </button>
                        </div>
                     </motion.div>
                  )}

                  {customStep === 'cor' && (
                     <motion.div key="ccor" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px', paddingBottom: '2rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5 }}>
                          {dictionary?.postmatch?.step_10_color_desc || 'Essa cor será usada no logo, submarca e nos elementos de destaque da sua identidade visual.'}
                        </p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {(() => {
                            const isTooLight = (hexCode) => {
                              if (!hexCode) return false;
                              let c = hexCode.replace('#', '');
                              if (c.length === 3) c = c.split('').map(x => x + x).join('');
                              const rgb = parseInt(c, 16);
                              const r = (rgb >> 16) & 0xff;
                              const g = (rgb >>  8) & 0xff;
                              const b = (rgb >>  0) & 0xff;
                              const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                              return luma > 220; 
                            };
                            const sel = paletas.find(p => p.id === selectedPaleta);
                            console.log('🎯 Cor picker - selectedPaleta:', selectedPaleta, 'sel:', sel);
                            let cores = sel?.paleta_hex || sel?.cores_hex || [];
                            if (cores.length === 0) {
                              const qualquer = paletas.find(p => (p.paleta_hex?.length > 0) || (p.cores_hex?.length > 0));
                              cores = qualquer?.paleta_hex || qualquer?.cores_hex || [];
                            }
                            if (cores.length === 0) return <p style={{ color: '#999', fontSize: '0.8rem' }}>{dictionary?.postmatch?.step_10_no_color || 'Nenhuma cor encontrada.'}</p>;
                            return cores.map((hex, i) => {
                              const tooLight = isTooLight(hex);
                              return (
                                <div
                                  key={i}
                                  onClick={() => {
                                    if (!tooLight) {
                                      handlePrimaryColorSelect(hex, cores);
                                    } else {
                                      setAlertMessage(lang === 'en' ? 'This color is too light to be used as a highlight. Please choose a darker tone.' : 'Essa cor é muito clara para ser usada como destaque. Por favor, escolha um tom mais escuro.');
                                    }
                                  }}
                                  title={tooLight ? (dictionary?.postmatch?.color_too_light || 'Cor muito clara para destaque principal') : ''}
                                  
                                  // Versão Card Retangular (Nova)
                                  style={{
                                    width: 'calc(33.333% - 10px)', minWidth: '80px', height: '70px',
                                    borderRadius: '12px',
                                    backgroundColor: hex,
                                    cursor: tooLight ? 'not-allowed' : 'pointer',
                                    opacity: tooLight ? 0.3 : 1,
                                    border: editData.corAtiva === hex ? '3px solid #fff' : (tooLight ? '1px solid #ddd' : 'none'),
                                    boxShadow: editData.corAtiva === hex ? '0 0 0 3px var(--accent-magenta), 0 5px 15px rgba(0,0,0,0.2)' : '0 3px 8px rgba(0,0,0,0.1)',
                                    transform: editData.corAtiva === hex ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}

                                  /* Versão Bolinhas Orgânicas (Antiga - Salva para referência)
                                  style={{
                                    width: '45px', height: '45px',
                                    borderRadius: '50%',
                                    backgroundColor: hex,
                                    cursor: tooLight ? 'not-allowed' : 'pointer',
                                    opacity: tooLight ? 0.3 : 1,
                                    border: editData.corAtiva === hex ? '3px solid #fff' : (tooLight ? '1px solid #ddd' : 'none'),
                                    boxShadow: editData.corAtiva === hex ? '0 0 0 3px var(--accent-magenta), 0 5px 15px rgba(0,0,0,0.2)' : '0 3px 8px rgba(0,0,0,0.1)',
                                    transform: editData.corAtiva === hex ? 'scale(1.15)' : 'scale(1)',
                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}
                                  */
                                />
                              );
                            });
                          })()}
                        </div>
                        {editData.corAtiva && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {dictionary?.postmatch?.step_10_color_selected || 'Cor selecionada:'} <span style={{ color: editData.corAtiva, fontWeight: 800 }}>{editData.corAtiva}</span>
                          </p>
                        )}
                        {isPaletteFeedbackLoading && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                            {lang === 'en' ? 'The AI Creative Director is reading your palette...' : 'A AI Creative Director está lendo sua paleta...'}
                          </p>
                        )}
                        {paletteFeedback && !isPaletteFeedbackLoading && (
                          <div style={{ width: '100%', maxWidth: '420px', padding: '0.9rem 1rem', border: '1px solid var(--border)', borderRadius: '14px', background: '#fffafc', display: 'grid', gap: '0.45rem' }}>
                            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-magenta)' }}>
                              {lang === 'en' ? 'AI Creative Director' : 'AI Creative Director'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>{paletteFeedback.summary}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Strength:' : 'Ponto forte:'}</strong> {paletteFeedback.strength}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Attention:' : 'Atenção:'}</strong> {paletteFeedback.caution}</p>
                          </div>
                        )}
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                 {customStep === 'paleta' && <button onClick={() => setStep(9)} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, flex: '0 0 auto', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dictionary?.onboarding?.btn_back || 'Voltar'}</button>}
                 {customStep === 'cor' && <button onClick={() => setCustomStep('paleta')} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, flex: '0 0 auto', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dictionary?.onboarding?.btn_back || 'Voltar'}</button>}
                 <button onClick={() => setStep(11)} className="btn-primary" style={{ flex: 1, background: (selectedPaleta && editData.corAtiva) ? 'var(--accent-turquoise)' : '#cbd5e1', color: (selectedPaleta && editData.corAtiva) ? '#fff' : '#64748b', pointerEvents: (selectedPaleta && editData.corAtiva) ? 'auto' : 'none', padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', transition: 'all 0.2s ease' }}>{dictionary?.postmatch?.step_10_btn_next || (lang === 'en' ? 'Continue ✨' : 'Continuar ✨')}</button>
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
                 <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '2px' }}>{dictionary?.postmatch?.step_11_moodboard || 'Moodboard'}</p>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '1px' }}>{dictionary?.postmatch?.step_11_visual_universe || 'Universo Visual de'} {formData.marca}</p>
                 <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-magenta)' }}>{resultadoFinal?.estiloNome}</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#fafafa' }}>
                  {/* Nota sobre referências visuais */}
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '8px 15px', marginBottom: '5px' }}>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_11_references_note || '✨ As imagens abaixo são <strong>referências visuais</strong> que servirão de inspiração para criar a identidade da sua marca. Elas não farão parte do material final — são o ponto de partida do seu universo visual.' }}></p>
                  </div>

                  {/* Mosaico Pinterest Estilo Original */}
                  <div style={{ gridColumn: 'span 3', columnCount: 2, columnGap: '10px' }}>
                     {moodboards.filter(m => !m.image_url.includes('/icons/')).map(m => (
                        <div key={m.id} style={{ breakInside: 'avoid', marginBottom: '10px', width: '100%' }}>
                           <img src={`${m.image_url}?t=${Date.now()}`} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                        </div>
                     ))}
                  </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', gap: '10px' }}>
                 <button onClick={() => setStep(10)} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, flex: '0 0 auto', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dictionary?.onboarding?.btn_back || 'Voltar'}</button>
                 <button onClick={() => { setSelectedTagline(''); setCustomTagline(''); setStep(11.5); }} className="btn-primary" style={{ flex: 1, background: 'var(--accent-magenta)', color: 'var(--text-primary)' }}>{dictionary?.postmatch?.step_11_btn_tagline || 'Definir minha Tagline ✨'}</button>
              </div>
            </motion.div>
          )}

          {/* STEP 11.5: ESCOLHA SUA TAGLINE */}
          {step === 11.5 && (
            <motion.div
              key="step115" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', background: '#fff', zIndex: 10 }}>
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '4px' }}>{dictionary?.postmatch?.step_115_voice || 'Sua Voz de Marca'}</p>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>{dictionary?.postmatch?.step_115_title || 'Qual a sua tagline?'}</h2 >
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4, maxWidth: '480px', margin: '4px auto 0' }}>
                  {dictionary?.postmatch?.step_115_subtitle || 'Frase curta e memorável que captura a essência, o propósito e o posicionamento da sua marca.'}
                </p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    {dictionary?.postmatch?.step_115_suggestions || 'Sugestões para o estilo'} {resultadoFinal?.estiloNome}
                  </p>
                  {(resultadoFinal?.creativeDirector?.taglineSuggestions || resultadoFinal?.taglineSuggestions)?.language && (resultadoFinal?.creativeDirector?.taglineSuggestions || resultadoFinal?.taglineSuggestions).language !== lang && (
                    <button type="button" onClick={generateCreativeTaglines} disabled={isTaglineLoading || hasAiUsage('taglines')} className="btn-secondary" style={{ padding: '0.45rem 0.7rem', fontSize: '0.72rem', whiteSpace: 'nowrap', opacity: isTaglineLoading || hasAiUsage('taglines') ? 0.6 : 1 }}>
                      {isTaglineLoading
                        ? (dictionary?.postmatch?.step_115_regenerating || 'Gerando novamente em português...')
                        : (dictionary?.postmatch?.step_115_regenerate || 'Gerar novamente em português')}
                    </button>
                  )}
                </div>

                {isTaglineLoading && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '2px' }}>
                    {dictionary?.postmatch?.step_115_loading || 'Gerando sugestões personalizadas...'}
                  </p>
                )}

                {getVisibleTaglineSuggestions().map((opt) => (
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
                    {dictionary?.postmatch?.step_115_or_write || 'Ou escreva a sua'}
                  </p>
                  <textarea
                    placeholder={dictionary?.postmatch?.step_115_placeholder || "Ex: Cuidado que transforma vidas · Design com Propósito · Beleza Consciente"}
                    value={customTagline}
                    onChange={(e) => { setCustomTagline(e.target.value.slice(0, 45)); setSelectedTagline(''); }}
                    maxLength={45}
                    rows={2}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: customTagline ? '2px solid var(--accent-magenta)' : '1.5px solid var(--border)', fontSize: '0.95rem', resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                      {dictionary?.postmatch?.step_115_write_desc || 'Escreva sua especialidade ou uma frase de posicionamento curta.'}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: customTagline.length >= 40 ? 'var(--accent-magenta)' : 'var(--text-secondary)', fontWeight: customTagline.length >= 40 ? 600 : 400, marginLeft: '10px' }}>
                      {customTagline.length}/45
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setStep(11)} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, flex: '0 0 auto', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dictionary?.onboarding?.btn_back || 'Voltar'}</button>
                <button
                  onClick={() => {
                    const tagline = customTagline.trim() || selectedTagline;
                    setEditData(prev => ({ ...prev, tagline: tagline || 'Identidade Visual' }));
                    setStep(11.7);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, background: (selectedTagline || customTagline.trim()) ? 'var(--accent-magenta)' : '#ccc', pointerEvents: (selectedTagline || customTagline.trim()) ? 'auto' : 'none', padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}
                >
                  {dictionary?.postmatch?.step_115_btn_pattern || 'Criar Minha Estampa ✨'}
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
                <p onClick={handleDevTap} style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-magenta)', marginBottom: '8px', cursor: 'default', userSelect: 'none' }}>THE BRAND BOX</p>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{dictionary?.postmatch?.step_117_title || 'Sua Estampa Exclusiva'}</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                
                {/* Estado inicial: botão gerar */}
                {generatedPatterns.length === 0 && !patternLoading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
                      {dictionary?.postmatch?.step_117_magic || 'Agora a mágica acontece! ✨'}<br/>
                      <span style={{ fontSize: '0.8rem' }} dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_117_magic_desc || 'A <strong>The Brand Box</strong> vai criar uma estampa que traduz a essência da sua marca em cada detalhe.' }} />
                    </p>
                    {estampas.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {estampas.slice(0, 3).map(e => (
                          <img key={e.id} src={`${e.image_url}?t=1`} style={{ width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)', opacity: 0.7 }} />
                        ))}
                        <p style={{ width: '100%', textAlign: 'center', fontSize: '0.6rem', color: '#bbb', marginTop: '2px' }}>{dictionary?.postmatch?.step_117_references || 'Referências do seu universo visual'}</p>
                      </div>
                    )}
                    <button onClick={generatePatterns} className="btn-primary" style={{ background: 'var(--accent-turquoise)', padding: '12px 24px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>{dictionary?.postmatch?.step_117_btn_create || '✨ Criar Minha Estampa'}</button>
                    {devMode && (
                      <button onClick={() => setStep(12)} style={{ fontSize: '0.7rem', color: '#f90', background: '#1a1a1a', border: '1px solid #f90', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontWeight: 700 }}>
                        ⚡ DEV: Pular estampa
                      </button>
                    )}
                  </div>
                )}

                {/* Loading */}
                {patternLoading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid var(--border)', borderTop: '4px solid var(--accent-magenta)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{dictionary?.postmatch?.step_117_drawing || 'Desenhando com carinho...'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5, minHeight: '38px', transition: 'opacity 0.3s' }}>
                      <span dangerouslySetInnerHTML={{ __html: patternPhrases[patternPhraseIndex] }} />
                    </p>
                  </div>
                )}

                {/* Resultado: 2 cartões mockup */}
                {generatedPatterns.length > 0 && !patternLoading && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      {dictionary?.postmatch?.step_117_tap_card || 'Toque no cartão que mais combina com a sua marca'}
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
                          {p._devPlaceholder ? (
                            <div style={{ width: '100%', height: '100%', background: `hsl(${i * 60 + 200}, 30%, 85%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 700 }}>DEV PLACEHOLDER {i + 1}</span>
                            </div>
                          ) : (
                            <img src={`data:${p.mimeType};base64,${p.base64}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          )}
                          <div style={{
                            position: 'absolute', bottom: '15%', left: '6%', right: '6%',
                            background: 'rgba(255,255,255,0.92)', borderRadius: '6px',
                            padding: '10px 8px', textAlign: 'center',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {(() => {
                              const isScript = editData.fontStyle === 'script';
                              const raw = formData.marca || 'SUA MARCA';
                              const name = isScript 
                                ? raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                                : raw.toUpperCase();
                              const fontLineHeight = editData.fontFamily === 'Borel' ? 1.35 : (editData.fontLineHeight || 1.2);
                              return (
                                <p style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: editData.fontLetterSpacing || '1px', color: editData.corAtiva || '#333', lineHeight: fontLineHeight, fontFamily: editData.fontFamily ? `'${editData.fontFamily}', serif` : 'inherit', marginBottom: editData.fontFamily === 'Borel' ? '2px' : '0' }}>
                                  {editData.fontFeatureSettings ? (
                                    <><span style={{ fontFeatureSettings: editData.fontFeatureSettings }}>{name[0]}</span><span style={{ fontFeatureSettings: 'normal' }}>{name.slice(1)}</span></>
                                  ) : name}
                                </p>
                              );
                            })()}
                            <p style={{ fontSize: '0.36rem', color: '#736E6A', marginTop: editData.fontFamily === 'Borel' ? '6px' : '4px', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1.3, maxWidth: '100%', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
                              {editData.tagline || ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={generatePatterns} style={{ fontSize: '0.75rem', color: 'var(--accent-magenta)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>{dictionary?.postmatch?.step_117_btn_regenerate || '🔄 Gerar novas opções'}</button>
                  </>
                )}
              </div>

              <div style={{ padding: '1.2rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setStep(11.5)} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, flex: '0 0 auto', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dictionary?.onboarding?.btn_back || 'Voltar'}</button>
                <button 
                  onClick={() => setStep(12)} 
                  className="btn-primary" 
                  style={{ flex: 1, background: selectedPattern !== null ? 'var(--accent-turquoise)' : '#cbd5e1', color: selectedPattern !== null ? '#fff' : '#64748b', pointerEvents: selectedPattern !== null ? 'auto' : 'none', padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', transition: 'all 0.2s ease' }}
                >{dictionary?.postmatch?.step_117_btn_board || 'Ver Minha Placa ✨'}</button>
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
                <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '4px' }}>{dictionary?.postmatch?.step_12_subtitle || 'Identidade Visual'}</p>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{dictionary?.postmatch?.step_12_title || 'Sua Placa da Marca'}</h2>
              </div>

              <div className="brand-board-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px' }}>
                <div ref={brandBoardRef} className="brand-board-wrapper">
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
                    patternImage={selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder ? `data:${generatedPatterns[selectedPattern].mimeType};base64,${generatedPatterns[selectedPattern].base64}` : null}
                    iconPath={getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null}
                  />
                </div>
              </div>

              {/* Seletor de cor ao vivo */}
              <div style={{ padding: '10px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap' }}>{dictionary?.postmatch?.step_12_main_color || 'Cor Principal:'}</p>
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
                        transform: editData.corAtiva === hex ? 'scale(1.2)' : 'scale(1)',
                        flexShrink: 0
                      }}
                    />
                  ));
                })()}
              </div>

              {/* Seletor de ícone da submarca */}
              {(() => {
                const styleIcons = STYLE_ICONS[ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome] || [];
                if (styleIcons.length === 0) return null;
                const activeColor = editData.corAtiva || '#d22f5a';
                return (
                  <div style={{ padding: '10px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap' }}>{dictionary?.postmatch?.step_12_icon || 'Ícone:'}</p>
                    {/* opção nenhum */}
                    <div
                      onClick={() => setSelectedIcon(null)}
                      title="Nenhum"
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer',
                        background: selectedIcon === null ? activeColor : '#f5f5f5',
                        border: selectedIcon === null ? `3px solid #333` : '2px solid #ddd',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease', flexShrink: 0,
                        fontSize: '0.55rem', color: selectedIcon === null ? '#fff' : '#aaa', fontWeight: 700, letterSpacing: '0.5px'
                      }}
                    >—</div>
                    {styleIcons.slice(0, 5).map(icon => (
                      <div
                        key={icon.id}
                        onClick={() => setSelectedIcon(icon.id)}
                        title={icon.label}
                        style={{
                          width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer',
                          background: selectedIcon === icon.id ? activeColor : '#f5f5f5',
                          border: selectedIcon === icon.id ? '3px solid #333' : '2px solid #ddd',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s ease', flexShrink: 0,
                          transform: selectedIcon === icon.id ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: selectedIcon === icon.id ? '0 0 0 1px #333' : 'none'
                        }}
                      >
                        <img src={icon.path} alt={icon.label}
                          style={{ width: '22px', height: '22px', objectFit: 'contain',
                            filter: selectedIcon === icon.id ? 'brightness(0) invert(1)' : 'none' }} />
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div style={{ padding: '1.2rem', background: '#fff', borderTop: '1px solid var(--border)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <button onClick={() => { setApprovalChecked(false); setStep(12.8); }} className="btn-primary" style={{ width: '100%', background: 'var(--accent-magenta)', padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>{dictionary?.postmatch?.step_12_btn_packages || 'Ver pacotes disponíveis ✨'}</button>
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
                  <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '3px', fontWeight: 600, marginBottom: '0.5rem' }}>{dictionary?.postmatch?.step_128_before_continue || 'antes de continuar'}</p>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{dictionary?.postmatch?.step_128_confirm_identity || 'Confirme sua identidade visual'}</h2>
                </div>

                {/* Resumo do que foi criado */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.75rem' }}>{dictionary?.postmatch?.step_128_your_brand || 'Sua marca'}</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{formData.marca || 'Sua Marca'}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dictionary?.postmatch?.step_128_style || 'Estilo:'} <strong>{resultadoFinal?.estiloNome || '—'}</strong></p>
                  {editData.tagline ? <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{dictionary?.postmatch?.step_128_tagline || 'Tagline:'} <strong>{editData.tagline}</strong></p> : null}
                  {editData.corAtiva ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: editData.corAtiva, border: '1px solid #ddd' }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{dictionary?.postmatch?.step_128_main_color || 'Cor principal:'} <strong>{editData.corAtiva}</strong></span>
                    </div>
                  ) : null}
                </div>

                {/* Aviso importante */}
                <div style={{ background: '#fff8f0', borderRadius: '14px', padding: '1rem 1.2rem', border: '1px solid #f5d9b8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p 
                    style={{ fontSize: '0.82rem', color: '#7a4a1e', lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_128_attention || '⚠️ <strong>Atenção:</strong> o modelo visual acima foi gerado com base nas suas respostas. Ao prosseguir, você confirma que aprova esta base como ponto de partida para a sua marca.' }}
                  />
                  <p 
                    style={{ fontSize: '0.78rem', color: '#7a4a1e', opacity: 0.85, lineHeight: 1.5, borderTop: '1px dashed #ebd2b8', paddingTop: '8px' }}
                    dangerouslySetInnerHTML={{ __html: dictionary?.postmatch?.step_128_dont_worry || '💡 <strong>O que acontece agora?</strong> Após o pagamento, você terá acesso imediato à nossa plataforma de personalização. Nela, você poderá editar a sua marca e visualizar todas as aplicações e estampas em tempo real, sempre que quiser!' }}
                  />
                  <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f5d9b8', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <img src="/img/plataforma_mockup.jpg" alt="Plataforma de Edição BrandBox" style={{ width: '100%', display: 'block', height: 'auto' }} />
                  </div>
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
                    {dictionary?.postmatch?.step_128_approval || 'Aprovo o modelo gerado e entendo que os próximos passos dependem do plano escolhido.'}
                  </span>
                </label>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => setStep(13)}
                    disabled={!approvalChecked}
                    className="btn-primary"
                    style={{ width: '100%', background: approvalChecked ? 'var(--accent-magenta)' : '#ccc', pointerEvents: approvalChecked ? 'auto' : 'none', padding: '12px 20px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 600, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', transition: 'background 0.2s' }}
                  >
                    {dictionary?.postmatch?.step_128_btn_choose_plan || 'Escolher meu plano ✨'}
                  </button>
                  <button onClick={() => setStep(12)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'center' }}>
                    {dictionary?.postmatch?.step_128_btn_back || '← Voltar e ajustar'}
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
                  <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '0.5rem' }}>{dictionary?.checkout?.header_pretitle || 'Clareza criativa, mesmo para quem nunca criou uma marca antes.'}</p>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{dictionary?.checkout?.header_title ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.header_title }} /> : <>Escolha a experiência ideal para sua marca.<br/>Do essencial ao extraordinário.</>}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{dictionary?.checkout?.header_subtitle || 'Sua identidade visual está pronta para deixar de ser ideia e começar a existir de verdade.'}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* PLANO 1 — Experience (Oculto no DEMO) */}
                  {!isDemoMode && (
                    <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}>{dictionary?.checkout?.plan_essence_title || 'ESSENCE'}</h3>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.3rem', whiteSpace: 'nowrap' }}>{lang === 'en' ? '$ 98' : 'R$ 497'}</span>
                    </div>
                    <span style={{ display: 'inline-block', background: '#e8f7f5', color: '#1a7a6e', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', letterSpacing: '0.5px', marginBottom: '10px' }}>{dictionary?.checkout?.plan_essence_badge || 'Sua marca completa'}</span>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {(dictionary?.checkout?.plan_essence_features || ['Logo tipográfica + variações', 'Estampa exclusiva da marca', 'Manifesto e Tom de Voz', 'Paleta de cores + tipografia', 'Guia da Marca completo (PDF)']).map(i => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: 'var(--accent-turquoise)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✔</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ background: '#f7f9ff', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.8rem', color: '#3a5a8a', lineHeight: 1.5 }}>
                      {dictionary?.checkout?.plan_essence_highlight || '✨ O essencial para começar sua marca'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#888', background: '#fafafa', borderRadius: '8px', padding: '8px 10px', marginBottom: '12px', border: '1px solid #eee', lineHeight: 1.4 }}>
                      <span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.plan_essence_warning || '⚠️ <strong>Aviso:</strong> Este plano é focado em design tipográfico moderno e estampa geométrica/abstrata do sistema. Não inclui ilustrações exclusivas personalizadas, logomarcas desenhadas à mão ou padrões ilustrados de rodapé.' }} />
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ width: '100%', padding: '12px', fontSize: '0.9rem', position: 'relative' }}
                      disabled={loadingCheckout}
                      onClick={async (e) => {
                        setLoadingCheckout('starter');
                        console.log('🚀 Iniciando checkout Starter...');
                        try {
                          const patternObj = selectedPattern !== null && generatedPatterns[selectedPattern] && !generatedPatterns[selectedPattern]._devPlaceholder
                            ? { mimeType: generatedPatterns[selectedPattern].mimeType, base64: generatedPatterns[selectedPattern].base64 }
                            : null;

                          const brandState = {
                            editData, formData, resultadoFinal,
                            selectedPaleta, selectedIcon, selectedTipo,
                            paletas, tipografias,
                            activeColor: editData.corAtiva,
                            pattern: patternObj,
                            iconPath: getIconById(ESTILO_NOME_BY_ID[resultadoFinal?.estiloId] || resultadoFinal?.estiloNome, selectedIcon)?.path || null,
                            patternGenerationCount,
                            estampas,
                          };

                          ['brandbox_step', 'brandbox_cartao', 'brandbox_crm', 'brandbox_plano', 'brandbox_papelaria'].forEach(k => localStorage.removeItem(k));

                          // Salvar no Supabase para link permanente + disparo de email
                          let sessionIdExp = null;
                          try {
                            const existingSessionId = typeof window !== 'undefined' ? localStorage.getItem('brandbox_session') : null;
                            const cleanState = { ...brandState, estampas: null, generatedPatterns: null };
                            cleanState.pattern = null; // Save pattern as null initially, will upload after we have sessionId
                            const saveRes = await fetch('/api/salvar-entrega', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ brandState: cleanState, plano: 'starter', email: formData.email, marca: formData.marca, sessionId: existingSessionId || undefined }),
                            });
                            const saveData = await saveRes.json();
                            if (saveData.sessionId) {
                              sessionIdExp = saveData.sessionId;
                              localStorage.setItem('brandbox_session', sessionIdExp);
                            }
                          } catch (e) {
                            console.warn('Supabase save failed, continuando sem sessionId:', e);
                          }

                          let finalPatternUrl = null;
                          if (patternObj && sessionIdExp) {
                            try {
                              const uploadRes = await fetch('/api/salvar-estampa', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ base64: patternObj.base64, marca: formData.marca, sessionId: sessionIdExp })
                              });
                              const uploadData = await uploadRes.json();
                              if (uploadData.url) finalPatternUrl = uploadData.url;
                            } catch (e) { console.warn('Pattern upload error:', e); }
                          }

                          if (brandState.pattern && !finalPatternUrl) try { localStorage.setItem('brandbox_pattern', JSON.stringify(brandState.pattern)); } catch {}
                          try { localStorage.setItem('brandbox_delivery', JSON.stringify({ ...brandState, pattern: finalPatternUrl ? { url: finalPatternUrl } : null })); } catch {}

                          // DEMO mode: pula o Stripe e vai direto para a experiência mock com os DADOS REAIS GERADOS
                          if (typeof window !== 'undefined' && localStorage.getItem('brandbox_demo_mode') === 'BUILDWEEK100') {
                            window.location.href = `/${lang}/sucesso?demo=1&plano=pro&lang=${lang}`;
                            return;
                          }

                          const res = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plano: 'starter', marca: formData.marca, email: formData.email, sessionId: sessionIdExp, lang }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            console.error('Checkout error:', data.error);
                            setAlertMessage('Houve um problema ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
                            setLoadingCheckout(false);
                          }
                        } catch (err) {
                          console.error('Checkout error:', err);
                          setLoadingCheckout(false);
                        }
                      }}
                    >
                      {loadingCheckout === 'starter' ? (dictionary?.checkout?.btn_processing || 'Processando...') : (dictionary?.checkout?.plan_essence_btn || 'Começar minha marca')}
                    </button>
                  </motion.div>
                  )}


                  {/* PLANO 2 — Complete (DESTAQUE) */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: 'var(--accent-turquoise)', borderRadius: '16px', padding: '20px', color: 'var(--text-primary)', boxShadow: '0 8px 30px rgba(198,176,152,0.3)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.4)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-primary)' }}>{dictionary?.checkout?.plan_studio_badge || 'MAIS ESCOLHIDO'}</div>
                    <div style={{ marginBottom: '8px', paddingRight: '90px' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-primary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}>{dictionary?.checkout?.plan_studio_title || 'STUDIO'}</h3>
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.4)', color: 'var(--text-primary)', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', letterSpacing: '0.5px', marginBottom: '10px' }}>{dictionary?.checkout?.plan_studio_subbadge || 'Marca + Digital + Impressos'}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.4rem', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>
                      {lang === 'en' ? '$' : 'R$'} {(() => {
                        const isEn = lang === 'en';
                        const basePrice = isEn ? 173.76 : 897;
                        const extraPrice = isEn ? 7 : 30;
                        const cadernetaPrice = isEn ? 35 : 180;
                        
                        const temCaderneta = papelariaSelecionada.includes("Caderneta de Saúde");
                        const itensNormais = papelariaSelecionada.filter(item => item !== "Caderneta de Saúde");
                        const extrasCount = Math.max(0, itensNormais.length - 5);
                        
                        const total = basePrice + (extrasCount * extraPrice) + (temCaderneta ? cadernetaPrice : 0);
                        return isEn ? total.toFixed(2) : total;
                      })()}
                      {(papelariaSelecionada.filter(item => item !== "Caderneta de Saúde").length > 5 || papelariaSelecionada.includes("Caderneta de Saúde")) && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700, marginLeft: '8px' }}>{dictionary?.checkout?.plan_studio_adicionais || '(+ adicionais)'}</span>
                      )}
                    </span>
                    <ul style={{ fontSize: '0.85rem', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {(dictionary?.checkout?.plan_studio_features || ['Tudo do Brand Box Starter', 'PAPELARIA', 'Pack completo para Instagram', 'Cartão Digital + Assinatura de E-mail']).map(i => {
                        const isPapelaria = i === 'PAPELARIA' || i === 'STATIONERY';
                        const text = isPapelaria ? (papelariaSelecionada.length > 0 ? (dictionary?.checkout?.plan_studio_bonus_selected?.replace('{count}', papelariaSelecionada.length) || `${papelariaSelecionada.length} itens impressos marcados`) : (dictionary?.checkout?.plan_studio_bonus_unselected || '5 Itens impressos à escolha')) : i;
                        return (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)' }}>
                            {!text.startsWith('✨') && <span style={{ color: 'var(--text-primary)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✔</span>}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', flex: 1 }}>
                              <span>{text}</span>
                              {isPapelaria && (
                                <button onClick={() => setShowPediatriaModal(true)} style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-primary)', border: 'none', padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>
                                  {dictionary?.checkout?.plan_studio_btn_bonus || '👀 Selecionar itens'}
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {dictionary?.checkout?.plan_studio_highlight || '✨ Sua marca pronta para o mundo'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', padding: '8px 10px', marginBottom: '12px', border: 'none', lineHeight: 1.4 }}>
                      <span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.plan_studio_warning || '⚠️ <strong>Aviso:</strong> Este plano é focado em layouts digitais e estruturação moderna de papelaria. Não inclui desenhos/ilustrações de rodapé sob medida, nem logotipos ilustrados à mão (estas opções de arte exclusiva podem ser solicitadas pós-checkout ou contratando o plano <em>Signature</em>).' }} />
                    </div>
                    <button
                      className="btn-primary"
                      style={{ width: '100%', padding: '12px', background: 'var(--accent-magenta)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', position: 'relative' }}
                      disabled={loadingCheckout}
                      onClick={(e) => {
                        if (papelariaSelecionada.length === 0) {
                          setShowPediatriaModal(true);
                          return;
                        }
                        handleCheckoutPro();
                      }}
                    >
                      {loadingCheckout === 'pro' ? (dictionary?.checkout?.btn_processing || 'Processando...') : (dictionary?.checkout?.plan_studio_btn || 'Quero minha marca completa')}
                    </button>
                  </motion.div>

                  {/* PLANO 3 — Signature */}
                  <motion.div whileHover={{ scale: 1.01 }} style={{ background: '#1a1a1a', borderRadius: '16px', padding: '20px', border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>brand box</p>
                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{dictionary?.checkout?.plan_sig_title || 'SIGNATURE'}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>{dictionary?.checkout?.plan_sig_badge || '✨ Uma experiência exclusiva criada junto com uma designer'}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', opacity: 0.8 }}>{dictionary?.checkout?.plan_sig_price ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.plan_sig_price }} /> : <>A partir de<br/>R$ 2.900</>}</span>
                    </div>
                    <ul style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none' }}>
                      {(dictionary?.checkout?.plan_sig_features || [
                        'Direção criativa personalizada',
                        'Ajustes e refinamentos manuais ilimitados',
                        'Logotipo ilustrado ou símbolo desenhado sob medida',
                        'Desenhos e ilustrações unificadoras exclusivas (ex: detalhes de rodapé para impressos)',
                        'Aplicações exclusivas sob medida para sua atuação',
                        'Acompanhamento próximo pelo WhatsApp'
                      ]).map(i => <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✔</span><span>{i}</span></li>)}
                    </ul>
                    <a
                      href={`https://wa.me/4793630746?text=${encodeURIComponent(dictionary?.checkout?.plan_sig_msg?.replace('{marca}', formData.marca) || `Olá! Quero saber mais sobre o Brand Box Signature para a marca ${formData.marca || ''}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px', textAlign: 'center', textDecoration: 'none' }}
                    >
                      {dictionary?.checkout?.plan_sig_btn || 'Falar no WhatsApp'}
                    </a>
                  </motion.div>

                  {/* Micro copy final */}
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '0.5rem 1rem 0.5rem', lineHeight: 1.6 }}>{dictionary?.checkout?.footer_msg ? <span dangerouslySetInnerHTML={{ __html: dictionary.checkout.footer_msg }} /> : <>Não precisa saber por onde começar.<br/>Eu te guio em cada etapa.</>}</p>

                  <button
                    onClick={() => {
                      localStorage.removeItem('brandbox_progress');
                      setStep(1);
                      setFormData({ nome: '', email: '', marca: '', atuacao: '', atuacaoOutra: '', contextoExtra: '', publico: '', sentimentos: [], elementosVisuais: [], personalidade: '', primeiraImpressao: '', locais: [], inspiracoes: '', nuncaPensar: '', nuncaPensarTags: [] });
                      setShowContext(false);
                      setResultadoFinal(null);
                      setSelectedTagline('');
                      setCustomTagline('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', paddingBottom: '1.5rem' }}
                  >
                    {dictionary?.checkout?.footer_btn_restart || 'Recomeçar do zero'}
                  </button>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* MODAL DE RETOMADA DE SESSÃO */}
        <AnimatePresence>
          {showResumePrompt && savedProgress && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
              >
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</p>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{dictionary?.onboarding?.resume_title || 'Você tem um progresso salvo!'}</h3>
                {savedProgress.formData?.marca && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-magenta)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {savedProgress.formData.marca}
                  </p>
                )}
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                  {dictionary?.onboarding?.resume_subtitle || 'Quer continuar de onde parou ou começar uma nova marca?'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => { restoreProgress(savedProgress); setShowResumePrompt(false); }}
                    className="btn-primary"
                    style={{ width: '100%', background: 'var(--accent-turquoise)' }}
                  >
                    {dictionary?.onboarding?.resume_btn_continue || 'Continuar de onde parei'}
                  </button>
                  <button
                    onClick={() => {
                      // Limpeza total de qualquer rastro de projetos anteriores
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('brandbox_')) localStorage.removeItem(key);
                      });
                      setShowResumePrompt(false);
                      setSavedProgress(null);
                      window.location.reload(); // Recarrega para garantir estado limpo
                    }}
                    className="btn-secondary"
                    style={{ width: '100%' }}
                  >
                    {dictionary?.onboarding?.resume_btn_restart || 'Começar do zero'}
                  </button>
                </div>
              </motion.div>
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
                          <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{dictionary?.checkout?.modal_bonus_title || 'Bônus: Seus Impressos'}</h2>
                          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{dictionary?.checkout?.modal_bonus_subtitle || 'Escolha seus 5 impressos gratuitos. Itens adicionais saem por R$30 cada!'}</p>
                       </div>
                       <button onClick={() => setShowPediatriaModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                    </div>

                    <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', background: '#fcfcfc' }}>
                       {(isSaude ? PAPELARIA_CLINICA : PAPELARIA_INSTITUCIONAL).map(item => {
                          const selecionado = papelariaSelecionada.includes(item);
                          const isCaderneta = item === "Caderneta de Saúde";
                          const cardStyle = isCaderneta
                            ? {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '8px',
                                padding: '16px',
                                background: selecionado ? 'linear-gradient(135deg, #fffcf0 0%, #fff6d6 100%)' : '#fff',
                                border: `2px solid ${selecionado ? '#e6af2e' : '#f0d38d'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                boxShadow: selecionado ? '0 4px 15px rgba(230,175,46,0.2)' : '0 2px 5px rgba(0,0,0,0.02)',
                                position: 'relative',
                                overflow: 'hidden',
                                gridColumn: '1 / -1'
                              }
                            : {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px',
                                background: selecionado ? '#f1f5f9' : '#fff',
                                border: `1px solid ${selecionado ? 'var(--accent-magenta)' : 'var(--border)'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                boxShadow: selecionado ? '0 2px 8px rgba(195,206,219,0.4)' : '0 2px 5px rgba(0,0,0,0.02)'
                              };
                          return (
                            <label key={item} style={cardStyle}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                                  <input type="checkbox" checked={selecionado} onChange={(e) => {
                                    if (e.target.checked) setPapelariaSelecionada([...papelariaSelecionada, item]);
                                    else setPapelariaSelecionada(papelariaSelecionada.filter(i => i !== item));
                                  }} style={{ width: '18px', height: '18px', accentColor: isCaderneta ? '#e6af2e' : 'var(--accent-magenta)' }} />
                                  <span style={{ fontWeight: isCaderneta ? 700 : 500, color: isCaderneta ? '#5c4308' : 'inherit' }}>{dictionary?.papelaria?.[item] || item}</span>
                                  {isCaderneta && (
                                    <span style={{ marginLeft: 'auto', background: 'linear-gradient(90deg, #e6af2e, #ffda73)', color: '#3a2700', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                      {dictionary?.checkout?.modal_bonus_premium || '👑 PREMIUM — 124 Págs'}
                                    </span>
                                  )}
                               </div>
                               {isCaderneta && (
                                 <div style={{ paddingLeft: '28px', fontSize: '0.78rem', color: '#7a5e1d', lineHeight: 1.4, textAlign: 'left' }}>
                                   <span dangerouslySetInnerHTML={{ __html: dictionary?.checkout?.modal_bonus_premium_info || 'Adicional exclusivo: <strong>+R$ 180,00</strong>. Ideal para acompanhamento completo do bebê. <em>Não consome os 5 bônus grátis!</em>' }} />
                                 </div>
                               )}
                            </label>
                          );
                       })}
                    </div>

                    <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                       <div style={{ textAlign: 'left' }}>
                         {(() => {
                            const temCaderneta = papelariaSelecionada.includes("Caderneta de Saúde");
                            const itensNormais = papelariaSelecionada.filter(item => item !== "Caderneta de Saúde");
                            const extrasCount = Math.max(0, itensNormais.length - 5);
                            return (
                              <>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {dictionary?.checkout?.modal_bonus_selected?.replace('{count}', itensNormais.length)?.replace('{premium_text}', temCaderneta ? (dictionary?.checkout?.modal_bonus_premium_text || '(+ 1 Item Premium)') : '') || `Selecionados: ${itensNormais.length} de 5 grátis ${temCaderneta ? ' (+ 1 Item Premium)' : ''}`}
                                </span>
                                {(extrasCount > 0 || temCaderneta) && (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-magenta)', fontWeight: 700, marginTop: '2px' }}>
                                    {extrasCount > 0 && (dictionary?.checkout?.modal_bonus_extra?.replace('{count}', extrasCount)?.replace('{price}', extrasCount * 30) || `+${extrasCount} extra(s) (+R$ ${extrasCount * 30})`)}
                                    {extrasCount > 0 && temCaderneta && (dictionary?.checkout?.modal_bonus_and || ' e ')}
                                    {temCaderneta && (dictionary?.checkout?.modal_bonus_premium_price || '+1 Item Premium (+R$ 180)')}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                         <button onClick={() => {
                           const lista = isSaude ? PAPELARIA_CLINICA : PAPELARIA_INSTITUCIONAL;
                           const todos = lista.length === papelariaSelecionada.length;
                           setPapelariaSelecionada(todos ? [] : [...lista]);
                         }} style={{ display: 'block', marginTop: '4px', background: 'none', border: 'none', color: 'var(--accent-magenta)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                           {(isSaude ? PAPELARIA_CLINICA : PAPELARIA_INSTITUCIONAL).length === papelariaSelecionada.length ? (dictionary?.checkout?.modal_bonus_uncheck_all || 'Desmarcar todos') : (dictionary?.checkout?.modal_bonus_check_all || 'Marcar todos')}
                         </button>
                       </div>
                       <button onClick={() => handleCheckoutPro()} className="btn-primary" style={{ background: 'var(--accent-magenta)', width: '270px' }}>{dictionary?.checkout?.modal_bonus_btn_save || 'Salvar e Ir para o Pagamento ✨'}</button>
                    </div>

                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Custom Alert Modal */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(54, 53, 50, 0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px'
              }}
              onClick={() => setAlertMessage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '30px',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  fontFamily: 'Montserrat, sans-serif'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>✨</div>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  marginBottom: '24px'
                }}>
                  {alertMessage}
                </p>
                <button
                  onClick={() => setAlertMessage(null)}
                  style={{
                    background: 'var(--text-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '12px 30px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(54, 53, 50, 0.2)',
                    transition: 'transform 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
