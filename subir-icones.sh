#!/bin/bash

ORIGEM="/Users/cintiapettersen/Downloads/Meu 2026 Projets/plataforma guiada"
DESTINO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/icons"
PROJETO="/Users/cintiapettersen/.gemini/antigravity/scratch/next-app"
STYLE_JS="$PROJETO/src/lib/styleIcons.js"

echo "📂 Preparando para sincronizar ícones e AUTOMATIZAR o código do site..."

# Limpa a pasta pública do projeto para garantir que o que foi deletado nos downloads também saia do site
rm -f "$DESTINO"/*.png "$DESTINO"/*.svg 2>/dev/null

# Função para converter a pasta do seu Mac para o nome real aceito no site
get_style_name() {
  case "$1" in
    "Doce encantamento") echo "Doce Encantamento" ;;
    "Escandinavo Acolhedor") echo "Escandinavo Acolhedor" ;;
    "Essencia Atemporal") echo "Essência Atemporal" ;;
    "Estetico Editorial") echo "Estético Editorial" ;;
    "Jardim Encantado") echo "Jardim Encantado" ;;
    "Raiz natual") echo "Raízes & Cuidado" ;;
    *) echo "" ;;
  esac
}

# Inicia o texto do novo documento styleIcons.js
NEW_JS="export const STYLE_ICONS = {\n"
TOTAL_COPIADOS=0

for pasta in "$ORIGEM"/*/; do
  if [ -d "$pasta" ]; then
    nome_pasta="$(basename "$pasta")"
    estilo="$(get_style_name "$nome_pasta")"
    
    if [ -n "$estilo" ]; then
      src_icons="$pasta/icons"
      
      if [ -d "$src_icons" ]; then
        NEW_JS="$NEW_JS  '$estilo': [\n"
        count=0
        
        # Copia todos os icones dessa pasta
        for f in "$src_icons"/*.png "$src_icons"/*.svg; do
          if [ -f "$f" ]; then
            filename="$(basename "$f")"
            cp "$f" "$DESTINO"/
            
            # Formata o id (tira a extensao) e a label para ficar legível
            id="${filename%.*}"
            label_temp="${id/icon-_icon-/}"
            label_temp="${label_temp/icon-/}"
            label="${label_temp//[-_]/ }" # Troca traços por espaço
            
            NEW_JS="$NEW_JS    { id: '$id', label: '$label', path: '/icons/$filename' },\n"
            count=$((count+1))
            TOTAL_COPIADOS=$((TOTAL_COPIADOS+1))
          fi
        done
        NEW_JS="$NEW_JS  ],\n"
        [ "$count" -gt "0" ] && echo "  → $estilo ($count ícones copiados)"
      fi
    fi
  fi
done

# Finaliza o conteúdo do JS
NEW_JS="$NEW_JS};\n\nexport const getIconById = (estiloNome, iconId) => {\n  const icons = STYLE_ICONS[estiloNome] || [];\n  return icons.find(i => i.id === iconId) || null;\n};\n"

# Sobrescreve o arquivo styleIcons.js com o texto que montamos automaticamente
echo -e "$NEW_JS" > "$STYLE_JS"

if [ "$TOTAL_COPIADOS" -eq "0" ]; then
  echo "⚠️ Nenhum ícone foi encontrado nas subpastas do Downloads."
  echo "Verifique se eles estão dentro das pastas 'icons' corretas."
fi

cd "$PROJETO"

echo ""
echo "🧹 Preparando os arquivos para subir..."
# Garante que as deleções também façam parte do commit
git add -A public/icons/ 2>/dev/null
git add src/lib/styleIcons.js 2>/dev/null

CHANGED_ICONS=$(git diff --cached --name-only public/icons/ | wc -l | tr -d ' ')
CHANGED_JS=$(git diff --cached --name-only src/lib/styleIcons.js | wc -l | tr -d ' ')

if [ "$CHANGED_ICONS" -eq "0" ] && [ "$CHANGED_JS" -eq "0" ]; then
  echo ""
  echo "✅ Nenhum ícone novo e nenhuma alteração encontrada. Tudo atualizado!"
  exit 0
fi

echo ""
echo "📦 Resumo das alterações que irão para o Vercel:"
git diff --cached --name-status | sed 's|^|  → |'

git commit -m "atualiza ícones e mapeamento automático"
git push

echo ""
echo "🚀 Sucesso! Todo o processo 100% automático foi concluído e publicado no Vercel!"
