interface PresenceIndicatorProps {
  online: boolean
  size?: 'sm' | 'md'
}

export default function PresenceIndicator({ online, size = 'sm' }: PresenceIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${
      online ? 'bg-green-500' : 'bg-gray-400'
    }`} />
  )
}