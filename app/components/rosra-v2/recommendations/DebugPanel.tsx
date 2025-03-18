'use client'

import React from 'react';
import { Dimension as CausesDimension } from '@/app/context/CausesAnalysisContext';
import { Dimension, Recommendation } from './types';

interface DebugPanelProps {
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  dimensions: CausesDimension[];
  recommendationDimensions: Dimension[];
  getSelectedOption: (dimensionId: string, questionId: string) => string | undefined;
  shouldShowRecommendation: (recommendation: Recommendation) => boolean;
}

export default function DebugPanel({
  showDebug,
  setShowDebug,
  dimensions,
  recommendationDimensions,
  getSelectedOption,
  shouldShowRecommendation
}: DebugPanelProps) {
  // Debug function to show all selected answers
  const getDebugInfo = () => {
    if (!dimensions.length) return "No dimensions data available";
    
    return dimensions.map(dimension => {
      return (
        <div key={dimension.id} className="mb-2">
          <strong>{dimension.name} (ID: {dimension.id}):</strong>
          <ul>
            {dimension.questions.map(question => (
              <li key={question.id}>
                <div>
                  <span className="font-medium">{question.id}:</span> {question.text.substring(0, 50)}... 
                </div>
                <div className="ml-4">
                  <span className="font-medium text-blue-600">
                    Selected: {question.selectedOption || "No selection"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  // Debug function to show recommendation filtering
  const getRecommendationDebugInfo = () => {
    if (!dimensions.length) return "No dimensions data available";
    
    return recommendationDimensions.map(dimension => {
      return (
        <div key={dimension.id} className="mb-4">
          <strong>{dimension.name} Recommendations (ID: {dimension.id}):</strong>
          <ul>
            {dimension.recommendations.map(rec => {
              const isShown = shouldShowRecommendation(rec);
              const triggerInfo = rec.triggers.map(t => {
                const selectedOption = getSelectedOption(t.dimensionId, t.questionId);
                
                // Normalize values for comparison (same logic as in shouldShowRecommendation)
                const normalizedTriggerValue = t.answerValue.toLowerCase();
                const normalizedSelectedOption = selectedOption ? selectedOption.toLowerCase() : '';
                
                // Check for special matching cases
                const isPartialMatch = 
                  (normalizedTriggerValue === 'partial' && normalizedSelectedOption === 'partially') ||
                  (normalizedTriggerValue === 'partially' && normalizedSelectedOption === 'partial');
                
                const isYesFixedMatch = 
                  (normalizedTriggerValue === 'yes' && normalizedSelectedOption === 'fixed') ||
                  (normalizedTriggerValue === 'fixed' && normalizedSelectedOption === 'yes');
                
                const isDirectMatch = normalizedSelectedOption === normalizedTriggerValue;
                const isMatch = isPartialMatch || isYesFixedMatch || isDirectMatch;
                
                return (
                  <div key={`${t.dimensionId}-${t.questionId}`} className={isMatch ? "text-green-600" : "text-red-600"}>
                    {t.dimensionId}/{t.questionId}={t.answerValue} 
                    (Selected: {selectedOption || "none"}) 
                    {isMatch ? "✓ MATCH" : "✗ NO MATCH"}
                    {isPartialMatch && " (partial/partially match)"}
                    {isYesFixedMatch && " (yes/fixed match)"}
                    {isDirectMatch && " (direct match)"}
                  </div>
                );
              });
              
              return (
                <li key={rec.id} className={isShown ? "text-green-600 mb-3" : "text-red-600 mb-3"}>
                  {isShown ? "✓" : "✗"} {rec.text.substring(0, 50)}...
                  <div className="text-gray-500 text-xs ml-4">
                    <div className="font-medium mb-1">Triggers:</div>
                    {triggerInfo}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      {/* Debug Section - Toggleable */}
      {showDebug && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm overflow-auto max-h-96">
          <h3 className="font-bold mb-2">Debug Info - Selected Answers:</h3>
          <div>{getDebugInfo()}</div>
          
          <h3 className="font-bold mt-4 mb-2">Debug Info - Recommendations Filtering:</h3>
          <div>{getRecommendationDebugInfo()}</div>
        </div>
      )}
    </>
  );
} 