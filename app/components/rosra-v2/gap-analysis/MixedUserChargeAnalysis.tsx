'use client'

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../../utils/formatters';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MixedUserInputs {
  estimatedDailyUsers: number;
  actualDailyUsers: number;
  averageDailyUserFee: number;
  actualDailyUserFee: number;
  availableMonthlyUsers: number;
  payingMonthlyUsers: number;
  averageMonthlyRate: number;
  actualMonthlyRate: number;
}

interface MixedChargeMetrics {
  categories: {
    estimatedUsers: number;
    standardRate: number;
    registeredUsers: number;
    averagePaidRate: number;
  }[];
}

interface MixedUserChargeAnalysisProps {
  onChange?: (inputs: MixedUserInputs) => void;
  onMetricsChange?: (metrics: any) => void;
}

export function calculateTotalPotentialRevenue(metrics: MixedChargeMetrics) {
  return metrics.categories.reduce((total, category) => {
    const potentialRevenue = category.estimatedUsers * category.standardRate;
    return total + potentialRevenue;
  }, 0);
}

export function calculateActualRevenue(metrics: MixedChargeMetrics) {
  return metrics.categories.reduce((total, category) => {
    const actualRevenue = category.registeredUsers * category.averagePaidRate;
    return total + actualRevenue;
  }, 0);
}

export function calculateTotalGap(metrics: MixedChargeMetrics) {
  const potentialRevenue = calculateTotalPotentialRevenue(metrics);
  const actualRevenue = calculateActualRevenue(metrics);
  return potentialRevenue - actualRevenue;
}

export default function MixedUserChargeAnalysis({ onChange, onMetricsChange }: MixedUserChargeAnalysisProps) {
  const [inputs, setInputs] = useState<MixedUserInputs>({
    estimatedDailyUsers: 1000,
    actualDailyUsers: 500,
    averageDailyUserFee: 1.5,
    actualDailyUserFee: 1,
    availableMonthlyUsers: 200,
    payingMonthlyUsers: 190,
    averageMonthlyRate: 70,
    actualMonthlyRate: 12
  });

  const [metrics, setMetrics] = useState({
    categories: [
      {
        name: 'Stadium Usage',
        estimatedUsers: 5000,
        standardRate: 200,
        registeredUsers: 3500,
        averagePaidRate: 150
      },
      {
        name: 'Community Hall',
        estimatedUsers: 2000,
        standardRate: 300,
        registeredUsers: 1500,
        averagePaidRate: 250
      }
    ]
  });

  const [showFormula, setShowFormula] = useState(false);
  const [showGapFormulas, setShowGapFormulas] = useState(false);

  useEffect(() => {
    if (onMetricsChange) {
      const potential = calculateTotalPotentialRevenue(metrics);
      const actual = calculateActualRevenue(metrics);
      const gap = calculateTotalGap(metrics);
      
      onMetricsChange({
        potential,
        actual,
        gap
      });
    }
  }, [metrics, onMetricsChange]);

  const handleInputChange = (field: keyof MixedUserInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedInputs = { ...inputs, [field]: numValue };
    setInputs(updatedInputs);
    onChange?.(updatedInputs);
  };

  // Calculate revenues and gaps
  const actualRevenue = ((inputs.actualDailyUsers * inputs.actualDailyUserFee) * 365) + 
                       (inputs.payingMonthlyUsers * inputs.actualMonthlyRate * 12);
  
  const totalPotentialRevenue = ((inputs.estimatedDailyUsers * inputs.averageDailyUserFee) * 365) + 
                               (inputs.availableMonthlyUsers * inputs.averageMonthlyRate * 12);
  
  const totalGapMixedFees = totalPotentialRevenue - actualRevenue;
  
  const percentageLeveraged = totalPotentialRevenue !== 0 ? 
                             (actualRevenue / totalPotentialRevenue) * 100 : 0;

  // Additional gap calculations
  const complianceGap = ((inputs.estimatedDailyUsers - inputs.actualDailyUsers) * inputs.actualDailyUserFee * 365) +
                       ((inputs.availableMonthlyUsers - inputs.payingMonthlyUsers) * inputs.actualMonthlyRate);

  const rateGap = ((inputs.averageDailyUserFee - inputs.actualDailyUserFee) * inputs.actualDailyUsers * 365) +
                  ((inputs.averageMonthlyRate - inputs.actualMonthlyRate) * inputs.payingMonthlyUsers * 12);

  const combinedGaps = totalGapMixedFees - (complianceGap + rateGap);

  const dailyUserFeeGap = (inputs.estimatedDailyUsers * inputs.averageDailyUserFee * 365) -
                         (inputs.actualDailyUsers * inputs.actualDailyUserFee * 365);

  const monthlyUserFeeGap = (inputs.availableMonthlyUsers * inputs.averageMonthlyRate * 12) -
                           (inputs.payingMonthlyUsers * inputs.actualMonthlyRate * 12);

  // Find largest gap
  const gapItems = [
    { name: 'Compliance Gap', value: complianceGap },
    { name: 'Rate Gap', value: rateGap },
    { name: 'Combined gaps', value: combinedGaps }
  ];

  const largestGap = gapItems.reduce((max, current) => 
    Math.abs(current.value) > Math.abs(max.value) ? current : max
  );

  // Prepare data for the charts
  const chartData = {
    labels: [''],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [actualRevenue],
        backgroundColor: 'rgb(59, 130, 246)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
      },
      {
        label: 'Total Gap Mixed Fees',
        data: [totalGapMixedFees],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
      }
    ],
  };

  const breakdownChartData = {
    labels: [''],
    datasets: [
      {
        label: 'Compliance Gap',
        data: [Math.abs(complianceGap)],
        backgroundColor: 'rgb(59, 130, 246)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
      },
      {
        label: 'Rate Gap',
        data: [Math.abs(rateGap)],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
      },
      {
        label: 'Combined gaps',
        data: [Math.abs(combinedGaps)],
        backgroundColor: 'rgb(153, 163, 175)', // gray-500
        borderColor: 'rgb(153, 163, 175)',
        borderWidth: 0,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          color: 'rgb(100, 116, 139)', // slate-500
          font: {
            size: 11
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'rgb(15, 23, 42)', // slate-900
        bodyColor: 'rgb(15, 23, 42)', // slate-900
        padding: 12,
        cornerRadius: 4,
        boxPadding: 4,
        bodyFont: {
          size: 12
        },
        borderColor: 'rgb(226, 232, 240)', // slate-200
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          },
          labelTextColor: function() {
            return 'rgb(15, 23, 42)'; // slate-900
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        border: {
          display: true,
          color: 'rgb(203, 213, 225)' // slate-300
        },
        ticks: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: true,
          color: 'rgb(203, 213, 225)' // slate-300
        },
        grid: {
          display: true,
          color: 'rgb(241, 245, 249)', // slate-100
          drawBorder: false
        },
        ticks: {
          padding: 12,
          callback: function(value) {
            return value.toLocaleString();
          },
          color: 'rgb(100, 116, 139)', // slate-500
          font: {
            size: 11
          },
          maxTicksLimit: 6
        }
      }
    }
  };

  // Get gap analysis message based on percentage leveraged
  const getGapAnalysisMessage = (percentage: number) => {
    if (percentage < 30) {
      return (
        <span>
          The Mixed User Charge Revenue Collection (GOA) faces a <span className="font-bold">significant challenge</span> as the percentage of potential leveraged revenue falls <span className="font-bold">below 30%</span> at the value <span className="font-bold">{percentage.toFixed(2)}%</span>. This indicates a <span className="font-bold">substantial gap</span> between the revenue collected and the total estimated potential revenue. To close the gap, a <span className="font-bold">comprehensive analysis</span> of existing revenue channels, revisions of pricing structures may be required.
        </span>
      );
    } else if (percentage >= 30 && percentage < 70) {
      return (
        <span>
          The Mixed User Charge Revenue Collection (GOA) shows <span className="font-bold">moderate performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates <span className="font-bold">some success</span> in revenue collection, there remains <span className="font-bold">room for improvement</span>. Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
        </span>
      );
    } else {
      return (
        <span>
          The Mixed User Charge Revenue Collection (GOA) demonstrates <span className="font-bold">strong performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. This <span className="font-bold">high percentage</span> indicates effective revenue collection practices. Maintaining current strategies while monitoring for optimization opportunities is recommended.
        </span>
      );
    }
  };

  const getBreakdownAnalysisMessage = () => {
    const complianceGapValue = ((inputs.estimatedDailyUsers - inputs.actualDailyUsers) * inputs.actualDailyUserFee * 365) +
                       ((inputs.availableMonthlyUsers - inputs.payingMonthlyUsers) * inputs.actualMonthlyRate);

    const rateGapValue = ((inputs.averageDailyUserFee - inputs.actualDailyUserFee) * inputs.actualDailyUsers * 365) +
                  ((inputs.averageMonthlyRate - inputs.actualMonthlyRate) * inputs.payingMonthlyUsers * 12);

    const combinedGapsValue = totalGapMixedFees - (complianceGapValue + rateGapValue);

    const gaps = [
      { type: 'Compliance Gap', value: complianceGapValue },
      { type: 'Rate Gap', value: rateGapValue },
      { type: 'Combined Gaps', value: combinedGapsValue }
    ];

    const largestGap = gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);

    if (largestGap.value <= 0) {
      return (
        <span>
          The gaps in mixed user charge revenue collection are <span className="font-bold">relatively balanced</span>, with no single gap type significantly outweighing the others. This suggests a need for a <span className="font-bold">comprehensive approach</span> to address all aspects of revenue collection equally.
        </span>
      );
    }

    switch (largestGap.type) {
      case 'Compliance Gap':
        return (
          <span>
            <span className="font-bold">Compliance gap</span> is identified as the largest gap contributing to the total gap in mixed user charge revenue collection, at <span className="font-bold">{formatCurrency(complianceGapValue)}</span>. This indicates a <span className="font-bold">significant discrepancy</span> between the number of potential users and actual users paying the charges.
          </span>
        );
      case 'Rate Gap':
        return (
          <span>
            <span className="font-bold">Rate gap</span> is identified as the largest gap contributing to the total gap in mixed user charge revenue collection, at <span className="font-bold">{formatCurrency(rateGapValue)}</span>. This suggests that the <span className="font-bold">current rates</span> being charged may need to be reviewed and adjusted to better align with market values or service costs.
          </span>
        );
      case 'Combined Gaps':
        return (
          <span>
            <span className="font-bold">Combined gaps</span> represent the largest portion of revenue loss in mixed user charge collection, at <span className="font-bold">{formatCurrency(combinedGapsValue)}</span>. This indicates <span className="font-bold">multiple factors</span> contributing to the revenue gap that require a comprehensive approach to address.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Inputs */}
        <div className="w-full md:w-1/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Users Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-4">Daily Users</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Users
                  </label>
                  <input
                    type="number"
                    value={inputs.estimatedDailyUsers}
                    onChange={(e) => handleInputChange('estimatedDailyUsers', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Actual Users
                  </label>
                  <input
                    type="number"
                    value={inputs.actualDailyUsers}
                    onChange={(e) => handleInputChange('actualDailyUsers', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Average Fee
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.averageDailyUserFee}
                    onChange={(e) => handleInputChange('averageDailyUserFee', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Actual Fee
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.actualDailyUserFee}
                    onChange={(e) => handleInputChange('actualDailyUserFee', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Users Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Users</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Available Users
                  </label>
                  <input
                    type="number"
                    value={inputs.availableMonthlyUsers}
                    onChange={(e) => handleInputChange('availableMonthlyUsers', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Paying Users
                  </label>
                  <input
                    type="number"
                    value={inputs.payingMonthlyUsers}
                    onChange={(e) => handleInputChange('payingMonthlyUsers', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Average Rate
                  </label>
                  <input
                    type="number"
                    value={inputs.averageMonthlyRate}
                    onChange={(e) => handleInputChange('averageMonthlyRate', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Actual Rate
                  </label>
                  <input
                    type="number"
                    value={inputs.actualMonthlyRate}
                    onChange={(e) => handleInputChange('actualMonthlyRate', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

         
        </div>

        {/* Right side - Charts and Analysis */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Main Card with Revenue Chart */}
          <div >
            <h4 className="text-sm font-medium text-blue-500 text-center mb-6">Mixed User Charge Gap Analysis</h4>

            <div className="h-[400px] w-full mb-8">
              <Bar
                data={chartData}
                options={chartOptions}
              />
            </div>

            {/* Show Formula Section */}
            <div className="mb-6 cursor-pointer">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Mixed User Charge Gap Analysis Formula</h3>
                </div>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    showFormula ? 'transform rotate-180' : ''
                  }`}
                  onClick={() => setShowFormula(!showFormula)}
                />
              </div>

              {showFormula && (
                <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Actual Revenue</h5>
                    <div className="pl-4 font-mono text-sm">
                      = Σ (<span className="text-emerald-600">Daily Users</span> × <span className="text-blue-600">Daily Fee</span>) × 365 +<br/>
                      &nbsp;&nbsp;Σ (<span className="text-emerald-600">Monthly Users</span> × <span className="text-blue-600">Monthly Rate</span>) × 12
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Total Potential Revenue</h5>
                    <div className="pl-4 font-mono text-sm">
                      = Σ (<span className="text-emerald-600">Est. Daily Users</span> × <span className="text-blue-600">Avg Daily Fee</span>) × 365 +<br/>
                      &nbsp;&nbsp;Σ (<span className="text-emerald-600">Avail. Monthly Users</span> × <span className="text-blue-600">Avg Monthly Rate</span>) × 12
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Total Gap Mixed Fees</h5>
                    <div className="pl-4 font-mono text-sm">
                      = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-red-600">Actual Revenue</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Daily User Fee Gap</h5>
                    <div className="pl-4 font-mono text-sm">
                      = (<span className="text-emerald-600">Est. Daily Users</span> × <span className="text-blue-600">Avg Daily Fee</span> × 365) -<br/>
                      &nbsp;&nbsp;(<span className="text-emerald-600">Actual Daily Users</span> × <span className="text-blue-600">Actual Daily Fee</span> × 365)
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Monthly User Fee Gap</h5>
                    <div className="pl-4 font-mono text-sm">
                      = (<span className="text-emerald-600">Avail. Monthly Users</span> × <span className="text-blue-600">Avg Monthly Rate</span> × 12) -<br/>
                      &nbsp;&nbsp;(<span className="text-emerald-600">Paying Monthly Users</span> × <span className="text-blue-600">Actual Monthly Rate</span> × 12)
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Largest Gap</h5>
                    <div className="pl-4 font-mono text-sm">
                      = {largestGap.name} ({formatCurrency(largestGap.value)})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gap Analysis Text Section */}
            <div className="mt-4">
              <h4 className="text-base font-medium text-gray-900 mb-3">Mixed User Charge Gap Analysis</h4>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {getGapAnalysisMessage(percentageLeveraged)}
                </div>
              </div>
            </div>
        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-blue-500">
                <div className="text-sm text-gray-500 mb-1">Actual Revenue</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(actualRevenue)}
                </div>
                <div className="text-sm text-blue-600">
                  Current collected revenue
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-emerald-500">
                <div className="text-sm text-gray-500 mb-1">Total Potential Revenue</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(totalPotentialRevenue)}
                </div>
                <div className="text-sm text-emerald-600">
                  Maximum possible revenue
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-red-500">
                <div className="text-sm text-gray-500 mb-1">Total Gap Mixed Fees</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(totalGapMixedFees)}
                </div>
                <div className="text-sm text-red-600">
                  Revenue improvement potential
                </div>
              </div>
            </div>
            {/* Breakdown Chart Card */}
            <div>
              <h4 className="text-sm font-medium text-blue-500 text-center mb-3">Mixed User Charge Breakdown Analysis </h4>
              <div className="h-[400px] w-full">
                <Bar
                  data={breakdownChartData}
                  options={chartOptions}
                />
              </div>

              {/* Gap Formulas */}
              <div className="mb-6 cursor-pointer">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">Mixed User Charge Breakdown Analysis Formula</h3>
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
                      <h5 className="font-semibold text-gray-900 mb-2">Compliance Gap</h5>
                      <div className="pl-4 font-mono text-sm">
                        = (<span className="text-blue-600">Actual Daily Users</span> - <span className="text-emerald-600">Compliant Daily Users</span>) × <span className="text-purple-600">Daily Fee</span> +<br/>
                        &nbsp;&nbsp;(<span className="text-blue-600">Actual Monthly Users</span> - <span className="text-emerald-600">Compliant Monthly Users</span>) × <span className="text-purple-600">Monthly Rate</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Rate Gap</h5>
                      <div className="pl-4 font-mono text-sm">
                        = (<span className="text-blue-600">Market Daily Rate</span> - <span className="text-emerald-600">Current Daily Rate</span>) × <span className="text-purple-600">Daily Users</span> +<br/>
                        &nbsp;&nbsp;(<span className="text-blue-600">Market Monthly Rate</span> - <span className="text-emerald-600">Current Monthly Rate</span>) × <span className="text-purple-600">Monthly Users</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Combined Gaps</h5>
                      <div className="pl-4 font-mono text-sm">
                        = <span className="text-blue-600">Other Revenue Losses</span> + <span className="text-emerald-600">Miscellaneous Gaps</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

           
          {/* Breakdown Analysis */}
          <div className="mt-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">Mixed User Charge Breakdown Analysis</h4>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 leading-relaxed">
                {getBreakdownAnalysisMessage()}
              </div>
            </div>
          </div>

              {/* Gap Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-orange-500">
                  <div className="text-sm text-gray-500 mb-1">Compliance Gap</div>
                  <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                    {formatCurrency(complianceGap)}
                  </div>
                  <div className="text-sm text-orange-600">
                    Non-compliant revenue loss
                  </div>
                </div>

                <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-purple-500">
                  <div className="text-sm text-gray-500 mb-1">Rate Gap</div>
                  <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                    {formatCurrency(rateGap)}
                  </div>
                  <div className="text-sm text-purple-600">
                    Rate difference impact
                  </div>
                </div>

                <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-yellow-500">
                  <div className="text-sm text-gray-500 mb-1">Combined Gaps</div>
                  <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                    {formatCurrency(combinedGaps)}
                  </div>
                  <div className="text-sm text-yellow-600">
                    Other revenue gaps
                  </div>
                </div>
              </div>
            </div>
          </div>

         
         
         

        </div>
      </div>
    </div>
  );
}
