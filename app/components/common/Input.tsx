'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, labelClassName, containerClassName, ...props }, ref) => {
    return (
      <div className={twMerge("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={twMerge(
              "block text-xs font-medium text-gray-700 mb-1",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={twMerge(
              "block w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-md",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              error && "border-red-300 focus:ring-red-500",
              className
            )}
          />
          {props.type === "number" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-xs"></span>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
