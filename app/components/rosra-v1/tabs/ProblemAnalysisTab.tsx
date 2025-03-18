'use client';

import React from 'react';

export default function ProblemAnalysisTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
        Problem Analysis
      </h2>
      
      {/* Introduction */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">In-Depth Analysis</h3>
        <p className="text-text-light dark:text-text-dark mb-4">
          This analysis provides a comprehensive examination of the root causes underlying the identified 
          revenue management problems, as well as their interconnections and potential solutions.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 mt-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Methodology:</span> This analysis is based on a combination of 
            data analysis, stakeholder interviews, process mapping, and comparative benchmarking with similar local governments.
          </p>
        </div>
      </div>
      
      {/* Root Cause Analysis */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Root Cause Analysis</h3>
        
        <div className="space-y-6">
          {/* System Issues */}
          <div>
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              System Issues
            </h4>
            <div className="ml-11">
              <p className="text-text-light dark:text-text-dark mb-4">
                The outdated revenue management systems are primarily a result of:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-text-dark">
                <li>Insufficient budget allocation for technology modernization (historical underinvestment)</li>
                <li>Limited technological expertise within the organization to drive digital transformation</li>
                <li>Resistance to change from staff accustomed to manual processes</li>
                <li>Lack of a comprehensive digital strategy aligning with revenue management objectives</li>
              </ul>
            </div>
          </div>
          
          {/* Data Management Issues */}
          <div>
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              Data Management Issues
            </h4>
            <div className="ml-11">
              <p className="text-text-light dark:text-text-dark mb-4">
                The incomplete taxpayer registry stems from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-text-dark">
                <li>Inconsistent data collection methodologies across different departments</li>
                <li>Lack of regular data validation and cleansing procedures</li>
                <li>Absence of a unified data architecture integrating multiple revenue sources</li>
                <li>Limited field verification of potential taxpayers, particularly in emerging business areas</li>
                <li>Ineffective coordination with other government agencies for data sharing</li>
              </ul>
            </div>
          </div>
          
          {/* Process & Service Delivery Issues */}
          <div>
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Process & Service Delivery Issues
            </h4>
            <div className="ml-11">
              <p className="text-text-light dark:text-text-dark mb-4">
                The limited revenue collection channels are caused by:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-text-dark">
                <li>Insufficient partnerships with financial institutions and payment service providers</li>
                <li>Rigid regulatory framework that hasn't adapted to modern payment technologies</li>
                <li>Concerns about security and fraud in digital payment systems</li>
                <li>Lack of user-centered design in existing payment processes</li>
                <li>Limited awareness of alternative payment channel benefits among leadership</li>
              </ul>
            </div>
          </div>
          
          {/* Governance & Policy Issues */}
          <div>
            <h4 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              Governance & Policy Issues
            </h4>
            <div className="ml-11">
              <p className="text-text-light dark:text-text-dark mb-4">
                Weak enforcement mechanisms result from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-text-dark">
                <li>Outdated legal frameworks with inadequate penalties for non-compliance</li>
                <li>Lack of clear enforcement procedures and guidelines for revenue officers</li>
                <li>Insufficient resources allocated to enforcement activities</li>
                <li>Political interference in enforcement processes, particularly for influential taxpayers</li>
                <li>Absence of performance metrics specifically targeting enforcement effectiveness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interdependencies */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Problem Interdependencies</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problem Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Contributor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Secondary Effects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Outdated Systems</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Resource Constraints</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <ul className="list-disc pl-5">
                    <li>Limits data accuracy</li>
                    <li>Restricts payment channels</li>
                    <li>Hampers enforcement capabilities</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Incomplete Registry</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Data Management Practices</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <ul className="list-disc pl-5">
                    <li>Reduces overall revenue potential</li>
                    <li>Creates inequity in tax burden</li>
                    <li>Undermines compliance culture</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Limited Collection Channels</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Technology Infrastructure</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <ul className="list-disc pl-5">
                    <li>Decreases taxpayer convenience</li>
                    <li>Increases compliance costs</li>
                    <li>Limits revenue collection efficiency</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Weak Enforcement</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Governance Framework</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <ul className="list-disc pl-5">
                    <li>Encourages non-compliance</li>
                    <li>Reduces deterrence effect</li>
                    <li>Creates cultural acceptance of evasion</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Strategic Recommendations */}
      <div className="bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">Strategic Recommendation Summary</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Short-term Actions (0-6 months)</h4>
            <ul className="list-disc pl-5 space-y-1 text-green-700 dark:text-green-300 text-sm">
              <li>Conduct a comprehensive taxpayer registry audit and update</li>
              <li>Establish partnerships with 2-3 mobile money providers for alternative payment channels</li>
              <li>Develop and implement an enforcement action plan for high-value defaulters</li>
              <li>Launch a public awareness campaign on tax obligations and payment procedures</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Medium-term Initiatives (6-18 months)</h4>
            <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              <li>Implement a modern integrated revenue management system</li>
              <li>Develop comprehensive data management protocols and governance frameworks</li>
              <li>Establish a dedicated revenue enforcement unit with specialized training</li>
              <li>Review and update revenue-related legal frameworks and penalties</li>
              <li>Implement performance metrics and incentives for revenue collection staff</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Long-term Strategy (18+ months)</h4>
            <ul className="list-disc pl-5 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
              <li>Develop a comprehensive digital transformation strategy for revenue management</li>
              <li>Implement advanced analytics for revenue forecasting and compliance targeting</li>
              <li>Establish interagency data sharing mechanisms with national tax authorities</li>
              <li>Develop a culture of voluntary compliance through education and service improvement</li>
              <li>Implement a continuous improvement framework for revenue management processes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 