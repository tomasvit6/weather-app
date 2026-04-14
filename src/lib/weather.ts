import { api } from '@/lib/axios'
import { API_ROUTES } from '@/lib/constants'
import type { WeatherCondition } from '@/lib/weather-codes'

export interface WeatherResponse {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  condition: WeatherCondition
  isDay: boolean
  timestamp: string
  timezone: string
}

export async function getWeather(
  lat: number,
  lng: number
): Promise<WeatherResponse> {
  const response = await api.get<WeatherResponse>(API_ROUTES.weather, {
    params: { lat, lng },
  })
  return response.data
}
