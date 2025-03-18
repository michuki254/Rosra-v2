import { useCurrency } from '@/app/context/CurrencyContext';

interface TotalGapsGridProps {
  totalGapsByType: {
    totalRegistrationGap: number;
    totalComplianceGap: number;
    totalAssessmentGap: number;
    totalRateGap: number;
    totalCombinedGap: number;
  };
}

// Add formatLargeNumber function
const formatLargeNumber = (value: number): string => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  let formattedNumber: string;
  if (absValue >= 1000000000) {
    formattedNumber = `${(absValue / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    formattedNumber = `${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    formattedNumber = `${(absValue / 1000).toFixed(1)}K`;
  } else {
    formattedNumber = absValue.toString();
  }

  return isNegative ? `-${formattedNumber}` : formattedNumber;
};

export const TotalGapsGrid = ({ totalGapsByType }: TotalGapsGridProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  // Update the value formatting in the card
  const formatValue = (value: number): string => {
    return `${currencySymbol} ${formatLargeNumber(value)}`;
  };

  const gapCards = [
    {
      title: 'Total Registration Gap',
      value: totalGapsByType.totalRegistrationGap,
      description: totalGapsByType.totalRegistrationGap > 0 
        ? 'Revenue loss from unregistered entities'
        : 'No revenue loss from unregistered entities',
      borderColor: 'border-blue-500',
      textColor: totalGapsByType.totalRegistrationGap > 0 
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400'
    },
    {
      title: 'Total Compliance Gap',
      value: totalGapsByType.totalComplianceGap,
      description: totalGapsByType.totalComplianceGap > 0 
        ? 'Revenue loss from non-compliant entities'
        : 'No revenue loss from non-compliant entities',
      borderColor: 'border-green-500',
      textColor: totalGapsByType.totalComplianceGap > 0 
        ? 'text-green-600 dark:text-green-400'
        : 'text-gray-500 dark:text-gray-400'
    },
    {
      title: 'Total Assessment Gap',
      value: totalGapsByType.totalAssessmentGap,
      description: totalGapsByType.totalAssessmentGap > 0 
        ? 'Revenue loss from incorrect assessments'
        : 'No revenue loss from incorrect assessments',
      borderColor: 'border-purple-500',
      textColor: totalGapsByType.totalAssessmentGap > 0 
        ? 'text-purple-600 dark:text-purple-400'
        : 'text-gray-500 dark:text-gray-400'
    },
    {
      title: 'Total Rate Gap',
      value: totalGapsByType.totalRateGap,
      description: totalGapsByType.totalRateGap > 0 
        ? 'Revenue loss from suboptimal rates'
        : 'No revenue loss from suboptimal rates',
      borderColor: 'border-orange-500',
      textColor: totalGapsByType.totalRateGap > 0 
        ? 'text-orange-600 dark:text-orange-400'
        : 'text-gray-500 dark:text-gray-400'
    },
    {
      title: 'Total Combined Gap',
      value: totalGapsByType.totalCombinedGap,
      description: totalGapsByType.totalCombinedGap > 0 
        ? 'Total revenue loss from all gaps'
        : 'No revenue loss from any gaps',
      borderColor: 'border-pink-500',
      textColor: totalGapsByType.totalCombinedGap > 0 
        ? 'text-pink-600 dark:text-pink-400'
        : 'text-gray-500 dark:text-gray-400'
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {gapCards.map((card, index) => (
        <div
          key={`gap-card-${card.title.replace(/\s+/g, '-').toLowerCase()}`}
          className={`p-4 rounded-lg border-l-4 ${card.borderColor} ${card.value === 0 ? 'opacity-50' : ''}`}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {card.title}
          </div>
          <div className={`text-2xl font-bold ${card.value === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'} mt-1`}>
            {formatValue(card.value)}
          </div>
          <div className={`text-xs ${card.textColor} mt-1`}>
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
};