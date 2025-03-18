'use client'

import React, { useState } from 'react';
import { Scenario } from './types';

interface ScenarioCardProps {
  scenario: Scenario;
  isCollapsed?: boolean;
}

export default function ScenarioCard({ scenario, isCollapsed = false }: ScenarioCardProps) {
  const [expanded, setExpanded] = useState(!isCollapsed);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {scenario.title}
        </h3>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {scenario.description}
      </p>
      
      {expanded && (
        <>
          {/* Triggers */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Applies when:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {scenario.triggers.map((trigger, index) => (
                <li key={`trigger-${index}`}>{trigger}</li>
              ))}
            </ul>
          </div>
          
          {/* Immediate Recommendations */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Immediate Improvements:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {scenario.immediateRecommendations.map((rec, index) => (
                <li key={`immediate-rec-${index}`}>{rec}</li>
              ))}
            </ul>
          </div>
          
          {/* Long-Term Recommendations */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Longer-Term Pathway:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {scenario.longTermRecommendations.map((rec, index) => (
                <li key={`long-term-rec-${index}`}>{rec}</li>
              ))}
            </ul>
          </div>
          
          {/* Case Studies */}
          {scenario.caseStudies.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Relevant Case Studies:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenario.caseStudies.map((study, index) => (
                  <div key={`case-study-${index}`} className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                      {study.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {study.description}
                    </p>
                    {study.link && (
                      <a 
                        href={study.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Read more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 