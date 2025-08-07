import { NextRequest, NextResponse } from 'next/server'
import { adminLoginSchema } from '@/lib/validation'
import { verifyAdminCredentials, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = adminLoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data
    
    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create session
    const token = await createSession()

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        token 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
