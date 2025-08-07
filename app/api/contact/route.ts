import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'
import { saveContact } from '@/lib/database'
import { generateId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactFormSchema.parse(body)
    
    // Generate unique ID
    const id = generateId()
    
    // Create contact entry
    const contactEntry = {
      id,
      ...validatedData,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    }
    
    // Save to database
    await saveContact(contactEntry)
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contactEntry
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
