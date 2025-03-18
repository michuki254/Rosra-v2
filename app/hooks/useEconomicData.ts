'use client';

import { useState, useEffect } from 'react';
import { getExchangeRate } from '../services/currencyService';
import { Country } from '../types/country';
import { useAnalysis } from '../context/AnalysisContext';

interface EconomicData {
  [key: string]: string | number;
}

interface EconomicInputs {
  financialYear?: string;
  country?: string;
  state?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  gdp?: string;
  gdpYear?: string;
  gdpSource?: string;
  onChange?: (inputs: any) => void;
}

export const useEconomicData = (
  selectedCountry: Country | null, 
  selectedState: string | null, 
  defaultState: string, 
  inputs: EconomicInputs = {}
) => {
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const updateInputs = (newInputs: any) => {
    if (typeof inputs.onChange === 'function') {
      inputs.onChange(newInputs);
    }
  };

  useEffect(() => {
    async function fetchEconomicData() {
      if (selectedCountry) {
        try {
          console.log('Fetching data for country:', selectedCountry.name, 'ISO3:', selectedCountry.iso3);
          
          // Load economic data from JSON
          const response = await fetch('/economic-data.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch economic data: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          
          // Find all entries for the country using ISO3 code
          const countryEntries = data.filter((country: any) => country['Country Code'] === selectedCountry.iso3);
          console.log('Found country entries:', countryEntries.length);

          // Merge all entries into a single object, taking the first non-empty value for each field
          const countryData = countryEntries.reduce((merged: any, entry: any) => {
            Object.keys(entry).forEach(key => {
              if (!merged[key] || (merged[key] === '' && entry[key] !== '')) {
                merged[key] = entry[key];
              }
            });
            return merged;
          }, {});

          setEconomicData(countryData);

          // Update basic country data first
          const baseInputs = {
            ...inputs,
            country: selectedCountry.name,
            currency: selectedCountry.currency || 'KES',
            currency_name: selectedCountry.currency_name || 'Kenyan shilling',
            currency_symbol: selectedCountry.currency_symbol || 'KSh',
            state: selectedState || defaultState
          };

          // Handle GDP data if country data exists
          if (countryData) {
            console.log('Found merged country data:', countryData);
            
            // Get GDP for selected year
            const selectedYear = inputs.financialYear || '2019';
            const gdpKey = `GDP/capita ${selectedYear}`;
            let gdpValue = countryData[gdpKey];
            let yearUsed = selectedYear;

            // Fallback to 2019 if selected year data not available
            if ((!gdpValue || gdpValue === '') && selectedYear !== '2019') {
              const gdp2019Key = 'GDP/capita 2019';
              gdpValue = countryData[gdp2019Key];
              yearUsed = '2019';
              console.log('Using 2019 GDP data as fallback');
            }

            if (gdpValue && gdpValue !== '' && !isNaN(parseFloat(gdpValue))) {
              const gdpUSD = parseFloat(gdpValue);
              console.log(`Found GDP for year ${yearUsed}: ${gdpUSD} USD`);

              try {
                // Convert GDP from USD to local currency
                const rate = await getExchangeRate('USD', selectedCountry.currency || 'KES');
                console.log(`Exchange rate: ${rate}`);
                setExchangeRate(rate);
                
                const gdpInLocal = gdpUSD * rate;
                const newInputs = {
                  ...inputs,
                  gdp: gdpInLocal.toFixed(2),
                  gdpYear: yearUsed,
                  gdpSource: yearUsed === selectedYear ? 'exact' : 'fallback'
                };
                console.log('Updating inputs with:', newInputs);
                updateInputs(newInputs);
              } catch (error) {
                console.error('Error converting GDP:', error);
                setExchangeRate(null);
                // Use USD value if conversion fails
                const newInputs = {
                  ...inputs,
                  gdp: gdpUSD.toFixed(2),
                  gdpYear: yearUsed,
                  gdpSource: yearUsed === selectedYear ? 'exact' : 'fallback'
                };
                console.log('Updating inputs with USD value:', newInputs);
                updateInputs(newInputs);
              }
            } else {
              console.log(`No GDP data found for year ${selectedYear}`);
              const newInputs = {
                ...inputs,
                gdp: '',
                gdpYear: '',
                gdpSource: 'none'
              };
              console.log('Updating inputs with no GDP data:', newInputs);
              updateInputs(newInputs);
            }
          } else {
            console.log('No country data found');
            const newInputs = {
              ...inputs,
              gdp: '',
              gdpYear: '',
              gdpSource: 'none'
            };
            console.log('Updating inputs with no country data:', newInputs);
            updateInputs(newInputs);
          }
        } catch (error) {
          console.error('Error fetching economic data:', error);
          setEconomicData(null);
          const newInputs = {
            ...inputs,
            gdp: '',
            gdpYear: '',
            gdpSource: 'none'
          };
          console.log('Updating inputs with error:', newInputs);
          updateInputs(newInputs);
        }
      }
    }

    fetchEconomicData();
  }, [selectedCountry, selectedState, defaultState, inputs?.financialYear]);

  return {
    economicData,
    exchangeRate
  };
};
