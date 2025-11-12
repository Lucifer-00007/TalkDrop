import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import FirebaseConfigCheck from '@/components/FirebaseConfigCheck'
import { APP_METADATA } from '@/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = APP_METADATA

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseConfigCheck>
          {children}
        </FirebaseConfigCheck>
      </body>
    </html>
  )
}