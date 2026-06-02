import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://thebrandbox.sonhodepapel.com'),
  title: {
    default: "Crie sua marca | The Brand Box",
    template: "%s | The Brand Box"
  },
  description: "Transforme sua essência em uma identidade visual completa e profissional através de uma experiência guiada, dinâmica e mágica. Sem complicações e sem precisar de designer.",
  alternates: {
    canonical: "/crie-sua-marca",
  },
  openGraph: {
    title: "Crie sua marca | The Brand Box",
    description: "Transforme sua essência em uma identidade visual completa e profissional em minutos com a nossa experiência mágica guiada.",
    url: "https://thebrandbox.sonhodepapel.com/crie-sua-marca/",
    siteName: "The Brand Box / Sonho de Papel",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-brandbox.jpg",
        width: 1200,
        height: 630,
        alt: "The Brand Box - Crie sua identidade visual completa"
      }
    ]
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

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;500;600;700&family=Allura&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&family=Julius+Sans+One&family=Sacramento&family=Birthstone&family=Borel&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;500;600;700&family=Allura&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&family=Julius+Sans+One&family=Sacramento&family=Birthstone&family=Borel&display=swap" media="print" onLoad="this.media='all'" />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;500;600;700&family=Allura&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&family=Julius+Sans+One&family=Sacramento&family=Birthstone&family=Borel&display=swap" />
        </noscript>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
