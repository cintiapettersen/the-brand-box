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

const transporter = nodemailer.createTransport({
  host: 'mail.sonhodepapel.com',
  port: 465,
  secure: true,
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
    
    console.log('Sending test email to developer...');
    const info = await transporter.sendMail({
      from: `"The Brand Box Test" <${smtpEmail}>`,
      to: 'cintiapettersen@gmail.com', // Let's try sending a test email to developer
      subject: 'Test Email - The Brand Box Verification',
      text: 'If you receive this email, your SMTP configuration in .env.local is working perfectly!',
      html: '<b>If you receive this email, your SMTP configuration in .env.local is working perfectly!</b>',
    });
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Connection or Sending failed:', error);
  }
}

main();
