import { MixedChargeData, MixedChargeMetrics } from '../types/mixed-charge-analysis';

export class MixedChargeAnalysisService {
  static calculateMetrics(data: MixedChargeData): MixedChargeMetrics {
    // Calculate actual revenue
    const actualDailyRevenue = data.actualDailyUsers * data.actualDailyUserFee * 365;
    const actualMonthlyRevenue = data.payingMonthlyUsers * data.actualMonthlyRate * 12;
    const actual = actualDailyRevenue + actualMonthlyRevenue || 0;

    // Calculate potential revenue
    const potentialDailyRevenue = data.estimatedDailyUsers * data.averageDailyUserFee * 365;
    const potentialMonthlyRevenue = data.availableMonthlyUsers * data.averageMonthlyRate * 12;
    const potential = potentialDailyRevenue + potentialMonthlyRevenue || 0;

    // Calculate gaps
    const gap = potential - actual || 0;

    // Calculate compliance gap
    const dailyComplianceGap = (data.estimatedDailyUsers - data.actualDailyUsers) * data.actualDailyUserFee * 365 || 0;
    const monthlyComplianceGap = (data.availableMonthlyUsers - data.payingMonthlyUsers) * data.actualMonthlyRate * 12 || 0;
    const complianceGap = dailyComplianceGap + monthlyComplianceGap || 0;

    // Calculate rate gap
    const dailyRateGap = (data.averageDailyUserFee - data.actualDailyUserFee) * data.actualDailyUsers * 365 || 0;
    const monthlyRateGap = (data.averageMonthlyRate - data.actualMonthlyRate) * data.payingMonthlyUsers * 12 || 0;
    const rateGap = dailyRateGap + monthlyRateGap || 0;

    // Calculate combined gaps
    const combinedGaps = gap - (complianceGap + rateGap) || 0;

    // Calculate registration gap percentage
    const registrationGapPercentage = potential !== 0 ? (actual / potential) * 100 : 0;

    return {
      actual,
      potential,
      gap,
      gapBreakdown: {
        complianceGap,
        rateGap,
        combinedGaps,
        registrationGapPercentage
      }
    };
  }

  static formatCurrency(amount: number, currencySymbol: string = '$'): string {
    return `${currencySymbol} ${new Intl.NumberFormat('en-US').format(Math.abs(Math.round(amount)))}`;
  }

  static getChartData(data: MixedChargeData) {
    const metrics = this.calculateMetrics(data);
    return {
      labels: [''],
      datasets: [
        {
          label: 'Actual Revenue',
          data: [metrics.actual],
          backgroundColor: 'rgb(59, 130, 246)', // blue-500
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 0,
        },
        {
          label: 'Total Gap Mixed Fees',
          data: [metrics.gap],
          backgroundColor: 'rgb(249, 115, 22)', // orange-500
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 0,
        }
      ],
    };
  }

  static getGapChartData(data: MixedChargeData) {
    const metrics = this.calculateMetrics(data);
    return {
      labels: [''],
      datasets: [
        {
          label: 'Compliance Gap',
          data: [Math.abs(metrics.gapBreakdown.complianceGap)],
          backgroundColor: 'rgb(59, 130, 246)', // blue-500
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 0,
        },
        {
          label: 'Rate Gap',
          data: [Math.abs(metrics.gapBreakdown.rateGap)],
          backgroundColor: 'rgb(249, 115, 22)', // orange-500
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 0,
        },
        {
          label: 'Combined gaps',
          data: [Math.abs(metrics.gapBreakdown.combinedGaps)],
          backgroundColor: 'rgb(153, 163, 175)', // gray-500
          borderColor: 'rgb(153, 163, 175)',
          borderWidth: 0,
        }
      ],
    };
  }

  static formatDataForDisplay(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  static processInputData(inputData: any): MixedChargeData {
    if (!inputData) {
      return {
        estimatedDailyUsers: 0,
        actualDailyUsers: 0,
        averageDailyUserFee: 0,
        actualDailyUserFee: 0,
        availableMonthlyUsers: 0,
        payingMonthlyUsers: 0,
        averageMonthlyRate: 0,
        actualMonthlyRate: 0
      };
    }

    return {
      estimatedDailyUsers: Number(inputData.estimatedDailyUsers) || 0,
      actualDailyUsers: Number(inputData.actualDailyUsers) || 0,
      averageDailyUserFee: Number(inputData.averageDailyUserFee) || 0,
      actualDailyUserFee: Number(inputData.actualDailyUserFee) || 0,
      availableMonthlyUsers: Number(inputData.availableMonthlyUsers) || 0,
      payingMonthlyUsers: Number(inputData.payingMonthlyUsers) || 0,
      averageMonthlyRate: Number(inputData.averageMonthlyRate) || 0,
      actualMonthlyRate: Number(inputData.actualMonthlyRate) || 0
    };
  }
}
