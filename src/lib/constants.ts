export const WEATHER_API_URL = 'https://api.open-meteo.com/v1'
export const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1'

export const MAX_HISTORY_ENTRIES = 10

export const ROUTES = {
  home: '/',
} as const

export const API_ROUTES = {
  weather: '/weather',
  geocoding: '/geocoding',
  reverseGeocoding: '/reverse-geocoding',
} as const
