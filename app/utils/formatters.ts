export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.abs(Math.round(value)));
};

export const formatCurrency = (value: number, currencySymbol: string = 'KSh'): string => {
  return `${currencySymbol} ${formatNumber(value)}`;
};

export const formatRoundedCurrency = (value: number, currencySymbol: string = 'KSh'): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000_000) {
    // Format as billions
    return `${currencySymbol} ${(absValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    // Format as millions
    return `${currencySymbol} ${(absValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    // Format as thousands
    return `${currencySymbol} ${(absValue / 1_000).toFixed(1)}K`;
  } else {
    // Format as regular number
    return `${currencySymbol} ${absValue.toFixed(0)}`;
  }
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDecimal = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
