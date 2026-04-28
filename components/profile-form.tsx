'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const STYLES = [
  { value: 'old-money', label: 'Old Money' },
  { value: 'grunge', label: 'Grunge' },
  { value: 'drill', label: 'Drill' },
  { value: 'sport', label: 'Sport' },
  { value: 'casual', label: 'Casual' },
  { value: 'opium', label: 'Opium' },
] as const;

export function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    location: '',
    gender: 'men',
    age: 25,
    height: 170,
    heightUnit: 'cm',
    budget: 300,
    style: 'old-money',
  });

  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string>('');

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }

          const data = await response.json();
          
          const city = data.address?.city || 
                       data.address?.town || 
                       data.address?.village || 
                       data.address?.municipality ||
                       data.address?.county ||
                       'Unknown';
          const country = data.address?.country || 'Unknown';
          const locationString = `${city}, ${country}`;
          
          setProfile((prev) => ({ ...prev, location: locationString }));
          setLocationStatus('success');
        } catch {
          setLocationStatus('error');
          setLocationError('Failed to detect location');
        }
      },
      (error) => {
        setLocationStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('Failed to detect location');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Location / Region
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder={locationStatus === 'loading' ? 'Detecting location...' : 'Enter your location'}
              required
              className="w-full px-3 py-2.5 bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {locationStatus === 'loading' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border border-muted-foreground border-t-transparent animate-spin" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={detectLocation}
            disabled={locationStatus === 'loading'}
            className="px-3 py-2.5 bg-card border border-border text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-50"
            title="Detect my location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
          </button>
        </div>
        {locationStatus === 'error' && locationError && (
          <p className="text-xs text-destructive">{locationError}</p>
        )}
        {locationStatus === 'success' && (
          <p className="text-xs text-muted-foreground">Location detected automatically</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Gender</label>
        <div className="flex gap-0 border border-border">
          {(['men', 'women', 'unisex'] as const).map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setProfile({ ...profile, gender })}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                profile.gender === gender
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Age: {profile.age}
        </label>
        <input
          type="range"
          min="16"
          max="65"
          value={profile.age}
          onChange={(e) =>
            setProfile({ ...profile, age: parseInt(e.target.value) })
          }
          className="w-full h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>16</span>
          <span>65+</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Height</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={profile.height}
            onChange={(e) =>
              setProfile({ ...profile, height: parseInt(e.target.value) || 0 })
            }
            className="flex-1 px-3 py-2.5 bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex border border-border">
            {(['cm', 'ft'] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setProfile({ ...profile, heightUnit: unit })}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  profile.heightUnit === unit
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Budget: ${profile.budget}
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="10"
          value={profile.budget}
          onChange={(e) =>
            setProfile({ ...profile, budget: parseInt(e.target.value) })
          }
          className="w-full h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$50</span>
          <span>$1000+</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Style Preference
        </label>
        <select
          value={profile.style}
          onChange={(e) =>
            setProfile({
              ...profile,
              style: e.target.value as UserProfile['style'],
            })
          }
          className="w-full px-3 py-2.5 bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {STYLES.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mt-2"
      >
        Generate My Outfit
      </button>
    </form>
  );
}
