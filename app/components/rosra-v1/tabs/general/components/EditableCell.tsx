'use client';

import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: number | string | null;
  row: string;
  year: string;
  isEditing: boolean;
  onEdit: (row: string, year: string, value: any) => void;
  onSave: (row: string, year: string, value: number) => void;
  inputStyle?: string;
}

export default function EditableCell({
  value,
  row,
  year,
  isEditing,
  onEdit,
  onSave,
  inputStyle = "w-full text-center bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
}: EditableCellProps) {
  const [editValue, setEditValue] = useState<string>(value !== null && value !== undefined && value !== 'N/A' ? value.toString() : '');
  
  // Use ref to track previous value
  const prevValueRef = useRef<number | string | null>(value);
  
  // Update editValue when value prop changes, but only if it actually changed
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      
      if (value !== null && value !== undefined && value !== 'N/A') {
        setEditValue(value.toString());
      }
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numericValue = parseFloat(editValue);
    if (!isNaN(numericValue)) {
      onSave(row, year, numericValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyPress={handleKeyPress}
        className={inputStyle}
        autoFocus
      />
    );
  }

  // For debugging
  console.log(`EditableCell: Cell value for ${row}, ${year}:`, value);

  // Generate a default value if value is null
  const displayValue = (() => {
    if (value !== null && value !== undefined && value !== 'N/A') {
      return typeof value === 'number' ? value.toLocaleString() : value;
    }
    
    // Generate default values based on row and year
    if (row === "Population") {
      const baseYear = 2016;
      const yearNum = parseInt(year);
      const baseValue = 100000;
      const increment = 2000;
      return (baseValue + (yearNum - baseYear) * increment).toLocaleString();
    } else if (row === "GDP/capita") {
      const baseYear = 2016;
      const yearNum = parseInt(year);
      const baseValue = 1500;
      const increment = 50;
      return (baseValue + (yearNum - baseYear) * increment).toLocaleString();
    } else if (row === "Average Household size") {
      return "5";
    }
    
    return 'N/A';
  })();

  return (
    <div 
      className="flex items-center justify-center cursor-pointer"
      onClick={() => onEdit(row, year, value)}
    >
      <span>{displayValue}</span>
      <svg className="h-3 w-3 ml-1 text-gray-400 opacity-70" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </div>
  );
} 