const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.help = enData.help || {};
enData.help.resend_prompt = "Need to access your files again?";
enData.help.resend_btn = "📧 Resend email with link";
enData.help.resend_sending = "Sending...";
enData.help.resend_success = "✓ Email sent!";
enData.help.resend_error = "❌ Error: ";
enData.help.resend_fail = "Failed to send";
enData.help.resend_conn_error = "❌ Connection error";

ptData.help = ptData.help || {};
ptData.help.resend_prompt = "Precisa acessar seus arquivos novamente?";
ptData.help.resend_btn = "📧 Reenviar e-mail com o link";
ptData.help.resend_sending = "Enviando...";
ptData.help.resend_success = "✓ E-mail enviado!";
ptData.help.resend_error = "❌ Erro: ";
ptData.help.resend_fail = "Falha no envio";
ptData.help.resend_conn_error = "❌ Erro de conexão";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Help actions dictionary updated');
