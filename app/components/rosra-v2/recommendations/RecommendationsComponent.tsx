'use client'

import React, { useState } from 'react';
import { ClockIcon, ChartBarIcon, CogIcon, UserGroupIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { useCausesAnalysis } from '@/app/context/CausesAnalysisContext';
import { ViewType, Dimension, Recommendation, Scenario } from './types';
import ViewToggle from './ViewToggle';
import HighLevelRecommendations from './HighLevelRecommendations';
import ScenarioRecommendations from './ScenarioRecommendations';
import DebugPanel from './DebugPanel';

// OSR Types
type OsrType = 'propertyTax' | 'license' | 'shortTermUserCharge' | 'longTermUserCharge' | 'mixedUserCharge';

export default function RecommendationsComponent() {
  const [viewType, setViewType] = useState<ViewType>('highLevel');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showAllRecommendations, setShowAllRecommendations] = useState<boolean>(false);
  const { dimensions, getSelectedOption, setDimensions, handleQuestionResponse } = useCausesAnalysis();
  
  // State for active OSR type
  const [activeOsrType, setActiveOsrType] = useState<OsrType>('propertyTax');
  
  // OSR types for tab navigation
  const osrTypes = [
    { id: 'propertyTax', label: 'Property Tax' },
    { id: 'license', label: 'License' },
    { id: 'shortTermUserCharge', label: 'Short Term User Charge' },
    { id: 'longTermUserCharge', label: 'Long Term User Charge' },
    { id: 'mixedUserCharge', label: 'Mixed User Charge' },
  ];
  
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
            { dimensionId: 'legal', questionId: 'legal_1', answerValue: 'partially' }
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
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'fixed' }
          ]
        },
        {
          id: 'legal-5',
          text: 'Consider more structured approach to revaluation timing while maintaining flexibility.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'flexible' }
          ]
        },
        {
          id: 'legal-6',
          text: 'Establish a legal framework for regular property revaluations.',
          triggers: [
            { dimensionId: 'legal', questionId: 'legal_2', answerValue: 'no' }
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
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'high' }
          ]
        },
        {
          id: 'political-2',
          text: 'Build broader political consensus through education on benefits and addressing specific concerns.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'medium' }
          ]
        },
        {
          id: 'political-3',
          text: 'Develop comprehensive stakeholder engagement strategy to build political support.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_1', answerValue: 'uncertain' }
          ]
        },
        {
          id: 'political-4',
          text: 'Develop targeted strategies to address strong stakeholder resistance to valuation changes.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'strong' }
          ]
        },
        {
          id: 'political-5',
          text: 'Address mild stakeholder concerns through education and consultation processes.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'mild' }
          ]
        },
        {
          id: 'political-6',
          text: 'Maintain stakeholder engagement to prevent resistance to valuation approaches.',
          triggers: [
            { dimensionId: 'political', questionId: 'political_2', answerValue: 'no' }
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
          text: 'Maintain current staff training levels; focus on continuous professional development.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'well_trained' }
          ]
        },
        {
          id: 'administrative-2',
          text: 'Enhance staff training on valuation techniques through targeted programs.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'minimal' }
          ]
        },
        {
          id: 'administrative-3',
          text: 'Implement comprehensive training program on valuation techniques for municipal staff.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_1', answerValue: 'unsure' }
          ]
        },
        {
          id: 'administrative-4',
          text: 'Maintain and enhance existing property registry and GIS systems.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'robust' }
          ]
        },
        {
          id: 'administrative-5',
          text: 'Accelerate development of property registry and GIS systems for valuation.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'in_progress' }
          ]
        },
        {
          id: 'administrative-6',
          text: 'Establish modern property registry and GIS system for valuation data management.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'outdated' }
          ]
        },
        {
          id: 'administrative-7',
          text: 'Conduct assessment of current property data systems and develop improvement plan.',
          triggers: [
            { dimensionId: 'administrative', questionId: 'administrative_2', answerValue: 'unsure' }
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
          text: 'Maintain current market-informed valuation approach; consider incremental improvements.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'market_informed' }
          ]
        },
        {
          id: 'valuation-2',
          text: 'Maintain current market-based valuation approach; consider incremental improvements.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'market_based' }
          ]
        },
        {
          id: 'valuation-3',
          text: 'Consider transitioning from hybrid to market-informed valuation to improve equity and revenue potential.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'hybrid' }
          ]
        },
        {
          id: 'valuation-4',
          text: 'Consider transitioning from area-based to hybrid or market-informed valuation to improve equity.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'area_based' }
          ]
        },
        {
          id: 'valuation-5',
          text: 'Establish a clear valuation methodology framework aligned with local context and capacity.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_1', answerValue: 'none' }
          ]
        },
        {
          id: 'valuation-6',
          text: 'Implement detailed transition plan toward market-based valuation with clear milestones.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'detailed' }
          ]
        },
        {
          id: 'valuation-7',
          text: 'Refine general transition plan with specific milestones and capacity building elements.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'general' }
          ]
        },
        {
          id: 'valuation-8',
          text: 'Develop transition plan toward more refined valuation approaches with phased implementation.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'no' }
          ]
        },
        {
          id: 'valuation-9',
          text: 'Assess current valuation approach and develop improvement roadmap with stakeholder input.',
          triggers: [
            { dimensionId: 'valuation', questionId: 'valuation_2', answerValue: 'unsure' }
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
    // If show all recommendations is enabled, show everything
    if (showAllRecommendations) return true;
    
    // If no dimensions data, don't show any recommendations by default
    if (!dimensions.length) return false;
    
    // Special debug for legal recommendations
    if (recommendation.id.startsWith('legal')) {
      console.log('LEGAL RECOMMENDATION CHECK:', {
        id: recommendation.id,
        text: recommendation.text.substring(0, 30),
        triggers: recommendation.triggers,
      });
    }
    
    // Special debug for political recommendations
    if (recommendation.id.startsWith('political')) {
      console.log('POLITICAL RECOMMENDATION CHECK:', {
        id: recommendation.id,
        text: recommendation.text.substring(0, 30),
        triggers: recommendation.triggers,
      });
    }
    
    // Check if any trigger condition is met
    const result = recommendation.triggers.some(trigger => {
      const selectedOption = getSelectedOption(trigger.dimensionId, trigger.questionId);
      
      // Debug logging for this specific trigger
      console.log(`Checking trigger:`, {
        dimensionId: trigger.dimensionId,
        questionId: trigger.questionId,
        triggerValue: trigger.answerValue,
        selectedValue: selectedOption,
        recommendation: recommendation.text.substring(0, 30)
      });
      
      // No selection made for this question
      if (!selectedOption) {
        console.log(`No selection for ${trigger.dimensionId}/${trigger.questionId}`);
        return false;
      }
      
      // Handle common variations in answer values
      const normalizedTriggerValue = trigger.answerValue.toLowerCase().trim();
      const normalizedSelectedOption = selectedOption.toLowerCase().trim();
      
      console.log(`Comparing: "${normalizedTriggerValue}" with "${normalizedSelectedOption}"`);
      
      // Handle partial/partially value matching
      if ((normalizedTriggerValue === 'partial' && normalizedSelectedOption === 'partially') ||
          (normalizedTriggerValue === 'partially' && normalizedSelectedOption === 'partial')) {
        console.log(`Match found (partial/partially): ${trigger.dimensionId}/${trigger.questionId}`);
        return true;
      }
      
      // Handle yes/no variations
      if ((normalizedTriggerValue === 'yes' && normalizedSelectedOption === 'fixed') ||
          (normalizedTriggerValue === 'fixed' && normalizedSelectedOption === 'yes')) {
        console.log(`Match found (yes/fixed): ${trigger.dimensionId}/${trigger.questionId}`);
        return true;
      }
      
      // Handle high/medium/low variations
      if ((normalizedTriggerValue === 'high' && normalizedSelectedOption === 'high') ||
          (normalizedTriggerValue === 'medium' && normalizedSelectedOption === 'medium') ||
          (normalizedTriggerValue === 'low' && normalizedSelectedOption === 'low') ||
          (normalizedTriggerValue === 'medium/low' && 
            (normalizedSelectedOption === 'medium' || normalizedSelectedOption === 'low'))) {
        console.log(`Match found (high/medium/low): ${trigger.dimensionId}/${trigger.questionId}`);
        return true;
      }
      
      // Direct match (case insensitive)
      const isMatch = normalizedSelectedOption === normalizedTriggerValue;
      if (isMatch) {
        console.log(`Direct match found: ${trigger.dimensionId}/${trigger.questionId} - ${normalizedSelectedOption} = ${normalizedTriggerValue}`);
      }
      return isMatch;
    });
    
    // Log the final result for legal recommendations
    if (recommendation.id.startsWith('legal')) {
      console.log(`Legal recommendation ${recommendation.id} will ${result ? 'SHOW' : 'NOT SHOW'}`);
    }
    
    // Log the final result for political recommendations
    if (recommendation.id.startsWith('political')) {
      console.log(`Political recommendation ${recommendation.id} will ${result ? 'SHOW' : 'NOT SHOW'}`);
    }
    
    return result;
  };

  // Check if user has made any selections in Causes Analysis
  const hasUserSelections = dimensions.length > 0 && dimensions.some(dimension => 
    dimension.questions.some(question => question.selectedOption !== undefined)
  );

  return (
    <div className="space-y-8">
      {/* Top View Options Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            View Options
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewType('highLevel')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'highLevel'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              High-Level Recommendations
            </button>
            <button
              onClick={() => setViewType('scenarios')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === 'scenarios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Scenario-Based Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Layout with sidebar and content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* OSR Type Selection - Left Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              OSR Types
            </h3>
            <div className="flex flex-col gap-2">
              {osrTypes.map(osrType => (
                <button
                  key={osrType.id}
                  className={`px-4 py-2 rounded-md text-left transition-colors ${
                    activeOsrType === osrType.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveOsrType(osrType.id as OsrType)}
                >
                  {osrType.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {activeOsrType === 'propertyTax' ? 'Property Tax' : 
               activeOsrType === 'license' ? 'License' : 
               activeOsrType === 'shortTermUserCharge' ? 'Short Term User Charge' : 
               activeOsrType === 'longTermUserCharge' ? 'Long Term User Charge' : 
               'Mixed User Charge'} Recommendations
            </h2>
            
            {/* Introductory text */}
            {hasUserSelections && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                These recommendations are based on your responses to the Property Tax Gap Analysis Questionnaire. 
                They are tailored to address the specific challenges you've identified.
              </p>
            )}
            
            {/* Debug panel is still available but buttons are removed */}
            {showDebug && (
              <DebugPanel 
                showDebug={showDebug}
                setShowDebug={setShowDebug}
                dimensions={dimensions}
                recommendationDimensions={recommendationDimensions}
                getSelectedOption={getSelectedOption}
                shouldShowRecommendation={shouldShowRecommendation}
              />
            )}
            
            {/* Show recommendations based on active OSR type */}
            {activeOsrType === 'propertyTax' && (
              viewType === 'highLevel' ? (
                <HighLevelRecommendations 
                  recommendationDimensions={recommendationDimensions}
                  shouldShowRecommendation={shouldShowRecommendation}
                  hasUserSelections={hasUserSelections || showAllRecommendations}
                />
              ) : (
                <ScenarioRecommendations 
                  scenarios={scenarios} 
                  hasUserSelections={hasUserSelections || showAllRecommendations}
                />
              )
            )}
            
            {/* Placeholder for other OSR types */}
            {activeOsrType !== 'propertyTax' && (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Recommendations for {
                    activeOsrType === 'license' ? 'License' : 
                    activeOsrType === 'shortTermUserCharge' ? 'Short Term User Charge' : 
                    activeOsrType === 'longTermUserCharge' ? 'Long Term User Charge' : 
                    'Mixed User Charge'
                  } will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 