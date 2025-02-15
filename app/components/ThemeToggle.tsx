'use client'

import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button 
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary-light dark:border-primary-dark"
    >
      <div className={`w-6 h-6 rounded-full transition-colors duration-200 ${
        theme === 'dark' ? 'bg-primary-dark' : 'bg-gray-400'
      }`}></div>
      <div className={`w-6 h-6 rounded-full transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-600' : 'bg-primary-light'
      }`}></div>
      <span className="text-text-light dark:text-text-dark ml-2">
        {theme === 'dark' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  )
} 