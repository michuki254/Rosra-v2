import { useState, useCallback, useMemo } from 'react';
import { LicenseCategory, LicenseMetrics, GapBreakdown } from '@/app/types/license';
import { LicenseAnalysisService } from '@/app/services/license-analysis.service';

export const useLicenseCalculations = (initialEstimatedLicensees: number = 80000) => {
  const [categories, setCategories] = useState<LicenseCategory[]>([
    {
      id: 'license-1',
      name: 'Business Permits',
      estimatedLicensees: 70000,
      registeredLicensees: 15000,
      compliantLicensees: 10000,
      licenseFee: 35,
      averagePaidLicenseFee: 30,
      isExpanded: false
    },
    {
      id: 'license-2',
      name: 'Health Licenses',
      estimatedLicensees: 5000,
      registeredLicensees: 3000,
      compliantLicensees: 2500,
      licenseFee: 15,
      averagePaidLicenseFee: 10,
      isExpanded: false
    },
    {
      id: 'license-3',
      name: 'Operating Licenses',
      estimatedLicensees: 5000,
      registeredLicensees: 2000,
      compliantLicensees: 1500,
      licenseFee: 10,
      averagePaidLicenseFee: 5,
      isExpanded: false
    }
  ]);

  const addCategory = useCallback((categoryData?: Partial<Omit<LicenseCategory, 'id' | 'isExpanded'>>) => {
    const newCategory: LicenseCategory = {
      id: `license-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: categoryData?.name || `Category ${String.fromCharCode(65 + categories.length)}`,
      estimatedLicensees: categoryData?.estimatedLicensees || 0,
      registeredLicensees: categoryData?.registeredLicensees || 0,
      compliantLicensees: categoryData?.compliantLicensees || 0,
      licenseFee: categoryData?.licenseFee || 0,
      averagePaidLicenseFee: categoryData?.averagePaidLicenseFee || 0,
      isExpanded: true
    };
    setCategories(prev => [...prev, newCategory]);
  }, [categories.length]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<LicenseCategory>) => {
    setCategories(prev =>
      prev.map(category => {
        if (category.id !== categoryId) return category;
        const updatedCategory = { ...category, ...updates };
        const errors = LicenseAnalysisService.validateCategory(updatedCategory);
        if (errors.length) {
          console.warn('Category validation errors:', errors);
          return category;
        }
        return updatedCategory;
      })
    );
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId));
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    );
  }, []);

  const metrics = useMemo(() => {
    const actual = LicenseAnalysisService.calculateActualRevenue(categories);
    const potential = LicenseAnalysisService.calculatePotentialRevenue(categories, initialEstimatedLicensees);
    const gap = potential - actual;
    const gapBreakdown = LicenseAnalysisService.calculateGapBreakdown(
      categories,
      initialEstimatedLicensees,
      actual,
      potential
    );
    const potentialLeveraged = potential > 0 ? (actual / potential) * 100 : 0;

    return {
      actual,
      potential,
      gap,
      potentialLeveraged,
      gapBreakdown,
      analysisMessage: LicenseAnalysisService.getPerformanceMessage(actual, potential)
    };
  }, [categories, initialEstimatedLicensees]);

  return {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategory
  };
};
