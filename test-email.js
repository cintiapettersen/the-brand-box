const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const smtpEmail = process.env.SMTP_EMAIL;
const smtpPassword = process.env.SMTP_PASSWORD;

console.log('Testing SMTP configuration with:');
console.log('SMTP_EMAIL:', smtpEmail);
console.log('SMTP_PASSWORD:', smtpPassword ? '****** (configured)' : '(not configured)');

if (!smtpEmail || !smtpPassword) {
  console.error('Error: SMTP credentials missing in .env.local');
  process.exit(1);
}

const smtpHost = process.env.SMTP_HOST || 'mail.sonhodepapel.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const fromName = process.env.SMTP_FROM_NAME || 'The Brand Box';
const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@thebrandbox.design';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpEmail,
    pass: smtpPassword,
  },
});

async function main() {
  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection is valid and authenticated!');
    
    console.log('Simulating message structure without sending...');
    const message = {
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: fromEmail,
      to: 'cintiapettersen@gmail.com',
      subject: 'Test Email - The Brand Box Verification',
      text: 'If you receive this email, your SMTP configuration in .env.local is working perfectly!',
      html: '<b>If you receive this email, your SMTP configuration in .env.local is working perfectly!</b>',
    };
    console.log('Generated envelope headers:', { from: message.from, replyTo: message.replyTo, to: message.to });
    console.log('✅ Message structure verified!');
  } catch (error) {
    console.error('❌ SMTP Connection verification failed:', error);
  }
}

main();
