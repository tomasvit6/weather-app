'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { ROUTES } from '@/lib/constants'

export function Header() {
  const t = useTranslations('app')

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href={ROUTES.home}
          onClick={handleClick}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">{t('title')}</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
