import { Cause } from './causeTypes';

// Market Fees specific causes
export const marketFeesCauses: Cause[] = [
  {
    id: 'mf-1',
    category: 'Fee Collection',
    description: 'Inefficient manual collection methods leading to revenue leakage',
    impact: 'High',
    recommendations: [
      'Implement digital payment systems',
      'Introduce prepaid market access cards',
      'Regular rotation of fee collectors',
      'Real-time collection monitoring'
    ]
  },
  {
    id: 'mf-2',
    category: 'Market Infrastructure',
    description: 'Poor market infrastructure reducing willingness to pay fees',
    impact: 'Medium',
    recommendations: [
      'Improve sanitation facilities',
      'Enhance security measures',
      'Upgrade stall structures',
      'Improve waste management systems'
    ]
  },
  {
    id: 'mf-3',
    category: 'Trader Registration',
    description: 'Incomplete trader registry with many informal traders',
    impact: 'High',
    recommendations: [
      'Comprehensive trader census',
      'Simplified registration process',
      'Trader ID card system',
      'Regular market inspections'
    ]
  },
  {
    id: 'mf-4',
    category: 'Fee Structure',
    description: 'Outdated fee structure not reflecting market realities',
    impact: 'Medium',
    recommendations: [
      'Differentiated fees based on location and stall size',
      'Regular review of fee levels',
      'Transparent fee-setting process',
      'Consultation with trader associations'
    ]
  },
  {
    id: 'mf-5',
    category: 'Market Management',
    description: 'Weak market governance structures',
    impact: 'Medium',
    recommendations: [
      'Establish market management committees',
      'Clear roles for market masters',
      'Regular stakeholder meetings',
      'Performance monitoring of market operations'
    ]
  }
]; 