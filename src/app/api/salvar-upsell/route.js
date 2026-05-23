import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { sessionId, itensSelecionados } = await request.json();

    if (!sessionId || !Array.isArray(itensSelecionados)) {
      return Response.json({ error: 'Parâmetros ausentes.' }, { status: 400 });
    }

    const { data: current, error: fetchError } = await supabase
      .from('entregas')
      .select('brand_data, email, marca, plano')
      .eq('id', sessionId)
      .single();

    if (fetchError || !current) {
      return Response.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    const updated = { ...current.brand_data, papelariaSelecionada: itensSelecionados };

    const { error: updateError } = await supabase
      .from('entregas')
      .update({ brand_data: updated })
      .eq('id', sessionId);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    // Envia email de confirmação de upsell em background
    const { email, marca } = current;
    if (email) {
      sendUpsellEmail({ email, marca, sessionId, itens: itensSelecionados }).catch(() => {});
    }

    return Response.json({ ok: true, total: itensSelecionados.length });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function sendUpsellEmail({ email, marca, sessionId, itens }) {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (!smtpEmail || !smtpPassword) return;

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://thebrandbox.sonhodepapel.com';
  const link = `${origin}/sucesso?session=${sessionId}`;
  const marcaDisplay = marca || 'sua marca';
  const itensHtml = itens.map(i => `<li style="margin-bottom:6px;"><span style="color:#4EB0B5;margin-right:8px;">•</span>${i}</li>`).join('');

  const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f8f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <tr>
          <td style="background:#4EB0B5;padding:40px;border-radius:16px 16px 0 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;font-weight:700;">The Brand Box</p>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;line-height:1.2;">
              ✨ Novos itens adicionados à sua papelaria!
            </h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:45px;border-radius:0 0 16px 16px;">
            <p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px;">
              Olá! Seu pagamento foi confirmado e os novos itens já estão disponíveis na sua Brand Box. 🎉
            </p>
            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Os seguintes itens foram adicionados à papelaria de <strong>${marcaDisplay}</strong>:
            </p>
            <ul style="color:#555;font-size:14px;line-height:2;margin:0 0 32px;padding-left:0;list-style:none;">
              ${itensHtml}
            </ul>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr>
                <td style="background:#f0f9f8;border:1.5px solid #d0ecea;border-radius:12px;padding:28px;text-align:center;">
                  <p style="color:#30706a;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">ACESSAR AGORA</p>
                  <a href="${link}" target="_blank"
                    style="display:inline-block;background:#C03B66;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:30px;letter-spacing:0.5px;box-shadow:0 8px 20px rgba(192,59,102,0.2);">
                    Ver minha papelaria →
                  </a>
                </td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:36px 0;">
            <p style="color:#999;font-size:13px;text-align:center;margin:0;line-height:1.6;">
              Com carinho, Cíntia — The Brand Box 💗<br>
              <a href="https://instagram.com/thebrandbox" style="color:#C03B66;text-decoration:none;font-weight:600;">@thebrandbox</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    host: 'mail.sonhodepapel.com',
    port: 465,
    secure: true,
    auth: { user: smtpEmail, pass: smtpPassword },
  });

  await transporter.sendMail({
    from: `"The Brand Box" <${smtpEmail}>`,
    to: email,
    subject: `Novos itens adicionados à papelaria de ${marcaDisplay} ✨`,
    html: htmlBody,
  });

  console.log(`✅ Email de upsell enviado para ${email}`);
}
