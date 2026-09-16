
import Script from "next/script";
import "../globals.css";
import { getDictionary } from "../../getDictionary";
import { LanguageProvider } from "../LanguageContext";
import { Analytics } from '@vercel/analytics/next';



export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const rawLang = resolvedParams?.lang || 'pt';
  const isEn = rawLang.startsWith('en');
  const langPath = isEn ? 'en' : 'pt';
  const ogLocale = isEn ? 'en_US' : 'pt_BR';
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.sonhodepapel.com').replace(/\/$/, '');

  const title = isEn
    ? 'The Brand Box | Build Your Complete Visual Identity with AI & Art Direction'
    : 'The Brand Box | Crie sua Identidade Visual Completa com IA e Direção de Arte';

  const description = isEn
    ? 'Transform your business essence into a complete, high-end visual identity in minutes. Brand visual signature (logo system), submark seal, calibrated color palette, bespoke pattern, and print-ready stationery.'
    : 'Transforme a essência do seu negócio em uma identidade visual completa e profissional em minutos. Assinatura visual de marca, submarca/selo, paleta cromática calibrada, estampa exclusiva e papelaria técnica pronta para gráfica.';

  const keywords = isEn
    ? ['visual identity', 'brand visual signature', 'logo system', 'brand board', 'clinic stationery', 'art direction ai', 'the brand box']
    : ['identidade visual', 'assinatura visual de marca', 'logo system', 'brand board', 'identidade visual para clinicas', 'papelaria personalizada', 'direcao de arte ia', 'the brand box'];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: '%s | The Brand Box',
    },
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `/${langPath}`,
      languages: {
        'pt-BR': '/pt',
        'en': '/en',
        'x-default': '/pt',
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/${langPath}`,
      siteName: 'The Brand Box',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: '/og-brandbox.jpg',
          width: 1200,
          height: 630,
          alt: isEn ? 'The Brand Box - Complete Visual Identity Generator' : 'The Brand Box - Criação de Identidade Visual Completa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-brandbox.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'pt-BR';
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script id="font-loader" strategy="lazyOnload">
          {`
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;500;600;700&family=Allura&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600&family=Abril+Fatface&family=DM+Sans:wght@300;400;500;600&family=Julius+Sans+One&family=Sacramento&family=Birthstone&family=Borel&family=Inter:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(link);
          `}
        </Script>
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;500;600;700&family=Allura&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600&family=Abril+Fatface&family=DM+Sans:wght@300;400;500;600&family=Julius+Sans+One&family=Sacramento&family=Birthstone&family=Borel&family=Inter:wght@300;400;500;600;700&display=swap" />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider initialDictionary={dictionary}>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
