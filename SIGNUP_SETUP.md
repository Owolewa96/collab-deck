# Signup & Database Setup Guide

This guide walks you through setting up user registration and MongoDB integration for CollabDeck.

## What I've Prepared

I've created the following infrastructure for user signup:

### 1. **User Model** (`models/User.js`)
   - Mongoose schema with fields: `name`, `email`, `password` (hashed), `avatar`, `role`
   - Email validation and uniqueness constraint
   - Timestamps (createdAt, updatedAt)
   - Fallback placeholder API if Mongoose isn't configured

### 2. **Signup API Route** (`app/api/auth/signup/route.ts`)
   - POST endpoint at `/api/auth/signup`
   - Validates input (name, email, password match, min 8 chars)
   - Checks for existing email
   - Hashes password with bcryptjs (10 salt rounds)
   - Saves user to MongoDB and returns user data

### 3. **Signup Page** (`app/signup/page.tsx`)
   - Beautiful form with name, email, password, confirm password fields
   - Client-side and server-side validation
   - Redirects to `/login` on success
   - Error handling with user-friendly messages
   - Dark mode support

### 4. **Database Connection** (`lib/db.ts`)
   - Mongoose connection utility
   - Caches connection across serverless invocations
   - Follows Next.js best practices

### 5. **Dependencies Added**
   - `bcryptjs@^2.4.3` – password hashing
   - `mongoose@^8.0.0` – MongoDB ODM

## Setup Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install `bcryptjs`, `mongoose`, and all other dependencies from `package.json`.

### Step 2: Configure MongoDB

1. **Create `.env.local`** (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

2. **Update `MONGODB_URI`** in `.env.local`:

   **Option A: Local MongoDB**
   ```
   MONGODB_URI=mongodb://localhost:27017/collab-deck
   ```

   **Option B: MongoDB Atlas (Cloud)**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/collab-deck?retryWrites=true&w=majority
   ```

   (Replace `username`, `password`, and `cluster0` with your Atlas credentials)

### Step 3: Start MongoDB (if using local)

```bash
# macOS with Homebrew
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Community directly if installed
```

### Step 4: Run the Application

```bash
npm run dev
```

### Step 5: Test Signup

1. Navigate to `http://localhost:3000/signup`
2. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `SecurePass123`
   - Confirm Password: `SecurePass123`
3. Click "Sign Up"
4. Success! User is saved to MongoDB and you're redirected to `/login`

## Testing the API Directly

You can test the signup endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123",
    "passwordConfirm": "SecurePass123"
  }'
```

Expected response (201):
```json
{
  "message": "User created successfully.",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{ "error": "Password must be at least 8 characters." }
```

### Email Already Registered (409)
```json
{ "error": "Email already registered." }
```

### Server Error (500)
```json
{ "error": "Internal server error. Please try again." }
```

## Next Steps

1. **Login Endpoint** – Create `/api/auth/login` to authenticate users
2. **JWT Tokens** – Add authentication tokens for session management
3. **Protected Routes** – Wrap dashboard routes with auth middleware
4. **Email Verification** – Add email confirmation before account activation
5. **Profile Page** – Let users update name, avatar, preferences

## File Locations

| File | Purpose |
|------|---------|
| `models/User.js` | Mongoose User schema |
| `app/api/auth/signup/route.ts` | Signup API endpoint |
| `app/signup/page.tsx` | Signup form page |
| `lib/db.ts` | Database connection utility |
| `package.json` | Dependencies (bcryptjs, mongoose) |
| `.env.local` | Environment variables (MONGODB_URI) |

## Troubleshooting

### "Cannot find module 'mongoose'"
```bash
npm install mongoose bcryptjs
```

### "MONGODB_URI is missing"
- Ensure `.env.local` exists with a valid `MONGODB_URI`
- Restart the dev server: `npm run dev`

### "Email already registered"
- Try signing up with a different email, or delete the user from MongoDB first:
  ```bash
  mongo
  > use collab-deck
  > db.users.deleteOne({ email: "john@example.com" })
  ```

### MongoDB connection refused
- Check if MongoDB is running:
  ```bash
  # Local
  brew services list

  # Docker
  docker ps | grep mongo
  ```
- If using Atlas, verify your IP is whitelisted in Network Access settings

## Security Notes

- ✅ Passwords are hashed with bcryptjs (10 rounds)
- ✅ Email is stored lowercase and trimmed
- ✅ Unique email constraint prevents duplicates
- ✅ Sensitive data (password) never returned to client
- ⚠️ Use HTTPS in production
- ⚠️ Rotate JWT secrets regularly
- ⚠️ Keep `MONGODB_URI` secret (never commit `.env.local`)

Happy signing up! 🚀
