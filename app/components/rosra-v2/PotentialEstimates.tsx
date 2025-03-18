'use client';

import React, { useEffect, useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useAnalysis } from '../../context/AnalysisContext'
import { useEconomicData } from '../../hooks/useEconomicData'
import { Country, State } from '../../types/country'
import { EconomicData } from '../../types/economicData'
import { getExchangeRate, convertCurrency } from '@/app/services/currencyService'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import TopOSRConfigModal from './TopOSRConfigModal'
import { InputField } from '../ui/InputField';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { usePotentialEstimates } from '../../hooks/usePotentialEstimates';
import { useSession } from 'next-auth/react';

interface AnalysisInputs {
  financialYear: string
  country: string
  state: string
  currency: string
  actualOSR: string
  budgetedOSR: string
  gdp: string
  population: string
}

interface PotentialEstimatesProps {
  onInputChange: (inputs: AnalysisInputs) => void
  activeTab: string
}

interface EstimatesSectionProps {
  title: string;
  children: React.ReactNode;
}

const EstimatesSection: React.FC<EstimatesSectionProps> = ({ title, children }) => (
  <Card className="bg-white rounded-lg shadow p-6">
    <SectionTitle>{title}</SectionTitle>
    <div className="space-y-4">
      {children}
    </div>
  </Card>
);

export default function PotentialEstimates() {
  const { 
    selectedCountry, 
    setSelectedCountry,
    selectedState,
    setSelectedState,
    countries,
    states,
    defaultState 
  } = useCurrency();
  const { inputs, updateInputs } = useAnalysis();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const [isFormulaVisible, setIsFormulaVisible] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Use the economic data hook with inputs and updateInputs
  const { economicData, exchangeRate } = useEconomicData(
    selectedCountry || null, 
    selectedState, 
    defaultState,
    {
      ...inputs,
      onChange: (newInputs) => {
        updateInputs(newInputs);
      }
    }
  );

  const { data: session } = useSession();
  const { saveEstimate, loading: savingEstimate, error: saveError } = usePotentialEstimates();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper function to check if we have valid GDP data
  const hasValidGDPData = () => {
    return inputs.gdp && inputs.gdp !== '' && !isNaN(parseFloat(inputs.gdp));
  };

  const getGDPWarningMessage = () => {
    if (!hasValidGDPData()) {
      return `No GDP data available for ${inputs.financialYear}. Please enter manually or select a different year.`;
    }
    return '';
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.name === event.target.value);
    if (country) {
      setSelectedCountry(country);
      
      // When country changes, we need to update the state value as well
      // First get the default state for the new country
      const newStates = country.states || [];
      const newDefaultState = newStates.length > 0 ? newStates[0].name : 'Not specified';
      
      // Update the local state
      setSelectedState(newDefaultState);
      
      // Also update the Analysis context with the new state value
      updateInputs({ 
        state: newDefaultState,
        country: country.name
      });
      
      console.log(`Country changed to: ${country.name}, default state set to: ${newDefaultState}`);
    }
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stateValue = event.target.value;
    
    // Update local component state
    setSelectedState(stateValue);
    
    // Update the Analysis context with the state value
    // This ensures the state is saved with the report
    updateInputs({ 
      state: stateValue 
    });
    
    console.log(`State changed to: ${stateValue} for country: ${selectedCountry?.name}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateInputs({ [name]: value });
  };

  const formatValue = (value: string | number): string => {
    if (value === '' || value === undefined || value === null) return '';
    
    // Convert to string if it's a number
    const stringValue = value.toString();
    
    // Remove any existing commas first
    const numericValue = stringValue.replace(/[^0-9.-]/g, '');
    
    // Handle negative numbers
    const isNegative = numericValue.startsWith('-');
    const absValue = numericValue.replace('-', '');
    
    // Split into whole and decimal parts
    const parts = absValue.split('.');
    const wholeNumber = parts[0];
    const decimal = parts[1];

    // Add commas to whole number part
    const withCommas = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Return with decimal if it exists
    const formattedValue = decimal ? `${withCommas}.${decimal}` : withCommas;
    return isNegative ? `-${formattedValue}` : formattedValue;
  };

  const selectedYear = inputs.financialYear || '____';

  const calculateUNHabitatEstimate = (gdp: number): number => {
    return (gdp / 1500) * 50;
  }

  const calculatePercentageGap = (actualOSRPerCapita: number, unHabitatEstimate: number): number => {
    return (actualOSRPerCapita / unHabitatEstimate) * 100;
  }

  const getAllEstimatesChartData = () => {
    if (!hasValidGDPData() || !inputs.actualOSR || !inputs.population || !inputs.budgetedOSR) return []
    
    const gdp = parseFloat(inputs.gdp)
    const actualOSR = parseFloat(inputs.actualOSR)
    const budgetedOSR = parseFloat(inputs.budgetedOSR)
    const population = parseFloat(inputs.population)
    
    if (
      isNaN(gdp) || 
      isNaN(actualOSR) || 
      isNaN(budgetedOSR) || 
      isNaN(population) || 
      population === 0
    ) return []

    // Calculate all values
    const actualPerCapita = actualOSR / population
    const budgetedPerCapita = budgetedOSR / population
   
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)

    // Create data array
    return [
      {
        name: 'Actual OSR\nper capita',
        value: actualPerCapita
      },
      {
        name: 'Budgeted OSR\nper capita',
        value: budgetedPerCapita
      },
      {
        name: 'OSR Potential\nUN-Habitat',
        value: unHabitatEstimate
      }
    ]
  }

  const calculateOSRPerCapita = () => {
    if (!inputs.actualOSR || !inputs.population) return 'N/A'
    const osr = parseFloat(inputs.actualOSR)
    const pop = parseFloat(inputs.population)
    if (isNaN(osr) || isNaN(pop) || pop === 0) return 'N/A'
    
    const osrPerCapita = osr / pop
    const currencySymbol = selectedCountry?.currency_symbol || ''
    
    return `${currencySymbol}${formatValue(osrPerCapita)}`
  }

  const calculateBudgetedOSRPerCapita = () => {
    if (!inputs.budgetedOSR || !inputs.population) return 'N/A'
    const budgetedOSR = parseFloat(inputs.budgetedOSR)
    const pop = parseFloat(inputs.population)
    if (isNaN(budgetedOSR) || isNaN(pop) || pop === 0) return 'N/A'
    
    const budgetedOSRPerCapita = budgetedOSR / pop
    const currencySymbol = selectedCountry?.currency_symbol || ''
    
    return `${currencySymbol}${formatValue(budgetedOSRPerCapita)}`
  }

  const calculateUNHEstimateRevenueGap = () => {
    if (!inputs.gdp || !inputs.actualOSR || !inputs.population) return 'N/A'
    
    const gdp = parseFloat(inputs.gdp)
    const actualOSR = parseFloat(inputs.actualOSR)
    const population = parseFloat(inputs.population)
    
    if (isNaN(gdp) || isNaN(actualOSR) || isNaN(population) || gdp === 0 || population === 0) return 'N/A'
    
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)
    
    // Calculate actual OSR per capita
    const actualOSRPerCapita = actualOSR / population
    
    // Calculate the gap
    const gap = unHabitatEstimate - actualOSRPerCapita
    
    return gap > 0 ? gap : 0
  }

  const calculateOSRPotentialUNHabitat = () => {
    if (!inputs.gdp) return 'N/A'
    
    const gdp = parseFloat(inputs.gdp)
    if (isNaN(gdp) || gdp === 0) return 'N/A'
    
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)
    const currencySymbol = selectedCountry?.currency_symbol || ''
    
    return `${currencySymbol}${formatValue(unHabitatEstimate)}`
  }

  const getPercentageGapText = () => {
    if (!inputs.gdp || !inputs.actualOSR || !inputs.population) return 'N/A'
    
    const gdp = parseFloat(inputs.gdp)
    const actualOSR = parseFloat(inputs.actualOSR)
    const population = parseFloat(inputs.population)
    
    if (isNaN(gdp) || isNaN(actualOSR) || isNaN(population) || gdp === 0 || population === 0) return 'N/A'
    
    const actualOSRPerCapita = actualOSR / population
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)
    const percentageGap = calculatePercentageGap(actualOSRPerCapita, unHabitatEstimate)
    
    return `${percentageGap.toFixed(1)}%`
  }

  const getAnalysisText = () => {
    if (!inputs.gdp || !inputs.actualOSR || !inputs.population) return ''
    
    const gdp = parseFloat(inputs.gdp)
    const actualOSR = parseFloat(inputs.actualOSR)
    const population = parseFloat(inputs.population)
    
    if (
      isNaN(gdp) || 
      isNaN(actualOSR) || 
      isNaN(population) || 
      gdp === 0 || 
      population === 0
    ) return ''
    
    const actualOSRPerCapita = actualOSR / population
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)
    const percentageGap = calculatePercentageGap(actualOSRPerCapita, unHabitatEstimate) / 100
    
    if (percentageGap < 0.3) {
      return 'Your OSR collection is significantly below potential. Consider reviewing your revenue policies and collection methods.';
    } else if (percentageGap < 0.6) {
      return 'Your OSR collection shows room for improvement. Focus on strengthening existing revenue streams.';
    } else if (percentageGap < 0.9) {
      return 'Your OSR collection is good but could be optimized further.';
    } else {
      return 'Your OSR collection is very strong, meeting or exceeding estimates.';
    }
  }

  const getGapChartData = () => {
    if (!inputs.gdp || !inputs.actualOSR || !inputs.population) return []
    
    const gdp = parseFloat(inputs.gdp)
    const actualOSR = parseFloat(inputs.actualOSR)
    const population = parseFloat(inputs.population)
    
    if (isNaN(gdp) || isNaN(actualOSR) || isNaN(population) || population === 0) return []
    
    const actualOSRPerCapita = actualOSR / population
    const unHabitatEstimate = calculateUNHabitatEstimate(gdp)
    const revenueGap = unHabitatEstimate - actualOSRPerCapita
    
    return [{
      name: 'OSR Gap Analysis',
      'Actual OSR Per Capita': actualOSRPerCapita,
      'Revenue Gap': revenueGap > 0 ? revenueGap : 0
    }]
  }

  const handleSaveEstimate = async () => {
    if (!session) {
      alert('Please sign in to save estimates');
      return;
    }

    if (!inputs.actualOSR || !inputs.budgetedOSR || !inputs.population || !inputs.gdp) {
      alert('Please fill in all required fields');
      return;
    }

    setSaveSuccess(false);

    try {
      // Determine the state value to use, prioritizing the one in the Analysis context
      const stateToUse = inputs.state || selectedState || defaultState || 'Not specified';
      
      // Make sure we have the correct country code
      const countryCode = selectedCountry?.iso2 || selectedCountry?.iso3 || '';
      console.log('Country code being used:', countryCode, 'for country:', selectedCountry?.name);
      
      const estimateData = {
        country: selectedCountry?.name || '',
        countryCode: countryCode,
        state: stateToUse,
        financialYear: inputs.financialYear,
        currency: selectedCountry?.currency || '',
        currencySymbol: selectedCountry?.currency_symbol || '',
        actualOSR: inputs.actualOSR,
        budgetedOSR: inputs.budgetedOSR,
        population: inputs.population,
        gdpPerCapita: inputs.gdp,
      };

      // Log the data being sent
      console.log('Saving estimate with data:', JSON.stringify(estimateData, null, 2));
      console.log(`State being saved: ${stateToUse} for country: ${selectedCountry?.name}`);

      const result = await saveEstimate(estimateData);
      
      if (result) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
    }
  };

  useEffect(() => {
    if (!inputs.financialYear) {
      updateInputs({ financialYear: '2019' });
    }
  }, []);

  // Initialize selectedState from Analysis context only on initial load
  useEffect(() => {
    // Only set the state from context if we don't already have a selected state
    // This prevents overriding the state when the country changes
    if (inputs.state && !selectedState) {
      setSelectedState(inputs.state);
      console.log(`Initialized state from context: ${inputs.state}`);
    }
  }, [inputs.state, selectedState]);

  return (
    <div className="space-y-4">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - 1/3 */}
        <div className="lg:w-1/3 space-y-6">
          {/* Inputs & Analysis Section */}
          <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            
            <div className="space-y-6">
              {/* Location Selection Group */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2">
                  Location Details
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {/* Country Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Country
                    </label>
                    <select
                      value={selectedCountry?.name || ''}
                      onChange={handleCountryChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        sm:text-sm rounded-md"
                    >
                      {countries.map((country) => (
                        <option key={country.iso3} value={country.name}>
                          {country.name} ({country.iso3})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State/Region Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      State/Region in {selectedCountry?.name || 'Country'}
                    </label>
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        sm:text-sm rounded-md"
                    >
                      {states.map((state) => (
                        <option key={state.id} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Select a state or region within {selectedCountry?.name || 'the selected country'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time and Currency Group */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2">
                  Time Period & Currency
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {/* Year Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Financial Year
                    </label>
                    <select
                      name="financialYear"
                      value={inputs.financialYear}
                      onChange={(e) => {
                        updateInputs({ financialYear: e.target.value });
                      }}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        sm:text-sm rounded-md"
                    >
                      {Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => {
                        const year = 2010 + i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      }).reverse()}
                    </select>
                  </div>

                  {/* Currency Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Currency
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={`${selectedCountry?.currency || 'KES'} - ${selectedCountry?.currency_name || 'Kenyan shilling'} (${selectedCountry?.currency_symbol || 'KSh'})`}
                        disabled
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base 
                          border-gray-300 dark:border-gray-600
                          bg-gray-100 dark:bg-gray-600 
                          text-gray-700 dark:text-gray-300
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                          sm:text-sm rounded-md cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Data Group */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2">
                  Financial Data
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Actual OSR in {selectedYear}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        {currencySymbol}
                      </span>
                      <input
                        type="text"
                        name="actualOSR"
                        value={formatValue(inputs.actualOSR)}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-2 rounded-lg 
                          border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-blue-500 
                          placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Enter actual OSR"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Budgeted OSR in {selectedYear}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        {currencySymbol}
                      </span>
                      <input
                        type="text"
                        name="budgetedOSR"
                        value={formatValue(inputs.budgetedOSR)}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-2 rounded-lg 
                          border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-blue-500 
                          placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Enter budgeted OSR"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Population in {selectedYear}
                    </label>
                    <input
                      type="text"
                      name="population"
                      value={formatValue(inputs.population)}
                      onChange={handleInputChange}
                      placeholder="Enter population"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      GDP per capita in {selectedYear}
                    </label>
                    <div className="mt-1 relative">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                          {currencySymbol}
                        </span>
                        <input
                          type="text"
                          name="gdp"
                          value={inputs.gdp || ''}
                          onChange={handleInputChange}
                          placeholder="Enter GDP per capita"
                          className="mt-1 block w-full pl-12 pr-3 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        />
                      </div>
                      {!hasValidGDPData() && (
                        <p className="mt-1 text-sm text-yellow-600">
                          {getGDPWarningMessage()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - 2/3 */}
        <div className="lg:w-2/3 space-y-6">
          {/* Charts Container */}
          <div className="space-y-6">
            {/* Rapid Estimate of OSR Gap Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400 text-center mb-3">
                Rapid Estimate of OSR Gap
              </h4>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getGapChartData()}
                    margin={{
                      top: 20,
                      right: 80,
                      left: 80,
                      bottom: 5,
                    }}
                    barSize={400}
                    maxBarSize={600}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                      height={60}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      label={{ 
                        value: `${selectedCountry?.currency_symbol || '$'} per capita`,
                        angle: -90,
                        position: 'insideLeft',
                        offset: -35,
                        style: { fill: '#6B7280' }
                      }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                      tick={{ fill: '#6B7280' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value: number) => [
                        `${selectedCountry?.currency_symbol || '$'}${formatValue(value)}`,
                        value === 0 ? 'No Gap' : ''
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar 
                      dataKey="Actual OSR Per Capita" 
                      stackId="a" 
                      fill="#60A5FA"  // Using a blue similar to the image
                      name="Actual OSR Per Capita"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="Revenue Gap" 
                      stackId="a" 
                      fill="#F97316"  // Using an orange similar to the image
                      name="Revenue Gap"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
             
              {/* Formula Section */}
              <div className="mt-8">
                <button
                  onClick={() => setIsFormulaVisible(!isFormulaVisible)}
                  className="w-full flex items-center justify-between p-4 
                    bg-white dark:bg-gray-700 
                    rounded-t-xl border border-gray-200 dark:border-gray-600 
                    hover:bg-gray-50 dark:hover:bg-gray-600 
                    transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Rapid Estimate Formula
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      isFormulaVisible ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isFormulaVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-6 bg-white dark:bg-gray-700 rounded-b-xl border-x border-b border-gray-200 dark:border-gray-600">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h5 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            UN-Habitat Top-down Estimate:
                          </h5>
                          <div className="flex items-center gap-2 text-sm">
                            <code className="text-blue-500 dark:text-blue-400">
                              OSR Potential = (GDP per capita / 1500) × 50
                            </code>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            This formula is based on UN-Habitat's methodology for estimating potential OSR.
                            It suggests that a local government should be able to collect approximately 3.33% of GDP per capita.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Text Section */}
              <div className="mt-8">
              <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Gap Analysis
                  </h4>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                 
                  <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed">
                    {getAnalysisText() || 'Please enter all required data to see the analysis.'}
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </div>
    </div>
    {/* Add exchange rate footer */}
    {exchangeRate && selectedCountry && (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} {selectedCountry.currency}</span>
        </div>
        <div className="text-center text-xs mt-1 text-gray-500 dark:text-gray-400">
          Data from exchangerate-api.com
        </div>
      </div>
    )}
  </div>
  )
}