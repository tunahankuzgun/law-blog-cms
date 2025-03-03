const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*'],
  alternateRefs: [
    {
      href: SITE_URL,
      hreflang: 'tr',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/', '/makaleler/', '/calisma-alanlari/', '/hakkimizda/', '/iletisim/'],
        disallow: ['/admin/*', '/api/*', '/_next/*', '/preview/*'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/makaleler-sitemap.xml`,
      `${SITE_URL}/calisma-alanlari-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for paths
    const priorities = {
      '/': 1.0,
      '/calisma-alanlari': 0.9,
      '/makaleler': 0.8,
      '/hakkimizda': 0.7,
      '/iletisim': 0.7,
    }

    const changefreqs = {
      '/': 'daily',
      '/calisma-alanlari': 'weekly',
      '/makaleler': 'daily',
      '/hakkimizda': 'monthly',
      '/iletisim': 'monthly',
    }

    return {
      loc: path,
      changefreq: changefreqs[path] || 'monthly',
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
