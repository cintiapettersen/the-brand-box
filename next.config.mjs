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
      {
        source: '/comecar',
        destination: '/pt?start=true',
        permanent: false,
      },
      {
        source: '/start',
        destination: '/en?start=true',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/pt?start=true',
        permanent: false,
      },
      {
        source: '/pt/comecar',
        destination: '/pt?start=true',
        permanent: false,
      },
      {
        source: '/en/start',
        destination: '/en?start=true',
        permanent: false,
      },
      {
        source: '/pt/app',
        destination: '/pt?start=true',
        permanent: false,
      },
      {
        source: '/en/app',
        destination: '/en?start=true',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
