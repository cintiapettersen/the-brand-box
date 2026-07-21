const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log("Navigating to URL...");
  await page.goto('http://localhost:3000/pt-BR/sucesso?avulso=inicio&itens=%5B%22Cart%C3%A3o%20de%20Visita%22%5D', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  console.log("Looking for buttons...");
  try {
     await page.waitForSelector('button', { timeout: 15000 });
     const buttons = await page.$$('button');
     for (const btn of buttons) {
       const text = await page.evaluate(el => el.textContent, btn);
       if (text.toLowerCase().includes('começar') || text.toLowerCase().includes('start')) {
         console.log("Clicking start button...");
         await btn.click();
         break;
       }
     }
  } catch(e) {
     console.log("Button not found", e.message);
  }

  console.log("Waiting a bit...");
  await new Promise(r => setTimeout(r, 5000));
  
  console.log("Done");
  await browser.close();
})();
