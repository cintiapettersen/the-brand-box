import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Component line ranges → (previewWidthPx, itemWidthMm)
COMPONENT_RANGES = [
    ((3235, 3325), (220, 56)),    # CartaoRetornoPreview  56x96mm card
    ((3475, 3526), (420, 303)),   # CertificadoCoragemPreview  A4 landscape 303mm
    ((3527, 3588), (280, 154)),   # A5ItemPreview  154mm
    ((3589, 3657), (350, 216)),   # ProntuarioPreview  A4
    ((3658, 3764), (350, 216)),   # DiarioXixiPreview  A4
    ((3765, 3904), (350, 216)),   # FichaCadastroPreview  A4
    ((3905, 3978), (280, 154)),   # ReciboPreview  A5
    ((3979, 4073), (280, 154)),   # ControleEspecialPreview  A5
    ((4074, 4146), (350, 216)),   # ChecklistMaternidadePreview  A4
    ((4147, 4331), (350, 216)),   # OrientacoesRNPreview  A4
    ((4332, 4434), (350, 216)),   # GuiaCuidadosPreview  A4
    ((4435, 4716), (300, 99)),    # FolderTrifoldPreview  panel 99mm
    ((4717, 4826), (300, 154)),   # FolderA5Preview  154mm
    ((4827, 4983), (350, 216)),   # AtestadoPreview  A4
    ((4984, 5003), (350, 216)),   # GenericItemPreview  A4
    ((5004, 5064), (350, 216)),   # PapelTimbradoPreview  A4
    ((5065, 5127), (300, 300)),   # FundoInstaPreview  square digital
    ((5366, 5425), (310, 240)),   # EnvelopeOficioPreview  240mm
    ((5426, 5496), (220, 200)),   # CadernoPreview  200mm
]

def get_dims(line_num):
    for (start, end), dims in COMPONENT_RANGES:
        if start <= line_num <= end:
            return dims
    return None

changes = 0
new_lines = list(lines)

for i, line in enumerate(lines):
    ln = i + 1

    # ── FIX PREVIEW backgroundSize ──────────────────────────────────
    if ('backgroundSize' in line and 'patternScale' in line
            and 'px`' in line and 'getPatternTilePx' not in line):
        dims = get_dims(ln)
        if dims:
            px, mm = dims
            new_line = re.sub(
                r"backgroundSize:\s*(?:patternScale \? )?`\$\{[^`]+patternScale[^`]*\}px`(?:\s*:\s*'100%')?",
                f"backgroundSize: `${{getPatternTilePx(patternScale, {px}, {mm})}}px`",
                line
            )
            if new_line != line:
                print(f"  PREVIEW L{ln} ({px}px/{mm}mm): {line.strip()[:70]}")
                new_lines[i] = new_line
                changes += 1
                continue

    # ── FIX PDF background-size ──────────────────────────────────────
    # Replace all patternScale multiplier formulas in PDF strings → getPatternTileMm
    if ('background-size' in line and 'patternScale' in line
            and 'mm' in line and 'getPatternTileMm' not in line):
        # Skip lines with sizeBoost or scaleMul (custom per-panel formulas)
        if 'sizeBoost' in line or 'scaleMul' in line:
            continue
        new_line = re.sub(
            r'\$\{(?!\s*getPatternTileMm)([^}]*patternScale[^}]*)\}(mm)',
            r'${getPatternTileMm(patternScale).toFixed(1)}\2',
            line
        )
        if new_line != line:
            print(f"  PDF    L{ln}: {line.strip()[:70]}")
            new_lines[i] = new_line
            changes += 1

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"\nDone! {changes} changes applied.")

# Verify remaining uncalibrated
print("\n--- Still uncalibrated (patternScale in background-size, not using helper) ---")
for i, line in enumerate(new_lines):
    if 'patternScale' in line and ('backgroundSize' in line or 'background-size' in line):
        if 'getPatternTile' not in line and 'sizeBoost' not in line and 'scaleMul' not in line:
            print(f"  L{i+1}: {line.strip()[:80]}")
