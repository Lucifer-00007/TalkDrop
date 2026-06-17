'use client'

import { useRouter } from 'next/navigation'
import { MessageCircle, Zap, Shield, Clock, ArrowRight } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, MESSAGE_RETENTION, COPYRIGHT_YEAR, DUMMY_ROOMS } from '@/constants'
import { getRoomPath } from '@/lib/room-url'

export default function Footer() {
  const router = useRouter()

  const features = [
    { icon: Zap, label: 'Instant Setup', desc: 'No registration' },
    { icon: Shield, label: 'Anonymous & Safe', desc: 'Chat freely' },
    { icon: Clock, label: 'Auto-cleanup', desc: `After ${MESSAGE_RETENTION}` },
  ]

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/80 dark:to-gray-900/40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white ml-2.5">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
              {APP_TAGLINE}. No sign-up, no hassle — just instant conversations.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">All systems operational</span>
            </div>
          </div>

          {/* Popular Rooms */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Popular Rooms
            </h3>
            <ul className="space-y-2.5">
              {DUMMY_ROOMS.map((room) => (
                <li key={room.id}>
                  <button
                    onClick={() => router.push(getRoomPath(room.id))}
                    className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    <span className="group-hover:ml-1 transition-all">{room.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Highlights
            </h3>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
                    <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{feature.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Messages auto-deleted after {MESSAGE_RETENTION}
          </p>
        </div>
      </div>
    </footer>
  )
}
