import React from 'react';
import BrandTemplateSVG from '../BrandTemplateSVG';
import { STYLE_ICONS } from '../../lib/styleIcons';

/**
 * SubmarkSealStep
 * 
 * Exibe a escolha de submarca e selo oficial com:
 * 1. 3 opções curadas do banco no estilo da marca aplicadas dentro do selo circular real.
 * 2. Seção opcional para gerar 3 novas opções com IA (com controle de limites e telemetria).
 * 3. Apresentação em cards elevados com feedback visual consistente do Design System.
 */
const SubmarkSealStep = ({
  formData = {},
  editData = {},
  activeColor = '#2A897F',
  estiloNome = 'Essência Atemporal',
  curatedIcons = [],
  generatedElements = [],
  selectedIconId = null,
  selectedElementId = null,
  onSelectCurated,
  onSelectGenerated,
  onGenerateAi,
  isAiLoading = false,
  aiRoundsUsed = 0,
  maxPrePaymentRounds = 1,
  hasPattern = true,
  onBackToPattern,
  dictionary = {}
}) => {
  const d = dictionary?.postmatch || {};

  // Resolve as 3 melhores opções curadas para o estilo
  const availableCurated = (curatedIcons && curatedIcons.length > 0)
    ? curatedIcons.slice(0, 3)
    : (STYLE_ICONS[estiloNome] || STYLE_ICONS['Essência Atemporal'] || []).slice(0, 3);

  const brandDataForSeal = {
    ...formData,
    ...editData,
    marca: formData?.marca || editData?.marca || 'Sua Marca',
    tagline: formData?.tagline || editData?.tagline || 'Identidade Visual',
    fontFamily: editData?.fontFamily || formData?.fontFamily || 'Playfair Display',
    fontWeight: editData?.fontWeight || formData?.fontWeight || 700,
    fontStyle: editData?.fontStyle || formData?.fontStyle || 'serif',
    fontSizeBoost: editData?.fontSizeBoost || 1
  };

  const hasGeneratedElements = Array.isArray(generatedElements) && generatedElements.length > 0;
  const canGenerateAi = aiRoundsUsed < maxPrePaymentRounds;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
      
      {/* 1. SEÇÃO DE OPÇÕES CURADAS DO BANCO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary, #475569)' }}>
            {d.step_118_curated_title || 'Opções Recomendadas para o seu Estilo'}
          </label>
          <span style={{ fontSize: '0.65rem', background: '#E1EDE7', color: '#203830', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
            {d.step_118_curated_badge || '3 Opções Curadas'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {availableCurated.map((icon, idx) => {
            const isSelected = selectedIconId === icon.id && selectedElementId === null;
            return (
              <div
                key={icon.id || idx}
                onClick={() => onSelectCurated && onSelectCurated(icon)}
                style={{
                  borderRadius: '20px',
                  minHeight: '130px',
                  padding: '14px 10px',
                  background: isSelected ? '#F0FDFA' : '#FAFAFA',
                  border: isSelected ? '3px solid var(--accent-turquoise, #2A897F)' : '1px solid #E2E8F0',
                  boxShadow: isSelected 
                    ? '0 12px 28px rgba(42, 137, 127, 0.35), 0 4px 10px rgba(0, 0, 0, 0.1)'
                    : '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  position: 'relative',
                  transform: isSelected ? 'translateY(-4px) scale(1.02)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  userSelect: 'none'
                }}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ffffff',
                    color: '#1E293B',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                  }}>
                    ✓
                  </span>
                )}

                {/* Selo circular real com o ícone em harmonia */}
                <div style={{ width: '84px', height: '84px', pointerEvents: 'none' }}>
                  <BrandTemplateSVG
                    data={brandDataForSeal}
                    color={activeColor}
                    textColor="#ffffff"
                    side="verso"
                    hideBackground={true}
                    iconPath={icon.path}
                    brandElement={null}
                  />
                </div>

                <span style={{
                  fontFamily: "'Cinzel', 'Montserrat', -apple-system, sans-serif",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--accent-turquoise, #2A897F)' : '#334155',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  {icon.label || `Opção 0${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. OPÇÕES GERADAS COM IA (SE EXISTIREM) */}
      {hasGeneratedElements && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary, #475569)' }}>
              {d.step_118_ai_generated_title || 'Opções Geradas com IA'}
            </label>
            <span style={{ fontSize: '0.65rem', background: '#F4E8DC', color: '#4A3A30', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
              {d.step_118_ai_generated_badge || '3 Opções Exclusivas'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {generatedElements.map((elem, idx) => {
              const isSelected = selectedElementId === elem.id;
              return (
                <div
                  key={elem.id || idx}
                  onClick={() => onSelectGenerated && onSelectGenerated(elem)}
                  style={{
                    borderRadius: '20px',
                    minHeight: '130px',
                    padding: '14px 10px',
                    background: isSelected ? '#F0FDFA' : '#FAFAFA',
                    border: isSelected ? '3px solid var(--accent-turquoise, #2A897F)' : '1px solid #E2E8F0',
                    boxShadow: isSelected 
                      ? '0 12px 28px rgba(42, 137, 127, 0.35), 0 4px 10px rgba(0, 0, 0, 0.1)'
                      : '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    position: 'relative',
                    transform: isSelected ? 'translateY(-4px) scale(1.02)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    userSelect: 'none'
                  }}
                >
                  {isSelected && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#ffffff',
                      color: '#1E293B',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                    }}>
                      ✓
                    </span>
                  )}

                  {/* Selo circular real com o elemento gerado por IA */}
                  <div style={{ width: '84px', height: '84px', pointerEvents: 'none' }}>
                    <BrandTemplateSVG
                      data={brandDataForSeal}
                      color={activeColor}
                      textColor="#ffffff"
                      side="verso"
                      hideBackground={true}
                      iconPath={null}
                      brandElement={elem}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '2px' }}>
                    <span style={{
                      fontFamily: "'Cinzel', 'Montserrat', -apple-system, sans-serif",
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: isSelected ? 'var(--accent-turquoise, #2A897F)' : '#1E293B',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}>
                      {elem.title || `Elemento 0${idx + 1}`}
                    </span>
                    {elem.label && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--accent-turquoise, #2A897F)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {elem.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SEÇÃO DE GERADOR DE IA SOB DEMANDA */}
      <div style={{
        width: '100%',
        padding: '16px 20px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '10px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
      }}>
        {!hasPattern ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', margin: 0 }}>
              {d.step_118_no_pattern_title || 'Estampa necessária para geração com IA'}
            </h4>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0, lineHeight: 1.45, maxWidth: '420px' }}>
              {d.step_118_no_pattern_desc || 'Para extrair elementos visuais exclusivos da sua estampa com inteligência artificial, você precisa selecionar uma estampa primeiro.'}
            </p>
            {onBackToPattern && (
              <button
                type="button"
                onClick={onBackToPattern}
                className="btn-secondary"
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  marginTop: '4px',
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}
              >
                {d.step_118_btn_back_choose_pattern || '← Voltar e escolher estampa'}
              </button>
            )}
          </div>
        ) : (
          <>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', margin: 0, letterSpacing: '0.02em' }}>
                {d.step_118_ai_box_title || 'Não encontrou o símbolo ideal?'}
              </h4>
              <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.45, maxWidth: '440px' }}>
                {d.step_118_ai_box_desc || 'A inteligência artificial pode analisar a sua estampa aprovada e extrair 3 novos elementos visuais exclusivos para a sua submarca.'}
              </p>
            </div>

            {canGenerateAi ? (
              <button
                type="button"
                onClick={onGenerateAi}
                disabled={isAiLoading}
                className="btn-primary"
                style={{
                  fontSize: '0.8rem',
                  padding: '10px 22px',
                  borderRadius: '20px',
                  background: 'var(--accent-turquoise, #2A897F)',
                  color: '#FFF',
                  border: 'none',
                  cursor: isAiLoading ? 'not-allowed' : 'pointer',
                  opacity: isAiLoading ? 0.8 : 1,
                  marginTop: '4px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(42, 137, 127, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isAiLoading ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    {d.step_118_ai_btn_loading || 'Criando elementos gráficos exclusivos...'}
                  </>
                ) : (
                  d.step_118_ai_btn || '✨ Gerar 3 novas opções com IA'
                )}
              </button>
            ) : (
              <div style={{
                fontSize: '0.72rem',
                color: '#475569',
                background: '#F1F5F9',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                lineHeight: 1.4
              }}>
                {d.step_118_ai_limit_used || '✓ Geração da demonstração utilizada (3 opções criadas). Você terá mais 2 rodadas completas após a compra!'}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default SubmarkSealStep;
