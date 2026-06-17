'use client'

import { MessageCircle, Zap, Shield, Clock } from 'lucide-react'
import { APP_NAME, MESSAGE_RETENTION, COPYRIGHT_YEAR } from '@/constants'

export default function Footer() {
  const features = [
    { icon: Zap, label: 'Instant Setup' },
    { icon: Shield, label: 'Anonymous & Safe' },
    { icon: Clock, label: `Auto-delete after ${MESSAGE_RETENTION}` },
  ]

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700/50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white ml-2.5">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Instant chat rooms for quick conversations. No sign-up, no hassle.
            </p>
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Highlights
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
                    <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Messages are automatically deleted after {MESSAGE_RETENTION}
          </p>
        </div>
      </div>
    </footer>
  )
}
