'use client'

import { MapPinOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'

export default function NotFoundPage() {
  const t = useTranslations()

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPinOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold">{t('notFound.title')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('notFound.description')}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
