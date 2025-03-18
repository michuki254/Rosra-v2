interface RevenueGapMessageProps {
  percentage: number;
  actualRevenue: number;
  totalPotentialRevenue: number;
  formatCurrency: (value: number) => string;
}

export const RevenueGapMessage: React.FC<RevenueGapMessageProps> = ({
  percentage,
  actualRevenue,
  totalPotentialRevenue,
  formatCurrency,
}) => {
  const gap = totalPotentialRevenue - actualRevenue;
  const threshold = 30;
  const isSignificant = percentage < threshold;

  const getMessage = () => {
    if (percentage < 30) {
      return (
        <p className="text-sm text-gray-800 leading-relaxed">
          The Short Term Revenue Collection faces a{' '}
          <span className="text-red-600 font-semibold">significant challenge</span> as the percentage of potential leveraged revenue falls{' '}
          <span className="text-red-600 font-semibold">below {threshold}%</span> at the value{' '}
          <span className="text-red-600 font-semibold">{percentage.toFixed(2)}%</span>. This indicates a{' '}
          <span className="text-red-600 font-semibold">substantial gap</span> between the revenue collected and the total estimated potential revenue. The{' '}
          <span className="font-semibold">largest gap</span> between the{' '}
          <span className="font-semibold">actual revenue</span> and{' '}
          <span className="font-semibold">estimated potential revenue</span> is{' '}
          <span className="text-green-600 font-semibold">{formatCurrency(gap)}</span>. To close the gap, a{' '}
          <span className="text-red-600 font-semibold">comprehensive analysis</span> of existing revenue channels, revisions of pricing structures may be required.{' '}
          <span className="font-semibold">However, it's essential to maintain a balanced approach while addressing all revenue streams.</span>
        </p>
      );
    } else if (percentage >= 30 && percentage < 70) {
      return (
        <p className="text-sm text-gray-800 leading-relaxed">
          The Short Term Revenue Collection shows{' '}
          <span className="text-orange-600 font-semibold">moderate performance</span> with{' '}
          <span className="text-orange-600 font-semibold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates{' '}
          <span className="text-orange-600 font-semibold">some success</span> in revenue collection ({formatCurrency(actualRevenue)} out of{' '}
          {formatCurrency(totalPotentialRevenue)}), there remains{' '}
          <span className="text-orange-600 font-semibold">room for improvement</span>. Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
        </p>
      );
    } else {
      return (
        <p className="text-sm text-gray-800 leading-relaxed">
          The Short Term Revenue Collection demonstrates{' '}
          <span className="text-green-600 font-semibold">strong performance</span> with{' '}
          <span className="text-green-600 font-semibold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. This{' '}
          <span className="text-green-600 font-semibold">high percentage</span> indicates effective revenue collection practices, with{' '}
          {formatCurrency(actualRevenue)} collected out of a potential {formatCurrency(totalPotentialRevenue)}. Maintaining current strategies while monitoring for optimization opportunities is recommended.
        </p>
      );
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Revenue Performance Analysis</h4>
      <div className="bg-blue-50 rounded-lg p-4">
        {getMessage()}
      </div>
    </div>
  );
};
