'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Country } from '../types/country';
import { getCountries } from '../services/countryService';

interface CurrencyContextType {
  selectedCountry: Country | undefined;
  setSelectedCountry: (country: Country | undefined) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  getExchangeRate: (currencyCode: string) => number;
  defaultState: string;
  countries: Country[];
  states: { id: number; name: string; state_code: string }[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [selectedState, setSelectedState] = useState<string>('Nairobi City');
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<{ id: number; name: string; state_code: string }[]>([]);
  const defaultState = 'Nairobi City';

  // Load countries on mount
  useEffect(() => {
    async function loadCountries() {
      const allCountries = await getCountries();
      setCountries(allCountries);
      
      // Set default country to Kenya
      const kenya = allCountries.find(country => country.iso3 === 'KEN');
      if (kenya) {
        setSelectedCountry(kenya);
        // Set states for Kenya
        if (kenya.states) {
          setStates(kenya.states);
        }
      }
    }
    loadCountries();
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry?.states) {
      setStates(selectedCountry.states);
      // Set default state for the selected country
      if (selectedCountry.iso3 === 'KEN') {
        setSelectedState('Nairobi City');
      } else {
        // Set first state as default for other countries
        setSelectedState(selectedCountry.states[0]?.name || '');
      }
    } else {
      setStates([]);
      setSelectedState('');
    }
  }, [selectedCountry]);

  const getExchangeRate = (currencyCode: string): number => {
    // This is a simplified version - you might want to fetch real exchange rates
    if (currencyCode === 'KES') return 150;
    if (currencyCode === 'USD') return 1;
    return 1;
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        selectedCountry, 
        setSelectedCountry, 
        selectedState,
        setSelectedState,
        getExchangeRate, 
        defaultState,
        countries,
        states
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
