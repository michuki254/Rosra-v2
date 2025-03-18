'use client';

import React, { useEffect, useRef } from 'react';
import { useCountryData } from './hooks/useCountryData';
import { useEconomicData } from './hooks/useEconomicData';
import BasicInformation from './components/BasicInformation';
import StatisticsTable from './components/StatisticsTable';
import MetricsCards from './components/MetricsCards';

export default function GeneralTab() {
  // Get country data from custom hook
  const countryData = useCountryData();
  
  // Get economic data from custom hook, passing the selected country
  const economicData = useEconomicData(countryData.selectedCountry);
  
  // Use refs to track previous values
  const prevCountryLoadingRef = useRef<boolean>(countryData.isLoading);
  const prevEconomicLoadingRef = useRef<boolean>(economicData.isLoading);
  const prevEconomicDataRef = useRef(economicData.selectedCountryEconomicData);

  // Debug logging - only log when values actually change
  useEffect(() => {
    const countryLoadingChanged = countryData.isLoading !== prevCountryLoadingRef.current;
    const economicLoadingChanged = economicData.isLoading !== prevEconomicLoadingRef.current;
    const economicDataChanged = economicData.selectedCountryEconomicData !== prevEconomicDataRef.current;
    
    if (countryLoadingChanged || economicLoadingChanged || economicDataChanged) {
      // Update refs
      prevCountryLoadingRef.current = countryData.isLoading;
      prevEconomicLoadingRef.current = economicData.isLoading;
      prevEconomicDataRef.current = economicData.selectedCountryEconomicData;
      
      // Only log if something changed
      console.log('GeneralTab: Country data loading state:', countryData.isLoading);
      console.log('GeneralTab: Economic data loading state:', economicData.isLoading);
      
      if (economicDataChanged) {
        console.log('GeneralTab: Selected country economic data changed');
      }
    }
  }, [countryData.isLoading, economicData.isLoading, economicData.selectedCountryEconomicData]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
        General Overview
      </h2>
      
      {/* Basic Information Section */}
      <BasicInformation
        selectedFinancialYear={economicData.selectedFinancialYear}
        handleFinancialYearChange={economicData.handleFinancialYearChange}
        financialYears={economicData.financialYears}
        selectedCountry={countryData.selectedCountry}
        handleCountryChange={countryData.handleCountryChange}
        countries={countryData.countries}
        isLoading={countryData.isLoading}
        fallbackCountries={countryData.fallbackCountries}
        selectedState={countryData.selectedState}
        handleStateChange={countryData.handleStateChange}
        states={countryData.states}
        fallbackStates={countryData.fallbackStates}
        selectedCurrency={countryData.selectedCurrency}
        handleCurrencyChange={countryData.handleCurrencyChange}
        currencies={countryData.currencies}
        fallbackCurrencies={countryData.fallbackCurrencies}
        error={countryData.error}
      />

      {/* Population and Statistics Table */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
          Population and Economic Statistics
        </h2>
        {/* Force render the table even if loading, as long as we have data */}
        {(economicData.selectedCountryEconomicData || !economicData.isLoading) ? (
          <StatisticsTable
            isLoading={economicData.isLoading}
            tableYears={economicData.tableYears}
            selectedCountryEconomicData={economicData.selectedCountryEconomicData}
            selectedFinancialYear={economicData.selectedFinancialYear}
            updateEconomicData={economicData.updateEconomicData}
          />
        ) : (
          <div className="text-center py-4">Loading economic data...</div>
        )}
      </div>

      {/* Revenue Overview and Performance Metrics Cards */}
      <MetricsCards />
    </div>
  );
} 