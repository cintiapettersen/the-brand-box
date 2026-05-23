export default function sitemap() {
  const baseUrl = 'https://sonhodepapel.com';
  
  return [
    {
      url: `${baseUrl}/crie-sua-marca/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ]
}
