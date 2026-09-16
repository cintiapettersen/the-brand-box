import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, nome = "", transacaoId = "", motivo = "", lang = "pt" } = await request.json();

    if (!email || !email.includes("@")) {
      return Response.json(
        { error: lang === "en" ? "Valid email is required." : "E-mail válido é obrigatório." },
        { status: 400 }
      );
    }

    // Generate Protocol Number
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().replace(/[-:T]/g, "").slice(0, 8);
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const protocol = `TBB-CAN-${dateStr}-${randomSuffix}`;

    const brtDateString = timestamp.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const isEn = lang === "en";

    // SMTP setup
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || "mail.sonhodepapel.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const fromName = process.env.SMTP_FROM_NAME || "The Brand Box";
    const fromEmail = process.env.SMTP_FROM_EMAIL || "hello@thebrandbox.design";

    const emailSubject = isEn
      ? `[${protocol}] Confirmation of Cancellation / Refund Request — The Brand Box`
      : `[${protocol}] Confirmação de Recebimento de Solicitação de Cancelamento — The Brand Box`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="${isEn ? "en" : "pt-BR"}">
<head>
  <meta charset="UTF-8">
  <title>${emailSubject}</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F1;font-family:'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F1;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;box-shadow:0 12px 32px rgba(0,0,0,0.06);overflow:hidden;border:1px solid #EFECE3;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1F8A80;padding:36px 32px;text-align:center;">
              <p style="color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 10px;font-weight:700;">THE BRAND BOX</p>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">
                ${isEn ? "Confirmation of Request Receipt" : "Confirmação de Recebimento de Solicitação"}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;color:#2A2A2A;line-height:1.7;font-size:15px;">
              <p style="margin:0 0 16px;">
                ${isEn ? `Hello ${nome ? `<strong>${nome}</strong>` : ""}!` : `Olá ${nome ? `<strong>${nome}</strong>` : ""}!`}
              </p>
              <p style="margin:0 0 20px;">
                ${isEn
                  ? "We confirm immediate receipt of your cancellation and refund request, in compliance with <strong>Decree No. 7,962/2013 (Art. 5, § 2)</strong> and the Brazilian Consumer Protection Code (Art. 49)."
                  : "Confirmamos o recebimento imediato da sua manifestação de cancelamento e reembolso, em estrito cumprimento ao <strong>Decreto nº 7.962/2013 (Art. 5º, § 2º)</strong> e ao Código de Defesa do Consumidor (Art. 49)."}
              </p>

              <!-- Protocol Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#FAFAFA;border:1.5px solid #1F8A80;border-radius:14px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#8D9A87;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
                      ${isEn ? "OFFICIAL PROTOCOL" : "PROTOCOLO OFICIAL DE ATENDIMENTO"}
                    </p>
                    <p style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1F8A80;font-family:monospace;">
                      ${protocol}
                    </p>
                    <div style="font-size:13px;color:#515361;line-height:1.6;">
                      <div><strong>${isEn ? "Registered Email:" : "E-mail Registrado:"}</strong> ${email}</div>
                      ${transacaoId ? `<div><strong>${isEn ? "Transaction ID:" : "ID da Transação:"}</strong> ${transacaoId}</div>` : ""}
                      <div><strong>${isEn ? "Timestamp (BRT):" : "Data e Hora (Horário de Brasília):"}</strong> ${brtDateString}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <h2 style="font-size:16px;color:#2A2A2A;margin:24px 0 12px;">
                ${isEn ? "Next Steps & Deadlines" : "Próximos Passos e Prazos"}
              </h2>
              <ul style="padding-left:18px;margin:0 0 24px;color:#515361;font-size:14px;line-height:1.8;">
                <li>${isEn ? "Our support team will process the refund procedure within <strong>2 business days</strong>." : "Nossa equipe financeira dará início ao procedimento de estorno em até <strong>2 (dois) dias úteis</strong>."}</li>
                <li>${isEn ? "The refund will be issued to the original payment method (credit card statement or original account)." : "O estorno será realizado no mesmo meio de pagamento utilizado na compra."}</li>
                <li>${isEn ? "Upon refund completion, the license to use any generated brand files is revoked." : "Com a conclusão do cancelamento, encerra-se a licença de uso dos arquivos da marca."}</li>
              </ul>

              <!-- Supplier Identification -->
              <div style="background:#F4E8DC;border-left:4px solid #C7B49F;padding:16px;border-radius:8px;font-size:12px;color:#4A3A30;margin:24px 0;">
                <strong>${isEn ? "Supplier Identification:" : "Identificação do Fornecedor:"}</strong><br/>
                Pettersen Lunt design • Org: 932425643<br/>
                Festnigsvein 10 - kråkerrøy - Norway<br/>
                Email: hello@thebrandbox.design
              </div>

              <p style="margin:24px 0 0;font-size:13px;color:#8D9A87;text-align:center;">
                The Brand Box • ${isEn ? "Customer Support" : "Atendimento ao Cliente"}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      // Send to customer
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        replyTo: fromEmail,
        to: email,
        subject: emailSubject,
        html: htmlContent,
      });

      // Send notification copy to admin
      try {
        await transporter.sendMail({
          from: `"The Brand Box Alert" <${fromEmail}>`,
          to: "hello@thebrandbox.design",
          subject: `[NOVA SOLICITAÇÃO DE CANCELAMENTO] Protocolo: ${protocol} - ${email}`,
          text: `Nova solicitação de cancelamento recebida:\nProtocolo: ${protocol}\nE-mail: ${email}\nNome: ${nome}\nTransação: ${transacaoId}\nMotivo: ${motivo}\nData/Hora BRT: ${brtDateString}`,
        });
      } catch (errAdmin) {
        console.warn("Aviso: falha ao enviar cópia admin:", errAdmin.message);
      }
    } else {
      console.warn("SMTP não configurado no ambiente local; simulando envio com sucesso.");
    }

    return Response.json({
      success: true,
      protocol,
      timestamp: brtDateString,
      message: isEn
        ? "Cancellation request received successfully. A confirmation email has been sent to your inbox."
        : "Solicitação de cancelamento registrada com sucesso. Uma confirmação imediata foi enviada ao seu e-mail.",
    });
  } catch (error) {
    console.error("Erro na rota de cancelamento:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
