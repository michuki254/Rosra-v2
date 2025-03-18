'use client';

import React from 'react';

interface PerformanceLevel {
  threshold: number;
  message: (percentage: number, actualRevenue: number, potentialRevenue: number) => JSX.Element;
}

interface RevenuePerformanceMessageProps {
  actualRevenue: number;
  potentialRevenue: number;
  potentialLeveraged: number;
}

const PERFORMANCE_LEVELS: PerformanceLevel[] = [
  {
    threshold: 30,
    message: (percentage: number, actualRevenue: number, potentialRevenue: number) => {
      const gap = potentialRevenue - actualRevenue;
      const formattedGap = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(gap);

      return (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The License Revenue Collection (GOA) faces a{' '}
            <span className="text-red-600 font-medium">significant challenge</span> as the percentage 
            of potential leveraged revenue falls{' '}
            <span className="text-red-600 font-medium">below 30%</span> at the value{' '}
            <span className="text-red-600 font-medium">{percentage.toFixed(2)}%</span>. This indicates 
            a <span className="text-red-600 font-medium">substantial gap</span> between the revenue 
            collected and the total estimated potential revenue. The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> is <span className="text-green-600 font-medium">{formattedGap}</span>. 
            To close the gap, a{' '}
            <span className="text-red-600 font-medium">comprehensive analysis</span> of existing revenue 
            channels, revisions of pricing structures may be required. 
            <span className="font-medium"> However, it's essential to maintain a balanced approach while addressing all revenue streams.</span>
          </p>
        </div>
      );
    }
  },
  {
    threshold: 70,
    message: (percentage: number, actualRevenue: number, potentialRevenue: number) => {
      const gap = potentialRevenue - actualRevenue;
      const formattedGap = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(gap);

      return (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The License Revenue Collection (GOA) shows{' '}
            <span className="text-orange-600 font-medium">moderate performance</span> with{' '}
            <span className="text-orange-600 font-medium">{percentage.toFixed(2)}%</span> of potential 
            revenue being leveraged. While this indicates{' '}
            <span className="text-orange-600 font-medium">some success</span> in revenue collection, 
            there remains <span className="text-orange-600 font-medium">room for improvement</span>. 
            The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> is <span className="text-green-600 font-medium">{formattedGap}</span>. 
            Strategic initiatives to optimize revenue collection processes could help 
            bridge the remaining gap. 
            <span className="font-medium"> However, it's essential to maintain a balanced approach while addressing all revenue streams.</span>
          </p>
        </div>
      );
    }
  },
  {
    threshold: Infinity,
    message: (percentage: number, actualRevenue: number, potentialRevenue: number) => {
      const gap = potentialRevenue - actualRevenue;
      const formattedGap = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(gap);

      return (
        <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
          <p className="text-gray-700">
            The License Revenue Collection (GOA) demonstrates{' '}
            <span className="text-green-600 font-medium">strong performance</span> with{' '}
            <span className="text-green-600 font-medium">{percentage.toFixed(2)}%</span> of potential 
            revenue being leveraged. This <span className="text-green-600 font-medium">high percentage</span>{' '}
            indicates effective revenue collection practices. The <span className="font-medium">largest gap</span> between the <span className="font-medium">actual revenue</span> and <span className="font-medium">estimated potential revenue</span> is <span className="text-green-600 font-medium">{formattedGap}</span>. 
            Maintaining current strategies while monitoring for optimization opportunities is recommended. 
            <span className="font-medium"> However, it's essential to maintain a balanced approach while addressing all revenue streams.</span>
          </p>
        </div>
      );
    }
  }
];

export const RevenuePerformanceMessage: React.FC<RevenuePerformanceMessageProps> = ({
  actualRevenue,
  potentialRevenue,
  potentialLeveraged
}) => {
  const getPerformanceMessage = React.useMemo(() => {
    const performanceLevel = PERFORMANCE_LEVELS.find(
      level => potentialLeveraged < level.threshold
    );
    return performanceLevel?.message(potentialLeveraged, actualRevenue, potentialRevenue);
  }, [potentialLeveraged, actualRevenue, potentialRevenue]);

  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      {getPerformanceMessage}
    </div>
  );
};

// Export the performance levels for testing or reuse
export const PERFORMANCE_THRESHOLDS = {
  LOW: PERFORMANCE_LEVELS[0].threshold,
  MODERATE: PERFORMANCE_LEVELS[1].threshold,
};

export default RevenuePerformanceMessage;
