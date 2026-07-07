import os

path = 'src/lib/styleIcons.js'
with open(path, 'r') as f:
    content = f.read()

mapping = """
export const ESTILO_NOME_BY_ID = {
  2: 'Jardim Encantado',
  3: 'Escandinavo Acolhedor',
  8: 'Doce Encantamento',
  5: 'Essência Atemporal',
  6: 'Raízes & Cuidado',
  11: 'Estético Editorial'
};
"""

content = mapping + '\n' + content

with open(path, 'w') as f:
    f.write(content)

