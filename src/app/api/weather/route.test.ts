import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/api/weather/route'

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

function createRequest(params: Record<string, string> = {}): NextRequest {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  return new NextRequest(
    `http://localhost:3000/api/weather${query ? `?${query}` : ''}`
  )
}

const validApiResponse = {
  timezone: 'Europe/Berlin',
  current: {
    time: '2024-01-15T14:00',
    temperature_2m: 5.2,
    relative_humidity_2m: 76,
    apparent_temperature: 2.1,
    weather_code: 3,
    wind_speed_10m: 12.5,
    is_day: 1,
  },
}

describe('GET /api/weather', () => {
  describe('input validation', () => {
    it('returns 400 when lat is missing', async () => {
      const response = await GET(createRequest({ lng: '13.41' }))
      expect(response.status).toBe(400)
    })

    it('returns 400 when lng is missing', async () => {
      const response = await GET(createRequest({ lat: '52.52' }))
      expect(response.status).toBe(400)
    })

    it('returns 400 when both params are missing', async () => {
      const response = await GET(createRequest())
      expect(response.status).toBe(400)
    })

    it('returns 400 when lat is not a number', async () => {
      const response = await GET(createRequest({ lat: 'abc', lng: '13.41' }))
      expect(response.status).toBe(400)
    })

    it('returns 400 when lng is not a number', async () => {
      const response = await GET(createRequest({ lat: '52.52', lng: 'def' }))
      expect(response.status).toBe(400)
    })

    it('accepts negative coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validApiResponse),
      })

      const response = await GET(
        createRequest({ lat: '-33.87', lng: '151.21' })
      )
      expect(response.status).toBe(200)
    })

    it('does not call upstream API when validation fails', async () => {
      mockFetch.mockClear()
      await GET(createRequest({ lat: 'abc', lng: 'def' }))
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('response transformation', () => {
    it('maps snake_case API fields to camelCase', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validApiResponse),
      })

      const response = await GET(createRequest({ lat: '52.52', lng: '13.41' }))
      const data = await response.json()

      expect(data).toEqual({
        temperature: 5.2,
        apparentTemperature: 2.1,
        humidity: 76,
        windSpeed: 12.5,
        weatherCode: 3,
        condition: 'overcast',
        isDay: true,
        timestamp: '2024-01-15T14:00',
        timezone: 'Europe/Berlin',
      })
    })

    it('maps weather_code to condition string via weather codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            timezone: 'Europe/Berlin',
            current: { ...validApiResponse.current, weather_code: 95 },
          }),
      })

      const response = await GET(createRequest({ lat: '52.52', lng: '13.41' }))
      const data = await response.json()

      expect(data.weatherCode).toBe(95)
      expect(data.condition).toBe('thunderstorm')
    })
  })

  describe('error handling', () => {
    it('returns 502 when upstream API returns non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })

      const response = await GET(createRequest({ lat: '52.52', lng: '13.41' }))

      expect(response.status).toBe(502)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('returns 502 when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const response = await GET(createRequest({ lat: '52.52', lng: '13.41' }))

      expect(response.status).toBe(502)
    })

    it('returns 502 when upstream returns invalid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ unexpected: 'shape' }),
      })

      const response = await GET(createRequest({ lat: '52.52', lng: '13.41' }))

      expect(response.status).toBe(502)
    })
  })
})
