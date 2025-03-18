import { formatCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';

interface AnalysisMessageProps {
  metrics: {
    actualRevenue: number;
    potentialRevenue: number;
    gap: number;
  };
}

export const AnalysisMessage = ({ metrics }: AnalysisMessageProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const getMessage = () => {
    const potentialLeveraged = metrics.actualRevenue / metrics.potentialRevenue; // Calculate percentage
    const actualRevenue = metrics.actualRevenue;
    const totalPotentialRevenue = metrics.potentialRevenue;
    const percentage = potentialLeveraged * 100;

    if (percentage < 30) {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at only{' '}
          <span className="text-red-600 dark:text-red-400 font-medium">
            {percentage.toFixed(1)}%
          </span>
          . This indicates a huge gap between the actual revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(actualRevenue, currencySymbol)}
          </span>
          ) and the total potential revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(totalPotentialRevenue, currencySymbol)}
          </span>
          ). Therefore, there are significant spaces for improvement from the property tax sector. Government may consider multifaceted strategies that combine{' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            accurate assessment, effective enforcement, public awareness, and tax policies
          </span>
          .
        </>
      );
    } else if (percentage >= 30 && percentage < 70) {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at{' '}
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
            {percentage.toFixed(1)}%
          </span>
          . This indicates that a certain amount of revenues are successfully collected for local governments. But there are still considerable gaps between the actual revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(actualRevenue, currencySymbol)}
          </span>
          ) and the total potential revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(totalPotentialRevenue, currencySymbol)}
          </span>
          ). Therefore, local government should consider further improving its property tax revenue through strategies that combine{' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            accurate assessment, effective enforcement, public awareness, and tax policies
          </span>
          .
        </>
      );
    } else {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at{' '}
          <span className="text-green-600 dark:text-green-400 font-medium">
            {percentage.toFixed(1)}%
          </span>
          . This indicates that there is a satisfactory amount of property tax revenue being successfully collected, and the gap between the actual revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(actualRevenue, currencySymbol)}
          </span>
          ) and the total potential revenue ({' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(totalPotentialRevenue, currencySymbol)}
          </span>
          ) is not so significant. The local government should{' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            maintain its governance and tax policies
          </span>
          {' '}to keep collecting property tax revenue steadily.
        </>
      );
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-md p-4 mb-6">
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {getMessage()}
      </div>
    </div>
  );
};
