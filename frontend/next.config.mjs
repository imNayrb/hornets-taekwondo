/** @type {import('next').NextConfig} */

// LOCAL_IP is injected at runtime so the dev server accepts image optimisation
// requests and sets a permissive CSP for LAN IPs.
// LOCAL_API_PORT defaults to 4000 (direct) or can be omitted when behind nginx.
const localIp = process.env.LOCAL_IP;
const localApiPort = process.env.LOCAL_API_PORT || '4000';

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
    // When running directly (no nginx) the API is on a separate port.
    const localApiOrigin = localIp ? `http://${localIp}:${localApiPort}` : null;

    const connectSrc = [
      "'self'",
      'http://localhost:4000',
      ...(localOrigin ? [localOrigin] : []),
      ...(localApiOrigin && localApiOrigin !== localOrigin ? [localApiOrigin] : []),
    ].join(' ');

    const imgSrc = [
      "'self'",
      'data:',
      'blob:',
      'http://localhost:4000',
      ...(localOrigin ? [localOrigin] : []),
      ...(localApiOrigin && localApiOrigin !== localOrigin ? [localApiOrigin] : []),
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
