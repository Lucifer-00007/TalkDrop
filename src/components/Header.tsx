'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Moon, Sun } from 'lucide-react'
import { APP_NAME } from '@/constants'

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsDark(theme === 'dark')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 px-2 py-2 flex justify-between items-center z-50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
      <div className="flex items-center">
        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-2">{APP_NAME}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="dark:text-white"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  )
}
