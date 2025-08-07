export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactEntry extends ContactFormData {
  id: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  token: string
  expiresAt: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
