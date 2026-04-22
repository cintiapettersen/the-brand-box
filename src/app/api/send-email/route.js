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
    const isComplete = plano === 'complete';

    const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seus arquivos estão prontos — The Brand Box</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#dc3495;padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">The Brand Box</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;line-height:1.3;">
                ${isComplete ? '🎉 Sua identidade visual está no forno!' : '🎉 Sua marca acabou de nascer!'}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              <p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px;">
                Olá! Aqui é a Cíntia, da <strong>The Brand Box</strong>. ✨
              </p>
              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">
                ${isComplete
                  ? `Seu pagamento foi confirmado! A identidade visual de <strong>${marcaDisplay}</strong> já está sendo preparada — acesse o link abaixo para acompanhar e baixar seus arquivos assim que ficarem prontos.`
                  : `Seu pagamento foi confirmado! A identidade visual de <strong>${marcaDisplay}</strong> está pronta — acesse o link abaixo para baixar todos os seus arquivos.`
                }
              </p>

              <!-- Destaque do link -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:#fdf0f8;border:1.5px solid #f0c0dc;border-radius:12px;padding:24px;text-align:center;">
                    <p style="color:#8a1a50;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Seu link exclusivo</p>
                    <p style="color:#555;font-size:13px;margin:0 0 18px;line-height:1.5;">
                      Guarde este link — ele é permanente e funciona em qualquer dispositivo, a qualquer momento.
                    </p>
                    <a href="${link}" target="_blank"
                      style="display:inline-block;background:#dc3495;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:30px;letter-spacing:0.5px;">
                      ${isComplete ? 'Acessar minha marca →' : 'Acessar meus arquivos →'}
                    </a>
                    <p style="color:#bbb;font-size:11px;margin:14px 0 0;word-break:break-all;">${link}</p>
                  </td>
                </tr>
              </table>

              ${isComplete ? `
              <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 12px;">
                <strong>O que acontece agora:</strong>
              </p>
              <ul style="color:#666;font-size:14px;line-height:2;margin:0 0 24px;padding-left:20px;">
                <li>Acesse o link acima para acompanhar a criação da sua marca</li>
                <li>Seus arquivos estarão disponíveis para download no mesmo link</li>
                <li>Guarde este e-mail — o link é permanente e funciona pra sempre!</li>
              </ul>` : ''}

              <hr style="border:none;border-top:1px solid #f0f0f0;margin:28px 0;">
              <p style="color:#aaa;font-size:12px;text-align:center;margin:0;">
                Com carinho, Cíntia — The Brand Box 💗<br>
                <a href="https://instagram.com/thebrandbox" style="color:#dc3495;text-decoration:none;">@thebrandbox</a>
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

    await transporter.sendMail({
      from: `"The Brand Box" <${smtpEmail}>`,
      to: email,
      subject: isComplete
        ? `✨ ${marcaDisplay} – Sua identidade visual está no forno!`
        : `🎉 ${marcaDisplay} – Seus arquivos estão prontos!`,
      html: htmlBody,
    });

    return Response.json({ sent: true });
  } catch (err) {
    console.error('send-email error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
