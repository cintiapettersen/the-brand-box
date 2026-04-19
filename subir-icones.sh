#!/bin/bash

# Copia novos icones da pasta de trabalho (ajuste o caminho abaixo se necessario)
ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada"
DESTINO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/icons"

echo "📂 Copiando ícones de todas as pastas de estilo..."
for pasta in "$ORIGEM"/*/; do
  src_icons="$pasta/icons"
  if [ -d "$src_icons" ]; then
    echo "  → $(basename "$pasta")"
    cp "$src_icons"/*.png "$DESTINO"/ 2>/dev/null
    cp "$src_icons"/*.svg "$DESTINO"/ 2>/dev/null
  fi
done

echo ""
echo "📦 Subindo para o GitHub..."
cd /Users/cintiapettersen/.gemini/antigravity/scratch/next-app
git add public/icons/
git diff --cached --name-only | head -20

CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
if [ "$CHANGED" -eq "0" ]; then
  echo "✅ Nenhum ícone novo — tudo já estava atualizado!"
else
  git commit -m "atualiza icones ($CHANGED arquivo(s) alterado(s))"
  git push
  echo "🚀 Pronto! $CHANGED ícone(s) publicado(s) no Vercel."
fi
