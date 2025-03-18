'use client'

import React from 'react';

interface Cause {
  id: number;
  category: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  recommendations: string[];
}

export default function CausesAnalysis() {
  const causes: Cause[] = [
    {
      id: 1,
      category: 'Data Management',
      description: 'Incomplete or outdated property and business registries',
      impact: 'High',
      recommendations: [
        'Implement digital property registration system',
        'Regular data validation and cleanup',
        'Integration with national databases'
      ]
    },
    {
      id: 2,
      category: 'Collection Efficiency',
      description: 'Inefficient revenue collection methods and poor enforcement',
      impact: 'High',
      recommendations: [
        'Adopt digital payment systems',
        'Strengthen enforcement mechanisms',
        'Implement automated reminders'
      ]
    },
    {
      id: 3,
      category: 'Rate Setting',
      description: 'Outdated or undervalued rate structures',
      impact: 'Medium',
      recommendations: [
        'Regular rate reviews',
        'Market-based valuation methods',
        'Stakeholder consultation process'
      ]
    },
    {
      id: 4,
      category: 'Compliance',
      description: 'Low compliance levels due to lack of awareness',
      impact: 'Medium',
      recommendations: [
        'Public awareness campaigns',
        'Simplified payment processes',
        'Incentives for early payment'
      ]
    },
    {
      id: 5,
      category: 'Capacity',
      description: 'Limited staff capacity and technical expertise',
      impact: 'High',
      recommendations: [
        'Staff training programs',
        'Process automation',
        'Technical capacity building'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Analysis of Underlying Causes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {causes.map((cause) => (
          <div
            key={cause.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {cause.category}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cause.impact === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : cause.impact === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}
              >
                {cause.impact} Impact
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {cause.description}
            </p>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Recommended Actions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {cause.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}