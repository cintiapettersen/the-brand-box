"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtelierSecreto() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagemAtiva, setImagemAtiva] = useState(null); // String base64
  const [diretrizEstilo, setDiretrizEstilo] = useState('Doce Encantamento');
  const [imagemRef, setImagemRef] = useState(null);
  const [previewRef, setPreviewRef] = useState(null);

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
       setImagemRef(null);
       setPreviewRef(null);
       return;
    }
    setPreviewRef(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (event) => {
        // Array destrunction pra separar cabeçalho do base64 limpo
        const baseCru = event.target.result.split(',')[1];
        setImagemRef(baseCru);
    };
    reader.readAsDataURL(file);
  };

  const estilosPreset = [
    { nome: 'Doce Encantamento', prefixo: "Cute naive classic children's book illustration style, hand-drawn colored pencil texture, rough sketchy crayon strokes, adorable proportions with big eyes, flat warm colors, isolated on solid white background, " },
    { nome: 'Jardim Encantado', prefixo: "Playful modern children's illustration, bold joyful colors, simple clean lines, contemporary scandinavian-inspired kids design, cheerful organic shapes, confetti and rainbow motifs, bright but balanced palette of pink yellow blue and red, white background, fun but not chaotic, " },
    { nome: 'Escandinavo', prefixo: "Minimal scandinavian children's illustration, very thin delicate line art, cute simple animals like bears rabbits and geese, soft muted palette of beige off-white light gray sage green and dusty blue, lots of white space and breathing room, gentle repetitive patterns, clean editorial nursery design aesthetic, calming and gender-neutral, white background, " },
    { nome: 'Essência Atemporal', prefixo: 'Elegant minimalistic sophisticated organic abstract illustration, premium clean vector art style, neutral muted tones with soft terracotta and blush accents, white background, extremely professional and modern, calm feminine adult aesthetic, ' },
    { nome: 'Raízes & Cuidado', prefixo: "Organic artisanal illustrated style, hand-drawn botanical elements with natural textures like recycled paper watercolor and ink, soft greens and earth tones, imperfect organic shapes, mix of illustration with graphic composition, contemporary eco-friendly aesthetic, white background, " },
    { nome: 'Estético Editorial', prefixo: "Clean sophisticated premium clinical brand illustration, minimal organic geometric shapes, neutral warm tones of beige off-white gray and muted terracotta, very professional and institutional yet warm, editorial aesthetic with lots of white space, elegant and trustworthy without being cold, white background, " }
  ];

  const handleGerar = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setImagemAtiva(null);

    const estiloSelecionado = estilosPreset.find(e => e.nome === diretrizEstilo);
    const promptCompleto = estiloSelecionado.prefixo + prompt;

    try {
      const response = await fetch('/api/atelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptCompleto, imagemRef: imagemRef })
      });

      const data = await response.json();

      if (data.success) {
        if (data.alertaDemo) { alert("🚨 AVISO DO SISTEMA:\n\n" + data.alertaDemo); }
        setImagemAtiva(data.base64);
      } else {
        alert("Erro na geração: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("A conexão com a nuvem mágica caiu.");
    } finally {
      setLoading(false);
    }
  };

  const handleBaixar = () => {
    if (!imagemAtiva) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imagemAtiva}`;
    // O nome padrão que o Illustrator vai tentar importar!
    link.download = `atelier_arte_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0b', color: '#f5f5f5', padding: '3rem', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #222', paddingBottom: '1.5rem' }}>
        <div>
           <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Sonho de Papel</p>
           <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#fff' }}>O Ateliê da Diretora</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.8rem' }}>🔵 Nuvem Conectada</div>
           <div style={{ padding: '8px 16px', background: 'rgba(0,255,150,0.1)', color: '#00ff96', borderRadius: '20px', fontSize: '0.8rem' }}>Modelo: Gemini Imagen 3</div>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Lado Esquerdo: Mesa de Comando */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           <div>
             <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 400 }}>1. Matriz de Estilo Mestre</h2>
             <div style={{ display: 'flex', gap: '10px' }}>
                {estilosPreset.map(e => (
                   <button 
                      key={e.nome}
                      onClick={() => setDiretrizEstilo(e.nome)}
                      style={{ padding: '10px 15px', borderRadius: '8px', background: diretrizEstilo === e.nome ? '#fff' : '#111', color: diretrizEstilo === e.nome ? '#000' : '#888', border: '1px solid #333', cursor: 'pointer', transition: 'all 0.3s' }}
                   >
                     {e.nome}
                   </button>
                ))}
             </div>
           </div>

           <div>
             <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 400 }}>2. Ordem de Criação</h2>
             <textarea 
               value={prompt}
               onChange={e => setPrompt(e.target.value)}
               placeholder="Ex: Uma raposinha dormindo em cima de uma lua encantada com flores ao redor..."
               style={{ width: '100%', height: '150px', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '1rem', color: '#fff', fontSize: '1rem', resize: 'none', outline: 'none' }}
             />
           </div>

           <div>
             <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 400 }}>3. Referência de Estilo (Opcional)</h2>
             <div style={{ background: '#111', border: '1px dashed #444', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleFotoUpload}
                   style={{ color: '#aaa', flex: 1, fontSize: '0.9rem' }}
                />
                {previewRef && (
                   <img src={previewRef} alt="Referência" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
                )}
             </div>
           </div>

           <button 
              onClick={handleGerar}
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: loading ? '#333' : 'linear-gradient(90deg, #ff007f, #7f00ff)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}
           >
             {loading ? 'Sintetizando Arte...' : 'Criar Ilustração Mágica ✨'}
           </button>
        </section>

        {/* Lado Direito: A Prancheta */}
        <section style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
           <AnimatePresence mode="wait">
             {!imagemAtiva && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', color: '#555' }}>
                   <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</p>
                   <p>Sua tela em branco aguarda.</p>
                </motion.div>
             )}

             {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', color: '#fff' }}>
                   <div style={{ width: '50px', height: '50px', border: '3px solid #333', borderTopColor: '#ff007f', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
                   <p>Aguarde... o pincel digital está correndo solto.</p>
                   <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </motion.div>
             )}

             {imagemAtiva && !loading && (
                <motion.div key="arte" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <img 
                      src={`data:image/jpeg;base64,${imagemAtiva}`} 
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1.5rem', background: '#fff' }} 
                      alt="Arte Gerada" 
                   />
                   <button 
                      onClick={handleBaixar}
                      style={{ width: '100%', padding: '1rem', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                   >
                     👇 Download Automático para o Illustrator
                   </button>
                </motion.div>
             )}
           </AnimatePresence>
        </section>

      </main>
    </div>
  );
}
