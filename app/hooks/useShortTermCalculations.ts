import { useState, useCallback, useMemo } from 'react';

export interface ShortTermCategory {
  id: string;
  name: string;
  isExpanded: boolean;
  estimatedDailyFees: number;
  actualDailyFees: number;
  potentialRate: number;
  actualRate: number;
  errors?: {
    estimatedDailyFees?: string;
    actualDailyFees?: string;
    potentialRate?: string;
    actualRate?: string;
    name?: string;
  };
}

export interface ShortTermMetrics {
  categories: ShortTermCategory[];
  totalEstimatedDailyFees?: number;
  totalActualDailyFees?: number;
  actual: number;
  potential: number;
  gap: number;
  potentialLeveraged: number;
  gapBreakdown: {
    registrationGap: number;
    registrationGapPercentage: number;
    complianceGap: number;
    complianceGapPercentage: number;
    assessmentGap: number;
    combinedGaps: number;
    combinedGapsPercentage: number;
  };
}

export const useShortTermCalculations = () => {
  const [categories, setCategories] = useState<ShortTermCategory[]>([
    {
      id: '1',
      name: 'Parking Fees',
      isExpanded: false,
      estimatedDailyFees: 600,
      actualDailyFees: 500,
      potentialRate: 100,
      actualRate: 10
    },
    {
      id: '2',
      name: 'Market Fees',
      isExpanded: false,
      estimatedDailyFees: 100,
      actualDailyFees: 50,
      potentialRate: 50,
      actualRate: 5
    },
    {
      id: '3',
      name: 'Bus Park Fees',
      isExpanded: false,
      estimatedDailyFees: 300,
      actualDailyFees: 150,
      potentialRate: 150,
      actualRate: 20
    }
  ]);

  // Category Management
  const addCategory = useCallback(() => {
    const newCategory: ShortTermCategory = {
      id: String(categories.length + 1),
      name: `Category ${String.fromCharCode(65 + categories.length)}`,
      isExpanded: true,
      estimatedDailyFees: 0,
      actualDailyFees: 0,
      potentialRate: 0,
      actualRate: 0
    };
    setCategories(prev => [...prev, newCategory]);
  }, [categories.length]);

  const validateCategory = (category: ShortTermCategory): ShortTermCategory => {
    const errors: ShortTermCategory['errors'] = {};
    
    if (category.estimatedDailyFees < 0) {
      errors.estimatedDailyFees = 'Must be a positive number';
    }
    if (category.actualDailyFees < 0) {
      errors.actualDailyFees = 'Must be a positive number';
    }
    if (category.actualDailyFees > category.estimatedDailyFees) {
      errors.actualDailyFees = 'Cannot exceed estimated fees';
    }
    if (category.potentialRate < 0) {
      errors.potentialRate = 'Must be a positive number';
    }
    if (category.actualRate < 0) {
      errors.actualRate = 'Must be a positive number';
    }
    if (category.actualRate > category.potentialRate) {
      errors.actualRate = 'Cannot exceed potential rate';
    }
    if (!category.name.trim()) {
      errors.name = 'Name is required';
    }

    return {
      ...category,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  };

  const updateCategory = useCallback((id: string, field: keyof ShortTermCategory, value: number | string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== id) return cat;
      const updatedCategory = { ...cat, [field]: value };
      return validateCategory(updatedCategory);
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

  // Revenue Calculations
  const calculateActualRevenue = useCallback(() => {
    try {
      if (!categories) {
        console.error('Invalid inputs provided to calculateActualRevenue');
        return 0;
      }

      // Formula: Actual Daily Fees × Actual Rate × 365
      return categories.reduce((total, category) => {
        if (!category.actualDailyFees || !category.actualRate) {
          return total;
        }
        return total + (category.actualDailyFees * category.actualRate * 365);
      }, 0);
    } catch (error) {
      console.error('Error calculating actual revenue:', error);
      return 0;
    }
  }, [categories]);

  const calculatePotentialRevenue = useCallback(() => {
    try {
      // Formula: Estimated Daily Fees × Potential Rate × 365
      return categories.reduce((total, category) => {
        const potentialDailyRevenue = category.estimatedDailyFees * category.potentialRate;
        return total + (potentialDailyRevenue * 365); // Annualized
      }, 0);
    } catch (error) {
      console.error('Error calculating potential revenue:', error);
      return 0;
    }
  }, [categories]);

  // Gap Calculations
  const calculateGapBreakdown = useCallback(() => {
    try {
      const potential = calculatePotentialRevenue();
      const actual = calculateActualRevenue();
      
      // Compliance Gap = (Estimated - Actual) × Actual Rate × 365
      const complianceGap = categories.reduce((total, category) => {
        const nonCompliantUsers = category.estimatedDailyFees - category.actualDailyFees;
        return total + (nonCompliantUsers * category.actualRate * 365);
      }, 0);

      // Rate Gap = Actual Daily Fees × (Potential Rate - Actual Rate) × 365
      const rateGap = categories.reduce((total, category) => {
        const rateDiff = category.potentialRate - category.actualRate;
        return total + (category.actualDailyFees * rateDiff * 365);
      }, 0);

      // Total Gap = Potential - Actual
      const totalGap = potential - actual;
      
      // Combined Gaps = Total Gap - (Compliance + Rate)
      const combinedGaps = totalGap - (complianceGap + rateGap);

      // Calculate percentages
      const complianceGapPercentage = potential > 0 ? (complianceGap / potential) * 100 : 0;
      const rateGapPercentage = potential > 0 ? (rateGap / potential) * 100 : 0;
      const combinedGapsPercentage = potential > 0 ? (combinedGaps / potential) * 100 : 0;
      const registrationGapPercentage = potential > 0 ? ((potential - actual) / potential) * 100 : 0;

      return {
        registrationGap: potential - actual,
        registrationGapPercentage,
        complianceGap,
        complianceGapPercentage,
        assessmentGap: 0,
        combinedGaps,
        combinedGapsPercentage
      };
    } catch (error) {
      console.error('Error calculating gap breakdown:', error);
      return {
        registrationGap: 0,
        registrationGapPercentage: 0,
        complianceGap: 0,
        complianceGapPercentage: 0,
        assessmentGap: 0,
        combinedGaps: 0,
        combinedGapsPercentage: 0
      };
    }
  }, [categories, calculateActualRevenue, calculatePotentialRevenue]);

  // Metrics Calculation
  const metrics = useMemo((): ShortTermMetrics => {
    const actual = calculateActualRevenue();
    const potential = calculatePotentialRevenue();
    const gap = potential - actual;
    const potentialLeveraged = potential > 0 ? (actual / potential) * 100 : 0;
    const gapBreakdown = calculateGapBreakdown();

    return {
      categories,
      totalEstimatedDailyFees: categories.reduce((total, category) => total + category.estimatedDailyFees, 0),
      totalActualDailyFees: categories.reduce((total, category) => total + category.actualDailyFees, 0),
      actual,
      potential,
      gap,
      potentialLeveraged,
      gapBreakdown
    };
  }, [calculateActualRevenue, calculatePotentialRevenue, calculateGapBreakdown]);

  return {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory
  };
};
