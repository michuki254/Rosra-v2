'use client';

import React from 'react';

interface RevenueCardProps {
  title: string;
  amount: number;
  currencySymbol?: string;
  className?: string;
}

export default function RevenueCard({ title, amount, currencySymbol = 'KES', className = '' }: RevenueCardProps) {
  const formattedAmount = amount.toLocaleString();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-4">
        {title}
      </h3>
      <div className="flex items-baseline">
        <span className="text-2xl text-blue-600 dark:text-blue-400 font-semibold mr-2">
          {currencySymbol}
        </span>
        <span className="text-4xl text-gray-900 dark:text-white font-bold">
          {formattedAmount}
        </span>
      </div>
    </div>
  );
}
