'use client';

import React from 'react';
import { exportAnalysisReport } from '@/app/utils/pdfExport';

interface ExportPDFProps {
  reportData: {
    country: string;
    state: string;
    financialYear: string;
    currency: string;
    currencySymbol: string;
    actualOSR: string;
    budgetedOSR: string;
    population: string;
    gdpPerCapita: string;
    propertyTax?: any;
    license?: any;
    shortTerm?: any;
    longTerm?: any;
    mixedCharge?: any;
  };
}

const ExportPDF: React.FC<ExportPDFProps> = ({ reportData }) => {
  const handleExport = () => {
    exportAnalysisReport(reportData);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <span>Export Analysis</span>
    </button>
  );
};

export default ExportPDF;
