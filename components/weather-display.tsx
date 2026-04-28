'use client'

import type { WeatherData } from '@/app/api/weather/route'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun } from 'lucide-react'

type WeatherDisplayProps = {
  weather: WeatherData | null
  isLoading: boolean
}

const iconMap: Record<string, React.ElementType> = {
  'sun': Sun,
  'cloud': Cloud,
  'cloud-sun': CloudSun,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
  'cloud-fog': CloudFog,
  'snowflake': CloudSnow,
  'cloud-lightning': CloudLightning,
}

export function WeatherDisplay({ weather, isLoading }: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <div className="border border-border bg-card p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted" />
          <div className="flex-1">
            <div className="h-4 bg-muted w-20 mb-2" />
            <div className="h-3 bg-muted w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const IconComponent = iconMap[weather.icon] || Sun

  return (
    <div className="border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <IconComponent size={28} strokeWidth={1.5} className="text-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-medium text-foreground">{weather.temperature}°C</span>
            <span className="text-sm text-muted-foreground">feels like {weather.feelsLike}°C</span>
          </div>
          <p className="text-sm text-muted-foreground">{weather.description} in {weather.location}</p>
        </div>
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground">{weather.humidity}%</span> humidity
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground">{weather.windSpeed} km/h</span> wind
        </div>
      </div>
    </div>
  )
}
