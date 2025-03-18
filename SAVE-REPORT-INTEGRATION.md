# Integrating Property Tax and License Data with Save Report Button

## Overview

To save property tax and license data when clicking the "Save Report" button (similar to how potential estimates work), we need to make the following changes:

1. Modify the `PropertyTaxAnalysis` and `LicenseAnalysis` components to pass their data up to the parent component
2. Update the `GapAnalysis` component to collect this data
3. Modify the main report saving mechanism to include this data

## Changes Made

### 1. PropertyTaxAnalysis and LicenseAnalysis Components

We've updated these components to:
- Remove their individual save buttons
- Pass both display metrics and raw data for saving through the `onMetricsChange` prop
- Display a message informing users that data will be saved with the main Save Report button

```jsx
// Before:
useEffect(() => {
  onMetricsChange?.(propertyTaxMetrics);
}, [propertyTaxMetrics, onMetricsChange]);

// After:
useEffect(() => {
  const completeData = {
    // Analysis metrics for display
    metrics: propertyTaxMetrics,
    
    // Raw data for saving to database
    saveData: {
      totalEstimatedTaxPayers: metrics.totalEstimatedTaxPayers,
      registeredTaxPayers: metrics.registeredTaxPayers,
      categories: metrics.categories.map(cat => ({
        // ...category data
      }))
    }
  };
  
  onMetricsChange?.(completeData);
}, [propertyTaxMetrics, metrics, onMetricsChange]);
```

### 2. GapAnalysis Component Updates Needed

The `GapAnalysis` component needs to be updated to:

```jsx
// Add state to store the raw data for saving
const [propertyTaxSaveData, setPropertyTaxSaveData] = useState(null);
const [licenseSaveData, setLicenseSaveData] = useState(null);

// Update the onMetricsChange handlers
const handlePropertyTaxMetricsChange = (data) => {
  // Store the metrics for display
  setPropertyTaxMetrics(data.metrics);
  
  // Store the raw data for saving
  setPropertyTaxSaveData(data.saveData);
};

const handleLicenseMetricsChange = (data) => {
  // Store the metrics for display
  setLicenseMetrics(data.metrics);
  
  // Store the raw data for saving
  setLicenseSaveData(data.saveData);
};

// Add a Save Report button
<button 
  onClick={handleSaveReport}
  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Save Report
</button>

// Add a function to save all data
const handleSaveReport = async () => {
  try {
    // Save property tax data if available
    if (propertyTaxSaveData) {
      await savePropertyTaxData(propertyTaxSaveData);
    }
    
    // Save license data if available
    if (licenseSaveData) {
      await saveLicenseData(licenseSaveData);
    }
    
    // Save other data as needed
    // ...
    
    toast.success('Report saved successfully');
  } catch (error) {
    console.error('Error saving report:', error);
    toast.error('Failed to save report. Please try again.');
  }
};
```

### 3. Update the PropertyTaxAnalysisProps and LicenseAnalysisProps Types

The prop types need to be updated to reflect the new data structure:

```typescript
// Before:
export interface PropertyTaxAnalysisProps {
  onMetricsChange?: (metrics: PropertyTaxMetrics) => void;
}

// After:
export interface PropertyTaxAnalysisProps {
  onMetricsChange?: (data: {
    metrics: PropertyTaxMetrics;
    saveData: {
      totalEstimatedTaxPayers: number;
      registeredTaxPayers: number;
      categories: Array<{
        name: string;
        registeredTaxpayers: number;
        compliantTaxpayers: number;
        averageLandValue: number;
        estimatedAverageValue: number;
        taxRate: number;
      }>;
    };
  }) => void;
}
```

## Implementation Steps

1. **Update the Types**: Modify the `PropertyTaxAnalysisProps` and `LicenseAnalysisProps` interfaces to include the new data structure.

2. **Update the GapAnalysis Component**:
   - Add state variables to store the raw data for saving
   - Update the onMetricsChange handlers to store both metrics and raw data
   - Add a Save Report button
   - Implement the handleSaveReport function to save all data

3. **Test the Integration**:
   - Navigate to the Gap Analysis section
   - Enter data in the Property Tax and License tabs
   - Click the Save Report button
   - Verify that all data is saved correctly

## Expected Results

With these changes, users will be able to:
1. Enter data in the Property Tax and License tabs
2. Click the Save Report button to save all data at once
3. See a success message when the data is saved

The data will be saved to the respective collections:
- `propertytaxanalyses` for Property Tax data
- `licenseanalyses` for License data

This approach aligns with how the potential estimates data is saved, providing a consistent user experience across the application. 