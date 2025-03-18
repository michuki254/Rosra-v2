'use client';

import React, { useState, useEffect } from 'react';
import RevenueCard from './RevenueCard';
import PropertyTaxAnalysis from './PropertyTaxAnalysis';
import LicenseAnalysis from './LicenseAnalysis';
import LongTermUserChargeAnalysis from './LongTermUserChargeAnalysis';
import ShortTermUserChargeAnalysis from './ShortTermUserChargeAnalysis';
import MixedUserChargeAnalysis from './MixedUserChargeAnalysis';

interface RevenueMetrics {
  actual: number;
  potential: number;
  gap: number;
}

interface TotalEstimateAnalysisProps {
  onMetricsChange?: (metrics: RevenueMetrics) => void;
}

export default function TotalEstimateAnalysis({ onMetricsChange }: TotalEstimateAnalysisProps) {
  // State for each revenue stream
  const [propertyTax, setPropertyTax] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [license, setLicense] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [longTerm, setLongTerm] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [shortTerm, setShortTerm] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [mixedCharge, setMixedCharge] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });

  // Calculate totals across all OSRs
  const totalActual = propertyTax.actual + license.actual + longTerm.actual +
    shortTerm.actual + mixedCharge.actual;

  const totalPotential = propertyTax.potential + license.potential + longTerm.potential +
    shortTerm.potential + mixedCharge.potential;

  const totalGap = propertyTax.gap + license.gap + longTerm.gap +
    shortTerm.gap + mixedCharge.gap;

  // Calculate Average Gap Percentage
  const averageGapPercentage = totalPotential > 0 ? (totalGap / totalPotential) * 100 : 0;

  // Update parent component with total metrics
  useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange({
        actual: totalActual,
        potential: totalPotential,
        gap: totalGap
      });
    }
  }, [totalActual, totalPotential, totalGap, onMetricsChange]);

  return (
    <div className="space-y-8">
      {/* Hidden Analysis Components to get metrics */}
      <div className="hidden">
        <PropertyTaxAnalysis onMetricsChange={setPropertyTax} />
        <LicenseAnalysis onMetricsChange={setLicense} />
        <LongTermUserChargeAnalysis onMetricsChange={setLongTerm} />
        <ShortTermUserChargeAnalysis onMetricsChange={setShortTerm} />
        <MixedUserChargeAnalysis onMetricsChange={setMixedCharge} />
      </div>

      {/* Individual OSR Potential Revenue Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Potential Revenue by OSR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevenueCard
            title="Property Tax Potential"
            amount={propertyTax.potential}
          />
          <RevenueCard
            title="License Fees Potential"
            amount={license.potential}
          />
          <RevenueCard
            title="Long Term User Charges Potential"
            amount={longTerm.potential}
          />
          <RevenueCard
            title="Short Term User Charges Potential"
            amount={shortTerm.potential}
          />
          <RevenueCard
            title="Mixed User Charges Potential"
            amount={mixedCharge.potential}
          />
        </div>
      </div>

      {/* Total Revenue Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Total Revenue Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevenueCard
            title="Total Actual Revenue"
            amount={totalActual}
            description="Current annual revenue from all OSRs"
          />
          <RevenueCard
            title="Total Potential Revenue"
            amount={totalPotential}
            description="Maximum possible annual revenue from all OSRs"
          />
          <RevenueCard
            title="Total Revenue Gap"
            amount={totalGap}
            description="Difference between potential and actual revenue"
          />
        </div>
      </div>

      {/* Average Gap Card */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Gap Analysis</h2>
        <div className="grid grid-cols-1 gap-6">
          <RevenueCard
            title="Average Gap Across OSRs"
            amount={averageGapPercentage}
            isPercentage={true}
            description="Total Revenue Gap as a percentage of Total Potential Revenue"
            className={`${
              averageGapPercentage > 50 ? 'bg-red-50 dark:bg-red-900/10' : 
              averageGapPercentage > 25 ? 'bg-yellow-50 dark:bg-yellow-900/10' : 
              'bg-green-50 dark:bg-green-900/10'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
