'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileForm } from '@/components/profile-form'
import { PhotoUpload } from '@/components/photo-upload'
import { OutfitCard } from '@/components/outfit-card'
import { WeatherDisplay } from '@/components/weather-display'
import { SkeletonOutfitCard } from '@/components/skeleton-outfit-card'
import { useWeather } from '@/hooks/use-weather'
import { AppStep, UserProfile, OutfitResult } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { RefreshCw, ArrowLeft, LogOut, User } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<AppStep>('form')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [outfits, setOutfits] = useState<OutfitResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  )
  const [photoAnalysis, setPhotoAnalysis] = useState<string | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [fadeIn, setFadeIn] = useState(false)

  const { weather, isLoading: weatherLoading } = useWeather(coords)
  // Defer client creation so prerender doesn't read missing env vars.
  const [supabase] = useState(() => createClient())

  // Stable refs so callbacks don't capture stale values.
  const weatherRef = useRef(weather)
  const photoAnalysisRef = useRef(photoAnalysis)
  const userProfileRef = useRef(userProfile)
  useEffect(() => {
    weatherRef.current = weather
  }, [weather])
  useEffect(() => {
    photoAnalysisRef.current = photoAnalysis
  }, [photoAnalysis])
  useEffect(() => {
    userProfileRef.current = userProfile
  }, [userProfile])

  // Check auth state
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Get user location
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        // Silent fail - weather just won't show
      },
    )
  }, [])

  // Fade in animation
  useEffect(() => {
    setFadeIn(true)
  }, [currentStep])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    // Middleware will redirect '/' -> '/auth/login' once the session is gone.
    router.push('/auth/login')
    router.refresh()
  }

  const generateOutfits = async (profile: UserProfile, analysis?: string) => {
    setIsGenerating(true)
    setFadeIn(false)

    try {
      const response = await fetch('/api/generate-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          weather: weatherRef.current || null,
          photoAnalysis: analysis || photoAnalysisRef.current,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate')

      const data = await response.json()

      // Transform AI response to match our types
      const transformedOutfits: OutfitResult[] = data.outfits.map(
        (outfit: {
          id: string
          name: string
          items: Array<{
            type: string
            name: string
            brand: string
            price: number
            imageUrl: string
            productUrl: string
          }>
          totalCost: number
        }) => ({
          id: outfit.id,
          title: outfit.name,
          totalCost: outfit.totalCost,
          saved: false,
          items: outfit.items.map((item) => ({
            type: item.type,
            name: `${item.brand} ${item.name}`,
            price: item.price,
            imageUrl: item.imageUrl,
            buyUrl: item.productUrl,
          })),
        }),
      )

      setOutfits(transformedOutfits)
      setTimeout(() => setFadeIn(true), 50)
    } catch (error) {
      console.error('[v0] Generation error:', error)
      setOutfits([])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile)
    setFadeIn(false)
    setTimeout(() => {
      setCurrentStep('upload')
    }, 150)
  }

  const handlePhotoUpload = async (
    file: File | null,
    base64: string | null,
  ) => {
    const profile = userProfileRef.current
    if (!profile) return

    if (file && base64) {
      try {
        const response = await fetch('/api/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            style: profile.style,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setPhotoAnalysis(data.analysis)
          setFadeIn(false)
          setTimeout(() => {
            setCurrentStep('results')
            generateOutfits(profile, data.analysis)
          }, 150)
          return
        }
      } catch (error) {
        console.error('[v0] Photo analysis error:', error)
      }
    }

    // If no photo or analysis failed, just generate
    setFadeIn(false)
    setTimeout(() => {
      setCurrentStep('results')
      generateOutfits(profile)
    }, 150)
  }

  const handleSkipUpload = () => {
    const profile = userProfileRef.current
    if (!profile) return
    setFadeIn(false)
    setTimeout(() => {
      setCurrentStep('results')
      generateOutfits(profile)
    }, 150)
  }

  const handleRegenerate = () => {
    if (userProfile) {
      generateOutfits(userProfile)
    }
  }

  const handleSaveOutfit = async (id: string) => {
    const outfit = outfits.find((o) => o.id === id)
    if (!outfit) return

    const willBeSaved = !outfit.saved

    // Optimistic update
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, saved: willBeSaved } : o)),
    )

    if (!user) return

    try {
      if (willBeSaved) {
        const { error } = await supabase.from('saved_outfits').insert({
          user_id: user.id,
          outfit_name: outfit.title,
          outfit_data: outfit,
          total_cost: outfit.totalCost,
        })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('saved_outfits')
          .delete()
          .eq('user_id', user.id)
          .eq('outfit_name', outfit.title)
        if (error) throw error
      }
    } catch (error) {
      console.error('[v0] Save error:', error)
      // Revert optimistic update on failure
      setOutfits((prev) =>
        prev.map((o) => (o.id === id ? { ...o, saved: !willBeSaved } : o)),
      )
    }
  }

  const handleBack = () => {
    setFadeIn(false)
    setTimeout(() => {
      if (currentStep === 'upload') {
        setCurrentStep('form')
      } else if (currentStep === 'results') {
        setCurrentStep('form')
        setOutfits([])
        setPhotoAnalysis(null)
      }
      setTimeout(() => setFadeIn(true), 50)
    }, 150)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {currentStep !== 'form' ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Start over
            </button>
          ) : (
            <div />
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              Sign in
            </Link>
          )}
        </div>

        {/* Weather display */}
        {coords && currentStep === 'form' && (
          <div
            className={`mb-6 transition-all duration-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            <WeatherDisplay
              weather={weather ?? null}
              isLoading={weatherLoading}
            />
          </div>
        )}

        {/* Main content with transitions */}
        <div
          className={`transition-all duration-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {currentStep === 'form' && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h1 className="text-xl font-medium text-foreground mb-2">
                  Outfit Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tell us about yourself to get personalized outfit
                  recommendations
                </p>
              </div>
              <ProfileForm onSubmit={handleProfileSubmit} />
            </div>
          )}

          {currentStep === 'upload' && (
            <PhotoUpload
              onUpload={handlePhotoUpload}
              onSkip={handleSkipUpload}
            />
          )}

          {currentStep === 'results' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">
                  Your Outfits
                </h2>
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground border border-border hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
                  />
                  Regenerate
                </button>
              </div>

              {userProfile && (
                <div className="text-xs text-muted-foreground pb-4 border-b border-border">
                  {userProfile.style.charAt(0).toUpperCase() +
                    userProfile.style.slice(1).replace('-', ' ')}{' '}
                  style, Budget: ${userProfile.budget}
                  {weather && `, ${weather.temperature}°C ${weather.description}`}
                </div>
              )}

              {photoAnalysis && (
                <div className="text-xs text-muted-foreground p-3 border border-border bg-muted/50">
                  <span className="font-medium text-foreground">
                    Photo analysis:
                  </span>{' '}
                  {photoAnalysis}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {isGenerating ? (
                  <>
                    <SkeletonOutfitCard />
                    <SkeletonOutfitCard />
                    <SkeletonOutfitCard />
                  </>
                ) : (
                  outfits.map((outfit, index) => (
                    <div
                      key={outfit.id}
                      className="transition-all duration-300"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeSlideIn 0.4s ease-out forwards',
                        opacity: 0,
                      }}
                    >
                      <OutfitCard outfit={outfit} onSave={handleSaveOutfit} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
