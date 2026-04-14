import { NextRequest, NextResponse } from 'next/server'

import { captureError } from '@/lib/logger'

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
    const result = data as Record<string, unknown>
    const address = (result.address ?? {}) as Record<string, string>

    const name =
      address.city ||
      address.town ||
      address.village ||
      (result.name as string) ||
      ''
    const country = address.country || ''
    const countryCode = (address.country_code || '').toUpperCase()

    return NextResponse.json({ name, country, countryCode })
  } catch (error) {
    captureError(error, { lat, lng })
    return NextResponse.json(
      { error: 'Failed to reverse geocode' },
      { status: 502 }
    )
  }
}
