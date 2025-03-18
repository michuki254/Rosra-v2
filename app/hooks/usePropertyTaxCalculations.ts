import { useMemo } from 'react';
import { Category, Metrics, PropertyTaxMetrics } from '../types/propertyTax';

interface CategoryRevenue {
  registered: number;
  estimatedValue: number;
  taxRate: number;
  revenue: number;
}

export function usePropertyTaxCalculations(metrics: Metrics) {
  const actualRevenue = useMemo(() => {
    if (!metrics?.categories) return 0;
    return metrics.categories.reduce((total, category) => {
      return total + (
        (category.compliantTaxpayers || 0) * 
        (category.averageLandValue || 0) * 
        (category.taxRate || 0)
      );
    }, 0);
  }, [metrics?.categories]);

  const potentialRevenue = useMemo(() => {
    try {
      if (!metrics?.categories || !metrics.totalEstimatedTaxPayers || !metrics.registeredTaxPayers) {
        return 0;
      }

      const { categories, registeredTaxPayers, totalEstimatedTaxPayers } = metrics;
      
      // Calculate revenue for each category
      const categoryRevenues = categories.map(category => ({
        registered: category.registeredTaxpayers || 0,
        estimatedValue: category.estimatedAverageValue || 0,
        taxRate: category.taxRate || 0,
        revenue: (category.registeredTaxpayers || 0) * (category.estimatedAverageValue || 0) * (category.taxRate || 0)
      }));

      const totalRegisteredRevenue = categoryRevenues.reduce((sum, cat) => sum + cat.revenue, 0);
      const registrationRatio = registeredTaxPayers / totalEstimatedTaxPayers;
      
      return totalRegisteredRevenue / registrationRatio;
    } catch (error) {
      console.error('Error calculating potential revenue:', error);
      return 0;
    }
  }, [metrics?.categories, metrics?.registeredTaxPayers, metrics?.totalEstimatedTaxPayers]);

  const gap = useMemo(() => {
    return Math.max(0, potentialRevenue - actualRevenue);
  }, [potentialRevenue, actualRevenue]);

  const gapBreakdown = useMemo(() => {
    try {
      if (!metrics?.categories || !metrics.totalEstimatedTaxPayers || !metrics.registeredTaxPayers) {
        return {
          registrationGap: 0,
          complianceGap: 0,
          assessmentGap: 0,
          rateGap: 0,
          combinedGaps: 0
        };
      }

      // Registration Gap = (Sum of (Compliant × Value × Rate) for each category) ÷ (Registered ÷ Total Estimated)
      const actualRevenueByCategorySum = metrics.categories.reduce((sum, cat) => {
        return sum + (
          (cat.compliantTaxpayers || 0) * 
          (cat.averageLandValue || 0) * 
          (cat.taxRate || 0)
        );
      }, 0);
      
      const registrationRatio = metrics.registeredTaxPayers / metrics.totalEstimatedTaxPayers;
      const registrationGap = Math.max(0, actualRevenueByCategorySum / registrationRatio - actualRevenueByCategorySum);

      // Compliance Gap = Sum of ((Registered - Compliant) * Value * Rate)
      const complianceGap = metrics.categories.reduce((total, category) => {
        return total + Math.max(0, 
          ((category.registeredTaxpayers || 0) - (category.compliantTaxpayers || 0)) * 
          (category.averageLandValue || 0) * 
          (category.taxRate || 0)
        );
      }, 0);

      // Assessment Gap = Sum of (Compliant * (Estimated - Actual) * Rate)
      const assessmentGap = metrics.categories.reduce((total, category) => {
        return total + Math.max(0,
          (category.compliantTaxpayers || 0) * 
          ((category.estimatedAverageValue || 0) - (category.averageLandValue || 0)) * 
          (category.taxRate || 0)
        );
      }, 0);

      const rateGap = 0; // Not applicable for property tax

      const totalGaps = registrationGap + complianceGap + assessmentGap;
      const combinedGaps = Math.max(0, gap - totalGaps);

      return {
        registrationGap,
        complianceGap,
        assessmentGap,
        rateGap,
        combinedGaps
      };
    } catch (error) {
      console.error('Error calculating gap breakdown:', error);
      return {
        registrationGap: 0,
        complianceGap: 0,
        assessmentGap: 0,
        rateGap: 0,
        combinedGaps: 0
      };
    }
  }, [metrics?.categories, metrics?.totalEstimatedTaxPayers, metrics?.registeredTaxPayers, gap]);

  return {
    actualRevenue,
    potentialRevenue,
    gap,
    gapBreakdown
  };
}
