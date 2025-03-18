import { RevenueStream } from '@/app/types/total-estimate-analysis';
import { ColorScheme, GapBreakdown } from '@/app/types/gap-analysis';
import { ComparativeGapCard } from '../ComparativeGapCard';

interface GapBreakdownSectionProps {
  propertyTax?: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  license?: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  shortTerm?: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  longTerm?: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  mixedCharge?: {
    gap: number;
    gapBreakdown: GapBreakdown;
  };
  colorSchemes: {
    propertyTax: ColorScheme;
    license: ColorScheme;
    shortTerm: ColorScheme;
    longTerm: ColorScheme;
    mixedCharge: ColorScheme;
  };
  currencySymbol: string;
}

export const GapBreakdownSection = ({
  propertyTax,
  license,
  shortTerm,
  longTerm,
  mixedCharge,
  colorSchemes,
  currencySymbol
}: GapBreakdownSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Property Tax Card */}
      {propertyTax && (
        <ComparativeGapCard
          title="Property Tax Gaps"
          totalGap={propertyTax.gap || 0}
          gapBreakdown={propertyTax.gapBreakdown}
          colorScheme={colorSchemes.propertyTax}
          currencySymbol={currencySymbol}
          showRegistrationGap={true}
        />
      )}

      {/* License Card */}
      {license && (
        <ComparativeGapCard
          title="License Gaps"
          totalGap={license.gap || 0}
          gapBreakdown={license.gapBreakdown}
          colorScheme={colorSchemes.license}
          currencySymbol={currencySymbol}
          showRegistrationGap={true}
        />
      )}

      {/* Short Term User Charges Card */}
      {shortTerm && (
        <ComparativeGapCard
          title="Short-term User Charge Gaps"
          totalGap={shortTerm.gap || 0}
          gapBreakdown={shortTerm.gapBreakdown}
          colorScheme={colorSchemes.shortTerm}
          currencySymbol={currencySymbol}
        />
      )}

      {/* Long Term User Charges Card */}
      {longTerm && (
        <ComparativeGapCard
          title="Long-term User Charge Gaps"
          totalGap={longTerm.gap || 0}
          gapBreakdown={longTerm.gapBreakdown}
          colorScheme={colorSchemes.longTerm}
          currencySymbol={currencySymbol}
        />
      )}

      {/* Mixed User Charges Card */}
      {mixedCharge && (
        <ComparativeGapCard
          title="Mixed User Charge Gaps"
          totalGap={mixedCharge.gap || 0}
          gapBreakdown={mixedCharge.gapBreakdown}
          colorScheme={colorSchemes.mixedCharge}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};