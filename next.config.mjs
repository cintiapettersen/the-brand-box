/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/crie-sua-marca',
        destination: '/pt',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
