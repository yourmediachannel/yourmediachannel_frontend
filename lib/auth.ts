import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getSessions, saveSession, deleteSession } from './database'

/**
 * Get environment variable or fallback to default.
 * @param key - The environment variable key.
 * @param fallback - The fallback value if env is not set.
 * @returns The environment variable value or fallback.
 */
function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback
}

// Use environment variables for credentials and secret
const JWT_SECRET = getEnv('ADMIN_JWT_SECRET', 'your-secret-key-change-this-in-production')
const ADMIN_USERNAME = getEnv('ADMIN_USERNAME', 'YourAKShaw')
const ADMIN_PASSWORD = getEnv('ADMIN_PASSWORD', 'YourAKShawPASS000')

/**
 * Verifies admin credentials against environment variables.
 * @param username - The username to verify.
 * @param password - The password to verify.
 * @returns Promise resolving to true if credentials are valid, false otherwise.
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    return (username === ADMIN_USERNAME || username === process.env.ADMIN_USERNAME) &&
           (password === ADMIN_PASSWORD || password === process.env.ADMIN_PASSWORD)
  } catch (error) {
    console.error('Error verifying admin credentials:', error)
    return false
  }
}

/**
 * Generates a JWT token for the admin.
 * @returns The signed JWT token.
 */
export function generateToken(): string {
  return jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '24h' })
}

/**
 * Verifies the validity of a JWT token.
 * @param token - The JWT token to verify.
 * @returns True if valid, false otherwise.
 */
export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

/**
 * Creates a new admin session and stores it.
 * @returns Promise resolving to the session token.
 */
export async function createSession(): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

  await saveSession({ token, username: ADMIN_USERNAME, expiresAt })
  return token
}

/**
 * Validates a session token against stored sessions and expiry.
 * @param token - The session token to validate.
 * @returns Promise resolving to true if session is valid, false otherwise.
 */
export async function validateSession(token: string): Promise<boolean> {
  if (!verifyToken(token)) return false

  const sessions = await getSessions()
  const session = sessions.find(
    s => s.token === token && new Date(s.expiresAt) > new Date()
  )

  return !!session
}

/**
 * Logs out the admin by deleting the session.
 * @param token - The session token to delete.
 */
export async function logout(token: string): Promise<void> {
  await deleteSession(token)
}
