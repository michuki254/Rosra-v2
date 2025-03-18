'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center p-4">
        {/* Left side - ROSRA Logo */}
        <Link href="/" className="relative w-[300px] h-[100px]">
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

        {/* Right side - Navigation and Norad Logo */}
        <div className="flex items-center gap-8">
          {/* Navigation Menu */}
          <div className="flex items-center gap-4">
            {/* <Link
              href="/rosra-v1"
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/rosra-v1' ? 'font-bold' : ''
              }`}
            >
              SAMPLE REPORT V1
            </Link> */}
            <Link 
              href="/rosra-v2"
              className={`text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity ${
                pathname === '/rosra-v2' ? 'font-bold' : ''
              }`}
            >
              SAMPLE REPORT V2
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