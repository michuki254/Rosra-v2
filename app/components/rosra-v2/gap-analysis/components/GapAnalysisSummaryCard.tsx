import { useCurrency } from '@/app/context/CurrencyContext';
import { formatCurrency } from '@/app/utils/formatters';

interface GapAnalysisSummaryCardProps {
  totalGapsByType: {
    totalRegistrationGap: number;
    totalComplianceGap: number;
    totalAssessmentGap: number;
    totalRateGap: number;
    totalCombinedGap: number;
  };
}

export const GapAnalysisSummaryCard = ({ totalGapsByType }: GapAnalysisSummaryCardProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  // Calculate percentages
  const total = totalGapsByType.totalCombinedGap;
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Gap Analysis Summary
      </h3>
      
      <div className="space-y-4">
        {/* Total Combined Gap */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Combined Gap</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalGapsByType.totalCombinedGap, currencySymbol)}
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3">
          {/* Registration Gap */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Registration Gap</span>
            </div>
            <div className="text-sm font-medium">
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(totalGapsByType.totalRegistrationGap, currencySymbol)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({getPercentage(totalGapsByType.totalRegistrationGap)}%)
              </span>
            </div>
          </div>

          {/* Compliance Gap */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Gap</span>
            </div>
            <div className="text-sm font-medium">
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(totalGapsByType.totalComplianceGap, currencySymbol)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({getPercentage(totalGapsByType.totalComplianceGap)}%)
              </span>
            </div>
          </div>

          {/* Assessment Gap */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Assessment Gap</span>
            </div>
            <div className="text-sm font-medium">
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(totalGapsByType.totalAssessmentGap, currencySymbol)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({getPercentage(totalGapsByType.totalAssessmentGap)}%)
              </span>
            </div>
          </div>

          {/* Rate Gap */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Rate Gap</span>
            </div>
            <div className="text-sm font-medium">
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(totalGapsByType.totalRateGap, currencySymbol)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({getPercentage(totalGapsByType.totalRateGap)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
