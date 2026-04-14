import { z } from 'zod'

export const GeocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string(),
  country_code: z.string(),
  admin1: z.string().optional(),
})

export const GeocodingResponseSchema = z.object({
  results: z.array(GeocodingResultSchema).default([]),
})

export const WeatherCurrentSchema = z.object({
  time: z.string(),
  temperature_2m: z.number(),
  relative_humidity_2m: z.number(),
  apparent_temperature: z.number(),
  weather_code: z.number(),
  wind_speed_10m: z.number(),
  is_day: z.number().transform((v) => v === 1),
})

export const WeatherResponseSchema = z.object({
  timezone: z.string(),
  current: WeatherCurrentSchema,
})

export const ReverseGeocodingResponseSchema = z.object({
  name: z.string().optional().default(''),
  address: z
    .object({
      city: z.string().optional(),
      town: z.string().optional(),
      village: z.string().optional(),
      country: z.string().optional().default(''),
      country_code: z.string().optional().default(''),
    })
    .optional()
    .default({ country: '', country_code: '' }),
})
