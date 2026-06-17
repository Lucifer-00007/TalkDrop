# Admin Authentication Setup

## Security Model

- `/admin` is a client-side route and is not the real security boundary on static hosting.
- Firebase Authentication identifies the signed-in user.
- Firebase custom claims determine whether a user is an admin.
- Firestore and Realtime Database rules enforce privileged admin reads and destructive actions.
- Anonymous users are always denied admin access.

## Firebase Console Steps

### 1. Enable Admin Sign-In Providers

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable the sign-in providers that admins should use, such as **Email/Password** and **Google**
5. Save the configuration

### 2. Create or Identify the Admin User

1. Go to **Authentication** → **Users**
2. Create a new user or identify the existing user that should receive admin access
3. Record the user's email or UID for claim provisioning

### 3. Grant the Admin Claim

> **Note:** This command securely assigns administrator privileges by attaching hidden metadata (Custom Claims) to the user's Auth record via the Firebase Admin SDK. This guarantees true backend security: Firestore and Realtime Database rules verify this `isAdmin` claim on the server side, effectively blocking unauthorized access even if the client-side frontend is manipulated.

From the project root, run:

```bash
npm run admin:claims -- grant admin@example.com
```

To revoke access later:

```bash
npm run admin:claims -- revoke admin@example.com
```

The provisioning script applies the custom claims:

```json
{
  "isAdmin": true,
  "adminRole": "admin"
}
```

### 4. Refresh the User Token

After a claim grant or revoke, the affected user must sign out and sign back in, or otherwise refresh the ID token, before the access change takes effect in the browser.

## Environment Variables

Keep browser-safe Firebase config under `NEXT_PUBLIC_FIREBASE_*`.

Keep Admin SDK credentials for claim provisioning under server-only `FIREBASE_*` variables:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## Usage

1. Navigate to `/admin`
2. Sign in with a non-anonymous account
3. Ensure the account has the Firebase admin claim
4. Wait for the admin guard to verify the refreshed token
