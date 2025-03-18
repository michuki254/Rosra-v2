import React from 'react';
import { formatCurrency } from '@/app/utils/formatters';

interface LicenseMetricsSummaryProps {
  licenseCalculations: {
    actualRevenue: number;
    potentialRevenue: number;
    gap: number;
    gapBreakdown?: {
      registrationGap: number;
      complianceGap: number;
      assessmentGap: number;
      combinedGaps: number;
    };
  };
  currencySymbol: string;
}

export default function LicenseMetricsSummary({ 
  licenseCalculations, 
  currencySymbol 
}: LicenseMetricsSummaryProps) {
  // Get gap breakdown values from props
  const gapBreakdown = licenseCalculations.gapBreakdown || {
    registrationGap: 0,
    complianceGap: 0,
    assessmentGap: 0,
    combinedGaps: 0
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700 mb-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
        License Revenue Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Actual License Revenue Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-blue-500"></div>
          <div className="flex-1 p-3">
            <h4 className="text-gray-600 dark:text-gray-400 text-base font-medium">
              Actual License Revenue
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(licenseCalculations.actualRevenue, currencySymbol)}
            </p>
          </div>
        </div>
        
        {/* Total Potential Revenue Card */}
        <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-1.5 bg-green-500"></div>
          <div className="flex-1 p-3">
            <h4 className="text-gray-600 dark:text-gray-400 text-base font-medium">
              Total Potential Revenue
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(licenseCalculations.potentialRevenue, currencySymbol)}
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
              {formatCurrency(licenseCalculations.gap, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Gap Breakdown Cards - Only show if there's at least one non-zero gap */}
      {(gapBreakdown.registrationGap > 0 || 
        gapBreakdown.complianceGap > 0 || 
        gapBreakdown.assessmentGap > 0 || 
        gapBreakdown.combinedGaps > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
          {/* Registration Gap Card */}
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-1.5 bg-blue-500"></div>
            <div className="flex-1 p-3">
              <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                License Registration Gap
              </h4>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(gapBreakdown.registrationGap, currencySymbol)}
              </p>
            </div>
          </div>
          
          {/* Compliance Gap Card */}
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-1.5 bg-orange-500"></div>
            <div className="flex-1 p-3">
              <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                License Compliance Gap
              </h4>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(gapBreakdown.complianceGap, currencySymbol)}
              </p>
            </div>
          </div>
          
          {/* Assessment Gap Card */}
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-1.5 bg-green-500"></div>
            <div className="flex-1 p-3">
              <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                License Assessment Gap
              </h4>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(gapBreakdown.assessmentGap, currencySymbol)}
              </p>
            </div>
          </div>
          
          {/* Combined Gaps Card */}
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-1.5 bg-purple-500"></div>
            <div className="flex-1 p-3">
              <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Combined License Gaps
              </h4>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(gapBreakdown.combinedGaps, currencySymbol)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 