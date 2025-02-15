import { EconomicData } from '../types/economicData'

export async function getEconomicData(): Promise<EconomicData[]> {
  try {
    const response = await fetch('/api/economic-data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching economic data:', error)
    return []
  }
}

export async function getCountryEconomicData(countryCode: string): Promise<EconomicData | null> {
  try {
    const response = await fetch(`/api/economic-data/${countryCode}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching country economic data:', error)
    return null
  }
} 