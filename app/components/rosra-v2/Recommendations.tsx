'use client'

import React from 'react';
import { ClockIcon, ChartBarIcon, CogIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  timeline: 'Short-term' | 'Medium-term' | 'Long-term';
  impact: 'High' | 'Medium' | 'Low';
  steps: string[];
  icon: React.ElementType;
}

export default function Recommendations() {
  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'Digitize Revenue Collection',
      description: 'Implement a comprehensive digital revenue collection system',
      timeline: 'Short-term',
      impact: 'High',
      steps: [
        'Deploy e-payment system',
        'Train staff on digital tools',
        'Launch public awareness campaign',
        'Monitor adoption rates'
      ],
      icon: CogIcon
    },
    {
      id: 2,
      title: 'Data Management System',
      description: 'Establish centralized database for all revenue streams',
      timeline: 'Medium-term',
      impact: 'High',
      steps: [
        'Audit current data systems',
        'Design integrated database',
        'Migrate existing data',
        'Implement validation rules'
      ],
      icon: ChartBarIcon
    },
    {
      id: 3,
      title: 'Capacity Building',
      description: 'Enhance staff capabilities and technical expertise',
      timeline: 'Medium-term',
      impact: 'Medium',
      steps: [
        'Assess training needs',
        'Develop training modules',
        'Conduct workshops',
        'Evaluate performance improvements'
      ],
      icon: UserGroupIcon
    },
    {
      id: 4,
      title: 'Process Automation',
      description: 'Automate key revenue management processes',
      timeline: 'Long-term',
      impact: 'High',
      steps: [
        'Map current processes',
        'Identify automation opportunities',
        'Implement workflow systems',
        'Monitor efficiency gains'
      ],
      icon: ClockIcon
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Strategic Recommendations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {rec.title}
                    </h3>
                    <div className="flex space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.impact === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            : rec.impact === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}
                      >
                        {rec.impact} Impact
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.timeline === 'Short-term'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : rec.timeline === 'Medium-term'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}
                      >
                        {rec.timeline}
                      </span>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {rec.description}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Implementation Steps:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {rec.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}