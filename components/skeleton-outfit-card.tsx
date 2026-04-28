'use client'

export function SkeletonOutfitCard() {
  return (
    <div className="bg-card border border-border p-4 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-8 h-8 bg-muted" />
        <div className="h-5 bg-muted w-32 mx-auto" />
        <div className="w-12 h-6 bg-muted" />
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 p-3 border border-border">
            <div className="w-20 h-20 bg-muted flex-shrink-0" />
            <div className="flex flex-col flex-1 gap-2">
              <div className="h-3 bg-muted w-16" />
              <div className="h-4 bg-muted w-28" />
              <div className="h-4 bg-muted w-12 mt-auto" />
            </div>
            <div className="self-end w-12 h-7 bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
