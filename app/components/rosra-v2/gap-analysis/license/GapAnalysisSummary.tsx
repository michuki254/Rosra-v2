'use client';

import { formatRoundedCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';

interface GapAnalysisSummaryProps {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

export const GapAnalysisSummary = ({
  registrationGap,
  complianceGap,
  assessmentGap,
  combinedGaps,
}: GapAnalysisSummaryProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const gapItems = [
    {
      id: 'registration-gap',
      title: 'License Registration Gap',
      value: registrationGap,
      description: 'Gap in business registration',
      borderColor: 'border-blue-500',
      textColor: 'text-gray-900',
      descriptionColor: 'text-blue-600',
    },
    {
      id: 'compliance-gap',
      title: 'License Compliance Gap',
      value: complianceGap,
      description: 'Gap in license compliance',
      borderColor: 'border-orange-500',
      textColor: 'text-gray-900',
      descriptionColor: 'text-orange-600',
    },
    {
      id: 'assessment-gap',
      title: 'License Assessment Gap',
      value: assessmentGap,
      description: 'Gap in license assessment',
      borderColor: 'border-green-500',
      textColor: 'text-gray-900',
      descriptionColor: 'text-green-600',
    },
    {
      id: 'combined-gaps',
      title: 'Combined License Gaps',
      value: combinedGaps,
      description: 'Total of all other gaps',
      borderColor: 'border-purple-500',
      textColor: 'text-gray-900',
      descriptionColor: 'text-purple-600',
    },
  ];

  return (
    <div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gapItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg p-4 border-l-4 ${item.borderColor} shadow-sm`}
          >
            <div className="text-gray-600 text-sm font-medium mb-2">
              {item.title}
            </div>
            <div className={`text-base font-semibold ${item.textColor} mb-1`}>
              {formatRoundedCurrency(item.value, currencySymbol)}
            </div>
            <div className={`text-xs ${item.descriptionColor}`}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GapAnalysisSummary;
