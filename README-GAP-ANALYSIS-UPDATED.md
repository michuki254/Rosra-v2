# Gap Analysis Data Models and API Routes (Updated)

This document outlines the updated data models and API routes for the Gap Analysis section of the ROSRA application.

## Overview

The Gap Analysis section consists of several components:

1. Property Tax Analysis
2. License Analysis
3. Short Term User Charge Analysis
4. Long Term User Charge Analysis
5. Mixed User Charge Analysis
6. Total Estimate Analysis

Each component now has its own data model, API routes, and hooks for data management, and can be used without requiring a report ID.

## Data Models

### PropertyTaxAnalysis

- **Model**: `models/PropertyTaxAnalysis.ts`
- **Interface**: `IPropertyTaxAnalysis`
- **Fields**:
  - `userId`: MongoDB ObjectId (reference to User) - Required
  - `reportId`: MongoDB ObjectId (reference to Report) - Optional
  - `country`: String - Required
  - `state`: String - Required
  - `totalEstimatedTaxPayers`: Number - Required
  - `registeredTaxPayers`: Number - Required
  - `categories`: Array of `ICategory` objects - Required
  - `createdAt`: Date - Auto-generated
  - `updatedAt`: Date - Auto-generated

### LicenseAnalysis

- **Model**: `models/LicenseAnalysis.ts`
- **Interface**: `ILicenseAnalysis`
- **Fields**:
  - `userId`: MongoDB ObjectId (reference to User) - Required
  - `reportId`: MongoDB ObjectId (reference to Report) - Optional
  - `country`: String - Required
  - `state`: String - Required
  - `totalEstimatedBusinesses`: Number - Required
  - `registeredBusinesses`: Number - Required
  - `categories`: Array of `ILicenseCategory` objects - Required
  - `createdAt`: Date - Auto-generated
  - `updatedAt`: Date - Auto-generated

## API Routes

### Property Tax Analysis

#### Standalone API Routes (No Report Required)

- **GET** `/api/property-tax`: Retrieve all property tax analyses for the current user
- **POST** `/api/property-tax`: Create a new property tax analysis
- **GET** `/api/property-tax/[id]`: Retrieve a specific property tax analysis
- **PUT** `/api/property-tax/[id]`: Update a specific property tax analysis
- **DELETE** `/api/property-tax/[id]`: Delete a specific property tax analysis

#### Report-Specific API Routes

- **GET** `/api/reports/[reportId]/property-tax`: Retrieve property tax analysis for a report
- **POST** `/api/reports/[reportId]/property-tax`: Create new property tax analysis for a report
- **PUT** `/api/reports/[reportId]/property-tax`: Update property tax analysis for a report
- **DELETE** `/api/reports/[reportId]/property-tax`: Delete property tax analysis for a report

### License Analysis

#### Standalone API Routes (No Report Required)

- **GET** `/api/license`: Retrieve all license analyses for the current user
- **POST** `/api/license`: Create a new license analysis
- **GET** `/api/license/[id]`: Retrieve a specific license analysis
- **PUT** `/api/license/[id]`: Update a specific license analysis
- **DELETE** `/api/license/[id]`: Delete a specific license analysis

#### Report-Specific API Routes

- **GET** `/api/reports/[reportId]/license`: Retrieve license analysis for a report
- **POST** `/api/reports/[reportId]/license`: Create new license analysis for a report
- **PUT** `/api/reports/[reportId]/license`: Update license analysis for a report
- **DELETE** `/api/reports/[reportId]/license`: Delete license analysis for a report

## Hooks

### usePropertyTaxData

- **File**: `app/hooks/usePropertyTaxData.ts`
- **Purpose**: Manage property tax data with or without a report
- **Props**:
  - `reportId`: Optional - ID of the report to associate with the data
  - `analysisId`: Optional - ID of an existing property tax analysis
- **Methods**:
  - `fetchData`: Fetch property tax data from the API
  - `saveData`: Save property tax data to the API
  - `updateData`: Update property tax data locally
  - `addCategory`: Add a new category to the property tax data
  - `updateCategory`: Update a category in the property tax data
  - `removeCategory`: Remove a category from the property tax data

### useLicenseData

- **File**: `app/hooks/useLicenseData.ts`
- **Purpose**: Manage license data with or without a report
- **Props**:
  - `reportId`: Optional - ID of the report to associate with the data
  - `analysisId`: Optional - ID of an existing license analysis
- **Methods**:
  - `fetchData`: Fetch license data from the API
  - `saveData`: Save license data to the API
  - `updateData`: Update license data locally
  - `addCategory`: Add a new category to the license data
  - `updateCategory`: Update a category in the license data
  - `removeCategory`: Remove a category from the license data

## Usage

### Standalone Usage (No Report Required)

```jsx
// Example of using property tax data without a report
const { data, saveData, addCategory } = usePropertyTaxData();

// Add a category
addCategory({
  name: 'Residential',
  registeredTaxpayers: 1000,
  compliantTaxpayers: 800,
  averageLandValue: 50000,
  estimatedAverageValue: 60000,
  taxRate: 0.02
});

// Save data
await saveData({
  country: 'United States',
  state: 'California',
  totalEstimatedTaxPayers: 5000,
  registeredTaxPayers: 3000,
  categories: data.categories
});
```

### Report-Specific Usage

```jsx
// Example of using property tax data with a report
const { data, saveData, addCategory } = usePropertyTaxData({ reportId: 'report-id-123' });

// Add a category
addCategory({
  name: 'Commercial',
  registeredTaxpayers: 500,
  compliantTaxpayers: 400,
  averageLandValue: 100000,
  estimatedAverageValue: 120000,
  taxRate: 0.03
});

// Save data (reportId will be automatically included)
await saveData({
  totalEstimatedTaxPayers: 2000,
  registeredTaxPayers: 1500,
  categories: data.categories
});
```

## Next Steps

1. Implement the remaining analysis components:
   - Short Term User Charge Analysis
   - Long Term User Charge Analysis
   - Mixed User Charge Analysis
   - Total Estimate Analysis

2. Update the UI components to work with the new hooks and API routes

3. Add a list view to display all saved analyses

4. Implement search and filtering for analyses

5. Add the ability to associate standalone analyses with reports later 