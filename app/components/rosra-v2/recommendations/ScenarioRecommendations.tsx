'use client'

import React from 'react';
import { Scenario } from './types';
import ScenarioCard from './ScenarioCard';

interface ScenarioRecommendationsProps {
  scenarios: Scenario[];
  hasUserSelections: boolean;
}

export default function ScenarioRecommendations({ 
  scenarios, 
  hasUserSelections 
}: ScenarioRecommendationsProps) {
  return (
    <div className="space-y-8">
      {hasUserSelections ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            These scenario-based recommendations provide guidance for specific property tax situations.
            Each scenario includes immediate actions and longer-term strategies.
          </p>
          
          {scenarios.map((scenario, index) => (
            <ScenarioCard 
              key={scenario.id} 
              scenario={scenario} 
              isCollapsed={index > 0} // Only expand the first scenario by default
            />
          ))}
        </>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Please complete the Property Tax Gap Analysis Questionnaire to view scenario-based recommendations.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Scenarios will be displayed here after you've answered the questions in the Causes Analysis section.
          </p>
        </div>
      )}
    </div>
  );
} 