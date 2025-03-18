import { useState } from 'react';
import { Category } from '@/app/types/propertyTax';
import { InputField } from '@/app/components/common/InputField';

interface CategoryFormProps {
  category: Category;
  onUpdate: (field: keyof Category, value: number | string | boolean) => void;
  onDelete: () => void;
}

export const CategoryForm = ({ category, onUpdate, onDelete }: CategoryFormProps) => {
  const [isExpanded, setIsExpanded] = useState(category.isExpanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onUpdate('isExpanded', !isExpanded);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between p-3">
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={category.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none w-full"
          />
          <button
            onClick={handleToggle}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Registered Taxpayers"
              value={category.registeredTaxpayers}
              onChange={(value) => onUpdate('registeredTaxpayers', Number(value))}
              type="number"
              min={0}
            />
            <InputField
              label="Compliant Taxpayers"
              value={category.compliantTaxpayers}
              onChange={(value) => onUpdate('compliantTaxpayers', Number(value))}
              type="number"
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Average Value of land/property"
              value={category.averageLandValue}
              onChange={(value) => onUpdate('averageLandValue', Number(value))}
              type="number"
              min={0}
            />
            <InputField
              label="Estimated Average Value"
              value={category.estimatedAverageValue}
              onChange={(value) => onUpdate('estimatedAverageValue', Number(value))}
              type="number"
              min={0}
            />
          </div>

          <InputField
            label="Tax Rate (%)"
            value={category.taxRate * 100}
            onChange={(value) => onUpdate('taxRate', Number(value) / 100)}
            type="number"
            min={0}
            step={0.1}
          />

          <button
            onClick={onDelete}
            className="w-full mt-3 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Category
          </button>
        </div>
      )}
    </div>
  );
};
