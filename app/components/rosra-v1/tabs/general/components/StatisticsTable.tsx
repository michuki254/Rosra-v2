'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EconomicData, EditMode } from '../types';
import EditableCell from './EditableCell';

interface StatisticsTableProps {
  isLoading: boolean;
  tableYears: string[];
  selectedCountryEconomicData: EconomicData | null;
  selectedFinancialYear: string;
  updateEconomicData: (row: string, year: string, value: number) => void;
}

export default function StatisticsTable({
  isLoading,
  tableYears,
  selectedCountryEconomicData,
  selectedFinancialYear,
  updateEconomicData
}: StatisticsTableProps) {
  const [editMode, setEditMode] = useState<EditMode>({ row: null, year: null });
  const [localLoading, setLocalLoading] = useState<boolean>(isLoading);
  
  // Use refs to track previous values and prevent unnecessary re-renders
  const prevLoadingRef = useRef<boolean>(isLoading);
  const prevDataRef = useRef<EconomicData | null>(selectedCountryEconomicData);
  
  // Update local loading state when prop changes, but only if it actually changed
  useEffect(() => {
    if (isLoading !== prevLoadingRef.current) {
      console.log('StatisticsTable: isLoading prop changed from', prevLoadingRef.current, 'to', isLoading);
      prevLoadingRef.current = isLoading;
      setLocalLoading(isLoading);
    }
  }, [isLoading]);
  
  // If we have data but are still loading, we can show the data
  useEffect(() => {
    // Only update if data changed or loading state changed
    if (selectedCountryEconomicData !== prevDataRef.current || localLoading !== prevLoadingRef.current) {
      prevDataRef.current = selectedCountryEconomicData;
      
      if (selectedCountryEconomicData && localLoading) {
        console.log('StatisticsTable: Data available while loading, showing data');
        setLocalLoading(false);
      }
    }
  }, [selectedCountryEconomicData, localLoading]);
  
  // Cell styles
  const cellStyle = "py-3 px-4 text-center bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150 relative";

  // Function to handle cell click for editing
  const handleCellClick = (row: string, year: string, value: any) => {
    setEditMode({ row, year });
  };

  // Function to handle saving edited data
  const handleSaveData = (row: string, year: string, value: number) => {
    updateEconomicData(row, year, value);
    setEditMode({ row: null, year: null });
  };

  // Helper function to safely get cell value
  const getCellValue = (row: string, year: string): number | null => {
    if (!selectedCountryEconomicData || !selectedCountryEconomicData.years) {
      return null;
    }
    
    // Check if the year exists in the data
    if (!selectedCountryEconomicData.years[year]) {
      // If we're looking at sample data, create default values instead of returning null
      if (selectedCountryEconomicData.country === "Kenya" || selectedCountryEconomicData.country === "Uganda") {
        // Return default values based on the row
        if (row === "Population") {
          return selectedCountryEconomicData.country === "Kenya" ? 100000 + (parseInt(year) - 2016) * 2000 : 80000 + (parseInt(year) - 2016) * 1000;
        } else if (row === "GDP/capita") {
          return selectedCountryEconomicData.country === "Kenya" ? 1500 + (parseInt(year) - 2016) * 50 : 800 + (parseInt(year) - 2016) * 20;
        } else if (row === "Average Household size") {
          return selectedCountryEconomicData.country === "Kenya" ? 5 : 6;
        }
      }
      return null;
    }
    
    // Get the value for the specific row and year
    const value = selectedCountryEconomicData.years[year][row as keyof typeof selectedCountryEconomicData.years[typeof year]];
    return value !== undefined ? value : null;
  };

  // Debug output to help diagnose the issue
  console.log("StatisticsTable: Selected country economic data:", selectedCountryEconomicData);
  console.log("StatisticsTable: Table years:", tableYears);
  console.log("StatisticsTable: Local loading state:", localLoading);

  // If we're loading and don't have data, show loading message
  if (localLoading && !selectedCountryEconomicData) {
    return <div className="text-center py-4">Loading economic data...</div>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
          <th className="py-2 px-4 text-left font-semibold text-text-light dark:text-text-dark"></th>
          {tableYears.map(year => (
            <th key={year} className="py-2 px-4 text-center font-semibold text-text-light dark:text-text-dark">{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">Population of City</td>
          {tableYears.map(year => (
            <td 
              key={year} 
              className={cellStyle}
            >
              <EditableCell
                value={getCellValue("Population", year)}
                row="Population"
                year={year}
                isEditing={editMode.row === "Population" && editMode.year === year}
                onEdit={handleCellClick}
                onSave={handleSaveData}
              />
            </td>
          ))}
        </tr>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">GDP/capita</td>
          {tableYears.map(year => (
            <td 
              key={year} 
              className={cellStyle}
            >
              <EditableCell
                value={getCellValue("GDP/capita", year)}
                row="GDP/capita"
                year={year}
                isEditing={editMode.row === "GDP/capita" && editMode.year === year}
                onEdit={handleCellClick}
                onSave={handleSaveData}
              />
            </td>
          ))}
        </tr>
        <tr>
          <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">Average Household size</td>
          <td 
            className="py-3 px-4 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150 relative" 
            colSpan={5}
          >
            <EditableCell
              value={getCellValue("Average Household size", selectedFinancialYear)}
              row="Average Household size"
              year={selectedFinancialYear}
              isEditing={editMode.row === "Average Household size" && editMode.year === selectedFinancialYear}
              onEdit={handleCellClick}
              onSave={handleSaveData}
              inputStyle="w-40 mx-auto text-center bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
} 