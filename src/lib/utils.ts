import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function calculateProgress(items: { completed: boolean }[]): number {
  if (items.length === 0) return 0
  const completed = items.filter(item => item.completed).length
  return Math.round((completed / items.length) * 100)
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-rose-600 bg-rose-50 border-rose-200'
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'legal':
      return '⚖️'
    case 'technical':
      return '⚙️'
    case 'marketing':
      return '📢'
    default:
      return '📋'
  }
}