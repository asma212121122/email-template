const nodemailer = require('nodemailer');
const fs = require('fs');
const juice = require('juice');
const path = require('path');
const mime = require('mime-types');

// Infos fixes
const EMAIL_USER = 'chohraasma641@gmail.com';
const EMAIL_PASS = 'xtdi dfkt spqp mjrm'; // mot de passe d'application
const RECIPIENT = 'asmachohra84@gmail.com';
const SUBJECT = '⏰ NexZero.FTC - 24h Left to Register!';

// Logger simplifié
const log = (msg, level = "INFO") => {
  console.log(`[${level}] ${new Date().toISOString()} ${msg}`);
};

// Fonction pour convertir les images en base64
function convertImageToBase64(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath.replace(/^\//, ''));
    const mimeType = mime.lookup(fullPath);
    const fileData = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${fileData.toString('base64')}`;
  } catch (e) {
    log(`Erreur de conversion de l'image : ${filePath}`, 'ERROR');
    return '';
  }
}

// Remplace les balises <img src="..."> par base64
function embedImages(html) {
  return html.replace(/src=["']([^"']+)["']/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith('data:')) return match;
    const base64 = convertImageToBase64(src);
    return base64 ? `src="${base64}"` : match;
  });
}

// Envoi du mail
async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  try {
    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'style.css');

    let html = fs.readFileSync(htmlPath, 'utf-8');
    const css = fs.readFileSync(cssPath, 'utf-8');

    // Inline CSS
    html = juice.inlineContent(html, css);

    // Embed images
    html = embedImages(html);

    const info = await transporter.sendMail({
      from: `"NexZero FTC" <${EMAIL_USER}>`,
      to: RECIPIENT,
      subject: SUBJECT,
      html
    });

    log(`✅ Email envoyé avec succès: ${info.messageId}`);
  } catch (err) {
    log(`Erreur d'envoi d'email: ${err.message}`, 'ERROR');
  }
}

sendEmail();
