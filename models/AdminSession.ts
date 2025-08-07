import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminSession extends Document {
  token: string
  username: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required']
    }
  },
  {
    timestamps: true
  }
)

// Create indexes for better query performance
AdminSessionSchema.index({ token: 1 })
AdminSessionSchema.index({ expiresAt: 1 })
AdminSessionSchema.index({ createdAt: -1 })

// Add TTL index to automatically delete expired sessions
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.AdminSession || mongoose.model<IAdminSession>('AdminSession', AdminSessionSchema)
