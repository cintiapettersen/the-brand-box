export const metadata = {
  title: 'Atelier Secreto | The Brand Box',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function AtelierLayout({ children }) {
  return children;
}
