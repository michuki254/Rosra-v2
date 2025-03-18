import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { MetricCard } from '@/app/components/common/MetricCard';

interface CardProps {
  title: string;
  value: number;
  description: string;
  borderColor: string;
  textColor: string;
}

function Card({ title, value, description, borderColor, textColor }: CardProps) {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return `${currencySymbol}0`;
    return `${currencySymbol}${Math.abs(value).toLocaleString()}`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 ${borderColor} shadow-sm`}>
      <h3 className="text-gray-600 dark:text-gray-400 text-base">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {formatCurrency(value)}
      </div>
      <p className={`text-sm ${textColor} mt-1`}>{description}</p>
    </div>
  );
}

export function RevenueSummaryCards() {
  const { metrics, formatCurrency } = useMixedCharge();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Actual Revenue"
        value={formatCurrency(metrics.actual)}
        description="Current collected revenue"
        color="blue"
      />
      <MetricCard
        title="Total Potential Revenue"
        value={formatCurrency(metrics.potential)}
        description="Maximum possible revenue"
        color="green"
      />
      <MetricCard
        title="Total Gap"
        value={formatCurrency(Math.abs(metrics.gap))}
        description="Revenue improvement potential"
        color="red"
      />
    </div>
  );
}

export function GapBreakdownCards() {
  const { metrics, formatCurrency } = useMixedCharge();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Compliance Gap"
        value={formatCurrency(Math.abs(metrics.gapBreakdown.complianceGap))}
        description="Revenue loss from non-compliance"
        color="orange"
      />
      <MetricCard
        title="Rate Gap"
        value={formatCurrency(Math.abs(metrics.gapBreakdown.rateGap))}
        description="Loss from lower rates"
        color="yellow"
      />
      <MetricCard
        title="Combined Gaps"
        value={formatCurrency(Math.abs(metrics.gapBreakdown.combinedGaps))}
        description="Additional combined loss"
        color="gray"
      />
    </div>
  );
}
