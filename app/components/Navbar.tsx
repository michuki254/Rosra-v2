'use client'

import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      {/* Top Bar with Theme Toggle */}
      <div className="w-full border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-2 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center p-4">
        <Link href="/" className="relative w-[300px] h-[100px]">
          {/* ROSRA Logo */}
          <Image 
            src="/rosra-un-habitat-logo.png"
            alt="ROSRA UN-HABITAT Logo"
            fill
            priority
            className="object-contain dark:block hidden"
          />
          <Image 
            src="/Light-theme-logo.png"
            alt="ROSRA UN-HABITAT Logo"
            fill
            priority
            className="object-contain block dark:hidden"
          />
        </Link>
        <div className="flex items-center gap-8">
          {/* Navigation Menu */}
          <div className="flex gap-4">
            <Link
              href="/rosra-v1"
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/rosra-v1' ? 'font-bold' : ''
              }`}
            >
              SAMPLE REPORT V1
            </Link>
            <Link 
              href="/rosra-v2"
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/rosra-v2' ? 'font-bold' : ''
              }`}
            >
              SAMPLE REPORT V2
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link
              href="/auth/login" 
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/auth/login' ? 'font-bold' : ''
              }`}
            >
              LOGIN
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link 
              href="/auth/register" 
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/auth/register' ? 'font-bold' : ''
              }`}
            >
              REGISTER
            </Link>
          </div>
          {/* Norad Logo */}
          <div className="relative w-[200px] h-[80px]">
            <Image 
              src="/norad-logo.png"
              alt="Norad - Norwegian Agency for Development Cooperation"
              fill
              priority
              className="object-contain dark:block hidden"
            />
            <Image 
              src="/Light-theme-norad.png"
              alt="Norad - Norwegian Agency for Development Cooperation"
              fill
              priority
              className="object-contain block dark:hidden"
            />
          </div>
        </div>
      </div>
    </nav>
  )
} 