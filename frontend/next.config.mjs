/** @type {import('next').NextConfig} */

// LOCAL_IP is injected by docker-compose.dev.yml at runtime so the dev server
// accepts image optimisation requests and sets a permissive CSP for LAN IPs.
const localIp = process.env.LOCAL_IP;

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'https', hostname: 'hornets-taekwondo.it' },
      ...(localIp ? [{ protocol: 'http', hostname: localIp }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const localOrigin = localIp ? `http://${localIp}` : null;

    const connectSrc = [
      "'self'",
      'http://localhost:4000',
      ...(localOrigin ? [localOrigin] : []),
    ].join(' ');

    const imgSrc = [
      "'self'",
      'data:',
      'blob:',
      'http://localhost:4000',
      ...(localOrigin ? [localOrigin] : []),
    ].join(' ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              `img-src ${imgSrc}`,
              "media-src 'self' blob:",
              `connect-src ${connectSrc}`,
              "frame-src https://www.google.com/maps",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
