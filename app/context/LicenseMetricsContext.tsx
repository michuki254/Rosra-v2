'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LicenseMetrics {
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: {
    registrationGap: number;
    complianceGap: number;
    assessmentGap: number;
    rateGap: number;
    combinedGaps: number;
  };
}

interface LicenseMetricsContextType {
  metrics: LicenseMetrics;
  updateMetrics: (field: keyof LicenseMetrics, value: any) => void;
}

const defaultMetrics: LicenseMetrics = {
  actual: 332500, // KSh 332.5K
  potential: 3800000, // KSh 3.8M
  gap: 3467500, // KSh 3.4M (rounded)
  potentialLeveraged: 8.75, // 8.75%
  gapBreakdown: {
    registrationGap: 1500000,
    complianceGap: 1000000,
    assessmentGap: 500000,
    rateGap: 300000,
    combinedGaps: 167500
  }
};

const LicenseMetricsContext = createContext<LicenseMetricsContextType | undefined>(undefined);

export function LicenseMetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<LicenseMetrics>(defaultMetrics);

  const updateMetrics = (field: keyof LicenseMetrics, value: any) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LicenseMetricsContext.Provider value={{ metrics, updateMetrics }}>
      {children}
    </LicenseMetricsContext.Provider>
  );
}

export function useLicenseMetrics() {
  const context = useContext(LicenseMetricsContext);
  if (context === undefined) {
    throw new Error('useLicenseMetrics must be used within a LicenseMetricsProvider');
  }
  return context;
} 