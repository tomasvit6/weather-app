import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/api/reverse-geocoding/route'

vi.mock('@/lib/logger', () => ({
  captureError: vi.fn(),
  captureMessage: vi.fn(),
}))

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function createRequest(lat?: string, lng?: string): NextRequest {
  const params = new URLSearchParams()
  if (lat) params.set('lat', lat)
  if (lng) params.set('lng', lng)
  const query = params.toString()
  const url = query
    ? `http://localhost:3000/api/reverse-geocoding?${query}`
    : 'http://localhost:3000/api/reverse-geocoding'
  return new NextRequest(url)
}

const validNominatimResponse = {
  name: 'Vilnius',
  address: {
    city: 'Vilnius',
    country: 'Lithuania',
    country_code: 'lt',
  },
}

describe('GET /api/reverse-geocoding', () => {
  describe('input validation', () => {
    it('returns 400 when lat is missing', async () => {
      const response = await GET(createRequest(undefined, '25.28'))
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('returns 400 when lng is missing', async () => {
      const response = await GET(createRequest('54.68'))
      expect(response.status).toBe(400)
    })

    it('returns 400 when lat is not a number', async () => {
      const response = await GET(createRequest('abc', '25.28'))
      expect(response.status).toBe(400)
    })

    it('does not call upstream API when validation fails', async () => {
      mockFetch.mockClear()
      await GET(createRequest())
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('response transformation', () => {
    it('returns city name and country from Nominatim response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validNominatimResponse),
      })

      const response = await GET(createRequest('54.68', '25.28'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        name: 'Vilnius',
        country: 'Lithuania',
        countryCode: 'LT',
      })
    })

    it('falls back to town when city is absent', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            name: 'Trakai',
            address: {
              town: 'Trakai',
              country: 'Lithuania',
              country_code: 'lt',
            },
          }),
      })

      const response = await GET(createRequest('54.64', '24.93'))
      const data = await response.json()

      expect(data.name).toBe('Trakai')
    })

    it('falls back to village when city and town are absent', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            name: 'Some Village',
            address: {
              village: 'Some Village',
              country: 'Lithuania',
              country_code: 'lt',
            },
          }),
      })

      const response = await GET(createRequest('55.0', '24.0'))
      const data = await response.json()

      expect(data.name).toBe('Some Village')
    })

    it('uppercases country code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validNominatimResponse),
      })

      const response = await GET(createRequest('54.68', '25.28'))
      const data = await response.json()

      expect(data.countryCode).toBe('LT')
    })
  })

  describe('error handling', () => {
    it('returns 502 when upstream API returns non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      const response = await GET(createRequest('54.68', '25.28'))
      const data = await response.json()

      expect(response.status).toBe(502)
      expect(data.error).toBeDefined()
    })

    it('returns 502 when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const response = await GET(createRequest('54.68', '25.28'))
      const data = await response.json()

      expect(response.status).toBe(502)
      expect(data.error).toBeDefined()
    })
  })
})
