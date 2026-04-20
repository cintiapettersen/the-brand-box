'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SucessoContent() {
  const params = useSearchParams();
  const plano = params.get('plano');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--background, #fafafa)',
      fontFamily: 'var(--font-body, sans-serif)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>
        Pagamento confirmado!
      </h1>
      <p style={{ fontSize: '1rem', color: '#555', maxWidth: '400px', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {plano === 'experience'
          ? 'Seus arquivos estão sendo preparados e você receberá tudo por e-mail em instantes.'
          : 'Entraremos em contato em até 2 dias úteis pelo e-mail cadastrado para iniciar a criação da sua marca completa.'}
      </p>
      <div style={{
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        fontSize: '0.85rem',
        color: '#777',
        maxWidth: '380px',
        lineHeight: 1.6,
      }}>
        Não recebeu o e-mail? Verifique sua caixa de spam ou entre em contato pelo WhatsApp.
      </div>
      <a
        href="/"
        style={{
          marginTop: '2rem',
          display: 'inline-block',
          padding: '12px 28px',
          background: '#dc3495',
          color: '#fff',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '0.9rem',
          textDecoration: 'none',
        }}
      >
        Voltar ao início
      </a>
    </div>
  );
}

export default function Sucesso() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}
