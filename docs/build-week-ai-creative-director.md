# OpenAI Build Week — AI Creative Director MVP

## O que foi construído

Durante a OpenAI Build Week, o The Brand Box ganhou a primeira versão funcional do módulo **AI Creative Director**. O MVP adiciona uma camada de diagnóstico criativo personalizado após a escolha do estilo visual, sem substituir o fluxo atual do questionário nem a seleção de estilo já existente.

A nova rota server-side `/api/creative-director` recebe o briefing do questionário, o estilo escolhido, a mensagem estratégica retornada pelo matchmaker e o idioma atual da aplicação. A partir desses dados, ela solicita à OpenAI um JSON estruturado com diagnóstico, personalidade, objetivos emocionais, expectativas do público, riscos criativos e direção visual.

## Papel do Gemini

O Gemini continua sendo o responsável pela decisão de match criativo na rota `/api/matchmaker`. Ele analisa as respostas do questionário e escolhe um dos estilos visuais já cadastrados, preservando a lógica atual de seleção, mensagens e fallback.

## Papel da OpenAI

A OpenAI entra depois do match feito pelo Gemini. Ela atua como uma diretora criativa complementar, transformando o briefing e o estilo selecionado em um diagnóstico estratégico mais organizado e acionável para a usuária.

A chamada acontece somente no servidor, usando as variáveis de ambiente `OPENAI_API_KEY` e `OPENAI_MODEL`. Se a chave, o modelo ou a resposta estruturada falharem, o fluxo antigo permanece válido e a usuária continua vendo o estilo escolhido pelo Gemini.

## Papel do Codex

O Codex foi usado para implementar a integração de forma incremental e segura: revisar o fluxo existente, criar a nova rota isolada, conectar a chamada no front-end com fallback silencioso, adicionar a seção de interface e documentar a arquitetura criada durante a Build Week.

## Segunda etapa: Refinar esta direção

A segunda etapa do módulo adiciona uma experiência interativa chamada **Refinar esta direção** na tela do match perfeito. Depois que o Diagnóstico Criativo existe, a usuária pode abrir uma conversa curta com a AI Creative Director para esclarecer tensões reais do briefing, responder uma única pergunta personalizada e receber uma decisão consultiva sobre manter, ajustar ou considerar uma alternativa dentro dos estilos já cadastrados.

A nova rota `/api/creative-director/refine` trabalha em duas fases:

- `question`: compara o briefing, o estilo escolhido pelo Gemini e o diagnóstico da OpenAI para identificar uma tensão, ambiguidade ou prioridade ainda não resolvida. Se não houver tensão relevante, retorna uma pergunta padrão sobre qual aspecto visual deve ganhar mais personalidade.
- `resolution`: analisa a resposta da usuária e retorna uma recomendação estruturada com impactos em paleta, tipografia, composição e estampa.

Nesta etapa, nenhuma recomendação alternativa é aplicada automaticamente. O estilo atual continua preservado em `resultadoFinal.estiloId` e `resultadoFinal.estiloNome`; a recomendação fica registrada apenas em `resultadoFinal.creativeDirector.refinement` para revisão posterior.
