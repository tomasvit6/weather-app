'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SearchBar } from '@/components/search-bar'
import { SearchHistory } from '@/components/search-history'
import { WeatherCard } from '@/components/weather-card'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useWeather } from '@/hooks/use-weather'
import { useHistoryStore } from '@/stores/history-store'
import type { Location } from '@/types'

export function WeatherApp() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const geoLocation = useGeolocation()
  const activeLocation = selectedLocation ?? geoLocation
  const { data, isLoading, error, dataUpdatedAt } = useWeather(activeLocation)
  const addEntry = useHistoryStore((state) => state.addEntry)
  const lastAddedLocationId = useRef<number | null>(null)
  const weatherCardRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback((location: Location) => {
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

  return (
    <div className="space-y-8">
      <SearchBar onSelect={handleSelect} />
      <div ref={weatherCardRef} className="scroll-mt-20">
        <WeatherCard
          data={data}
          isLoading={isLoading}
          error={error}
          dataUpdatedAt={dataUpdatedAt}
        />
      </div>
      <SearchHistory onSelect={handleSelect} />
    </div>
  )
}
