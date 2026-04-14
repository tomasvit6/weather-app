import { describe, expect, it } from 'vitest'

import { GeocodingResponseSchema, WeatherResponseSchema } from '@/lib/schemas'

describe('GeocodingResponseSchema', () => {
  it('parses a valid geocoding response', () => {
    const data = {
      results: [
        {
          id: 2950159,
          name: 'Berlin',
          latitude: 52.52437,
          longitude: 13.41053,
          country: 'Germany',
          country_code: 'DE',
          admin1: 'Land Berlin',
        },
      ],
    }

    const result = GeocodingResponseSchema.parse(data)

    expect(result.results).toHaveLength(1)
    expect(result.results[0]).toEqual({
      id: 2950159,
      name: 'Berlin',
      latitude: 52.52437,
      longitude: 13.41053,
      country: 'Germany',
      country_code: 'DE',
      admin1: 'Land Berlin',
    })
  })

  it('defaults to empty array when results key is missing', () => {
    const result = GeocodingResponseSchema.parse({})
    expect(result.results).toEqual([])
  })

  it('parses result without optional admin1 field', () => {
    const data = {
      results: [
        {
          id: 1,
          name: 'Tokyo',
          latitude: 35.6762,
          longitude: 139.6503,
          country: 'Japan',
          country_code: 'JP',
        },
      ],
    }

    const result = GeocodingResponseSchema.parse(data)
    expect(result.results[0].admin1).toBeUndefined()
  })
})

describe('WeatherResponseSchema', () => {
  const validCurrent = {
    time: '2024-01-15T14:00',
    temperature_2m: 5.2,
    relative_humidity_2m: 76,
    apparent_temperature: 2.1,
    weather_code: 3,
    wind_speed_10m: 12.5,
    is_day: 1,
  }

  it('parses a valid weather response and transforms is_day to boolean', () => {
    const result = WeatherResponseSchema.parse({ current: validCurrent })

    expect(result.current).toEqual({
      time: '2024-01-15T14:00',
      temperature_2m: 5.2,
      relative_humidity_2m: 76,
      apparent_temperature: 2.1,
      weather_code: 3,
      wind_speed_10m: 12.5,
      is_day: true,
    })
  })

  it('transforms is_day 0 to false', () => {
    const result = WeatherResponseSchema.parse({
      current: { ...validCurrent, is_day: 0 },
    })
    expect(result.current.is_day).toBe(false)
  })

  it('treats is_day values other than 1 as false', () => {
    const result = WeatherResponseSchema.parse({
      current: { ...validCurrent, is_day: 2 },
    })
    expect(result.current.is_day).toBe(false)
  })
})
