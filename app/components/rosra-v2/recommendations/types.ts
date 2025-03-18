import { ElementType } from 'react';

// View type
export type ViewType = 'highLevel' | 'scenarios';

// Recommendation interface
export interface Recommendation {
  id: string;
  text: string;
  triggers: {
    dimensionId: string;
    questionId: string;
    answerValue: string;
  }[];
}

export interface Dimension {
  id: string;
  name: string;
  icon: ElementType;
  recommendations: Recommendation[];
}

// Scenario interface
export interface Scenario {
  id: string;
  title: string;
  description: string;
  triggers: string[];
  immediateRecommendations: string[];
  longTermRecommendations: string[];
  caseStudies: {
    title: string;
    description: string;
    link?: string;
  }[];
} 