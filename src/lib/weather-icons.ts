import type { LucideIcon } from 'lucide-react'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Snowflake,
  Sun,
  SunMedium,
} from 'lucide-react'

import type { WeatherCondition } from '@/lib/weather-codes'

const WEATHER_ICONS: Record<WeatherCondition, LucideIcon> = {
  clearSky: Sun,
  mainlyClear: SunMedium,
  partlyCloudy: Cloud,
  overcast: Cloud,
  fog: CloudFog,
  rimeFog: CloudFog,
  lightDrizzle: CloudDrizzle,
  moderateDrizzle: CloudDrizzle,
  denseDrizzle: CloudDrizzle,
  lightFreezingDrizzle: CloudDrizzle,
  denseFreezingDrizzle: CloudDrizzle,
  slightRain: CloudRain,
  moderateRain: CloudRain,
  heavyRain: CloudRain,
  lightFreezingRain: CloudRain,
  heavyFreezingRain: CloudRain,
  slightSnow: Snowflake,
  moderateSnow: Snowflake,
  heavySnow: CloudSnow,
  snowGrains: Snowflake,
  slightRainShowers: CloudRain,
  moderateRainShowers: CloudRain,
  violentRainShowers: CloudRain,
  slightSnowShowers: CloudSnow,
  heavySnowShowers: CloudSnow,
  thunderstorm: CloudLightning,
  thunderstormSlightHail: CloudLightning,
  thunderstormHeavyHail: CloudLightning,
  unknown: Cloud,
}

export function getWeatherIcon(condition: WeatherCondition): LucideIcon {
  return WEATHER_ICONS[condition]
}

const WEATHER_COLORS: Record<WeatherCondition, string> = {
  clearSky: 'text-amber-500',
  mainlyClear: 'text-amber-400',
  partlyCloudy: 'text-slate-400',
  overcast: 'text-slate-400',
  fog: 'text-slate-300',
  rimeFog: 'text-slate-300',
  lightDrizzle: 'text-sky-400',
  moderateDrizzle: 'text-sky-400',
  denseDrizzle: 'text-sky-500',
  lightFreezingDrizzle: 'text-cyan-400',
  denseFreezingDrizzle: 'text-cyan-500',
  slightRain: 'text-blue-400',
  moderateRain: 'text-blue-500',
  heavyRain: 'text-blue-600',
  lightFreezingRain: 'text-cyan-400',
  heavyFreezingRain: 'text-cyan-600',
  slightSnow: 'text-sky-300',
  moderateSnow: 'text-sky-300',
  heavySnow: 'text-sky-400',
  snowGrains: 'text-sky-300',
  slightRainShowers: 'text-blue-400',
  moderateRainShowers: 'text-blue-500',
  violentRainShowers: 'text-blue-600',
  slightSnowShowers: 'text-sky-300',
  heavySnowShowers: 'text-sky-400',
  thunderstorm: 'text-violet-500',
  thunderstormSlightHail: 'text-violet-500',
  thunderstormHeavyHail: 'text-violet-600',
  unknown: 'text-slate-400',
}

export function getWeatherColor(condition: WeatherCondition): string {
  return WEATHER_COLORS[condition]
}

interface WeatherGradient {
  blob1: string
  blob2: string
  blob3: string
}

type GradientCategory =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing'
  | 'snow'
  | 'thunder'

const WEATHER_GRADIENTS: Record<GradientCategory, WeatherGradient> = {
  clear: {
    blob1: 'bg-amber-400',
    blob2: 'bg-rose-300',
    blob3: 'bg-yellow-200',
  },
  cloudy: {
    blob1: 'bg-slate-400',
    blob2: 'bg-blue-200',
    blob3: 'bg-gray-300',
  },
  fog: {
    blob1: 'bg-gray-400',
    blob2: 'bg-slate-200',
    blob3: 'bg-purple-200',
  },
  drizzle: {
    blob1: 'bg-sky-400',
    blob2: 'bg-teal-200',
    blob3: 'bg-blue-300',
  },
  rain: {
    blob1: 'bg-blue-500',
    blob2: 'bg-indigo-300',
    blob3: 'bg-sky-200',
  },
  freezing: {
    blob1: 'bg-cyan-400',
    blob2: 'bg-blue-300',
    blob3: 'bg-teal-200',
  },
  snow: {
    blob1: 'bg-sky-300',
    blob2: 'bg-indigo-200',
    blob3: 'bg-violet-200',
  },
  thunder: {
    blob1: 'bg-violet-500',
    blob2: 'bg-fuchsia-300',
    blob3: 'bg-indigo-400',
  },
}

const CONDITION_TO_GRADIENT: Record<WeatherCondition, GradientCategory> = {
  clearSky: 'clear',
  mainlyClear: 'clear',
  partlyCloudy: 'cloudy',
  overcast: 'cloudy',
  fog: 'fog',
  rimeFog: 'fog',
  lightDrizzle: 'drizzle',
  moderateDrizzle: 'drizzle',
  denseDrizzle: 'drizzle',
  lightFreezingDrizzle: 'freezing',
  denseFreezingDrizzle: 'freezing',
  slightRain: 'rain',
  moderateRain: 'rain',
  heavyRain: 'rain',
  lightFreezingRain: 'freezing',
  heavyFreezingRain: 'freezing',
  slightSnow: 'snow',
  moderateSnow: 'snow',
  heavySnow: 'snow',
  snowGrains: 'snow',
  slightRainShowers: 'rain',
  moderateRainShowers: 'rain',
  violentRainShowers: 'rain',
  slightSnowShowers: 'snow',
  heavySnowShowers: 'snow',
  thunderstorm: 'thunder',
  thunderstormSlightHail: 'thunder',
  thunderstormHeavyHail: 'thunder',
  unknown: 'cloudy',
}

export function getWeatherGradient(
  condition: WeatherCondition
): WeatherGradient {
  return WEATHER_GRADIENTS[CONDITION_TO_GRADIENT[condition]]
}
