const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.onboarding = enData.onboarding || {};
enData.onboarding.resume_title = "You have a saved progress!";
enData.onboarding.resume_subtitle = "Do you want to continue where you left off or start a new brand?";
enData.onboarding.resume_btn_continue = "Continue where I left off";
enData.onboarding.resume_btn_restart = "Start from scratch";

ptData.onboarding = ptData.onboarding || {};
ptData.onboarding.resume_title = "Você tem um progresso salvo!";
ptData.onboarding.resume_subtitle = "Quer continuar de onde parou ou começar uma nova marca?";
ptData.onboarding.resume_btn_continue = "Continuar de onde parei";
ptData.onboarding.resume_btn_restart = "Começar do zero";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Resume dictionaries updated');
