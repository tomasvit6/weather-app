import { NextRequest, NextResponse } from 'next/server'

import { GEOCODING_API_URL } from '@/lib/constants'
import { captureError } from '@/lib/logger'
import { GeocodingResponseSchema } from '@/lib/schemas'
import type { Location } from '@/types'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get('query')

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    )
  }

  try {
    const url = new URL(`${GEOCODING_API_URL}/search`)
    url.searchParams.set('name', query.trim())
    url.searchParams.set('count', '5')
    url.searchParams.set('language', 'en')

    const response = await fetch(url)

    if (!response.ok) {
      captureError(new Error(`Geocoding API returned ${response.status}`), {
        query,
        status: response.status,
      })
      return NextResponse.json(
        { error: 'Failed to fetch location data' },
        { status: 502 }
      )
    }

    const data: unknown = await response.json()
    const parsed = GeocodingResponseSchema.parse(data)

    const locations: Location[] = parsed.results.map((result) => ({
      id: result.id,
      name: result.name,
      country: result.country,
      countryCode: result.country_code,
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
    }))

    return NextResponse.json(locations)
  } catch (error) {
    captureError(error, { query })
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 502 }
    )
  }
}
