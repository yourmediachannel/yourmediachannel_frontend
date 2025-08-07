'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ContactEntry } from '@/types/contact'
import Image from 'next/image'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { 
  Trash2, 
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
  Power,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Globe,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const columnHelper = createColumnHelper<ContactEntry>()

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState<'home' | 'contacts'>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  // Modal state
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const router = useRouter()

  // Define table columns with responsive design
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="flex items-center space-x-2 min-w-0">
          <User className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="font-medium truncate">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <div className="flex items-center space-x-2 min-w-0 md:table-cell hidden">
          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground truncate">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('subject', {
      header: 'Subject',
      cell: (info) => (
        <span className="truncate max-w-[150px] sm:max-w-xs block lg:table-cell hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: (info) => (
        <span className="text-muted-foreground truncate max-w-[100px] sm:max-w-xs block xl:table-cell hidden">
          {info.getValue().substring(0, 30)}{info.getValue().length > 30 ? '...' : ''}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: (info) => (
        <div className="flex items-center space-x-2 min-w-0">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 sm:block hidden" />
          <div className="min-w-0">
            <span className="text-muted-foreground text-sm block sm:hidden">
              {new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-muted-foreground text-sm hidden sm:block">
              {formatDate(info.getValue())}
            </span>
          </div>
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        return new Date(rowA.getValue('createdAt')).getTime() - new Date(rowB.getValue('createdAt')).getTime()
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            onClick={() => handleViewDetails(info.row.original)}
            className="h-8 px-2 sm:px-3"
          >
            <Eye className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(info.row.original.id)}
            disabled={isDeleting === info.row.original.id}
            className="h-8 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ], [isDeleting])

  const table = useReactTable({
    data: contacts,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

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
      toast.success("Contact deleted successfully")
    } catch (err) {
      console.error('Delete contact error:', err)
      toast.error("Failed to delete contact")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleViewDetails = (contact: ContactEntry) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleDeleteFromModal = async () => {
    if (!selectedContact) return
    
    if (!confirm('Are you sure you want to delete this contact entry?')) return

    setIsDeleting(selectedContact.id)
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact.id}`, {
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

      setContacts(prev => prev.filter(contact => contact.id !== selectedContact.id))
      closeModal()
      toast.success('Contact deleted successfully')
    } catch (err) {
      console.error('Delete contact error:', err)
      toast.error('Failed to delete contact')
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

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown Browser'
  }

  const getOSInfo = (userAgent: string) => {
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11'
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1'
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7'
    if (userAgent.includes('Mac OS X')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iPhone')) return 'iOS'
    return 'Unknown OS'
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 right-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-4 sm:p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Image 
                  src="/images/logo.png" 
                  alt="YourMedia Logo" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <SheetTitle>YourMedia</SheetTitle>
                <SheetDescription>Admin Panel</SheetDescription>
              </div>
            </div>
            
            {/* Mobile Time Display */}
            <div className="text-center mt-4">
              <div className="text-xl font-bold text-primary">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </SheetHeader>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveSection('home')
                  setIsMobileMenuOpen(false)
                }}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant={activeSection === 'contacts' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveSection('contacts')
                  setIsMobileMenuOpen(false)
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Entries
                {contacts.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {contacts.length}
                  </Badge>
                )}
              </Button>
            </div>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <Power className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col">
        <Card className="h-full rounded-none border-r">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Image 
                  src="/images/logo.png" 
                  alt="YourMedia Logo" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <CardTitle className="text-lg">YourMedia</CardTitle>
                <CardDescription>Admin Panel</CardDescription>
              </div>
            </div>
            
            {/* Current Time */}
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('home')}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant={activeSection === 'contacts' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('contacts')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Entries
                {contacts.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {contacts.length}
                  </Badge>
                )}
              </Button>
            </nav>
          </CardContent>

          <div className="p-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <Power className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Card className="rounded-none border-b">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl truncate">
                  {activeSection === 'home' ? 'Dashboard Overview' : 'Contact Form Entries'}
                </CardTitle>
                <CardDescription className="text-sm">
                  {activeSection === 'home' ? 'View your contact form statistics' : 'Manage contact form submissions'}
                </CardDescription>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="self-start sm:self-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {activeSection === 'home' ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalContacts}</div>
                      <p className="text-xs text-muted-foreground">All time submissions</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today's Contacts</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.todayContacts}</div>
                      <p className="text-xs text-muted-foreground">Submissions today</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sm:col-span-2 lg:col-span-1"
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Week</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.thisWeekContacts}</div>
                      <p className="text-xs text-muted-foreground">Last 7 days</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Welcome to YourMedia Admin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Manage your contact form submissions and monitor your website's performance. 
                      Use the navigation menu to switch between different sections.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Contact Entries Table */}
              {contacts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Recent Contact Submissions</CardTitle>
                      <CardDescription>Latest contact form entries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead className="hidden sm:table-cell">Email</TableHead>
                              <TableHead className="hidden md:table-cell">Subject</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contacts.slice(0, 5).map((contact, index) => (
                              <TableRow key={contact.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <User className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="font-medium truncate">{contact.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground truncate">{contact.email}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="truncate max-w-xs block">{contact.subject}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                                    <div className="min-w-0">
                                      <span className="text-muted-foreground text-sm block sm:hidden">
                                        {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </span>
                                      <span className="text-muted-foreground text-sm hidden sm:block">
                                        {formatDate(contact.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => handleViewDetails(contact)}
                                    className="px-2 sm:px-3"
                                  >
                                    <Eye className="h-4 w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button
                          variant="link"
                          onClick={() => setActiveSection('contacts')}
                          className="p-0"
                        >
                          View all contact entries →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            <>
              {/* Contact Entries Table */}
              {contacts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">No contact entries yet</h2>
                  <p className="text-muted-foreground">Contact form submissions will appear here</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Input
                          placeholder="Search all columns..."
                          value={globalFilter}
                          onChange={(e) => setGlobalFilter(e.target.value)}
                          className="max-w-sm"
                        />
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          Showing {table.getFilteredRowModel().rows.length} of {contacts.length} entries
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-1">
                        <div className="inline-block min-w-full align-middle">
                          <Table>
                            <TableHeader>
                              {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                  {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap">
                                      {header.isPlaceholder ? null : (
                                        <div
                                          className={`flex items-center space-x-2 ${
                                            header.column.getCanSort()
                                              ? 'cursor-pointer select-none hover:text-foreground'
                                              : ''
                                          }`}
                                          onClick={header.column.getToggleSortingHandler()}
                                        >
                                          {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                          )}
                                          {header.column.getCanSort() && (
                                            <div className="flex flex-col">
                                              {header.column.getIsSorted() === 'asc' && (
                                                <ChevronUp className="h-3 w-3 text-primary" />
                                              )}
                                              {header.column.getIsSorted() === 'desc' && (
                                                <ChevronDown className="h-3 w-3 text-primary" />
                                              )}
                                              {!header.column.getIsSorted() && (
                                                <div className="h-3 w-3" />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              ))}
                            </TableHeader>
                            <TableBody>
                              {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                  <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                  >
                                    {row.getVisibleCells().map((cell) => (
                                      <TableCell key={cell.id} className="whitespace-nowrap">
                                        {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext()
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                          >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                          </Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
                            <Select
                              value={`${table.getState().pagination.pageSize}`}
                              onValueChange={(value) => {
                                table.setPageSize(Number(value))
                              }}
                            >
                              <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                              </SelectTrigger>
                              <SelectContent side="top">
                                {[5, 10, 20, 30].map((pageSize) => (
                                  <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Contact Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto m-2 sm:m-4">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <User className="h-5 w-5 text-primary" />
              <span>Contact Details</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              View detailed information about this contact submission
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <User className="h-5 w-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full Name</Label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg min-w-0">
                        <span className="font-medium truncate pr-2">{selectedContact.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(selectedContact.name, 'Name')}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email Address</Label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg min-w-0">
                        <span className="font-medium truncate pr-2">{selectedContact.email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(selectedContact.email, 'Email')}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Subject</Label>
                      <div className="flex items-start justify-between p-3 bg-muted rounded-lg min-w-0">
                        <span className="font-medium pr-2 leading-relaxed">{selectedContact.subject}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(selectedContact.subject, 'Subject')}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="relative">
                      <Textarea
                        value={selectedContact.message}
                        readOnly
                        className="min-h-[120px] resize-none pr-12"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(selectedContact.message, 'Message')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Monitor className="h-5 w-5 text-primary" />
                    <span>Technical Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Submitted:</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <span className="block sm:hidden">
                          {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="hidden sm:block">
                          {new Date(selectedContact.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </Badge>
                    </div>

                    {selectedContact.userAgent && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Browser:</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getBrowserInfo(selectedContact.userAgent)}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">OS:</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getOSInfo(selectedContact.userAgent)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>

                  {selectedContact.userAgent && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full User Agent</Label>
                      <div className="relative">
                        <Textarea
                          value={selectedContact.userAgent}
                          readOnly
                          className="font-mono text-sm resize-none pr-12 min-h-[80px]"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(selectedContact.userAgent!, 'User Agent')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <Separator />

          <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button variant="outline" onClick={closeModal} className="order-2 sm:order-1">
              Close
            </Button>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 order-1 sm:order-2">
              {selectedContact && (
                <Button asChild size="sm">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Reply</span>
                  </a>
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteFromModal}
                disabled={!selectedContact || isDeleting === selectedContact?.id}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting === selectedContact?.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}