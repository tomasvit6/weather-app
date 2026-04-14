const WEATHER_CODES: Record<number, string> = {
  0: 'clearSky',
  1: 'mainlyClear',
  2: 'partlyCloudy',
  3: 'overcast',
  45: 'fog',
  48: 'rimeFog',
  51: 'lightDrizzle',
  53: 'moderateDrizzle',
  55: 'denseDrizzle',
  56: 'lightFreezingDrizzle',
  57: 'denseFreezingDrizzle',
  61: 'slightRain',
  63: 'moderateRain',
  65: 'heavyRain',
  66: 'lightFreezingRain',
  67: 'heavyFreezingRain',
  71: 'slightSnow',
  73: 'moderateSnow',
  75: 'heavySnow',
  77: 'snowGrains',
  80: 'slightRainShowers',
  81: 'moderateRainShowers',
  82: 'violentRainShowers',
  85: 'slightSnowShowers',
  86: 'heavySnowShowers',
  95: 'thunderstorm',
  96: 'thunderstormSlightHail',
  99: 'thunderstormHeavyHail',
}

export function getWeatherCondition(code: number): string {
  return WEATHER_CODES[code] ?? 'unknown'
}
