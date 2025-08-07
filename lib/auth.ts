import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getSessions, saveSession, deleteSession } from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH)
}

export function generateToken(): string {
  return jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function createSession(): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  
  await saveSession({ token, username: ADMIN_USERNAME, expiresAt })
  return token
}

export async function validateSession(token: string): Promise<boolean> {
  if (!verifyToken(token)) return false
  
  const sessions = await getSessions()
  const session = sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date())
  
  return !!session
}

export async function logout(token: string): Promise<void> {
  await deleteSession(token)
}
