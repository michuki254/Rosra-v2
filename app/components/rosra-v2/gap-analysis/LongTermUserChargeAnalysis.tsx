'use client';

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
import { ChevronDownIcon, PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Category {
  name: string;
  isExpanded: boolean;
  estimatedLeasees: number;
  actualLeasees: number;
  potentialRate: number;
  actualRate: number;
}

export default function LongTermUserChargeAnalysis({ onMetricsChange }: { onMetricsChange?: (metrics: any) => void }) {
  const [totalInputs, setTotalInputs] = useState({
    estimatedMonthlyLeasees: 1000,
    actualMonthlyLeasees: 700,
  });
  
  const handleTotalInputChange = (field: string, value: string) => {
    const numValue = Number(value) || 0;
    setTotalInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Category A',
      isExpanded: false,
      estimatedLeasees: 600,
      actualLeasees: 500,
      potentialRate: 100,
      actualRate: 50
    },
    {
      name: 'Category B',
      isExpanded: false,
      estimatedLeasees: 100,
      actualLeasees: 50,
      potentialRate: 50,
      actualRate: 20
    },
    {
      name: 'Category C',
      isExpanded: false,
      estimatedLeasees: 300,
      actualLeasees: 150,
      potentialRate: 150,
      actualRate: 100
    }
  ]);

  const toggleCategory = (index: number) => {
    setCategories(cats => cats.map((cat, i) => 
      i === index ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  const addCategory = () => {
    const newCategory: Category = {
      name: `Category ${String.fromCharCode(65 + categories.length)}`,
      isExpanded: true,
      estimatedLeasees: 0,
      actualLeasees: 0,
      potentialRate: 0,
      actualRate: 0
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (index: number, field: keyof Category, value: number | string) => {
    setCategories(cats => cats.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    ));
  };

  // Calculate revenue metrics
  const calculateActualRevenue = () => {
    return categories.reduce((total, category) => {
      return total + (category.actualLeasees * category.actualRate * 12);
    }, 0);
  };

  const calculatePotentialRevenue = () => {
    return categories.reduce((total, category) => {
      return total + (category.estimatedLeasees * category.potentialRate * 12);
    }, 0);
  };

  // Calculate gap metrics
  const calculateComplianceGap = () => {
    return categories.reduce((total, category, index) => {
      const estimatedLeasees = category.estimatedLeasees;
      const actualLeasees = category.actualLeasees;
      const actualRate = category.actualRate;
      return total + ((estimatedLeasees - actualLeasees) * actualRate * 12);
    }, 0);
  };

  const calculateRateGap = () => {
    return categories.reduce((total, category) => {
      const potentialRate = category.potentialRate;
      const actualRate = category.actualRate;
      const actualLeasees = category.actualLeasees;
      return total + ((potentialRate - actualRate) * actualLeasees * 12);
    }, 0);
  };

  const calculateGapByCategory = (category: any) => {
    const potentialRevenue = category.estimatedLeasees * category.potentialRate * 12;
    const actualRevenue = category.actualLeasees * category.actualRate * 12;
    return potentialRevenue - actualRevenue;
  };

  const calculateCombinedGaps = () => {
    const totalGap = calculatePotentialRevenue() - calculateActualRevenue();
    const complianceGap = calculateComplianceGap();
    const rateGap = calculateRateGap();
    return totalGap - (complianceGap + rateGap);
  };

  const findLargestGap = () => {
    const gaps = [
      { name: 'Compliance Gap', value: calculateComplianceGap() },
      { name: 'Rate Gap', value: calculateRateGap() },
      { name: 'Combined Gaps', value: calculateCombinedGaps() }
    ];
    return gaps.reduce((max, gap) => gap.value > max.value ? gap : max);
  };

  // Helper function to calculate the max value for y-axis
  const calculateYAxisMax = () => {
    const totalValue = calculatePotentialRevenue();
    // Add 20% padding to the max value and round to a nice number
    const padding = totalValue * 0.2;
    const maxWithPadding = totalValue + padding;
    
    // Round to the nearest nice number based on the scale
    if (maxWithPadding >= 1000000) {
      return Math.ceil(maxWithPadding / 1000000) * 1000000;
    } else if (maxWithPadding >= 100000) {
      return Math.ceil(maxWithPadding / 100000) * 100000;
    } else {
      return Math.ceil(maxWithPadding / 10000) * 10000;
    }
  };

  // Prepare data for the charts
  const revenueChartData = {
    labels: [''],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [calculateActualRevenue()],
        backgroundColor: 'rgb(59, 130, 246)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
      },
      {
        label: 'Total Gap Long-term User Fees',
        data: [calculatePotentialRevenue() - calculateActualRevenue()],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
      }
    ]
  };

  const breakdownChartData = {
    labels: [''],
    datasets: [
      {
        label: 'Compliance Gap',
        data: [Math.abs(calculateComplianceGap())],
        backgroundColor: 'rgb(59, 130, 246)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
      },
      {
        label: 'Rate Gap',
        data: [Math.abs(calculateRateGap())],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
      },
      {
        label: 'Combined Gaps',
        data: [Math.abs(calculateCombinedGaps())],
        backgroundColor: 'rgb(153, 163, 175)', // gray-500
        borderColor: 'rgb(153, 163, 175)',
        borderWidth: 0,
      }
    ]
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
              label += formatCurrency(context.parsed.y);
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

  const [showRevenueFormulas, setShowRevenueFormulas] = useState(false);
  const [showGapFormulas, setShowGapFormulas] = useState(false);

  // Calculate metrics whenever categories change
  useEffect(() => {
    const actualRevenue = calculateActualRevenue();
    const potentialRevenue = calculatePotentialRevenue();
    const gap = potentialRevenue - actualRevenue;
    const percentageLeveraged = (actualRevenue / potentialRevenue) * 100;
    const complianceGap = calculateComplianceGap();
    const rateGap = calculateRateGap();
    const combinedGaps = calculateCombinedGaps();
    const largestGap = findLargestGap();

    if (onMetricsChange) {
      onMetricsChange({
        actual: actualRevenue,
        potential: potentialRevenue,
        gap,
        percentageLeveraged,
        complianceGap,
        rateGap,
        combinedGaps,
        largestGapType: largestGap.name,
        largestGapValue: largestGap.value,
        categoryGaps: categories.map(category => ({
          name: category.name,
          gap: calculateGapByCategory(category)
        })),
        totalEstimated: totalInputs.estimatedMonthlyLeasees,
        totalActual: totalInputs.actualMonthlyLeasees,
      });
    }
  }, [categories, totalInputs, onMetricsChange]);

  // Calculate totals from categories
  const categoryEstimatedTotal = categories.reduce((sum, cat) => sum + cat.estimatedLeasees, 0);
  const categoryActualTotal = categories.reduce((sum, cat) => sum + cat.actualLeasees, 0);

  return (
    <div className="flex gap-6">
      {/* Left Section - Inputs and Categories */}
      <div className="w-1/3 space-y-6">
        {/* Total Inputs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
       
          <div className="space-y-4">
            <div>
              <label htmlFor="estimatedLeasees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Number of Monthly Leasees
              </label>
              <input
                id="estimatedLeasees"
                type="number"
                value={totalInputs.estimatedMonthlyLeasees}
                onChange={(e) => handleTotalInputChange('estimatedMonthlyLeasees', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  categoryEstimatedTotal !== totalInputs.estimatedMonthlyLeasees 
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900' 
                  : 'border-gray-300'
                }`}
              />
              {categoryEstimatedTotal !== totalInputs.estimatedMonthlyLeasees && (
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  Category total ({categoryEstimatedTotal}) differs from overall total
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="actualLeasees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actual Number of Monthly Leasees
              </label>
              <input
                id="actualLeasees"
                type="number"
                value={totalInputs.actualMonthlyLeasees}
                onChange={(e) => handleTotalInputChange('actualMonthlyLeasees', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  categoryActualTotal !== totalInputs.actualMonthlyLeasees 
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900' 
                  : 'border-gray-300'
                }`}
              />
              {categoryActualTotal !== totalInputs.actualMonthlyLeasees && (
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  Category total ({categoryActualTotal}) differs from overall total
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Categories
            </h3>
            <button
              onClick={addCategory}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                  <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${category.isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {category.isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Monthly Leasees
                      </label>
                      <input
                        type="number"
                        value={category.estimatedLeasees}
                        onChange={(e) => updateCategory(index, 'estimatedLeasees', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Actual Monthly Leasees
                      </label>
                      <input
                        type="number"
                        value={category.actualLeasees}
                        onChange={(e) => updateCategory(index, 'actualLeasees', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Potential Rate (KES)
                      </label>
                      <input
                        type="number"
                        value={category.potentialRate}
                        onChange={(e) => updateCategory(index, 'potentialRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Actual Rate (KES)
                      </label>
                      <input
                        type="number"
                        value={category.actualRate}
                        onChange={(e) => updateCategory(index, 'actualRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Charts */}
      <div className="w-2/3 space-y-6">

        {/* Revenue vs Gap Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" style={{ height: '400px' }}>
              <h3 className="text-sm font-medium text-blue-500 text-center mb-6">
               Long-term user Charge Gap Analysis
              </h3>
              <div className="h-[300px]">
                <Bar
                  data={revenueChartData}
                  options={chartOptions}
                />
              </div>
            </div>
      {/* Revenue Formula Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <button
            onClick={() => setShowRevenueFormulas(!showRevenueFormulas)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-5 w-5 text-blue-500" />
              <span className="text-blue-500">Revenue Analysis Formulas</span>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-blue-500 transform transition-transform duration-200 ${
                showRevenueFormulas ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {showRevenueFormulas && (
            <div className="mt-3 space-y-3 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-blue-500 mb-2">Actual Revenue</h4>
                <div className="pl-3 border-l-2 border-blue-500">
                  <p className="text-gray-600 dark:text-gray-400">Sum of (Actual Monthly Leasees × Actual Rate) for each category</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Actual Revenue = Σ (Actual Monthly Leasees × Actual Rate)
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-blue-500 mb-2">Potential Revenue (Annual)</h4>
                <div className="pl-3 border-l-2 border-blue-500">
                  <p className="text-gray-600 dark:text-gray-400">Sum of (Estimated Monthly Leasees × Potential Rate) for each category</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Potential Revenue = Σ (Estimated Monthly Leasees × Potential Rate)
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-blue-500 mb-2">Total Gap</h4>
                <div className="pl-3 border-l-2 border-blue-500">
                  <p className="text-gray-600 dark:text-gray-400">Difference between Potential Revenue and Actual Revenue</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Total Gap = Potential Revenue - Actual Revenue
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-blue-500 mb-2">% of Potential Leveraged</h4>
                <div className="pl-3 border-l-2 border-blue-500">
                  <p className="text-gray-600 dark:text-gray-400">Percentage of Potential Revenue that is currently being collected</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    % of Potential Leveraged = (Actual Revenue ÷ Potential Revenue) × 100
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
              {/* Summary Cards */}
          <div className="flex flex-row space-x-6">
            {/* Actual Revenue Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Actual Revenue (Annual)</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculateActualRevenue())}
                </p>
                <p className="text-sm text-blue-500 mt-1">Current collected revenue</p>
              </div>
            </div>

            {/* Potential Revenue Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-lg"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Potential Revenue (Annual)</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculatePotentialRevenue())}
                </p>
                <p className="text-sm text-green-500 mt-1">Maximum possible revenue</p>
              </div>
            </div>

            {/* Total Gap Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Gap</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculatePotentialRevenue() - calculateActualRevenue())}
                </p>
                <p className="text-sm text-red-500 mt-1">Revenue improvement potential</p>
              </div>
            </div>
          </div>

  

              {/* Analysis Section */}
              <div className="mt-6 bg-blue-50 dark:bg-gray-800/50 p-6 rounded-lg">
            <div className="text-gray-700 dark:text-gray-300">
              {(() => {
                const potentialLeveraged = (calculateActualRevenue() / calculatePotentialRevenue());
                if (potentialLeveraged < 0.3) {
                  return (
                    <>
                      The Long-term User Charge Revenue Collection (GOA) faces a significant challenge as the percentage of potential leveraged revenue falls below 30% at the value{' '}
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        {(potentialLeveraged * 100).toFixed(1)}%
                      </span>
                      . This indicates a substantial gap between the revenue collected and the total estimated potential revenue. To close the gap, a comprehensive analysis of existing revenue channels, revisions of pricing structures may be required.
                    </>
                  );
                } else if (potentialLeveraged >= 0.3 && potentialLeveraged < 0.7) {
                  return (
                    <>
                      While the Long-term User Charge Revenue Collection (GOA) captures a substantial portion of the estimated potential revenue with a percentage between 30% and 70%, at the value of{' '}
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        {(potentialLeveraged * 100).toFixed(1)}%
                      </span>
                      . This indicates that current policies are moderately effective, but there is still room for improvement.
                    </>
                  );
                } else {
                  return (
                    <>
                      The Long-term User Charge Revenue Collection (GOA) excels in revenue generation, with a percentage of potential leveraged revenue exceeding 70%, at the value of{' '}
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {(potentialLeveraged * 100).toFixed(1)}%
                      </span>
                      . This achievement underscores the effectiveness of government's existing strategies and practices. Government should keep monitoring market and customers to maintain its performance.
                    </>
                  );
                }
              })()}
            </div>
          </div>
  {/* Charts */}
  <div className="space-y-6">
          

          {/* Gap Analysis Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" style={{ height: '400px' }}>
            <h4  className="text-sm font-medium text-blue-500 text-center mb-6">
              Long-term User Charge Gap Analysis Breakdown
            </h4>
            <div className="h-[300px]">
              <Bar
                data={breakdownChartData}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
        {/* Gap Analysis Formula Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <button
            onClick={() => setShowGapFormulas(!showGapFormulas)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-5 w-5 text-orange-500" />
              <span className="text-orange-500">Gap Analysis Formulas</span>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-orange-500 transform transition-transform duration-200 ${
                showGapFormulas ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {showGapFormulas && (
            <div className="mt-3 space-y-3 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-orange-500 mb-2">Compliance Gap</h4>
                <div className="pl-3 border-l-2 border-orange-500">
                  <p className="text-gray-600 dark:text-gray-400">Revenue loss due to difference between estimated and actual number of leasees</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Compliance Gap = Σ [(Estimated Monthly Leasees - Actual Monthly Leasees) × Actual Rate]
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-orange-500 mb-2">Rate Gap</h4>
                <div className="pl-3 border-l-2 border-orange-500">
                  <p className="text-gray-600 dark:text-gray-400">Revenue loss due to difference between potential and actual rates</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Rate Gap = Σ [Actual Monthly Leasees × (Potential Rate - Actual Rate)]
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <h4 className="font-medium text-orange-500 mb-2">Combined Gaps</h4>
                <div className="pl-3 border-l-2 border-orange-500">
                  <p className="text-gray-600 dark:text-gray-400">Revenue loss from both compliance and rate gaps combined</p>
                  <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded-md">
                    Combined Gaps = Σ [(Estimated Monthly Leasees - Actual Monthly Leasees) × (Potential Rate - Actual Rate)]
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Summary */}
        <div className="flex flex-col w-full space-y-6">
        

          {/* Gap Breakdown Cards */}
          <div className="flex flex-row space-x-6 mt-6">
            {/* Compliance Gap Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Compliance Gap</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculateComplianceGap())}
                </p>
                <p className="text-sm text-purple-500 mt-1">Loss from unregistered users</p>
              </div>
            </div>

            {/* Rate Gap Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Rate Gap</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculateRateGap())}
                </p>
                <p className="text-sm text-yellow-500 mt-1">Loss from lower rates</p>
              </div>
            </div>

            {/* Combined Gaps Card */}
            <div className="flex-1 relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
              <div className="pl-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Combined Gaps</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(calculateCombinedGaps())}
                </p>
                <p className="text-sm text-orange-500 mt-1">Loss from combined effects</p>
              </div>
            </div>
          </div>

    

          {/* Gap Breakdown Analysis */}
          <div className="mt-6 bg-blue-50 dark:bg-gray-800/50 p-6 rounded-lg">
            <div className="text-gray-700 dark:text-gray-300">
              {(() => {
                const largestGap = findLargestGap().name;
                if (largestGap === "Compliance Gap") {
                  return (
                    <>
                      The Compliance Gap has been identified as the largest contributing factor to the Long-term User Charge Revenue Collection Gap at{' '}
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {formatCurrency(calculateComplianceGap())}
                      </span>
                      . This signals a substantial discrepancy between the potential revenue that should be collected based on compliance with established rates and the actual revenue collected. To address this issue, the government may prioritize efforts to ensure that all users are fully compliant with payment obligations, especially in the long term.
                    </>
                  );
                } else if (largestGap === "Rate Gap") {
                  return (
                    <>
                      The Rate Gap stands out as the largest contributor to the Long-term User Charge Revenue Collection Gap with the value of{' '}
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        {formatCurrency(calculateRateGap())}
                      </span>
                      . This highlights a misalignment between the established rates and the actual market conditions or user expectations. To bridge this gap, the government should conduct a comprehensive review of the rate structures. Consistent long term analysis is also crucial.
                    </>
                  );
                } else {
                  return (
                    <>
                      The Combined Gaps, which encompass various other sources of revenue gaps, have been identified as the largest contributors to the Long-term User Charge Revenue Collection Gap, at the value of{' '}
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">
                        {formatCurrency(calculateCombinedGaps())}
                      </span>
                      . This indicates that multiple factors, such as assessment, registration, or other operational aspects, collectively contribute to the gap. The government needs to adapt a holistic approach to close combined gaps.
                    </>
                  );
                }
              })()}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}