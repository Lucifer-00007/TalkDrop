# Local Development with Firebase Emulators

## Prerequisites

**Java Installation Required** - Firebase emulators need Java Runtime Environment (JRE) 11 or higher.

### Install Java

**macOS:**
```bash
# Using Homebrew
brew install openjdk@11

# Or download from Oracle
# https://www.oracle.com/java/technologies/downloads/
```

**Windows:**
1. Download from [Oracle Java](https://www.oracle.com/java/technologies/downloads/)
2. Run installer and follow setup wizard
3. Verify: Open Command Prompt → `java -version`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-11-jre
```

**Verify Installation:**
```bash
java -version
# Should show: openjdk version "11.x.x" or higher
```

## Quick Start (No Firebase Project Needed!)

Once Java is installed, you can start developing immediately using Firebase emulators - no cloud setup required.

### 1. Start Local Development

```bash
# Start both emulators and dev server
npm run dev:local
```

This will:
- Start Firebase emulators (Auth, Database, Firestore) 
- Start Next.js development server
- Open Firebase Emulator UI at http://localhost:4000
- Open your app at http://localhost:3000

### 2. Alternative: Manual Start

```bash
# Terminal 1: Start emulators
npm run emulators

# Terminal 2: Start dev server  
npm run dev
```

## What You Get Locally

### Firebase Emulator UI (http://localhost:4000)
- **Authentication**: View anonymous users
- **Realtime Database**: See live messages and presence data
- **Firestore**: View persistent message history
- **Logs**: Debug Firebase operations

### Your App (http://localhost:3000)
- Full real-time chat functionality
- Multiple users (open multiple browser tabs)
- Presence indicators
- Typing indicators
- Message persistence

## Testing Multi-User Scenarios

1. Open multiple browser tabs to http://localhost:3000
2. Use different display names in each tab
3. Join the same room from different tabs
4. Test real-time messaging, presence, and typing indicators

## Emulator Ports

- **Auth Emulator**: http://127.0.0.1:9099
- **Realtime Database**: http://127.0.0.1:9000  
- **Firestore**: http://127.0.0.1:8080
- **Emulator UI**: http://localhost:4000

## Data Persistence

- **Emulator data is temporary** - restarting emulators clears all data
- Perfect for testing without affecting production
- No costs or quotas to worry about

## Debugging Tips

### View Live Data
1. Open Firebase Emulator UI (http://localhost:4000)
2. Go to Realtime Database tab to see live messages
3. Go to Authentication tab to see anonymous users
4. Check Firestore tab for persistent message history

### Common Issues
- **Java not found**: Install Java JRE 11+ and verify with `java -version`
- **Port conflicts**: Change ports in `firebase.json` if needed
- **Emulator not starting**: Run `firebase emulators:start` separately to see errors
- **Connection issues**: Check console for emulator connection logs
- **Permission errors**: On macOS, allow Java in System Preferences → Security

## Moving to Production

When ready to deploy:

1. **Create Firebase Project** (follow FIREBASE_SETUP.md)
2. **Update .env.local** with real Firebase config
3. **Remove or set** `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
4. **Deploy**: `npm run deploy`

## Environment Variables

Current `.env.local` is configured for emulators:

```env
# These are demo values for emulators
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
# ... other demo values

# This enables emulator mode
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Benefits of Local Development

✅ **No Setup Required** - Start coding immediately  
✅ **No Costs** - Emulators are completely free  
✅ **Fast Iteration** - No network latency  
✅ **Safe Testing** - No production data affected  
✅ **Offline Development** - Works without internet  
✅ **Full Feature Parity** - Same as production Firebase