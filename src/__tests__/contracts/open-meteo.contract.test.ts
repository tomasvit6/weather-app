/**
 * Contract tests — verify our Zod schemas match the real Open-Meteo API responses.
 *
 * These hit the live API and should NOT run on every `npm test`.
 * Run separately: npm run test:contract
 *
 * If these fail, it means Open-Meteo changed their response shape
 * and our schemas need updating.
 */
import { describe, expect, it } from 'vitest'

import { GEOCODING_API_URL, WEATHER_API_URL } from '@/lib/constants'
import { GeocodingResponseSchema, WeatherResponseSchema } from '@/lib/schemas'

describe('Open-Meteo API contracts', () => {
  describe('Geocoding API', () => {
    it('response matches GeocodingResponseSchema', async () => {
      const url = new URL(`${GEOCODING_API_URL}/search`)
      url.searchParams.set('name', 'Berlin')
      url.searchParams.set('count', '5')
      url.searchParams.set('language', 'en')

      const response = await fetch(url)
      expect(response.ok).toBe(true)

      const data: unknown = await response.json()
      const parsed = GeocodingResponseSchema.parse(data)

      expect(parsed.results.length).toBeGreaterThan(0)
      expect(parsed.results[0].name).toBe('Berlin')
      expect(typeof parsed.results[0].latitude).toBe('number')
      expect(typeof parsed.results[0].longitude).toBe('number')
      expect(typeof parsed.results[0].country_code).toBe('string')
    })

    it('response with no matches has no results key', async () => {
      const url = new URL(`${GEOCODING_API_URL}/search`)
      url.searchParams.set('name', 'zzzqqqxxxnotaplace999')
      url.searchParams.set('count', '5')
      url.searchParams.set('language', 'en')

      const response = await fetch(url)
      expect(response.ok).toBe(true)

      const data: unknown = await response.json()
      const parsed = GeocodingResponseSchema.parse(data)

      expect(parsed.results).toEqual([])
    })
  })

  describe('Weather Forecast API', () => {
    it('response matches WeatherResponseSchema', async () => {
      const url = new URL(`${WEATHER_API_URL}/forecast`)
      url.searchParams.set('latitude', '52.52')
      url.searchParams.set('longitude', '13.41')
      url.searchParams.set(
        'current',
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day'
      )

      const response = await fetch(url)
      expect(response.ok).toBe(true)

      const data: unknown = await response.json()
      const parsed = WeatherResponseSchema.parse(data)

      expect(typeof parsed.current.temperature_2m).toBe('number')
      expect(typeof parsed.current.relative_humidity_2m).toBe('number')
      expect(typeof parsed.current.apparent_temperature).toBe('number')
      expect(typeof parsed.current.weather_code).toBe('number')
      expect(typeof parsed.current.wind_speed_10m).toBe('number')
      expect(typeof parsed.current.is_day).toBe('boolean')
      expect(typeof parsed.current.time).toBe('string')
    })
  })
})
