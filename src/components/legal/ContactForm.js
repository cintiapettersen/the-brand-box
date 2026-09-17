"use client";

import { useState } from "react";

export default function ContactForm({ lang = "pt" }) {
  const isEn = lang === "en";
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState(isEn ? "General Inquiry" : "Dúvida Geral");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          assunto,
          mensagem,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isEn ? "Failed to send message." : "Erro ao enviar mensagem."));
      }

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        background: "#F0FDF4",
        border: "2px solid #1F8A80",
        borderRadius: "16px",
        padding: "36px 28px",
        textAlign: "center"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#1F8A80",
          color: "#FFFFFF",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px auto",
          fontWeight: "bold"
        }}>
          ✓
        </div>
        <h3 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1.3rem",
          color: "#0F5132",
          margin: "0 0 12px 0",
          fontWeight: 700
        }}>
          {isEn ? "Message Sent Successfully!" : "Mensagem Enviada com Sucesso!"}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#16554E", lineHeight: 1.6, margin: 0 }}>
          {isEn
            ? "Thank you for reaching out. Our concierge team will reply to your email within 24 business hours."
            : "Obrigada pelo seu contato. Nossa equipe de concierge responderá diretamente no seu e-mail em até 24 horas úteis."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      padding: "32px 28px",
      border: "1px solid #EFECE3",
      boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
    }}>
      <h3 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "1.25rem",
        color: "#2A2A2A",
        margin: "0 0 8px 0",
        fontWeight: 600
      }}>
        {isEn ? "Send Us a Message" : "Envie uma Mensagem"}
      </h3>

      {errorMsg && (
        <div style={{
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "0.88rem"
        }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Your Name *" : "Seu Nome *"}
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={isEn ? "Dr. Jane Doe" : "Ex: Dra. Mariana Costa"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "#FAFAFA"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Your Email *" : "Seu E-mail *"}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "jane@clinic.com" : "seu@email.com"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "#FAFAFA"
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Phone / WhatsApp (Optional)" : "WhatsApp / Telefone (Opcional)"}
          </label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder={isEn ? "+1 (555) 000-0000" : "(11) 99999-9999"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "#FAFAFA"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Topic" : "Assunto"}
          </label>
          <select
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "#FAFAFA"
            }}
          >
            {isEn ? (
              <>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Physical Printing & Atelier">Physical Printing & Atelier Boxes</option>
                <option value="Partnerships & Institutional Agreements">Partnerships & Institutional Agreements</option>
                <option value="Technical Support">Technical Support</option>
              </>
            ) : (
              <>
                <option value="Dúvida Geral">Dúvida Geral</option>
                <option value="Impressão Física e Caixas no Atelier">Impressão Física e Caixas no Atelier</option>
                <option value="Parcerias e Convênios">Parcerias e Convênios</option>
                <option value="Suporte Técnico">Suporte Técnico</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
          {isEn ? "Message *" : "Mensagem *"}
        </label>
        <textarea
          required
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder={isEn ? "How can we assist your brand?" : "Como podemos te ajudar com a sua marca ou projeto de papelaria?"}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #CBD5E1",
            fontSize: "0.9rem",
            outline: "none",
            fontFamily: "inherit",
            backgroundColor: "#FAFAFA"
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "14px 28px",
          borderRadius: "24px",
          background: loading ? "#94A3B8" : "#1F8A80",
          color: "#FFFFFF",
          border: "none",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 14px rgba(31, 138, 128, 0.3)",
          alignSelf: "flex-start",
          marginTop: "6px"
        }}
      >
        {loading ? (isEn ? "Sending..." : "Enviando...") : (isEn ? "Send Message" : "Enviar Mensagem")}
      </button>
    </form>
  );
}
