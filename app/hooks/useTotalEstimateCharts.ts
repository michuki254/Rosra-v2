import { useMemo } from 'react';
import { TotalEstimateMetrics } from '../types/total-estimate-analysis';
import { TotalEstimateAnalysisService } from '../services/total-estimate-analysis.service';

export function useTotalEstimateCharts(metrics: TotalEstimateMetrics) {
  const chartData = useMemo(() => {
    const { revenueData } = metrics;
    
    return {
      labels: revenueData.map(d => d.name),
      datasets: [
        {
          label: 'Mixed User Charges',
          data: revenueData.map(d => d['Mixed User Charges']),
          backgroundColor: 'rgb(59, 130, 246)',
        },
        {
          label: 'Short-Term User Charges',
          data: revenueData.map(d => d['Short-Term User Charges']),
          backgroundColor: 'rgb(16, 185, 129)',
        },
        {
          label: 'Long-Term User Charges',
          data: revenueData.map(d => d['Long-Term User Charges']),
          backgroundColor: 'rgb(245, 158, 11)',
        },
        {
          label: 'License Fees',
          data: revenueData.map(d => d['License Fees']),
          backgroundColor: 'rgb(139, 92, 246)',
        },
        {
          label: 'Property Tax',
          data: revenueData.map(d => d['Property Tax']),
          backgroundColor: 'rgb(239, 68, 68)',
        },
      ],
    };
  }, [metrics.revenueData]);

  const pieChartData = useMemo(() => {
    const { osrData } = metrics;
    
    return {
      labels: osrData.map(d => d.revenueSource),
      datasets: [
        {
          data: osrData.map(d => d.actualRevenue),
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
          ],
        },
      ],
    };
  }, [metrics.osrData]);

  const chartOptions = useMemo(() => 
    TotalEstimateAnalysisService.getChartOptions(TotalEstimateAnalysisService.formatNumber),
  []);

  return {
    chartData,
    pieChartData,
    chartOptions
  };
}
