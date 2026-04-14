import { describe, expect, it } from 'vitest'

import type { WeatherCondition } from '@/lib/weather-codes'
import {
  getWeatherColor,
  getWeatherGradient,
  getWeatherIcon,
} from '@/lib/weather-icons'

const ALL_CONDITIONS: WeatherCondition[] = [
  'clearSky',
  'mainlyClear',
  'partlyCloudy',
  'overcast',
  'fog',
  'rimeFog',
  'lightDrizzle',
  'moderateDrizzle',
  'denseDrizzle',
  'lightFreezingDrizzle',
  'denseFreezingDrizzle',
  'slightRain',
  'moderateRain',
  'heavyRain',
  'lightFreezingRain',
  'heavyFreezingRain',
  'slightSnow',
  'moderateSnow',
  'heavySnow',
  'snowGrains',
  'slightRainShowers',
  'moderateRainShowers',
  'violentRainShowers',
  'slightSnowShowers',
  'heavySnowShowers',
  'thunderstorm',
  'thunderstormSlightHail',
  'thunderstormHeavyHail',
  'unknown',
]

describe('getWeatherIcon', () => {
  it('returns a defined icon for every weather condition', () => {
    for (const condition of ALL_CONDITIONS) {
      expect(getWeatherIcon(condition)).toBeDefined()
    }
  })

  it('returns distinct icons for categorically different conditions', () => {
    const clearIcon = getWeatherIcon('clearSky')
    const rainIcon = getWeatherIcon('heavyRain')
    const thunderIcon = getWeatherIcon('thunderstorm')
    const snowIcon = getWeatherIcon('slightSnow')

    expect(clearIcon).not.toBe(rainIcon)
    expect(clearIcon).not.toBe(thunderIcon)
    expect(clearIcon).not.toBe(snowIcon)
    expect(rainIcon).not.toBe(thunderIcon)
    expect(rainIcon).not.toBe(snowIcon)
    expect(thunderIcon).not.toBe(snowIcon)
  })
})

describe('getWeatherColor', () => {
  it('returns a Tailwind text color class for every condition', () => {
    for (const condition of ALL_CONDITIONS) {
      const color = getWeatherColor(condition)
      expect(color).toMatch(/^text-/)
    }
  })
})

describe('getWeatherGradient', () => {
  it('returns an object with blob1, blob2, blob3 for every condition', () => {
    for (const condition of ALL_CONDITIONS) {
      const gradient = getWeatherGradient(condition)
      expect(gradient).toHaveProperty('blob1')
      expect(gradient).toHaveProperty('blob2')
      expect(gradient).toHaveProperty('blob3')
      expect(typeof gradient.blob1).toBe('string')
      expect(typeof gradient.blob2).toBe('string')
      expect(typeof gradient.blob3).toBe('string')
    }
  })
})
