import dbConnect from './mongodb'
import Contact, { IContact } from '@/models/Contact'
import AdminSession, { IAdminSession } from '@/models/AdminSession'
import { ContactEntry, AdminSession as AdminSessionType } from '@/types/contact'

// Contact entries database
export async function getContacts(): Promise<ContactEntry[]> {
  await dbConnect()
  
  try {
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean()
    
    return contacts.map(contact => ({
      id: (contact._id as any).toString(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt.toISOString(),
      userAgent: contact.userAgent,
      isAttended: contact.isAttended
    }))
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
}

export async function saveContact(contactData: Omit<ContactEntry, 'id' | 'createdAt'>): Promise<void> {
  await dbConnect()
  
  try {
    const contact = new Contact({
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      userAgent: contactData.userAgent
    })
    
    await contact.save()
  } catch (error) {
    console.error('Error saving contact:', error)
    throw new Error('Failed to save contact')
  }
}

export async function deleteContact(id: string): Promise<boolean> {
  await dbConnect()
  
  try {
    const result = await Contact.findByIdAndDelete(id)
    return !!result
  } catch (error) {
    console.error('Error deleting contact:', error)
    return false
  }
}

export async function updateContactAttendedStatus(id: string, isAttended: boolean): Promise<boolean> {
  await dbConnect()
  
  try {
    const result = await Contact.findByIdAndUpdate(id, { isAttended }, { new: true })
    return !!result
  } catch (error) {
    console.error('Error updating contact attended status:', error)
    return false
  }
}

// Admin sessions database
export async function getSessions(): Promise<AdminSessionType[]> {
  await dbConnect()
  
  try {
    const sessions = await AdminSession.find({})
      .sort({ createdAt: -1 })
      .lean()
    
    return sessions.map(session => ({
      token: session.token,
      username: session.username,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

export async function saveSession(sessionData: Omit<AdminSessionType, 'createdAt'>): Promise<void> {
  await dbConnect()
  
  try {
    const session = new AdminSession({
      token: sessionData.token,
      username: sessionData.username,
      expiresAt: new Date(sessionData.expiresAt)
    })
    
    await session.save()
  } catch (error) {
    console.error('Error saving session:', error)
    throw new Error('Failed to save session')
  }
}

export async function deleteSession(token: string): Promise<void> {
  await dbConnect()
  
  try {
    await AdminSession.findOneAndDelete({ token })
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  await dbConnect()
  
  try {
    const now = new Date()
    await AdminSession.deleteMany({ expiresAt: { $lt: now } })
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error)
  }
}
