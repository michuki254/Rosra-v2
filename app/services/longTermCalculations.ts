import { LongTermCategory, LongTermMetrics } from '../types/longTerm';

export class LongTermCalculationService {
  static calculateActualRevenue(categories: LongTermCategory[]): number {
    try {
      if (!categories?.length) return 0;
      
      // Formula: Registered Leases × Actual Rate × 12
      return categories.reduce((total, category) => {
        if (!category.registeredLeases || !category.actualRate) return total;
        return total + (category.registeredLeases * category.actualRate * 12);
      }, 0);
    } catch (error) {
      console.error('Error calculating actual revenue:', error);
      return 0;
    }
  }

  static calculatePotentialRevenue(categories: LongTermCategory[]): number {
    try {
      if (!categories?.length) return 0;
      
      // Formula: Estimated Leases × Potential Rate × 12
      return categories.reduce((total, category) => {
        const potentialMonthlyRevenue = category.estimatedLeases * category.potentialRate;
        return total + (potentialMonthlyRevenue * 12); // Annualized
      }, 0);
    } catch (error) {
      console.error('Error calculating potential revenue:', error);
      return 0;
    }
  }

  static calculateGapBreakdown(categories: LongTermCategory[]): LongTermMetrics['gapBreakdown'] {
    try {
      const potential = this.calculatePotentialRevenue(categories);
      const actual = this.calculateActualRevenue(categories);
      
      // Compliance Gap = (Estimated - Registered) × Actual Rate × 12
      const complianceGap = categories.reduce((total, category) => {
        const nonCompliantLeases = category.estimatedLeases - category.registeredLeases;
        return total + (nonCompliantLeases * category.actualRate * 12);
      }, 0);

      // Rate Gap = Registered Leases × (Potential Rate - Actual Rate) × 12
      const rateGap = categories.reduce((total, category) => {
        const rateDiff = category.potentialRate - category.actualRate;
        return total + (category.registeredLeases * rateDiff * 12);
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
        rateGap,
        rateGapPercentage,
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
        rateGap: 0,
        rateGapPercentage: 0,
        combinedGaps: 0,
        combinedGapsPercentage: 0
      };
    }
  }

  static validateCategory(category: LongTermCategory): LongTermCategory {
    const errors: LongTermCategory['errors'] = {};
    
    if (category.estimatedLeases < 0) {
      errors.estimatedLeases = 'Must be a positive number';
    }
    if (category.registeredLeases < 0) {
      errors.registeredLeases = 'Must be a positive number';
    }
    if (category.registeredLeases > category.estimatedLeases) {
      errors.registeredLeases = 'Cannot exceed estimated leases';
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
  }
}
