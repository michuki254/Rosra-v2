'use client';

import React, { useState } from 'react';
// @ts-ignore - These imports are working but TypeScript is showing errors
import GeneralTab from './GeneralTab';
import PerformanceTab from './PerformanceTab';
import PerformanceAnalysisTab from './PerformanceAnalysisTab';
import ProblemTab from './ProblemTab';
import ProblemAnalysisTab from './ProblemAnalysisTab';

export default function TabContainer() {
  const [activeTab, setActiveTab] = useState('general');
  
  const tabs = [
    { id: 'general', label: 'General', number: '1', component: GeneralTab },
    { id: 'performance', label: 'Performance', number: '2', component: PerformanceTab },
    { id: 'performance-analysis', label: 'Performance Analysis', number: '3', component: PerformanceAnalysisTab },
    { id: 'problem', label: 'Problem', number: '4', component: ProblemTab },
    { id: 'problem-analysis', label: 'Problem Analysis', number: '5', component: ProblemAnalysisTab }
  ];
  
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex items-center justify-start md:justify-center min-w-max px-4">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              {/* Tab Button with Number */}
              <button
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center"
              >
                <div 
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                  } text-lg font-medium transition-colors duration-300`}
                >
                  {tab.number}
                </div>
                <span 
                  className={`mt-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
              
              {/* Connecting Line (not for the last item) */}
              {index < tabs.length - 1 && (
                <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-gray-300 dark:bg-gray-700 mx-2 sm:mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="px-1">
        {tabs.map((tab) => (
          activeTab === tab.id && <tab.component key={tab.id} />
        ))}
      </div>
    </div>
  );
} 