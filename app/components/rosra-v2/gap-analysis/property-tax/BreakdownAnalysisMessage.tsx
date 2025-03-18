import { formatCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';
import { GapBreakdown } from '@/app/types/propertyTax';

interface BreakdownAnalysisMessageProps {
  metrics: {
    actualRevenue: number;
    potentialRevenue: number;
    gap: number;
    gapBreakdown: GapBreakdown;
  };
}

type GapType = 'Assessment/Valuation gap' | 'Registration gap' | 'Compliance gap';

interface Gap {
  name: GapType;
  value: number;
}

export const BreakdownAnalysisMessage = ({ metrics }: BreakdownAnalysisMessageProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const getLargestGap = (): Gap => {
    const { registrationGap, complianceGap, assessmentGap } = metrics.gapBreakdown || {
      registrationGap: 0,
      complianceGap: 0,
      assessmentGap: 0
    };
    
    const gaps: Gap[] = [
      { name: 'Registration gap', value: registrationGap },
      { name: 'Compliance gap', value: complianceGap },
      { name: 'Assessment/Valuation gap', value: assessmentGap }
    ];

    return gaps.reduce((max, current) => 
      current.value > max.value ? current : max
    , gaps[0]);
  };

  const getMessage = () => {
    try {
      const largestGap = getLargestGap();
      const gapValue = largestGap.value;

      const messages: Record<GapType, JSX.Element> = {
        'Assessment/Valuation gap': (
          <>
            The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the assessment/valuation gap, at{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {formatCurrency(gapValue, currencySymbol)}
            </span>
            . The assessment/valuation gap refers to the difference between the assessed value of a property for taxation purposes and its actual market value. Hence, government may consider improving the valuation processes for taxation to bridge this gap.{' '}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              However, local government should also pay attention to other property tax gap sources as well.
            </span>
          </>
        ),
        'Registration gap': (
          <>
            The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the registration gap, at{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {formatCurrency(gapValue, currencySymbol)}
            </span>
            . This indicates that there are properties that are eligible for taxation but are not properly registered or assessed for taxation. Therefore, local governments may take strategies about property assessment and property registration to close the registration gap.{' '}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              However, local government should also pay attention to other property tax gap sources as well.
            </span>
          </>
        ),
        'Compliance gap': (
          <>
            The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the compliance gap, at{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {formatCurrency(gapValue, currencySymbol)}
            </span>
            . This illustrates that there is a shortfall between the potential tax revenue that should be collected based on tax laws and the actual revenue collected. Therefore, governments can consider strategies like raising public awareness and clear tax obligation communication to close the compliance gap.{' '}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              However, local government should also pay attention to other property tax gap sources as well.
            </span>
          </>
        )
      };

      return messages[largestGap.name] || (
        <span className="text-red-600 dark:text-red-400">
          Unable to determine the largest gap in property tax revenue.
        </span>
      );
    } catch (error) {
      console.error('Error getting breakdown analysis message:', error);
      return (
        <span className="text-red-600 dark:text-red-400">
          An error occurred while analyzing the property tax breakdown.
        </span>
      );
    }
  };

  return getMessage();
};
