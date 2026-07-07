const fs = require('fs');
const enPath = 'src/dictionaries/en.json';
const ptPath = 'src/dictionaries/pt.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

enData.digital_tab = enData.digital_tab || {};
enData.digital_tab.contact_labels = {
  telefone: "📞 Phone",
  whatsapp: "💬 WhatsApp",
  email: "✉️ E-mail",
  site: "🌐 Website",
  instagram: "📸 Instagram",
  endereco: "📍 Address"
};

ptData.digital_tab = ptData.digital_tab || {};
ptData.digital_tab.contact_labels = {
  telefone: "📞 Telefone",
  whatsapp: "💬 WhatsApp",
  email: "✉️ E-mail",
  site: "🌐 Site",
  instagram: "📸 Instagram",
  endereco: "📍 Endereço"
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
console.log('Contact labels dictionaries updated');
