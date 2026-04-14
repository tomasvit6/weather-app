import { api } from '@/lib/axios'
import { API_ROUTES } from '@/lib/constants'
import type { Location } from '@/types'

export async function searchLocations(query: string): Promise<Location[]> {
  const response = await api.get<Location[]>(API_ROUTES.geocoding, {
    params: { query },
  })
  return response.data
}
