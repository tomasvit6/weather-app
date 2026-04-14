import { useEffect, useRef, useState } from 'react'

import { api } from '@/lib/axios'
import { API_ROUTES } from '@/lib/constants'
import { captureError, captureMessage } from '@/lib/logger'
import type { Location } from '@/types'

interface ReverseGeocodeResponse {
  name: string
  country: string
  countryCode: string
}

interface UseGeolocationOptions {
  fallbackName: string
}

export function useGeolocation({
  fallbackName,
}: UseGeolocationOptions): Location | null {
  const [location, setLocation] = useState<Location | null>(null)
  const fallbackNameRef = useRef(fallbackName)

  useEffect(() => {
    fallbackNameRef.current = fallbackName
  }, [fallbackName])

  useEffect(() => {
    if (!navigator.geolocation) return

    let cancelled = false

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        let name = ''
        let country = ''
        let countryCode = ''

        try {
          const res = await api.get<ReverseGeocodeResponse>(
            API_ROUTES.reverseGeocoding,
            { params: { lat: latitude, lng: longitude } }
          )
          name = res.data.name
          country = res.data.country
          countryCode = res.data.countryCode
        } catch (err) {
          captureError(err, { latitude, longitude })
        }

        if (cancelled) return

        setLocation({
          id: 0,
          name: name || fallbackNameRef.current,
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

    return () => {
      cancelled = true
    }
  }, [])

  return location
}
