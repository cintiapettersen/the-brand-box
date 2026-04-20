#!/bin/bash

ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada"
DESTINO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/icons"
PROJETO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app"
STYLE_ICONS="$PROJETO/src/lib/styleIcons.js"

echo "🧹 Removendo arquivos inválidos da pasta de ícones..."
find "$DESTINO" -name "*.png" -not -name "icon-[a-z]*" -delete 2>/dev/null
find "$DESTINO" -name "*.svg" -not -name "icon-[a-z]*" -delete 2>/dev/null

echo "📂 Copiando ícones (somente arquivos icon-*)..."
for pasta in "$ORIGEM"/*/; do
  src_icons="$pasta/icons"
  if [ -d "$src_icons" ]; then
    # Copia apenas icon-[letra]* (exclui icon-_icon-* e similares)
    count=0
    for f in "$src_icons"/icon-[a-z]*.png "$src_icons"/icon-[a-z]*.svg; do
      [ -f "$f" ] && cp "$f" "$DESTINO"/ && count=$((count+1))
    done
    [ "$count" -gt "0" ] && echo "  → $(basename "$pasta") ($count ícones)"
  fi
done

cd "$PROJETO"
git add public/icons/ 2>/dev/null

CHANGED=$(git diff --cached --name-only public/icons/ | wc -l | tr -d ' ')

if [ "$CHANGED" -eq "0" ]; then
  echo ""
  echo "✅ Nenhum ícone novo — tudo já está atualizado!"
  exit 0
fi

echo ""
echo "📦 Arquivos alterados:"
git diff --cached --name-only public/icons/ | sed 's|public/icons/||'

# Avisa sobre ícones sem mapeamento
SEM_MAPA=()
for f in $(git diff --cached --name-only public/icons/); do
  filename=$(basename "$f")
  if ! grep -qF "$filename" "$STYLE_ICONS"; then
    SEM_MAPA+=("$filename")
  fi
done

git commit -m "atualiza icones ($CHANGED arquivo(s))"
git push

echo ""
echo "🚀 Publicado no Vercel!"

if [ ${#SEM_MAPA[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  Estes ícones ainda precisam ser mapeados no styleIcons.js:"
  for f in "${SEM_MAPA[@]}"; do
    echo "     → $f"
  done
  echo ""
  echo "   Abra src/lib/styleIcons.js e adicione a linha do ícone no estilo correto."
fi
