# Admin Panel Usage

## Access

Navigate to `/admin` to access the admin panel.

- The route guard is UX only.
- Firebase custom claims and Firebase rules are the actual enforcement layer.
- Non-admin or anonymous users can reach the route, but privileged reads and actions are still blocked by Firebase.

## Features

### View Messages
- All messages from all rooms displayed in a table
- Shows room ID, sender name, message content, and timestamp

### Filter Messages
- Use the search box to filter by:
  - Message content
  - Sender name  
  - Room ID

### Delete Messages
- **Single Message**: Click trash icon → confirm deletion
- **Room Messages**: Click "Clear Room" → deletes all messages in that room

### Refresh Data
- Click refresh button to reload latest messages

## Functions

- `getAllMessages()` - Fetches messages from Firestore
- `deleteMessage(roomId, messageId)` - Removes from both Firestore and RTDB
- `deleteRoomMessages(roomId)` - Clears entire room

## Security Note

- Admin access requires the Firebase custom claim `isAdmin: true`.
- Anonymous users are denied before admin content renders.
- Firestore rules protect room listing, message archives, and deletes.
- RTDB rules protect global `rooms` reads used by the admin user overview.
- If access changes are made, refresh the user's ID token by signing out and back in.
