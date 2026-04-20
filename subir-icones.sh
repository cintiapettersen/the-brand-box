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

# Detecta ícones que ainda não estão mapeados no styleIcons.js
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
    echo "   Qual estilo esse ícone pertence?"
    for i in "${!ESTILOS[@]}"; do
      echo "     $((i+1)). ${ESTILOS[$i]}"
    done
    echo "     0. Pular (não mapear agora)"
    echo ""
    read -p "   Número: " estilo_num

    if [[ "$estilo_num" -ge 1 && "$estilo_num" -le ${#ESTILOS[@]} ]]; then
      estilo="${ESTILOS[$((estilo_num-1))]}"
      read -p "   Nome bonito (ex: Tulipa, Abelhinha): " label
      node "$PROJETO/scripts/add-icon.mjs" "$filename" "$estilo" "$label"
      MAPEOU=true
    else
      echo "   ⏭️  Pulado."
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
  git diff --cached --name-only | head -15
  git commit -m "atualiza icones ($CHANGED arquivo(s) alterado(s))"
  git push
  echo ""
  echo "🚀 Pronto! $CHANGED arquivo(s) publicado(s) no Vercel."
fi
