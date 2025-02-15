'use client'

import React, { useState, useMemo, useEffect } from 'react';
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

interface CategoryData {
  id: string;
  name: string;
  isExpanded: boolean;
  estimatedDailyFees: number;
  actualDailyFees: number;
  potentialRate: number;
  actualRate: number;
}

interface ShortTermUserChargeMetrics {
  estimatedDailyFees: number;
  actualDailyFees: number;
  categories: CategoryData[];
}

interface ShortTermUserChargeAnalysisProps {
  onChange?: (data: ShortTermUserChargeMetrics) => void;
}

interface Category {
  actualDailyFees: number;
  actualRate: number;
}

interface ShortTermInputs {
  categories: Category[];
}

interface ShortTermMetrics {
  categories: {
    estimatedDailyUsers: number;
    standardRate: number;
    registeredDailyUsers: number;
    averagePaidRate: number;
  }[];
}

export const calculateActualRevenue = (inputs: ShortTermInputs) => {
  try {
    if (!inputs || !inputs.categories) {
      console.error('Invalid inputs provided to calculateActualRevenue');
      return 0;
    }

    // Formula: Actual Daily Fees × Actual Rate × 365
    return inputs.categories.reduce((total, category) => {
      if (!category.actualDailyFees || !category.actualRate) {
        return total;
      }
      return total + (category.actualDailyFees * category.actualRate * 365);
    }, 0);
  } catch (error) {
    console.error('Error calculating actual revenue:', error);
    return 0;
  }
};

export function calculateTotalPotentialRevenue(metrics: ShortTermMetrics) {
  return metrics.categories.reduce((total, category) => {
    const potentialDailyRevenue = category.estimatedDailyUsers * category.standardRate;
    return total + (potentialDailyRevenue * 365); // Annualized
  }, 0);
}

export function calculateTotalGap(metrics: ShortTermMetrics) {
  const potentialRevenue = calculateTotalPotentialRevenue(metrics);
  const actualRevenue = calculateActualRevenue({
    categories: metrics.categories.map(category => ({
      actualDailyFees: category.registeredDailyUsers,
      actualRate: category.averagePaidRate
    }))
  });
  return potentialRevenue - actualRevenue;
}

export const calculateTotalPotentialRevenueOld = () => {
  const inputs = {
    estimatedDailyFees: 1000,
    actualDailyFees: 700,
    categories: [
      {
        id: '1',
        name: 'Category A',
        isExpanded: false,
        estimatedDailyFees: 600,
        actualDailyFees: 500,
        potentialRate: 100,
        actualRate: 10
      },
      {
        id: '2',
        name: 'Category B',
        isExpanded: false,
        estimatedDailyFees: 100,
        actualDailyFees: 50,
        potentialRate: 50,
        actualRate: 5
      },
      {
        id: '3',
        name: 'Category C',
        isExpanded: false,
        estimatedDailyFees: 300,
        actualDailyFees: 150,
        potentialRate: 150,
        actualRate: 20
      }
    ]
  };
  return inputs.categories.reduce((total, category) => {
    return total + (category.estimatedDailyFees * category.potentialRate * 365);
  }, 0);
};

export const calculateTotalGapOld = () => {
  const inputs = {
    estimatedDailyFees: 1000,
    actualDailyFees: 700,
    categories: [
      {
        id: '1',
        name: 'Category A',
        isExpanded: false,
        estimatedDailyFees: 600,
        actualDailyFees: 500,
        potentialRate: 100,
        actualRate: 10
      },
      {
        id: '2',
        name: 'Category B',
        isExpanded: false,
        estimatedDailyFees: 100,
        actualDailyFees: 50,
        potentialRate: 50,
        actualRate: 5
      },
      {
        id: '3',
        name: 'Category C',
        isExpanded: false,
        estimatedDailyFees: 300,
        actualDailyFees: 150,
        potentialRate: 150,
        actualRate: 20
      }
    ]
  };
  const totalPotentialRevenue = inputs.categories.reduce((total, category) => {
    return total + (category.estimatedDailyFees * category.potentialRate * 365);
  }, 0);
  const actualRevenue = inputs.categories.reduce((total, category) => {
    return total + (category.actualDailyFees * category.actualRate * 365);
  }, 0);
  return totalPotentialRevenue - actualRevenue;
};

export default function ShortTermUserChargeAnalysis({ onChange }: ShortTermUserChargeAnalysisProps) {
  const [inputs, setInputs] = useState<ShortTermUserChargeMetrics>({
    estimatedDailyFees: 1000,
    actualDailyFees: 700,
    categories: [
      {
        id: '1',
        name: 'Category A',
        isExpanded: false,
        estimatedDailyFees: 600,
        actualDailyFees: 500,
        potentialRate: 100,
        actualRate: 10
      },
      {
        id: '2',
        name: 'Category B',
        isExpanded: false,
        estimatedDailyFees: 100,
        actualDailyFees: 50,
        potentialRate: 50,
        actualRate: 5
      },
      {
        id: '3',
        name: 'Category C',
        isExpanded: false,
        estimatedDailyFees: 300,
        actualDailyFees: 150,
        potentialRate: 150,
        actualRate: 20
      }
    ]
  });

  const [showFormulas, setShowFormulas] = useState(false);
  const [showGapFormulas, setShowGapFormulas] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInputs = {
      ...inputs,
      [name]: Number(value)
    };
    setInputs(newInputs);
    onChange?.(newInputs);
  };

  const handleCategoryInputChange = (categoryId: string, field: keyof CategoryData, value: number) => {
    const newCategories = inputs.categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, [field]: value };
      }
      return cat;
    });
    const newInputs = { ...inputs, categories: newCategories };
    setInputs(newInputs);
    onChange?.(newInputs);
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = inputs.categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, isExpanded: !cat.isExpanded };
      }
      return cat;
    });
    setInputs({ ...inputs, categories: newCategories });
  };

  const addCategory = () => {
    const newCategory: CategoryData = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Category ${inputs.categories.length + 1}`,
      isExpanded: true,
      estimatedDailyFees: 0,
      actualDailyFees: 0,
      potentialRate: 0,
      actualRate: 0
    };
    const newInputs = {
      ...inputs,
      categories: [...inputs.categories, newCategory]
    };
    setInputs(newInputs);
    onChange?.(newInputs);
  };

  // Calculate Actual Revenue = (B103*B109*365)+(B104*B110*365)+(B105*B111*365)
  const actualRevenue = useMemo(() => {
    return inputs.categories.reduce((total, category) => {
      return total + (category.actualDailyFees * category.actualRate * 365);
    }, 0);
  }, [inputs.categories]);

  // Calculate Total Potential Revenue = (B100*B106*365)+(B101*B107*365)+(B102*B108*365)
  const totalPotentialRevenue = useMemo(() => {
    return inputs.categories.reduce((total, category) => {
      return total + (category.estimatedDailyFees * category.potentialRate * 365);
    }, 0);
  }, [inputs.categories]);

  // Calculate Total Gap Short-term Fees = B113-B112
  const totalGapShortTermFees = useMemo(() => {
    return totalPotentialRevenue - actualRevenue;
  }, [totalPotentialRevenue, actualRevenue]);

  // Calculate % of Potential Leveraged = B112/B113
  const percentagePotentialLeveraged = useMemo(() => {
    return totalPotentialRevenue > 0 ? (actualRevenue / totalPotentialRevenue) * 100 : 0;
  }, [actualRevenue, totalPotentialRevenue]);

  // Calculate Compliance Gap = ((B100-B103)*B109*365)+((B101-B104)*B110*365)+((B102-B105)*B111*365)
  const complianceGap = useMemo(() => {
    return inputs.categories.reduce((total, category) => {
      const dailyFeeDiff = category.estimatedDailyFees - category.actualDailyFees;
      return total + (dailyFeeDiff * category.actualRate * 365);
    }, 0);
  }, [inputs.categories]);

  // Calculate Rate Gap = ((B106-B109)*B103*365)+((B107-B110)*B104*365)+((B105-B108)*B111*365)
  const rateGap = useMemo(() => {
    let total = 0;
    inputs.categories.forEach((category, index) => {
      const rateDiff = category.potentialRate - category.actualRate;
      const actualDailyFees = category.actualDailyFees;
      total += rateDiff * actualDailyFees * 365;
    });
    return total;
  }, [inputs.categories]);

  // Calculate Combined gaps = B114-SUM(B117+B118)
  const combinedGaps = useMemo(() => {
    return totalGapShortTermFees - (complianceGap + rateGap);
  }, [totalGapShortTermFees, complianceGap, rateGap]);

  // Calculate individual category gaps
  const categoryGaps = useMemo(() => {
    return inputs.categories.map(category => {
      const potentialRevenue = category.estimatedDailyFees * category.potentialRate * 365;
      const actualRevenue = category.actualDailyFees * category.actualRate * 365;
      return {
        name: category.name,
        value: potentialRevenue - actualRevenue
      };
    });
  }, [inputs.categories]);

  // Calculate Gap Category A, B, C
  const gapCategoryA = useMemo(() => categoryGaps[0]?.value || 0, [categoryGaps]);
  const gapCategoryB = useMemo(() => categoryGaps[1]?.value || 0, [categoryGaps]);
  const gapCategoryC = useMemo(() => categoryGaps[2]?.value || 0, [categoryGaps]);

  // Calculate Largest Gap (equivalent to VLOOKUP with LARGE)
  const largestGap = useMemo(() => {
    const gaps = [
      { name: 'Compliance Gap', value: complianceGap },
      { name: 'Rate Gap', value: rateGap },
      { name: 'Combined gaps', value: combinedGaps }
    ];
    return gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);
  }, [complianceGap, rateGap, combinedGaps]);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getGapAnalysisMessage = (percentage: number) => {
    if (percentage < 30) {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) faces a <span className="font-bold">significant challenge</span> as the percentage of potential leveraged revenue falls <span className="font-bold">below 30%</span> at the value <span className="font-bold">{percentage.toFixed(2)}%</span>. This indicates a <span className="font-bold">substantial gap</span> between the revenue collected and the total estimated potential revenue. To close the gap, a <span className="font-bold">comprehensive analysis</span> of existing revenue channels, revisions of pricing structures may be required.
        </span>
      );
    } else if (percentage >= 30 && percentage < 70) {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) shows <span className="font-bold">moderate performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates <span className="font-bold">some success</span> in revenue collection, there remains <span className="font-bold">room for improvement</span>. Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
        </span>
      );
    } else {
      return (
        <span>
          The Short-term User Charge Revenue Collection (GOA) demonstrates <span className="font-bold">strong performance</span> with <span className="font-bold">{percentage.toFixed(2)}%</span> of potential revenue being leveraged. This <span className="font-bold">high percentage</span> indicates effective revenue collection practices. Maintaining current strategies while monitoring for optimization opportunities is recommended.
        </span>
      );
    }
  };

  const getBreakdownAnalysisMessage = () => {
    const complianceGapValue = complianceGap;
    const rateGapValue = rateGap;
    const combinedGapsValue = combinedGaps;

    const gaps = [
      { type: 'Compliance Gap', value: complianceGapValue },
      { type: 'Rate Gap', value: rateGapValue },
      { type: 'Combined Gaps', value: combinedGapsValue }
    ];

    const largestGap = gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);

    if (largestGap.value <= 0) {
      return (
        <span>
          The gaps in short-term user charge revenue collection are <span className="font-bold">relatively balanced</span>, with no single gap type significantly outweighing the others. This suggests a need for a <span className="font-bold">comprehensive approach</span> to address all aspects of revenue collection equally.
        </span>
      );
    }

    switch (largestGap.type) {
      case 'Compliance Gap':
        return (
          <span>
            <span className="font-bold">Compliance gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at <span className="font-bold">{formatCurrency(complianceGapValue)}</span>. This indicates a <span className="font-bold">significant discrepancy</span> between the number of potential users and actual users paying the charges.
          </span>
        );
      case 'Rate Gap':
        return (
          <span>
            <span className="font-bold">Rate gap</span> is identified as the largest gap contributing to the total gap in short-term user charge revenue collection, at <span className="font-bold">{formatCurrency(rateGapValue)}</span>. This suggests that the <span className="font-bold">current rates</span> being charged may need to be reviewed and adjusted to better align with market values or service costs.
          </span>
        );
      case 'Combined Gaps':
        return (
          <span>
            <span className="font-bold">Combined gaps</span> represent the largest portion of revenue loss in short-term user charge collection, at <span className="font-bold">{formatCurrency(combinedGapsValue)}</span>. This indicates <span className="font-bold">multiple factors</span> contributing to the revenue gap that require a comprehensive approach to address.
          </span>
        );
      default:
        return null;
    }
  };

  const sampleData = {
    categories: [
      {
        name: 'Parking Fees',
        estimatedDailyUsers: 2000,
        standardRate: 100,
        registeredDailyUsers: 1500,
        averagePaidRate: 80
      },
      {
        name: 'Market Entry Fees',
        estimatedDailyUsers: 1000,
        standardRate: 50,
        registeredDailyUsers: 800,
        averagePaidRate: 40
      }
    ]
  };

  const [metrics, setMetrics] = useState(sampleData);

  useEffect(() => {
    const potential = calculateTotalPotentialRevenue(metrics);
    const actual = calculateActualRevenue({
      categories: metrics.categories.map(category => ({
        actualDailyFees: category.registeredDailyUsers,
        actualRate: category.averagePaidRate
      }))
    });
    const gap = calculateTotalGap(metrics);
    
    console.log({
      potential,
      actual,
      gap
    });
  }, [metrics]);

  return (
    <div className="flex">
      {/* Left side - Input Form */}
      <div className="w-1/3">
        <div className="p-6">
          <div className="mb-6">
            
          </div>

          {/* Main Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Number of Daily Fees
                </label>
                <input
                  type="number"
                  name="estimatedDailyFees"
                  value={inputs.estimatedDailyFees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Actual Number of Daily Fees
                </label>
                <input
                  type="number"
                  name="actualDailyFees"
                  value={inputs.actualDailyFees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-base font-medium">Categories</h5>
              <button
                onClick={addCategory}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <span className="text-lg mr-2">+</span>
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {inputs.categories.map(category => (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <button
                    className="w-full px-6 py-3 flex justify-between items-center"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="text-base font-medium">{category.name}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${category.isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {category.isExpanded && (
                    <div className="px-6 pb-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Estimated Number of Daily Fees
                        </label>
                        <input
                          type="number"
                          value={category.estimatedDailyFees}
                          onChange={(e) => handleCategoryInputChange(category.id, 'estimatedDailyFees', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Actual Number of Daily Fees
                        </label>
                        <input
                          type="number"
                          value={category.actualDailyFees}
                          onChange={(e) => handleCategoryInputChange(category.id, 'actualDailyFees', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Potential Rate payable by Leasees
                        </label>
                        <input
                          type="number"
                          value={category.potentialRate}
                          onChange={(e) => handleCategoryInputChange(category.id, 'potentialRate', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Actual Rate paid by Leasees
                        </label>
                        <input
                          type="number"
                          value={category.actualRate}
                          onChange={(e) => handleCategoryInputChange(category.id, 'actualRate', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Charts and Analysis */}
      <div className="w-2/3 p-6 space-y-6">
        {/* Revenue Analysis Chart */}
        <div>
          <h4 className="text-sm font-medium text-blue-500 text-center mb-6">Short-term User Charge Gap Analysis</h4>
          <div className="h-96">
            <Bar
              data={{
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
                    label: 'Total Gap Short-term Fees',
                    data: [totalGapShortTermFees],
                    backgroundColor: 'rgb(249, 115, 22)', // orange-500
                    borderColor: 'rgb(249, 115, 22)',
                    borderWidth: 0,
                  }
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Short Term User Charge Revenue Analysis Formulas */}
        <div className="mb-6 cursor-pointer">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Short Term User Charge Revenue Analysis Formulas</h3>
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                showFormulas ? 'transform rotate-180' : ''
              }`}
              onClick={() => setShowFormulas(!showFormulas)}
            />
          </div>

          {showFormulas && (
            <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Actual Revenue</h5>
                <div className="pl-4 font-mono text-sm">
                  = <span className="text-blue-600">Actual Daily Fees</span> × <span className="text-blue-600">Actual Rate</span> × 365
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Total Potential Revenue</h5>
                <div className="pl-4 font-mono text-sm">
                  = <span className="text-emerald-600">Estimated Daily Fees</span> × <span className="text-emerald-600">Potential Rate</span> × 365
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Total Gap Short-term Fees</h5>
                <div className="pl-4 font-mono text-sm">
                  = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-red-600">Actual Revenue</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gap Analysis Message */}
        <div className="mt-4">
          <h4 className="text-base font-medium text-gray-900 mb-3">Short Term User Charge Gap Analysis</h4>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            {getGapAnalysisMessage(percentagePotentialLeveraged)}
          </div>
        </div>

       

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <div className="text-sm text-gray-500 mb-1">Total Gap</div>
            <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
              {formatCurrency(totalGapShortTermFees)}
            </div>
            <div className="text-sm text-red-600">
              Revenue improvement potential
            </div>
          </div>
        </div>

        {/* Gap Analysis Chart */}
        <div>
          <h4 className="text-sm font-medium text-blue-500 text-center mb-6">Short-term User Charge Breakdown Analysis</h4>
          <div className="h-96">
            <Bar
              data={{
                labels: [''],
                datasets: [
                  {
                    label: 'Compliance Gap',
                    data: [complianceGap],
                    backgroundColor: 'rgb(59, 130, 246)', // blue-500
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 0,
                  },
                  {
                    label: 'Rate Gap',
                    data: [rateGap],
                    backgroundColor: 'rgb(249, 115, 22)', // orange-500
                    borderColor: 'rgb(249, 115, 22)',
                    borderWidth: 0,
                  },
                  {
                    label: 'Combined gaps',
                    data: [combinedGaps],
                    backgroundColor: 'rgb(156, 163, 175)', // gray-400
                    borderColor: 'rgb(156, 163, 175)',
                    borderWidth: 0,
                  }
                ],
              }}
              options={chartOptions}
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
 {/* Breakdown Analysis */}
 <div className="mt-4">
          <h4 className="text-base font-medium text-gray-900 mb-3">Short-term User Charge Breakdown Analysis</h4>
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
  );
}