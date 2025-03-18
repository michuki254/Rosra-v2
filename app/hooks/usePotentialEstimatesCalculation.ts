import { useMemo } from 'react';
import { PotentialEstimatesData } from '../types/estimates';
import * as calculationService from '../services/potentialEstimatesService';

export const usePotentialEstimatesCalculation = (estimates: PotentialEstimatesData) => {
  const calculations = useMemo(() => ({
    propertyTaxRevenue: calculationService.calculatePropertyTaxRevenue(
      estimates.propertyTaxRate,
      estimates.propertyValue,
      estimates.numberOfProperties
    ),
    licenseRevenue: calculationService.calculateLicenseRevenue(
      estimates.licenseRate,
      estimates.numberOfLicenses
    ),
    shortTermRevenue: calculationService.calculateShortTermRevenue(
      estimates.shortTermRate,
      estimates.numberOfShortTermUsers
    ),
    longTermRevenue: calculationService.calculateLongTermRevenue(
      estimates.longTermRate,
      estimates.numberOfLongTermUsers
    ),
    mixedUserRevenue: calculationService.calculateMixedUserRevenue(
      estimates.mixedRate,
      estimates.numberOfMixedUsers
    ),
    totalPotentialRevenue: calculationService.calculateTotalPotentialRevenue(estimates)
  }), [estimates]);

  return calculations;
};
