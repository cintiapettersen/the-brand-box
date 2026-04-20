#!/bin/bash

ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada"
DESTINO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/icons"
PROJETO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app"
STYLE_ICONS="$PROJETO/src/lib/styleIcons.js"

echo "📂 Copiando ícones de todas as pastas de estilo..."
for pasta in "$ORIGEM"/*/; do
  src_icons="$pasta/icons"
  if [ -d "$src_icons" ]; then
    echo "  → $(basename "$pasta")"
    cp "$src_icons"/*.png "$DESTINO"/ 2>/dev/null
    cp "$src_icons"/*.svg "$DESTINO"/ 2>/dev/null
  fi
done

cd "$PROJETO"

ESTILOS=("Jardim Encantado" "Escandinavo Acolhedor" "Essência Atemporal" "Doce Encantamento" "Raízes & Cuidado" "Estético Editorial")
MAPEOU=false

echo ""
for f in "$DESTINO"/*.png "$DESTINO"/*.svg; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")

  if ! grep -qF "$filename" "$STYLE_ICONS"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🆕 Ícone novo: $filename"
    echo ""
    echo "   Qual estilo?"
    for i in "${!ESTILOS[@]}"; do
      echo "     $((i+1)). ${ESTILOS[$i]}"
    done
    echo "     0. Pular"
    echo ""
    read -p "   Número: " estilo_num

    if [[ "$estilo_num" -ge 1 && "$estilo_num" -le ${#ESTILOS[@]} ]]; then
      estilo="${ESTILOS[$((estilo_num-1))]}"
      echo ""
      echo "   O que fazer?"
      echo "     1. Adicionar como ícone novo"
      echo "     2. Substituir um ícone existente"
      echo ""
      read -p "   Opção: " acao

      if [[ "$acao" == "1" ]]; then
        read -p "   Nome bonito (ex: Tulipa): " label
        node "$PROJETO/scripts/add-icon.mjs" add "$filename" "$estilo" "$label"
        MAPEOU=true

      elif [[ "$acao" == "2" ]]; then
        echo ""
        echo "   Ícones atuais de $estilo:"
        # Extrai ids e labels do estilo no styleIcons.js
        IFS=$'\n' read -r -d '' -a ICONS_RAW < <(node --input-type=module <<NODEEOF && printf '\0'
import fs from 'fs';
const c = fs.readFileSync('${STYLE_ICONS}', 'utf8');
const estilo = '${estilo}';
const block = c.split("'" + estilo + "': [")[1]?.split(']')[0] || '';
const matches = [...block.matchAll(/id: '([^']+)', label: '([^']*)'/g)];
matches.forEach((m, i) => console.log((i+1) + '|' + m[1] + '|' + m[2]));
NODEEOF
        )

        for line in "${ICONS_RAW[@]}"; do
          num="${line%%|*}"
          rest="${line#*|}"
          id="${rest%%|*}"
          lbl="${rest#*|}"
          echo "     $num. $lbl ($id)"
        done

        echo ""
        read -p "   Número do ícone a substituir: " icon_num
        icon_line="${ICONS_RAW[$((icon_num-1))]}"
        old_id="${icon_line#*|}"
        old_id="${old_id%%|*}"
        old_label="${icon_line##*|}"

        read -p "   Nome bonito [Enter para manter '$old_label']: " label
        [ -z "$label" ] && label="$old_label"

        node "$PROJETO/scripts/add-icon.mjs" replace "$filename" "$estilo" "$old_id" "$label"
        MAPEOU=true
      fi
    fi
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Subindo para o GitHub..."

if [ "$MAPEOU" = true ]; then
  git add public/icons/ src/lib/styleIcons.js
else
  git add public/icons/
fi

CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')

if [ "$CHANGED" -eq "0" ]; then
  echo "✅ Nenhum ícone novo — tudo já estava atualizado!"
else
  git diff --cached --name-only | head -10
  git commit -m "atualiza icones ($CHANGED arquivo(s) alterado(s))"
  git push
  echo ""
  echo "🚀 Pronto! $CHANGED arquivo(s) publicado(s) no Vercel."
fi
