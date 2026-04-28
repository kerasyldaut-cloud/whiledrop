'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  onUpload: (file: File | null, base64: string | null) => void
  onSkip: () => void
}

export function PhotoUpload({ onUpload, onSkip }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const base64Ref = useRef<string | null>(null)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        base64Ref.current = result
        setIsAnalyzing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              const file = fileInputRef.current?.files?.[0] || null
              onUpload(file, base64Ref.current)
            }, 300)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing, onUpload])

  return (
    <div className={`flex flex-col gap-6 transition-all duration-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center">
        <h2 className="text-lg font-medium text-foreground mb-2">
          Upload Your Current Outfit
        </h2>
        <p className="text-sm text-muted-foreground">
          Help us understand your style better
        </p>
      </div>

      {!preview ? (
        <label className="flex flex-col items-center justify-center gap-4 p-12 border border-dashed border-border cursor-pointer hover:bg-muted transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Click to upload a photo
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative w-32 h-32 mx-auto bg-muted overflow-hidden">
            <Image
              src={preview}
              alt="Uploaded outfit"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground mb-3">
              Analyzing your style...
            </p>
            <div className="w-full h-0.5 bg-border overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && (
        <button
          onClick={onSkip}
          className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border hover:bg-muted"
        >
          Skip this step
        </button>
      )}
    </div>
  )
}
