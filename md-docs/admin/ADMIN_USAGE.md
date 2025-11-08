# Admin Panel Usage

## Access

Navigate to `/admin` to access the admin panel.

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

Admin panel has no authentication - add access control for production use.