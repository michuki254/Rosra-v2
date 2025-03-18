'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { useSession, signOut } from 'next-auth/react'

export default function TopBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-2 flex justify-end items-center gap-6">
        {isAuthenticated ? (
          <>
            <Link
              href="/dashboard"
              className={`text-sm hover:text-gray-300 transition-colors ${
                pathname === '/dashboard' ? 'text-blue-400' : ''
              }`}
            >
              DASHBOARD
            </Link>
            <Link
              href="/admin"
              className={`text-sm hover:text-gray-300 transition-colors ${
                pathname === '/admin' ? 'text-blue-400' : ''
              }`}
            >
              ADMIN
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm hover:text-gray-300 transition-colors"
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className={`text-sm hover:text-gray-300 transition-colors ${
                pathname === '/auth/login' ? 'text-blue-400' : ''
              }`}
            >
              LOGIN
            </Link>
            <Link
              href="/auth/register"
              className={`text-sm hover:text-gray-300 transition-colors ${
                pathname === '/auth/register' ? 'text-blue-400' : ''
              }`}
            >
              REGISTER
            </Link>
          </>
        )}
        
        <ThemeToggle />
      </div>
    </div>
  )
}
