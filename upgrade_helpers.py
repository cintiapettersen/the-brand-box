with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the two helper functions
old_mm = 'export const getPatternTileMm = (scale) => ((parseFloat(scale) || 120) * 0.25);'
new_mm = 'export const getPatternTileMm = (scale, minMm = 0) => Math.max((parseFloat(scale) || 120) * 0.25, minMm);'

old_px_sig = 'export const getPatternTilePx = (scale, previewWidthPx = 300, itemWidthMm = 210) => {'
new_px_sig = 'export const getPatternTilePx = (scale, previewWidthPx = 300, itemWidthMm = 210, minMm = 0) => {'

old_px_body = '  const tileMm = getPatternTileMm(scale);'
new_px_body = '  const tileMm = getPatternTileMm(scale, minMm);'

changes = 0
if old_mm in content:
    content = content.replace(old_mm, new_mm, 1)
    print('OK: getPatternTileMm upgraded with minMm param')
    changes += 1
else:
    print('WARN: getPatternTileMm exact text not found')

if old_px_sig in content:
    content = content.replace(old_px_sig, new_px_sig, 1)
    print('OK: getPatternTilePx signature upgraded')
    changes += 1
else:
    print('WARN: getPatternTilePx signature not found')

if old_px_body in content:
    content = content.replace(old_px_body, new_px_body, 1)
    print('OK: getPatternTilePx body upgraded')
    changes += 1
else:
    print('WARN: getPatternTilePx body not found')

# Now insert ITEM_DEFAULT_PATTERN_SCALE right after the closing }; of getPatternTilePx
# Find insertion point
marker = 'return Math.round(tileMm * pxPerMm);\n};'
insert_after = marker

default_scales_block = """

// Default patternScale por item: tile = itemWidthMm -> zero repeticao visivel de costuras
// Formula: scale = itemWidthMm / 0.25  (tile cobriria o item inteiro sem repetir)
export const ITEM_DEFAULT_PATTERN_SCALE = {
  // Cards (56-96mm)
  'Cart\u00e3o de Retorno': 384,
  'Cart\u00e3o de Visita': 384,
  'Cart\u00e3o de Agradecimento (10x15cm)': 480,
  // A5 items (154mm)
  'Receitu\u00e1rio Padr\u00e3o': 640,
  'Receitu\u00e1rio Padr\u00e3o (A4 e A5)': 640,
  'Receitu\u00e1rio de Controle Especial': 640,
  'Recibo': 640,
  // A4 items (216mm)
  'Prontu\u00e1rio M\u00e9dico': 880,
  'Di\u00e1rio do Xixi e do Coc\u00f4': 880,
  'Ficha de Cadastro': 880,
  'Checklist Maternidade': 880,
  'Orienta\u00e7\u00f5es p/ Rec\u00e9m Nascidos': 880,
  'Papel Timbrado': 880,
  'Atestado M\u00e9dico': 880,
  'Atestado M\u00e9dico (A4 e A5)': 880,
  'Certificado de Coragem': 1240,
  'Gr\u00e1fico de Crescimento': 880,
  // Envelopes
  'Envelope Saco': 920,
  'Envelope Saco (24x34cm)': 920,
  'Envelope Of\u00edcio': 980,
  // Pasta
  'Pasta A4': 1000,
  // Caderno
  'Capa de Caderno / Agenda': 820,
  'Caderneta de Sa\u00fade': 820,
  // Folders
  'Folder Trifold': 420,
  'Folder A5': 640,
};"""

if insert_after in content and 'ITEM_DEFAULT_PATTERN_SCALE' not in content:
    content = content.replace(insert_after, insert_after + default_scales_block, 1)
    print('OK: ITEM_DEFAULT_PATTERN_SCALE inserted')
    changes += 1
elif 'ITEM_DEFAULT_PATTERN_SCALE' in content:
    print('INFO: ITEM_DEFAULT_PATTERN_SCALE already exists')
else:
    print('WARN: Could not find insertion point for ITEM_DEFAULT_PATTERN_SCALE')

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nTotal: {changes} changes applied.')
