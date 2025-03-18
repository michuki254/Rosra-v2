interface ExchangeRateResponse {
  rates: {
    [key: string]: number;
  };
  base: string;
  date: string;
}

export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  // If currencies are the same, return the original amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  } catch (error) {
    console.error('Currency conversion error:', error);
    return amount; // Return original amount if conversion fails
  }
}

// Cache exchange rates for 1 hour to minimize API calls
const exchangeRateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  const cacheKey = `${fromCurrency}-${toCurrency}`;
  const cachedData = exchangeRateCache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.rate;
  }

  try {
    // First get rates for the base currency (fromCurrency)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data: ExchangeRateResponse = await response.json();

    if (data.rates && data.rates[toCurrency]) {
      const rate = data.rates[toCurrency];
      exchangeRateCache.set(cacheKey, {
        rate,
        timestamp: Date.now()
      });
      return rate;
    } else {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }
  } catch (error) {
    console.error('Exchange rate error:', error);
    return 1; // Return 1 if conversion fails (no conversion)
  }
}
