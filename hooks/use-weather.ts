import useSWR from 'swr'
import type { WeatherData } from '@/app/api/weather/route'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useWeather(coords: { lat: number; lon: number } | null) {
  const { data, error, isLoading } = useSWR<WeatherData>(
    coords ? `/api/weather?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    weather: data,
    isLoading,
    error,
  }
}
