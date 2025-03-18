'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface QuestionOption {
  value: string;
  label: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  selectedOption?: string;
}

export interface Dimension {
  id: string;
  name: string;
  questions: Question[];
}

// Context type
interface CausesAnalysisContextType {
  dimensions: Dimension[];
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  handleQuestionResponse: (dimensionId: string, questionId: string, optionValue: string) => void;
  getQuestionImpact: (dimensionId: string, questionId: string) => 'High' | 'Medium' | 'Low' | undefined;
  getDimensionImpact: (dimensionId: string) => 'High' | 'Medium' | 'Low';
  getSelectedOption: (dimensionId: string, questionId: string) => string | undefined;
}

// Create context
const CausesAnalysisContext = createContext<CausesAnalysisContextType | undefined>(undefined);

// Provider component
export function CausesAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [dimensions, setDimensions] = useState<Dimension[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedDimensions = localStorage.getItem('causesAnalysisDimensions');
      return savedDimensions ? JSON.parse(savedDimensions) : [];
    }
    return [];
  });

  // Save to localStorage whenever dimensions change
  useEffect(() => {
    if (typeof window !== 'undefined' && dimensions.length > 0) {
      localStorage.setItem('causesAnalysisDimensions', JSON.stringify(dimensions));
    }
  }, [dimensions]);

  // Handle question response
  const handleQuestionResponse = (dimensionId: string, questionId: string, optionValue: string) => {
    setDimensions(prevDimensions => 
      prevDimensions.map(dimension => {
        if (dimension.id === dimensionId) {
          return {
            ...dimension,
            questions: dimension.questions.map(question => {
              if (question.id === questionId) {
                return {
                  ...question,
                  selectedOption: optionValue
                };
              }
              return question;
            })
          };
        }
        return dimension;
      })
    );
  };

  // Get impact level for a question based on selected option
  const getQuestionImpact = (dimensionId: string, questionId: string): 'High' | 'Medium' | 'Low' | undefined => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    if (!dimension) return undefined;
    
    const question = dimension.questions.find(q => q.id === questionId);
    if (!question || !question.selectedOption) return undefined;
    
    const option = question.options.find(o => o.value === question.selectedOption);
    return option?.impact;
  };

  // Calculate overall dimension impact
  const getDimensionImpact = (dimensionId: string): 'High' | 'Medium' | 'Low' => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    if (!dimension) return 'Low';
    
    const impacts = dimension.questions
      .map(q => getQuestionImpact(dimensionId, q.id))
      .filter(impact => impact !== undefined) as ('High' | 'Medium' | 'Low')[];
    
    if (impacts.includes('High')) return 'High';
    if (impacts.includes('Medium')) return 'Medium';
    return 'Low';
  };

  // Get selected option for a question
  const getSelectedOption = (dimensionId: string, questionId: string): string | undefined => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    if (!dimension) return undefined;
    
    const question = dimension.questions.find(q => q.id === questionId);
    return question?.selectedOption;
  };

  return (
    <CausesAnalysisContext.Provider value={{
      dimensions,
      setDimensions,
      handleQuestionResponse,
      getQuestionImpact,
      getDimensionImpact,
      getSelectedOption
    }}>
      {children}
    </CausesAnalysisContext.Provider>
  );
}

// Hook to use the context
export function useCausesAnalysis() {
  const context = useContext(CausesAnalysisContext);
  if (context === undefined) {
    throw new Error('useCausesAnalysis must be used within a CausesAnalysisProvider');
  }
  return context;
} 