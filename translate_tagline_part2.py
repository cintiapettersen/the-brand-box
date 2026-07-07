import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
        pt = json.load(f)

    en['tagline_tab'].update({
        'one_line': '1 Line',
        'two_lines': '2 Lines',
        'scale': 'Tagline Scale',
        'distance': 'Distance',
        'distance_tagline': 'Tagline Distance',
        'spacing_slider': 'Spacing'
    })

    pt['tagline_tab'].update({
        'one_line': '1 Linha',
        'two_lines': '2 Linhas',
        'scale': 'Escala Tagline',
        'distance': 'Distância',
        'distance_tagline': 'Distância Tagline',
        'spacing_slider': 'Espaçamento'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)
    with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
        json.dump(pt, f, indent=2, ensure_ascii=False)

def update_page_js():
    with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Note: We must NOT use single quotes wrapping the JS template, to avoid syntax errors
    content = content.replace(
        ">1 Linha</button>",
        ">{dictionary?.tagline_tab?.one_line || '1 Linha'}</button>"
    )
    content = content.replace(
        ">2 Linhas</button>",
        ">{dictionary?.tagline_tab?.two_lines || '2 Linhas'}</button>"
    )
    content = content.replace(
        ">Escala Tagline</span>",
        ">{dictionary?.tagline_tab?.scale || 'Escala Tagline'}</span>"
    )
    content = content.replace(
        ">Distância</span>",
        ">{dictionary?.tagline_tab?.distance || 'Distância'}</span>"
    )
    content = content.replace(
        ">Distância Tagline</span>",
        ">{dictionary?.tagline_tab?.distance_tagline || 'Distância Tagline'}</span>"
    )
    content = content.replace(
        ">Espaçamento</span>",
        ">{dictionary?.tagline_tab?.spacing_slider || 'Espaçamento'}</span>"
    )

    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)

update_dictionaries()
update_page_js()
print('Tagline tab extra elements updated!')
