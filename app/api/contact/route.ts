import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'
import { saveContact } from '@/lib/database'
import { ContactEntry } from '@/types/contact'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      )
    }

    const formData = validationResult.data
    
    // Create contact entry
    const contact: ContactEntry = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    // Save to database
    await saveContact(contact)

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
