export const defaultLongTermValues = {
  totalEstimatedLeases: 1000,
  totalActualLeases: 700,
  categories: [
    {
      id: 'category-a',
      name: 'Residential Leases',
      estimatedLeases: 600,
      registeredLeases: 500,
      potentialRate: 100,
      actualRate: 50,
      isExpanded: false
    },
    {
      id: 'category-b',
      name: 'Commercial Leases',
      estimatedLeases: 100,
      registeredLeases: 50,
      potentialRate: 50,
      actualRate: 20,
      isExpanded: false
    },
    {
      id: 'category-c',
      name: 'Agricultural Leases',
      estimatedLeases: 300,
      registeredLeases: 150,
      potentialRate: 150,
      actualRate: 100,
      isExpanded: false
    }
  ]
};
