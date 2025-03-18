import { PotentialEstimatesData } from '../types/estimates';

export const calculatePropertyTaxRevenue = (
  taxRate: number,
  propertyValue: number,
  numberOfProperties: number
): number => {
  return (taxRate / 100) * propertyValue * numberOfProperties;
};

export const calculateLicenseRevenue = (
  licenseRate: number,
  numberOfLicenses: number
): number => {
  return licenseRate * numberOfLicenses;
};

export const calculateShortTermRevenue = (
  rate: number,
  numberOfUsers: number
): number => {
  return rate * numberOfUsers;
};

export const calculateLongTermRevenue = (
  rate: number,
  numberOfUsers: number
): number => {
  return rate * numberOfUsers * 12; // Annualized
};

export const calculateMixedUserRevenue = (
  rate: number,
  numberOfUsers: number
): number => {
  return rate * numberOfUsers;
};

export const calculateTotalPotentialRevenue = (estimates: PotentialEstimatesData): number => {
  return (
    calculatePropertyTaxRevenue(
      estimates.propertyTaxRate,
      estimates.propertyValue,
      estimates.numberOfProperties
    ) +
    calculateLicenseRevenue(estimates.licenseRate, estimates.numberOfLicenses) +
    calculateShortTermRevenue(estimates.shortTermRate, estimates.numberOfShortTermUsers) +
    calculateLongTermRevenue(estimates.longTermRate, estimates.numberOfLongTermUsers) +
    calculateMixedUserRevenue(estimates.mixedRate, estimates.numberOfMixedUsers)
  );
};
