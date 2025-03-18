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
    const formattedAmount = amount.toLocaleString();
    return formattedAmount;
  };

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {isPercentage ? `${amount.toFixed(1)}%` : formatCurrency(amount)}
      </p>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
