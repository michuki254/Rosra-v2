import { useMemo } from 'react';
import { MixedChargeMetrics } from '../types/mixedCharge';

export function useMixedChargeCalculations(metrics: any) {
  const calculatedMetrics = useMemo(() => {
    try {
      if (!metrics?.categories) {
        return {
          actual: 0,
          potential: 0,
          gap: 0,
          gapBreakdown: {
            registrationGap: 0,
            complianceGap: 0,
            assessmentGap: 0,
            rateGap: 0,
            combinedGaps: 0
          }
        };
      }

      const actual = metrics.categories.reduce((total: number, category: any) => {
        return total + ((category.compliantUsers || 0) * (category.actualRate || 0));
      }, 0);

      const potential = metrics.categories.reduce((total: number, category: any) => {
        return total + ((category.estimatedUsers || 0) * (category.potentialRate || 0));
      }, 0);

      const gap = potential - actual;

      const gapBreakdown = {
        registrationGap: metrics.categories.reduce((total: number, category: any) => {
          return total + (((category.estimatedUsers || 0) - (category.registeredUsers || 0)) * (category.potentialRate || 0));
        }, 0),
        complianceGap: metrics.categories.reduce((total: number, category: any) => {
          return total + (((category.registeredUsers || 0) - (category.compliantUsers || 0)) * (category.actualRate || 0));
        }, 0),
        assessmentGap: metrics.categories.reduce((total: number, category: any) => {
          return total + ((category.compliantUsers || 0) * ((category.potentialRate || 0) - (category.actualRate || 0)));
        }, 0),
        rateGap: 0,
        combinedGaps: 0
      };

      gapBreakdown.combinedGaps = gap - (gapBreakdown.registrationGap + gapBreakdown.complianceGap + gapBreakdown.assessmentGap);

      return {
        actual,
        potential,
        gap,
        gapBreakdown
      };
    } catch (error) {
      console.error('Error calculating mixed charge metrics:', error);
      return {
        actual: 0,
        potential: 0,
        gap: 0,
        gapBreakdown: {
          registrationGap: 0,
          complianceGap: 0,
          assessmentGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      };
    }
  }, [metrics]);

  return {
    metrics: calculatedMetrics,
    categories: metrics?.categories ?? []
  };
}
