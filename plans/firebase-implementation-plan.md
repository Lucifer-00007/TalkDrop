# Firebase Implementation Plan for TalkDrop

## Overview
Implement hybrid Firebase architecture using both Firestore and Realtime Database for optimal real-time chat experience.

## Phase 1: Setup & Configuration

### 1.1 Install Dependencies
```bash
npm install firebase
```

### 1.2 Firebase Project Setup
1. Create Firebase project in console
2. Enable services:
   - Authentication (Anonymous)
   - Realtime Database
   - Cloud Firestore
   - Hosting
3. Configure security rules
4. Set up environment variables

### 1.3 Environment Configuration
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Phase 2: Core Firebase Integration

### 2.1 Firebase Configuration
- `lib/firebase.ts` - Initialize Firebase app and services
- `lib/auth.ts` - Anonymous authentication helpers
- `lib/rtdb.ts` - Realtime Database operations
- `lib/firestore.ts` - Firestore operations

### 2.2 Data Architecture

**Realtime Database (Live Data):**
```
/rooms/{roomId}/
  messages/{pushId}: { id, senderId, senderName, text, timestamp }
  presence/{userId}: { displayName, online, lastSeen }
  typing/{userId}: boolean
```

**Firestore (Persistent Data):**
```
rooms/{roomId}/
  metadata: { name, createdAt, createdBy }
  messages/{messageId}: { senderId, senderName, text, createdAt, expiresAt }
```

## Phase 3: Hook Implementation

### 3.1 Authentication Hook
- `hooks/useAuth.ts` - Manage anonymous auth and display name

### 3.2 Room Management Hook
- `hooks/useRoom.ts` - Orchestrate room operations:
  - Join/create room
  - Message sending (dual write to RTDB + Firestore)
  - Real-time message listening
  - Presence management
  - Typing indicators

## Phase 4: Component Updates

### 4.1 Update Existing Components
- Modify current chat components to use Firebase hooks
- Replace local state with Firebase real-time data
- Add presence indicators
- Add typing indicators

### 4.2 New Components
- `components/PresenceIndicator.tsx` - Show online users
- `components/TypingIndicator.tsx` - Show who's typing

## Phase 5: Security & Rules

### 5.1 Realtime Database Rules
```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          "$msgId": {
            ".validate": "newData.hasChildren(['senderId','senderName','text']) && newData.child('text').val().length <= 2000"
          }
        },
        "presence": {
          "$userId": {
            ".write": "auth != null && auth.uid === $userId"
          }
        },
        "typing": {
          "$userId": {
            ".write": "auth != null && auth.uid === $userId"
          }
        }
      }
    }
  }
}
```

### 5.2 Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      
      match /messages/{messageId} {
        allow create: if request.auth != null 
          && request.resource.data.senderId == request.auth.uid
          && request.resource.data.text.size() <= 2000;
        allow read: if request.auth != null;
      }
    }
  }
}
```

## Phase 6: Deployment

### 6.1 Firebase Hosting Setup
```bash
npm install -g firebase-tools
firebase init hosting
```

### 6.2 Build Configuration
Update `next.config.js` for Firebase compatibility:
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

### 6.3 Deploy Script
Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy"
  }
}
```

## Implementation Order

1. **Setup** (1-2 hours)
   - Firebase project creation
   - Environment configuration
   - Dependencies installation

2. **Core Firebase Integration** (3-4 hours)
   - Firebase initialization
   - Authentication setup
   - Database helpers

3. **Hooks & State Management** (2-3 hours)
   - useAuth hook
   - useRoom hook with dual-write logic

4. **Component Integration** (2-3 hours)
   - Update existing components
   - Add presence/typing features

5. **Security & Testing** (1-2 hours)
   - Configure security rules
   - Test multi-user scenarios

6. **Deployment** (1 hour)
   - Firebase hosting setup
   - Production deployment

## Key Benefits

- **Real-time**: RTDB provides instant message delivery
- **Persistence**: Firestore ensures message history
- **Scalability**: Firebase handles scaling automatically
- **Security**: Built-in authentication and security rules
- **Offline**: Firebase SDK provides offline capabilities

## Migration Strategy

1. Keep existing local state as fallback
2. Gradually replace with Firebase operations
3. Test each component individually
4. Deploy incrementally with feature flags if needed