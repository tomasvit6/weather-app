import { useEffect, useState } from 'react'

import { api } from '@/lib/axios'
import { captureError, captureMessage } from '@/lib/logger'
import type { Location } from '@/types'

interface ReverseGeocodeResponse {
  name: string
  country: string
  countryCode: string
}

export function useGeolocation(): Location | null {
  const [location, setLocation] = useState<Location | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        let name = ''
        let country = ''
        let countryCode = ''

        try {
          const res = await api.get<ReverseGeocodeResponse>(
            '/reverse-geocoding',
            { params: { lat: latitude, lng: longitude } }
          )
          name = res.data.name
          country = res.data.country
          countryCode = res.data.countryCode
        } catch (err) {
          captureError(err, { latitude, longitude })
        }

        setLocation({
          id: 0,
          name: name || 'Your Location',
          country,
          countryCode,
          latitude,
          longitude,
        })
      },
      (err) => {
        captureMessage('Geolocation denied or unavailable', {
          code: err.code,
          message: err.message,
        })
      },
      { timeout: 8000, maximumAge: 300_000 }
    )
  }, [])

  return location
}
