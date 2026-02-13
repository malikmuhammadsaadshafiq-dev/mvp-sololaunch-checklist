'use client'

export function SkeletonCard() {
  return (
    <div className="clay-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 rounded-full skeleton" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full skeleton" />
            <div className="h-6 w-20 rounded-full skeleton" />
          </div>
          <div className="h-5 w-3/4 rounded-lg skeleton" />
          <div className="h-4 w-full rounded-lg skeleton" />
          <div className="h-4 w-2/3 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  )
}