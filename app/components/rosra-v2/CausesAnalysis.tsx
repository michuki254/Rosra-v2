'use client'

import React, { useState, useEffect } from 'react';
import { usePropertyTaxCalculations } from '@/app/hooks/usePropertyTaxCalculations';
import { usePropertyTax } from '@/app/context/PropertyTaxContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useCausesAnalysis } from '@/app/context/CausesAnalysisContext';
import { useLicenseMetrics } from '@/app/context/LicenseMetricsContext';
import { useLicense } from '@/app/context/LicenseContext';
import { useShortTerm } from '@/app/context/ShortTermContext';
import { useLongTerm } from '@/app/context/LongTermContext';
import { useMixedCharge } from '@/app/context/MixedChargeContext';

// Import components
import OSRTypeSidebar, { OsrType } from './causes-analysis/OSRTypeSidebar';
import PropertyTaxMetricsSummary from './causes-analysis/PropertyTaxMetricsSummary';
import LicenseMetricsSummary from './causes-analysis/LicenseMetricsSummary';
import ShortTermUserChargeMetricsSummary from './causes-analysis/ShortTermUserChargeMetricsSummary';
import LongTermUserChargeMetricsSummary from './causes-analysis/LongTermUserChargeMetricsSummary';
import MixedUserChargeMetricsSummary from './causes-analysis/MixedUserChargeMetricsSummary';
import PropertyTaxQuestionnaire from './causes-analysis/PropertyTaxQuestionnaire';
import GeneralCausesCards from './causes-analysis/GeneralCausesCards';

// Import OSR-specific causes
import { propertyTaxCauses } from './causes-analysis/propertyTaxCauses';
import { businessLicenseCauses } from './causes-analysis/businessLicenseCauses';
import { marketFeesCauses } from './causes-analysis/marketFeesCauses';
import { landFeesCauses } from './causes-analysis/landFeesCauses';
import { buildingPermitsCauses } from './causes-analysis/buildingPermitsCauses';

export default function CausesAnalysis() {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';
  
  // Get property tax metrics
  const { metrics: propertyTaxMetrics } = usePropertyTax();
  const propertyTaxCalculations = usePropertyTaxCalculations(propertyTaxMetrics);
  
  // Get license metrics from both contexts
  const { metrics: licenseMetricsFromContext } = useLicenseMetrics();
  const { metrics: licenseMetricsFromLicense } = useLicense();
  
  // Get short term user charge metrics
  const { metrics: shortTermMetrics } = useShortTerm();
  
  // Get long term user charge metrics
  const { metrics: longTermMetrics } = useLongTerm();
  
  // Get mixed user charge metrics
  const { metrics: mixedChargeMetrics } = useMixedCharge();
  
  // Combine license metrics, preferring actual data from LicenseContext
  const licenseCalculations = {
    actualRevenue: licenseMetricsFromLicense.actual || licenseMetricsFromContext.actual || 0,
    potentialRevenue: licenseMetricsFromLicense.potential || licenseMetricsFromContext.potential || 0,
    gap: licenseMetricsFromLicense.gap || licenseMetricsFromContext.gap || 0,
    gapBreakdown: {
      registrationGap: licenseMetricsFromLicense.gapBreakdown?.registrationGap || licenseMetricsFromContext.gapBreakdown?.registrationGap || 0,
      complianceGap: licenseMetricsFromLicense.gapBreakdown?.complianceGap || licenseMetricsFromContext.gapBreakdown?.complianceGap || 0,
      assessmentGap: licenseMetricsFromLicense.gapBreakdown?.assessmentGap || licenseMetricsFromContext.gapBreakdown?.assessmentGap || 0,
      combinedGaps: licenseMetricsFromLicense.gapBreakdown?.combinedGaps || licenseMetricsFromContext.gapBreakdown?.combinedGaps || 0
    }
  };
  
  // Prepare short term user charge calculations
  const shortTermCalculations = {
    actualRevenue: shortTermMetrics.actual || 0,
    potentialRevenue: shortTermMetrics.potential || 0,
    gap: shortTermMetrics.gap || 0,
    gapBreakdown: {
      complianceGap: shortTermMetrics.gapBreakdown?.complianceGap || 0,
      rateGap: shortTermMetrics.gapBreakdown?.rateGap || 0,
      combinedGaps: shortTermMetrics.gapBreakdown?.combinedGaps || 0
    }
  };
  
  // Prepare long term user charge calculations
  const longTermCalculations = {
    actualRevenue: longTermMetrics.actual || 0,
    potentialRevenue: longTermMetrics.potential || 0,
    gap: longTermMetrics.gap || 0,
    gapBreakdown: {
      complianceGap: longTermMetrics.gapBreakdown?.complianceGap || 0,
      rateGap: longTermMetrics.gapBreakdown?.rateGap || 0,
      combinedGaps: longTermMetrics.gapBreakdown?.combinedGaps || 0
    }
  };
  
  // Prepare mixed user charge calculations
  const mixedChargeCalculations = {
    actualRevenue: mixedChargeMetrics.actual || 0,
    potentialRevenue: mixedChargeMetrics.potential || 0,
    gap: mixedChargeMetrics.gap || 0,
    gapBreakdown: {
      complianceGap: mixedChargeMetrics.gapBreakdown?.complianceGap || 0,
      rateGap: mixedChargeMetrics.gapBreakdown?.rateGap || 0,
      combinedGaps: mixedChargeMetrics.gapBreakdown?.combinedGaps || 0
    }
  };
  
  // State for active OSR type
  const [activeOsrType, setActiveOsrType] = useState<OsrType>('propertyTax');
  
  // Use the context for dimensions
  const { 
    dimensions, 
    setDimensions, 
    handleQuestionResponse, 
    getQuestionImpact, 
    getDimensionImpact 
  } = useCausesAnalysis();

  // Initialize property tax questionnaire
  useEffect(() => {
    // Only initialize if dimensions are empty
    if (dimensions.length === 0) {
      // Define property tax questionnaire dimensions and questions
      const propertyTaxDimensions = [
        {
          id: 'legal',
          name: 'Legal',
          questions: [
            {
              id: 'legal_1',
              text: 'Does the local government have the legal authority to update or change property valuation methods?',
              options: [
                { value: 'yes', label: 'Yes', impact: 'Low' as const },
                { value: 'partially', label: 'Partially (Only certain aspects can be changed)', impact: 'Medium' as const },
                { value: 'no', label: 'No / Unclear', impact: 'High' as const }
              ]
            },
            {
              id: 'legal_2',
              text: 'Is there a legally mandated frequency for revaluation?',
              options: [
                { value: 'fixed', label: 'Yes (Fixed interval)', impact: 'Low' as const },
                { value: 'flexible', label: 'Yes (Flexible interval)', impact: 'Medium' as const },
                { value: 'no', label: 'No / Unsure', impact: 'High' as const }
              ]
            }
          ]
        },
        {
          id: 'political',
          name: 'Political',
          questions: [
            {
              id: 'political_1',
              text: 'Is there strong political support (e.g., Mayor, Council) for improving the valuation system (e.g., shifting from pure area-based to a more refined or market-informed method)?',
              options: [
                { value: 'high', label: 'High', impact: 'Low' as const },
                { value: 'medium', label: 'Medium/Low', impact: 'Medium' as const },
                { value: 'uncertain', label: 'Uncertain', impact: 'High' as const }
              ]
            },
            {
              id: 'political_2',
              text: 'Are influential stakeholders (property owners, business lobbies) resistant to changing valuation approaches?',
              options: [
                { value: 'strong', label: 'Yes – Strong resistance', impact: 'High' as const },
                { value: 'mild', label: 'Yes – Mild', impact: 'Medium' as const },
                { value: 'no', label: 'No / Uncertain', impact: 'Low' as const }
              ]
            }
          ]
        },
        {
          id: 'governance',
          name: 'Governance',
          questions: [
            {
              id: 'governance_1',
              text: 'Are institutional roles for valuation (e.g., land registry, valuation department, revenue authority) clearly defined and coordinated?',
              options: [
                { value: 'well_defined', label: 'Yes – Well-defined', impact: 'Low' as const },
                { value: 'partial', label: 'Partial / No', impact: 'High' as const },
                { value: 'unsure', label: 'Unsure', impact: 'Medium' as const }
              ]
            },
            {
              id: 'governance_2',
              text: 'Is there an oversight or audit mechanism to ensure valuations are fair, transparent, and periodically reviewed?',
              options: [
                { value: 'yes', label: 'Yes', impact: 'Low' as const },
                { value: 'no', label: 'No', impact: 'High' as const },
                { value: 'uncertain', label: 'Uncertain', impact: 'Medium' as const }
              ]
            }
          ]
        },
        {
          id: 'financial',
          name: 'Financial',
          questions: [
            {
              id: 'financial_1',
              text: 'Does the municipality have sufficient budget/funding to implement or upgrade valuation methods (staff training, data collection, software)?',
              options: [
                { value: 'yes', label: 'Yes', impact: 'Low' as const },
                { value: 'partially', label: 'Partially / No', impact: 'High' as const },
                { value: 'unsure', label: 'Unsure', impact: 'Medium' as const }
              ]
            },
            {
              id: 'financial_2',
              text: 'Will likely revenue gains offset the costs of introducing a refined or market-informed valuation approach?',
              options: [
                { value: 'strongly', label: 'Yes – Strongly', impact: 'Low' as const },
                { value: 'somewhat', label: 'Yes – Somewhat', impact: 'Medium' as const },
                { value: 'no', label: 'No / Unsure', impact: 'High' as const }
              ]
            }
          ]
        },
        {
          id: 'administrative',
          name: 'Administrative',
          questions: [
            {
              id: 'administrative_1',
              text: 'Do municipal staff have adequate training or experience in alternative valuation techniques (area-based, points-based, mass appraisal)?',
              options: [
                { value: 'well_trained', label: 'Yes – Well-trained', impact: 'Low' as const },
                { value: 'minimal', label: 'Somewhat / Minimal', impact: 'Medium' as const },
                { value: 'unsure', label: 'Unsure', impact: 'High' as const }
              ]
            },
            {
              id: 'administrative_2',
              text: 'Is there an up-to-date property registry or GIS system for valuation data and regular updates?',
              options: [
                { value: 'robust', label: 'Yes – Robust', impact: 'Low' as const },
                { value: 'in_progress', label: 'In Progress', impact: 'Medium' as const },
                { value: 'outdated', label: 'No – Outdated', impact: 'High' as const },
                { value: 'unsure', label: 'Unsure', impact: 'Medium' as const }
              ]
            }
          ]
        },
        {
          id: 'valuation',
          name: 'Valuation Approach',
          questions: [
            {
              id: 'valuation_1',
              text: 'What type of valuation method is currently used or permitted? (Focus: Area-based only, Hybrid/Notional/Points-based, or Market-informed/Market-based)',
              options: [
                { value: 'area_based', label: 'Area-based', impact: 'High' as const },
                { value: 'hybrid', label: 'Hybrid / Notional (points-based, adjusted area)', impact: 'Medium' as const },
                { value: 'market_informed', label: 'Market-informed', impact: 'Low' as const },
                { value: 'market_based', label: 'Market-based', impact: 'Low' as const },
                { value: 'none', label: 'None / Unclear', impact: 'High' as const }
              ]
            },
            {
              id: 'valuation_2',
              text: 'Is there a plan or timeline to transition toward more refined (or market-based) valuation as data and capacity improve?',
              options: [
                { value: 'detailed', label: 'Yes – Detailed', impact: 'Low' as const },
                { value: 'general', label: 'Yes – General', impact: 'Medium' as const },
                { value: 'no', label: 'No', impact: 'High' as const },
                { value: 'unsure', label: 'Unsure', impact: 'Medium' as const }
              ]
            }
          ]
        }
      ];

      setDimensions(propertyTaxDimensions);
    }
  }, [dimensions.length, setDimensions]);

  // Handle question selection
  const handleQuestionSelect = (dimensionId: string, questionId: string, optionValue: string) => {
    handleQuestionResponse(dimensionId, questionId, optionValue);
    
    // Debug logging
    console.log('Question answered:', {
      dimensionId,
      questionId,
      optionValue
    });
    
    // Log current dimensions state after update
    setTimeout(() => {
      console.log('Updated dimensions:', dimensions);
    }, 100);
  };

  // Get causes based on active OSR type
  const getActiveCauses = () => {
    switch (activeOsrType) {
      case 'propertyTax':
        return propertyTaxCauses;
      case 'license':
        return businessLicenseCauses;
      case 'shortTermUserCharge':
        return marketFeesCauses;
      case 'longTermUserCharge':
        return landFeesCauses;
      case 'mixedUserCharge':
        return buildingPermitsCauses;
      default:
        return propertyTaxCauses;
    }
  };

  return (
    <div className="space-y-8">
      {/* Layout with sidebar and content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* OSR Type Selection - Left Sidebar */}
        <OSRTypeSidebar 
          activeOsrType={activeOsrType} 
          setActiveOsrType={setActiveOsrType} 
        />
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Property Tax Metrics Summary */}
          {activeOsrType === 'propertyTax' && (
            <PropertyTaxMetricsSummary 
              propertyTaxCalculations={propertyTaxCalculations} 
              currencySymbol={currencySymbol} 
            />
          )}
          
          {/* License Metrics Summary */}
          {activeOsrType === 'license' && (
            <LicenseMetricsSummary 
              licenseCalculations={licenseCalculations} 
              currencySymbol={currencySymbol} 
            />
          )}
          
          {/* Short Term User Charge Metrics Summary */}
          {activeOsrType === 'shortTermUserCharge' && (
            <ShortTermUserChargeMetricsSummary 
              shortTermCalculations={shortTermCalculations} 
              currencySymbol={currencySymbol} 
            />
          )}
          
          {/* Long Term User Charge Metrics Summary */}
          {activeOsrType === 'longTermUserCharge' && (
            <LongTermUserChargeMetricsSummary 
              longTermCalculations={longTermCalculations} 
              currencySymbol={currencySymbol} 
            />
          )}
          
          {/* Mixed User Charge Metrics Summary */}
          {activeOsrType === 'mixedUserCharge' && (
            <MixedUserChargeMetricsSummary 
              mixedChargeCalculations={mixedChargeCalculations} 
              currencySymbol={currencySymbol} 
            />
          )}
          
          {/* Structured Questionnaire for Property Tax */}
          {activeOsrType === 'propertyTax' && (
            <PropertyTaxQuestionnaire 
              dimensions={dimensions}
              handleQuestionSelect={handleQuestionSelect}
              getQuestionImpact={getQuestionImpact}
              getDimensionImpact={getDimensionImpact}
            />
          )}
          
          {/* OSR-specific Causes Cards */}
          <GeneralCausesCards causes={getActiveCauses()} />
          </div>
      </div>
    </div>
  );
}