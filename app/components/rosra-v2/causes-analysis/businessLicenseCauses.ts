import { Cause } from './causeTypes';

// Business License specific causes
export const businessLicenseCauses: Cause[] = [
  {
    id: 'bl-1',
    category: 'License Fee Structure',
    description: 'Outdated or complex fee structure that doesn\'t reflect business size or profitability',
    impact: 'Medium',
    recommendations: [
      'Implement tiered fee structure based on business size/turnover',
      'Regular review of fee levels',
      'Sector-specific fee adjustments',
      'Transparent fee calculation methods'
    ]
  },
  {
    id: 'bl-2',
    category: 'Business Registration',
    description: 'Incomplete business registry with many informal businesses operating without licenses',
    impact: 'High',
    recommendations: [
      'Conduct business census in commercial areas',
      'Simplify registration process for small businesses',
      'Mobile registration campaigns in markets and commercial zones',
      'Integration with national business registry'
    ]
  },
  {
    id: 'bl-3',
    category: 'Compliance Monitoring',
    description: 'Complex compliance procedures discouraging businesses from obtaining licenses',
    impact: 'High',
    recommendations: [
      'One-stop-shop for business licensing',
      'Online application and renewal system',
      'Reduce documentation requirements',
      'Clear guidance on compliance steps'
    ]
  },
  {
    id: 'bl-4',
    category: 'Administrative Procedures',
    description: 'Weak enforcement mechanisms and inconsistent inspection practices',
    impact: 'Medium',
    recommendations: [
      'Regular inspection schedules',
      'Training for enforcement officers',
      'Clear penalties for non-compliance',
      'Coordination with other regulatory agencies'
    ]
  },
  {
    id: 'bl-5',
    category: 'Public Awareness',
    description: 'Low awareness among businesses about licensing requirements and benefits',
    impact: 'Medium',
    recommendations: [
      'Business education campaigns',
      'Partnership with business associations',
      'Clear communication of benefits of formalization',
      'Guidance materials in multiple languages'
    ]
  }
]; 