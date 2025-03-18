'use client';

import React from 'react';

export default function ProblemTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
        Revenue Management Problems
      </h2>
      
      {/* Overview */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">Overview of Challenges</h3>
        <p className="text-text-light dark:text-text-dark mb-4">
          The Local Government Authority faces several critical challenges in revenue management that 
          impact its financial sustainability and service delivery capabilities. These problems need 
          to be addressed systematically to improve overall revenue performance.
        </p>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 mt-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <span className="font-semibold">Critical Issue:</span> The current revenue gap of 32% threatens the 
              implementation of essential infrastructure projects and social services.
            </span>
          </p>
        </div>
      </div>
      
      {/* Key Problems */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Key Problem Areas</h3>
        
        <div className="space-y-6">
          {/* Problem 1 */}
          <div className="border-l-4 border-red-500 dark:border-red-400 pl-4 py-1">
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-2">Outdated Revenue Management Systems</h4>
            <p className="text-text-light dark:text-text-dark mb-3">
              The current revenue management systems are largely manual and paper-based, leading to 
              inefficiencies, errors, and delays in revenue collection and reporting.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                High Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                System Issue
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Technology Gap
              </span>
            </div>
          </div>
          
          {/* Problem 2 */}
          <div className="border-l-4 border-red-500 dark:border-red-400 pl-4 py-1">
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-2">Incomplete Taxpayer Registry</h4>
            <p className="text-text-light dark:text-text-dark mb-3">
              The current taxpayer database is incomplete and outdated, with an estimated 40% of potential 
              taxpayers not registered, leading to significant revenue leakage.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                High Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Data Issue
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Compliance Gap
              </span>
            </div>
          </div>
          
          {/* Problem 3 */}
          <div className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-1">
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-2">Limited Revenue Collection Channels</h4>
            <p className="text-text-light dark:text-text-dark mb-3">
              Current revenue collection relies primarily on in-person payments at government offices, 
              creating barriers for taxpayers and increasing the cost of compliance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Medium Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Process Issue
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Service Delivery
              </span>
            </div>
          </div>
          
          {/* Problem 4 */}
          <div className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 py-1">
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-2">Weak Enforcement Mechanisms</h4>
            <p className="text-text-light dark:text-text-dark mb-3">
              Inadequate enforcement of compliance leads to a culture of non-payment, with limited 
              consequences for tax defaulters and insufficient follow-up mechanisms.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Medium Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Regulatory Issue
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Enforcement Gap
              </span>
            </div>
          </div>
          
          {/* Problem 5 */}
          <div className="border-l-4 border-yellow-500 dark:border-yellow-400 pl-4 py-1">
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-2">Limited Public Awareness</h4>
            <p className="text-text-light dark:text-text-dark mb-3">
              Low levels of public awareness about tax obligations, payment procedures, and the link 
              between tax compliance and service delivery affect voluntary compliance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                Lower Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Communication Issue
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Public Engagement
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Assessment */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Impact Assessment</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problem Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Financial Impact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service Delivery Impact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Long-term Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Outdated Systems</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Incomplete Registry</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Limited Collection Channels</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Weak Enforcement</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Limited Public Awareness</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Low
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    Medium
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