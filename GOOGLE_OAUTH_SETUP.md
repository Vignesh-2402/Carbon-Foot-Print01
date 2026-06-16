# Google OAuth2 Sign-Up Implementation - Setup Guide

## 📋 Implementation Summary

Your Carbon Footprint app now has Google OAuth2 authentication! Here's what was added:

### Backend Changes
- ✅ User model updated with OAuth fields (googleId, authProvider, googleProfile)
- ✅ Passport.js OAuth strategy configured
- ✅ New `/api/auth/google/verify` endpoint for token verification
- ✅ Migration script for existing users
- ✅ Environment variables configured

### Frontend Changes
- ✅ GoogleAuthButton component created
- ✅ Login page updated with Google sign-in
- ✅ Register page updated with Google sign-up
- ✅ API service updated with google verify method
- ✅ App wrapped with GoogleOAuthProvider
- ✅ Environment variables configured

---

## 🔑 Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com
   - Create a new project or select existing one

2. **Enable Google+ API:**
   - Search for "Google+ API" in search bar
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "Credentials" in left sidebar
   - Click "Create Credentials" → "OAuth Client ID"
   - Select "Web application"
   - Under "Authorized JavaScript origins" add:
     - `http://localhost:5173` (development)
     - `http://localhost:5000` (backend)
   - Under "Authorized redirect URIs" add:
     - `http://localhost:5000/api/auth/google/callback`
   - Click "Create"
   - Copy the Client ID and Client Secret

---

## ⚙️ Step 2: Configure Environment Variables

### Backend (`/server/.env`)
Replace placeholders with your Google credentials:
```
GOOGLE_CLIENT_ID=your_actual_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google_console
```

### Frontend (`/client/.env.local`)
Replace with the same Client ID:
```
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_from_google_console
```

---

## 📦 Step 3: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

---

## 🔄 Step 4: Run Database Migration

This sets existing users' authProvider to 'local':
```bash
cd server
node scripts/migrateUserSchema.js
```

Expected output:
```
Connecting to MongoDB...
Connected to MongoDB
Starting user migration...
Found X users to migrate
✓ Successfully migrated X users
Migration complete!
```

---

## 🚀 Step 5: Start the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

You should see:
```
VITE ... ready in XXX ms

➜  Local:   http://localhost:5173
```

---

## ✅ Step 6: Test Google Authentication

### Test New User Sign-Up
1. Navigate to `http://localhost:5173`
2. Click "Register"
3. Click "Sign up with Google"
4. Select a Google account
5. Accept permissions
6. Should redirect to dashboard
7. Verify user created in MongoDB with authProvider='google'

### Test New User Sign-In
1. Logout
2. Click "Login"
3. Click "Sign in with Google"
4. Select same Google account
5. Should redirect to dashboard

### Test Mixed Authentication (Optional)
1. Create account with email/password
2. Try to sign in with Google using same email
3. Verify authProvider updated to 'both'
4. Should be able to login with either method

---

## 🔍 Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads without console errors
- [ ] Google button appears on login page
- [ ] Google button appears on register page
- [ ] Clicking button opens Google account selector
- [ ] After Google login, redirects to dashboard
- [ ] User token saved in localStorage
- [ ] User profile displays correctly
- [ ] Can access protected routes
- [ ] JWT token has 7-day expiration

---

## 🧪 Testing with DevTools

After Google login:

1. **Check Token Storage:**
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - Find `token` entry with JWT

2. **Check Authorization Header:**
   - Open Network tab
   - Make any API request
   - Check Authorization header: `Bearer <token>`

3. **Decode JWT (Optional):**
   - Go to https://jwt.io
   - Paste token in "Encoded" section
   - Verify payload has your userId

---

## 🐛 Troubleshooting

### "Invalid Google token" Error
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env`
- Ensure credentials match between frontend and backend
- Verify authorized origins in Google Cloud Console

### "CORS Error"
- Check `CLIENT_URL` in `/server/.env` matches your frontend URL
- Frontend should be `http://localhost:5173`

### Google button not appearing
- Check `VITE_GOOGLE_CLIENT_ID` in `/client/.env.local`
- Run `npm install` in client directory
- Clear browser cache and reload

### User not created
- Check MongoDB connection in `/server/.env`
- Run migration script: `node scripts/migrateUserSchema.js`
- Check server console for error messages

---

## 📚 File Changes Summary

### New Files Created
- `/server/config/passport.js` - OAuth strategy configuration
- `/server/routes/oauth.js` - Google verify endpoint
- `/server/scripts/migrateUserSchema.js` - Database migration
- `/client/src/components/GoogleAuthButton.jsx` - Google button component
- `/client/.env.local` - Frontend environment config

### Modified Files
- `/server/models/User.js` - Added OAuth fields
- `/server/package.json` - Added dependencies
- `/server/server.js` - Passport initialization
- `/server/.env` - Added Google credentials
- `/client/package.json` - Added @react-oauth/google
- `/client/src/pages/LoginPage.jsx` - Added Google button
- `/client/src/pages/RegisterPage.jsx` - Added Google button
- `/client/src/services/api.js` - Added googleVerify method
- `/client/src/main.jsx` - Wrapped with GoogleOAuthProvider

---

## 🎉 Features Now Available

✅ Sign up with Google  
✅ Sign in with Google  
✅ Seamless account linking (email users can add Google)  
✅ No password required for Google-only users  
✅ 7-day JWT tokens work for both auth methods  
✅ User profile from Google stored  
✅ Existing email/password authentication still works  

Enjoy your new Google OAuth feature! 🚀
