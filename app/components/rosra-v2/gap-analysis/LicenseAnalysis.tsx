'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../../utils/formatters';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LicenseMetrics {
  actualRevenue: number;
  potentialRevenue: number;
  gap: number;
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
  categories: Array<{
    name: string;
    estimatedLicensees: number;
    registeredLicensees: number;
    compliantLicensees: number;
    licenseFee: number;
  }>;
}

interface LicenseAnalysisProps {
  metrics: LicenseMetrics;
}

interface Category {
  name: string;
  estimatedLicensees: number;
  registeredLicensees: number;
  compliantLicensees: number;
  licenseFee: number;
  averagePaidLicenseFee: number;
  isExpanded: boolean;
}

export function calculateTotalPotentialRevenue(metrics: LicenseMetrics) {
  // Calculate potential revenue for each category
  const categoryRevenue = metrics.categories.reduce((total, category) => {
    return total + (category.estimatedLicensees * category.licenseFee);
  }, 0);

  // Calculate total registered licensees
  const totalRegistered = metrics.categories.reduce((sum, cat) => sum + cat.registeredLicensees, 0);
  
  // Calculate unregistered licensees
  const totalEstimated = metrics.categories.reduce((sum, cat) => sum + cat.estimatedLicensees, 0);
  const unregisteredLicensees = totalEstimated - totalRegistered;
  
  // Calculate average license fee
  const totalLicenseFees = metrics.categories.reduce((sum, cat) => sum + cat.licenseFee, 0);
  const averageLicenseFee = totalLicenseFees / metrics.categories.length;
  
  // Total potential = revenue from categories + estimated revenue from unregistered
  return categoryRevenue + (unregisteredLicensees * averageLicenseFee);
}

export function calculateActualRevenue(metrics: LicenseMetrics) {
  return metrics.categories.reduce((total, category) => {
    return total + (category.compliantLicensees * category.averagePaidLicenseFee);
  }, 0);
}

export function calculateTotalGap(metrics: LicenseMetrics) {
  const potentialRevenue = calculateTotalPotentialRevenue(metrics);
  const actualRevenue = calculateActualRevenue(metrics);
  return potentialRevenue - actualRevenue;
}

export default function LicenseAnalysis({ onMetricsChange }: { onMetricsChange?: (metrics: any) => void }) {
  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Business Permits',
      estimatedLicensees: 70000,
      registeredLicensees: 15000,
      compliantLicensees: 10000,
      licenseFee: 35,
      averagePaidLicenseFee: 30,
      isExpanded: false
    },
    {
      name: 'Health Licenses',
      estimatedLicensees: 5000,
      registeredLicensees: 15000,
      compliantLicensees: 4000,
      licenseFee: 15,
      averagePaidLicenseFee: 10,
      isExpanded: false
    },
    {
      name: 'Operating Licenses',
      estimatedLicensees: 5000,
      registeredLicensees: 10000,
      compliantLicensees: 2000,
      licenseFee: 10,
      averagePaidLicenseFee: 5,
      isExpanded: false
    }
  ]);

  const toggleCategory = (index: number) => {
    setCategories(prevCategories => 
      prevCategories.map((cat, i) => 
        i === index ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const updateCategoryName = (index: number, newName: string) => {
    setCategories(prevCategories =>
      prevCategories.map((cat, i) =>
        i === index ? { ...cat, name: newName } : cat
      )
    );
  };

  useEffect(() => {
    if (onMetricsChange) {
      const metrics = {
        categories: categories.map(cat => ({
          name: cat.name,
          estimatedLicensees: cat.estimatedLicensees,
          registeredLicensees: cat.registeredLicensees,
          compliantLicensees: cat.compliantLicensees,
          licenseFee: cat.licenseFee,
          averagePaidLicenseFee: cat.averagePaidLicenseFee
        }))
      };

      const potential = calculateTotalPotentialRevenue(metrics);
      const actual = calculateActualRevenue(metrics);
      const gap = calculateTotalGap(metrics);
      
      onMetricsChange({
        potential,
        actual,
        gap
      });
    }
  }, [categories, onMetricsChange]);

  const [isFormulaVisible, setIsFormulaVisible] = useState(false);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);
  const [totalEstimatedLicensees, setTotalEstimatedLicensees] = useState(80000);

  const addCategory = () => {
    const newCategory: Category = {
      name: `Category ${String.fromCharCode(65 + categories.length)}`,
      estimatedLicensees: 0,
      registeredLicensees: 0,
      compliantLicensees: 0,
      licenseFee: 0,
      averagePaidLicenseFee: 0,
      isExpanded: true
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof Category, value: number | string) => {
    setCategories(categories.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    ));
  };

  // Calculate actual revenue from compliant licensees
  const calculateActualRevenue = () => {
    return categories.reduce((total, category) => {
      return total + (category.compliantLicensees * category.averagePaidLicenseFee);
    }, 0);
  };

  // Calculate total potential revenue including unregistered licensees
  const calculateTotalPotentialRevenue = () => {
    // First part: sum of (Estimated Licensees × License Fee) for each category
    const categoryRevenue = categories.reduce((total, category) => {
      return total + (category.estimatedLicensees * category.licenseFee);
    }, 0);

    // Calculate total registered licensees
    const totalRegistered = categories.reduce((sum, cat) => sum + cat.registeredLicensees, 0);
    
    // Calculate unregistered licensees (Total Estimated - Sum of Registered)
    const unregisteredLicensees = totalEstimatedLicensees - totalRegistered;
    
    // Calculate average license fee (sum of all fees divided by number of categories)
    const totalLicenseFees = categories.reduce((sum, cat) => sum + cat.licenseFee, 0);
    const averageLicenseFee = totalLicenseFees / categories.length;

    // For debugging
    console.log({
      categoryRevenue,
      totalRegistered,
      unregisteredLicensees,
      totalLicenseFees,
      averageLicenseFee,
      total: categoryRevenue + (unregisteredLicensees * averageLicenseFee)
    });

    // Return sum of category revenue and potential revenue from unregistered licensees
    return categoryRevenue + (unregisteredLicensees * averageLicenseFee);
  };

  // Calculate total gap
  const calculateTotalGap = () => {
    return calculateTotalPotentialRevenue() - calculateActualRevenue();
  };

  // Calculate percentage of potential revenue leveraged
  const calculatePotentialLeveraged = () => {
    const totalPotential = calculateTotalPotentialRevenue();
    return totalPotential > 0 ? (calculateActualRevenue() / totalPotential) * 100 : 0;
  };

  const totalGapPercentage = calculatePotentialLeveraged().toFixed(1);
  
  const calculateRegistrationGap = () => {
    // Registration gap = (Total Estimated - Sum of Registered) × Average License Fee
    const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimatedLicensees, 0);
    const totalRegistered = categories.reduce((sum, cat) => sum + cat.registeredLicensees, 0);
    const avgLicenseFee = categories.reduce((sum, cat) => sum + cat.licenseFee, 0) / categories.length;
    
    return (totalEstimated - totalRegistered) * avgLicenseFee;
  };

  const calculateComplianceGap = () => {
    // Compliance gap = ((Registered A - Compliant A) × Avg Fee A) + ((Registered B - Compliant B) × Avg Fee B) + ((Registered C - Compliant C) × Avg Fee C)
    return categories.reduce((sum, cat) => {
      return sum + ((cat.registeredLicensees - cat.compliantLicensees) * cat.averagePaidLicenseFee);
    }, 0);
  };

  const calculateAssessmentGap = () => {
    // Assessment gap = ((Est A × Avg Fee A) + (Est B × Avg Fee B) + (Est C × Avg Fee C)) - 
    //                  ((Compliant A × Avg Fee A) + (Compliant B × Avg Fee B) + (Compliant C × Avg Fee C)) - 
    //                  ((Registered A - Compliant A) × Avg Fee A) + ((Registered B - Compliant B) × Avg Fee B) + ((Registered C - Compliant C) × Avg Fee C)
    const estimatedRevenue = categories.reduce((sum, cat) => {
      return sum + (cat.estimatedLicensees * cat.averagePaidLicenseFee);
    }, 0);
    
    const compliantRevenue = categories.reduce((sum, cat) => {
      return sum + (cat.compliantLicensees * cat.averagePaidLicenseFee);
    }, 0);
    
    const complianceGap = calculateComplianceGap();
    
    return estimatedRevenue - compliantRevenue - complianceGap;
  };

  const calculateCombinedGaps = () => {
    // Combined gaps = Total Gap - (Registration + Compliance + Assessment)
    const totalGap = calculateTotalGap();
    const registrationGap = calculateRegistrationGap();
    const complianceGap = calculateComplianceGap();
    const assessmentGap = calculateAssessmentGap();
    
    return totalGap - (registrationGap + complianceGap + assessmentGap);
  };

  const calculateGapCategoryA = () => {
    // Gap Category A = (Estimated A × Avg Fee A) - (Compliant A × Avg Fee A)
    const categoryA = categories.find(cat => cat.name === 'Business Permits');
    if (!categoryA) return 0;
    return (categoryA.estimatedLicensees * categoryA.averagePaidLicenseFee) - 
           (categoryA.compliantLicensees * categoryA.averagePaidLicenseFee);
  };

  const calculateGapCategoryB = () => {
    // Gap Category B = (Estimated B × Avg Fee B) - (Compliant B × Avg Fee B)
    const categoryB = categories.find(cat => cat.name === 'Health Licenses');
    if (!categoryB) return 0;
    return (categoryB.estimatedLicensees * categoryB.averagePaidLicenseFee) - 
           (categoryB.compliantLicensees * categoryB.averagePaidLicenseFee);
  };

  const calculateGapCategoryC = () => {
    // Gap Category C = (Estimated C × Avg Fee C) - (Compliant C × Avg Fee C)
    const categoryC = categories.find(cat => cat.name === 'Operating Licenses');
    if (!categoryC) return 0;
    return (categoryC.estimatedLicensees * categoryC.averagePaidLicenseFee) - 
           (categoryC.compliantLicensees * categoryC.averagePaidLicenseFee);
  };

  const findLargestGapCategory = () => {
    // Find the largest gap among registration, compliance, and assessment gaps
    const gaps = [
      { name: 'Registration Gap', value: calculateRegistrationGap() },
      { name: 'Compliance Gap', value: calculateComplianceGap() },
      { name: 'Assessment Gap', value: calculateAssessmentGap() },
      { name: 'Category A', value: calculateGapCategoryA() },
      { name: 'Category B', value: calculateGapCategoryB() },
      { name: 'Category C', value: calculateGapCategoryC() }
    ];
    
    // Sort gaps by value in descending order and take the first one
    return gaps.sort((a, b) => b.value - a.value)[0].name;
  };

  const gaps = [
    calculateRegistrationGap(),
    calculateComplianceGap(),
    calculateAssessmentGap(),
    calculateCombinedGaps()
  ];
  const largestGap = Math.max(...gaps);
  const largestGapType = largestGap === gaps[0] ? 'Registration Gap' :
    largestGap === gaps[1] ? 'Compliance Gap' :
    largestGap === gaps[2] ? 'Assessment Gap' : 'Combined Gaps';
  
  const [showFormulas, setShowFormulas] = useState(false);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        
        color: '#4F46E5',
        font: {
          size: 16
        },
        padding: {
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        },
        stacked: true
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          },
          font: {
            size: 12
          }
        },
        stacked: true,
        beginAtZero: true
      }
    }
  };

  const getChartData = () => {
    const actualRevenue = calculateActualRevenue();
    const gap = calculateTotalGap();

    return {
      labels: [''],
      datasets: [
        {
          label: 'Actual Revenue',
          data: [actualRevenue],
          backgroundColor: '#4F46E5',
          borderColor: '#4F46E5',
          borderWidth: 0
        },
        {
          label: 'Total Gap',
          data: [gap],
          backgroundColor: '#F97316',
          borderColor: '#F97316',
          borderWidth: 0
        }
      ]
    };
  };

  const getBreakdownChartData = () => {
    return {
      labels: ['Gap Analysis'],
      datasets: [
        {
          label: 'Registration Gap',
          data: [calculateRegistrationGap()],
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 0
        },
        {
          label: 'Compliance Gap',
          data: [calculateComplianceGap()],
          backgroundColor: '#F97316',
          borderColor: '#F97316',
          borderWidth: 0
        },
        {
          label: 'Assessment Gap',
          data: [calculateAssessmentGap()],
          backgroundColor: '#6B7280',
          borderColor: '#6B7280',
          borderWidth: 0
        },
        {
          label: 'Combined Gaps',
          data: [calculateCombinedGaps()],
          backgroundColor: '#EAB308',
          borderColor: '#EAB308',
          borderWidth: 0
        }
      ]
    };
  };

  const breakdownChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const getGapAnalysisMessage = () => {
    const potentialLeveraged = calculatePotentialLeveraged();
    
    if (potentialLeveraged < 30) {
      return (
        <span>
          The License Revenue Collection (GOA) faces a <span className="font-bold">significant challenge</span> as the percentage of potential leveraged revenue falls <span className="font-bold">below 30%</span> at the value <span className="font-bold">{potentialLeveraged.toFixed(2)}%</span>. This indicates a <span className="font-bold">substantial gap</span> between the revenue collected and the total estimated potential revenue. To close the gap, a <span className="font-bold">comprehensive analysis</span> of existing revenue channels, revisions of pricing structures may be required.
        </span>
      );
    } else if (potentialLeveraged >= 30 && potentialLeveraged < 70) {
      return (
        <span>
          The License Revenue Collection (GOA) shows <span className="font-bold">moderate performance</span> with <span className="font-bold">{potentialLeveraged.toFixed(2)}%</span> of potential revenue being leveraged. While this indicates <span className="font-bold">some success</span> in revenue collection, there remains <span className="font-bold">room for improvement</span>. Strategic initiatives to optimize revenue collection processes could help bridge the remaining gap.
        </span>
      );
    } else {
      return (
        <span>
          The License Revenue Collection (GOA) demonstrates <span className="font-bold">strong performance</span> with <span className="font-bold">{potentialLeveraged.toFixed(2)}%</span> of potential revenue being leveraged. This <span className="font-bold">high percentage</span> indicates effective revenue collection practices. Maintaining current strategies while monitoring for optimization opportunities is recommended.
        </span>
      );
    }
  };

  const getGapTypeAnalysisMessage = () => {
    const registrationGapValue = calculateRegistrationGap();
    const complianceGapValue = calculateComplianceGap();
    const assessmentGapValue = calculateAssessmentGap();

    // Debug log the values
    console.log('Gap Values:', {
      registrationGap: registrationGapValue,
      complianceGap: complianceGapValue,
      assessmentGap: assessmentGapValue,
      categories: categories.map(cat => ({
        name: cat.name,
        estimated: cat.estimatedLicensees,
        registered: cat.registeredLicensees,
        compliant: cat.compliantLicensees,
        licenseFee: cat.licenseFee,
        avgPaidFee: cat.averagePaidLicenseFee
      }))
    });

    // Find the largest gap value
    const gaps = [
      { type: 'Registration Gap', value: registrationGapValue },
      { type: 'Compliance Gap', value: complianceGapValue },
      { type: 'Assessment Gap', value: assessmentGapValue }
    ];
    
    const largestGapInfo = gaps.reduce((max, gap) => 
      gap.value > max.value ? gap : max, gaps[0]
    );
    
    let gapAnalysis = '';
    
    if (largestGapInfo.value <= 0) {
      gapAnalysis = (
        <span>
          The gaps in business license revenue collection are <span className="font-bold">relatively balanced</span>, with no single gap type significantly outweighing the others. This suggests a need for a <span className="font-bold">comprehensive approach</span> to address all aspects of revenue collection equally.
        </span>
      );
    } else {
      switch(largestGapInfo.type) {
        case 'Registration Gap':
          gapAnalysis = (
            <span>
              <span className="font-bold">Registration gap</span> is identified as the largest gap contributing to the total gap in business license revenue collection, at <span className="font-bold">{formatCurrency(registrationGapValue)}</span>. This indicates that there is a gap or discrepancy between the number of businesses that are legally required to obtain a business license and the number of businesses that have actually registered and obtained the necessary licenses.
            </span>
          );
          break;
        case 'Compliance Gap':
          gapAnalysis = (
            <span>
              <span className="font-bold">Compliance gap</span> is identified as the largest gap contributing to the total gap in business license revenue collection, at <span className="font-bold">{formatCurrency(complianceGapValue)}</span>. This reflects that the local government may miss some revenues because some registered businesses with licenses are not paying their taxes.
            </span>
          );
          break;
        case 'Assessment Gap':
          gapAnalysis = (
            <span>
              <span className="font-bold">Assessment gap</span> is identified as the largest gap contributing to the total gap in business license revenue collection, at <span className="font-bold">{formatCurrency(assessmentGapValue)}</span>. The assessment gap occurs when there is a difference between the potential revenue calculated based on assessments and the actual revenue collected.
            </span>
          );
          break;
      }
    }

    return (
      <div className="text-sm text-gray-600 leading-relaxed">
        {gapAnalysis}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-4 text-gray-900">License Analysis</h4>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - 1/3 */}
        <div className="lg:w-1/3 space-y-4">
          {/* Total Estimated Input */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Total estimated No of Licensees
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalEstimatedLicensees}
                onChange={(e) => setTotalEstimatedLicensees(Number(e.target.value))}
                className="block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-xs"></span>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-900">Categories</h5>
              <button
                onClick={addCategory}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategoryName(index, e.target.value)}
                        className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none w-full"
                      />
                      <button
                        onClick={() => toggleCategory(index)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
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
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Registered Licensees
                          </label>
                          <input
                            type="number"
                            value={category.registeredLicensees}
                            onChange={(e) => updateCategory(index, 'registeredLicensees', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Compliant Licensees
                          </label>
                          <input
                            type="number"
                            value={category.compliantLicensees}
                            onChange={(e) => updateCategory(index, 'compliantLicensees', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Estimated Licensees
                          </label>
                          <input
                            type="number"
                            value={category.estimatedLicensees}
                            onChange={(e) => updateCategory(index, 'estimatedLicensees', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            License Fee
                          </label>
                          <input
                            type="number"
                            value={category.licenseFee}
                            onChange={(e) => updateCategory(index, 'licenseFee', Number(e.target.value))}
                            className="block w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Average Paid License Fee
                        </label>
                        <input
                          type="number"
                          value={category.averagePaidLicenseFee}
                          onChange={(e) => updateCategory(index, 'averagePaidLicenseFee', Number(e.target.value))}
                          className="block w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={() => deleteCategory(index)}
                        className="w-full mt-3 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center"
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
        <div className="lg:w-2/3 space-y-4">
        
          {/* Revenue and Gap Analysis Chart */}
          <div className="mt-6">
          <h4 className="text-sm font-medium text-blue-500 text-center mb-3">License Gaps Analysis</h4>
            <div className="h-96">
              <Bar 
                data={getChartData()}
                options={chartOptions}
              />
            </div>
          </div>
         

          {/* License Revenue Analysis Formulas */}
          <div
            className="mb-6 cursor-pointer"
            onClick={() => setShowFormulas(!showFormulas)}
          >
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">License Revenue Analysis Formulas</h3>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  showFormulas ? 'transform rotate-180' : ''
                }`}
              />
            </div>
            {showFormulas && (
              <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Actual Revenue</h5>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-blue-600">Compliant Licensees</span> × <span className="text-emerald-600">Average Paid License Fee</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Total Potential Revenue</h5>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-blue-600">Estimated Licensees</span> × <span className="text-emerald-600">License Fee</span>
                    <br />
                    + (<span className="text-blue-600">Unregistered Licensees</span> × <span className="text-emerald-600">Average License Fee</span>)
                    <br />
                    <span className="pl-4 text-gray-500">where:</span>
                    <br />
                    <span className="pl-8 text-blue-600">Unregistered Licensees</span> = <span className="text-blue-600">Total Estimated</span> - <span className="text-blue-600">Sum of Registered Licensees</span>
                    <br />
                    <span className="pl-8 text-emerald-600">Average License Fee</span> = Average of all category license fees
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Total Gap</h5>
                  <div className="pl-4 font-mono text-sm">
                    = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-blue-600">Actual Revenue</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">% of Potential Leveraged</h5>
                  <div className="pl-4 font-mono text-sm">
                    = (<span className="text-blue-600">Actual Revenue</span> ÷ <span className="text-purple-600">Total Potential Revenue</span>) × 100
                  </div>
                </div>
              </div>
            )}
          </div>

       

          {/* Gap Analysis Text */}
          <div className="mt-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">License Gap Analysis</h4>
            {/* Main Analysis */}
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
              <div className="text-sm text-gray-600 leading-relaxed">
                {getGapAnalysisMessage()}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-md shadow-sm p-5 border-l-4 border-blue-500">
              <div className="text-sm text-gray-500 mb-2">Actual Revenue</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">
                {formatCurrency(calculateActualRevenue())}
              </div>
              <div className="text-sm text-blue-600">
                Current collected revenue
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-5 border-l-4 border-emerald-500">
              <div className="text-sm text-gray-500 mb-2">Total Potential Revenue</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">
                {formatCurrency(calculateTotalPotentialRevenue())}
              </div>
              <div className="text-sm text-emerald-600">
                Maximum possible revenue
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-5 border-l-4 border-red-500">
              <div className="text-sm text-gray-500 mb-2">Total Gap License</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">
                {formatCurrency(calculateTotalGap())}
              </div>
              <div className="text-sm text-red-600">
                Revenue improvement potential
              </div>
            </div>
          </div>

          {/* Gap Breakdown Chart */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-blue-500 text-center mb-3">License Gap Breakdown Analysis</h4>
            
              <div className="h-96">
                <Bar 
                  data={getBreakdownChartData()}
                  options={breakdownChartOptions}
                />
              </div>
           
          </div>
                {/* Formula Section */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <button
              onClick={() => setIsFormulaVisible(!isFormulaVisible)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                <h5 className="text-sm font-medium text-gray-900">Gap Formulas</h5>
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${isFormulaVisible ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFormulaVisible && (
              <div className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-blue-600">Registration Gap</h6>
                  <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                    = (Total Estimated - SUM(Registered Licenses)) × AVERAGE(License Fees)
                  </p>
                </div>

                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-orange-600">Compliance Gap</h6>
                  <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                    = SUM((Registered - Compliant) × Average Fee) for each category
                  </p>
                </div>

                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-gray-600">Assessment Gap</h6>
                  <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                    = SUM(Estimated × Average Fee) - SUM(Compliant × Average Fee) - Compliance Gap
                  </p>
                </div>

                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-yellow-600">Combined Gaps</h6>
                  <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                    = Total Gap - (Registration Gap + Compliance Gap + Assessment Gap)
                  </p>
                </div>

                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-purple-600">Category Gap</h6>
                  <p className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                    = (Estimated × Average Fee) - (Compliant × Average Fee) for each category
                  </p>
                </div>
              </div>
            )}
          </div>
            {/* Gap Type Analysis */}
            <h4 className="text-base font-medium text-gray-900 mb-3">BreakGap Type Analysis</h4>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
             
              {getGapTypeAnalysisMessage()}
            </div>
             {/* Gap Type Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-blue-500">
                <div className="text-sm text-gray-500 mb-1">Registration Gap</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(calculateRegistrationGap())}
                </div>
                <div className="text-sm text-blue-600">
                  Unregistered licenses
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-orange-500">
                <div className="text-sm text-gray-500 mb-1">Compliance Gap</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(calculateComplianceGap())}
                </div>
                <div className="text-sm text-orange-600">
                  Non-compliant licenses
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-gray-500">
                <div className="text-sm text-gray-500 mb-1">Assessment Gap</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(calculateAssessmentGap())}
                </div>
                <div className="text-sm text-gray-600">
                  Under-assessed revenue
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 border-l-4 border-yellow-500">
                <div className="text-sm text-gray-500 mb-1">Combined Gaps</div>
                <div className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {formatCurrency(calculateCombinedGaps())}
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

export function LicenseAnalysisSample({ onMetricsChange }: { onMetricsChange?: (metrics: any) => void }) {
  const [metrics, setMetrics] = useState({
    categories: [
      {
        name: 'Business Permits',
        estimatedLicensees: 1000,
        registeredLicensees: 700,
        compliantLicensees: 600,
        licenseFee: 5000,
        averagePaidLicenseFee: 4500
      },
      {
        name: 'Trade Licenses',
        estimatedLicensees: 800,
        registeredLicensees: 500,
        compliantLicensees: 400,
        licenseFee: 3000,
        averagePaidLicenseFee: 2500
      }
    ]
  });

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

  return null; // This component is just for calculations
}
