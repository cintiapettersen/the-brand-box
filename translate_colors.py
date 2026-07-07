import json

def update_dictionaries():
    with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)

    if 'color_names' not in en:
        en['color_names'] = {}
    if 'palette_words' not in en:
        en['palette_words'] = {}

    en['color_names'].update({
        'Sol de Verão': 'Summer Sun',
        'Pêssego Suave': 'Soft Peach',
        'Rosa Algodão': 'Cotton Pink',
        'Framboesa': 'Raspberry',
        'Carmim Intenso': 'Intense Carmine',
        'Dose de Amor': 'Dose of Love',
        'Amora Selvagem': 'Wild Blackberry',
        'Âmbar Quente': 'Warm Amber',
        'Terracota': 'Terracotta',
        'Adobe Rosado': 'Pink Adobe',
        'Rosewood Suave': 'Soft Rosewood',
        'Linho Dourado': 'Golden Linen',
        'Baunilha': 'Vanilla',
        'Creme Delicado': 'Delicate Cream',
        'Verde Menta': 'Mint Green',
        'Musgo Vivo': 'Vibrant Moss',
        'Folha Densa': 'Dense Leaf',
        'Floresta': 'Forest',
        'Salvia': 'Sage',
        'Névoa Matinal': 'Morning Mist',
        'Céu Aberto': 'Open Sky',
        'Azul Serenidade': 'Serenity Blue',
        'Azul Aço': 'Steel Blue',
        'Índigo Profundo': 'Deep Indigo',
        'Azul Lavanda': 'Lavender Blue',
        'Safira': 'Sapphire',
        'Azul Marinho': 'Navy Blue',
        'Lavanda Rosa': 'Pink Lavender',
        'Malva Seda': 'Silk Mauve',
        'Ametista': 'Amethyst',
        'Violeta Real': 'Royal Violet',
        'Roxo Profundo': 'Deep Purple',
        'Misty Rose': 'Misty Rose',
        'Blush Seda': 'Silk Blush',
        'Quartzo Rosa': 'Rose Quartz',
        'Rosé Antigo': 'Antique Rose',
        'Borgonha Suave': 'Soft Burgundy',
        'Branco Algodão': 'Cotton White',
        'Prata Suave': 'Soft Silver',
        'Cinza Névoa': 'Mist Gray',
        'Granito': 'Granite',
        'Carvão': 'Charcoal',
        'Noite Profunda': 'Deep Night',
        'Limão Docinho': 'Sweet Lemon',
        'Pistache': 'Pistachio',
        'Água Turquesa': 'Turquoise Water',
        'Verde Jade': 'Jade Green',
        'Esmeralda Serena': 'Serene Emerald',
        'Coral Vivo': 'Vivid Coral',
        'Salmão': 'Salmon',
        'Canela': 'Cinnamon',
        'Cor Especial': 'Special Color',
        'Tom Especial': 'Special Tone'
    })

    en['palette_words'].update({
        'Paleta': 'Palette',
        'Jardim': 'Garden',
        'Encantado': 'Enchanted',
        'Escandinavo': 'Scandinavian',
        'Acolhedor': 'Cozy',
        'Essência': 'Essence',
        'Atemporal': 'Timeless',
        'Raízes': 'Roots',
        '&': '&',
        'Cuidado': 'Care',
        'Doce': 'Sweet',
        'Encantamento': 'Enchantment',
        'Estético': 'Aesthetic',
        'Editorial': 'Editorial',
        'Pastel': 'Pastel',
        'Suave': 'Soft',
        'Escuro': 'Dark',
        'Claro': 'Light',
        'Quente': 'Warm',
        'Frio': 'Cool',
        'Vibrante': 'Vibrant',
        'Neutro': 'Neutral',
        'Terroso': 'Earthy'
    })

    with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)

update_dictionaries()
print('Translation dictionaries updated successfully!')
