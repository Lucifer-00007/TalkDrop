'use client'

import { useState, useEffect } from 'react'
import { Shield, Mail, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { signInWithEmail, signInWithGoogle, getAuthErrorMessage } from '@/lib/auth'
import { getTheme, toggleTheme, initTheme } from '@/lib/theme'

export default function AdminAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    initTheme()
    setIsDark(getTheme() === 'dark')
  }, [])

  const handleToggleTheme = () => {
    const newTheme = toggleTheme()
    setIsDark(newTheme === 'dark')
  }

  const handleEmailAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email, password)
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleTheme}
        className="fixed top-4 right-4 dark:text-white"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
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