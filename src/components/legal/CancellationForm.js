"use client";

import { useState } from "react";

export default function CancellationForm({ lang = "pt" }) {
  const isEn = lang === "en";
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [transacaoId, setTransacaoId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/solicitar-cancelamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nome,
          transacaoId,
          motivo,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isEn ? "Failed to send request." : "Falha ao registrar solicitação."));
      }

      setResult(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={{
        background: "#F0FDF4",
        border: "2px solid #1F8A80",
        borderRadius: "16px",
        padding: "32px 28px",
        marginTop: "20px",
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
          {isEn ? "Request Received & Confirmed!" : "Solicitação Recebida e Confirmada!"}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#16554E", lineHeight: 1.6, margin: "0 0 20px 0" }}>
          {isEn
            ? "Your cancellation request has been officially recorded. An immediate receipt confirmation has been dispatched to your email."
            : "Sua manifestação de cancelamento foi registrada com sucesso. Uma confirmação imediata de recebimento foi enviada ao seu e-mail em cumprimento ao Art. 5º do Decreto nº 7.962/2013."}
        </p>

        <div style={{
          background: "#FFFFFF",
          border: "1px solid #C7D2FE",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "inline-block",
          textAlign: "left",
          maxWidth: "480px",
          width: "100%",
          marginBottom: "16px"
        }}>
          <div style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
            {isEn ? "Protocol Number" : "Número de Protocolo"}
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1F8A80", fontFamily: "monospace", margin: "4px 0 10px 0" }}>
            {result.protocol}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#475569" }}>
            <strong>{isEn ? "Timestamp (BRT):" : "Data e Hora (Horário de Brasília):"}</strong> {result.timestamp}
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#515361", margin: 0 }}>
          {isEn
            ? "Our financial department will proceed with the refund in up to 2 business days."
            : "Nosso setor financeiro dará início ao procedimento de estorno em até 2 (dois) dias úteis."}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "#FAFAFA",
      border: "1px solid #EFECE3",
      borderRadius: "16px",
      padding: "32px 28px",
      marginTop: "16px"
    }}>
      <div style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        backgroundColor: "#E1EDE7",
        color: "#1F8A80",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "12px"
      }}>
        {isEn ? "Automated Immediate Protocol" : "Confirmação Imediata (Decreto 7.962/13)"}
      </div>
      <h3 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "1.2rem",
        color: "#2A2A2A",
        margin: "0 0 8px 0",
        fontWeight: 600
      }}>
        {isEn ? "Submit Cancellation / Refund Request Online" : "Formulário Oficial de Cancelamento e Reembolso"}
      </h3>
      <p style={{ fontSize: "0.88rem", color: "#515361", lineHeight: 1.6, margin: "0 0 24px 0" }}>
        {isEn
          ? "Fill in your details below to generate an official protocol with immediate receipt confirmation sent to your email."
          : "Preencha os campos abaixo para registrar sua manifestação e gerar um protocolo oficial com confirmação imediata enviada ao seu e-mail."}
      </p>

      {errorMsg && (
        <div style={{
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "0.88rem",
          marginBottom: "20px"
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
              {isEn ? "Your Full Name" : "Nome Completo"}
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={isEn ? "Jane Doe" : "Ex: Maria Silva"}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontSize: "0.9rem",
                outline: "none",
                backgroundColor: "#FFFFFF"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
              {isEn ? "Purchase Email *" : "E-mail Utilizado na Compra *"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isEn ? "email@domain.com" : "seu@email.com"}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontSize: "0.9rem",
                outline: "none",
                backgroundColor: "#FFFFFF"
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Transaction ID / Order ID (Optional)" : "Identificação do Pedido / Transação (Opcional)"}
          </label>
          <input
            type="text"
            value={transacaoId}
            onChange={(e) => setTransacaoId(e.target.value)}
            placeholder={isEn ? "e.g. cs_live_..." : "Ex: Número do pedido ou CRM"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "#FFFFFF"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#2A2A2A", marginBottom: "6px" }}>
            {isEn ? "Reason / Notes (Optional)" : "Motivo / Observações (Opcional)"}
          </label>
          <textarea
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={isEn ? "Share any feedback or reason for cancellation (optional)" : "Descreva brevemente caso queira relatar algum feedback ou problema técnico (opcional)"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "inherit",
              backgroundColor: "#FFFFFF"
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
            transition: "all 0.2s ease",
            alignSelf: "flex-start",
            marginTop: "8px"
          }}
        >
          {loading
            ? (isEn ? "Processing & Registering..." : "Registrando Solicitação...")
            : (isEn ? "Submit Cancellation Request" : "Registrar Solicitação de Cancelamento")}
        </button>
      </form>
    </div>
  );
}
