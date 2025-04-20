const nodemailer = require('nodemailer');
const fs = require('fs');
const juice = require('juice');

// Lire le HTML brut
let rawHtml = fs.readFileSync('./index.html', 'utf-8');

// Inliner le CSS
let htmlContent = juice(rawHtml);

// Créer le transporteur
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chohraasma641@gmail.com',
    pass: 'xtdi dfkt spqp mjrm'
  }
});

// Configurer l’email
const mailOptions = {
  from: 'chohraasma641@gmail.com',
  to: 'asmachohra84@gmail.com',
  subject: 'Registrations are open!',
  html: htmlContent
};

// Envoyer l’email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Erreur :', error);
  }
  console.log('Email envoyé :', info.response);
});
