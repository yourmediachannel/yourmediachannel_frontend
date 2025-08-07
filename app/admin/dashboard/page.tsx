'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ContactEntry } from '@/types/contact'
import { Trash2, LogOut, Mail, User, Calendar, Globe, Monitor } from 'lucide-react'

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchContacts(token)
  }, [router])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="text-primary h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold text-white">Contact Dashboard</h1>
              <p className="text-zinc-400 text-sm">{contacts.length} total entries</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {contacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Mail className="text-zinc-600 h-16 w-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No contact entries yet</h2>
            <p className="text-zinc-400">Contact form submissions will appear here</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="text-primary h-5 w-5" />
                      <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Mail className="text-zinc-400 h-4 w-4" />
                      <span className="text-zinc-300">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="text-zinc-400 h-4 w-4" />
                      <span className="text-zinc-300 text-sm">{formatDate(contact.createdAt)}</span>
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
                    <h4 className="text-sm font-medium text-zinc-400 mb-1">Subject</h4>
                    <p className="text-white">{contact.subject}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400 mb-1">Message</h4>
                    <p className="text-white whitespace-pre-wrap">{contact.message}</p>
                  </div>
                  
                  {(contact.ipAddress || contact.userAgent) && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-3 text-xs text-zinc-500">
                        {contact.ipAddress && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span>{contact.ipAddress}</span>
                          </div>
                        )}
                        {contact.userAgent && (
                          <div className="flex items-center space-x-1">
                            <Monitor className="h-3 w-3" />
                            <span className="truncate max-w-xs">{contact.userAgent}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
