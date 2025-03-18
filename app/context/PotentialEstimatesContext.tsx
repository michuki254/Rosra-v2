'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PotentialEstimatesData {
  // Property Tax
  propertyTaxRate: number;
  propertyValue: number;
  numberOfProperties: number;
  
  // License
  licenseRate: number;
  numberOfLicenses: number;
  
  // Short Term User Charge
  shortTermRate: number;
  numberOfShortTermUsers: number;
  
  // Long Term User Charge
  longTermRate: number;
  numberOfLongTermUsers: number;
  
  // Mixed User Charge
  mixedRate: number;
  numberOfMixedUsers: number;
}

interface PotentialEstimatesContextType {
  estimates: PotentialEstimatesData;
  updateEstimates: (newEstimates: Partial<PotentialEstimatesData>) => void;
  resetEstimates: () => void;
}

const defaultEstimates: PotentialEstimatesData = {
  propertyTaxRate: 0,
  propertyValue: 0,
  numberOfProperties: 0,
  licenseRate: 0,
  numberOfLicenses: 0,
  shortTermRate: 0,
  numberOfShortTermUsers: 0,
  longTermRate: 0,
  numberOfLongTermUsers: 0,
  mixedRate: 0,
  numberOfMixedUsers: 0
};

const PotentialEstimatesContext = createContext<PotentialEstimatesContextType>({
  estimates: defaultEstimates,
  updateEstimates: () => {},
  resetEstimates: () => {}
});

export function PotentialEstimatesProvider({ children }: { children: React.ReactNode }) {
  const [estimates, setEstimates] = useState<PotentialEstimatesData>(() => {
    // Try to load saved estimates from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('potentialEstimates');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return defaultEstimates;
  });

  // Save to localStorage whenever estimates change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const estimatesForStorage = Object.entries(estimates).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value === '' ? 0 : value
      }), {} as PotentialEstimatesData);
      localStorage.setItem('potentialEstimates', JSON.stringify(estimatesForStorage));
    }
  }, [estimates]);

  const updateEstimates = (newEstimates: Partial<PotentialEstimatesData>) => {
    setEstimates(prev => ({
      ...prev,
      ...newEstimates
    }));
  };

  const resetEstimates = () => {
    setEstimates(defaultEstimates);
  };

  return (
    <PotentialEstimatesContext.Provider value={{ estimates, updateEstimates, resetEstimates }}>
      {children}
    </PotentialEstimatesContext.Provider>
  );
}

export const usePotentialEstimates = () => useContext(PotentialEstimatesContext);
