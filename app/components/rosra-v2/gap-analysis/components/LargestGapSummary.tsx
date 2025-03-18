import { useCurrency } from '@/app/context/CurrencyContext';
import { formatCurrency } from '@/app/utils/formatters';

interface LargestGapSummaryProps {
  largestGap: {
    name: string;
    value: number;
  };
  largestGapType: {
    name: string;
    value: number;
  };
}

export const LargestGapSummary = ({
  largestGap,
  largestGapType
}: LargestGapSummaryProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  return (
    <div className="flex gap-6">
      {/* Largest Revenue Gap by Source */}
      <div className="flex-1 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
          Largest Revenue Gap by Source
        </h3>
        <p className="mt-2 text-yellow-700 dark:text-yellow-300">
          The largest revenue gap is in <span className="font-bold">{largestGap.name}</span> at{' '}
          <span className="font-bold">{formatCurrency(largestGap.value, currencySymbol)}</span>
        </p>
      </div>

      {/* Largest Gap Type */}
      <div className="flex-1 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
          Largest Gap Type
        </h3>
        <p className="mt-2 text-indigo-700 dark:text-indigo-300">
          The largest gap type is <span className="font-bold">{largestGapType.name}</span> at{' '}
          <span className="font-bold">{formatCurrency(largestGapType.value, currencySymbol)}</span>
        </p>
      </div>
    </div>
  );
};