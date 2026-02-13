'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Trash2, AlertTriangle } from 'lucide-react'
import { cn, formatDate, getPriorityColor } from '@/lib/utils'

interface ChecklistItem {
  id: string
  title: string
  category: 'legal' | 'technical' | 'marketing'
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dateAdded: string
  description: string
}

interface ChecklistCardProps {
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  animationDelay?: number
}

export function ChecklistCard({ item, onToggle, onDelete, animationDelay = 0 }: ChecklistCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(item.id)
    }, 300)
  }

  const categoryColors = {
    legal: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    technical: 'bg-blue-100 text-blue-700 border-blue-200',
    marketing: 'bg-pink-100 text-pink-700 border-pink-200',
  }

  const categoryLabels = {
    legal: 'Legal',
    technical: 'Technical',
    marketing: 'Marketing',
  }

  return (
    <div
      className={cn(
        'group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
        isDeleting && 'animate-slide-out-left opacity-0',
        item.completed && 'opacity-75'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(item.id)}
          className={cn(
            'mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
            item.completed
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 border-transparent'
              : 'border-gray-300 hover:border-amber-500'
          )}
          aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', categoryColors[item.category])}>
              {categoryLabels[item.category]}
            </span>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', getPriorityColor(item.priority))}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
            </span>
            {item.priority === 'high' && !item.completed && (
              <button
                onClick={() => setShowWarning(!showWarning)}
                className="text-amber-600 hover:text-amber-700"
                aria-label="Show warning"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            )}
          </div>

          <h3
            className={cn(
              'font-semibold text-gray-800 mb-1 transition-all duration-200',
              item.completed && 'line-through text-gray-500'
            )}
          >
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Added {formatDate(item.dateAdded)}</span>
            
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
              aria-label="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {showWarning && item.priority === 'high' && !item.completed && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 animate-fade-in-up">
              <strong>Launch Blocker:</strong> This high-priority item is incomplete and may prevent a successful launch.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}