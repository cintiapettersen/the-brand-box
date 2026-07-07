const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.sucesso = enData.sucesso || {};
enData.sucesso.instructions_subtitle = "Instructions & Tips";
enData.sucesso.instructions_title = "How to enjoy your experience";
enData.sucesso.instructions_item1_title = "Use a Computer";
enData.sucesso.instructions_item1_desc = "For a better visual experience and ease when downloading arts and files in high quality.";
enData.sucesso.instructions_item2_title = "Follow the Next Button";
enData.sucesso.instructions_item2_desc = "Advancing step by step helps build your visual identity smoothly and naturally.";
enData.sucesso.instructions_item3_title = "Answer Calmly & Be Present";
enData.sucesso.instructions_item3_desc = "Answer the questions with care and presence while experiencing the creation of your brand.";
enData.sucesso.instructions_item4_title = "Check the Help Guide";
enData.sucesso.instructions_item4_desc = "When in doubt, our Help tab has all the tips and inspirations to support you in the process.";
enData.sucesso.instructions_closing = '"We wish you an excellent experience with The Brand Box!" 🤍';
enData.sucesso.instructions_btn_start = "Start my experience →";

ptData.sucesso = ptData.sucesso || {};
ptData.sucesso.instructions_subtitle = "Instruções & Dicas";
ptData.sucesso.instructions_title = "Como aproveitar sua experiência";
ptData.sucesso.instructions_item1_title = "Use um Computador";
ptData.sucesso.instructions_item1_desc = "Para melhor aproveitamento visual e facilidade ao baixar as artes e arquivos em alta qualidade.";
ptData.sucesso.instructions_item2_title = "Siga o Botão de Avançar";
ptData.sucesso.instructions_item2_desc = "Avançar passo a passo ajuda a construir sua identidade visual de forma fluida e natural.";
ptData.sucesso.instructions_item3_title = "Responda com Calma & Esteja Presente";
ptData.sucesso.instructions_item3_desc = "Responda às perguntas com carinho e presença enquanto você vivencia a criação da sua marca.";
ptData.sucesso.instructions_item4_title = "Consulte o Guia de Ajuda";
ptData.sucesso.instructions_item4_desc = "Na dúvida, nossa aba de Ajuda tem todas as dicas e inspirações para te apoiar no processo.";
ptData.sucesso.instructions_closing = '"Desejamos a você uma excelente experiência com a The Brand Box!" 🤍';
ptData.sucesso.instructions_btn_start = "Começar minha experiência →";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Instructions dictionaries updated');
