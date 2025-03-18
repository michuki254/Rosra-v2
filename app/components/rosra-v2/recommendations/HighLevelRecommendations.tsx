'use client'

import React from 'react';
import { Dimension, Recommendation } from './types';
import DimensionCard from './DimensionCard';

interface HighLevelRecommendationsProps {
  recommendationDimensions: Dimension[];
  shouldShowRecommendation: (recommendation: Recommendation) => boolean;
  hasUserSelections: boolean;
}

export default function HighLevelRecommendations({ 
  recommendationDimensions,
  shouldShowRecommendation,
  hasUserSelections
}: HighLevelRecommendationsProps) {
  // Check if any recommendations should be shown
  const hasAnyRecommendations = recommendationDimensions.some(dimension => 
    dimension.recommendations.some(shouldShowRecommendation)
  );

  return (
    <div className="space-y-8">
      {hasUserSelections ? (
        <>
          {recommendationDimensions.map(dimension => {
            const filteredRecommendations = dimension.recommendations.filter(shouldShowRecommendation);
            
            // Skip dimensions with no matching recommendations
            if (filteredRecommendations.length === 0) return null;
            
            return (
              <DimensionCard 
                key={dimension.id}
                dimension={dimension}
                filteredRecommendations={filteredRecommendations}
              />
            );
          })}

          {/* Show a message if no recommendations match */}
          {!hasAnyRecommendations && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                Based on your current selections, there are no specific recommendations to display.
                Try selecting different options in the Property Tax Gap Analysis Questionnaire.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Please complete the Property Tax Gap Analysis Questionnaire to receive tailored recommendations.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your recommendations will appear here after you've answered the questions in the Causes Analysis section.
          </p>
        </div>
      )}
    </div>
  );
} 