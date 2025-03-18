import { Cause } from './causeTypes';

// Building Permits specific causes
export const buildingPermitsCauses: Cause[] = [
  {
    id: 'bp-1',
    category: 'Application Process',
    description: 'Complex and lengthy application procedures discouraging formal permit applications',
    impact: 'High',
    recommendations: [
      'Streamline application process',
      'Implement online application system',
      'Clear documentation requirements',
      'Establish service delivery standards'
    ]
  },
  {
    id: 'bp-2',
    category: 'Fee Structure',
    description: 'Unclear or excessive fee structure',
    impact: 'Medium',
    recommendations: [
      'Transparent fee calculation based on project value',
      'Tiered fee structure for different building types',
      'Regular review of fee levels',
      'Fee waivers for certain development types'
    ]
  },
  {
    id: 'bp-3',
    category: 'Inspection System',
    description: 'Inadequate inspection capacity leading to unauthorized construction',
    impact: 'High',
    recommendations: [
      'Increase inspection staff',
      'Risk-based inspection scheduling',
      'Mobile inspection technology',
      'Third-party inspection options'
    ]
  },
  {
    id: 'bp-4',
    category: 'Enforcement',
    description: 'Weak enforcement against unauthorized construction',
    impact: 'High',
    recommendations: [
      'Clear penalties for non-compliance',
      'Regular monitoring of construction sites',
      'Coordination with utility companies',
      'Public reporting mechanism for unauthorized construction'
    ]
  },
  {
    id: 'bp-5',
    category: 'Public Awareness',
    description: 'Low public awareness about permit requirements',
    impact: 'Medium',
    recommendations: [
      'Public education campaigns',
      'Engagement with construction industry',
      'Clear guidance materials',
      'Community outreach programs'
    ]
  }
]; 