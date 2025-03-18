'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AnalysisInputs {
  financialYear: string;
  actualOSR: string;
  budgetedOSR: string;
  population: string;
  gdp: string;
  country?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  state?: string;
}

interface AnalysisContextType {
  inputs: AnalysisInputs;
  updateInputs: (newInputs: Partial<AnalysisInputs>) => void;
  resetInputs: () => void;
}

const defaultInputs: AnalysisInputs = {
  financialYear: '2019',
  actualOSR: '3260000000',
  budgetedOSR: '15500000000',
  population: '5500000',
  gdp: ''
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  // Clear localStorage on first mount to ensure defaults take effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analysisInputs');
    }
  }, []);

  const [inputs, setInputs] = useState<AnalysisInputs>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('analysisInputs');
      return saved ? JSON.parse(saved) : defaultInputs;
    }
    return defaultInputs;
  });

  // Save to localStorage whenever inputs change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('analysisInputs', JSON.stringify(inputs));
    }
  }, [inputs]);

  const updateInputs = useCallback((newInputs: Partial<AnalysisInputs>) => {
    setInputs(prev => {
      // Only update if values actually changed
      const hasChanges = Object.entries(newInputs).some(
        ([key, value]) => prev[key as keyof AnalysisInputs] !== value
      );
      
      if (!hasChanges) {
        return prev;
      }
      
      return {
        ...prev,
        ...newInputs
      };
    });
  }, []);

  const resetInputs = () => {
    setInputs(defaultInputs);
  };

  return (
    <AnalysisContext.Provider value={{ inputs, updateInputs, resetInputs }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
