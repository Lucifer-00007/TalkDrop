'use client'

import { isFirebaseConfigured } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function FirebaseConfigCheck({ children }: { children: React.ReactNode }) {
  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Firebase Configuration Required</CardTitle>
            </div>
            <CardDescription>
              Firebase is not configured. Please set up your Firebase project to use TalkDrop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="mb-2">To get started:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Firebase project</li>
                <li>Enable Authentication (Anonymous) and Realtime Database</li>
                <li>Add your Firebase config to .env.local</li>
                <li>See FIREBASE_SETUP.md for detailed instructions</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}