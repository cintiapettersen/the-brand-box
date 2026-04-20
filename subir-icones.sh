#!/bin/bash

ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada"
DESTINO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/icons"
PROJETO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app"
STYLE_ICONS="$PROJETO/src/lib/styleIcons.js"

echo "📂 Copiando ícones originais (se existirem)..."
for pasta in "$ORIGEM"/*/; do
  src_icons="$pasta/icons"
  if [ -d "$src_icons" ]; then
    count=0
    for f in "$src_icons"/*.png "$src_icons"/*.svg; do
      if [ -f "$f" ]; then
         # Evitar copiar os que começam com icon-_icon-
         if [[ ! $(basename "$f") == icon-_icon-* ]]; then
            cp "$f" "$DESTINO"/ && count=$((count+1))
         fi
      fi
    done
    [ "$count" -gt "0" ] && echo "  → $(basename "$pasta") ($count ícones copiados)"
  fi
done

cd "$PROJETO"
git config --global user.email "cintyapadua@gmail.com" 2>/dev/null

echo ""
echo "🧹 Preparando arquivos para Vercel..."
git add public/icons/ 2>/dev/null
git add src/lib/styleIcons.js 2>/dev/null

CHANGED_ICONS=$(git diff --cached --name-only public/icons/ | wc -l | tr -d ' ')
CHANGED_JS=$(git diff --cached --name-only src/lib/styleIcons.js | wc -l | tr -d ' ')

if [ "$CHANGED_ICONS" -eq "0" ] && [ "$CHANGED_JS" -eq "0" ]; then
  echo ""
  echo "✅ Nenhum ícone novo e nenhuma alteração no styleIcons.js. Tudo atualizado!"
  exit 0
fi

echo ""
echo "📦 Arquivos alterados que irão para o Vercel:"
git diff --cached --name-only | sed 's|^|  → |'

# Avisa sobre ícones sem mapeamento
SEM_MAPA=()
for f in $(git diff --cached --name-only public/icons/ | grep -E '\.(png|svg)$'); do
  filename=$(basename "$f")
  if ! grep -qF "$filename" "$STYLE_ICONS"; then
    SEM_MAPA+=("$filename")
  fi
done

git commit -m "atualiza icones e mapa de estilos"
git push

echo ""
echo "🚀 Publicado no Vercel!"

if [ ${#SEM_MAPA[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  Estes ícones subiram, mas ainda precisam ser mapeados no styleIcons.js:"
  for f in "${SEM_MAPA[@]}"; do
    echo "     → $f"
  done
  echo ""
  echo "   Abra src/lib/styleIcons.js e adicione a linha do ícone no estilo correto."
  echo "   Depois, RODE ESTE SCRIPT DE NOVO para enviar o arquivo styleIcons.js ao vivo!"
fi
