# YourMedia Channel - Frontend with Contact Form Backend

A modern landing page with a fully functional contact form backend and password-protected admin dashboard.

## Features

- **Contact Form**: Fully functional contact form with validation and database storage
- **Admin Dashboard**: Password-protected dashboard to view and manage contact submissions
- **Modern UI**: Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion
- **Secure Authentication**: JWT-based authentication for admin access
- **Data Persistence**: MongoDB database with Mongoose ODM
- **Responsive Design**: Mobile-first, accessible design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Backend**: Next.js API Routes
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Database**: MongoDB with Mongoose ODM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yourmediachannel_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - **Local MongoDB**: Install and start MongoDB locally
   - **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)

4. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/yourmediachannel

# For MongoDB Atlas (cloud hosted), use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourmediachannel?retryWrites=true&w=majority

# Admin credentials (change these in production)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Note**: The default password is "password". To generate a new password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-new-password', 10))"
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Contact Form

- Visit the homepage and scroll to the contact section
- Fill out the form with your name, email, subject, and message
- Submit the form - data will be stored in the database
- Success/error messages will be displayed

### Admin Dashboard

1. Navigate to `/admin/login`
2. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `password`
3. After successful login, you'll be redirected to `/admin/dashboard`
4. View all contact form submissions
5. Delete individual entries as needed
6. Logout using the button in the header

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, subject, message }`
  - Returns: `{ success: boolean, message?: string, error?: string }`

### Admin Authentication
- `POST /api/admin/login` - Admin login
  - Body: `{ username, password }`
  - Returns: `{ success: boolean, token?: string, error?: string }`

- `POST /api/admin/logout` - Admin logout
  - Body: `{ token }`
  - Returns: `{ success: boolean, message?: string, error?: string }`

### Contact Management
- `GET /api/admin/contacts` - Get all contact entries (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: boolean, data?: ContactEntry[], error?: string }`

- `DELETE /api/admin/contacts/[id]` - Delete contact entry (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: boolean, message?: string, error?: string }`

## Data Structure

### Contact Entry
```typescript
interface ContactEntry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
}
```

## Security Features

- **Input Validation**: All form inputs are validated using Zod schemas
- **Password Hashing**: Admin passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Automatic session cleanup and expiration
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: Consider implementing rate limiting for production

## File Structure

```
yourmediachannel_frontend/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login
│   │   ├── layout.tsx            # Admin layout
│   │   └── page.tsx              # Admin redirect
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form API
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts      # Admin login API
│   │       ├── logout/
│   │       │   └── route.ts      # Admin logout API
│   │       └── contacts/
│   │           ├── route.ts      # Get contacts API
│   │           └── [id]/
│   │               └── route.ts  # Delete contact API
│   └── ...                       # Other app files
├── components/                    # React components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── database.ts               # Database operations
│   ├── mongodb.ts                # MongoDB connection
│   └── validation.ts             # Zod validation schemas
├── models/                       # Mongoose models
│   ├── Contact.ts                # Contact model
│   └── AdminSession.ts           # Admin session model
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Route protection middleware
```

## Production Deployment

### Environment Variables
Set these environment variables in production:
```env
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

### Database Considerations
For production, consider:
- Using MongoDB Atlas for managed database hosting
- Implementing data backup strategies
- Adding rate limiting
- Setting up monitoring and logging
- Setting up database indexes for better performance

### Security Recommendations
- Change default admin credentials
- Use strong JWT secrets
- Implement rate limiting
- Add HTTPS in production
- Regular security audits

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features
- Contact form validation is in `lib/validation.ts`
- Database operations are in `lib/database.ts`
- Authentication logic is in `lib/auth.ts`
- API routes are in `app/api/`

## Troubleshooting

### Common Issues

1. **Contact form not submitting**
   - Check browser console for errors
   - Verify API route is working
   - Check data directory permissions

2. **Admin login not working**
   - Verify environment variables
   - Check password hash format
   - Clear browser localStorage

3. **Dashboard not loading**
   - Check authentication token
   - Verify API endpoints
   - Check network requests

### Database Collections
The application uses MongoDB collections:
- `contacts` - Contact form submissions
- `adminsessions` - Admin session tokens

The database connection is managed through Mongoose with automatic connection pooling and caching.

## License

This project is licensed under the MIT License.
