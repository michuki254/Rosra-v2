import { Bar } from 'react-chartjs-2';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { RevenueGapMessage } from './RevenueGapMessage';
import { GapBreakdownMessage } from './GapBreakdownMessage';

interface GapAnalysisChartProps {
  complianceGap: number;
  rateGap: number;
  combinedGaps: number;
  actualRevenue: number;
  totalPotentialRevenue: number;
  totalGapShortTermFees: number;
  percentage: number;
  chartOptions: any;
  showGapFormulas: boolean;
  setShowGapFormulas: (show: boolean) => void;
  formatCurrency: (value: number) => string;
}

export const GapAnalysisChart: React.FC<GapAnalysisChartProps> = ({
  complianceGap,
  rateGap,
  combinedGaps,
  actualRevenue,
  totalPotentialRevenue,
  totalGapShortTermFees,
  percentage,
  chartOptions,
  showGapFormulas,
  setShowGapFormulas,
  formatCurrency,
}) => {
  // Log props for debugging
  console.log('GapAnalysisChart props:', {
    complianceGap,
    rateGap,
    combinedGaps,
    actualRevenue,
    totalPotentialRevenue,
    totalGapShortTermFees,
  });

  return (
    <div>
      <h4 className="text-sm font-medium text-blue-500 text-center mb-6">Short-term User Charge Breakdown Analysis</h4>
      <div className="h-96">
        <Bar
          data={{
            labels: ['Gap Breakdown'],
            datasets: [
              {
                label: 'Compliance Gap',
                data: [complianceGap],
                backgroundColor: 'rgb(59, 130, 246)', // blue
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 0,
                stack: 'stack1',
              },
              {
                label: 'Rate Gap',
                data: [rateGap],
                backgroundColor: 'rgb(249, 115, 22)', // orange
                borderColor: 'rgb(249, 115, 22)',
                borderWidth: 0,
                stack: 'stack1',
              },
              {
                label: 'Combined Gaps',
                data: [combinedGaps],
                backgroundColor: 'rgb(156, 163, 175)', // gray
                borderColor: 'rgb(156, 163, 175)',
                borderWidth: 0,
                stack: 'stack1',
              }
            ],
          }}
          options={{
            ...chartOptions,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  callback: (value) => formatCurrency(Number(value)),
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                  },
                },
              },
              legend: {
                position: 'bottom' as const,
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
              },
            },
          }}
        />
      </div>

      {/* Gap Analysis Formulas */}
      <div className="mb-6 cursor-pointer">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Short Term User Charge Gap Analysis Formulas</h3>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              showGapFormulas ? 'transform rotate-180' : ''
            }`}
            onClick={() => setShowGapFormulas(!showGapFormulas)}
          />
        </div>

        {showGapFormulas && (
          <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Registration Gap</h5>
              <div className="pl-4 font-mono text-sm">
                = (<span className="text-emerald-600">Est. Daily Users</span> - <span className="text-emerald-600">Actual Daily Users</span>) × <span className="text-blue-600">Actual Daily Fee</span> × 365
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Rate Gap</h5>
              <div className="pl-4 font-mono text-sm">
                = (<span className="text-blue-600">Avg Daily Fee</span> - <span className="text-blue-600">Actual Daily Fee</span>) × <span className="text-emerald-600">Actual Daily Users</span> × 365
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Combined Gaps</h5>
              <div className="pl-4 font-mono text-sm">
                = <span className="text-purple-600">Total Gap Short-term Fees</span> - (<span className="text-red-600">Registration Gap</span> + <span className="text-red-600">Rate Gap</span>)
              </div>
            </div>
          </div>
        )}
      </div>

    {/* Gap Type Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-orange-500">
          <div className="text-sm text-gray-500 mb-1">Compliance Gap</div>
          <div className="text-xl font-bold text-gray-900 mb-1 truncate">
            {formatCurrency(complianceGap)}
          </div>
          <div className="text-sm text-orange-600">
            Non-compliant revenue loss
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500 mb-1">Rate Gap</div>
          <div className="text-xl font-bold text-gray-900 mb-1 truncate">
            {formatCurrency(rateGap)}
          </div>
          <div className="text-sm text-purple-600">
            Rate difference impact
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500 mb-1">Combined Gaps</div>
          <div className="text-xl font-bold text-gray-900 mb-1 truncate">
            {formatCurrency(combinedGaps)}
          </div>
          <div className="text-sm text-yellow-600">
            Other revenue gaps
          </div>
        </div>
      </div>

      <GapBreakdownMessage
        complianceGap={complianceGap}
        rateGap={rateGap}
        combinedGaps={combinedGaps}
        totalGapShortTermFees={totalGapShortTermFees}
        formatCurrency={formatCurrency}
      />

     
    </div>
  );
};
