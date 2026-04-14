'use client'

import { formatDistanceToNow } from 'date-fns'
import { Clock, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createElement, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWeatherColor, getWeatherIcon } from '@/lib/weather-icons'
import { useHistoryStore } from '@/stores/history-store'
import type { Location } from '@/types'

interface SearchHistoryProps {
  onSelect: (location: Location) => void
}

const subscribe = () => () => {}

function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

export function SearchHistory({ onSelect }: SearchHistoryProps) {
  const t = useTranslations('history')
  const isClient = useIsClient()
  const { entries, removeEntry, clearHistory } = useHistoryStore()

  if (!isClient) {
    return null
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-5 sm:px-8">
        <CardTitle>{t('title')}</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          {t('clear')}
        </Button>
      </CardHeader>
      <CardContent className="px-5 sm:px-8">
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <button
                type="button"
                className="flex flex-1 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-muted/60"
                onClick={() => onSelect(entry.location)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/80">
                  {createElement(getWeatherIcon(entry.condition), {
                    className: `h-4 w-4 ${getWeatherColor(entry.condition)}`,
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {entry.location.name}, {entry.location.country}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(entry.temperature)}°C
                    {' \u00b7 '}
                    {t('searchedAt', {
                      time: formatDistanceToNow(new Date(entry.searchedAt), {
                        addSuffix: true,
                      }),
                    })}
                  </p>
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={t('remove', { location: entry.location.name })}
                onClick={() => removeEntry(entry.id)}
                className="text-muted-foreground/50 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
