'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  return (
    <main className='bg-black overflow-hidden'>
      {!isAdminRoute && <Navbar />}
      {children}
      { !isAdminRoute&& <Footer />}
    </main>
  )
}
  