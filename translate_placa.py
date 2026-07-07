import json

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

# Update nav
en_data['nav']['placa'] = "Brand Board"
pt_data['nav']['placa'] = "Brand Board"

# Add placa keys
pt_data['placa'] = {
    "logomarca_principal": "LOGOMARCA PRINCIPAL",
    "paleta_de_cores": "PALETA DE CORES",
    "tipografia": "TIPOGRAFIA",
    "submarca": "SUBMARCA",
    "estampa": "ESTAMPA",
    "estampa_exclusiva": "ESTAMPA EXCLUSIVA",
    "baixar": "⬇ Baixar Brand Board"
}

en_data['placa'] = {
    "logomarca_principal": "MAIN LOGO",
    "paleta_de_cores": "COLOR PALETTE",
    "tipografia": "TYPOGRAPHY",
    "submarca": "SUBMARK",
    "estampa": "PATTERN",
    "estampa_exclusiva": "EXCLUSIVE PATTERN",
    "baixar": "⬇ Download Brand Board"
}

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

print("Placa dictionary updated.")
