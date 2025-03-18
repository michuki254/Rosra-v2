'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MixedChargeData, MixedChargeMetrics, ChartOptions } from '../types/mixed-charge-analysis';
import { MixedChargeAnalysisService } from '../services/mixed-charge-analysis.service';
import { useCurrency } from '@/app/context/CurrencyContext';

interface MixedChargeContextType {
  data: MixedChargeData;
  metrics: MixedChargeMetrics;
  chartOptions: ChartOptions;
  showGapFormulas: boolean;
  showRevenueFormulas: boolean;
  setShowGapFormulas: (show: boolean) => void;
  setShowRevenueFormulas: (show: boolean) => void;
  formatCurrency: (amount: number) => string;
  updateData: (newData: Partial<MixedChargeData>) => void;
  formatLargeNumber: (value: number) => string;
  updateMetrics: (field: keyof MixedChargeMetrics, value: any) => void;
}

const defaultData: MixedChargeData = {
  estimatedDailyUsers: 1000,
  actualDailyUsers: 500,
  averageDailyUserFee: 1.5,
  actualDailyUserFee: 1,
  availableMonthlyUsers: 200,
  payingMonthlyUsers: 190,
  averageMonthlyRate: 70,
  actualMonthlyRate: 12
};

// Default metrics values
const defaultMetrics: MixedChargeMetrics = {
  actual: 180000,
  potential: 950000,
  gap: 770000,
  gapBreakdown: {
    complianceGap: 320000,
    rateGap: 280000,
    combinedGaps: 170000
  }
};

const MixedChargeContext = createContext<MixedChargeContextType | undefined>(undefined);

export function MixedChargeProvider({ children }: { children: ReactNode }) {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const [data, setData] = useState<MixedChargeData>(defaultData);
  const [showGapFormulas, setShowGapFormulas] = useState(false);
  const [showRevenueFormulas, setShowRevenueFormulas] = useState(false);
  const [metrics, setMetrics] = useState<MixedChargeMetrics>(defaultMetrics);

  // Update metrics when data changes
  useEffect(() => {
    const calculatedMetrics = MixedChargeAnalysisService.calculateMetrics(data);
    setMetrics(calculatedMetrics);
  }, [data]);

  // Define chart options based on the ChartOptions type
  const chartOptions = {
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: true
        }
      }
    }
  } as ChartOptions;

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

  const formatCurrency = (value: number): string => {
    return `${currencySymbol} ${formatLargeNumber(value)}`;
  };

  const updateData = (newData: Partial<MixedChargeData>) => {
    setData(current => ({
      ...current,
      ...newData
    }));
  };

  const updateMetrics = (field: keyof MixedChargeMetrics, value: any) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MixedChargeContext.Provider value={{
      data,
      metrics,
      chartOptions,
      showGapFormulas,
      showRevenueFormulas,
      setShowGapFormulas,
      setShowRevenueFormulas,
      formatCurrency,
      updateData,
      formatLargeNumber,
      updateMetrics
    }}>
      {children}
    </MixedChargeContext.Provider>
  );
}

export function useMixedCharge() {
  const context = useContext(MixedChargeContext);
  if (!context) {
    throw new Error('useMixedCharge must be used within a MixedChargeProvider');
  }
  return context;
}
