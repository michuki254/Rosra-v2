// Country API service for fetching additional country information

interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  currency: string;
  population: number;
  capital: string;
  region: string;
}

// Cache for country data to avoid repeated API calls
const countryCache: Record<string, CountryInfo> = {};

// Fallback data for common countries when API fails
const fallbackCountryData: Record<string, CountryInfo> = {
  'KE': {
    name: 'Kenya',
    code: 'KE',
    flag: 'https://flagcdn.com/ke.svg',
    currency: 'KES',
    population: 53771300,
    capital: 'Nairobi',
    region: 'Africa'
  },
  'US': {
    name: 'United States',
    code: 'US',
    flag: 'https://flagcdn.com/us.svg',
    currency: 'USD',
    population: 329484123,
    capital: 'Washington, D.C.',
    region: 'Americas'
  },
  'GB': {
    name: 'United Kingdom',
    code: 'GB',
    flag: 'https://flagcdn.com/gb.svg',
    currency: 'GBP',
    population: 67215293,
    capital: 'London',
    region: 'Europe'
  },
  'CA': {
    name: 'Canada',
    code: 'CA',
    flag: 'https://flagcdn.com/ca.svg',
    currency: 'CAD',
    population: 38005238,
    capital: 'Ottawa',
    region: 'Americas'
  },
  'AU': {
    name: 'Australia',
    code: 'AU',
    flag: 'https://flagcdn.com/au.svg',
    currency: 'AUD',
    population: 25687041,
    capital: 'Canberra',
    region: 'Oceania'
  },
  'DE': {
    name: 'Germany',
    code: 'DE',
    flag: 'https://flagcdn.com/de.svg',
    currency: 'EUR',
    population: 83240525,
    capital: 'Berlin',
    region: 'Europe'
  },
  'FR': {
    name: 'France',
    code: 'FR',
    flag: 'https://flagcdn.com/fr.svg',
    currency: 'EUR',
    population: 67391582,
    capital: 'Paris',
    region: 'Europe'
  },
  'ZA': {
    name: 'South Africa',
    code: 'ZA',
    flag: 'https://flagcdn.com/za.svg',
    currency: 'ZAR',
    population: 59308690,
    capital: 'Pretoria',
    region: 'Africa'
  },
  'NG': {
    name: 'Nigeria',
    code: 'NG',
    flag: 'https://flagcdn.com/ng.svg',
    currency: 'NGN',
    population: 206139587,
    capital: 'Abuja',
    region: 'Africa'
  },
  'GH': {
    name: 'Ghana',
    code: 'GH',
    flag: 'https://flagcdn.com/gh.svg',
    currency: 'GHS',
    population: 31072945,
    capital: 'Accra',
    region: 'Africa'
  }
};

/**
 * Fetches country information by country code
 * @param countryCode ISO country code (e.g., 'KE' for Kenya)
 * @returns Promise with country information
 */
export async function getCountryInfo(countryCode: string): Promise<CountryInfo | null> {
  // Normalize country code to uppercase
  const normalizedCode = countryCode.toUpperCase();
  
  // Return from cache if available
  if (countryCache[normalizedCode]) {
    return countryCache[normalizedCode];
  }
  
  // Use fallback data if available instead of trying the API first
  if (fallbackCountryData[normalizedCode]) {
    console.log(`Using fallback data for ${normalizedCode}`);
    
    // Store in cache
    countryCache[normalizedCode] = fallbackCountryData[normalizedCode];
    
    return fallbackCountryData[normalizedCode];
  }
  
  try {
    // Only try the API if we don't have fallback data
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${normalizedCode}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch country data: ${response.status}`);
    }
    
    const data = await response.json();
    const country = data[0];
    
    if (!country) {
      throw new Error('Country data not found');
    }
    
    // Extract relevant information
    const countryInfo: CountryInfo = {
      name: country.name.common,
      code: normalizedCode,
      flag: country.flags.svg,
      currency: Object.keys(country.currencies)[0] || '',
      population: country.population,
      capital: country.capital?.[0] || '',
      region: country.region
    };
    
    // Store in cache
    countryCache[normalizedCode] = countryInfo;
    
    return countryInfo;
  } catch (error) {
    console.error('Error fetching country data:', error);
    
    // Create a basic entry if we get here (no fallback data was available)
    const basicCountryInfo: CountryInfo = {
      name: `Country ${normalizedCode}`,
      code: normalizedCode,
      flag: '',
      currency: '',
      population: 0,
      capital: '',
      region: ''
    };
    
    // Store in cache
    countryCache[normalizedCode] = basicCountryInfo;
    
    return basicCountryInfo;
  }
}

/**
 * Formats population number with commas
 * @param population Population number
 * @returns Formatted population string
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString();
} 