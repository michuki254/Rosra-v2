'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultLongTermValues } from '../utils/defaultLongTermValues';

export interface LongTermCategory {
  id: string;
  name: string;
  estimatedLeases: number;
  registeredLeases: number;
  potentialRate: number;
  actualRate: number;
  isExpanded: boolean;
}

export interface LongTermMetrics {
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: {
    registrationGapPercentage: number;
    complianceGap: number;
    rateGap: number;
    combinedGaps: number;
  };
}

export interface LongTermContextType {
  categories: LongTermCategory[];
  metrics: LongTermMetrics;
  addCategory: () => void;
  updateCategory: (id: string, field: keyof LongTermCategory, value: any) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  updateMetrics: (field: keyof LongTermMetrics, value: any) => void;
}

const calculateMetrics = (categories: LongTermCategory[]): LongTermMetrics => {
  // Calculate actual revenue (using actual rates and registered leases)
  const actual = categories.reduce((sum, cat) => 
    sum + (cat.registeredLeases * cat.actualRate * 12), 0);

  // Calculate potential revenue (using potential rates and estimated leases)
  const potential = categories.reduce((sum, cat) => 
    sum + (cat.estimatedLeases * cat.potentialRate * 12), 0);

  // Total revenue gap
  const gap = potential - actual;

  // Compliance Gap: Revenue loss from unregistered leases at current rates
  const complianceGap = categories.reduce((sum, cat) => 
    sum + ((cat.estimatedLeases - cat.registeredLeases) * cat.actualRate * 12), 0);

  // Rate Gap: Revenue loss from lower rates on registered leases
  const rateGap = categories.reduce((sum, cat) => 
    sum + (cat.registeredLeases * (cat.potentialRate - cat.actualRate) * 12), 0);

  // Combined Gaps: Additional revenue loss from unregistered leases at higher rates
  const combinedGaps = categories.reduce((sum, cat) => 
    sum + ((cat.estimatedLeases - cat.registeredLeases) * (cat.potentialRate - cat.actualRate) * 12), 0);

  // Calculate registration gap percentage
  const registrationGapPercentage = potential > 0 ? (gap / potential) * 100 : 0;

  return {
    actual,
    potential,
    gap,
    potentialLeveraged: actual > 0 && potential > 0 ? (actual / potential) * 100 : 0,
    gapBreakdown: {
      complianceGap,
      rateGap,
      combinedGaps,
      registrationGapPercentage
    }
  };
};

const LongTermContext = createContext<LongTermContextType | undefined>(undefined);

export function LongTermProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<LongTermCategory[]>(defaultLongTermValues.categories);
  const [metrics, setMetrics] = useState<LongTermMetrics>(() => calculateMetrics(defaultLongTermValues.categories));

  const addCategory = () => {
    const newCategory: LongTermCategory = {
      id: uuidv4(),
      name: 'New Category',
      estimatedLeases: 0,
      registeredLeases: 0,
      potentialRate: 0,
      actualRate: 0,
      isExpanded: false
    };

    setCategories(prev => {
      const newCategories = [...prev, newCategory];
      setMetrics(calculateMetrics(newCategories));
      return newCategories;
    });
  };

  const updateCategory = (id: string, field: keyof LongTermCategory, value: any) => {
    setCategories(prev => {
      const newCategories = prev.map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      );
      setMetrics(calculateMetrics(newCategories));
      return newCategories;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const newCategories = prev.filter(cat => cat.id !== id);
      setMetrics(calculateMetrics(newCategories));
      return newCategories;
    });
  };

  const toggleCategory = (id: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const updateMetrics = (field: keyof LongTermMetrics, value: any) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LongTermContext.Provider value={{
      categories,
      metrics,
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategory,
      updateMetrics
    }}>
      {children}
    </LongTermContext.Provider>
  );
}

export function useLongTerm() {
  const context = useContext(LongTermContext);
  if (context === undefined) {
    throw new Error('useLongTerm must be used within a LongTermProvider');
  }
  return context;
}
