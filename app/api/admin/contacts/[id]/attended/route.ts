import { NextRequest, NextResponse } from 'next/server'
import { updateContactAttendedStatus } from '@/lib/database'
import { validateSession } from '@/lib/auth'

export async function PATCH(
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
    const body = await request.json()
    const { isAttended } = body

    if (typeof isAttended !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isAttended must be a boolean' },
        { status: 400 }
      )
    }

    // Update contact attended status
    const updated = await updateContactAttendedStatus(id, isAttended)
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Contact marked as ${isAttended ? 'attended' : 'not attended'}`,
        data: { isAttended }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update contact attended status error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
