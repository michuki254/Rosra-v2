import React from 'react';
import { Cause } from './causeTypes';

// General causes interface
interface GeneralCausesCardsProps {
  causes: Cause[];
}

export default function GeneralCausesCards({ causes }: GeneralCausesCardsProps) {
  return (
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
                <li key={`cause-${index}`}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
} 