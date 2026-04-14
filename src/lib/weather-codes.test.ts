import { describe, expect, it } from 'vitest'

import { getWeatherCondition } from '@/lib/weather-codes'

describe('getWeatherCondition', () => {
  it('returns correct condition for clear sky (code 0)', () => {
    expect(getWeatherCondition(0)).toBe('clearSky')
  })

  it('returns correct condition for overcast (code 3)', () => {
    expect(getWeatherCondition(3)).toBe('overcast')
  })

  it('returns correct condition for fog (code 45)', () => {
    expect(getWeatherCondition(45)).toBe('fog')
  })

  it('returns correct condition for heavy rain (code 65)', () => {
    expect(getWeatherCondition(65)).toBe('heavyRain')
  })

  it('returns correct condition for thunderstorm (code 95)', () => {
    expect(getWeatherCondition(95)).toBe('thunderstorm')
  })

  it('returns correct condition for thunderstorm with heavy hail (code 99)', () => {
    expect(getWeatherCondition(99)).toBe('thunderstormHeavyHail')
  })

  it('returns "unknown" for unmapped codes', () => {
    expect(getWeatherCondition(4)).toBe('unknown')
    expect(getWeatherCondition(100)).toBe('unknown')
    expect(getWeatherCondition(-1)).toBe('unknown')
  })
})
