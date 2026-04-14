'use client'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const t = useTranslations('theme')
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('toggle')}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
