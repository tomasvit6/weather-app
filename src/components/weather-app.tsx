'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SearchBar } from '@/components/search-bar'
import { SearchHistory } from '@/components/search-history'
import { WeatherCard } from '@/components/weather-card'
import { useApiErrorToast } from '@/hooks/use-api-error-toast'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useWeather } from '@/hooks/use-weather'
import { useHistoryStore } from '@/stores/history-store'
import type { Location } from '@/types'

export function WeatherApp() {
  const t = useTranslations('weather')
  const tGeo = useTranslations('geolocation')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const { location: geoLocation, status: geoStatus } = useGeolocation({
    fallbackName: t('yourLocation'),
  })
  const activeLocation = selectedLocation ?? geoLocation
  const { data, isLoading, error, dataUpdatedAt } = useWeather(activeLocation)
  useApiErrorToast(error)
  const addEntry = useHistoryStore((state) => state.addEntry)
  const lastAddedLocationId = useRef<number | null>(null)
  const weatherCardRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback((location: Location) => {
    setSelectedLocation(location)
  }, [])

  const handleHistorySelect = useCallback((location: Location) => {
    setSelectedLocation(location)
    weatherCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  useEffect(() => {
    if (
      data &&
      activeLocation &&
      activeLocation.id !== 0 &&
      lastAddedLocationId.current !== activeLocation.id
    ) {
      lastAddedLocationId.current = activeLocation.id
      addEntry({
        id: activeLocation.id.toString(),
        location: activeLocation,
        temperature: data.temperature,
        condition: data.condition,
        searchedAt: new Date().toISOString(),
      })
    }
  }, [data, activeLocation, addEntry])

  const showGeoDeniedNote =
    geoStatus === 'denied' && selectedLocation === null && geoLocation === null

  return (
    <div ref={weatherCardRef} className="space-y-8 scroll-mt-20">
      <SearchBar onSelect={handleSearch} />
      {showGeoDeniedNote && (
        <p className="text-muted-foreground text-sm">
          {tGeo('denied')} — {tGeo('deniedDescription')}
        </p>
      )}
      <WeatherCard
        data={data}
        isLoading={isLoading}
        error={error}
        dataUpdatedAt={dataUpdatedAt}
      />
      <SearchHistory onSelect={handleHistorySelect} />
    </div>
  )
}
