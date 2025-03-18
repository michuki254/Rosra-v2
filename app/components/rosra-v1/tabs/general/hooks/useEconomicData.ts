'use client';

import { useState, useEffect, useRef } from 'react';
import { EconomicData } from '../types';

// Sample fallback economic data
const sampleEconomicData: EconomicData[] = [
  {
    country: "Kenya",
    iso2: "KE",
    years: {
      "2016": {
        "GDP/capita": 1500,
        "Population": 100000,
        "Average Household size": 5
      },
      "2017": {
        "GDP/capita": 1550,
        "Population": 102000,
        "Average Household size": 5
      },
      "2018": {
        "GDP/capita": 1600,
        "Population": 104000,
        "Average Household size": 5
      },
      "2019": {
        "GDP/capita": 1650,
        "Population": 106000,
        "Average Household size": 5
      },
      "2020": {
        "GDP/capita": 1700,
        "Population": 108000,
        "Average Household size": 5
      }
    }
  },
  {
    country: "Uganda",
    iso2: "UG",
    years: {
      "2016": {
        "GDP/capita": 800,
        "Population": 80000,
        "Average Household size": 6
      },
      "2017": {
        "GDP/capita": 820,
        "Population": 81000,
        "Average Household size": 6
      },
      "2018": {
        "GDP/capita": 840,
        "Population": 82000,
        "Average Household size": 6
      },
      "2019": {
        "GDP/capita": 860,
        "Population": 83000,
        "Average Household size": 6
      },
      "2020": {
        "GDP/capita": 880,
        "Population": 84000,
        "Average Household size": 6
      }
    }
  }
];

// Function to generate sample data for any year
const generateSampleDataForYear = (country: string, year: string): any => {
  const yearNum = parseInt(year);
  if (country === "Kenya") {
    return {
      "GDP/capita": 1500 + (yearNum - 2016) * 50,
      "Population": 100000 + (yearNum - 2016) * 2000,
      "Average Household size": 5
    };
  } else if (country === "Uganda") {
    return {
      "GDP/capita": 800 + (yearNum - 2016) * 20,
      "Population": 80000 + (yearNum - 2016) * 1000,
      "Average Household size": 6
    };
  }
  return {
    "GDP/capita": 1000,
    "Population": 50000,
    "Average Household size": 4
  };
};

// Function to ensure sample data has all required years
const ensureSampleDataHasYears = (data: EconomicData[], years: string[]): EconomicData[] => {
  return data.map(country => {
    const updatedYears = { ...country.years };
    
    years.forEach(year => {
      if (!updatedYears[year]) {
        updatedYears[year] = generateSampleDataForYear(country.country, year);
      }
    });
    
    return {
      ...country,
      years: updatedYears
    };
  });
};

export function useEconomicData(selectedCountry: string) {
  // Use refs to track previous values to prevent unnecessary re-renders
  const prevSelectedCountryRef = useRef<string>(selectedCountry);
  const prevTableYearsRef = useRef<string[]>([]);
  
  // Initialize with sample data and set loading to false initially
  const [economicData, setEconomicData] = useState<EconomicData[]>(() => {
    // Initialize with sample data that already has years for 2016-2020
    return sampleEconomicData;
  });
  
  const [selectedCountryEconomicData, setSelectedCountryEconomicData] = useState<EconomicData | null>(() => {
    // Find the initial country data
    return sampleEconomicData.find(data => data.country === selectedCountry) || null;
  });
  
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("2020");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);

  // Generate financial years from 2010 to 2025
  const financialYears = Array.from({ length: 16 }, (_, i) => (2010 + i).toString());
  
  // Get 5 years for the table, ending with the selected financial year
  const getTableYears = () => {
    const endYear = parseInt(selectedFinancialYear);
    return Array.from({ length: 5 }, (_, i) => (endYear - 4 + i).toString());
  };
  
  const tableYears = getTableYears();

  // Initial data setup - runs only once
  useEffect(() => {
    if (!dataInitialized) {
      console.log('Initial data setup');
      const updatedSampleData = ensureSampleDataHasYears(sampleEconomicData, tableYears);
      setEconomicData(updatedSampleData);
      
      const countryData = updatedSampleData.find(data => data.country === selectedCountry);
      if (countryData) {
        setSelectedCountryEconomicData(countryData);
      }
      setDataInitialized(true);
    }
  }, [dataInitialized]);

  // Update table years when financial year changes
  useEffect(() => {
    if (dataInitialized) {
      console.log('Financial year changed, updating table years');
      // Store current table years for comparison
      prevTableYearsRef.current = tableYears;
      
      // Update economic data with new years if needed
      const updatedData = ensureSampleDataHasYears(economicData, tableYears);
      setEconomicData(updatedData);
      
      // Update selected country data
      const countryData = updatedData.find(data => data.country === selectedCountry);
      if (countryData) {
        setSelectedCountryEconomicData(countryData);
      }
    }
  }, [selectedFinancialYear, dataInitialized]);

  // Handle country change
  useEffect(() => {
    if (dataInitialized && selectedCountry !== prevSelectedCountryRef.current) {
      console.log('Country changed from', prevSelectedCountryRef.current, 'to', selectedCountry);
      prevSelectedCountryRef.current = selectedCountry;
      
      // Find the country in existing data
      const countryData = economicData.find(data => data.country === selectedCountry);
      if (countryData) {
        setSelectedCountryEconomicData(countryData);
      } else {
        // Create new country data if not found
        const newCountryData: EconomicData = {
          country: selectedCountry,
          iso2: selectedCountry.substring(0, 2).toUpperCase(),
          years: tableYears.reduce((acc, year) => {
            acc[year] = generateSampleDataForYear(selectedCountry, year);
            return acc;
          }, {} as Record<string, any>)
        };
        
        setSelectedCountryEconomicData(newCountryData);
        setEconomicData(prev => [...prev, newCountryData]);
      }
    }
  }, [selectedCountry, dataInitialized, economicData]);

  const handleFinancialYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFinancialYear(e.target.value);
  };

  // Fetch data from API - only runs once on initial mount
  useEffect(() => {
    // Fetch economic data
    const fetchEconomicData = async () => {
      // Skip if we've already initialized data
      if (dataInitialized) return;
      
      try {
        setIsLoading(true);
        console.log('Attempting to fetch economic data from /data/economic-data.json');
        
        const response = await fetch('/data/economic-data.json', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch economic data: ${response.status} ${response.statusText}`);
        }
        
        let data;
        try {
          data = await response.json();
          console.log('Fetched economic data successfully:', data.length, 'countries');
        } catch (jsonError) {
          console.error('Error parsing economic data JSON:', jsonError);
          throw new Error('Failed to parse economic data as JSON');
        }
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Economic data is empty or not in expected format');
        }
        
        // Log the structure of the first economic data entry to help debug
        if (data.length > 0) {
          console.log('First economic data structure:', JSON.stringify(data[0], null, 2));
        }
        
        // Ensure the data has all the years we need
        const updatedData = ensureSampleDataHasYears(data, tableYears);
        setEconomicData(updatedData);
        
        // Set initial economic data for selected country
        const countryEconomicData = updatedData.find((item: EconomicData) => item.country === selectedCountry);
        if (countryEconomicData) {
          setSelectedCountryEconomicData(countryEconomicData);
        }
      } catch (error) {
        console.error("Error fetching economic data:", error);
        setError(error instanceof Error ? error.message : 'Unknown error fetching economic data');
        // Use sample economic data as fallback
        const updatedSampleData = ensureSampleDataHasYears(sampleEconomicData, tableYears);
        setEconomicData(updatedSampleData);
        
        // Set initial economic data for selected country from sample
        const countryEconomicData = updatedSampleData.find(data => data.country === selectedCountry);
        if (countryEconomicData) {
          setSelectedCountryEconomicData(countryEconomicData);
        }
      } finally {
        // Always set loading to false when done
        setIsLoading(false);
        setDataInitialized(true);
        console.log('Finished loading economic data, isLoading set to false');
      }
    };
    
    console.log('useEconomicData hook initialized');
    fetchEconomicData();
    
    // Cleanup function
    return () => {
      console.log('useEconomicData hook cleanup');
    };
  }, []); // Empty dependency array - only run once on mount

  // Function to update economic data
  const updateEconomicData = (row: string, year: string, value: number) => {
    if (selectedCountryEconomicData) {
      // Create a deep copy of the selected country's economic data
      const updatedEconomicData = JSON.parse(JSON.stringify(selectedCountryEconomicData));
      
      // Ensure the year exists in the data
      if (!updatedEconomicData.years[year]) {
        updatedEconomicData.years[year] = {
          "GDP/capita": 0,
          "Population": 0,
          "Average Household size": 0
        };
      }
      
      // Update the specific value
      updatedEconomicData.years[year][row as keyof typeof updatedEconomicData.years[typeof year]] = value;
      
      // Update the economic data in the state
      setSelectedCountryEconomicData(updatedEconomicData);
      
      // Also update the main economic data array
      setEconomicData(prev => 
        prev.map(country => 
          country.country === selectedCountry ? updatedEconomicData : country
        )
      );
    }
  };

  return {
    economicData,
    selectedCountryEconomicData,
    selectedFinancialYear,
    isLoading,
    error,
    financialYears,
    tableYears,
    handleFinancialYearChange,
    updateEconomicData
  };
} 