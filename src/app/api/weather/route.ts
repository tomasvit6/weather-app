import { NextRequest, NextResponse } from 'next/server'

import { WEATHER_API_URL } from '@/lib/constants'
import { captureError, captureMessage } from '@/lib/logger'
import { WeatherResponseSchema } from '@/lib/schemas'
import { getWeatherCondition } from '@/lib/weather-codes'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const lat = request.nextUrl.searchParams.get('lat')
  const lng = request.nextUrl.searchParams.get('lng')

  if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
    return NextResponse.json(
      { error: 'Valid lat and lng parameters are required' },
      { status: 400 }
    )
  }

  try {
    const url = new URL(`${WEATHER_API_URL}/forecast`)
    url.searchParams.set('latitude', lat)
    url.searchParams.set('longitude', lng)
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day'
    )
    url.searchParams.set('timezone', 'auto')

    const response = await fetch(url)

    if (response.status === 429) {
      captureMessage('Rate limited by upstream API', { url: url.toString() })
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a moment.' },
        { status: 429 }
      )
    }

    if (!response.ok) {
      captureError(new Error(`Weather API returned ${response.status}`), {
        lat,
        lng,
        status: response.status,
      })
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: 502 }
      )
    }

    const data: unknown = await response.json()
    const parsed = WeatherResponseSchema.parse(data)
    const { current } = parsed

    return NextResponse.json(
      {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        condition: getWeatherCondition(current.weather_code),
        isDay: current.is_day,
        timestamp: current.time,
        timezone: parsed.timezone,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    captureError(error, { lat, lng })
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 502 }
    )
  }
}
