export default function robots() {
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.sonhodepapel.com').replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/sucesso',
        '/pt/sucesso',
        '/en/sucesso',
        '/atelier',
        '/pt/atelier',
        '/en/atelier',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

