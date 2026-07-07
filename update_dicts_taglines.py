import json

taglines_pt = {
    "Jardim Encantado": ["Onde a imaginação encontra o cuidado", "Criatividade que floresce todos os dias", "O olhar lúdico e afetuoso da infância"],
    "Escandinavo Acolhedor": ["Onde o cuidado encontra o aconchego", "A beleza da simplicidade no acolhimento", "Cuidado gentil que transforma e acolhe"],
    "Essência Atemporal": ["A sutil arte de revelar sua melhor versão", "Onde a simplicidade encontra o extraordinário", "Sutileza, elegância e essência"],
    "Doce Encantamento": ["Feito para encantar e acolher a alma", "Criações exclusivas que carregam afeto", "Delicadeza, arte e essência"],
    "Raízes & Cuidado": ["Orgânico, consciente e acolhedor", "Essência da terra, respeito ao tempo", "Onde o tempo vira afeto"],
    "Estético Editorial": ["Presença, precisão e estratégia", "Estrutura, precisão e presença", "Presença atemporal e estratégica", "A estética da excelência e da autoridade", "Técnica, elegância e exclusividade"]
}

taglines_en = {
    "Jardim Encantado": ["Where imagination meets care", "Creativity that blooms every day", "The playful and affectionate look of childhood"],
    "Escandinavo Acolhedor": ["Where care meets coziness", "The beauty of simplicity in welcoming", "Gentle care that transforms and welcomes"],
    "Essência Atemporal": ["The subtle art of revealing your best version", "Where simplicity meets the extraordinary", "Subtlety, elegance, and essence"],
    "Doce Encantamento": ["Made to enchant and welcome the soul", "Exclusive creations that carry affection", "Delicacy, art, and essence"],
    "Raízes & Cuidado": ["Organic, conscious, and welcoming", "Essence of the earth, respect for time", "Where time becomes affection"],
    "Estético Editorial": ["Presence, precision, and strategy", "Structure, precision, and presence", "Timeless and strategic presence", "The aesthetic of excellence and authority", "Technique, elegance, and exclusivity"]
}

with open('src/dictionaries/pt.json', 'r') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r') as f:
    en_data = json.load(f)

if 'postmatch' not in pt_data:
    pt_data['postmatch'] = {}
if 'postmatch' not in en_data:
    en_data['postmatch'] = {}

pt_data['postmatch']['taglines_by_estilo'] = taglines_pt
en_data['postmatch']['taglines_by_estilo'] = taglines_en

pt_data['postmatch']['step_115_placeholder'] = "Ex: Cuidado que transforma vidas · Design com Propósito · Beleza Consciente"
en_data['postmatch']['step_115_placeholder'] = "Ex: Care that transforms lives · Design with Purpose · Conscious Beauty"

with open('src/dictionaries/pt.json', 'w') as f:
    json.dump(pt_data, f, ensure_ascii=False, indent=2)

with open('src/dictionaries/en.json', 'w') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

