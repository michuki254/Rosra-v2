import { create } from 'zustand';
import { RevenueType } from '../types/analysis';

interface RevenueMetrics {
  actualRevenue: number;
  potentialRevenue: number;
  gap: number;
  gapBreakdown?: {
    registrationGap: number;
    complianceGap: number;
    assessmentGap: number;
    rateGap: number;
    combinedGaps: number;
  };
}

interface MetricsState {
  metrics: Record<RevenueType, RevenueMetrics>;
  updateMetrics: (type: RevenueType, metrics: RevenueMetrics) => void;
  resetMetrics: () => void;
}

const initialMetrics: RevenueMetrics = {
  actualRevenue: 0,
  potentialRevenue: 0,
  gap: 0
};

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: {
    propertyTax: { ...initialMetrics },
    license: { ...initialMetrics },
    shortTermUserCharge: { ...initialMetrics },
    longTermUserCharge: { ...initialMetrics },
    mixedUserCharge: { ...initialMetrics }
  },
  updateMetrics: (type, newMetrics) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        [type]: newMetrics
      }
    })),
  resetMetrics: () =>
    set({
      metrics: {
        propertyTax: { ...initialMetrics },
        license: { ...initialMetrics },
        shortTermUserCharge: { ...initialMetrics },
        longTermUserCharge: { ...initialMetrics },
        mixedUserCharge: { ...initialMetrics }
      }
    })
}));
