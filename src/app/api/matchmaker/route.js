import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // O Next.js pega a chave no arquivo que você acabou de salvar
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ATUALIZAÇÃO REVOLUCIONÁRIA: A chave dela é tão nova que o Google disponibilizou
    // exclusivamente a nova frota Gemini 2.5 para ela!
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" } 
    });

    const systemPrompt = `
    Você é a Diretora de Arte e Consultora de Branding premium da "Sonho de Papel". 
    Seu objetivo é analisar as respostas da cliente e escolher o Estilo Visual pré-existente perfeito para ela.
    
    Tabelas de Equivalência e Lógica:
    - Se a área (atuacao) for Médica/Saúde (Pediatria, Obstetrícia, Clínica) ou 'Sofisticação e elegância', aumente a "SOFISTICAÇÃO".
    - Se atende Crianças/Bebês (publico) ou marcou 'Brincalhona, colorida', aumente a "LUDICIDADE".
    
    ESTILOS DISPONÍVEIS:
    1: Poético Navegante (Delicado, acolhedor. Ludicidade base. Bom para infanto-maternal afetuoso).
    2: Jardim Encantado (Ludicidade Alta. Sensação de natureza, crianças).
    3: Clínico Sofisticado (Sofisticação Alta. Foco em saúde adulta/mulheres).
    4: Lúdico Afetivo (Brincalhão, super colorido, bebês).
    5: Institucional Ilustrado (Organizado, escolar).
    
    DADOS DA CLIENTE:
    Nome: ${body.nome}
    Área de Atuação: ${body.atuacao} - ${body.atuacaoOutra}
    Público Alvo: ${body.publico}
    Sensações desejadas: ${body.sentimentos.join(", ")}
    
    Aja como uma consultora mágica. Identifique o melhor estilo (número de 1 a 5) com base nestas regras.
    Responda EXCLUSIVAMENTE num formato JSON estruturado com 'estiloId' (numero), 'estiloNome' (string) e 'mensagem' (string).
    {
       "estiloId": 1,
       "estiloNome": "Poético Navegante",
       "mensagem": "Olá [Nome], após analisar o seu trabalho com [Público] focado em [Sensação]..."
    }
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    return Response.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Erro fatal no Matchmaker AI:", error);
    return Response.json({ error: "Falha na análise da Casamenteira." }, { status: 500 });
  }
}
