'use client';

import React from 'react';

interface MainInputsProps {
  estimatedDailyFees?: number;
  actualDailyFees?: number;
  onChange: (field: string, value: number) => void;
}

export const MainInputs: React.FC<MainInputsProps> = ({ 
  estimatedDailyFees = 1000,
  actualDailyFees = 700,
  onChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, Number(value));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estimated Number of Daily Fees
          </label>
          <input
            type="number"
            name="estimatedDailyFees"
            value={estimatedDailyFees}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
            placeholder="Enter estimated daily fees"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Actual Number of Daily Fees
          </label>
          <input
            type="number"
            name="actualDailyFees"
            value={actualDailyFees}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
            placeholder="Enter actual daily fees"
          />
        </div>
      </div>
    </div>
  );
};
