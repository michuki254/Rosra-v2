'use client';

import React from 'react';

export default function PerformanceAnalysisTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
        Performance Analysis
      </h2>
      
      {/* Summary Section */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6 mb-8">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">Executive Summary</h3>
        <p className="text-text-light dark:text-text-dark mb-4">
          This analysis examines the revenue performance of the local government over the past fiscal year, 
          highlighting strengths, weaknesses, and opportunities for improvement. The assessment is based on 
          key performance indicators, historical trends, and comparative benchmarks.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Key Finding:</span> Revenue collection efficiency has improved by 8.5% 
            compared to the previous fiscal year, but remains 12% below the regional average for similar localities.
          </p>
        </div>
      </div>
      
      {/* Strength & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">Strengths</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Consistent year-over-year growth in total revenue collection</p>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Successful implementation of digital payment systems</p>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Improved taxpayer database management and updates</p>
            </li>
          </ul>
        </div>
        
        {/* Weaknesses */}
        <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">Weaknesses</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Low compliance rates in informal business sectors</p>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Inadequate enforcement mechanisms for non-compliant taxpayers</p>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-text-light dark:text-text-dark">Limited public awareness about tax obligations and payment procedures</p>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Comparison Analysis */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Comparative Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Regional Average</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gap</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Collection Efficiency</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">87%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">92%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">-5%</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Needs Improvement
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">OSR Growth Rate</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">12.3%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">8.7%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">+3.6%</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Above Average
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Compliance Rate</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">78%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">85%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">-7%</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Below Average
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 