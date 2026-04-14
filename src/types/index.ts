export interface Location {
  id: number
  name: string
  country: string
  countryCode: string
  admin1?: string
  latitude: number
  longitude: number
}

export interface WeatherData {
  location: Location
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  condition: string
  isDay: boolean
  timestamp: string
}

export interface SearchHistoryEntry {
  id: string
  location: Location
  temperature: number
  condition: string
  searchedAt: string
}
