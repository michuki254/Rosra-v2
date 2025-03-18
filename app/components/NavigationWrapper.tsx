'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import TopBar from './TopBar'

export default function NavigationWrapper() {
  const pathname = usePathname()
  
  // No longer hiding navigation on auth pages
  return (
    <div className="navigation-wrapper">
      <TopBar />
      <Navbar />
    </div>
  )
}