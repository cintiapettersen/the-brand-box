import React, { useEffect } from 'react';
import BrandTemplateSVG from '../BrandTemplateSVG';
import { STYLE_ICONS } from '../../lib/styleIcons';
import { getContrastingPaletteColors, isColorTooLightForWhiteText } from '../../lib/paletteValidation';

/**
 * SubmarkSealStep
 * 
 * Configurador interativo de submarca e selo oficial:
 * 1. Um preview central e de grande destaque do selo circular em tempo real.
 * 2. Seletor horizontal compacto de ícones (opções curadas + opções geradas por IA).
 * 3. Seletor de cores da paleta (filtrando cores muito claras para legibilidade do texto e ícone brancos).
 * 4. Botão secundário sutil para gerar 2 novas opções com IA (oculto após gerar).
 */
const SubmarkSealStep = ({
  formData = {},
  editData = {},
  activeColor = '#2A897F',
  paletteColors = [],
  onSelectColor,
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

  // Resolve as opções curadas para o estilo
  const availableCurated = (curatedIcons && curatedIcons.length > 0)
    ? curatedIcons.slice(0, 3)
    : (STYLE_ICONS[estiloNome] || STYLE_ICONS['Essência Atemporal'] || []).slice(0, 3);

  // Filtra cores muito claras da paleta para garantir contraste impecável com tipografia e ícone brancos
  const colorsList = getContrastingPaletteColors(paletteColors, '#2A897F');

  // Se a cor atual for excessivamente clara, comuta automaticamente para a primeira cor com contraste seguro
  const effectiveColor = isColorTooLightForWhiteText(activeColor)
    ? colorsList[0]
    : (colorsList.some(c => c.toLowerCase() === activeColor.toLowerCase()) ? activeColor : colorsList[0]);

  useEffect(() => {
    if (activeColor && isColorTooLightForWhiteText(activeColor) && onSelectColor && colorsList[0]) {
      onSelectColor(colorsList[0]);
    }
  }, [activeColor, colorsList, onSelectColor]);

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

  // Determina o elemento ativo para exibição no selo central
  const activeBrandElement = selectedElementId
    ? (generatedElements.find(e => e.id === selectedElementId) || formData.brandElement || null)
    : null;

  const activeCuratedIcon = !activeBrandElement
    ? (availableCurated.find(i => i.id === selectedIconId) || availableCurated[0] || null)
    : null;

  const activeIconPath = activeBrandElement ? null : (activeCuratedIcon?.path || null);

  // Helper para extrair imagem de elemento gerado por IA
  const getElementThumbSrc = (el) => {
    if (!el) return null;
    if (typeof el === 'string') return el.startsWith('data:') || el.startsWith('/') ? el : `data:image/png;base64,${el}`;
    if (typeof el === 'object' && el.base64) {
      return el.base64.startsWith('data:') ? el.base64 : `data:${el.mimeType || 'image/png'};base64,${el.base64}`;
    }
    if (typeof el === 'object' && el.path) return el.path;
    return null;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '0 0 12px'
    }}>

      {/* 1. PREVIEW CENTRAL ÚNICO E DE DESTAQUE DO SELO (AMPLIADO) */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px'
      }}>
        <div style={{
          width: '230px',
          height: '230px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.09))',
          transition: 'all 0.3s ease'
        }}>
          <BrandTemplateSVG
            data={brandDataForSeal}
            color={effectiveColor}
            textColor="#ffffff"
            side="verso"
            hideBackground={true}
            iconPath={activeIconPath}
            brandElement={activeBrandElement}
          />
        </div>
      </div>

      {/* 2. SELETOR DE ÍCONES / SÍMBOLOS (Curados + IA) */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary, #64748B)'
        }}>
          {d.step_118_icon_selector_title || 'Símbolo'}
        </span>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Opções Curadas */}
          {availableCurated.map((icon, idx) => {
            const isSelected = selectedElementId === null && (selectedIconId === icon.id || (!selectedIconId && idx === 0));
            return (
              <button
                type="button"
                key={icon.id || idx}
                onClick={() => onSelectCurated && onSelectCurated(icon)}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: isSelected ? '#FFFFFF' : '#F8FAFC',
                  border: isSelected ? '2px solid var(--accent-turquoise, #2A897F)' : '1.5px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 12px rgba(42, 137, 127, 0.18)' : '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '8px',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                title={icon.label || `Opção ${idx + 1}`}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--accent-turquoise, #2A897F)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ✓
                  </span>
                )}
                <img
                  src={icon.path}
                  alt={icon.label || `Ícone ${idx + 1}`}
                  style={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'contain',
                    filter: isSelected ? 'brightness(0.3)' : 'brightness(0.5) opacity(0.75)'
                  }}
                />
              </button>
            );
          })}

          {/* Opções Geradas por IA (adicionadas ao mesmo seletor) */}
          {hasGeneratedElements && generatedElements.map((elem, idx) => {
            const isSelected = selectedElementId === elem.id;
            const thumbSrc = getElementThumbSrc(elem);
            return (
              <button
                type="button"
                key={elem.id || idx}
                onClick={() => onSelectGenerated && onSelectGenerated(elem)}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: isSelected ? '#FFFFFF' : '#F8FAFC',
                  border: isSelected ? '2px solid var(--accent-turquoise, #2A897F)' : '1.5px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 12px rgba(42, 137, 127, 0.18)' : '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '8px',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                title={elem.title || `Elemento IA ${idx + 1}`}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--accent-turquoise, #2A897F)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ✓
                  </span>
                )}
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.5rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--accent-turquoise, #2A897F)' : '#94A3B8',
                  letterSpacing: '0.04em'
                }}>
                  IA
                </span>
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={elem.title || `Elemento ${idx + 1}`}
                    style={{
                      width: '28px',
                      height: '28px',
                      objectFit: 'contain',
                      marginBottom: '4px',
                      filter: isSelected ? 'brightness(0.3)' : 'brightness(0.5) opacity(0.75)'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '0.7rem' }}>✨</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SELETOR DE COR DA PALETA */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary, #64748B)'
        }}>
          {d.step_118_color_selector_title || 'Cor do Selo'}
        </span>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {colorsList.map((hex, i) => {
            const isSelected = (activeColor || '').toLowerCase() === (hex || '').toLowerCase();
            return (
              <button
                type="button"
                key={i}
                onClick={() => onSelectColor && onSelectColor(hex)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: hex,
                  border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.12)',
                  boxShadow: isSelected ? '0 0 0 2.5px var(--accent-turquoise, #2A897F), 0 3px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                title={hex}
              />
            );
          })}
        </div>
      </div>

      {/* 4. OPÇÃO SECUNDÁRIA E SUTIL DE GERAÇÃO COM IA (Apenas antes de gerar) */}
      {!hasGeneratedElements && (
        <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {!hasPattern ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0 }}>
                {d.step_118_no_pattern_desc || 'Para extrair símbolos exclusivos com IA, escolha uma estampa primeiro.'}
              </p>
              {onBackToPattern && (
                <button
                  type="button"
                  onClick={onBackToPattern}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-turquoise, #2A897F)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '4px'
                  }}
                >
                  {d.step_118_btn_back_choose_pattern || '← Voltar à estampa'}
                </button>
              )}
            </div>
          ) : canGenerateAi ? (
            <button
              type="button"
              onClick={onGenerateAi}
              disabled={isAiLoading}
              className="btn-secondary"
              style={{
                fontSize: '0.76rem',
                padding: '6px 14px',
                borderRadius: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-turquoise, #2A897F)',
                borderColor: '#CBD5E1',
                background: '#FFFFFF',
                cursor: isAiLoading ? 'not-allowed' : 'pointer',
                opacity: isAiLoading ? 0.7 : 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              {isAiLoading ? (
                <>
                  <span style={{ display: 'inline-block', width: '11px', height: '11px', border: '2px solid var(--accent-turquoise, #2A897F)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  {d.step_118_ai_btn_loading || 'Gerando 3 opções com IA...'}
                </>
              ) : (
                d.step_118_ai_btn_subtle || '✨ Quer mais opções? Gerar 3 com IA'
              )}
            </button>
          ) : null}
        </div>
      )}

    </div>
  );
};

export default SubmarkSealStep;

