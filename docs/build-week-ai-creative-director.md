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
