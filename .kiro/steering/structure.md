# Project Structure

## Root Directory Layout

```
TalkDrop/
├── src/                    # Application source code
├── public/                 # Static assets (served as-is)
├── scripts/                # Build and utility scripts
├── out/                    # Static build output (generated)
├── .next/                  # Next.js build cache (generated)
├── .firebase/              # Firebase hosting cache
├── .kiro/                  # Kiro AI configuration
├── .agents/                # AI agent skills and configurations
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore index definitions
├── database.rules.json     # Realtime Database security rules
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
└── package.json            # Dependencies and scripts
```

## Source Code Organization (`src/`)

### Application Routes (`src/app/`)
Next.js App Router structure with file-based routing:

```
src/app/
├── layout.tsx              # Root layout (metadata, fonts, providers)
├── page.tsx                # Homepage (name entry, create/join room)
├── room/
│   └── [id]/
│       └── page.tsx        # Dynamic room page
└── admin/                  # Admin dashboard routes
    ├── layout.tsx          # Admin layout with auth guard
    ├── page.tsx            # Admin overview/dashboard
    ├── rooms/
    │   └── page.tsx        # Room management
    └── users/
        └── page.tsx        # User management
```

### Components (`src/components/`)

**UI Components** (`src/components/ui/`): Base shadcn/ui components
- Follows Radix UI + CVA pattern
- Examples: `button.tsx`, `dialog.tsx`, `toast.tsx`, `avatar.tsx`
- All use `cn()` utility for className merging

**Feature Components** (root level):
- **Chat**: `ChatWindow.tsx`, `MessageList.tsx`, `MessageItem.tsx`, `MessageInput.tsx`
- **Room**: `RoomHeader.tsx`, `RoomPageClient.tsx`, `RoomSearchPageClient.tsx`
- **Presence**: `PresenceIndicator.tsx`, `PresenceList.tsx`, `TypingIndicator.tsx`
- **Admin**: `AdminLayout.tsx`, `AdminNavbar.tsx`, `AdminSidebar.tsx`, `AdminRouteGuard.tsx`, `AdminAuth.tsx`
- **Layout**: `Header.tsx`, `Footer.tsx`
- **Utilities**: `ConfirmDialog.tsx`, `FirebaseConfigCheck.tsx`, `ChatSkeleton.tsx`

### Library Code (`src/lib/`)

**Firebase Services**:
- `firebase.ts` - Firebase app initialization and emulator config
- `auth.ts` - Authentication utilities
- `rtdb.ts` - Realtime Database operations (messages, presence, typing)
- `firestore.ts` - Firestore operations (room metadata)

**Admin Functionality**:
- `admin.ts` - Admin SDK initialization
- `admin-access.ts` - Admin permission checks
- `admin-stats.ts` - Dashboard statistics
- `admin-errors.ts` - Admin error handling

**Utilities**:
- `utils.ts` - `cn()` className utility
- `config.ts` - Firebase config validation
- `theme.ts` - Theme management
- `room-url.ts` - Room URL helpers

### Custom Hooks (`src/hooks/`)

- `useAuth.ts` - Firebase authentication state
- `useRoom.ts` - Room data and real-time subscriptions
- `useAdminAccess.ts` - Admin permission checking

### Constants (`src/constants/`)

- `index.ts` - App-wide constants (e.g., message limits, cleanup intervals)

### Styles (`src/styles/`)

- `globals.css` - Global styles, Tailwind directives, CSS variables for theming

## File Naming Conventions

- **Components**: PascalCase (e.g., `MessageList.tsx`, `AdminAuth.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useAuth.ts`, `admin-access.ts`)
- **Config files**: kebab-case (e.g., `next.config.js`, `tailwind.config.ts`)
- **Client Components**: Files using hooks or browser APIs must have `'use client'` directive

## Import Patterns

**Use path aliases**:
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

// ❌ Avoid
import { Button } from "../../components/ui/button"
```

**Import order** (convention):
1. React/Next.js imports
2. Third-party libraries
3. Internal components (`@/components`)
4. Internal utilities (`@/lib`, `@/hooks`)
5. Types
6. Styles

## Component Structure Patterns

**shadcn/ui components** (`src/components/ui/`):
- Use Radix UI primitives
- Define variants with CVA
- Export component + variants
- Include TypeScript interfaces

**Feature components**:
- Client components: `'use client'` at top
- Server components: No directive (default in App Router)
- Props interface defined before component
- Use `React.forwardRef` when needed

## Admin Features

**Authentication Flow**:
1. `AdminRouteGuard.tsx` - Client-side route protection
2. `useAdminAccess.ts` - Custom claims check
3. `admin-access.ts` - Server-side validation helpers

**Security Model**:
- Client guards are UX only
- Real security via Firebase custom claims (`isAdmin: true`)
- Firestore/RTDB rules enforce server-side permissions

## Static Export Constraints

- No Server Components with dynamic data fetching
- No API routes
- No Image Optimization (images: `unoptimized: true`)
- No server-side authentication
- All Firebase operations are client-side
