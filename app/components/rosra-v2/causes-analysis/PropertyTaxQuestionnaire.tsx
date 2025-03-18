import React from 'react';
import { Dimension } from '@/app/context/CausesAnalysisContext';

interface PropertyTaxQuestionnaireProps {
  dimensions: Dimension[];
  handleQuestionSelect: (dimensionId: string, questionId: string, optionValue: string) => void;
  getQuestionImpact: (dimensionId: string, questionId: string) => 'High' | 'Medium' | 'Low' | undefined;
  getDimensionImpact: (dimensionId: string) => 'High' | 'Medium' | 'Low';
}

export default function PropertyTaxQuestionnaire({ 
  dimensions, 
  handleQuestionSelect, 
  getQuestionImpact, 
  getDimensionImpact 
}: PropertyTaxQuestionnaireProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Property Tax Gap Analysis Questionnaire
      </h3>
      
      <div className="space-y-8">
        {dimensions.map(dimension => (
          <div key={dimension.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {dimension.name}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getDimensionImpact(dimension.id) === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : getDimensionImpact(dimension.id) === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}
              >
                {getDimensionImpact(dimension.id)} Impact
              </span>
            </div>
            
            <div className="space-y-6">
              {dimension.questions.map(question => (
                <div key={question.id} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{question.text}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {question.options.map(option => (
                      <div 
                        key={option.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          question.selectedOption === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                        onClick={() => handleQuestionSelect(dimension.id, question.id, option.value)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            option.impact === 'High'
                              ? 'bg-red-500'
                              : option.impact === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}></div>
                          <span className="text-gray-800 dark:text-gray-200">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {question.selectedOption && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Impact: </span>
                      <span className={`font-medium ${
                        getQuestionImpact(dimension.id, question.id) === 'High'
                          ? 'text-red-600 dark:text-red-400'
                          : getQuestionImpact(dimension.id, question.id) === 'Medium'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {getQuestionImpact(dimension.id, question.id)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 