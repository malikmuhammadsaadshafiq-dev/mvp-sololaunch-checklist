'use client'

import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { cn, calculateProgress } from '@/lib/utils'

interface ChecklistItem {
  id: string
  title: string
  category: 'legal' | 'technical' | 'marketing'
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dateAdded: string
  description: string
}

interface DashboardViewProps {
  items: ChecklistItem[]
}

export function DashboardView({ items }: DashboardViewProps) {
  const totalItems = items.length
  const completedItems = items.filter(item => item.completed).length
  const completionRate = calculateProgress(items)
  const highPriorityIncomplete = items.filter(item => item.priority === 'high' && !item.completed).length
  
  const byCategory = {
    legal: { total: 0, completed: 0 },
    technical: { total: 0, completed: 0 },
    marketing: { total: 0, completed: 0 },
  }
  
  items.forEach(item => {
    byCategory[item.category].total++
    if (item.completed) byCategory[item.category].completed++
  })

  const recentActivity = [...items]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{completionRate}%</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Completion Rate</p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{totalItems - completedItems}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
          <p className="text-xs text-gray-400 mt-1">{completedItems} of {totalItems} completed</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{highPriorityIncomplete}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">High Priority Blockers</p>
          <p className="text-xs text-gray-400 mt-1">Critical items remaining</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{Math.round((completedItems / (totalItems || 1)) * 100)}%</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Launch Readiness</p>
          <p className="text-xs text-gray-400 mt-1">Based on completion rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Status by Category</h3>
          <div className="space-y-4">
            {Object.entries(byCategory).map(([category, stats]) => {
              const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium text-gray-700">{category}</span>
                    <span className="text-gray-500">{stats.completed}/{stats.total} ({percent}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        category === 'legal' && 'bg-indigo-500',
                        category === 'technical' && 'bg-blue-500',
                        category === 'marketing' && 'bg-pink-500'
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                    item.completed ? 'bg-emerald-500' : 'bg-amber-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {item.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}