import { api } from '@/lib/axios'
import type { Location } from '@/types'

export async function searchLocations(query: string): Promise<Location[]> {
  const response = await api.get<Location[]>('/geocoding', {
    params: { query },
  })
  return response.data
}
