'use client'

import React, { useState } from 'react';
import { ClockIcon, ChartBarIcon, CogIcon, UserGroupIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { useCausesAnalysis } from '@/app/context/CausesAnalysisContext';
import { ViewType, Dimension, Recommendation, Scenario } from './types';
import ViewToggle from './ViewToggle';
import HighLevelRecommendations from './HighLevelRecommendations';
import ScenarioRecommendations from './ScenarioRecommendations';
import DebugPanel from './DebugPanel';

export default function RecommendationsComponent() {
  const [viewType, setViewType] = useState<ViewType>('highLevel');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const { dimensions, getSelectedOption } = useCausesAnalysis();
  
  // Define dimensions with recommendations and their triggers
  const recommendationDimensions: Dimension[] = [
    {
      id: 'legal',
      name: 'Legal',
      icon: ScaleIcon,
      recommendations: [
        {
          id: 'legal-1',
          text: 'Proceed with valuation updates; ensure compliance with mandated procedures or approvals.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_1', answerValue: 'yes' }
          ]
        },
        {
          id: 'legal-2',
          text: 'Identify specific legal barriers and seek minor legislative or regulatory reforms to expand authority.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_1', answerValue: 'partial' }
          ]
        },
        {
          id: 'legal-3',
          text: 'Develop comprehensive legal framework for property valuation, including clear authority and procedures.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_1', answerValue: 'no' }
          ]
        },
        {
          id: 'legal-4',
          text: 'Maintain current revaluation cycle; consider incremental improvements to valuation methods.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'annual' }
          ]
        },
        {
          id: 'legal-5',
          text: 'Maintain current revaluation cycle; consider incremental improvements to valuation methods.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'biennial' }
          ]
        },
        {
          id: 'legal-6',
          text: 'Consider increasing revaluation frequency to better capture market changes and ensure equity.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'triennial' }
          ]
        },
        {
          id: 'legal-7',
          text: 'Implement more frequent revaluation cycles to improve equity and revenue stability.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'quadrennial' }
          ]
        },
        {
          id: 'legal-8',
          text: 'Prioritize establishing a regular revaluation cycle through legal reforms.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'five_plus' }
          ]
        },
        {
          id: 'legal-9',
          text: 'Establish a legal framework for regular property revaluations.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'never' }
          ]
        }
      ]
    },
    {
      id: 'political',
      name: 'Political',
      icon: UserGroupIcon,
      recommendations: [
        {
          id: 'political-1',
          text: 'Maintain political support through transparent communication about valuation benefits.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'strong' }
          ]
        },
        {
          id: 'political-2',
          text: 'Build broader political consensus through education on benefits and addressing specific concerns.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'moderate' }
          ]
        },
        {
          id: 'political-3',
          text: 'Develop comprehensive stakeholder engagement strategy to build political support.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'weak' }
          ]
        },
        {
          id: 'political-4',
          text: 'Maintain public education efforts; consider expanding to address emerging concerns.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'high' }
          ]
        },
        {
          id: 'political-5',
          text: 'Enhance public education on valuation methods, benefits, and taxpayer rights.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'moderate' }
          ]
        },
        {
          id: 'political-6',
          text: 'Implement comprehensive public education campaign on property valuation and taxation.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'low' }
          ]
        }
      ]
    },
    {
      id: 'governance',
      name: 'Governance',
      icon: CogIcon,
      recommendations: [
        {
          id: 'governance-1',
          text: 'Maintain and strengthen existing institutional coordination for valuation processes.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_1', answerValue: 'well_defined' }
          ]
        },
        {
          id: 'governance-2',
          text: 'Ensure formal inter-departmental protocols for data sharing between valuation-related departments.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_1', answerValue: 'partial' }
          ]
        },
        {
          id: 'governance-3',
          text: 'Create a central valuation authority or coordination framework to clarify institutional roles.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_1', answerValue: 'unsure' }
          ]
        },
        {
          id: 'governance-4',
          text: 'Continue supporting existing oversight mechanisms for fair and transparent valuations.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_2', answerValue: 'yes' }
          ]
        },
        {
          id: 'governance-5',
          text: 'Implement periodic external audits and public disclosure of aggregated valuation tables.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_2', answerValue: 'no' }
          ]
        },
        {
          id: 'governance-6',
          text: 'Form a valuation oversight board to ensure fairness and transparency in the valuation process.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_2', answerValue: 'uncertain' }
          ]
        },
        {
          id: 'governance-7',
          text: 'Establish a digital governance framework to monitor valuation processes and ensure compliance with regulations.',
          triggers: [
            { dimensionId: 'governance', questionId: 'governance_1', answerValue: 'digital' }
          ]
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: ChartBarIcon,
      recommendations: [
        {
          id: 'financial-1',
          text: 'Maintain current funding levels; consider incremental improvements to efficiency.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_1', answerValue: 'sufficient' }
          ]
        },
        {
          id: 'financial-2',
          text: 'Develop business case for increased valuation funding based on revenue potential and equity improvements.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_1', answerValue: 'insufficient' }
          ]
        },
        {
          id: 'financial-3',
          text: 'Secure dedicated funding for valuation functions through budget reforms or fee structures.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_1', answerValue: 'severely_limited' }
          ]
        },
        {
          id: 'financial-4',
          text: 'Maintain current staffing levels; focus on continuous professional development.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_2', answerValue: 'sufficient' }
          ]
        },
        {
          id: 'financial-5',
          text: 'Develop recruitment and retention strategy for valuation professionals; consider training programs.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_2', answerValue: 'insufficient' }
          ]
        },
        {
          id: 'financial-6',
          text: 'Establish comprehensive capacity building program for valuation staff, including recruitment, training, and retention.',
          triggers: [
            { dimensionId: 'financial', questionId: 'financial_2', answerValue: 'severely_limited' }
          ]
        }
      ]
    },
    {
      id: 'administrative',
      name: 'Administrative',
      icon: ClockIcon,
      recommendations: [
        {
          id: 'administrative-1',
          text: 'Maintain current data management systems; consider incremental improvements.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'comprehensive' }
          ]
        },
        {
          id: 'administrative-2',
          text: 'Enhance property data collection and management systems to improve coverage and quality.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'partial' }
          ]
        },
        {
          id: 'administrative-3',
          text: 'Establish comprehensive property data management system, potentially including GIS integration.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'limited' }
          ]
        },
        {
          id: 'administrative-4',
          text: 'Maintain current valuation systems; consider incremental improvements to efficiency.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'advanced' }
          ]
        },
        {
          id: 'administrative-5',
          text: 'Upgrade valuation systems to improve efficiency and accuracy; consider CAMA implementation.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'basic' }
          ]
        },
        {
          id: 'administrative-6',
          text: 'Implement modern valuation systems, potentially including CAMA and statistical validation tools.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'manual' }
          ]
        }
      ]
    },
    {
      id: 'valuation',
      name: 'Valuation Approach',
      icon: DocumentTextIcon,
      recommendations: [
        {
          id: 'valuation-1',
          text: 'Maintain current valuation standards; consider incremental improvements to methodology.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'market_value' }
          ]
        },
        {
          id: 'valuation-2',
          text: 'Consider transitioning to market value-based assessments to improve equity and revenue potential.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'area_based' }
          ]
        },
        {
          id: 'valuation-3',
          text: 'Consider transitioning to market value-based assessments to improve equity and revenue potential.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'rental_value' }
          ]
        },
        {
          id: 'valuation-4',
          text: 'Develop comprehensive valuation standards aligned with international best practices.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'other' }
          ]
        },
        {
          id: 'valuation-5',
          text: 'Maintain current quality control processes; consider incremental improvements.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'comprehensive' }
          ]
        },
        {
          id: 'valuation-6',
          text: 'Enhance quality control processes for valuations, including statistical testing and review procedures.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'limited' }
          ]
        },
        {
          id: 'valuation-7',
          text: 'Implement comprehensive quality control framework for valuations, including statistical validation.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'none' }
          ]
        }
      ]
    }
  ];

  // Define scenarios
  const scenarios: Scenario[] = [
    {
      id: 'scenario-1',
      title: 'Outdated Valuations',
      description: 'Property values have not been updated in 5+ years, leading to inequities and revenue shortfalls.',
      triggers: [
        'No revaluation in 5+ years',
        'Significant market changes since last valuation',
        'Growing taxpayer complaints about inequity'
      ],
      immediateRecommendations: [
        'Conduct a pilot revaluation in a representative district to demonstrate impact',
        'Develop communication strategy explaining benefits of updated valuations',
        'Secure necessary approvals and funding for full revaluation'
      ],
      longTermRecommendations: [
        'Establish legal framework for regular revaluation cycle',
        'Implement modern CAMA system for efficient valuations',
        'Develop ongoing public education program about property taxation'
      ],
      caseStudies: [
        {
          title: 'City of Metropolis Revaluation',
          description: 'Successfully updated values after 10-year gap through phased approach',
          link: '#'
        },
        {
          title: 'Westland County Reform',
          description: 'Comprehensive reform of valuation system with strong public support',
          link: '#'
        }
      ]
    },
    {
      id: 'scenario-2',
      title: 'Limited Valuation Capacity',
      description: 'Insufficient staff, expertise, or systems to conduct effective property valuations.',
      triggers: [
        'Small valuation department relative to property base',
        'Limited professional qualifications among staff',
        'Manual or outdated valuation systems'
      ],
      immediateRecommendations: [
        'Prioritize training for existing staff in key valuation methods',
        'Develop standardized valuation templates and procedures',
        'Consider outsourcing specialized valuation functions'
      ],
      longTermRecommendations: [
        'Establish dedicated funding for valuation function',
        'Develop recruitment and retention strategy for valuation professionals',
        'Implement appropriate technology solutions for efficiency'
      ],
      caseStudies: [
        {
          title: 'Eastern Province Capacity Building',
          description: 'Successful staff development program doubled valuation capacity',
          link: '#'
        }
      ]
    },
    {
      id: 'scenario-3',
      title: 'Political Resistance to Revaluation',
      description: 'Strong political opposition to updating property values due to taxpayer concerns.',
      triggers: [
        'Previous revaluation attempts blocked politically',
        'Public misconceptions about valuation impacts',
        'Upcoming elections creating sensitivity'
      ],
      immediateRecommendations: [
        'Conduct impact analysis showing distribution of tax changes',
        'Develop targeted relief programs for vulnerable groups',
        'Create communication strategy focused on fairness and equity'
      ],
      longTermRecommendations: [
        'Implement phase-in approach for significant value changes',
        'Establish ongoing stakeholder engagement process',
        'Consider legislative reforms to separate valuation from rate-setting'
      ],
      caseStudies: [
        {
          title: 'Northern City Reform',
          description: 'Overcame political resistance through targeted relief programs',
          link: '#'
        },
        {
          title: 'Southern County Implementation',
          description: 'Successful phase-in approach minimized taxpayer impact',
          link: '#'
        }
      ]
    }
  ];

  // Function to determine if a recommendation should be shown based on user responses
  const shouldShowRecommendation = (recommendation: Recommendation): boolean => {
    // If no dimensions data, show all recommendations
    if (!dimensions.length) return true;
    
    // Check if any trigger condition is met
    return recommendation.triggers.some(trigger => {
      const selectedOption = getSelectedOption(trigger.dimensionId, trigger.questionId);
      return selectedOption === trigger.answerValue;
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Property Tax Recommendations
      </h2>
      
      <DebugPanel 
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        dimensions={dimensions}
        recommendationDimensions={recommendationDimensions}
        getSelectedOption={getSelectedOption}
        shouldShowRecommendation={shouldShowRecommendation}
      />
      
      <ViewToggle viewType={viewType} setViewType={setViewType} />
      
      {viewType === 'highLevel' ? (
        <HighLevelRecommendations 
          recommendationDimensions={recommendationDimensions}
          shouldShowRecommendation={shouldShowRecommendation}
        />
      ) : (
        <ScenarioRecommendations scenarios={scenarios} />
      )}
    </div>
  );
} 