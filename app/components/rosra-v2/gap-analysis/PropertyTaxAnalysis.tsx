'use client';

import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
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
import { ChevronUpIcon, ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Category = {
  id: string;
  name: string;
  registeredTaxpayers: number;
  compliantTaxpayers: number;
  estimatedLandValue: number;
  actualLandValue: number;
  taxRate: number;
  isExpanded: boolean;
};

type Metrics = {
  categories: Category[];
  totalEstimatedTaxPayers: number;
  registeredTaxPayers: number;
};

type PropertyTaxAnalysisProps = {
  onMetricsChange?: (metrics: {
    actual: number;
    potential: number;
    gap: number;
  }) => void;
};

const PropertyTaxAnalysis: FC<PropertyTaxAnalysisProps> = ({ onMetricsChange }) => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalEstimatedTaxPayers: 70000,
    registeredTaxPayers: 50000,
    categories: [
      {
        id: '1',
        name: 'Residential Properties',
        registeredTaxpayers: 30000,
        compliantTaxpayers: 20000,
        actualLandValue: 10000,
        estimatedLandValue: 30000,
        taxRate: 0.007,
        isExpanded: false
      },
      {
        id: '2',
        name: 'Commercial Properties',
        registeredTaxpayers: 15000,
        compliantTaxpayers: 5000,
        actualLandValue: 20000,
        estimatedLandValue: 60000,
        taxRate: 0.006,
        isExpanded: false
      },
      {
        id: '3',
        name: 'Industrial Properties',
        registeredTaxpayers: 5000,
        compliantTaxpayers: 1000,
        actualLandValue: 30000,
        estimatedLandValue: 40000,
        taxRate: 0.005,
        isExpanded: false
      }
    ]
  });

  // Save to localStorage whenever metrics change
  useEffect(() => {
    localStorage.setItem('propertyTaxMetrics', JSON.stringify(metrics));
  }, [metrics]);

  // State for showing/hiding formulas
  const [isFormulaVisible, setIsFormulaVisible] = useState(false);
  const [isGapFormulaVisible, setIsGapFormulaVisible] = useState(false);

  // Handle input changes for main metrics
  const handleInputChange = (field: string, value: number) => {
    setMetrics((prev: Metrics) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes to category fields
  const handleCategoryChange = (categoryId: string, field: string, value: number) => {
    setMetrics((prev: Metrics) => ({
      ...prev,
      categories: prev.categories.map((category: Category) => 
        category.id === categoryId 
          ? { ...category, [field]: value }
          : category
      )
    }));
  };

  // Handle category name change
  const handleCategoryNameChange = (categoryId: string, newName: string) => {
    setMetrics(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
    }));
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: `Category ${metrics.categories.length + 1}`,
      registeredTaxpayers: 0,
      compliantTaxpayers: 0,
      estimatedLandValue: 0,
      actualLandValue: 0,
      taxRate: 0,
      isExpanded: true
    };

    setMetrics((prev: Metrics) => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  // Handle deleting a category
  const handleDeleteCategory = (categoryId: string) => {
    setMetrics((prev: Metrics) => ({
      ...prev,
      categories: prev.categories.filter((category: Category) => category.id !== categoryId)
    }));
  };

  // Handle expanding/collapsing category sections
  const handleToggleCategory = (categoryId: string) => {
    setMetrics((prev: Metrics) => ({
      ...prev,
      categories: prev.categories.map((category: Category) => 
        category.id === categoryId 
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    }));
  };

  // Calculate metrics
  const calculateActualRevenue = () => {
    return metrics.categories.reduce((total, category) => {
      return total + (
        category.compliantTaxpayers * 
        category.actualLandValue * 
        category.taxRate
      );
    }, 0);
  };

  // Calculate total potential revenue
  const calculatePotentialRevenue = () => {
    try {
      const { categories, registeredTaxPayers, totalEstimatedTaxPayers } = metrics;
      
      if (!totalEstimatedTaxPayers || !registeredTaxPayers) {
        return 0;
      }

      // Calculate sum of potential revenue for each category
      const categoryPotentialSum = categories.reduce((total, category, index) => {
        const categoryRevenue = 
          category.registeredTaxpayers * 
          category.estimatedLandValue * 
          category.taxRate;
        
        console.log(`Category ${index + 1} potential:`, {
          registered: category.registeredTaxpayers,
          estimatedValue: category.estimatedLandValue,
          taxRate: category.taxRate,
          revenue: categoryRevenue
        });
        
        return total + categoryRevenue;
      }, 0);

      // Apply the registration ratio adjustment
      const registrationRatio = registeredTaxPayers / totalEstimatedTaxPayers;
      const totalPotential = categoryPotentialSum / registrationRatio;

      console.log('Potential Revenue Calculation:', {
        categorySum: categoryPotentialSum,
        registrationRatio,
        totalPotential
      });

      return totalPotential;
    } catch (error) {
      console.error('Error calculating potential revenue:', error);
      return 0;
    }
  };

  const calculateGap = () => {
    return calculatePotentialRevenue() - calculateActualRevenue();
  };

  // Calculate current values
  const actualRevenue = calculateActualRevenue();
  const potentialRevenue = calculatePotentialRevenue();
  const gap = calculateGap();

  // Pass metrics up to parent whenever they change
  useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange({
        actual: actualRevenue,
        potential: potentialRevenue,
        gap: gap
      });
    }
  }, [actualRevenue, potentialRevenue, gap, onMetricsChange]);

  // Get data for main chart
  const getChartData = () => {
    const actualRevenue = calculateActualRevenue();
    const totalGap = calculateGap();

    return {
      labels: ['Property Tax Revenue'],
      datasets: [
        {
          label: 'Actual Revenue',
          data: [actualRevenue || 0],
          backgroundColor: 'rgb(59, 130, 246)', // blue-500
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 0,
        },
        {
          label: 'Total Gap Property Tax',
          data: [totalGap || 0],
          backgroundColor: 'rgb(249, 115, 22)', // orange-500
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 0,
        }
      ],
    };
  };

  // Get data for breakdown chart
  const getBreakdownChartData = () => {
    try {
      const registrationGap = calculateRegistrationGap();
      const complianceGap = calculateComplianceGap();
      const assessmentGap = calculateAssessmentGap();
      const rateGap = calculateRateGap();
      const combinedGap = calculateCombinedGaps();

      return {
        labels: ['Gap Breakdown'],
        datasets: [
          {
            label: 'Registration Gap',
            data: [registrationGap || 0],
            backgroundColor: 'rgb(59, 130, 246)', // blue-500
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 0,
          },
          {
            label: 'Compliance Gap',
            data: [complianceGap || 0],
            backgroundColor: 'rgb(16, 185, 129)', // green-500
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 0,
          },
          {
            label: 'Assessment Gap',
            data: [assessmentGap || 0],
            backgroundColor: 'rgb(245, 158, 11)', // amber-500
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 0,
          },
          {
            label: 'Rate Gap',
            data: [rateGap || 0],
            backgroundColor: 'rgb(239, 68, 68)', // red-500
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 0,
          },
          {
            label: 'Combined Gaps',
            data: [combinedGap || 0],
            backgroundColor: 'rgb(139, 92, 246)', // purple-500
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 0,
          }
        ]
      };
    } catch (error) {
      console.error('Error getting chart data:', error);
      // Return a valid chart data structure even in case of error
      return {
        labels: ['Gap Breakdown'],
        datasets: [
          {
            label: 'No Data Available',
            data: [0],
            backgroundColor: 'rgb(209, 213, 219)', // gray-300
            borderColor: 'rgb(209, 213, 219)',
            borderWidth: 0,
          }
        ]
      };
    }
  };

  // Get analysis message based on potential leveraged percentage
  const getGapAnalysisMessage = () => {
    const potentialLeveraged = calculatePotentialLeveraged();
    const actualRevenue = calculateActualRevenue();
    const totalPotentialRevenue = calculatePotentialRevenue();

    if (potentialLeveraged < 30) {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at only <span className="text-red-600 font-medium">{potentialLeveraged.toFixed(1)}%</span>. This indicates a huge gap between the actual revenue (<span className="text-blue-600 font-medium">{actualRevenue.toLocaleString()}</span>) and the total potential revenue (<span className="text-blue-600 font-medium">{totalPotentialRevenue.toLocaleString()}</span>). Therefore, there are significant spaces for improvement from the property tax sector. Government may consider multifaceted strategies that combine <span className="text-blue-600 font-medium">accurate assessment, effective enforcement, public awareness, and tax policies</span>.
        </>
      );
    } else if (potentialLeveraged >= 30 && potentialLeveraged < 70) {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at <span className="text-yellow-600 font-medium">{potentialLeveraged.toFixed(1)}%</span>. This indicates that a certain amount of revenues are successfully collected for local governments. But there are still considerable gaps between the actual revenue (<span className="text-blue-600 font-medium">{actualRevenue.toLocaleString()}</span>) and the total potential revenue (<span className="text-blue-600 font-medium">{totalPotentialRevenue.toLocaleString()}</span>). Therefore, local government should consider further improving its property tax revenue through strategies that combine <span className="text-blue-600 font-medium">accurate assessment, effective enforcement, public awareness, and tax policies</span>.
        </>
      );
    } else {
      return (
        <>
          The percentage of potential leveraged revenue from property tax is at <span className="text-green-600 font-medium">{potentialLeveraged.toFixed(1)}%</span>. This indicates that there is a satisfactory amount of property tax revenue being successfully collected, and the gap between the actual revenue (<span className="text-blue-600 font-medium">{actualRevenue.toLocaleString()}</span>) and the total potential revenue (<span className="text-blue-600 font-medium">{totalPotentialRevenue.toLocaleString()}</span>) is not so significant. The local government should <span className="text-blue-600 font-medium">maintain its governance and tax policies</span> to keep collecting property tax revenue steadily.
        </>
      );
    }
  };

  // Get breakdown analysis message based on largest gap
  const getBreakdownAnalysisMessage = () => {
    try {
      const largestGap = getLargestGap();
      switch (largestGap.name) {
        case 'Assessment/Valuation gap':
          return (
            <>
              The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the assessment/valuation gap, at <span className="text-emerald-600 font-medium">{calculateAssessmentGap().toLocaleString()}</span>. The assessment/valuation gap refers to the difference between the assessed value of a property for taxation purposes and its actual market value. Hence, government may consider improving the valuation processes for taxation to bridge this gap. <span className="text-gray-700 font-medium">However, local government should also pay attention to other property tax gap sources as well.</span>
            </>
          );
        
        case 'Registration gap':
          return (
            <>
              The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the registration gap, at <span className="text-emerald-600 font-medium">{calculateRegistrationGap().toLocaleString()}</span>. This indicates that there are properties that are eligible for taxation but are not properly registered or assessed for taxation. Therefore, local governments may take strategies about property assessment and property registration to close the registration gap. <span className="text-gray-700 font-medium">However, local government should also pay attention to other property tax gap sources as well.</span>
            </>
          );
        
        case 'Compliance gap':
          return (
            <>
              The largest gap between the actual revenue and estimated potential revenue among the property tax revenue sources is from the compliance gap, at <span className="text-emerald-600 font-medium">{calculateComplianceGap().toLocaleString()}</span>. This illustrates that there is a shortfall between the potential tax revenue that should be collected based on tax laws and the actual revenue collected. Therefore, governments can consider strategies like raising public awareness and clear tax obligation communication to close the compliance gap. <span className="text-gray-700 font-medium">However, local government should also pay attention to other property tax gap sources as well.</span>
            </>
          );
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting breakdown analysis message:', error);
      return (
        <>
          An error occurred while calculating the breakdown analysis message.
        </>
      );
    }
  };

  // Chart options for light mode
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
          label: function(context: { dataset: { label: string }; parsed: number }) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            return label + context.parsed.toLocaleString();
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
          callback: function(value: number) {
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

  // Chart options for dark mode
  const darkChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)', // text-gray-400 for dark mode
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Property Tax Revenue Analysis',
        color: 'rgb(156, 163, 175)', // text-gray-400 for dark mode
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgb(75, 85, 99)', // gray-600 for dark mode
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // text-gray-400 for dark mode
        }
      },
      y: {
        grid: {
          color: 'rgb(75, 85, 99)', // gray-600 for dark mode
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // text-gray-400 for dark mode
        }
      }
    }
  };

  // Calculate percentage of potential revenue leveraged
  const calculatePotentialLeveraged = () => {
    const potential = calculatePotentialRevenue();
    return potential ? (calculateActualRevenue() / potential * 100) : 0;
  };

  // Calculate registration gap
  const calculateRegistrationGap = () => {
    try {
      const { categories, registeredTaxPayers, totalEstimatedTaxPayers } = metrics;
      
      if (!totalEstimatedTaxPayers || !registeredTaxPayers) {
        return 0;
      }

      // Calculate sum of compliant taxpayers revenue for each category
      const categorySum = categories.reduce((total, category, index) => {
        const categoryRevenue = 
          category.compliantTaxpayers * 
          category.actualLandValue * 
          category.taxRate;
        
        console.log(`Category ${index + 1} registration gap:`, {
          compliant: category.compliantTaxpayers,
          actualValue: category.actualLandValue,
          taxRate: category.taxRate,
          revenue: categoryRevenue
        });
        
        return total + categoryRevenue;
      }, 0);

      // Apply the registration ratio adjustment
      const registrationRatio = registeredTaxPayers / totalEstimatedTaxPayers;
      const registrationGap = categorySum / registrationRatio;

      console.log('Registration Gap Calculation:', {
        categorySum,
        registrationRatio,
        registrationGap
      });

      return registrationGap;
    } catch (error) {
      console.error('Error calculating registration gap:', error);
      return 0;
    }
  };

  // Calculate compliance gap
  const calculateComplianceGap = () => {
    try {
      const { categories } = metrics;
      return categories.reduce((total, category) => {
        const complianceGap = (category.registeredTaxpayers - category.compliantTaxpayers) * 
                            category.actualLandValue * 
                            category.taxRate;
        return total + complianceGap;
      }, 0);
    } catch (error) {
      console.error('Error calculating compliance gap:', error);
      return 0;
    }
  };

  // Calculate assessment/valuation gap
  const calculateAssessmentGap = () => {
    try {
      const { categories } = metrics;
      return categories.reduce((total, category) => {
        const valuationDifference = category.estimatedLandValue - category.actualLandValue;
        return total + (valuationDifference * category.compliantTaxpayers * category.taxRate);
      }, 0);
    } catch (error) {
      console.error('Error calculating assessment gap:', error);
      return 0;
    }
  };

  // Calculate rate gap
  const calculateRateGap = () => {
    const { categories } = metrics;
    if (categories.length < 3) return 0;
    
    try {
      return (
        (categories[0].estimatedLandValue * categories[0].taxRate * 0.2 +
         categories[1].estimatedLandValue * categories[1].taxRate * 0.2 +
         categories[2].estimatedLandValue * categories[2].taxRate * 0.2) /
        (categories.length || 1)
      );
    } catch (error) {
      console.error('Error calculating rate gap:', error);
      return 0;
    }
  };

  // Calculate combined gaps
  const calculateCombinedGaps = () => {
    const totalGap = calculateGap();
    const registrationGap = calculateRegistrationGap();
    const complianceGap = calculateComplianceGap();
    const assessmentGap = calculateAssessmentGap();
    return totalGap - (registrationGap + complianceGap + assessmentGap);
  };

  // Calculate gap for Category A
  const calculateGapCategoryA = () => {
    const { categories } = metrics;
    // (Registered × Estimated Value × Tax Rate) - (Compliant × Actual Value × Tax Rate)
    return (categories[0].registeredTaxpayers * categories[0].estimatedLandValue * categories[0].taxRate) -
           (categories[0].compliantTaxpayers * categories[0].actualLandValue * categories[0].taxRate);
  };

  // Calculate gap for Category B
  const calculateGapCategoryB = () => {
    const { categories } = metrics;
    return (categories[1].registeredTaxpayers * categories[1].estimatedLandValue * categories[1].taxRate) -
           (categories[1].compliantTaxpayers * categories[1].actualLandValue * categories[1].taxRate);
  };

  // Calculate gap for Category C
  const calculateGapCategoryC = () => {
    const { categories } = metrics;
    return (categories[2].registeredTaxpayers * categories[2].estimatedLandValue * categories[2].taxRate) -
           (categories[2].compliantTaxpayers * categories[2].actualLandValue * categories[2].taxRate);
  };

  // Get the largest gap among different types
  const getLargestGap = () => {
    try {
      const gaps = [
        { value: calculateRegistrationGap(), name: 'Registration gap' },
        { value: calculateComplianceGap(), name: 'Compliance gap' },
        { value: calculateAssessmentGap(), name: 'Assessment/Valuation gap' }
      ];
      
      // Add null check and default value
      const maxGap = gaps.reduce((max, gap) => 
        (gap.value > (max?.value || 0) ? gap : max), 
        { value: 0, name: 'No significant gap' }
      );
      
      return maxGap;
    } catch (error) {
      console.error('Error calculating largest gap:', error);
      return { value: 0, name: 'No significant gap' };
    }
  };

  // Get category with largest gap
  const getCategoryWithLargestGap = () => {
    const gaps = [
      { value: calculateGapCategoryA(), name: 'Gap Category A' },
      { value: calculateGapCategoryB(), name: 'Gap Category B' },
      { value: calculateGapCategoryC(), name: 'Gap Category C' }
    ];
    return gaps.reduce((max, gap) => gap.value > max.value ? gap : max, gaps[0]);
  };

  // Render component UI
  return (
    <div className="p-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Property Tax Analysis</h4>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - 1/3 */}
        <div className="lg:w-1/3 space-y-4">
          {/* Total Estimated and Registered Taxpayers Inputs */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total estimated No of Property Tax Payers
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.totalEstimatedTaxPayers}
                  onChange={(e) => setMetrics(prev => ({
                    ...prev,
                    totalEstimatedTaxPayers: Number(e.target.value)
                  }))}
                  className="block w-full px-3 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Registered Property Tax Payers
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={metrics.registeredTaxPayers}
                  onChange={(e) => setMetrics(prev => ({
                    ...prev,
                    registeredTaxPayers: Number(e.target.value)
                  }))}
                  className="block w-full px-3 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">Categories</h5>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>
            </div>

            <div className="space-y-3">
              {metrics.categories.map((category, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                        className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none w-full"
                      />
                      <button
                        onClick={() => handleToggleCategory(category.id)}
                        className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${category.isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {category.isExpanded && (
                    <div className="p-3 pt-0 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Registered Taxpayers
                          </label>
                          <input
                            type="number"
                            value={category.registeredTaxpayers}
                            onChange={(e) => handleCategoryChange(category.id, 'registeredTaxpayers', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Compliant Taxpayers
                          </label>
                          <input
                            type="number"
                            value={category.compliantTaxpayers}
                            onChange={(e) => handleCategoryChange(category.id, 'compliantTaxpayers', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Average Value of land/property
                          </label>
                          <input
                            type="number"
                            value={category.actualLandValue}
                            onChange={(e) => handleCategoryChange(category.id, 'actualLandValue', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Estimated Average Value
                          </label>
                          <input
                            type="number"
                            value={category.estimatedLandValue}
                            onChange={(e) => handleCategoryChange(category.id, 'estimatedLandValue', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={category.taxRate * 100}
                          onChange={(e) => handleCategoryChange(category.id, 'taxRate', Number(e.target.value) / 100)}
                          className="block w-full px-2.5 py-1.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.1"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="w-full mt-3 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Category
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 2/3 */}
        <div className="lg:w-2/3">
          {/* Gap Analysis Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-white/10">
            <h4 className="text-sm font-medium text-blue-500 text-center mb-3">Property Tax Gap Analysis</h4>
            <div className="h-96">
              <Bar
                data={getChartData()}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Formula Section */}
          <div className="mt-4">
            <button
              onClick={() => setIsFormulaVisible(!isFormulaVisible)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                <span >Property Tax Revenue Analysis Formulas</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform ${isFormulaVisible ? 'rotate-180' : ''}`} />
            </button>

            {isFormulaVisible && (
              <div className="mt-2 space-y-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-white/10">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Actual Revenue</div>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-blue-600">Registered Property Tax Payers</span> × <span className="text-emerald-600">Average Land Value</span> × <span className="text-purple-600">Actual Tax Rate</span>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Total Potential Revenue</div>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-blue-600">Estimated Property Tax Payers</span> × <span className="text-emerald-600">Average Land Value</span> × <span className="text-purple-600">Potential Tax Rate</span>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Total Gap Property Tax</div>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-blue-600">Actual Revenue</span>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">% of Potential Leveraged</div>
                  <div className="pl-4 font-mono text-sm">
                    = (<span className="text-blue-600">Actual Revenue</span> ÷ <span className="text-purple-600">Total Potential Revenue</span>) × 100
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gap Analysis Text */}
          <div className="mt-4">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Property Tax Gap Analysis</h4>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {getGapAnalysisMessage()}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-5 border-l-4 border-blue-500 dark:border-blue-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Actual Revenue</div>
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                  {actualRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Current collected revenue
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-5 border-l-4 border-emerald-500 dark:border-emerald-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Total Potential Revenue</div>
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                  {potentialRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  Maximum possible revenue
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-5 border-l-4 border-red-500 dark:border-red-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Total Gap Property Tax</div>
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                  {gap.toLocaleString()}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Revenue improvement potential
                </div>
              </div>
            </div>

            {/* Gap Breakdown Chart */}
            <div className="mt-6 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-500 text-center mb-3">Property Tax Gap Breakdown Analysis</h4>
              <div className="h-96">
                <Bar
                  data={getBreakdownChartData()}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: {
                        ...chartOptions.scales.x,
                        stacked: true
                      },
                      y: {
                        ...chartOptions.scales.y,
                        stacked: true,
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Gap Breakdown Formulas */}
            <div className="mt-4">
              <button
                onClick={() => setIsGapFormulaVisible(!isGapFormulaVisible)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                  <span>Gap Breakdown Formulas</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform ${isGapFormulaVisible ? 'rotate-180' : ''}`} />
              </button>

              {isGapFormulaVisible && (
                <div className="mt-2 space-y-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-white/10">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Registration Gap</div>
                  <div className="pl-4 font-mono text-sm">
                    = (<span className="text-blue-600">Compliant Taxpayers × Land Value × Tax Rate</span> + 
                    <br/>&nbsp;&nbsp;<span className="text-emerald-600">Compliant Taxpayers × Land Value × Tax Rate</span> +
                    <br/>&nbsp;&nbsp;<span className="text-purple-600">Compliant Taxpayers × Land Value × Tax Rate</span>) ÷
                    <br/>&nbsp;&nbsp;(<span className="text-orange-600">Registered Taxpayers ÷ Total Estimated Taxpayers</span>)
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Compliance Gap</div>
                  <div className="pl-4 font-mono text-sm">
                    = (<span className="text-blue-600">(Registered - Compliant) × Land Value × Tax Rate</span>) +
                    <br/>&nbsp;&nbsp;(<span className="text-emerald-600">(Registered - Compliant) × Land Value × Tax Rate</span>) +
                    <br/>&nbsp;&nbsp;(<span className="text-purple-600">(Registered - Compliant) × Land Value × Tax Rate</span>)
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Assessment/Valuation Gap</div>
                  <div className="pl-4 font-mono text-sm">
                    = (<span className="text-blue-600">(Estimated - Actual Value) × Compliant × Tax Rate</span>) +
                    <br/>&nbsp;&nbsp;(<span className="text-emerald-600">(Estimated - Actual Value) × Compliant × Tax Rate</span>) +
                    <br/>&nbsp;&nbsp;(<span className="text-purple-600">(Estimated - Actual Value) × Compliant × Tax Rate</span>)
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Combined Gaps</div>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-gray-600">Total Gap - (Registration Gap + Compliance Gap + Assessment Gap)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gap Breakdown Analysis */}
          <div className="mt-8">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Property Tax Breakdown Analysis</h4>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {getBreakdownAnalysisMessage()}
              </div>
            </div>

            {/* Gap Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-blue-500 dark:border-blue-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Registration Gap</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {calculateRegistrationGap().toLocaleString()}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Unregistered property value
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-orange-500 dark:border-orange-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Compliance Gap</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {calculateComplianceGap().toLocaleString()}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Non-compliant revenue loss
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-gray-500 dark:border-gray-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Assessment Gap</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {calculateAssessmentGap().toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Valuation difference
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 border-yellow-500 dark:border-yellow-500/50">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Combined Gaps</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {calculateCombinedGaps().toLocaleString()}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
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


export default PropertyTaxAnalysis