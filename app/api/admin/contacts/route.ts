import { NextRequest, NextResponse } from 'next/server'
import { getContacts } from '@/lib/database'
import { validateSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate session
    const isValid = await validateSession(token)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Get contacts
    const contacts = await getContacts()
    
    // Sort by creation date (newest first)
    const sortedContacts = contacts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(
      { success: true, data: sortedContacts },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
