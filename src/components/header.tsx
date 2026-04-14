import { useTranslations } from 'next-intl'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const t = useTranslations('app')

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">{t('title')}</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
