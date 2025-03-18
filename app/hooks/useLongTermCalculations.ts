import { useState, useCallback, useMemo } from 'react';
import { LongTermCategory, LongTermMetrics } from '../types/longTerm';
import { LongTermCalculationService } from '../services/longTermCalculations';

export const useLongTermCalculations = () => {
  const [categories, setCategories] = useState<LongTermCategory[]>([
    {
      id: '1',
      name: 'Residential Leases',
      isExpanded: false,
      estimatedLeases: 100,
      registeredLeases: 80,
      potentialRate: 5000,
      actualRate: 3000
    },
    {
      id: '2',
      name: 'Commercial Leases',
      isExpanded: false,
      estimatedLeases: 50,
      registeredLeases: 30,
      potentialRate: 3000,
      actualRate: 2000
    },
    {
      id: '3',
      name: 'Agricultural Leases',
      isExpanded: false,
      estimatedLeases: 75,
      registeredLeases: 60,
      potentialRate: 4000,
      actualRate: 2500
    }
  ]);

  // Category Management
  const addCategory = useCallback(() => {
    const newCategory: LongTermCategory = {
      id: String(categories.length + 1),
      name: `Land Lease ${categories.length + 1}`,
      isExpanded: true,
      estimatedLeases: 0,
      registeredLeases: 0,
      potentialRate: 0,
      actualRate: 0
    };
    setCategories(prev => [...prev, newCategory]);
  }, [categories.length]);

  const updateCategory = useCallback((id: string, field: keyof LongTermCategory, value: number | string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== id) return cat;
      const updatedCategory = { ...cat, [field]: value };
      return LongTermCalculationService.validateCategory(updatedCategory);
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  }, []);

  // Metrics Calculations
  const metrics = useMemo<LongTermMetrics>(() => {
    const actual = LongTermCalculationService.calculateActualRevenue(categories);
    const potential = LongTermCalculationService.calculatePotentialRevenue(categories);
    const gapBreakdown = LongTermCalculationService.calculateGapBreakdown(categories);

    return {
      actual,
      potential,
      gap: potential - actual,
      potentialLeveraged: (actual / potential) * 100,
      gapBreakdown
    };
  }, [categories]);

  return {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory
  };
};
