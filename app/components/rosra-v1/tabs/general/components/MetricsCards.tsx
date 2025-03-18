'use client';

import React from 'react';

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Revenue Overview Card */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Revenue Overview
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">Total Revenue</span>
            <input 
              type="text" 
              defaultValue="$1,234,567" 
              className="text-right text-blue-600 dark:text-blue-400 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-32"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">OSR Revenue</span>
            <input 
              type="text" 
              defaultValue="$567,890" 
              className="text-right text-blue-600 dark:text-blue-400 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-32"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">Growth Rate</span>
            <input 
              type="text" 
              defaultValue="+12.5%" 
              className="text-right text-green-500 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-green-500 rounded p-1 w-32"
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics Card */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Performance Metrics
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">Collection Efficiency</span>
            <input 
              type="text" 
              defaultValue="85%" 
              className="text-right text-blue-600 dark:text-blue-400 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-32"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">Coverage Ratio</span>
            <input 
              type="text" 
              defaultValue="92%" 
              className="text-right text-blue-600 dark:text-blue-400 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-32"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light dark:text-text-dark">Compliance Rate</span>
            <input 
              type="text" 
              defaultValue="78%" 
              className="text-right text-blue-600 dark:text-blue-400 font-semibold bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 