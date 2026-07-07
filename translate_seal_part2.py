import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['seal_tab'].update({
        'seal_color': '🏷️ Seal Color',
        'seal_text': '✍️ Seal Text',
        'brand_name': 'Brand Name',
        'brand_tagline': 'Brand Tagline',
        'icon': '🌸 Icon'
    })

    pt['seal_tab'].update({
        'seal_color': '🏷️ Cor do Selo',
        'seal_text': '✍️ Texto do Selo',
        'brand_name': 'Nome da Marca',
        'brand_tagline': 'Tagline da Marca',
        'icon': '🌸 Ícone'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

def update_page_js():
    with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Note: Using no outer single quotes around JS evaluation to avoid syntax errors
    content = content.replace(
        "🏷️ Cor do Selo",
        "{dictionary?.seal_tab?.seal_color || '🏷️ Cor do Selo'}"
    )
    content = content.replace(
        "✍️ Texto do Selo",
        "{dictionary?.seal_tab?.seal_text || '✍️ Texto do Selo'}"
    )
    # Be careful with 'Nome da Marca' and 'Tagline da Marca', they might match other tabs too, 
    # but that's fine since we can reuse seal_tab or logo_tab.
    content = content.replace(
        ">Nome da Marca</button>",
        ">{dictionary?.seal_tab?.brand_name || 'Nome da Marca'}</button>"
    )
    content = content.replace(
        ">                  Nome da Marca\n                </button>",
        ">                  {dictionary?.seal_tab?.brand_name || 'Nome da Marca'}\n                </button>"
    )
    content = content.replace(
        ">Tagline da Marca</button>",
        ">{dictionary?.seal_tab?.brand_tagline || 'Tagline da Marca'}</button>"
    )
    content = content.replace(
        ">                  Tagline da Marca\n                </button>",
        ">                  {dictionary?.seal_tab?.brand_tagline || 'Tagline da Marca'}\n                </button>"
    )
    content = content.replace(
        "🌸 Ícone",
        "{dictionary?.seal_tab?.icon || '🌸 Ícone'}"
    )

    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)

update_dictionaries()
update_page_js()
print('Seal tab extra elements updated!')
