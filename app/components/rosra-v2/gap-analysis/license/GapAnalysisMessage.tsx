'use client';

import React from 'react';
import { useCurrency } from '@/app/context/CurrencyContext';
import { formatRoundedCurrency } from '@/app/utils/formatters';

interface GapValues {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
}

interface CategoryDebugInfo {
  name: string;
  estimated: number;
  registered: number;
  compliant: number;
  licenseFee: number;
  avgPaidFee: number;
}

interface GapAnalysisMessageProps extends GapValues {
  categories?: any[];
  enableDebugLogs?: boolean;
}

export const GapAnalysisMessage: React.FC<GapAnalysisMessageProps> = ({
  registrationGap,
  complianceGap,
  assessmentGap,
  categories = [],
  enableDebugLogs = false,
}) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'L';

  React.useEffect(() => {
    if (enableDebugLogs && categories.length > 0) {
      console.log('Gap Values:', {
        registrationGap,
        complianceGap,
        assessmentGap,
        categories
      });
    }
  }, [registrationGap, complianceGap, assessmentGap, categories, enableDebugLogs]);

  const getGapAnalysisContent = () => {
    const gaps = [
      { type: 'Registration Gap' as const, value: registrationGap },
      { type: 'Compliance Gap' as const, value: complianceGap },
      { type: 'Assessment Gap' as const, value: assessmentGap }
    ];
    
    const largestGapInfo = gaps.reduce((max, gap) => 
      gap.value > max.value ? gap : max, gaps[0]
    );
    
    if (largestGapInfo.value <= 0) {
      return (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The gaps in business license revenue collection are{' '}
            <span className="font-bold">relatively balanced</span>, with no single gap 
            type significantly outweighing the others. This suggests a need for a{' '}
            <span className="font-bold">comprehensive approach</span> to address all 
            aspects of revenue collection equally.{' '}
            <span className="font-medium">However, local government should also pay attention to other business license revenue gap sources as well.</span>
          </p>
        </div>
      );
    }

    const gapMessages = {
      'Registration Gap': (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> among the business license revenue
            sources is from the <span className="font-medium">registration gap</span>, at{' '}
            <span className="text-green-600 font-medium">{formatRoundedCurrency(registrationGap, currencySymbol)}</span>. The <span className="font-medium">registration gap</span> refers to the
            difference between the <span className="font-medium">number of businesses</span> that are legally required to obtain a business license 
            and the <span className="font-medium">number of businesses</span> that have actually registered and obtained the necessary licenses. Hence,
            government may consider improving the <span className="font-medium">registration processes</span> for taxation to bridge this gap.{' '}
            <span className="font-medium">However, local government should also pay attention to other business license revenue gap sources as well.</span>
          </p>
        </div>
      ),
      'Compliance Gap': (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> among the business license revenue
            sources is from the <span className="font-medium">compliance gap</span>, at{' '}
            <span className="text-green-600 font-medium">{formatRoundedCurrency(complianceGap, currencySymbol)}</span>. The <span className="font-medium">compliance gap</span> refers to the
            difference between the <span className="font-medium">number of registered businesses</span> with licenses and the <span className="font-medium">number of businesses</span> that are actually paying their taxes.
            Hence, government may consider improving the <span className="font-medium">compliance processes</span> for taxation to bridge this gap.{' '}
            <span className="font-medium">However, local government should also pay attention to other business license revenue gap sources as well.</span>
          </p>
        </div>
      ),
      'Assessment Gap': (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> among the business license revenue
            sources is from the <span className="font-medium">assessment gap</span>, at{' '}
            <span className="text-green-600 font-medium">{formatRoundedCurrency(assessmentGap, currencySymbol)}</span>. The <span className="font-medium">assessment gap</span> refers to the
            difference between the <span className="font-medium">potential revenue</span> calculated based on assessments and the <span className="font-medium">actual revenue</span> collected.
            Hence, government may consider improving the <span className="font-medium">assessment processes</span> for taxation to bridge this gap.{' '}
            <span className="font-medium">However, local government should also pay attention to other business license revenue gap sources as well.</span>
          </p>
        </div>
      )
    };

    return gapMessages[largestGapInfo.type];
  };

  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      {getGapAnalysisContent()}
    </div>
  );
};

export default GapAnalysisMessage;
