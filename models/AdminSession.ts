import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminSession extends Document {
  token: string
  username: string
  createdAt: Date
  expiresAt: Date
}

const AdminSessionSchema: Schema = new Schema({
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

// Create TTL index to automatically delete expired sessions
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.AdminSession || mongoose.model<IAdminSession>('AdminSession', AdminSessionSchema)
