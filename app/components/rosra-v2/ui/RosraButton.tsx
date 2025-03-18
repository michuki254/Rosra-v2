import React from 'react';
import { classNames } from '../../../utils/classNames';

interface RosraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'export' | 'configure';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function RosraButton({ 
  variant = 'primary', 
  icon, 
  children, 
  className,
  ...props 
}: RosraButtonProps) {
  const baseStyles = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    export: "text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30",
    configure: "text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
  };

  return (
    <button
      className={classNames(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
