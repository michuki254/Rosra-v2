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
  const [propertyTaxMetrics, setPropertyTaxMetrics] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [licenseMetrics, setLicenseMetrics] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [longTermMetrics, setLongTermMetrics] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [shortTermMetrics, setShortTermMetrics] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });
  const [mixedChargeMetrics, setMixedChargeMetrics] = useState<RevenueMetrics>({ actual: 0, potential: 0, gap: 0 });

  // Calculate totals across all OSRs
  const totalActual = propertyTaxMetrics.actual + licenseMetrics.actual + longTermMetrics.actual +
    shortTermMetrics.actual + mixedChargeMetrics.actual;

  const totalPotential = propertyTaxMetrics.potential + licenseMetrics.potential + longTermMetrics.potential +
    shortTermMetrics.potential + mixedChargeMetrics.potential;

  const totalGap = propertyTaxMetrics.gap + licenseMetrics.gap + longTermMetrics.gap +
    shortTermMetrics.gap + mixedChargeMetrics.gap;

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
        <PropertyTaxAnalysis onMetricsChange={setPropertyTaxMetrics} />
        <LicenseAnalysis onMetricsChange={setLicenseMetrics} />
        <LongTermUserChargeAnalysis onMetricsChange={setLongTermMetrics} />
        <ShortTermUserChargeAnalysis onMetricsChange={setShortTermMetrics} />
        <MixedUserChargeAnalysis onMetricsChange={setMixedChargeMetrics} />
      </div>

      {/* Individual OSR Potential Revenue Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Potential Revenue by OSR
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevenueCard
            title="Property Tax Potential"
            amount={propertyTaxMetrics.potential}
          />
          <RevenueCard
            title="License Fees Potential"
            amount={licenseMetrics.potential}
          />
          <RevenueCard
            title="Long Term User Charges Potential"
            amount={longTermMetrics.potential}
          />
          <RevenueCard
            title="Short Term User Charges Potential"
            amount={shortTermMetrics.potential}
          />
          <RevenueCard
            title="Mixed User Charges Potential"
            amount={mixedChargeMetrics.potential}
          />
        </div>
      </div>

      {/* Total Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard
          title="Total Actual Revenue"
          amount={totalActual}
          className="border-l-4 border-blue-500"
        />
        <RevenueCard
          title="Total Potential Revenue"
          amount={totalPotential}
          className="border-l-4 border-orange-500"
        />
        <RevenueCard
          title="Total Revenue Gap"
          amount={totalGap}
          className="border-l-4 border-purple-500"
        />
      </div>
    </div>
  );
}
