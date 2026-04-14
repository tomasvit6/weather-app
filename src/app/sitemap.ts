import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `https://weather-app.example.com/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  }))
}
