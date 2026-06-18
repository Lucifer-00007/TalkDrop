# Technology Stack

## Framework & Language

- **Next.js 15** with App Router and static export (`output: 'export'`)
- **TypeScript 5.7** with strict mode enabled
- **React 19** with React DOM

## Styling & UI

- **Tailwind CSS 3.4** for utility-first styling
- **Radix UI** for accessible, unstyled component primitives
- **shadcn/ui** pattern for UI components (in `src/components/ui/`)
- **Lucide React** for icons
- **class-variance-authority** (CVA) for component variants
- **tailwind-merge + clsx** via `cn()` utility for className management

## Backend & Database

- **Firebase 12.5** (client SDK)
  - **Firebase Auth**: Anonymous authentication
  - **Firebase Realtime Database**: Real-time messaging and presence
  - **Firebase Firestore**: Room metadata and admin data
- **Firebase Admin 14.0** (server-side SDK for admin operations)
- **Firebase Hosting**: Static site deployment

## Build System & Tools

- **Node.js 18+** required
- **npm** for package management
- **ESLint** with Next.js config for linting
- **PostCSS + Autoprefixer** for CSS processing

## Common Commands

### Development
```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run dev:local        # Run with Firebase emulators (concurrent)
npm run emulators        # Start Firebase emulators only
```

### Building & Deployment
```bash
npm run build           # Build static export to out/ folder
npm run preview         # Preview production build locally
npm run deploy          # Build and deploy to Firebase Hosting
npm run lint            # Run ESLint checks
```

### Admin & Utilities
```bash
npm run admin:claims -- grant <email-or-uid>    # Grant admin access
npm run admin:claims -- revoke <email-or-uid>   # Revoke admin access
npm run check:sizes                              # Check output file sizes
```

## Environment Configuration

### Required Environment Variables (`.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Optional for Local Development
```
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true  # Use local emulators
```

### Server-side (Admin SDK)
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

## Firebase Configuration

- **Static Export**: Images are unoptimized, no server-side features
- **Emulator Ports**: Auth (9099), Firestore (8080), RTDB (9000), UI (4000)
- **Security**: Client-side Firebase config is public; security enforced via Firebase rules
- **Admin Access**: Custom claims (`isAdmin: true`) managed via Admin SDK

## Path Aliases

TypeScript paths configured in `tsconfig.json`:
```typescript
"@/*" → "./src/*"
```

Use `@/` imports for all internal modules:
```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

## TypeScript Configuration

- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Strict mode**: Enabled
- **JSX**: Preserve (Next.js handles transformation)
