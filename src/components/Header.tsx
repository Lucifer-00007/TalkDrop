'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Moon, Sun } from 'lucide-react'
import { APP_NAME } from '@/constants'
import { getTheme, toggleTheme, initTheme } from '@/lib/theme'

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    initTheme()
    setIsDark(getTheme() === 'dark')
  }, [])

  const handleToggleTheme = () => {
    const newTheme = toggleTheme()
    setIsDark(newTheme === 'dark')
  }

  return (
    <header className="fixed top-0 left-0 right-0 px-4 py-3 flex justify-between items-center z-50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/30 dark:border-white/10 shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-2.5">{APP_NAME}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleTheme}
        className="dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  )
}
