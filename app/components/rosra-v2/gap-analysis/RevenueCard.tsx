'use client';

import React from 'react';

interface RevenueCardProps {
  title: string;
  amount: number;
  description?: string;
  className?: string;
  isPercentage?: boolean;
}

export default function RevenueCard({ title, amount, description, className = '', isPercentage = false }: RevenueCardProps) {
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Define color themes based on title
  const getTheme = (title: string) => {
    if (title.toLowerCase().includes('actual')) {
      return 'border-l-4 border-blue-500';
    } else if (title.toLowerCase().includes('potential')) {
      return 'border-l-4 border-green-500';
    } else if (title.toLowerCase().includes('gap')) {
      return 'border-l-4 border-red-500';
    }
    return 'border-l-4 border-gray-500';
  };

  // Get text color based on title
  const getTextColor = (title: string) => {
    if (title.toLowerCase().includes('actual')) {
      return 'text-blue-600';
    } else if (title.toLowerCase().includes('potential')) {
      return 'text-green-600';
    } else if (title.toLowerCase().includes('gap')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${getTheme(title)} ${className}`}>
      <h3 className={`text-sm font-medium ${getTextColor(title)} mb-1`}>
        {title}
      </h3>
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {isPercentage ? `${amount.toFixed(1)}%` : formatCurrency(amount)}
      </p>
      {description && (
        <p className={`text-xs ${getTextColor(title)}`}>
          {description}
        </p>
      )}
    </div>
  );
}
