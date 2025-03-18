import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { useCurrency } from '@/app/context/CurrencyContext';

interface AnalysisSectionProps {
  title: string;
  children: React.ReactNode;
}

function AnalysisSection({ title, children }: AnalysisSectionProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

export function RevenueAnalysisText() {
  const { metrics } = useMixedCharge();
  const { gapBreakdown } = metrics;
  const percentage = gapBreakdown?.registrationGapPercentage || 0;

  return (
    <AnalysisSection title="Revenue Performance Analysis">
      {percentage < 30 ? (
        <span>
          The Mixed User Charge Revenue Collection faces a <span className="text-red-600 dark:text-red-400">significant challenge</span> as the percentage 
          of potential revenue being leveraged is critically low at <span className="text-red-600 dark:text-red-400">{percentage.toFixed(1)}%</span>. 
          This indicates a substantial opportunity for improvement in both compliance and rate optimization.
        </span>
      ) : percentage < 60 ? (
        <span>
          The Mixed User Charge Revenue Collection is <span className="text-yellow-600 dark:text-yellow-400">performing below optimal levels</span>, 
          currently leveraging <span className="text-yellow-600 dark:text-yellow-400">{percentage.toFixed(1)}%</span> of 
          potential revenue. There is significant room for improvement through enhanced compliance and rate adjustments.
        </span>
      ) : percentage < 85 ? (
        <span>
          The Mixed User Charge Revenue Collection is showing <span className="text-blue-600 dark:text-blue-400">moderate performance</span>, 
          achieving <span className="text-blue-600 dark:text-blue-400">{percentage.toFixed(1)}%</span> of potential revenue. 
          While this indicates reasonable effectiveness, there are still opportunities for optimization.
        </span>
      ) : (
        <span>
          The Mixed User Charge Revenue Collection is <span className="text-green-600 dark:text-green-400">performing exceptionally well</span>, 
          capturing <span className="text-green-600 dark:text-green-400">{percentage.toFixed(1)}%</span> of potential revenue. 
          This demonstrates highly effective compliance and rate management practices.
        </span>
      )}
    </AnalysisSection>
  );
}

export function GapAnalysisText() {
  const { metrics } = useMixedCharge();
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  const { gapBreakdown } = metrics;

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return `${currencySymbol}0`;
    return `${currencySymbol}${Math.abs(value).toLocaleString()}`;
  };

  const gaps = [
    { type: 'Compliance Gap', value: Math.abs(gapBreakdown?.complianceGap || 0) },
    { type: 'Rate Gap', value: Math.abs(gapBreakdown?.rateGap || 0) },
    { type: 'Combined Gaps', value: Math.abs(gapBreakdown?.combinedGaps || 0) }
  ].sort((a, b) => b.value - a.value);

  const largestGap = gaps[0];
  const secondLargestGap = gaps[1];

  return (
    <AnalysisSection title="Gap Analysis Breakdown">
      The analysis reveals that the <span className="font-semibold">{largestGap.type}</span> is the most significant contributor 
      to revenue loss at <span className="text-red-600 dark:text-red-400">{formatCurrency(largestGap.value)}</span>, followed by 
      the <span className="font-semibold">{secondLargestGap.type}</span> at <span className="text-red-600 dark:text-red-400">
      {formatCurrency(secondLargestGap.value)}</span>. 
      {largestGap.type === 'Compliance Gap' ? (
        <span> This suggests that focusing on improving registration compliance should be the primary strategy for revenue enhancement.</span>
      ) : largestGap.type === 'Rate Gap' ? (
        <span> This indicates that optimizing rate structures should be the main focus for revenue improvement.</span>
      ) : (
        <span> This indicates that a comprehensive approach addressing both compliance and rates is needed.</span>
      )}
    </AnalysisSection>
  );
}
