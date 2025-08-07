import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'
import { saveContact } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactFormSchema.parse(body)
    
    // Create contact entry with user agent
    const contactData = {
      ...validatedData,
      userAgent: request.headers.get('user-agent') || undefined,
      isAttended: false, // New contacts are always marked as not attended
    }
    
    // Save to database
    await saveContact(contactData)
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    })
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}
