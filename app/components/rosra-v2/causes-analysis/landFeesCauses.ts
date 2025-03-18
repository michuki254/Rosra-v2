import { Cause } from './causeTypes';

// Land Fees specific causes
export const landFeesCauses: Cause[] = [
  {
    id: 'lf-1',
    category: 'Land Records',
    description: 'Outdated or incomplete land registry and cadastral information',
    impact: 'High',
    recommendations: [
      'Digitize land records',
      'Conduct comprehensive land survey',
      'Establish GIS-based land information system',
      'Regular updating of land ownership data'
    ]
  },
  {
    id: 'lf-2',
    category: 'Fee Structure',
    description: 'Outdated fee structure not reflecting current land values',
    impact: 'High',
    recommendations: [
      'Regular land valuation updates',
      'Value-based fee calculation',
      'Differentiated rates by land use',
      'Transparent fee calculation methods'
    ]
  },
  {
    id: 'lf-3',
    category: 'Collection System',
    description: 'Inefficient billing and collection processes',
    impact: 'Medium',
    recommendations: [
      'Implement electronic billing system',
      'Multiple payment channels',
      'Automated payment reminders',
      'Integration with other property-related payments'
    ]
  },
  {
    id: 'lf-4',
    category: 'Compliance Enforcement',
    description: 'Weak enforcement mechanisms for non-payment',
    impact: 'High',
    recommendations: [
      'Clear legal framework for enforcement',
      'Penalties for non-compliance',
      'Restrictions on land transactions for defaulters',
      'Public listing of defaulters'
    ]
  },
  {
    id: 'lf-5',
    category: 'Administrative Capacity',
    description: 'Limited technical capacity in land administration',
    impact: 'Medium',
    recommendations: [
      'Staff training on modern land administration',
      'Investment in technology',
      'Process simplification and automation',
      'Collaboration with national land agencies'
    ]
  }
]; 