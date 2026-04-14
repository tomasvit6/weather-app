import { NextRequest, NextResponse } from 'next/server'

import { captureError, captureMessage } from '@/lib/logger'
import { ReverseGeocodingResponseSchema } from '@/lib/schemas'

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
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', lat)
    url.searchParams.set('lon', lng)
    url.searchParams.set('format', 'json')
    url.searchParams.set('zoom', '10')
    url.searchParams.set('accept-language', 'en')

    const response = await fetch(url, {
      headers: { 'User-Agent': 'WeatherApp/1.0' },
    })

    if (response.status === 429) {
      captureMessage('Rate limited by upstream API', { url: url.toString() })
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a moment.' },
        { status: 429 }
      )
    }

    if (!response.ok) {
      captureError(new Error(`Nominatim API returned ${response.status}`), {
        lat,
        lng,
        status: response.status,
      })
      return NextResponse.json(
        { error: 'Failed to reverse geocode' },
        { status: 502 }
      )
    }

    const data: unknown = await response.json()
    const parsed = ReverseGeocodingResponseSchema.parse(data)

    const name =
      parsed.address.city ||
      parsed.address.town ||
      parsed.address.village ||
      parsed.name ||
      ''
    const country = parsed.address.country
    const countryCode = parsed.address.country_code.toUpperCase()

    return NextResponse.json(
      { name, country, countryCode },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    captureError(error, { lat, lng })
    return NextResponse.json(
      { error: 'Failed to reverse geocode' },
      { status: 502 }
    )
  }
}
