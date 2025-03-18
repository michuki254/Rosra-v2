'use client';

import React, { createContext, useContext, useState } from 'react';

export interface RosraInputs {
  financialYear: string;
  currency: string;
  state: string;
  actualOSR: string;
  budgetedOSR: string;
  population: string;
  gdp: string;
}

const defaultInputs: RosraInputs = {
  financialYear: '2019',
  currency: 'KSH',
  state: 'Nairobi City',
  actualOSR: '3260000000',
  budgetedOSR: '15500000000',
  population: '5500000',
  gdp: '1710.5',  // Default Kenya GDP per capita in 2019
};

interface RosraContextType {
  inputs: RosraInputs;
  updateInputs: (newInputs: Partial<RosraInputs>) => void;
  resetInputs: () => void;
}

const RosraContext = createContext<RosraContextType | undefined>(undefined);

export function RosraProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<RosraInputs>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rosraInputs');
      return saved ? JSON.parse(saved) : defaultInputs;
    }
    return defaultInputs;
  });

  const updateInputs = (newInputs: Partial<RosraInputs>) => {
    setInputs(prev => {
      const updated = { ...prev, ...newInputs };
      if (typeof window !== 'undefined') {
        localStorage.setItem('rosraInputs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetInputs = () => {
    setInputs(defaultInputs);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rosraInputs');
    }
  };

  return (
    <RosraContext.Provider value={{ inputs, updateInputs, resetInputs }}>
      {children}
    </RosraContext.Provider>
  );
}

export function useRosra() {
  const context = useContext(RosraContext);
  if (context === undefined) {
    throw new Error('useRosra must be used within a RosraProvider');
  }
  return context;
}
