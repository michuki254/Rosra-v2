'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { RevenueStream, TotalEstimateMetrics, OSRData } from '../types/total-estimate-analysis';
import { TotalEstimateAnalysisService } from '../services/total-estimate-analysis.service';

interface TotalEstimateContextType {
  metrics: TotalEstimateMetrics;
  revenueStreams: RevenueStream[];
  topOSRData: OSRData[];
  showTopOSRConfig: boolean;
  setShowTopOSRConfig: (show: boolean) => void;
  updateRevenueStreams: (streams: RevenueStream[]) => void;
  updateTopOSRData: (data: OSRData[]) => void;
}

const defaultTopOSRData: OSRData[] = [
  { revenueSource: 'Land Rates', revenueType: 'Property Tax', actualRevenue: 1500000 },
  { revenueSource: 'Single Business Permits', revenueType: 'License Fees', actualRevenue: 375000 },
  { revenueSource: 'Market Fees', revenueType: 'Short-Term User Charges', actualRevenue: 209860 },
  { revenueSource: 'Parking Fees', revenueType: 'Mixed User Charges', actualRevenue: 3011250 },
  { revenueSource: 'Building Permits', revenueType: 'License Fees', actualRevenue: 492000 }
];

const TotalEstimateContext = createContext<TotalEstimateContextType | undefined>(undefined);

export function TotalEstimateProvider({ children }: { children: ReactNode }) {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [topOSRData, setTopOSRData] = useState<OSRData[]>(defaultTopOSRData);
  const [showTopOSRConfig, setShowTopOSRConfig] = useState(false);

  const metrics = useMemo(() => {
    return TotalEstimateAnalysisService.calculateTotalMetrics(revenueStreams, topOSRData);
  }, [revenueStreams, topOSRData]);

  const updateRevenueStreams = useCallback((streams: RevenueStream[]) => {
    if (JSON.stringify(streams) !== JSON.stringify(revenueStreams)) {
      setRevenueStreams(streams);
    }
  }, [revenueStreams]);

  const updateTopOSRData = useCallback((data: OSRData[]) => {
    if (JSON.stringify(data) !== JSON.stringify(topOSRData)) {
      setTopOSRData(data);
    }
  }, [topOSRData]);

  const value = useMemo(() => ({
    metrics,
    revenueStreams,
    topOSRData,
    showTopOSRConfig,
    setShowTopOSRConfig,
    updateRevenueStreams,
    updateTopOSRData
  }), [
    metrics,
    revenueStreams,
    topOSRData,
    showTopOSRConfig,
    updateRevenueStreams,
    updateTopOSRData
  ]);

  return (
    <TotalEstimateContext.Provider value={value}>
      {children}
    </TotalEstimateContext.Provider>
  );
}

export function useTotalEstimate() {
  const context = useContext(TotalEstimateContext);
  if (!context) {
    throw new Error('useTotalEstimate must be used within a TotalEstimateProvider');
  }
  return context;
}
