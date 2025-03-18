interface AnalysisMessagesProps {
  percentage: number;
  actualRevenue: number;
  totalPotentialRevenue: number;
  complianceGap: number;
  rateGap: number;
  combinedGaps: number;
  totalGapShortTermFees: number;
  formatCurrency: (value: number) => string;
}

export const AnalysisMessages: React.FC<AnalysisMessagesProps> = ({
  percentage,
  actualRevenue,
  totalPotentialRevenue,
  complianceGap,
  rateGap,
  combinedGaps,
  totalGapShortTermFees,
  formatCurrency,
}) => {
  const getGapAnalysisMessage = (percentage: number) => {
    if (percentage < 30) {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) faces a <span className="font-bold">significant challenge</span> as the percentage of potential leveraged revenue falls <span className="font-bold">below 30%</span> at the value <span className="font-bold">{percentage.toFixed(2)}%</span>. This indicates a <span className="font-bold">substantial gap</span> between the revenue collected ({formatCurrency(actualRevenue)}) and the total estimated potential revenue ({formatCurrency(totalPotentialRevenue)}). To close the gap, a <span className="font-bold">comprehensive analysis</span> of existing revenue channels, revisions of pricing structures may be required.
        </span>
      );
    } else if (percentage >= 30 && percentage < 70) {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) shows <span className="font-bold">moderate performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates <span className="font-bold">some success</span> in revenue collection ({formatCurrency(actualRevenue)} out of {formatCurrency(totalPotentialRevenue)}), there remains <span className="font-bold">room for improvement</span>. Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
        </span>
      );
    } else {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) demonstrates <span className="font-bold">strong performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. This <span className="font-bold">high percentage</span> indicates effective revenue collection practices, with {formatCurrency(actualRevenue)} collected out of a potential {formatCurrency(totalPotentialRevenue)}. Maintaining current strategies while monitoring for optimization opportunities is recommended.
        </span>
      );
    }
  };

  const getBreakdownAnalysisMessage = () => {
    const gaps = [
      { type: 'Compliance Gap', value: complianceGap },
      { type: 'Rate Gap', value: rateGap },
      { type: 'Combined Gaps', value: combinedGaps }
    ];

    const largestGap = gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);

    if (largestGap.value <= 0) {
      return (
        <span>
          The gaps in short-term user charge revenue collection are <span className="font-bold">relatively balanced</span>, with no single gap type significantly outweighing the others. The total gap of {formatCurrency(totalGapShortTermFees)} suggests a need for a <span className="font-bold">comprehensive approach</span> to address all aspects of revenue collection equally.
        </span>
      );
    }

    switch (largestGap.type) {
      case 'Compliance Gap':
        return (
          <span>
            <span className="font-bold">Compliance gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at <span className="font-bold">{formatCurrency(complianceGap)}</span>. This indicates a <span className="font-bold">significant discrepancy</span> between the number of potential users and actual users paying the charges.
          </span>
        );
      case 'Rate Gap':
        return (
          <span>
            <span className="font-bold">Rate gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at <span className="font-bold">{formatCurrency(rateGap)}</span>. This suggests that the <span className="font-bold">current rates</span> being charged may need to be reviewed and adjusted to better align with market values or service costs.
          </span>
        );
      case 'Combined Gaps':
        return (
          <span>
            <span className="font-bold">Combined gaps</span> represent the largest portion of revenue loss in short-term user charge collection, at <span className="font-bold">{formatCurrency(combinedGaps)}</span>. This indicates <span className="font-bold">multiple factors</span> contributing to the revenue gap that require a comprehensive approach to address.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Gap Analysis Message */}
      <div className="mt-4">
        <h4 className="text-base font-medium text-gray-900 mb-3">Short Term User Charge Gap Analysis</h4>
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          {getGapAnalysisMessage(percentage)}
        </div>
      </div>

      {/* Breakdown Analysis Message */}
      <div className="mt-4">
        <h4 className="text-base font-medium text-gray-900 mb-3">Short-term User Charge Breakdown Analysis</h4>
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          {getBreakdownAnalysisMessage()}
        </div>
      </div>
    </div>
  );
};
