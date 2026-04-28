import { NextRequest, NextResponse } from 'next/server'

export type WeatherData = {
  temperature: number
  feelsLike: number
  humidity: number
  condition: string
  description: string
  icon: string
  windSpeed: number
  location: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  try {
    // Using Open-Meteo API (free, no API key required)
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    )

    if (!weatherRes.ok) {
      throw new Error('Weather API failed')
    }

    const weatherData = await weatherRes.json()
    const current = weatherData.current

    // Map WMO weather codes to conditions
    const weatherCode = current.weather_code
    const { condition, description, icon } = mapWeatherCode(weatherCode)

    // Get location name from reverse geocoding
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'OutfitGenerator/1.0',
        },
      }
    )
    
    let location = 'Unknown location'
    if (geoRes.ok) {
      const geoData = await geoRes.json()
      const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || ''
      const country = geoData.address?.country || ''
      location = city ? `${city}, ${country}` : country
    }

    const data: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      condition,
      description,
      icon,
      windSpeed: Math.round(current.wind_speed_10m),
      location,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}

function mapWeatherCode(code: number): { condition: string; description: string; icon: string } {
  const mapping: Record<number, { condition: string; description: string; icon: string }> = {
    0: { condition: 'clear', description: 'Clear sky', icon: 'sun' },
    1: { condition: 'clear', description: 'Mainly clear', icon: 'sun' },
    2: { condition: 'cloudy', description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { condition: 'cloudy', description: 'Overcast', icon: 'cloud' },
    45: { condition: 'fog', description: 'Foggy', icon: 'cloud-fog' },
    48: { condition: 'fog', description: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { condition: 'drizzle', description: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { condition: 'drizzle', description: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { condition: 'drizzle', description: 'Dense drizzle', icon: 'cloud-drizzle' },
    61: { condition: 'rain', description: 'Slight rain', icon: 'cloud-rain' },
    63: { condition: 'rain', description: 'Moderate rain', icon: 'cloud-rain' },
    65: { condition: 'rain', description: 'Heavy rain', icon: 'cloud-rain' },
    71: { condition: 'snow', description: 'Slight snow', icon: 'snowflake' },
    73: { condition: 'snow', description: 'Moderate snow', icon: 'snowflake' },
    75: { condition: 'snow', description: 'Heavy snow', icon: 'snowflake' },
    80: { condition: 'rain', description: 'Slight showers', icon: 'cloud-rain' },
    81: { condition: 'rain', description: 'Moderate showers', icon: 'cloud-rain' },
    82: { condition: 'rain', description: 'Violent showers', icon: 'cloud-rain' },
    95: { condition: 'thunderstorm', description: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { condition: 'thunderstorm', description: 'Thunderstorm with hail', icon: 'cloud-lightning' },
    99: { condition: 'thunderstorm', description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  }

  return mapping[code] || { condition: 'clear', description: 'Clear', icon: 'sun' }
}
