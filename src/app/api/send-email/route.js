import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, marca, sessionId, plano } = await request.json();

    if (!email || !sessionId) {
      return Response.json({ error: 'email e sessionId são obrigatórios.' }, { status: 400 });
    }

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.warn('SMTP_EMAIL ou SMTP_PASSWORD não configurados, pulando envio.');
      return Response.json({ skipped: true });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://brandbox.sonhodepapel.com';
    const link = `${origin}/sucesso?session=${sessionId}`;
    const marcaDisplay = marca || 'sua marca';
    const isComplete = plano === 'complete' || plano === 'pro';

    const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sua identidade visual está ganhando vida — The Brand Box</title>
</head>
<body style="margin:0;padding:0;background:#f5f8f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#4EB0B5;padding:40px;border-radius:16px 16px 0 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;font-weight:700;">The Brand Box</p>
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;line-height:1.2;">
                🎉 Sua identidade visual já começou a ganhar vida!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:45px;border-radius:0 0 16px 16px;">
              <p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 24px;">
                Olá! Aqui é a Cíntia, da <strong>The Brand Box</strong>. ✨
              </p>
              
              <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Seu pagamento foi confirmado e sua experiência de criação já começou.
              </p>

              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px;">
                A partir de agora, você será guiada por uma jornada inteligente e intuitiva criada para transformar suas ideias em uma identidade visual completa, profissional e cheia de personalidade.
              </p>

              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">
                A Brand Box foi desenvolvida para ajudar você em cada etapa, apresentando estilos, combinações e aplicações que fazem sentido para a sua marca, sem complicação e sem precisar entender de design.
              </p>

              <!-- Destaque do link -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="background:#f0f9f8;border:1.5px solid #d0ecea;border-radius:12px;padding:28px;text-align:center;">
                    <p style="color:#30706a;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">SEU LINK EXCLUSIVO</p>
                    <p style="color:#444;font-size:14px;margin:0 0 20px;line-height:1.5;">
                      Guarde este link com carinho 💗<br>É através dele que você poderá acompanhar, personalizar e baixar todos os arquivos da sua marca sempre que quiser.
                    </p>
                    <a href="${link}" target="_blank"
                      style="display:inline-block;background:#C03B66;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:30px;letter-spacing:0.5px;box-shadow:0 8px 20px rgba(192,59,102,0.2);">
                      Acessar minha marca →
                    </a>
                  </td>
                </tr>
              </table>

              <h2 style="color:#333;font-size:18px;font-weight:700;margin:32px 0 16px;">O que acontece agora?</h2>
              <ul style="color:#555;font-size:14px;line-height:2.2;margin:0 0 32px;padding-left:0;list-style:none;">
                <li style="margin-bottom:8px;"><span style="color:#4EB0B5;margin-right:8px;">•</span> Você poderá acompanhar a construção da sua identidade visual em tempo real</li>
                <li style="margin-bottom:8px;"><span style="color:#4EB0B5;margin-right:8px;">•</span> A plataforma irá apresentar opções e aplicações alinhadas ao estilo da sua marca</li>
                <li style="margin-bottom:8px;"><span style="color:#4EB0B5;margin-right:8px;">•</span> Seus arquivos ficarão disponíveis para download no mesmo link</li>
                <li style="margin-bottom:8px;"><span style="color:#4EB0B5;margin-right:8px;">•</span> O acesso é permanente e funciona em qualquer dispositivo</li>
              </ul>

              <!-- Detalhe importante -->
              <div style="background:#fffcf5;border-left:4px solid #FBDA86;padding:20px;border-radius:4px;margin:32px 0;">
                <p style="color:#8a702a;font-size:13px;font-weight:800;text-transform:uppercase;margin:0 0 8px;letter-spacing:1px;">✨ Um detalhe importante:</p>
                <p style="color:#666;font-size:14px;line-height:1.6;margin:0;">
                  A The Brand Box não funciona como um gerador automático comum. Ela foi construída a partir da metodologia real da <strong>Sonho de Papel</strong>, transformando anos de experiência em branding em uma experiência prática, guiada e muito mais leve.
                </p>
              </div>

              <hr style="border:none;border-top:1px solid #eee;margin:36px 0;">
              <p style="color:#999;font-size:13px;text-align:center;margin:0;line-height:1.6;">
                Com carinho, Cíntia — The Brand Box 💗<br>
                <a href="https://instagram.com/thebrandbox" style="color:#C03B66;text-decoration:none;font-weight:600;">@thebrandbox</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;


    // InMotion SMTP
    const transporter = nodemailer.createTransport({
      host: 'mail.sonhodepapel.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    console.log(`📧 Tentando enviar e-mail para: ${email} (Plano: ${plano}, Marca: ${marca})`);

    await transporter.sendMail({
      from: `"The Brand Box" <${smtpEmail}>`,
      to: email,
      subject: isComplete
        ? `Sua marca ${marcaDisplay} está sendo preparada!`
        : `Acesso aos arquivos da marca ${marcaDisplay}`,
      html: htmlBody,
    });

    console.log('✅ E-mail enviado com sucesso!');
    return Response.json({ sent: true });
  } catch (err) {
    console.error('❌ Erro crítico no send-email:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
