import { CalculationData } from '../types/calculationData'

export async function getCalculationData(): Promise<CalculationData[]> {
  try {
    const response = await fetch('/api/calculations')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching calculation data:', error)
    return []
  }
}

export async function getCountryCalculationData(countryCode: string): Promise<CalculationData[]> {
  try {
    const response = await fetch(`/api/calculations/${countryCode}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching country calculation data:', error)
    return []
  }
} 