export const DUMMY_ROOMS = [
  { id: 'general', name: 'General Chat' },
  { id: 'random', name: 'Random' },
  { id: 'tech', name: 'Tech Talk' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music Lovers' },
]

export const FEATURES = [
  {
    icon: 'Zap',
    title: 'Instant Setup',
    description: 'Create or join rooms in seconds. No registration required.',
    color: 'text-blue-600'
  },
  {
    icon: 'MessageCircle',
    title: 'Real-time Chat',
    description: 'Messages appear instantly with typing indicators and presence.',
    color: 'text-green-600'
  },
  {
    icon: 'Users',
    title: 'Anonymous & Safe',
    description: 'Chat anonymously with automatic message cleanup.',
    color: 'text-purple-600'
  }
]

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Enter Your Name',
    description: 'Choose a display name to identify yourself in the chat'
  },
  {
    step: 2,
    title: 'Create or Join',
    description: 'Start a new room or join an existing one with a room ID'
  },
  {
    step: 3,
    title: 'Start Chatting',
    description: 'Share the room link and chat with anyone instantly'
  }
]

export const USE_CASES = [
  {
    title: 'Quick Team Discussions',
    description: 'Coordinate with your team without setting up accounts or complex tools'
  },
  {
    title: 'Event Coordination',
    description: 'Organize events and communicate with attendees in real-time'
  },
  {
    title: 'Study Groups',
    description: 'Collaborate with classmates on projects and assignments'
  },
  {
    title: 'Customer Support',
    description: 'Provide quick support to customers without complex integrations'
  }
]

export const MOCK_MESSAGES = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Alice',
    text: 'Hey everyone! 👋',
    timeOffset: 300000
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Bob',
    text: 'Hello! How is everyone doing?',
    timeOffset: 240000
  }
]

export const MOCK_USERS = [
  { id: 'user1', displayName: 'Alice', online: true, lastSeenOffset: 0 },
  { id: 'user2', displayName: 'Bob', online: true, lastSeenOffset: 60000 }
]

export const APP_NAME = 'TalkDrop'
export const APP_TAGLINE = 'Instant chat rooms for quick conversations'
export const MESSAGE_RETENTION = '24 hours'
export const COPYRIGHT_YEAR = 2024

export const ALLOWED_ADMIN_EMAILS = [
  'files.backup.777@gmail.com',
  'admin.files.backup.777@gmail.com'
]
