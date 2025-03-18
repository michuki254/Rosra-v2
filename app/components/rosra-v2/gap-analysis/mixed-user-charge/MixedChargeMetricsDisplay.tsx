import React from 'react';
import { MixedChargeMetrics } from '@/app/types/mixed-charge-analysis';
import { Card, CardContent } from '@/app/components/ui/card';
import { useCurrency } from '@/app/context/CurrencyContext';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';

interface MixedChargeMetricsDisplayProps {
  metrics: MixedChargeMetrics;
}

export const MixedChargeMetricsDisplay: React.FC<MixedChargeMetricsDisplayProps> = ({ metrics }) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const formatCurrency = (amount: number) => {
    return MixedChargeAnalysisService.formatCurrency(amount, currencySymbol);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Mixed Charge Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Actual Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(metrics.actual)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Potential Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(metrics.potential)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Revenue Gap</p>
              <p className="text-3xl font-bold">{formatCurrency(metrics.gap)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium mt-8">Gap Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium">Compliance Gap</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.gapBreakdown.complianceGap)}</p>
              <p className="text-xs text-gray-500">
                {(metrics.gap > 0 ? (metrics.gapBreakdown.complianceGap / metrics.gap) * 100 : 0).toFixed(1)}% of total gap
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium">Rate Gap</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.gapBreakdown.rateGap)}</p>
              <p className="text-xs text-gray-500">
                {(metrics.gap > 0 ? (metrics.gapBreakdown.rateGap / metrics.gap) * 100 : 0).toFixed(1)}% of total gap
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium">Combined Gaps</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.gapBreakdown.combinedGaps)}</p>
              <p className="text-xs text-gray-500">
                {(metrics.gap > 0 ? (metrics.gapBreakdown.combinedGaps / metrics.gap) * 100 : 0).toFixed(1)}% of total gap
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
