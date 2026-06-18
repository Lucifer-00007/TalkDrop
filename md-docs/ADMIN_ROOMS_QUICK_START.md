# Admin Rooms - Quick Start Guide

## Access the Admin Rooms Page

### 1. Ensure You Have Admin Access

```bash
# Grant admin access to a user
npm run admin:claims -- grant your-email@example.com

# Or use UID
npm run admin:claims -- grant abc123xyz
```

### 2. Sign In

1. Navigate to `/admin`
2. Sign in with your admin account
3. Click **"Rooms"** in the sidebar

## Key Features at a Glance

### View Rooms
- **List view** shows all rooms with metrics
- **Pagination** - 10 rooms per page
- **Auto-refresh** - Updates every 30 seconds

### Search & Filter
```
Search box → Type name, ID, or username
Status filter → Active | Disabled | All
Advanced → Date range, user count, message count
```

### Room Actions (⋮ menu)
- **👁 View Details** - Full room info + user list
- **✏️ Edit** - Change room name
- **⚡ Disable** - Block access, preserve data
- **🗑️ Delete** - Permanent removal

## Common Tasks

### Disable a Room (Temporary)
1. Find the room
2. Click menu (⋮) → "Disable"
3. Room blocks new joins
4. Data is preserved
5. Can be re-enabled later

### Delete a Room (Permanent)
1. Find the room
2. Click menu (⋮) → "Delete"
3. Confirm in dialog
4. All data removed (messages, presence)
5. Cannot be recovered

### Search for a Room
1. Use search box at top
2. Type: room name, room ID, or user name
3. Results filter instantly

### View Room Users
1. Click menu (⋮) → "View Details"
2. Scroll to "Users" section
3. See online (green) and offline (gray) users

## Room Status Behavior

| Status | Users Can Join | Visible to Users | Data Preserved | Admin Can See |
|--------|---------------|------------------|----------------|---------------|
| Active | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Disabled | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Deleted | ❌ N/A | ❌ N/A | ❌ No | ❌ No |

## Troubleshooting

### "Permission denied" error
**Solution**: Re-grant admin claim, sign out, sign in again

### Room not showing up
**Solutions**:
- Click "Refresh" button
- Check search filters
- Check status filter (Active/Disabled/All)

### Can't delete room
**Solutions**:
- Ensure you're signed in as admin
- Check Firebase console for errors
- Verify Firestore rules are deployed

### Disabled room still joinable
**Solutions**:
- Clear browser cache
- Verify status in Firestore console
- Check Firebase rules are deployed

## Data Structure

### Room Metadata (Firestore: `/rooms/{roomId}`)
```typescript
{
  name: string
  createdAt: Timestamp
  createdBy: string
  status: 'active' | 'disabled'  // Added by admin
}
```

### Presence Data (RTDB: `/rooms/{roomId}/presence/{uid}`)
```typescript
{
  displayName: string
  online: boolean
  lastSeen: number
}
```

## API Quick Reference

### Backend Functions (`src/lib/admin-rooms.ts`)

```typescript
// Get all rooms with metrics
getAllRooms(): Promise<AdminRoomData[]>

// Get single room details
getRoomDetails(roomId: string): Promise<AdminRoomData | null>

// Update room (name, status)
updateRoomMetadata(roomId: string, updates: {...}): Promise<void>

// Toggle active/disabled
toggleRoomStatus(roomId: string, currentStatus: string): Promise<string>

// Delete everything
deleteRoom(roomId: string): Promise<void>

// Filter rooms client-side
filterRooms(rooms: AdminRoomData[], filters: RoomFilters): AdminRoomData[]

// Check if room is disabled
isRoomDisabled(roomId: string): Promise<boolean>
```

## Tips & Best Practices

### 🎯 Efficiency
- Use search for quick lookups
- Apply filters to narrow results
- Check "View Details" before deleting

### 🔒 Security
- Only grant admin to trusted users
- Disable instead of delete when possible
- Review actions before confirming

### 📊 Monitoring
- Check user count before deleting
- Look at last message time for activity
- Use filters to find inactive rooms

### 🗑️ Cleanup
- Disable old rooms instead of deleting
- Export data before bulk deletion
- Verify empty rooms before removing

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus search | `/` or `Ctrl+K` |
| Close dialog | `Esc` |
| Confirm delete | `Enter` (in dialog) |

## Common Use Cases

### Find inactive rooms
1. Click "Advanced"
2. Set "Max Messages" to 0
3. Review results
4. Disable or delete

### Find rooms by user
1. Type username in search box
2. Results show all rooms they joined
3. Click room to see details

### Bulk disable old rooms
1. Click "Advanced"
2. Set "Date To" to 30 days ago
3. Manually disable each room
4. *Future: Bulk select feature*

## Mobile Usage

### On Mobile Devices
- ✅ Fully responsive design
- ✅ Touch-friendly buttons
- ✅ Swipe to dismiss dialogs
- ✅ Optimized layout

### Mobile Tips
- Use hamburger menu (☰) to access sidebar
- Search box collapses on mobile
- Cards stack vertically
- Pagination adapts to screen

## Support & Help

### Documentation
- **Full Guide**: `md-docs/ADMIN_ROOMS_FEATURE.md`
- **Summary**: `md-docs/ADMIN_ROOMS_IMPLEMENTATION_SUMMARY.md`

### Get Help
1. Check browser console for errors
2. Review Firebase console logs
3. Verify admin claim is active
4. Ensure Firebase connection is working

### Report Issues
- Check existing issues in repository
- Provide room ID and error message
- Include browser console logs
- Note steps to reproduce

## Quick Commands

```bash
# Start dev server
npm run dev

# Start with emulators
npm run dev:local

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Grant admin access
npm run admin:claims -- grant <email>

# Revoke admin access
npm run admin:claims -- revoke <email>

# Build for production
npm run build

# Deploy to hosting
npm run deploy
```

## That's It! 🎉

You're ready to manage rooms in the TalkDrop admin panel. The interface is intuitive and self-explanatory. Start by searching for a room, view its details, and explore the features.

**Remember**: Disable rooms to preserve data, delete only when necessary!
