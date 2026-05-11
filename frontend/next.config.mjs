/** @type {import('next').NextConfig} */

// LOCAL_IP is injected at runtime for the LAN dev stack (docker-compose.dev.yml
// or start-dev.sh). LOCAL_API_PORT defaults to 4000 when running without nginx.
const localIp = process.env.LOCAL_IP;
const localApiPort = process.env.LOCAL_API_PORT || '4000';

// NEXT_EXPORT=true → static export for GitHub Pages / CDN hosting.
// NEXT_BASE_PATH    → sub-path when hosted under a prefix (e.g. /hornets-taekwondo).
const isExport = process.env.NEXT_EXPORT === 'true';
const basePath = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  ...(isExport ? { output: 'export', basePath, assetPrefix: basePath } : {}),

  images: {
    // Image optimisation is not available in static export mode.
    unoptimized: isExport,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'https', hostname: 'hornets-taekwondo.it' },
      ...(localIp ? [{ protocol: 'http', hostname: localIp }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // headers() is not supported in static export mode.
  ...(!isExport ? {
    async headers() {
      const localOrigin = localIp ? `http://${localIp}` : null;
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
  } : {}),
};

export default nextConfig;
