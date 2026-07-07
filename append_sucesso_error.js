const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.sucesso = enData.sucesso || {};
enData.sucesso.error_not_found_title = "Oops! We couldn't find your brand";
enData.sucesso.error_not_found_desc_1 = "We couldn't locate your visual identity data. This can happen if the link has expired or if there was an error during checkout.";
enData.sucesso.error_not_found_desc_2 = "Tip: Check your email, look for the confirmation message from The Brand Box, and try accessing the exclusive link again.";
enData.sucesso.error_btn_new = "Create new brand";
enData.sucesso.error_btn_retry = "Try again";
enData.sucesso.error_btn_support = "Contact support";

ptData.sucesso = ptData.sucesso || {};
ptData.sucesso.error_not_found_title = "Ops! Não encontramos sua marca";
ptData.sucesso.error_not_found_desc_1 = "Não conseguimos localizar os dados da sua identidade visual. Isso pode acontecer se o link expirou ou se houve um erro na finalização.";
ptData.sucesso.error_not_found_desc_2 = "Dica: Verifique seu e-mail, procure pela mensagem de confirmação do The Brand Box e tente acessar o link exclusivo novamente.";
ptData.sucesso.error_btn_new = "Criar nova marca";
ptData.sucesso.error_btn_retry = "Tentar novamente";
ptData.sucesso.error_btn_support = "Falar com suporte";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Sucesso error dictionaries updated');
