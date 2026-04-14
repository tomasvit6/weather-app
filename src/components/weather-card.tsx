'use client'

import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, Cloud, Droplets, Thermometer, Wind } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { createElement } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useNow } from '@/hooks/use-now'
import {
  getWeatherColor,
  getWeatherGradient,
  getWeatherIcon,
} from '@/lib/weather-icons'
import type { WeatherData } from '@/types'

interface WeatherCardProps {
  data: WeatherData | undefined
  isLoading: boolean
  error: Error | null
  dataUpdatedAt: number
}

function formatLocationTime(timestamp: number, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(timestamp))
}

export function WeatherCard({
  data,
  isLoading,
  error,
  dataUpdatedAt,
}: WeatherCardProps) {
  const t = useTranslations('weather')
  const now = useNow()
  const relativeTime =
    dataUpdatedAt > 0
      ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true })
      : null

  const glassCard =
    'rounded-2xl bg-white/80 shadow-lg shadow-black/5 backdrop-blur-2xl dark:bg-black/50 dark:shadow-black/20'

  if (isLoading) {
    return (
      <div className={glassCard}>
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-8">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 sm:h-[72px] w-28 sm:w-36" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={glassCard}>
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">{t('error')}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={glassCard}>
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Cloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t('noLocation')}</p>
        </div>
      </div>
    )
  }

  const gradient = getWeatherGradient(data.condition)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.location.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className={`animate-blob-1 absolute -inset-x-8 -top-12 h-[60%] rounded-full opacity-30 blur-[80px] ${gradient.blob1}`}
          />
          <div
            className={`animate-blob-2 absolute -right-16 top-1/4 h-[50%] w-[60%] rounded-full opacity-25 blur-[80px] ${gradient.blob2}`}
          />
          <div
            className={`animate-blob-3 absolute -bottom-8 -left-8 h-[45%] w-[50%] rounded-full opacity-20 blur-[80px] ${gradient.blob3}`}
          />
        </div>

        <div className="relative rounded-2xl bg-white/80 backdrop-blur-2xl dark:bg-black/50">
          <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {data.location.name}, {data.location.country}
              </h2>
              {now > 0 && (
                <time className="text-xs sm:text-sm tabular-nums shrink-0 text-muted-foreground">
                  {formatLocationTime(now, data.timezone)}
                </time>
              )}
            </div>
          </div>
          <div
            aria-live="polite"
            className="px-5 sm:px-8 pb-5 sm:pb-8 pt-4 space-y-5 sm:space-y-6"
          >
            <div className="flex items-end gap-3">
              <span className="text-4xl sm:text-5xl md:text-7xl font-bold leading-none tracking-tighter">
                {t('temperatureValue', { value: Math.round(data.temperature) })}
              </span>
              {createElement(getWeatherIcon(data.condition), {
                className: `mb-2 h-8 w-8 sm:h-10 sm:w-10 ${getWeatherColor(data.condition)}`,
              })}
            </div>

            <p
              className={`text-base font-medium ${getWeatherColor(data.condition)}`}
            >
              {t(`condition.${data.condition}`)}
            </p>

            <div className="flex items-center divide-x divide-foreground/10">
              <div className="flex-1 min-w-0 space-y-0.5 pr-2 sm:pr-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                  <Thermometer className="h-3 w-3 shrink-0 text-orange-400" />
                  <span className="truncate">{t('feelsLike')}</span>
                </p>
                <p className="text-sm font-semibold truncate">
                  {t('temperatureValue', {
                    value: Math.round(data.apparentTemperature),
                  })}
                </p>
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 px-2 sm:px-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                  <Droplets className="h-3 w-3 shrink-0 text-blue-400" />
                  <span className="truncate">{t('humidity')}</span>
                </p>
                <p className="text-sm font-semibold truncate">
                  {t('humidityValue', { value: data.humidity })}
                </p>
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 pl-2 sm:pl-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                  <Wind className="h-3 w-3 shrink-0 text-teal-400" />
                  <span className="truncate">{t('windSpeed')}</span>
                </p>
                <p className="text-sm font-semibold truncate">
                  {t('windSpeedValue', { value: data.windSpeed })}
                </p>
              </div>
            </div>

            {relativeTime && (
              <p className="text-[11px] text-muted-foreground/70 text-right">
                {t('lastUpdated', { time: relativeTime })}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
