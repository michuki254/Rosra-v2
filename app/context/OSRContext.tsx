'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { OSRData, REVENUE_TYPES, RevenueType } from '../types/osr';

export const defaultTopOSRData: OSRData[] = [
  {
    revenueSource: 'Land Rates',
    revenueType: REVENUE_TYPES.PROPERTY_TAX,
    actualRevenue: 1500000
  },
  {
    revenueSource: 'Single Business Permit',
    revenueType: REVENUE_TYPES.LICENSE,
    actualRevenue: 375000
  },
  {
    revenueSource: 'Market Fees',
    revenueType: REVENUE_TYPES.MIXED_USER_CHARGE,
    actualRevenue: 209860
  },
  {
    revenueSource: 'Sign Board Promotion',
    revenueType: REVENUE_TYPES.LONG_TERM_USER_CHARGE,
    actualRevenue: 3011250
  },
  {
    revenueSource: 'Rent',
    revenueType: REVENUE_TYPES.LONG_TERM_USER_CHARGE,
    actualRevenue: 492000
  }
];

interface OSRContextType {
  osrData: OSRData[];
  updateOSRData: (data: OSRData[]) => void;
  resetOSRData: () => void;
}

const OSRContext = createContext<OSRContextType | undefined>(undefined);

export function OSRProvider({ children }: { children: React.ReactNode }) {
  const [osrData, setOSRData] = useState<OSRData[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('osrData');
      return saved ? JSON.parse(saved) : defaultTopOSRData;
    }
    return defaultTopOSRData;
  });

  // Save to localStorage whenever osrData changes
  const updateOSRData = useCallback((data: OSRData[]) => {
    if (JSON.stringify(data) !== JSON.stringify(osrData)) {
      setOSRData(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('osrData', JSON.stringify(data));
      }
    }
  }, [osrData]);

  const resetOSRData = useCallback(() => {
    setOSRData(defaultTopOSRData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('osrData');
    }
  }, []);

  return (
    <OSRContext.Provider value={{ osrData, updateOSRData, resetOSRData }}>
      {children}
    </OSRContext.Provider>
  );
}

export function useOSR() {
  const context = useContext(OSRContext);
  if (context === undefined) {
    throw new Error('useOSR must be used within an OSRProvider');
  }
  return context;
}
