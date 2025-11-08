'use client'

import { useState } from 'react'
import { Shield, Mail } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'

export default function AdminAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email, password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Access</h1>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={handleEmailAuth} 
              className="w-full" 
              disabled={!email || !password || loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleAuth} 
            variant="outline" 
            className="w-full"
            disabled={loading}
          >
            <Mail className="h-4 w-4 mr-2" />
            Continue with Google
          </Button>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>
      </Card>
    </div>
  )
}