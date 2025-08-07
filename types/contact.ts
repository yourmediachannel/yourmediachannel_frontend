export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactEntry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  userAgent?: string
  isAttended: boolean
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  token: string
  username: string
  createdAt: string
  expiresAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  error?: string
  data?: T
}
