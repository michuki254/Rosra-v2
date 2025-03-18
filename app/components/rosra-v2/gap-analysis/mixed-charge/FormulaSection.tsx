import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMixedCharge } from '@/app/context/MixedChargeContext';

interface FormulaSectionProps {
  type: 'gap' | 'revenue';
}

export function FormulaSection({ type }: FormulaSectionProps) {
  const {
    showGapFormulas,
    showRevenueFormulas,
    setShowGapFormulas,
    setShowRevenueFormulas
  } = useMixedCharge();

  const isGapFormula = type === 'gap';
  const show = isGapFormula ? showGapFormulas : showRevenueFormulas;
  const setShow = isGapFormula ? setShowGapFormulas : setShowRevenueFormulas;
  const title = isGapFormula ? 'Gap Analysis Formulas' : 'Revenue Analysis Formulas';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
      >
        <div className="flex items-center">
          <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span>{title}</span>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
            show ? 'rotate-180' : ''
          }`}
        />
      </button>

      {show && (
        <div className="mt-3 space-y-3 text-sm">
          {isGapFormula ? <GapFormulas /> : <RevenueFormulas />}
        </div>
      )}
    </div>
  );
}

function GapFormulas() {
  return (
    <>
      <FormulaItem
        title="Compliance Gap"
        description="Revenue loss due to difference between estimated and actual number of leasees"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Compliance Gap</span> = Σ [(
            <span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> -{' '}
            <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span>) ×{' '}
            <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>]
          </span>
        }
      />

      <FormulaItem
        title="Rate Gap"
        description="Revenue loss due to difference between potential and actual rates"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Rate Gap</span> = Σ [
            <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span> × (
            <span className="text-green-600 dark:text-green-400">Potential Rate</span> -{' '}
            <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)]
          </span>
        }
      />

      <FormulaItem
        title="Combined Gaps"
        description="Revenue loss from both compliance and rate gaps combined"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Combined Gaps</span> = Σ [(
            <span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> -{' '}
            <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span>) × (
            <span className="text-green-600 dark:text-green-400">Potential Rate</span> -{' '}
            <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)]
          </span>
        }
      />
    </>
  );
}

function RevenueFormulas() {
  return (
    <>
      <FormulaItem
        title="Actual Revenue"
        description="Sum of (Actual Monthly Leasees × Actual Rate) for each category"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Actual Revenue</span> = Σ (
            <span className="text-blue-600 dark:text-blue-400">Actual Monthly Leasees</span> ×{' '}
            <span className="text-orange-600 dark:text-orange-400">Actual Rate</span>)
          </span>
        }
      />

      <FormulaItem
        title="Potential Revenue"
        description="Sum of (Estimated Monthly Leasees × Potential Rate) for each category"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Potential Revenue</span> = Σ (
            <span className="text-green-600 dark:text-green-400">Estimated Monthly Leasees</span> ×{' '}
            <span className="text-green-600 dark:text-green-400">Potential Rate</span>)
          </span>
        }
      />

      <FormulaItem
        title="Total Gap"
        description="Difference between Potential Revenue and Actual Revenue"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">Total Gap</span> ={' '}
            <span className="text-green-600 dark:text-green-400">Potential Revenue</span> -{' '}
            <span className="text-blue-600 dark:text-blue-400">Actual Revenue</span>
          </span>
        }
      />

      <FormulaItem
        title="% of Potential Leveraged"
        description="Percentage of Potential Revenue that is currently being collected"
        formula={
          <span>
            <span className="text-purple-600 dark:text-purple-400">% of Potential Leveraged</span> = (
            <span className="text-blue-600 dark:text-blue-400">Actual Revenue</span> ÷{' '}
            <span className="text-green-600 dark:text-green-400">Potential Revenue</span>) × 100
          </span>
        }
      />
    </>
  );
}

interface FormulaItemProps {
  title: string;
  description: string;
  formula: React.ReactNode;
}

function FormulaItem({ title, description, formula }: FormulaItemProps) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
      <h4 className="font-medium text-gray-500 mb-2">{title}</h4>
      <div className="pl-3 border-l-2 border-gray-500">
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
        <p className="mt-1 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-md">
          {formula}
        </p>
      </div>
    </div>
  );
}
