'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { usePropertyTax } from '@/app/context/PropertyTaxContext';
import { useLongTerm } from '@/app/context/LongTermContext';
import { useShortTerm } from '@/app/context/ShortTermContext';
import { useLicense } from '@/app/context/LicenseContext';
import { useTotalEstimate, TotalEstimateProvider } from '@/app/context/TotalEstimateContext';
import { useAnalysis } from '@/app/context/AnalysisContext';
import { usePropertyTaxCalculations } from '@/app/hooks/usePropertyTaxCalculations';
import { useLicenseCalculations } from '@/app/hooks/useLicenseCalculations';
import { useShortTermCalculations } from '@/app/hooks/useShortTermCalculations';
import { useLongTermCalculations } from '@/app/hooks/useLongTermCalculations';
import { useMixedChargeCalculations } from '@/app/hooks/useMixedChargeCalculations';
import { useTotalEstimateCharts } from '@/app/hooks/useTotalEstimateCharts';
import { TotalEstimateAnalysisService } from '@/app/services/total-estimate-analysis.service';
import { TotalEstimateCalculationsService } from '@/app/services/total-estimate-calculations.service';
import { calculateTotalTop5, calculateOtherRevenue } from '@/app/services/osrService';
import { RevenueStream } from '@/app/types/total-estimate-analysis';
import TopOSRConfigModal from '../TopOSRConfigModal';
import { ComparativeGapAnalysis } from './ComparativeGapAnalysis';
import { GapAnalysisSummaryCard } from './components/GapAnalysisSummaryCard';
import { TotalGapsGrid } from './components/TotalGapsGrid';
import { useOSR } from '@/app/context/OSRContext';
import { ChevronUpIcon, ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TotalEstimateAnalysisProps {
  onMetricsChange?: (metrics: any) => void;
  revenueStreams?: RevenueStream[];
}

function RevenueCard({ title, value, description, color, isPercentage = false }: { 
  title: string; 
  value: number; 
  description: string; 
  color: string;
  isPercentage?: boolean;
}) {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const formattedValue = isPercentage 
    ? `${value.toFixed(1)}%`
    : `${currencySymbol} ${TotalEstimateAnalysisService.formatLargeNumber(value)}`;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 ${color} shadow-sm`}>
      <h3 className="text-gray-600 dark:text-gray-400 text-base">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {formattedValue}
      </div>
      <p className={`text-sm mt-1 ${color.replace('border', 'text')}`}>{description}</p>
    </div>
  );
}

const parseNumber = (value: string): number => {
  // Remove commas and any other non-numeric characters except decimal point
  const numStr = value.replace(/[^0-9.-]/g, '');
  return parseFloat(numStr) || 0;
};

// Add this utility function near the top of the file
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

export function TotalEstimateAnalysisContent({
  showTopOSRConfig = true,
  showTopOSRChart = true,
  showGapBreakdownConfig = true,
  showGapBreakdownChart = true,
  showComparativeGapAnalysis = true,
}: TotalEstimateAnalysisProps) {
  const { selectedCountry } = useCurrency();
  const { inputs, updateInputs } = useAnalysis();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  
  // Get current fiscal year
  const currentYear = useMemo(() => {
    const today = new Date();
    return today.getFullYear().toString();
  }, []);
  
  // Get raw metrics from contexts
  const { metrics: propertyTaxRawMetrics } = usePropertyTax();
  const { metrics: licenseRawMetrics } = useLicense();
  const { metrics: shortTermRawMetrics } = useShortTerm();
  const { metrics: longTermRawMetrics } = useLongTerm();
  const { metrics: mixedChargeRawMetrics } = useMixedCharge();
  
  // Calculate property tax metrics
  const propertyTaxMetrics = usePropertyTaxCalculations(propertyTaxRawMetrics);

  // Get total estimate context
  const { 
    metrics: totalEstimateMetrics, 
    updateRevenueStreams
  } = useTotalEstimate();

  // Get OSR data from context
  const { osrData, updateOSRData } = useOSR();

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Calculate total actual revenue first
  const totalActualRevenue = useMemo(() => {
    return (
      (propertyTaxMetrics?.actualRevenue || 0) +
      (licenseRawMetrics?.actual || 0) +
      (shortTermRawMetrics?.actual || 0) +
      (longTermRawMetrics?.actual || 0) +
      (mixedChargeRawMetrics?.actual || 0)
    );
  }, [
    propertyTaxMetrics?.actualRevenue,
    licenseRawMetrics?.actual,
    shortTermRawMetrics?.actual,
    longTermRawMetrics?.actual,
    mixedChargeRawMetrics?.actual
  ]);

  // Get budgetedOSR and actualOSR from analysis context
  const budgetedOSR = useMemo(() => {
    if (!inputs.budgetedOSR) return totalActualRevenue;
    const parsed = parseNumber(inputs.budgetedOSR);
    return parsed || totalActualRevenue;
  }, [inputs.budgetedOSR, totalActualRevenue]);

  const actualOSR = useMemo(() => {
    if (!inputs.actualOSR) return totalActualRevenue;
    const parsed = parseNumber(inputs.actualOSR);
    return parsed || totalActualRevenue;
  }, [inputs.actualOSR, totalActualRevenue]);

  // Calculate OSR metrics using actualOSR
  const totalTop5 = useMemo(() => {
    return calculateTotalTop5(osrData);
  }, [osrData]);

  const otherRevenue = useMemo(() => {
    return calculateOtherRevenue(actualOSR, totalTop5);
  }, [actualOSR, totalTop5]);

  const handleTopOSRSave = useCallback((newBudgetedOSR: number, newTotalTop5: number, newOtherRevenue: number, newTopOSRData: OSRData[]) => {
    if (newBudgetedOSR !== budgetedOSR) {
      updateInputs({ budgetedOSR: formatLargeNumber(newBudgetedOSR) });
    }
    updateOSRData(newTopOSRData);
  }, [budgetedOSR, updateInputs, updateOSRData]);

  // Calculate total potential revenue
  const totalPotentialRevenue = useMemo(() => {
    return (
      (propertyTaxMetrics?.potentialRevenue || 0) +
      (licenseRawMetrics?.potential || 0) +
      (shortTermRawMetrics?.potential || 0) +
      (longTermRawMetrics?.potential || 0) +
      (mixedChargeRawMetrics?.potential || 0)
    );
  }, [
    propertyTaxMetrics?.potentialRevenue,
    licenseRawMetrics?.potential,
    shortTermRawMetrics?.potential,
    longTermRawMetrics?.potential,
    mixedChargeRawMetrics?.potential
  ]);

  // Calculate total gap
  const totalGap = useMemo(() => {
    return Math.max(0, totalPotentialRevenue - totalActualRevenue);
  }, [totalPotentialRevenue, totalActualRevenue]);

  // Use memo to format revenue streams with OSR data
  const revenueStreams = useMemo(() => {
    const streams = [
      {
        name: 'Property Tax',
        type: 'property-tax',
        actual: propertyTaxMetrics?.actualRevenue || 0,
        potential: propertyTaxMetrics?.potentialRevenue || 0,
        gap: propertyTaxMetrics?.gap || 0,
        gapBreakdown: propertyTaxMetrics?.gapBreakdown || { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      },
      {
        name: 'License Fees',
        type: 'license',
        actual: licenseRawMetrics?.actual || 0,
        potential: licenseRawMetrics?.potential || 0,
        gap: licenseRawMetrics?.gap || 0,
        gapBreakdown: licenseRawMetrics?.gapBreakdown || { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      },
      {
        name: 'Short-Term User Charges',
        type: 'short-term',
        actual: shortTermRawMetrics?.actual || 0,
        potential: shortTermRawMetrics?.potential || 0,
        gap: shortTermRawMetrics?.gap || 0,
        gapBreakdown: shortTermRawMetrics?.gapBreakdown || { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      },
      {
        name: 'Long-Term User Charges',
        type: 'long-term',
        actual: longTermRawMetrics?.actual || 0,
        potential: longTermRawMetrics?.potential || 0,
        gap: longTermRawMetrics?.gap || 0,
        gapBreakdown: longTermRawMetrics?.gapBreakdown || { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      },
      {
        name: 'Mixed User Charges',
        type: 'mixed-charge',
        actual: mixedChargeRawMetrics?.actual || 0,
        potential: mixedChargeRawMetrics?.potential || 0,
        gap: mixedChargeRawMetrics?.gap || 0,
        gapBreakdown: mixedChargeRawMetrics?.gapBreakdown || { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      }
    ];

    // Add OSR breakdown
    if (osrData?.length) {
      streams.push({
        name: 'Top 5 OSR',
        type: 'top-osr',
        actual: totalTop5,
        potential: totalActualRevenue,
        gap: 0,
        gapBreakdown: { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      });
      streams.push({
        name: 'Other Revenue',
        type: 'other-revenue',
        actual: otherRevenue,
        potential: otherRevenue,
        gap: 0,
        gapBreakdown: { registrationGap: 0, complianceGap: 0, assessmentGap: 0 }
      });
    }

    return streams;
  }, [
    propertyTaxMetrics,
    licenseRawMetrics,
    shortTermRawMetrics,
    longTermRawMetrics,
    mixedChargeRawMetrics,
    osrData,
    totalTop5,
    otherRevenue,
    totalActualRevenue
  ]);

  // Calculate average gap percentage from total gap and potential revenue
  const averageGapPercentage = useMemo(() => {
    if (!totalPotentialRevenue) return 0;
    return (totalGap / totalPotentialRevenue) * 100;
  }, [totalGap, totalPotentialRevenue]);

  // Calculate metrics using service
  const metrics = useMemo(() => {
    return TotalEstimateAnalysisService.calculateTotalMetrics(revenueStreams, osrData, budgetedOSR, actualOSR);
  }, [revenueStreams, osrData, budgetedOSR, actualOSR]);

  // Update revenue streams when they change
  useEffect(() => {
    if (revenueStreams.length > 0) {
      updateRevenueStreams(revenueStreams);
    }
  }, [revenueStreams, updateRevenueStreams]);

  // Add getLargestGap function
  const getLargestGap = useMemo(() => {
    const gaps = [
      { name: 'Total Gap Property Tax', value: propertyTaxMetrics?.gap || 0 },
      { name: 'Total Gap Licensees', value: licenseRawMetrics?.gap || 0 },
      { name: 'Total Gap Mixed Fees', value: mixedChargeRawMetrics?.gap || 0 },
      { name: 'Total Gap Short-term User Charge', value: shortTermRawMetrics?.gap || 0 },
      { name: 'Total Gap Long-term User Charge', value: longTermRawMetrics?.gap || 0 }
    ];
    
    return gaps.reduce((max, current) => 
      current.value > max.value ? current : max
    ).name;
  }, [
    propertyTaxMetrics?.gap,
    licenseRawMetrics?.gap,
    mixedChargeRawMetrics?.gap,
    shortTermRawMetrics?.gap,
    longTermRawMetrics?.gap
  ]);

  // Get analysis text based on largest gap
  const getAnalysisText = useMemo(() => {
    const formatCurrency = (value: number) => {
      return `${selectedCountry?.currency_symbol || 'KSh'} ${formatLargeNumber(value)}`;
    };

    switch(getLargestGap) {
      case 'Total Gap Property Tax': {
        const percentage = ((propertyTaxMetrics?.actual || 0) / (propertyTaxMetrics?.potential || 1) * 100).toFixed(1);
        const actualRevenue = formatCurrency(propertyTaxMetrics?.actual || 0);
        const potentialRevenue = formatCurrency(propertyTaxMetrics?.potential || 0);
        
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The percentage of potential leveraged revenue from property tax is at <span className="text-green-600 font-semibold">{percentage}%</span>. 
            This indicates that there is a satisfactory amount of property tax revenue being successfully collected, and the gap between the actual revenue 
            (<span className="text-blue-600 font-semibold">{actualRevenue}</span>) and the total potential revenue 
            (<span className="text-blue-600 font-semibold">{potentialRevenue}</span>) is not so significant. The local government should 
            <span className="text-blue-600 font-semibold"> maintain its governance and tax policies</span> to keep collecting property tax revenue steadily.
          </p>
        );
      }
      
      case 'Total Gap Licensees': {
        const percentage = ((licenseRawMetrics?.actual || 0) / (licenseRawMetrics?.potential || 1) * 100).toFixed(1);
        const actualRevenue = formatCurrency(licenseRawMetrics?.actual || 0);
        const potentialRevenue = formatCurrency(licenseRawMetrics?.potential || 0);
        
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The percentage of potential leveraged revenue from licenses is at <span className="text-green-600 font-semibold">{percentage}%</span>. 
            The analysis reveals significant gaps between the actual revenue (<span className="text-blue-600 font-semibold">{actualRevenue}</span>) 
            and total potential revenue (<span className="text-blue-600 font-semibold">{potentialRevenue}</span>). This indicates challenges in the 
            business license sector that need to be addressed through <span className="text-blue-600 font-semibold">improved compliance monitoring and 
            operational efficiency</span>.
          </p>
        );
      }
      
      case 'Total Gap Mixed Fees': {
        const percentage = ((mixedChargeRawMetrics?.actual || 0) / (mixedChargeRawMetrics?.potential || 1) * 100).toFixed(1);
        const actualRevenue = formatCurrency(mixedChargeRawMetrics?.actual || 0);
        const potentialRevenue = formatCurrency(mixedChargeRawMetrics?.potential || 0);
        
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The percentage of potential leveraged revenue from mixed fees is at <span className="text-green-600 font-semibold">{percentage}%</span>. 
            The analysis reveals significant gaps between the actual revenue (<span className="text-blue-600 font-semibold">{actualRevenue}</span>) 
            and total potential revenue (<span className="text-blue-600 font-semibold">{potentialRevenue}</span>). This indicates challenges in the 
            mixed fees sector that need to be addressed through <span className="text-blue-600 font-semibold">improved compliance monitoring and 
            operational efficiency</span>.
          </p>
        );
      }
      
      case 'Total Gap Short-term User Charge': {
        const percentage = ((shortTermRawMetrics?.actual || 0) / (shortTermRawMetrics?.potential || 1) * 100).toFixed(1);
        const actualRevenue = formatCurrency(shortTermRawMetrics?.actual || 0);
        const potentialRevenue = formatCurrency(shortTermRawMetrics?.potential || 0);
        
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The percentage of potential leveraged revenue from short-term user charges is at <span className="text-green-600 font-semibold">{percentage}%</span>. 
            The analysis reveals significant gaps between the actual revenue (<span className="text-blue-600 font-semibold">{actualRevenue}</span>) 
            and total potential revenue (<span className="text-blue-600 font-semibold">{potentialRevenue}</span>). This indicates challenges in the 
            short-term user charges sector that need to be addressed through <span className="text-blue-600 font-semibold">improved compliance monitoring and 
            operational efficiency</span>.
          </p>
        );
      }
      
      case 'Total Gap Long-term User Charge': {
        const percentage = ((longTermRawMetrics?.actual || 0) / (longTermRawMetrics?.potential || 1) * 100).toFixed(1);
        const actualRevenue = formatCurrency(longTermRawMetrics?.actual || 0);
        const potentialRevenue = formatCurrency(longTermRawMetrics?.potential || 0);
        
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The percentage of potential leveraged revenue from long-term user charges is at <span className="text-green-600 font-semibold">{percentage}%</span>. 
            The analysis reveals significant gaps between the actual revenue (<span className="text-blue-600 font-semibold">{actualRevenue}</span>) 
            and total potential revenue (<span className="text-blue-600 font-semibold">{potentialRevenue}</span>). This indicates challenges in the 
            long-term user charges sector that need to be addressed through <span className="text-blue-600 font-semibold">improved compliance monitoring and 
            operational efficiency</span>.
          </p>
        );
      }
      
      default:
        return <p className="text-gray-700 leading-relaxed text-base">No significant gaps identified in the analysis.</p>;
    }
  }, [getLargestGap, propertyTaxMetrics, licenseRawMetrics, mixedChargeRawMetrics, shortTermRawMetrics, longTermRawMetrics, selectedCountry]);

  // Add getLargestBreakdownGap function
  const getLargestBreakdownGap = useMemo(() => {
    const totalRegistrationGap = (propertyTaxMetrics?.gapBreakdown?.registrationGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.registrationGap || 0);

    const totalComplianceGap = (propertyTaxMetrics?.gapBreakdown?.complianceGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.complianceGap || 0) +
      (shortTermRawMetrics?.gapBreakdown?.complianceGap || 0) +
      (longTermRawMetrics?.gapBreakdown?.complianceGap || 0);

    const totalAssessmentGap = (propertyTaxMetrics?.gapBreakdown?.assessmentGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.assessmentGap || 0);

    const totalRateGap = (shortTermRawMetrics?.gapBreakdown?.rateGap || 0) +
      (longTermRawMetrics?.gapBreakdown?.rateGap || 0);

    const gaps = [
      { name: 'Registration Gap', value: totalRegistrationGap },
      { name: 'Compliance Gap', value: totalComplianceGap },
      { name: 'Assessment Gap', value: totalAssessmentGap },
      { name: 'Rate Gap', value: totalRateGap }
    ];
    
    return gaps.reduce((max, current) => 
      current.value > max.value ? current : max
    ).name;
  }, [
    propertyTaxMetrics?.gapBreakdown,
    licenseRawMetrics?.gapBreakdown,
    shortTermRawMetrics?.gapBreakdown,
    longTermRawMetrics?.gapBreakdown
  ]);

  // Get breakdown analysis text
  const getBreakdownAnalysisText = useMemo(() => {
    switch(getLargestBreakdownGap) {
      case 'Registration Gap':
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            <span className="text-blue-600 font-semibold">The total Registration gap</span> emerges as the largest contributing breakdown gap. 
            This indicates that there is a substantial discrepancy between the number of entities or properties legally required to be registered 
            for taxation and those that have actually completed the Registration process. This gap signifies that a significant portion of 
            potential taxpayers remains <span className="text-blue-600 font-semibold">unregistered or under-registered</span>.
          </p>
        );
      
      case 'Compliance Gap':
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            <span className="text-blue-600 font-semibold">The Total Compliance Gap</span> emerges as the most substantial breakdown gap. 
            This suggests that there is a significant shortfall in revenue collection due to non-compliance with tax obligations among registered 
            entities or properties. The compliance gap underscores the need for <span className="text-blue-600 font-semibold">robust enforcement 
            mechanisms, clear communication of tax obligations, and proactive measures</span> to ensure that all taxpayers meet their responsibilities.
          </p>
        );
      
      case 'Assessment Gap':
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            The analysis reveals that <span className="text-blue-600 font-semibold">the Total Assessment Gap</span> is the largest breakdown gap 
            contributing to this challenge. This gap signifies a notable difference between the assessed value of properties or entities for taxation 
            purposes and their actual market value. The presence of the Total Assessment Gap indicates that our 
            <span className="text-blue-600 font-semibold"> valuation processes may require refinement and standardization</span>.
          </p>
        );
      
      case 'Rate Gap':
        return (
          <p className="text-gray-700 leading-relaxed text-base">
            <span className="text-blue-600 font-semibold">The Total Rate Gap</span> stands out as the largest contributing breakdown gap. 
            This highlights a misalignment between the established tax rates and the actual market conditions or taxpayer expectations. To bridge 
            this gap, the government needs to <span className="text-blue-600 font-semibold">review the rate structures comprehensively, ensuring 
            they are competitive, fair, and reflective of current economic realities</span>.
          </p>
        );
      
      default:
        return <p className="text-gray-700 leading-relaxed text-base">No significant breakdown gaps identified in the analysis.</p>;
    }
  }, [getLargestBreakdownGap]);

  // Add Stream Gap Analysis chart data
  const streamGapChartData = useMemo(() => {
    return {
      labels: ['Stream Gap Analysis'],
      datasets: [
        {
          label: 'Property Tax Gap',
          data: [propertyTaxMetrics?.gap || 0],
          backgroundColor: 'rgba(220, 53, 69, 0.9)', // Darker red
          borderColor: 'rgb(220, 53, 69)',
          borderWidth: 0
        },
        {
          label: 'License Gap',
          data: [licenseRawMetrics?.gap || 0],
          backgroundColor: 'rgba(0, 123, 255, 0.9)', // Darker blue
          borderColor: 'rgb(0, 123, 255)',
          borderWidth: 0
        },
        {
          label: 'Mixed Fees Gap',
          data: [mixedChargeRawMetrics?.gap || 0],
          backgroundColor: 'rgba(255, 193, 7, 0.9)', // Darker yellow
          borderColor: 'rgb(255, 193, 7)',
          borderWidth: 0
        },
        {
          label: 'Short-term User Charge Gap',
          data: [shortTermRawMetrics?.gap || 0],
          backgroundColor: 'rgba(32, 201, 151, 0.9)', // Darker teal
          borderColor: 'rgb(32, 201, 151)',
          borderWidth: 0
        },
        {
          label: 'Long-term User Charge Gap',
          data: [longTermRawMetrics?.gap || 0],
          backgroundColor: 'rgba(111, 66, 193, 0.9)', // Darker purple
          borderColor: 'rgb(111, 66, 193)',
          borderWidth: 0
        },
        {
          label: 'Other OSRs Potential',
          data: [metrics.totalPotentialOtherOSRs || 0],
          backgroundColor: 'rgba(253, 126, 20, 0.9)', // Darker orange
          borderColor: 'rgb(253, 126, 20)',
          borderWidth: 0
        }
      ]
    };
  }, [
    propertyTaxMetrics?.gap,
    licenseRawMetrics?.gap,
    mixedChargeRawMetrics?.gap,
    shortTermRawMetrics?.gap,
    longTermRawMetrics?.gap,
    metrics.totalPotentialOtherOSRs
  ]);

  const streamGapChartOptions = useMemo(() => ({
    indexAxis: 'x' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
          lineWidth: 0.5
        },
        ticks: {
          callback: (value: number) => `${currencySymbol} ${formatLargeNumber(value)}`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${currencySymbol} ${formatLargeNumber(value)}`;
          }
        }
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Stream Gap Analysis',
        font: {
          size: 16,
          family: "'Segoe UI', sans-serif",
          weight: '600'
        },
        padding: {
          bottom: 30
        }
      }
    }
  }), [selectedCountry]);

  // Add Comparative Summary of Gaps chart data
  const comparativeGapChartData = useMemo(() => {
    return {
      labels: [
        'Property Tax Registration Gap',
        'Property Tax Compliance Gap',
        'Property Tax Assessment Gap',
        'Licenses Registration Gap',
        'Licenses Compliance Gap',
        'Licenses Assessment Gap',
        'Short-term User Charge Compliance Gap',
        'Short-term User Charge Rate Gap',
        'Long-term User Charge Compliance Gap',
        'Long-term User Charge Rate Gap'
      ],
      datasets: [{
        data: [
          propertyTaxMetrics?.gapBreakdown?.registrationGap || 0,
          propertyTaxMetrics?.gapBreakdown?.complianceGap || 0,
          propertyTaxMetrics?.gapBreakdown?.assessmentGap || 0,
          licenseRawMetrics?.gapBreakdown?.registrationGap || 0,
          licenseRawMetrics?.gapBreakdown?.complianceGap || 0,
          licenseRawMetrics?.gapBreakdown?.assessmentGap || 0,
          shortTermRawMetrics?.gapBreakdown?.complianceGap || 0,
          shortTermRawMetrics?.gapBreakdown?.rateGap || 0,
          longTermRawMetrics?.gapBreakdown?.complianceGap || 0,
          longTermRawMetrics?.gapBreakdown?.rateGap || 0
        ],
        backgroundColor: [
          'rgba(235, 68, 68, 0.9)',    // Property Tax Registration - Red
          'rgba(239, 98, 98, 0.9)',    // Property Tax Compliance
          'rgba(248, 113, 113, 0.9)',  // Property Tax Assessment
          'rgba(59, 130, 246, 0.9)',   // Licenses Registration - Blue
          'rgba(96, 165, 250, 0.9)',   // Licenses Compliance
          'rgba(147, 197, 253, 0.9)',  // Licenses Assessment
          'rgba(34, 197, 94, 0.9)',    // Short-term Compliance - Green
          'rgba(74, 222, 128, 0.9)',   // Short-term Rate
          'rgba(139, 92, 246, 0.9)',   // Long-term Compliance - Purple
          'rgba(167, 139, 250, 0.9)'   // Long-term Rate
        ],
        borderColor: [
          'rgb(235, 68, 68)',     // Property Tax
          'rgb(239, 98, 98)',
          'rgb(248, 113, 113)',
          'rgb(59, 130, 246)',    // Licenses
          'rgb(96, 165, 250)',
          'rgb(147, 197, 253)',
          'rgb(34, 197, 94)',     // Short-term
          'rgb(74, 222, 128)',
          'rgb(139, 92, 246)',    // Long-term
          'rgb(167, 139, 250)'
        ],
        borderWidth: 1
      }]
    };
  }, [
    propertyTaxMetrics?.gapBreakdown,
    licenseRawMetrics?.gapBreakdown,
    shortTermRawMetrics?.gapBreakdown,
    longTermRawMetrics?.gapBreakdown
  ]);

  const comparativeGapChartOptions = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
          lineWidth: 0.5
        },
        ticks: {
          callback: (value: number) => `${currencySymbol} ${formatLargeNumber(value)}`
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x || 0;
            return `${currencySymbol} ${formatLargeNumber(value)}`;
          }
        }
      },
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Comparative Summary of Gaps',
        font: {
          size: 16,
          family: "'Segoe UI', sans-serif",
          weight: '600'
        },
        padding: {
          bottom: 30
        }
      }
    }
  }), [selectedCountry]);

  // Add total gaps breakdown chart data
  const totalGapsBreakdownChartData = useMemo(() => {
    const totalRegistrationGap = (propertyTaxMetrics?.gapBreakdown?.registrationGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.registrationGap || 0);

    const totalComplianceGap = (propertyTaxMetrics?.gapBreakdown?.complianceGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.complianceGap || 0) +
      (shortTermRawMetrics?.gapBreakdown?.complianceGap || 0) +
      (longTermRawMetrics?.gapBreakdown?.complianceGap || 0) +
      (mixedChargeRawMetrics?.gapBreakdown?.complianceGap || 0);

    const totalAssessmentGap = (propertyTaxMetrics?.gapBreakdown?.assessmentGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.assessmentGap || 0);

    const totalRateGap = (propertyTaxMetrics?.gapBreakdown?.rateGap || 0) +
      (licenseRawMetrics?.gapBreakdown?.rateGap || 0) +
      (shortTermRawMetrics?.gapBreakdown?.rateGap || 0) +
      (longTermRawMetrics?.gapBreakdown?.rateGap || 0) +
      (mixedChargeRawMetrics?.gapBreakdown?.rateGap || 0);

    return {
      labels: ['Registration Gap', 'Compliance Gap', 'Assessment Gap', 'Rate Gap'],
      datasets: [{
        data: [totalRegistrationGap, totalComplianceGap, totalAssessmentGap, totalRateGap],
        backgroundColor: [
          'rgba(235, 68, 68, 0.9)',    // Red
          'rgba(59, 130, 246, 0.9)',   // Blue
          'rgba(34, 197, 94, 0.9)',    // Green
          'rgba(139, 92, 246, 0.9)',   // Purple
        ],
        borderColor: [
          'rgb(235, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1
      }]
    };
  }, [
    propertyTaxMetrics?.gapBreakdown,
    licenseRawMetrics?.gapBreakdown,
    shortTermRawMetrics?.gapBreakdown,
    longTermRawMetrics?.gapBreakdown,
    mixedChargeRawMetrics?.gapBreakdown
  ]);

  const totalGapsBreakdownChartOptions = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
          lineWidth: 0.5
        },
        ticks: {
          callback: (value: number) => `${currencySymbol} ${formatLargeNumber(value)}`
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || context.label || '';
            const value = context.parsed.x || 0;
            return `${label}: ${currencySymbol} ${formatLargeNumber(value)}`;
          }
        }
      },
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Total Gaps Breakdown Analysis',
        font: {
          size: 16,
          family: "'Segoe UI', sans-serif",
          weight: '600'
        },
        padding: {
          bottom: 30
        }
      }
    }
  }), [selectedCountry]);

  // Add Formulas Section Component
  const FormulasSection = () => {
    return (
      <div className="col-span-12 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Gap Analysis Formulas</h3>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsFormulasExpanded(!isFormulasExpanded)}
            aria-label={isFormulasExpanded ? "Collapse formulas" : "Expand formulas"}
          >
            {isFormulasExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {isFormulasExpanded && (
          <div className="p-6 space-y-8">
            {/* Total Potential Revenue */}
            <div>
              <h4 className="text-gray-700 text-lg mb-2">Total Potential Revenue</h4>
              <p className="text-gray-600 mb-4">
                Combined potential revenue from all top 5 OSR modules
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <p className="font-mono">
                  <span className="text-purple-600">Total Potential Revenue</span> = <span className="text-green-600">Long-term User Charge Module Total Potential Revenue</span> + <span className="text-green-600">Short-term User Charge Module Total Potential Revenue</span> + <span className="text-green-600">Mixed User Charge Module Total Potential Revenue</span> + <span className="text-green-600">License Module Total Potential Revenue</span> + <span className="text-green-600">Property Tax Module Total Potential Revenue</span>
                </p>
              </div>
            </div>

            {/* Total Gap */}
            <div>
              <h4 className="text-gray-700 text-lg mb-2">Total Gap Across top 5 OSRs</h4>
              <p className="text-gray-600 mb-4">
                Combined revenue loss from all gaps in top 5 OSR modules
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <p className="font-mono">
                  <span className="text-purple-600">Total Gap</span> = <span className="text-blue-600">Total Gap Long-term User Fees</span> + <span className="text-blue-600">Total Gap Short-term User Fees</span> + <span className="text-blue-600">Total Gap Mixed Fees</span> + <span className="text-blue-600">Total Gap Licenses</span> + <span className="text-blue-600">Total Gap Property</span>
                </p>
              </div>
            </div>

            {/* Total Potential of Other OSRs */}
            <div>
              <h4 className="text-gray-700 text-lg mb-2">Total Potential of Other OSRs</h4>
              <p className="text-gray-600 mb-4">
                Potential revenue calculation for remaining OSRs not in top 5
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <p className="font-mono">
                  <span className="text-purple-600">Total Potential of Other OSRs</span> = <span className="text-orange-600">Other Revenue</span> ÷ (1 − <span className="text-purple-600">Total Potential of Other OSRs</span>)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add state for formulas expansion
  const [isFormulasExpanded, setIsFormulasExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueCard
          title="Total Actual Revenue"
          value={totalActualRevenue}
          description="Current revenue collection"
          color="border-blue-500"
        />
        <RevenueCard
          title="Total Potential Revenue"
          value={totalPotentialRevenue}
          description="Maximum possible revenue"
          color="border-green-500"
        />
        <RevenueCard
          title="Total Revenue Gap"
          value={totalGap}
          description="Revenue collection gap"
          color="border-red-500"
        />
        <RevenueCard
          title="Average Gap Percentage"
          value={averageGapPercentage}
          description="Gap as percentage of potential revenue"
          color="border-red-500"
          isPercentage
        />
        <RevenueCard
          title="Budgeted OSR"
          value={budgetedOSR}
          description="Total budgeted revenue target"
          color="border-teal-500"
        />
        <RevenueCard
          title="Total Top 5 OSR"
          value={totalTop5}
          description="Total revenue from top 5 sources"
          color="border-indigo-500"
        />
        <RevenueCard
          title="Other Revenue"
          value={otherRevenue}
          description="Remaining actual revenue (Actual OSR - Top 5)"
          color="border-amber-500"
        />
        <RevenueCard
          title="Total Potential of Other OSRs"
          value={metrics.totalPotentialOtherOSRs}
          description="Total potential revenue from other OSRs"
          color="border-orange-500"
        />
        <RevenueCard
          title="Total OSR Potential"
          value={totalPotentialRevenue + metrics.totalPotentialOtherOSRs}
          description="Sum of Total Potential Revenue and Total Potential Other OSRs"
          color="border-purple-500"
        />
      </div>

      <div className="flex flex-col space-y-4">


         {/* Add Stream Gap Analysis Chart */}
         <div className="col-span-12 bg-white rounded-lg shadow p-6">
          <div className="h-[500px]">
            <Bar data={streamGapChartData} options={streamGapChartOptions} />
          </div>
        </div>

        {/* Add Formulas Section before the charts */}
        <FormulasSection />
   {/* Add Text Analysis Section */}
   <div className="col-span-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Gap Analysis Summary</h3>
          <div className="prose max-w-none bg-blue-50 p-4 rounded-lg">
            {getAnalysisText}
          </div>
        </div>
         {/* Add Total Gaps Breakdown Chart */}
         <div className="col-span-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Total Gaps Breakdown Analysis
          </h3>
            
          {/* Chart */}
          <div className="w-full h-[400px] mb-6">
            <Bar data={totalGapsBreakdownChartData} options={totalGapsBreakdownChartOptions} />
          </div>

          {/* Summary Grid */}
          <TotalGapsGrid totalGapsByType={{
            totalRegistrationGap: (propertyTaxMetrics?.gapBreakdown?.registrationGap || 0) +
              (licenseRawMetrics?.gapBreakdown?.registrationGap || 0),
            totalComplianceGap: (propertyTaxMetrics?.gapBreakdown?.complianceGap || 0) +
              (licenseRawMetrics?.gapBreakdown?.complianceGap || 0) +
              (shortTermRawMetrics?.gapBreakdown?.complianceGap || 0) +
              (longTermRawMetrics?.gapBreakdown?.complianceGap || 0) +
              (mixedChargeRawMetrics?.gapBreakdown?.complianceGap || 0),
            totalAssessmentGap: (propertyTaxMetrics?.gapBreakdown?.assessmentGap || 0) +
              (licenseRawMetrics?.gapBreakdown?.assessmentGap || 0),
            totalRateGap: (propertyTaxMetrics?.gapBreakdown?.rateGap || 0) +
              (licenseRawMetrics?.gapBreakdown?.rateGap || 0) +
              (shortTermRawMetrics?.gapBreakdown?.rateGap || 0) +
              (longTermRawMetrics?.gapBreakdown?.rateGap || 0) +
              (mixedChargeRawMetrics?.gapBreakdown?.rateGap || 0),
            totalCombinedGap: (propertyTaxMetrics?.gap || 0) +
              (licenseRawMetrics?.gap || 0) +
              (shortTermRawMetrics?.gap || 0) +
              (longTermRawMetrics?.gap || 0) +
              (mixedChargeRawMetrics?.gap || 0)
          }} />
        </div>

  {/* Add Breakdown Analysis Section */}
  <div className="col-span-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Breakdown Gap Analysis</h3>
          <div className="prose max-w-none bg-blue-50 p-4 rounded-lg">
            {getBreakdownAnalysisText}
          </div>
        </div>

        {/* Add Comparative Summary of Gaps Chart */}
        <div className="col-span-12 bg-white rounded-lg shadow p-6">
          <div className="h-[600px]">
            <Bar data={comparativeGapChartData} options={comparativeGapChartOptions} />
          </div>
        </div>

      

      
     
     
        {showTopOSRConfig && (
          <TopOSRConfigModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            selectedYear={currentYear}
            onSave={handleTopOSRSave}
          />
        )}
      </div>
    </div>
  );
}

export default function TotalEstimateAnalysis(props: TotalEstimateAnalysisProps) {
  return (
    <TotalEstimateProvider>
      <TotalEstimateAnalysisContent {...props} />
    </TotalEstimateProvider>
  );
}
