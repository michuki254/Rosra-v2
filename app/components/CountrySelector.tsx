'use client'

import { useState, useEffect, useRef } from 'react'
import { Country } from '../types/country'
import { getCountries } from '../services/countryService'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface CountrySelectorProps {
  onSelect: (country: Country | undefined) => void
  selectedCountry?: Country
}

export default function CountrySelector({ onSelect, selectedCountry }: CountrySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCountries() {
      const data = await getCountries()
      setCountries(data)
      setLoading(false)
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded-lg"></div>
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedCountry ? selectedCountry.name : 'Select a country'}
        </span>
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(undefined)
                setSearchTerm('')
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <svg 
                className="w-4 h-4 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.iso2}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => {
                    onSelect(country)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                >
                  {country.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 