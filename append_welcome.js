const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.sucesso = enData.sucesso || {};
enData.sucesso.welcome_title_returning = "your Brand Box is waiting for you!";
enData.sucesso.welcome_title_new = "your brand started taking shape ✨";
enData.sucesso.welcome_desc_returning_1 = "Your brand is still here, ready to evolve with you.";
enData.sucesso.welcome_desc_returning_2 = "Continue exploring combinations, adjusting details, and building a brand that is increasingly yours.";
enData.sucesso.welcome_desc_new_1 = "This is the first step of your Brand Box.";
enData.sucesso.welcome_desc_new_2 = "From now on, we will guide you through a creative experience built to transform ideas, references, and essence into a complete visual identity.";
enData.sucesso.welcome_desc_new_3 = "You make the choices. We organize the path.";
enData.sucesso.welcome_btn_returning = "Enter my Brand Box →";
enData.sucesso.welcome_btn_new = "Start my brand →";
enData.sucesso.payment_confirmed = "Payment confirmed";

ptData.sucesso = ptData.sucesso || {};
ptData.sucesso.welcome_title_returning = "sua Brand Box está te esperando!";
ptData.sucesso.welcome_title_new = "sua marca começou a ganhar forma ✨";
ptData.sucesso.welcome_desc_returning_1 = "Sua marca continua aqui, pronta para evoluir com você.";
ptData.sucesso.welcome_desc_returning_2 = "Continue explorando combinações, ajustando detalhes e construindo uma marca cada vez mais sua.";
ptData.sucesso.welcome_desc_new_1 = "Esse é o primeiro passo da sua Brand Box.";
ptData.sucesso.welcome_desc_new_2 = "A partir de agora, vamos te guiar por uma experiência criativa construída para transformar ideias, referências e essência em uma identidade visual completa.";
ptData.sucesso.welcome_desc_new_3 = "Você faz as escolhas. Nós organizamos o caminho.";
ptData.sucesso.welcome_btn_returning = "Entrar na minha Brand Box →";
ptData.sucesso.welcome_btn_new = "Começar minha marca →";
ptData.sucesso.payment_confirmed = "Pagamento confirmado";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Welcome dictionaries updated');
