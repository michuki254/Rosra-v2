'use client';

import { useState, useEffect } from 'react';
import { Country, EconomicData } from '../types';

// Sample fallback data in case fetch fails
const sampleCountriesData: Country[] = [
  {
    name: "Kenya",
    iso2: "KE",
    currency: "KES",
    currency_name: "Kenyan shilling",
    currency_symbol: "KSh",
    states: [
      { id: 'ke-1', name: "Nairobi City", state_code: "30", type: "County" },
      { id: 'ke-2', name: "Mombasa", state_code: "01", type: "County" },
      { id: 'ke-3', name: "Kisumu", state_code: "02", type: "County" }
    ]
  },
  {
    name: "Uganda",
    iso2: "UG",
    currency: "UGX",
    currency_name: "Ugandan shilling",
    currency_symbol: "USh",
    states: [
      { id: 'ug-1', name: "Kampala", state_code: "KMP", type: "District" },
      { id: 'ug-2', name: "Wakiso", state_code: "WAK", type: "District" }
    ]
  }
];

export function useCountryData() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("Kenya");
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("Nairobi City");
  const [currencies, setCurrencies] = useState<{code: string, name: string}[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("KES");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to use sample data as fallback
  const useSampleDataFallback = () => {
    console.log('Using sample fallback data');
    setCountries(sampleCountriesData);
    
    // Extract currencies from sample data
    const currencyCodes = Array.from(
      new Set(sampleCountriesData.map(country => country.currency))
    ) as string[];
    
    const uniqueCurrencies = currencyCodes.map(code => {
      const country = sampleCountriesData.find(c => c.currency === code);
      return {
        code,
        name: country ? `${code} - ${country.currency_name}` : code
      };
    });
    
    setCurrencies(uniqueCurrencies);
    
    // Set initial states for Kenya from sample data
    const kenya = sampleCountriesData.find(country => country.name === "Kenya");
    if (kenya) {
      setStates(kenya.states);
    }
  };

  useEffect(() => {
    // Fetch countries data
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Attempting to fetch countries data from /data/countries.json');
        
        // In Next.js, static files should be in the public directory
        // and referenced from the root
        const response = await fetch('/data/countries.json', {
          // Add cache control to prevent caching issues
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
        }
        
        let data;
        try {
          data = await response.json();
          console.log('Fetched countries data successfully:', data.length, 'countries');
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          throw new Error('Failed to parse countries data as JSON');
        }
        
        // Log the structure of the first country to help debug
        if (data.length > 0) {
          console.log('First country structure:', JSON.stringify(data[0], null, 2));
        }
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Countries data is empty or not in expected format');
        }
        
        setCountries(data);
        
        // Extract unique currencies
        const currencyCodes = Array.from(
          new Set(data.map((country: Country) => country.currency))
        ) as string[];
        
        console.log('Extracted currency codes:', currencyCodes.length);
        
        const uniqueCurrencies = currencyCodes.map(code => {
          const country = data.find((c: Country) => c.currency === code);
          return {
            code,
            name: country ? `${code} - ${country.currency_name}` : code
          };
        });
        
        setCurrencies(uniqueCurrencies);
        
        // Set initial states for Kenya
        const kenya = data.find((country: Country) => country.name === "Kenya");
        if (kenya) {
          console.log('Found Kenya:', kenya.name, 'with', kenya.states.length, 'states');
          setStates(kenya.states);
        } else {
          console.log('Kenya not found in countries data');
          // Fallback to first country if Kenya not found
          if (data.length > 0) {
            setSelectedCountry(data[0].name);
            setStates(data[0].states || []);
            setSelectedCurrency(data[0].currency);
          } else {
            // If no countries found at all, use sample data
            useSampleDataFallback();
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError(error instanceof Error ? error.message : 'Unknown error fetching countries');
        useSampleDataFallback();
      } finally {
        setIsLoading(false);
      }
    };
    
    console.log('useCountryData hook initialized');
    fetchCountries();
    
    // Cleanup function
    return () => {
      console.log('useCountryData hook cleanup');
    };
  }, []);

  // Update states when country changes
  useEffect(() => {
    // Update states
    const country = countries.find(c => c.name === selectedCountry);
    if (country) {
      setStates(country.states || []);
      setSelectedCurrency(country.currency);
      
      // Reset selected state if not available in new country
      if (!country.states || !country.states.some(state => state.name === selectedState)) {
        setSelectedState(country.states && country.states.length > 0 ? country.states[0].name : "");
      }
    }
  }, [selectedCountry, countries, selectedState]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  // Fallback options for when data is loading
  const fallbackCountries = [{ name: "Kenya", iso2: "KE" }];
  const fallbackStates = [{ id: 'ke-1', name: "Nairobi City", state_code: "30" }];
  const fallbackCurrencies = [{ code: "KES", name: "KES - Kenyan shilling" }];

  return {
    countries,
    selectedCountry,
    states,
    selectedState,
    currencies,
    selectedCurrency,
    isLoading,
    error,
    handleCountryChange,
    handleStateChange,
    handleCurrencyChange,
    fallbackCountries,
    fallbackStates,
    fallbackCurrencies
  };
} 