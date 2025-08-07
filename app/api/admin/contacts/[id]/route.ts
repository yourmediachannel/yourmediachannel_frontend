import { NextRequest, NextResponse } from 'next/server'
import { deleteContact } from '@/lib/database'
import { validateSession } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Delete contact
    const deleted = await deleteContact(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Contact deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
