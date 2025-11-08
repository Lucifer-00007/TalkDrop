# Admin Authentication Setup

## Firebase Console Steps

### 1. Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Email/Password**
5. Enable **Email/Password** toggle
6. Click **Save**

### 2. Enable Google Authentication

1. In **Authentication** → **Sign-in method**
2. Click **Google**
3. Enable the toggle
4. Select a **Project support email**
5. Click **Save**

### 3. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Add user**

### 4. Update Firestore Rules (Optional)

To restrict admin access to specific emails:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write: if request.auth != null;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
        allow delete: if request.auth != null && 
          request.auth.token.email in ['admin@example.com'];
      }
    }
  }
}
```

Replace `admin@example.com` with your admin email.

## Usage

1. Navigate to `/admin`
2. Sign in with email/password or Google
3. Access admin panel features