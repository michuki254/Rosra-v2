'use client';

import React from 'react';

interface BasicInformationProps {
  selectedFinancialYear: string;
  handleFinancialYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  financialYears: string[];
  selectedCountry: string;
  handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  countries: any[];
  isLoading: boolean;
  fallbackCountries: any[];
  selectedState: string;
  handleStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  states: any[];
  fallbackStates: any[];
  selectedCurrency: string;
  handleCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currencies: any[];
  fallbackCurrencies: any[];
  error: string | null;
}

export default function BasicInformation({
  selectedFinancialYear,
  handleFinancialYearChange,
  financialYears,
  selectedCountry,
  handleCountryChange,
  countries,
  isLoading,
  fallbackCountries,
  selectedState,
  handleStateChange,
  states,
  fallbackStates,
  selectedCurrency,
  handleCurrencyChange,
  currencies,
  fallbackCurrencies,
  error
}: BasicInformationProps) {
  return (
    <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
      <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-6">
        Basic Information
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading data: {error}. Using fallback options.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Financial Year Ending in
          </label>
          <div className="relative">
            <select 
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedFinancialYear}
              onChange={handleFinancialYearChange}
            >
              {financialYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <div className="relative">
            <select 
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={isLoading}
            >
              {isLoading ? (
                <option>Loading countries...</option>
              ) : countries.length > 0 ? (
                countries.map((country) => (
                  <option key={country.iso2} value={country.name}>
                    {country.name}
                  </option>
                ))
              ) : (
                fallbackCountries.map((country) => (
                  <option key={country.iso2} value={country.name}>
                    {country.name}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State or Province
          </label>
          <div className="relative">
            <select
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedState}
              onChange={handleStateChange}
              disabled={isLoading}
            >
              {isLoading ? (
                <option>Loading states...</option>
              ) : states.length > 0 ? (
                states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))
              ) : (
                fallbackStates.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency
          </label>
          <div className="relative">
            <select 
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              disabled={isLoading}
            >
              {isLoading ? (
                <option>Loading currencies...</option>
              ) : currencies.length > 0 ? (
                currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))
              ) : (
                fallbackCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 