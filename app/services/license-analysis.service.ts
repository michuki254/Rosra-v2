import { LicenseCategory, LicenseMetrics, GapBreakdown } from '../types/license';

export class LicenseAnalysisService {
  static validateCategory(category: LicenseCategory): string[] {
    const errors: string[] = [];
    if (category.estimatedLicensees < 0) errors.push('Estimated licensees cannot be negative');
    if (category.registeredLicensees < 0) errors.push('Registered licensees cannot be negative');
    if (category.compliantLicensees < 0) errors.push('Compliant licensees cannot be negative');
    if (category.licenseFee < 0) errors.push('License fee cannot be negative');
    if (category.averagePaidLicenseFee < 0) errors.push('Average paid license fee cannot be negative');
    if (category.compliantLicensees > category.registeredLicensees) {
      errors.push('Compliant licensees cannot exceed registered licensees');
    }
    if (category.registeredLicensees > category.estimatedLicensees) {
      errors.push('Registered licensees cannot exceed estimated licensees');
    }
    return errors;
  }

  static calculateActualRevenue(categories: LicenseCategory[]): number {
    return categories.reduce((total, category) => {
      if (!this.validateCategory(category).length) {
        return total + (category.compliantLicensees * category.averagePaidLicenseFee);
      }
      return total;
    }, 0);
  }

  static calculatePotentialRevenue(categories: LicenseCategory[], totalEstimatedLicensees: number): number {
    if (totalEstimatedLicensees < 0) return 0;

    // First part: Sum of (estimatedLicensees * licenseFee) for each category
    const categoryRevenue = categories.reduce((total, category) => {
      if (!this.validateCategory(category).length) {
        return total + (category.estimatedLicensees * category.licenseFee);
      }
      return total;
    }, 0);

    // Second part: Calculate revenue from unregistered licensees
    const totalRegistered = categories.reduce((sum, cat) => sum + cat.registeredLicensees, 0);
    const unregisteredLicensees = Math.max(0, totalEstimatedLicensees - totalRegistered);
    const averageLicenseFee = categories.length > 0
      ? categories.reduce((sum, cat) => sum + cat.licenseFee, 0) / categories.length
      : 0;

    return categoryRevenue + (unregisteredLicensees * averageLicenseFee);
  }

  static calculateGapBreakdown(
    categories: LicenseCategory[],
    totalEstimatedLicensees: number,
    actual: number,
    potential: number
  ): GapBreakdown {
    if (!categories?.length) {
      return {
        registrationGap: 0,
        complianceGap: 0,
        assessmentGap: 0,
        combinedGaps: 0
      };
    }

    const totalRegistered = categories.reduce((sum, cat) => sum + (cat.registeredLicensees || 0), 0);
    const averageLicenseFee = categories.length > 0
      ? categories.reduce((sum, cat) => sum + (cat.licenseFee || 0), 0) / categories.length
      : 0;

    // Registration Gap = (Total Estimated - Sum of Registered) * Average License Fee
    const registrationGap = Math.max(0, (totalEstimatedLicensees - totalRegistered) * averageLicenseFee);

    // Compliance Gap = Sum of ((Registered - Compliant) * Average Paid Fee)
    const complianceGap = categories.reduce((sum, category) => {
      const complianceDiff = Math.max(0, (category.registeredLicensees || 0) - (category.compliantLicensees || 0));
      return sum + (complianceDiff * (category.averagePaidLicenseFee || 0));
    }, 0);

    // Assessment Gap = (Sum of Estimated * Avg Paid Fee) - (Sum of Compliant * Avg Paid Fee) - Compliance Gap
    const assessmentGap = categories.reduce((sum, category) => {
      const estimatedRevenue = (category.estimatedLicensees || 0) * (category.averagePaidLicenseFee || 0);
      const compliantRevenue = (category.compliantLicensees || 0) * (category.averagePaidLicenseFee || 0);
      const categoryComplianceGap = Math.max(0, (category.registeredLicensees || 0) - (category.compliantLicensees || 0)) * (category.averagePaidLicenseFee || 0);
      return sum + Math.max(0, estimatedRevenue - compliantRevenue - categoryComplianceGap);
    }, 0);

    const gap = Math.max(0, potential - actual);
    const combinedGaps = Math.max(0, gap - (registrationGap + complianceGap + assessmentGap));

    return {
      registrationGap,
      complianceGap,
      assessmentGap,
      combinedGaps
    };
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  static getPerformanceMessage(actual: number, potential: number): string {
    const percentage = potential > 0 ? (actual / potential) * 100 : 0;
    if (percentage >= 90) return 'Excellent revenue performance!';
    if (percentage >= 70) return 'Good revenue performance, but room for improvement.';
    if (percentage >= 50) return 'Moderate revenue performance. Consider improvement strategies.';
    return 'Significant room for revenue improvement. Review and update strategies.';
  }
}
