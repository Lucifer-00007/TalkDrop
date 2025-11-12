# Firebase Functions Setup for Dynamic Room Routing

## Overview

This guide explains how to deploy TalkDrop with Firebase Functions to support dynamic room IDs while keeping the main site static. The architecture uses two Firebase projects:

- **Project A (Current)**: Static hosting for homepage, admin, and predefined rooms
- **Project B (New)**: Cloud Functions for dynamic room routing with SSR

Both projects share the same Realtime Database and Firestore.

---

## Architecture

```
User Request
    ↓
Firebase Hosting (Project A)
    ↓
    ├─→ Static pages (/, /admin) → Serve from /out
    └─→ Dynamic rooms (/room/*) → Rewrite to Cloud Function (Project B)
            ↓
        Next.js SSR Function
            ↓
        Shared RTDB + Firestore
```

---

## Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Two Firebase projects created
- Admin access to both projects

---

## Step 1: Create New Firebase Project (Project B)

### 1.1 Create Project
```bash
# Login to Firebase
firebase login

# Create new project via Firebase Console
# https://console.firebase.google.com/
# Name: talkdrop-functions (or your choice)
```

### 1.2 Note Project Details
- Project ID: `talkdrop-functions`
- Project Number: (from Project Settings)
- Region: `us-central1` (recommended)

---

## Step 2: Setup Functions Project Structure

### 2.1 Create Functions Directory
```bash
# In your TalkDrop root
mkdir -p functions-project
cd functions-project
```

### 2.2 Initialize Firebase Functions
```bash
firebase init functions

# Select:
# - Use existing project: talkdrop-functions
# - Language: TypeScript
# - ESLint: Yes
# - Install dependencies: Yes
```

### 2.3 Install Next.js Dependencies
```bash
cd functions
npm install next@15.1.3 react@19.0.0 react-dom@19.0.0
npm install firebase@12.5.0 firebase-admin@12.0.0
npm install --save-dev @types/node
```

---

## Step 3: Configure Next.js for Functions

### 3.1 Create next.config.js in functions/
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  images: {
    unoptimized: true,
  },
  // No output: 'export' - we need SSR
}

module.exports = nextConfig
```

### 3.2 Copy Source Files
```bash
# From TalkDrop root
cp -r src functions/
cp -r public functions/
cp tsconfig.json functions/
cp tailwind.config.ts functions/
cp postcss.config.mjs functions/
cp package.json functions/next-package.json
```

### 3.3 Update functions/package.json
```json
{
  "name": "functions",
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "firebase": "^12.5.0"
  }
}
```

---

## Step 4: Create Cloud Function

### 4.1 Update functions/src/index.ts
```typescript
import * as functions from 'firebase-functions'
import next from 'next'

const nextApp = next({
  dev: false,
  conf: {
    distDir: '.next',
  },
})

const handle = nextApp.getRequestHandler()

export const ssr = functions
  .region('us-central1')
  .runWith({
    memory: '1GB',
    timeoutSeconds: 60,
  })
  .https.onRequest(async (req, res) => {
    await nextApp.prepare()
    return handle(req, res)
  })
```

### 4.2 Configure Environment Variables
```bash
# In functions-project directory
firebase functions:config:set \
  firebase.api_key="YOUR_API_KEY" \
  firebase.auth_domain="YOUR_AUTH_DOMAIN" \
  firebase.project_id="YOUR_PROJECT_ID" \
  firebase.database_url="YOUR_DATABASE_URL" \
  firebase.storage_bucket="YOUR_STORAGE_BUCKET" \
  firebase.messaging_sender_id="YOUR_SENDER_ID" \
  firebase.app_id="YOUR_APP_ID"
```

### 4.3 Update Firebase Config in Code
```typescript
// functions/src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
```

---

## Step 5: Build and Deploy Functions

### 5.1 Build Next.js App
```bash
cd functions
npm run build
```

### 5.2 Deploy Function
```bash
cd ..
firebase deploy --only functions
```

### 5.3 Note Function URL
After deployment, note the function URL:
```
https://us-central1-talkdrop-functions.cloudfunctions.net/ssr
```

---

## Step 6: Update Main Project (Project A)

### 6.1 Update firebase.json
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [
      {
        "source": "/room/**",
        "function": {
          "functionId": "ssr",
          "region": "us-central1",
          "pinTag": true
        }
      }
    ]
  }
}
```

### 6.2 Alternative: Use Direct URL Rewrite
```json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "/room/**",
        "run": {
          "serviceId": "ssr",
          "region": "us-central1"
        }
      }
    ]
  }
}
```

---

## Step 7: Configure Cross-Project Access

### 7.1 Grant Permissions
```bash
# Get service account from Project B
# Format: PROJECT_B_ID@appspot.gserviceaccount.com

# In Firebase Console for Project A:
# 1. Go to Realtime Database → Rules
# 2. Add service account to allowed readers/writers

# Or use Firebase Admin SDK in functions
```

### 7.2 Update Database Rules (Project A)
```json
{
  "rules": {
    ".read": "auth != null || request.auth.token.firebase.sign_in_provider == 'custom'",
    ".write": "auth != null"
  }
}
```

### 7.3 Initialize Admin SDK in Functions
```typescript
// functions/src/index.ts
import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://YOUR_PROJECT_A_ID-default-rtdb.firebaseio.com',
})
```

---

## Step 8: Testing

### 8.1 Test Locally with Emulators
```bash
# In functions-project
firebase emulators:start
```

### 8.2 Test Static Pages
```bash
# Should serve from static hosting
curl https://YOUR_PROJECT_A.web.app/
curl https://YOUR_PROJECT_A.web.app/admin
```

### 8.3 Test Dynamic Rooms
```bash
# Should route to Cloud Function
curl https://YOUR_PROJECT_A.web.app/room/test123
curl https://YOUR_PROJECT_A.web.app/room/abc456
```

---

## Step 9: Deployment Workflow

### 9.1 Deploy Static Site (Project A)
```bash
# In TalkDrop root
npm run build
firebase deploy --only hosting
```

### 9.2 Deploy Functions (Project B)
```bash
# In functions-project
cd functions && npm run build && cd ..
firebase deploy --only functions
```

### 9.3 Combined Deploy Script
Create `deploy-all.sh`:
```bash
#!/bin/bash
set -e

echo "Building static site..."
npm run build

echo "Deploying static hosting..."
firebase deploy --only hosting --project PROJECT_A_ID

echo "Building functions..."
cd functions-project/functions
npm run build
cd ../..

echo "Deploying functions..."
firebase deploy --only functions --project PROJECT_B_ID

echo "Deployment complete!"
```

---

## Best Practices

### Performance
- Use Cloud Functions Gen 2 for better cold start
- Set appropriate memory limits (1GB recommended)
- Enable function concurrency
- Use CDN caching for static assets

### Security
- Use service account authentication between projects
- Implement rate limiting on functions
- Validate room IDs before processing
- Use Firebase App Check for abuse prevention

### Cost Optimization
- Cache rendered pages when possible
- Use static generation for common rooms
- Set function timeout appropriately (60s max)
- Monitor function invocations

### Monitoring
- Enable Cloud Logging
- Set up alerts for function errors
- Monitor function execution time
- Track database read/write operations

---

## Troubleshooting

### Function Timeout
```typescript
export const ssr = functions
  .runWith({
    timeoutSeconds: 120, // Increase if needed
  })
  .https.onRequest(handler)
```

### CORS Issues
```typescript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
```

### Database Permission Denied
- Verify service account has access
- Check database rules
- Ensure correct database URL

---

## Alternative: Single Project with Cloud Run

For simpler setup, consider deploying entire Next.js app to Cloud Run:

```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/talkdrop .

# Deploy to Cloud Run
gcloud run deploy talkdrop \
  --image gcr.io/PROJECT_ID/talkdrop \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

This eliminates the need for two projects but requires Docker setup.

---

## Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Next.js on Cloud Functions](https://github.com/vercel/next.js/tree/canary/examples/with-firebase-hosting)
- [Firebase Hosting Rewrites](https://firebase.google.com/docs/hosting/full-config#rewrites)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions/best-practices)
