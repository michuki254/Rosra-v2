import { Country } from '../types/country'

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('/api/countries')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

export async function getCountry(iso2: string): Promise<Country | null> {
  try {
    const response = await fetch(`/api/countries/${iso2}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching country:', error)
    return null
  }
} 