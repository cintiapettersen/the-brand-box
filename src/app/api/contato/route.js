import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { nome, email, telefone = "", assunto = "Dúvida Geral", mensagem, lang = "pt" } = await request.json();

    if (!nome || !email || !mensagem) {
      return Response.json(
        { error: lang === "en" ? "Name, email, and message are required." : "Nome, e-mail e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    const isEn = lang === "en";

    // SMTP setup
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || "mail.sonhodepapel.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const fromName = process.env.SMTP_FROM_NAME || "The Brand Box";
    const fromEmail = process.env.SMTP_FROM_EMAIL || "hello@thebrandbox.design";

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

      // Email to Admin
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: "hello@thebrandbox.design",
        replyTo: email,
        subject: `[CONTATO THE BRAND BOX] ${assunto} — ${nome}`,
        text: `Nova mensagem recebida pelo site:\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\n\nMensagem:\n${mensagem}\n\nData: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
      });

      // Auto-reply to Client
      try {
        await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: email,
          subject: isEn ? "We received your message — The Brand Box" : "Recebemos sua mensagem — The Brand Box",
          html: `
            <div style="font-family: 'Montserrat', sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #EFECE3;">
              <h2 style="color: #1F8A80; font-family: 'Cinzel', serif;">${isEn ? "Thank you for reaching out!" : "Obrigada pelo seu contato!"}</h2>
              <p style="color: #515361; line-height: 1.6;">${isEn ? `Hello ${nome}, we have received your message regarding <strong>${assunto}</strong> and our team will get back to you within 24 hours.` : `Olá ${nome}, recebemos sua mensagem referente a <strong>${assunto}</strong> e nossa equipe entrará em contato em até 24 horas úteis.`}</p>
              <div style="background: #F8F5F1; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 14px; color: #334155;">
                <strong>${isEn ? "Your message:" : "Sua mensagem:"}</strong><br/>
                ${mensagem}
              </div>
              <p style="font-size: 12px; color: #8D9A87; margin-top: 24px;">The Brand Box Concierge Team • hello@thebrandbox.design</p>
            </div>
          `,
        });
      } catch (autoErr) {
        console.warn("Auto-reply skipped:", autoErr.message);
      }
    }

    return Response.json({
      success: true,
      message: isEn ? "Message sent successfully! We will reply shortly." : "Mensagem enviada com sucesso! Responderemos em breve.",
    });
  } catch (error) {
    console.error("Erro na rota de contato:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
