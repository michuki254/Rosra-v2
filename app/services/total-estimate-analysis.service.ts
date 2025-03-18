import { RevenueStream, RevenueData, OSRData, TotalEstimateMetrics } from '../types/total-estimate-analysis';

export class TotalEstimateAnalysisService {
  static formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null) return '0';
    
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(0);
  }

  static formatCurrency(amount: number, currencySymbol: string = 'KSh'): string {
    return `${currencySymbol} ${this.formatLargeNumber(amount)}`;
  }

  static calculateAverageGapPercentage(totalPotentialRevenue: number, totalGap: number): number {
    if (totalPotentialRevenue === 0) return 0;
    return (totalGap / totalPotentialRevenue) * 100;
  }

  static calculatePotentialOtherOSRs(otherRevenue: number, averageGapPercentage: number): number {
    // If gap percentage is 100% or more, return a reasonable multiple of current revenue
    if (averageGapPercentage >= 100) {
      return otherRevenue * 2; // Double the current revenue as a reasonable maximum
    }
    
    // Calculate potential using the gap percentage, but limit the maximum multiplier
    const multiplier = Math.min(10, 1 / (1 - (averageGapPercentage / 100)));
    return otherRevenue * multiplier;
  }

  static calculateTotalMetrics(revenueStreams: RevenueStream[], osrData: OSRData[], budgetedOSR: number, actualOSR: number): TotalEstimateMetrics {
    // Calculate total actual revenue from OSR data
    const totalActualRevenue = osrData.reduce((sum, item) => sum + item.actualRevenue, 0);

    // Calculate total potential revenue from revenue streams
    const totalPotentialRevenue = revenueStreams.reduce((sum, stream) => sum + (stream.potential || 0), 0);
    const totalGap = totalPotentialRevenue - totalActualRevenue;

    // Calculate average gap percentage from total values
    const averageGapPercentage = totalPotentialRevenue ? (totalGap / totalPotentialRevenue) * 100 : 0;

    // Calculate total Top 5 and other revenue
    const totalTop5 = this.calculateTotalTop5(osrData);
    const otherRevenue = this.calculateOtherRevenue(actualOSR, totalTop5);

    // Calculate potential other OSRs
    const totalPotentialOtherOSRs = this.calculatePotentialOtherOSRs(otherRevenue, averageGapPercentage);

    const gapBreakdown = {
      registrationGap: revenueStreams.reduce((sum, stream) => sum + (stream.gapBreakdown?.registrationGap || 0), 0),
      complianceGap: revenueStreams.reduce((sum, stream) => sum + (stream.gapBreakdown?.complianceGap || 0), 0),
      assessmentGap: revenueStreams.reduce((sum, stream) => sum + (stream.gapBreakdown?.assessmentGap || 0), 0),
      rateGap: revenueStreams.reduce((sum, stream) => sum + (stream.gapBreakdown?.rateGap || 0), 0)
    };

    const revenueData = this.calculateRevenueData(revenueStreams);

    return {
      totalActualRevenue,
      totalPotentialRevenue,
      totalGap,
      averageGapPercentage,
      totalPotentialOtherOSRs,
      budgetedOSR,
      actualOSR,
      revenueStreams,
      gapBreakdown,
      revenueData,
      osrData
    };
  }

  static calculateRevenueData(revenueStreams: RevenueStream[]): RevenueData[] {
    const data: RevenueData[] = [];
    const streamTypes = ['Mixed User Charges', 'Short-Term User Charges', 'Long-Term User Charges', 'License Fees', 'Property Tax'];
    
    streamTypes.forEach(type => {
      const streams = revenueStreams.filter(stream => stream.type === type);
      const total = streams.reduce((sum, stream) => sum + stream.actual, 0);
      
      data.push({
        name: type,
        'Total Revenue': total,
        'Mixed User Charges': type === 'Mixed User Charges' ? total : 0,
        'Short-Term User Charges': type === 'Short-Term User Charges' ? total : 0,
        'Long-Term User Charges': type === 'Long-Term User Charges' ? total : 0,
        'License Fees': type === 'License Fees' ? total : 0,
        'Property Tax': type === 'Property Tax' ? total : 0,
      });
    });

    return data;
  }

  static getChartOptions(formatNumber: (value: number) => string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#6B7280' }
        },
        y: {
          stacked: true,
          grid: { color: '#E5E7EB' },
          ticks: {
            color: '#6B7280',
            callback: formatNumber
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: '#6B7280',
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#111827',
          bodyColor: '#4B5563',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      }
    };
  }

  static calculateTotalTop5(osrData: OSRData[]): number {
    return osrData.slice(0, 5).reduce((sum, item) => sum + item.actualRevenue, 0);
  }

  static calculateOtherRevenue(actualOSR: number, totalTop5: number): number {
    return Math.max(0, actualOSR - totalTop5);
  }

  static formatLargeNumber(value: number): string {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    
    let formattedNumber: string;
    if (absValue >= 1000000000) {
      formattedNumber = `${(absValue / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      formattedNumber = `${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      formattedNumber = `${(absValue / 1000).toFixed(1)}K`;
    } else {
      formattedNumber = absValue.toString();
    }

    return isNegative ? `-${formattedNumber}` : formattedNumber;
  }
}
