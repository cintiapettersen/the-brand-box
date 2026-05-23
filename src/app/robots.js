export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sucesso'], // Protege links de entregas de marca e endpoints de API interna
    },
    sitemap: 'https://sonhodepapel.com/sitemap.xml',
  }
}
