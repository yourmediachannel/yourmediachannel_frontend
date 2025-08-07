# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=yourApp

# Admin credentials (change these in production)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$sl5m6RUMJXCRIPF3Uz4vFOXzRjHlNsOcN3bnpQ2FI5tDs0Zi3vJ/a

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Generating Password Hash

To generate a new password hash for admin credentials:

1. Run the password hash generator:
   ```bash
   node scripts/generate-password-hash.js your-new-password
   ```

2. Copy the generated hash to your `.env` file:
   ```env
   ADMIN_PASSWORD_HASH=generated-hash-here
   ```

## Security Notes

- **Never commit `.env` files** to version control
- **Change default credentials** in production
- **Use strong JWT secrets** in production
- **Rotate secrets regularly** for security
- **Use environment-specific** `.env` files (`.env.local`, `.env.production`, etc.)

## Default Credentials

The default admin credentials are:
- **Username**: `admin`
- **Password**: `password`

⚠️ **Important**: Change these credentials before deploying to production!
