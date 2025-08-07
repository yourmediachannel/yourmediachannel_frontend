import mongoose, { Schema, Document } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  message: string
  userAgent?: string
  isAttended: boolean
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot be more than 2000 characters']
    },
    userAgent: {
      type: String,
      trim: true
    },
    isAttended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Create index for better query performance
ContactSchema.index({ createdAt: -1 })
ContactSchema.index({ isAttended: 1 })

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)
