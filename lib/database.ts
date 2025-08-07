import fs from 'fs/promises'
import path from 'path'
import { ContactEntry, AdminSession } from '@/types/contact'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Contact entries database
export async function getContacts(): Promise<ContactEntry[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveContact(contact: ContactEntry): Promise<void> {
  await ensureDataDir()
  const contacts = await getContacts()
  contacts.push(contact)
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2))
}

export async function deleteContact(id: string): Promise<boolean> {
  await ensureDataDir()
  const contacts = await getContacts()
  const filtered = contacts.filter(contact => contact.id !== id)
  
  if (filtered.length === contacts.length) {
    return false // Contact not found
  }
  
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(filtered, null, 2))
  return true
}

// Admin sessions database
export async function getSessions(): Promise<AdminSession[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveSession(session: AdminSession): Promise<void> {
  await ensureDataDir()
  const sessions = await getSessions()
  sessions.push(session)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

export async function deleteSession(token: string): Promise<void> {
  await ensureDataDir()
  const sessions = await getSessions()
  const filtered = sessions.filter(session => session.token !== token)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(filtered, null, 2))
}

export async function cleanupExpiredSessions(): Promise<void> {
  const sessions = await getSessions()
  const now = Date.now()
  const validSessions = sessions.filter(session => session.expiresAt > now)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(validSessions, null, 2))
}
