/**
 * Email Utility
 *
 * Gère l'envoi d'emails pour:
 * - Réinitialisation de mot de passe
 * - Vérification d'email
 * - Notifications
 *
 * CONFIGURATION REQUISE:
 *
 * Option 1: Utiliser un service SMTP (ex: Gmail, SendGrid, Mailgun, AWS SES)
 * npm install nodemailer
 *
 * Variables d'environnement (.env):
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * SMTP_FROM=noreply@formationplace.com
 *
 * Option 2: Utiliser SendGrid API
 * npm install @sendgrid/mail
 * SENDGRID_API_KEY=your-api-key
 *
 * Option 3: Utiliser Resend (moderne, simple)
 * npm install resend
 * RESEND_API_KEY=your-api-key
 */

import nodemailer from 'nodemailer';

/**
 * Créer un transporteur SMTP
 */
function createTransporter() {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true pour port 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {string} to - Email du destinataire
 * @param {string} resetToken - Token de réinitialisation
 * @param {string} userName - Nom de l'utilisateur
 */
export async function sendPasswordResetEmail(to, resetToken, userName = 'Utilisateur') {
  const transporter = createTransporter();

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@formationplace.com',
    to,
    subject: 'Réinitialisation de votre mot de passe - FormationPlace',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #f5f5f5;
            padding: 30px;
            border-radius: 10px;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation de mot de passe</h1>
          </div>

          <p>Bonjour ${userName},</p>

          <p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>FormationPlace</strong>.</p>

          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>

          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </div>

          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>

          <p><strong>⚠️ Ce lien est valide pendant 1 heure.</strong></p>

          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.</p>

          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>© ${new Date().getFullYear()} FormationPlace - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${userName},

Vous avez demandé la réinitialisation de votre mot de passe sur FormationPlace.

Cliquez sur ce lien pour définir un nouveau mot de passe :
${resetUrl}

Ce lien est valide pendant 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.

© ${new Date().getFullYear()} FormationPlace - Tous droits réservés
    `,
  };

  try {
    // En développement, log l'email au lieu de l'envoyer
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 [DEV MODE] Email de reset serait envoyé à:', to);
      console.log('🔗 Reset URL:', resetUrl);
      console.log('📝 HTML:', mailOptions.html);
      return { success: true, dev: true };
    }

    // En production, envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Envoyer un email de bienvenue après inscription
 * @param {string} to - Email du destinataire
 * @param {string} userName - Nom de l'utilisateur
 */
export async function sendWelcomeEmail(to, userName) {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@formationplace.com',
    to,
    subject: 'Bienvenue sur FormationPlace !',
    html: `
      <h1>Bienvenue ${userName} !</h1>
      <p>Merci de vous être inscrit sur FormationPlace.</p>
      <p>Vous pouvez maintenant parcourir nos formations et commencer à apprendre.</p>
      <p>À bientôt !</p>
      <p>L'équipe FormationPlace</p>
    `,
  };

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 [DEV MODE] Email de bienvenue serait envoyé à:', to);
      return { success: true, dev: true };
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Ne pas faire échouer l'inscription si l'email ne part pas
    return { success: false, error: error.message };
  }
}
