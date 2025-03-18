'use client'

import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button 
      onClick={toggleTheme}
      className="relative inline-flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Icons */}
      <SunIcon className={`w-5 h-5 transition-colors duration-200 ${
        theme === 'dark' 
          ? 'text-gray-400 hover:text-yellow-400' 
          : 'text-yellow-500'
      }`} />
      
      {/* Slider */}
      <div className={`mx-2 w-14 h-7 rounded-full p-1 transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-600 shadow-inner' 
          : 'bg-blue-100 shadow-inner'
      }`}>
        <div className={`w-5 h-5 rounded-full transition-all duration-200 shadow-md ${
          theme === 'dark'
            ? 'bg-blue-400 transform translate-x-7' 
            : 'bg-blue-500 transform translate-x-0'
        }`} />
      </div>
      
      <MoonIcon className={`w-5 h-5 transition-colors duration-200 ${
        theme === 'dark' 
          ? 'text-blue-400' 
          : 'text-gray-400 hover:text-blue-400'
      }`} />
    </button>
  )
} 