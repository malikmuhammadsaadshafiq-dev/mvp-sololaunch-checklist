'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

export function ProgressBar({
  percentage,
  label,
  size = 'md',
  showPercentage = true,
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && (
            <span className="text-sm text-[#8b949e]">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-[#3fb950]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-[#30363d] rounded-full overflow-hidden', heights[size])}>
        <div
          className="h-full bg-[#238636] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  )
}