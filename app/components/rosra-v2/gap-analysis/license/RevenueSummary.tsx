'use client';

import { formatRoundedCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';

interface RevenueSummaryProps {
  actualRevenue: number;
  potentialRevenue: number;
  totalGap: number;
}

export function RevenueSummary({ actualRevenue, potentialRevenue, totalGap }: RevenueSummaryProps) {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  // Add more detailed debug logging
  console.log('RevenueSummary rendering with:', { 
    actualRevenue, 
    potentialRevenue, 
    totalGap, 
    currencySymbol,
    actualType: typeof actualRevenue,
    potentialType: typeof potentialRevenue,
    gapType: typeof totalGap,
    isActualValid: !isNaN(actualRevenue) && actualRevenue !== null && actualRevenue !== undefined,
    isPotentialValid: !isNaN(potentialRevenue) && potentialRevenue !== null && potentialRevenue !== undefined,
    isGapValid: !isNaN(totalGap) && totalGap !== null && totalGap !== undefined
  });

  // Ensure values are valid numbers
  const safeActual = typeof actualRevenue === 'number' && !isNaN(actualRevenue) ? actualRevenue : 0;
  const safePotential = typeof potentialRevenue === 'number' && !isNaN(potentialRevenue) ? potentialRevenue : 0;
  const safeGap = typeof totalGap === 'number' && !isNaN(totalGap) ? totalGap : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-blue-500 dark:border-blue-500/50">
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Actual License Revenue</div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {formatRoundedCurrency(safeActual, currencySymbol)}
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Current collected revenue
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-emerald-500 dark:border-emerald-500/50">
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Total Potential Revenue</div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {formatRoundedCurrency(safePotential, currencySymbol)}
        </div>
        <div className="text-sm text-emerald-600 dark:text-emerald-400">
          Maximum possible revenue
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-red-500 dark:border-red-500/50">
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Revenue Gap</div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {formatRoundedCurrency(safeGap, currencySymbol)}
        </div>
        <div className="text-sm text-red-600 dark:text-red-400">
          Uncollected potential revenue
        </div>
      </div>
    </div>
  );
}

export default RevenueSummary;
