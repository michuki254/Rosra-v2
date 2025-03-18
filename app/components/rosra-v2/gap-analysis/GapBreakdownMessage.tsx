interface GapBreakdownMessageProps {
  complianceGap: number;
  rateGap: number;
  combinedGaps: number;
  totalGapShortTermFees: number;
  formatCurrency: (value: number) => string;
}

export const GapBreakdownMessage: React.FC<GapBreakdownMessageProps> = ({
  complianceGap,
  rateGap,
  combinedGaps,
  totalGapShortTermFees,
  formatCurrency,
}) => {
  const getMessage = () => {
    const gaps = [
      { type: 'Compliance Gap', value: complianceGap },
      { type: 'Rate Gap', value: rateGap },
      { type: 'Combined Gaps', value: combinedGaps }
    ];

    const largestGap = gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);

    if (largestGap.value <= 0) {
      return (
        <p className="text-gray-800 leading-relaxed">
          The gaps in short-term user charge revenue collection are{' '}
          <span className="text-red-600 font-semibold">relatively balanced</span>, with no single gap type significantly outweighing the others. The total gap of{' '}
          <span className="text-green-600 font-semibold">{formatCurrency(totalGapShortTermFees)}</span> suggests a need for a{' '}
          <span className="text-red-600 font-semibold">comprehensive approach</span> to address all aspects of revenue collection equally.
        </p>
      );
    }

    switch (largestGap.type) {
      case 'Compliance Gap':
        return (
          <p className="text-gray-800 leading-relaxed">
            <span className="text-red-600 font-semibold">Compliance gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at{' '}
            <span className="text-green-600 font-semibold">{formatCurrency(complianceGap)}</span>. This indicates a{' '}
            <span className="text-red-600 font-semibold">significant discrepancy</span> between the number of potential users and actual users paying the charges.
          </p>
        );
      case 'Rate Gap':
        return (
          <p className="text-gray-800 leading-relaxed">
            <span className="text-red-600 font-semibold">Rate gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at{' '}
            <span className="text-green-600 font-semibold">{formatCurrency(rateGap)}</span>. This suggests that the{' '}
            <span className="text-red-600 font-semibold">current rates</span> being charged may need to be reviewed and adjusted to better align with market values or service costs.
          </p>
        );
      case 'Combined Gaps':
        return (
          <p className="text-gray-800 leading-relaxed">
            <span className="text-red-600 font-semibold">Combined gaps</span> represent the largest portion of revenue loss in short-term user charge collection, at{' '}
            <span className="text-green-600 font-semibold">{formatCurrency(combinedGaps)}</span>. This indicates{' '}
            <span className="text-red-600 font-semibold">multiple factors</span> contributing to the revenue gap that require a comprehensive approach to address.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Gap Analysis Breakdown</h4>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="space-y-4">
          {getMessage()}
        </div>
      </div>
    </div>
  );
};
