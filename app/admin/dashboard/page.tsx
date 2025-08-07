'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ContactEntry } from '@/types/contact'
import { 
  Trash2, 
  LogOut, 
  Mail, 
  User, 
  Calendar, 
  Monitor,
  TrendingUp,
  Clock,
  RefreshCw,
  Home,
  MessageSquare,
  Menu,
  X
} from 'lucide-react'

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState<'home' | 'contacts'>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchContacts(token)
  }, [router])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchContacts = async (token: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch contacts')
      }

      const data = await response.json()
      setContacts(data.data || [])
    } catch (err) {
      console.error('Fetch contacts error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const token = localStorage.getItem('adminToken')
    if (token) {
      await fetchContacts(token)
    }
    setIsRefreshing(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact entry?')) return

    setIsDeleting(id)
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to delete contact')
      }

      setContacts(prev => prev.filter(contact => contact.id !== id))
    } catch (err) {
      console.error('Delete contact error:', err)
      alert('Failed to delete contact')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
      } catch (err) {
        console.error('Logout error:', err)
      }
    }
    
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate statistics
  const stats = {
    totalContacts: contacts.length,
    todayContacts: contacts.filter(contact => {
      const today = new Date()
      const contactDate = new Date(contact.createdAt)
      return contactDate.toDateString() === today.toDateString()
    }).length,
    thisWeekContacts: contacts.filter(contact => {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const contactDate = new Date(contact.createdAt)
      return contactDate >= weekAgo
    }).length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#017aff] text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#017aff] p-2 rounded-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Left Navigation */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-[#017aff]/20 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo and Header */}
          <div className="p-6 border-b border-[#017aff]/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#017aff] p-2 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">YourMedia</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            
            {/* Current Time */}
            <div className="text-center">
              <div className="text-2xl font-bold text-[#017aff]">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('home')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'home'
                    ? 'bg-[#017aff] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveSection('contacts')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'contacts'
                    ? 'bg-[#017aff] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Entries</span>
              </button>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#017aff]/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-black border-b border-[#017aff]/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeSection === 'home' ? 'Dashboard Overview' : 'Contact Form Entries'}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeSection === 'home' ? 'View your contact form statistics' : 'Manage contact form submissions'}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-[#017aff] hover:bg-[#017aff]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {activeSection === 'home' ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#017aff] p-6 rounded-2xl text-white shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Contacts</p>
                      <p className="text-3xl font-bold">{stats.totalContacts}</p>
                      <p className="text-blue-200 text-sm">All time submissions</p>
                    </div>
                    <Mail className="h-12 w-12 text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#017aff] p-6 rounded-2xl text-white shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Today's Contacts</p>
                      <p className="text-3xl font-bold">{stats.todayContacts}</p>
                      <p className="text-blue-200 text-sm">Submissions today</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#017aff] p-6 rounded-2xl text-white shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">This Week</p>
                      <p className="text-3xl font-bold">{stats.thisWeekContacts}</p>
                      <p className="text-blue-200 text-sm">Last 7 days</p>
                    </div>
                    <Clock className="h-12 w-12 text-blue-200" />
                  </div>
                </motion.div>
              </div>

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900 border border-[#017aff]/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to YourMedia Admin</h3>
                <p className="text-gray-300">
                  Manage your contact form submissions and monitor your website's performance. 
                  Use the navigation menu to switch between different sections.
                </p>
              </motion.div>
            </>
          ) : (
            <>
              {/* Contact Entries */}
              {contacts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Mail className="text-gray-600 h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">No contact entries yet</h2>
                  <p className="text-gray-400">Contact form submissions will appear here</p>
                </motion.div>
              ) : (
                <div className="grid gap-6">
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-900 border border-[#017aff]/20 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="text-[#017aff] h-5 w-5" />
                            <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                          </div>
                          <div className="flex items-center space-x-3 mb-2">
                            <Mail className="text-gray-400 h-4 w-4" />
                            <span className="text-gray-300">{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-3 mb-2">
                            <Calendar className="text-gray-400 h-4 w-4" />
                            <span className="text-gray-300 text-sm">{formatDate(contact.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          disabled={isDeleting === contact.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Subject</h4>
                          <p className="text-white">{contact.subject}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Message</h4>
                          <p className="text-white whitespace-pre-wrap">{contact.message}</p>
                        </div>
                        
                        {contact.userAgent && (
                          <div className="pt-3 border-t border-[#017aff]/20">
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Monitor className="h-3 w-3" />
                                <span className="truncate max-w-xs">{contact.userAgent}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
