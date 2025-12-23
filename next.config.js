const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // Włączamy PWA także w dev, żeby testować powiadomienia
    // disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        {
            urlPattern: /\/api\/auth\/.*/i,
            handler: 'NetworkOnly',
        },
        {
            urlPattern: /\/admin\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'admin-pages',
                expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 5
            }
        },
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
                }
            }
        },
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
            }
        },
        {
            urlPattern: /^https?:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'others',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 10
            }
        }
    ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '**', // Pozwala na wszystkie domeny HTTPS
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '12mb',
        },
    },
    // Dodajemy pustą konfigurację turbopack, żeby wyłączyć warning
    // next-pwa wymaga webpack, więc używamy webpack zamiast turbopack
    turbopack: {},
};

module.exports = withPWA(nextConfig);
