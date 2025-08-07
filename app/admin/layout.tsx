import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - YourMedia Channel',
  description: 'Admin dashboard for managing contact form submissions',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900">
      {children}
    </div>
  )
}
