import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/api/geocoding/route'

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

function createRequest(query?: string): NextRequest {
  const url = query
    ? `http://localhost:3000/api/geocoding?query=${encodeURIComponent(query)}`
    : 'http://localhost:3000/api/geocoding'
  return new NextRequest(url)
}

const validApiResponse = {
  results: [
    {
      id: 2950159,
      name: 'Berlin',
      latitude: 52.52437,
      longitude: 13.41053,
      country: 'Germany',
      country_code: 'DE',
      admin1: 'Land Berlin',
      population: 3748148,
      elevation: 74,
    },
    {
      id: 5083330,
      name: 'Berlin',
      latitude: 44.46867,
      longitude: -71.18508,
      country: 'United States',
      country_code: 'US',
      admin1: 'New Hampshire',
    },
  ],
}

describe('GET /api/geocoding', () => {
  describe('input validation', () => {
    it('returns 400 when query is missing', async () => {
      const response = await GET(createRequest())
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('returns 400 when query is a single character', async () => {
      const response = await GET(createRequest('a'))
      expect(response.status).toBe(400)
    })

    it('accepts query with exactly 2 characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })

      const response = await GET(createRequest('NY'))
      expect(response.status).toBe(200)
    })

    it('does not call upstream API when validation fails', async () => {
      mockFetch.mockClear()
      await GET(createRequest('a'))
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('response transformation', () => {
    it('transforms country_code to countryCode', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validApiResponse),
      })

      const response = await GET(createRequest('Berlin'))
      const data = await response.json()

      expect(data[0].countryCode).toBe('DE')
      expect(data[0]).not.toHaveProperty('country_code')
    })

    it('maps all required Location fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validApiResponse),
      })

      const response = await GET(createRequest('Berlin'))
      const data = await response.json()
      const location = data[0]

      expect(location).toEqual({
        id: 2950159,
        name: 'Berlin',
        latitude: 52.52437,
        longitude: 13.41053,
        country: 'Germany',
        countryCode: 'DE',
        admin1: 'Land Berlin',
      })
    })

    it('returns empty array when API returns no results key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const response = await GET(createRequest('xyznotaplace'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })
  })

  describe('error handling', () => {
    it('returns 502 when upstream API returns non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      const response = await GET(createRequest('Berlin'))
      const data = await response.json()

      expect(response.status).toBe(502)
      expect(data.error).toBeDefined()
    })

    it('returns 502 when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const response = await GET(createRequest('Berlin'))
      const data = await response.json()

      expect(response.status).toBe(502)
      expect(data.error).toBeDefined()
    })

    it('returns 502 when upstream returns malformed data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [{ id: 'not-a-number', name: 'Bad' }],
          }),
      })

      const response = await GET(createRequest('Berlin'))
      expect(response.status).toBe(502)
    })
  })
})
