import type { NextConfig } from "next";

// Bundle analyzer (use: ANALYZE=true npm run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  serverExternalPackages: ["razorpay"],
  transpilePackages: ["lucide-react"],
  // TEMP (dev-only, for local visual verification via cloudflared tunnel) — remove before commit
  allowedDevOrigins: ["con-calls-homes-potentially.trycloudflare.com"],

  // Compression (Vercel handles automatically, but this ensures it's enabled)
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Security Headers + Performance Headers
  async headers() {
    // Aggressive asset caching is production-only. In dev it makes the browser
    // pin `/_next/static` chunks as `immutable` for a year, so edited code never
    // re-fetches (you keep running a stale bundle). Guard the cache rules on
    // NODE_ENV so dev always serves fresh chunks.
    const isProd = process.env.NODE_ENV === "production";
    const cacheRules = isProd
      ? [
          // Cache static assets aggressively (1 year)
          {
            source: "/_next/static/:path*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
          // Cache public assets (images, fonts, etc.) for 1 year
          {
            source: "/public/:path*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
          // Cache API responses briefly (5 minutes)
          {
            source: "/api/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
              },
            ],
          },
        ]
      : [];
    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://polyfill.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.openrouter.ai https://api.resend.com https://api.razorpay.com https://*.upstash.io https://*.turso.io wss://*.turso.io https://generativelanguage.googleapis.com https://api.together.xyz https://api.iconify.design",
              "frame-src 'self' https://api.razorpay.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Enable browser XSS protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // HSTS (HTTP Strict Transport Security)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Production-only aggressive asset/API caching (empty in dev).
      ...cacheRules,
      // Auth/user endpoints are per-user and must NEVER be cached. A shared
      // `public` cache would replay a logged-out {user:null} response to a
      // freshly-logged-in request (there is no Vary:Cookie), bouncing the user
      // back to the landing page until the cache expired (~5 min). This rule
      // MUST come AFTER the generic /api rule above: when multiple header rules
      // match the same path, Next.js lets the LATER rule win for a given key.
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        ],
      },
      {
        source: "/api/auth",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
