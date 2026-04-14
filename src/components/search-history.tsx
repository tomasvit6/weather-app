'use client'

import { formatDistanceToNow } from 'date-fns'
import { Clock, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { createElement, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  const tWeather = useTranslations('weather')
  const isClient = useIsClient()
  const { entries, removeEntry, clearHistory } = useHistoryStore()

  if (!isClient) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-5 sm:px-8">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="px-5 sm:px-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader className="px-5 sm:px-8">
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center space-y-3">
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
          {entries.map((entry, index) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              <button
                type="button"
                aria-label={`${entry.location.name}, ${entry.location.country}`}
                className="flex flex-1 min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-muted/60"
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
                  <p className="text-xs text-muted-foreground truncate">
                    {tWeather('temperatureValue', {
                      value: Math.round(entry.temperature),
                    })}
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
                className="text-muted-foreground/70 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
