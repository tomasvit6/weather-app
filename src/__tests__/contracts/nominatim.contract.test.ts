/**
 * Contract tests — verify our reverse geocoding integration matches
 * the real Nominatim API response shape.
 *
 * These hit the live API and should NOT run on every `npm test`.
 * Run separately: npm run test:contract
 *
 * If these fail, it means Nominatim changed their response shape
 * and our reverse-geocoding route needs updating.
 */
import { describe, expect, it } from 'vitest'

describe('Nominatim API contracts', () => {
  describe('Reverse Geocoding API', () => {
    it('response contains address with city and country for a major city', async () => {
      const url = new URL('https://nominatim.openstreetmap.org/reverse')
      url.searchParams.set('lat', '52.52')
      url.searchParams.set('lon', '13.41')
      url.searchParams.set('format', 'json')
      url.searchParams.set('zoom', '10')
      url.searchParams.set('accept-language', 'en')

      const response = await fetch(url, {
        headers: { 'User-Agent': 'WeatherApp/1.0 (contract-test)' },
      })
      expect(response.ok).toBe(true)

      const data = (await response.json()) as Record<string, unknown>
      const address = data.address as Record<string, string>

      expect(address).toBeDefined()
      expect(typeof address.country).toBe('string')
      expect(typeof address.country_code).toBe('string')

      const name = address.city || address.town || address.village
      expect(name).toBeDefined()
      expect(name).toBe('Berlin')
    })

    it('response contains country_code as lowercase two-letter code', async () => {
      const url = new URL('https://nominatim.openstreetmap.org/reverse')
      url.searchParams.set('lat', '48.85')
      url.searchParams.set('lon', '2.35')
      url.searchParams.set('format', 'json')
      url.searchParams.set('zoom', '10')
      url.searchParams.set('accept-language', 'en')

      const response = await fetch(url, {
        headers: { 'User-Agent': 'WeatherApp/1.0 (contract-test)' },
      })
      expect(response.ok).toBe(true)

      const data = (await response.json()) as Record<string, unknown>
      const address = data.address as Record<string, string>

      expect(address.country_code).toMatch(/^[a-z]{2}$/)
      expect(address.country_code).toBe('fr')
    })
  })
})
