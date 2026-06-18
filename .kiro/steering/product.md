# TalkDrop - Product Overview

TalkDrop is a real-time chat application that enables instant communication without registration. Users can create or join chat rooms using room IDs and communicate anonymously with automatic message cleanup.

## Core Features

- **Instant Room Creation**: Users create or join rooms with unique IDs
- **Real-time Messaging**: Live chat with typing indicators and presence awareness
- **Anonymous Authentication**: Firebase Anonymous Auth - no registration required
- **Admin Dashboard**: Administrative interface for room and user management
- **Automatic Cleanup**: Messages and inactive rooms are automatically cleaned up
- **Static Export**: Fully static site that can be deployed to any CDN/static host

## Key User Flows

1. **Homepage**: User enters display name → Creates new room or joins existing
2. **Chat Room**: Real-time messaging with presence indicators and typing status
3. **Admin Panel**: Authenticated admins can manage rooms, users, and view stats

## Technical Philosophy

- Privacy-first: Anonymous authentication, no user data collection
- Static-first: Entire app exports to static files for simple deployment
- Real-time: Firebase Realtime Database for instant message delivery
- Mobile-responsive: Works seamlessly on all device sizes
