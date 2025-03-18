import { GapBreakdown } from '../types/gap-analysis';

export class TotalEstimateCalculationsService {
  static calculateTotalActualRevenue(metrics: any[]) {
    return metrics.reduce((total, metric) => total + (metric?.actualRevenue || 0), 0);
  }

  static calculateTotalPotentialRevenue(metrics: any[]) {
    return metrics.reduce((total, metric) => total + (metric?.potentialRevenue || 0), 0);
  }

  static calculateTotalGap(totalPotentialRevenue: number, totalActualRevenue: number) {
    return totalPotentialRevenue - totalActualRevenue;
  }

  static calculatePotentialLeveraged(totalActualRevenue: number, totalPotentialRevenue: number) {
    return totalPotentialRevenue > 0 ? totalActualRevenue / totalPotentialRevenue : 0;
  }

  static calculateTotalGapBreakdown(metrics: any[]): GapBreakdown {
    return {
      registrationGap: this.sumGapType(metrics, 'registrationGap'),
      complianceGap: this.sumGapType(metrics, 'complianceGap'),
      assessmentGap: this.sumGapType(metrics, 'assessmentGap'),
      rateGap: this.sumGapType(metrics, 'rateGap'),
      combinedGaps: this.sumGapType(metrics, 'combinedGaps')
    };
  }

  private static sumGapType(metrics: any[], gapType: string): number {
    return metrics.reduce((total, metric) => {
      return total + (metric?.gapBreakdown?.[gapType] || 0);
    }, 0);
  }

  static calculateAllMetrics(componentMetrics: any[]) {
    const totalActualRevenue = this.calculateTotalActualRevenue(componentMetrics);
    const totalPotentialRevenue = this.calculateTotalPotentialRevenue(componentMetrics);
    const totalGap = this.calculateTotalGap(totalPotentialRevenue, totalActualRevenue);
    const potentialLeveraged = this.calculatePotentialLeveraged(totalActualRevenue, totalPotentialRevenue);
    const gapBreakdown = this.calculateTotalGapBreakdown(componentMetrics);

    return {
      totalActualRevenue,
      totalPotentialRevenue,
      totalGap,
      potentialLeveraged,
      gapBreakdown
    };
  }
}
