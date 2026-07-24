import Link from 'next/link';

export default async function CodexTestPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'pt-BR';

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: 'linear-gradient(135deg, #f8fbfb 0%, #fff7fb 100%)',
      color: '#2f2a2d',
      fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
    }}>
      <section style={{
        width: '100%',
        maxWidth: '680px',
        padding: '40px',
        borderRadius: '28px',
        background: '#ffffff',
        border: '1px solid rgba(78, 176, 181, 0.22)',
        boxShadow: '0 24px 70px rgba(49, 87, 90, 0.12)',
        textAlign: 'center',
      }}>
        <p style={{
          margin: '0 0 12px',
          color: '#4EB0B5',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          Página de teste
        </p>

        <h1 style={{
          margin: '0 0 18px',
          color: '#C03B66',
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          lineHeight: 1.08,
          fontWeight: 700,
        }}>
          Codex conectado ao The Brand Box
        </h1>

        <p style={{
          margin: '0 auto 28px',
          maxWidth: '520px',
          color: '#5f565b',
          fontSize: '1.05rem',
          lineHeight: 1.7,
        }}>
          Esta página temporária confirma que o Codex conseguiu ler, modificar e validar o projeto.
        </p>

        <Link
          href={`/${lang}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '46px',
            padding: '0 22px',
            borderRadius: '999px',
            background: '#4EB0B5',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 10px 24px rgba(78, 176, 181, 0.24)',
          }}
        >
          Voltar para a página inicial
        </Link>
      </section>
    </main>
  );
}
