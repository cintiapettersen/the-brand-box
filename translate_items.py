import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

helper_code = """
const ITEM_KEYS_MAP = {
  'Cartão de Visita': 'cartao_visita',
  'Papel Timbrado': 'papel_timbrado',
  'Papel de Presente': 'papel_presente',
  'Tag para Sacola': 'tag_sacola',
  'Etiqueta para Correios': 'etiqueta_correios',
  'Envelope Ofício (23x11,5cm)': 'envelope_oficio',
  'Envelope Saco (24x34cm)': 'envelope_saco',
  'Recibo': 'recibo',
  'Pasta A4': 'pasta_a4',
  'Pasta': 'pasta_a4',
  'Caneca': 'caneca',
  'Cartão de Retorno': 'cartao_retorno',
  'Cartão de Agradecimento (10x15cm)': 'cartao_agradecimento',
  'Cartão de Agradecimento': 'cartao_agradecimento',
  'Caderno (Capa e Contra-capa)': 'caderno',
  'Caderno': 'caderno',
  'Receituário Padrão (A4 e A5)': 'receituario_padrao',
  'Receituário Padrão': 'receituario_padrao',
  'Atestado Médico (A4 e A5)': 'atestado_medico',
  'Atestado Médico': 'atestado_medico',
  'Receituário de Controle Especial': 'receituario_controle',
  'Checklist Maternidade': 'checklist_maternidade',
  'Orientações p/ Recém Nascidos': 'orientacoes_rn',
  'Guia de Cuidados': 'guia_cuidados',
  'Guia Alimentar': 'guia_alimentar',
  'Guia de Desenvolvimento': 'guia_desenvolvimento',
  'Cartão de Vacina': 'cartao_vacina',
  'Guia Pré-natal': 'guia_prenatal',
  'Guia do Sono': 'guia_sono',
  'Caderneta de Saúde': 'caderneta_saude',
  'Livro de Atividades': 'livro_atividades',
  'Certificado de Coragem': 'certificado_coragem',
  'Prontuário Médico': 'prontuario_medico',
  'Diário do Xixi': 'diario_xixi',
  'Meu Pratinho': 'meu_pratinho',
  'Ficha de Cadastro': 'ficha_cadastro',
  'Assinatura de E-mail': 'assinatura_email',
  'Fundo para Stories': 'fundo_stories',
  'Pack Digital para Instagram': 'pack_instagram'
};

const tItem = (itemName, dict) => {
  if (!dict || !dict.papelaria_itens) return itemName;
  const key = ITEM_KEYS_MAP[itemName];
  return key && dict.papelaria_itens[key] ? dict.papelaria_itens[key] : itemName;
};
"""

# Inject the helper right after the imports
content = re.sub(r"(import React.*?;\n\n)", r"\1" + helper_code + "\n\n", content, count=1)

# Now, substitute {item} with {tItem(item, dictionary)} where it's visibly rendered
content = re.sub(r"✨\s*\{item\}", r"✨ {tItem(item, dictionary)}", content)
content = re.sub(r"<span style=\{\{ flex: 1 \}\}>\{item\}</span>", r"<span style={{ flex: 1 }}>{tItem(item, dictionary)}</span>", content)
content = re.sub(r"\{upsellSelecionados\.includes\(item\) \? '✓ ' : '\+ '\}\$\{item\}", r"{upsellSelecionados.includes(item) ? '✓ ' : '+ '}${tItem(item, dictionary)}", content)
content = re.sub(r"\{item\}\s*\{isCaderneta", r"{tItem(item, dictionary)} {isCaderneta", content)
content = re.sub(r"uppercase' \}\}>\{item\}</div>", r"uppercase' }}>{tItem(item, dictionary)}</div>", content)

# Also fix the explicit string "Capa e Contra-capa" in CadernoPreview
content = re.sub(r">\s*Capa e Contra-capa\s*<", r">{dictionary?.papelaria_itens?.capa_contra_capa || 'Capa e Contra-capa'}<", content)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Items translation applied.")
