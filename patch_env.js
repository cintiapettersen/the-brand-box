const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(dir, function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace process.env.SUPABASE_SERVICE_ROLE_KEY
    if (content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY') && !content.includes('.replace(/[')) {
      content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY/g, "(process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/['\"]/g, '') : undefined)");
      changed = true;
    }

    // Replace process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (content.includes('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY') && !content.includes('.replace(/[')) {
      content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/g, "(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.replace(/['\"]/g, '') : undefined)");
      changed = true;
    }

    // Replace GEMINI_API_KEY
    if (content.includes('process.env.GEMINI_API_KEY') && !content.includes('.replace(/[')) {
      content = content.replace(/process\.env\.GEMINI_API_KEY/g, "(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['\"]/g, '') : undefined)");
      changed = true;
    }
    
    // Replace STRIPE_SECRET_KEY
    if (content.includes('process.env.STRIPE_SECRET_KEY') && !content.includes('.replace(/[')) {
      content = content.replace(/process\.env\.STRIPE_SECRET_KEY/g, "(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.replace(/['\"]/g, '') : undefined)");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched', filePath);
    }
  }
});
