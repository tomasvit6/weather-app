import { useQuery } from '@tanstack/react-query'

import { searchLocations } from '@/lib/geocoding'
import { queryKeys } from '@/lib/query-keys'

export function useGeocodingSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.geocoding.search(query),
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
  })
}
