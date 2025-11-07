# Firebase Setup Guide for TalkDrop

## Prerequisites

1. Node.js 18+ installed
2. Firebase CLI installed globally: `npm install -g firebase-tools`
3. A Google account for Firebase Console access

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "talkdrop-chat")
4. Enable Google Analytics (optional)
5. Wait for project creation to complete

## Step 2: Enable Firebase Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Anonymous" authentication
3. Save changes

### Realtime Database
1. Go to Realtime Database
2. Click "Create Database"
3. Choose location (closest to your users)
4. Start in "locked mode" (we'll update rules later)

### Cloud Firestore
1. Go to Firestore Database
2. Click "Create database"
3. Choose location (same as Realtime Database)
4. Start in "production mode"

### Firebase Hosting (Optional)
1. Go to Hosting
2. Click "Get started"
3. Follow the setup wizard

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register app with nickname (e.g., "TalkDrop Web")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Create `.env.local` in your project root (already exists)
2. Fill in the Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Deploy Security Rules

The security rules are already configured in the project. Deploy them:

```bash
# Login to Firebase CLI
firebase login

# Initialize Firebase in your project (if not done)
firebase init

# Deploy security rules
firebase deploy --only database,firestore
```

## Step 6: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Enter a display name and create/join a room
4. Test real-time messaging, presence, and typing indicators

## Step 7: Deploy to Firebase Hosting (Optional)

```bash
# Build and deploy
npm run deploy
```

## Troubleshooting

### Common Issues

1. **Authentication errors**: Ensure Anonymous auth is enabled
2. **Permission denied**: Check that security rules are deployed
3. **Database connection issues**: Verify DATABASE_URL format
4. **Build errors**: Ensure all environment variables are set

### Checking Firebase Console

- **Authentication**: See anonymous users in Authentication > Users
- **Realtime Database**: View live data in Realtime Database > Data
- **Firestore**: Check stored messages in Firestore Database
- **Usage**: Monitor usage in Project Overview

### Security Rules Testing

You can test security rules in the Firebase Console:
1. Go to Realtime Database > Rules
2. Click "Rules Playground"
3. Test different scenarios

## Data Structure

### Realtime Database
```
/rooms/{roomId}/
  messages/{pushId}: { id, senderId, senderName, text, timestamp }
  presence/{userId}: { displayName, online, lastSeen }
  typing/{userId}: boolean
```

### Firestore
```
rooms/{roomId}/
  metadata: { name, createdAt, createdBy }
  messages/{messageId}: { senderId, senderName, text, createdAt, expiresAt }
```

## Performance Considerations

- Messages in Realtime Database are temporary (for real-time sync)
- Messages in Firestore have 24-hour TTL (automatic cleanup)
- Presence data is automatically cleaned up on disconnect
- Typing indicators auto-expire after 3 seconds

## Security Features

- Anonymous authentication required for all operations
- Users can only modify their own presence/typing status
- Message text limited to 2000 characters
- All database operations require authentication