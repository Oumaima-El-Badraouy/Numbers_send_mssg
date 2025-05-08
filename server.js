// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const puppeteer = require('puppeteer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.use(express.static(__dirname)); // pour servir ton HTML
// app.use(express.urlencoded({ extended: true }));

// app.post('/send-messages', upload.single('file'), async (req, res) => {
//   const message = req.body.message;
//   const filePath = req.file.path;

//   // Lire fichier Excel
//   const workbook = xlsx.readFile(filePath);
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = xlsx.utils.sheet_to_json(sheet);
//   const numbers = data.map(row => String(row.Numero).replace(/\D/g, '')); // Nettoyer les numéros

//   fs.unlinkSync(filePath); // Supprimer le fichier après lecture

//   try {
//     const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();

//     await page.goto('https://web.whatsapp.com');
//     console.log('Connecte-toi à WhatsApp Web');

//     await new Promise(resolve => setTimeout(resolve, 50000)); // 50s pour scanner QR code

//     for (let number of numbers) {
//       const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
//       try {
//         await page.goto(url);
//         await page.waitForSelector('a[href*="send"]', { timeout: 10000 });

//         // Clique sur le bouton "Envoyer" directement sans intervention manuelle
//         await page.click('a[href*="send"]');

//         await new Promise(r => setTimeout(r, 3000)); // attendre un peu avant de passer au suivant
//       } catch (e) {
//         console.error(`Erreur avec le numéro ${number}:`, e.message);
//       }
//     }

//     res.send('Messages envoyés avec succès !');
//   } catch (err) {
//     console.error(err);
//     res.send('Erreur lors de l’envoi');
//   }
// });

// app.listen(3000, () => console.log('Server on http://localhost:3000'));



const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname));

app.post('/send-messages', upload.single('file'), async (req, res) => {
  const message = req.body.message;
  const filePath = req.file.path;

  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  const numbers = data.map(row => String(row.Numero).replace(/\D/g, ''));

  fs.unlinkSync(filePath);

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto('https://web.whatsapp.com');
    console.log('📱 Scan the QR code (tu as 2min)...');

    // attendre que l'utilisateur scanne le QR code
    await new Promise(resolve => setTimeout(resolve, 120000));

    for (let number of numbers) {
      const url = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
      await page.goto(url, { waitUntil: 'networkidle2' });

      try {
        // attendre que le champ de message apparaisse
        await page.waitForSelector('div[contenteditable="true"]', { timeout: 15000 });

        // appuyer sur "Enter" pour envoyer le message
        await page.keyboard.press('Enter');

        console.log(`✅ Message envoyé à ${number}`);
      } catch (err) {
        console.error(`❌ Échec d'envoi à ${number}`);
      }

      // petite pause entre les envois
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    res.send('✅ Tous les messages ont été traités.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l’envoi');
  }
});

app.listen(3000, () => console.log('🟢 Server running at http://localhost:3000'));
