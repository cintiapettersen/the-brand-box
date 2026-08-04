import fs from 'fs';
const data = JSON.parse(fs.readFileSync('/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/src/data/editData.json', 'utf8'));
const baby = data.find(d => d.marca === 'Baby Boom' || d.id === 'Baby Boom' || (d.formData && d.formData.marca === 'Baby Boom'));
if (baby) {
  console.log("Estilo:", baby.resultadoFinal?.estiloNome);
  console.log("Referências de Estampa (brand.estampas):", baby.estampas?.length);
  console.log("Referências de URL:", baby.estampas?.map(e => e.image_url));
} else {
  console.log("Not found in editData.json");
}
