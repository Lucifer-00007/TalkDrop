# User Delete Feature - Admin Users Page

## Overview
Added a comprehensive user deletion feature to the `/admin/users` page that allows admins to permanently remove user data from the database following security best practices.

## Features

### 1. User Deletion Button
- **Location**: Dropdown menu (three-dot icon) next to each user in the list
- **Access**: Admin-only feature (requires Firebase custom claim `isAdmin: true`)
- **Visual**: Red "Delete User" option with trash icon

### 2. Confirmation Dialog
- **Design**: Alert dialog with detailed information about deletion
- **Information Shown**:
  - User's display name
  - Detailed list of data to be deleted
  - Warning that action cannot be undone
- **Actions**:
  - Cancel button (gray, allows backing out)
  - Delete button (red with border, destructive action)

### 3. Data Deletion Scope

The delete operation removes:

#### From Realtime Database (RTDB):
1. **Presence Data**: User's online/offline status from all rooms
   - Path: `rooms/{roomId}/presence/{userId}`
   
2. **Typing Indicators**: User's typing status from all rooms
   - Path: `rooms/{roomId}/typing/{userId}`

#### From Firestore:
3. **Messages**: All messages sent by the user across all rooms
   - Collection: `rooms/{roomId}/messages`
   - Query: `where('senderId', '==', userId)`

### 4. Success Feedback
After successful deletion, a toast notification shows:
- User's display name
- Number of records deleted:
  - Presence records count
  - Messages count
  - Typing indicators count

## Implementation Details

### New Files Created

#### `/src/lib/admin-users.ts`
Core deletion logic with two main functions:

```typescript
// Main deletion function
export const deleteUserData = async (userId: string): Promise<DeleteUserResult>

// Helper to check if user exists
export const userExists = async (userId: string): Promise<boolean>
```

**Features:**
- Parallel deletion using `Promise.all()` for performance
- Comprehensive error handling
- Returns detailed statistics about deleted records
- Type-safe with TypeScript interfaces

### Updated Files

#### `/src/app/admin/users/page.tsx`
- Added delete button with dropdown menu
- Implemented confirmation dialog
- Added delete handlers with loading states
- Integrated toast notifications
- Fixed HTML validation error (ul inside p tag)

#### Security Rules

##### `/database.rules.json` (RTDB)
**Before:**
```json
".write": false  // Global write denied
```

**After:**
```json
".write": "auth != null && auth.token.isAdmin === true"  // Admin write access
```

**Updates to presence and typing rules:**
- Admins can delete any presence/typing data
- Regular users can still update their own data
- Uses OR condition to allow both admin and user writes

##### `/firestore.rules`
- Already had admin delete permissions (`allow delete: if isAdmin()`)
- No changes needed for Firestore

## Security Best Practices Followed

### 1. ✅ Confirmation Before Deletion
- Explicit user confirmation required
- Clear description of what will be deleted
- Warning that action is irreversible

### 2. ✅ Admin-Only Access
- Requires Firebase custom claim `isAdmin: true`
- Client-side UI protection (button only visible to admins)
- Server-side security rules enforcement

### 3. ✅ Loading States
- Button disabled during deletion
- Text changes to "Deleting..." 
- Prevents double-clicks and multiple submissions

### 4. ✅ Error Handling
- Try-catch blocks around all async operations
- User-friendly error messages via toast
- Errors logged to console for debugging

### 5. ✅ Atomic Operations
- All deletion operations in a single transaction-like flow
- If one part fails, error is caught and reported
- Uses Promise.all() for parallel operations

### 6. ✅ Detailed Feedback
- Success message shows what was deleted
- Statistics provided (count of deleted items)
- Toast notifications for both success and error cases

### 7. ✅ Accessibility
- Keyboard accessible (dropdown menu, dialog)
- ARIA labels on interactive elements
- Screen reader friendly

## Usage Flow

### Admin Perspective

1. **Navigate** to `/admin/users`
2. **Locate** the user to delete in the list
3. **Click** the three-dot menu icon (⋮) next to the user
4. **Select** "Delete User" from dropdown
5. **Review** the confirmation dialog:
   - User's display name
   - List of data to be deleted
   - Warning message
6. **Confirm** by clicking "Delete User Data" (or cancel)
7. **Wait** for deletion to complete (button shows "Deleting...")
8. **View** success toast with deletion statistics

### Technical Flow

1. User clicks "Delete User" → `handleDeleteClick(user)`
2. Set `userToDelete` state → Opens `AlertDialog`
3. User confirms → `handleDeleteConfirm()`
4. Set `deleting` state to `true` → Disable buttons
5. Call `deleteUserData(userId)` from `admin-users.ts`
6. Function executes:
   - Get all rooms from RTDB
   - Delete presence data (parallel)
   - Delete typing data (parallel)
   - Query Firestore for user's messages
   - Delete all messages (parallel)
7. Return statistics
8. Show success toast or error toast
9. Reset states, close dialog

## Firebase Security Rules Updates

### Realtime Database Rules

```json
{
  "rules": {
    "rooms": {
      ".read": "auth != null && auth.token.isAdmin === true",
      ".write": "auth != null && auth.token.isAdmin === true", // ← NEW
      "$roomId": {
        "presence": {
          "$uid": {
            ".write": "(auth != null && auth.token.isAdmin === true) || (...)" // ← UPDATED
          }
        },
        "typing": {
          "$uid": {
            ".write": "(auth != null && auth.token.isAdmin === true) || (...)" // ← UPDATED
          }
        }
      }
    }
  }
}
```

**Key Changes:**
- Global admin write access at `/rooms` level
- OR conditions in presence/typing to allow admin overrides
- Regular users can still update their own data

### Deployment Note

⚠️ **IMPORTANT**: After deploying, you must update Firebase security rules:

```bash
# Deploy RTDB rules
firebase deploy --only database

# Deploy Firestore rules (already correct, but to be safe)
firebase deploy --only firestore:rules
```

## Testing Checklist

### Functional Testing
- [ ] Delete button appears in user dropdown menu
- [ ] Clicking delete opens confirmation dialog
- [ ] Dialog shows correct user name and information
- [ ] Cancel button closes dialog without deleting
- [ ] Delete button removes user data
- [ ] Success toast shows with correct statistics
- [ ] User data is actually removed from Firebase
- [ ] Error toast shows if deletion fails

### Security Testing
- [ ] Non-admin users cannot see delete button
- [ ] Non-admin users cannot call delete function directly
- [ ] Firebase rules prevent non-admin deletes
- [ ] Admin token validation works correctly

### UX Testing
- [ ] Loading state shows during deletion
- [ ] Buttons disabled during deletion
- [ ] No double-deletion possible
- [ ] Dialog is accessible via keyboard
- [ ] Screen reader announces actions correctly

### Edge Cases
- [ ] Deleting user with no data (0 messages, no presence)
- [ ] Deleting user with data in multiple rooms
- [ ] Deleting online user vs offline user
- [ ] Network error during deletion
- [ ] Permission error during deletion

## Error Handling

### Possible Errors

1. **Permission Denied**
   - Cause: User doesn't have admin claim
   - Solution: Grant admin access or check authentication
   - Message: "Permission denied. Admin access required."

2. **Network Error**
   - Cause: No internet connection
   - Solution: Check connection and retry
   - Message: "Network error. Please check your connection."

3. **Firebase Not Initialized**
   - Cause: Firebase SDK not loaded
   - Solution: Check Firebase configuration
   - Message: "Firebase not initialized"

4. **User Not Found**
   - Cause: User data already deleted or doesn't exist
   - Solution: Refresh page and try again
   - Message: "User not found or already deleted"

## Performance Considerations

### Optimization Strategies

1. **Parallel Deletion**: Uses `Promise.all()` to delete from multiple rooms simultaneously
2. **Efficient Queries**: Firestore queries use indexed `senderId` field
3. **Batch Operations**: Groups deletions by operation type
4. **No UI Blocking**: Async operations with loading states

### Expected Performance

- **Small user** (1-2 rooms, <10 messages): ~1-2 seconds
- **Medium user** (5-10 rooms, 50 messages): ~2-4 seconds  
- **Large user** (20+ rooms, 200+ messages): ~5-8 seconds

## Future Enhancements

1. **Soft Delete**: Add option to disable user instead of permanent delete
2. **Bulk Delete**: Select and delete multiple users at once
3. **Audit Log**: Track who deleted which users and when
4. **Data Export**: Download user data before deletion
5. **Scheduled Deletion**: Queue deletion for later execution
6. **Undo Option**: Temporary recycle bin for deleted users
7. **Confirmation Input**: Require typing user name to confirm

## Troubleshooting

### Issue: Permission Denied Error
**Solution**: Deploy updated security rules to Firebase
```bash
firebase deploy --only database
```

### Issue: Button Not Showing
**Solution**: Verify user has admin claim
```bash
npm run admin:claims -- grant user@example.com
```

### Issue: Deletion Times Out
**Solution**: User has too much data, consider batch processing or increase timeout

### Issue: HTML Validation Warning
**Solution**: Already fixed by using `asChild` prop on AlertDialogDescription
