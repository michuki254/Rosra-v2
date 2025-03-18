import { Cause } from './causeTypes';

// Property Tax specific causes
export const propertyTaxCauses: Cause[] = [
  {
    id: 'pt-1',
    category: 'Valuation Methods',
    description: 'Outdated or inaccurate property valuation methods leading to undervaluation of properties',
    impact: 'High',
    recommendations: [
      'Implement market-based or hybrid valuation approaches',
      'Regular revaluation cycles (every 3-5 years)',
      'Develop property value zones based on location and amenities'
    ]
  },
  {
    id: 'pt-2',
    category: 'Property Registration',
    description: 'Incomplete property registry with missing or outdated property records',
    impact: 'High',
    recommendations: [
      'Conduct comprehensive property census',
      'Implement GIS-based property mapping',
      'Integrate with national land registry systems',
      'Regular data validation and updates'
    ]
  },
  {
    id: 'pt-3',
    category: 'Billing and Collection',
    description: 'Inefficient billing processes and weak enforcement mechanisms',
    impact: 'Medium',
    recommendations: [
      'Implement electronic billing and payment systems',
      'Strengthen legal enforcement for non-compliance',
      'Introduce incentives for early payment',
      'Establish clear penalties for late payment'
    ]
  },
  {
    id: 'pt-4',
    category: 'Exemption Management',
    description: 'Excessive or poorly managed exemptions reducing the tax base',
    impact: 'Medium',
    recommendations: [
      'Review and rationalize exemption policies',
      'Create transparent exemption application process',
      'Regular audit of exemption status',
      'Time-bound exemptions with clear expiration dates'
    ]
  },
  {
    id: 'pt-5',
    category: 'Administrative Capacity',
    description: 'Limited technical capacity and resources in property tax administration',
    impact: 'High',
    recommendations: [
      'Staff training on modern valuation techniques',
      'Investment in technology and data management systems',
      'Process automation for routine tasks',
      'Collaboration with national tax authorities for capacity building'
    ]
  }
]; 