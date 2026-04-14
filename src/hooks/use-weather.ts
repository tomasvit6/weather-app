import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getWeather, type WeatherResponse } from '@/lib/weather'
import type { Location, WeatherData } from '@/types'

export function useWeather(location: Location | null) {
  return useQuery({
    queryKey: queryKeys.weather.byLocation(
      location?.latitude ?? 0,
      location?.longitude ?? 0
    ),
    queryFn: () => getWeather(location!.latitude, location!.longitude),
    enabled: location !== null,
    refetchInterval: 5 * 60 * 1000,
    select: (data: WeatherResponse): WeatherData => ({
      location: location!,
      ...data,
    }),
  })
}
