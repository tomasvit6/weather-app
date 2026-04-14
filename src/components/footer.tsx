import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
        {t('credit')}
      </div>
    </footer>
  )
}
