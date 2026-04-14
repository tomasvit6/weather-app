import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { WeatherApp } from '@/components/weather-app'

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

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <WeatherApp />
        </div>
      </main>
      <Footer />
    </>
  )
}
