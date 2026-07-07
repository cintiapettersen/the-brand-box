import json

pt_geral = [
  {
    "id": "origem",
    "pergunta": "Como você descreveria a origem da sua marca?",
    "opcoes": ["Nasceu de um sonho pessoal e paixão", "De uma necessidade que eu mesma senti", "Queria mudar algo no meu mercado", "Foi evoluindo naturalmente da minha vida"]
  },
  {
    "id": "cliente",
    "pergunta": "Para quem você cria?",
    "opcoes": ["Mulheres que buscam cuidado e acolhimento", "Pessoas que valorizam qualidade e exclusividade", "Quem quer se sentir especial no dia a dia", "Mulheres em transformação e autoconhecimento"]
  },
  {
    "id": "promessa",
    "pergunta": "O que você entrega além do produto/serviço?",
    "opcoes": ["Uma experiência de leveza e beleza", "Confiança e segurança", "Conexão e pertencimento", "Transformação e empoderamento"]
  },
  {
    "id": "essencia",
    "pergunta": "Se sua marca fosse uma sensação, seria…",
    "opcoes": ["Aquele abraço quentinho", "A leveza de uma manhã ensolarada", "A elegância de algo feito à mão com amor", "A emoção de uma descoberta"]
  },
  {
    "id": "diferencial",
    "pergunta": "O que torna sua marca única?",
    "opcoes": ["O carinho em cada detalhe", "A autenticidade e história real por trás", "A combinação de estética e propósito", "O olhar humano e personalizado"]
  }
]

en_geral = [
  {
    "id": "origem",
    "pergunta": "How would you describe the origin of your brand?",
    "opcoes": ["It was born from a personal dream and passion", "From a need I felt myself", "I wanted to change something in my market", "It evolved naturally from my life"]
  },
  {
    "id": "cliente",
    "pergunta": "Who do you create for?",
    "opcoes": ["Women seeking care and welcoming", "People who value quality and exclusivity", "Those who want to feel special every day", "Women in transformation and self-discovery"]
  },
  {
    "id": "promessa",
    "pergunta": "What do you deliver besides the product/service?",
    "opcoes": ["An experience of lightness and beauty", "Confidence and security", "Connection and belonging", "Transformation and empowerment"]
  },
  {
    "id": "essencia",
    "pergunta": "If your brand were a sensation, it would be…",
    "opcoes": ["That warm hug", "The lightness of a sunny morning", "The elegance of something handmade with love", "The emotion of a discovery"]
  },
  {
    "id": "diferencial",
    "pergunta": "What makes your brand unique?",
    "opcoes": ["The care in every detail", "The authenticity and real story behind it", "The combination of aesthetics and purpose", "The human and personalized touch"]
  }
]

pt_saude = [
  {
    "id": "origem",
    "pergunta": "O que te levou a escolher essa área da saúde?",
    "opcoes": ["Uma vocação que sempre existiu em mim", "A vontade de fazer a diferença na vida das pessoas", "Uma experiência pessoal que me transformou", "O desejo de unir ciência e acolhimento"]
  },
  {
    "id": "publico",
    "pergunta": "Você atende principalmente…",
    "opcoes": ["Crianças e suas famílias", "Mulheres em diferentes fases da vida", "Adultos em geral", "Pessoas em busca de equilíbrio mental e emocional"]
  },
  {
    "id": "paciente",
    "pergunta": "Como você quer que seus pacientes se sintam ao te procurar?",
    "opcoes": ["Acolhidos e seguros desde o primeiro contato", "Confiantes de que estão em boas mãos", "Ouvidos e respeitados em cada detalhe", "Em paz — como se finalmente encontrassem a pessoa certa"]
  },
  {
    "id": "promessa",
    "pergunta": "O que você entrega além do atendimento técnico?",
    "opcoes": ["Humanização e escuta verdadeira", "Clareza e confiança para o paciente e família", "Um espaço seguro para falar abertamente", "Cuidado que vai além da consulta"]
  },
  {
    "id": "essencia",
    "pergunta": "Se seu consultório fosse uma sensação, seria…",
    "opcoes": ["Aquele abraço de mãe que acalma tudo", "A leveza de sair com respostas e tranquilidade", "A segurança de estar em mãos competentes e gentis", "A clareza de finalmente entender o que está acontecendo"]
  },
  {
    "id": "diferencial",
    "pergunta": "O que torna sua prática única?",
    "opcoes": ["O olhar humano e a presença de verdade", "A combinação de rigor técnico e cuidado gentil", "A forma como explico e envolvo a família no processo", "O vínculo que construo com cada paciente ao longo do tempo"]
  }
]

en_saude = [
  {
    "id": "origem",
    "pergunta": "What led you to choose this area of healthcare?",
    "opcoes": ["A calling that always existed within me", "The desire to make a difference in people's lives", "A personal experience that transformed me", "The desire to unite science and welcoming care"]
  },
  {
    "id": "publico",
    "pergunta": "Who do you primarily serve?",
    "opcoes": ["Children and their families", "Women in different phases of life", "Adults in general", "People seeking mental and emotional balance"]
  },
  {
    "id": "paciente",
    "pergunta": "How do you want your patients to feel when they seek you?",
    "opcoes": ["Welcomed and safe from the first contact", "Confident that they are in good hands", "Heard and respected in every detail", "At peace — as if they finally found the right person"]
  },
  {
    "id": "promessa",
    "pergunta": "What do you deliver beyond technical care?",
    "opcoes": ["Humanization and true listening", "Clarity and confidence for the patient and family", "A safe space to speak openly", "Care that goes beyond the appointment"]
  },
  {
    "id": "essencia",
    "pergunta": "If your clinic were a sensation, it would be…",
    "opcoes": ["That motherly hug that calms everything", "The lightness of leaving with answers and peace of mind", "The security of being in competent and gentle hands", "The clarity of finally understanding what is happening"]
  },
  {
    "id": "diferencial",
    "pergunta": "What makes your practice unique?",
    "opcoes": ["The human gaze and true presence", "The combination of technical rigor and gentle care", "The way I explain and involve the family in the process", "The bond I build with each patient over time"]
  }
]

pt_tom = [
  {
    "id": "estilo",
    "pergunta": "Como você escreve para sua audiência?",
    "opcoes": ["De forma próxima e informal, como uma amiga", "Com leveza mas com cuidado — nem formal, nem íntimo demais", "De forma profissional e clara", "Com inspiração — textos que tocam e emocionam"]
  },
  {
    "id": "tratamento",
    "pergunta": "Como você trata seu cliente nas mensagens?",
    "opcoes": ["Você (próximo e direto)", "Você + nome próprio às vezes", "Prezado/a (mais formal)", "Amiga, amor, querida (muito íntimo)"]
  },
  {
    "id": "nunca",
    "pergunta": "Que tipo de comunicação você NUNCA faria?",
    "opcoes": ["Linguagem fria e corporativa", "Texto longo e difícil de ler", "Algo exagerado ou apelativo", "Conteúdo técnico sem humanização"]
  },
  {
    "id": "ritmo",
    "pergunta": "Qual o ritmo das suas mensagens?",
    "opcoes": ["Curto, direto e objetivo", "Narrativo — gosto de contar histórias", "Poético e cheio de metáforas", "Informativo e educativo"]
  }
]

en_tom = [
  {
    "id": "estilo",
    "pergunta": "How do you write for your audience?",
    "opcoes": ["In a close and informal way, like a friend", "With lightness but care — neither formal nor too intimate", "In a professional and clear way", "With inspiration — texts that touch and move"]
  },
  {
    "id": "tratamento",
    "pergunta": "How do you address your client in messages?",
    "opcoes": ["You (close and direct)", "You + first name sometimes", "Dear [Name] (more formal)", "Friend, love, darling (very intimate)"]
  },
  {
    "id": "nunca",
    "pergunta": "What kind of communication would you NEVER do?",
    "opcoes": ["Cold and corporate language", "Long and difficult to read text", "Something exaggerated or appealing", "Technical content without humanization"]
  },
  {
    "id": "ritmo",
    "pergunta": "What is the rhythm of your messages?",
    "opcoes": ["Short, direct, and objective", "Narrative — I like to tell stories", "Poetic and full of metaphors", "Informative and educational"]
  }
]

with open('src/dictionaries/pt.json', 'r', encoding='utf-8') as f:
    pt_data = json.load(f)

with open('src/dictionaries/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

pt_data['quiz_perguntas_geral'] = pt_geral
pt_data['quiz_perguntas_saude'] = pt_saude
pt_data['tomdevoz_perguntas'] = pt_tom

en_data['quiz_perguntas_geral'] = en_geral
en_data['quiz_perguntas_saude'] = en_saude
en_data['tomdevoz_perguntas'] = en_tom

with open('src/dictionaries/pt.json', 'w', encoding='utf-8') as f:
    json.dump(pt_data, f, indent=2, ensure_ascii=False)

with open('src/dictionaries/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Added questions to dictionaries.")
