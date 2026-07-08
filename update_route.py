import re

path = 'src/app/api/matchmaker/route.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_dados = """    DADOS DA CLIENTE:
    Nome: ${body.nome}
    Área de Atuação: ${body.atuacao} - ${body.atuacaoOutra}
    Público Alvo: ${body.publico}
    Identidade / Energia da Marca: ${body.identidade}
    Sensações desejadas: ${body.sentimentos.join(", ")}
    Elementos Visuais exigidos na arte: ${body.elementosVisuais ? body.elementosVisuais.join(", ") : "Nenhum específico"}"""

new_dados = """    DADOS DA CLIENTE:
    Nome: ${body.nome}
    Área de Atuação: ${body.atuacao} - ${body.atuacaoOutra}
    Público Alvo: ${body.publico}
    Primeira Impressão Desejada: ${body.primeiraImpressao || "Não informada"}
    Personalidade da Marca: ${body.personalidade || body.identidade || "Não informada"}
    Sensações Pós-Interação: ${body.sentimentos ? body.sentimentos.join(", ") : "Não informadas"}
    Onde a marca mais vai aparecer: ${body.locais ? body.locais.join(", ") : "Não informados"}
    Marcas de Inspiração (Estilo Calibrado): ${body.inspiracoes || "Nenhuma informada"}
    O que NUNCA pensar da marca (Red Flags): ${body.nuncaPensar || "Nenhuma restrição informada"}
    Elementos Visuais exigidos na arte: ${body.elementosVisuais ? body.elementosVisuais.join(", ") : "Nenhum específico"}"""

content = content.replace(old_dados, new_dados)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("route.js updated!")
