'use client'

import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, Cloud, Droplets, Thermometer, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createElement, useEffect, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
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

function useRelativeTime(timestamp: number): string | null {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (timestamp === 0) return
    const interval = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(interval)
  }, [timestamp])

  if (timestamp === 0) return null
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

export function WeatherCard({
  data,
  isLoading,
  error,
  dataUpdatedAt,
}: WeatherCardProps) {
  const t = useTranslations('weather')
  const relativeTime = useRelativeTime(dataUpdatedAt)

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
    <div className="relative rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20">
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
          <h3 className="text-lg font-semibold tracking-tight">
            {data.location.name}, {data.location.country}
          </h3>
        </div>
        <div
          aria-live="polite"
          className="px-5 sm:px-8 pb-5 sm:pb-8 pt-4 space-y-5 sm:space-y-6"
        >
          <div className="flex items-end gap-3">
            <span className="text-6xl sm:text-7xl font-bold leading-none tracking-tighter">
              {Math.round(data.temperature)}°C
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
            <div className="flex-1 space-y-0.5 pr-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Thermometer className="h-3 w-3 shrink-0 text-orange-400" />
                {t('feelsLike')}
              </p>
              <p className="text-sm font-semibold">
                {Math.round(data.apparentTemperature)}°C
              </p>
            </div>
            <div className="flex-1 space-y-0.5 px-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3 shrink-0 text-blue-400" />
                {t('humidity')}
              </p>
              <p className="text-sm font-semibold">{data.humidity}%</p>
            </div>
            <div className="flex-1 space-y-0.5 pl-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Wind className="h-3 w-3 shrink-0 text-teal-400" />
                {t('windSpeed')}
              </p>
              <p className="text-sm font-semibold">{data.windSpeed} km/h</p>
            </div>
          </div>

          {relativeTime && (
            <p className="text-[11px] text-muted-foreground/60 text-right">
              {t('lastUpdated', { time: relativeTime })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
