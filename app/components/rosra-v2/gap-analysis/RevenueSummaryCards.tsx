interface RevenueSummaryCardsProps {
  actualRevenue: number;
  totalPotentialRevenue: number;
  totalGapShortTermFees: number;
  formatCurrency: (value: number) => string;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({
  actualRevenue,
  totalPotentialRevenue,
  totalGapShortTermFees,
  formatCurrency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-blue-500">
        <div className="text-sm text-gray-500 mb-1">Actual Revenue</div>
        <div className="text-xl font-bold text-gray-900 mb-1 truncate">
          {formatCurrency(actualRevenue)}
        </div>
        <div className="text-sm text-blue-600">
          Current collected revenue
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-emerald-500">
        <div className="text-sm text-gray-500 mb-1">Total Potential Revenue</div>
        <div className="text-xl font-bold text-gray-900 mb-1 truncate">
          {formatCurrency(totalPotentialRevenue)}
        </div>
        <div className="text-sm text-emerald-600">
          Maximum possible revenue
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-red-500">
        <div className="text-sm text-gray-500 mb-1">Total Gap</div>
        <div className="text-xl font-bold text-gray-900 mb-1 truncate">
          {formatCurrency(totalGapShortTermFees)}
        </div>
        <div className="text-sm text-red-600">
          Revenue improvement potential
        </div>
      </div>
    </div>
  );
};
