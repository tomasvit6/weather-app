export const queryKeys = {
  weather: {
    all: ['weather'] as const,
    byLocation: (lat: number, lng: number) =>
      [...queryKeys.weather.all, lat, lng] as const,
  },
  geocoding: {
    all: ['geocoding'] as const,
    search: (query: string) => [...queryKeys.geocoding.all, query] as const,
  },
} as const
