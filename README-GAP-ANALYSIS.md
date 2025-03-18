# Gap Analysis Data Models and API Routes

This document outlines the data models and API routes for the Gap Analysis section of the ROSRA application.

## Overview

The Gap Analysis section consists of several components:

1. Property Tax Analysis
2. License Analysis
3. Short Term User Charge Analysis
4. Long Term User Charge Analysis
5. Mixed User Charge Analysis
6. Total Estimate Analysis

Each component has its own data model, API routes, and hooks for data management.

## Data Models

### PropertyTaxAnalysis

- **Model**: `models/PropertyTaxAnalysis.ts`
- **Interface**: `IPropertyTaxAnalysis`
- **Fields**:
  - `userId`: MongoDB ObjectId (reference to User)
  - `reportId`: MongoDB ObjectId (reference to Report)
  - `totalEstimatedTaxPayers`: Number
  - `registeredTaxPayers`: Number
  - `categories`: Array of `ICategory` objects
  - `createdAt`: Date
  - `updatedAt`: Date

### LicenseAnalysis

- **Model**: `models/LicenseAnalysis.ts`
- **Interface**: `ILicenseAnalysis`
- **Fields**:
  - `userId`: MongoDB ObjectId (reference to User)
  - `reportId`: MongoDB ObjectId (reference to Report)
  - `totalEstimatedBusinesses`: Number
  - `registeredBusinesses`: Number
  - `categories`: Array of `ILicenseCategory` objects
  - `createdAt`: Date
  - `updatedAt`: Date

## API Routes

### Property Tax Analysis

- **GET** `/api/reports/[reportId]/property-tax`: Retrieve property tax analysis for a report
- **POST** `/api/reports/[reportId]/property-tax`: Create new property tax analysis
- **PUT** `/api/reports/[reportId]/property-tax`: Update property tax analysis
- **DELETE** `/api/reports/[reportId]/property-tax`: Delete property tax analysis

### License Analysis

- **GET** `/api/reports/[reportId]/license`: Retrieve license analysis for a report
- **POST** `/api/reports/[reportId]/license`: Create new license analysis
- **PUT** `/api/reports/[reportId]/license`: Update license analysis
- **DELETE** `/api/reports/[reportId]/license`: Delete license analysis

## Hooks

### usePropertyTaxData

- **File**: `app/hooks/usePropertyTaxData.ts`
- **Purpose**: Manage property tax data for a report
- **Methods**:
  - `fetchData`: Fetch property tax data from the API
  - `saveData`: Save property tax data to the API
  - `updateData`: Update property tax data locally
  - `addCategory`: Add a new category to the property tax data
  - `updateCategory`: Update a category in the property tax data
  - `removeCategory`: Remove a category from the property tax data

### useLicenseData

- **File**: `app/hooks/useLicenseData.ts`
- **Purpose**: Manage license data for a report
- **Methods**:
  - `fetchData`: Fetch license data from the API
  - `saveData`: Save license data to the API
  - `updateData`: Update license data locally
  - `addCategory`: Add a new category to the license data
  - `updateCategory`: Update a category in the license data
  - `removeCategory`: Remove a category from the license data

## Usage

1. Create a report using the Report API
2. Use the hooks to manage data for each analysis component
3. Save the data to the database using the API routes

## Next Steps

1. Implement the remaining analysis components:
   - Short Term User Charge Analysis
   - Long Term User Charge Analysis
   - Mixed User Charge Analysis
   - Total Estimate Analysis

2. Update the UI to display saved data when a report is loaded

3. Implement validation for the data before saving

4. Add error handling for API requests

5. Add loading states for data fetching and saving

## Troubleshooting

If you encounter issues with saving data, check the following:

1. Make sure you have a valid report ID
2. Check that you're authenticated
3. Verify that the data format matches the expected schema
4. Check the server logs for any errors 