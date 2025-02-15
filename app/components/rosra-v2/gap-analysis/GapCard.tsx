import React from 'react';

interface GapCardProps {
  title: string;
  amount: number;
  description: string;
  color: string;
  currencySymbol: string;
}

export default function GapCard({ title, amount, description, color, currencySymbol }: GapCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return 'before:bg-orange-500';
      case 'purple':
        return 'before:bg-purple-500';
      case 'yellow':
        return 'before:bg-yellow-500';
      default:
        return 'before:bg-blue-500';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'orange':
        return 'text-orange-500';
      case 'purple':
        return 'text-purple-500';
      case 'yellow':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className={`
      relative bg-white rounded-lg shadow-sm p-6
      before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 
      before:w-1 before:rounded-l-lg ${getColorClasses(color)}
    `}>
      <h3 className="text-gray-600 text-sm font-medium mb-2">
        {title}
      </h3>
      <p className={`text-2xl font-bold mb-1 ${getTextColor(color)}`}>
        {currencySymbol} {amount.toLocaleString()}
      </p>
      
    </div>
  );
}