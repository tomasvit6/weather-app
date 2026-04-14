import { api } from '@/lib/axios'
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
}

export async function getWeather(
  lat: number,
  lng: number
): Promise<WeatherResponse> {
  const response = await api.get<WeatherResponse>('/weather', {
    params: { lat, lng },
  })
  return response.data
}
