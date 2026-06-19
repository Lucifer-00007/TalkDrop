import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import FirebaseConfigCheck from '@/components/FirebaseConfigCheck'
import { Toaster } from '@/components/ui/toaster'
import { APP_METADATA } from '@/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = APP_METADATA

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <FirebaseConfigCheck>
          {children}
        </FirebaseConfigCheck>
        <Toaster />
      </body>
    </html>
  )
}