import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface Formula {
  title: string;
  formula: ReactNode;
}

interface FormulaSectionProps {
  title: string;
  isVisible: boolean;
  onToggle: () => void;
  formulas: Formula[];
}

export const FormulaSection = ({ title, isVisible, onToggle, formulas }: FormulaSectionProps) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-white/10"
      >
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          <span>{title}</span>
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform ${
            isVisible ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isVisible && (
        <div className="mt-2 space-y-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-white/10">
          {formulas.map((formula, index) => (
            <div key={`formula-${formula.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="font-medium text-gray-900 dark:text-white mb-2">
                {formula.title}
              </div>
              <div className="pl-4 font-mono text-sm">
                {formula.formula}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
