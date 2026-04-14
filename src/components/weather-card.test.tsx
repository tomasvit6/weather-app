import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/__tests__/test-utils'
import type { WeatherCondition } from '@/lib/weather-codes'
import type { WeatherData } from '@/types'

import { WeatherCard } from './weather-card'

function createWeatherData(overrides?: Partial<WeatherData>): WeatherData {
  return {
    location: {
      id: 1,
      name: 'Berlin',
      country: 'Germany',
      countryCode: 'DE',
      latitude: 52.52,
      longitude: 13.41,
    },
    temperature: 5.2,
    apparentTemperature: 2.1,
    humidity: 76,
    windSpeed: 12.5,
    weatherCode: 3,
    condition: 'overcast' as WeatherCondition,
    isDay: true,
    timestamp: '2024-01-15T14:00',
    ...overrides,
  }
}

describe('WeatherCard', () => {
  it('renders empty state message when data is undefined and not loading', () => {
    renderWithProviders(
      <WeatherCard
        data={undefined}
        isLoading={false}
        error={null}
        dataUpdatedAt={0}
      />
    )

    expect(
      screen.getByText('Search for a location to see the weather')
    ).toBeInTheDocument()
  })

  it('renders skeleton placeholders when isLoading is true', () => {
    const { container } = renderWithProviders(
      <WeatherCard
        data={undefined}
        isLoading={true}
        error={null}
        dataUpdatedAt={0}
      />
    )

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(4)
  })

  it('renders error message when error is provided', () => {
    renderWithProviders(
      <WeatherCard
        data={undefined}
        isLoading={false}
        error={new Error('Network error')}
        dataUpdatedAt={0}
      />
    )

    expect(screen.getByText('Failed to load weather data')).toBeInTheDocument()
  })

  it('renders location name and country when data is loaded', () => {
    renderWithProviders(
      <WeatherCard
        data={createWeatherData()}
        isLoading={false}
        error={null}
        dataUpdatedAt={Date.now()}
      />
    )

    expect(screen.getByText('Berlin, Germany')).toBeInTheDocument()
  })

  it('rounds temperature to nearest integer', () => {
    renderWithProviders(
      <WeatherCard
        data={createWeatherData({ temperature: 5.7 })}
        isLoading={false}
        error={null}
        dataUpdatedAt={Date.now()}
      />
    )

    expect(screen.getByText('6°C')).toBeInTheDocument()
  })

  it('renders weather condition text from i18n', () => {
    renderWithProviders(
      <WeatherCard
        data={createWeatherData({ condition: 'heavyRain' })}
        isLoading={false}
        error={null}
        dataUpdatedAt={Date.now()}
      />
    )

    expect(screen.getByText('Heavy rain')).toBeInTheDocument()
  })

  it('renders feels like, humidity, and wind speed details', () => {
    renderWithProviders(
      <WeatherCard
        data={createWeatherData({
          apparentTemperature: 2.1,
          humidity: 76,
          windSpeed: 12.5,
        })}
        isLoading={false}
        error={null}
        dataUpdatedAt={Date.now()}
      />
    )

    expect(screen.getByText('2°C')).toBeInTheDocument()
    expect(screen.getByText('76%')).toBeInTheDocument()
    expect(screen.getByText('12.5 km/h')).toBeInTheDocument()
  })

  it('has aria-live="polite" on the content container for screen readers', () => {
    const { container } = renderWithProviders(
      <WeatherCard
        data={createWeatherData()}
        isLoading={false}
        error={null}
        dataUpdatedAt={Date.now()}
      />
    )

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
  })
})
