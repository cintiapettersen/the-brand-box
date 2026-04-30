'use client';
import React from 'react';

// ─── WHO Growth Standards Data (WHO Child Growth Standards 2006 / SBP) ─────────
const MONTHS = [0, 3, 6, 9, 12, 18, 24, 36, 48, 60];
const PC_MONTHS = [0, 2, 4, 6, 9, 12, 18, 24, 36, 48, 60];

const WHO = {
  menina: {
    peso: {
      'Z-3': [1.7, 3.8, 5.4, 6.4, 7.0, 8.0, 8.9, 10.3, 11.6, 13.0],
      'Z-2': [2.0, 4.3, 6.1, 7.2, 7.9, 9.1, 10.1, 11.7, 13.3, 14.9],
      'Z0':  [2.5, 5.1, 7.1, 8.5, 9.5, 11.0, 12.3, 14.2, 16.2, 18.6],
      'Z+2': [3.1, 6.4, 8.9, 10.6, 11.9, 13.9, 15.6, 18.2, 21.0, 24.2],
      'Z+3': [3.5, 7.3, 10.2, 12.0, 13.6, 16.0, 18.1, 21.4, 25.0, 28.9],
    },
    altura: {
      'Z-3': [43.6, 51.7, 57.5, 62.0, 65.6, 71.0, 75.7, 83.6, 90.7, 97.7],
      'Z-2': [45.9, 54.3, 60.3, 65.0, 68.9, 74.8, 79.6, 87.9, 95.3, 102.5],
      'Z0':  [49.2, 58.2, 64.8, 70.1, 74.1, 80.7, 86.4, 95.1, 103.3, 110.8],
      'Z+2': [52.5, 62.1, 69.2, 75.2, 79.2, 86.6, 93.2, 102.4, 111.4, 119.2],
      'Z+3': [54.9, 64.9, 72.4, 78.5, 82.9, 90.5, 97.5, 107.1, 116.4, 124.4],
    },
    imc: {
      'Z-3': [10.5, 11.4, 12.0, 12.4, 12.6, 12.8, 12.9, 12.9, 12.9, 13.1],
      'Z-2': [11.6, 12.6, 13.3, 13.7, 13.9, 14.0, 14.1, 14.0, 14.0, 14.1],
      'Z0':  [13.3, 14.6, 15.3, 15.7, 15.8, 15.7, 15.5, 15.2, 15.0, 15.1],
      'Z+2': [15.6, 17.4, 18.3, 18.8, 18.8, 18.4, 18.1, 17.5, 17.2, 17.4],
      'Z+3': [17.2, 19.4, 20.5, 21.0, 21.1, 20.6, 20.1, 19.5, 19.2, 19.4],
    },
    pc: {
      'Z-3': [30.3, 33.5, 36.0, 37.7, 39.3, 40.6, 42.3, 43.5, 45.2, 46.4, 47.3],
      'Z-2': [31.5, 34.9, 37.4, 39.2, 40.8, 42.2, 44.0, 45.3, 47.1, 48.3, 49.2],
      'Z0':  [33.9, 37.4, 39.9, 41.8, 43.5, 44.9, 46.9, 48.2, 50.1, 51.4, 52.3],
      'Z+2': [36.2, 40.0, 42.6, 44.5, 46.3, 47.8, 49.9, 51.2, 53.2, 54.6, 55.5],
      'Z+3': [37.4, 41.3, 43.9, 45.9, 47.7, 49.2, 51.4, 52.7, 54.8, 56.2, 57.1],
    },
  },
  menino: {
    peso: {
      'Z-3': [1.7, 4.0, 5.7, 6.8, 7.5, 8.6, 9.6, 11.0, 12.6, 14.2],
      'Z-2': [2.0, 4.6, 6.4, 7.6, 8.3, 9.6, 10.7, 12.4, 14.2, 16.0],
      'Z0':  [2.5, 5.4, 7.6, 9.1, 10.0, 11.5, 12.9, 15.0, 17.2, 19.7],
      'Z+2': [3.2, 6.8, 9.3, 11.1, 12.2, 14.0, 15.8, 18.4, 21.5, 24.9],
      'Z+3': [3.6, 7.7, 10.5, 12.5, 13.8, 15.8, 17.8, 21.0, 24.7, 28.9],
    },
    altura: {
      'Z-3': [44.2, 52.5, 58.4, 63.0, 66.8, 72.7, 77.5, 85.8, 93.3, 100.7],
      'Z-2': [46.1, 55.0, 61.0, 65.8, 69.9, 76.0, 81.1, 89.7, 97.5, 105.0],
      'Z0':  [49.9, 59.1, 65.7, 71.1, 75.7, 82.3, 87.8, 96.9, 105.4, 113.0],
      'Z+2': [53.4, 63.1, 70.1, 76.2, 81.3, 88.3, 94.3, 104.0, 113.2, 121.0],
      'Z+3': [55.6, 65.6, 73.0, 79.4, 84.9, 92.1, 98.3, 108.5, 118.1, 126.2],
    },
    imc: {
      'Z-3': [10.2, 11.3, 12.1, 12.5, 12.8, 13.0, 13.1, 13.1, 13.2, 13.4],
      'Z-2': [11.3, 12.5, 13.3, 13.8, 14.0, 14.3, 14.4, 14.3, 14.3, 14.4],
      'Z0':  [13.1, 14.6, 15.3, 15.8, 16.0, 16.0, 15.9, 15.6, 15.5, 15.7],
      'Z+2': [15.3, 17.3, 18.3, 18.9, 19.1, 18.9, 18.7, 18.1, 18.0, 18.4],
      'Z+3': [16.8, 19.3, 20.4, 21.1, 21.4, 21.1, 20.7, 20.2, 20.1, 20.7],
    },
    pc: {
      'Z-3': [31.5, 35.0, 37.5, 39.2, 41.0, 42.4, 44.3, 45.6, 47.5, 48.8, 49.8],
      'Z-2': [32.7, 36.3, 38.9, 40.7, 42.5, 43.9, 45.9, 47.2, 49.2, 50.5, 51.5],
      'Z0':  [34.5, 38.3, 41.0, 42.9, 44.7, 46.2, 48.3, 49.7, 51.7, 53.0, 54.1],
      'Z+2': [36.9, 41.0, 43.7, 45.8, 47.7, 49.3, 51.5, 52.9, 55.0, 56.4, 57.5],
      'Z+3': [38.3, 42.5, 45.3, 47.4, 49.4, 51.0, 53.3, 54.8, 57.0, 58.5, 59.6],
    },
  },
};

const Z_CURVES = [
  { key: 'Z+3', color: '#555', dash: false, label: '3' },
  { key: 'Z+2', color: '#e05c5c', dash: false, label: '2' },
  { key: 'Z0',  color: '#3a8a5c', dash: false, label: '0' },
  { key: 'Z-2', color: '#e05c5c', dash: true,  label: '-2' },
  { key: 'Z-3', color: '#555',    dash: true,  label: '-3' },
];

// Smooth bezier path from data points (Catmull-Rom → Cubic Bezier)
function smoothPath(pts) {
  if (pts.length < 2) return '';
  const tension = 0.4;
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

// ─── Generic Growth Chart ─────────────────────────────────────────────────────
function GrowthChart({ data, months, yMin, yMax, yStep, xLabel, title, w = 200, h = 110, mainColor, plotPoint = null }) {
  const PAD = { top: 10, right: 20, bottom: 22, left: 24 };
  const CW = w - PAD.left - PAD.right;
  const CH = h - PAD.top - PAD.bottom;
  const xMax = 60;
  const toX = (m) => PAD.left + (m / xMax) * CW;
  const toY = (v) => PAD.top + CH - ((v - yMin) / (yMax - yMin)) * CH;

  const years = [0, 12, 24, 36, 48, 60];
  const yearLabels = ['Nasc.', '1 ano', '2 anos', '3 anos', '4 anos', '5 anos'];
  const minorX = Array.from({ length: 31 }, (_, i) => i * 2);
  const yTicks = [];
  for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);

  const makePoints = (values) => months.map((m, i) => [toX(m), toY(values[i])]);

  return (
    <svg width={w} height={h} style={{ fontFamily: 'Montserrat,sans-serif', display: 'block' }}>
      {/* Chart bg */}
      <rect x={PAD.left} y={PAD.top} width={CW} height={CH} fill="#fff" stroke="#ccc" strokeWidth="0.4" />

      {/* Minor vertical grid */}
      {minorX.map(m => (
        <line key={m} x1={toX(m)} y1={PAD.top} x2={toX(m)} y2={PAD.top + CH}
          stroke="#f0f0f0" strokeWidth="0.3" />
      ))}
      {/* Year verticals */}
      {years.map(m => (
        <line key={m} x1={toX(m)} y1={PAD.top} x2={toX(m)} y2={PAD.top + CH}
          stroke="#ccc" strokeWidth="0.6" />
      ))}
      {/* Horizontal grid */}
      {yTicks.map(v => (
        <line key={v} x1={PAD.left} y1={toY(v)} x2={PAD.left + CW} y2={toY(v)}
          stroke={v % (yStep * 2) === 0 ? '#ddd' : '#f5f5f5'} strokeWidth="0.4" />
      ))}

      {/* Y axis labels — LEFT ONLY */}
      {yTicks.filter((_, i) => i % 2 === 0).map(v => (
        <text key={v} x={PAD.left - 2} y={toY(v) + 1.5} textAnchor="end" fontSize="4" fill="#999">{v}</text>
      ))}

      {/* Smooth Z-score curves */}
      {Z_CURVES.map(({ key, color, dash }) => {
        if (!data[key]) return null;
        const pts = makePoints(data[key]);
        return (
          <path key={key} d={smoothPath(pts)} fill="none"
            stroke={color} strokeWidth={key === 'Z0' ? 1.0 : 0.7}
            strokeDasharray={dash ? '2,2' : 'none'} strokeLinecap="round" />
        );
      })}

      {/* Z-score labels — RIGHT, after the chart border, no overlap with values */}
      {Z_CURVES.map(({ key, color, label }) => {
        if (!data[key]) return null;
        const vals = data[key];
        return (
          <text key={key}
            x={PAD.left + CW + 3}
            y={toY(vals[vals.length - 1]) + 1.5}
            fontSize="4.5" fill={color} fontWeight={key === 'Z0' ? '700' : '400'}>{label}</text>
        );
      })}

      {/* X labels */}
      {years.map((m, i) => (
        <text key={m} x={toX(m)} y={PAD.top + CH + 7} textAnchor="middle" fontSize="4" fill="#777">{yearLabels[i]}</text>
      ))}
      {/* Minor month ticks */}
      {minorX.filter(m => !years.includes(m) && m % 6 === 0).map(m => (
        <text key={m} x={toX(m)} y={PAD.top + CH + 4} textAnchor="middle" fontSize="3" fill="#bbb">{m % 12}</text>
      ))}

      {/* Y label rotated */}
      <text transform={`translate(${PAD.left - 16},${PAD.top + CH / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="4.5" fill={mainColor} fontWeight="700">{xLabel}</text>

      {/* Title */}
      <text x={PAD.left} y={PAD.top - 3} fontSize="5" fill={mainColor} fontWeight="800">{title.toUpperCase()}</text>

      {/* Z legend bottom-left */}
      <text x={PAD.left + 2} y={PAD.top + CH - 2} fontSize="3.5" fill="#aaa">Z-scores: -3, -2, 0, +2, +3</text>

      {/* Interactive plot point — ready for next phase */}
      {plotPoint && (
        <g>
          <circle cx={toX(plotPoint.month)} cy={toY(plotPoint.value)}
            r="3.5" fill={mainColor} stroke="#fff" strokeWidth="1" />
          <text x={toX(plotPoint.month)} y={toY(plotPoint.value) - 5}
            textAnchor="middle" fontSize="4.5" fill={mainColor} fontWeight="800">{plotPoint.label}</text>
        </g>
      )}
    </svg>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
export default function GraficoCrescimentoPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  borderColor, setBorderColor, patternSrc, patternScale, setPatternScale,
  measurements = {},
}) {
  const [gender, setGender] = React.useState('menina');
  const [face, setFace] = React.useState('frente');

  const mainColor = paletteColors[0] || accentColor;
  const c1 = paletteColors[1] || accentColor;
  const solidColor = borderColor || paletteColors[0] || accentColor;
  const BORDER = 8;
  const d = WHO[gender];
  const isMenina = gender === 'menina';
  const gColor = isMenina ? '#c8699a' : '#4a8bb5';
  const gLabel = isMenina ? 'MENINA' : 'MENINO';
  const { site, instagram } = cartaoContacts || {};

  const chartProps = { mainColor: gColor, w: 198, h: 108 };

  // Underline field style
  const fieldStyle = {
    display: 'inline-block', borderBottom: '0.4px solid rgba(255,255,255,0.6)',
    minWidth: '28px', height: '7px', fontSize: '4px', color: '#fff',
    fontFamily: 'Montserrat,sans-serif', verticalAlign: 'bottom'
  };
  const fieldLabel = { fontSize: '3.5px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginRight: '2px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', border: `1px solid ${mainColor}30`, borderRadius: '20px', overflow: 'hidden' }}>
          {['menina', 'menino'].map(g => (
            <button key={g} onClick={() => setGender(g)} style={{
              padding: '3px 10px', fontSize: '9px', fontWeight: 700, cursor: 'pointer',
              background: gender === g ? mainColor : '#fff', color: gender === g ? '#fff' : '#888',
              border: 'none', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase'
            }}>{g === 'menina' ? '♀ Menina' : '♂ Menino'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', border: `1px solid ${mainColor}30`, borderRadius: '20px', overflow: 'hidden' }}>
          {[['frente', 'IMC + P.Cefálico'], ['verso', 'Peso + Altura']].map(([f, lbl]) => (
            <button key={f} onClick={() => setFace(f)} style={{
              padding: '3px 10px', fontSize: '9px', fontWeight: 700, cursor: 'pointer',
              background: face === f ? c1 : '#fff', color: face === f ? '#fff' : '#888',
              border: 'none', fontFamily: 'Montserrat,sans-serif'
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* A4 preview */}
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
        {comBorda && patternSrc && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
        )}

        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8f8f8' }}>

          {/* ── CABEÇALHO / CAPA (dobra superior) ── */}
          <div style={{ background: gColor, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Topo: título pequeno + MENINA/MENINO + logo */}
            <div style={{ padding: '4px 7px 3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '3.8px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '1px' }}>
                  {face === 'frente' ? 'Crescimento — IMC · Perímetro Cefálico' : 'Crescimento — Peso · Altura'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat,sans-serif', letterSpacing: '1px', lineHeight: 1 }}>
                  {gLabel}
                </div>
                <div style={{ fontSize: '3px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat,sans-serif', marginTop: '1px' }}>
                  Fonte: OMS — WHO Child Growth Standards 2006 · SBP
                </div>
              </div>
              {/* Logo area */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
                <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat,sans-serif', textAlign: 'right', lineHeight: 1.1 }}>
                  {clinicaNome || editData?.marca || 'Sua Clínica'}
                </div>
                {crmLine && <div style={{ fontSize: '3.5px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat,sans-serif' }}>{crmLine}</div>}
                <div style={{ fontSize: '3px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat,sans-serif' }}>
                  {[site, instagram ? `@${instagram}` : ''].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>

            {/* Linha de dobra + campos da criança */}
            <div style={{ borderTop: '0.5px dashed rgba(255,255,255,0.4)', margin: '0 6px', padding: '4px 2px 4px' }}>
              <div style={{ fontSize: '3.5px', color: 'rgba(255,255,255,0.65)', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>
                ✎ Dados da consulta
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={fieldLabel}>Paciente:</span>
                  <span style={{ ...fieldStyle, minWidth: '50px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={fieldLabel}>Idade:</span>
                  <span style={{ ...fieldStyle, minWidth: '18px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={fieldLabel}>Data:</span>
                  <span style={{ ...fieldStyle, minWidth: '24px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                {[['Peso', 'kg'], ['Altura', 'cm'], ['PC', 'cm'], ['IMC', '']].map(([lbl, unit]) => (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={fieldLabel}>{lbl}:</span>
                    <span style={{ ...fieldStyle, minWidth: '18px' }} />
                    {unit && <span style={{ fontSize: '3.5px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat,sans-serif' }}>{unit}</span>}
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={fieldLabel}>Percentil:</span>
                  <span style={{ ...fieldStyle, minWidth: '22px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── GRÁFICOS ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', padding: '4px 4px 3px', overflow: 'hidden' }}>
            {face === 'frente' ? (<>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GrowthChart data={d.imc} months={MONTHS} yMin={10} yMax={22} yStep={1}
                  xLabel="IMC" title="IMC por Idade" {...chartProps} h={102} />
              </div>
              <div style={{ height: '0.5px', background: '#e0e0e0' }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GrowthChart data={d.pc} months={PC_MONTHS} yMin={30} yMax={58} yStep={2}
                  xLabel="PC (cm)" title="Perímetro Cefálico" {...chartProps} h={102} />
              </div>
            </>) : (<>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GrowthChart data={d.peso} months={MONTHS} yMin={0} yMax={30} yStep={2}
                  xLabel="Peso (kg)" title="Peso por Idade" {...chartProps} h={102} />
              </div>
              <div style={{ height: '0.5px', background: '#e0e0e0' }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GrowthChart data={d.altura} months={MONTHS} yMin={40} yMax={130} yStep={5}
                  xLabel="Altura (cm)" title="Altura por Idade" {...chartProps} h={102} />
              </div>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export { WHO, MONTHS, PC_MONTHS, Z_CURVES, GrowthChart };
