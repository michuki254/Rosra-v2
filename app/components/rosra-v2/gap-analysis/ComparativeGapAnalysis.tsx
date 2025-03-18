'use client';

import { useMemo } from 'react';
import { formatCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useTotalEstimate } from '@/app/context/TotalEstimateContext';
import { LargestGapSummary } from './components/LargestGapSummary';
import { TotalGapsGrid } from './components/TotalGapsGrid';
import { GapBreakdownSection } from './components/GapBreakdownSection';

const defaultColorSchemes = {
  propertyTax: {
    bg: 'bg-purple-50/50',
    text: 'text-purple-600',
    darkBg: 'dark:bg-purple-900/5'
  },
  license: {
    bg: 'bg-blue-50/50',
    text: 'text-blue-600',
    darkBg: 'dark:bg-blue-900/5'
  },
  shortTerm: {
    bg: 'bg-green-50/50',
    text: 'text-green-600',
    darkBg: 'dark:bg-green-900/5'
  },
  longTerm: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    darkBg: 'dark:bg-orange-900/20'
  },
  mixedCharge: {
    bg: 'bg-red-50/50',
    text: 'text-red-600',
    darkBg: 'dark:bg-red-900/5'
  }
};

interface ComparativeGapAnalysisProps {
  propertyTax: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  license: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  shortTerm: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  longTerm: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  mixedCharge: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  colorSchemes?: {
    propertyTax: ColorScheme;
    license: ColorScheme;
    shortTerm: ColorScheme;
    longTerm: ColorScheme;
    mixedCharge: ColorScheme;
  };
}

export const ComparativeGapAnalysis = () => {
  const { selectedCountry } = useCurrency();
  const { revenueStreams } = useTotalEstimate();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const colorSchemes = useMemo(() => ({
    ...defaultColorSchemes,
  }), []);

  // Calculate total gaps by type
  const totalGapsByType = useMemo(() => {
    // Get individual revenue streams
    const propertyTax = revenueStreams.find(stream => stream.type === 'Property Tax');
    const license = revenueStreams.find(stream => stream.type === 'License Fees');
    const shortTerm = revenueStreams.find(stream => stream.type === 'Short-Term User Charges');
    const longTerm = revenueStreams.find(stream => stream.type === 'Long-Term User Charges');
    const mixedCharge = revenueStreams.find(stream => stream.type === 'Mixed User Charges');

    // Calculate total registration gap (only applies to property tax and license)
    const totalRegistrationGap = 
      (propertyTax?.gapBreakdown?.registrationGap?.value || 0) +
      (license?.gapBreakdown?.registrationGap?.value || 0);

    // Calculate total compliance gap
    const totalComplianceGap = 
      (propertyTax?.gapBreakdown?.complianceGap?.value || 0) +
      (license?.gapBreakdown?.complianceGap?.value || 0) +
      (shortTerm?.gapBreakdown?.complianceGap?.value || 0) +
      (longTerm?.gapBreakdown?.complianceGap?.value || 0) +
      (mixedCharge?.gapBreakdown?.complianceGap?.value || 0);

    // Calculate total assessment gap
    const totalAssessmentGap = 
      (propertyTax?.gapBreakdown?.assessmentGap?.value || 0) +
      (license?.gapBreakdown?.assessmentGap?.value || 0) +
      (shortTerm?.gapBreakdown?.assessmentGap?.value || 0) +
      (longTerm?.gapBreakdown?.assessmentGap?.value || 0) +
      (mixedCharge?.gapBreakdown?.assessmentGap?.value || 0);

    // Calculate total rate gap
    const totalRateGap = 
      (propertyTax?.gapBreakdown?.rateGap?.value || 0) +
      (license?.gapBreakdown?.rateGap?.value || 0) +
      (shortTerm?.gapBreakdown?.rateGap?.value || 0) +
      (longTerm?.gapBreakdown?.rateGap?.value || 0) +
      (mixedCharge?.gapBreakdown?.rateGap?.value || 0);

    // Calculate total combined gap as sum of all individual gaps
    const totalCombinedGap = revenueStreams.reduce((total, stream) => total + (stream.gap || 0), 0);

    return {
      totalRegistrationGap,
      totalComplianceGap,
      totalAssessmentGap,
      totalRateGap,
      totalCombinedGap
    };
  }, [revenueStreams]);

  // Calculate largest gap and gap type
  const { largestGap, largestGapType } = useMemo(() => {
    // Find largest gap by revenue stream
    const gapsByStream = revenueStreams.map(stream => ({
      name: stream.type,
      value: stream.gap || 0
    }));
    
    const largestGap = gapsByStream.reduce((max, current) => 
      current.value > max.value ? current : max
    , gapsByStream[0] || { name: '', value: 0 });

    // Find largest gap by type
    const gapTypes = [
      { name: 'Registration', value: totalGapsByType.totalRegistrationGap },
      { name: 'Compliance', value: totalGapsByType.totalComplianceGap },
      { name: 'Assessment', value: totalGapsByType.totalAssessmentGap },
      { name: 'Rate', value: totalGapsByType.totalRateGap }
    ];

    const largestGapType = gapTypes.reduce((max, current) => 
      current.value > max.value ? current : max
    , gapTypes[0]);

    return { largestGap, largestGapType };
  }, [revenueStreams, totalGapsByType]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <LargestGapSummary 
          largestGap={largestGap} 
          largestGapType={largestGapType} 
          currencySymbol={selectedCountry?.currency_symbol || 'KSh'} 
        />
      </div>
      
      <TotalGapsGrid totalGapsByType={totalGapsByType} />
      
      <GapBreakdownSection 
        propertyTax={revenueStreams.find(stream => stream.type === 'Property Tax')}
        license={revenueStreams.find(stream => stream.type === 'License Fees')}
        shortTerm={revenueStreams.find(stream => stream.type === 'Short-Term User Charges')}
        longTerm={revenueStreams.find(stream => stream.type === 'Long-Term User Charges')}
        mixedCharge={revenueStreams.find(stream => stream.type === 'Mixed User Charges')}
        colorSchemes={colorSchemes}
        currencySymbol={selectedCountry?.currency_symbol || 'KSh'}
      />
    </div>
  );
};
