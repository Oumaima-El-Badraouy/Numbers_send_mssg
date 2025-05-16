const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.post('/send-messages', upload.single('file'), async (req, res) => {
  const message = req.body.message;
  const sessionId = req.body.sessionId || `session-${Date.now()}`;
  const filePath = req.file.path;

  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  const numbers = data.map(row => String(row.Numero).replace(/\D/g, ''));

  fs.unlinkSync(filePath); // Supprime le fichier uploadé

  try {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: `./sessions/${sessionId}`,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(`https://web.whatsapp.com`);
    console.log("🟡 Scan le QR Code (10s)...");
    await new Promise(r => setTimeout(r, 50000)); // 10 sec pour scanner

    for (let number of numbers) {
      const url = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
      await page.goto(url, { waitUntil: 'networkidle2' });

     
      

      try {
        await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 5000 });

        // Juste appuyer sur Enter (le message est déjà pré-rempli par l'URL)
        await page.keyboard.press('Enter');

        console.log(`✅ Message envoyé à ${number}`);
        await new Promise(r => setTimeout(r, 4000)); 
      } catch (e) {
        console.error(`❌ Erreur avec ${number}: ${e.message}`);
      }
    }
 await new Promise(r => setTimeout(r, 3000)); 
    await browser.close();
    res.send('✅ Tous les messages ont été envoyés avec succès !');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erreur lors de l’envoi des messages');
  }
});

app.listen(3000, () => console.log('🚀 Serveur lancé sur http://localhost:3000'));