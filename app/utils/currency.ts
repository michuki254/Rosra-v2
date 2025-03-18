'use client';

export async function getExchangeRate(from: string, to: string): Promise<number> {
  try {
    const response = await fetch(`/api/exchange-rate?from=${from}&to=${to}`);
    const data = await response.json();
    return data.rate || 1; // Default to 1 if rate not found
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1; // Default to 1 if there's an error
  }
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  const rate = await getExchangeRate(from, to);
  return amount * rate;
}

export async function getCountryEconomicData(countryCode: string) {
  try {
    const response = await fetch(`/api/economic-data/${countryCode}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching economic data:', error);
    return null;
  }
}
