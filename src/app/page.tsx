'use client'

import { useState, useEffect } from 'react'
import { ChecklistCard } from '@/components/ChecklistCard'
import { DashboardView } from '@/components/DashboardView'
import { Toast } from '@/components/Toast'
import { cn, calculateProgress } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import { 
  Plus, 
  Search, 
  Download, 
  Settings, 
  LayoutDashboard, 
  Home,
  Moon,
  Sun,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react'

type Category = 'legal' | 'technical' | 'marketing'
type Priority = 'high' | 'medium' | 'low'

interface ChecklistItem {
  id: string
  title: string
  category: Category
  completed: boolean
  priority: Priority
  dateAdded: string
  description: string
}

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const initialItems: ChecklistItem[] = [
  {
    id: '1',
    title: 'Privacy Policy Drafted and Reviewed',
    category: 'legal',
    completed: true,
    priority: 'high',
    dateAdded: '2024-03-15',
    description: 'Comprehensive privacy policy covering data collection, storage, and user rights. Reviewed by legal counsel to ensure GDPR and CCPA compliance.'
  },
  {
    id: '2',
    title: 'Terms of Service Implemented',
    category: 'legal',
    completed: false,
    priority: 'high',
    dateAdded: '2024-03-16',
    description: 'Clear TOS outlining user responsibilities, liability limitations, and dispute resolution procedures. Must be accessible from signup flow.'
  },
  {
    id: '3',
    title: 'GDPR Compliance Checklist Completed',
    category: 'legal',
    completed: false,
    priority: 'high',
    dateAdded: '2024-03-17',
    description: 'Right to be forgotten implementation, data portability features, and consent management system with granular opt-in controls.'
  },
  {
    id: '4',
    title: 'SSL Certificate Configuration',
    category: 'technical',
    completed: true,
    priority: 'high',
    dateAdded: '2024-03-10',
    description: 'Wildcard SSL installed with automatic renewal, HTTP/2 enabled, and security headers configured including HSTS and CSP.'
  },
  {
    id: '5',
    title: 'Automated Database Backups',
    category: 'technical',
    completed: true,
    priority: 'high',
    dateAdded: '2024-03-12',
    description: 'Daily automated backups with 30-day retention, tested restoration procedures documented, and offsite storage configured.'
  },
  {
    id: '6',
    title: 'Error Monitoring Setup',
    category: 'technical',
    completed: false,
    priority: 'medium',
    dateAdded: '2024-03-18',
    description: 'Sentry integration with source maps, alerting rules for critical errors, and error boundary implementation in React components.'
  },
  {
    id: '7',
    title: 'Analytics Tracking Implementation',
    category: 'marketing',
    completed: true,
    priority: 'medium',
    dateAdded: '2024-03-14',
    description: 'Google Analytics 4 and Mixpanel configured with custom events for key user journeys, conversion funnels, and retention metrics.'
  },
  {
    id: '8',
    title: 'Email Deliverability Testing',
    category: 'technical',
    completed: false,
    priority: 'high',
    dateAdded: '2024-03-19',
    description: 'SPF, DKIM, DMARC records configured. Inbox placement tested across Gmail, Outlook, and Yahoo with 95%+ deliverability rate.'
  },
  {
    id: '9',
    title: 'Payment Gateway Integration',
    category: 'technical',
    completed: false,
    priority: 'high',
    dateAdded: '2024-03-20',
    description: 'Stripe integration with webhook handling, subscription management, failed payment recovery, and invoice generation.'
  },
  {
    id: '10',
    title: 'Load Testing Completed',
    category: 'technical',
    completed: false,
    priority: 'medium',
    dateAdded: '2024-03-21',
    description: 'Simulated 1000 concurrent users, identified bottlenecks in database queries, implemented Redis caching layer for performance.'
  },
  {
    id: '11',
    title: 'SEO Meta Tags Optimization',
    category: 'marketing',
    completed: true,
    priority: 'medium',
    dateAdded: '2024-03-13',
    description: 'Dynamic meta titles and descriptions, Open Graph tags for social sharing, structured data for rich snippets in search results.'
  },
  {
    id: '12',
    title: 'Social Media Assets Prepared',
    category: 'marketing',
    completed: false,
    priority: 'low',
    dateAdded: '2024-03-22',
    description: 'Twitter cards, LinkedIn banners, and product screenshots sized for various platforms. Brand guidelines documented.'
  },
  {
    id: '13',
    title: 'User Onboarding Flow Tested',
    category: 'technical',
    completed: false,
    priority: 'high',
    dateAdded: '2024-03-23',
    description: 'End-to-end testing of signup process, email verification, first-time user experience, and interactive tutorial completion rates.'
  },
  {
    id: '14',
    title: 'API Documentation Published',
    category: 'technical',
    completed: false,
    priority: 'medium',
    dateAdded: '2024-03-24',
    description: 'Comprehensive API docs with request/response examples, authentication guide, rate limiting details, and SDK references.'
  },
  {
    id: '15',
    title: 'Pricing Strategy Finalized',
    category: 'marketing',
    completed: true,
    priority: 'high',
    dateAdded: '2024-03-11',
    description: 'Three-tier pricing model with annual discounts, competitive analysis completed, profit margins calculated, and Stripe products configured.'
  }
]

export default function SoloLaunchChecklist() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'settings'>('home')
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date')
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [userName, setUserName] = useState('Solo Developer')
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical' as Category,
    priority: 'medium' as Priority
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedItems = localStorage.getItem('sololaunch-items')
    const savedDarkMode = localStorage.getItem('sololaunch-darkmode')
    const savedUserName = localStorage.getItem('sololaunch-username')
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {
        console.error('Failed to parse saved items')
      }
    }
    
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true')
    }
    
    if (savedUserName) {
      setUserName(savedUserName)
    }

    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('sololaunch-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('sololaunch-darkmode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('sololaunch-username', userName)
  }, [userName])

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    const item = items.find(i => i.id === id)
    if (item) {
      addToast(`${item.completed ? 'Marked incomplete' : 'Completed'}: ${item.title}`, 'success')
    }
  }

  const deleteItem = (id: string) => {
    setDeletingId(id)
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id))
      setDeletingId(null)
      addToast('Item deleted successfully', 'success')
    }, 300)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }
    if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters'
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      completed: false,
      dateAdded: new Date().toISOString().split('T')[0]
    }
    
    setItems(prev => [newItem, ...prev])
    setFormData({ title: '', description: '', category: 'technical', priority: 'medium' })
    setFormErrors({})
    setShowAddForm(false)
    addToast('New checklist item added', 'success')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const completionRate = calculateProgress(items)
    
    doc.setFontSize(20)
    doc.text('SoloLaunch Readiness Report', 20, 30)
    
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
    doc.text(`Overall Completion: ${completionRate}%`, 20, 55)
    doc.text(`Total Items: ${items.length}`, 20, 65)
    doc.text(`Completed: ${items.filter(i => i.completed).length}`, 20, 75)
    
    let y = 95
    doc.setFontSize(14)
    doc.text('Pending Items:', 20, y)
    y += 10
    
    doc.setFontSize(10)
    items.filter(i => !i.completed).forEach(item => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(`[ ] ${item.title} (${item.category}, ${item.priority} priority)`, 20, y)
      y += 7
    })
    
    doc.save('sololaunch-readiness-report.pdf')
    addToast('PDF report downloaded', 'success')
  }

  const exportData = () => {
    const dataStr = JSON.stringify(items, null, 2)
    navigator.clipboard.writeText(dataStr)
    addToast('Data copied to clipboard', 'success')
  }

  const filteredItems = items
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })

  const highPriorityBlockers = items.filter(i => i.priority === 'high' && !i.completed).length

  return (
    <div className={cn('min-h-screen transition-colors duration-300', darkMode ? 'dark bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50')}>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  SoloLaunch
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Pre-launch readiness checker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  activeTab === 'home' 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-gray-600 hover:bg-orange-50'
                )}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Checklist</span>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  activeTab === 'dashboard' 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-gray-600 hover:bg-orange-50'
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  activeTab === 'settings' 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-gray-600 hover:bg-orange-50'
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in-up">
            {highPriorityBlockers > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  You have {highPriorityBlockers} high-priority blocker{highPriorityBlockers > 1 ? 's' : ''} preventing launch readiness
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., SSL certificate or privacy policy"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/70 backdrop-blur-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="category">Sort by Category</option>
                </select>
                
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>

            {showAddForm && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add New Checklist Item</h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Configure automated database backups"
                      className={cn(
                        'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all',
                        formErrors.title ? 'border-rose-300 focus:ring-rose-500/50' : 'border-orange-200 focus:ring-amber-500/50'
                      )}
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-rose-600">{formErrors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Set up daily automated backups with 30-day retention period and offsite storage"
                      rows={3}
                      className={cn(
                        'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none',
                        formErrors.description ? 'border-rose-300 focus:ring-rose-500/50' : 'border-orange-200 focus:ring-amber-500/50'
                      )}
                    />
                    {formErrors.description && <p className="mt-1 text-sm text-rose-600">{formErrors.description}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        <option value="legal">Legal</option>
                        <option value="technical">Technical</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                        className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={!formData.title.trim() || !formData.description.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/70 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full skeleton flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 skeleton rounded" />
                        <div className="h-3 w-1/2 skeleton rounded" />
                        <div className="h-3 w-full skeleton rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first pre-launch checklist item</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredItems.map((item, index) => (
                  <ChecklistCard
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onDelete={deleteItem}
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView items={items} />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-rose-100 rounded-xl">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
                  <p className="text-sm text-gray-600">Manage your preferences</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g., Alex Chen"
                    className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-600" />}
                    <div>
                      <p className="font-medium text-gray-800">Dark Mode</p>
                      <p className="text-sm text-gray-600">Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50',
                      darkMode ? 'bg-amber-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Data Export</h2>
                  <p className="text-sm text-gray-600">Backup your checklist data</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Export Readiness Report (PDF)
                </button>
                
                <button
                  onClick={exportData}
                  className="w-full px-4 py-3 border-2 border-orange-200 text-gray-700 font-medium rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Copy Data to Clipboard (JSON)
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl border border-orange-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-2">About SoloLaunch</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                SoloLaunch helps independent developers validate their SaaS products before going live. 
                Track legal compliance, technical readiness, and marketing preparation in one place.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Version 1.0.0</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}