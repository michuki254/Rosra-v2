import React from 'react';
import { MixedChargeData, MixedChargeMetrics } from '@/app/types/mixed-charge-analysis';
import { useCurrency } from '@/app/context/CurrencyContext';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';

interface MixedChargeRevenueAnalysisProps {
  data: MixedChargeData;
  metrics: MixedChargeMetrics;
}

export const MixedChargeRevenueAnalysis: React.FC<MixedChargeRevenueAnalysisProps> = ({ data, metrics }) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const formatCurrency = (amount: number) => {
    return MixedChargeAnalysisService.formatCurrency(amount, currencySymbol);
  };

  // Calculate daily revenue
  const actualDailyRevenue = data.actualDailyUsers * data.actualDailyUserFee * 365;
  const potentialDailyRevenue = data.estimatedDailyUsers * data.averageDailyUserFee * 365;
  const dailyGap = potentialDailyRevenue - actualDailyRevenue;
  
  // Calculate monthly revenue
  const actualMonthlyRevenue = data.payingMonthlyUsers * data.actualMonthlyRate * 12;
  const potentialMonthlyRevenue = data.availableMonthlyUsers * data.averageMonthlyRate * 12;
  const monthlyGap = potentialMonthlyRevenue - actualMonthlyRevenue;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Revenue Analysis</h3>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>
          The total actual revenue is {formatCurrency(metrics.actual)}, which is {(metrics.potential > 0 ? (metrics.actual / metrics.potential * 100).toFixed(1) : '0')}% 
          of the potential revenue of {formatCurrency(metrics.potential)}.
        </p>
        
        <h4>Daily User Revenue</h4>
        
        <ul>
          <li>
            <strong>Actual Daily Revenue:</strong> {formatCurrency(actualDailyRevenue)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.actualDailyUsers.toLocaleString()} daily users paying {formatCurrency(data.actualDailyUserFee)} each per day.
            </p>
          </li>
          
          <li>
            <strong>Potential Daily Revenue:</strong> {formatCurrency(potentialDailyRevenue)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.estimatedDailyUsers.toLocaleString()} potential daily users paying {formatCurrency(data.averageDailyUserFee)} each per day.
            </p>
          </li>
          
          <li>
            <strong>Daily Revenue Gap:</strong> {formatCurrency(dailyGap)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This represents {(metrics.gap > 0 ? (dailyGap / metrics.gap * 100).toFixed(1) : '0')}% of the total revenue gap.
            </p>
          </li>
        </ul>
        
        <h4>Monthly User Revenue</h4>
        
        <ul>
          <li>
            <strong>Actual Monthly Revenue:</strong> {formatCurrency(actualMonthlyRevenue)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.payingMonthlyUsers.toLocaleString()} monthly users paying {formatCurrency(data.actualMonthlyRate)} each per month.
            </p>
          </li>
          
          <li>
            <strong>Potential Monthly Revenue:</strong> {formatCurrency(potentialMonthlyRevenue)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.availableMonthlyUsers.toLocaleString()} potential monthly users paying {formatCurrency(data.averageMonthlyRate)} each per month.
            </p>
          </li>
          
          <li>
            <strong>Monthly Revenue Gap:</strong> {formatCurrency(monthlyGap)}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This represents {(metrics.gap > 0 ? (monthlyGap / metrics.gap * 100).toFixed(1) : '0')}% of the total revenue gap.
            </p>
          </li>
        </ul>
        
        <h4>Recommendations</h4>
        
        <p>
          Based on the revenue analysis, the following strategies could help increase revenue:
        </p>
        
        <ul>
          <li>
            <strong>Increase daily users:</strong> Implement marketing strategies to attract more daily users.
          </li>
          <li>
            <strong>Optimize daily rates:</strong> Consider adjusting daily rates to maximize revenue without deterring users.
          </li>
          <li>
            <strong>Convert to monthly users:</strong> Encourage daily users to switch to monthly subscriptions for more stable revenue.
          </li>
          <li>
            <strong>Improve monthly retention:</strong> Implement strategies to retain monthly subscribers for longer periods.
          </li>
        </ul>
      </div>
    </div>
  );
};
