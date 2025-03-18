import React from 'react';
import { formatCurrency } from '@/app/utils/formatters';

interface PropertyTaxMetricsSummaryProps {
  propertyTaxCalculations: {
    actualRevenue: number;
    potentialRevenue: number;
    gap: number;
    gapBreakdown: {
      registrationGap: number;
      complianceGap: number;
      assessmentGap: number;
      combinedGaps: number;
    };
  };
  currencySymbol: string;
}

// Helper function to round numbers to nearest thousand
const roundToThousand = (value: number): number => {
  return Math.round(value / 1000) * 1000;
};

// Format currency with rounded values
const formatRoundedCurrency = (value: number, symbol: string): string => {
  const roundedValue = roundToThousand(value);
  return formatCurrency(roundedValue, symbol);
};

export default function PropertyTaxMetricsSummary({ 
  propertyTaxCalculations, 
  currencySymbol 
}: PropertyTaxMetricsSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700 mb-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
        Property Tax Gap Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Actual Revenue Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-blue-500"></div>
          <div className="flex-1 p-3">
            <h4 className="text-gray-600 dark:text-gray-400 text-base font-medium">
              Actual Revenue
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(propertyTaxCalculations.actualRevenue, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Potential Revenue Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-gray-400"></div>
          <div className="flex-1 p-3">
            <h4 className="text-gray-600 dark:text-gray-400 text-base font-medium">
              Potential Revenue
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(propertyTaxCalculations.potentialRevenue, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Revenue Gap Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-red-500"></div>
          <div className="flex-1 p-3">
            <h4 className="text-gray-600 dark:text-gray-400 text-base font-medium">
              Revenue Gap
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(propertyTaxCalculations.gap, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
        {/* Registration Gap Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-blue-100"></div>
          <div className="flex-1 p-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Registration Gap
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(propertyTaxCalculations.gapBreakdown.registrationGap, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Compliance Gap Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-orange-100"></div>
          <div className="flex-1 p-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Compliance Gap
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(propertyTaxCalculations.gapBreakdown.complianceGap, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Assessment Gap Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-gray-100"></div>
          <div className="flex-1 p-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Assessment Gap
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(propertyTaxCalculations.gapBreakdown.assessmentGap, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Combined Gaps Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-yellow-100"></div>
          <div className="flex-1 p-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Combined Gaps
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(propertyTaxCalculations.gapBreakdown.combinedGaps, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 