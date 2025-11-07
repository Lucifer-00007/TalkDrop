# Quick Start Guide - Local Development

## Option 1: Instant Local Development (Recommended)

The easiest way to start is with a free Firebase project:

### 1. Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" → Enter name "talkdrop-dev" → Continue
3. **Enable Services:**
   - **Authentication**: Go to Authentication → Sign-in method → Enable "Anonymous"
   - **Realtime Database**: Go to Realtime Database → Create database → Start in test mode
   - **Firestore**: Go to Firestore Database → Create database → Start in test mode

### 2. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Add app → Web
3. Register app → Copy the config object

### 3. Update Environment

Replace `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Remove this line to use real Firebase
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

### 4. Start Development

```bash
npm run dev
```

Open http://localhost:3000 and start chatting!

## Option 2: Full Emulator Setup (Advanced)

If you want to use Firebase emulators (requires Java):

1. Install Java: https://www.java.com/download/
2. Run: `npm run emulators`
3. Keep the current `.env.local` (emulator config)
4. Run: `npm run dev`

## Testing Your Setup

1. **Open multiple browser tabs** to http://localhost:3000
2. **Use different display names** in each tab
3. **Join the same room** from different tabs
4. **Test features:**
   - Real-time messaging
   - Presence indicators (online/offline)
   - Typing indicators
   - Message persistence

## Firebase Console Monitoring

With a real Firebase project, you can monitor live data:

- **Authentication**: See anonymous users
- **Realtime Database**: View live messages and presence
- **Firestore**: Check message history
- **Usage**: Monitor API calls (free tier is generous)

## Free Tier Limits

Firebase free tier includes:
- **Realtime Database**: 1GB storage, 10GB/month transfer
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited anonymous users

Perfect for development and small projects!

## Next Steps

Once you're happy with local development:
1. Follow `FIREBASE_SETUP.md` for production deployment
2. Set up proper security rules
3. Deploy to Firebase Hosting or any static host

## Why This Approach?

✅ **5-minute setup** - Faster than installing Java  
✅ **Real Firebase features** - No emulator limitations  
✅ **Free tier** - No costs for development  
✅ **Easy monitoring** - Firebase Console shows live data  
✅ **Production-ready** - Same setup as production