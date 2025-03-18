import { formatCurrency } from '@/app/utils/formatters';
import { GapBreakdown } from '@/app/types/gap-analysis';

interface GapCardProps {
  title: string;
  totalGap: number;
  gapBreakdown?: GapBreakdown;
  colorScheme: {
    bg: string;
    text: string;
    darkBg: string;
  };
  currency: string;
  currencySymbol: string;
  showRegistrationGap?: boolean;
}

const defaultGapBreakdown: GapBreakdown = {
  registrationGap: 0,
  complianceGap: 0,
  assessmentGap: 0,
  rateGap: 0,
  combinedGaps: 0
};

export function ComparativeGapCard({
  title,
  totalGap,
  gapBreakdown = defaultGapBreakdown,
  colorScheme,
  currencySymbol,
  showRegistrationGap = false
}: GapCardProps) {
  const safeGapBreakdown = gapBreakdown || defaultGapBreakdown;

  return (
    <div className={`${colorScheme.bg} ${colorScheme.darkBg} p-6 rounded-lg`}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <h3 className={`text-lg font-semibold ${colorScheme.text}`}>{title}</h3>
          <p className={`text-xl font-bold ${colorScheme.text} mt-2`}>
            {formatCurrency(Math.abs(totalGap), currencySymbol)}
          </p>
        </div>
        <div className={`col-span-3 grid ${showRegistrationGap ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
          {showRegistrationGap && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <span className={`block ${colorScheme.text} mb-2`}>Registration Gap</span>
              <span className="text-lg font-semibold">
                {formatCurrency(safeGapBreakdown.registrationGap || 0, currencySymbol)}
              </span>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <span className={`block ${colorScheme.text} mb-2`}>Compliance Gap</span>
            <span className="text-lg font-semibold">
              {formatCurrency(safeGapBreakdown.complianceGap || 0, currencySymbol)}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <span className={`block ${colorScheme.text} mb-2`}>
              {showRegistrationGap ? 'Assessment Gap' : 'Rate Gap'}
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(
                showRegistrationGap ? safeGapBreakdown.assessmentGap || 0 : safeGapBreakdown.rateGap || 0,
                currencySymbol
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
