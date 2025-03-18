import React from 'react';
import { MixedChargeMetrics } from '@/app/types/mixed-charge-analysis';
import { useCurrency } from '@/app/context/CurrencyContext';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';

interface MixedChargeGapAnalysisProps {
  metrics: MixedChargeMetrics;
}

export const MixedChargeGapAnalysis: React.FC<MixedChargeGapAnalysisProps> = ({ metrics }) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const formatCurrency = (amount: number) => {
    return MixedChargeAnalysisService.formatCurrency(amount, currencySymbol);
  };

  const compliancePercentage = metrics.gap > 0 
    ? (metrics.gapBreakdown.complianceGap / metrics.gap * 100).toFixed(1) 
    : '0';
  
  const ratePercentage = metrics.gap > 0 
    ? (metrics.gapBreakdown.rateGap / metrics.gap * 100).toFixed(1) 
    : '0';
  
  const combinedPercentage = metrics.gap > 0 
    ? (metrics.gapBreakdown.combinedGaps / metrics.gap * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Gap Analysis</h3>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>
          The total revenue gap is {formatCurrency(metrics.gap)}, which represents the difference 
          between the potential revenue of {formatCurrency(metrics.potential)} and the actual 
          revenue of {formatCurrency(metrics.actual)}.
        </p>
        
        <h4>Gap Breakdown</h4>
        
        <ul>
          <li>
            <strong>Compliance Gap:</strong> {formatCurrency(metrics.gapBreakdown.complianceGap)} ({compliancePercentage}% of total gap)
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This represents revenue lost due to users not paying the required fees.
            </p>
          </li>
          
          <li>
            <strong>Rate Gap:</strong> {formatCurrency(metrics.gapBreakdown.rateGap)} ({ratePercentage}% of total gap)
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This represents revenue lost due to charging lower rates than the optimal rates.
            </p>
          </li>
          
          <li>
            <strong>Combined Gaps:</strong> {formatCurrency(metrics.gapBreakdown.combinedGaps)} ({combinedPercentage}% of total gap)
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This represents revenue lost due to interactions between multiple gap factors.
            </p>
          </li>
        </ul>
        
        <h4>Recommendations</h4>
        
        <p>
          Based on the analysis, the following strategies could help reduce the revenue gap:
        </p>
        
        <ul>
          <li>
            <strong>Improve compliance:</strong> Implement measures to ensure more users pay the required fees.
          </li>
          <li>
            <strong>Optimize rates:</strong> Adjust rates to be closer to the optimal levels while considering user affordability.
          </li>
          <li>
            <strong>Targeted campaigns:</strong> Focus on specific user segments that contribute most to the revenue gap.
          </li>
        </ul>
      </div>
    </div>
  );
};
