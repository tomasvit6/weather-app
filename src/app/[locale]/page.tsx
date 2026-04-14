import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { SearchBar } from '@/components/search-bar'
import { SearchHistory } from '@/components/search-history'
import { WeatherCard } from '@/components/weather-card'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('app.title'),
    description: t('app.description'),
  }
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">{t('app.title')}</h1>
        <SearchBar />
        <WeatherCard />
        <SearchHistory />
      </div>
    </main>
  )
}
