'use client'

import React from 'react';
import { ViewType } from './types';

interface ViewToggleProps {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}

export default function ViewToggle({ viewType, setViewType }: ViewToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        View Options
      </h3>
      <button
        onClick={() => setViewType('highLevel')}
        className={`w-full px-4 py-2 rounded-md text-left transition-colors ${
          viewType === 'highLevel'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        High-Level Recommendations
      </button>
      <button
        onClick={() => setViewType('scenarios')}
        className={`w-full px-4 py-2 rounded-md text-left transition-colors ${
          viewType === 'scenarios'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        Scenario-Based Recommendations
      </button>
    </div>
  );
} 